import "../../styles/globals.css";
import { useState } from "react";
import { ArrowLeft, Package, FileText, Printer, UserPlus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { wavePickStatusMap, waveStatusMap, orderStructureStatusMap } from "../configs/wmsStatusMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import {
  completeWavePickingDirectly,
  completeWaveOrder,
  completeWaveSorting,
  getWaveOrder,
  startWavePickingDirectly,
  submitWave,
  startWaveSorting,
  type WaveOrder,
} from "../services/mock";

interface WaveDetailPageProps {
  onNavigate?: (path: string) => void;
  waveId?: string;
}

// 模拟数据
const mockWaveDetail = {
  id: "WAVE-2024-0027",
  waveType: "multi_mixed",
  status: "picking",
  createdTime: "2024-10-15 11:30:00",
  createdBy: "张三",
  waveDate: "2024-10-15",
  note: "紧急波次，优先处理",
  picker: "李四",
  pickStartTime: "2024-10-15 13:00:00",
  pickEndTime: "",
  pickDuration: "2小时15分钟",
  orderCount: 5,
  skuCount: 12,
  totalQty: 85,
  pickedQty: 60,
  pendingQty: 25,

  outboundOrders: [
    {
      id: "OB001041503480",
      customer: "Amazon-EU",
      orderNo: "AMZ-EU-2024-034512",
      skuCount: 5,
      totalQty: 25,
      orderType: "multi_mixed",
      pickStatus: "picked",
      pickedQty: 25,
      carrier: "DHL",
      shippingMethod: "标准快递",
      createdAt: "2024-10-15 11:30",
    },
    {
      id: "OB001041503481",
      customer: "Shopify-EU",
      orderNo: "SPF-EU-2024-022145",
      skuCount: 3,
      totalQty: 30,
      orderType: "multi_mixed",
      pickStatus: "picked",
      pickedQty: 30,
      carrier: "UPS",
      shippingMethod: "快速配送",
      createdAt: "2024-10-15 11:35",
    },
    {
      id: "OB001041503482",
      customer: "eBay-UK",
      orderNo: "EBAY-UK-2024-076543",
      skuCount: 2,
      totalQty: 15,
      orderType: "single_multi",
      pickStatus: "picking",
      pickedQty: 5,
      carrier: "Royal Mail",
      shippingMethod: "标准配送",
      createdAt: "2024-10-15 11:40",
    },
    {
      id: "OB001041503483",
      customer: "Amazon-US",
      orderNo: "AMZ-US-2024-098321",
      skuCount: 1,
      totalQty: 10,
      orderType: "single_multi",
      pickStatus: "pending",
      pickedQty: 0,
      carrier: "FedEx",
      shippingMethod: "加急快递",
      createdAt: "2024-10-15 11:42",
    },
    {
      id: "OB001041503484",
      customer: "Walmart-US",
      orderNo: "WMT-US-2024-054321",
      skuCount: 1,
      totalQty: 5,
      orderType: "single_single",
      pickStatus: "pending",
      pickedQty: 0,
      carrier: "USPS",
      shippingMethod: "标准配送",
      createdAt: "2024-10-15 11:45",
    },
  ],

  skuSummary: [
    {
      sku: "SKU-101",
      productName: "无线蓝牙耳机",
      barcode: "6901234567890",
      spec: "黑色/标准版",
      plannedQty: 20,
      pickedQty: 20,
      pendingQty: 0,
      locations: ["A-01-02-03", "A-01-02-05"],
      status: "picked",
    },
    {
      sku: "SKU-102",
      productName: "智能手环",
      barcode: "6901234567891",
      spec: "运动版/蓝色",
      plannedQty: 15,
      pickedQty: 15,
      pendingQty: 0,
      locations: ["A-01-02-04"],
      status: "picked",
    },
    {
      sku: "SKU-103",
      productName: "充电宝",
      barcode: "6901234567892",
      spec: "20000mAh",
      plannedQty: 18,
      pickedQty: 18,
      pendingQty: 0,
      locations: ["B-02-01-05", "B-02-01-06"],
      status: "picked",
    },
    {
      sku: "SKU-104",
      productName: "手机支架",
      barcode: "6901234567893",
      spec: "通用型",
      plannedQty: 12,
      pickedQty: 7,
      pendingQty: 5,
      locations: ["B-02-01-08"],
      status: "picking",
    },
    {
      sku: "SKU-105",
      productName: "数据线",
      barcode: "6901234567894",
      spec: "Type-C/1米",
      plannedQty: 10,
      pickedQty: 0,
      pendingQty: 10,
      locations: ["B-02-02-01"],
      status: "pending",
    },
    {
      sku: "SKU-106",
      productName: "车载充电器",
      barcode: "6901234567895",
      spec: "双USB/快充",
      plannedQty: 5,
      pickedQty: 0,
      pendingQty: 5,
      locations: ["B-02-02-03"],
      status: "pending",
    },
    {
      sku: "SKU-107",
      productName: "屏幕清洁套装",
      barcode: "6901234567896",
      spec: "喷雾+擦布",
      plannedQty: 5,
      pickedQty: 0,
      pendingQty: 5,
      locations: ["C-03-01-02"],
      status: "pending",
    },
  ],

  pickingRecords: [
    {
      batchNo: "WAVE-PICK-20241015-001",
      picker: "李四",
      pickTime: "2024-10-15 13:20:00",
      container: { containerNo: "CART-001", containerType: "拣货车" },
      totalQty: 35,
      items: [
        {
          outboundNo: "OB001041503480",
          sku: "SKU-101",
          productName: "无线蓝牙耳机",
          plannedQty: 15,
          pickedQty: 15,
          shortQty: 0,
          sourceLocations: ["A-01-02-03"],
        },
        {
          outboundNo: "OB001041503480",
          sku: "SKU-102",
          productName: "智能手环",
          plannedQty: 10,
          pickedQty: 10,
          shortQty: 0,
          sourceLocations: ["A-01-02-04"],
        },
        {
          outboundNo: "OB001041503481",
          sku: "SKU-101",
          productName: "无线蓝牙耳机",
          plannedQty: 5,
          pickedQty: 5,
          shortQty: 0,
          sourceLocations: ["A-01-02-05"],
        },
        {
          outboundNo: "OB001041503481",
          sku: "SKU-102",
          productName: "智能手环",
          plannedQty: 5,
          pickedQty: 5,
          shortQty: 0,
          sourceLocations: ["A-01-02-04"],
        },
      ],
      note: "第一批拣货完成",
    },
    {
      batchNo: "WAVE-PICK-20241015-002",
      picker: "李四",
      pickTime: "2024-10-15 14:30:00",
      container: { containerNo: "CART-001", containerType: "拣货车" },
      totalQty: 25,
      items: [
        {
          outboundNo: "OB001041503481",
          sku: "SKU-103",
          productName: "充电宝",
          plannedQty: 18,
          pickedQty: 18,
          shortQty: 0,
          sourceLocations: ["B-02-01-05", "B-02-01-06"],
        },
        {
          outboundNo: "OB001041503482",
          sku: "SKU-104",
          productName: "手机支架",
          plannedQty: 7,
          pickedQty: 7,
          shortQty: 0,
          sourceLocations: ["B-02-01-08"],
        },
      ],
      note: "",
    },
  ],

  allocationRecords: [
    {
      outboundNo: "OB001041503480",
      sku: "SKU-101",
      productName: "无线蓝牙耳机",
      qty: 15,
      sourceLocation: "A-01-02-03",
      locationType: "存储区",
      batchCode: "BATCH-2024-001",
      allocatedTime: "2024-10-15 11:30:00",
      allocatedStrategy: "FIFO",
    },
    {
      outboundNo: "OB001041503480",
      sku: "SKU-102",
      productName: "智能手环",
      qty: 10,
      sourceLocation: "A-01-02-04",
      locationType: "存储区",
      batchCode: "BATCH-2024-002",
      allocatedTime: "2024-10-15 11:30:00",
      allocatedStrategy: "FIFO",
    },
    {
      outboundNo: "OB001041503481",
      sku: "SKU-101",
      productName: "无线蓝牙耳机",
      qty: 5,
      sourceLocation: "A-01-02-05",
      locationType: "拣货区",
      batchCode: "BATCH-2024-001",
      allocatedTime: "2024-10-15 11:35:00",
      allocatedStrategy: "就近原则",
    },
    {
      outboundNo: "OB001041503481",
      sku: "SKU-102",
      productName: "智能手环",
      qty: 5,
      sourceLocation: "A-01-02-04",
      locationType: "存储区",
      batchCode: "BATCH-2024-002",
      allocatedTime: "2024-10-15 11:35:00",
      allocatedStrategy: "FIFO",
    },
    {
      outboundNo: "OB001041503481",
      sku: "SKU-103",
      productName: "充电宝",
      qty: 18,
      sourceLocation: "B-02-01-05,B-02-01-06",
      locationType: "存储区",
      batchCode: "BATCH-2024-003",
      allocatedTime: "2024-10-15 11:35:00",
      allocatedStrategy: "FIFO",
    },
  ],

  logs: [
    {
      time: "2024-10-15 14:30:00",
      operator: "李四",
      action: "拣货",
      detail: "完成拣货批次 WAVE-PICK-20241015-002，拣货数量 25 件",
    },
    {
      time: "2024-10-15 13:20:00",
      operator: "李四",
      action: "拣货",
      detail: "完成拣货批次 WAVE-PICK-20241015-001，拣货数量 35 件",
    },
    {
      time: "2024-10-15 13:00:00",
      operator: "李四",
      action: "开始拣货",
      detail: "开始执行波次拣货任务",
    },
    {
      time: "2024-10-15 12:30:00",
      operator: "张三",
      action: "指定拣货员",
      detail: "指定拣货员：李四",
    },
    {
      time: "2024-10-15 11:30:00",
      operator: "系统",
      action: "创建波次",
      detail: "创建波次，包含 5 个订单，系统自动分配库存",
    },
  ],
};

function mergeWaveDetail(wave?: WaveOrder) {
  if (!wave) return mockWaveDetail;

  return {
    ...mockWaveDetail,
    id: wave.id,
    waveType: wave.waveType,
    status: wave.status,
    createdTime: wave.createdAt,
    createdBy: wave.createdBy,
    picker: wave.picker || "-",
    orderCount: wave.orderCount,
    skuCount: wave.skuCount,
    totalQty: wave.totalQty,
    pickedQty: wave.pickedQty,
    pendingQty: Math.max(wave.totalQty - wave.pickedQty, 0),
  };
}

export default function WaveDetailPage({ onNavigate, waveId }: WaveDetailPageProps) {
  const [waveOrder, setWaveOrder] = useState(() => getWaveOrder(waveId));
  const [detail, setDetail] = useState(() => mergeWaveDetail(getWaveOrder(waveId)));

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const syncWaveDetail = (wave?: WaveOrder) => {
    if (!wave) return;
    setWaveOrder(wave);
    setDetail(mergeWaveDetail(wave));
  };

  const pickProgress = detail.totalQty > 0 ? (detail.pickedQty / detail.totalQty) * 100 : 0;
  const orderProgress = detail.outboundOrders.filter((o) => o.pickStatus === "picked").length;

  const canAssignPicker = detail.status === "created";
  const canStartPicking = detail.status === "assigned";
  const canCompletePicking = detail.status === "picking";
  const canStartSorting = detail.status === "picked" && waveOrder?.sortingMode !== "none";
  const canCompleteSorting = detail.status === "sorting";
  const canCompleteWave = detail.status === "sorted" || (detail.status === "picked" && waveOrder?.sortingMode === "none");

  const handleAssignPicker = () => {
    const wave = submitWave(detail.id);
    syncWaveDetail(wave);
    toast.success(wave ? `波次 ${detail.id} 已提交，可开始拣货` : "当前波次不能提交");
  };

  const handleStartPicking = () => {
    const wave = startWavePickingDirectly(detail.id);
    syncWaveDetail(wave);
    toast.success(`波次 ${detail.id} 已开始拣货`);
  };

  const handleCompletePicking = () => {
    const wave = completeWavePickingDirectly(detail.id);
    syncWaveDetail(wave);
    toast.success(`波次 ${detail.id} 已完成拣货，出库单已进入${wave?.sortingMode === "none" ? "待复核" : "待分拣"}`);
  };

  const handleStartSorting = () => {
    const wave = startWaveSorting(detail.id);
    syncWaveDetail(wave);
    toast.success(`波次 ${detail.id} 已开始分拣`);
  };

  const handleCompleteSorting = () => {
    const wave = completeWaveSorting(detail.id);
    syncWaveDetail(wave);
    toast.success(`波次 ${detail.id} 已完成分拣，出库单已进入待复核`);
  };

  const handleCompleteWave = () => {
    const wave = completeWaveOrder(detail.id);
    syncWaveDetail(wave);
    toast.success(`波次 ${detail.id} 已完成`);
  };

  return (
    <WMSLayout title="波次详情" currentPath="/wave/management" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => handleNavigate("/wave/management")}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">{detail.id}</h1>
              <StatusBadge {...(waveStatusMap[detail.status] ?? waveStatusMap.pending)} />
            </div>
          </div>
          <div className="flex gap-2">
            {canAssignPicker && (
              <Button onClick={handleAssignPicker}>
                <UserPlus className="w-4 h-4" />
                指定拣货员
              </Button>
            )}
            {canStartPicking && (
              <Button onClick={handleStartPicking}>
                <Package className="w-4 h-4" />
                开始拣货
              </Button>
            )}
            {canCompletePicking && (
              <Button onClick={handleCompletePicking}>
                <CheckCircle2 className="w-4 h-4" />
                完成拣货
              </Button>
            )}
            {canStartSorting && (
              <Button variant="outline" onClick={handleStartSorting}>
                <Package className="w-4 h-4" />
                开始分拣
              </Button>
            )}
            {canCompleteSorting && (
              <Button onClick={handleCompleteSorting}>
                <CheckCircle2 className="w-4 h-4" />
                完成分拣
              </Button>
            )}
            {canCompleteWave && (
              <Button onClick={handleCompleteWave}>
                <CheckCircle2 className="w-4 h-4" />
                完成波次
              </Button>
            )}
            <Button variant="outline">
              <Printer className="w-4 h-4" />
              打印拣货单
            </Button>
          </div>
        </div>

        {/* 基础信息和进度 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 基础信息 */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 波次基本信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">波次基本信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">波次号</div>
                        <div className="font-mono">{detail.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">波次类型</div>
                        <div><StatusBadge {...orderStructureStatusMap[detail.waveType]} /></div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                        <div>{detail.createdTime}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">创建人</div>
                        <div>{detail.createdBy}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">波次日期</div>
                        <div>{detail.waveDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">波次备注</div>
                        <div className="text-sm">{detail.note}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 拣货信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">拣货信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">拣货员</div>
                        <div>{detail.picker}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">拣货开始时间</div>
                        <div>{detail.pickStartTime || "-"}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">拣货完成时间</div>
                        <div>{detail.pickEndTime || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">拣货用时</div>
                        <div>{detail.status !== "pending" ? detail.pickDuration : "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">统计信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">订单总数</div>
                        <div>{detail.orderCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">SKU种类数</div>
                        <div>{detail.skuCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">商品总数</div>
                        <div>{detail.totalQty} 件</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">已拣货数</div>
                        <div className="text-success-600">{detail.pickedQty} 件</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">待拣货数</div>
                        <div>{detail.pendingQty} 件</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 拣货进度 */}
          <Card>
            <CardHeader>
              <CardTitle>拣货进度</CardTitle>
              <CardDescription>当前完成情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">拣货进度</span>
                  <span className="font-mono">{pickProgress.toFixed(1)}%</span>
                </div>
                <Progress value={pickProgress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">订单进度</span>
                  <span className="font-mono">
                    {orderProgress} / {detail.orderCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">商品进度</span>
                  <span className="font-mono">
                    <span className="text-success-600">{detail.pickedQty}</span> / {detail.totalQty}
                  </span>
                </div>
              </div>
              {detail.status === "picking" && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm text-muted-foreground mb-2">时效统计</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">已用时间</span>
                        <span className="text-sm">{detail.pickDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">平均拣货速度</span>
                        <span className="text-sm">27 件/小时</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">预计剩余时间</span>
                        <span className="text-sm text-warning-600">55 分钟</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tab区域 */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders" className="group gap-1">
              出库单明细
              <StatusTabCount count={detail.outboundOrders.length} />
            </TabsTrigger>
            <TabsTrigger value="skus" className="group gap-1">
              商品汇总
              <StatusTabCount count={detail.skuSummary.length} />
            </TabsTrigger>
            <TabsTrigger value="picking" className="group gap-1">
              拣货记录
              <StatusTabCount count={detail.pickingRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="allocation" className="group gap-1">
              库存分配明细
              <StatusTabCount count={detail.allocationRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="logs" className="group gap-1">
              操作日志
              <StatusTabCount count={detail.logs.length} />
            </TabsTrigger>
          </TabsList>

          {/* 出库单明细 */}
          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>序号</TableHead>
                        <TableHead>出库单号</TableHead>
                        <TableHead>客户名称</TableHead>
                        <TableHead>订单号</TableHead>
                        <TableHead className="text-center">SKU数量</TableHead>
                        <TableHead className="text-center">商品总数</TableHead>
                        <TableHead>订单类型</TableHead>
                        <TableHead>拣货状态</TableHead>
                        <TableHead className="text-center">已拣货数/总数</TableHead>
                        <TableHead>承运商</TableHead>
                        <TableHead>物流渠道</TableHead>
                        <TableHead>创建时间</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.outboundOrders.map((order, index) => {
                        return (
                          <TableRow key={order.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <a
                                href="#"
                                className="font-mono text-primary hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigate("/outbound/detail");
                                }}
                              >
                                {order.id}
                              </a>
                            </TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                            <TableCell className="text-center">{order.skuCount}</TableCell>
                            <TableCell className="text-center">{order.totalQty}</TableCell>
                            <TableCell><StatusBadge {...orderStructureStatusMap[order.orderType]} /></TableCell>
                            <TableCell>
                              <StatusBadge {...wavePickStatusMap[order.pickStatus]} />
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={order.pickedQty > 0 ? "text-success-600" : ""}>
                                {order.pickedQty}
                              </span>
                              <span className="text-muted-foreground"> / {order.totalQty}</span>
                            </TableCell>
                            <TableCell>{order.carrier}</TableCell>
                            <TableCell className="text-sm">{order.shippingMethod}</TableCell>
                            <TableCell className="text-sm">{order.createdAt}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品汇总 */}
          <TabsContent value="skus">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>条形码</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">计划拣货数量</TableHead>
                        <TableHead className="text-right">已拣货数量</TableHead>
                        <TableHead className="text-right">待拣货数量</TableHead>
                        <TableHead>分配库位</TableHead>
                        <TableHead>状态</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.skuSummary.map((item) => {
                        return (
                          <TableRow key={item.sku}>
                            <TableCell>
                              <code className="text-xs font-mono text-primary">{item.sku}</code>
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <code className="text-xs font-mono text-muted-foreground">
                                {item.barcode}
                              </code>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.spec}
                            </TableCell>
                            <TableCell className="text-right">{item.plannedQty}</TableCell>
                            <TableCell className="text-right text-success-600">
                              {item.pickedQty}
                            </TableCell>
                            <TableCell className="text-right">{item.pendingQty}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {item.locations.map((loc, idx) => (
                                  <Badge key={idx} variant="outline">
                                    {loc}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge {...wavePickStatusMap[item.status]} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 拣货记录 */}
          <TabsContent value="picking">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {detail.pickingRecords.length > 0 ? (
                    detail.pickingRecords.map((record, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-mono">{record.batchNo}</div>
                              <div className="text-sm text-muted-foreground">
                                {record.pickTime} · {record.picker}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">共 {record.totalQty} 件</Badge>
                        </div>

                        <div className="space-y-2 pl-13">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">拣货容器：</span>
                            <Badge variant="outline" className="gap-1">
                              <Package className="w-3 h-3" />
                              {record.container.containerNo} ({record.container.containerType})
                            </Badge>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <DataTableHeaderRow>
                                  <TableHead>出库单号</TableHead>
                                  <TableHead>SKU</TableHead>
                                  <TableHead>商品名称</TableHead>
                                  <TableHead className="text-right">计划拣货</TableHead>
                                  <TableHead className="text-right">实际拣货</TableHead>
                                  <TableHead className="text-right">缺货数量</TableHead>
                                  <TableHead>源库位</TableHead>
                                </DataTableHeaderRow>
                              </TableHeader>
                              <TableBody>
                                {record.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <code className="text-xs font-mono text-muted-foreground">
                                        {item.outboundNo}
                                      </code>
                                    </TableCell>
                                    <TableCell>
                                      <code className="text-xs font-mono text-primary">
                                        {item.sku}
                                      </code>
                                    </TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell className="text-right">{item.plannedQty}</TableCell>
                                    <TableCell className="text-right text-success-600">
                                      {item.pickedQty}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {item.shortQty > 0 ? (
                                        <span className="text-error">{item.shortQty}</span>
                                      ) : (
                                        <span className="text-muted-foreground">0</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        {item.sourceLocations.map((loc, locIdx) => (
                                          <Badge key={locIdx} variant="outline">
                                            {loc}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {record.note && (
                            <div className="text-sm text-muted-foreground">备注：{record.note}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">暂无拣货记录</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 库存分配明细 */}
          <TabsContent value="allocation">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>出库单号</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead className="text-right">分配数量</TableHead>
                        <TableHead>源库位</TableHead>
                        <TableHead>库位类型</TableHead>
                        <TableHead>批次号/序列号</TableHead>
                        <TableHead>分配时间</TableHead>
                        <TableHead>分配策略</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.allocationRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <code className="text-xs font-mono text-muted-foreground">
                              {record.outboundNo}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs font-mono text-primary">{record.sku}</code>
                          </TableCell>
                          <TableCell>{record.productName}</TableCell>
                          <TableCell className="text-right">{record.qty}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.sourceLocation}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{record.locationType}</Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs font-mono text-muted-foreground">
                              {record.batchCode}
                            </code>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {record.allocatedTime}
                          </TableCell>
                          <TableCell className="text-sm">{record.allocatedStrategy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 操作日志 */}
          <TabsContent value="logs">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {detail.logs.map((log, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        {index < detail.logs.length - 1 && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="secondary">{log.action}</Badge>
                          <span>{log.operator}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">{log.detail}</div>
                        <div className="text-xs text-muted-foreground">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WMSLayout>
  );
}
