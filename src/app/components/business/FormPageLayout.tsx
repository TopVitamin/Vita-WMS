import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface FormPageLayoutProps {
  actions?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onCancel?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  title: ReactNode;
}

export function FormPageLayout({
  actions,
  children,
  description,
  footer,
  onCancel,
  onSubmit,
  submitLabel = "保存",
  title,
}: FormPageLayoutProps) {
  const renderedFooter =
    footer ??
    (onCancel || onSubmit ? (
      <>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
        ) : null}
        {onSubmit ? <Button onClick={onSubmit}>{submitLabel}</Button> : null}
      </>
    ) : null);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">{children}</CardContent>
      </Card>

      {renderedFooter ? (
        <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t bg-background/95 px-6 py-4 backdrop-blur">
          {renderedFooter}
        </div>
      ) : null}
    </div>
  );
}
