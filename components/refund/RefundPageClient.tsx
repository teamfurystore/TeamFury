"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, Phone, ExternalLink } from "lucide-react";

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
    variant = "default",
}: {
    number: string;
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    delay?: number;
    variant?: "default" | "success" | "danger";
}) {
    const border = {
        default: "border-red-500/20 hover:border-red-500/50",
        success: "border-emerald-500/25 hover:border-emerald-500/55",
        danger: "border-red-500/30 hover:border-red-500/60",
    }[variant];

    const accent = {
        default: "bg-red-500",
        success: "bg-emerald-500",
        danger: "bg-red-500",
    }[variant];

    const label = {
        default: "text-red-500",
        success: "text-emerald-400",
        danger: "text-red-400",
    }[variant];

    return (
        <FadeIn delay={delay}>
            <div className={`relative pl-5 border-l transition-colors duration-300 ${border}`}>
                <span className={`absolute -left-px top-0 w-px h-6 ${accent}`} />
                <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon size={13} className={label} />}
                    <p className={`text-[10px] font-bold tracking-[0.25em] uppercase ${label}`}>{number}</p>
                </div>
                <h2 className="text-lg font-extrabold text-white mb-3">{title}</h2>
                <div className="text-white/55 text-sm leading-relaxed space-y-2">
                    {children}
                </div>
            </div>
        </FadeIn>
    );
}

function List({
    items,
    variant = "default",
}: {
    items: string[];
    variant?: "default" | "check" | "cross";
}) {
    const dot =
        variant === "check" ? "text-emerald-400" :
            variant === "cross" ? "text-red-400" :
                "text-red-500";

    const Icon =
        variant === "check" ? CheckCircle :
            variant === "cross" ? XCircle :
                null;

    return (
        <ul className="space-y-2 mt-1">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                    {Icon ? (
                        <Icon size={13} className={`${dot} shrink-0 mt-0.5`} />
                    ) : (
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    )}
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

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

export default function RefundPageClient() {
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
                        <RefreshCw size={24} className="text-red-400" />
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
                        Refund <span className="text-red-500">Policy</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.22 }}
                        className="text-white/40 text-sm max-w-md mx-auto"
                    >
                        Due to the nature of digital goods, all sales are generally final. Please read our policy carefully.
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

                <Section number="01" title="Overview" icon={RefreshCw}>
                    <p>
                        At <span className="text-white font-semibold">TeamFury Store (teamfury.store)</span>, we deal in digital products and services, including gaming services such as Valorant Points (VP) and game accounts.
                    </p>
                    <InfoBox variant="amber">
                        Due to the nature of digital goods, all sales are generally <span className="text-white font-semibold">final and non-refundable</span>, unless stated otherwise below.
                    </InfoBox>
                </Section>

                <Section number="02" title="Eligibility for Refund" icon={CheckCircle} variant="success">
                    <p>Refunds will <span className="text-emerald-400 font-semibold">ONLY</span> be provided in the following cases:</p>
                    <List variant="check" items={[
                        "Account is revoked or locked (not caused by buyer fault)",
                        "Order is not delivered within the promised timeframe",
                        "Duplicate payment made by the user",
                        "Failed transaction where money is deducted but order not processed",
                    ]} />
                </Section>

                <Section number="03" title="Non-Refundable Situations" icon={XCircle} variant="danger">
                    <p>Refunds will <span className="text-red-400 font-semibold">NOT</span> be provided if:</p>
                    <List variant="cross" items={[
                        "Product or service has already been delivered successfully",
                        "Account issues caused by sharing login details",
                        "Account issues caused by misuse or suspicious activity",
                        "Buyer changes mind after purchase",
                        "Incorrect details provided by the buyer",
                        "Delays caused due to payment verification issues",
                    ]} />
                </Section>

                <Section number="04" title="Refund Process" icon={Clock}>
                    <List items={[
                        "Refund requests must be raised within 24 hours of the issue",
                        "Our team will verify the case before approval",
                        "Approved refunds are processed within 3–7 business days",
                        "Refunds will be credited to the original payment method",
                    ]} />
                    <InfoBox variant="red">
                        Requests raised after 24 hours may not be eligible for review.
                    </InfoBox>
                </Section>

                <Section number="05" title="Replacement Policy" icon={RefreshCw} variant="success">
                    <p>In eligible cases, we may offer a <span className="text-emerald-400 font-semibold">replacement instead of a refund</span>, especially for account-related issues.</p>
                    <InfoBox variant="emerald">
                        Final decision will be made by the <span className="text-white font-semibold">TeamFury Store support team</span>.
                    </InfoBox>
                </Section>

                {/* Contact card */}
                <FadeIn delay={0.05}>
                    <div className="relative rounded-2xl border border-red-500/20 bg-red-950/10 p-6 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-500 mb-1">06</p>
                        <h2 className="text-lg font-extrabold text-white mb-4">Contact for Refunds</h2>
                        <p className="text-white/55 text-sm mb-4">
                            Raise a refund request or get support:
                        </p>
                        <div className="flex flex-col gap-3">
                            <p className="text-white font-semibold">TeamFury Store</p>
                            <a
                                href="mailto:teamfury.store@gmail.com"
                                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors group"
                            >
                                <Mail size={14} className="text-red-500 shrink-0" />
                                teamfury.store@gmail.com
                                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a
                                href="https://wa.me/918511037477"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-red-400 transition-colors group"
                            >
                                <Phone size={14} className="text-red-500 shrink-0" />
                                +91 8511037477 (WhatsApp / Support)
                                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    );
}
