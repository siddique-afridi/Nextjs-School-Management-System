"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Subject } from "@/lib/constants";
import { mockSubjects } from "@/lib/data";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const handleAddSubject = (formData: Record<string, any>) => {
    const newSubject: Subject = {
      id: `subj${Date.now()}`,
      name: formData.name,
      code: formData.code,
      createdAt: new Date(),
    };
    setSubjects([...subjects, newSubject]);
    setIsFormOpen(false);
  };

  const handleDeleteSubject = () => {
    if (selectedSubject) {
      setSubjects(subjects.filter((s) => s.id !== selectedSubject.id));
      setIsDeleteOpen(false);
      setSelectedSubject(null);
    }
  };

  const columns: Column<Subject>[] = [
    {
      key: "name",
      label: "Subject Name",
      sortable: true,
    },
    {
      key: "code",
      label: "Subject Code",
      sortable: true,
    },
    {
      key: "id",
      label: "Actions",
      render: (_, subject) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setSelectedSubject(subject);
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
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="mt-1 text-muted-foreground">Manage all subjects</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <SearchBar
        placeholder="Search by subject name or code..."
        onSearch={setSearchQuery}
      />

      <DataTable columns={columns} data={filteredSubjects} />

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Subject"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubject}
        submitLabel="Add Subject"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subject Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Biology"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subject Code
          </label>
          <input
            type="text"
            name="code"
            placeholder="e.g., BIO101"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Subject"
        description={`Are you sure you want to delete ${selectedSubject?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteSubject}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedSubject(null);
        }}
      />
    </div>
  );
}
