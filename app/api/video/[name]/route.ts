import { NextRequest, NextResponse } from "next/server";
import { readFileSync, statSync } from "fs";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  // Only allow known video files
  const allowed = ["ValoClip.mp4", "homepageValorant.mp4"];
  if (!allowed.includes(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = join(process.cwd(), "public", name);

  let stat: ReturnType<typeof statSync>;
  try {
    stat = statSync(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileSize = stat.size;
  const rangeHeader = req.headers.get("range");

  if (rangeHeader) {
    // Parse "bytes=start-end"
    const [, rangeStr] = rangeHeader.split("=");
    const [startStr, endStr] = rangeStr.split("-");
    const start = parseInt(startStr, 10);
    // Serve 1MB chunks max — browser requests more as needed
    const CHUNK = 1 * 1024 * 1024;
    const end = endStr ? Math.min(parseInt(endStr, 10), fileSize - 1) : Math.min(start + CHUNK - 1, fileSize - 1);
    const chunkSize = end - start + 1;

    const buffer = Buffer.alloc(chunkSize);
    const fd = require("fs").openSync(filePath, "r");
    require("fs").readSync(fd, buffer, 0, chunkSize, start);
    require("fs").closeSync(fd);

    return new NextResponse(buffer, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type": "video/mp4",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // No range — return just the first 512KB so the browser can start playing fast
  const INITIAL = 512 * 1024;
  const end = Math.min(INITIAL - 1, fileSize - 1);
  const chunkSize = end + 1;

  const buffer = Buffer.alloc(chunkSize);
  const fd = require("fs").openSync(filePath, "r");
  require("fs").readSync(fd, buffer, 0, chunkSize, 0);
  require("fs").closeSync(fd);

  return new NextResponse(buffer, {
    status: 206,
    headers: {
      "Content-Range": `bytes 0-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(chunkSize),
      "Content-Type": "video/mp4",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
