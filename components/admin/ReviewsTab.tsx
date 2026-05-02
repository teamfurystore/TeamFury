"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminReviews, addAdminReview, updateAdminReview,
  deleteAdminReview, optimisticToggle, revertToggle, clearError,
  type AdminReview, type ReviewFormPayload,
} from "@/features/admin/adminReviewsSlice";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";

const EMPTY: ReviewFormPayload = {
  name: "", avatar: "", rating: 5, rank: "", account_bought: "",
  date: "", review: "", verified: true, active: false, platform: "WhatsApp",
};

export default function ReviewsTab() {
  const dispatch = useAppDispatch();
  const { list, loading, error, savingId, deletingId, togglingId } = useAppSelector((s) => s.adminReviews);

  const [modal, setModal]           = useState<"add" | "edit" | null>(null);
  const [form, setForm]             = useState<ReviewFormPayload>(EMPTY);
  const [editId, setEditId]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  
  useEffect(() => {
    dispatch(fetchAdminReviews()); 
  }, []);

  async function handleToggle(row: AdminReview) {
    dispatch(optimisticToggle(row.id));
    const result = await dispatch(updateAdminReview({ id: row.id, payload: { active: !row.active } }));
    if (updateAdminReview.rejected.match(result)) {
      dispatch(revertToggle({ id: row.id, original: row.active }));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await dispatch(deleteAdminReview(deleteTarget.id));
    setDeleteTarget(null);
  }

  async function handleSave() {
    const payload: ReviewFormPayload = {
      ...form,
      avatar:
        form.avatar ||
        form.name
          .trim()
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
    };
    let result;
    if (modal === "add") result = await dispatch(addAdminReview(payload));
    else if (editId)     result = await dispatch(updateAdminReview({ id: editId, payload }));
    if (result && !addAdminReview.rejected.match(result) && !updateAdminReview.rejected.match(result)) {
      setModal(null);
    }
  }

  function openAdd()  { setForm(EMPTY); setEditId(null); setModal("add"); }
  function openEdit(row: AdminReview) {
    const { id, created_at, ...rest } = row;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  }

  const live    = list.filter((r) => r.active).length;
  const pending = list.filter((r) => !r.active).length;

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "rating",
      label: "Rating",
      render: (row: AdminReview) => (
        <span className="text-yellow-400 tracking-tight text-xs">
          {"★".repeat(row.rating)}{"☆".repeat(5 - row.rating)}
        </span>
      ),
    },
    { key: "platform", label: "Platform" },
    {
      key: "active", label: "Published",
      render: (row: AdminReview) => (
        <button
          onClick={() => handleToggle(row)}
          disabled={togglingId === row.id || savingId === row.id}
          title={row.active ? "Click to unpublish" : "Click to publish"}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
            row.active ? "bg-emerald-500" : "bg-white/15"
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            row.active ? "translate-x-4" : "translate-x-1"
          }`} />
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Submitted",
      render: (row: AdminReview) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      label: "",
      render: (row: AdminReview) => (
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={() => openEdit(row)}>Edit</Btn>
          <Btn variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Btn>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Reviews</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-white/40">{list.length} total</span>
            {live > 0 && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded-md">
                {live} live
              </span>
            )}
            {pending > 0 && (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-md">
                {pending} pending
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={() => dispatch(fetchAdminReviews())} disabled={loading}>
            {loading ? "Loading…" : "↻ Refresh"}
          </Btn>
          <Btn variant="primary" onClick={openAdd}>+ Add Review</Btn>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between text-sm text-red-400 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="text-white/30 hover:text-white ml-3 text-base leading-none">×</button>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={list}
        loading={loading}
        emptyMessage="No reviews yet"
      />

      {modal && (
        <AdminModal
          title={modal === "add" ? "Add Review" : "Edit Review"}
          onClose={() => setModal(null)}
        >
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
          title={`Delete ${deleteTarget.name}'s review?`}
          description="This will permanently remove the review."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deletingId === deleteTarget.id}
        />
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
  form: ReviewFormPayload;
  onChange: (f: ReviewFormPayload) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (k: keyof ReviewFormPayload, v: unknown) => onChange({ ...form, [k]: v });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name *">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} placeholder="Arjun S." />
        </Field>
        <Field label="Rating">
          <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={sel}>
            {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rank">
          <input value={form.rank} onChange={(e) => set("rank", e.target.value)} className={inp} placeholder="Diamond" />
        </Field>
        <Field label="Platform">
          <select
            value={form.platform}
            onChange={(e) => set("platform", e.target.value)}
            className={sel}
          >
            {["WhatsApp", "Discord", "Instagram", "Direct"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Account Bought">
        <input value={form.account_bought} onChange={(e) => set("account_bought", e.target.value)} className={inp} placeholder="Diamond Smurf — 25 Skins" />
      </Field>
      <Field label="Date">
        <input value={form.date} onChange={(e) => set("date", e.target.value)} className={inp} placeholder="April 2026" />
      </Field>
      <Field label="Review *">
        <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={3} className={`${inp} resize-none`} placeholder="Write the review…" />
      </Field>
      <div className="flex gap-5 pt-1">
        <Toggle label="Verified purchase" checked={form.verified} onChange={(v) => set("verified", v)} />
        <Toggle label="Publish immediately" checked={form.active} onChange={(v) => set("active", v)} color="emerald" />
      </div>
      <button
        onClick={onSave}
        disabled={saving || !form.name || !form.review}
        className="mt-1 bg-white text-[#0f0f0f] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {saving ? "Saving…" : "Save Review"}
      </button>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

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
  const bg = checked
    ? color === "emerald" ? "bg-emerald-500" : "bg-white"
    : "bg-white/15";
  const dot = checked
    ? color === "emerald" ? "bg-white translate-x-4" : "bg-[#0f0f0f] translate-x-4"
    : "bg-white translate-x-1";
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${bg}`}
      >
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
    ghost:   "text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5",
    primary: "text-white bg-white/10 hover:bg-white/15 border border-white/10",
    danger:  "text-red-400 hover:text-red-300 border border-red-500/15 hover:border-red-500/30 hover:bg-red-500/5",
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
