"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormDialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  children: React.ReactNode;
  submitLabel?: string;
  loading?: boolean;
}

export function FormDialog({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "Submit",
  loading = false,
}: FormDialogProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {children}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
