"use client";

import { DataTable, Column } from "@/components/shared/DataTable";
import { ExamResult } from "@/lib/constants";
import { mockExamResults } from "@/lib/data";

export default function ResultsPage() {
  const averageMarks =
    mockExamResults.length > 0
      ? Math.round(
          mockExamResults.reduce((sum, r) => sum + (r.marks / r.totalMarks) * 100, 0) /
            mockExamResults.length
        )
      : 0;

  const columns: Column<ExamResult>[] = [
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (value: any) => value?.name || "-",
    },
    {
      key: "marks",
      label: "Marks",
      sortable: true,
      render: (value, result) => `${value}/${result.totalMarks}`,
    },
    {
      key: "marks",
      label: "Percentage",
      render: (value, result) => {
        const percentage = Math.round((value / result.totalMarks) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="font-medium text-foreground min-w-10">{percentage}%</span>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="mt-1 text-muted-foreground">
          View your exam results and performance
        </p>
      </div>

      {/* Average Performance */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Average Performance
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">{averageMarks}%</p>
          </div>
          <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{averageMarks}%</p>
              <p className="text-xs text-muted-foreground mt-1">Overall</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results by Subject */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Results by Subject</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockExamResults.map((result) => {
            const percentage = Math.round((result.marks / result.totalMarks) * 100);
            const getGrade = (percentage: number) => {
              if (percentage >= 90) return "A+";
              if (percentage >= 80) return "A";
              if (percentage >= 70) return "B";
              if (percentage >= 60) return "C";
              return "D";
            };
            const grade = getGrade(percentage);

            return (
              <div
                key={result.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="font-semibold text-foreground">
                  {result.subject.name}
                </h3>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Marks</p>
                    <p className="text-2xl font-bold text-foreground">
                      {result.marks}/{result.totalMarks}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="text-2xl font-bold text-primary">{grade}</p>
                  </div>
                </div>
                <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-right">
                  {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Results Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">All Results</h2>
        <DataTable columns={columns} data={mockExamResults} />
      </div>
    </div>
  );
}
