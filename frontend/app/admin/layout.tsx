"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useAuthStore } from "@/lib/auth-context";
import { UserRole } from "@/lib/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
