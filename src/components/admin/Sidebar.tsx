"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, LogOut } from "lucide-react";
import { clearAdminToken } from "@/lib/admin-api";

export function Sidebar() {
  const router = useRouter();
  
  function logout() {
    clearAdminToken();
    router.push("/admin/login");
  }
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-white/5 min-h-screen p-4 fixed top-0 left-0 bottom-0 z-10 text-slate-300">
      <div className="flex items-center gap-3 px-3 py-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
          <span className="text-white font-bold text-sm tracking-wider">AP</span>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight tracking-tight">AtlasPure</p>
          <p className="text-slate-500 text-xs font-medium">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white font-medium text-sm transition-all"
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          Dashboard
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white font-medium text-sm transition-all"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          Orders
        </Link>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-all mt-4"
      >
        <LogOut className="w-4.5 h-4.5" />
        Sign Out
      </button>
    </aside>
  );
}
