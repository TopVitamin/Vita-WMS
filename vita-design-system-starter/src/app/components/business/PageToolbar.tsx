import type { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

const kpiGridClassName: Record<3 | 4 | 5, string> = {
  3: "grid grid-cols-1 gap-4 md:grid-cols-3",
  4: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
  5: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5",
};

export function PageToolbar({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4">{children}</div>;
}

export function PageHeader({
  actions,
  description,
  title,
}: {
  actions?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function KpiGrid({ children, columns = 4 }: { children: ReactNode; columns?: 3 | 4 | 5 }) {
  return <div className={kpiGridClassName[columns]}>{children}</div>;
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

interface DataTableShellProps {
  children: ReactNode;
  description?: ReactNode;
  empty?: ReactNode;
  pagination?: ReactNode;
  title?: ReactNode;
  toolbar?: ReactNode;
}

export function DataTableShell({ children, description, empty, pagination, title, toolbar }: DataTableShellProps) {
  const hasHeader = title || description || toolbar;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {hasHeader ? (
        <div className="flex items-start justify-between gap-4 border-b px-4 py-3">
          <div className="min-w-0">
            {title ? <div className="text-base font-medium">{title}</div> : null}
            {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
          </div>
          {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
        </div>
      ) : null}
      {empty ?? children}
      {pagination ? <div className="border-t px-4 py-3">{pagination}</div> : null}
    </div>
  );
}

interface ListPageLayoutProps {
  batchActions?: ReactNode;
  children?: ReactNode;
  filters?: ReactNode;
  header?: ReactNode;
  kpis?: ReactNode;
  table?: ReactNode;
}

export function ListPageLayout({ batchActions, children, filters, header, kpis, table }: ListPageLayoutProps) {
  return (
    <div className="space-y-4 p-6">
      {header}
      {kpis}
      {filters || batchActions ? (
        <Card>
          <CardContent className="pt-6">
            {filters}
            {batchActions ? <div className="mt-4">{batchActions}</div> : null}
          </CardContent>
        </Card>
      ) : null}
      {table}
      {children}
    </div>
  );
}
