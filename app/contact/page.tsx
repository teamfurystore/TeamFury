import type { Metadata } from "next";
import { CONTACT_HERO } from "@/utils/contact";
import ContactLeft from "@/components/contact/ContactLeft";
import ContactForm from "@/components/contact/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact Us | TEAM FURY",
  description:
    "Get in touch with TEAM FURY via WhatsApp, Discord, or Instagram.",
};

export default function ContactPage() {
  return (
    <div className="font-sans">
      <section className="text-center pt-20 pb-12 px-6 max-w-2xl mx-auto">
        <div className="text-6xl mb-4">{CONTACT_HERO.emoji}</div>
        <h1 className="text-4xl font-extrabold mb-3">{CONTACT_HERO.heading}</h1>
        <p className="text-white/50 text-base">{CONTACT_HERO.subheading}</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <ContactLeft />
        <ContactForm />
      </section>
      <ContactFAQ />
    </div>
  );
}
