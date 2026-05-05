"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleProductActive } from "@/features/admin/adminProductsSlice";
import { selectSavedSkins, seedSelections, type SelectedSkin } from "@/features/valorant/skinsSlice";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";
import SkinPickerPopup from "@/components/shop/SkinPickerPopup";
import { type Rank } from "@/utils/products";
import { ROUTE_ADMIN_PRODUCTS, ROUTE_ADMIN_PRODUCT_DELETE } from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductItem {
  id: string;
  skin_id: string;
  display_name: string;
  display_icon: string | null;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  image: string;
  profile_url: string;
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
  active: boolean;
  description: string;
  product_items: ProductItem[];
}

// Form state allows empty string for numeric fields so the input can be blank.
// On save, empty strings are coerced to 0.
type NumericField = "price" | "discounted_price" | "skins" | "knives" | "battle_passes" | "level";
type FormState = Omit<Product, "id" | NumericField> & {
  [K in NumericField]: number | "";
};

const RANKS: Rank[] = [
  "Iron", "Bronze", "Silver", "Gold", "Platinum",
  "Diamond", "Ascendant", "Immortal", "Radiant",
];

const EMPTY: FormState = {
  slug: "", title: "", image: "", profile_url: "",
  price: "", discounted_price: "", badge: "",
  current_rank: "Gold", peak_rank: "Gold",
  skins: "", knives: "", battle_passes: "",
  region: "India", level: "",
  verified: true, instant_delivery: true, active: false,
  description: "", product_items: [],
};

/** Coerce FormState → Product payload (empty strings become 0) */
function coerceForm(f: FormState): Omit<Product, "id"> {
  return {
    ...f,
    price: Number(f.price) || 0,
    discounted_price: Number(f.discounted_price) || 0,
    skins: Number(f.skins) || 0,
    knives: Number(f.knives) || 0,
    battle_passes: Number(f.battle_passes) || 0,
    level: Number(f.level) || 0,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductsTab() {
  const dispatch = useAppDispatch();
  const { togglingId } = useAppSelector((s) => s.adminProducts);
  const savedSelections = useAppSelector((s) => s.skins.savedSelections);

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [skinsTarget, setSkinsTarget] = useState<Product | null>(null);

  // Image state — file is the new upload, preview is what's shown in the form
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,          // target ≤ 1 MB
        maxWidthOrHeight: 1080, // never wider than 1080px
        useWebWorker: true,
        fileType: "image/webp",
      });
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      toast.success(
        `Image compressed: ${(file.size / 1024 / 1024).toFixed(1)} MB → ${(compressed.size / 1024 / 1024).toFixed(2)} MB`
      );
    } catch {
      // Compression failed — fall back to original file
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.error("Compression failed, using original file");
    } finally {
      setCompressing(false);
    }
  };

  // ── Data loading ────────────────────────────────────────────────────────────

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(ROUTE_ADMIN_PRODUCTS, { credentials: "include" });
      const json = await res.json();
      const rows: Product[] = json.data ?? [];
      setData(rows);

      // Seed Redux so skin badge counts show immediately
      const selections: Record<string, SelectedSkin[]> = {};
      rows.forEach((p) => {
        if (p.product_items?.length > 0) {
          selections[p.id] = p.product_items.map((item) => ({
            uuid: item.skin_id,
            displayName: item.display_name,
            displayIcon: item.display_icon,
          }));
        }
      });
      dispatch(seedSelections(selections));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // ── Modal helpers ───────────────────────────────────────────────────────────

  function openAdd() {
    setForm(EMPTY);
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    setModal("add");
  }

  function openEdit(row: Product) {
    const { id, ...rest } = row;
    // Convert 0 → "" so numeric fields appear blank in the form
    setForm({
      ...rest,
      price: rest.price || "",
      discounted_price: rest.discounted_price || "",
      skins: rest.skins || "",
      knives: rest.knives || "",
      battle_passes: rest.battle_passes || "",
      level: rest.level || "",
    });
    setEditId(id);
    setImageFile(null);
    setImagePreview(row.image);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setImageFile(null);
    setImagePreview(null);
  }

  // ── Save (create or update) ─────────────────────────────────────────────────

  async function handleSave() {
    // Validate required fields
    const salePrice = Number(form.discounted_price);
    if (!salePrice || salePrice <= 0) {
      toast.error("Sale Price is required and must be greater than 0");
      return;
    }

    setSaving(true);
    setSavingId(editId ?? "new");
    try {
      const payload = { ...coerceForm(form), badge: form.badge || null };
      const formdata = new FormData();

      if (editId) {
        // Edit — include the id so the API knows which row to update
        formdata.append("data", JSON.stringify({ ...payload, id: editId }));
        if (imageFile) formdata.append("file", imageFile);
        // If no new file, the existing image URL is already in payload.image

        const res = await fetch(editId ? ROUTE_ADMIN_PRODUCTS : "/api/products", {
          method: editId ? "PUT" : "POST",
          body: formdata,
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        // Create — image is required
        if (!imageFile) {
          alert("Please select a thumbnail image.");
          return;
        }
        formdata.append("data", JSON.stringify(payload));
        formdata.append("file", imageFile);

        const res = await fetch("/api/products", {
          method: "POST",
          body: formdata,
        });
        if (!res.ok) throw new Error(await res.text());
      }

      closeModal();
      load();
      toast.success(editId ? "Product updated successfully" : "Product created successfully");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
      setSavingId(null);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    const res = await fetch(ROUTE_ADMIN_PRODUCT_DELETE(deleteTarget.id), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setData((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" deleted`);
    } else {
      toast.error("Failed to delete product");
    }
    setDeletingId(null);
    setDeleteTarget(null);
  }

  // ── Toggle active ───────────────────────────────────────────────────────────

  async function handleToggle(row: Product) {
    setData((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, active: !p.active } : p))
    );
    const result = await dispatch(
      toggleProductActive({ id: row.id, currentActive: row.active })
    );
    if (toggleProductActive.rejected.match(result)) {
      setData((prev) =>
        prev.map((p) => (p.id === row.id ? { ...p, active: row.active } : p))
      );
      toast.error("Failed to update publish status");
    } else {
      toast.success(row.active ? `"${row.title}" unpublished` : `"${row.title}" published`);
    }
  }

  // ── Table ───────────────────────────────────────────────────────────────────

  const active = data.filter((p) => p.active).length;
  const inactive = data.filter((p) => !p.active).length;

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => {
        const hasDiscount = row.price > 0 && row.price > row.discounted_price;
        return (
          <span className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="line-through text-white/25 text-xs">
                ₹{row.price.toLocaleString()}
              </span>
            )}
            <span className="text-emerald-400 font-medium">
              ₹{row.discounted_price.toLocaleString()}
            </span>
          </span>
        );
      },
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
      key: "active",
      label: "Published",
      render: (row: Product) => (
        <button
          onClick={() => handleToggle(row)}
          disabled={togglingId === row.id || savingId === row.id}
          title={row.active ? "Click to unpublish" : "Click to publish"}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${row.active ? "bg-emerald-500" : "bg-white/15"
            }`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${row.active ? "translate-x-4" : "translate-x-1"
            }`} />
        </button>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Product) => {
        const savedCount = selectSavedSkins(savedSelections, row.id).length;
        return (
          <div className="flex gap-1.5">
            <button
              onClick={() => setSkinsTarget(row)}
              className="relative text-xs font-medium px-3 py-1.5 rounded-lg transition-colors text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              🎨 Skins
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1 leading-none">
                  {savedCount}
                </span>
              )}
            </button>
            <Btn variant="ghost" onClick={() => openEdit(row)}>Edit</Btn>
            <Btn variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Btn>
          </div>
        );
      },
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Products</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-white/40">{data.length} total</span>
            {active > 0 && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded-md">
                {active} active
              </span>
            )}
            {inactive > 0 && (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-md">
                {inactive} inactive
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={load} disabled={loading}>↻ Refresh</Btn>
          <Btn variant="primary" onClick={openAdd}>+ Add Product</Btn>
        </div>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} emptyMessage="No products yet" />

      {modal && (
        <AdminModal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          onClose={closeModal}
          size="lg"
        >
          <ProductForm
            form={form}
            onChange={setForm}
            onSave={handleSave}
            saving={saving}
            isEdit={modal === "edit"}
            imagePreview={imagePreview}
            compressing={compressing}
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
          loading={deletingId === deleteTarget.id}
        />
      )}

      {skinsTarget && (
        <SkinPickerPopup
          productId={skinsTarget.id}
          productName={skinsTarget.title}
          onClose={() => setSkinsTarget(null)}
        />
      )}
    </div>
  );
}

// ── Product form ──────────────────────────────────────────────────────────────

function ProductForm({
  form,
  onChange,
  onSave,
  saving,
  isEdit,
  imagePreview,
  compressing,
  handleImageChange,
}: {
  form: FormState;
  onChange: (f: FormState) => void;
  onSave: () => void;
  saving: boolean;
  isEdit: boolean;
  imagePreview: string | null;
  compressing: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const set = (k: keyof FormState, v: unknown) => onChange({ ...form, [k]: v });
  // For number inputs: store raw string while typing, keep as "" if cleared
  const num = (k: NumericField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    set(k, v === "" ? "" : Number(v));
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Thumbnail — required on add, optional on edit */}
      <Field label={isEdit ? "Thumbnail Image (leave blank to keep current)" : "Thumbnail Image *"}>
        {/* Show current / newly picked preview */}
        {imagePreview && !compressing && (
          <div className="w-full max-h-[30vh] rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-1">
            <img src={imagePreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
          </div>
        )}
        {compressing && (
          <div className="w-full h-24 rounded-xl bg-white/5 border border-white/10 mb-1 flex items-center justify-center gap-2 text-white/40 text-xs">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Compressing image…
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={compressing}
          className={`${inp} disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <p className="text-[10px] text-white/25 mt-1">
          Automatically compressed to ≤ 1 MB · 1080px max width
        </p>
      </Field>

      <Field label="Title *">
        <input value={form.title} onChange={(e) => set("title", e.target.value)}
          className={inp} placeholder="Diamond Smurf — 25 Skins" />
      </Field>
      <Field label="Slug *">
        <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
          className={inp} placeholder="diamond-smurf-25-skins" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Original Price (₹)">
          <input type="number" value={form.price ?? ""} onChange={num("price")} className={inp}
            placeholder="e.g. 2999" />
        </Field>
        <Field label="Sale Price (₹) *">
          <input
            type="number"
            value={form.discounted_price ?? ""}
            onChange={num("discounted_price")}
            className={`${inp} ${!form.discounted_price ? "border-red-500/40 focus:ring-red-500/30" : ""}`}
            placeholder="Required"
          />
          {!form.discounted_price && (
            <p className="text-[10px] text-red-400 mt-0.5">Sale price is required</p>
          )}
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
          <input type="number" value={form.skins ?? ""} onChange={num("skins")} className={inp} />
        </Field>
        <Field label="Knives">
          <input type="number" value={form.knives ?? ""} onChange={num("knives")} className={inp} />
        </Field>
        <Field label="Battle Passes">
          <input type="number" value={form.battle_passes ?? ""} onChange={num("battle_passes")} className={inp} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Region">
          <select
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className={sel}
          >
            <option value="India">India</option>
            <option value="Philippines">Philippines</option>
            <option value="Others">Others</option>
          </select>
        </Field>
        <Field label="Level">
          <input type="number" value={form.level} onChange={num("level")} className={inp} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Badge (optional)">
          <input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)}
            className={inp} placeholder="HOT DEAL" />
        </Field>
        <Field label="Valorant profile URL">
          <input value={form.profile_url} onChange={(e) => set("profile_url", e.target.value)}
            className={inp} placeholder="https://tracker.gg/valorant" />
        </Field>
      </div>

      <Field label="Description">
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          rows={3} className={`${inp} resize-none`} />
      </Field>

      <div className="flex gap-5 pt-1">
        <Toggle label="Verified" checked={form.verified} onChange={(v) => set("verified", v)} />
        <Toggle label="Instant Delivery" checked={form.instant_delivery}
          onChange={(v) => set("instant_delivery", v)} color="emerald" />
      </div>

      <button
        onClick={onSave}
        disabled={saving || compressing || !form.title || !form.slug || !form.discounted_price}
        className="mt-1 bg-white text-[#0f0f0f] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {compressing ? "Compressing image…" : saving ? "Saving…" : isEdit ? "Update Product" : "Save Product"}
      </button>
    </div>
  );
}

// ── Shared micro-components ───────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/50 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange, color = "white" }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; color?: string;
}) {
  const bg = checked ? (color === "emerald" ? "bg-emerald-500" : "bg-white") : "bg-white/15";
  const dot = checked
    ? (color === "emerald" ? "bg-white translate-x-4" : "bg-[#0f0f0f] translate-x-4")
    : "bg-white translate-x-1";
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${bg}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform duration-200 ${dot}`} />
      </button>
      <span className="text-xs text-white/55">{label}</span>
    </label>
  );
}

function Btn({ children, onClick, disabled, variant = "ghost" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: "ghost" | "primary" | "danger";
}) {
  const s = {
    ghost: "text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5",
    primary: "text-white bg-white/10 hover:bg-white/15 border border-white/10",
    danger: "text-red-400 hover:text-red-300 border border-red-500/15 hover:border-red-500/30 hover:bg-red-500/5",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${s[variant]}`}>
      {children}
    </button>
  );
}

const inp = "bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/25 focus:border-white/25 transition-all w-full";
const sel = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/25 transition-all w-full";
