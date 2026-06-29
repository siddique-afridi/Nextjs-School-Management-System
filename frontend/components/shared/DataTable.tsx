"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className={`overflow-x-auto rounded-lg border border-border ${className}`}>
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${
                  column.sortable ? "cursor-pointer hover:bg-muted" : ""
                } ${column.width || ""}`}
                onClick={() =>
                  column.sortable && handleSort(column.key)
                }
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={item.id || index}
              className={`border-b border-border hover:bg-muted/50 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-4 py-3 text-sm text-foreground"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
