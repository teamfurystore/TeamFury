import { FURY_VALORANT } from "@/utils/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/tmp/",
          "/private/",
          "/search",
        ],
      },

      {
        userAgent: "Googlebot",
        allow: "/",
      },

      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },

      {
        userAgent: "Bingbot",
        allow: "/",
      },

      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },

      {
        userAgent: "GPTBot",
        allow: "/",
      },

      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },

      {
        userAgent: "ClaudeBot",
        allow: "/",
      },

      {
        userAgent: "PerplexityBot",
        allow: "/",
      },

      {
        userAgent: "CCBot",
        disallow: "/",
      },

      {
        userAgent: "ByteDanceSpider",
        disallow: "/",
      },
    ],

    sitemap: FURY_VALORANT,
  };
}