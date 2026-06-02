import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Search, Package, MapPin, Calendar, FileText
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// 模拟数据 - 商品维度流水
const productTransactionData = [
  {
    transactionId: "TXN-2024102801",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "入库单",
    documentNo: "IB-20241028-001",
    inventoryChange: {
      total: { before: 750, after: 1250, change: 500 },
      available: { before: 600, after: 1100, change: 500 },
      locked: { before: 100, after: 100, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 10:30:25",
    operator: "张三",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102802",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "出库单",
    documentNo: "OB-20241028-015",
    inventoryChange: {
      total: { before: 1250, after: 1130, change: -120 },
      available: { before: 1100, after: 980, change: -120 },
      locked: { before: 100, after: 100, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 14:20:18",
    operator: "李四",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102803",
    sku: "SKU-2024-002",
    productName: "智能手环",
    customer: "eBay-UK",
    warehouse: "伦敦仓",
    documentType: "库存锁定",
    documentNo: "LOCK-20241028-008",
    inventoryChange: {
      total: { before: 2300, after: 2300, change: 0 },
      available: { before: 2100, after: 1950, change: -150 },
      locked: { before: 150, after: 300, change: 150 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 09:15:42",
    operator: "王五",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102804",
    sku: "SKU-2024-003",
    productName: "运动水杯",
    customer: "Walmart-CA",
    warehouse: "多伦多仓",
    documentType: "盘点调整",
    documentNo: "COUNT-20241028-003",
    inventoryChange: {
      total: { before: 880, after: 850, change: -30 },
      available: { before: 730, after: 700, change: -30 },
      locked: { before: 100, after: 100, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 16:45:30",
    operator: "赵六",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102805",
    sku: "SKU-2024-004",
    productName: "USB-C数据线",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "入库单",
    documentNo: "IB-20241028-002",
    inventoryChange: {
      total: { before: 2500, after: 3500, change: 1000 },
      available: { before: 2200, after: 3200, change: 1000 },
      locked: { before: 250, after: 250, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 11:20:15",
    operator: "张三",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102806",
    sku: "SKU-2024-005",
    productName: "手机支架",
    customer: "Amazon-EU",
    warehouse: "法兰克福仓",
    documentType: "出库单",
    documentNo: "OB-20241028-022",
    inventoryChange: {
      total: { before: 1300, after: 1100, change: -200 },
      available: { before: 1050, after: 850, change: -200 },
      locked: { before: 200, after: 200, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 15:30:50",
    operator: "李四",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102807",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "库存解锁",
    documentNo: "UNLOCK-20241028-005",
    inventoryChange: {
      total: { before: 1130, after: 1130, change: 0 },
      available: { before: 980, after: 1030, change: 50 },
      locked: { before: 100, after: 50, change: -50 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 17:10:22",
    operator: "王五",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
];

// 模拟数据 - 商品-批次-库位维度流水
const detailedTransactionData = [
  {
    transactionId: "TXN-2024102801-D1",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241020-001",
    location: "A-01-01-01",
    warehouseArea: "A区",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "入库单",
    documentNo: "IB-20241028-001",
    inventoryChange: {
      total: { before: 0, after: 300, change: 300 },
      available: { before: 0, after: 300, change: 300 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 0, after: 0, change: 0 },
    },
    operationTime: "2024-10-28 10:30:25",
    operator: "张三",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102801-D2",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241020-001",
    location: "A-01-02-03",
    warehouseArea: "A区",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "入库单",
    documentNo: "IB-20241028-001",
    inventoryChange: {
      total: { before: 0, after: 200, change: 200 },
      available: { before: 0, after: 200, change: 200 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 0, after: 0, change: 0 },
    },
    operationTime: "2024-10-28 10:30:25",
    operator: "张三",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102802-D1",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    location: "A-01-01-01",
    warehouseArea: "A区",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "出库单",
    documentNo: "OB-20241028-015",
    inventoryChange: {
      total: { before: 200, after: 120, change: -80 },
      available: { before: 200, after: 120, change: -80 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 0, after: 0, change: 0 },
    },
    operationTime: "2024-10-28 14:20:18",
    operator: "李四",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102802-D2",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    location: "A-01-02-03",
    warehouseArea: "A区",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "出库单",
    documentNo: "OB-20241028-015",
    inventoryChange: {
      total: { before: 450, after: 410, change: -40 },
      available: { before: 450, after: 410, change: -40 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 0, after: 0, change: 0 },
    },
    operationTime: "2024-10-28 14:20:18",
    operator: "李四",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102803-D1",
    sku: "SKU-2024-002",
    productName: "智能手环",
    batchNo: "BATCH-20241018-003",
    location: "B-02-01-05",
    warehouseArea: "B区",
    customer: "eBay-UK",
    warehouse: "伦敦仓",
    documentType: "库存锁定",
    documentNo: "LOCK-20241028-008",
    inventoryChange: {
      total: { before: 1200, after: 1200, change: 0 },
      available: { before: 1100, after: 950, change: -150 },
      locked: { before: 80, after: 230, change: 150 },
      frozen: { before: 20, after: 20, change: 0 },
    },
    operationTime: "2024-10-28 09:15:42",
    operator: "王五",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102804-D1",
    sku: "SKU-2024-003",
    productName: "运动水杯",
    batchNo: "BATCH-20241015-004",
    location: "C-03-01-01",
    warehouseArea: "C区",
    customer: "Walmart-CA",
    warehouse: "多伦多仓",
    documentType: "盘点调整",
    documentNo: "COUNT-20241028-003",
    inventoryChange: {
      total: { before: 880, after: 850, change: -30 },
      available: { before: 730, after: 700, change: -30 },
      locked: { before: 100, after: 100, change: 0 },
      frozen: { before: 50, after: 50, change: 0 },
    },
    operationTime: "2024-10-28 16:45:30",
    operator: "赵六",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
  {
    transactionId: "TXN-2024102805-D1",
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    location: "A-01-01-01",
    warehouseArea: "A区",
    customer: "Amazon-US",
    warehouse: "洛杉矶仓",
    documentType: "库存冻结",
    documentNo: "FREEZE-20241028-002",
    inventoryChange: {
      total: { before: 120, after: 120, change: 0 },
      available: { before: 120, after: 90, change: -30 },
      locked: { before: 0, after: 0, change: 0 },
      frozen: { before: 0, after: 30, change: 30 },
    },
    operationTime: "2024-10-28 18:20:15",
    operator: "赵六",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
];

interface InventoryTransactionPageProps {
  onNavigate?: (path: string) => void;
}

export default function InventoryTransactionPage({ onNavigate }: InventoryTransactionPageProps) {
  const [activeTab, setActiveTab] = useState("product");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 根据当前Tab选择数据
  const getCurrentData = () => {
    switch (activeTab) {
      case "product":
        return productTransactionData;
      case "detailed":
        return detailedTransactionData;
      default:
        return productTransactionData;
    }
  };

  const currentData = getCurrentData();

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map((_, index) => `${activeTab}-${index}`));
    }
  };

  const handleSelectItem = (index: number) => {
    const itemId = `${activeTab}-${index}`;
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // 获取单据类型Badge样式
  const getDocumentTypeBadge = (type: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      "入库单": { variant: "outline", className: "border-success-500 text-success-700 bg-success-50" },
      "出库单": { variant: "outline", className: "border-warning-500 text-warning-700 bg-warning-50" },
      "库存锁定": { variant: "outline", className: "border-gray-400 text-gray-700 bg-gray-50" },
      "库存解锁": { variant: "outline", className: "border-info-500 text-info-700 bg-info-50" },
      "库存冻结": { variant: "outline", className: "border-error-400 text-error-700 bg-error-50" },
      "盘点调整": { variant: "outline", className: "border-purple-500 text-purple-700 bg-purple-50" },
      "调拨单": { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50" },
    };
    return styles[type] || { variant: "outline" as const, className: "" };
  };

  // 渲染库存变动明细
  const renderInventoryChangeDetail = (inventoryChange: any) => {
    const renderChangeLine = (label: string, before: number, after: number, change: number, colorClass?: string) => {
      const changeText = change > 0 ? `+${change.toLocaleString()}` : change < 0 ? change.toLocaleString() : '0';
      const changeColor = change > 0 ? 'text-success-600' : change < 0 ? 'text-error-600' : 'text-muted-foreground';
      
      return (
        <div className="flex items-center gap-2 text-xs leading-relaxed">
          <span className="text-muted-foreground min-w-[4rem]">{label}：</span>
          <span className="font-mono">{before.toLocaleString()}</span>
          <span className="text-muted-foreground">→</span>
          <span className={`font-mono ${colorClass || ''}`}>{after.toLocaleString()}</span>
          <span className={`font-mono ${changeColor}`}>({changeText})</span>
        </div>
      );
    };

    return (
      <div className="py-1 space-y-0.5">
        {renderChangeLine('总库存', inventoryChange.total.before, inventoryChange.total.after, inventoryChange.total.change)}
        {renderChangeLine('可用库存', inventoryChange.available.before, inventoryChange.available.after, inventoryChange.available.change, 'text-success-600')}
        {renderChangeLine('锁定库存', inventoryChange.locked.before, inventoryChange.locked.after, inventoryChange.locked.change, 'text-warning-600')}
        {renderChangeLine('冻结库存', inventoryChange.frozen.before, inventoryChange.frozen.after, inventoryChange.frozen.change, 'text-muted-foreground')}
      </div>
    );
  };

  // 渲染商品维度流水表格
  const renderProductTransactionTable = () => (
    <Table>
      <TableHeader>
        <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedItems.length === currentData.length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>产品图片</TableHead>
          <TableHead>SKU编号</TableHead>
          <TableHead>产品名称</TableHead>
          <TableHead>所属客户</TableHead>
          <TableHead>所属仓库</TableHead>
          <TableHead>单据类型</TableHead>
          <TableHead>单据号</TableHead>
          <TableHead className="min-w-[280px]">库存变动明细</TableHead>
          <TableHead>操作时间</TableHead>
          <TableHead>操作人</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => {
          const docTypeBadge = getDocumentTypeBadge(item.documentType);
          return (
            <TableRow
              key={`product-${index}`}
              className="hover:bg-table-row-hover transition-colors"
              style={{
                backgroundColor: selectedItems.includes(`${activeTab}-${index}`)
                  ? "var(--table-row-hover)"
                  : undefined,
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(`${activeTab}-${index}`)}
                  onCheckedChange={() => handleSelectItem(index)}
                />
              </TableCell>
              <TableCell>
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-12 h-12 rounded object-cover"
                />
              </TableCell>
              <TableCell>
                <code className="text-sm font-mono text-primary">{item.sku}</code>
              </TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.customer}</TableCell>
              <TableCell className="text-muted-foreground">{item.warehouse}</TableCell>
              <TableCell>
                <Badge variant={docTypeBadge.variant} className={docTypeBadge.className}>
                  {item.documentType}
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-sm font-mono text-muted-foreground">{item.documentNo}</code>
              </TableCell>
              <TableCell>
                {renderInventoryChangeDetail(item.inventoryChange)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{item.operationTime}</TableCell>
              <TableCell className="text-muted-foreground">{item.operator}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  查看详情
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  // 渲染商品-批次-库位维度流水表格
  const renderDetailedTransactionTable = () => (
    <Table>
      <TableHeader>
        <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedItems.length === currentData.length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>产品图片</TableHead>
          <TableHead>SKU编号</TableHead>
          <TableHead>产品名称</TableHead>
          <TableHead>所属客户</TableHead>
          <TableHead>所属仓库</TableHead>
          <TableHead>批次号</TableHead>
          <TableHead>库位</TableHead>
          <TableHead>单据类型</TableHead>
          <TableHead>单据号</TableHead>
          <TableHead className="min-w-[280px]">库存变动明细</TableHead>
          <TableHead>操作时间</TableHead>
          <TableHead>操作人</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => {
          const docTypeBadge = getDocumentTypeBadge(item.documentType);
          return (
            <TableRow
              key={`detailed-${index}`}
              className="hover:bg-table-row-hover transition-colors"
              style={{
                backgroundColor: selectedItems.includes(`${activeTab}-${index}`)
                  ? "var(--table-row-hover)"
                  : undefined,
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(`${activeTab}-${index}`)}
                  onCheckedChange={() => handleSelectItem(index)}
                />
              </TableCell>
              <TableCell>
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-12 h-12 rounded object-cover"
                />
              </TableCell>
              <TableCell>
                <code className="text-sm font-mono text-primary">{item.sku}</code>
              </TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.customer}</TableCell>
              <TableCell className="text-muted-foreground">{item.warehouse}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  <Package className="w-3 h-3 mr-1" />
                  {item.batchNo}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="text-xs w-fit">{item.warehouseArea}</Badge>
                  <Badge variant="outline" className="font-mono text-xs w-fit">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={docTypeBadge.variant} className={docTypeBadge.className}>
                  {item.documentType}
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-sm font-mono text-muted-foreground">{item.documentNo}</code>
              </TableCell>
              <TableCell>
                {renderInventoryChangeDetail(item.inventoryChange)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{item.operationTime}</TableCell>
              <TableCell className="text-muted-foreground">{item.operator}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  查看详情
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  // 渲染筛选条件
  const renderFilters = () => {
    switch (activeTab) {
      case "product":
        return (
          <>
            <Input placeholder="搜索SKU编号/产品名称..." className="w-64" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon-us">Amazon-US</SelectItem>
                <SelectItem value="ebay-uk">eBay-UK</SelectItem>
                <SelectItem value="walmart-ca">Walmart-CA</SelectItem>
                <SelectItem value="amazon-eu">Amazon-EU</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部仓库</SelectItem>
                <SelectItem value="la">洛杉矶仓</SelectItem>
                <SelectItem value="london">伦敦仓</SelectItem>
                <SelectItem value="toronto">多伦多仓</SelectItem>
                <SelectItem value="frankfurt">法兰克福仓</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="单据类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="inbound">入库单</SelectItem>
                <SelectItem value="outbound">出库单</SelectItem>
                <SelectItem value="lock">库存锁定</SelectItem>
                <SelectItem value="unlock">库存解锁</SelectItem>
                <SelectItem value="freeze">库存冻结</SelectItem>
                <SelectItem value="count">盘点调整</SelectItem>
                <SelectItem value="transfer">调拨单</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" placeholder="开始日期" className="w-40" />
              <span className="text-muted-foreground">至</span>
              <Input type="date" placeholder="结束日期" className="w-40" />
            </div>
          </>
        );
      case "detailed":
        return (
          <>
            <Input placeholder="搜索SKU编号/产品名称..." className="w-64" />
            <Input placeholder="批次号..." className="w-48" />
            <Input placeholder="库位编号..." className="w-40" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon-us">Amazon-US</SelectItem>
                <SelectItem value="ebay-uk">eBay-UK</SelectItem>
                <SelectItem value="walmart-ca">Walmart-CA</SelectItem>
                <SelectItem value="amazon-eu">Amazon-EU</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部仓库</SelectItem>
                <SelectItem value="la">洛杉矶仓</SelectItem>
                <SelectItem value="london">伦敦仓</SelectItem>
                <SelectItem value="toronto">多伦多仓</SelectItem>
                <SelectItem value="frankfurt">法兰克福仓</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="单据类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="inbound">入库单</SelectItem>
                <SelectItem value="outbound">出库单</SelectItem>
                <SelectItem value="lock">库存锁定</SelectItem>
                <SelectItem value="unlock">库存解锁</SelectItem>
                <SelectItem value="freeze">库存冻结</SelectItem>
                <SelectItem value="count">盘点调整</SelectItem>
                <SelectItem value="transfer">调拨单</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" placeholder="开始日期" className="w-40" />
              <span className="text-muted-foreground">至</span>
              <Input type="date" placeholder="结束日期" className="w-40" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <WMSLayout title="库存流水查询" currentPath="/inventory/transaction" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 页面标题和操作区 */}
        <div className="flex items-center justify-between">
          <div>
            <h2>库存流水查询</h2>
            <p className="text-muted-foreground mt-1">
              查询和追溯库存变动记录，支持按商品汇总和明细追溯两种维度
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出流水
            </Button>
          </div>
        </div>

        {/* Tab切换和内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="product">按商品维度</TabsTrigger>
            <TabsTrigger value="detailed">按商品-批次-库位维度</TabsTrigger>
          </TabsList>

          {/* 筛选区域 */}
          <div className="mt-6 p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {renderFilters()}
              <Button>
                <Search className="w-4 h-4 mr-2" />
                查询
              </Button>
              <Button variant="outline">重置</Button>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm">
                已选择 <span className="text-primary">{selectedItems.length}</span> 条记录
              </span>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出选中
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  取消选择
                </Button>
              </div>
            </div>
          )}

          {/* 商品维度Tab */}
          <TabsContent value="product" className="mt-6 space-y-4">
            <div className="rounded-lg border bg-card overflow-hidden">
              {renderProductTransactionTable()}
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                共 {productTransactionData.length} 条记录
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">条</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1}>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm">
                    下一页
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 商品-批次-库位维度Tab */}
          <TabsContent value="detailed" className="mt-6 space-y-4">
            <div className="rounded-lg border bg-card overflow-hidden">
              {renderDetailedTransactionTable()}
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                共 {detailedTransactionData.length} 条记录
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每页显示</span>
                  <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">条</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1}>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm">
                    下一页
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </WMSLayout>
  );
}
