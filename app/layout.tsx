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
  icons: {
    icon: '/teamFuryIcon.svg',
  },
  title: "TEAM FURY | Premium Valorant Accounts",
  description:
    "Get your dream Valorant account with exclusive skins, rare knives, and premium collections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
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
