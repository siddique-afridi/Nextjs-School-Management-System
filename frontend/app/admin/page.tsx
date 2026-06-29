"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { NoticeCard } from "@/components/shared/NoticeCard";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  MessageSquare,
  Plus,
} from "lucide-react";
import {
  mockClasses,
  mockStudents,
  mockTeachers,
  mockSubjects,
  mockNotices,
  mockComplaints,
} from "@/lib/data";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: mockStudents.length,
      icon: GraduationCap,
    },
    {
      title: "Total Teachers",
      value: mockTeachers.length,
      icon: Users,
    },
    {
      title: "Total Classes",
      value: mockClasses.length,
      icon: BookOpen,
    },
    {
      title: "Total Subjects",
      value: mockSubjects.length,
      icon: BookOpen,
    },
  ];

  const quickActions = [
    { label: "Add Student", href: "/admin/students" },
    { label: "Add Teacher", href: "/admin/teachers" },
    { label: "Add Class", href: "/admin/classes" },
    { label: "Add Subject", href: "/admin/subjects" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s your school overview.
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
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Notices</h2>
          <Link href="/admin/notices">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockNotices.slice(0, 3).map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>

      {/* Pending Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Pending Complaints</h2>
          <Link href="/admin/complaints">
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
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockComplaints
                  .filter((c) => c.status === "pending")
                  .slice(0, 5)
                  .map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {complaint.student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {complaint.title}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                          Pending
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
