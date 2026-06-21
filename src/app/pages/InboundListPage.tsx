import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Plus, Eye, Search, Printer, Package
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import { DataTableHeaderRow, DataTableShell, ListPageLayout, StatusBadge, StatusTabCount, StickyActionTableCell, StickyActionTableHead } from "../components/business";
import { inboundOrderStatusMap } from "../configs/wmsStatusMap";
import { toast } from "sonner";
import { ReceiveDialog } from "../components/wms/ReceiveDialog";
import {
  createPutawayOrderFromReceipt,
  createInspectionTaskFromReceipt,
  getInboundItems,
  getInboundOrder,
  getReceivingStagingLocation,
  listInboundOrders,
  receiveInboundContainer,
  setSelectedInboundId,
  type InboundOrderListItem,
} from "../services/mock";

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
  const [orders, setOrders] = useState<InboundOrderListItem[]>(() => listInboundOrders());

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchField, setSearchField] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");

  const statusTabs = [
    { value: "all", label: "全部", statuses: [] },
    { value: "pending", label: "待收货", statuses: ["pending"] },
    { value: "receiving", label: "收货中", statuses: ["receiving"] },
    { value: "received", label: "已完成", statuses: ["received"] },
    { value: "closed", label: "已关闭", statuses: ["closed"] },
  ];

  const activeTab = statusTabs.find((tab) => tab.value === activeStatus) ?? statusTabs[0];
  const getTabCount = (statuses: string[]) => {
    if (statuses.length === 0) return orders.length;
    return orders.filter((order) => statuses.includes(order.status)).length;
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab.statuses.length > 0 && !activeTab.statuses.includes(order.status)) return false;
    if (deliveryMethodFilter !== "all" && order.deliveryMethod !== deliveryMethodFilter) return false;
    if (customerFilter !== "all" && order.customer !== customerFilter) return false;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      const fieldValues: Record<string, string> = {
        order_no: order.id,
        ref_no: order.referenceNo,
        tracking: order.tracking,
        sku: order.skuInfo,
        customer: order.customer,
        all: [order.id, order.referenceNo, order.tracking, order.skuInfo, order.customer, order.note].join(" "),
      };
      if (!fieldValues[searchField].toLowerCase().includes(keyword)) return false;
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleReceive = (data: any) => {
    try {
      const receiveQty = data.items.reduce((sum: number, item: any) => sum + item.currentReceiveQty, 0);
      const result = receiveInboundContainer(currentOrderId, data);
      const inspectionTask = createInspectionTaskFromReceipt(result.receipt);
      const putawayOrder = inspectionTask ? undefined : createPutawayOrderFromReceipt(result.receipt);

      setOrders(result.orders);
      toast.success(
        inspectionTask
          ? `收货成功！${receiveQty} 件进入 ${result.receipt.stagingLocation.code}，已生成质检任务 ${inspectionTask.taskNo}`
          : `收货成功！${receiveQty} 件进入 ${result.receipt.stagingLocation.code}，已生成上架单 ${putawayOrder!.putawayNo}`
      );
      setReceiveDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "收货失败，请检查输入数据");
    }
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
      <ListPageLayout>
        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full overflow-x-auto pb-1">
          <TabsList className="w-max">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
              <SelectValue placeholder="入库单号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部字段</SelectItem>
              <SelectItem value="order_no">入库单号</SelectItem>
              <SelectItem value="ref_no">参考单号</SelectItem>
              <SelectItem value="tracking">追踪号</SelectItem>
              <SelectItem value="sku">SKU/商品</SelectItem>
              <SelectItem value="customer">客户</SelectItem>
            </SelectContent>
          </Select>
          <Input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="搜索入库单、参考单、追踪号、SKU、客户..." className="w-80" />
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
          <Select value={deliveryMethodFilter} onValueChange={setDeliveryMethodFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="货运方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="快递">快递</SelectItem>
              <SelectItem value="卡车">卡车</SelectItem>
              <SelectItem value="-">未填写</SelectItem>
            </SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="客户名称/编号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              <SelectItem value="ab00-HK买汇">ab00-HK买汇</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Search className="w-4 h-4" />
            搜索
          </Button>
          <Button variant="outline" onClick={() => {
            setSearchField("all");
            setSearchKeyword("");
            setDeliveryMethodFilter("all");
            setCustomerFilter("all");
            setActiveStatus("all");
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
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
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
          <DataTableShell>
          <div className="overflow-x-auto">
          <Table className="min-w-[1260px]">
            <TableHeader>
              <DataTableHeaderRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
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
                <StickyActionTableHead>操作</StickyActionTableHead>
              </DataTableHeaderRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
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
                          setSelectedInboundId(order.id);
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
                  <TableCell>
                    <StatusBadge {...(inboundOrderStatusMap[order.status] ?? inboundOrderStatusMap.pending)} />
                  </TableCell>
                  <StickyActionTableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedInboundId(order.id);
                          handleNavigate("/inbound/detail");
                        }}
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
                        disabled={order.status === "received" || order.status === "closed"}
                      >
                        <Package className="w-4 h-4" />
                        收货
                      </Button>
                    </div>
                  </StickyActionTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          </DataTableShell>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            共 {filteredOrders.length} 条
          </div>
          <div className="flex flex-wrap items-center gap-4">
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
      </ListPageLayout>

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
        items={currentOrderId ? getInboundItems(currentOrderId) : []}
        onConfirm={handleReceive}
        stagingLocation={
          currentOrderId && getInboundOrder(currentOrderId)
            ? getReceivingStagingLocation(getInboundOrder(currentOrderId)!)
            : undefined
        }
      />
    </WMSLayout>
  );
}
