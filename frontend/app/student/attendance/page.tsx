"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Attendance } from "@/lib/constants";
import { useAuth } from "@/app/context/userContext";
import { fetchStudentProfile, mapAttendanceRows } from "@/app/services/portal/student.portal";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Attendance[]>([]);

  useEffect(() => {
    if (!user?._id) return;
    fetchStudentProfile(user._id).then((p) => {
      setRows(mapAttendanceRows((p.attendance as Record<string, unknown>[]) ?? []));
    });
  }, [user?._id]);

  const present = rows.filter((r) => r.status === "present").length;
  const pct = rows.length ? Math.round((present / rows.length) * 100) : 0;

  const columns: Column<Attendance>[] = [
    { key: "date", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
    { key: "subject", label: "Subject", render: (v: Attendance["subject"]) => v?.name ?? "-" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span className={v === "present" ? "text-green-700" : "text-red-700"}>
          {v === "present" ? "Present" : "Absent"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Attendance</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <StatCard title="Percentage" value={`${pct}%`} icon={Clock} />
        <StatCard title="Present" value={present} icon={CheckCircle} />
        <StatCard title="Absent" value={rows.length - present} icon={XCircle} />
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
