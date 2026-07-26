import { Notice } from "@/lib/constants";
import { Bell } from "lucide-react";

interface NoticeCardProps {
  notice: Notice;
  onClick?: () => void;
}

export function NoticeCard({ notice, onClick }: NoticeCardProps) {
  const formattedDate = new Date(notice.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-border bg-card p-4 ${
        onClick ? "cursor-pointer hover:border-primary transition-colors" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="rounded-lg bg-primary/10 p-2 h-fit">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{notice.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
          <p className="mt-2 text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
