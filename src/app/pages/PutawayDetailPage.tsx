import { useState } from "react";
import { ArrowLeft, Package, MapPin, Calendar } from "lucide-react";
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
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { itemProgressStatusMap, putawayStatusMap } from "../configs/wmsStatusMap";
import { confirmPutawayOrder, getPutawayOrder, type PutawayOrder } from "../services/mock";
import { toast } from "sonner";

interface PutawayDetailPageProps {
  putawayNo?: string;
  onNavigate?: (path: string) => void;
}

export default function PutawayDetailPage({ 
  putawayNo = "PA-20250428-0001",
  onNavigate 
}: PutawayDetailPageProps) {
  const [putawayDialogOpen, setPutawayDialogOpen] = useState(false);
  const [putawayOrder, setPutawayOrder] = useState<PutawayOrder>(() => getPutawayOrder(putawayNo)!);

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
    const updatedOrder = confirmPutawayOrder(putawayOrder.putawayNo, data);
    if (updatedOrder) {
      setPutawayOrder(updatedOrder);
      toast.success("上架完成，库存已转为可用");
    }
    setPutawayDialogOpen(false);
  };

  return (
    <WMSLayout 
      title="上架单详情" 
      currentPath="/putaway/detail"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={() => handleNavigate("/putaway/management")}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">{putawayOrder.putawayNo}</h1>
              <StatusBadge {...putawayStatusMap[putawayOrder.status]} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {putawayOrder.status !== "已上架" && (
              <Button onClick={handleStartPutaway}>
                <Package className="w-4 h-4 mr-2" />
                {putawayOrder.status === "上架中" ? "继续上架" : "开始上架"}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">上架单号</div>
                    <div className="font-mono">{putawayOrder.putawayNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">入库单号</div>
                    <div className="font-mono text-primary">{putawayOrder.inboundId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">客户名称</div>
                    <div>{putawayOrder.customerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">客户编码</div>
                    <div className="font-mono text-sm">{putawayOrder.inboundId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">来源暂存库位</div>
                    <div className="font-mono text-primary">{putawayOrder.sourceLocationCode}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">暂存库位名称</div>
                    <div>{putawayOrder.sourceLocationName}</div>
                  </div>
                  {putawayOrder.receiveBatchNo && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">收货批次</div>
                      <div className="font-mono text-sm">{putawayOrder.receiveBatchNo}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">容器号</div>
                    <div className="font-mono text-primary">{putawayOrder.container.containerNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">容器类型</div>
                    <div>{putawayOrder.container.containerType}</div>
                  </div>
                  {putawayOrder.status !== "待上架" && putawayOrder.warehouseArea && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">仓库区域</div>
                      <div>{putawayOrder.warehouseArea}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">收货时间</div>
                    <div>{putawayOrder.container.receiveTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                    <div>{putawayOrder.createTime}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 上架进度 */}
          <Card>
            <CardHeader>
              <CardTitle>上架进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">上架进度</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">SKU 种类数</span>
                  <span className="font-mono">{putawayOrder.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">计划上架总数</span>
                  <span className="font-mono">{totalQty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">已上架数量</span>
                  <span className="font-mono text-success-600">{totalPutawayQty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">待上架数量</span>
                  <span className="font-mono text-warning-600">{totalQty - totalPutawayQty}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab区域 */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items" className="group gap-1">
              SKU明细
              <StatusTabCount count={putawayOrder.items.length} />
            </TabsTrigger>
            <TabsTrigger value="records" className="group gap-1">
              上架记录
              <StatusTabCount count={putawayOrder.records.length} />
            </TabsTrigger>
          </TabsList>

          {/* SKU明细 */}
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
                        <TableHead className="text-right">总数量</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead className="text-right">待上架</TableHead>
                        <TableHead>状态</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {putawayOrder.items.map((item, idx) => {
                        const remaining = item.qty - item.putawayQty;
                        const itemStatusKey =
                          remaining === 0
                            ? "putaway_completed"
                            : item.putawayQty > 0
                            ? "putaway_in_progress"
                            : "putaway_pending";

                        return (
                          <TableRow key={idx} className="hover:bg-table-row-hover">
                            <TableCell>
                               <a
                                 href="#"
                                 className="font-mono text-primary hover:underline text-xs"
                                 onClick={(e) => {
                                   e.preventDefault();
                                   onNavigate?.(`/inventory/detail/${item.sku}`);
                                 }}
                               >
                                 {item.sku}
                               </a>
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <code className="text-xs font-mono text-muted-foreground">
                                {(item as { barcode?: string }).barcode || "-"}
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
                              <StatusBadge {...itemProgressStatusMap[itemStatusKey]} />
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
                {putawayOrder.records.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>暂无上架记录</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <DataTableHeaderRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>商品名称</TableHead>
                          <TableHead>库位</TableHead>
                          <TableHead className="text-right">数量</TableHead>
                          <TableHead>操作人</TableHead>
                          <TableHead>上架时间</TableHead>
                        </DataTableHeaderRow>
                      </TableHeader>
                      <TableBody>
                        {putawayOrder.records.map((record, idx) => (
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
                                {record.locationCode}
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
