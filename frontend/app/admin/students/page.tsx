"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Class, Student } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import { useSchoolId } from "@/hooks/useSchoolId";
import { fetchClasses } from "@/app/services/class.service";
import {
  createStudent,
  deleteStudent,
  fetchStudents,
} from "@/app/services/student.service";

type StudentRow = Student & { id: string };

export default function StudentsPage() {
  const schoolId = useSchoolId();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  const loadData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [studentList, classList] = await Promise.all([
        fetchStudents(schoolId),
        fetchClasses(schoolId),
      ]);
      setStudents(studentList);
      setClasses(classList);
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [schoolId]);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.includes(searchQuery)
    );
  }, [students, searchQuery]);

  const handleAddStudent = async (formData: Record<string, string>) => {
    try {
      const created = await createStudent(schoolId, {
        name: formData.name,
        rollNum: formData.rollNum,
        password: formData.password,
        classId: formData.classId,
      });
      setStudents((prev) => [...prev, created]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add student");
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent(selectedStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
      setIsDeleteOpen(false);
      setSelectedStudent(null);
    } catch {
      setError("Failed to delete student");
    }
  };

  const columns: Column<StudentRow>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value, student) => (
        <div className="flex items-center gap-2">
          <img src={student.avatar} alt={student.name} className="h-8 w-8 rounded-full" />
          {value}
        </div>
      ),
    },
    { key: "studentId", label: "Roll No", sortable: true },
    { key: "class", label: "Class", render: (v: Class) => v?.name || "-" },
    {
      key: "id",
      label: "Actions",
      render: (_, student) => (
        <button
          onClick={() => { setSelectedStudent(student); setIsDeleteOpen(true); }}
          className="p-1 hover:bg-muted rounded"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">Manage all students</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2" disabled={classes.length === 0}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <SearchBar placeholder="Search by name or roll number..." onSearch={setSearchQuery} />
          <DataTable columns={columns} data={filteredStudents} />
        </>
      )}

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Student"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddStudent}
        submitLabel="Add Student"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" name="name" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Roll Number</label>
          <input type="number" name="rollNum" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input type="password" name="password" required minLength={4} className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Class</label>
          <select name="classId" required className="w-full rounded-lg border px-4 py-2">
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Student"
        description={`Delete ${selectedStudent?.name}?`}
        onConfirm={handleDeleteStudent}
        onCancel={() => { setIsDeleteOpen(false); setSelectedStudent(null); }}
      />
    </div>
  );
}
