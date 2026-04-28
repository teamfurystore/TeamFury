"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import { type Rank } from "@/utils/products";

interface Product {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  discounted_price: number;
  badge: string | null;
  current_rank: Rank;
  peak_rank: Rank;
  skins: number;
  knives: number;
  battle_passes: number;
  region: string;
  level: number;
  verified: boolean;
  instant_delivery: boolean;
  description: string;
}

const RANKS: Rank[] = ["Iron","Bronze","Silver","Gold","Platinum","Diamond","Ascendant","Immortal","Radiant"];

const EMPTY: Omit<Product, "id"> = {
  slug: "", title: "", image: "", price: 0, discounted_price: 0,
  badge: "", current_rank: "Gold", peak_rank: "Gold",
  skins: 0, knives: 0, battle_passes: 0, region: "India",
  level: 0, verified: true, instant_delivery: true, description: "",
};

export default function ProductsTab() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModal("add"); }
  function openEdit(row: Product) {
    const { id, ...rest } = row;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, badge: form.badge || null };
    if (modal === "add") {
      const { data: row } = await supabase.from("products").insert(payload).select().single();
      if (row) setData((prev) => [row, ...prev]);
    } else if (editId) {
      await supabase.from("products").update(payload).eq("id", editId);
      setData((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)));
    }
    setSaving(false);
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await supabase.from("products").delete().eq("id", id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => (
        <span>
          <span className="line-through text-white/30 mr-1.5">₹{row.price.toLocaleString()}</span>
          <span className="text-green-400 font-semibold">₹{row.discounted_price.toLocaleString()}</span>
        </span>
      ),
    },
    { key: "current_rank", label: "Rank" },
    { key: "skins", label: "Skins" },
    {
      key: "badge",
      label: "Badge",
      render: (row: Product) =>
        row.badge ? (
          <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            {row.badge}
          </span>
        ) : (
          <span className="text-white/20">—</span>
        ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(row)}
            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deleting === row.id}
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-white">Products</h2>
          <p className="text-xs text-white/40 mt-0.5">{data.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
        >
          + Add Product
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} emptyMessage="No products yet" />

      {modal && (
        <AdminModal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          onClose={() => setModal(null)}
        >
          <ProductForm form={form} onChange={setForm} onSave={handleSave} saving={saving} />
        </AdminModal>
      )}
    </div>
  );
}

function ProductForm({
  form,
  onChange,
  onSave,
  saving,
}: {
  form: Omit<Product, "id">;
  onChange: (f: Omit<Product, "id">) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (key: keyof typeof form, val: unknown) => onChange({ ...form, [key]: val });
  const num = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(key, Number(e.target.value));

  return (
    <div className="flex flex-col gap-3 text-sm max-h-[70vh] overflow-y-auto pr-1">
      <Field label="Title *">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} placeholder="Diamond Smurf — 25 Skins" />
      </Field>
      <Field label="Slug *">
        <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="diamond-smurf-25-skins" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (₹)">
          <input type="number" value={form.price} onChange={num("price")} className={inp} />
        </Field>
        <Field label="Discounted Price (₹)">
          <input type="number" value={form.discounted_price} onChange={num("discounted_price")} className={inp} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Current Rank">
          <select value={form.current_rank} onChange={(e) => set("current_rank", e.target.value)} className={sel}>
            {RANKS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Peak Rank">
          <select value={form.peak_rank} onChange={(e) => set("peak_rank", e.target.value)} className={sel}>
            {RANKS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Skins">
          <input type="number" value={form.skins} onChange={num("skins")} className={inp} />
        </Field>
        <Field label="Knives">
          <input type="number" value={form.knives} onChange={num("knives")} className={inp} />
        </Field>
        <Field label="Battle Passes">
          <input type="number" value={form.battle_passes} onChange={num("battle_passes")} className={inp} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Region">
          <input value={form.region} onChange={(e) => set("region", e.target.value)} className={inp} placeholder="India" />
        </Field>
        <Field label="Level">
          <input type="number" value={form.level} onChange={num("level")} className={inp} />
        </Field>
      </div>
      <Field label="Badge (optional)">
        <input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} className={inp} placeholder="HOT DEAL" />
      </Field>
      <Field label="Image URL">
        <input value={form.image} onChange={(e) => set("image", e.target.value)} className={inp} placeholder="/products/account-1.jpg" />
      </Field>
      <Field label="Description">
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inp} resize-none`} />
      </Field>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.verified} onChange={(e) => set("verified", e.target.checked)} className="accent-indigo-500" />
          <span className="text-white/60">Verified</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.instant_delivery} onChange={(e) => set("instant_delivery", e.target.checked)} className="accent-indigo-500" />
          <span className="text-white/60">Instant Delivery</span>
        </label>
      </div>
      <button
        onClick={onSave}
        disabled={saving || !form.title || !form.slug}
        className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/40 font-medium">{label}</label>
      {children}
    </div>
  );
}

const inp = "bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors w-full";
const sel = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors w-full";
