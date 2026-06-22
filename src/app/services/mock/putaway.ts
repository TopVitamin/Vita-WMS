import { applyInboundPutawayCompletion, type ReceivedContainerSnapshot } from "./inbound";
import { addPendingPutawayStock, movePendingPutawayToAvailable } from "./inventory";

export type PutawayOrderStatus = "待上架" | "上架中" | "已上架";

export interface PutawayOrder {
  putawayNo: string;
  inboundId: string;
  customerName: string;
  warehouseArea?: string;
  createTime: string;
  status: PutawayOrderStatus;
  sourceLocationCode: string;
  sourceLocationName: string;
  receiveBatchNo?: string;
  receiptNo?: string;
  putawayType: "良品上架" | "次品上架";
  container: {
    containerNo: string;
    containerType: string;
    receiveTime?: string;
  };
  skuCount: number;
  totalQty: number;
  putawayQty: number;
  items: {
    sku: string;
    productName: string;
    spec: string;
    qty: number;
    putawayQty: number;
  }[];
  records: Array<{
    sku: string;
    productName: string;
    locationCode: string;
    qty: number;
    operator: string;
    putawayTime: string;
  }>;
}

export interface PutawayConfirmData {
  containerNo: string;
  locations: Array<{ sku: string; locationCode: string; qty: number }>;
  note: string;
}

const STORAGE_KEY = "wms_mock_putaway_orders";

const seedPutawayOrders: PutawayOrder[] = [
  {
    putawayNo: "PA-20250428-0001",
    inboundId: "IB001042102963",
    customerName: "ab00-HK买汇",
    createTime: "2025-04-28 09:30:15",
    status: "待上架",
    sourceLocationCode: "STG-RCV-PALLET",
    sourceLocationName: "托盘收货暂存库位",
    receiveBatchNo: "RCV-20241028-002",
    receiptNo: "RCV-20241028-002",
    putawayType: "良品上架",
    container: {
      containerNo: "PLT-002",
      containerType: "托盘",
      receiveTime: "2024-10-28 15:45:00",
    },
    skuCount: 2,
    totalQty: 30,
    putawayQty: 0,
    items: [
      { sku: "SKU-001", productName: "无线蓝牙耳机", spec: "黑色/标准版", qty: 20, putawayQty: 0 },
      { sku: "SKU-002", productName: "智能手环", spec: "运动版/蓝色", qty: 10, putawayQty: 0 },
    ],
    records: [],
  },
  {
    putawayNo: "PA-20250428-0002",
    inboundId: "IB-20250428-0002",
    customerName: "天猫旗舰店",
    warehouseArea: "B区",
    createTime: "2025-04-28 10:15:33",
    status: "上架中",
    putawayType: "良品上架",
    sourceLocationCode: "STG-RCV-PALLET",
    sourceLocationName: "托盘收货暂存库位",
    container: {
      containerNo: "PLT-20250428-003",
      containerType: "托盘",
      receiveTime: "2025-04-28 10:15:33",
    },
    skuCount: 1,
    totalQty: 100,
    putawayQty: 60,
    items: [
      { sku: "SKU-B001", productName: "运动水杯", spec: "500ml/蓝色", qty: 100, putawayQty: 60 },
    ],
    records: [
      { sku: "SKU-B001", productName: "运动水杯", locationCode: "B-01-01-01", qty: 60, operator: "王五", putawayTime: "2025-04-28 10:45:00" },
    ],
  },
  {
    putawayNo: "PA-20250427-0005",
    inboundId: "IB001024092365",
    customerName: "ab00-HK买汇",
    warehouseArea: "A区",
    createTime: "2025-04-27 16:20:45",
    status: "已上架",
    putawayType: "良品上架",
    sourceLocationCode: "STG-RCV-CARTON",
    sourceLocationName: "整箱收货暂存库位",
    container: {
      containerNo: "PLT-20250427-006",
      containerType: "托盘",
      receiveTime: "2025-04-27 16:20:45",
    },
    skuCount: 2,
    totalQty: 120,
    putawayQty: 120,
    items: [
      { sku: "SKU-D001", productName: "保温杯", spec: "350ml/银色", qty: 60, putawayQty: 60 },
      { sku: "SKU-D002", productName: "便携餐盒", spec: "双层/蓝色", qty: 60, putawayQty: 60 },
    ],
    records: [
      { sku: "SKU-D001", productName: "保温杯", locationCode: "A-01-01-01", qty: 60, operator: "王五", putawayTime: "2025-04-27 17:00:00" },
      { sku: "SKU-D002", productName: "便携餐盒", locationCode: "A-01-01-02", qty: 60, operator: "王五", putawayTime: "2025-04-27 17:08:00" },
    ],
  },
];

function readPutawayOrders(): PutawayOrder[] {
  if (typeof window === "undefined") return seedPutawayOrders;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seedPutawayOrders));
    return seedPutawayOrders;
  }
  return JSON.parse(stored);
}

function savePutawayOrders(orders: PutawayOrder[]) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

function nextPutawayNo(orders: PutawayOrder[]) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = orders.filter((order) => order.putawayNo.includes(today)).length + 1;
  return `PA-${today}-${String(count).padStart(4, "0")}`;
}

export function listPutawayOrders(): PutawayOrder[] {
  return readPutawayOrders();
}

export function getPutawayOrder(putawayNo?: string): PutawayOrder | undefined {
  const orders = readPutawayOrders();
  return orders.find((order) => order.putawayNo === putawayNo) || orders[0];
}

export function createPutawayOrderFromReceipt(receipt: ReceivedContainerSnapshot): PutawayOrder {
  const orders = readPutawayOrders();
  const existing = orders.find(
    (order) =>
      order.inboundId === receipt.inboundId &&
      order.receiptNo === receipt.receiptNo &&
      order.putawayType === (receipt.putawayType || "良品上架")
  );
  if (existing) return existing;

  const totalQty = receipt.items.reduce((sum, item) => sum + item.qty, 0);
  const order: PutawayOrder = {
    putawayNo: nextPutawayNo(orders),
    inboundId: receipt.inboundId,
    customerName: receipt.customerName,
    createTime: new Date().toLocaleString("zh-CN"),
    status: "待上架",
    sourceLocationCode: receipt.stagingLocation.code,
    sourceLocationName: receipt.stagingLocation.name,
    receiveBatchNo: receipt.receiveBatchNo,
    receiptNo: receipt.receiptNo,
    putawayType: receipt.putawayType || "良品上架",
    container: {
      containerNo: receipt.container.containerNo,
      containerType: receipt.container.containerType,
      receiveTime: receipt.receiveTime,
    },
    skuCount: receipt.items.length,
    totalQty,
    putawayQty: 0,
    items: receipt.items.map((item) => ({
      sku: item.sku,
      productName: item.productName,
      spec: item.spec,
      qty: item.qty,
      putawayQty: 0,
    })),
    records: [],
  };

  receipt.items.forEach((item) => addPendingPutawayStock(item.sku, item.qty));
  savePutawayOrders([order, ...orders]);
  return order;
}

export function confirmPutawayOrder(putawayNo: string, data: PutawayConfirmData): PutawayOrder | undefined {
  const orders = readPutawayOrders();
  const index = orders.findIndex((order) => order.putawayNo === putawayNo);
  if (index === -1) return undefined;

  const order = orders[index];
  const now = new Date().toLocaleString("zh-CN");
  const updatedItems = order.items.map((item) => {
    const qty = data.locations.filter((location) => location.sku === item.sku).reduce((sum, location) => sum + location.qty, 0);
    return qty > 0 ? { ...item, putawayQty: Math.min(item.qty, item.putawayQty + qty) } : item;
  });
  const totalPutawayQty = updatedItems.reduce((sum, item) => sum + item.putawayQty, 0);
  const status: PutawayOrderStatus = totalPutawayQty >= order.totalQty ? "已上架" : "上架中";
  const records = data.locations.map((location) => {
    const item = order.items.find((target) => target.sku === location.sku);
    return {
      sku: location.sku,
      productName: item?.productName || location.sku,
      locationCode: location.locationCode,
      qty: location.qty,
      operator: "当前用户",
      putawayTime: now,
    };
  });

  records.forEach((record) => {
    movePendingPutawayToAvailable(record.sku, record.qty);
  });
  applyInboundPutawayCompletion(
    order.inboundId,
    records.map((record) => ({
      sku: record.sku,
      productName: record.productName,
      qty: record.qty,
      locationCode: record.locationCode,
      containerNo: order.container.containerNo,
      note: data.note,
    }))
  );

  const updatedOrder: PutawayOrder = {
    ...order,
    warehouseArea: order.warehouseArea || inferWarehouseArea(data.locations[0]?.locationCode),
    status,
    putawayQty: totalPutawayQty,
    items: updatedItems,
    records: [...records, ...order.records],
  };
  orders[index] = updatedOrder;
  savePutawayOrders(orders);
  return updatedOrder;
}

function inferWarehouseArea(locationCode?: string) {
  if (!locationCode) return undefined;
  const area = locationCode.split("-")[0];
  return area ? `${area}区` : undefined;
}

export function resetMockPutaway(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seedPutawayOrders));
  }
}
