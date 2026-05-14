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
  today: "اليوم",
  "7d": "آخر 7 أيام",
  "30d": "آخر 30 يوم",
  "90d": "آخر 3 أشهر",
  custom: "تاريخ مخصص",
};

// ── Status chart colors ────────────────────────────────────────────────

const STATUS_PIE_COLORS: Record<string, string> = {
  new: "#3b82f6",
  confirmed: "#0d9488",
  processing: "#f59e0b",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
  returned: "#f97316",
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-teal-600/20 text-teal-400 font-medium text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          الرئيسية
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
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
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Sidebar />

      <main className="md:mr-60 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">لوحة الرئيسية</h1>
            <p className="text-sm text-slate-500 mt-0.5">نظرة عامة على المتجر</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Date range picker */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {PRESET_LABELS[preset]}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showPresets && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 min-w-[160px] py-1">
                  {(Object.keys(PRESET_LABELS) as Preset[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPreset(p); setShowPresets(false); }}
                      className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${preset === p ? "text-teal-600 font-medium" : "text-slate-700"}`}
                    >
                      {PRESET_LABELS[p]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {preset === "custom" && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            )}

            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              title="تحديث"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <MetricCard
            label="إجمالي الإيرادات"
            value={metrics ? formatMAD(metrics.total_revenue) : "—"}
            sub={`${metrics?.total_orders ?? 0} طلب`}
            icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
            color="bg-teal-50"
          />
          <MetricCard
            label="متوسط قيمة الطلب"
            value={metrics ? formatMAD(metrics.avg_order_value) : "—"}
            sub="AOV"
            icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
            color="bg-blue-50"
          />
          <MetricCard
            label="معدل قبول العرض الإضافي"
            value={metrics ? `${metrics.upsell_rate}%` : "—"}
            sub={`${metrics?.upsell_accepted ?? 0} / ${metrics?.upsell_shown ?? 0} ظهور`}
            icon={<Percent className="w-5 h-5 text-amber-600" />}
            color="bg-amber-50"
          />
          <MetricCard
            label="نجاح الإرسال للشيت"
            value={metrics ? `${metrics.sheet_success_rate}%` : "—"}
            sub="Google Sheets sync"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            color="bg-emerald-50"
          />
        </div>

        {/* Charts row 1: Revenue area chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm">الإيرادات والطلبات يومياً</h2>
            {mounted && metrics && metrics.orders_by_day.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={metrics.orders_by_day}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={(v: string) => v.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="right"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    width={40}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="left"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    width={30}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(value, name) =>
                      name === "revenue"
                        ? [`${Number(value).toLocaleString()} MAD`, "الإيرادات"]
                        : [value, "الطلبات"]
                    }
                    labelFormatter={(l) => `📅 ${l}`}
                  />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0d9488"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                  <Area
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#ordersGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-300 text-sm">
                {loading ? "جاري التحميل..." : "لا توجد بيانات في هذه الفترة"}
              </div>
            )}
          </div>

          {/* Status pie */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm">توزيع الحالات</h2>
            {mounted && statusEntries.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusEntries}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusEntries.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v, _name, item) => [v, (item?.payload as { name?: string })?.name ?? ""]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span style={{ fontSize: 11, color: "#64748b" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-300 text-sm">
                {loading ? "جاري التحميل..." : "لا توجد بيانات"}
              </div>
            )}
          </div>
        </div>

        {/* Charts row 2: Products + Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Products bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm">أداء المنتجات</h2>
            {mounted && metrics && metrics.top_products.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={metrics.top_products} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#475569" }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v) => [v, "طلبات"]}
                  />
                  <Bar dataKey="orders" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-slate-300 text-sm">
                {loading ? "جاري التحميل..." : "لا توجد بيانات"}
              </div>
            )}
          </div>

          {/* UTM Sources */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-4 text-sm">مصادر الزيارات</h2>
            {metrics && metrics.top_sources.length > 0 ? (
              <div className="space-y-2.5">
                {metrics.top_sources.map((src) => {
                  const max = metrics.top_sources[0]?.count || 1;
                  const pct = Math.round((src.count / max) * 100);
                  return (
                    <div key={src.source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 font-medium">{src.source}</span>
                        <span className="text-xs text-slate-500">{src.count} طلب</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-slate-300 text-sm">
                {loading ? "جاري التحميل..." : "لا توجد بيانات"}
              </div>
            )}
          </div>
        </div>

        {/* Products detail table */}
        {metrics && metrics.top_products.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm">تفاصيل المنتجات</h2>
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-right px-5 py-3 text-slate-500 font-medium">المنتج</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">الطلبات</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">الوحدات</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">الإيرادات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {metrics.top_products.map((p) => (
                    <tr key={p.product_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{p.name}</td>
                      <td className="px-4 py-3.5 text-slate-600">{p.orders}</td>
                      <td className="px-4 py-3.5 text-slate-600">{p.units}</td>
                      <td className="px-4 py-3.5 font-semibold text-teal-700">{formatMAD(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick link to orders */}
        <div className="text-center">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            عرض كل الطلبات
          </Link>
        </div>
      </main>
    </div>
  );
}
