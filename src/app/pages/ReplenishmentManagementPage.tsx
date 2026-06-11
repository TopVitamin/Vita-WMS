import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Download, Plus, RefreshCcw, Search, Settings2 } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, KpiCard, StatusBadge } from "../components/business";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { inventoryTaskStatusMap } from "../configs/wmsStatusMap";
import {
  completeReplenishmentTask,
  createReplenishmentTask,
  listInventoryItems,
  listReplenishmentTasks,
  type ReplenishmentTask,
} from "../services/mock";

interface ReplenishmentManagementPageProps {
  onNavigate?: (path: string) => void;
}

export default function ReplenishmentManagementPage({ onNavigate }: ReplenishmentManagementPageProps) {
  const [tasks, setTasks] = useState<ReplenishmentTask[]>(() => listReplenishmentTasks());
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [skuCode, setSkuCode] = useState("GHI-345678");
  const [suggestedQty, setSuggestedQty] = useState("120");
  const [fromLocation, setFromLocation] = useState("R01-01-01");
  const [toLocation, setToLocation] = useState("A02-04-03");
  const inventoryItems = listInventoryItems();

  const refreshTasks = () => setTasks(listReplenishmentTasks());
  const lowStockItems = inventoryItems.filter((item) => item.availableStock < item.safetyStock);
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (!keyword) return true;
    const normalized = keyword.toLowerCase();
    return [task.replenishmentNo, task.skuCode, task.productName, task.fromLocation, task.toLocation]
      .some((value) => value.toLowerCase().includes(normalized));
  });

  const handleCreate = () => {
    const parsedQty = Number(suggestedQty);
    if (!skuCode || !Number.isFinite(parsedQty) || parsedQty <= 0 || !fromLocation || !toLocation) {
      toast.error("请完整填写补货信息");
      return;
    }

    const created = createReplenishmentTask({
      skuCode,
      suggestedQty: parsedQty,
      fromLocation,
      toLocation,
      operator: "当前用户",
    });

    if (!created) {
      toast.error("未找到 SKU，无法创建补货任务");
      return;
    }

    refreshTasks();
    setIsCreateOpen(false);
    toast.success(`已创建补货任务 ${created.replenishmentNo}`);
  };

  const handleComplete = (replenishmentNo: string) => {
    const completed = completeReplenishmentTask(replenishmentNo);
    if (!completed) {
      toast.error("补货完成失败");
      return;
    }
    refreshTasks();
    toast.success(`${completed.replenishmentNo} 已完成，库存流水已生成`);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "待处理").length,
    running: tasks.filter((task) => task.status === "执行中").length,
    lowStock: lowStockItems.length,
  };

  return (
    <WMSLayout title="补货管理" currentPath="/inventory/replenishment" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">补货管理</h2>
            <p className="mt-1 text-sm text-muted-foreground">根据安全库存和拣货位缺口生成补货任务，支持人工执行确认。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              导出
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              新建补货
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="补货任务" value={stats.total} />
          <KpiCard label="待处理" value={stats.pending} tone="warning" />
          <KpiCard label="执行中" value={stats.running} tone="info" />
          <KpiCard label="低库存 SKU" value={stats.lowStock} tone="error" />
        </div>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">补货任务</TabsTrigger>
            <TabsTrigger value="strategy">补货策略</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="补货单号 / SKU / 商品 / 库位" className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="待处理">待处理</SelectItem>
                      <SelectItem value="执行中">执行中</SelectItem>
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
                <CardTitle>补货任务列表</CardTitle>
                <CardDescription>任务完成后会生成补货单库存流水。</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden rounded-b-lg border-t">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>补货单号</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品</TableHead>
                        <TableHead className="text-right">当前可用</TableHead>
                        <TableHead className="text-right">安全库存</TableHead>
                        <TableHead className="text-right">建议补货</TableHead>
                        <TableHead>来源</TableHead>
                        <TableHead>目标</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.replenishmentNo}>
                          <TableCell className="font-mono">{task.replenishmentNo}</TableCell>
                          <TableCell className="font-mono text-sm">{task.skuCode}</TableCell>
                          <TableCell>{task.productName}</TableCell>
                          <TableCell className="text-right">{task.currentStock}</TableCell>
                          <TableCell className="text-right">{task.safetyStock}</TableCell>
                          <TableCell className="text-right tabular-nums">{task.suggestedQty}</TableCell>
                          <TableCell>{task.fromLocation}</TableCell>
                          <TableCell>{task.toLocation}</TableCell>
                          <TableCell><StatusBadge {...inventoryTaskStatusMap[task.status]} /></TableCell>
                          <TableCell className="text-right">
                            {task.status !== "已完成" ? (
                              <Button variant="ghost" size="sm" onClick={() => handleComplete(task.replenishmentNo)}>
                                <CheckCircle2 className="h-4 w-4" />
                                完成补货
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => onNavigate?.("/inventory/transaction")}>
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
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  安全库存策略
                </CardTitle>
                <CardDescription>低于安全库存的 SKU 会进入补货建议池。</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden rounded-b-lg border-t">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品</TableHead>
                        <TableHead>客户</TableHead>
                        <TableHead className="text-right">可用库存</TableHead>
                        <TableHead className="text-right">安全库存</TableHead>
                        <TableHead className="text-right">缺口</TableHead>
                        <TableHead>建议动作</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockItems.map((item) => {
                        const gap = item.safetyStock - item.availableStock;
                        return (
                          <TableRow key={item.skuCode}>
                            <TableCell className="font-mono">{item.skuCode}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.customerName}</TableCell>
                            <TableCell className="text-right">{item.availableStock}</TableCell>
                            <TableCell className="text-right">{item.safetyStock}</TableCell>
                            <TableCell className="text-right text-error-600">{gap}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSkuCode(item.skuCode);
                                  setSuggestedQty(String(Math.max(gap, item.safetyStock)));
                                  setIsCreateOpen(true);
                                }}
                              >
                                <RefreshCcw className="h-4 w-4" />
                                生成任务
                              </Button>
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
        </Tabs>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建补货任务</DialogTitle>
              <DialogDescription>从存储区或在途入库向拣货位补货。</DialogDescription>
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
                  <Label>建议数量</Label>
                  <Input value={suggestedQty} onChange={(event) => setSuggestedQty(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>来源库位</Label>
                  <Input value={fromLocation} onChange={(event) => setFromLocation(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>目标拣货位</Label>
                  <Input value={toLocation} onChange={(event) => setToLocation(event.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={handleCreate}>创建补货任务</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WMSLayout>
  );
}
