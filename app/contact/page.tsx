import type { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TEAM FURY via WhatsApp, Discord, or Instagram. We're available 24/7 to help you find the perfect Valorant account.",
  alternates: {
    canonical: "https://www.teamfury.store/contact",
  },
  openGraph: {
    title: "Contact TEAM FURY",
    description:
      "Reach us via WhatsApp, Discord, or Instagram. 24/7 support for Valorant account purchases.",
    url: "https://www.teamfury.store/contact",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "Contact TEAM FURY",
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
