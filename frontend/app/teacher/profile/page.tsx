"use client";

import { useAuth } from "@/app/context/userContext";

export default function TeacherProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-muted-foreground">Your account details from the school database</p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
        <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
        <p><span className="text-muted-foreground">School:</span> {user?.school?.schoolName}</p>
        <p><span className="text-muted-foreground">Class:</span> {user?.teachSclass?.sclassName}</p>
        <p><span className="text-muted-foreground">Subject:</span> {user?.teachSubject?.subName}</p>
      </div>
    </div>
  );
}
