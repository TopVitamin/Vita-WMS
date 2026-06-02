import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
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
import { DataTableShell, InventoryStatusBadge, KpiCard } from "../components/business";
import { listInventoryItems } from "../services/mock";
import type { InventoryItem } from "../types/wms";
import {
  Search, Filter, Download, RefreshCcw, MoreVertical, Package,
  Snowflake, Eye, Lock, Image as ImageIcon
} from "lucide-react";

interface InventoryQueryPageProps {
  onNavigate: (path: string) => void;
}

export default function InventoryQueryPage({ onNavigate }: InventoryQueryPageProps) {
  const inventoryData = listInventoryItems();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alertFilter, setAlerFilter] = useState("all");
  const [showZeroStock, setShowZeroStock] = useState(false);

  // 筛选数据
  const filteredData = inventoryData.filter((item: InventoryItem) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (!item.skuCode.toLowerCase().includes(keyword) &&
          !item.productName.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    if (customerFilter !== "all" && item.customerName !== customerFilter) return false;
    if (statusFilter !== "all" && item.stockStatus !== statusFilter) return false;
    if (alertFilter !== "all") {
      if (alertFilter === "insufficient" && item.totalStock >= item.safetyStock) return false;
      if (alertFilter === "stagnant" && item.inventoryAge < 45) return false;
    }
    if (!showZeroStock && item.totalStock === 0) return false;
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

  // 统计数据
  const totalSKU = inventoryData.length;
  const totalStockQty = inventoryData.reduce((sum, item) => sum + item.totalStock, 0);
  const totalStockValue = totalStockQty * 25.5; // 假设平均单价
  const turnoverRate = 6.5;
  const stagnantRatio = (inventoryData.filter(item => item.inventoryAge > 45).length / totalSKU * 100).toFixed(1);

  // 获取库存状态Badge
  const getStockStatusBadge = (status: InventoryItem["stockStatus"]) => <InventoryStatusBadge status={status} />;

  // 获取库龄显示
  const getInventoryAgeDisplay = (days: number) => {
    if (days <= 7) {
      return <span className="text-success-600">{days}天</span>;
    } else if (days <= 30) {
      return <span className="text-muted-foreground">{days}天</span>;
    } else if (days <= 45) {
      return <span className="text-warning-600">{days}天</span>;
    } else {
      return <span className="text-error-600">{days}天</span>;
    }
  };

  return (
    <WMSLayout title="库存查询" currentPath="/inventory/query" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-5 gap-4">
          <KpiCard label="总SKU数" value={totalSKU} unit="个" />
          <KpiCard label="总库存件数" value={totalStockQty.toLocaleString()} unit="件" />
          <KpiCard label="总库存货值" value={`$${totalStockValue.toLocaleString()}`} helper="+8.2%" tone="success" />
          <KpiCard label="库存周转率" value={turnoverRate} unit="次/月" />
          <KpiCard label="呆滞库存占比" value={`${stagnantRatio}%`} helper="-2.1%" tone="warning" />
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

              {/* 库存状态筛选 */}
              <div className="col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="库存状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="正常">正常</SelectItem>
                    <SelectItem value="不足">库存不足</SelectItem>
                    <SelectItem value="缺货">缺货</SelectItem>
                    <SelectItem value="超储">超储</SelectItem>
                    <SelectItem value="呆滞">呆滞</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 预警筛选 */}
              <div className="col-span-2">
                <Select value={alertFilter} onValueChange={setAlerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="库存预警" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="insufficient">安全库存不足</SelectItem>
                    <SelectItem value="stagnant">呆滞库存</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 显示零库存 */}
              <div className="col-span-1 flex items-center justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={showZeroStock}
                    onCheckedChange={(checked) => setShowZeroStock(checked as boolean)}
                  />
                  <span className="text-sm">零库存</span>
                </label>
              </div>

              {/* 重置按钮 */}
              <div className="col-span-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchKeyword("");
                    setCustomerFilter("all");
                    setStatusFilter("all");
                    setAlerFilter("all");
                    setShowZeroStock(false);
                  }}
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* 导出按钮 */}
              <div className="col-span-1">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  导出
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
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    批量冻结
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 数据表格 */}
        <DataTableShell>
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
                    <TableHead className="w-[140px]">SKU编码</TableHead>
                    <TableHead className="w-[200px]">商品信息</TableHead>
                    <TableHead className="w-[120px]">客户名称</TableHead>
                    <TableHead className="w-[100px] text-right">总库存</TableHead>
                    <TableHead className="w-[100px] text-right">可用库存</TableHead>
                    <TableHead className="w-[100px] text-right">冻结库存</TableHead>
                    <TableHead className="w-[100px] text-right">待检库存</TableHead>
                    <TableHead className="w-[100px] text-right">在途库存</TableHead>
                    <TableHead className="w-[100px] text-right">安全库存</TableHead>
                    <TableHead className="w-[100px]">库存状态</TableHead>
                    <TableHead className="w-[100px]">库位数量</TableHead>
                    <TableHead className="w-[100px]">最后入库</TableHead>
                    <TableHead className="w-[100px]">最后出库</TableHead>
                    <TableHead className="w-[80px]">库龄</TableHead>
                    <TableHead className="w-[120px] text-right">操作</TableHead>
                  </TableRow>
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
                        <span className="font-mono text-sm">{item.skuCode}</span>
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
                            <span className="text-sm font-medium">{item.productName}</span>
                            <span className="text-xs text-muted-foreground">{item.productNameEn}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.customerName}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-medium">{item.totalStock.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-success-600">{item.availableStock.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.frozenStock > 0 ? (
                          <span className="text-sm text-warning-600 flex items-center justify-end gap-1">
                            <Snowflake className="w-3 h-3" />
                            {item.frozenStock.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.qualityCheckStock > 0 ? (
                          <span className="text-sm text-info-600">{item.qualityCheckStock.toLocaleString()}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.inTransitStock > 0 ? (
                          <span className="text-sm text-muted-foreground">{item.inTransitStock.toLocaleString()}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-muted-foreground">{item.safetyStock.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        {getStockStatusBadge(item.stockStatus)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {item.locationCount > 0 ? `${item.locationCount}个库位` : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.lastInboundDate}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.lastOutboundDate}</span>
                      </TableCell>
                      <TableCell>
                        {getInventoryAgeDisplay(item.inventoryAge)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate(`/inventory/detail/${item.skuCode}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            查看明细
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => alert(`冻结库存: ${item.skuCode}`)}>
                                <Lock className="w-4 h-4 mr-2" />
                                冻结库存
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert(`库存调整: ${item.skuCode}`)}>
                                <Package className="w-4 h-4 mr-2" />
                                库存调整
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => alert(`导出库存明细: ${item.skuCode}`)}>
                                <Download className="w-4 h-4 mr-2" />
                                导出明细
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
                <p className="text-lg mb-2">暂无库存数据</p>
                <p className="text-sm">调整筛选条件或检查是否有库存</p>
              </div>
            )}
        </DataTableShell>

        {/* 分页 */}
        {filteredData.length > 0 && (
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  显示 <span className="font-medium">{filteredData.length}</span> 条结果，共 <span className="font-medium">{inventoryData.length}</span> 条
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
