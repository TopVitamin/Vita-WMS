import { useState } from "react";
import { Search, Package, ArrowUpToLine, Filter, Download, RefreshCw, Eye, Calendar } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { LoadingState } from "../components/wms/LoadingState";
import { EmptyState } from "../components/wms/EmptyState";
import { PutawayDialog } from "../components/wms/PutawayDialog";
import { DataTableHeaderRow, StatusBadge, StatusTabCount, StickyActionTableCell, StickyActionTableHead } from "../components/business";
import { putawayStatusMap } from "../configs/wmsStatusMap";
import { confirmPutawayOrder, listPutawayOrders, setSelectedInboundId, type PutawayOrder } from "../services/mock";
import { toast } from "sonner";

interface PutawayListPageProps {
  onNavigate?: (path: string) => void;
}

export default function PutawayListPage({ onNavigate }: PutawayListPageProps) {
  const [loading, setLoading] = useState(false);
  const [putawayOrders, setPutawayOrders] = useState<PutawayOrder[]>(() => listPutawayOrders());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseAreaFilter, setWarehouseAreaFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [putawayDialogOpen, setPutawayDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PutawayOrder | null>(null);

  // 筛选逻辑
  const filteredOrders = putawayOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.putawayNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.inboundId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.container.containerNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sourceLocationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sourceLocationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesArea =
      warehouseAreaFilter === "all" || order.warehouseArea === warehouseAreaFilter;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && order.status === "待上架") ||
      (activeTab === "inprogress" && order.status === "上架中") ||
      (activeTab === "completed" && order.status === "已上架");

    return matchesSearch && matchesStatus && matchesArea && matchesTab;
  });

  // 统计数据
  const stats = {
    pending: putawayOrders.filter((o) => o.status === "待上架").length,
    inprogress: putawayOrders.filter((o) => o.status === "上架中").length,
    completed: putawayOrders.filter((o) => o.status === "已上架").length,
  };

  const handleViewDetail = (putawayNo: string) => {
    if (onNavigate) {
      onNavigate(`/putaway/detail/${putawayNo}`);
    }
  };

  const handleStartPutaway = (order: PutawayOrder) => {
    setSelectedOrder(order);
    setPutawayDialogOpen(true);
  };

  const handlePutawayConfirm = (data: any) => {
    if (selectedOrder) {
      const updatedOrder = confirmPutawayOrder(selectedOrder.putawayNo, data);
      if (updatedOrder) {
        setPutawayOrders(listPutawayOrders());
        toast.success(`上架完成，${updatedOrder.totalQty} 件已从暂存库位转入可用库存`);
      }
    }
    setPutawayDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  if (loading) {
    return (
      <WMSLayout 
        title="上架管理" 
        currentPath="/putaway/management"
        onNavigate={handleNavigate}
      >
        <LoadingState message="加载上架任务中..." />
      </WMSLayout>
    );
  }

  return (
    <WMSLayout 
      title="上架管理" 
      currentPath="/putaway/management"
      onNavigate={handleNavigate}
    >
    <div className="p-6 space-y-6">

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-5">
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">待上架单据</div>
              <div className="text-3xl text-warning-600">{stats.pending}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">上架中单据</div>
              <div className="text-3xl text-primary">{stats.inprogress}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">已完成单据</div>
              <div className="text-3xl text-success-600">{stats.completed}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索区域 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索上架单号、入库单号、容器号、暂存库位、客户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="待上架">待上架</SelectItem>
              <SelectItem value="上架中">上架中</SelectItem>
              <SelectItem value="已上架">已上架</SelectItem>
            </SelectContent>
          </Select>
          <Select value={warehouseAreaFilter} onValueChange={setWarehouseAreaFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="仓库区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              <SelectItem value="A区">A区</SelectItem>
              <SelectItem value="B区">B区</SelectItem>
              <SelectItem value="C区">C区</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setWarehouseAreaFilter("all");
          }}>
            <Filter className="w-4 h-4" />
            重置
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            导出
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>
      </div>

      {/* 数据表格 - 使用Tab分组 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="overflow-x-auto pb-1">
            <TabsList className="w-max">
              <TabsTrigger value="pending" className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                待上架
                <StatusTabCount count={stats.pending} inverseOnActive />
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                上架中
                <StatusTabCount count={stats.inprogress} inverseOnActive />
              </TabsTrigger>
              <TabsTrigger value="completed" className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                已完成
                <StatusTabCount count={stats.completed} inverseOnActive />
              </TabsTrigger>
              <TabsTrigger value="all" className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                全部
                <StatusTabCount count={putawayOrders.length} inverseOnActive />
              </TabsTrigger>
            </TabsList>

            <div className="mt-5">
              {filteredOrders.length === 0 ? (
                <EmptyState 
                  icon={Package}
                  message="暂无上架单据"
                  description="当前筛选条件下没有找到上架单据"
                />
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table className="min-w-[1180px]">
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>上架单号</TableHead>
                        <TableHead>入库单号</TableHead>
                        <TableHead>客户名称</TableHead>
                        <TableHead>仓库区域</TableHead>
                        <TableHead>来源暂存库位</TableHead>
                        <TableHead>容器信息</TableHead>
                        <TableHead className="text-right">SKU数</TableHead>
                        <TableHead className="text-right">总数量</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <StickyActionTableHead>操作</StickyActionTableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.putawayNo}
                          className="hover:bg-table-row-hover transition-colors"
                        >
                          <TableCell>
                            <a
                              href="#"
                              className="font-mono text-primary hover:underline text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleViewDetail(order.putawayNo);
                              }}
                            >
                              {order.putawayNo}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a
                              href="#"
                              className="font-mono text-primary hover:underline text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedInboundId(order.inboundId);
                                handleNavigate("/inbound/detail");
                              }}
                            >
                              {order.inboundId}
                            </a>
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            {order.warehouseArea ? (
                              <Badge variant="secondary">{order.warehouseArea}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {order.sourceLocationCode}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {order.sourceLocationName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Badge variant="outline" className="font-mono text-xs">
                                {order.container.containerNo}
                              </Badge>
                              <span className="text-muted-foreground text-xs">
                                ({order.container.containerType})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {order.skuCount}
                          </TableCell>
                          <TableCell className="text-right">
                            {order.totalQty}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={order.putawayQty > 0 ? "text-primary" : "text-muted-foreground"}>
                              {order.putawayQty}
                            </span>
                            {order.putawayQty > 0 && order.putawayQty < order.totalQty && (
                              <div className="text-xs text-muted-foreground mt-1">
                                进度: {Math.round((order.putawayQty / order.totalQty) * 100)}%
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge {...putawayStatusMap[order.status]} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {order.createTime}
                            </div>
                          </TableCell>
                          <StickyActionTableCell>
                            <div className="flex items-center justify-end gap-2">
                              {order.status !== "已上架" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStartPutaway(order)}
                                >
                                  <ArrowUpToLine className="w-4 h-4" />
                                  {order.status === "上架中" ? "继续上架" : "上架"}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(order.putawayNo)}
                              >
                                <Eye className="w-4 h-4" />
                                详情
                              </Button>
                            </div>
                          </StickyActionTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>

      {/* 上架操作弹窗 */}
      {putawayDialogOpen && selectedOrder && (
        <PutawayDialog
          open={putawayDialogOpen}
          onOpenChange={setPutawayDialogOpen}
          container={{
            containerNo: selectedOrder.container.containerNo,
            containerType: selectedOrder.container.containerType,
            inboundId: selectedOrder.inboundId,
            receiveTime: selectedOrder.container.receiveTime || selectedOrder.createTime,
            customerName: selectedOrder.customerName,
            skuCount: selectedOrder.items.length,
            totalQty: selectedOrder.totalQty,
            items: selectedOrder.items.map(item => ({
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
