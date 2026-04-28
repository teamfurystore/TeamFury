"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminReviews,
  addAdminReview,
  updateAdminReview,
  deleteAdminReview,
  optimisticToggle,
  revertToggle,
  clearError,
  type AdminReview,
  type ReviewFormPayload,
} from "@/features/admin/adminReviewsSlice";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";

const EMPTY: ReviewFormPayload = {
  name: "", avatar: "", rating: 5, rank: "", account_bought: "",
  date: "", review: "", verified: true, active: true, platform: "WhatsApp",
};

export default function ReviewsTab() {
  const dispatch = useAppDispatch();
  const { list, loading, error, savingId, deletingId, togglingId } =
    useAppSelector((s) => s.adminReviews);

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<ReviewFormPayload>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  useEffect(() => { dispatch(fetchAdminReviews()); }, [dispatch]);

  // ── toggle active (optimistic) ─────────────────────────────────────────────
  async function handleToggle(row: AdminReview) {
    dispatch(optimisticToggle(row.id));
    const result = await dispatch(
      updateAdminReview({ id: row.id, payload: { active: !row.active } })
    );
    if (updateAdminReview.rejected.match(result)) {
      dispatch(revertToggle({ id: row.id, original: row.active }));
    }
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    await dispatch(deleteAdminReview(deleteTarget.id));
    setDeleteTarget(null);
  }

  // ── save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    const payload: ReviewFormPayload = {
      ...form,
      avatar: form.avatar || form.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    };

    let result;
    if (modal === "add") {
      result = await dispatch(addAdminReview(payload));
    } else if (editId) {
      result = await dispatch(updateAdminReview({ id: editId, payload }));
    }

    if (result && !("error" in (result as any).error ?? {})) {
      setModal(null);
    }
  }

  function openAdd() { setForm(EMPTY); setEditId(null); setModal("add"); }
  function openEdit(row: AdminReview) {
    const { id, created_at, ...rest } = row;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  }

  const activeCount  = list.filter((r) => r.active).length;
  const pendingCount = list.filter((r) => !r.active).length;

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "rating", label: "Rating",
      render: (row: AdminReview) => (
        <span className="text-yellow-400 tracking-tight">
          {"★".repeat(row.rating)}{"☆".repeat(5 - row.rating)}
        </span>
      ),
    },
    { key: "platform", label: "Platform" },
    {
      key: "active", label: "Visible",
      render: (row: AdminReview) => (
        <button
          onClick={() => handleToggle(row)}
          disabled={togglingId === row.id || savingId === row.id}
          title={row.active ? "Click to hide" : "Click to publish"}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 ${row.active ? "bg-green-500" : "bg-white/15"}`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-300 ${row.active ? "translate-x-4" : "translate-x-1"}`} />
        </button>
      ),
    },
    {
      key: "created_at", label: "Submitted",
      render: (row: AdminReview) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
    },
    {
      key: "actions", label: "",
      render: (row: AdminReview) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)}
            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors">
            Edit
          </button>
          <button onClick={() => setDeleteTarget(row)}
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-white">Reviews</h2>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-white/40">{list.length} total</span>
            <span className="text-xs text-green-400">{activeCount} live</span>
            {pendingCount > 0 && (
              <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => dispatch(fetchAdminReviews())} disabled={loading}
            className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40">
            ↻ Refresh
          </button>
          <button onClick={openAdd}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors">
            + Add
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="text-white/40 hover:text-white ml-4">×</button>
        </div>
      )}

      <AdminTable columns={columns} data={list} loading={loading} emptyMessage="No reviews yet" />

      {modal && (
        <AdminModal title={modal === "add" ? "Add Review" : "Edit Review"} onClose={() => setModal(null)}>
          <ReviewForm
            form={form}
            onChange={setForm}
            onSave={handleSave}
            saving={savingId === "new" || savingId === editId}
          />
        </AdminModal>
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={`Delete "${deleteTarget.name}"'s review?`}
          description="This will permanently remove the review and cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deletingId === deleteTarget.id}
        />
      )}
    </div>
  );
}

function ReviewForm({ form, onChange, onSave, saving }: {
  form: ReviewFormPayload;
  onChange: (f: ReviewFormPayload) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (key: keyof ReviewFormPayload, val: unknown) => onChange({ ...form, [key]: val });

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name *"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} placeholder="Arjun S." /></Field>
        <Field label="Rating *">
          <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={sel}>
            {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rank"><input value={form.rank} onChange={(e) => set("rank", e.target.value)} className={inp} placeholder="Diamond" /></Field>
        <Field label="Platform">
          <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className={sel}>
            {["WhatsApp","Discord","Instagram","Direct"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Account Bought"><input value={form.account_bought} onChange={(e) => set("account_bought", e.target.value)} className={inp} placeholder="Diamond Smurf — 25 Skins" /></Field>
      <Field label="Date"><input value={form.date} onChange={(e) => set("date", e.target.value)} className={inp} placeholder="April 2026" /></Field>
      <Field label="Review *"><textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={3} className={`${inp} resize-none`} placeholder="Write the review…" /></Field>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.verified} onChange={(e) => set("verified", e.target.checked)} className="accent-indigo-500" />
          <span className="text-white/60">Verified purchase</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="accent-green-500" />
          <span className="text-white/60">Publish immediately</span>
        </label>
      </div>
      <button onClick={onSave} disabled={saving || !form.name || !form.review}
        className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors">
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
