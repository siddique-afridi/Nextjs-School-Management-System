"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { useAuth } from "@/app/context/userContext";
import { fetchClassStudents } from "@/app/services/portal/teacher.portal";
import { Student } from "@/lib/constants";
import { GraduationCap, Users } from "lucide-react";

type StudentRow = Student & { id: string };

export default function MyClassPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const className = user?.teachSclass?.sclassName ?? "My Class";

  useEffect(() => {
    const classId = user?.teachSclass?._id;
    if (!classId) return;
    fetchClassStudents(classId)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [user?.teachSclass?._id]);

  const columns: Column<StudentRow>[] = [
    {
      key: "name",
      label: "Name",
      render: (value, student) => (
        <div className="flex items-center gap-2">
          <img src={student.avatar} alt={student.name} className="h-8 w-8 rounded-full" />
          {value}
        </div>
      ),
    },
    { key: "studentId", label: "Roll No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Class</h1>
        <p className="mt-1 text-muted-foreground">{className}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} />
        <StatCard title="Class" value={className} icon={Users} />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading students...</p>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
}
