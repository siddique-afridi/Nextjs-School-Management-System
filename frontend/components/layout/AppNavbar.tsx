"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-context";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppNavbarProps {
  onMenuClick?: () => void;
}

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          )}
          <h1 className="text-xl font-bold text-foreground">School Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
              alt={user?.name || "User"}
              className="h-8 w-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
