"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useAuthStore } from "@/lib/auth-context";
import { UserRole } from "@/lib/constants";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== UserRole.STUDENT) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.STUDENT) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
