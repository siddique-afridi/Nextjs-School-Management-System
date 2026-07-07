"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardPath, useAuth } from "./context/userContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    router.push(getDashboardPath(user.role));
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
