export type {
  DesignStatusTone,
  KpiMetric,
  OperationLogItem,
  WmsStatusTone,
  WorkflowStep,
} from "./design-system";

export interface SkuItem {
  id: string;
  skuCode: string;
  productName: string;
  productNameEn: string;
  imageUrl: string;
  customerName: string;
  category: string;
  specifications: string;
  barcode: string;
  unit: string;
  dimensions: string;
  weight: number;
  currentStock: number;
  safetyStock: number;
  status: "启用" | "停用";
  createTime: string;
  updateTime: string;
}

export type InventoryStockStatus = "正常" | "不足" | "缺货" | "超储" | "呆滞";

export interface InventoryItem {
  id: string;
  skuCode: string;
  productName: string;
  productNameEn: string;
  imageUrl: string;
  customerName: string;
  totalStock: number;
  availableStock: number;
  frozenStock: number;
  qualityCheckStock: number;
  pendingPutawayStock: number;
  inTransitStock: number;
  safetyStock: number;
  locationCount: number;
  lastInboundDate: string;
  lastOutboundDate: string;
  inventoryAge: number;
  stockStatus: InventoryStockStatus;
}

export type PickingTaskStatus = "待分配" | "待拣货" | "拣货中" | "已完成";
export type PriorityLevel = "紧急" | "高" | "中" | "低";

export interface PickingTask {
  id: string;
  taskNo: string;
  waveNo: string | null;
  pickingType: string;
  priority: PriorityLevel;
  orderCount: number;
  skuCount: number;
  totalQty: number;
  pickedQty: number;
  picker: { name: string; avatar: string } | null;
  status: PickingTaskStatus;
  createTime: string;
  estimatedTime: string;
  actualTime: string | null;
}
