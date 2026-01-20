import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Control | Sozo Admin",
  description: "Sozo Admin Dashboard - Order Management System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages have their own layout without Navbar and FloatingChat
  return <>{children}</>;
}
