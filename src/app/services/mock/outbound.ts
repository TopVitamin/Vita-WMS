import type { PickingTask, PriorityLevel } from "../../types/wms";

export type OutboundOrderStatus =
  | "pending"
  | "waved"
  | "pending_pick"
  | "picking"
  | "pending_sort"
  | "pending_review"
  | "pending_pack"
  | "pending_weight"
  | "pending_ship"
  | "shipped"
  | "completed"
  | "cancelled"
  | "exception";

/** 强盛国内仓的三条核心出库链路。 */
export type OutboundType = "b2c" | "store_transfer" | "wholesale";
export type OrderStructureType = "single_single" | "single_multi" | "multi_mixed";

export type WaveStatus =
  | "created"
  | "assigned"
  | "picking"
  | "picked"
  | "sorting"
  | "sorted"
  | "completed"
  | "shipped"
  | "exception"
  | "cancelled";

export type PickingWorkStatus = "待分配" | "待拣货" | "拣货中" | "已完成";
export type PickingMode = "by_order" | "by_wave";
export type SortingMode = "none" | "seed_after_pick" | "pick_and_sort";
export type OutboundPackageStatus = "pending_weight" | "pending_ship" | "shipped" | "exception";

export interface OutboundOrder {
  id: string;
  waveNo: string | null;
  pickingWorkNo: string | null;
  outboundType: OutboundType;
  orderType: OrderStructureType;
  customer: string;
  orderNo: string;
  skuCount: number;
  totalQty: number;
  status: OutboundOrderStatus;
  picker: string | null;
  planShipDate: string;
  carrier: string;
  trackingNo: string | null;
  createdAt: string;
  priority: PriorityLevel;
}

export interface WaveOrder {
  id: string;
  outboundOrderIds: string[];
  pickingWorkNos: string[];
  orderCount: number;
  skuCount: number;
  totalQty: number;
  waveType: OrderStructureType;
  sortingMode: SortingMode;
  pickedQty: number;
  pickProgress: number;
  picker: string | null;
  status: WaveStatus;
  createdAt: string;
  createdBy: string;
}

export interface PickingWork {
  id: string;
  taskNo: string;
  waveNo: string | null;
  outboundOrderIds: string[];
  pickingMode: PickingMode;
  sortingMode: SortingMode;
  pickingType: string;
  priority: PriorityLevel;
  orderCount: number;
  skuCount: number;
  totalQty: number;
  pickedQty: number;
  picker: { name: string; avatar: string } | null;
  status: PickingWorkStatus;
  createTime: string;
  estimatedTime: string;
  actualTime: string | null;
}

export interface OutboundPackage {
  id: string;
  packageNo: string;
  boxNo: string;
  orderNo: string;
  outboundOrderId: string | null;
  customer: string;
  carrier: string;
  trackingNo: string | null;
  itemCount: number;
  skuCount: number;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  status: OutboundPackageStatus;
  reviewedAt: string;
  weightedAt: string | null;
  shippedAt: string | null;
  operator: string;
}

const OUTBOUND_STORAGE_KEY = "wms_mock_outbound_orders";
const WAVE_STORAGE_KEY = "wms_mock_wave_orders";
const PICKING_WORK_STORAGE_KEY = "wms_mock_picking_works";
const OUTBOUND_PACKAGE_STORAGE_KEY = "wms_mock_outbound_packages";
const SELECTED_WAVE_KEY = "wms_mock_selected_wave_id";

const nowText = () => new Date().toLocaleString("zh-CN");
const todayKey = () => new Date().toISOString().slice(0, 10).replace(/-/g, "");
const avatarOf = (name: string) => name.slice(0, 2).toUpperCase();

const seedOutboundOrders: OutboundOrder[] = [
  {
    id: "OB001042103501",
    waveNo: null,
    pickingWorkNo: null,
    outboundType: "b2c",
    orderType: "single_single",
    customer: "Amazon-US",
    orderNo: "AMZ-2024-100563",
    skuCount: 1,
    totalQty: 1,
    status: "pending",
    picker: null,
    planShipDate: "2024-10-28",
    carrier: "FedEx",
    trackingNo: null,
    createdAt: "2024-10-27 10:23",
    priority: "紧急",
  },
  {
    id: "OB001042103502",
    waveNo: null,
    pickingWorkNo: null,
    outboundType: "b2c",
    orderType: "single_multi",
    customer: "Shopify-EU",
    orderNo: "SPF-2024-088745",
    skuCount: 1,
    totalQty: 5,
    status: "pending",
    picker: null,
    planShipDate: "2024-10-28",
    carrier: "DHL",
    trackingNo: null,
    createdAt: "2024-10-27 09:15",
    priority: "高",
  },
  {
    id: "OB001042103503",
    waveNo: null,
    pickingWorkNo: null,
    outboundType: "b2c",
    orderType: "multi_mixed",
    customer: "eBay-UK",
    orderNo: "EBAY-2024-056321",
    skuCount: 3,
    totalQty: 8,
    status: "pending",
    picker: null,
    planShipDate: "2024-10-29",
    carrier: "UPS",
    trackingNo: null,
    createdAt: "2024-10-27 08:45",
    priority: "中",
  },
  {
    id: "OB001042003497",
    waveNo: "WAVE-2024-0028",
    pickingWorkNo: "PK-20241020-0001",
    outboundType: "b2c",
    orderType: "single_multi",
    customer: "Shopify-US",
    orderNo: "SPF-2024-088888",
    skuCount: 3,
    totalQty: 6,
    status: "pending_pack",
    picker: "张三",
    planShipDate: "2024-10-28",
    carrier: "DHL",
    trackingNo: null,
    createdAt: "2024-10-20 14:18",
    priority: "高",
  },
  {
    id: "OB001042003498",
    waveNo: "WAVE-2024-0028",
    pickingWorkNo: "PK-20241020-0001",
    outboundType: "b2c",
    orderType: "single_single",
    customer: "Amazon-US",
    orderNo: "AMZ-2024-100321",
    skuCount: 1,
    totalQty: 1,
    status: "pending_weight",
    picker: "张三",
    planShipDate: "2024-10-28",
    carrier: "FedEx",
    trackingNo: null,
    createdAt: "2024-10-20 14:20",
    priority: "中",
  },
  {
    id: "OB001042003499",
    waveNo: "WAVE-2024-0028",
    pickingWorkNo: "PK-20241020-0001",
    outboundType: "b2c",
    orderType: "single_multi",
    customer: "Walmart-US",
    orderNo: "WMT-2024-087654",
    skuCount: 1,
    totalQty: 10,
    status: "pending_ship",
    picker: "张三",
    planShipDate: "2024-10-28",
    carrier: "USPS",
    trackingNo: null,
    createdAt: "2024-10-20 14:22",
    priority: "中",
  },
  {
    id: "OB001041503480",
    waveNo: "WAVE-2024-0027",
    pickingWorkNo: "PK-20241015-0001",
    outboundType: "b2c",
    orderType: "multi_mixed",
    customer: "Amazon-EU",
    orderNo: "AMZ-EU-2024-034512",
    skuCount: 5,
    totalQty: 25,
    status: "picking",
    picker: "李四",
    planShipDate: "2024-10-27",
    carrier: "DHL",
    trackingNo: null,
    createdAt: "2024-10-15 11:30",
    priority: "高",
  },
  {
    id: "OB001041003450",
    waveNo: "WAVE-2024-0026",
    pickingWorkNo: "PK-20241010-0001",
    outboundType: "store_transfer",
    orderType: "multi_mixed",
    customer: "深圳仓库",
    orderNo: "TR-2024-002365",
    skuCount: 8,
    totalQty: 100,
    status: "shipped",
    picker: "王五",
    planShipDate: "2024-10-25",
    carrier: "顺丰",
    trackingNo: "SF1234567890",
    createdAt: "2024-10-10 09:15",
    priority: "中",
  },
  {
    id: "OB001040203398",
    waveNo: null,
    pickingWorkNo: null,
    outboundType: "wholesale",
    orderType: "single_multi",
    customer: "Amazon-JP",
    orderNo: "AMZ-JP-2024-076543",
    skuCount: 1,
    totalQty: 20,
    status: "cancelled",
    picker: null,
    planShipDate: "-",
    carrier: "-",
    trackingNo: null,
    createdAt: "2024-10-02 13:25",
    priority: "低",
  },
];

const seedWaveOrders: WaveOrder[] = [
  {
    id: "WAVE-2024-0028",
    outboundOrderIds: ["OB001042003498", "OB001042003499"],
    pickingWorkNos: ["PK-20241020-0001"],
    orderCount: 2,
    skuCount: 2,
    totalQty: 11,
    waveType: "single_multi",
    sortingMode: "seed_after_pick",
    pickedQty: 11,
    pickProgress: 100,
    picker: "张三",
    status: "picked",
    createdAt: "2024-10-20 14:20",
    createdBy: "李四",
  },
  {
    id: "WAVE-2024-0027",
    outboundOrderIds: ["OB001041503480"],
    pickingWorkNos: ["PK-20241015-0001"],
    orderCount: 1,
    skuCount: 5,
    totalQty: 25,
    waveType: "multi_mixed",
    sortingMode: "seed_after_pick",
    pickedQty: 18,
    pickProgress: 72,
    picker: "李四",
    status: "picking",
    createdAt: "2024-10-15 11:30",
    createdBy: "张三",
  },
  {
    id: "WAVE-2024-0026",
    outboundOrderIds: ["OB001041003450"],
    pickingWorkNos: ["PK-20241010-0001"],
    orderCount: 1,
    skuCount: 8,
    totalQty: 100,
    waveType: "multi_mixed",
    sortingMode: "none",
    pickedQty: 100,
    pickProgress: 100,
    picker: "王五",
    status: "completed",
    createdAt: "2024-10-10 09:15",
    createdBy: "demo",
  },
];

const seedPickingWorks: PickingWork[] = [
  {
    id: "1",
    taskNo: "PK-20241020-0001",
    waveNo: "WAVE-2024-0028",
    outboundOrderIds: ["OB001042003498", "OB001042003499"],
    pickingMode: "by_wave",
    sortingMode: "seed_after_pick",
    pickingType: "波次拣货",
    priority: "中",
    orderCount: 2,
    skuCount: 2,
    totalQty: 11,
    pickedQty: 11,
    picker: { name: "张三", avatar: "ZS" },
    status: "已完成",
    createTime: "2024-10-20 14:30",
    estimatedTime: "2024-10-20 16:00",
    actualTime: "2024-10-20 15:20",
  },
  {
    id: "2",
    taskNo: "PK-20241015-0001",
    waveNo: "WAVE-2024-0027",
    outboundOrderIds: ["OB001041503480"],
    pickingMode: "by_wave",
    sortingMode: "seed_after_pick",
    pickingType: "波次拣货",
    priority: "高",
    orderCount: 1,
    skuCount: 5,
    totalQty: 25,
    pickedQty: 18,
    picker: { name: "李四", avatar: "LS" },
    status: "拣货中",
    createTime: "2024-10-15 11:45",
    estimatedTime: "2024-10-15 13:30",
    actualTime: null,
  },
  {
    id: "3",
    taskNo: "PK-20241010-0001",
    waveNo: "WAVE-2024-0026",
    outboundOrderIds: ["OB001041003450"],
    pickingMode: "by_wave",
    sortingMode: "none",
    pickingType: "波次拣货",
    priority: "中",
    orderCount: 1,
    skuCount: 8,
    totalQty: 100,
    pickedQty: 100,
    picker: { name: "王五", avatar: "WW" },
    status: "已完成",
    createTime: "2024-10-10 09:30",
    estimatedTime: "2024-10-10 12:00",
    actualTime: "2024-10-10 11:45",
  },
];

const seedOutboundPackages: OutboundPackage[] = [
  {
    id: "1",
    packageNo: "PKG-20241020-0001",
    boxNo: "BOX-10200001",
    orderNo: "AMZ-2024-100321",
    outboundOrderId: "OB001042003498",
    customer: "Amazon-US",
    carrier: "FedEx",
    trackingNo: null,
    itemCount: 1,
    skuCount: 1,
    weight: null,
    length: null,
    width: null,
    height: null,
    status: "pending_weight",
    reviewedAt: "2024-10-20 15:35",
    weightedAt: null,
    shippedAt: null,
    operator: "张三",
  },
  {
    id: "2",
    packageNo: "PKG-20241020-0002",
    boxNo: "BOX-10200002",
    orderNo: "WMT-2024-087654",
    outboundOrderId: "OB001042003499",
    customer: "Walmart-US",
    carrier: "USPS",
    trackingNo: "USPS10200002",
    itemCount: 10,
    skuCount: 1,
    weight: 2.45,
    length: 32,
    width: 24,
    height: 18,
    status: "pending_ship",
    reviewedAt: "2024-10-20 15:42",
    weightedAt: "2024-10-20 15:46",
    shippedAt: null,
    operator: "张三",
  },
  {
    id: "3",
    packageNo: "PKG-20241010-0001",
    boxNo: "BOX-10100001",
    orderNo: "TR-2024-002365",
    outboundOrderId: "OB001041003450",
    customer: "深圳仓库",
    carrier: "顺丰",
    trackingNo: "SF1234567890",
    itemCount: 100,
    skuCount: 8,
    weight: 18.6,
    length: 60,
    width: 45,
    height: 38,
    status: "shipped",
    reviewedAt: "2024-10-10 11:50",
    weightedAt: "2024-10-10 11:58",
    shippedAt: "2024-10-10 12:08",
    operator: "王五",
  },
];

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

function nextWaveNo(waves: WaveOrder[]) {
  const today = todayKey();
  const count = waves.filter((wave) => wave.id.includes(today)).length + 1;
  return `WAVE-${today}-${String(count).padStart(4, "0")}`;
}

function nextPickingWorkNo(works: PickingWork[]) {
  const today = todayKey();
  const count = works.filter((work) => work.taskNo.includes(today)).length + 1;
  return `PK-${today}-${String(count).padStart(4, "0")}`;
}

function nextPackageNo(packages: OutboundPackage[]) {
  const today = todayKey();
  const count = packages.filter((pkg) => pkg.packageNo.includes(today)).length + 1;
  return `PKG-${today}-${String(count).padStart(4, "0")}`;
}

function resolveOutboundOrder(orderNo: string, orders: OutboundOrder[]) {
  return orders.find((order) => order.id === orderNo || order.orderNo === orderNo) || null;
}

function inferWaveType(orders: OutboundOrder[]): OrderStructureType {
  if (orders.some((order) => order.orderType === "multi_mixed")) return "multi_mixed";
  if (orders.some((order) => order.orderType === "single_multi")) return "single_multi";
  return "single_single";
}

function inferSortingMode(mode: PickingMode, waveType: OrderStructureType, orderCount: number): SortingMode {
  if (mode === "by_order") return "none";
  if (orderCount > 1 || waveType !== "single_single") return "seed_after_pick";
  return "none";
}

function toPickingTask(work: PickingWork): PickingTask {
  return {
    id: work.id,
    taskNo: work.taskNo,
    waveNo: work.waveNo,
    pickingType: work.pickingType,
    priority: work.priority,
    orderCount: work.orderCount,
    skuCount: work.skuCount,
    totalQty: work.totalQty,
    pickedQty: work.pickedQty,
    picker: work.picker,
    status: work.status,
    createTime: work.createTime,
    estimatedTime: work.estimatedTime,
    actualTime: work.actualTime,
  };
}

export function listOutboundOrders(): OutboundOrder[] {
  return readStorage(OUTBOUND_STORAGE_KEY, seedOutboundOrders);
}

export function listWaveOrders(): WaveOrder[] {
  return readStorage(WAVE_STORAGE_KEY, seedWaveOrders);
}

export function listPickingWorks(): PickingWork[] {
  return readStorage(PICKING_WORK_STORAGE_KEY, seedPickingWorks);
}

export function listOutboundPackages(): OutboundPackage[] {
  return readStorage(OUTBOUND_PACKAGE_STORAGE_KEY, seedOutboundPackages);
}

export function listPickingTasks(): PickingTask[] {
  return listPickingWorks().map(toPickingTask);
}

export function getPickingTask(taskId: string): PickingTask | undefined {
  return listPickingTasks().find((task) => task.id === taskId || task.taskNo === taskId);
}

export function getWaveOrder(waveId?: string): WaveOrder | undefined {
  const waves = listWaveOrders();
  const selectedId = waveId || getSelectedWaveId() || waves[0]?.id;
  return waves.find((wave) => wave.id === selectedId) || waves[0];
}

export function setSelectedWaveId(waveId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SELECTED_WAVE_KEY, waveId);
}

export function getSelectedWaveId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SELECTED_WAVE_KEY);
}

export function createWaveFromOutboundOrders(orderIds: string[], options?: { picker?: string }): WaveOrder | undefined {
  const orders = listOutboundOrders();
  const waves = listWaveOrders();
  const selectedOrders = orders.filter((order) => orderIds.includes(order.id));
  if (selectedOrders.length === 0) return undefined;
  if (selectedOrders.length !== orderIds.length || selectedOrders.some((order) => order.status !== "pending" || order.waveNo)) {
    throw new Error("只能对待分波且未进入波次的出库单创建波次");
  }

  const businessType = selectedOrders[0].outboundType;
  if (selectedOrders.some((order) => order.outboundType !== businessType)) {
    throw new Error("不同出库类型不能混合分波");
  }
  if (businessType === "b2c" && new Set(selectedOrders.map((order) => order.carrier)).size > 1) {
    throw new Error("B2C 小单只能按同一承运商合波");
  }
  if (businessType === "store_transfer" && new Set(selectedOrders.map((order) => order.customer)).size > 1) {
    throw new Error("门店调拨只能按同一门店合波，确保整单齐套集货");
  }
  if (businessType === "wholesale" && selectedOrders.length !== 1) {
    throw new Error("批发大单必须按单独立执行，不参与合波");
  }

  const waveType = inferWaveType(selectedOrders);
  const sortingMode = inferSortingMode("by_wave", waveType, selectedOrders.length);
  const waveNo = nextWaveNo(waves);
  const wave: WaveOrder = {
    id: waveNo,
    outboundOrderIds: selectedOrders.map((order) => order.id),
    pickingWorkNos: [],
    orderCount: selectedOrders.length,
    skuCount: selectedOrders.reduce((sum, order) => sum + order.skuCount, 0),
    totalQty: selectedOrders.reduce((sum, order) => sum + order.totalQty, 0),
    waveType,
    sortingMode,
    pickedQty: 0,
    pickProgress: 0,
    picker: options?.picker || null,
    // 创建波次只完成订单聚合；生成拣货任务才视为波次释放。
    status: "created",
    createdAt: nowText(),
    createdBy: "当前用户",
  };

  const updatedOrders = orders.map((order) =>
    orderIds.includes(order.id)
      ? {
          ...order,
          waveNo,
          status: "waved" as OutboundOrderStatus,
          picker: options?.picker || order.picker,
        }
      : order
  );

  saveStorage(OUTBOUND_STORAGE_KEY, updatedOrders);
  saveStorage(WAVE_STORAGE_KEY, [wave, ...waves]);
  return wave;
}

export function createPickingWorkFromWave(waveNo: string, options?: { picker?: string }): PickingWork | undefined {
  const waves = listWaveOrders();
  const waveIndex = waves.findIndex((wave) => wave.id === waveNo);
  if (waveIndex === -1) return undefined;

  const wave = waves[waveIndex];
  if (wave.status !== "created" && wave.status !== "assigned") return undefined;
  const works = listPickingWorks();
  const existing = works.find((work) => work.waveNo === waveNo);
  if (existing) return existing;

  const pickerName = options?.picker || wave.picker || "待分配";
  const work: PickingWork = {
    id: String(works.length + 1),
    taskNo: nextPickingWorkNo(works),
    waveNo: wave.id,
    outboundOrderIds: wave.outboundOrderIds,
    pickingMode: "by_wave",
    sortingMode: wave.sortingMode,
    pickingType: "波次拣货",
    priority: "中",
    orderCount: wave.orderCount,
    skuCount: wave.skuCount,
    totalQty: wave.totalQty,
    pickedQty: 0,
    picker: pickerName === "待分配" ? null : { name: pickerName, avatar: avatarOf(pickerName) },
    status: pickerName === "待分配" ? "待分配" : "待拣货",
    createTime: nowText(),
    estimatedTime: nowText(),
    actualTime: null,
  };

  const updatedWave: WaveOrder = {
    ...wave,
    pickingWorkNos: [work.taskNo, ...wave.pickingWorkNos],
    picker: pickerName === "待分配" ? wave.picker : pickerName,
    status: pickerName === "待分配" ? wave.status : "assigned",
  };
  waves[waveIndex] = updatedWave;

  const orders = listOutboundOrders().map((order) =>
    wave.outboundOrderIds.includes(order.id)
      ? {
          ...order,
          pickingWorkNo: work.taskNo,
          picker: work.picker?.name || order.picker,
          status: "pending_pick" as OutboundOrderStatus,
        }
      : order
  );

  saveStorage(WAVE_STORAGE_KEY, waves);
  saveStorage(PICKING_WORK_STORAGE_KEY, [work, ...works]);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  return work;
}

export function createPickingWorkFromOutboundOrder(orderId: string, options?: { picker?: string }): PickingWork | undefined {
  const orders = listOutboundOrders();
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return undefined;

  const order = orders[orderIndex];
  if (order.outboundType !== "wholesale") {
    throw new Error("只有批发大单可直接按单生成拣货任务；B2C 和门店调拨请先创建波次");
  }
  if (order.status !== "pending" || order.waveNo) {
    throw new Error("当前出库单不处于可生成按单拣货任务的状态");
  }
  const works = listPickingWorks();
  const existing = works.find((work) => work.outboundOrderIds.includes(orderId) && work.pickingMode === "by_order");
  if (existing) return existing;

  const pickerName = options?.picker || order.picker || "待分配";
  const work: PickingWork = {
    id: String(works.length + 1),
    taskNo: nextPickingWorkNo(works),
    waveNo: null,
    outboundOrderIds: [order.id],
    pickingMode: "by_order",
    sortingMode: "none",
    pickingType: "按单拣货",
    priority: order.priority,
    orderCount: 1,
    skuCount: order.skuCount,
    totalQty: order.totalQty,
    pickedQty: 0,
    picker: pickerName === "待分配" ? null : { name: pickerName, avatar: avatarOf(pickerName) },
    status: pickerName === "待分配" ? "待分配" : "待拣货",
    createTime: nowText(),
    estimatedTime: nowText(),
    actualTime: null,
  };

  orders[orderIndex] = {
    ...order,
    pickingWorkNo: work.taskNo,
    picker: work.picker?.name || order.picker,
    status: "pending_pick",
  };

  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  saveStorage(PICKING_WORK_STORAGE_KEY, [work, ...works]);
  return work;
}

export function startPickingWork(taskNo: string): PickingWork | undefined {
  const works = listPickingWorks();
  const workIndex = works.findIndex((work) => work.taskNo === taskNo);
  if (workIndex === -1) return undefined;

  const work = { ...works[workIndex], status: "拣货中" as PickingWorkStatus };
  works[workIndex] = work;

  const orders = listOutboundOrders().map((order) =>
    work.outboundOrderIds.includes(order.id)
      ? { ...order, status: "picking" as OutboundOrderStatus }
      : order
  );
  const waves = listWaveOrders().map((wave) =>
    wave.id === work.waveNo ? { ...wave, status: "picking" as WaveStatus } : wave
  );

  saveStorage(PICKING_WORK_STORAGE_KEY, works);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  saveStorage(WAVE_STORAGE_KEY, waves);
  return work;
}

export function startPickingWorkByWave(waveNo: string): { wave?: WaveOrder; work?: PickingWork } {
  const existingWork = listPickingWorks().find((work) => work.waveNo === waveNo);
  const work = existingWork || createPickingWorkFromWave(waveNo, { picker: getWaveOrder(waveNo)?.picker || "当前用户" });
  if (!work) return {};

  const startedWork = startPickingWork(work.taskNo) || work;
  return {
    wave: getWaveOrder(waveNo),
    work: startedWork,
  };
}

export function completePickingWork(taskNo: string): PickingWork | undefined {
  const works = listPickingWorks();
  const workIndex = works.findIndex((work) => work.taskNo === taskNo);
  if (workIndex === -1) return undefined;

  const work: PickingWork = {
    ...works[workIndex],
    pickedQty: works[workIndex].totalQty,
    status: "已完成",
    actualTime: nowText(),
  };
  works[workIndex] = work;

  const nextOrderStatus: OutboundOrderStatus = work.sortingMode === "none" ? "pending_review" : "pending_sort";
  const orders = listOutboundOrders().map((order) =>
    work.outboundOrderIds.includes(order.id)
      ? { ...order, status: nextOrderStatus, picker: work.picker?.name || order.picker }
      : order
  );
  const waves = listWaveOrders().map((wave) =>
    wave.id === work.waveNo
      ? {
          ...wave,
          pickedQty: wave.totalQty,
          pickProgress: 100,
          status: "picked" as WaveStatus,
        }
      : wave
  );

  saveStorage(PICKING_WORK_STORAGE_KEY, works);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  saveStorage(WAVE_STORAGE_KEY, waves);
  return work;
}

export function completePickingWorkByWave(waveNo: string): { wave?: WaveOrder; work?: PickingWork } {
  const work = listPickingWorks().find((item) => item.waveNo === waveNo) || createPickingWorkFromWave(waveNo, { picker: getWaveOrder(waveNo)?.picker || "当前用户" });
  if (!work) return {};

  const completedWork = completePickingWork(work.taskNo) || work;
  return {
    wave: getWaveOrder(waveNo),
    work: completedWork,
  };
}

export function startWaveSorting(waveNo: string): WaveOrder | undefined {
  const waves = listWaveOrders();
  const waveIndex = waves.findIndex((wave) => wave.id === waveNo);
  if (waveIndex === -1) return undefined;

  const wave: WaveOrder = {
    ...waves[waveIndex],
    status: "sorting",
  };
  waves[waveIndex] = wave;
  const orders = listOutboundOrders().map((order) =>
    wave.outboundOrderIds.includes(order.id) ? { ...order, status: "pending_sort" as OutboundOrderStatus } : order
  );

  saveStorage(WAVE_STORAGE_KEY, waves);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  return wave;
}

export function completeWaveSorting(waveNo: string): WaveOrder | undefined {
  const waves = listWaveOrders();
  const waveIndex = waves.findIndex((wave) => wave.id === waveNo);
  if (waveIndex === -1) return undefined;

  const wave: WaveOrder = {
    ...waves[waveIndex],
    status: "sorted",
  };
  waves[waveIndex] = wave;
  const orders = listOutboundOrders().map((order) =>
    wave.outboundOrderIds.includes(order.id) ? { ...order, status: "pending_review" as OutboundOrderStatus } : order
  );

  saveStorage(WAVE_STORAGE_KEY, waves);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  return wave;
}

export function completeWaveOrder(waveNo: string): WaveOrder | undefined {
  const waves = listWaveOrders();
  const waveIndex = waves.findIndex((wave) => wave.id === waveNo);
  if (waveIndex === -1) return undefined;

  const wave: WaveOrder = {
    ...waves[waveIndex],
    status: "completed",
    pickedQty: waves[waveIndex].totalQty,
    pickProgress: 100,
  };
  waves[waveIndex] = wave;

  const orders = listOutboundOrders().map((order) =>
    wave.outboundOrderIds.includes(order.id) && (order.status === "pending_sort" || order.status === "picking" || order.status === "pending_pick")
      ? { ...order, status: "pending_review" as OutboundOrderStatus }
      : order
  );

  saveStorage(WAVE_STORAGE_KEY, waves);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  return wave;
}

export function createOutboundPackageFromReview(input: {
  boxNo: string;
  orderNo?: string;
  customer?: string;
  items: Array<{ sku: string; qty: number }>;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  carrier?: string;
  trackingNo?: string;
  operator?: string;
}): OutboundPackage {
  const packages = listOutboundPackages();
  const orders = listOutboundOrders();
  const linkedOrder = input.orderNo ? resolveOutboundOrder(input.orderNo, orders) : null;
  if (linkedOrder && linkedOrder.status !== "pending_review") {
    throw new Error("只有待复核的出库单可生成包裹；请先完成拣货及必要的二次分拣");
  }
  if (input.items.length === 0 || input.items.some((item) => !Number.isInteger(item.qty) || item.qty <= 0)) {
    throw new Error("包裹必须包含数量大于 0 的商品明细");
  }
  const packageNo = nextPackageNo(packages);
  const status: OutboundPackageStatus = input.weight ? "pending_ship" : "pending_weight";

  const outboundPackage: OutboundPackage = {
    id: String(packages.length + 1),
    packageNo,
    boxNo: input.boxNo,
    orderNo: input.orderNo || input.boxNo,
    outboundOrderId: linkedOrder?.id || null,
    customer: input.customer || linkedOrder?.customer || "-",
    carrier: input.carrier || linkedOrder?.carrier || "-",
    trackingNo: input.trackingNo || linkedOrder?.trackingNo || null,
    itemCount: input.items.reduce((sum, item) => sum + item.qty, 0),
    skuCount: new Set(input.items.map((item) => item.sku)).size,
    weight: input.weight ?? null,
    length: input.length ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    status,
    reviewedAt: nowText(),
    weightedAt: input.weight ? nowText() : null,
    shippedAt: null,
    operator: input.operator || "当前用户",
  };

  const updatedOrders = orders.map((order) =>
    linkedOrder && order.id === linkedOrder.id
      ? { ...order, status: status as OutboundOrderStatus }
      : order
  );

  saveStorage(OUTBOUND_PACKAGE_STORAGE_KEY, [outboundPackage, ...packages]);
  saveStorage(OUTBOUND_STORAGE_KEY, updatedOrders);
  return outboundPackage;
}

export function confirmOutboundPackageWeight(
  packageNo: string,
  input: {
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    trackingNo?: string;
    carrier?: string;
  }
): OutboundPackage | undefined {
  const packages = listOutboundPackages();
  const packageIndex = packages.findIndex((pkg) => pkg.packageNo === packageNo || pkg.boxNo === packageNo);
  if (packageIndex === -1) return undefined;
  if (packages[packageIndex].status !== "pending_weight") return undefined;
  if (!Number.isFinite(input.weight) || input.weight <= 0) {
    throw new Error("重量必须大于 0");
  }

  const outboundPackage: OutboundPackage = {
    ...packages[packageIndex],
    weight: input.weight,
    length: input.length ?? packages[packageIndex].length,
    width: input.width ?? packages[packageIndex].width,
    height: input.height ?? packages[packageIndex].height,
    trackingNo: input.trackingNo || packages[packageIndex].trackingNo,
    carrier: input.carrier || packages[packageIndex].carrier,
    status: "pending_ship",
    weightedAt: nowText(),
  };
  packages[packageIndex] = outboundPackage;

  const orders = listOutboundOrders().map((order) =>
    order.id === outboundPackage.outboundOrderId
      ? {
          ...order,
          status: "pending_ship" as OutboundOrderStatus,
          carrier: outboundPackage.carrier,
          trackingNo: outboundPackage.trackingNo,
        }
      : order
  );

  saveStorage(OUTBOUND_PACKAGE_STORAGE_KEY, packages);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  return outboundPackage;
}

export function shipOutboundPackage(packageNo: string, input?: { trackingNo?: string; carrier?: string }): OutboundPackage | undefined {
  const packages = listOutboundPackages();
  const packageIndex = packages.findIndex((pkg) => pkg.packageNo === packageNo || pkg.boxNo === packageNo);
  if (packageIndex === -1) return undefined;
  if (packages[packageIndex].status !== "pending_ship") return undefined;
  const carrier = input?.carrier || packages[packageIndex].carrier;
  const trackingNo = input?.trackingNo || packages[packageIndex].trackingNo;
  if (!carrier || carrier === "-" || !trackingNo) {
    throw new Error("完成出库前必须确认承运商和运单号");
  }

  const outboundPackage: OutboundPackage = {
    ...packages[packageIndex],
    carrier,
    trackingNo,
    status: "shipped",
    shippedAt: nowText(),
  };
  packages[packageIndex] = outboundPackage;

  const orders = listOutboundOrders().map((order) =>
    order.id === outboundPackage.outboundOrderId
      ? {
          ...order,
          status: "shipped" as OutboundOrderStatus,
          carrier: outboundPackage.carrier,
          trackingNo: outboundPackage.trackingNo,
        }
      : order
  );

  saveStorage(OUTBOUND_PACKAGE_STORAGE_KEY, packages);
  saveStorage(OUTBOUND_STORAGE_KEY, orders);
  refreshWaveShippingState(orders);
  return outboundPackage;
}

function refreshWaveShippingState(orders: OutboundOrder[]) {
  const waves = listWaveOrders().map((wave) => {
    const waveOrders = orders.filter((order) => wave.outboundOrderIds.includes(order.id));
    return waveOrders.length > 0 && waveOrders.every((order) => order.status === "shipped")
      ? { ...wave, status: "shipped" as WaveStatus }
      : wave;
  });
  saveStorage(WAVE_STORAGE_KEY, waves);
}

export function completePackingForOutboundOrder(input: {
  orderNo: string;
  items: Array<{ sku: string; qty: number }>;
  boxNo?: string;
  customer?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  carrier?: string;
  trackingNo?: string;
  operator?: string;
}): OutboundPackage {
  return createOutboundPackageFromReview({
    boxNo: input.boxNo || input.trackingNo || input.orderNo,
    orderNo: input.orderNo,
    customer: input.customer,
    items: input.items,
    weight: input.weight,
    length: input.length,
    width: input.width,
    height: input.height,
    carrier: input.carrier,
    trackingNo: input.trackingNo,
    operator: input.operator,
  });
}

export function resetMockOutbound(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(OUTBOUND_STORAGE_KEY, JSON.stringify(seedOutboundOrders));
    sessionStorage.setItem(WAVE_STORAGE_KEY, JSON.stringify(seedWaveOrders));
    sessionStorage.setItem(PICKING_WORK_STORAGE_KEY, JSON.stringify(seedPickingWorks));
    sessionStorage.setItem(OUTBOUND_PACKAGE_STORAGE_KEY, JSON.stringify(seedOutboundPackages));
    sessionStorage.removeItem(SELECTED_WAVE_KEY);
  }
}
