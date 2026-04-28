"use client";

import { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactsTab() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Uses the authenticated GET /api/contact endpoint
      // The sb-access-token cookie is sent automatically by the browser
      const res = await fetch("/api/contact", { credentials: "include" });
      if (res.status === 401) throw new Error("Session expired — please log in again.");
      if (!res.ok) throw new Error("Failed to load contacts.");
      const json: Contact[] = await res.json();
      // Sort newest first (API may not guarantee order)
      json.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    // Optimistic remove
    setData((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    try {
      const res = await fetch(`/api/contact?id=${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) await load(); // rollback on failure
    } catch {
      await load();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns = [
    { key: "name",    label: "Name" },
    { key: "email",   label: "Email" },
    { key: "subject", label: "Subject" },
    {
      key: "created_at",
      label: "Received",
      render: (row: Contact) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
    },
    {
      key: "actions",
      label: "",
      render: (row: Contact) => (
        <div className="flex gap-2">
          <button
            onClick={() => setViewing(row)}
            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors"
          >
            View
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-white">Contact Submissions</h2>
          <p className="text-xs text-white/40 mt-0.5">
            {loading ? "Loading…" : `${data.length} total`}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No contact submissions yet"
      />

      {/* View modal */}
      {viewing && (
        <AdminModal title="Contact Message" onClose={() => setViewing(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <Row label="Name"    value={viewing.name} />
              <Row label="Email"   value={viewing.email} />
              <Row label="Phone"   value={viewing.phone || "—"} />
              <Row label="Subject" value={viewing.subject} />
            </div>
            <Row
              label="Received"
              value={new Date(viewing.created_at).toLocaleString("en-IN", {
                dateStyle: "medium", timeStyle: "short",
              })}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Message</span>
              <p className="text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap text-sm">
                {viewing.message}
              </p>
            </div>
            <a
              href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
              className="mt-1 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Reply via Email
            </a>
          </div>
        </AdminModal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteConfirm
          title={`Delete message from "${deleteTarget.name}"?`}
          description="This will permanently remove the contact submission."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-white/80 text-sm">{value}</span>
    </div>
  );
}
