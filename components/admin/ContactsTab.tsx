"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminContacts,
  deleteContact,
  type Contact,
} from "@/features/contacts/contactsSlice";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";

export default function ContactsTab() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError, deleteLoading } = useAppSelector(
    (s) => s.contacts
  );

  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  useEffect(() => { dispatch(fetchAdminContacts()); }, [dispatch]);

  async function handleDelete() {
    if (!deleteTarget) return;
    await dispatch(deleteContact(deleteTarget.id));
    setDeleteTarget(null);
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
          <button onClick={() => setViewing(row)}
            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors">
            View
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
          <h2 className="font-bold text-white">Contact Submissions</h2>
          <p className="text-xs text-white/40 mt-0.5">
            {listLoading ? "Loading…" : `${list.length} total`}
          </p>
        </div>
        <button onClick={() => dispatch(fetchAdminContacts())} disabled={listLoading}
          className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40">
          {listLoading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {listError && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {listError}
        </div>
      )}

      <AdminTable columns={columns} data={list} loading={listLoading} emptyMessage="No contact submissions yet" />

      {viewing && (
        <AdminModal title="Contact Message" onClose={() => setViewing(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <Row label="Name"    value={viewing.name} />
              <Row label="Email"   value={viewing.email} />
              <Row label="Phone"   value={viewing.phone || "—"} />
              <Row label="Subject" value={viewing.subject} />
            </div>
            <Row label="Received"
              value={new Date(viewing.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Message</span>
              <p className="text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap text-sm">
                {viewing.message}
              </p>
            </div>
            <a href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
              className="mt-1 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors">
              Reply via Email
            </a>
          </div>
        </AdminModal>
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={`Delete message from "${deleteTarget.name}"?`}
          description="This will permanently remove the contact submission."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading === deleteTarget.id}
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
