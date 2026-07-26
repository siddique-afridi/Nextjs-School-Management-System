"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { Notice } from "@/lib/constants";
import { useAuth } from "@/app/context/userContext";
import { fetchSchoolNotices } from "@/app/services/portal/student.portal";

export default function NoticesPage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const schoolId = user?.school?._id;
    if (!schoolId) return;
    fetchSchoolNotices(schoolId).then(setNotices);
  }, [user?.school?._id]);

  const filtered = useMemo(
    () =>
      notices.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [notices, searchQuery],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">School Notices</h1>
      <SearchBar placeholder="Search notices..." onSearch={setSearchQuery} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((n) => (
          <NoticeCard key={n.id} notice={n} />
        ))}
      </div>
    </div>
  );
}
