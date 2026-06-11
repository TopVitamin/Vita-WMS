import { Progress } from "../ui/progress";

export function QuantityProgress({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current}/{total}
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} />
    </div>
  );
}
