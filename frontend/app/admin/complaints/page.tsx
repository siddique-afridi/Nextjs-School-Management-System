"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Complaint } from "@/lib/constants";
import { mockComplaints } from "@/lib/data";
import { CheckCircle, Clock } from "lucide-react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">(
    "all"
  );

  const filteredComplaints = useMemo(() => {
    let result = complaints.filter(
      (complaint) =>
        complaint.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterStatus !== "all") {
      result = result.filter((c) => c.status === filterStatus);
    }

    return result;
  }, [complaints, searchQuery, filterStatus]);

  const handleResolve = (complaintId: string) => {
    setComplaints(
      complaints.map((c) =>
        c.id === complaintId
          ? { ...c, status: "resolved" as const, resolvedAt: new Date() }
          : c
      )
    );
  };

  const columns: Column<Complaint>[] = [
    {
      key: "student",
      label: "Student",
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <img
            src={value.avatar}
            alt={value.name}
            className="h-8 w-8 rounded-full"
          />
          {value.name}
        </div>
      ),
    },
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
      key: "id",
      label: "Actions",
      render: (value, complaint) => (
        complaint.status === "pending" && (
          <button
            onClick={() => handleResolve(complaint.id)}
            className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Mark Resolved
          </button>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
        <p className="mt-1 text-muted-foreground">
          Manage student complaints and resolutions
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          placeholder="Search by student or title..."
          onSearch={setSearchQuery}
          className="flex-1"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-input hover:bg-muted"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-primary text-primary-foreground"
                : "border border-input hover:bg-muted"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("resolved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "resolved"
                ? "bg-primary text-primary-foreground"
                : "border border-input hover:bg-muted"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredComplaints} />
    </div>
  );
}
