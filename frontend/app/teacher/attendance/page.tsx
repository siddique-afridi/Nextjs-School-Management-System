"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/userContext";
import { fetchClassStudents, markStudentAttendance } from "@/app/services/portal/teacher.portal";
import { Student } from "@/lib/constants";

type StudentRow = Student & { id: string };

export default function AttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, "Present" | "Absent">>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const subjectId = user?.teachSubject?._id;
  const classId = user?.teachSclass?._id;

  useEffect(() => {
    if (!classId) return;
    fetchClassStudents(classId)
      .then((list) => {
        setStudents(list);
        const defaults: Record<string, "Present" | "Absent"> = {};
        list.forEach((s) => { defaults[s.id] = "Present"; });
        setAttendance(defaults);
      })
      .finally(() => setLoading(false));
  }, [classId]);

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return;
    setError("");
    setMessage("");
    try {
      await Promise.all(
        students.map((s) =>
          markStudentAttendance(s.id, {
            subjectId,
            status: attendance[s.id] ?? "Present",
            date,
          })
        )
      );
      setMessage("Attendance submitted successfully!");
    } catch {
      setError("Failed to submit attendance");
    }
  };

  if (!subjectId) {
    return <p className="text-amber-600">No subject assigned. Contact admin.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
        <p className="mt-1 text-muted-foreground">
          Subject: {user?.teachSubject?.subName} | Class: {user?.teachSclass?.sclassName}
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border px-4 py-2"
            required
          />

          <div className="rounded-lg border divide-y">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Roll {student.studentId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(student.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    attendance[student.id] === "Present"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {attendance[student.id] ?? "Present"}
                </button>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">Submit Attendance</Button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      )}
    </div>
  );
}
