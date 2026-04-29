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
      <div className="rounded-xl border border-white/8 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-white/5 last:border-0 bg-white/2 animate-pulse"
            style={{ opacity: 1 - i * 0.18 }}
          />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-white/8 border-dashed py-16 flex flex-col items-center gap-2 text-center">
        <span className="text-3xl opacity-30">📭</span>
        <p className="text-sm text-white/30">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/3 border-b border-white/8">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-white/3 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-white/75 align-middle">
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
    </div>
  );
}
