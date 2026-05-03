import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase the request body size limit for API routes that handle file uploads.
  // Default is 4MB — product thumbnails before sharp processing can be larger.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
