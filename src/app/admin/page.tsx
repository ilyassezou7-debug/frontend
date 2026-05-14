"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-api";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace(isAdminLoggedIn() ? "/admin/dashboard" : "/admin/login");
  }, [router]);
  return null;
}
