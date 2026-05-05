"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Shield, Mail, Phone, ExternalLink } from "lucide-react";

// ── Animation wrapper ─────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  number,
  title,
  children,
  delay = 0,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="relative pl-5 border-l border-red-500/20 hover:border-red-500/50 transition-colors duration-300">
        <span className="absolute -left-px top-0 w-px h-6 bg-red-500" />
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-500 mb-1">
          {number}
        </p>
        <h2 className="text-lg font-extrabold text-white mb-3">{title}</h2>
        <div className="text-white/55 text-sm leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </FadeIn>
  );
}

function SubTitle({ text }: { text: string }) {
  return (
    <p className="text-white/80 font-semibold text-sm mt-4 mb-1.5">{text}</p>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrivacyPageClient() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/8">
        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6"
          >
            <Shield size={24} className="text-red-400" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3"
          >
            TeamFury Store
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Privacy <span className="text-red-500">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-white/40 text-sm"
          >
            Last Updated: May 2026
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <Section number="01" title="Introduction" delay={0}>
          <p>
            Welcome to <span className="text-white font-semibold">TeamFury Store (teamfury.store)</span>. We are
            committed to protecting your privacy and ensuring that your personal
            data is handled securely and responsibly.
          </p>
        </Section>

        <Section number="02" title="Information We Collect" delay={0.05}>
          <SubTitle text="Personal Information" />
          <List items={["Name", "Email address", "Phone number", "Payment details (UPI, transaction references)", "Billing details"]} />
          <SubTitle text="Transaction Information" />
          <List items={["Orders placed", "Payment screenshots for verification", "Order history"]} />
          <SubTitle text="Technical Data" />
          <List items={["IP address", "Device information", "Browser type", "Usage data"]} />
          <SubTitle text="User Content" />
          <List items={["Support messages", "Feedback and reviews"]} />
        </Section>

        <Section number="03" title="How We Use Your Data" delay={0.05}>
          <List items={[
            "Processing orders and payments",
            "Verifying transactions",
            "Customer support",
            "Fraud prevention",
            "Improving services",
            "Order-related updates",
          ]} />
        </Section>

        <Section number="04" title="Payment & Security" delay={0.05}>
          <List items={[
            "Payments via UPI or third-party providers",
            "No storage of PINs or OTPs",
            "Screenshots used only for verification",
          ]} />
        </Section>

        <Section number="05" title="Data Sharing" delay={0.05}>
          <p>We do not sell your data. Sharing is limited to:</p>
          <List items={[
            "Internal admin and payment verification",
            "Legal authorities if required by law",
            "Service providers (hosting, analytics)",
          ]} />
        </Section>

        <Section number="06" title="Data Protection" delay={0.05}>
          <List items={["Secure storage", "Restricted access", "Monitoring for suspicious activity"]} />
          <p className="mt-3 text-white/35 text-xs italic">Note: No system is 100% secure.</p>
        </Section>

        <Section number="07" title="Cookies & Tracking" delay={0.05}>
          <p>We use cookies to:</p>
          <List items={["Improve performance", "Analyze usage", "Enhance your experience"]} />
        </Section>

        <Section number="08" title="Your Rights" delay={0.05}>
          <List items={["Access your data", "Correct your data", "Request deletion", "Withdraw consent"]} />
        </Section>

        <Section number="09" title="Data Retention" delay={0.05}>
          <p>Data is retained only as necessary for orders, compliance, and fraud prevention.</p>
        </Section>

        <Section number="10" title="Children's Privacy" delay={0.05}>
          <p>Our services are not intended for users under 18 years of age.</p>
        </Section>

        <Section number="11" title="Legal Compliance" delay={0.05}>
          <p>We comply with applicable Indian laws including:</p>
          <List items={["IT Act, 2000", "DPDP Act, 2023", "Consumer Protection Rules"]} />
        </Section>

        <Section number="12" title="Changes to This Policy" delay={0.05}>
          <p>We may update this policy at any time. Continued use of our services constitutes acceptance of the updated policy.</p>
        </Section>

        <Section number="13" title="Digital Products Disclaimer" delay={0.05}>
          <List items={[
            "All products are intangible digital goods",
            "Delivery depends on payment verification and system processing",
            "We are not affiliated with Riot Games or any official game publishers",
          ]} />
        </Section>

        {/* Contact card */}
        <FadeIn delay={0.05}>
          <div className="relative rounded-2xl border border-red-500/20 bg-red-950/10 p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-red-500 mb-1">14</p>
            <h2 className="text-lg font-extrabold text-white mb-4">Contact Us</h2>
            <p className="text-white/55 text-sm mb-4">For privacy-related queries or data requests:</p>
            <div className="flex flex-col gap-3">
              <p className="text-white font-semibold">TeamFury Store</p>
              <a href="mailto:teamfury.store@gmail.com"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors group">
                <Mail size={14} className="text-red-500 shrink-0" />
                teamfury.store@gmail.com
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                // href="tel:+918511037477"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors group">
                <Phone size={14} className="text-red-500 shrink-0" />
                +91 8511037477
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
