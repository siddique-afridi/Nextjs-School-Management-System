"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Users, BookOpen, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { useSchoolId } from "@/hooks/useSchoolId";
import { fetchClasses } from "@/app/services/class.service";
import { fetchStudents } from "@/app/services/student.service";
import { fetchTeachers } from "@/app/services/teacher.service";
import { fetchSubjects } from "@/app/services/subject.service";
import { fetchNotices } from "@/app/services/notice.service";
import { fetchComplaints } from "@/app/services/complaint.service";
import { Complaint, Notice } from "@/lib/constants";

export default function AdminDashboard() {
  const schoolId = useSchoolId();
  const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0, subjects: 0 });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    Promise.all([
      fetchStudents(schoolId),
      fetchTeachers(schoolId),
      fetchClasses(schoolId),
      fetchSubjects(schoolId),
      fetchNotices(schoolId),
      fetchComplaints(schoolId),
    ])
      .then(([students, teachers, classes, subjects, noticeList, complaintList]) => {
        setCounts({
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
          subjects: subjects.length,
        });
        setNotices(noticeList);
        setComplaints(complaintList);
      })
      .finally(() => setLoading(false));
  }, [schoolId]);

  const stats = [
    { title: "Total Students", value: counts.students, icon: GraduationCap },
    { title: "Total Teachers", value: counts.teachers, icon: Users },
    { title: "Total Classes", value: counts.classes, icon: BookOpen },
    { title: "Total Subjects", value: counts.subjects, icon: BookOpen },
  ];

  const quickActions = [
    { label: "Add Student", href: "/admin/students" },
    { label: "Add Teacher", href: "/admin/teachers" },
    { label: "Add Class", href: "/admin/classes" },
    { label: "Add Subject", href: "/admin/subjects" },
  ];

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Live data from your school database.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Notices</h2>
          <Link href="/admin/notices">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {notices.slice(0, 3).map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
          {notices.length === 0 && <p className="text-muted-foreground text-sm">No notices yet.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          <Link href="/admin/complaints">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        {complaints.length === 0 ? (
          <p className="text-muted-foreground text-sm">No complaints yet.</p>
        ) : (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Student</th>
                  <th className="px-4 py-3 text-left text-sm">Complaint</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-4 py-3 text-sm">{c.student.name}</td>
                    <td className="px-4 py-3 text-sm">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
