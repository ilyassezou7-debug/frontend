"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

// Bare landing pages that render with no site chrome (header/footer/bar).
const isBareLanding = (pathname: string) => pathname.startsWith("/lp/");

export function ConditionalHeader() {
  const pathname = usePathname();
  if (isBareLanding(pathname)) return null;
  if (pathname === "/lp") return <Header isSoftPage={true} />;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (isBareLanding(pathname)) return null;
  if (pathname === "/lp") return <Footer isSoftPage={true} />;
  return <Footer />;
}

export function ConditionalAnnouncementBar() {
  const pathname = usePathname();
  if (isBareLanding(pathname)) return null;
  if (pathname === "/lp") return null;
  return <AnnouncementBar />;
}
