"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";

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
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data: rows } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact submission?")) return;
    setDeleting(id);
    await supabase.from("contacts").delete().eq("id", id);
    setData((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    {
      key: "created_at",
      label: "Date",
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
          <h2 className="font-bold text-white">Contact Submissions</h2>
          <p className="text-xs text-white/40 mt-0.5">{data.length} total</p>
        </div>
        <button
          onClick={load}
          className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} emptyMessage="No contact submissions yet" />

      {viewing && (
        <AdminModal title="Contact Message" onClose={() => setViewing(null)}>
          <div className="flex flex-col gap-3 text-sm">
            <Row label="Name" value={viewing.name} />
            <Row label="Email" value={viewing.email} />
            <Row label="Phone" value={viewing.phone || "—"} />
            <Row label="Subject" value={viewing.subject} />
            <Row label="Date" value={new Date(viewing.created_at).toLocaleString("en-IN")} />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40 font-medium">Message</span>
              <p className="text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap">
                {viewing.message}
              </p>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-white/40 font-medium">{label}</span>
      <span className="text-white/80">{value}</span>
    </div>
  );
}
