"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Target,
  ArrowRight,
  Info,
  RefreshCw,
} from "lucide-react";
import { adminApi, isAdminLoggedIn } from "@/lib/admin-api";
import { Sidebar } from "@/components/admin/Sidebar";

export default function CalculatorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loadingAov, setLoadingAov] = useState(true);

  // Variables
  const [exchangeRate, setExchangeRate] = useState<number>(10.0); // 1 USD = 10 MAD
  const [aovMad, setAovMad] = useState<number>(299);
  const [avgUnitsPerOrder, setAvgUnitsPerOrder] = useState<number>(1.2);
  
  // Cost Variables
  const [productCostUsd, setProductCostUsd] = useState<number>(3.0); // Per unit
  const [fixedCostsUsd, setFixedCostsUsd] = useState<number>(7.06); // Shipping, packaging, call center
  
  // Funnel Metrics
  const [confRate, setConfRate] = useState<number>(60); // %
  const [deliveryRate, setDeliveryRate] = useState<number>(65); // %
  
  // Scale Scenario Variables
  const [leads, setLeads] = useState<number>(100);
  const [cpl, setCpl] = useState<number>(3.0); // Cost per lead (USD)

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    // Fetch Lifetime AOV (we use a wide date range)
    adminApi
      .getMetrics({ start: "2020-01-01" })
      .then((data) => {
        if (data && data.avg_order_value > 0) {
          setAovMad(data.avg_order_value);
          // Calculate average units per order from products data if available
          if (data.top_products && data.top_products.length > 0) {
            const totalOrders = data.top_products.reduce((acc, p) => acc + p.orders, 0);
            const totalUnits = data.top_products.reduce((acc, p) => acc + p.units, 0);
            if (totalOrders > 0) {
              setAvgUnitsPerOrder(Number((totalUnits / totalOrders).toFixed(2)));
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAov(false));
  }, [router]);

  if (!mounted) return null;

  // Derived metrics
  const cr = confRate / 100;
  const dr = deliveryRate / 100;
  
  const aovUsd = aovMad / exchangeRate;
  const cogsPerOrderUsd = productCostUsd * avgUnitsPerOrder;
  
  // Break-even Calculations
  // Profit = Revenue - (AdSpend + COGS + FixedCosts)
  // 0 = (Leads * CR * DR * AOV) - (Leads * CPL) - (Leads * CR * DR * COGS) - (Leads * CR * DR * FixedCosts)
  // CPL = CR * DR * (AOV - COGS - FixedCosts)
  const marginPerDeliveredOrder = aovUsd - cogsPerOrderUsd - fixedCostsUsd;
  const breakEvenCpl = cr * dr * marginPerDeliveredOrder;
  const breakEvenCpa = dr * marginPerDeliveredOrder; // CPA = Cost per confirmed order = CPL / CR

  // Scale Scenario Calculations
  const confirmedOrders = Math.round(leads * cr);
  const deliveredOrders = Math.round(confirmedOrders * dr);
  
  const totalRevenueUsd = deliveredOrders * aovUsd;
  const totalAdSpend = leads * cpl;
  const totalCogs = deliveredOrders * cogsPerOrderUsd;
  const totalFixedCosts = deliveredOrders * fixedCostsUsd;
  const totalCosts = totalAdSpend + totalCogs + totalFixedCosts;
  
  const netProfitUsd = totalRevenueUsd - totalCosts;
  const roas = totalAdSpend > 0 ? totalRevenueUsd / totalAdSpend : 0;
  const roi = totalCosts > 0 ? (netProfitUsd / totalCosts) * 100 : 0;
  const profitMargin = totalRevenueUsd > 0 ? (netProfitUsd / totalRevenueUsd) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="ltr">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-teal-600" />
            COD Profit Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate your break-even metrics and project profit at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Inputs */}
          <div className="xl:col-span-4 space-y-6">
            {/* Global Settings */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-400" />
                Global Variables
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Exchange Rate (1 USD to MAD)</label>
                  <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
                      Lifetime AOV (MAD)
                      {loadingAov && <RefreshCw className="w-3 h-3 animate-spin text-teal-500" />}
                    </label>
                    <input
                      type="number"
                      value={aovMad}
                      onChange={(e) => setAovMad(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">≈ ${(aovMad / exchangeRate).toFixed(2)} USD</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Avg Units/Order</label>
                    <input
                      type="number"
                      value={avgUnitsPerOrder}
                      onChange={(e) => setAvgUnitsPerOrder(Number(e.target.value))}
                      step="0.1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Costs & Funnel */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Costs & Funnel
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Product Cost (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        value={productCostUsd}
                        onChange={(e) => setProductCostUsd(Number(e.target.value))}
                        step="0.1"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Fixed Costs (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        value={fixedCostsUsd}
                        onChange={(e) => setFixedCostsUsd(Number(e.target.value))}
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Conf. Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={confRate}
                        onChange={(e) => setConfRate(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Delivery Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={deliveryRate}
                        onChange={(e) => setDeliveryRate(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Scenario Inputs */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 border-l-4 border-l-teal-500">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                Scale Scenario
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Number of Leads</label>
                  <input
                    type="number"
                    value={leads}
                    onChange={(e) => setLeads(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Cost Per Lead (CPL) in USD</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      value={cpl}
                      onChange={(e) => setCpl(Number(e.target.value))}
                      step="0.1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Break Even Targets */}
            <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
              
              <h2 className="font-semibold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
                <Target className="w-5 h-5 text-teal-400" />
                Break-Even Targets
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Margin / Delivered Order</p>
                  <p className="text-3xl font-bold text-white tracking-tight">${marginPerDeliveredOrder.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">AOV - COGS - Fixed Costs</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Break-even CPA (Confirmed)</p>
                  <p className="text-3xl font-bold text-amber-400 tracking-tight">${breakEvenCpa.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">Max cost per confirmed order</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Break-even CPL (Lead)</p>
                  <p className="text-3xl font-bold text-emerald-400 tracking-tight">${breakEvenCpl.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">Max cost per lead to stay profitable</p>
                </div>
              </div>
            </div>

            {/* Profit Projection */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Profit Projection
                </h2>
              </div>
              
              <div className="p-6">
                {/* Funnel visualization */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100 px-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{leads}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Leads</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{confirmedOrders}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Confirmed</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{confRate}% CR</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{deliveredOrders}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Delivered</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{deliveryRate}% DR</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Financial Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Financial Breakdown (USD)</h3>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Gross Revenue</span>
                      <span className="text-sm font-semibold text-slate-900">${totalRevenueUsd.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Ad Spend</span>
                      <span className="text-sm font-medium text-red-500">-${totalAdSpend.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Total COGS</span>
                      <span className="text-sm font-medium text-red-500">-${totalCogs.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Total Fixed Costs</span>
                      <span className="text-sm font-medium text-red-500">-${totalFixedCosts.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-slate-900">Net Profit</span>
                      <span className={`text-xl font-bold ${netProfitUsd >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        ${netProfitUsd.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Key Performance Indicators</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ROAS</p>
                        <p className="text-2xl font-bold text-slate-800">{roas.toFixed(2)}x</p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ROI</p>
                        <p className={`text-2xl font-bold ${roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {roi.toFixed(1)}%
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Profit Margin</p>
                        <p className={`text-2xl font-bold ${profitMargin >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {profitMargin.toFixed(1)}%
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">CPA (Delivered)</p>
                        <p className="text-2xl font-bold text-slate-800">
                          ${deliveredOrders > 0 ? (totalAdSpend / deliveredOrders).toFixed(2) : "0.00"}
                        </p>
                      </div>
                    </div>
                    
                    {netProfitUsd < 0 && (
                      <div className="mt-4 flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>Your current CPL (${cpl.toFixed(2)}) is higher than your break-even CPL (${breakEvenCpl.toFixed(2)}). You are losing money at scale.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
