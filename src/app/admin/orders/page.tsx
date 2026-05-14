"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
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
  isAdminLoggedIn,
  formatMAD,
  formatDate,
  STATUS_LABELS,
  STATUS_COLORS,
  ALL_STATUSES,
  type OrderSummary,
} from "@/lib/admin-api";
import OrderPreviewModal from "@/components/admin/OrderPreviewModal";
import { Sidebar } from "@/components/admin/Sidebar";

import { StatusBadge } from "@/components/admin/StatusBadge";

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
    <div className="min-h-screen bg-[#F8FAFC]" dir="ltr">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
            <p className="text-sm text-slate-500 mt-1">{total} total orders found</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="self-start sm:self-auto p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confirmed</p>
              <p className="font-bold text-slate-900 text-xl mt-0.5">
                {orders.filter((o) => o.status === "confirmed" || o.status === "sent_to_sheet").length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Delivered</p>
              <p className="font-bold text-slate-900 text-xl mt-0.5">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cancelled</p>
              <p className="font-bold text-slate-900 text-xl mt-0.5">
                {orders.filter((o) => o.status === "cancelled" || o.status === "returned").length}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Date filters */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, phone, or order ID..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Filter className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50/50 focus:bg-white transition-all"
              />
              <span className="text-slate-300 font-medium text-sm">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {statusTabs.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === s
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "all" ? "All Statuses" : STATUS_LABELS[s] ?? s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Orders table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px] text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Order ID</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Date</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Customer</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase hidden lg:table-cell">Phone</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Products</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Total</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Status</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase text-center hidden md:table-cell">Upsell</th>
                  <th className="px-5 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase hidden xl:table-cell">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-3 text-teal-500" />
                      Loading orders...
                    </td>
                  </tr>
                )}
                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-500 text-sm">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>
                      No orders match your criteria
                    </td>
                  </tr>
                )}
                {!loading && orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setPreviewId(order.public_id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-medium text-slate-500 group-hover:text-teal-600 transition-colors">
                        {order.public_id}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">{order.full_name}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="font-mono text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md">{order.phone}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-600 text-sm">{order.items_summary}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        {formatMAD(order.total)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-center hidden md:table-cell">
                      {order.upsell_accepted ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      {order.utm_source ? (
                        <span className="text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                          {order.utm_source}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Direct</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-4">
              <p className="text-sm font-medium text-slate-500">
                Page {page} of {totalPages} <span className="text-slate-400 font-normal">({total} total orders)</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                        pageNum === page
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
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
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
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
