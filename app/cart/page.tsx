import type { Metadata } from "next";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | TEAM FURY",
  description: "Review your selected Valorant accounts and proceed to checkout.",
};

export default function CartPage() {
  return <CartClient />;
}