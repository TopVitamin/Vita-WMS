import "../../styles/globals.css";
import { useState } from "react";
import { ArrowLeft, Package, FileText, Clock, AlertCircle, CheckCircle2, Printer, Truck, Box } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { outboundItemProgressStatusMap, outboundOrderStatusMap, outboundTypeStatusMap, orderStructureStatusMap } from "../configs/wmsStatusMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";

interface OutboundDetailPageProps {
  onNavigate?: (path: string) => void;
  outboundId?: string;
}

// 模拟数据
const mockOutboundDetail = {
  id: "OB001041503480",
  waveNo: "WAVE-2024-0027",
  outboundType: "sales",
  orderType: "multi_mixed",
  platformOrderNo: "AMZ-EU-2024-034512",
  customer: "Amazon-EU",
  status: "picking",
  createdTime: "2024-10-15 11:30:00",
  createdBy: "张三",
  planShipDate: "2024-10-27",
  actualShipTime: "",
  carrier: "DHL",
  shippingService: "标准快递",
  trackingNo: "",
  note: "紧急订单，优先处理",
  packingRequirement: "需要气泡膜包装",
  labelRequirement: "需打印Amazon FBA标签",
  
  // 收货地址
  shippingAddress: {
    recipient: "Amazon FBA Warehouse",
    phone: "+49-123-456-7890",
    address: "Amazon Logistik Center, Rheinberg Strasse 1, 47495 Rheinberg, Germany",
  },

  items: [
    {
      sku: "SKU-101",
      productName: "无线蓝牙耳机",
      barcode: "6901234567890",
      spec: "黑色/标准版",
      plannedQty: 10,
      allocatedQty: 10,
      pickedQty: 10,
      shippedQty: 10,
    },
    {
      sku: "SKU-102",
      productName: "智能手环",
      barcode: "6901234567891",
      spec: "运动版/蓝色",
      plannedQty: 8,
      allocatedQty: 8,
      pickedQty: 8,
      shippedQty: 8,
    },
    {
      sku: "SKU-103",
      productName: "充电宝",
      barcode: "6901234567892",
      spec: "20000mAh",
      plannedQty: 3,
      allocatedQty: 3,
      pickedQty: 0,
      shippedQty: 0,
    },
    {
      sku: "SKU-104",
      productName: "手机支架",
      barcode: "6901234567893",
      spec: "通用型",
      plannedQty: 2,
      allocatedQty: 2,
      pickedQty: 0,
      shippedQty: 0,
    },
    {
      sku: "SKU-105",
      productName: "数据线",
      barcode: "6901234567894",
      spec: "Type-C/1米",
      plannedQty: 2,
      allocatedQty: 2,
      pickedQty: 0,
      shippedQty: 0,
    },
  ],

  allocationRecords: [
    {
      batchNo: "ALLOC-20241015-001",
      sku: "SKU-101",
      productName: "无线蓝牙耳机",
      qty: 10,
      sourceLocation: "A-01-02-03",
      locationType: "存储区",
      batchCode: "BATCH-2024-001",
      allocatedTime: "2024-10-15 11:45:00",
      allocatedBy: "系统自动分配",
    },
    {
      batchNo: "ALLOC-20241015-002",
      sku: "SKU-102",
      productName: "智能手环",
      qty: 8,
      sourceLocation: "A-01-02-04",
      locationType: "存储区",
      batchCode: "BATCH-2024-002",
      allocatedTime: "2024-10-15 11:45:00",
      allocatedBy: "系统自动分配",
    },
    {
      batchNo: "ALLOC-20241015-003",
      sku: "SKU-103",
      productName: "充电宝",
      qty: 3,
      sourceLocation: "B-02-01-05",
      locationType: "拣货区",
      batchCode: "-",
      allocatedTime: "2024-10-15 11:45:00",
      allocatedBy: "系统自动分配",
    },
    {
      batchNo: "ALLOC-20241015-004",
      sku: "SKU-104",
      productName: "手机支架",
      qty: 2,
      sourceLocation: "B-02-01-08",
      locationType: "拣货区",
      batchCode: "-",
      allocatedTime: "2024-10-15 11:45:00",
      allocatedBy: "系统自动分配",
    },
    {
      batchNo: "ALLOC-20241015-005",
      sku: "SKU-105",
      productName: "数据线",
      qty: 2,
      sourceLocation: "B-02-02-01",
      locationType: "拣货区",
      batchCode: "-",
      allocatedTime: "2024-10-15 11:45:00",
      allocatedBy: "系统自动分配",
    },
  ],

  pickingRecords: [
    {
      batchNo: "PICK-20241015-001",
      picker: "李四",
      pickTime: "2024-10-15 13:20:00",
      container: { containerNo: "CART-001", containerType: "拣货车" },
      totalQty: 18,
      items: [
        {
          sku: "SKU-101",
          productName: "无线蓝牙耳机",
          plannedQty: 10,
          pickedQty: 10,
          shortQty: 0,
          sourceLocations: ["A-01-02-03"],
        },
        {
          sku: "SKU-102",
          productName: "智能手环",
          plannedQty: 8,
          pickedQty: 8,
          shortQty: 0,
          sourceLocations: ["A-01-02-04"],
        },
      ],
      note: "第一批拣货完成",
    },
  ],

  packingRecords: [
    {
      boxNo: "BOX-001",
      boxType: "标准箱 (40×30×30 cm)",
      packer: "王五",
      packTime: "2024-10-15 14:10:00",
      weight: 3.2,
      volumeWeight: 3.6,
      items: [
        { sku: "SKU-101", productName: "无线蓝牙耳机", qty: 10 },
        { sku: "SKU-102", productName: "智能手环", qty: 8 },
      ],
    },
  ],

  logs: [
    {
      time: "2024-10-15 14:10:00",
      operator: "王五",
      action: "装箱",
      detail: "完成装箱 BOX-001，共18件商品",
    },
    {
      time: "2024-10-15 13:20:00",
      operator: "李四",
      action: "拣货",
      detail: "完成拣货批次 PICK-20241015-001，拣货数量 18 件",
    },
    {
      time: "2024-10-15 11:45:00",
      operator: "系统",
      action: "库存分配",
      detail: "完成库存分配，共分配 25 件",
    },
    {
      time: "2024-10-15 11:35:00",
      operator: "张三",
      action: "分波",
      detail: "加入波次 WAVE-2024-0027",
    },
    {
      time: "2024-10-15 11:30:00",
      operator: "张三",
      action: "创建",
      detail: "创建出库单，计划出库 25 件",
    },
  ],
};

export default function OutboundDetailPage({ onNavigate, outboundId }: OutboundDetailPageProps) {
  const [detail, setDetail] = useState(mockOutboundDetail);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };


  const totalPlanned = detail.items.reduce((sum, item) => sum + item.plannedQty, 0);
  const totalAllocated = detail.items.reduce((sum, item) => sum + item.allocatedQty, 0);
  const totalPicked = detail.items.reduce((sum, item) => sum + item.pickedQty, 0);
  const totalShipped = detail.items.reduce((sum, item) => sum + item.shippedQty, 0);
  const pickProgress = totalPlanned > 0 ? (totalPicked / totalPlanned) * 100 : 0;

  const canCancel = detail.status !== "cancelled" && detail.status !== "completed" && detail.status !== "shipped";

  const handleCancelOrder = () => {
    const newLog = {
      time: new Date().toLocaleString("zh-CN"),
      operator: "当前用户",
      action: "取消",
      detail: "取消出库单",
    };

    setDetail({
      ...detail,
      status: "cancelled",
      logs: [newLog, ...detail.logs],
    });

    toast.success("出库单已取消");
  };

  // 计算剩余时间
  const getTimeRemaining = () => {
    if (!detail.planShipDate || detail.status === "shipped" || detail.status === "completed") {
      return null;
    }
    return "2小时30分钟"; // 模拟数据
  };

  return (
    <WMSLayout title="出库单详情" currentPath="/outbound/management" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Button variant="outline" onClick={() => handleNavigate("/outbound/management")}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">{detail.id}</h1>
              <StatusBadge {...outboundOrderStatusMap[detail.status]} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4" />
              打印出库单
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4" />
              打印拣货单
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4" />
              打印装箱单
            </Button>
            {canCancel && (
              <Button variant="outline" onClick={handleCancelOrder}>
                取消出库单
              </Button>
            )}
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
                {/* 订单信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">订单信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">出库单号</div>
                        <div className="font-mono">{detail.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">波次号</div>
                        <div>
                          {detail.waveNo !== "-" ? (
                            <a href="#" className="font-mono text-primary hover:underline">
                              {detail.waveNo}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">出库类型</div>
                        <div><StatusBadge {...outboundTypeStatusMap[detail.outboundType]} /></div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">订单类型</div>
                        <div><StatusBadge {...orderStructureStatusMap[detail.orderType]} /></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">关联订单号</div>
                        <div className="font-mono text-sm">{detail.platformOrderNo}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">客户名称</div>
                        <div>{detail.customer}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                        <div>{detail.createdTime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">创建人</div>
                        <div>{detail.createdBy}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 发货信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">发货信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">计划发货日期</div>
                        <div>{detail.planShipDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">实际发货时间</div>
                        <div>{detail.actualShipTime || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">承运商</div>
                        <div>{detail.carrier}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">物流服务</div>
                        <div>{detail.shippingService}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">追踪号</div>
                        <div className="font-mono text-sm">{detail.trackingNo || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">发货地址</div>
                        <div className="text-sm space-y-1">
                          <div>{detail.shippingAddress.recipient}</div>
                          <div className="text-muted-foreground">{detail.shippingAddress.phone}</div>
                          <div className="text-muted-foreground">{detail.shippingAddress.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 其他信息 */}
                <div>
                  <h3 className="mb-3 text-muted-foreground">其他信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">单据备注</div>
                        <div className="text-sm">{detail.note}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">装箱要求</div>
                        <div className="text-sm">{detail.packingRequirement}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">标签要求</div>
                        <div className="text-sm">{detail.labelRequirement}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 出库进度 */}
          <Card>
            <CardHeader>
              <CardTitle>出库进度</CardTitle>
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
                  <span className="text-sm text-muted-foreground">计划出库总数</span>
                  <span className="font-mono">{totalPlanned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已分配数量</span>
                  <span className="font-mono text-primary">{totalAllocated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已拣货数量</span>
                  <span className="font-mono text-success-600">{totalPicked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">待拣货数量</span>
                  <span className="font-mono">{totalPlanned - totalPicked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已发货数量</span>
                  <span className="font-mono">{totalShipped}</span>
                </div>
              </div>
              {getTimeRemaining() && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm text-muted-foreground mb-2">时效统计</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">计划发货时间</span>
                        <span className="text-sm">{detail.planShipDate} 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">剩余处理时间</span>
                        <span className="text-sm text-warning-600">{getTimeRemaining()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tab区域 */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items" className="group gap-1">
              商品明细
              <StatusTabCount count={detail.items.length} />
            </TabsTrigger>
            <TabsTrigger value="allocation" className="group gap-1">
              分配记录
              <StatusTabCount count={detail.allocationRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="picking" className="group gap-1">
              拣货记录
              <StatusTabCount count={detail.pickingRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="packing" className="group gap-1">
              装箱记录
              <StatusTabCount count={detail.packingRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="logs" className="group gap-1">
              操作日志
              <StatusTabCount count={detail.logs.length} />
            </TabsTrigger>
          </TabsList>

          {/* 商品明细 */}
          <TabsContent value="items">
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
                        <TableHead className="text-right">计划数量</TableHead>
                        <TableHead className="text-right">已分配</TableHead>
                        <TableHead className="text-right">已拣货</TableHead>
                        <TableHead className="text-right">待拣货</TableHead>
                        <TableHead className="text-right">已发货</TableHead>
                        <TableHead>状态</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.items.map((item) => {
                        const remaining = item.plannedQty - item.pickedQty;
                        const pickProgress =
                          item.plannedQty > 0 ? (item.pickedQty / item.plannedQty) * 100 : 0;

                        const statusKey =
                          item.shippedQty >= item.plannedQty
                            ? "shipped"
                            : pickProgress === 100
                            ? "picked"
                            : pickProgress > 0
                            ? "picking"
                            : item.allocatedQty > 0
                            ? "allocated"
                            : "pending";

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
                            <TableCell className="text-right">{item.allocatedQty}</TableCell>
                            <TableCell className="text-right text-success-600">
                              {item.pickedQty}
                            </TableCell>
                            <TableCell className="text-right">{remaining}</TableCell>
                            <TableCell className="text-right">{item.shippedQty}</TableCell>
                            <TableCell>
                              <StatusBadge {...outboundItemProgressStatusMap[statusKey]} />
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

          {/* 分配记录 */}
          <TabsContent value="allocation">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>分配批次号</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead className="text-right">分配数量</TableHead>
                        <TableHead>源库位</TableHead>
                        <TableHead>库位类型</TableHead>
                        <TableHead>批次号/序列号</TableHead>
                        <TableHead>分配时间</TableHead>
                        <TableHead>分配人</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.allocationRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <code className="text-xs font-mono text-muted-foreground">
                              {record.batchNo}
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
                          <TableCell>{record.allocatedBy}</TableCell>
                        </TableRow>
                      ))}
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
                              <Box className="w-3 h-3" />
                              {record.container.containerNo} ({record.container.containerType})
                            </Badge>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <DataTableHeaderRow>
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

          {/* 装箱记录 */}
          <TabsContent value="packing">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {detail.packingRecords.length > 0 ? (
                    detail.packingRecords.map((record, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Box className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-mono">{record.boxNo}</div>
                              <div className="text-sm text-muted-foreground">
                                {record.packTime} · {record.packer}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{record.boxType}</Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              重量: {record.weight} kg · 体积重: {record.volumeWeight} kg
                            </div>
                          </div>
                        </div>

                        <div className="pl-13">
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <DataTableHeaderRow>
                                  <TableHead>SKU</TableHead>
                                  <TableHead>商品名称</TableHead>
                                  <TableHead className="text-right">数量</TableHead>
                                </DataTableHeaderRow>
                              </TableHeader>
                              <TableBody>
                                {record.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <code className="text-xs font-mono text-primary">
                                        {item.sku}
                                      </code>
                                    </TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell className="text-right">{item.qty}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">暂无装箱记录</div>
                  )}
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
