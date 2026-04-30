import type { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | TEAM FURY",
  description: "Get in touch with TEAM FURY via WhatsApp, Discord, or Instagram.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
