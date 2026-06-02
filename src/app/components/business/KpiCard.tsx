import { Card, CardContent, CardHeader } from "../ui/card";
import type { KpiMetric } from "../../types/wms";

const toneClasses: Record<NonNullable<KpiMetric["tone"]>, string> = {
  success: "text-success-600",
  warning: "text-warning-600",
  error: "text-error-600",
  info: "text-info-600",
  muted: "text-muted-foreground",
  primary: "text-primary",
};

export function KpiCard({ label, value, unit, tone, helper }: KpiMetric) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={`text-3xl ${tone ? toneClasses[tone] : ""}`}>{value}</div>
          {unit ? <div className="text-xs text-muted-foreground">{unit}</div> : null}
        </div>
        {helper ? <div className="mt-1 text-xs text-muted-foreground">{helper}</div> : null}
      </CardContent>
    </Card>
  );
}
