"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Zap,
  Tag,
  PackageCheck,
  Truck,
  RotateCcw,
  BadgeDollarSign,
  Gift,
  ShieldCheck,
  CalendarRange,
} from "lucide-react";
import { adminApi, isAdminLoggedIn } from "@/lib/admin-api";
import { Sidebar } from "@/components/admin/Sidebar";

// ── Helpers ────────────────────────────────────────────────────────────

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function dh(n: number) {
  if (!isFinite(n)) return "— DH";
  return `${n.toLocaleString("fr-MA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
}

function dh2(n: number) {
  if (!isFinite(n)) return "— DH";
  return `${n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
}

// ── Date range helpers ─────────────────────────────────────────────────

type RangePreset = "today" | "7d" | "30d" | "this_month" | "all" | "custom";

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function presetRange(preset: RangePreset): { start: string; end: string } {
  const today = new Date();
  const end = toISO(today);
  if (preset === "today") return { start: end, end };
  if (preset === "7d") {
    const s = new Date(today); s.setDate(today.getDate() - 6);
    return { start: toISO(s), end };
  }
  if (preset === "30d") {
    const s = new Date(today); s.setDate(today.getDate() - 29);
    return { start: toISO(s), end };
  }
  if (preset === "this_month") {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: toISO(s), end };
  }
  return { start: "2020-01-01", end };
}

const PRESET_LABELS: Record<RangePreset, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  this_month: "This month",
  all: "All time",
  custom: "Custom",
};

// ── COD Pricing Rules (MAD) ────────────────────────────────────────────
const PROFIT_RULES: Record<1 | 2 | 3, number> = {
  1: 30,
  2: 50,
  3: 70,
};

interface InputFieldProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  highlight?: boolean;
  badge?: string;
  disabled?: boolean;
}

function InputField({
  label, sublabel, value, onChange, prefix, suffix, step = 0.01,
  min = 0, max, highlight, badge, disabled,
}: InputFieldProps) {
  return (
    <div className={`rounded-xl p-3.5 border transition-all ${highlight ? "bg-teal-50/60 border-teal-200" : "bg-slate-50 border-slate-200"}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        {badge && (
          <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{badge}</span>
        )}
      </div>
      {sublabel && <p className="text-[10px] text-slate-400 mb-2">{sublabel}</p>}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          className={`w-full border rounded-lg py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:outline-none bg-white border-slate-200 transition-all ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-8" : "pr-3"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, sub, colored, positive }: {
  label: string; value: string; sub?: string;
  colored?: boolean; positive?: boolean;
}) {
  const color = colored
    ? (positive ? "text-emerald-600" : "text-red-600")
    : "text-slate-900";
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

function KpiCard({ label, value, sub, color = "slate" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200 text-slate-900",
    green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    red:   "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue:  "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color] ?? colors.slate}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-2xl font-black leading-tight">{value}</p>
      {sub && <p className="text-[11px] opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

function FunnelStep({ label, count, rate, color }: {
  label: string; count: number; rate?: string; color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-2 ${color}`}>
        {count.toLocaleString()}
      </div>
      <p className="text-xs font-bold text-slate-700 mt-2">{label}</p>
      {rate && <p className="text-[10px] text-slate-400">{rate}</p>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loadingAov, setLoadingAov] = useState(true);

  // ── Date range (drives AOV + Avg Units)
  const [preset, setPreset] = useState<RangePreset>("30d");
  const initial = useMemo(() => presetRange("30d"), []);
  const [startDate, setStartDate] = useState<string>(initial.start);
  const [endDate, setEndDate] = useState<string>(initial.end);

  // ── Period metrics (from API, MAD)
  const [aovMad, setAovMad] = useState<number>(299);
  const [avgUnits, setAvgUnits] = useState<number>(1.5);
  const [periodOrders, setPeriodOrders] = useState<number>(0);
  const [periodRevenue, setPeriodRevenue] = useState<number>(0);

  // ── COD funnel
  const [confRate, setConfRate]     = useState<number>(60);
  const [deliveryRate, setDeliveryRate] = useState<number>(65);

  // ── Costs (MAD)
  const [productCostMad, setProductCostMad] = useState<number>(30);
  const [fixedCostsMad, setFixedCostsMad]   = useState<number>(70);

  // ── Scale scenario
  const [leads, setLeads] = useState<number>(200);
  const [cpl, setCpl]     = useState<number>(25);

  // ── MAD Pricing Calculator
  const [pricingQty, setPricingQty]         = useState<1 | 2 | 3>(1);
  const [pProductCost, setPProductCost]     = useState<number>(30);
  const [pShippingCost, setPShippingCost]   = useState<number>(25);
  const [pCodFees, setPCodFees]             = useState<number>(20);
  const [pCpl, setPCpl]                     = useState<number>(5);
  const [pConfRate, setPConfRate]           = useState<number>(50);
  const [pDelivRate, setPDelivRate]         = useState<number>(50);
  const [pUserPrice, setPUserPrice]         = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) { router.replace("/admin/login"); return; }
  }, [router]);

  // Reload metrics whenever date range changes
  useEffect(() => {
    if (!mounted) return;
    if (!startDate || !endDate) return;
    setLoadingAov(true);

    adminApi.getMetrics({ start: startDate, end: endDate })
      .then((data) => {
        setPeriodOrders(data.total_orders || 0);
        setPeriodRevenue(data.total_revenue || 0);

        // AOV = Total Revenue / Number of Orders within selected date range
        const computedAov = data.total_orders > 0
          ? data.total_revenue / data.total_orders
          : data.avg_order_value || 0;
        if (computedAov > 0) setAovMad(+computedAov.toFixed(0));

        // Avg Units per Order = Total Units Sold / Number of Orders within selected date range
        if (data.top_products?.length) {
          const totOrders = data.top_products.reduce((s, p) => s + p.orders, 0);
          const totUnits  = data.top_products.reduce((s, p) => s + p.units, 0);
          if (totOrders > 0) setAvgUnits(+(totUnits / totOrders).toFixed(2));
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAov(false));
  }, [mounted, startDate, endDate]);

  if (!mounted) return null;

  // ── Range preset handlers
  const applyPreset = (p: RangePreset) => {
    setPreset(p);
    if (p !== "custom") {
      const { start, end } = presetRange(p);
      setStartDate(start);
      setEndDate(end);
    }
  };

  // ── Derived: unit economics (all MAD)
  const cogsPerOrder         = productCostMad * avgUnits;
  const totalCostPerDelivered = cogsPerOrder + fixedCostsMad;
  const grossMargin           = aovMad - totalCostPerDelivered;

  const cr = confRate   / 100;
  const dr = deliveryRate / 100;

  // Break-even thresholds (MAD)
  const beCpl  = cr * dr * grossMargin;
  const beCpa  = dr * grossMargin;
  const beCpdo = grossMargin;

  // ── Derived: scale scenario
  const confirmed  = Math.round(leads * cr);
  const delivered  = Math.round(confirmed * dr);

  const revenue    = delivered * aovMad;
  const adSpend    = leads * cpl;
  const cogsCost   = delivered * cogsPerOrder;
  const fixedCost  = delivered * fixedCostsMad;
  const totalCost  = adSpend + cogsCost + fixedCost;

  const netProfit       = revenue - totalCost;
  const roas            = adSpend > 0 ? revenue / adSpend : 0;
  const roi             = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const margin          = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const profitPerDel    = delivered > 0 ? netProfit / delivered : 0;
  const realCpdo        = delivered > 0 ? adSpend / delivered : 0;

  const isProfit        = netProfit >= 0;
  const cplVsBe         = cpl - beCpl;
  const cplPctFromBe    = beCpl > 0 ? (cplVsBe / beCpl) * 100 : 0;

  // ── MAD Pricing Calculator derived values
  const pCr              = Math.max(pConfRate, 1) / 100;
  const pDr              = Math.max(pDelivRate, 1) / 100;
  const pLeadsPerDel     = 1 / (pCr * pDr);
  const pShipsPerDel     = 1 / pDr;
  const pTargetProfit    = PROFIT_RULES[pricingQty];
  const pProductTotal    = pProductCost * pricingQty;
  const pShippingTotal   = pShippingCost * pShipsPerDel;
  const pAdTotal         = pCpl * pLeadsPerDel;
  const pBreakEven       = pProductTotal + pShippingTotal + pCodFees + pAdTotal;
  const pRecommended     = pBreakEven + pTargetProfit;
  const pUserProfit      = pUserPrice - pBreakEven;
  const pIsGreen         = pUserPrice > 0 && pUserProfit >= pTargetProfit;
  const pIsRed           = pUserPrice > 0 && pUserProfit < 0;
  const pIsOk            = pUserPrice > 0 && pUserProfit >= 0 && !pIsGreen;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="ltr">
      <Sidebar />

      <main className="md:ml-64">
        {/* Hero header */}
        <div className="bg-slate-900 px-8 py-8">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calculator className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400">COD Profit Calculator</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Know Your Numbers.</h1>
              <p className="text-slate-400 text-sm mt-1">
                AOV recalculated live from the date range you choose. Everything in MAD.
              </p>
            </div>

            {/* Period AOV pill */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center">
              {loadingAov ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400 mx-auto" />
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                    Period AOV · {PRESET_LABELS[preset]}
                  </p>
                  <p className="text-2xl font-black text-white">{dh(aovMad)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {periodOrders} orders · {avgUnits} units avg
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 space-y-10">

          {/* ═══════════════════════════════════════════════════════════
              DATE RANGE SELECTOR
          ═══════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarRange className="w-4 h-4 text-teal-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-700">Date Range</p>
              <span className="text-[11px] text-slate-400">— AOV &amp; Avg Units recalculate automatically</span>
              {loadingAov && <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-500 ml-1" />}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["today", "7d", "30d", "this_month", "all", "custom"] as RangePreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    preset === p
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {PRESET_LABELS[p]}
                </button>
              ))}

              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPreset("custom"); }}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-400/40 focus:outline-none"
                />
                <span className="text-xs text-slate-400">→</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPreset("custom"); }}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-400/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Orders</p>
                <p className="text-lg font-black text-slate-900">{periodOrders.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Revenue</p>
                <p className="text-lg font-black text-slate-900">{dh(periodRevenue)}</p>
              </div>
              <div className="rounded-xl bg-teal-50 border border-teal-200 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">AOV</p>
                <p className="text-lg font-black text-teal-700">{dh(aovMad)}</p>
              </div>
              <div className="rounded-xl bg-teal-50 border border-teal-200 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Avg Units / Order</p>
                <p className="text-lg font-black text-teal-700">{avgUnits.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SECTION 1 — BREAK-EVEN CALCULATOR
          ═══════════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm">1</div>
              <h2 className="text-lg font-black text-slate-900">Break-Even Calculator</h2>
              <span className="text-xs text-slate-400 font-medium">— What CPL can you NOT exceed?</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Your Variables</p>

                <InputField
                  label={`Period AOV (MAD) · ${PRESET_LABELS[preset]}`}
                  sublabel={`From ${periodOrders} orders in selected range`}
                  value={aovMad}
                  onChange={setAovMad}
                  badge="Auto"
                  suffix="DH"
                  step={1}
                  highlight
                />
                <InputField
                  label="Avg Units per Order"
                  sublabel="Calculated from orders in selected range"
                  value={avgUnits}
                  onChange={setAvgUnits}
                  step={0.1}
                  badge="Auto"
                  highlight
                />
                <InputField
                  label="Product Cost (MAD / unit)"
                  value={productCostMad}
                  onChange={setProductCostMad}
                  suffix="DH"
                  step={1}
                />
                <InputField
                  label="Fixed Costs (MAD / delivered order)"
                  sublabel="Shipping, packaging, call center, etc."
                  value={fixedCostsMad}
                  onChange={setFixedCostsMad}
                  suffix="DH"
                  step={1}
                />
                <InputField
                  label="Confirmation Rate"
                  value={confRate}
                  onChange={setConfRate}
                  suffix="%"
                  step={1}
                  max={100}
                />
                <InputField
                  label="Delivery Rate"
                  value={deliveryRate}
                  onChange={setDeliveryRate}
                  suffix="%"
                  step={1}
                  max={100}
                />
              </div>

              {/* Break-even results */}
              <div className="lg:col-span-8 flex flex-col gap-5">

                {/* Per-order breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-700">Unit Economics — per Delivered Order</p>
                    <p className="text-xs text-slate-400 mt-0.5">Where does every {dh(aovMad)} go?</p>
                  </div>
                  <div className="px-6 py-4">
                    <Row label="Revenue (AOV)" value={dh(aovMad)} />
                    <Row
                      label="COGS"
                      sub={`${avgUnits} units × ${dh(productCostMad)}`}
                      value={`− ${dh(cogsPerOrder)}`}
                    />
                    <Row
                      label="Fixed Costs"
                      sub="Shipping · Packaging · Call center"
                      value={`− ${dh(fixedCostsMad)}`}
                    />
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Gross Margin (before ads)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Money left to pay for your ad spend</p>
                      </div>
                      <p className={`text-2xl font-black ${grossMargin > 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {dh(grossMargin)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Break-even targets */}
                <div className="bg-slate-900 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

                  <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-5 relative z-10">Break-Even Thresholds</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden relative z-10">
                    <div className="bg-slate-900/80 px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Max CPL</p>
                      <p className="text-3xl font-black text-emerald-400">{dh(beCpl)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per lead — do not exceed</p>
                    </div>
                    <div className="bg-slate-900/80 px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Max CPA (Confirmed)</p>
                      <p className="text-3xl font-black text-amber-400">{dh(beCpa)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per confirmed order</p>
                    </div>
                    <div className="bg-slate-900/80 px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Max CPDO</p>
                      <p className="text-3xl font-black text-blue-400">{dh(beCpdo)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per delivered order</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-4 relative z-10">
                    <span className="font-bold text-slate-400">Formula:</span>{" "}
                    Max CPL = CR × DR × Gross Margin = {pct(confRate)} × {pct(deliveryRate)} × {dh(grossMargin)} = <span className="text-emerald-400 font-bold">{dh(beCpl)}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-200" />

          {/* ═══════════════════════════════════════════════════════════
              SECTION 2 — PROFIT AT SCALE
          ═══════════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm">2</div>
              <h2 className="text-lg font-black text-slate-900">Profit Projector</h2>
              <span className="text-xs text-slate-400 font-medium">— What happens when you scale?</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Scenario inputs */}
              <div className="lg:col-span-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Your Ad Scenario</p>

                <InputField
                  label="Number of Leads"
                  sublabel="Total leads your ads will generate"
                  value={leads}
                  onChange={setLeads}
                  step={10}
                  min={1}
                />
                <InputField
                  label="Cost per Lead (CPL)"
                  sublabel="Your current or target CPL"
                  value={cpl}
                  onChange={setCpl}
                  suffix="DH"
                  step={1}
                  min={0}
                />

                {/* CPL health indicator */}
                <div className={`rounded-xl p-4 border-2 ${isProfit ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-300"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isProfit
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      : <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <p className={`text-xs font-bold ${isProfit ? "text-emerald-700" : "text-red-700"}`}>
                      CPL is {isProfit ? "PROFITABLE" : "LOSING MONEY"}
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">
                    Your CPL <span className="font-bold text-slate-900">{dh(cpl)}</span> is{" "}
                    <span className={`font-bold ${isProfit ? "text-emerald-700" : "text-red-700"}`}>
                      {dh(Math.abs(cplVsBe))} {isProfit ? "below" : "above"}
                    </span>{" "}
                    break-even CPL{" "}
                    <span className="font-bold text-slate-900">{dh(beCpl)}</span>.
                  </p>
                  <div className="mt-3">
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isProfit ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, Math.abs(cplPctFromBe) + 40)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-slate-400">0 DH CPL</span>
                      <span className="text-[9px] text-emerald-600 font-bold">BE: {dh(beCpl)}</span>
                      <span className="text-[9px] text-red-500">Losing →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projection results */}
              <div className="lg:col-span-8 space-y-5">

                {/* Funnel */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">COD Funnel</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <FunnelStep
                      label="Leads"
                      count={leads}
                      color="bg-slate-100 border-slate-300 text-slate-900"
                    />
                    <div className="flex flex-col items-center">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">{pct(confRate)}</p>
                    </div>
                    <FunnelStep
                      label="Confirmed"
                      count={confirmed}
                      color="bg-blue-100 border-blue-300 text-blue-800"
                    />
                    <div className="flex flex-col items-center">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">{pct(deliveryRate)}</p>
                    </div>
                    <FunnelStep
                      label="Delivered"
                      count={delivered}
                      color="bg-emerald-100 border-emerald-400 text-emerald-800"
                    />
                    <div className="flex flex-col items-center">
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className={`rounded-2xl px-5 py-4 border-2 text-center ${isProfit ? "bg-emerald-50 border-emerald-400" : "bg-red-50 border-red-400"}`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Net Profit</p>
                      <p className={`text-2xl font-black ${isProfit ? "text-emerald-700" : "text-red-700"}`}>{dh(netProfit)}</p>
                    </div>
                  </div>
                </div>

                {/* P&L + KPIs side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* P&L Statement */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">P&amp;L Statement (MAD)</p>
                    </div>
                    <div className="px-5 py-4 space-y-0.5">
                      <Row label="Gross Revenue" value={dh(revenue)} sub={`${delivered} orders × ${dh(aovMad)}`} />
                      <Row label="Ad Spend" value={`− ${dh(adSpend)}`} sub={`${leads} leads × ${dh(cpl)}`} />
                      <Row label="COGS" value={`− ${dh(cogsCost)}`} sub={`${delivered} orders × ${dh(cogsPerOrder)}`} />
                      <Row label="Fixed Costs" value={`− ${dh(fixedCost)}`} sub={`${delivered} × ${dh(fixedCostsMad)}`} />
                      <div className="pt-3 mt-2 border-t-2 border-slate-200 flex justify-between items-center">
                        <p className="text-sm font-black text-slate-900">Net Profit</p>
                        <p className={`text-xl font-black ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
                          {dh(netProfit)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Key Metrics</p>
                    <div className="grid grid-cols-2 gap-3">
                      <KpiCard
                        label="ROAS"
                        value={`${roas.toFixed(2)}×`}
                        sub="Revenue / Ad Spend"
                        color={roas >= 2 ? "green" : roas >= 1 ? "amber" : "red"}
                      />
                      <KpiCard
                        label="ROI"
                        value={pct(roi)}
                        sub="Profit / Total Costs"
                        color={roi >= 20 ? "green" : roi >= 0 ? "amber" : "red"}
                      />
                      <KpiCard
                        label="Net Margin"
                        value={pct(margin)}
                        sub="Profit / Revenue"
                        color={margin >= 15 ? "green" : margin >= 0 ? "amber" : "red"}
                      />
                      <KpiCard
                        label="Profit / Delivered"
                        value={dh(profitPerDel)}
                        sub="Net per order"
                        color={profitPerDel >= 50 ? "green" : profitPerDel >= 0 ? "amber" : "red"}
                      />
                      <KpiCard
                        label="CPA (Confirmed)"
                        value={dh(confirmed > 0 ? adSpend / confirmed : 0)}
                        sub={`BE: ${dh(beCpa)}`}
                        color="blue"
                      />
                      <KpiCard
                        label="CPDO"
                        value={dh(realCpdo)}
                        sub={`BE: ${dh(beCpdo)}`}
                        color="blue"
                      />
                    </div>

                    {/* Summary verdict */}
                    <div className={`rounded-xl p-3.5 flex items-start gap-3 ${isProfit ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                      {isProfit
                        ? <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        : <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                      <p className={`text-xs font-semibold leading-relaxed ${isProfit ? "text-emerald-800" : "text-red-800"}`}>
                        {isProfit
                          ? `At ${dh(cpl)} CPL you make ${dh(netProfit)} net profit from ${leads} leads. Your CPL headroom is ${dh(Math.abs(cplVsBe))} before you break even.`
                          : `At ${dh(cpl)} CPL you lose ${dh(Math.abs(netProfit))}. You need to get CPL below ${dh(beCpl)} to be profitable, or improve your confirmation / delivery rates.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="border-t border-slate-200" />

          {/* ═══════════════════════════════════════════════════════════
              SECTION 3 — MOROCCO COD PRICING CALCULATOR
          ═══════════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-sm flex-shrink-0">3</div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Pricing Calculator — Morocco COD</h2>
                <p className="text-xs text-slate-400 mt-0.5">Enter your costs → see exactly what price to set and get the green light</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── LEFT: Inputs ──────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

                {/* Costs */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Your Costs (DH)</p>
                </div>
                <div className="px-6 py-4 space-y-2.5">
                  {([
                    { icon: <PackageCheck className="w-4 h-4 text-slate-400" />, label: "Product Cost",       hint: `per unit · ×${pricingQty} = ${dh(pProductCost * pricingQty)}`,            value: pProductCost,  set: setPProductCost, blue: false },
                    { icon: <Truck className="w-4 h-4 text-slate-400" />,        label: "Shipping Cost",      hint: `per shipment · ×${pShipsPerDel.toFixed(1)} = ${dh(pShippingTotal)}`,       value: pShippingCost, set: setPShippingCost, blue: false },
                    { icon: <BadgeDollarSign className="w-4 h-4 text-slate-400" />, label: "COD / Delivery Fees", hint: "charged on delivered orders",                                          value: pCodFees,      set: setPCodFees, blue: false },
                    { icon: <TrendingUp className="w-4 h-4 text-blue-500" />,    label: "Ad Cost per Lead",   hint: `Facebook / TikTok · ×${pLeadsPerDel.toFixed(1)} leads = ${dh(pAdTotal)}`, value: pCpl,          set: setPCpl, blue: true },
                  ] as const).map((f) => (
                    <div key={f.label} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 border ${f.blue ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex-shrink-0">{f.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${f.blue ? "text-blue-800" : "text-slate-700"}`}>{f.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{f.hint}</p>
                      </div>
                      <div className="relative w-24 flex-shrink-0">
                        <input type="number" value={f.value} onChange={(e) => f.set(Number(e.target.value))} step={1} min={0}
                          className="w-full border border-slate-200 rounded-lg py-1.5 pl-2 pr-7 text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-teal-400/40 focus:outline-none text-right" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">DH</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* COD rates */}
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">COD Rates (%)</p>
                </div>
                <div className="px-6 py-4 grid grid-cols-2 gap-3">
                  {([
                    { icon: <ShieldCheck className="w-4 h-4 text-blue-500" />, label: "Confirmation Rate", value: pConfRate, set: setPConfRate, color: "bg-blue-50 border-blue-200" },
                    { icon: <Truck className="w-4 h-4 text-violet-500" />,     label: "Delivery Rate",     value: pDelivRate, set: setPDelivRate, color: "bg-violet-50 border-violet-200" },
                  ] as const).map((f) => (
                    <div key={f.label} className={`rounded-xl px-3.5 py-3 border ${f.color}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        {f.icon}
                        <p className="text-[11px] font-bold text-slate-700">{f.label}</p>
                      </div>
                      <div className="relative">
                        <input type="number" value={f.value} onChange={(e) => f.set(Math.min(100, Math.max(1, Number(e.target.value))))} step={5} min={1} max={100}
                          className="w-full border border-slate-200 rounded-lg py-1.5 pl-2 pr-7 text-lg font-black text-slate-900 bg-white focus:ring-2 focus:ring-teal-400/40 focus:outline-none text-center" />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div className="border-t border-slate-100 px-6 py-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Quantity</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((q) => (
                      <button key={q} onClick={() => setPricingQty(q)}
                        className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all ${pricingQty === q ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                        {q === 1 ? "1 Piece" : q === 2 ? "2 Pieces" : "3 Pieces"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Results ──────────────────────────────── */}
              <div className="flex flex-col gap-4">

                {/* Funnel summary */}
                <div className="bg-slate-900 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Your funnel:</span>
                  {[
                    { t: `${Math.round(pLeadsPerDel)} leads`, c: "bg-slate-700 text-slate-200" },
                    { t: `→ ${Math.round(pLeadsPerDel * pCr)} confirmed`, c: "bg-blue-900 text-blue-300" },
                    { t: "→ 1 delivered", c: "bg-emerald-900 text-emerald-300" },
                    { t: `${Math.round(pShipsPerDel - 1)} returned`, c: "bg-red-900/50 text-red-400" },
                  ].map((s) => (
                    <span key={s.t} className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.c}`}>{s.t}</span>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Cost per Delivered Order</p>
                  </div>
                  <div className="px-6 py-4 space-y-0.5">
                    {[
                      { dot: "bg-slate-400", label: "Product cost",    calc: `${pricingQty} × ${dh(pProductCost)}`,                         amount: pProductTotal },
                      { dot: "bg-slate-400", label: "Shipping",        calc: `×${pShipsPerDel.toFixed(1)} shipments × ${dh(pShippingCost)}`, amount: pShippingTotal },
                      { dot: "bg-slate-400", label: "COD fees",        calc: "collected on delivery",                                        amount: pCodFees },
                      { dot: "bg-blue-500",  label: "Ad spend",        calc: `×${pLeadsPerDel.toFixed(1)} leads × ${dh(pCpl)}`,              amount: pAdTotal, blue: true },
                    ].map((r) => (
                      <div key={r.label} className={`flex items-center justify-between py-2 border-b border-slate-100 last:border-0 ${r.blue ? "-mx-6 px-6 bg-blue-50/60" : ""}`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${r.dot}`} />
                          <div>
                            <p className="text-sm text-slate-700 font-medium">{r.label}</p>
                            <p className="text-[10px] text-slate-400">{r.calc}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{dh(r.amount)}</p>
                      </div>
                    ))}
                    <div className="pt-3 mt-1 border-t-2 border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">Break-Even Price</p>
                        <p className="text-[10px] text-slate-400">minimum — any lower = losing money</p>
                      </div>
                      <p className="text-xl font-black text-slate-800">{dh(pBreakEven)}</p>
                    </div>
                  </div>
                </div>

                {/* Recommended price hero */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950 p-6 shadow-2xl">
                  <div className="absolute -top-6 -right-6 w-36 h-36 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5 relative z-10">
                    <Tag className="w-3 h-3" /> Recommended selling price
                  </p>
                  <p className="text-5xl font-black text-white tracking-tight leading-none relative z-10">{dh(pRecommended)}</p>
                  <p className="text-sm text-slate-400 mt-2 relative z-10">
                    {dh(pBreakEven)} costs + <span className="text-amber-400 font-bold">{dh(pTargetProfit)} target profit</span>
                  </p>
                  <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden mt-4 relative z-10">
                    <div className="bg-black/20 px-3 py-2.5 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Break-Even</p>
                      <p className="text-sm font-black text-slate-200">{dh(pBreakEven)}</p>
                    </div>
                    <div className="bg-black/20 px-3 py-2.5 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Ad Cost</p>
                      <p className="text-sm font-black text-blue-400">{dh(pAdTotal)}</p>
                    </div>
                    <div className="bg-emerald-900/40 px-3 py-2.5 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-0.5">Net Profit</p>
                      <p className="text-sm font-black text-emerald-400">{dh(pTargetProfit)}</p>
                    </div>
                  </div>
                </div>

                {/* Green-light checker */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Green Light Check</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Enter your selling price → instant profit verdict</p>
                  </div>
                  <div className="px-6 py-5">
                    <div className="relative mb-4">
                      <input
                        type="number"
                        value={pUserPrice || ""}
                        onChange={(e) => setPUserPrice(Number(e.target.value))}
                        placeholder="e.g. 292"
                        step={5}
                        min={0}
                        className="w-full border-2 border-slate-200 rounded-xl py-4 pl-5 pr-16 text-2xl font-black text-slate-900 bg-white focus:ring-0 focus:border-teal-400 focus:outline-none transition-colors placeholder:text-slate-300"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">DH</span>
                    </div>

                    {pUserPrice <= 0 ? (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 text-center">
                        <p className="text-sm text-slate-400 font-medium">Type your price above to see the verdict</p>
                      </div>
                    ) : pIsRed ? (
                      <div className="rounded-xl bg-red-50 border-2 border-red-300 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-red-700">LOSING MONEY</p>
                            <p className="text-xs text-red-600 mt-0.5">
                              You lose <span className="font-black">{dh(Math.abs(pUserProfit))}</span> per delivered order.
                              Raise price by at least <span className="font-black">{dh(pBreakEven - pUserPrice)}</span> to break even.
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 bg-red-100 rounded-lg px-4 py-2 flex justify-between items-center">
                          <span className="text-xs text-red-600 font-medium">Minimum price to not lose money</span>
                          <span className="text-sm font-black text-red-800">{dh(pBreakEven)}</span>
                        </div>
                      </div>
                    ) : pIsOk ? (
                      <div className="rounded-xl bg-amber-50 border-2 border-amber-300 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-amber-700">BREAKING EVEN</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                              Profit is only <span className="font-black">{dh(pUserProfit)}</span> — below your target of <span className="font-black">{dh(pTargetProfit)}</span>.
                              Raise by <span className="font-black">{dh(pRecommended - pUserPrice)}</span> to hit target.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-emerald-50 border-2 border-emerald-400 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-emerald-700">PROFITABLE — GREEN LIGHT</p>
                            <p className="text-xs text-emerald-700 mt-0.5">
                              You make <span className="font-black">{dh(pUserProfit)}</span> net profit per delivered order. Go for it!
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="bg-white rounded-lg px-3 py-2 text-center border border-emerald-200">
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Your Price</p>
                            <p className="text-sm font-black text-slate-900">{dh(pUserPrice)}</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-center border border-emerald-200">
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Total Costs</p>
                            <p className="text-sm font-black text-slate-900">{dh(pBreakEven)}</p>
                          </div>
                          <div className="bg-emerald-100 rounded-lg px-3 py-2 text-center border border-emerald-300">
                            <p className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">Net Profit</p>
                            <p className="text-sm font-black text-emerald-700">{dh(pUserProfit)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Target profits per quantity</p>
                      <div className="flex gap-2">
                        {([1, 2, 3] as const).map((q) => (
                          <div key={q} className={`flex-1 text-center rounded-lg py-2 border text-xs font-bold transition-all ${pricingQty === q ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            <p>{q} pc</p>
                            <p className={pricingQty === q ? "text-emerald-400" : "text-slate-400"}>{PROFIT_RULES[q]} DH</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
