"use client";

import { StatCard } from "@/components/shared/StatCard";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Button } from "@/components/ui/button";
import { Clock, BookMarked, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import { mockAttendance, mockExamResults, mockNotices } from "@/lib/data";

export default function StudentDashboard() {
  // Calculate attendance percentage
  const presentCount = mockAttendance.filter((a) => a.status === "present").length;
  const attendancePercentage =
    mockAttendance.length > 0
      ? Math.round((presentCount / mockAttendance.length) * 100)
      : 0;

  // Calculate average marks
  const averageMarks =
    mockExamResults.length > 0
      ? Math.round(
          mockExamResults.reduce((sum, r) => sum + (r.marks / r.totalMarks) * 100, 0) /
            mockExamResults.length
        )
      : 0;

  const stats = [
    {
      title: "Attendance",
      value: `${attendancePercentage}%`,
      icon: Clock,
      description: "Current attendance",
    },
    {
      title: "Average Marks",
      value: `${averageMarks}%`,
      icon: BookMarked,
      description: "Exam performance",
    },
    {
      title: "Notices",
      value: mockNotices.length,
      icon: Bell,
      description: "Active notices",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Track your attendance, results, and school notices
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Navigation</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/student/attendance">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Clock className="h-4 w-4" />
              View Attendance
            </Button>
          </Link>
          <Link href="/student/results">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <BookMarked className="h-4 w-4" />
              View Results
            </Button>
          </Link>
          <Link href="/student/notices">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Bell className="h-4 w-4" />
              View Notices
            </Button>
          </Link>
          <Link href="/student/complaints">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <MessageSquare className="h-4 w-4" />
              My Complaints
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Notices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Latest Notices</h2>
          <Link href="/student/notices">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {mockNotices.slice(0, 2).map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Results</h2>
          <Link href="/student/results">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Marks
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockExamResults.slice(0, 3).map((result) => {
                  const percentage = Math.round(
                    (result.marks / result.totalMarks) * 100
                  );
                  return (
                    <tr
                      key={result.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {result.subject.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {result.marks}/{result.totalMarks}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-medium text-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
