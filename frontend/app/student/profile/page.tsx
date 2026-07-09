"use client";

import { useAuth } from "@/app/context/userContext";

export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="rounded-lg border bg-card p-6 space-y-3">
        <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
        <p><span className="text-muted-foreground">Roll No:</span> {user?.rollNum}</p>
        <p><span className="text-muted-foreground">School:</span> {user?.school?.schoolName}</p>
        <p><span className="text-muted-foreground">Class:</span> {user?.sclassName?.sclassName}</p>
      </div>
    </div>
  );
}
