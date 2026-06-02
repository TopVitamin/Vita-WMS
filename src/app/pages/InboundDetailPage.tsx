import "../../styles/globals.css";
import { useState } from "react";
import { ArrowLeft, Package, FileText, Clock, AlertCircle, CheckCircle2, Printer } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { ReceiveDialog } from "../components/wms/ReceiveDialog";
import { CloseInboundDialog } from "../components/wms/CloseInboundDialog";
import { toast } from "sonner";

interface InboundDetailPageProps {
  onNavigate?: (path: string) => void;
  inboundId?: string;
}

// 模拟数据
const mockInboundDetail = {
  id: "IB001042102963",
  referenceNo: "REF-2024-1028",
  customer: "ab00-HK买汇",
  status: "receiving",
  createdTime: "2024-10-28 09:30:00",
  createdBy: "张三",
  estimatedDate: "2024-10-30",
  actualArrivalDate: "2024-10-28 14:20:00",
  deliveryMethod: "送货 (顺丰)",
  tracking: "SF1234567890",
  note: "紧急入库，优先处理",
  
  items: [
    {
      sku: "SKU-001",
      productName: "无线蓝牙耳机",
      barcode: "6901234567890",
      spec: "黑色/标准版",
      plannedQty: 100,
      receivedQty: 60,
      shelvedQty: 40,
    },
    {
      sku: "SKU-002",
      productName: "智能手环",
      barcode: "6901234567891",
      spec: "运动版/蓝色",
      plannedQty: 50,
      receivedQty: 30,
      shelvedQty: 20,
    },
    {
      sku: "SKU-003",
      productName: "充电宝",
      barcode: "6901234567892",
      spec: "20000mAh",
      plannedQty: 80,
      receivedQty: 0,
      shelvedQty: 0,
    },
  ],

  receiveRecords: [
    {
      batchNo: "RCV-20241028-001",
      container: { containerNo: "PLT-001", containerType: "托盘" },
      items: [
        { sku: "SKU-001", productName: "无线蓝牙耳机", qty: 40 },
        { sku: "SKU-002", productName: "智能手环", qty: 20 },
      ],
      receiveTime: "2024-10-28 14:20:00",
      receiver: "李四",
      note: "第一批收货",
    },
    {
      batchNo: "RCV-20241028-002",
      container: { containerNo: "PLT-002", containerType: "托盘" },
      items: [
        { sku: "SKU-001", productName: "无线蓝牙耳机", qty: 20 },
        { sku: "SKU-002", productName: "智能手环", qty: 10 },
      ],
      receiveTime: "2024-10-28 15:45:00",
      receiver: "李四",
      note: "",
    },
  ],

  putawayRecords: [
    {
      batchNo: "PUT-20241028-001",
      containerNo: "PLT-001",
      sku: "SKU-001",
      productName: "无线蓝牙耳机",
      qty: 30,
      location: "A-01-02-03",
      putawayTime: "2024-10-28 15:00:00",
      operator: "王五",
      note: "",
    },
    {
      batchNo: "PUT-20241028-002",
      containerNo: "BOX-001",
      sku: "SKU-002",
      productName: "智能手环",
      qty: 20,
      location: "A-01-02-04",
      putawayTime: "2024-10-28 15:10:00",
      operator: "王五",
      note: "",
    },
    {
      batchNo: "PUT-20241028-003",
      containerNo: "PLT-001",
      sku: "SKU-001",
      productName: "无线蓝牙耳机",
      qty: 10,
      location: "A-01-03-01",
      putawayTime: "2024-10-28 15:30:00",
      operator: "王五",
      note: "",
    },
  ],

  logs: [
    {
      time: "2024-10-28 15:45:00",
      operator: "李四",
      action: "收货",
      detail: "收货批次 RCV-20241028-002，收货数量 30 件",
    },
    {
      time: "2024-10-28 15:30:00",
      operator: "王五",
      action: "上架",
      detail: "上架 SKU-001 × 10 件至 A-01-03-01",
    },
    {
      time: "2024-10-28 15:10:00",
      operator: "王五",
      action: "上架",
      detail: "上架 SKU-002 × 20 件至 A-01-02-04",
    },
    {
      time: "2024-10-28 15:00:00",
      operator: "王五",
      action: "上架",
      detail: "上架 SKU-001 × 30 件至 A-01-02-03",
    },
    {
      time: "2024-10-28 14:20:00",
      operator: "李四",
      action: "收货",
      detail: "收货批次 RCV-20241028-001，收货数量 60 件",
    },
    {
      time: "2024-10-28 09:30:00",
      operator: "张三",
      action: "创建",
      detail: "创建入库单，计划入库 230 件",
    },
  ],
};

export default function InboundDetailPage({ onNavigate, inboundId }: InboundDetailPageProps) {
  const [detail, setDetail] = useState(mockInboundDetail);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; bg: string; text: string; border: string; icon: any }
    > = {
      pending: {
        label: "待收货",
        bg: "hsl(40 96% 95%)",
        text: "hsl(40 96% 35%)",
        border: "hsl(40 96% 85%)",
        icon: Clock,
      },
      receiving: {
        label: "收货中",
        bg: "hsl(218 92% 95%)",
        text: "hsl(218 92% 35%)",
        border: "hsl(218 92% 85%)",
        icon: Package,
      },
      received: {
        label: "已收货",
        bg: "hsl(142 76% 95%)",
        text: "hsl(142 76% 30%)",
        border: "hsl(142 76% 85%)",
        icon: CheckCircle2,
      },
      shelved: {
        label: "已上架",
        bg: "hsl(267 84% 95%)",
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)",
        icon: CheckCircle2,
      },
      cancelled: {
        label: "已关闭",
        bg: "hsl(0 0% 95%)",
        text: "hsl(0 0% 40%)",
        border: "hsl(0 0% 85%)",
        icon: AlertCircle,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge
        variant="outline"
        style={{
          backgroundColor: config.bg,
          color: config.text,
          borderColor: config.border,
        }}
      >
        <Icon className="w-3.5 h-3.5 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const totalPlanned = detail.items.reduce((sum, item) => sum + item.plannedQty, 0);
  const totalReceived = detail.items.reduce((sum, item) => sum + item.receivedQty, 0);
  const totalShelved = detail.items.reduce((sum, item) => sum + item.shelvedQty, 0);
  const progress = totalPlanned > 0 ? (totalReceived / totalPlanned) * 100 : 0;

  const handleReceive = (data: any) => {
    console.log("收货数据:", data);
    
    // 更新收货数量
    const updatedItems = detail.items.map((item) => {
      const receiveItem = data.items.find((ri: any) => ri.sku === item.sku);
      if (receiveItem) {
        return {
          ...item,
          receivedQty: item.receivedQty + receiveItem.currentReceiveQty,
        };
      }
      return item;
    });

    // 添加收货记录
    const newReceiveRecord = {
      batchNo: `RCV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(detail.receiveRecords.length + 1).padStart(3, "0")}`,
      container: data.container,
      items: data.items.map((item: any) => ({
        sku: item.sku,
        productName: item.productName,
        qty: item.currentReceiveQty,
      })),
      receiveTime: new Date().toLocaleString("zh-CN"),
      receiver: "当前用户",
      note: data.note,
    };

    // 添加操作日志
    const newLog = {
      time: new Date().toLocaleString("zh-CN"),
      operator: "当前用户",
      action: "收货",
      detail: `收货批次 ${newReceiveRecord.batchNo}，收货数量 ${data.items.reduce((sum: number, item: any) => sum + item.currentReceiveQty, 0)} 件`,
    };

    setDetail({
      ...detail,
      items: updatedItems,
      receiveRecords: [newReceiveRecord, ...detail.receiveRecords],
      logs: [newLog, ...detail.logs],
      status: "receiving",
      actualArrivalDate: detail.actualArrivalDate || new Date().toLocaleString("zh-CN"),
    });

    setReceiveDialogOpen(false);
    toast.success("收货成功！");
  };

  const handleClose = (data: { reason: string; note: string }) => {
    console.log("关闭数据:", data);
    
    const newLog = {
      time: new Date().toLocaleString("zh-CN"),
      operator: "当前用户",
      action: "关闭",
      detail: `关闭原因：${data.reason}${data.note ? `，说明：${data.note}` : ""}`,
    };

    setDetail({
      ...detail,
      status: "cancelled",
      logs: [newLog, ...detail.logs],
    });

    setCloseDialogOpen(false);
    toast.success("入库单已关闭");
  };

  const canReceive = detail.status === "pending" || detail.status === "receiving";
  const canClose = detail.status !== "cancelled" && detail.status !== "shelved";

  return (
    <WMSLayout title="入库单详情" currentPath="/inbound/management" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => handleNavigate("/inbound/management")}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-mono">{detail.id}</h1>
              {getStatusBadge(detail.status)}
            </div>
          </div>
          <div className="flex gap-2">
            {canReceive && (
              <Button onClick={() => setReceiveDialogOpen(true)}>
                <Package className="w-4 h-4" />
                {detail.status === "pending" ? "开始收货" : "继续收货"}
              </Button>
            )}
            {canClose && (
              <Button variant="outline" onClick={() => setCloseDialogOpen(true)}>
                关闭入库单
              </Button>
            )}
            <Button variant="outline">
              <Printer className="w-4 h-4" />
              打印
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">入库单号</div>
                    <div className="font-mono">{detail.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">参考单号</div>
                    <div>{detail.referenceNo}</div>
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
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">预计到货日期</div>
                    <div>{detail.estimatedDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">实际到货时间</div>
                    <div>{detail.actualArrivalDate || "-"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">到货方式</div>
                    <div>{detail.deliveryMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">跟踪单号</div>
                    <div className="font-mono text-sm">{detail.tracking}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">单注/备注</div>
                    <div className="text-sm">{detail.note}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 收货进度 */}
          <Card>
            <CardHeader>
              <CardTitle>收货进度</CardTitle>
              <CardDescription>当前完成情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">收货进度</span>
                  <span className="font-mono">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">计划总数量</span>
                  <span className="font-mono">{totalPlanned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已收货数量</span>
                  <span className="font-mono text-primary">{totalReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">待收货数量</span>
                  <span className="font-mono">{totalPlanned - totalReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已上架数量</span>
                  <span className="font-mono text-success-600">{totalShelved}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab区域 */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items">商品汇总</TabsTrigger>
            <TabsTrigger value="receive">
              收货记录
              <Badge variant="secondary" className="ml-2">
                {detail.receiveRecords.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="putaway">
              上架记录
              <Badge variant="secondary" className="ml-2">
                {detail.putawayRecords.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="logs">操作日志</TabsTrigger>
          </TabsList>

          {/* 商品汇总 */}
          <TabsContent value="items">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>条形码</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">计划数量</TableHead>
                        <TableHead className="text-right">已收货</TableHead>
                        <TableHead className="text-right">待收货</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.items.map((item) => {
                        const remaining = item.plannedQty - item.receivedQty;
                        const receiveProgress = item.plannedQty > 0 ? (item.receivedQty / item.plannedQty) * 100 : 0;
                        
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
                            <TableCell className="text-right text-primary">
                              {item.receivedQty}
                            </TableCell>
                            <TableCell className="text-right">{remaining}</TableCell>
                            <TableCell className="text-right text-success-600">
                              {item.shelvedQty}
                            </TableCell>
                            <TableCell>
                              {receiveProgress === 100 ? (
                                <Badge
                                  variant="outline"
                                  style={{
                                    backgroundColor: "hsl(142 76% 95%)",
                                    color: "hsl(142 76% 30%)",
                                    borderColor: "hsl(142 76% 85%)",
                                  }}
                                >
                                  已完成
                                </Badge>
                              ) : receiveProgress > 0 ? (
                                <Badge
                                  variant="outline"
                                  style={{
                                    backgroundColor: "hsl(218 92% 95%)",
                                    color: "hsl(218 92% 35%)",
                                    borderColor: "hsl(218 92% 85%)",
                                  }}
                                >
                                  收货中
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  style={{
                                    backgroundColor: "hsl(40 96% 95%)",
                                    color: "hsl(40 96% 35%)",
                                    borderColor: "hsl(40 96% 85%)",
                                  }}
                                >
                                  待收货
                                </Badge>
                              )}
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

          {/* 收货记录 */}
          <TabsContent value="receive">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {detail.receiveRecords.map((record, index) => (
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
                              {record.receiveTime} · {record.receiver}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          共 {record.items.reduce((sum, item) => sum + item.qty, 0)} 件
                        </Badge>
                      </div>

                      <div className="space-y-2 pl-13">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">容器：</span>
                          <Badge variant="outline" className="gap-1">
                            <Package className="w-3 h-3" />
                            {record.container.containerNo} ({record.container.containerType})
                          </Badge>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                                <TableHead>SKU</TableHead>
                                <TableHead>商品名称</TableHead>
                                <TableHead className="text-right">收货数量</TableHead>
                              </TableRow>
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

                        {record.note && (
                          <div className="text-sm text-muted-foreground">
                            备注：{record.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 上架记录 */}
          <TabsContent value="putaway">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                        <TableHead>上架批次号</TableHead>
                        <TableHead>容器编号</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead className="text-right">上架数量</TableHead>
                        <TableHead>目标库位</TableHead>
                        <TableHead>上架时间</TableHead>
                        <TableHead>操作人</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.putawayRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <code className="text-xs font-mono text-muted-foreground">
                              {record.batchNo}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs font-mono text-muted-foreground">
                              {record.containerNo}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs font-mono text-primary">{record.sku}</code>
                          </TableCell>
                          <TableCell>{record.productName}</TableCell>
                          <TableCell className="text-right">{record.qty}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.location}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {record.putawayTime}
                          </TableCell>
                          <TableCell>{record.operator}</TableCell>
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

      {/* 收货弹窗 */}
      <ReceiveDialog
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
        inboundId={detail.id}
        items={detail.items}
        onConfirm={handleReceive}
      />

      {/* 关闭入库单弹窗 */}
      <CloseInboundDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        inboundId={detail.id}
        onConfirm={handleClose}
      />
    </WMSLayout>
  );
}
