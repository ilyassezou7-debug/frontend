"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { adminApi, isAdminLoggedIn } from "@/lib/admin-api";
import { Sidebar } from "@/components/admin/Sidebar";

// ── Helpers ────────────────────────────────────────────────────────────

function usd(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function dh(n: number) {
  return `${n.toLocaleString("fr-MA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
}

// ── COD Pricing Rules (MAD) ────────────────────────────────────────────
// target profit per delivered order based on qty × upsell
const PROFIT_RULES: Record<1 | 2 | 3, { no: number; yes: number }> = {
  1: { no: 30,  yes: 60  },
  2: { no: 50,  yes: 70  },
  3: { no: 70,  yes: 100 },
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
}

function InputField({
  label, sublabel, value, onChange, prefix, suffix, step = 0.01,
  min = 0, max, highlight, badge,
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
          className={`w-full border rounded-lg py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:outline-none bg-white border-slate-200 transition-all ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-8" : "pr-3"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ── Metric display row ─────────────────────────────────────────────────

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

// ── Funnel step ────────────────────────────────────────────────────────

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

  // ── Store data (pulled from API)
  const [aovMad, setAovMad] = useState<number>(299);
  const [avgUnits, setAvgUnits] = useState<number>(1.5);

  // ── Settings
  const [exchangeRate, setExchangeRate] = useState<number>(10.0);

  // ── COD funnel
  const [confRate, setConfRate]     = useState<number>(60);
  const [deliveryRate, setDeliveryRate] = useState<number>(65);

  // ── Costs
  const [productCostUsd, setProductCostUsd] = useState<number>(3.0);
  const [fixedCostsUsd, setFixedCostsUsd]   = useState<number>(7.06);

  // ── Scale scenario
  const [leads, setLeads] = useState<number>(200);
  const [cpl, setCpl]     = useState<number>(2.5);

  // ── MAD Pricing Calculator
  const [pricingQty, setPricingQty]         = useState<1 | 2 | 3>(1);
  const [hasUpsell, setHasUpsell]           = useState<boolean>(false);
  const [pProductCost, setPProductCost]     = useState<number>(30);
  const [pShippingCost, setPShippingCost]   = useState<number>(25);
  const [pCodFees, setPCodFees]             = useState<number>(20);
  const [pUpsellCost, setPUpsellCost]       = useState<number>(15);

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) { router.replace("/admin/login"); return; }

    adminApi.getMetrics({ start: "2020-01-01" })
      .then((data) => {
        if (data.avg_order_value > 0) setAovMad(data.avg_order_value);
        if (data.top_products?.length) {
          const tot = data.top_products.reduce((s, p) => s + p.orders, 0);
          const units = data.top_products.reduce((s, p) => s + p.units, 0);
          if (tot > 0) setAvgUnits(+(units / tot).toFixed(2));
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAov(false));
  }, [router]);

  if (!mounted) return null;

  // ── Derived: unit economics
  const aovUsd        = aovMad / exchangeRate;
  const cogsPerOrder  = productCostUsd * avgUnits;
  const totalCostPerDelivered = cogsPerOrder + fixedCostsUsd;
  const grossMargin   = aovUsd - totalCostPerDelivered;   // profit per delivered order BEFORE ads

  const cr = confRate   / 100;
  const dr = deliveryRate / 100;

  // Break-even CPL: CPL where Net Profit = 0
  // NetProfit = (leads * cr * dr * grossMargin) - (leads * CPL) = 0
  // CPL_be = cr * dr * grossMargin
  const beCpl  = cr * dr * grossMargin;           // break-even CPL ($)
  const beCpa  = dr * grossMargin;                // break-even CPA on confirmed orders ($)
  const beCpdo = grossMargin;                     // break-even cost per delivered order ($)

  // ── Derived: scale scenario
  const confirmed  = Math.round(leads * cr);
  const delivered  = Math.round(confirmed * dr);

  const revenue    = delivered * aovUsd;
  const adSpend    = leads * cpl;
  const cogsCost   = delivered * cogsPerOrder;
  const fixedCost  = delivered * fixedCostsUsd;
  const totalCost  = adSpend + cogsCost + fixedCost;

  const netProfit       = revenue - totalCost;
  const roas            = adSpend > 0 ? revenue / adSpend : 0;
  const roi             = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const margin          = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const profitPerDel    = delivered > 0 ? netProfit / delivered : 0;
  const realCpdo        = delivered > 0 ? adSpend / delivered : 0;

  const isProfit        = netProfit >= 0;
  const cplVsBe         = cpl - beCpl;             // positive = losing, negative = profitable
  const cplPctFromBe    = beCpl > 0 ? (cplVsBe / beCpl) * 100 : 0;

  // ── MAD Pricing Calculator derived values
  // Formula: for every 1 delivered order (CR=50%, DR=50% → 25% effective rate)
  //   → 2 confirmed orders were shipped (DR=50%)
  //   → 2 × shipping cost lost (1 delivered + 1 returned)
  //   → product cost × qty (1 time — returned product is recovered)
  //   → COD fees only on the delivered order
  //   → upsell cost only on delivered order (if upsell)
  const pTargetProfit   = PROFIT_RULES[pricingQty][hasUpsell ? "yes" : "no"];
  const pProductTotal   = pProductCost * pricingQty;
  const pShippingTotal  = pShippingCost * 2;               // shipped twice per delivered order
  const pUpsellTotal    = hasUpsell ? pUpsellCost : 0;
  const pBreakEven      = pProductTotal + pShippingTotal + pCodFees + pUpsellTotal;
  const pRecommended    = pBreakEven + pTargetProfit;

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
                Live unit economics pulled from your store. Edit any field — results update instantly.
              </p>
            </div>

            {/* Quick AOV pill */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center">
              {loadingAov ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400 mx-auto" />
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Lifetime AOV</p>
                  <p className="text-2xl font-black text-white">{usd(aovUsd)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{aovMad.toFixed(0)} MAD · {avgUnits} units avg</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 space-y-10">

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
                  label="Lifetime AOV (MAD)"
                  sublabel={`= ${usd(aovUsd)} USD`}
                  value={aovMad}
                  onChange={setAovMad}
                  badge="From store"
                  step={1}
                  highlight
                />
                <InputField
                  label="Avg Units per Order"
                  sublabel="Calculated from your order history"
                  value={avgUnits}
                  onChange={setAvgUnits}
                  step={0.1}
                  badge="From store"
                  highlight
                />
                <InputField
                  label="Exchange Rate"
                  sublabel="1 USD = ? MAD"
                  value={exchangeRate}
                  onChange={setExchangeRate}
                  step={0.1}
                />
                <InputField
                  label="Product Cost (USD / unit)"
                  value={productCostUsd}
                  onChange={setProductCostUsd}
                  prefix="$"
                  step={0.1}
                />
                <InputField
                  label="Fixed Costs (USD / delivered order)"
                  sublabel="Shipping, packaging, call center, etc."
                  value={fixedCostsUsd}
                  onChange={setFixedCostsUsd}
                  prefix="$"
                  step={0.01}
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
                    <p className="text-xs text-slate-400 mt-0.5">Where does every {usd(aovUsd)} go?</p>
                  </div>
                  <div className="px-6 py-4">
                    <Row label="Revenue (AOV)" value={usd(aovUsd)} />
                    <Row
                      label="COGS"
                      sub={`${avgUnits} units × ${usd(productCostUsd)}`}
                      value={`− ${usd(cogsPerOrder)}`}
                    />
                    <Row
                      label="Fixed Costs"
                      sub="Shipping · Packaging · Call center"
                      value={`− ${usd(fixedCostsUsd)}`}
                    />
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Gross Margin (before ads)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Money left to pay for your ad spend</p>
                      </div>
                      <p className={`text-2xl font-black ${grossMargin > 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {usd(grossMargin)}
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
                      <p className="text-3xl font-black text-emerald-400">{usd(beCpl)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per lead — do not exceed</p>
                    </div>
                    <div className="bg-slate-900/80 px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Max CPA (Confirmed)</p>
                      <p className="text-3xl font-black text-amber-400">{usd(beCpa)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per confirmed order</p>
                    </div>
                    <div className="bg-slate-900/80 px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Max CPDO</p>
                      <p className="text-3xl font-black text-blue-400">{usd(beCpdo)}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5">Per delivered order</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-4 relative z-10">
                    <span className="font-bold text-slate-400">Formula:</span>{" "}
                    Max CPL = CR × DR × Gross Margin = {pct(confRate)} × {pct(deliveryRate)} × {usd(grossMargin)} = <span className="text-emerald-400 font-bold">{usd(beCpl)}</span>
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
                  prefix="$"
                  step={0.1}
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
                    Your CPL <span className="font-bold text-slate-900">{usd(cpl)}</span> is{" "}
                    <span className={`font-bold ${isProfit ? "text-emerald-700" : "text-red-700"}`}>
                      {usd(Math.abs(cplVsBe))} {isProfit ? "below" : "above"}
                    </span>{" "}
                    break-even CPL{" "}
                    <span className="font-bold text-slate-900">{usd(beCpl)}</span>.
                  </p>
                  {/* Visual bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isProfit ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, Math.abs(cplPctFromBe) + 40)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-slate-400">$0 CPL</span>
                      <span className="text-[9px] text-emerald-600 font-bold">BE: {usd(beCpl)}</span>
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
                      <p className={`text-2xl font-black ${isProfit ? "text-emerald-700" : "text-red-700"}`}>{usd(netProfit)}</p>
                    </div>
                  </div>
                </div>

                {/* P&L + KPIs side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* P&L Statement */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">P&L Statement (USD)</p>
                    </div>
                    <div className="px-5 py-4 space-y-0.5">
                      <Row label="Gross Revenue" value={usd(revenue)} sub={`${delivered} orders × ${usd(aovUsd)}`} />
                      <Row label="Ad Spend" value={`− ${usd(adSpend)}`} sub={`${leads} leads × ${usd(cpl)}`} />
                      <Row label="COGS" value={`− ${usd(cogsCost)}`} sub={`${delivered} orders × ${usd(cogsPerOrder)}`} />
                      <Row label="Fixed Costs" value={`− ${usd(fixedCost)}`} sub={`${delivered} × ${usd(fixedCostsUsd)}`} />
                      <div className="pt-3 mt-2 border-t-2 border-slate-200 flex justify-between items-center">
                        <p className="text-sm font-black text-slate-900">Net Profit</p>
                        <p className={`text-xl font-black ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
                          {usd(netProfit)}
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
                        value={usd(profitPerDel)}
                        sub="Net per order"
                        color={profitPerDel >= 5 ? "green" : profitPerDel >= 0 ? "amber" : "red"}
                      />
                      <KpiCard
                        label="CPA (Confirmed)"
                        value={usd(confirmed > 0 ? adSpend / confirmed : 0)}
                        sub={`BE: ${usd(beCpa)}`}
                        color="blue"
                      />
                      <KpiCard
                        label="CPDO"
                        value={usd(realCpdo)}
                        sub={`BE: ${usd(beCpdo)}`}
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
                          ? `At ${usd(cpl)} CPL you make ${usd(netProfit)} net profit from ${leads} leads. Your CPL headroom is ${usd(Math.abs(cplVsBe))} before you break even.`
                          : `At ${usd(cpl)} CPL you lose ${usd(Math.abs(netProfit))}. You need to get CPL below ${usd(beCpl)} to be profitable, or improve your confirmation / delivery rates.`}
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
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-sm">3</div>
              <h2 className="text-lg font-black text-slate-900">Pricing Calculator</h2>
              <span className="text-xs text-slate-400 font-medium">— What should you sell for? (Morocco COD)</span>
            </div>

            {/* Fixed rates banner */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Confirmation Rate", value: "50%", color: "bg-blue-50 border-blue-200 text-blue-700" },
                { icon: <Truck className="w-3.5 h-3.5" />, label: "Delivery Rate", value: "50%", color: "bg-violet-50 border-violet-200 text-violet-700" },
                { icon: <PackageCheck className="w-3.5 h-3.5" />, label: "Effective Rate", value: "25%", color: "bg-amber-50 border-amber-200 text-amber-700" },
              ].map((b) => (
                <div key={b.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${b.color}`}>
                  {b.icon}
                  <span className="opacity-70">{b.label}:</span>
                  <span>{b.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                <RotateCcw className="w-3.5 h-3.5" />
                Per 4 leads → 2 shipped → 1 delivered, 1 returned
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── Inputs ─────────────────────────────────── */}
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Costs</p>

                {/* Cost inputs */}
                <div className="space-y-3">
                  <InputField
                    label="Product Cost"
                    sublabel={`× ${pricingQty} unit${pricingQty > 1 ? "s" : ""} = ${dh(pProductCost * pricingQty)}`}
                    value={pProductCost}
                    onChange={setPProductCost}
                    suffix="DH"
                    step={1}
                  />
                  <InputField
                    label="Shipping Cost"
                    sublabel="Charged per shipment — counted × 2 (delivered + returned)"
                    value={pShippingCost}
                    onChange={setPShippingCost}
                    suffix="DH"
                    step={1}
                  />
                  <InputField
                    label="COD / Delivery Fees"
                    sublabel="Courier cash-collection fee on delivered orders"
                    value={pCodFees}
                    onChange={setPCodFees}
                    suffix="DH"
                    step={1}
                  />
                  <div className={`space-y-2 rounded-xl p-3.5 border transition-all ${hasUpsell ? "bg-teal-50/60 border-teal-200" : "bg-slate-50 border-slate-200 opacity-60"}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-teal-500" />
                        Upsell Product Cost
                      </label>
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Only counted when upsell is enabled below</p>
                    <div className="relative">
                      <input
                        type="number"
                        value={pUpsellCost}
                        onChange={(e) => setPUpsellCost(Number(e.target.value))}
                        step={1}
                        min={0}
                        disabled={!hasUpsell}
                        className="w-full border rounded-lg py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:outline-none bg-white border-slate-200 transition-all pl-3 pr-10 disabled:cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">DH</span>
                    </div>
                  </div>
                </div>

                {/* Quantity selector */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Quantity Ordered</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setPricingQty(q)}
                        className={`py-3 rounded-xl font-black text-sm border-2 transition-all ${
                          pricingQty === q
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {q === 1 ? "1 Piece" : q === 2 ? "2 Pieces" : "3 Pieces"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upsell toggle */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Upsell</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setHasUpsell(false)}
                      className={`py-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                        !hasUpsell
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      No Upsell
                    </button>
                    <button
                      onClick={() => setHasUpsell(true)}
                      className={`py-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                        hasUpsell
                          ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      With Upsell
                    </button>
                  </div>
                </div>

                {/* Target profit info box */}
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Target Profit Applied</p>
                  <p className="text-2xl font-black text-amber-900">{dh(pTargetProfit)}</p>
                  <p className="text-[11px] text-amber-700/70 mt-1">
                    {pricingQty} piece{pricingQty > 1 ? "s" : ""} · {hasUpsell ? "with upsell" : "no upsell"}
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-[10px] text-amber-700/60 font-medium">All scenarios:</p>
                    <div className="mt-1.5 grid grid-cols-2 gap-1">
                      {([1, 2, 3] as const).map((q) => (
                        <div key={q} className={`text-[10px] rounded-lg px-2 py-1.5 border ${pricingQty === q ? "bg-amber-100 border-amber-300 font-bold text-amber-900" : "bg-white border-amber-100 text-amber-700"}`}>
                          <span className="font-bold">{q}pc</span> — no: {PROFIT_RULES[q].no} DH · up: {PROFIT_RULES[q].yes} DH
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Results ─────────────────────────────────── */}
              <div className="lg:col-span-7 flex flex-col gap-5">

                {/* Cost breakdown card */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-700">Cost Breakdown — per Delivered Order</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Accounts for CR=50% · DR=50% · 2 shipments per 1 delivery
                    </p>
                  </div>
                  <div className="px-6 py-4 space-y-0.5">
                    <Row
                      label="Product Cost"
                      sub={`${pricingQty} unit${pricingQty > 1 ? "s" : ""} × ${dh(pProductCost)}`}
                      value={dh(pProductTotal)}
                    />
                    <Row
                      label="Shipping Cost"
                      sub="× 2 (1 delivered + 1 returned shipment)"
                      value={dh(pShippingTotal)}
                    />
                    <Row
                      label="COD / Delivery Fees"
                      sub="Charged on delivered order only"
                      value={dh(pCodFees)}
                    />
                    {hasUpsell && (
                      <Row
                        label="Upsell Cost"
                        sub="Extra product for upsell"
                        value={dh(pUpsellTotal)}
                      />
                    )}
                    <div className="mt-3 pt-3 border-t-2 border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Break-Even Price</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Minimum selling price to not lose money</p>
                      </div>
                      <p className="text-2xl font-black text-slate-800">{dh(pBreakEven)}</p>
                    </div>
                  </div>
                </div>

                {/* Recommended price — hero card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Recommended Selling Price</p>
                    </div>

                    <div className="flex items-end gap-4 flex-wrap mb-5">
                      <div>
                        <p className="text-5xl font-black text-white tracking-tight leading-none">{dh(pRecommended)}</p>
                        <p className="text-slate-400 text-sm mt-2">
                          Break-even <span className="text-slate-300 font-bold">{dh(pBreakEven)}</span> + profit <span className="text-emerald-400 font-bold">{dh(pTargetProfit)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden mb-4">
                      <div className="bg-slate-900/80 px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Break-Even</p>
                        <p className="text-lg font-black text-slate-200">{dh(pBreakEven)}</p>
                      </div>
                      <div className="bg-slate-900/80 px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Target Profit</p>
                        <p className="text-lg font-black text-amber-400">{dh(pTargetProfit)}</p>
                      </div>
                      <div className="bg-emerald-900/50 px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Net Profit</p>
                        <p className="text-lg font-black text-emerald-400">{dh(pTargetProfit)}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl px-4 py-3 flex items-start gap-2.5">
                      <BadgeDollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-bold">Formula:</span>{" "}
                        Selling Price = (Product × {pricingQty}) + (Shipping × 2) + COD Fees{hasUpsell ? " + Upsell" : ""} + Target Profit{" "}
                        = {dh(pProductTotal)} + {dh(pShippingTotal)} + {dh(pCodFees)}{hasUpsell ? ` + ${dh(pUpsellTotal)}` : ""} + {dh(pTargetProfit)}{" "}
                        = <span className="text-emerald-400 font-bold">{dh(pRecommended)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Qty", value: `${pricingQty}x`, sub: `piece${pricingQty > 1 ? "s" : ""}`, color: "slate" },
                    { label: "Upsell", value: hasUpsell ? "YES" : "NO", sub: hasUpsell ? `+${dh(pUpsellCost)}` : "none", color: hasUpsell ? "green" : "slate" },
                    { label: "Break-Even", value: dh(pBreakEven), sub: "min. price", color: "amber" },
                    { label: "Sell For", value: dh(pRecommended), sub: `+${dh(pTargetProfit)} profit`, color: "green" },
                  ].map((k) => (
                    <KpiCard key={k.label} label={k.label} value={k.value} sub={k.sub} color={k.color} />
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
