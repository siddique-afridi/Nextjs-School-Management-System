"use client";

import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { useAuth } from "@/app/context/userContext";
import { Student } from "@/lib/constants";
import { mockStudents } from "@/lib/data";
import { Users, GraduationCap } from "lucide-react";

export default function MyClassPage() {
  const { user } = useAuth();
  const teacher = user as any;

  // In a real app, filter by teacher's assigned class
  const classStudents = mockStudents;

  const columns: Column<Student>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value, student) => (
        <div className="flex items-center gap-2">
          <img
            src={student.avatar}
            alt={student.name}
            className="h-8 w-8 rounded-full"
          />
          {value}
        </div>
      ),
    },
    {
      key: "studentId",
      label: "Student ID",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "dob",
      label: "Date of Birth",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Class</h1>
        <p className="mt-1 text-muted-foreground">
          View details about your assigned class
        </p>
      </div>

      {/* Class Info */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-foreground">
          {teacher?.assignedClass?.name || "Class Information"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {teacher?.assignedClass?.description || "No description available"}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <StatCard
          title="Total Students"
          value={classStudents.length}
          icon={GraduationCap}
          description="Students in this class"
        />
        <StatCard
          title="Class Code"
          value={teacher?.assignedClass?.name || "N/A"}
          icon={Users}
          description="Class identifier"
        />
      </div>

      {/* Students Table */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Students Enrolled</h3>
        <DataTable columns={columns} data={classStudents} />
      </div>
    </div>
  );
}
