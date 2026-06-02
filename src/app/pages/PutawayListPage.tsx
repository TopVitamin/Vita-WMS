import { useState } from "react";
import { Search, Package, ArrowUpToLine, Filter, Download, RefreshCw, Eye, Calendar, Clock } from "lucide-react";
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

interface PutawayOrder {
  putawayNo: string;
  inboundId: string;
  customerName: string;
  warehouseArea?: string;
  createTime: string;
  status: "待上架" | "上架中" | "已上架";
  container: {
    containerNo: string;
    containerType: string;
    receiveTime?: string;
  };
  skuCount: number;
  totalQty: number;
  putawayQty: number;
  items: {
    sku: string;
    productName: string;
    spec: string;
    qty: number;
    putawayQty: number;
  }[];
}

// 模拟数据 - 上架单
const mockPutawayOrders: PutawayOrder[] = [
  {
    putawayNo: "PA-20250428-0001",
    inboundId: "IB-20250428-0001",
    customerName: "亚马逊美国站",
    createTime: "2025-04-28 09:30:15",
    status: "待上架",
    container: { 
      containerNo: "PLT-20250428-001", 
      containerType: "托盘",
      receiveTime: "2025-04-28 09:30:15"
    },
    skuCount: 5,
    totalQty: 230,
    putawayQty: 0,
    items: [
      {
        sku: "SKU-A001",
        productName: "蓝牙耳机 Pro版",
        spec: "黑色/标准版",
        qty: 50,
        putawayQty: 0,
      },
      {
        sku: "SKU-A002",
        productName: "蓝牙耳机 标准版",
        spec: "白色/标准版",
        qty: 50,
        putawayQty: 0,
      },
      {
        sku: "SKU-A003",
        productName: "充电线 Type-C",
        spec: "1米/白色",
        qty: 50,
        putawayQty: 0,
      },
      {
        sku: "SKU-A004",
        productName: "无线鼠标",
        spec: "黑色/标准版",
        qty: 40,
        putawayQty: 0,
      },
      {
        sku: "SKU-A005",
        productName: "键盘套装",
        spec: "RGB版",
        qty: 40,
        putawayQty: 0,
      },
    ],
  },
  {
    putawayNo: "PA-20250428-0002",
    inboundId: "IB-20250428-0002",
    customerName: "eBay店铺",
    warehouseArea: "B区",
    createTime: "2025-04-28 10:15:33",
    status: "上架中",
    container: { 
      containerNo: "PLT-20250428-003", 
      containerType: "托盘",
      receiveTime: "2025-04-28 10:15:33"
    },
    skuCount: 1,
    totalQty: 100,
    putawayQty: 60,
    items: [
      {
        sku: "SKU-B001",
        productName: "运动水杯",
        spec: "500ml/蓝色",
        qty: 100,
        putawayQty: 60,
      },
    ],
  },
  {
    putawayNo: "PA-20250428-0003",
    inboundId: "IB-20250428-0003",
    customerName: "Shopify独立站",
    warehouseArea: "C区",
    createTime: "2025-04-28 11:20:45",
    status: "上架中",
    container: { 
      containerNo: "PLT-20250428-004", 
      containerType: "托盘",
      receiveTime: "2025-04-28 11:20:45"
    },
    skuCount: 3,
    totalQty: 180,
    putawayQty: 80,
    items: [
      {
        sku: "SKU-C001",
        productName: "手机支架",
        spec: "通用款",
        qty: 60,
        putawayQty: 30,
      },
      {
        sku: "SKU-C002",
        productName: "车载充电器",
        spec: "双口/快充",
        qty: 60,
        putawayQty: 30,
      },
      {
        sku: "SKU-C003",
        productName: "数据线套装",
        spec: "三合一",
        qty: 60,
        putawayQty: 20,
      },
    ],
  },
  {
    putawayNo: "PA-20250427-0005",
    inboundId: "IB-20250427-0003",
    customerName: "Walmart加拿大站",
    warehouseArea: "A区",
    createTime: "2025-04-27 16:20:45",
    status: "已上架",
    container: { 
      containerNo: "PLT-20250427-006", 
      containerType: "托盘",
      receiveTime: "2025-04-27 16:20:45"
    },
    skuCount: 2,
    totalQty: 120,
    putawayQty: 120,
    items: [
      {
        sku: "SKU-D001",
        productName: "保温杯",
        spec: "350ml/银色",
        qty: 60,
        putawayQty: 60,
      },
      {
        sku: "SKU-D002",
        productName: "便携餐盒",
        spec: "双层/蓝色",
        qty: 60,
        putawayQty: 60,
      },
    ],
  },
  {
    putawayNo: "PA-20250427-0004",
    inboundId: "IB-20250427-0002",
    customerName: "Target美国站",
    warehouseArea: "B区",
    createTime: "2025-04-27 14:10:22",
    status: "已上架",
    container: { 
      containerNo: "BOX-20250427-007", 
      containerType: "周转箱",
      receiveTime: "2025-04-27 14:10:22"
    },
    skuCount: 4,
    totalQty: 200,
    putawayQty: 200,
    items: [
      {
        sku: "SKU-E001",
        productName: "防水袋",
        spec: "10L/黑色",
        qty: 50,
        putawayQty: 50,
      },
      {
        sku: "SKU-E002",
        productName: "旅行包",
        spec: "20L/灰色",
        qty: 50,
        putawayQty: 50,
      },
      {
        sku: "SKU-E003",
        productName: "收纳袋套装",
        spec: "5件套",
        qty: 50,
        putawayQty: 50,
      },
      {
        sku: "SKU-E004",
        productName: "鞋包",
        spec: "防尘款",
        qty: 50,
        putawayQty: 50,
      },
    ],
  },
];

interface PutawayListPageProps {
  onNavigate?: (path: string) => void;
}

export default function PutawayListPage({ onNavigate }: PutawayListPageProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseAreaFilter, setWarehouseAreaFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [putawayDialogOpen, setPutawayDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PutawayOrder | null>(null);

  // 筛选逻辑
  const filteredOrders = mockPutawayOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.putawayNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.inboundId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.container.containerNo.toLowerCase().includes(searchQuery.toLowerCase());

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
    pending: mockPutawayOrders.filter((o) => o.status === "待上架").length,
    inprogress: mockPutawayOrders.filter((o) => o.status === "上架中").length,
    completed: mockPutawayOrders.filter((o) => o.status === "已上架").length,
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
    console.log("上架数据:", data);
    setPutawayDialogOpen(false);
    setSelectedOrder(null);
    // 这里应该调用API保存上架数据
  };

  const getStatusBadge = (status: PutawayOrder["status"]) => {
    const variants: Record<PutawayOrder["status"], { variant: any; className: string }> = {
      待上架: { variant: "outline", className: "border-warning-500 text-warning-700 bg-warning-50" },
      上架中: { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50" },
      已上架: { variant: "outline", className: "border-success-500 text-success-700 bg-success-50" },
    };
    return (
      <Badge variant={variants[status].variant} className={variants[status].className}>
        {status}
      </Badge>
    );
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
              <div className="text-3xl text-blue-600">{stats.inprogress}</div>
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索上架单号、入库单号、容器号、客户..."
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
        <div className="flex items-center gap-2">
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="w-4 h-4 mr-2" />
                待上架 ({stats.pending})
              </TabsTrigger>
              <TabsTrigger 
                value="inprogress"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="w-4 h-4 mr-2" />
                上架中 ({stats.inprogress})
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ArrowUpToLine className="w-4 h-4 mr-2" />
                已完成 ({stats.completed})
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                全部 ({mockPutawayOrders.length})
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
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
                        <TableHead>上架单号</TableHead>
                        <TableHead>入库单号</TableHead>
                        <TableHead>客户名称</TableHead>
                        <TableHead>仓库区域</TableHead>
                        <TableHead>容器信息</TableHead>
                        <TableHead className="text-right">SKU数</TableHead>
                        <TableHead className="text-right">总数量</TableHead>
                        <TableHead className="text-right">已上架</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.putawayNo}
                          className="hover:bg-table-row-hover transition-colors"
                        >
                          <TableCell>
                            <Button
                              variant="link"
                              className="h-auto p-0 font-mono text-primary"
                              onClick={() => handleViewDetail(order.putawayNo)}
                            >
                              {order.putawayNo}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm font-mono text-muted-foreground">
                              {order.inboundId}
                            </code>
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
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {order.createTime}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
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
                          </TableCell>
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
