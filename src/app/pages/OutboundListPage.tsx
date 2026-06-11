import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Plus, MoreHorizontal, Eye, Search, Layers, X, Package
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { outboundOrderStatusMap, outboundTypeStatusMap, orderStructureStatusMap } from "../configs/wmsStatusMap";
import {
  createPickingWorkFromOutboundOrder,
  createWaveFromOutboundOrders,
  listOutboundOrders,
  setSelectedWaveId,
  type OutboundOrder,
} from "../services/mock";
import { toast } from "sonner";

interface OutboundListPageProps {
  onNavigate?: (path: string) => void;
}

export default function OutboundListPage({ onNavigate }: OutboundListPageProps) {
  const [outboundOrders, setOutboundOrders] = useState<OutboundOrder[]>(() => listOutboundOrders());
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchField, setSearchField] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [outboundTypeFilter, setOutboundTypeFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [waveFilter, setWaveFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const statusTabs = [
    { value: "all", label: "全部", statuses: [] },
    { value: "pending_wave", label: "待分波", statuses: ["pending"] },
    { value: "waved", label: "已分波", statuses: ["waved"] },
    { value: "pending_pick", label: "待拣货", statuses: ["pending_pick"] },
    { value: "picking", label: "拣货中", statuses: ["picking"] },
    { value: "pending_review", label: "待复核", statuses: ["pending_review"] },
    { value: "pending_pack", label: "待打包", statuses: ["pending_pack"] },
    { value: "pending_weight", label: "待称重", statuses: ["pending_weight"] },
    { value: "pending_ship", label: "待出库", statuses: ["pending_ship"] },
    { value: "shipped", label: "已出库", statuses: ["shipped", "completed"] },
    { value: "exception", label: "异常/取消", statuses: ["exception", "cancelled"] },
  ];

  const getTabCount = (statuses: string[]) => {
    if (statuses.length === 0) return outboundOrders.length;
    return outboundOrders.filter((order) => statuses.includes(order.status)).length;
  };

  const activeTab = statusTabs.find((tab) => tab.value === activeStatus) ?? statusTabs[0];
  const filteredOrders =
    activeTab.statuses.length === 0
      ? outboundOrders
      : outboundOrders.filter((order) => activeTab.statuses.includes(order.status));
  const visibleOrders = filteredOrders.filter((order) => {
    if (outboundTypeFilter !== "all" && order.outboundType !== outboundTypeFilter) return false;
    if (orderTypeFilter !== "all" && order.orderType !== orderTypeFilter) return false;
    if (waveFilter === "waved" && !order.waveNo) return false;
    if (waveFilter === "not_waved" && order.waveNo) return false;
    if (customerFilter !== "all" && order.customer !== customerFilter) return false;
    if (carrierFilter !== "all" && order.carrier !== carrierFilter) return false;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      const fieldValues: Record<string, string> = {
        order_no: order.id,
        wave_no: order.waveNo || "",
        platform_order: order.orderNo,
        tracking: order.trackingNo || "",
        picking_no: order.pickingWorkNo || "",
        customer: order.customer,
        picker: order.picker || "",
        all: [order.id, order.waveNo || "", order.orderNo, order.trackingNo || "", order.pickingWorkNo || "", order.customer, order.picker || "", order.carrier].join(" "),
      };
      if (!fieldValues[searchField].toLowerCase().includes(keyword)) return false;
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedOrders.length === outboundOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(outboundOrders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // 检查选中订单的分波状态
  const getSelectedOrdersWaveStatus = () => {
    const selected = outboundOrders.filter((order) => selectedOrders.includes(order.id));
    if (selected.length === 0) return null;
    
    const hasWaved = selected.some((order) => order.waveNo);
    const hasNotWaved = selected.some((order) => !order.waveNo && order.status === "pending");
    
    if (hasWaved && hasNotWaved) return "mixed";
    if (hasWaved) return "waved";
    return "not_waved";
  };

  const waveStatus = getSelectedOrdersWaveStatus();


  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const refreshOrders = () => {
    setOutboundOrders(listOutboundOrders());
  };

  const handleCreateWave = (targetOrderIds = selectedOrders) => {
    const eligibleIds = targetOrderIds.filter((orderId) => {
      const order = outboundOrders.find((item) => item.id === orderId);
      return order && !order.waveNo && order.status === "pending";
    });
    const wave = createWaveFromOutboundOrders(eligibleIds, { picker: "李四" });
    if (wave) {
      refreshOrders();
      setSelectedOrders([]);
      toast.success(`已创建波次 ${wave.id}，包含 ${wave.orderCount} 个出库单`);
    } else {
      toast.error("请选择待处理且未分波的出库单");
    }
  };

  const handleCreateOrderPicking = (order: OutboundOrder) => {
    const work = createPickingWorkFromOutboundOrder(order.id, { picker: "张三" });
    if (work) {
      refreshOrders();
      toast.success(`已生成按单拣货单 ${work.taskNo}`);
    }
  };

  return (
    <WMSLayout 
      title="出库管理" 
      currentPath="/outbound/management"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-5">
        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="h-auto flex-wrap justify-start">
            {statusTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
                <StatusTabCount count={getTabCount(tab.statuses)} inverseOnActive />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filter Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="出库单号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部字段</SelectItem>
              <SelectItem value="order_no">出库单号</SelectItem>
              <SelectItem value="wave_no">波次号</SelectItem>
              <SelectItem value="platform_order">订单号</SelectItem>
              <SelectItem value="tracking">追踪号</SelectItem>
              <SelectItem value="picking_no">拣货单号</SelectItem>
              <SelectItem value="customer">客户</SelectItem>
              <SelectItem value="picker">拣货员</SelectItem>
            </SelectContent>
          </Select>
          <Input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="搜索出库单、波次、订单、运单、客户..." className="w-80" />
          <Select value={outboundTypeFilter} onValueChange={setOutboundTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="出库类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="sales">销售出库</SelectItem>
              <SelectItem value="transfer">调拨出库</SelectItem>
              <SelectItem value="return">退货出库</SelectItem>
              <SelectItem value="other">其他出库</SelectItem>
            </SelectContent>
          </Select>
          <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="订单类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="single_single">单品单件</SelectItem>
              <SelectItem value="single_multi">单品多件</SelectItem>
              <SelectItem value="multi_mixed">多品混合</SelectItem>
            </SelectContent>
          </Select>
          <Select value={waveFilter} onValueChange={setWaveFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="分波状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="waved">已分波</SelectItem>
              <SelectItem value="not_waved">未分波</SelectItem>
            </SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="客户名称/编号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              <SelectItem value="Amazon-US">Amazon-US</SelectItem>
              <SelectItem value="Shopify-EU">Shopify-EU</SelectItem>
              <SelectItem value="eBay-UK">eBay-UK</SelectItem>
              <SelectItem value="Walmart-US">Walmart-US</SelectItem>
              <SelectItem value="深圳仓库">深圳仓库</SelectItem>
            </SelectContent>
          </Select>
          <Select value={carrierFilter} onValueChange={setCarrierFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="承运商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="FedEx">FedEx</SelectItem>
              <SelectItem value="DHL">DHL</SelectItem>
              <SelectItem value="UPS">UPS</SelectItem>
              <SelectItem value="USPS">USPS</SelectItem>
              <SelectItem value="顺丰">顺丰</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Search className="w-4 h-4" />
            搜索
          </Button>
          <Button variant="outline" onClick={() => {
            setActiveStatus("all");
            setSearchField("all");
            setSearchKeyword("");
            setOutboundTypeFilter("all");
            setOrderTypeFilter("all");
            setWaveFilter("all");
            setCustomerFilter("all");
            setCarrierFilter("all");
          }}>
            <Filter className="w-4 h-4" />
            重置
          </Button>
        </div>

        {/* Table with Action Bar */}
        <div className="space-y-2">
          {/* Action Bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedOrders.length === outboundOrders.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                已选择 {selectedOrders.length} 项
              </span>
            </div>
            <div className="flex gap-2">
              {waveStatus === "not_waved" && (
                <Button variant="outline" size="sm" onClick={() => handleCreateWave()}>
                  <Layers className="w-4 h-4" />
                  批量分波
                </Button>
              )}
              {waveStatus === "waved" && (
                <Button variant="outline" size="sm">
                  <X className="w-4 h-4" />
                  移除波次
                </Button>
              )}
              {waveStatus === "mixed" && (
                <Button variant="outline" size="sm" disabled>
                  <Layers className="w-4 h-4" />
                  请选择相同分波状态
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                导出
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <DataTableHeaderRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === outboundOrders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>出库单号</TableHead>
                <TableHead>波次号</TableHead>
                <TableHead>出库类型</TableHead>
                <TableHead>订单类型</TableHead>
                <TableHead>客户名称</TableHead>
                <TableHead>订单号</TableHead>
                <TableHead>SKU数量</TableHead>
                <TableHead>商品总数</TableHead>
                <TableHead>出库状态</TableHead>
                <TableHead>拣货员</TableHead>
                <TableHead>计划发货时间</TableHead>
                <TableHead>承运商</TableHead>
                <TableHead>追踪号</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </DataTableHeaderRow>
            </TableHeader>
            <TableBody>
              {visibleOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className={`hover:bg-table-row-hover transition-colors ${selectedOrders.includes(order.id) ? "bg-table-row-hover" : ""}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => handleSelectOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="font-mono text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate("/outbound/detail");
                      }}
                    >
                      {order.id}
                    </a>
                  </TableCell>
                  <TableCell>
                    {order.waveNo ? (
                      <a
                        href="#"
                        className="font-mono text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedWaveId(order.waveNo);
                          handleNavigate("/wave/detail");
                        }}
                      >
                        {order.waveNo}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell><StatusBadge {...outboundTypeStatusMap[order.outboundType]} /></TableCell>
                  <TableCell><StatusBadge {...orderStructureStatusMap[order.orderType]} /></TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                  <TableCell className="text-center">{order.skuCount}</TableCell>
                  <TableCell className="text-center">{order.totalQty}</TableCell>
                  <TableCell>
                    <StatusBadge {...(outboundOrderStatusMap[order.status] ?? outboundOrderStatusMap.pending_wave)} />
                  </TableCell>
                  <TableCell className={!order.picker ? "text-muted-foreground" : ""}>
                    {order.picker || "-"}
                  </TableCell>
                  <TableCell className={order.planShipDate === "-" ? "text-muted-foreground" : ""}>
                    {order.planShipDate}
                  </TableCell>
                  <TableCell className={order.carrier === "-" ? "text-muted-foreground" : ""}>
                    {order.carrier}
                  </TableCell>
                  <TableCell>
                    {order.trackingNo ? (
                      <span className="font-mono text-sm">{order.trackingNo}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{order.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleNavigate("/outbound/detail")}
                      >
                        <Eye className="w-4 h-4" />
                        查看
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="flex items-center gap-1">
                              操作
                              <MoreHorizontal className="w-4 h-4" />
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!order.waveNo ? (
                            <>
                              <DropdownMenuItem onClick={() => handleCreateWave([order.id])}>
                                <Layers className="w-4 h-4 mr-2" />
                                手动分波
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCreateOrderPicking(order)}>
                                <Package className="w-4 h-4 mr-2" />
                                按单生成拣货单
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-error">取消订单</DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem>查看波次</DropdownMenuItem>
                              <DropdownMenuItem>
                                <X className="w-4 h-4 mr-2" />
                                移除波次
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-error">取消订单</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {visibleOrders.length} 条
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                上一页
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                下一页
              </Button>
            </div>
            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 条/页</SelectItem>
                <SelectItem value="20">20 条/页</SelectItem>
                <SelectItem value="50">50 条/页</SelectItem>
                <SelectItem value="100">100 条/页</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">前往</span>
              <Input
                type="number"
                className="w-16 h-8 text-center"
                defaultValue={1}
                min={1}
              />
              <span className="text-sm text-muted-foreground">页</span>
            </div>
          </div>
        </div>
      </div>
    </WMSLayout>
  );
}
