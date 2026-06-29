"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockStudents, mockAttendance } from "@/lib/data";
import { Student } from "@/lib/constants";

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleMarkAll = (status: "present" | "absent") => {
    const newAttendance: Record<string, "present" | "absent"> = {};
    mockStudents.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit to your backend API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const markedCount = Object.values(attendance).length;
  const presentCount = Object.values(attendance).filter((s) => s === "present").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
        <p className="mt-1 text-muted-foreground">Record attendance for your class</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                {markedCount} / {mockStudents.length} marked
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {presentCount} present
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleMarkAll("present")}
              className="w-full"
            >
              Mark All Present
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleMarkAll("absent")}
              className="w-full"
            >
              Mark All Absent
            </Button>
          </div>
        </div>

        {/* Students List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {mockStudents.map((student) => {
              const status = attendance[student.id] || "present";

              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(student.id)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      status === "present"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {status === "present" ? "Present" : "Absent"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Submit Attendance
          </Button>
        </div>

        {submitted && (
          <div className="rounded-lg bg-green-100 p-4 text-green-800 text-sm font-medium">
            Attendance submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
}
