"use client";

import { useState } from "react";
import ContactsTab from "@/components/admin/ContactsTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ProductsTab from "@/components/admin/ProductsTab";

const TABS = [
  { id: "contacts", label: "Contacts", icon: "📬" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "products", label: "Products", icon: "🎮" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DashboardPage() {
  const [active, setActive] = useState<TabId>("contacts");

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your store data from one place</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              active === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {active === "contacts" && <ContactsTab />}
      {active === "reviews" && <ReviewsTab />}
      {active === "products" && <ProductsTab />}
    </div>
  );
}
