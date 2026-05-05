import type { Metadata } from "next";
import RefundPageClient from "@/components/refund/RefundPageClient";

export const metadata: Metadata = {
    title: "Refund Policy | TEAM FURY",
    description:
        "Read the Refund Policy for TeamFury Store — India's trusted Valorant account marketplace.",
};

export default function RefundPage() {
    return <RefundPageClient />;
}
