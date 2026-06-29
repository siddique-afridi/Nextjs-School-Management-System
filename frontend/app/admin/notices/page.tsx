"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Notice } from "@/lib/constants";
import { mockNotices } from "@/lib/data";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-context";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const user = useAuthStore((state) => state.user);

  const filteredNotices = useMemo(() => {
    return notices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notices, searchQuery]);

  const handleAddNotice = (formData: Record<string, any>) => {
    const newNotice: Notice = {
      id: `n${Date.now()}`,
      title: formData.title,
      content: formData.content,
      createdBy: user as any,
      createdAt: new Date(),
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
    };
    setNotices([newNotice, ...notices]);
    setIsFormOpen(false);
  };

  const handleDeleteNotice = () => {
    if (selectedNotice) {
      setNotices(notices.filter((n) => n.id !== selectedNotice.id));
      setIsDeleteOpen(false);
      setSelectedNotice(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage school notices
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Notice
        </Button>
      </div>

      <SearchBar
        placeholder="Search notices..."
        onSearch={setSearchQuery}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotices.map((notice) => (
          <div key={notice.id} className="relative">
            <NoticeCard notice={notice} />
            <button
              onClick={() => {
                setSelectedNotice(notice);
                setIsDeleteOpen(true);
              }}
              className="absolute top-4 right-4 p-1 hover:bg-muted rounded transition-colors opacity-0 hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      <FormDialog
        isOpen={isFormOpen}
        title="Create New Notice"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddNotice}
        submitLabel="Create Notice"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Notice title"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content
          </label>
          <textarea
            name="content"
            placeholder="Notice content"
            rows={4}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Expires At (Optional)
          </label>
          <input
            type="date"
            name="expiresAt"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={handleDeleteNotice}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedNotice(null);
        }}
      />
    </div>
  );
}
