export type Rank =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export interface Product {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  discountedPrice: number;
  badge: string | null;
  currentRank: Rank;
  peakRank: Rank;
  skins: number;
  knives: number;
  battlePasses: number;
  region: string;
  level: number;
  verified: boolean;
  instantDelivery: boolean;
  description: string;
}

export const RANK_COLORS: Record<Rank, string> = {
  Iron: "text-gray-400",
  Bronze: "text-orange-700",
  Silver: "text-gray-300",
  Gold: "text-yellow-400",
  Platinum: "text-cyan-400",
  Diamond: "text-blue-400",
  Ascendant: "text-green-400",
  Immortal: "text-red-400",
  Radiant: "text-yellow-300",
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "diamond-smurf-25-skins",
    title: "Diamond Smurf — 25 Skins",
    image: "/products/account-1.jpg",
    price: 8999,
    discountedPrice: 6999,
    badge: "HOT DEAL",
    currentRank: "Diamond",
    peakRank: "Immortal",
    skins: 25,
    knives: 2,
    battlePasses: 3,
    region: "India",
    level: 87,
    verified: true,
    instantDelivery: true,
    description:
      "A clean Diamond account with 25 premium skins including rare knife variants. Peaked Immortal last act. Verified email included, full account access.",
  },
  {
    id: "p2",
    slug: "platinum-starter-12-skins",
    title: "Platinum Starter — 12 Skins",
    image: "/products/account-2.jpg",
    price: 3499,
    discountedPrice: 2499,
    badge: null,
    currentRank: "Platinum",
    peakRank: "Diamond",
    skins: 12,
    knives: 1,
    battlePasses: 2,
    region: "India",
    level: 54,
    verified: true,
    instantDelivery: true,
    description:
      "Great starter account with 12 skins and a rare knife. Peaked Diamond. Perfect for players who want a head start without breaking the bank.",
  },
  {
    id: "p3",
    slug: "immortal-beast-40-skins",
    title: "Immortal Beast — 40 Skins",
    image: "/products/account-3.jpg",
    price: 19999,
    discountedPrice: 16999,
    badge: "MOST POPULAR",
    currentRank: "Immortal",
    peakRank: "Radiant",
    skins: 40,
    knives: 4,
    battlePasses: 5,
    region: "India",
    level: 142,
    verified: true,
    instantDelivery: true,
    description:
      "Top-tier Immortal account that peaked Radiant. Loaded with 40 premium skins, 4 rare knives, and 5 battle passes. The ultimate flex account.",
  },
  {
    id: "p4",
    slug: "gold-grinder-8-skins",
    title: "Gold Grinder — 8 Skins",
    image: "/products/account-4.jpg",
    price: 1999,
    discountedPrice: 1499,
    badge: null,
    currentRank: "Gold",
    peakRank: "Platinum",
    skins: 8,
    knives: 0,
    battlePasses: 1,
    region: "India",
    level: 38,
    verified: true,
    instantDelivery: true,
    description:
      "Budget-friendly Gold account with 8 skins and a battle pass. Ideal for new players wanting to skip the grind and jump straight into ranked.",
  },
  {
    id: "p5",
    slug: "ascendant-elite-30-skins",
    title: "Ascendant Elite — 30 Skins",
    image: "/products/account-5.jpg",
    price: 12999,
    discountedPrice: 10499,
    badge: "NEW",
    currentRank: "Ascendant",
    peakRank: "Immortal",
    skins: 30,
    knives: 3,
    battlePasses: 4,
    region: "India",
    level: 110,
    verified: true,
    instantDelivery: true,
    description:
      "Ascendant account with 30 skins and 3 exclusive knives. Peaked Immortal. A great mid-range pick for serious players.",
  },
  {
    id: "p6",
    slug: "silver-fresh-5-skins",
    title: "Silver Fresh — 5 Skins",
    image: "/products/account-6.jpg",
    price: 1299,
    discountedPrice: 999,
    badge: null,
    currentRank: "Silver",
    peakRank: "Gold",
    skins: 5,
    knives: 0,
    battlePasses: 1,
    region: "India",
    level: 22,
    verified: true,
    instantDelivery: true,
    description:
      "Entry-level Silver account with 5 skins. Clean history, verified email, full access. Perfect for casual players.",
  },
  {
    id: "p7",
    slug: "radiant-legend-55-skins",
    title: "Radiant Legend — 55 Skins",
    image: "/products/account-7.jpg",
    price: 34999,
    discountedPrice: 28999,
    badge: "RARE",
    currentRank: "Radiant",
    peakRank: "Radiant",
    skins: 55,
    knives: 6,
    battlePasses: 7,
    region: "India",
    level: 210,
    verified: true,
    instantDelivery: false,
    description:
      "The crown jewel. A Radiant account with 55 premium skins, 6 legendary knives, and 7 battle passes. Extremely rare — limited availability.",
  },
  {
    id: "p8",
    slug: "bronze-budget-3-skins",
    title: "Bronze Budget — 3 Skins",
    image: "/products/account-8.jpg",
    price: 799,
    discountedPrice: 599,
    badge: null,
    currentRank: "Bronze",
    peakRank: "Silver",
    skins: 3,
    knives: 0,
    battlePasses: 0,
    region: "India",
    level: 15,
    verified: true,
    instantDelivery: true,
    description:
      "The most affordable option. 3 skins, clean account, verified email. Great for players who just want a fresh start.",
  },
];
