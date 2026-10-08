"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, Radio, Clock } from "lucide-react";
import { adminApi, isAdminLoggedIn, type VisitorsResponse, type VisitorsPage } from "@/lib/admin-api";
import { Sidebar } from "@/components/admin/Sidebar";

// Our own landing-page tracker (public/t/lp.js -> /api/ev): live visitors + step-by-step funnel per page.

const PAGE_LABELS: Record<string, string> = {
  "/lp/joint": "Joint · man (night knee)",
  "/lp/joint-2": "Joint · wife",
  "/lp/joint-3": "Joint · grandmother (heel)",
  "/lp/bouzloum": "Joint · car man (بوزلوم)",
  "/lp/joint-4": "Joint · car man (old link)",
  "/lp/joint-info": "Joint · info page",
};
const label = (p: string) => PAGE_LABELS[p] ?? (p.startsWith("/lp/vitiligo") ? `Vitiligo · ${p.slice(4)}` : p);

const STEPS: [string, string][] = [
  ["view", "Opened the page"],
  ["s25", "Scrolled 25%"],
  ["s50", "Scrolled 50%"],
  ["s75", "Scrolled 75%"],
  ["s100", "Reached the end"],
  ["cta", "Tapped an order button"],
  ["offer", "Chose a box"],
  ["nm_in", "Typed a name"],
  ["ph_in", "Typed a phone"],
  ["submit", "Pressed confirm"],
  ["ph_err", "Got a phone error"],
  ["send_err", "Got a sending error"],
  ["ok", "ORDER SENT"],
];
const BAD = new Set(["ph_err", "send_err"]);

type Period = "today" | "24h" | "7d";
function hoursFor(p: Period) {
  if (p === "24h") return 24;
  if (p === "7d") return 24 * 7;
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return Math.max(0.1, (now.getTime() - start.getTime()) / 3_600_000);
}

function PageCard({ path, d, live }: { path: string; d: VisitorsPage; live: number }) {
  const views = d.steps.view || 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-bold text-slate-900">{label(path)}</p>
          <p className="text-xs text-slate-400">{path}</p>
        </div>
        <div className="text-right">
          {live > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {live} now
            </span>
          )}
          <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3" /> median {d.median_seconds_on_page ?? "–"} s
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {STEPS.filter(([k]) => d.steps[k] !== undefined).map(([k, name]) => {
          const n = d.steps[k];
          const pct = views ? (100 * n) / views : 0;
          const bar = BAD.has(k) ? "bg-red-400" : k === "ok" ? "bg-emerald-500" : "bg-teal-500/70";
          return (
            <div key={k} className="flex items-center gap-3 text-sm">
              <span className={`w-44 flex-shrink-0 ${k === "ok" ? "font-bold text-emerald-700" : BAD.has(k) ? "text-red-600" : "text-slate-600"}`}>{name}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${bar}`} style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-900 tabular-nums">{n}</span>
              <span className="w-14 text-right text-slate-400 tabular-nums">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
      {Object.keys(d.details).length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
          {Object.entries(d.details).map(([k, det]) => (
            <p key={k}>
              <span className="font-semibold">{k === "ph_err" ? "Phone errors" : k === "send_err" ? "Sending errors" : k === "offer" ? "Boxes chosen" : k}:</span>{" "}
              {Object.entries(det).map(([a, n]) => `${a} ×${n}`).join(" · ")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VisitorsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<VisitorsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("today");
  const [auto, setAuto] = useState(true);
  const [updated, setUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isAdminLoggedIn()) router.replace("/admin/login");
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await adminApi.getVisitors(hoursFor(period)));
      setUpdated(new Date());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (mounted) load();
  }, [mounted, load]);

  useEffect(() => {
    if (!mounted || !auto) return;
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [mounted, auto, load]);

  if (!mounted) return null;

  const pages = data
    ? Object.entries(data.pages)
        .filter(([p]) => p.startsWith("/lp/"))
        .sort((a, b) => (b[1].steps.view || 0) - (a[1].steps.view || 0))
    : [];
  const totals = pages.reduce(
    (t, [, d]) => ({ view: t.view + (d.steps.view || 0), cta: t.cta + (d.steps.cta || 0), ok: t.ok + (d.steps.ok || 0) }),
    { view: 0, cta: 0, ok: 0 }
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="ltr">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex gap-4 text-sm font-medium text-slate-500 mb-4 md:hidden">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <span className="text-teal-600">Visitors</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visitors</h1>
            <p className="text-sm text-slate-500 mt-1">
              Landing pages, step by step. Anonymous: no names or phone numbers.
              {updated && <> · updated {updated.toLocaleTimeString()}</>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["today", "24h", "7d"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border shadow-sm ${period === p ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                {p === "today" ? "Today" : p === "24h" ? "24 h" : "7 days"}
              </button>
            ))}
            <label className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> auto 15 s
            </label>
            <button
              onClick={load}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" /> On the pages right now
            </p>
            <p className="text-5xl font-bold mt-2 tabular-nums">{data?.live.total ?? "–"}</p>
            <div className="mt-3 space-y-0.5 text-xs opacity-90">
              {data && Object.entries(data.live.pages).filter(([p]) => p.startsWith("/lp/")).map(([p, n]) => (
                <p key={p}>{label(p)}: {n}</p>
              ))}
            </div>
          </div>
          {[
            ["Visitors", totals.view, ""],
            ["Tapped order button", totals.cta, totals.view ? `${((100 * totals.cta) / totals.view).toFixed(1)}%` : ""],
            ["Orders sent", totals.ok, totals.view ? `${((100 * totals.ok) / totals.view).toFixed(1)}% of visitors` : ""],
          ].map(([name, n, sub]) => (
            <div key={name as string} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
              <p className="text-sm text-slate-500 font-medium">{name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{n as number}</p>
              {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
            </div>
          ))}
        </div>

        {data && pages.length === 0 && <p className="text-slate-500 text-sm">No visitors in this period yet.</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pages.map(([p, d]) => (
            <PageCard key={p} path={p} d={d} live={data?.live.pages[p] ?? 0} />
          ))}
        </div>
      </main>
    </div>
  );
}
