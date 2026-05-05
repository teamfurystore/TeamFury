"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SITE_CONFIG, NAV_LINKS } from "@/utils/config";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: SITE_CONFIG.socials.instagram,
    hoverColor: "hover:text-pink-500 hover:scale-105",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: SITE_CONFIG.socials.whatsapp,
    hoverColor: "hover:text-[#25D366] hover:scale-105",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: SITE_CONFIG.socials.discord,
    hoverColor: "hover:text-[#5865F2] hover:scale-105",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

const QUICK_LINKS = NAV_LINKS.slice(0, 5);

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
];

function AnimatedLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Link
      href={href}
      {...props}
      className="group relative text-white/40 hover:text-white text-xs transition-colors duration-200 w-fit"
    >
      {children}
      <span className="absolute -bottom-px left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <footer ref={ref} className="relative border-t border-white/8 bg-[#0a0a0a] overflow-hidden">

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.025)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-32 bg-red-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0, ease }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div>
              <p className="text-red-500 font-extrabold tracking-[0.25em] text-base">
                {SITE_CONFIG.name}
              </p>
              <p className="text-white/25 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                {SITE_CONFIG.tagline}
              </p>
            </div>

            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              {SITE_CONFIG.description}
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2 mt-1">
              {SITE_CONFIG.stats.map((s) => (
                <span
                  key={s.label}
                  className="text-[10px] text-white/40 border border-white/8 px-2.5 py-1 rounded-full"
                >
                  {s.label}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border border-white/8 text-white/35 
                  ${s.hoverColor}
                  hover:border-red-500/40 hover:bg-red-500/8 
                  transition-all duration-200`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase">
              Quick Links
            </p>
            <div className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((l) => (
                <AnimatedLink key={l.href} href={l.href}>
                  {l.label}
                </AnimatedLink>
              ))}
            </div>
          </motion.div>

          {/* Legal + Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease }}
            className="flex flex-col gap-4"
          >
            <p className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase">
              Legal
            </p>
            <div className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((l) => (
                <AnimatedLink key={l.href} href={l.href}>
                  {l.label}
                </AnimatedLink>
              ))}
            </div>

            <p className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mt-2">
              Support
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:teamfury.store@gmail.com"
                className="text-white/40 hover:text-red-400 text-xs transition-colors duration-200"
              >
                teamfury.store@gmail.com
              </a>
              <a
                href="tel:+918511037477"
                className="text-white/40 hover:text-red-400 text-xs transition-colors duration-200"
              >
                +91 8511037477
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          style={{ originX: 0 }}
          className="h-px bg-linear-to-r from-red-500/30 via-white/8 to-transparent mb-6"
        />

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} TEAM FURY. All rights reserved.
          </p>
          <p className="text-white/15 text-[10px] text-center sm:text-right leading-relaxed">
            Not affiliated with Riot Games or any official game publishers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
