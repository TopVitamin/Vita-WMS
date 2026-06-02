import { AlertCircle, FileSearch, Grid3X3, Inbox, PackageOpen, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon?: "package" | "search" | "inbox" | "alert" | "grid" | LucideIcon;
  title?: string;
  message?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  icon = "inbox", 
  title,
  message,
  description, 
  action 
}: EmptyStateProps) {
  const iconMap = {
    package: PackageOpen,
    search: FileSearch,
    inbox: Inbox,
    alert: AlertCircle,
    grid: Grid3X3,
  };

  const Icon = typeof icon === "string" ? iconMap[icon] : icon;
  const displayTitle = title || message || "暂无数据";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2">{displayTitle}</h3>
      {description && (
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
