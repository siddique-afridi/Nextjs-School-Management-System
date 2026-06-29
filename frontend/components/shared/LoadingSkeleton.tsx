interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "table-row" | "line";
}

export function LoadingSkeleton({
  count = 3,
  type = "card",
}: LoadingSkeletonProps) {
  if (type === "card") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
              <div className="h-12 w-12 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table-row") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}
