// ── VP Store configuration ────────────────────────────────────────────────────
// Single source of truth for all VP store data and copy.

export interface VPPackage {
    id: string;
    vp: number;
    label: string;
    sublabel?: string;
    price: number;
    badge?: string;
    badgeColor?: "red" | "amber" | "purple";
    highlight?: boolean;
    icon: string;
}

export const VP_PACKAGES: VPPackage[] = [
    {
        id: "bp-1000",
        vp: 1000,
        label: "Battle Pass",
        sublabel: "1000 VP Value",
        price: 750,
        badge: "SPECIAL OFFER",
        badgeColor: "amber",
        icon: "🎫",
    },
    {
        id: "vp-475",
        vp: 475,
        label: "Valorant Points",
        price: 350,
        icon: "💠",
    },
    {
        id: "vp-1000",
        vp: 1000,
        label: "Valorant Points",
        price: 750,
        icon: "💠",
    },
    {
        id: "vp-2050",
        vp: 2050,
        label: "Valorant Points",
        price: 1400,
        badge: "MOST POPULAR",
        badgeColor: "red",
        highlight: true,
        icon: "💎",
    },
    {
        id: "vp-3650",
        vp: 3650,
        label: "Valorant Points",
        price: 2550,
        icon: "💎",
    },
    {
        id: "vp-5350",
        vp: 5350,
        label: "Valorant Points",
        price: 3500,
        icon: "👑",
    },
    {
        id: "vp-10700",
        vp: 10700,
        label: "Valorant Points",
        price: 6900,
        badge: "BEST VALUE",
        badgeColor: "purple",
        icon: "👑",
    },
];

export const STORE_CONFIG = {
    title: "Valorant Points Store",
    subtitle: "Get VP instantly · Philippines ID Only · UPI / Card Accepted",
    whatsappNumber: "918511037477",
    discordUrl: "https://dsc.gg/teamfury",
    phone: "+91 8511037477",
    liveCount: 1005,
    trustBadges: [
        { icon: "⚡", label: "Instant Delivery" },
        { icon: "🔒", label: "Secure Payment" },
        { icon: "🇵🇭", label: "Philippines ID Only" },
        { icon: "💳", label: "UPI / Card" },
    ],
    paymentMethods: ["UPI", "CARD", "BANK TRANSFER "],
    steps: [
        {
            number: "01",
            title: "Enter Riot ID",
            desc: "Your in-game Riot ID (e.g. PlayerName#TAG)",
        },
        {
            number: "02",
            title: "Pick VP Package",
            desc: "Select one or more packages to add to cart",
        },
        {
            number: "03",
            title: "Checkout via WhatsApp",
            desc: "We confirm and deliver within minutes",
        },
    ],
} as const;

export function buildWhatsAppMessage(
    riotId: string,
    cart: Array<{ pkg: VPPackage; qty: number }>,
    totalVP: number,
    totalPrice: number
): string {
    let msg = `Hi TEAM FURY! I want to purchase Valorant Points.\n\n`;
    msg += `🎮 Riot ID: ${riotId.trim()}\n\n`;
    msg += `📦 Order:\n`;
    cart.forEach((item) => {
        msg += `  • ${item.pkg.vp.toLocaleString()} ${item.pkg.label} × ${item.qty} = ₹${(item.pkg.price * item.qty).toLocaleString("en-IN")}\n`;
    });
    msg += `\n💰 Total VP: ${totalVP.toLocaleString()}\n`;
    msg += `💳 Total: ₹${totalPrice.toLocaleString("en-IN")}\n\n`;
    msg += `Please confirm and send payment details. Thank you!`;
    return encodeURIComponent(msg);
}
