import {
  getInboundDetail,
  recordInboundInspectionResults,
  type ReceivedContainerSnapshot,
} from "./inbound";

export type InspectionTaskStatus = "待质检" | "质检中" | "已质检" | "待退货处理";
export type InspectionConclusion = "合格" | "不合格";

export interface InspectionTask {
  taskNo: string;
  inboundId: string;
  receiptBatchNo: string;
  containerNo: string;
  sourceLocationCode: string;
  status: InspectionTaskStatus;
  createdAt: string;
  inspector: string | null;
  items: Array<{
    sku: string;
    productName: string;
    spec: string;
    qty: number;
    conclusion: InspectionConclusion | null;
    note: string;
  }>;
}

const STORAGE_KEY = "wms_mock_inspection_tasks";

function readTasks(): InspectionTask[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTasks(tasks: InspectionTask[]) {
  if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function nextTaskNo(tasks: InspectionTask[]) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sequence = tasks.filter((task) => task.taskNo.includes(today)).length + 1;
  return `IQC-${today}-${String(sequence).padStart(4, "0")}`;
}

export function listInspectionTasks(): InspectionTask[] {
  return readTasks();
}

/** 收货后仅为需要质检的容器创建 IQC 任务；免检容器可直接生成上架单。 */
export function createInspectionTaskFromReceipt(receipt: ReceivedContainerSnapshot): InspectionTask | undefined {
  const inspectionItems = receipt.items.filter((item) => item.inspectionRequired);
  if (inspectionItems.length === 0) return undefined;

  const tasks = readTasks();
  const existing = tasks.find(
    (task) => task.inboundId === receipt.inboundId && task.receiptBatchNo === receipt.receiveBatchNo
  );
  if (existing) return existing;

  const task: InspectionTask = {
    taskNo: nextTaskNo(tasks),
    inboundId: receipt.inboundId,
    receiptBatchNo: receipt.receiveBatchNo,
    containerNo: receipt.container.containerNo,
    sourceLocationCode: receipt.stagingLocation.code,
    status: "待质检",
    createdAt: receipt.receiveTime,
    inspector: null,
    items: inspectionItems.map((item) => ({
      sku: item.sku,
      productName: item.productName,
      spec: item.spec,
      qty: item.qty,
      conclusion: null,
      note: "",
    })),
  };
  saveTasks([task, ...tasks]);
  return task;
}

export function startInspectionTask(taskNo: string): InspectionTask | undefined {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.taskNo === taskNo);
  if (index < 0 || tasks[index].status !== "待质检") return undefined;
  const task = { ...tasks[index], status: "质检中" as const, inspector: "当前用户" };
  tasks[index] = task;
  saveTasks(tasks);
  return task;
}

/** 返回合格品收货快照，调用方据此创建上架单；不合格品继续停留在隔离/退货处理状态。 */
export function completeInspectionTask(
  taskNo: string,
  conclusions: Array<{ sku: string; conclusion: InspectionConclusion; note?: string }>
): { task: InspectionTask; qualifiedReceipt?: ReceivedContainerSnapshot } | undefined {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.taskNo === taskNo);
  if (index < 0 || (tasks[index].status !== "待质检" && tasks[index].status !== "质检中")) return undefined;

  const task = tasks[index];
  if (conclusions.length !== task.items.length || conclusions.some((entry) => !task.items.some((item) => item.sku === entry.sku))) {
    throw new Error("请为每个 SKU 提交质检结论");
  }

  const inspectedItems = task.items.map((item) => {
    const conclusion = conclusions.find((entry) => entry.sku === item.sku)!;
    return { ...item, conclusion: conclusion.conclusion, note: conclusion.note || "" };
  });
  const hasRejectedItem = inspectedItems.some((item) => item.conclusion === "不合格");
  const updatedTask: InspectionTask = {
    ...task,
    items: inspectedItems,
    status: hasRejectedItem ? "待退货处理" : "已质检",
    inspector: task.inspector || "当前用户",
  };
  tasks[index] = updatedTask;
  saveTasks(tasks);

  recordInboundInspectionResults(
    task.inboundId,
    inspectedItems.map((item) => ({ sku: item.sku, result: item.conclusion!, qty: item.qty, note: item.note }))
  );

  const detail = getInboundDetail(task.inboundId);
  const qualifiedItems = inspectedItems.filter((item) => item.conclusion === "合格");
  return {
    task: updatedTask,
    qualifiedReceipt: qualifiedItems.length
      ? {
          inboundId: task.inboundId,
          customerName: detail.customer,
          referenceNo: detail.referenceNo,
          receiveBatchNo: task.receiptBatchNo,
          receiveTime: new Date().toLocaleString("zh-CN"),
          stagingLocation: { code: task.sourceLocationCode, name: "质检合格暂存库位", receiptType: "default" },
          container: { containerNo: task.containerNo, containerType: "收货容器" },
          items: qualifiedItems.map((item) => ({
            sku: item.sku,
            productName: item.productName,
            spec: item.spec,
            qty: item.qty,
            inspectionRequired: true,
          })),
        }
      : undefined,
  };
}
