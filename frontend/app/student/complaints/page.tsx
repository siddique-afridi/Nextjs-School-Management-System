"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { Complaint } from "@/lib/constants";
import { mockComplaints } from "@/lib/data";
import { useAuth } from "@/app/context/userContext";
import { Plus, CheckCircle, Clock } from "lucide-react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmitComplaint = (formData: Record<string, any>) => {
    const newComplaint: Complaint = {
      id: `comp${Date.now()}`,
      student: user as any,
      title: formData.title,
      description: formData.description,
      status: "pending",
      createdAt: new Date(),
    };
    setComplaints([newComplaint, ...complaints]);
    setIsFormOpen(false);
  };

  const columns: Column<Complaint>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      render: (value) => <div className="max-w-xs truncate">{value}</div>,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value === "pending" ? (
            <>
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </>
          ) : (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Resolved
            </>
          )}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Complaints</h1>
          <p className="mt-1 text-muted-foreground">
            Submit and track your complaints
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Complaints</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {complaints.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{resolvedCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Resolution Rate</p>
          <p className="text-2xl font-bold text-primary mt-2">
            {complaints.length > 0
              ? Math.round((resolvedCount / complaints.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Complaints Table */}
      <DataTable columns={columns} data={complaints} />

      {/* Submit Complaint Form Dialog */}
      <FormDialog
        isOpen={isFormOpen}
        title="Submit New Complaint"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitComplaint}
        submitLabel="Submit Complaint"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Brief title of your complaint"
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
            placeholder="Describe your complaint in detail"
            rows={4}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </FormDialog>
    </div>
  );
}
