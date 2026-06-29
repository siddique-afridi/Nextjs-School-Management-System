"use client";

import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Users, Clock, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-context";
import { mockAttendance, mockStudents } from "@/lib/data";

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const teacher = user as any;

  // Calculate attendance stats
  const presentCount = mockAttendance.filter(a => a.status === "present").length;
  const totalAttendanceRecords = mockAttendance.length;
  const attendancePercentage = totalAttendanceRecords > 0 
    ? Math.round((presentCount / totalAttendanceRecords) * 100)
    : 0;

  const stats = [
    {
      title: "Students in Class",
      value: mockStudents.length,
      icon: GraduationCap,
      description: "Active students",
    },
    {
      title: "Attendance",
      value: `${attendancePercentage}%`,
      icon: Clock,
      description: "Overall attendance",
    },
    {
      title: "Subject",
      value: teacher?.subject?.name || "N/A",
      icon: BookOpen,
      description: "Assigned subject",
    },
    {
      title: "Class",
      value: teacher?.assignedClass?.name || "N/A",
      icon: Users,
      description: "Assigned class",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {teacher?.name}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your class and track attendance
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <Link href="/teacher/attendance">
            <Button className="w-full">Mark Attendance</Button>
          </Link>
          <Link href="/teacher/my-class">
            <Button variant="outline" className="w-full">View My Class</Button>
          </Link>
          <Link href="/teacher/profile">
            <Button variant="outline" className="w-full">View Profile</Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Attendance Records</h2>
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.slice(0, 5).map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <img
                          src={record.student.avatar}
                          alt={record.student.name}
                          className="h-8 w-8 rounded-full"
                        />
                        {record.student.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
