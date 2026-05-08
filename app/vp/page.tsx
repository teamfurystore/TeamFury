import type { Metadata } from "next";
import VPStoreClient from "@/components/store/VPStoreClient";

export const metadata: Metadata = {
    title: "VP Store | TEAM FURY",
    description:
        "Buy Valorant Points instantly — Philippines ID only. UPI & Card accepted. Instant delivery by TEAM FURY.",
};

export default function StorePage() {
    return <VPStoreClient />;
}
