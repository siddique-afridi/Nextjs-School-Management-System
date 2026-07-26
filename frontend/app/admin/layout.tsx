"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useAuth } from "@/app/context/userContext";
import { UserRole } from "@/lib/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== UserRole.ADMIN) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== UserRole.ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
  <AppNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

  <div className="flex flex-1 overflow-hidden">
    <AdminSidebar
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />

    <main className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6">
        {children}
      </div>
    </main>
  </div>
</div>
  );
}
