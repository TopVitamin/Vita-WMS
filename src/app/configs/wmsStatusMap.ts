import type { ComponentType } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Play } from "lucide-react";
import type { DesignStatusTone } from "../types/design-system";
import type { InventoryStockStatus, PickingTaskStatus, PriorityLevel } from "../types/wms";

export interface StatusDisplayConfig {
  label: string;
  tone: DesignStatusTone;
  Icon?: ComponentType<{ className?: string }>;
}

export const inventoryStatusMap: Record<InventoryStockStatus, StatusDisplayConfig> = {
  正常: { label: "正常", tone: "success" },
  不足: { label: "不足", tone: "warning", Icon: AlertTriangle },
  缺货: { label: "缺货", tone: "error", Icon: AlertCircle },
  超储: { label: "超储", tone: "info" },
  呆滞: { label: "呆滞", tone: "muted", Icon: Clock },
};

export const pickingTaskStatusMap: Record<PickingTaskStatus, StatusDisplayConfig> = {
  待分配: { label: "待分配", tone: "muted" },
  待拣货: { label: "待拣货", tone: "warning" },
  拣货中: { label: "拣货中", tone: "primary" },
  已完成: { label: "已完成", tone: "success" },
};

export const pickingDetailStatusMap: Record<string, StatusDisplayConfig> = {
  待分配: { label: "待分配", tone: "muted" },
  待拣货: { label: "待拣货", tone: "warning" },
  拣货中: { label: "拣货中", tone: "primary", Icon: Play },
  已完成: { label: "已完成", tone: "success", Icon: CheckCircle },
  已取消: { label: "已取消", tone: "error" },
};

export const packingTaskStatusMap: Record<string, StatusDisplayConfig> = {
  待打包: { label: "待打包", tone: "muted" },
  打包中: { label: "打包中", tone: "warning", Icon: Play },
  已打包: { label: "已打包", tone: "success", Icon: CheckCircle },
};

export const priorityStatusMap: Record<PriorityLevel, StatusDisplayConfig> = {
  紧急: { label: "紧急", tone: "error" },
  高: { label: "高", tone: "warning" },
  中: { label: "中", tone: "info" },
  低: { label: "低", tone: "muted" },
};

export const inboundOrderStatusMap: Record<string, StatusDisplayConfig> = {
  pending: { label: "待收货", tone: "warning", Icon: Clock },
  receiving: { label: "收货中", tone: "info", Icon: Play },
  received: { label: "已收货", tone: "success", Icon: CheckCircle },
  shelved: { label: "已上架", tone: "primary", Icon: CheckCircle },
  cancelled: { label: "已取消", tone: "muted" },
};

export const outboundOrderStatusMap: Record<string, StatusDisplayConfig> = {
  pending: { label: "待处理", tone: "warning", Icon: Clock },
  pending_wave: { label: "待分波", tone: "warning" },
  waved: { label: "已分波", tone: "info" },
  pending_pick: { label: "待拣货", tone: "warning", Icon: Clock },
  picking: { label: "拣货中", tone: "primary" },
  pending_sort: { label: "待分拣", tone: "info" },
  pending_review: { label: "待复核", tone: "warning" },
  pending_pack: { label: "待打包", tone: "info" },
  pending_weight: { label: "待称重", tone: "info" },
  pending_ship: { label: "待出库", tone: "primary" },
  shipped: { label: "已出库", tone: "success" },
  completed: { label: "已完成", tone: "success" },
  cancelled: { label: "已取消", tone: "muted" },
  exception: { label: "异常", tone: "error", Icon: AlertTriangle },
};

export const outboundPackageStatusMap: Record<string, StatusDisplayConfig> = {
  pending_weight: { label: "待称重", tone: "info", Icon: Clock },
  pending_ship: { label: "待出库", tone: "primary", Icon: Play },
  shipped: { label: "已出库", tone: "success", Icon: CheckCircle },
  exception: { label: "异常", tone: "error", Icon: AlertTriangle },
};

export const outboundTypeStatusMap: Record<string, StatusDisplayConfig> = {
  b2c: { label: "电商 B2C 小单", tone: "primary" },
  store_transfer: { label: "门店补货调拨", tone: "info" },
  wholesale: { label: "批发大单", tone: "warning" },
};

export const orderStructureStatusMap: Record<string, StatusDisplayConfig> = {
  single_single: { label: "单品单件", tone: "info" },
  single_multi: { label: "单品多件", tone: "primary" },
  multi_mixed: { label: "多品混合", tone: "warning" },
};

export const waveStatusMap: Record<string, StatusDisplayConfig> = {
  created: { label: "待提交", tone: "muted" },
  assigned: { label: "已提交", tone: "info" },
  pending: { label: "待拣货", tone: "warning" },
  picking: { label: "拣货中", tone: "primary" },
  picked: { label: "拣货完成", tone: "success" },
  sorting: { label: "分拣中", tone: "info" },
  sorted: { label: "已分拣", tone: "primary" },
  completed: { label: "已完成", tone: "success" },
  shipped: { label: "已发货", tone: "success", Icon: CheckCircle },
  exception: { label: "异常", tone: "error", Icon: AlertTriangle },
  cancelled: { label: "已取消", tone: "muted" },
};

export const putawayStatusMap: Record<string, StatusDisplayConfig> = {
  待上架: { label: "待上架", tone: "warning" },
  上架中: { label: "上架中", tone: "info" },
  已上架: { label: "已上架", tone: "success" },
};

export const itemProgressStatusMap: Record<string, StatusDisplayConfig> = {
  pending: { label: "待处理", tone: "warning", Icon: AlertCircle },
  waiting: { label: "待处理", tone: "warning", Icon: AlertCircle },
  in_progress: { label: "进行中", tone: "info", Icon: Clock },
  completed: { label: "已完成", tone: "success", Icon: CheckCircle },
  receive_pending: { label: "待收货", tone: "warning", Icon: AlertCircle },
  receiving: { label: "收货中", tone: "info", Icon: Clock },
  receive_completed: { label: "已收齐", tone: "success", Icon: CheckCircle },
  putaway_pending: { label: "待上架", tone: "warning", Icon: AlertCircle },
  putaway_in_progress: { label: "上架中", tone: "info", Icon: Clock },
  putaway_completed: { label: "已完成", tone: "success", Icon: CheckCircle },
};

export const outboundItemProgressStatusMap: Record<string, StatusDisplayConfig> = {
  pending: { label: "待分配", tone: "warning" },
  allocated: { label: "已分配", tone: "info" },
  picking: { label: "拣货中", tone: "info", Icon: Clock },
  picked: { label: "已拣货", tone: "primary", Icon: CheckCircle },
  shipped: { label: "已发货", tone: "success", Icon: CheckCircle },
};

export const wavePickStatusMap: Record<string, StatusDisplayConfig> = {
  pending: { label: "待拣货", tone: "warning" },
  picking: { label: "拣货中", tone: "primary", Icon: Clock },
  picked: { label: "已拣货", tone: "success", Icon: CheckCircle },
};

export const transactionTypeStatusMap: Record<string, StatusDisplayConfig> = {
  入库: { label: "入库", tone: "success" },
  出库: { label: "出库", tone: "error" },
  移库: { label: "移库", tone: "info" },
  冻结: { label: "冻结", tone: "warning" },
  解冻: { label: "解冻", tone: "success" },
  调整: { label: "调整", tone: "muted" },
};

export const inventoryDocumentTypeStatusMap: Record<string, StatusDisplayConfig> = {
  入库单: { label: "入库单", tone: "success" },
  出库单: { label: "出库单", tone: "warning" },
  库存锁定: { label: "库存锁定", tone: "muted" },
  库存解锁: { label: "库存解锁", tone: "info" },
  库存冻结: { label: "库存冻结", tone: "error" },
  库存调整: { label: "库存调整", tone: "warning" },
  盘点调整: { label: "盘点调整", tone: "primary" },
  调拨单: { label: "调拨单", tone: "info" },
  补货单: { label: "补货单", tone: "success" },
};

export const inventoryTaskStatusMap: Record<string, StatusDisplayConfig> = {
  待处理: { label: "待处理", tone: "warning", Icon: Clock },
  执行中: { label: "执行中", tone: "info", Icon: Play },
  待审核: { label: "待审核", tone: "primary", Icon: Clock },
  已完成: { label: "已完成", tone: "success", Icon: CheckCircle },
  已取消: { label: "已取消", tone: "muted" },
};

export const enabledStatusMap: Record<string, StatusDisplayConfig> = {
  启用: { label: "启用", tone: "success" },
  停用: { label: "停用", tone: "muted" },
};

export const inventoryDetailStatusMap: Record<string, StatusDisplayConfig> = {
  正常: { label: "正常", tone: "success" },
  冻结: { label: "冻结", tone: "warning", Icon: AlertTriangle },
  待检: { label: "待检", tone: "info" },
};

export const stocktakingPlanStatusMap: Record<string, StatusDisplayConfig> = {
  待开始: { label: "待开始", tone: "muted" },
  盘点中: { label: "盘点中", tone: "warning", Icon: Play },
  待审核: { label: "待审核", tone: "info", Icon: Clock },
  已完成: { label: "已完成", tone: "success", Icon: CheckCircle },
  已取消: { label: "已取消", tone: "error" },
};

export const countingTaskStatusMap: Record<string, StatusDisplayConfig> = {
  待盘点: { label: "待盘点", tone: "muted" },
  盘点中: { label: "盘点中", tone: "warning", Icon: Play },
  已盘点: { label: "已盘点", tone: "success", Icon: CheckCircle },
};

export function getStockStatusConfig(currentStock: number, safetyStock: number): StatusDisplayConfig {
  if (currentStock === 0) return { label: "缺货", tone: "error" };
  if (currentStock < safetyStock) return { label: "库存不足", tone: "warning" };
  return { label: "正常", tone: "success" };
}
