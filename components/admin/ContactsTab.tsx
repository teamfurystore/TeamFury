"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminContacts, deleteContact, type Contact } from "@/features/contacts/contactsSlice";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import DeleteConfirm from "./DeleteConfirm";

export default function ContactsTab() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError, deleteLoading } = useAppSelector((s) => s.contacts);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  useEffect(() => { 
    dispatch(fetchAdminContacts()); 
  },
   [dispatch]);

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
        <div className="flex gap-1.5">
          <Btn variant="ghost" onClick={() => setViewing(row)}>View</Btn>
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
          <p className="text-sm font-medium text-white">Contact Submissions</p>
          <p className="text-xs text-white/40 mt-0.5">
            {listLoading ? "Loading…" : `${list.length} message${list.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Btn variant="ghost" onClick={() => dispatch(fetchAdminContacts())} disabled={listLoading}>
          {listLoading ? "Refreshing…" : "↻ Refresh"}
        </Btn>
      </div>

      {listError && <Alert>{listError}</Alert>}

      <AdminTable columns={columns} data={list} loading={listLoading} emptyMessage="No contact submissions yet" />

      {/* View modal */}
      {viewing && (
        <AdminModal title="Contact Message" onClose={() => setViewing(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="Name"    value={viewing.name} />
              <InfoRow label="Email"   value={viewing.email} />
              <InfoRow label="Phone"   value={viewing.phone || "—"} />
              <InfoRow label="Subject" value={viewing.subject} />
              <InfoRow
                label="Received"
                value={new Date(viewing.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium", timeStyle: "short",
                })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/40 font-medium">Message</span>
              <p className="text-sm text-white/80 bg-white/4 border border-white/8 rounded-xl px-4 py-3 leading-relaxed whitespace-pre-wrap">
                {viewing.message}
              </p>
            </div>
            <a
              href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
              className="text-center text-sm font-medium text-white bg-white/8 hover:bg-white/12 border border-white/10 py-2.5 rounded-xl transition-colors"
            >
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-sm text-white/80">{value}</span>
    </div>
  );
}

// ── Shared micro-components ───────────────────────────────────────────────────

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
      {children}
    </div>
  );
}

function Btn({
  children, onClick, disabled, variant = "ghost",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "ghost" | "primary" | "danger";
}) {
  const styles = {
    ghost:   "text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5",
    primary: "text-white bg-white/10 hover:bg-white/15 border border-white/10",
    danger:  "text-red-400 hover:text-red-300 border border-red-500/15 hover:border-red-500/30 hover:bg-red-500/5",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
