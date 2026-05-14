import { STATUS_LABELS, STATUS_COLORS } from "@/lib/admin-api";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase whitespace-nowrap ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
