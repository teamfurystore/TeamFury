export interface Review {
  id: string;
  name: string;
  avatar: string; // initials fallback
  rating: number;
  rank: string;
  accountBought: string;
  date: string;
  review: string;
  verified: boolean;
  platform: "WhatsApp" | "Discord" | "Instagram" | "Direct";
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Arjun S.",
    avatar: "AS",
    rating: 5,
    rank: "Diamond",
    accountBought: "Diamond Smurf — 25 Skins",
    date: "April 2026",
    review: "Absolutely smooth experience. Got my account within 3 minutes of payment. The skins are exactly as described and the account is clean. TEAM FURY is legit, no cap.",
    verified: true,
    platform: "WhatsApp",
  },
  {
    id: "r2",
    name: "Priya M.",
    avatar: "PM",
    rating: 5,
    rank: "Immortal",
    accountBought: "Immortal Beast — 40 Skins",
    date: "March 2026",
    review: "I was skeptical at first but the team was super responsive on WhatsApp. Account delivered instantly, all skins intact, and the peak rank is exactly Radiant as listed. 10/10 would buy again.",
    verified: true,
    platform: "WhatsApp",
  },
  {
    id: "r3",
    name: "Rahul K.",
    avatar: "RK",
    rating: 5,
    rank: "Platinum",
    accountBought: "Platinum Starter — 12 Skins",
    date: "March 2026",
    review: "Best purchase I've made for Valorant. The account had everything listed — 12 skins, knife, verified email. Support helped me change the password immediately. Highly recommend!",
    verified: true,
    platform: "Discord",
  },
  {
    id: "r4",
    name: "Sneha R.",
    avatar: "SR",
    rating: 5,
    rank: "Ascendant",
    accountBought: "Ascendant Elite — 30 Skins",
    date: "February 2026",
    review: "Bought the Ascendant account for my brother as a gift. He was shocked by the quality. The team even helped us set up 2FA. Post-sale support is genuinely amazing.",
    verified: true,
    platform: "Instagram",
  },
  {
    id: "r5",
    name: "Vikram T.",
    avatar: "VT",
    rating: 5,
    rank: "Gold",
    accountBought: "Gold Grinder — 8 Skins",
    date: "February 2026",
    review: "Great value for money. Got a Gold account with 8 skins for under ₹1500. Delivery was instant and the account is exactly as described. Will definitely buy again when I want to upgrade.",
    verified: true,
    platform: "WhatsApp",
  },
  {
    id: "r6",
    name: "Ananya P.",
    avatar: "AP",
    rating: 5,
    rank: "Diamond",
    accountBought: "Diamond Smurf — 25 Skins",
    date: "January 2026",
    review: "I've bought from other sellers before and always got scammed. TEAM FURY is different — they actually care about the customer. The account was clean, delivery was fast, and they followed up to make sure everything was fine.",
    verified: true,
    platform: "Discord",
  },
  {
    id: "r7",
    name: "Karan B.",
    avatar: "KB",
    rating: 4,
    rank: "Silver",
    accountBought: "Silver Fresh — 5 Skins",
    date: "January 2026",
    review: "Good account for the price. Delivery took about 8 minutes which is still fast. The skins are nice. Would have given 5 stars but one skin wasn't exactly what I expected. Support resolved it quickly though.",
    verified: true,
    platform: "WhatsApp",
  },
  {
    id: "r8",
    name: "Meera J.",
    avatar: "MJ",
    rating: 5,
    rank: "Radiant",
    accountBought: "Radiant Legend — 55 Skins",
    date: "December 2025",
    review: "The Radiant account is absolutely insane. 55 skins, 6 knives — it's a collector's dream. The team was very professional and even gave me a discount for being a returning customer. TEAM FURY for life!",
    verified: true,
    platform: "Direct",
  },
];

export const REVIEW_STATS = {
  totalReviews: 1000,
  averageRating: 4.9,
  fiveStarPercent: 94,
  fourStarPercent: 5,
  threeStarPercent: 1,
};
