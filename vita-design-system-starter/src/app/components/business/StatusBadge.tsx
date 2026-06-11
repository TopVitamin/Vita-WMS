import type { ComponentType, ReactNode } from "react";
import { Badge } from "../ui/badge";
import type { DesignStatusTone } from "../../types/design-system";

const toneClassName: Record<DesignStatusTone, string> = {
  success: "bg-success-50 text-success-600 border-success-200",
  warning: "bg-warning-50 text-warning-600 border-warning-200",
  error: "bg-error-50 text-error-600 border-error-200",
  info: "bg-info-50 text-info-600 border-info-200",
  muted: "bg-gray-100 text-gray-600 border-gray-300",
  primary: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({
  Icon,
  icon,
  label,
  tone,
}: {
  Icon?: ComponentType<{ className?: string }>;
  icon?: ReactNode;
  label: string;
  tone: DesignStatusTone;
}) {
  const renderedIcon = icon ?? (Icon ? <Icon className="h-3.5 w-3.5" /> : null);

  return (
    <Badge variant="outline" className={toneClassName[tone]}>
      {renderedIcon}
      {label}
    </Badge>
  );
}
