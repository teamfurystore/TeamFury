import type { Metadata } from "next";
import RefundPageClient from "@/components/refund/RefundPageClient";

export const metadata: Metadata = {
    title: "Refund Policy",
    description:
        "Read TEAM FURY's Refund Policy — our commitment to fair refunds for Valorant account purchases.",
    alternates: {
        canonical: "https://www.teamfury.store/refund",
    },
    robots: { index: false, follow: true },
};

export default function RefundPage() {
    return <RefundPageClient />;
}
