import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Plus, Eye, Search, Printer, Package
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { toast } from "sonner";
import { ReceiveDialog } from "../components/wms/ReceiveDialog";

// 模拟数据
const inboundOrders = [
  {
    id: "IB001042102963",
    note: "-",
    createdQty: "0/70",
    productCount: 300,
    skuInfo: "多个SKU",
    referenceNo: "-",
    tracking: "托盘/卡板",
    deliveryMethod: "-",
    estimatedDate: "-",
    customer: "ab00-HK买汇",
    status: "pending",
  },
  {
    id: "IB001042102961",
    note: "-",
    createdQty: "0/50",
    productCount: 300,
    skuInfo: "多个SKU",
    referenceNo: "-",
    tracking: "托盘/卡板",
    deliveryMethod: "-",
    estimatedDate: "-",
    customer: "ab00-HK买汇",
    status: "pending",
  },
  {
    id: "IB001040300965",
    note: "-",
    createdQty: "0/1",
    productCount: 1,
    skuInfo: "sdfds * 1",
    referenceNo: "1223",
    tracking: "快递包裹",
    deliveryMethod: "-",
    estimatedDate: "-",
    customer: "ab00-HK买汇",
    status: "in_progress",
  },
  {
    id: "IB001040300961",
    note: "-",
    createdQty: "0/1",
    productCount: 1,
    skuInfo: "sdfds * 1",
    referenceNo: "-",
    tracking: "快递包裹",
    deliveryMethod: "-",
    estimatedDate: "-",
    customer: "ab00-HK买汇",
    status: "in_progress",
  },
  {
    id: "IB001040223963",
    note: "紧急入库",
    createdQty: "30/30",
    productCount: 30,
    skuInfo: "dddddddds * 30",
    referenceNo: "REF-2024-0998",
    tracking: "箱",
    deliveryMethod: "送货 (顺丰)",
    estimatedDate: "2024-10-15",
    customer: "ab00-HK买汇",
    status: "completed",
  },
  {
    id: "IB001040220955",
    note: "-",
    createdQty: "1/1",
    productCount: 1,
    skuInfo: "testetesteteste * 1",
    referenceNo: "-",
    tracking: "快递包裹",
    deliveryMethod: "快递",
    estimatedDate: "2024-10-18",
    customer: "ab00-HK买汇",
    status: "completed",
  },
  {
    id: "IB001024092365",
    note: "大批量入库",
    createdQty: "2300/2300",
    productCount: 2300,
    skuInfo: "qqdzxcz-001 * 2300",
    referenceNo: "REF-2024-0995",
    tracking: "箱",
    deliveryMethod: "送货 (2025P)",
    estimatedDate: "2024-09-09",
    customer: "ab00-HK买汇",
    status: "shelved",
  },
  {
    id: "IB001023088745",
    note: "已上架A区",
    createdQty: "150/150",
    productCount: 150,
    skuInfo: "产品-ABC-001 * 150",
    referenceNo: "REF-2024-0890",
    tracking: "托盘/卡板",
    deliveryMethod: "送货 (德邦)",
    estimatedDate: "2024-09-20",
    customer: "ab00-HK买汇",
    status: "shelved",
  },
  {
    id: "IB001022056321",
    note: "客户取消订单",
    createdQty: "0/200",
    productCount: 200,
    skuInfo: "多个SKU",
    referenceNo: "-",
    tracking: "托盘/卡板",
    deliveryMethod: "-",
    estimatedDate: "-",
    customer: "ab00-HK买汇",
    status: "cancelled",
  },
  {
    id: "IB001021034512",
    note: "供应商延期",
    createdQty: "0/80",
    productCount: 80,
    skuInfo: "产品-XYZ-002 * 80",
    referenceNo: "REF-2024-0756",
    tracking: "箱",
    deliveryMethod: "-",
    estimatedDate: "2024-08-30",
    customer: "ab00-HK买汇",
    status: "cancelled",
  },
];
interface InboundListPageProps {
  onNavigate?: (path: string) => void;
}

export default function InboundListPage({ onNavigate }: InboundListPageProps) {
  const [orders, setOrders] = useState<typeof inboundOrders>(() => {
    if (typeof window === "undefined") return inboundOrders;
    const stored = sessionStorage.getItem("wms_mock_inbound_orders");
    if (stored) {
      return JSON.parse(stored);
    }
    sessionStorage.setItem("wms_mock_inbound_orders", JSON.stringify(inboundOrders));
    return inboundOrders;
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleReceive = (data: any) => {
    console.log("收货数据:", data);
    const receiveQty = data.items.reduce((sum: number, item: any) => sum + item.currentReceiveQty, 0);
    
    // 更新本地订单状态
    const updatedOrders = orders.map((order) => {
      if (order.id === currentOrderId) {
        const [current, totalStr] = order.createdQty.split("/");
        const total = parseInt(totalStr) || 0;
        const newCreated = Math.min(total, (parseInt(current) || 0) + receiveQty);
        const newCreatedQty = `${newCreated}/${total}`;
        
        // 自动将状态设为已完成
        const newStatus = newCreated >= total ? "completed" : "in_progress";
        
        return {
          ...order,
          createdQty: newCreatedQty,
          status: newStatus,
          note: data.note ? data.note : order.note,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    sessionStorage.setItem("wms_mock_inbound_orders", JSON.stringify(updatedOrders));
    
    toast.success(`收货成功！容器 ${data.container.containerNo}，共 ${receiveQty} 件`);
    setReceiveDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
      pending: { 
        label: "待处理", 
        bg: "hsl(40 96% 95%)", 
        text: "hsl(40 96% 35%)",
        border: "hsl(40 96% 85%)"
      },
      in_progress: { 
        label: "处理中", 
        bg: "hsl(218 92% 95%)", 
        text: "hsl(218 92% 35%)",
        border: "hsl(218 92% 85%)"
      },
      completed: { 
        label: "已完成", 
        bg: "hsl(142 76% 95%)", 
        text: "hsl(142 76% 30%)",
        border: "hsl(142 76% 85%)"
      },
      shelved: { 
        label: "已上架", 
        bg: "hsl(267 84% 95%)", 
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)"
      },
      cancelled: { 
        label: "已取消", 
        bg: "hsl(0 0% 95%)", 
        text: "hsl(0 0% 40%)",
        border: "hsl(0 0% 85%)"
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
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
      title="入库管理" 
      currentPath="/inbound/management"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-5">
        {/* Status Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              全部
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              待入库 <Badge variant="secondary">31</Badge>
            </TabsTrigger>
            <TabsTrigger value="receiving" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              收货中 <Badge variant="secondary">245</Badge>
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              已收货 <Badge variant="secondary">7810</Badge>
            </TabsTrigger>
            <TabsTrigger value="shelved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              已上架
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
              <SelectValue placeholder="入库单号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_no">入库单号</SelectItem>
              <SelectItem value="ref_no">参考单号</SelectItem>
              <SelectItem value="tracking">追踪号</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="搜索..." className="w-64" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="创建方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="import">导入</SelectItem>
              <SelectItem value="manual">手动创建</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="货运方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="express">快递</SelectItem>
              <SelectItem value="truck">卡车</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="客户名称/编号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              <SelectItem value="customer1">ab00-HK买汇</SelectItem>
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
                checked={selectedOrders.length === orders.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                已选择 {selectedOrders.length} 项
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={selectedOrders.length === 0}
                onClick={() => setPrintDialogOpen(true)}
              >
                <Printer className="w-4 h-4" />
                批量打印
              </Button>
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
                    checked={selectedOrders.length === orders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>入库单号</TableHead>
                <TableHead>单注</TableHead>
                <TableHead>已创建数量/总数量</TableHead>
                <TableHead>产品数量</TableHead>
                <TableHead>SKU * 数量</TableHead>
                <TableHead>参考单号</TableHead>
                <TableHead>跟踪单/追踪号</TableHead>
                <TableHead>到货方式</TableHead>
                <TableHead>预计到货日期</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate("/inbound/detail");
                      }}
                    >
                      {order.id}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.note}</TableCell>
                  <TableCell>{order.createdQty}</TableCell>
                  <TableCell>{order.productCount}</TableCell>
                  <TableCell className="text-sm">{order.skuInfo}</TableCell>
                  <TableCell className="text-muted-foreground">{order.referenceNo}</TableCell>
                  <TableCell>{order.tracking}</TableCell>
                  <TableCell className="text-muted-foreground">{order.deliveryMethod}</TableCell>
                  <TableCell className="text-muted-foreground">{order.estimatedDate}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleNavigate("/inbound/detail")}
                      >
                        <Eye className="w-4 h-4" />
                        查看
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCurrentOrderId(order.id);
                          setReceiveDialogOpen(true);
                        }}
                        disabled={order.status === "completed" || order.status === "cancelled" || order.status === "shelved"}
                      >
                        <Package className="w-4 h-4" />
                        收货
                      </Button>
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
            共 {orders.length} 条
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

      {/* 批量打印提示弹窗 */}
      <AlertDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>批量打印功能</AlertDialogTitle>
            <AlertDialogDescription>
              此功能为后期规划功能，目前暂无。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setPrintDialogOpen(false)}>
              知道了
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 收货弹窗 */}
      <ReceiveDialog
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
        inboundId={currentOrderId}
        items={mockInboundItems}
        onConfirm={handleReceive}
      />
    </WMSLayout>
  );
}

// 模拟入库单商品数据
const mockInboundItems = [
  {
    sku: "SKU-001",
    productName: "无线蓝牙耳机",
    barcode: "6901234567890",
    spec: "黑色/标准版",
    plannedQty: 100,
    receivedQty: 0,
  },
  {
    sku: "SKU-002",
    productName: "智能手环",
    barcode: "6901234567891",
    spec: "运动版/蓝色",
    plannedQty: 50,
    receivedQty: 0,
  },
  {
    sku: "SKU-003",
    productName: "充电宝",
    barcode: "6901234567892",
    spec: "20000mAh",
    plannedQty: 80,
    receivedQty: 0,
  },
];