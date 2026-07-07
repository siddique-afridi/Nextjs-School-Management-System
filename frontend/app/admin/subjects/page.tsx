"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { Subject } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import { useSchoolId } from "@/hooks/useSchoolId";
import { fetchClasses } from "@/app/services/class.service";
import {
  createSubject,
  deleteSubject,
  fetchSubjects,
} from "@/app/services/subject.service";
import { Class } from "@/lib/constants";

export default function SubjectsPage() {
  const schoolId = useSchoolId();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const loadData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [subjectList, classList] = await Promise.all([
        fetchSubjects(schoolId),
        fetchClasses(schoolId),
      ]);
      setSubjects(subjectList);
      setClasses(classList);
    } catch {
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [schoolId]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const handleAddSubject = async (formData: Record<string, string>) => {
    try {
      const created = await createSubject(schoolId, {
        name: formData.name,
        code: formData.code,
        sessions: formData.sessions || "30",
        classId: formData.classId,
      });
      setSubjects((prev) => [...prev, created]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subject");
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    try {
      await deleteSubject(selectedSubject.id);
      setSubjects((prev) => prev.filter((s) => s.id !== selectedSubject.id));
      setIsDeleteOpen(false);
      setSelectedSubject(null);
    } catch {
      setError("Failed to delete subject");
    }
  };

  const columns: Column<Subject>[] = [
    { key: "name", label: "Subject Name", sortable: true },
    { key: "code", label: "Code", sortable: true },
    {
      key: "id",
      label: "Actions",
      render: (_, subject) => (
        <button
          onClick={() => {
            setSelectedSubject(subject);
            setIsDeleteOpen(true);
          }}
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
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="mt-1 text-muted-foreground">Manage all subjects</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2" disabled={classes.length === 0}>
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {classes.length === 0 && !loading && (
        <p className="text-amber-600 text-sm">Create a class first before adding subjects.</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <SearchBar placeholder="Search subjects..." onSearch={setSearchQuery} />
          <DataTable columns={columns} data={filteredSubjects} />
        </>
      )}

      <FormDialog
        isOpen={isFormOpen}
        title="Add New Subject"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubject}
        submitLabel="Add Subject"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Class</label>
          <select name="classId" required className="w-full rounded-lg border px-4 py-2">
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subject Name</label>
          <input type="text" name="name" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subject Code</label>
          <input type="text" name="code" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sessions</label>
          <input type="number" name="sessions" defaultValue="30" required className="w-full rounded-lg border px-4 py-2" />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Subject"
        description={`Delete ${selectedSubject?.name}?`}
        onConfirm={handleDeleteSubject}
        onCancel={() => { setIsDeleteOpen(false); setSelectedSubject(null); }}
      />
    </div>
  );
}
