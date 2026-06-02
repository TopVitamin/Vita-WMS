import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
import { Checkbox } from "../components/ui/checkbox";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Search, Plus, Filter, RefreshCcw, Download, Upload, Play,
  CheckCircle, X, Clock, AlertCircle, Package
} from "lucide-react";

interface StocktakingPlanListPageProps {
  onNavigate: (path: string) => void;
}

// Mock数据
const mockStocktakingPlans = [
  {
    id: "1",
    planNo: "PD-20260602-001",
    planName: "2026年6月全库盘点",
    stocktakingType: "全盘",
    scope: "全库",
    skuCount: 156,
    plannedQty: 8950,
    countedQty: 8950,
    diffQty: 12,
    supervisor: { name: "王五", avatar: "WW" },
    counters: ["张三", "李四"],
    status: "已完成",
    createTime: "2026-06-01 08:00",
    planStartTime: "2026-06-02 09:00",
    actualStartTime: "2026-06-02 09:15",
    completeTime: "2026-06-02 15:30",
    creator: "系统管理员",
  },
  {
    id: "2",
    planNo: "PD-20260602-002",
    planName: "A库区定期盘点",
    stocktakingType: "抽盘",
    scope: "A库区",
    skuCount: 45,
    plannedQty: 2300,
    countedQty: 1400,
    diffQty: 0,
    supervisor: { name: "赵六", avatar: "ZL" },
    counters: ["张三"],
    status: "盘点中",
    createTime: "2026-06-02 08:30",
    planStartTime: "2026-06-02 10:00",
    actualStartTime: "2026-06-02 10:05",
    completeTime: null,
    creator: "仓库主管",
  },
  {
    id: "3",
    planNo: "PD-20260602-003",
    planName: "高价值商品盘点",
    stocktakingType: "循环盘",
    scope: "指定SKU",
    skuCount: 23,
    plannedQty: 890,
    countedQty: 0,
    diffQty: 0,
    supervisor: { name: "王五", avatar: "WW" },
    counters: ["李四", "赵六"],
    status: "待开始",
    createTime: "2026-06-02 11:00",
    planStartTime: "2026-06-02 14:00",
    actualStartTime: null,
    completeTime: null,
    creator: "财务部",
  },
  {
    id: "4",
    planNo: "PD-20260601-015",
    planName: "B库区动态盘点",
    stocktakingType: "动态盘",
    scope: "B库区",
    skuCount: 78,
    plannedQty: 3450,
    countedQty: 3450,
    diffQty: -23,
    supervisor: { name: "张三", avatar: "ZS" },
    counters: ["李四", "王五"],
    status: "待审核",
    createTime: "2026-06-01 09:00",
    planStartTime: "2026-06-01 13:00",
    actualStartTime: "2026-06-01 13:10",
    completeTime: "2026-06-01 17:45",
    creator: "仓库主管",
  },
];

export default function StocktakingPlanListPage({ onNavigate }: StocktakingPlanListPageProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // 筛选数据
  const filteredData = mockStocktakingPlans.filter(item => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (!item.planNo.toLowerCase().includes(keyword) &&
          !item.planName.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.stocktakingType !== typeFilter) return false;
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

  // 获取状态Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待开始":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">待开始</Badge>;
      case "盘点中":
        return <Badge variant="outline" className="bg-warning-50 text-warning-600 border-warning-200">
          <Play className="w-3 h-3 mr-1" />
          盘点中
        </Badge>;
      case "待审核":
        return <Badge variant="outline" className="bg-info-50 text-info-600 border-info-200">
          <Clock className="w-3 h-3 mr-1" />
          待审核
        </Badge>;
      case "已完成":
        return <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          已完成
        </Badge>;
      case "已取消":
        return <Badge variant="outline" className="bg-error-50 text-error-600 border-error-200">已取消</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 统计数据
  const totalPlans = mockStocktakingPlans.length;
  const pendingPlans = mockStocktakingPlans.filter(p => p.status === "待开始").length;
  const countingPlans = mockStocktakingPlans.filter(p => p.status === "盘点中").length;
  const completedPlans = mockStocktakingPlans.filter(p => p.status === "已完成").length;

  return (
    <WMSLayout title="盘点管理" currentPath="/inventory/stocktaking" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">总计划数</div>
                  <div className="text-3xl font-medium">{totalPlans}</div>
                </div>
                <Package className="w-12 h-12 text-muted-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">待开始</div>
                  <div className="text-3xl font-medium text-gray-600">{pendingPlans}</div>
                </div>
                <Clock className="w-12 h-12 text-gray-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点中</div>
                  <div className="text-3xl font-medium text-warning-600">{countingPlans}</div>
                </div>
                <Play className="w-12 h-12 text-warning-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">已完成</div>
                  <div className="text-3xl font-medium text-success-600">{completedPlans}</div>
                </div>
                <CheckCircle className="w-12 h-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
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
                    placeholder="盘点单号 / 盘点名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 盘点类型筛选 */}
              <div className="col-span-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="盘点类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="全盘">全盘</SelectItem>
                    <SelectItem value="抽盘">抽盘</SelectItem>
                    <SelectItem value="循环盘">循环盘</SelectItem>
                    <SelectItem value="动态盘">动态盘</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 状态筛选 */}
              <div className="col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待开始">待开始</SelectItem>
                    <SelectItem value="盘点中">盘点中</SelectItem>
                    <SelectItem value="待审核">待审核</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 占位 */}
              <div className="col-span-2"></div>

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
                    setTypeFilter("all");
                  }}
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* 新建盘点 */}
              <div className="col-span-1">
                <Button className="w-full" onClick={() => onNavigate("/inventory/stocktaking/create")}>
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
                    <TableHead className="w-[140px]">盘点单号</TableHead>
                    <TableHead className="w-[200px]">盘点名称</TableHead>
                    <TableHead className="w-[100px]">盘点类型</TableHead>
                    <TableHead className="w-[120px]">盘点范围</TableHead>
                    <TableHead className="w-[80px]">SKU数</TableHead>
                    <TableHead className="w-[100px] text-right">计划盘点数</TableHead>
                    <TableHead className="w-[180px]">已盘数量</TableHead>
                    <TableHead className="w-[100px] text-right">差异数量</TableHead>
                    <TableHead className="w-[120px]">盘点员</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[140px]">计划开始</TableHead>
                    <TableHead className="w-[140px]">实际开始</TableHead>
                    <TableHead className="w-[140px]">完成时间</TableHead>
                    <TableHead className="w-[100px]">创建人</TableHead>
                    <TableHead className="w-[160px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const progress = item.plannedQty > 0 ? (item.countedQty / item.plannedQty) * 100 : 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.planNo}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{item.planName}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.stocktakingType}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.scope}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.skuCount}个</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-medium">{item.plannedQty.toLocaleString()}件</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.countedQty.toLocaleString()}件</span>
                              <span className="text-xs text-muted-foreground">
                                ({progress.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={progress} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.diffQty !== 0 ? (
                            <span className={`text-sm font-medium ${item.diffQty > 0 ? 'text-success-600' : 'text-error-600'}`}>
                              {item.diffQty > 0 ? '+' : ''}{item.diffQty}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{item.supervisor.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-xs">{item.supervisor.name}</span>
                              <span className="text-xs text-muted-foreground">等{item.counters.length}人</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.planStartTime}</span>
                        </TableCell>
                        <TableCell>
                          {item.actualStartTime ? (
                            <span className="text-sm text-muted-foreground">{item.actualStartTime}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.completeTime ? (
                            <span className="text-sm text-muted-foreground">{item.completeTime}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.creator}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate(`/inventory/stocktaking/${item.id}`)}
                            >
                              详情
                            </Button>
                            {item.status === "待开始" && (
                              <>
                                <Button variant="ghost" size="sm">
                                  开始
                                </Button>
                                <Button variant="ghost" size="sm">
                                  取消
                                </Button>
                              </>
                            )}
                            {item.status === "待审核" && (
                              <Button variant="ghost" size="sm">
                                审核
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
                <p className="text-lg mb-2">暂无盘点计划</p>
                <p className="text-sm">创建新的盘点计划开始盘点</p>
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
                  显示 <span className="font-medium">{filteredData.length}</span> 条结果，共 <span className="font-medium">{mockStocktakingPlans.length}</span> 条
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
    </WMSLayout>
  );
}
