import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop — Premium Valorant Accounts",
  description:
    "Browse premium Valorant accounts — exclusive skins, rare knives, ranked profiles. Verified, instant delivery, best prices. 15,000+ happy buyers.",
  alternates: {
    canonical: "https://www.teamfury.store/shop",
  },
  keywords: [
    "buy Valorant account",
    "Valorant accounts for sale",
    "cheap Valorant account",
    "Valorant skins account India",
    "Valorant knife account",
    "ranked Valorant account",
  ],
  openGraph: {
    title: "Shop — Premium Valorant Accounts | TEAM FURY",
    description:
      "Browse premium Valorant accounts — exclusive skins, rare knives, ranked profiles. Verified, instant delivery, best prices.",
    url: "https://www.teamfury.store/shop",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "TEAM FURY Shop — Premium Valorant Accounts",
      },
    ],
    type: "website",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
