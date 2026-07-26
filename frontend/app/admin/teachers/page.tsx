"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Class, Subject, Teacher } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import { useSchoolId } from "@/hooks/useSchoolId";
import { fetchClasses } from "@/app/services/class.service";
import { fetchSubjects } from "@/app/services/subject.service";
import { createTeacher, deleteTeacher, fetchTeachers } from "@/app/services/teacher.service";

type TeacherRow = Teacher & { id: string };

export default function TeachersPage() {
  const schoolId = useSchoolId();
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRow | null>(null);

  const loadData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [teacherList, classList, subjectList] = await Promise.all([
        fetchTeachers(schoolId),
        fetchClasses(schoolId),
        fetchSubjects(schoolId),
      ]);
      setTeachers(teacherList);
      setClasses(classList);
      setSubjects(subjectList);
    } catch {
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [schoolId]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teachers, searchQuery]);

  const handleAddTeacher = async (formData: Record<string, string>) => {
    try {
      const created = await createTeacher(schoolId, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        classId: formData.classId,
        subjectId: formData.subjectId,
      });
      setTeachers((prev) => [...prev, created]);
      setIsFormOpen(false);
      loadData(); // refresh subject teacher links
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    try {
      await deleteTeacher(selectedTeacher.id);
      setTeachers((prev) => prev.filter((t) => t.id !== selectedTeacher.id));
      setIsDeleteOpen(false);
      setSelectedTeacher(null);
    } catch {
      setError("Failed to delete teacher");
    }
  };

  const columns: Column<TeacherRow>[] = [
    {
      key: "name",
      label: "Name",
      render: (value, teacher) => (
        <div className="flex items-center gap-2">
          <img src={teacher.avatar} alt={teacher.name} className="h-8 w-8 rounded-full" />
          {value}
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject", render: (v: Subject) => v?.name || "-" },
    { key: "assignedClass", label: "Class", render: (v: Class) => v?.name || "-" },
    {
      key: "id",
      label: "Actions",
      render: (_, teacher) => (
        <button
          onClick={() => {
            setSelectedTeacher(teacher);
            setIsDeleteOpen(true);
          }}
          className="p-1 hover:bg-muted rounded"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      ),
    },
  ];

  const canAdd = classes.length > 0 && subjects.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="mt-1 text-muted-foreground">Manage all teachers</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2" disabled={!canAdd}>
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {!canAdd && !loading && (
        <p className="text-amber-600 text-sm">Create classes and subjects first.</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <SearchBar placeholder="Search teachers..." onSearch={setSearchQuery} />
          <DataTable columns={columns} data={filteredTeachers} />
        </>
      )}

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Teacher"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTeacher}
        submitLabel="Add Teacher"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" name="name" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={4}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Class</label>
          <select name="classId" required className="w-full rounded-lg border px-4 py-2">
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <select name="subjectId" required className="w-full rounded-lg border px-4 py-2">
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Teacher"
        description={`Delete ${selectedTeacher?.name}?`}
        onConfirm={handleDeleteTeacher}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedTeacher(null);
        }}
      />
    </div>
  );
}
