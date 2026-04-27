import { SITE_CONFIG } from "@/utils/config";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center">
      <p className="text-red-500 font-extrabold tracking-widest text-sm mb-4">
        {SITE_CONFIG.name}
      </p>
      <div className="flex justify-center gap-6 mb-6">
        <a
          href={SITE_CONFIG.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          Instagram
        </a>
        <a
          href={SITE_CONFIG.socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          WhatsApp
        </a>
        <a
          href={SITE_CONFIG.socials.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          Discord
        </a>
      </div>
      <div className="flex justify-center gap-6 text-white/30 text-xs">
        <a href="/privacy" className="hover:text-white/60 transition-colors">
          Privacy Notice
        </a>
        <a href="/terms" className="hover:text-white/60 transition-colors">
          Terms of Service
        </a>
        <a href="/cookies" className="hover:text-white/60 transition-colors">
          Cookie Preferences
        </a>
      </div>
      <p className="text-white/20 text-xs mt-4">
        © {new Date().getFullYear()} TEAM FURY. All rights reserved.
      </p>
    </footer>
  );
}
