import { useState } from "react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Checkbox } from "../components/ui/checkbox";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search, Plus, Filter, Download, Upload, Edit, Copy,
  MoreVertical, Barcode, Power, PowerOff, RefreshCcw,
  Package, Image as ImageIcon
} from "lucide-react";
import { DataTableHeaderRow, BatchActionBar, DataTableShell, KpiCard, KpiGrid, ListPageLayout, PageHeader, StatusBadge } from "../components/business";
import { enabledStatusMap } from "../configs/wmsStatusMap";
import { StockStatusBadge } from "../components/wms/WmsStatusBadges";
import { listSkus } from "../services/mock";
import type { SkuItem } from "../types/wms";

interface SKUListPageProps {
  onNavigate: (path: string) => void;
}

export default function SKUListPage({ onNavigate }: SKUListPageProps) {
  const skuData = listSkus();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [hasStockFilter, setHasStockFilter] = useState("all");

  // 筛选数据
  const filteredData = skuData.filter((item: SkuItem) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (!item.skuCode.toLowerCase().includes(keyword) &&
          !item.productName.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (customerFilter !== "all" && item.customerName !== customerFilter) return false;
    if (hasStockFilter === "has" && item.currentStock === 0) return false;
    if (hasStockFilter === "none" && item.currentStock > 0) return false;
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

  // 批量操作
  const handleBatchExport = () => {
    toast.success(`已生成 ${selectedItems.length} 条SKU数据的导出任务`);
  };

  const handleBatchPrintBarcode = () => {
    toast.success(`已发送 ${selectedItems.length} 个SKU的条码打印任务`);
  };

  // 统计数据
  const totalSKU = skuData.length;
  const activeSKU = skuData.filter(item => item.status === "启用").length;
  const lowStockSKU = skuData.filter(item => item.currentStock < item.safetyStock).length;
  const noStockSKU = skuData.filter(item => item.currentStock === 0).length;

  return (
    <WMSLayout title="SKU管理" currentPath="/master-data/skus" onNavigate={onNavigate}>
      <ListPageLayout
        header={
          <PageHeader
            title="SKU管理"
            description="维护 SKU 基础资料、条码、客户归属和库存策略。"
          />
        }
        kpis={
          <KpiGrid columns={4}>
          <KpiCard label="总SKU数" value={totalSKU} unit="个" />
          <KpiCard label="启用中" value={activeSKU} unit="个" tone="success" />
          <KpiCard label="库存不足" value={lowStockSKU} unit="个" tone="warning" />
          <KpiCard label="零库存" value={noStockSKU} unit="个" tone="error" />
          </KpiGrid>
        }
        filters={
            <div className="grid grid-cols-12 gap-3">
              {/* 搜索框 */}
              <div className="col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="SKU编码 / 商品名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 客户筛选 */}
              <div className="col-span-2">
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="客户名称" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部客户</SelectItem>
                    <SelectItem value="维他很忙">维他很忙</SelectItem>
                    <SelectItem value="跨境小王">跨境小王</SelectItem>
                    <SelectItem value="电商老李">电商老李</SelectItem>
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
                    <SelectItem value="启用">启用</SelectItem>
                    <SelectItem value="停用">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 库存筛选 */}
              <div className="col-span-2">
                <Select value={hasStockFilter} onValueChange={setHasStockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="库存状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="has">有库存</SelectItem>
                    <SelectItem value="none">零库存</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 高级筛选按钮 */}
              <div className="col-span-1">
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  高级
                </Button>
              </div>

              {/* 重置按钮 */}
              <div className="col-span-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchKeyword("");
                    setStatusFilter("all");
                    setCustomerFilter("all");
                    setHasStockFilter("all");
                  }}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  重置
                </Button>
              </div>

              {/* 新建SKU按钮 */}
              <div className="col-span-1">
                <Button className="w-full" onClick={() => onNavigate("/master-data/skus/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  新建
                </Button>
              </div>
            </div>
        }
        batchActions={
              <BatchActionBar selectedCount={selectedItems.length}>
                <Button variant="outline" size="sm" onClick={handleBatchExport}>
                  <Download className="w-4 h-4 mr-2" />
                  批量导出
                </Button>
                <Button variant="outline" size="sm" onClick={handleBatchPrintBarcode}>
                  <Barcode className="w-4 h-4 mr-2" />
                  批量打印条码
                </Button>
              </BatchActionBar>
        }
        table={
          <DataTableShell
          pagination={
            filteredData.length > 0 ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  显示 {filteredData.length} 条结果，共 {skuData.length} 条
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
            ) : null
          }
        >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <DataTableHeaderRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[140px]">SKU编码</TableHead>
                    <TableHead className="w-[200px]">商品信息</TableHead>
                    <TableHead className="w-[120px]">客户名称</TableHead>
                    <TableHead className="w-[140px]">商品分类</TableHead>
                    <TableHead className="w-[120px]">规格</TableHead>
                    <TableHead className="w-[140px]">条码</TableHead>
                    <TableHead className="w-[60px]">单位</TableHead>
                    <TableHead className="w-[100px]">尺寸(cm)</TableHead>
                    <TableHead className="w-[80px]">重量(kg)</TableHead>
                    <TableHead className="w-[100px] text-right">当前库存</TableHead>
                    <TableHead className="w-[100px] text-right">安全库存</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[140px]">创建时间</TableHead>
                    <TableHead className="w-[140px]">更新时间</TableHead>
                    <TableHead className="w-[180px] text-right">操作</TableHead>
                  </DataTableHeaderRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <a
                          href="#"
                          className="font-mono text-primary hover:underline text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(`/master-data/skus/${item.id}`);
                          }}
                        >
                          {item.skuCode}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-10 h-10 rounded object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm">{item.productName}</span>
                            <span className="text-xs text-muted-foreground">{item.productNameEn}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.customerName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.specifications}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{item.barcode}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.unit}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">{item.dimensions}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.weight}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm tabular-nums">{item.currentStock.toLocaleString()}</span>
                          <StockStatusBadge currentStock={item.currentStock} safetyStock={item.safetyStock} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-muted-foreground">{item.safetyStock.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge {...enabledStatusMap[item.status]} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.createTime}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.updateTime}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate(`/master-data/skus/${item.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.success(`已复制 SKU：${item.skuCode}`)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast.info(`正在打开 ${item.skuCode} 的库存明细`)}>
                                <Package className="w-4 h-4 mr-2" />
                                查看库存明细
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`已发送 ${item.skuCode} 的条码打印任务`)}>
                                <Barcode className="w-4 h-4 mr-2" />
                                打印条码
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toast.success(item.status === "启用" ? `已停用 SKU：${item.skuCode}` : `已启用 SKU：${item.skuCode}`)}
                              >
                                {item.status === "启用" ? (
                                  <>
                                    <PowerOff className="w-4 h-4 mr-2" />
                                    停用
                                  </>
                                ) : (
                                  <>
                                    <Power className="w-4 h-4 mr-2" />
                                    启用
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 空状态 */}
            {filteredData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg mb-2">暂无SKU数据</p>
                <p className="text-sm">调整筛选条件或创建新的SKU</p>
              </div>
            )}
          </DataTableShell>
        }
      />
    </WMSLayout>
  );
}
