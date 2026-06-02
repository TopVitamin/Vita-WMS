import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, Search, Package, MapPin, Calendar
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

// 模拟数据 - 商品库存
const productInventoryData = [
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    specs: "黑色/标准版",
    totalQty: 1250,
    availableQty: 950,
    lockedQty: 250,
    frozenQty: 50,
    customer: "Amazon-US",
    lastInboundDate: "2024-10-20",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-002",
    productName: "智能手环",
    specs: "白色/旗舰版",
    totalQty: 2300,
    availableQty: 2100,
    lockedQty: 150,
    frozenQty: 50,
    customer: "eBay-UK",
    lastInboundDate: "2024-10-18",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-003",
    productName: "运动水杯",
    specs: "蓝色/500ml",
    totalQty: 850,
    availableQty: 700,
    lockedQty: 100,
    frozenQty: 50,
    customer: "Walmart-CA",
    lastInboundDate: "2024-10-15",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-004",
    productName: "USB-C数据线",
    specs: "白色/1.5m",
    totalQty: 3500,
    availableQty: 3200,
    lockedQty: 250,
    frozenQty: 50,
    customer: "Amazon-US",
    lastInboundDate: "2024-10-22",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-005",
    productName: "手机支架",
    specs: "黑色/磁吸版",
    totalQty: 1100,
    availableQty: 900,
    lockedQty: 150,
    frozenQty: 50,
    customer: "Amazon-EU",
    lastInboundDate: "2024-10-19",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop",
  },
];

// 模拟数据 - 商品-库位库存
const productLocationInventoryData = [
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    location: "A-01-01-01",
    warehouseArea: "A区",
    totalQty: 500,
    availableQty: 400,
    lockedQty: 80,
    frozenQty: 20,
    customer: "Amazon-US",
    lastInboundDate: "2024-10-20",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    location: "A-01-02-03",
    warehouseArea: "A区",
    totalQty: 750,
    availableQty: 550,
    lockedQty: 170,
    frozenQty: 30,
    customer: "Amazon-US",
    lastInboundDate: "2024-10-18",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-002",
    productName: "智能手环",
    location: "B-02-01-05",
    warehouseArea: "B区",
    totalQty: 1200,
    availableQty: 1100,
    lockedQty: 80,
    frozenQty: 20,
    customer: "eBay-UK",
    lastInboundDate: "2024-10-18",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-002",
    productName: "智能手环",
    location: "B-02-03-02",
    warehouseArea: "B区",
    totalQty: 1100,
    availableQty: 1000,
    lockedQty: 70,
    frozenQty: 30,
    customer: "eBay-UK",
    lastInboundDate: "2024-10-17",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-003",
    productName: "运动水杯",
    location: "C-03-01-01",
    warehouseArea: "C区",
    totalQty: 850,
    availableQty: 700,
    lockedQty: 100,
    frozenQty: 50,
    customer: "Walmart-CA",
    lastInboundDate: "2024-10-15",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
];

// 模拟数据 - 商品-批次库存
const productBatchInventoryData = [
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241020-001",
    productionDate: "2024-09-15",
    expiryDate: "2026-09-15",
    totalQty: 600,
    availableQty: 450,
    lockedQty: 120,
    frozenQty: 30,
    inboundDate: "2024-10-20",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    productionDate: "2024-09-10",
    expiryDate: "2026-09-10",
    totalQty: 650,
    availableQty: 500,
    lockedQty: 130,
    frozenQty: 20,
    inboundDate: "2024-10-18",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-002",
    productName: "智能手环",
    batchNo: "BATCH-20241018-003",
    productionDate: "2024-09-12",
    expiryDate: "2026-09-12",
    totalQty: 2300,
    availableQty: 2100,
    lockedQty: 150,
    frozenQty: 50,
    inboundDate: "2024-10-18",
    customer: "eBay-UK",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-003",
    productName: "运动水杯",
    batchNo: "BATCH-20241015-004",
    productionDate: "2024-09-05",
    expiryDate: "2026-09-05",
    totalQty: 850,
    availableQty: 700,
    lockedQty: 100,
    frozenQty: 50,
    inboundDate: "2024-10-15",
    customer: "Walmart-CA",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-004",
    productName: "USB-C数据线",
    batchNo: "BATCH-20241022-005",
    productionDate: "2024-09-20",
    expiryDate: "2027-09-20",
    totalQty: 3500,
    availableQty: 3200,
    lockedQty: 250,
    frozenQty: 50,
    inboundDate: "2024-10-22",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop",
  },
];

// 模拟数据 - 商品-批次-库位库存
const productBatchLocationInventoryData = [
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241020-001",
    location: "A-01-01-01",
    warehouseArea: "A区",
    productionDate: "2024-09-15",
    expiryDate: "2026-09-15",
    totalQty: 300,
    availableQty: 230,
    lockedQty: 60,
    frozenQty: 10,
    inboundDate: "2024-10-20",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241020-001",
    location: "A-01-02-03",
    warehouseArea: "A区",
    productionDate: "2024-09-15",
    expiryDate: "2026-09-15",
    totalQty: 300,
    availableQty: 220,
    lockedQty: 60,
    frozenQty: 20,
    inboundDate: "2024-10-20",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    location: "A-01-01-01",
    warehouseArea: "A区",
    productionDate: "2024-09-10",
    expiryDate: "2026-09-10",
    totalQty: 200,
    availableQty: 170,
    lockedQty: 20,
    frozenQty: 10,
    inboundDate: "2024-10-18",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-001",
    productName: "无线蓝牙耳机",
    batchNo: "BATCH-20241018-002",
    location: "A-01-02-03",
    warehouseArea: "A区",
    productionDate: "2024-09-10",
    expiryDate: "2026-09-10",
    totalQty: 450,
    availableQty: 330,
    lockedQty: 110,
    frozenQty: 10,
    inboundDate: "2024-10-18",
    customer: "Amazon-US",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
  },
  {
    sku: "SKU-2024-002",
    productName: "智能手环",
    batchNo: "BATCH-20241018-003",
    location: "B-02-01-05",
    warehouseArea: "B区",
    productionDate: "2024-09-12",
    expiryDate: "2026-09-12",
    totalQty: 1200,
    availableQty: 1100,
    lockedQty: 80,
    frozenQty: 20,
    inboundDate: "2024-10-18",
    customer: "eBay-UK",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
  },
];

interface InventoryListPageProps {
  onNavigate?: (path: string) => void;
}

export default function InventoryListPage({ onNavigate }: InventoryListPageProps) {
  const [activeTab, setActiveTab] = useState("product");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 根据当前Tab选择数据
  const getCurrentData = () => {
    switch (activeTab) {
      case "product":
        return productInventoryData;
      case "product-location":
        return productLocationInventoryData;
      case "product-batch":
        return productBatchInventoryData;
      case "product-batch-location":
        return productBatchLocationInventoryData;
      default:
        return productInventoryData;
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

  // 渲染商品库存表格
  const renderProductInventoryTable = () => (
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
          <TableHead>规格/属性</TableHead>
          <TableHead className="text-right">总库存</TableHead>
          <TableHead className="text-right">可用库存</TableHead>
          <TableHead className="text-right">锁定库存</TableHead>
          <TableHead className="text-right">冻结库存</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => (
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
            <TableCell className="text-muted-foreground">{item.specs}</TableCell>
            <TableCell className="text-right font-mono">{item.totalQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-success-600">{item.availableQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-warning-600">{item.lockedQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">{item.frozenQty.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // 渲染商品-库位库存表格
  const renderProductLocationInventoryTable = () => (
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
          <TableHead>仓库区域</TableHead>
          <TableHead>库位编号</TableHead>
          <TableHead className="text-right">总库存</TableHead>
          <TableHead className="text-right">可用库存</TableHead>
          <TableHead className="text-right">锁定库存</TableHead>
          <TableHead className="text-right">冻结库存</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => (
          <TableRow
            key={`product-location-${index}`}
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
            <TableCell>
              <Badge variant="secondary">{item.warehouseArea}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                <MapPin className="w-3 h-3 mr-1" />
                {item.location}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono">{item.totalQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-success-600">{item.availableQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-warning-600">{item.lockedQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">{item.frozenQty.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // 渲染商品-批次库存表格
  const renderProductBatchInventoryTable = () => (
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
          <TableHead>批次号</TableHead>
          <TableHead>生产日期</TableHead>
          <TableHead>过期日期</TableHead>
          <TableHead className="text-right">总库存</TableHead>
          <TableHead className="text-right">可用库存</TableHead>
          <TableHead className="text-right">锁定库存</TableHead>
          <TableHead className="text-right">冻结库存</TableHead>
          <TableHead>入库日期</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => (
          <TableRow
            key={`product-batch-${index}`}
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
            <TableCell>
              <Badge variant="outline" className="font-mono">
                <Package className="w-3 h-3 mr-1" />
                {item.batchNo}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.productionDate}</TableCell>
            <TableCell className="text-muted-foreground">{item.expiryDate}</TableCell>
            <TableCell className="text-right font-mono">{item.totalQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-success-600">{item.availableQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-warning-600">{item.lockedQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">{item.frozenQty.toLocaleString()}</TableCell>
            <TableCell className="text-muted-foreground">{item.inboundDate}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // 渲染商品-批次-库位库存表格
  const renderProductBatchLocationInventoryTable = () => (
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
          <TableHead>仓库区域</TableHead>
          <TableHead>批次号</TableHead>
          <TableHead>库位编号</TableHead>
          <TableHead>生产日期</TableHead>
          <TableHead>过期日期</TableHead>
          <TableHead className="text-right">总库存</TableHead>
          <TableHead className="text-right">可用库存</TableHead>
          <TableHead className="text-right">锁定库存</TableHead>
          <TableHead className="text-right">冻结库存</TableHead>
          <TableHead>入库日期</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item: any, index) => (
          <TableRow
            key={`product-batch-location-${index}`}
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
            <TableCell>
              <Badge variant="secondary">{item.warehouseArea}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                <Package className="w-3 h-3 mr-1" />
                {item.batchNo}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                <MapPin className="w-3 h-3 mr-1" />
                {item.location}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.productionDate}</TableCell>
            <TableCell className="text-muted-foreground">{item.expiryDate}</TableCell>
            <TableCell className="text-right font-mono">{item.totalQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-success-600">{item.availableQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-warning-600">{item.lockedQty.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">{item.frozenQty.toLocaleString()}</TableCell>
            <TableCell className="text-muted-foreground">{item.inboundDate}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </TableCell>
          </TableRow>
        ))}
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
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="产品分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="electronics">电子产品</SelectItem>
                <SelectItem value="accessories">配件</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case "product-location":
        return (
          <>
            <Input placeholder="搜索SKU编号/产品名称..." className="w-64" />
            <Input placeholder="库位编号..." className="w-40" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="仓库区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区域</SelectItem>
                <SelectItem value="a">A区</SelectItem>
                <SelectItem value="b">B区</SelectItem>
                <SelectItem value="c">C区</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon-us">Amazon-US</SelectItem>
                <SelectItem value="ebay-uk">eBay-UK</SelectItem>
                <SelectItem value="walmart-ca">Walmart-CA</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case "product-batch":
        return (
          <>
            <Input placeholder="搜索SKU编号/产品名称..." className="w-64" />
            <Input placeholder="批次号..." className="w-48" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" placeholder="入库开始日期" className="w-40" />
              <span className="text-muted-foreground">至</span>
              <Input type="date" placeholder="入库结束日期" className="w-40" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon-us">Amazon-US</SelectItem>
                <SelectItem value="ebay-uk">eBay-UK</SelectItem>
                <SelectItem value="walmart-ca">Walmart-CA</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      case "product-batch-location":
        return (
          <>
            <Input placeholder="搜索SKU编号/产品名称..." className="w-64" />
            <Input placeholder="批次号..." className="w-48" />
            <Input placeholder="库位编号..." className="w-40" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="仓库区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区域</SelectItem>
                <SelectItem value="a">A区</SelectItem>
                <SelectItem value="b">B区</SelectItem>
                <SelectItem value="c">C区</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" placeholder="入库开始日期" className="w-40" />
              <span className="text-muted-foreground">至</span>
              <Input type="date" placeholder="入库结束日期" className="w-40" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon-us">Amazon-US</SelectItem>
                <SelectItem value="ebay-uk">eBay-UK</SelectItem>
                <SelectItem value="walmart-ca">Walmart-CA</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  // 计算选中项的汇总统计
  const calculateSummary = () => {
    if (selectedItems.length === 0) return null;

    const selectedData = currentData.filter((_, index) =>
      selectedItems.includes(`${activeTab}-${index}`)
    );

    const summary = selectedData.reduce(
      (acc: any, item: any) => ({
        totalQty: acc.totalQty + item.totalQty,
        availableQty: acc.availableQty + item.availableQty,
        lockedQty: acc.lockedQty + item.lockedQty,
        frozenQty: acc.frozenQty + item.frozenQty,
      }),
      { totalQty: 0, availableQty: 0, lockedQty: 0, frozenQty: 0 }
    );

    return summary;
  };

  const summary = calculateSummary();

  return (
    <WMSLayout 
      title="库存查询" 
      currentPath="/inventory/query"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-5">
        {/* Granularity Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger 
              value="product" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              商品库存
            </TabsTrigger>
            <TabsTrigger 
              value="product-location" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              商品-库位库存
            </TabsTrigger>
            <TabsTrigger 
              value="product-batch" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              商品-批次库存
            </TabsTrigger>
            <TabsTrigger 
              value="product-batch-location" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              商品-批次-库位库存
            </TabsTrigger>
          </TabsList>

          {/* Filter Section */}
          <div className="flex items-center gap-3 flex-wrap mt-5">
            {renderFilters()}
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
          <div className="space-y-2 mt-5">
            {/* Action Bar */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.length === currentData.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  已选择 {selectedItems.length} 项
                </span>
                {summary && (
                  <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                    <span className="text-sm">
                      汇总 - 总库存: <span className="font-mono">{summary.totalQty.toLocaleString()}</span>
                    </span>
                    <span className="text-sm text-success-600">
                      可用: <span className="font-mono">{summary.availableQty.toLocaleString()}</span>
                    </span>
                    <span className="text-sm text-warning-600">
                      锁定: <span className="font-mono">{summary.lockedQty.toLocaleString()}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      冻结: <span className="font-mono">{summary.frozenQty.toLocaleString()}</span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  批量导出
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              {activeTab === "product" && renderProductInventoryTable()}
              {activeTab === "product-location" && renderProductLocationInventoryTable()}
              {activeTab === "product-batch" && renderProductBatchInventoryTable()}
              {activeTab === "product-batch-location" && renderProductBatchLocationInventoryTable()}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5">
            <div className="text-sm text-muted-foreground">
              共 {currentData.length} 条
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
        </Tabs>
      </div>
    </WMSLayout>
  );
}