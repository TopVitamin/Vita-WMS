import type { OperationLogItem } from "../../types/design-system";

export function OperationLogList({ logs }: { logs: OperationLogItem[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">{log.action}</div>
            <div className="text-xs text-muted-foreground">{log.time}</div>
          </div>
          {log.detail ? <div className="mt-1 text-sm text-muted-foreground">{log.detail}</div> : null}
          {log.operator ? <div className="mt-1 text-xs text-muted-foreground">操作人：{log.operator}</div> : null}
        </div>
      ))}
    </div>
  );
}
