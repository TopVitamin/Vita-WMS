import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { KpiCard, PickingTaskStatusBadge, PriorityBadge } from "../components/business";
import { listPickingTasks } from "../services/mock";
import type { PickingTask } from "../types/wms";
import {
  Search, Plus, Filter, RefreshCcw, Download, UserPlus, X,
  Package
} from "lucide-react";

interface PickingTaskListPageProps {
  onNavigate: (path: string) => void;
}

export default function PickingTaskListPage({ onNavigate }: PickingTaskListPageProps) {
  const pickingTaskData = listPickingTasks();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [pickerFilter, setPickerFilter] = useState("all");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState("");

  // 筛选数据
  const filteredData = pickingTaskData.filter((item: PickingTask) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (!item.taskNo.toLowerCase().includes(keyword) &&
          !(item.waveNo?.toLowerCase().includes(keyword))) {
        return false;
      }
    }
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
    if (pickerFilter !== "all") {
      if (pickerFilter === "unassigned" && item.picker) return false;
      if (pickerFilter !== "unassigned" && item.picker?.name !== pickerFilter) return false;
    }
    return true;
  });

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 单选
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  // 批量分配
  const handleBatchAssign = () => {
    setIsAssignDialogOpen(true);
  };

  const confirmAssign = () => {
    alert(`已将 ${selectedItems.length} 个任务分配给 ${selectedPicker}`);
    setIsAssignDialogOpen(false);
    setSelectedItems([]);
    setSelectedPicker("");
  };

  const getStatusBadge = (status: PickingTask["status"]) => <PickingTaskStatusBadge status={status} />;
  const getPriorityBadge = (priority: PickingTask["priority"]) => <PriorityBadge priority={priority} />;

  // 统计数据
  const totalTasks = pickingTaskData.length;
  const pendingTasks = pickingTaskData.filter(t => t.status === "待分配" || t.status === "待拣货").length;
  const activePickingTasks = pickingTaskData.filter(t => t.status === "拣货中").length;
  const completedTasks = pickingTaskData.filter(t => t.status === "已完成").length;

  return (
    <WMSLayout title="拣货任务管理" currentPath="/picking/tasks" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="总任务数" value={totalTasks} />
          <KpiCard label="待处理" value={pendingTasks} tone="info" />
          <KpiCard label="拣货中" value={activePickingTasks} tone="warning" />
          <KpiCard label="已完成" value={completedTasks} tone="success" />
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-3">
              {/* 搜索框 */}
              <div className="col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="任务单号 / 波次号"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 任务状态筛选 */}
              <div className="col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="任务状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待分配">待分配</SelectItem>
                    <SelectItem value="待拣货">待拣货</SelectItem>
                    <SelectItem value="拣货中">拣货中</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 优先级筛选 */}
              <div className="col-span-2">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部优先级</SelectItem>
                    <SelectItem value="紧急">紧急</SelectItem>
                    <SelectItem value="高">高</SelectItem>
                    <SelectItem value="中">中</SelectItem>
                    <SelectItem value="低">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 拣货员筛选 */}
              <div className="col-span-2">
                <Select value={pickerFilter} onValueChange={setPickerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="拣货员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部拣货员</SelectItem>
                    <SelectItem value="unassigned">未分配</SelectItem>
                    <SelectItem value="张三">张三</SelectItem>
                    <SelectItem value="李四">李四</SelectItem>
                    <SelectItem value="王五">王五</SelectItem>
                    <SelectItem value="赵六">赵六</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 高级筛选 */}
              <div className="col-span-1">
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* 重置 */}
              <div className="col-span-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchKeyword("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setPickerFilter("all");
                  }}
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* 新建任务 */}
              <div className="col-span-1">
                <Button className="w-full" onClick={() => alert("创建拣货任务")}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 批量操作栏 */}
            {selectedItems.length > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => setSelectedItems([])}
                  />
                  <span className="text-sm text-primary-700">
                    已选择 <strong>{selectedItems.length}</strong> 项
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleBatchAssign}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    批量分配
                  </Button>
                  <Button variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    批量取消
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    批量导出
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 数据表格 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[140px]">任务单号</TableHead>
                    <TableHead className="w-[140px]">波次号</TableHead>
                    <TableHead className="w-[100px]">拣货类型</TableHead>
                    <TableHead className="w-[80px]">优先级</TableHead>
                    <TableHead className="w-[80px]">订单数</TableHead>
                    <TableHead className="w-[80px]">SKU数</TableHead>
                    <TableHead className="w-[90px] text-right">总拣货数</TableHead>
                    <TableHead className="w-[180px]">已拣数量</TableHead>
                    <TableHead className="w-[100px]">拣货员</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[140px]">创建时间</TableHead>
                    <TableHead className="w-[140px]">预计完成</TableHead>
                    <TableHead className="w-[140px]">实际完成</TableHead>
                    <TableHead className="w-[140px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const progress = (item.pickedQty / item.totalQty) * 100;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.taskNo}</span>
                        </TableCell>
                        <TableCell>
                          {item.waveNo ? (
                            <span className="font-mono text-sm">{item.waveNo}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.pickingType}</span>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(item.priority)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.orderCount}单</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.skuCount}个</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-medium">{item.totalQty}件</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.pickedQty}件</span>
                              <span className="text-xs text-muted-foreground">
                                ({progress.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={progress} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.picker ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">{item.picker.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{item.picker.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">未分配</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.createTime}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.estimatedTime}</span>
                        </TableCell>
                        <TableCell>
                          {item.actualTime ? (
                            <span className="text-sm text-muted-foreground">{item.actualTime}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate(`/picking/tasks/${item.id}`)}
                            >
                              详情
                            </Button>
                            {item.status === "待分配" && (
                              <Button variant="ghost" size="sm">
                                分配
                              </Button>
                            )}
                            {item.status === "待拣货" && (
                              <Button variant="ghost" size="sm">
                                开始
                              </Button>
                            )}
                            {(item.status === "待分配" || item.status === "待拣货") && (
                              <Button variant="ghost" size="sm">
                                取消
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 空状态 */}
            {filteredData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg mb-2">暂无拣货任务</p>
                <p className="text-sm">调整筛选条件或创建新任务</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 分页 */}
        {filteredData.length > 0 && (
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  显示 <span className="font-medium">{filteredData.length}</span> 条结果，共 <span className="font-medium">{pickingTaskData.length}</span> 条
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    下一页
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 批量分配对话框 */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量分配拣货员</DialogTitle>
            <DialogDescription>
              将选中的 {selectedItems.length} 个任务分配给指定拣货员
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>选择拣货员</Label>
              <Select value={selectedPicker} onValueChange={setSelectedPicker}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择拣货员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="张三">张三</SelectItem>
                  <SelectItem value="李四">李四</SelectItem>
                  <SelectItem value="王五">王五</SelectItem>
                  <SelectItem value="赵六">赵六</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmAssign} disabled={!selectedPicker}>
              确认分配
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WMSLayout>
  );
}
