"use client";

import { useState } from "react";
import ContactsTab from "@/components/admin/ContactsTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ProductsTab from "@/components/admin/ProductsTab";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const TABS = [
  { id: "contacts", label: "Contacts",  icon: "📬", desc: "Form submissions" },
  { id: "reviews",  label: "Reviews",   icon: "⭐", desc: "Customer reviews"  },
  { id: "products", label: "Products",  icon: "🎮", desc: "Account listings"  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DashboardPage() {
  const [active, setActive] = useState<TabId>("contacts");

  return (
    <div>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your store from one place</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 border-b border-white/8 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative -mb-px ${
              active === tab.id
                ? "text-white bg-white/6 border border-b-[#0f0f0f] border-white/10"
                : "text-white/45 hover:text-white/70 hover:bg-white/4"
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <ErrorBoundary variant="inline">
        {active === "contacts" && <ContactsTab />}
        {active === "reviews"  && <ReviewsTab />}
        {active === "products" && <ProductsTab />}
      </ErrorBoundary>
    </div>
  );
}
