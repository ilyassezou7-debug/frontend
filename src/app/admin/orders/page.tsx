"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import {
  adminApi,
  clearAdminToken,
  isAdminLoggedIn,
  formatMAD,
  formatDate,
  STATUS_LABELS,
  STATUS_COLORS,
  ALL_STATUSES,
  type OrderSummary,
} from "@/lib/admin-api";
import OrderPreviewModal from "@/components/admin/OrderPreviewModal";

// ── Sidebar ────────────────────────────────────────────────────────────

function Sidebar() {
  const router = useRouter();
  function logout() {
    clearAdminToken();
    router.push("/admin/login");
  }
  return (
    <aside className="hidden md:flex flex-col w-60 bg-slate-900 min-h-screen p-4 fixed top-0 right-0 bottom-0 z-10">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">AP</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">AtlasPure</p>
          <p className="text-slate-500 text-xs">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          الرئيسية
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-teal-600/20 text-teal-400 font-medium text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          الطلبات
        </Link>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors mt-4"
      >
        <LogOut className="w-4 h-4" />
        خروج
      </button>
    </aside>
  );
}

// ── Status badge ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ring-1 whitespace-nowrap ${STATUS_COLORS[status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ── Orders page ────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Preview modal
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) router.replace("/admin/login");
  }, [router]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getOrders({
        page,
        per_page: 25,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
        start: startDate || undefined,
        end: endDate || undefined,
      });
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch, startDate, endDate]);

  function handleStatusChanged(publicId: string, status: string) {
    setOrders((prev) =>
      prev.map((o) => (o.public_id === publicId ? { ...o, status } : o))
    );
  }

  const statusTabs = ["all", ...ALL_STATUSES];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Sidebar />

      <main className="md:mr-60 p-4 md:p-6 lg:p-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">الطلبات</h1>
            <p className="text-sm text-slate-500 mt-0.5">{total} طلب إجمالاً</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="self-start sm:self-auto p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search + Date filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم العميل أو رقم الهاتف أو ID الطلب..."
                className="w-full border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <span className="text-slate-300 text-sm">←</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {statusTabs.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  statusFilter === s
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "all" ? "الكل" : STATUS_LABELS[s] ?? s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Orders table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">رقم الطلب</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">التاريخ</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">العميل</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs hidden lg:table-cell">الهاتف</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">المنتجات</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">الإجمالي</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs">الحالة</th>
                  <th className="text-center px-4 py-3 text-slate-500 font-semibold text-xs hidden md:table-cell">Upsell</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs hidden xl:table-cell">المصدر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-400" />
                      جاري التحميل...
                    </td>
                  </tr>
                )}
                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                      لا توجد طلبات مطابقة
                    </td>
                  </tr>
                )}
                {!loading && orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setPreviewId(order.public_id)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-teal-600 transition-colors">
                        {order.public_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800">{order.full_name}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="font-mono text-xs text-slate-500" dir="ltr">{order.phone}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600 text-xs">{order.items_summary}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-teal-700 whitespace-nowrap">
                        {formatMAD(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center hidden md:table-cell">
                      {order.upsell_accepted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      {order.utm_source ? (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {order.utm_source}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">مباشر</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                صفحة {page} من {totalPages} ({total} طلب)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === page
                          ? "bg-teal-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">مؤكد</p>
              <p className="font-bold text-slate-800 text-sm">
                {orders.filter((o) => o.status === "confirmed" || o.status === "sent_to_sheet").length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">تم التوصيل</p>
              <p className="font-bold text-slate-800 text-sm">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">ملغي</p>
              <p className="font-bold text-slate-800 text-sm">
                {orders.filter((o) => o.status === "cancelled" || o.status === "returned").length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Order Preview Modal */}
      <OrderPreviewModal
        publicId={previewId}
        onClose={() => setPreviewId(null)}
        onStatusChanged={handleStatusChanged}
      />
    </div>
  );
}
