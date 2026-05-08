"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ShoppingCart, Check, ChevronRight } from "lucide-react";
import { VP_PACKAGES, STORE_CONFIG, type VPPackage } from "@/utils/vpStore";
import { useCart } from "@/contexts/CartContext";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
}

const BADGE_STYLES: Record<string, string> = {
    red: "bg-red-600 text-white",
    amber: "bg-amber-500 text-black",
    purple: "bg-purple-600 text-white",
};

function PackageCard({ pkg }: { pkg: VPPackage }) {
    const { addVPItem, removeVPItem, getVPQty } = useCart();
    const qty = getVPQty(pkg.id);
    const inCart = qty > 0;
    const borderClass = pkg.highlight
        ? "border-red-500/60 bg-gradient-to-b from-red-500/10 to-red-500/4 ring-1 ring-red-500/25 shadow-lg shadow-red-900/20"
        : inCart
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5";

    return (
        <div className={`relative h-full flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${borderClass}`}>
            {pkg.badge && (
                <div className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 text-center ${BADGE_STYLES[pkg.badgeColor ?? "red"]}`}>
                    {pkg.badge}
                </div>
            )}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center justify-between">
                    <span className="text-3xl">{pkg.icon}</span>
                    {inCart && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <Check size={9} /> In cart
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-2xl font-extrabold text-white leading-none">
                        {pkg.vp.toLocaleString()}
                        <span className="text-sm font-medium text-white/40 ml-1.5">VP</span>
                    </p>
                    {pkg.sublabel && <p className="text-xs text-white/35 mt-0.5">{pkg.sublabel}</p>}
                    <p className="text-xs text-white/40 mt-0.5">{pkg.label}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/8">
                    <span className="text-xl font-extrabold text-white">₹{pkg.price.toLocaleString("en-IN")}</span>
                    {inCart ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => removeVPItem(pkg.id)} className="w-7 h-7 rounded-full border border-white/15 hover:border-red-500/40 hover:bg-red-500/10 flex items-center justify-center text-white/50 hover:text-red-400 transition-all">
                                <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold text-white w-5 text-center">{qty}</span>
                            <button onClick={() => addVPItem(pkg)} className="w-7 h-7 rounded-full border border-white/15 hover:border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-center text-white/50 hover:text-emerald-400 transition-all">
                                <Plus size={12} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => addVPItem(pkg)} className="flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-3.5 py-1.5 rounded-full transition-all active:scale-95">
                            <ShoppingCart size={11} /> Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VPStoreClient() {
    const { vpTotalItems, vpTotalPrice, vpTotalVP } = useCart();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden border-b border-white/8">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-56 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
                        className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-3">TEAM FURY</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                        Valorant Points <span className="text-red-500">Store</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
                        className="text-white/40 text-sm mb-8 max-w-md mx-auto">{STORE_CONFIG.subtitle}</motion.p>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex flex-wrap justify-center gap-2">
                        {STORE_CONFIG.trustBadges.map((b) => (
                            <span key={b.label} className="flex items-center gap-1.5 text-xs text-white/50 border border-white/10 bg-white/3 px-3.5 py-1.5 rounded-full">
                                <span>{b.icon}</span>{b.label}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── How it works ── */}
            <FadeIn className="max-w-5xl mx-auto px-6 pt-12 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STORE_CONFIG.steps.map((step, i) => (
                        <div key={step.number} className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-extrabold flex items-center justify-center shrink-0">{step.number}</span>
                            <div>
                                <p className="text-sm font-bold text-white">{step.title}</p>
                                <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{step.desc}</p>
                            </div>
                            {i < 2 && <ChevronRight size={14} className="text-white/15 shrink-0 mt-2 hidden sm:block" />}
                        </div>
                    ))}
                </div>
            </FadeIn>

            {/* ── Packages ── */}
            <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
                <FadeIn delay={0.05}>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-base font-bold text-white">Select VP Package</p>
                                <p className="text-xs text-white/35 mt-0.5">Choose one or more packages — they go to your cart</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                🔥 {STORE_CONFIG.liveCount.toLocaleString()} bought recently
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {VP_PACKAGES.map((pkg, i) => (
                                <motion.div key={pkg.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.04 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                                    <PackageCard pkg={pkg} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <p className="text-xs text-white/30 shrink-0">Accepted:</p>
                            <div className="flex flex-wrap gap-2">
                                {STORE_CONFIG.paymentMethods.map((m) => (
                                    <span key={m} className="text-[10px] font-bold text-white/40 border border-white/8 px-2.5 py-1 rounded-full">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>
                {/* Contact */}
                <FadeIn delay={0.12}>
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Need help or bulk order?</p>
                            <p className="text-xs text-white/40">Contact us directly on WhatsApp or Discord.</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <a href={`tel:${STORE_CONFIG.phone}`}
                                className="flex items-center gap-1.5 text-xs font-semibold border border-white/10 hover:border-white/25 text-white/50 hover:text-white px-4 py-2 rounded-full transition-all">
                                📞 Call
                            </a>
                            <a href={STORE_CONFIG.discordUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold border border-[#5865F2]/25 hover:border-[#5865F2]/50 text-[#7289da] px-4 py-2 rounded-full transition-all">
                                💬 Discord
                            </a>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
