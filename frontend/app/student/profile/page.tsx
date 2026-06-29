"use client";

import { useAuthStore } from "@/lib/auth-context";

export default function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const student = user as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-muted-foreground">View your profile information</p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-start gap-6">
            <img
              src={student?.avatar}
              alt={student?.name}
              className="h-24 w-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{student?.name}</h2>
              <p className="text-muted-foreground capitalize">{student?.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{student?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="text-foreground font-medium">{student?.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-foreground font-medium">{student?.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-foreground font-medium">{student?.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="text-foreground font-medium">{student?.dob || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Academic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Student ID
                  </label>
                  <p className="text-foreground font-medium">{student?.studentId}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Class
                  </label>
                  <p className="text-foreground font-medium">
                    {student?.class?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Class Teacher
                  </label>
                  <p className="text-foreground font-medium">
                    {student?.class?.teacher?.name || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
