/**
 * ASN 状态以项目单据口径为准；上架单独立记录作业明细，但 ASN 在全部上架后同步进入“已上架”。
 */
export type InboundOrderStatus = "pending" | "receiving" | "received" | "shelved" | "cancelled";

export interface InboundItem {
  sku: string;
  productName: string;
  barcode: string;
  spec: string;
  plannedQty: number;
  receivedQty: number;
  shelvedQty: number;
  /** 默认按 3C 品类处理：收货后必须质检，免检品可在 ASN 明细中显式关闭。 */
  inspectionRequired?: boolean;
  inspectionStatus?: "免检" | "待质检" | "合格" | "不合格";
}

export interface ReceivingStagingLocation {
  code: string;
  name: string;
  receiptType: "pallet" | "parcel" | "carton" | "default";
}

export interface InboundOrderListItem {
  id: string;
  note: string;
  createdQty: string;
  productCount: number;
  skuInfo: string;
  referenceNo: string;
  tracking: string;
  deliveryMethod: string;
  estimatedDate: string;
  customer: string;
  status: InboundOrderStatus;
}

export interface ReceiveRecord {
  receiptNo: string;
  batchNo: string;
  container: { containerNo: string; containerType: string };
  stagingLocation: ReceivingStagingLocation;
  items: Array<{ sku: string; productName: string; qty: number }>;
  receiveTime: string;
  receiver: string;
  note: string;
  status: "已收货" | "待质检" | "质检中" | "已完成";
  inspectionItems: Array<{
    sku: string;
    qty: number;
    qualifiedQty: number | null;
    defectiveQty: number | null;
    conclusion: "合格" | "不合格" | "部分不合格" | null;
    reason: string;
  }>;
}

export interface PutawayRecord {
  batchNo: string;
  containerNo: string;
  sku: string;
  productName: string;
  qty: number;
  location: string;
  putawayTime: string;
  operator: string;
  note: string;
}

export interface InboundLog {
  time: string;
  operator: string;
  action: string;
  detail: string;
}

export interface InboundDetail {
  id: string;
  referenceNo: string;
  customer: string;
  status: InboundOrderStatus;
  createdTime: string;
  createdBy: string;
  estimatedDate: string;
  actualArrivalDate: string;
  deliveryMethod: string;
  tracking: string;
  note: string;
  items: InboundItem[];
  receiveRecords: ReceiveRecord[];
  putawayRecords: PutawayRecord[];
  logs: InboundLog[];
}

export interface ReceiveConfirmData {
  container: { containerNo: string; containerType: string };
  items: Array<InboundItem & { currentReceiveQty: number }>;
  note: string;
}

export interface ReceivedContainerSnapshot {
  inboundId: string;
  customerName: string;
  referenceNo: string;
  receiveBatchNo: string;
  receiptNo: string;
  receiveTime: string;
  stagingLocation: ReceivingStagingLocation;
  container: { containerNo: string; containerType: string };
  items: Array<{
    sku: string;
    productName: string;
    spec: string;
    qty: number;
    inspectionRequired: boolean;
  }>;
  putawayType?: "良品上架" | "次品上架";
}

const ORDERS_STORAGE_KEY = "wms_mock_inbound_orders";
const DETAILS_STORAGE_KEY = "wms_mock_inbound_details";
const SELECTED_INBOUND_KEY = "wms_selected_inbound_id";

export const receivingStagingLocations: ReceivingStagingLocation[] = [
  { code: "STG-RCV-PALLET", name: "托盘收货暂存库位", receiptType: "pallet" },
  { code: "STG-RCV-PARCEL", name: "快递包裹收货暂存库位", receiptType: "parcel" },
  { code: "STG-RCV-CARTON", name: "整箱收货暂存库位", receiptType: "carton" },
  { code: "STG-RCV-GENERAL", name: "通用收货暂存库位", receiptType: "default" },
];

const seedDetails: InboundDetail[] = [
  {
    id: "IB001042102963",
    referenceNo: "REF-2024-1028",
    customer: "ab00-HK买汇",
    status: "receiving",
    createdTime: "2024-10-28 09:30:00",
    createdBy: "张三",
    estimatedDate: "2024-10-30",
    actualArrivalDate: "2024-10-28 14:20:00",
    deliveryMethod: "送货 (顺丰)",
    tracking: "托盘/卡板",
    note: "紧急入库，优先处理",
    items: [
      { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", spec: "黑色/标准版", plannedQty: 100, receivedQty: 60, shelvedQty: 40 },
      { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", spec: "运动版/蓝色", plannedQty: 50, receivedQty: 30, shelvedQty: 20 },
      { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", spec: "20000mAh", plannedQty: 80, receivedQty: 0, shelvedQty: 0 },
    ],
    receiveRecords: [
      {
        receiptNo: "RCV-20241028-001",
        batchNo: "RCV-20241028-001",
        container: { containerNo: "PLT-001", containerType: "托盘" },
        stagingLocation: receivingStagingLocations[0],
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", qty: 40 },
          { sku: "SKU-002", productName: "智能手环", qty: 20 },
        ],
        receiveTime: "2024-10-28 14:20:00",
        receiver: "李四",
        note: "第一批收货",
        status: "已完成",
        inspectionItems: [
          { sku: "SKU-001", qty: 40, qualifiedQty: 40, defectiveQty: 0, conclusion: "合格", reason: "" },
          { sku: "SKU-002", qty: 20, qualifiedQty: 20, defectiveQty: 0, conclusion: "合格", reason: "" },
        ],
      },
      {
        receiptNo: "RCV-20241028-002",
        batchNo: "RCV-20241028-002",
        container: { containerNo: "PLT-002", containerType: "托盘" },
        stagingLocation: receivingStagingLocations[0],
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", qty: 20 },
          { sku: "SKU-002", productName: "智能手环", qty: 10 },
        ],
        receiveTime: "2024-10-28 15:45:00",
        receiver: "李四",
        note: "",
        status: "待质检",
        inspectionItems: [
          { sku: "SKU-001", qty: 20, qualifiedQty: null, defectiveQty: null, conclusion: null, reason: "" },
          { sku: "SKU-002", qty: 10, qualifiedQty: null, defectiveQty: null, conclusion: null, reason: "" },
        ],
      },
    ],
    putawayRecords: [
      { batchNo: "PUT-20241028-001", containerNo: "PLT-001", sku: "SKU-001", productName: "无线蓝牙耳机", qty: 30, location: "A-01-02-03", putawayTime: "2024-10-28 15:00:00", operator: "王五", note: "" },
      { batchNo: "PUT-20241028-002", containerNo: "BOX-001", sku: "SKU-002", productName: "智能手环", qty: 20, location: "A-01-02-04", putawayTime: "2024-10-28 15:10:00", operator: "王五", note: "" },
      { batchNo: "PUT-20241028-003", containerNo: "PLT-001", sku: "SKU-001", productName: "无线蓝牙耳机", qty: 10, location: "A-01-03-01", putawayTime: "2024-10-28 15:30:00", operator: "王五", note: "" },
    ],
    logs: [
      { time: "2024-10-28 15:45:00", operator: "李四", action: "收货", detail: "收货批次 RCV-20241028-002，进入 STG-RCV-PALLET，收货数量 30 件" },
      { time: "2024-10-28 15:30:00", operator: "王五", action: "上架", detail: "上架 SKU-001 × 10 件至 A-01-03-01" },
      { time: "2024-10-28 15:10:00", operator: "王五", action: "上架", detail: "上架 SKU-002 × 20 件至 A-01-02-04" },
      { time: "2024-10-28 15:00:00", operator: "王五", action: "上架", detail: "上架 SKU-001 × 30 件至 A-01-02-03" },
      { time: "2024-10-28 14:20:00", operator: "李四", action: "收货", detail: "收货批次 RCV-20241028-001，进入 STG-RCV-PALLET，收货数量 60 件" },
      { time: "2024-10-28 09:30:00", operator: "张三", action: "创建", detail: "创建入库单，计划入库 230 件" },
    ],
  },
  createInboundDetail({
    id: "IB001042102961",
    referenceNo: "REF-2024-1029",
    customer: "ab00-HK买汇",
    tracking: "托盘/卡板",
    deliveryMethod: "送货 (德邦)",
    plannedQty: 70,
    status: "pending",
  }),
  createInboundDetail({
    id: "IB001040300965",
    referenceNo: "1223",
    customer: "ab00-HK买汇",
    tracking: "快递包裹",
    deliveryMethod: "快递",
    plannedQty: 1,
    status: "receiving",
    receivedQty: 0,
  }),
  createInboundDetail({
    id: "IB001040300961",
    referenceNo: "-",
    customer: "ab00-HK买汇",
    tracking: "快递包裹",
    deliveryMethod: "快递",
    plannedQty: 1,
    status: "receiving",
    receivedQty: 0,
  }),
  createInboundDetail({
    id: "IB001040223963",
    referenceNo: "REF-2024-0998",
    customer: "ab00-HK买汇",
    tracking: "箱",
    deliveryMethod: "送货 (顺丰)",
    plannedQty: 30,
    status: "shelved",
    receivedQty: 30,
    note: "紧急入库",
  }),
  createInboundDetail({
    id: "IB001024092365",
    referenceNo: "REF-2024-0995",
    customer: "ab00-HK买汇",
    tracking: "箱",
    deliveryMethod: "送货 (2025P)",
    plannedQty: 2300,
    status: "received",
    receivedQty: 2300,
    shelvedQty: 2300,
    note: "大批量入库",
  }),
  createInboundDetail({
    id: "IB001022056321",
    referenceNo: "-",
    customer: "ab00-HK买汇",
    tracking: "托盘/卡板",
    deliveryMethod: "-",
    plannedQty: 200,
    status: "cancelled",
    note: "客户取消订单",
  }),
];

function createInboundDetail(options: {
  id: string;
  referenceNo: string;
  customer: string;
  tracking: string;
  deliveryMethod: string;
  plannedQty: number;
  status: InboundOrderStatus;
  receivedQty?: number;
  shelvedQty?: number;
  note?: string;
}): InboundDetail {
  const receivedQty = options.receivedQty ?? 0;
  return {
    id: options.id,
    referenceNo: options.referenceNo,
    customer: options.customer,
    status: options.status,
    createdTime: "2024-10-28 09:30:00",
    createdBy: "系统导入",
    estimatedDate: "2024-10-30",
    actualArrivalDate: receivedQty > 0 ? "2024-10-28 14:20:00" : "",
    deliveryMethod: options.deliveryMethod,
    tracking: options.tracking,
    note: options.note || "-",
    items: [
      {
        sku: "SKU-001",
        productName: "无线蓝牙耳机",
        barcode: "6901234567890",
        spec: "黑色/标准版",
        plannedQty: options.plannedQty,
        receivedQty,
        shelvedQty: options.shelvedQty ?? 0,
      },
    ],
    receiveRecords: [],
    putawayRecords: [],
    logs: [
      {
        time: "2024-10-28 09:30:00",
        operator: "系统导入",
        action: "创建",
        detail: `创建入库单，计划入库 ${options.plannedQty} 件`,
      },
    ],
  };
}

function toOrderListItem(detail: InboundDetail): InboundOrderListItem {
  const plannedQty = detail.items.reduce((sum, item) => sum + item.plannedQty, 0);
  const receivedQty = detail.items.reduce((sum, item) => sum + item.receivedQty, 0);
  const skuInfo =
    detail.items.length === 1
      ? `${detail.items[0].productName} * ${detail.items[0].plannedQty}`
      : "多个SKU";

  return {
    id: detail.id,
    note: detail.note || "-",
    createdQty: `${receivedQty}/${plannedQty}`,
    productCount: plannedQty,
    skuInfo,
    referenceNo: detail.referenceNo || "-",
    tracking: detail.tracking || "-",
    deliveryMethod: detail.deliveryMethod || "-",
    estimatedDate: detail.estimatedDate || "-",
    customer: detail.customer,
    status: detail.status,
  };
}

function readDetails(): InboundDetail[] {
  if (typeof window === "undefined") return seedDetails;
  const stored = sessionStorage.getItem(DETAILS_STORAGE_KEY);
  if (!stored) {
    sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(seedDetails));
    sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(seedDetails.map(toOrderListItem)));
    return seedDetails;
  }
  return (JSON.parse(stored) as InboundDetail[]).map((detail) => ({
    ...detail,
    status: normalizeInboundStatus(detail.status),
  }));
}

function normalizeInboundStatus(status: string): InboundOrderStatus {
  const legacyStatusMap: Record<string, InboundOrderStatus> = {
    in_progress: "receiving",
    completed: "received",
    closed: "cancelled",
  };

  return legacyStatusMap[status] || (status as InboundOrderStatus);
}

function saveDetails(details: InboundDetail[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(details));
  sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(details.map(toOrderListItem)));
}

export function listInboundOrders(): InboundOrderListItem[] {
  return readDetails().map(toOrderListItem);
}

export function getInboundDetail(inboundId?: string): InboundDetail {
  const details = readDetails();
  const selectedId = inboundId || getSelectedInboundId() || details[0]?.id;
  return details.find((detail) => detail.id === selectedId) || details[0];
}

export function getInboundItems(inboundId: string): InboundItem[] {
  return getInboundDetail(inboundId).items;
}

export function getInboundOrder(inboundId: string): InboundOrderListItem | undefined {
  return listInboundOrders().find((order) => order.id === inboundId);
}

export function setSelectedInboundId(inboundId: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SELECTED_INBOUND_KEY, inboundId);
  }
}

export function getSelectedInboundId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SELECTED_INBOUND_KEY);
}

export function getReceivingStagingLocation(order: Pick<InboundOrderListItem, "tracking" | "deliveryMethod">): ReceivingStagingLocation {
  const text = `${order.tracking || ""} ${order.deliveryMethod || ""}`;
  if (/托盘|卡板|pallet/i.test(text)) return receivingStagingLocations[0];
  if (/快递|包裹|parcel/i.test(text)) return receivingStagingLocations[1];
  if (/箱|carton|box/i.test(text)) return receivingStagingLocations[2];
  return receivingStagingLocations[3];
}

export function receiveInboundContainer(
  inboundId: string,
  data: ReceiveConfirmData
): { detail: InboundDetail; orders: InboundOrderListItem[]; receipt: ReceivedContainerSnapshot } {
  const details = readDetails();
  const detailIndex = details.findIndex((item) => item.id === inboundId);
  if (detailIndex === -1) {
    throw new Error(`Inbound order ${inboundId} not found`);
  }

  const detail = details[detailIndex];
  if (detail.status !== "pending" && detail.status !== "receiving") {
    throw new Error("当前 ASN 不处于可收货状态");
  }
  if (!data.container.containerNo.trim()) {
    throw new Error("请先绑定收货容器");
  }

  const receivedLines = data.items.filter((item) => item.currentReceiveQty > 0);
  if (receivedLines.length === 0) {
    throw new Error("本次收货数量必须大于 0");
  }
  for (const line of receivedLines) {
    const sourceItem = detail.items.find((item) => item.sku === line.sku);
    if (!sourceItem) throw new Error(`SKU ${line.sku} 不属于当前 ASN`);
    if (!Number.isInteger(line.currentReceiveQty)) {
      throw new Error(`SKU ${line.sku} 的收货数量必须为整数`);
    }
    const remainingQty = sourceItem.plannedQty - sourceItem.receivedQty;
    if (line.currentReceiveQty > remainingQty) {
      throw new Error(`SKU ${line.sku} 超额收货：本次最多可收 ${remainingQty} 件`);
    }
  }

  const stagingLocation = getReceivingStagingLocation(toOrderListItem(detail));
  const batchNo = `RCV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(detail.receiveRecords.length + 1).padStart(3, "0")}`;
  const receivedItems = receivedLines.map((item) => ({
    sku: item.sku,
    productName: item.productName,
    spec: item.spec,
    qty: item.currentReceiveQty,
    inspectionRequired: item.inspectionRequired ?? true,
  }));
  const receiveQty = receivedItems.reduce((sum, item) => sum + item.qty, 0);

  const updatedItems = detail.items.map((item) => {
    const receivedItem = receivedLines.find((target) => target.sku === item.sku);
    if (!receivedItem) return item;
    const inspectionStatus: InboundItem["inspectionStatus"] =
      receivedItem.inspectionRequired ?? true ? "待质检" : "免检";
    return {
      ...item,
      receivedQty: Math.min(item.plannedQty, item.receivedQty + receivedItem.currentReceiveQty),
      inspectionStatus,
    };
  });
  const allReceived = updatedItems.every((item) => item.receivedQty >= item.plannedQty);
  const allShelved = updatedItems.every((item) => item.shelvedQty >= item.plannedQty);
  const newStatus: InboundOrderStatus = allShelved ? "shelved" : allReceived ? "received" : "receiving";

  const receiveRecord: ReceiveRecord = {
    receiptNo: batchNo,
    batchNo,
    container: data.container,
    stagingLocation,
    items: receivedLines.map((item) => ({ sku: item.sku, productName: item.productName, qty: item.currentReceiveQty })),
    receiveTime: new Date().toLocaleString("zh-CN"),
    receiver: "当前用户",
    note: data.note,
    status: receivedItems.some((item) => item.inspectionRequired) ? "待质检" : "已完成",
    inspectionItems: receivedItems.map((item) => ({
      sku: item.sku,
      qty: item.qty,
      qualifiedQty: item.inspectionRequired ? null : item.qty,
      defectiveQty: item.inspectionRequired ? null : 0,
      conclusion: item.inspectionRequired ? null : "合格",
      reason: "",
    })),
  };
  const log: InboundLog = {
    time: receiveRecord.receiveTime,
    operator: "当前用户",
    action: "收货",
    detail: `收货批次 ${batchNo}，进入 ${stagingLocation.code}，收货数量 ${receiveQty} 件`,
  };

  const updatedDetail: InboundDetail = {
    ...detail,
    status: newStatus,
    actualArrivalDate: detail.actualArrivalDate || receiveRecord.receiveTime,
    items: updatedItems,
    receiveRecords: [receiveRecord, ...detail.receiveRecords],
    logs: [log, ...detail.logs],
  };

  details[detailIndex] = updatedDetail;
  saveDetails(details);

  return {
    detail: updatedDetail,
    orders: details.map(toOrderListItem),
    receipt: {
      inboundId: detail.id,
      customerName: detail.customer,
      referenceNo: detail.referenceNo,
      receiveBatchNo: batchNo,
      receiptNo: batchNo,
      receiveTime: receiveRecord.receiveTime,
      stagingLocation,
      container: data.container,
      items: receivedItems,
    },
  };
}

export function applyInboundPutawayCompletion(
  inboundId: string,
  records: Array<{ sku: string; productName: string; qty: number; locationCode: string; containerNo: string; note: string }>
): InboundDetail | undefined {
  const details = readDetails();
  const detailIndex = details.findIndex((item) => item.id === inboundId);
  if (detailIndex === -1) return undefined;

  const detail = details[detailIndex];
  const updatedItems = detail.items.map((item) => {
    const qty = records.filter((record) => record.sku === item.sku).reduce((sum, record) => sum + record.qty, 0);
    return qty > 0 ? { ...item, shelvedQty: Math.min(item.plannedQty, item.shelvedQty + qty) } : item;
  });
  const allShelved = updatedItems.every((item) => item.shelvedQty >= item.plannedQty);
  const now = new Date().toLocaleString("zh-CN");
  const putawayRecords = records.map((record, index) => ({
    batchNo: `PUT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(detail.putawayRecords.length + index + 1).padStart(3, "0")}`,
    containerNo: record.containerNo,
    sku: record.sku,
    productName: record.productName,
    qty: record.qty,
    location: record.locationCode,
    putawayTime: now,
    operator: "当前用户",
    note: record.note,
  }));
  const log: InboundLog = {
    time: now,
    operator: "当前用户",
    action: "上架",
    detail: `完成上架 ${records.reduce((sum, record) => sum + record.qty, 0)} 件，入库单状态${allShelved ? "已上架" : "部分上架"}`,
  };

  const updatedDetail: InboundDetail = {
    ...detail,
    status: allShelved ? "shelved" : detail.status,
    items: updatedItems,
    putawayRecords: [...putawayRecords, ...detail.putawayRecords],
    logs: [log, ...detail.logs],
  };

  details[detailIndex] = updatedDetail;
  saveDetails(details);
  return updatedDetail;
}

export function recordInboundInspectionResults(
  inboundId: string,
  results: Array<{ sku: string; result: "合格" | "不合格"; qty: number; note?: string }>
): InboundDetail | undefined {
  const details = readDetails();
  const detailIndex = details.findIndex((item) => item.id === inboundId);
  if (detailIndex === -1) return undefined;

  const detail = details[detailIndex];
  const now = new Date().toLocaleString("zh-CN");
  const updatedItems = detail.items.map((item) => {
    const result = results.find((entry) => entry.sku === item.sku);
    return result ? { ...item, inspectionStatus: result.result } : item;
  });
  const log: InboundLog = {
    time: now,
    operator: "当前用户",
    action: "质检",
    detail: results.map((item) => `${item.sku} ${item.result} ${item.qty} 件`).join("；"),
  };

  const updatedDetail = { ...detail, items: updatedItems, logs: [log, ...detail.logs] };
  details[detailIndex] = updatedDetail;
  saveDetails(details);
  return updatedDetail;
}

/** 方案二：质检是收货单的子表，不再生成独立质检单。 */
export function listReceiptOrders() {
  return readDetails().flatMap((detail) => detail.receiveRecords.map((record) => ({
    inboundId: detail.id,
    supplier: detail.customer,
    warehouse: "深圳主仓",
    ...record,
  })));
}

export function startReceiptInspection(inboundId: string, receiptNo: string): ReceiveRecord | undefined {
  const details = readDetails();
  const detailIndex = details.findIndex((detail) => detail.id === inboundId);
  if (detailIndex < 0) return undefined;
  const detail = details[detailIndex];
  const recordIndex = detail.receiveRecords.findIndex((record) => record.receiptNo === receiptNo);
  if (recordIndex < 0 || detail.receiveRecords[recordIndex].status !== "待质检") return undefined;
  const record = { ...detail.receiveRecords[recordIndex], status: "质检中" as const };
  const receiveRecords = [...detail.receiveRecords];
  receiveRecords[recordIndex] = record;
  details[detailIndex] = { ...detail, receiveRecords };
  saveDetails(details);
  return record;
}

export function completeReceiptInspection(
  inboundId: string,
  receiptNo: string,
  results: Array<{ sku: string; qualifiedQty: number; defectiveQty: number; reason?: string }>
): { receipt: ReceiveRecord; goodReceipt?: ReceivedContainerSnapshot; defectiveReceipt?: ReceivedContainerSnapshot } | undefined {
  const details = readDetails();
  const detailIndex = details.findIndex((detail) => detail.id === inboundId);
  if (detailIndex < 0) return undefined;
  const detail = details[detailIndex];
  const recordIndex = detail.receiveRecords.findIndex((record) => record.receiptNo === receiptNo);
  if (recordIndex < 0) return undefined;
  const receipt = detail.receiveRecords[recordIndex];
  if (receipt.status !== "待质检" && receipt.status !== "质检中") return undefined;
  if (results.length !== receipt.inspectionItems.length) throw new Error("收货单内每个 SKU 都必须完成质检");

  const inspectionItems = receipt.inspectionItems.map((line) => {
    const result = results.find((item) => item.sku === line.sku);
    if (!result || result.qualifiedQty < 0 || result.defectiveQty < 0 || result.qualifiedQty + result.defectiveQty !== line.qty) {
      throw new Error(`SKU ${line.sku} 的良品数量与次品数量之和必须等于实收数量`);
    }
    return {
      ...line,
      qualifiedQty: result.qualifiedQty,
      defectiveQty: result.defectiveQty,
      conclusion: result.defectiveQty === 0 ? "合格" as const : result.qualifiedQty === 0 ? "不合格" as const : "部分不合格" as const,
      reason: result.reason || "",
    };
  });
  const updatedReceipt = { ...receipt, status: "已完成" as const, inspectionItems };
  const receiveRecords = [...detail.receiveRecords];
  receiveRecords[recordIndex] = updatedReceipt;
  details[detailIndex] = {
    ...detail,
    receiveRecords,
    logs: [{ time: new Date().toLocaleString("zh-CN"), operator: "当前用户", action: "收货单质检", detail: `收货单 ${receiptNo} 质检完成` }, ...detail.logs],
  };
  saveDetails(details);

  const base = {
    inboundId,
    customerName: detail.customer,
    referenceNo: detail.referenceNo,
    receiveBatchNo: receipt.batchNo,
    receiptNo,
    receiveTime: new Date().toLocaleString("zh-CN"),
    stagingLocation: receipt.stagingLocation,
    container: receipt.container,
  };
  const toItems = (kind: "qualifiedQty" | "defectiveQty") => inspectionItems
    .filter((line) => (line[kind] || 0) > 0)
    .map((line) => {
      const item = detail.items.find((target) => target.sku === line.sku)!;
      return { sku: line.sku, productName: item.productName, spec: item.spec, qty: line[kind]!, inspectionRequired: true };
    });
  const goodItems = toItems("qualifiedQty");
  const defectiveItems = toItems("defectiveQty");
  return {
    receipt: updatedReceipt,
    goodReceipt: goodItems.length ? { ...base, items: goodItems, putawayType: "良品上架" } : undefined,
    defectiveReceipt: defectiveItems.length ? { ...base, items: defectiveItems, putawayType: "次品上架" } : undefined,
  };
}

export function completeInboundPutawayFromDetail(
  inboundId: string,
  input?: { locationCode?: string; containerNo?: string; note?: string }
): InboundDetail | undefined {
  const detail = getInboundDetail(inboundId);
  const records = detail.items
    .map((item) => ({
      sku: item.sku,
      productName: item.productName,
      qty: item.inspectionStatus === "不合格" || item.inspectionStatus === "待质检"
        ? 0
        : Math.max(item.receivedQty - item.shelvedQty, 0),
      locationCode: input?.locationCode || "A-01-01-01",
      containerNo: input?.containerNo || "DETAIL-PUTAWAY",
      note: input?.note || "详情页一键上架",
    }))
    .filter((record) => record.qty > 0);

  if (records.length === 0) return detail;
  return applyInboundPutawayCompletion(inboundId, records);
}

export function closeInboundOrder(inboundId: string, reason: string, note: string): InboundDetail | undefined {
  const details = readDetails();
  const detailIndex = details.findIndex((item) => item.id === inboundId);
  if (detailIndex === -1) return undefined;
  const detail = details[detailIndex];
  if (detail.status !== "pending") return undefined;

  const now = new Date().toLocaleString("zh-CN");
  details[detailIndex] = {
    ...detail,
    status: "cancelled",
    logs: [
      {
        time: now,
        operator: "当前用户",
        action: "关闭",
        detail: `关闭原因：${reason}${note ? `，说明：${note}` : ""}`,
      },
      ...details[detailIndex].logs,
    ],
  };
  saveDetails(details);
  return details[detailIndex];
}

export function resetMockInbound(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(seedDetails));
  sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(seedDetails.map(toOrderListItem)));
  sessionStorage.removeItem(SELECTED_INBOUND_KEY);
}
