interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  loading,
  emptyMessage = "No records found",
}: Props<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-white/30 text-sm">
        Loading…
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-16 text-white/30 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-white/80 align-top">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
