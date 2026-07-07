"use client";

import { useAuth } from "@/app/context/userContext";

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const teacher = user as any;

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
              src={teacher?.avatar}
              alt={teacher?.name}
              className="h-24 w-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{teacher?.name}</h2>
              <p className="text-muted-foreground capitalize">{teacher?.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{teacher?.email}</p>
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
                  <p className="text-foreground font-medium">{teacher?.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-foreground font-medium">{teacher?.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-foreground font-medium">{teacher?.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Employee ID
                  </label>
                  <p className="text-foreground font-medium">{teacher?.employeeId}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Subject
                  </label>
                  <p className="text-foreground font-medium">
                    {teacher?.subject?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Assigned Class
                  </label>
                  <p className="text-foreground font-medium">
                    {teacher?.assignedClass?.name || "Not assigned"}
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
