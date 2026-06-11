import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ClipboardCheck, Download, Plus, Search } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, KpiCard, StatusBadge } from "../components/business";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { inventoryTaskStatusMap } from "../configs/wmsStatusMap";
import {
  approveAdjustmentOrder,
  createAdjustmentOrder,
  listAdjustmentOrders,
  listInventoryItems,
  type AdjustmentOrder,
} from "../services/mock";

interface InventoryAdjustmentPageProps {
  onNavigate?: (path: string) => void;
}

export default function InventoryAdjustmentPage({ onNavigate }: InventoryAdjustmentPageProps) {
  const [orders, setOrders] = useState<AdjustmentOrder[]>(() => listAdjustmentOrders());
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [skuCode, setSkuCode] = useState("GHI-345678");
  const [actualQty, setActualQty] = useState("148");
  const [reason, setReason] = useState("破损报损");
  const inventoryItems = listInventoryItems();
  const selectedItem = inventoryItems.find((item) => item.skuCode === skuCode);

  const refreshOrders = () => setOrders(listAdjustmentOrders());
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!keyword) return true;
    const normalized = keyword.toLowerCase();
    return [order.adjustmentNo, order.skuCode, order.productName, order.reason]
      .some((value) => value.toLowerCase().includes(normalized));
  });

  const handleCreate = () => {
    const parsedActualQty = Number(actualQty);
    if (!skuCode || !Number.isFinite(parsedActualQty) || parsedActualQty < 0 || !reason) {
      toast.error("请完整填写调整信息");
      return;
    }

    const created = createAdjustmentOrder({
      skuCode,
      actualQty: parsedActualQty,
      reason,
      operator: "当前用户",
    });

    if (!created) {
      toast.error("未找到 SKU，无法创建调整单");
      return;
    }

    refreshOrders();
    setIsCreateOpen(false);
    toast.success(`已创建调整单 ${created.adjustmentNo}`);
  };

  const handleApprove = (adjustmentNo: string) => {
    const approved = approveAdjustmentOrder(adjustmentNo);
    if (!approved) {
      toast.error("审核失败");
      return;
    }
    refreshOrders();
    toast.success(`${approved.adjustmentNo} 已审核生效，库存流水已生成`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "待审核").length,
    completed: orders.filter((order) => order.status === "已完成").length,
    diff: orders.reduce((sum, order) => sum + order.diffQty, 0),
  };

  return (
    <WMSLayout title="库存调整" currentPath="/inventory/adjustment" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">库存调整</h2>
            <p className="mt-1 text-sm text-muted-foreground">处理报损、盘盈盘亏、质量异常等库存调整单。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              导出
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              新建调整
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="调整单" value={stats.total} />
          <KpiCard label="待审核" value={stats.pending} tone="warning" />
          <KpiCard label="已生效" value={stats.completed} tone="success" />
          <KpiCard label="净差异" value={stats.diff > 0 ? `+${stats.diff}` : stats.diff} tone={stats.diff < 0 ? "error" : "info"} />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="调整单号 / SKU / 商品 / 原因" className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="待审核">待审核</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="已取消">已取消</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { setKeyword(""); setStatusFilter("all"); }}>重置</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>调整单列表</CardTitle>
            <CardDescription>审核通过后会同步更新库存数量，并写入库存流水。</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-lg border-t">
              <Table>
                <TableHeader>
                  <DataTableHeaderRow>
                    <TableHead>调整单号</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead className="text-right">账面</TableHead>
                    <TableHead className="text-right">实盘/调整后</TableHead>
                    <TableHead className="text-right">差异</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </DataTableHeaderRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.adjustmentNo}>
                      <TableCell className="font-mono">{order.adjustmentNo}</TableCell>
                      <TableCell className="font-mono text-sm">{order.skuCode}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell className="text-right">{order.bookQty}</TableCell>
                      <TableCell className="text-right">{order.actualQty}</TableCell>
                      <TableCell className={`text-right tabular-nums ${order.diffQty < 0 ? "text-error-600" : "text-success-600"}`}>
                        {order.diffQty > 0 ? `+${order.diffQty}` : order.diffQty}
                      </TableCell>
                      <TableCell>{order.reason}</TableCell>
                      <TableCell><StatusBadge {...inventoryTaskStatusMap[order.status]} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                      <TableCell className="text-right">
                        {order.status === "待审核" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleApprove(order.adjustmentNo)}>
                            <CheckCircle2 className="h-4 w-4" />
                            审核生效
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => onNavigate?.("/inventory/transaction")}>
                            <ClipboardCheck className="h-4 w-4" />
                            查看流水
                          </Button>
                        )}
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
              <DialogTitle>新建库存调整</DialogTitle>
              <DialogDescription>调整单需要审核后才会影响库存。</DialogDescription>
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>当前可用库存</Label>
                  <Input value={selectedItem?.availableStock ?? 0} disabled />
                </div>
                <div className="space-y-2">
                  <Label>调整后数量</Label>
                  <Input value={actualQty} onChange={(event) => setActualQty(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>调整原因</Label>
                <Input value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={handleCreate}>创建调整单</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WMSLayout>
  );
}
