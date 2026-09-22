"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  TrendingUp,
  Package,
  Percent,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  BarChart2,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  adminApi,
  clearAdminToken,
  isAdminLoggedIn,
  formatMAD,
  STATUS_LABELS,
  STATUS_COLORS,
  type MetricsResponse,
} from "@/lib/admin-api";

// ── Date range presets ─────────────────────────────────────────────────

type Preset = "today" | "7d" | "30d" | "90d" | "custom";

function getDateRange(preset: Preset, customStart?: string, customEnd?: string) {
  const now = new Date();
  const end = now.toISOString();
  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { start: start.toISOString(), end };
  }
  if (preset === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { start: start.toISOString(), end };
  }
  if (preset === "90d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 90);
    return { start: start.toISOString(), end };
  }
  if (preset === "custom") {
    return { start: customStart ?? "", end: customEnd ?? "" };
  }
  // default 30d
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  return { start: start.toISOString(), end };
}

const PRESET_LABELS: Record<Preset, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 3 months",
  custom: "Custom range",
};

// ── Status chart colors ────────────────────────────────────────────────

const STATUS_PIE_COLORS: Record<string, string> = {
  new: "#3b82f6", // blue
  confirmed: "#0ea5e9", // teal
  processing: "#f59e0b", // amber
  shipped: "#8b5cf6", // purple
  delivered: "#10b981", // emerald
  cancelled: "#ef4444", // red
  returned: "#f97316", // orange
  sent_to_sheet: "#10b981",
  sheet_failed: "#ef4444",
};

// ── Metric card ────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, sub, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        {sub && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{sub}</span>}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

import { Sidebar } from "@/components/admin/Sidebar";

// ── Main dashboard ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preset, setPreset] = useState<Preset>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) router.replace("/admin/login");
  }, [router]);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const range = getDateRange(preset, customStart, customEnd);
      const data = await adminApi.getMetrics(range);
      setMetrics(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [preset, customStart, customEnd]);

  useEffect(() => {
    if (mounted) fetchMetrics();
  }, [mounted, fetchMetrics]);

  if (!mounted) return null;

  const statusEntries = metrics
    ? Object.entries(metrics.orders_by_status).map(([k, v]) => ({
        name: STATUS_LABELS[k] ?? k,
        value: v,
        color: STATUS_PIE_COLORS[k] ?? "#94a3b8",
      }))
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="ltr">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Date range picker */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                {PRESET_LABELS[preset]}
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>
              {showPresets && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-[200px] py-1.5">
                  {(Object.keys(PRESET_LABELS) as Preset[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPreset(p); setShowPresets(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${preset === p ? "text-teal-600 font-semibold bg-teal-50/50" : "text-slate-700 font-medium"}`}
                    >
                      {PRESET_LABELS[p]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {preset === "custom" && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 shadow-sm">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="px-2 py-2 text-sm text-slate-700 focus:outline-none bg-transparent"
                />
                <span className="text-slate-300">→</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="px-2 py-2 text-sm text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            )}

            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 ml-1"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Revenue"
            value={metrics ? formatMAD(metrics.total_revenue) : "—"}
            sub={`${metrics?.total_orders ?? 0} orders`}
            icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
            color="bg-teal-50"
          />
          <MetricCard
            label="Average Order Value"
            value={metrics ? formatMAD(metrics.avg_order_value) : "—"}
            sub="AOV"
            icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
            color="bg-blue-50"
          />
          <MetricCard
            label="Upsell Conversion"
            value={metrics ? `${metrics.upsell_rate}%` : "—"}
            sub={`${metrics?.upsell_accepted ?? 0} / ${metrics?.upsell_shown ?? 0} views`}
            icon={<Percent className="w-5 h-5 text-amber-600" />}
            color="bg-amber-50"
          />
          <MetricCard
            label="Sheets Sync Rate"
            value={metrics ? `${metrics.sheet_success_rate}%` : "—"}
            sub="Google Sheets"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            color="bg-emerald-50"
          />
        </div>

        {/* Charts row 1: Revenue area chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-6 text-base flex items-center gap-2">
              Revenue & Orders
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Daily</span>
            </h2>
            {mounted && metrics && metrics.orders_by_day.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={metrics.orders_by_day} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(v: string) => v.slice(5)}
                    interval="preserveStartEnd"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    hide
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(value, name) =>
                      name === "revenue"
                        ? [`${Number(value).toLocaleString()} MAD`, "Revenue"]
                        : [value, "Orders"]
                    }
                    labelFormatter={(l) => `Date: ${l}`}
                  />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="url(#revenueGrad)"
                    activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Area
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {loading ? "Loading data..." : "No data available"}
              </div>
            )}
          </div>

          {/* Status pie */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
            <h2 className="font-semibold text-slate-800 mb-2 text-base">Order Status</h2>
            <p className="text-sm text-slate-500 mb-6">Current distribution</p>
            {mounted && statusEntries.length > 0 ? (
              <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusEntries}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusEntries.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      formatter={(v, _name, item) => [v, (item?.payload as { name?: string })?.name ?? ""]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, color: "#475569" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {loading ? "Loading data..." : "No data available"}
              </div>
            )}
          </div>
        </div>

        {/* Charts row 2: Products + Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Products bar */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-6 text-base">Top Products</h2>
            {mounted && metrics && metrics.top_products.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={metrics.top_products} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }}
                    width={100}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(v) => [v, "Orders"]}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="orders" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {loading ? "Loading data..." : "No data available"}
              </div>
            )}
          </div>

          {/* UTM Sources */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col">
            <h2 className="font-semibold text-slate-800 mb-6 text-base">Traffic Sources</h2>
            {metrics && metrics.top_sources.length > 0 ? (
              <div className="space-y-4 flex-1">
                {metrics.top_sources.map((src) => {
                  const max = metrics.top_sources[0]?.count || 1;
                  const pct = Math.round((src.count / max) * 100);
                  return (
                    <div key={src.source}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-slate-700 font-medium capitalize">{src.source}</span>
                        <span className="text-sm font-semibold text-slate-900">{src.count} <span className="text-xs font-normal text-slate-500">orders</span></span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {loading ? "Loading data..." : "No data available"}
              </div>
            )}
          </div>
        </div>

        {/* Products detail table */}
        {metrics && metrics.top_products.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-8 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="font-semibold text-slate-800 text-base">Product Performance Details</h2>
              <Package className="w-5 h-5 text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-3.5 text-slate-500 font-semibold">Product</th>
                    <th className="px-6 py-3.5 text-slate-500 font-semibold">Orders</th>
                    <th className="px-6 py-3.5 text-slate-500 font-semibold">Units Sold</th>
                    <th className="px-6 py-3.5 text-slate-500 font-semibold">Revenue generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.top_products.map((p) => (
                    <tr key={p.product_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.orders}</td>
                      <td className="px-6 py-4 text-slate-600">{p.units}</td>
                      <td className="px-6 py-4 font-semibold text-teal-700">{formatMAD(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick link to orders */}
        <div className="flex justify-center pb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 py-3 text-sm font-medium shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4" />
            View All Orders
          </Link>
        </div>
      </main>
    </div>
  );
}
