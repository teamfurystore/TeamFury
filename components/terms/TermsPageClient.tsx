"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FileText, Mail, Phone, ExternalLink, ShieldCheck, AlertTriangle, RefreshCw, Users, Ban, Scale } from "lucide-react";

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
  icon: Icon,
  children,
  delay = 0,
  accent = false,
}: {
  number: string;
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <FadeIn delay={delay}>
      <div className={`relative pl-5 border-l transition-colors duration-300 ${accent ? "border-amber-500/40 hover:border-amber-500/70" : "border-red-500/20 hover:border-red-500/50"
        }`}>
        <span className={`absolute -left-px top-0 w-px h-6 ${accent ? "bg-amber-500" : "bg-red-500"}`} />
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={13} className={accent ? "text-amber-400" : "text-red-400"} />}
          <p className={`text-[10px] font-bold tracking-[0.25em] uppercase ${accent ? "text-amber-500" : "text-red-500"}`}>
            {number}
          </p>
        </div>
        <h2 className="text-lg font-extrabold text-white mb-3">{title}</h2>
        <div className="text-white/55 text-sm leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </FadeIn>
  );
}

function SubTitle({ text }: { text: string }) {
  return <p className="text-white/80 font-semibold text-sm mt-4 mb-1.5">{text}</p>;
}

function List({ items, variant = "default" }: { items: string[]; variant?: "default" | "warning" | "check" }) {
  const dot =
    variant === "warning" ? "bg-amber-500" :
      variant === "check" ? "bg-emerald-500" :
        "bg-red-500";
  return (
    <ul className="space-y-1.5 mt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dot}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Highlight box ─────────────────────────────────────────────────────────────

function InfoBox({
  children,
  variant = "red",
}: {
  children: React.ReactNode;
  variant?: "red" | "amber" | "emerald";
}) {
  const styles = {
    red: "border-red-500/20 bg-red-950/15",
    amber: "border-amber-500/20 bg-amber-950/15",
    emerald: "border-emerald-500/20 bg-emerald-950/15",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm mt-3 ${styles[variant]}`}>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TermsPageClient() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6"
          >
            <FileText size={24} className="text-red-400" />
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
            Terms of <span className="text-red-500">Service</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-white/40 text-sm max-w-md mx-auto"
          >
            By using our services, you agree to these terms. Please read them carefully.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/25 text-xs mt-3"
          >
            Last Updated: May 2026
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <Section number="01" title="Introduction" icon={FileText}>
          <p>
            Welcome to <span className="text-white font-semibold">TeamFury Store (teamfury.store)</span> ("we", "our", "us").
          </p>
          <p>
            By accessing or using our website and services, you agree to comply with these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </Section>

        <Section number="02" title="Nature of Services" icon={ShieldCheck}>
          <p>We provide digital products and services, including:</p>
          <List items={[
            "Gaming-related services such as Valorant Points (VP)",
            "Premium gaming accounts",
          ]} variant="check" />
          <InfoBox variant="red">
            All products are <span className="text-white font-semibold">intangible digital goods</span>, delivered after payment verification.
          </InfoBox>
        </Section>

        <Section number="03" title="Account Warranty Policy" icon={ShieldCheck} accent>
          <p>All accounts sold are covered under:</p>
          <List items={[
            "Revoke / Lock = Refund or Replacement Warranty",
            "Valid until buyer fault or misuse is detected",
          ]} variant="check" />
          <SubTitle text="Warranty becomes void if:" />
          <List items={[
            "Account details are shared with third parties",
            "Account is misused, resold improperly, or tampered with",
            "Any suspicious activity is detected",
          ]} variant="warning" />
          <InfoBox variant="amber">
            We are only liable for the <span className="text-white font-semibold">amount paid to us</span>, not for any additional purchases made on the account (e.g., extra VP purchases).
          </InfoBox>
        </Section>

        <Section number="04" title="No Responsibility Clause" icon={AlertTriangle} accent>
          <p>We are <span className="text-white font-semibold">not responsible</span> for:</p>
          <List items={[
            "Accounts getting hacked or scammed outside our control",
            "Deals made outside our platform or without admin involvement",
            "User negligence (sharing credentials, unsafe practices, etc.)",
          ]} variant="warning" />
        </Section>

        <Section number="05" title="Refund Policy" icon={RefreshCw}>
          <p><span className="text-white font-semibold">No refunds</span> once:</p>
          <List items={[
            "Product is delivered",
            "Account credentials are shared",
          ]} variant="warning" />
          <SubTitle text="Refunds or replacements are applicable in:" />
          <List items={[
            "Verified revoke / lock cases",
            "Platform-side issues",
          ]} variant="check" />
          <InfoBox variant="red">
            Special cases may be reviewed. Final decision remains with <span className="text-white font-semibold">TeamFury Store</span>.
          </InfoBox>
        </Section>

        <Section number="06" title="EMI Policy" icon={Scale}>
          <p>EMI purchases are allowed under specific conditions:</p>
          <List items={[
            "Cancellation = 33% refund of total paid amount",
            "EMI cannot be transferred to another account",
            "Account access must not be shared during EMI period",
            "Buyer is responsible for any damage during EMI period",
          ]} />
        </Section>

        <Section number="07" title="Resale & Trading" icon={RefreshCw}>
          <p>Buyers may request account resale or trade-in options. However:</p>
          <List items={[
            "Unauthorized resale or renting services may void warranty",
          ]} variant="warning" />
        </Section>

        <Section number="08" title="Seller Rules" icon={Users} accent>
          <p>For any sellers operating through our platform:</p>
          <SubTitle text="Requirements:" />
          <List items={[
            "Accounts must be legitimately sourced (not stolen or hacked)",
            "Sellers must provide refund or replacement in case of revoke issues",
          ]} variant="check" />
          <SubTitle text="Compensation timelines:" />
          <List items={[
            "Below ₹10,000 → within 7 days",
            "Above ₹10,000 → within 15–20 days",
          ]} />
          <SubTitle text="Strictly prohibited:" />
          <List items={[
            "Misleading buyers",
            "Increasing prices unfairly",
            "Promoting external businesses",
            "Recovering accounts intentionally",
          ]} variant="warning" />
          <InfoBox variant="amber">
            Violation may lead to <span className="text-white font-semibold">permanent ban or legal action</span>.
          </InfoBox>
        </Section>

        <Section number="09" title="User Conduct Rules" icon={Users}>
          <p>Users must:</p>
          <List items={[
            "Respect admins and sellers",
            "Avoid spam or harassment",
            "Not use abusive or offensive language",
            "Not share illegal, NSFW, or harmful content",
            "Not promote external services without permission",
          ]} variant="check" />
        </Section>

        <Section number="10" title="Middleman Policy" icon={ShieldCheck} accent>
          <p><span className="text-white font-semibold">Middleman (Admin) is mandatory</span> for all deals.</p>
          <InfoBox variant="amber">
            Deals done without a middleman are at your own risk and will not be supported or protected by TeamFury Store.
          </InfoBox>
        </Section>

        <Section number="11" title="Prohibited Activities" icon={Ban} accent>
          <p>You agree NOT to:</p>
          <List items={[
            "Engage in scams or fraud",
            "Sell accounts you do not own (no dropshipping)",
            "Misrepresent product details",
            "Attempt to exploit the platform",
          ]} variant="warning" />
        </Section>

        <Section number="12" title="Digital Product Disclaimer" icon={FileText}>
          <List items={[
            "All products are non-refundable digital goods",
            "Delivery is dependent on payment verification and system processing",
            "We are not affiliated with Riot Games or any official game publishers",
          ]} />
        </Section>

        <Section number="13" title="Limitation of Liability" icon={Scale}>
          <p>Our liability is limited strictly to the <span className="text-white font-semibold">purchase amount paid to us</span>.</p>
          <p>We are not liable for:</p>
          <List items={[
            "Indirect losses",
            "Account misuse",
            "Third-party issues",
          ]} variant="warning" />
        </Section>

        <Section number="14" title="Dispute Resolution" icon={Scale}>
          <List items={[
            "All disputes will be handled internally first",
            "Final decision will be made by TeamFury Store",
            "In case of unresolved issues, jurisdiction will lie in Surat, Gujarat, India",
          ]} />
        </Section>

        <Section number="15" title="Changes to Terms" icon={RefreshCw}>
          <p>We may update these Terms at any time. Continued use of our services means you accept the updated Terms.</p>
        </Section>

        {/* Contact card */}
        <FadeIn delay={0.05}>
          <div className="relative rounded-2xl border border-red-500/20 bg-red-950/10 p-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-500 mb-1">16</p>
            <h2 className="text-lg font-extrabold text-white mb-4">Contact Us</h2>
            <p className="text-white/55 text-sm mb-4">For support or disputes:</p>
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
