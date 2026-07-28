import { MetadataRoute } from "next";
import { createServerClient } from "@/utils/supabaseServer";

const BASE_URL = "https://www.teamfury.store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/review`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vp`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // ── Dynamic product pages ──────────────────────────────────────────────────
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const db = createServerClient();
    const { data: products } = await db
      .from("products")
      .select("slug, created_at")
      .eq("is_active", true);

    if (products) {
      productPages = products.map((p) => ({
        url: `${BASE_URL}/shop/${p.slug}`,
        lastModified: new Date(p.created_at ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch {
    // If DB is unavailable during build, skip dynamic pages gracefully
  }

  return [...staticPages, ...productPages];
}
