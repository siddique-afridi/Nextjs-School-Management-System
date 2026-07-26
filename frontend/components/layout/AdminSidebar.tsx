"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  MessageSquare,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/classes", label: "Classes", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/teachers", label: "Teachers", icon: Users },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/notices", label: "Notices", icon: Bell },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquare },
];

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>

      {/* Sidebar */}
      <aside
        className={`fixed z-20 w-64 border-r border-border bg-sidebar transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="text-lg font-bold text-sidebar-foreground">Admin Panel</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-sidebar-accent rounded transition-colors"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
