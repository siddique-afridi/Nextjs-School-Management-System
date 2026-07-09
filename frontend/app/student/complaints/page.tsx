"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { Complaint } from "@/lib/constants";
import { useAuth } from "@/app/context/userContext";
import { fetchMyComplaints, submitComplaint } from "@/app/services/portal/student.portal";
import { Plus } from "lucide-react";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");

  const load = () => fetchMyComplaints().then(setComplaints);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (formData: Record<string, string>) => {
    setError("");
    try {
      const text = `${formData.title}: ${formData.description}`;
      const created = await submitComplaint(text);
      setComplaints((prev) => [created, ...prev]);
      setIsFormOpen(false);
    } catch {
      setError("Failed to submit complaint");
    }
  };

  const columns: Column<Complaint>[] = [
    { key: "description", label: "Complaint" },
    { key: "createdAt", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
    { key: "status", label: "Status", render: () => "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Complaints</h1>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Complaint
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <DataTable columns={columns} data={complaints} />

      <FormDialog
        isOpen={isFormOpen}
        title="Submit Complaint"
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        submitLabel="Submit"
      >
        <input type="text" name="title" placeholder="Title" required className="w-full border rounded-lg px-4 py-2" />
        <textarea name="description" placeholder="Details" rows={4} required className="w-full border rounded-lg px-4 py-2" />
      </FormDialog>
    </div>
  );
}
