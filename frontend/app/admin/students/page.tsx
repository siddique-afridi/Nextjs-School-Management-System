"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Student, UserRole } from "@/lib/constants";
import { mockStudents } from "@/lib/data";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const handleAddStudent = (formData: Record<string, any>) => {
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      role: UserRole.STUDENT,
      studentId: formData.studentId,
      class: students[0]?.class || mockStudents[0].class,
      dob: formData.dob || "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    };
    setStudents([...students, newStudent]);
    setIsFormOpen(false);
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      setIsDeleteOpen(false);
      setSelectedStudent(null);
    }
  };

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
      sortable: true,
    },
    {
      key: "class",
      label: "Class",
      render: (value: any) => value?.name || "-",
    },
    {
      key: "id",
      label: "Actions",
      render: (_, student) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setSelectedStudent(student);
              setIsDeleteOpen(true);
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all students in the school
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search by name, email, or student ID..."
        onSearch={setSearchQuery}
      />

      {/* Table */}
      <DataTable columns={columns} data={filteredStudents} />

      {/* Add/Edit Form Dialog */}
      <FormDialog
        isOpen={isFormOpen}
        title="Add New Student"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddStudent}
        submitLabel="Add Student"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            placeholder="e.g., STU006"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteStudent}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
