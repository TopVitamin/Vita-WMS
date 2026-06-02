import type { InventoryItem } from "../../types/wms";

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

export function listInventoryItems(): InventoryItem[] {
  return getStoredInventoryItems();
}

export function getInventoryItem(skuCode: string): InventoryItem | undefined {
  return getStoredInventoryItems().find((item) => item.skuCode === skuCode);
}

export function addInventoryStock(skuCode: string, qty: number): void {
  const items = getStoredInventoryItems();
  const index = items.findIndex((item) => item.skuCode === skuCode);
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

export function resetMockInventory(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryItems));
  }
}

