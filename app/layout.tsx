import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import LiveViewerBadge from "@/components/ui/LiveViewerBadge";
import PageTransition from "@/components/ui/PageTransition";
import CursorGlow from "@/components/ui/CursorGlow";
import TabTitleManager from "@/components/ui/TabTitleManager";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEAM FURY | Premium Valorant Accounts",
  description:
    "Get your dream Valorant account with exclusive skins, rare knives, and premium collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-white">
        <CartProvider>
          <CursorGlow />
          <TabTitleManager />
          <Navbar />
          {/* <LiveViewerBadge base={14} /> */}
          <PageTransition>
            <main className="flex-1">{children}</main>
          </PageTransition>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
