import type { ComponentType, ReactNode } from "react";
import { AlertCircle, FileSearch, Grid3X3, Inbox, PackageOpen } from "lucide-react";
import { Button } from "../ui/button";

type EmptyStateIcon = "package" | "search" | "inbox" | "alert" | "grid" | ComponentType<{ className?: string }>;

interface PageEmptyStateProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  description?: ReactNode;
  icon?: EmptyStateIcon;
  title?: ReactNode;
}

const iconMap = {
  package: PackageOpen,
  search: FileSearch,
  inbox: Inbox,
  alert: AlertCircle,
  grid: Grid3X3,
};

export function PageEmptyState({
  action,
  children,
  description,
  icon = "inbox",
  title = "暂无数据",
}: PageEmptyStateProps) {
  const Icon = typeof icon === "string" ? iconMap[icon] : icon;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      {description ? <div className="mt-2 max-w-md text-sm text-muted-foreground">{description}</div> : null}
      {children ? <div className="mt-4">{children}</div> : null}
      {action ? (
        <Button className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
