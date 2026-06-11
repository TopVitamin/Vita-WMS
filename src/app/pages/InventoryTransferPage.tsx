import { useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft, CheckCircle2, Download, Filter, Plus, Search } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, KpiCard, StatusBadge } from "../components/business";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { inventoryTaskStatusMap } from "../configs/wmsStatusMap";
import {
  completeTransferOrder,
  createTransferOrder,
  listInventoryItems,
  listTransferOrders,
  type TransferOrder,
} from "../services/mock";

interface InventoryTransferPageProps {
  onNavigate?: (path: string) => void;
}

export default function InventoryTransferPage({ onNavigate }: InventoryTransferPageProps) {
  const [orders, setOrders] = useState<TransferOrder[]>(() => listTransferOrders());
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [skuCode, setSkuCode] = useState("ABC-123456");
  const [qty, setQty] = useState("50");
  const [fromLocation, setFromLocation] = useState("R01-01-01");
  const [toLocation, setToLocation] = useState("A01-03-02");
  const [reason, setReason] = useState("拣货位补货");
  const inventoryItems = listInventoryItems();

  const refreshOrders = () => setOrders(listTransferOrders());
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "active" && order.status === "已完成") return false;
    if (statusFilter !== "active" && statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!keyword) return true;
    const normalized = keyword.toLowerCase();
    return [order.transferNo, order.skuCode, order.productName, order.fromLocation, order.toLocation]
      .some((value) => value.toLowerCase().includes(normalized));
  });

  const handleCreate = () => {
    const parsedQty = Number(qty);
    if (!skuCode || !fromLocation || !toLocation || !Number.isFinite(parsedQty) || parsedQty <= 0) {
      toast.error("请完整填写移库信息");
      return;
    }

    const created = createTransferOrder({
      skuCode,
      qty: parsedQty,
      fromLocation,
      toLocation,
      reason,
      operator: "当前用户",
    });

    if (!created) {
      toast.error("未找到 SKU，无法创建移库单");
      return;
    }

    refreshOrders();
    setIsCreateOpen(false);
    toast.success(`已创建移库单 ${created.transferNo}`);
  };

  const handleComplete = (transferNo: string) => {
    const completed = completeTransferOrder(transferNo);
    if (!completed) {
      toast.error("移库完成失败");
      return;
    }
    refreshOrders();
    toast.success(`${completed.transferNo} 已完成，库存流水已生成`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "待处理").length,
    running: orders.filter((order) => order.status === "执行中").length,
    completed: orders.filter((order) => order.status === "已完成").length,
  };

  return (
    <WMSLayout title="移库管理" currentPath="/inventory/transfer" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">移库管理</h2>
            <p className="mt-1 text-sm text-muted-foreground">创建库内转移任务，跟踪来源库位、目标库位和执行状态。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              导出
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              新建移库
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="移库单" value={stats.total} />
          <KpiCard label="待处理" value={stats.pending} tone="warning" />
          <KpiCard label="执行中" value={stats.running} tone="info" />
          <KpiCard label="已完成" value={stats.completed} tone="success" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="移库单号 / SKU / 库位" className="pl-9" />
                </div>
              </div>
              <div className="col-span-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">待处理</SelectItem>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="待处理">待处理</SelectItem>
                    <SelectItem value="执行中">执行中</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4" />
                  筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>移库单列表</CardTitle>
            <CardDescription>完成移库后会写入库存流水，便于追溯库位变更。</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-lg border-t">
              <Table>
                <TableHeader>
                  <DataTableHeaderRow>
                    <TableHead>移库单号</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>来源库位</TableHead>
                    <TableHead>目标库位</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </DataTableHeaderRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.transferNo}>
                      <TableCell className="font-mono">{order.transferNo}</TableCell>
                      <TableCell className="font-mono text-sm">{order.skuCode}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell className="text-right">{order.qty}</TableCell>
                      <TableCell>{order.fromLocation}</TableCell>
                      <TableCell>{order.toLocation}</TableCell>
                      <TableCell>{order.reason}</TableCell>
                      <TableCell><StatusBadge {...inventoryTaskStatusMap[order.status]} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onNavigate?.(`/inventory/transfer/workspace?transferNo=${order.transferNo}`)}>
                            <ArrowRightLeft className="h-4 w-4" />
                            执行
                          </Button>
                          {order.status !== "已完成" && (
                            <Button variant="ghost" size="sm" onClick={() => handleComplete(order.transferNo)}>
                              <CheckCircle2 className="h-4 w-4" />
                              完成
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建移库单</DialogTitle>
              <DialogDescription>选择 SKU 和库位后生成待执行移库任务。</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Select value={skuCode} onValueChange={setSkuCode}>
                  <SelectTrigger><SelectValue placeholder="选择 SKU" /></SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item) => (
                      <SelectItem key={item.skuCode} value={item.skuCode}>{item.skuCode} - {item.productName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>数量</Label>
                  <Input value={qty} onChange={(event) => setQty(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>来源库位</Label>
                  <Input value={fromLocation} onChange={(event) => setFromLocation(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>目标库位</Label>
                  <Input value={toLocation} onChange={(event) => setToLocation(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>移库原因</Label>
                <Input value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={handleCreate}>创建移库单</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WMSLayout>
  );
}
