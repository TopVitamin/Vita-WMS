import type { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";

interface DetailPageLayoutProps {
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  sections?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
}

export function DetailPageLayout({
  actions,
  aside,
  children,
  description,
  meta,
  sections,
  status,
  title,
}: DetailPageLayoutProps) {
  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                {status}
              </div>
              {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
              {meta ? <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">{meta}</div> : null}
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
        </CardContent>
      </Card>

      {aside ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">{sections ?? children}</div>
          <div className="space-y-4 xl:col-span-4">{aside}</div>
        </div>
      ) : (
        <div className="space-y-4">{sections ?? children}</div>
      )}
    </div>
  );
}
