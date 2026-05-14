import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — AtlasPure",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div dir="ltr">{children}</div>;
}
