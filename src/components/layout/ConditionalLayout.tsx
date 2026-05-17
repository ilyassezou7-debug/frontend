"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/lp") return <Header isSoftPage={true} />;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/lp") return <Footer isSoftPage={true} />;
  return <Footer />;
}

export function ConditionalAnnouncementBar() {
  const pathname = usePathname();
  if (pathname === "/lp") return null;
  return <AnnouncementBar />;
}
