"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  rank: string;
  account_bought: string;
  date: string;
  review: string;
  verified: boolean;
  platform: string;
}

const EMPTY: Omit<Review, "id"> = {
  name: "", avatar: "", rating: 5, rank: "", account_bought: "",
  date: "", review: "", verified: true, platform: "WhatsApp",
};

export default function ReviewsTab() {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Review, "id">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY);
    setEditId(null);
    setModal("add");
  }

  function openEdit(row: Review) {
    const { id, ...rest } = row;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, avatar: form.avatar || form.name.slice(0, 2).toUpperCase() };
    if (modal === "add") {
      const { data: row } = await supabase.from("reviews").insert(payload).select().single();
      if (row) setData((prev) => [row, ...prev]);
    } else if (editId) {
      await supabase.from("reviews").update(payload).eq("id", editId);
      setData((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)));
    }
    setSaving(false);
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    setDeleting(id);
    await supabase.from("reviews").delete().eq("id", id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "rating",
      label: "Rating",
      render: (row: Review) => (
        <span className="text-yellow-400">{"★".repeat(row.rating)}{"☆".repeat(5 - row.rating)}</span>
      ),
    },
    { key: "rank", label: "Rank" },
    { key: "platform", label: "Platform" },
    {
      key: "verified",
      label: "Verified",
      render: (row: Review) => (
        <span className={row.verified ? "text-green-400" : "text-white/30"}>
          {row.verified ? "✓ Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Review) => (
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
          <h2 className="font-bold text-white">Reviews</h2>
          <p className="text-xs text-white/40 mt-0.5">{data.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
        >
          + Add Review
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} emptyMessage="No reviews yet" />

      {modal && (
        <AdminModal
          title={modal === "add" ? "Add Review" : "Edit Review"}
          onClose={() => setModal(null)}
        >
          <ReviewForm form={form} onChange={setForm} onSave={handleSave} saving={saving} />
        </AdminModal>
      )}
    </div>
  );
}

function ReviewForm({
  form,
  onChange,
  onSave,
  saving,
}: {
  form: Omit<Review, "id">;
  onChange: (f: Omit<Review, "id">) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (key: keyof typeof form, val: unknown) =>
    onChange({ ...form, [key]: val });

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name *">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} placeholder="Arjun S." />
        </Field>
        <Field label="Rating *">
          <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={select}>
            {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rank">
          <input value={form.rank} onChange={(e) => set("rank", e.target.value)} className={input} placeholder="Diamond" />
        </Field>
        <Field label="Platform">
          <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className={select}>
            {["WhatsApp","Discord","Instagram","Direct"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Account Bought">
        <input value={form.account_bought} onChange={(e) => set("account_bought", e.target.value)} className={input} placeholder="Diamond Smurf — 25 Skins" />
      </Field>
      <Field label="Date">
        <input value={form.date} onChange={(e) => set("date", e.target.value)} className={input} placeholder="April 2026" />
      </Field>
      <Field label="Review *">
        <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={3} className={`${input} resize-none`} placeholder="Write the review…" />
      </Field>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.verified} onChange={(e) => set("verified", e.target.checked)} className="accent-indigo-500" />
        <span className="text-white/60">Verified purchase</span>
      </label>
      <button
        onClick={onSave}
        disabled={saving || !form.name || !form.review}
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

const input = "bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors w-full";
const select = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors w-full";
