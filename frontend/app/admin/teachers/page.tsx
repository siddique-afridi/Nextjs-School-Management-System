"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Teacher } from "@/lib/constants";
import { mockTeachers } from "@/lib/data";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  const handleAddTeacher = (formData: Record<string, any>) => {
    const newTeacher: Teacher = {
      id: `t${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      role: "teacher" as const,
      employeeId: formData.employeeId,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    };
    setTeachers([...teachers, newTeacher]);
    setIsFormOpen(false);
  };

  const handleDeleteTeacher = () => {
    if (selectedTeacher) {
      setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id));
      setIsDeleteOpen(false);
      setSelectedTeacher(null);
    }
  };

  const columns: Column<Teacher>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value, teacher) => (
        <div className="flex items-center gap-2">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="h-8 w-8 rounded-full"
          />
          {value}
        </div>
      ),
    },
    {
      key: "employeeId",
      label: "Employee ID",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "subject",
      label: "Subject",
      render: (value: any) => value?.name || "-",
    },
    {
      key: "id",
      label: "Actions",
      render: (_, teacher) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setSelectedTeacher(teacher);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all teachers in the school
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <SearchBar
        placeholder="Search by name, email, or employee ID..."
        onSearch={setSearchQuery}
      />

      <DataTable columns={columns} data={filteredTeachers} />

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Teacher"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTeacher}
        submitLabel="Add Teacher"
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
            Employee ID
          </label>
          <input
            type="text"
            name="employeeId"
            placeholder="e.g., EMP004"
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
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Teacher"
        description={`Are you sure you want to delete ${selectedTeacher?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteTeacher}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedTeacher(null);
        }}
      />
    </div>
  );
}
