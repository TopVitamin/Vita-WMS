import type { ReactNode } from "react";

export function PageToolbar({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4">{children}</div>;
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-6">{children}</div>;
}

export function BatchActionBar({ selectedCount, children }: { selectedCount: number; children: ReactNode }) {
  if (selectedCount <= 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-3">
      <div className="text-sm text-primary">已选择 {selectedCount} 项</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function DataTableShell({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border bg-card overflow-hidden">{children}</div>;
}
