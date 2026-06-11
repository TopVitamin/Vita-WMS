import type { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

interface WorkflowPageLayoutProps {
  actions?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  primary?: ReactNode;
  sidebar?: ReactNode;
  steps?: ReactNode;
  title: ReactNode;
}

export function WorkflowPageLayout({
  actions,
  children,
  description,
  primary,
  sidebar,
  steps,
  title,
}: WorkflowPageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {steps ? (
        <Card>
          <CardContent className="pt-6">{steps}</CardContent>
        </Card>
      ) : null}

      {primary || sidebar ? (
        <div className={sidebar ? "grid grid-cols-1 gap-6 lg:grid-cols-12" : "space-y-4"}>
          {sidebar ? <div className="space-y-4 lg:col-span-5">{sidebar}</div> : null}
          {primary ? <div className={sidebar ? "space-y-4 lg:col-span-7" : "space-y-4"}>{primary}</div> : null}
        </div>
      ) : null}

      {children}
    </div>
  );
}
