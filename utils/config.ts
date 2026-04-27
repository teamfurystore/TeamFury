export const FURY_VALORANT =
  process.env.NEXT_PUBLIC_FURY_API_BASE_URL || "http://localhost:3000";

export const SITE_CONFIG = {
  name: "TEAM FURY",
  tagline: "PREMIUM VALORANT ACCOUNTS",
  description:
    "Get your dream Valorant account with exclusive skins, rare knives, and premium collections",
  stats: [
    { label: "1000+ Accounts Available" },
    { label: "Instant Delivery" },
    { label: "24/7 Support" },
  ],
  whatsappUrl:
    "https://wa.me/918511037477?text=Hi%20TEAM%20FURY!%20I%27m%20interested%20in%20purchasing%20a%20Valorant%20account.%20Could%20you%20please%20help%20me%20choose%20the%20right%20one?",
  shopUrl: "/shop",
  socials: {
    instagram: "http://instagram.com/teamfury.store",
    whatsapp: "http://chat.whatsapp.com/H7LvFLMR88IAs2T1Quy6wZ",
    discord: "http://discord.com/invite/Bbsd68NmqT",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Review", href: "/review" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
];

export const PRICING_TIERS = [
  {
    emoji: "🎮",
    tier: "Basic Collection",
    subtitle: "GREAT STARTER ACCOUNTS",
    price: "₹1,099 – ₹4,999",
    features: [
      "5-15 Premium Skins",
      "Battle Pass Items",
      "Verified Email",
      "Full Account Access",
    ],
    badge: null,
    highlight: false,
  },
  {
    emoji: "💎",
    tier: "Premium Collection",
    subtitle: "MOST POPULAR CHOICE",
    price: "₹6,999 – ₹19,999",
    features: [
      "20+ Exclusive Skins",
      "Rare Knife Collection",
      "Multiple Battle Passes",
      "High-Value Items",
    ],
    badge: "MOST POPULAR",
    highlight: true,
  },
  {
    emoji: "👑",
    tier: "Elite Collection",
    subtitle: "ULTIMATE ACCOUNTS",
    price: "₹20,999+",
    features: [
      "50+ Premium Skins",
      "Legendary Knives",
      "Rare Bundles",
      "VIP Account Status",
    ],
    badge: null,
    highlight: false,
  },
];

export const WHY_CHOOSE = [
  {
    icon: "⚡",
    title: "Instant Delivery",
    desc: "Get your account within 5 minutes of payment",
  },
  {
    icon: "🔒",
    title: "100% Secure",
    desc: "All accounts are verified and safe to use",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Competitive pricing with regular discounts",
  },
  {
    icon: "🏆",
    title: "Premium Quality",
    desc: "Hand-picked accounts with valuable items",
  },
];

export const TRUST_BADGES = [
  "SSL Secured",
  "5 Star Rated",
  "Money Back Guarantee",
];
