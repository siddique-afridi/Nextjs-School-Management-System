"use client";

import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Attendance } from "@/lib/constants";
import { mockAttendance } from "@/lib/data";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function AttendancePage() {
  const presentCount = mockAttendance.filter((a) => a.status === "present").length;
  const absentCount = mockAttendance.filter((a) => a.status === "absent").length;
  const attendancePercentage =
    mockAttendance.length > 0
      ? Math.round((presentCount / mockAttendance.length) * 100)
      : 0;

  const columns: Column<Attendance>[] = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "subject",
      label: "Subject",
      render: (value: any) => value?.name || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            value === "present"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "present" ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Present
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              Absent
            </>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
        <p className="mt-1 text-muted-foreground">
          View your attendance records
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Attendance Percentage"
          value={`${attendancePercentage}%`}
          icon={Clock}
          description="Overall attendance"
        />
        <StatCard
          title="Days Present"
          value={presentCount}
          icon={CheckCircle}
          description="Total present days"
        />
        <StatCard
          title="Days Absent"
          value={absentCount}
          icon={XCircle}
          description="Total absent days"
        />
      </div>

      {/* Attendance Progress */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Attendance Progress
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Present</span>
            <span className="text-foreground font-medium">
              {presentCount} / {mockAttendance.length}
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${attendancePercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable columns={columns} data={mockAttendance} />
    </div>
  );
}
