import { useState } from "react";
import { ArrowLeft, Package, MapPin, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { PutawayDialog } from "../components/wms/PutawayDialog";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";

interface PutawayDetailPageProps {
  putawayNo?: string;
  onNavigate?: (path: string) => void;
}

export default function PutawayDetailPage({ 
  putawayNo = "PA-20250428-0001",
  onNavigate 
}: PutawayDetailPageProps) {
  const [putawayDialogOpen, setPutawayDialogOpen] = useState(false);

  // 模拟上架单数据（一个上架单只对应一个容器）
  const putawayOrder = {
    putawayNo: "PA-20250428-0001",
    inboundId: "IB-20250428-0001",
    customerName: "亚马逊美国站",
    customerCode: "CUST-AMZ-US-001",
    warehouseArea: "A区",
    createTime: "2025-04-28 09:30:15",
    status: "上架中",
    // 容器信息（只有一个）
    container: { 
      containerNo: "PLT-20250428-001", 
      containerType: "托盘",
      receiveTime: "2025-04-28 09:30:15",
    },
    items: [
      {
        sku: "SKU-A001",
        productName: "蓝牙耳机 Pro版",
        spec: "黑色/标准版",
        barcode: "6901234567890",
        qty: 50,
        putawayQty: 30,
      },
      {
        sku: "SKU-A002",
        productName: "蓝牙耳机 标准版",
        spec: "白色/标准版",
        barcode: "6901234567891",
        qty: 50,
        putawayQty: 20,
      },
      {
        sku: "SKU-A003",
        productName: "充电线 Type-C",
        spec: "1米/白色",
        barcode: "6901234567892",
        qty: 50,
        putawayQty: 0,
      },
      {
        sku: "SKU-A004",
        productName: "无线鼠标",
        spec: "黑色/标准版",
        barcode: "6901234567893",
        qty: 40,
        putawayQty: 0,
      },
      {
        sku: "SKU-A005",
        productName: "键盘套装",
        spec: "RGB版",
        barcode: "6901234567894",
        qty: 40,
        putawayQty: 0,
      },
    ],
    putawayRecords: [
      {
        sku: "SKU-A001",
        productName: "蓝牙耳机 Pro版",
        location: "A01-01-01",
        qty: 20,
        operator: "张三",
        putawayTime: "2025-04-28 10:15:30",
      },
      {
        sku: "SKU-A001",
        productName: "蓝牙耳机 Pro版",
        location: "A01-01-02",
        qty: 10,
        operator: "张三",
        putawayTime: "2025-04-28 10:18:45",
      },
      {
        sku: "SKU-A002",
        productName: "蓝牙耳机 标准版",
        location: "A01-02-01",
        qty: 20,
        operator: "张三",
        putawayTime: "2025-04-28 10:22:10",
      },
    ],
  };

  const totalQty = putawayOrder.items.reduce((sum, item) => sum + item.qty, 0);
  const totalPutawayQty = putawayOrder.items.reduce((sum, item) => sum + item.putawayQty, 0);
  const progress = totalQty > 0 ? Math.round((totalPutawayQty / totalQty) * 100) : 0;

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleStartPutaway = () => {
    setPutawayDialogOpen(true);
  };

  const handlePutawayConfirm = (data: any) => {
    console.log("上架数据:", data);
    setPutawayDialogOpen(false);
    // 这里应该调用API保存上架数据
  };

  const getStatusBadge = () => {
    const statusConfig = {
      "待上架": { variant: "outline" as const, className: "border-warning-500 text-warning-700 bg-warning-50" },
      "上架中": { variant: "outline" as const, className: "border-blue-500 text-blue-700 bg-blue-50" },
      "已上架": { variant: "outline" as const, className: "border-success-500 text-success-700 bg-success-50" },
    };
    const config = statusConfig[putawayOrder.status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {putawayOrder.status}
      </Badge>
    );
  };

  return (
    <WMSLayout 
      title="上架单详情" 
      currentPath="/putaway/detail"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-6">
        {/* 返回按钮 */}
        <div>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigate("/putaway/management")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上架列表
          </Button>
        </div>

        {/* 基本信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <span>上架单信息</span>
                {getStatusBadge()}
              </CardTitle>
              <div className="flex items-center gap-2">
                {putawayOrder.status !== "已上架" && (
                  <Button onClick={handleStartPutaway}>
                    <Package className="w-4 h-4 mr-2" />
                    {putawayOrder.status === "上架中" ? "继续上架" : "开始上架"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 第一行：基本信息 */}
            <div className="grid grid-cols-5 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">上架单号</div>
                <div className="font-mono">{putawayOrder.putawayNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">入库单号</div>
                <div className="font-mono text-primary">{putawayOrder.inboundId}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">客户名称</div>
                <div>{putawayOrder.customerName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">客户编码</div>
                <div className="font-mono text-sm">{putawayOrder.customerCode}</div>
              </div>
              {putawayOrder.status !== "待上架" && putawayOrder.warehouseArea && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">仓库区域</div>
                  <Badge variant="secondary">{putawayOrder.warehouseArea}</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* 第二行：容器信息和创建时间 */}
            <div className="grid grid-cols-5 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">容器号</div>
                <div className="font-mono text-primary">{putawayOrder.container.containerNo}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">容器类型</div>
                <Badge variant="secondary">{putawayOrder.container.containerType}</Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">收货时间</div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  {putawayOrder.container.receiveTime}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">创建时间</div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  {putawayOrder.createTime}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">SKU数 / 总件数</div>
                <div>
                  <span className="text-primary">{putawayOrder.items.length}</span>
                  <span className="text-muted-foreground"> / </span>
                  <span>{totalQty}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 上架进度 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">上架进度</div>
                <div className="text-sm">
                  <span className="text-primary">{totalPutawayQty}</span>
                  <span className="text-muted-foreground"> / {totalQty}</span>
                  <span className="text-muted-foreground ml-2">({progress}%)</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Tab区域 */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items">
              SKU明细
              <Badge variant="secondary" className="ml-2">
                {putawayOrder.items.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="records">
              上架记录
              <Badge variant="secondary" className="ml-2">
                {putawayOrder.putawayRecords.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* SKU明细 */}
          <TabsContent value="items">
            <Card>
              <CardContent className="pt-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>条形码</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">总数量</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead className="text-right">待上架</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {putawayOrder.items.map((item, idx) => {
                        const remaining = item.qty - item.putawayQty;
                        const isCompleted = remaining === 0;
                        const isPartial = item.putawayQty > 0 && !isCompleted;

                        return (
                          <TableRow key={idx} className="hover:bg-table-row-hover">
                            <TableCell>
                              <code className="text-sm font-mono text-primary">{item.sku}</code>
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
                            <TableCell className="text-right">
                              {item.qty}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={item.putawayQty > 0 ? "text-success-600" : "text-muted-foreground"}>
                                {item.putawayQty}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={remaining > 0 ? "text-warning-600" : "text-muted-foreground"}>
                                {remaining}
                              </span>
                            </TableCell>
                            <TableCell>
                              {isCompleted ? (
                                <Badge variant="outline" className="border-success-500 text-success-700 bg-success-50">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  已完成
                                </Badge>
                              ) : isPartial ? (
                                <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
                                  <Clock className="w-3 h-3 mr-1" />
                                  进行中
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-warning-500 text-warning-700 bg-warning-50">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  待上架
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

          {/* 上架记录 */}
          <TabsContent value="records">
            <Card>
              <CardContent className="pt-6">
                {putawayOrder.putawayRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>暂无上架记录</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
                          <TableHead>SKU</TableHead>
                          <TableHead>商品名称</TableHead>
                          <TableHead>库位</TableHead>
                          <TableHead className="text-right">数量</TableHead>
                          <TableHead>操作人</TableHead>
                          <TableHead>上架时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {putawayOrder.putawayRecords.map((record, idx) => (
                          <TableRow key={idx} className="hover:bg-table-row-hover">
                            <TableCell>
                              <code className="text-sm font-mono text-primary">{record.sku}</code>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">{record.productName}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                <MapPin className="w-3 h-3 mr-1" />
                                {record.location}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-success-600">
                              {record.qty}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.operator}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {record.putawayTime}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 上架操作弹窗 */}
      {putawayDialogOpen && (
        <PutawayDialog
          open={putawayDialogOpen}
          onOpenChange={setPutawayDialogOpen}
          container={{
            containerNo: putawayOrder.container.containerNo,
            containerType: putawayOrder.container.containerType,
            inboundId: putawayOrder.inboundId,
            receiveTime: putawayOrder.container.receiveTime,
            customerName: putawayOrder.customerName,
            skuCount: putawayOrder.items.length,
            totalQty: totalQty,
            items: putawayOrder.items.map(item => ({
              sku: item.sku,
              productName: item.productName,
              spec: item.spec,
              qty: item.qty,
              putawayQty: item.putawayQty,
            })),
          }}
          onConfirm={handlePutawayConfirm}
        />
      )}
    </WMSLayout>
  );
}
