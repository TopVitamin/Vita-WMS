import { StatusBadge } from "../business";
import { getStockStatusConfig, inventoryStatusMap, pickingTaskStatusMap, priorityStatusMap } from "../../configs/wmsStatusMap";
import type { InventoryStockStatus, PickingTaskStatus, PriorityLevel } from "../../types/wms";

export function StockStatusBadge({ currentStock, safetyStock }: { currentStock: number; safetyStock: number }) {
  return <StatusBadge {...getStockStatusConfig(currentStock, safetyStock)} />;
}

export function InventoryStatusBadge({ status }: { status: InventoryStockStatus }) {
  const config = inventoryStatusMap[status];
  return <StatusBadge {...config} />;
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return <StatusBadge {...priorityStatusMap[priority]} />;
}

export function PickingTaskStatusBadge({ status }: { status: PickingTaskStatus }) {
  return <StatusBadge {...pickingTaskStatusMap[status]} />;
}
