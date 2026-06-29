"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { mockNotices } from "@/lib/data";

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = useMemo(() => {
    return mockNotices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Notices</h1>
        <p className="mt-1 text-muted-foreground">
          Stay updated with important school announcements
        </p>
      </div>

      <SearchBar
        placeholder="Search notices..."
        onSearch={setSearchQuery}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              No notices found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
