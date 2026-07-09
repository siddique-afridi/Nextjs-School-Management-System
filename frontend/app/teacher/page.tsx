"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Users, Clock, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/userContext";
import { fetchClassStudents } from "@/app/services/portal/teacher.portal";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [studentCount, setStudentCount] = useState(0);

  const classId = user?.teachSclass?._id;
  const className = user?.teachSclass?.sclassName ?? "N/A";
  const subjectName = user?.teachSubject?.subName ?? "N/A";

  useEffect(() => {
    if (!classId) return;
    fetchClassStudents(classId).then((list) => setStudentCount(list.length));
  }, [classId]);

  const stats = [
    { title: "Students in Class", value: studentCount, icon: GraduationCap, description: "Active students" },
    { title: "Subject", value: subjectName, icon: BookOpen, description: "Assigned subject" },
    { title: "Class", value: className, icon: Users, description: "Assigned class" },
    { title: "Attendance", value: "Mark", icon: Clock, description: "Use attendance page" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-muted-foreground">Manage your class and track attendance</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Link href="/teacher/attendance"><Button className="w-full">Mark Attendance</Button></Link>
        <Link href="/teacher/my-class"><Button variant="outline" className="w-full">View My Class</Button></Link>
        <Link href="/teacher/profile"><Button variant="outline" className="w-full">View Profile</Button></Link>
      </div>
    </div>
  );
}
