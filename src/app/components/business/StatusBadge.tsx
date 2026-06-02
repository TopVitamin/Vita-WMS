import { AlertCircle, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import type { InventoryStockStatus, PickingTaskStatus, PriorityLevel, WmsStatusTone } from "../../types/wms";

const toneClassName: Record<WmsStatusTone, string> = {
  success: "bg-success-50 text-success-600 border-success-200",
  warning: "bg-warning-50 text-warning-600 border-warning-200",
  error: "bg-error-50 text-error-600 border-error-200",
  info: "bg-info-50 text-info-600 border-info-200",
  muted: "bg-gray-100 text-gray-600 border-gray-300",
  primary: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ label, tone }: { label: string; tone: WmsStatusTone }) {
  return (
    <Badge variant="outline" className={toneClassName[tone]}>
      {label}
    </Badge>
  );
}

export function StockStatusBadge({ currentStock, safetyStock }: { currentStock: number; safetyStock: number }) {
  if (currentStock === 0) return <StatusBadge label="缺货" tone="error" />;
  if (currentStock < safetyStock) return <StatusBadge label="库存不足" tone="warning" />;
  return <StatusBadge label="正常" tone="success" />;
}

export function InventoryStatusBadge({ status }: { status: InventoryStockStatus }) {
  switch (status) {
    case "正常":
      return <StatusBadge label="正常" tone="success" />;
    case "不足":
      return (
        <Badge variant="outline" className={toneClassName.warning}>
          <AlertTriangle className="w-3 h-3 mr-1" />
          不足
        </Badge>
      );
    case "缺货":
      return (
        <Badge variant="outline" className={toneClassName.error}>
          <AlertCircle className="w-3 h-3 mr-1" />
          缺货
        </Badge>
      );
    case "超储":
      return <StatusBadge label="超储" tone="info" />;
    case "呆滞":
      return (
        <Badge variant="outline" className={toneClassName.muted}>
          <Clock className="w-3 h-3 mr-1" />
          呆滞
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const tone: WmsStatusTone = priority === "紧急" ? "error" : priority === "高" ? "warning" : priority === "中" ? "info" : "muted";
  return <StatusBadge label={priority} tone={tone} />;
}

export function PickingTaskStatusBadge({ status }: { status: PickingTaskStatus }) {
  const tone: WmsStatusTone = status === "已完成" ? "success" : status === "拣货中" ? "primary" : status === "待拣货" ? "warning" : "muted";
  return <StatusBadge label={status} tone={tone} />;
}
