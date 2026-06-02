import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Plus, MoreHorizontal, Eye, Search, Layers, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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

// 模拟数据
const outboundOrders = [
  {
    id: "OB001042103501",
    waveNo: "-",
    outboundType: "sales",
    orderType: "single_single",
    customer: "Amazon-US",
    orderNo: "AMZ-2024-100563",
    skuCount: 1,
    totalQty: 1,
    status: "pending_wave",
    picker: "-",
    planShipDate: "2024-10-28",
    carrier: "FedEx",
    trackingNo: "-",
    createdAt: "2024-10-27 10:23",
  },
  {
    id: "OB001042103502",
    waveNo: "-",
    outboundType: "sales",
    orderType: "single_multi",
    customer: "Shopify-EU",
    orderNo: "SPF-2024-088745",
    skuCount: 1,
    totalQty: 5,
    status: "pending_wave",
    picker: "-",
    planShipDate: "2024-10-28",
    carrier: "DHL",
    trackingNo: "-",
    createdAt: "2024-10-27 09:15",
  },
  {
    id: "OB001042103503",
    waveNo: "-",
    outboundType: "sales",
    orderType: "multi_mixed",
    customer: "eBay-UK",
    orderNo: "EBAY-2024-056321",
    skuCount: 3,
    totalQty: 8,
    status: "pending_wave",
    picker: "-",
    planShipDate: "2024-10-29",
    carrier: "UPS",
    trackingNo: "-",
    createdAt: "2024-10-27 08:45",
  },
  {
    id: "OB001042003498",
    waveNo: "WAVE-2024-0028",
    outboundType: "sales",
    orderType: "single_single",
    customer: "Amazon-US",
    orderNo: "AMZ-2024-100321",
    skuCount: 1,
    totalQty: 1,
    status: "waved",
    picker: "张三",
    planShipDate: "2024-10-28",
    carrier: "FedEx",
    trackingNo: "-",
    createdAt: "2024-10-20 14:20",
  },
  {
    id: "OB001042003499",
    waveNo: "WAVE-2024-0028",
    outboundType: "sales",
    orderType: "single_multi",
    customer: "Walmart-US",
    orderNo: "WMT-2024-087654",
    skuCount: 1,
    totalQty: 10,
    status: "waved",
    picker: "张三",
    planShipDate: "2024-10-28",
    carrier: "USPS",
    trackingNo: "-",
    createdAt: "2024-10-20 14:22",
  },
  {
    id: "OB001041503480",
    waveNo: "WAVE-2024-0027",
    outboundType: "sales",
    orderType: "multi_mixed",
    customer: "Amazon-EU",
    orderNo: "AMZ-EU-2024-034512",
    skuCount: 5,
    totalQty: 25,
    status: "picking",
    picker: "李四",
    planShipDate: "2024-10-27",
    carrier: "DHL",
    trackingNo: "-",
    createdAt: "2024-10-15 11:30",
  },
  {
    id: "OB001041003450",
    waveNo: "WAVE-2024-0026",
    outboundType: "transfer",
    orderType: "multi_mixed",
    customer: "深圳仓库",
    orderNo: "TR-2024-002365",
    skuCount: 8,
    totalQty: 100,
    status: "shipped",
    picker: "王五",
    planShipDate: "2024-10-25",
    carrier: "顺丰",
    trackingNo: "SF1234567890",
    createdAt: "2024-10-10 09:15",
  },
  {
    id: "OB001040803421",
    waveNo: "WAVE-2024-0025",
    outboundType: "sales",
    orderType: "single_single",
    customer: "Target-US",
    orderNo: "TGT-2024-098745",
    skuCount: 1,
    totalQty: 1,
    status: "completed",
    picker: "赵六",
    planShipDate: "2024-10-22",
    carrier: "UPS",
    trackingNo: "1Z999AA10123456784",
    createdAt: "2024-10-08 16:40",
  },
  {
    id: "OB001040203398",
    waveNo: "-",
    outboundType: "sales",
    orderType: "single_multi",
    customer: "Amazon-JP",
    orderNo: "AMZ-JP-2024-076543",
    skuCount: 1,
    totalQty: 20,
    status: "cancelled",
    picker: "-",
    planShipDate: "-",
    carrier: "-",
    trackingNo: "-",
    createdAt: "2024-10-02 13:25",
  },
  {
    id: "OB001039903375",
    waveNo: "-",
    outboundType: "return",
    orderType: "multi_mixed",
    customer: "Shopify-CA",
    orderNo: "RET-2024-005678",
    skuCount: 3,
    totalQty: 5,
    status: "cancelled",
    picker: "-",
    planShipDate: "-",
    carrier: "-",
    trackingNo: "-",
    createdAt: "2024-09-29 10:10",
  },
];

interface OutboundListPageProps {
  onNavigate?: (path: string) => void;
}

export default function OutboundListPage({ onNavigate }: OutboundListPageProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
    
    const hasWaved = selected.some((order) => order.waveNo !== "-");
    const hasNotWaved = selected.some((order) => order.waveNo === "-");
    
    if (hasWaved && hasNotWaved) return "mixed";
    if (hasWaved) return "waved";
    return "not_waved";
  };

  const waveStatus = getSelectedOrdersWaveStatus();

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
      pending_wave: { 
        label: "待分波", 
        bg: "hsl(40 96% 95%)", 
        text: "hsl(40 96% 35%)",
        border: "hsl(40 96% 85%)"
      },
      waved: { 
        label: "已分波", 
        bg: "hsl(218 92% 95%)", 
        text: "hsl(218 92% 35%)",
        border: "hsl(218 92% 85%)"
      },
      picking: { 
        label: "拣货中", 
        bg: "hsl(267 84% 95%)", 
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)"
      },
      shipped: { 
        label: "已发货", 
        bg: "hsl(142 76% 95%)", 
        text: "hsl(142 76% 30%)",
        border: "hsl(142 76% 85%)"
      },
      completed: { 
        label: "已完成", 
        bg: "hsl(0 0% 95%)", 
        text: "hsl(0 0% 40%)",
        border: "hsl(0 0% 85%)"
      },
      cancelled: { 
        label: "已取消", 
        bg: "hsl(0 0% 95%)", 
        text: "hsl(0 0% 40%)",
        border: "hsl(0 0% 85%)"
      },
    };
    const config = statusConfig[status] || statusConfig.pending_wave;
    return (
      <Badge 
        variant="outline"
        style={{ 
          backgroundColor: config.bg, 
          color: config.text,
          borderColor: config.border
        }}
      >
        {config.label}
      </Badge>
    );
  };

  const getOutboundTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      sales: { label: "销售出库", variant: "default" },
      transfer: { label: "调拨出库", variant: "secondary" },
      return: { label: "退货出库", variant: "outline" },
      other: { label: "其他出库", variant: "outline" },
    };
    const config = typeConfig[type] || typeConfig.other;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getOrderTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
      single_single: { 
        label: "单品单件", 
        bg: "hsl(218 92% 95%)", 
        text: "hsl(218 92% 35%)",
        border: "hsl(218 92% 85%)"
      },
      single_multi: { 
        label: "单品多件", 
        bg: "hsl(267 84% 95%)", 
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)"
      },
      multi_mixed: { 
        label: "多品混合", 
        bg: "hsl(28 100% 95%)", 
        text: "hsl(28 100% 35%)",
        border: "hsl(28 100% 85%)"
      },
    };
    const config = typeConfig[type] || typeConfig.single_single;
    return (
      <Badge 
        variant="outline"
        style={{ 
          backgroundColor: config.bg, 
          color: config.text,
          borderColor: config.border
        }}
      >
        {config.label}
      </Badge>
    );
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              全部
            </TabsTrigger>
            <TabsTrigger value="pending_wave" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              待分波 <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="waved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              已分波 <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="picking" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              拣货中 <Badge variant="secondary">1</Badge>
            </TabsTrigger>
            <TabsTrigger value="shipped" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              已发货 <Badge variant="secondary">1</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              已完成
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              已取消
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="出库单号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_no">出库单号</SelectItem>
              <SelectItem value="wave_no">波次号</SelectItem>
              <SelectItem value="platform_order">订单号</SelectItem>
              <SelectItem value="tracking">追踪号</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="搜索..." className="w-64" />
          <Select>
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
          <Select>
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
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="分波状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="waved">已分波</SelectItem>
              <SelectItem value="not_waved">未分波</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="客户名称/编号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              <SelectItem value="amazon_us">Amazon-US</SelectItem>
              <SelectItem value="shopify_eu">Shopify-EU</SelectItem>
              <SelectItem value="ebay_uk">eBay-UK</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="承运商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="fedex">FedEx</SelectItem>
              <SelectItem value="dhl">DHL</SelectItem>
              <SelectItem value="ups">UPS</SelectItem>
              <SelectItem value="usps">USPS</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Search className="w-4 h-4" />
            搜索
          </Button>
          <Button variant="outline">
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
                <Button variant="outline" size="sm">
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
              <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {outboundOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-table-row-hover transition-colors"
                  style={{
                    backgroundColor: selectedOrders.includes(order.id)
                      ? "var(--table-row-hover)"
                      : undefined,
                  }}
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
                    >
                      {order.id}
                    </a>
                  </TableCell>
                  <TableCell>
                    {order.waveNo !== "-" ? (
                      <a
                        href="#"
                        className="font-mono text-primary hover:underline"
                      >
                        {order.waveNo}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getOutboundTypeBadge(order.outboundType)}</TableCell>
                  <TableCell>{getOrderTypeBadge(order.orderType)}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                  <TableCell className="text-center">{order.skuCount}</TableCell>
                  <TableCell className="text-center">{order.totalQty}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className={order.picker === "-" ? "text-muted-foreground" : ""}>
                    {order.picker}
                  </TableCell>
                  <TableCell className={order.planShipDate === "-" ? "text-muted-foreground" : ""}>
                    {order.planShipDate}
                  </TableCell>
                  <TableCell className={order.carrier === "-" ? "text-muted-foreground" : ""}>
                    {order.carrier}
                  </TableCell>
                  <TableCell>
                    {order.trackingNo !== "-" ? (
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
                          {order.waveNo === "-" ? (
                            <>
                              <DropdownMenuItem>
                                <Layers className="w-4 h-4 mr-2" />
                                手动分波
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
            共 {outboundOrders.length} 条
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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