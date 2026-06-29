"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { useAuthStore } from "@/lib/auth-context";
import { UserRole } from "@/lib/constants";

export default function Home() {
  const router = useRouter();
  // const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      switch (user.role) {
        case UserRole.ADMIN:
          router.push("/admin");
          break;
        case UserRole.TEACHER:
          router.push("/teacher");
          break;
        case UserRole.STUDENT:
          router.push("/student");
          break;
      }
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
