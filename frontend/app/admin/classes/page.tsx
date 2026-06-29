"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Class } from "@/lib/constants";
import { mockClasses } from "@/lib/data";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  const handleAddClass = (formData: Record<string, any>) => {
    const newClass: Class = {
      id: `c${Date.now()}`,
      name: formData.name,
      description: formData.description || "",
      createdAt: new Date(),
      students: [],
      subjects: [],
    };
    setClasses([...classes, newClass]);
    setIsFormOpen(false);
  };

  const handleDeleteClass = () => {
    if (selectedClass) {
      setClasses(classes.filter((c) => c.id !== selectedClass.id));
      setIsDeleteOpen(false);
      setSelectedClass(null);
    }
  };

  const columns: Column<Class>[] = [
    {
      key: "name",
      label: "Class Name",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
    },
    {
      key: "id",
      label: "Students",
      render: (_, cls) => cls.students?.length || 0,
    },
    {
      key: "id",
      label: "Subjects",
      render: (_, cls) => cls.subjects?.length || 0,
    },
    {
      key: "id",
      label: "Actions",
      render: (_, cls) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={() => {
              setSelectedClass(cls);
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
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="mt-1 text-muted-foreground">Manage all classes</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <SearchBar
        placeholder="Search classes..."
        onSearch={setSearchQuery}
      />

      <DataTable columns={columns} data={filteredClasses} />

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Class"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddClass}
        submitLabel="Add Class"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Class Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Class 10-A"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Class description"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Class"
        description={`Are you sure you want to delete ${selectedClass?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteClass}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedClass(null);
        }}
      />
    </div>
  );
}
