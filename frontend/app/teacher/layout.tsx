"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TeacherSidebar } from "@/components/layout/TeacherSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useAuthStore } from "@/lib/auth-context";
import { UserRole } from "@/lib/constants";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== UserRole.TEACHER) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.TEACHER) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
