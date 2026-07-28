import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { TransitionProvider } from "@/contexts/TransitionContext";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import PageTransition from "@/components/ui/PageTransition";
import CursorGlow from "@/components/ui/CursorGlow";
import TabTitleManager from "@/components/ui/TabTitleManager";
import ReduxProvider from "@/store/ReduxProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TEAM FURY | Premium Valorant Accounts",
    template: "%s | TEAM FURY",
  },
  description:
    "Buy premium Valorant accounts with exclusive skins, rare knives, and top-ranked profiles. Instant delivery, verified accounts, best prices — trusted by 15,000+ buyers.",
  metadataBase: new URL("https://www.teamfury.store"),
  keywords: [
    "Valorant accounts",
    "buy Valorant account",
    "premium Valorant accounts",
    "Valorant skins account",
    "cheap Valorant account India",
    "Valorant account marketplace",
    "TEAM FURY",
    "buy Valorant India",
    "Valorant rare knives",
    "Valorant ranked account",
  ],
  alternates: {
    canonical: "https://www.teamfury.store",
  },
  openGraph: {
    title: "TEAM FURY | Premium Valorant Accounts",
    description:
      "Buy premium Valorant accounts with exclusive skins, rare knives, and top-ranked profiles. Instant delivery, trusted by 15,000+ buyers.",
    url: "https://www.teamfury.store/",
    siteName: "TEAM FURY",
    images: [
      {
        url: "/tf_logo_hd.jpg",
        width: 1200,
        height: 630,
        alt: "TEAM FURY — Premium Valorant Accounts",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEAM FURY | Premium Valorant Accounts",
    description:
      "Buy premium Valorant accounts with exclusive skins, rare knives, and top-ranked profiles. Instant delivery, trusted by 15,000+ buyers.",
    images: ["/tf_logo_hd.jpg"],
    site: "@teamfury_store",
  },
  icons: {
    icon: "/teamFuryIcon.svg",
    shortcut: "/teamFuryIcon.svg",
    apple: "/teamFuryIcon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#ff4655",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-white">
        <CartProvider>
          <ReduxProvider>
            {/* TransitionProvider must wrap everything that uses useTransition */}
            <TransitionProvider>
              <ErrorBoundary variant="page">

                {/* Overlay renders on top of everything — fixed position */}
                <PageTransition />

                <CursorGlow />
                <TabTitleManager />
                <Navbar />

                <main className="flex-1">
                  <ErrorBoundary variant="page">
                    {children}
                  </ErrorBoundary>
                </main>

                <Footer />
                <FloatingWhatsApp />

              </ErrorBoundary>
            </TransitionProvider>
          </ReduxProvider>
        </CartProvider>
      </body>
    </html>
  );
}
