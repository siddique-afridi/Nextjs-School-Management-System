"use client";

import { useEffect, useState } from "react";
import { DataTable, Column } from "@/components/shared/DataTable";
import { ExamResult } from "@/lib/constants";
import { useAuth } from "@/app/context/userContext";
import { fetchStudentProfile, mapExamResultRows } from "@/app/services/portal/student.portal";

export default function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    if (!user?._id) return;
    fetchStudentProfile(user._id).then((p) => {
      setResults(mapExamResultRows((p.examResult as Record<string, unknown>[]) ?? []));
    });
  }, [user?._id]);

  const avg =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + (r.marks / r.totalMarks) * 100, 0) / results.length)
      : 0;

  const columns: Column<ExamResult>[] = [
    { key: "subject", label: "Subject", render: (v: ExamResult["subject"]) => v?.name },
    { key: "marks", label: "Marks", render: (v, r) => `${v}/${r.totalMarks}` },
    {
      key: "marks",
      label: "%",
      render: (v, r) => `${Math.round((v / r.totalMarks) * 100)}%`,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Results</h1>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">Average</p>
        <p className="text-3xl font-bold">{avg}%</p>
      </div>
      <DataTable columns={columns} data={results} />
    </div>
  );
}
