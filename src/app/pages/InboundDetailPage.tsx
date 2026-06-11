import "../../styles/globals.css";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Package, FileText, Printer } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { ReceiveDialog } from "../components/wms/ReceiveDialog";
import { CloseInboundDialog } from "../components/wms/CloseInboundDialog";
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { inboundOrderStatusMap, itemProgressStatusMap } from "../configs/wmsStatusMap";
import { toast } from "sonner";
import {
  closeInboundOrder,
  completeInboundPutawayFromDetail,
  createPutawayOrderFromReceipt,
  getInboundDetail,
  getReceivingStagingLocation,
  receiveInboundContainer,
} from "../services/mock";

interface InboundDetailPageProps {
  onNavigate?: (path: string) => void;
  inboundId?: string;
}

export default function InboundDetailPage({ onNavigate, inboundId }: InboundDetailPageProps) {
  const [detail, setDetail] = useState(() => getInboundDetail(inboundId));
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const totalPlanned = detail.items.reduce((sum, item) => sum + item.plannedQty, 0);
  const totalReceived = detail.items.reduce((sum, item) => sum + item.receivedQty, 0);
  const totalShelved = detail.items.reduce((sum, item) => sum + item.shelvedQty, 0);
  const progress = totalPlanned > 0 ? (totalReceived / totalPlanned) * 100 : 0;

  const handleReceive = (data: any) => {
    const result = receiveInboundContainer(detail.id, data);
    const putawayOrder = createPutawayOrderFromReceipt(result.receipt);
    setDetail(result.detail);
    setReceiveDialogOpen(false);
    toast.success(`收货成功，已生成上架单 ${putawayOrder.putawayNo}`);
  };

  const handleClose = (data: { reason: string; note: string }) => {
    const updatedDetail = closeInboundOrder(detail.id, data.reason, data.note);
    if (updatedDetail) setDetail(updatedDetail);

    setCloseDialogOpen(false);
    toast.success("入库单已关闭");
  };

  const handleCompletePutaway = () => {
    const updatedDetail = completeInboundPutawayFromDetail(detail.id);
    if (!updatedDetail) {
      toast.error("上架失败，未找到入库单");
      return;
    }
    setDetail(updatedDetail);
    toast.success(updatedDetail.status === "shelved" ? "上架完成，列表状态已更新为已上架" : "已记录本次上架");
  };

  const canReceive = detail.status === "pending" || detail.status === "in_progress";
  const canPutaway = detail.status !== "cancelled" && totalReceived > totalShelved;
  const canClose = detail.status !== "cancelled" && detail.status !== "shelved";

  return (
    <WMSLayout title="入库单详情" currentPath="/inbound/management" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={() => handleNavigate("/inbound/management")}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">{detail.id}</h1>
              <StatusBadge {...inboundOrderStatusMap[detail.status]} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canReceive && (
              <Button onClick={() => setReceiveDialogOpen(true)}>
                <Package className="w-4 h-4" />
                {detail.status === "pending" ? "开始收货" : "继续收货"}
              </Button>
            )}
            {canPutaway && (
              <Button variant="outline" onClick={handleCompletePutaway}>
                <CheckCircle2 className="w-4 h-4" />
                完成上架
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
            <TabsTrigger value="items" className="group gap-1">
              商品汇总
              <StatusTabCount count={detail.items.length} />
            </TabsTrigger>
            <TabsTrigger value="receive" className="group gap-1">
              收货记录
              <StatusTabCount count={detail.receiveRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="putaway" className="group gap-1">
              上架记录
              <StatusTabCount count={detail.putawayRecords.length} />
            </TabsTrigger>
            <TabsTrigger value="logs" className="group gap-1">
              操作日志
              <StatusTabCount count={detail.logs.length} />
            </TabsTrigger>
          </TabsList>

          {/* 商品汇总 */}
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
                        <TableHead className="text-right">已收货</TableHead>
                        <TableHead className="text-right">待收货</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead>状态</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {detail.items.map((item) => {
                        const remaining = item.plannedQty - item.receivedQty;
                        const receiveProgress = item.plannedQty > 0 ? (item.receivedQty / item.plannedQty) * 100 : 0;
                        const itemStatusKey =
                          receiveProgress === 100
                            ? "receive_completed"
                            : receiveProgress > 0
                            ? "receiving"
                            : "receive_pending";
                        
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
                              <DataTableHeaderRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>商品名称</TableHead>
                                <TableHead className="text-right">收货数量</TableHead>
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
                      <DataTableHeaderRow>
                        <TableHead>上架批次号</TableHead>
                        <TableHead>容器编号</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead className="text-right">上架数量</TableHead>
                        <TableHead>目标库位</TableHead>
                        <TableHead>上架时间</TableHead>
                        <TableHead>操作人</TableHead>
                      </DataTableHeaderRow>
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
        stagingLocation={getReceivingStagingLocation({
          tracking: detail.tracking,
          deliveryMethod: detail.deliveryMethod,
        })}
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
