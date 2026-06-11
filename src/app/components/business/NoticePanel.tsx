import type { ComponentType, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { DesignStatusTone } from "../../types/design-system";
import { cn } from "../ui/utils";

const toneClassName: Record<DesignStatusTone, string> = {
  success: "border-success-200 bg-success-50 text-success-700",
  warning: "border-warning-200 bg-warning-50 text-warning-700",
  error: "border-error-200 bg-error-50 text-error-700",
  info: "border-info-200 bg-info-50 text-info-700",
  muted: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/20 bg-primary/5 text-primary",
};

const iconMap: Record<DesignStatusTone, ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
  info: Info,
  muted: Info,
  primary: Info,
};

interface NoticePanelProps {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  title?: ReactNode;
  tone?: DesignStatusTone;
}

export function NoticePanel({ children, className, description, icon, title, tone = "info" }: NoticePanelProps) {
  const Icon = icon ?? iconMap[tone];

  return (
    <div className={cn("rounded-lg border p-4", toneClassName[tone], className)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 text-sm">
          {title ? <div className="mb-1 font-medium">{title}</div> : null}
          {description ? <div className="text-current/80">{description}</div> : null}
          {children ? <div className={title || description ? "mt-2" : ""}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
