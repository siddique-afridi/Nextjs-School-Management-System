"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Button } from "@/components/ui/button";
import { Clock, BookMarked, Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/userContext";
import {
  fetchSchoolNotices,
  fetchStudentProfile,
  mapAttendanceRows,
  mapExamResultRows,
} from "@/app/services/portal/student.portal";
import { Notice } from "@/lib/constants";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attendancePct, setAttendancePct] = useState(0);
  const [avgMarks, setAvgMarks] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    fetchStudentProfile(user._id).then((profile) => {
      const attendance = mapAttendanceRows((profile.attendance as Record<string, unknown>[]) ?? []);
      const results = mapExamResultRows((profile.examResult as Record<string, unknown>[]) ?? []);
      const present = attendance.filter((a) => a.status === "present").length;
      setAttendancePct(attendance.length ? Math.round((present / attendance.length) * 100) : 0);
      setAvgMarks(
        results.length
          ? Math.round(results.reduce((s, r) => s + (r.marks / r.totalMarks) * 100, 0) / results.length)
          : 0
      );
    });

    const schoolId = user.school?._id;
    if (schoolId) fetchSchoolNotices(schoolId).then(setNotices);
  }, [user?._id, user?.school?._id]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Hello, {user?.name}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <StatCard title="Attendance" value={`${attendancePct}%`} icon={Clock} />
        <StatCard title="Average Marks" value={`${avgMarks}%`} icon={BookMarked} />
        <StatCard title="Notices" value={notices.length} icon={Bell} />
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Link href="/student/attendance"><Button variant="outline" className="w-full">Attendance</Button></Link>
        <Link href="/student/results"><Button variant="outline" className="w-full">Results</Button></Link>
        <Link href="/student/notices"><Button variant="outline" className="w-full">Notices</Button></Link>
        <Link href="/student/complaints"><Button variant="outline" className="w-full">Complaints</Button></Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {notices.slice(0, 2).map((n) => <NoticeCard key={n.id} notice={n} />)}
      </div>
    </div>
  );
}
