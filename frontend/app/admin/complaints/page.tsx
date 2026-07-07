"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Complaint } from "@/lib/constants";
import { useSchoolId } from "@/hooks/useSchoolId";
import { fetchComplaints } from "@/app/services/complaint.service";

export default function ComplaintsPage() {
  const schoolId = useSchoolId();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!schoolId) return;
    fetchComplaints(schoolId)
      .then(setComplaints)
      .catch(() => setError("Failed to load complaints"))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(
      (c) =>
        c.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [complaints, searchQuery]);

  const columns: Column<Complaint>[] = [
    {
      key: "student",
      label: "Student",
      render: (value: Complaint["student"]) => (
        <div className="flex items-center gap-2">
          <img src={value.avatar} alt={value.name} className="h-8 w-8 rounded-full" />
          {value.name}
        </div>
      ),
    },
    {
      key: "description",
      label: "Complaint",
      render: (value) => <div className="max-w-md">{value}</div>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          Pending
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
        <p className="mt-1 text-muted-foreground">
          View student complaints (resolve feature needs backend support)
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <SearchBar placeholder="Search complaints..." onSearch={setSearchQuery} />
          <DataTable columns={columns} data={filteredComplaints} />
        </>
      )}
    </div>
  );
}
