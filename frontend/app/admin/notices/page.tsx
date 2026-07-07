"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Notice } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";
import { useSchoolId } from "@/hooks/useSchoolId";
import {
  createNotice,
  deleteNotice,
  fetchNotices,
} from "@/app/services/notice.service";

export default function NoticesPage() {
  const schoolId = useSchoolId();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const loadNotices = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      setNotices(await fetchNotices(schoolId));
    } catch {
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [schoolId]);

  const filteredNotices = useMemo(() => {
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notices, searchQuery]);

  const handleAddNotice = async (formData: Record<string, string>) => {
    try {
      const created = await createNotice(schoolId, {
        title: formData.title,
        content: formData.content,
      });
      setNotices((prev) => [created, ...prev]);
      setIsFormOpen(false);
    } catch {
      setError("Failed to create notice");
    }
  };

  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;
    try {
      await deleteNotice(selectedNotice.id);
      setNotices((prev) => prev.filter((n) => n.id !== selectedNotice.id));
      setIsDeleteOpen(false);
      setSelectedNotice(null);
    } catch {
      setError("Failed to delete notice");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices</h1>
          <p className="mt-1 text-muted-foreground">Create and manage school notices</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Notice
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <SearchBar placeholder="Search notices..." onSearch={setSearchQuery} />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="relative group">
                <NoticeCard notice={notice} />
                <button
                  onClick={() => { setSelectedNotice(notice); setIsDeleteOpen(true); }}
                  className="absolute top-4 right-4 p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <FormDialog
        isOpen={isFormOpen}
        title="Create New Notice"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddNotice}
        submitLabel="Create Notice"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" name="title" required className="w-full rounded-lg border px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea name="content" rows={4} required className="w-full rounded-lg border px-4 py-2" />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Notice"
        description="Delete this notice?"
        onConfirm={handleDeleteNotice}
        onCancel={() => { setIsDeleteOpen(false); setSelectedNotice(null); }}
      />
    </div>
  );
}
