import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop | TEAM FURY",
  description:
    "Browse premium Valorant accounts — verified, instant delivery, best prices.",
};

export default function ShopPage() {
  return <ShopClient />;
}
