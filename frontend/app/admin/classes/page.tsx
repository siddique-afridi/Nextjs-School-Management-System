"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Class } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import { useSchoolId } from "@/hooks/useSchoolId";
import {
  createClass,
  deleteClass,
  fetchClasses,
} from "@/app/services/class.service";

export default function ClassesPage() {
  const schoolId = useSchoolId();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // useEffect runs after page loads — good place to fetch API data (like React)
  const loadClasses = async () => {
    if (!schoolId) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchClasses(schoolId);
      setClasses(data);
    } catch {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [schoolId]);

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  const handleAddClass = async (formData: Record<string, string>) => {
    try {
      const created = await createClass(schoolId, formData.name);
      setClasses((prev) => [...prev, created]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create class");
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    try {
      await deleteClass(selectedClass.id);
      setClasses((prev) => prev.filter((c) => c.id !== selectedClass.id));
      setIsDeleteOpen(false);
      setSelectedClass(null);
    } catch {
      setError("Failed to delete class");
    }
  };

  const columns: Column<Class>[] = [
    { key: "name", label: "Class Name", sortable: true },
    {
      key: "id",
      label: "Actions",
      render: (_, cls) => (
        <button
          onClick={() => {
            setSelectedClass(cls);
            setIsDeleteOpen(true);
          }}
          className="p-1 hover:bg-muted rounded transition-colors"
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
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="mt-1 text-muted-foreground">Manage all classes</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading classes...</p>
      ) : (
        <>
          <SearchBar placeholder="Search classes..." onSearch={setSearchQuery} />
          <DataTable columns={columns} data={filteredClasses} />
        </>
      )}

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
            className="w-full rounded-lg border border-input bg-background px-4 py-2"
          />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Class"
        description={`Delete ${selectedClass?.name}? This also removes its students, subjects, and teachers.`}
        onConfirm={handleDeleteClass}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedClass(null);
        }}
      />
    </div>
  );
}
