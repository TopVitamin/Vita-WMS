import type { ComponentType, ReactNode } from "react";
import { Badge } from "../ui/badge";
import type { DesignStatusTone } from "../../types/design-system";

const toneClassName: Record<DesignStatusTone, string> = {
  success: "bg-success-50 text-success-600 border-success-600/20",
  warning: "bg-warning-50 text-warning-600 border-warning-600/25",
  error: "bg-error-50 text-error-600 border-error-600/20",
  info: "bg-info-50 text-info-600 border-info-600/20",
  muted: "bg-muted text-muted-foreground border-muted-foreground/20",
  primary: "bg-primary/10 text-primary border-primary/30",
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
  return (
    <Badge variant="outline" className={toneClassName[tone]}>
      {label}
    </Badge>
  );
}
