import type { InventoryItem } from "../../types/wms";

export type InventoryTransactionDocumentType =
  | "入库单"
  | "出库单"
  | "库存锁定"
  | "库存解锁"
  | "库存冻结"
  | "库存调整"
  | "盘点调整"
  | "调拨单"
  | "补货单";

export type InventoryTaskStatus = "待处理" | "执行中" | "待审核" | "已完成" | "已取消";

export interface InventoryTransaction {
  transactionId: string;
  sku: string;
  productName: string;
  customer: string;
  warehouse: string;
  batchNo?: string;
  location?: string;
  warehouseArea?: string;
  documentType: InventoryTransactionDocumentType;
  documentNo: string;
  inventoryChange: {
    total: { before: number; after: number; change: number };
    available: { before: number; after: number; change: number };
    locked: { before: number; after: number; change: number };
    frozen: { before: number; after: number; change: number };
  };
  operationTime: string;
  operator: string;
  imageUrl: string;
}

export interface TransferOrder {
  id: string;
  transferNo: string;
  skuCode: string;
  productName: string;
  qty: number;
  fromLocation: string;
  toLocation: string;
  reason: string;
  status: InventoryTaskStatus;
  createdAt: string;
  completedAt: string | null;
  operator: string;
}

export interface AdjustmentOrder {
  id: string;
  adjustmentNo: string;
  skuCode: string;
  productName: string;
  bookQty: number;
  actualQty: number;
  diffQty: number;
  reason: string;
  status: InventoryTaskStatus;
  createdAt: string;
  approvedAt: string | null;
  operator: string;
}

export interface ReplenishmentTask {
  id: string;
  replenishmentNo: string;
  skuCode: string;
  productName: string;
  currentStock: number;
  safetyStock: number;
  suggestedQty: number;
  fromLocation: string;
  toLocation: string;
  status: InventoryTaskStatus;
  createdAt: string;
  completedAt: string | null;
  operator: string;
}

const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    skuCode: "ABC-123456",
    productName: "多功能蓝牙耳机",
    productNameEn: "Multi-function Bluetooth Headphones",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    customerName: "维他很忙",
    totalStock: 1250,
    availableStock: 1180,
    frozenStock: 50,
    qualityCheckStock: 20,
    pendingPutawayStock: 0,
    inTransitStock: 300,
    safetyStock: 500,
    locationCount: 8,
    lastInboundDate: "2026-06-01",
    lastOutboundDate: "2026-06-02",
    inventoryAge: 15,
    stockStatus: "正常",
  },
  {
    id: "2",
    skuCode: "ABC-123457",
    productName: "智能手环运动版",
    productNameEn: "Smart Fitness Band Pro",
    imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
    customerName: "维他很忙",
    totalStock: 890,
    availableStock: 850,
    frozenStock: 40,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 150,
    safetyStock: 300,
    locationCount: 5,
    lastInboundDate: "2026-05-28",
    lastOutboundDate: "2026-06-02",
    inventoryAge: 20,
    stockStatus: "正常",
  },
  {
    id: "3",
    skuCode: "DEF-789012",
    productName: "运动水杯 1L",
    productNameEn: "Sports Water Bottle 1L",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    customerName: "跨境小王",
    totalStock: 2300,
    availableStock: 2200,
    frozenStock: 100,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 500,
    safetyStock: 800,
    locationCount: 12,
    lastInboundDate: "2026-05-30",
    lastOutboundDate: "2026-06-01",
    inventoryAge: 10,
    stockStatus: "超储",
  },
  {
    id: "4",
    skuCode: "GHI-345678",
    productName: "瑜伽垫专业版",
    productNameEn: "Professional Yoga Mat",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    customerName: "跨境小王",
    totalStock: 156,
    availableStock: 156,
    frozenStock: 0,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 0,
    safetyStock: 200,
    locationCount: 3,
    lastInboundDate: "2026-05-15",
    lastOutboundDate: "2026-05-30",
    inventoryAge: 18,
    stockStatus: "不足",
  },
  {
    id: "5",
    skuCode: "JKL-901234",
    productName: "USB Type-C 充电线 2米",
    productNameEn: "USB Type-C Cable 2m",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    customerName: "维他很忙",
    totalStock: 3450,
    availableStock: 3300,
    frozenStock: 150,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 800,
    safetyStock: 1000,
    locationCount: 15,
    lastInboundDate: "2026-06-02",
    lastOutboundDate: "2026-06-02",
    inventoryAge: 5,
    stockStatus: "正常",
  },
  {
    id: "6",
    skuCode: "MNO-567890",
    productName: "无线充电器快充版",
    productNameEn: "Wireless Fast Charger",
    imageUrl: "https://images.unsplash.com/photo-1591290619762-c588dd7ab44e?w=400",
    customerName: "电商老李",
    totalStock: 67,
    availableStock: 67,
    frozenStock: 0,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 0,
    safetyStock: 150,
    locationCount: 2,
    lastInboundDate: "2026-04-10",
    lastOutboundDate: "2026-05-20",
    inventoryAge: 53,
    stockStatus: "呆滞",
  },
  {
    id: "7",
    skuCode: "PQR-234567",
    productName: "便携蓝牙音箱",
    productNameEn: "Portable Bluetooth Speaker",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    customerName: "维他很忙",
    totalStock: 0,
    availableStock: 0,
    frozenStock: 0,
    qualityCheckStock: 0,
    pendingPutawayStock: 0,
    inTransitStock: 200,
    safetyStock: 300,
    locationCount: 0,
    lastInboundDate: "2026-03-15",
    lastOutboundDate: "2026-05-28",
    inventoryAge: 79,
    stockStatus: "缺货",
  },
];

const STORAGE_KEY = "wms_mock_inventory";
const TRANSACTION_STORAGE_KEY = "wms_mock_inventory_transactions";
const TRANSFER_STORAGE_KEY = "wms_mock_inventory_transfers";
const ADJUSTMENT_STORAGE_KEY = "wms_mock_inventory_adjustments";
const REPLENISHMENT_STORAGE_KEY = "wms_mock_inventory_replenishments";

const skuMapping: Record<string, string> = {
  "SKU-001": "ABC-123456",
  "SKU-002": "ABC-123457",
  "SKU-003": "JKL-901234",
};

function toInventorySku(skuCode: string): string {
  return skuMapping[skuCode] || skuCode;
}

function getStoredInventoryItems(): InventoryItem[] {
  if (typeof window === "undefined") return inventoryItems;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryItems));
    return inventoryItems;
  }
  return JSON.parse(stored);
}

function saveInventoryItems(items: InventoryItem[]) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

function nowText() {
  return new Date().toLocaleString("zh-CN");
}

function todayKey() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

function readStorage<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    sessionStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
}

function saveStorage<T>(key: string, data: T[]) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
}

function getStockStatus(totalStock: number, safetyStock: number): InventoryItem["stockStatus"] {
  if (totalStock === 0) return "缺货";
  if (totalStock < safetyStock) return "不足";
  if (totalStock > safetyStock * 2) return "超储";
  return "正常";
}

function nextNo(prefix: string, currentLength: number) {
  return `${prefix}-${todayKey()}-${String(currentLength + 1).padStart(4, "0")}`;
}

const seedInventoryTransactions: InventoryTransaction[] = [
  {
    transactionId: "TXN-2026060201",
    sku: "ABC-123456",
    productName: "多功能蓝牙耳机",
    customer: "维他很忙",
    warehouse: "洛杉矶仓",
    batchNo: "LOT20260601",
    location: "A01-01-01",
    warehouseArea: "A区",
    documentType: "盘点调整",
    documentNo: "PD-20260602-001",
    inventoryChange: {
      total: { before: 1252, after: 1250, change: -2 },
      available: { before: 1182, after: 1180, change: -2 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2026-06-02 15:35:00",
    operator: "系统管理员",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2026060202",
    sku: "ABC-123457",
    productName: "智能手环运动版",
    customer: "维他很忙",
    warehouse: "洛杉矶仓",
    batchNo: "LOT20260528",
    location: "A01-01-05",
    warehouseArea: "A区",
    documentType: "盘点调整",
    documentNo: "PD-20260602-001",
    inventoryChange: {
      total: { before: 887, after: 890, change: 3 },
      available: { before: 847, after: 850, change: 3 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 40, after: 40, change: 0 },
    },
    operationTime: "2026-06-02 15:35:00",
    operator: "系统管理员",
    imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=100&h=100&fit=crop",
  },
];

const seedTransferOrders: TransferOrder[] = [
  {
    id: "1",
    transferNo: "MV-20260602-0001",
    skuCode: "ABC-123456",
    productName: "多功能蓝牙耳机",
    qty: 80,
    fromLocation: "A01-01-01",
    toLocation: "A01-03-02",
    reason: "拣货位补满",
    status: "待处理",
    createdAt: "2026-06-02 09:20",
    completedAt: null,
    operator: "张三",
  },
  {
    id: "2",
    transferNo: "MV-20260601-0003",
    skuCode: "JKL-901234",
    productName: "USB Type-C 充电线 2米",
    qty: 120,
    fromLocation: "B02-01-01",
    toLocation: "A03-02-06",
    reason: "热销 SKU 前置",
    status: "已完成",
    createdAt: "2026-06-01 14:10",
    completedAt: "2026-06-01 14:36",
    operator: "李四",
  },
];

const seedAdjustmentOrders: AdjustmentOrder[] = [
  {
    id: "1",
    adjustmentNo: "ADJ-20260602-0001",
    skuCode: "GHI-345678",
    productName: "瑜伽垫专业版",
    bookQty: 156,
    actualQty: 148,
    diffQty: -8,
    reason: "破损报损",
    status: "待审核",
    createdAt: "2026-06-02 13:20",
    approvedAt: null,
    operator: "赵六",
  },
];

const seedReplenishmentTasks: ReplenishmentTask[] = [
  {
    id: "1",
    replenishmentNo: "RP-20260602-0001",
    skuCode: "GHI-345678",
    productName: "瑜伽垫专业版",
    currentStock: 156,
    safetyStock: 200,
    suggestedQty: 120,
    fromLocation: "R01-01-01",
    toLocation: "A02-04-03",
    status: "待处理",
    createdAt: "2026-06-02 08:50",
    completedAt: null,
    operator: "系统",
  },
  {
    id: "2",
    replenishmentNo: "RP-20260602-0002",
    skuCode: "PQR-234567",
    productName: "便携蓝牙音箱",
    currentStock: 0,
    safetyStock: 300,
    suggestedQty: 300,
    fromLocation: "在途入库",
    toLocation: "A04-02-02",
    status: "执行中",
    createdAt: "2026-06-02 10:15",
    completedAt: null,
    operator: "王五",
  },
];

function appendInventoryTransaction(input: Omit<InventoryTransaction, "transactionId" | "operationTime">) {
  const transactions = listInventoryTransactions();
  const transaction: InventoryTransaction = {
    ...input,
    transactionId: `TXN-${todayKey()}-${String(transactions.length + 1).padStart(4, "0")}`,
    operationTime: nowText(),
  };
  saveStorage(TRANSACTION_STORAGE_KEY, [transaction, ...transactions]);
  return transaction;
}

function makeChange(beforeTotal: number, afterTotal: number, beforeAvailable: number, afterAvailable: number, frozenStock: number) {
  return {
    total: { before: beforeTotal, after: afterTotal, change: afterTotal - beforeTotal },
    available: { before: beforeAvailable, after: afterAvailable, change: afterAvailable - beforeAvailable },
    locked: { before: 0, after: 0, change: 0 },
    frozen: { before: frozenStock, after: frozenStock, change: 0 },
  };
}

function applyInventoryDelta(
  skuCode: string,
  deltaQty: number,
  documentType: InventoryTransactionDocumentType,
  documentNo: string,
  operator: string,
  location?: string
) {
  const items = getStoredInventoryItems();
  const index = items.findIndex((item) => item.skuCode === toInventorySku(skuCode));
  if (index === -1) return undefined;

  const item = items[index];
  const beforeTotal = item.totalStock;
  const beforeAvailable = item.availableStock;
  const afterTotal = Math.max(0, beforeTotal + deltaQty);
  const afterAvailable = Math.max(0, beforeAvailable + deltaQty);
  const updatedItem: InventoryItem = {
    ...item,
    totalStock: afterTotal,
    availableStock: afterAvailable,
    stockStatus: getStockStatus(afterTotal, item.safetyStock),
  };

  items[index] = updatedItem;
  saveInventoryItems(items);

  appendInventoryTransaction({
    sku: updatedItem.skuCode,
    productName: updatedItem.productName,
    customer: updatedItem.customerName,
    warehouse: "洛杉矶仓",
    batchNo: `LOT${todayKey()}`,
    location,
    warehouseArea: location?.slice(0, 1) ? `${location.slice(0, 1)}区` : undefined,
    documentType,
    documentNo,
    inventoryChange: makeChange(beforeTotal, afterTotal, beforeAvailable, afterAvailable, updatedItem.frozenStock),
    operator,
    imageUrl: updatedItem.imageUrl,
  });

  return updatedItem;
}

export function listInventoryItems(): InventoryItem[] {
  return getStoredInventoryItems();
}

export function listInventoryTransactions(): InventoryTransaction[] {
  return readStorage(TRANSACTION_STORAGE_KEY, seedInventoryTransactions);
}

export function listTransferOrders(): TransferOrder[] {
  return readStorage(TRANSFER_STORAGE_KEY, seedTransferOrders);
}

export function listAdjustmentOrders(): AdjustmentOrder[] {
  return readStorage(ADJUSTMENT_STORAGE_KEY, seedAdjustmentOrders);
}

export function listReplenishmentTasks(): ReplenishmentTask[] {
  return readStorage(REPLENISHMENT_STORAGE_KEY, seedReplenishmentTasks);
}

export function getInventoryItem(skuCode: string): InventoryItem | undefined {
  return getStoredInventoryItems().find((item) => item.skuCode === skuCode);
}

export function addInventoryStock(skuCode: string, qty: number): void {
  const items = getStoredInventoryItems();
  const index = items.findIndex((item) => item.skuCode === toInventorySku(skuCode));
  if (index !== -1) {
    const item = items[index];
    const newTotal = item.totalStock + qty;
    const newAvailable = item.availableStock + qty;
    
    // 动态重置库存状态
    let newStatus = item.stockStatus;
    if (newTotal === 0) {
      newStatus = "缺货";
    } else if (newTotal < item.safetyStock) {
      newStatus = "不足";
    } else if (newTotal >= item.safetyStock && (item.stockStatus === "不足" || item.stockStatus === "缺货")) {
      newStatus = "正常";
    }

    items[index] = {
      ...item,
      totalStock: newTotal,
      availableStock: newAvailable,
      stockStatus: newStatus,
      lastInboundDate: new Date().toISOString().split("T")[0], // 更新最后入库时间
    };
    saveInventoryItems(items);
  }
}

export function createTransferOrder(input: {
  skuCode: string;
  qty: number;
  fromLocation: string;
  toLocation: string;
  reason: string;
  operator?: string;
}): TransferOrder | undefined {
  const item = getInventoryItem(input.skuCode);
  if (!item) return undefined;
  const transfers = listTransferOrders();
  const order: TransferOrder = {
    id: String(transfers.length + 1),
    transferNo: nextNo("MV", transfers.length),
    skuCode: item.skuCode,
    productName: item.productName,
    qty: input.qty,
    fromLocation: input.fromLocation,
    toLocation: input.toLocation,
    reason: input.reason,
    status: "待处理",
    createdAt: nowText(),
    completedAt: null,
    operator: input.operator || "当前用户",
  };
  saveStorage(TRANSFER_STORAGE_KEY, [order, ...transfers]);
  return order;
}

export function completeTransferOrder(transferNo: string): TransferOrder | undefined {
  const transfers = listTransferOrders();
  const index = transfers.findIndex((order) => order.transferNo === transferNo || order.id === transferNo);
  if (index === -1) return undefined;
  const order = { ...transfers[index], status: "已完成" as InventoryTaskStatus, completedAt: nowText() };
  transfers[index] = order;
  saveStorage(TRANSFER_STORAGE_KEY, transfers);

  const item = getInventoryItem(order.skuCode);
  if (item) {
    appendInventoryTransaction({
      sku: item.skuCode,
      productName: item.productName,
      customer: item.customerName,
      warehouse: "洛杉矶仓",
      batchNo: `LOT${todayKey()}`,
      location: `${order.fromLocation} → ${order.toLocation}`,
      warehouseArea: "库内",
      documentType: "调拨单",
      documentNo: order.transferNo,
      inventoryChange: makeChange(item.totalStock, item.totalStock, item.availableStock, item.availableStock, item.frozenStock),
      operator: order.operator,
      imageUrl: item.imageUrl,
    });
  }

  return order;
}

export function createAdjustmentOrder(input: {
  skuCode: string;
  actualQty: number;
  reason: string;
  operator?: string;
}): AdjustmentOrder | undefined {
  const item = getInventoryItem(input.skuCode);
  if (!item) return undefined;
  const adjustments = listAdjustmentOrders();
  const order: AdjustmentOrder = {
    id: String(adjustments.length + 1),
    adjustmentNo: nextNo("ADJ", adjustments.length),
    skuCode: item.skuCode,
    productName: item.productName,
    bookQty: item.availableStock,
    actualQty: input.actualQty,
    diffQty: input.actualQty - item.availableStock,
    reason: input.reason,
    status: "待审核",
    createdAt: nowText(),
    approvedAt: null,
    operator: input.operator || "当前用户",
  };
  saveStorage(ADJUSTMENT_STORAGE_KEY, [order, ...adjustments]);
  return order;
}

export function approveAdjustmentOrder(adjustmentNo: string): AdjustmentOrder | undefined {
  const adjustments = listAdjustmentOrders();
  const index = adjustments.findIndex((order) => order.adjustmentNo === adjustmentNo || order.id === adjustmentNo);
  if (index === -1) return undefined;
  const order = { ...adjustments[index], status: "已完成" as InventoryTaskStatus, approvedAt: nowText() };
  adjustments[index] = order;
  saveStorage(ADJUSTMENT_STORAGE_KEY, adjustments);
  applyInventoryDelta(order.skuCode, order.diffQty, "库存调整", order.adjustmentNo, order.operator);
  return order;
}

export function createReplenishmentTask(input: {
  skuCode: string;
  suggestedQty: number;
  fromLocation: string;
  toLocation: string;
  operator?: string;
}): ReplenishmentTask | undefined {
  const item = getInventoryItem(input.skuCode);
  if (!item) return undefined;
  const tasks = listReplenishmentTasks();
  const task: ReplenishmentTask = {
    id: String(tasks.length + 1),
    replenishmentNo: nextNo("RP", tasks.length),
    skuCode: item.skuCode,
    productName: item.productName,
    currentStock: item.availableStock,
    safetyStock: item.safetyStock,
    suggestedQty: input.suggestedQty,
    fromLocation: input.fromLocation,
    toLocation: input.toLocation,
    status: "待处理",
    createdAt: nowText(),
    completedAt: null,
    operator: input.operator || "当前用户",
  };
  saveStorage(REPLENISHMENT_STORAGE_KEY, [task, ...tasks]);
  return task;
}

export function completeReplenishmentTask(replenishmentNo: string): ReplenishmentTask | undefined {
  const tasks = listReplenishmentTasks();
  const index = tasks.findIndex((task) => task.replenishmentNo === replenishmentNo || task.id === replenishmentNo);
  if (index === -1) return undefined;
  const task = { ...tasks[index], status: "已完成" as InventoryTaskStatus, completedAt: nowText() };
  tasks[index] = task;
  saveStorage(REPLENISHMENT_STORAGE_KEY, tasks);

  const item = getInventoryItem(task.skuCode);
  if (item) {
    appendInventoryTransaction({
      sku: item.skuCode,
      productName: item.productName,
      customer: item.customerName,
      warehouse: "洛杉矶仓",
      batchNo: `LOT${todayKey()}`,
      location: `${task.fromLocation} → ${task.toLocation}`,
      warehouseArea: "补货",
      documentType: "补货单",
      documentNo: task.replenishmentNo,
      inventoryChange: makeChange(item.totalStock, item.totalStock, item.availableStock, item.availableStock, item.frozenStock),
      operator: task.operator,
      imageUrl: item.imageUrl,
    });
  }
  return task;
}

export function applyStocktakingAdjustment(input: {
  planNo: string;
  items: Array<{ skuCode: string; diffQty: number; location?: string }>;
  operator?: string;
}): void {
  input.items.forEach((item) => {
    if (item.diffQty !== 0) {
      applyInventoryDelta(item.skuCode, item.diffQty, "盘点调整", input.planNo, input.operator || "系统管理员", item.location);
    }
  });
}

export function addPendingPutawayStock(skuCode: string, qty: number): void {
  const items = getStoredInventoryItems();
  const index = items.findIndex((item) => item.skuCode === toInventorySku(skuCode));
  if (index !== -1) {
    const item = items[index];
    items[index] = {
      ...item,
      totalStock: item.totalStock + qty,
      pendingPutawayStock: item.pendingPutawayStock + qty,
      lastInboundDate: new Date().toISOString().split("T")[0],
    };
    saveInventoryItems(items);
  }
}

export function movePendingPutawayToAvailable(skuCode: string, qty: number): void {
  const items = getStoredInventoryItems();
  const index = items.findIndex((item) => item.skuCode === toInventorySku(skuCode));
  if (index !== -1) {
    const item = items[index];
    const movedQty = Math.min(item.pendingPutawayStock, qty);
    const newAvailable = item.availableStock + movedQty;
    const newPending = Math.max(0, item.pendingPutawayStock - movedQty);
    const newTotal = item.totalStock;

    let newStatus = item.stockStatus;
    if (newTotal === 0) {
      newStatus = "缺货";
    } else if (newTotal < item.safetyStock) {
      newStatus = "不足";
    } else if (newStatus === "不足" || newStatus === "缺货") {
      newStatus = "正常";
    }

    items[index] = {
      ...item,
      availableStock: newAvailable,
      pendingPutawayStock: newPending,
      stockStatus: newStatus,
    };
    saveInventoryItems(items);
  }
}

export function resetMockInventory(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryItems));
    sessionStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(seedInventoryTransactions));
    sessionStorage.setItem(TRANSFER_STORAGE_KEY, JSON.stringify(seedTransferOrders));
    sessionStorage.setItem(ADJUSTMENT_STORAGE_KEY, JSON.stringify(seedAdjustmentOrders));
    sessionStorage.setItem(REPLENISHMENT_STORAGE_KEY, JSON.stringify(seedReplenishmentTasks));
  }
}
