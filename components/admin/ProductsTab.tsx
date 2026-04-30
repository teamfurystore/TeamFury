"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";
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

const RANKS: Rank[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
  "Radiant",
];

const EMPTY: Omit<Product, "id"> = {
  slug: "",
  title: "",
  image: "",
  price: 0,
  discounted_price: 0,
  badge: "",
  current_rank: "Gold",
  peak_rank: "Gold",
  skins: 0,
  knives: 0,
  battle_passes: 0,
  region: "India",
  level: 0,
  verified: true,
  instant_delivery: true,
  description: "",
};

export default function ProductsTab() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  //! state for image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm(EMPTY);
    setEditId(null);
    setModal("add");
  }
  function openEdit(row: Product) {
    const { id, ...rest } = row;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  }

  async function handleSave() {
    setSaving(true);
    try {
      let imageUrl = form.image;

      // Upload image if a file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${form.slug || 'product'}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        console.log('Would upload image:', {
          fileName,
          filePath,
          fileSize: imageFile.size,
          fileType: imageFile.type
        });

        // Simulate getting public URL
        imageUrl = `https://your-supabase-url.supabase.co/storage/v1/object/public/images/${filePath}`;
      }

      const payload = { 
        ...form, 
        image: imageUrl,
        badge: form.badge || null 
      };
      
      console.log('Form Data to be sent to API:', payload);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Product saved successfully (simulated)');

      // Reset image states
      setImageFile(null);
      setPreview('');
      setModal(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", deleteTarget.id);
    setData((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  }

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => (
        <span className="flex items-center gap-1.5">
          <span className="line-through text-white/25 text-xs">
            ₹{row.price.toLocaleString()}
          </span>
          <span className="text-emerald-400 font-medium">
            ₹{row.discounted_price.toLocaleString()}
          </span>
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
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2 py-0.5 rounded-md">
            {row.badge}
          </span>
        ) : (
          <span className="text-white/20 text-xs">—</span>
        ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Product) => (
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={() => openEdit(row)}>
            Edit
          </Btn>
          <Btn variant="danger" onClick={() => setDeleteTarget(row)}>
            Delete
          </Btn>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Products</p>
          <p className="text-xs text-white/40 mt-0.5">
            {data.length} listing{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={load} disabled={loading}>
            ↻ Refresh
          </Btn>
          <Btn variant="primary" onClick={openAdd}>
            + Add Product
          </Btn>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No products yet"
      />

      {modal && (
        <AdminModal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          onClose={() => setModal(null)}
          size="lg"
        >
          <ProductForm
            form={form}
            onChange={setForm}
            onSave={handleSave}
            saving={saving}
            handleImageChange={handleFileChange}
          />
        </AdminModal>
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={`Delete "${deleteTarget.title}"?`}
          description="This will permanently remove the product listing."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

function ProductForm({
  form,
  onChange,
  onSave,
  saving,
  handleImageChange,
}: {
  form: Omit<Product, "id">;
  onChange: (f: Omit<Product, "id">) => void;
  onSave: () => void;
  saving: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const set = (k: keyof typeof form, v: unknown) =>
    onChange({ ...form, [k]: v });
  const num =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(k, Number(e.target.value));

  return (
    <div className="flex flex-col gap-3">
      <Field label="Thumbnail Image*">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={inp}
        />
      </Field>

      <Field label="Title *">
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className={inp}
          placeholder="Diamond Smurf — 25 Skins"
        />
      </Field>
      <Field label="Slug *">
        <input
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className={inp}
          placeholder="diamond-smurf-25-skins"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Original Price (₹)">
          <input
            type="number"
            value={form.price}
            onChange={num("price")}
            className={inp}
          />
        </Field>
        <Field label="Sale Price (₹)">
          <input
            type="number"
            value={form.discounted_price}
            onChange={num("discounted_price")}
            className={inp}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Current Rank">
          <select
            value={form.current_rank}
            onChange={(e) => set("current_rank", e.target.value)}
            className={sel}
          >
            {RANKS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Peak Rank">
          <select
            value={form.peak_rank}
            onChange={(e) => set("peak_rank", e.target.value)}
            className={sel}
          >
            {RANKS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Skins">
          <input
            type="number"
            value={form.skins}
            onChange={num("skins")}
            className={inp}
          />
        </Field>
        <Field label="Knives">
          <input
            type="number"
            value={form.knives}
            onChange={num("knives")}
            className={inp}
          />
        </Field>
        <Field label="Battle Passes">
          <input
            type="number"
            value={form.battle_passes}
            onChange={num("battle_passes")}
            className={inp}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Region">
          <input
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className={inp}
            placeholder="India"
          />
        </Field>
        <Field label="Level">
          <input
            type="number"
            value={form.level}
            onChange={num("level")}
            className={inp}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Badge (optional)">
          <input
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value)}
            className={inp}
            placeholder="HOT DEAL"
          />
        </Field>
        <Field label="Valorant profile URL">
          <input
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            className={inp}
            placeholder="https://tracker.gg/valorant"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={`${inp} resize-none`}
        />
      </Field>

      <div className="flex gap-5 pt-1">
        <Toggle
          label="Verified"
          checked={form.verified}
          onChange={(v) => set("verified", v)}
        />
        <Toggle
          label="Instant Delivery"
          checked={form.instant_delivery}
          onChange={(v) => set("instant_delivery", v)}
          color="emerald"
        />
      </div>

      <button
        onClick={onSave}
        disabled={saving || !form.title || !form.slug}
        className="mt-1 bg-white text-[#0f0f0f] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {saving ? "Saving…" : "Save Product"}
      </button>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/50 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  color = "white",
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  const bg = checked
    ? color === "emerald"
      ? "bg-emerald-500"
      : "bg-white"
    : "bg-white/15";
  const dot = checked
    ? color === "emerald"
      ? "bg-white translate-x-4"
      : "bg-[#0f0f0f] translate-x-4"
    : "bg-white translate-x-1";
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${bg}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform duration-200 ${dot}`}
        />
      </button>
      <span className="text-xs text-white/55">{label}</span>
    </label>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  variant = "ghost",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "ghost" | "primary" | "danger";
}) {
  const s = {
    ghost:
      "text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5",
    primary: "text-white bg-white/10 hover:bg-white/15 border border-white/10",
    danger:
      "text-red-400 hover:text-red-300 border border-red-500/15 hover:border-red-500/30 hover:bg-red-500/5",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${s[variant]}`}
    >
      {children}
    </button>
  );
}

const inp =
  "bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/25 focus:border-white/25 transition-all w-full";
const sel =
  "bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/25 transition-all w-full";
