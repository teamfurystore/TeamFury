import type { Metadata } from "next";
import VPStoreClient from "@/components/store/VPStoreClient";

export const metadata: Metadata = {
    title: "Buy Valorant Points (VP) — Instant Delivery",
    description:
        "Buy Valorant Points (VP) instantly via UPI or card. Philippines region supported. Secure, fast, and trusted by thousands — powered by TEAM FURY.",
    alternates: {
        canonical: "https://www.teamfury.store/vp",
    },
    openGraph: {
        title: "Buy Valorant Points (VP) | TEAM FURY",
        description:
            "Buy Valorant Points instantly via UPI or card. Philippines region. Secure and instant delivery by TEAM FURY.",
        url: "https://www.teamfury.store/vp",
        images: [
            {
                url: "/tf_logo_hd.jpg",
                width: 1200,
                height: 630,
                alt: "TEAM FURY VP Store",
            },
        ],
    },
};

export default function StorePage() {
    return <VPStoreClient />;
}
