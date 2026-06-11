import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DataTableHeaderRow, StatusBadge } from "../components/business";
import { inventoryDetailStatusMap, transactionTypeStatusMap } from "../configs/wmsStatusMap";
import {
  ArrowLeft, Package, MapPin, Layers, Activity, AlertTriangle,
  Lock, TrendingUp, Download, RefreshCcw, Snowflake, Clock
} from "lucide-react";

interface InventoryDetailPageProps {
  onNavigate: (path: string) => void;
  skuCode?: string;
}

// Mock库位分布数据
const mockLocationData = [
  {
    id: "1",
    zone: "A库区",
    location: "A01-01-01",
    batchNo: "LOT20260601",
    stockStatus: "正常",
    quantity: 150,
    putawayTime: "2026-06-01 14:23",
    inventoryAge: 1,
  },
  {
    id: "2",
    zone: "A库区",
    location: "A01-01-05",
    batchNo: "LOT20260528",
    stockStatus: "正常",
    quantity: 200,
    putawayTime: "2026-05-28 10:15",
    inventoryAge: 5,
  },
  {
    id: "3",
    zone: "A库区",
    location: "A02-03-12",
    batchNo: "LOT20260601",
    stockStatus: "冻结",
    quantity: 50,
    putawayTime: "2026-06-01 15:40",
    inventoryAge: 1,
  },
  {
    id: "4",
    zone: "B库区",
    location: "B01-02-08",
    batchNo: "LOT20260525",
    stockStatus: "正常",
    quantity: 300,
    putawayTime: "2026-05-25 09:30",
    inventoryAge: 8,
  },
  {
    id: "5",
    zone: "B库区",
    location: "B02-01-03",
    batchNo: "LOT20260520",
    stockStatus: "正常",
    quantity: 250,
    putawayTime: "2026-05-20 16:20",
    inventoryAge: 13,
  },
  {
    id: "6",
    zone: "B库区",
    location: "B03-04-15",
    batchNo: "LOT20260601",
    stockStatus: "待检",
    quantity: 20,
    putawayTime: "2026-06-01 17:10",
    inventoryAge: 1,
  },
  {
    id: "7",
    zone: "C库区",
    location: "C01-01-01",
    batchNo: "LOT20260515",
    stockStatus: "正常",
    quantity: 180,
    putawayTime: "2026-05-15 11:45",
    inventoryAge: 18,
  },
  {
    id: "8",
    zone: "C库区",
    location: "C02-05-20",
    batchNo: "LOT20260510",
    stockStatus: "正常",
    quantity: 100,
    putawayTime: "2026-05-10 14:00",
    inventoryAge: 23,
  },
];

// Mock批次分布数据
const mockBatchData = [
  {
    id: "1",
    batchNo: "LOT20260601",
    productionDate: "2026-05-25",
    expiryDate: "2027-05-25",
    quantity: 420,
    locationCount: 3,
    status: "正常",
    remainingDays: 358,
  },
  {
    id: "2",
    batchNo: "LOT20260528",
    productionDate: "2026-05-18",
    expiryDate: "2027-05-18",
    quantity: 200,
    locationCount: 1,
    status: "正常",
    remainingDays: 351,
  },
  {
    id: "3",
    batchNo: "LOT20260525",
    productionDate: "2026-05-15",
    expiryDate: "2027-05-15",
    quantity: 300,
    locationCount: 1,
    status: "正常",
    remainingDays: 348,
  },
  {
    id: "4",
    batchNo: "LOT20260520",
    productionDate: "2026-05-10",
    expiryDate: "2027-05-10",
    quantity: 250,
    locationCount: 1,
    status: "正常",
    remainingDays: 343,
  },
  {
    id: "5",
    batchNo: "LOT20260515",
    productionDate: "2026-05-05",
    expiryDate: "2027-05-05",
    quantity: 180,
    locationCount: 1,
    status: "正常",
    remainingDays: 338,
  },
];

// Mock库存流水数据
const mockTransactionData = [
  {
    id: "1",
    transactionType: "入库",
    referenceNo: "IB-20260602-001",
    batchNo: "LOT20260601",
    location: "A01-01-01",
    changeQty: 150,
    afterQty: 1250,
    operator: "张三",
    operateTime: "2026-06-02 10:23",
    remark: "采购入库",
  },
  {
    id: "2",
    transactionType: "出库",
    referenceNo: "SO-20260602-0089",
    batchNo: "LOT20260528",
    location: "A01-01-05",
    changeQty: -50,
    afterQty: 1100,
    operator: "李四",
    operateTime: "2026-06-02 09:15",
    remark: "销售出库",
  },
  {
    id: "3",
    transactionType: "冻结",
    referenceNo: "FRZ-20260602-003",
    batchNo: "LOT20260601",
    location: "A02-03-12",
    changeQty: -50,
    afterQty: 1150,
    operator: "王五",
    operateTime: "2026-06-02 08:40",
    remark: "质量问题冻结",
  },
  {
    id: "4",
    transactionType: "入库",
    referenceNo: "IB-20260601-025",
    batchNo: "LOT20260601",
    location: "B01-02-08",
    changeQty: 300,
    afterQty: 1200,
    operator: "张三",
    operateTime: "2026-06-01 16:50",
    remark: "采购入库",
  },
  {
    id: "5",
    transactionType: "移库",
    referenceNo: "MV-20260601-012",
    batchNo: "LOT20260525",
    location: "B02-01-03 → B03-04-15",
    changeQty: 0,
    afterQty: 900,
    operator: "赵六",
    operateTime: "2026-06-01 14:20",
    remark: "库位调整",
  },
];

// Mock预警信息
const mockAlerts = [
  {
    id: "1",
    type: "安全库存",
    level: "警告",
    message: "当前库存 1,250件，低于安全库存 500件，建议补货",
    createTime: "2026-06-02 08:00",
  },
];

export default function InventoryDetailPage({ onNavigate, skuCode = "ABC-123456" }: InventoryDetailPageProps) {
  const [activeTab, setActiveTab] = useState("location");

  // Mock SKU基本信息
  const skuInfo = {
    skuCode: "ABC-123456",
    productName: "多功能蓝牙耳机",
    productNameEn: "Multi-function Bluetooth Headphones",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    customerName: "维他很忙",
    category: "电子产品 / 数码配件",
    specifications: "黑色 / 标准版",
    barcode: "6901234567890",
    unit: "件",
    dimensions: "10x8x3cm",
    weight: 0.15,
  };

  // 库存汇总数据
  const totalStock = 1250;
  const availableStock = 1180;
  const frozenStock = 50;
  const qualityCheckStock = 20;
  const safetyStock = 500;

  return (
    <WMSLayout title="库存明细" currentPath="/inventory/query" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部返回按钮 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onNavigate("/inventory/query")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回库存查询
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="w-4 h-4 mr-2" />
              刷新
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出明细
            </Button>
          </div>
        </div>

        {/* SKU基本信息卡片 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-6">
              {/* 商品图片 */}
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={skuInfo.imageUrl}
                  alt={skuInfo.productName}
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              </div>

              {/* 商品信息 */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">SKU编码</div>
                  <div className="font-mono font-medium">{skuInfo.skuCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">商品名称</div>
                  <div className="font-medium">{skuInfo.productName}</div>
                  <div className="text-xs text-muted-foreground">{skuInfo.productNameEn}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">客户名称</div>
                  <div>{skuInfo.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">商品分类</div>
                  <div className="text-sm">{skuInfo.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">规格</div>
                  <div className="text-sm">{skuInfo.specifications}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">条码</div>
                  <div className="font-mono text-sm">{skuInfo.barcode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">尺寸 / 重量</div>
                  <div className="text-sm">{skuInfo.dimensions} / {skuInfo.weight}kg</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">单位</div>
                  <div className="text-sm">{skuInfo.unit}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 库存数据汇总 */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="text-sm text-muted-foreground">总库存</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium">{totalStock.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">件</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-sm text-muted-foreground">可用库存</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-success-600">{availableStock.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">件</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-sm text-muted-foreground">冻结库存</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-warning-600">{frozenStock.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">件</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-sm text-muted-foreground">待检库存</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-info-600">{qualityCheckStock.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">件</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="text-sm text-muted-foreground">安全库存</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-muted-foreground">{safetyStock.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">件</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="location">库位分布</TabsTrigger>
            <TabsTrigger value="batch">批次分布</TabsTrigger>
            <TabsTrigger value="transaction">库存流水</TabsTrigger>
            <TabsTrigger value="alert">预警信息</TabsTrigger>
          </TabsList>

          {/* Tab 1: 库位分布 */}
          <TabsContent value="location" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead className="w-[100px]">库区</TableHead>
                      <TableHead className="w-[120px]">库位</TableHead>
                      <TableHead className="w-[140px]">批次号</TableHead>
                      <TableHead className="w-[100px]">库存状态</TableHead>
                      <TableHead className="w-[100px] text-right">数量</TableHead>
                      <TableHead className="w-[140px]">上架时间</TableHead>
                      <TableHead className="w-[80px]">库龄</TableHead>
                      <TableHead className="w-[160px] text-right">操作</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockLocationData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="text-sm">{item.zone}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.location}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.batchNo}</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge {...inventoryDetailStatusMap[item.stockStatus]} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.quantity.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.putawayTime}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.inventoryAge}天</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {item.stockStatus === "冻结" ? (
                              <Button variant="ghost" size="sm">
                                解冻
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Lock className="w-4 h-4 mr-1" />
                                冻结
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              移库
                            </Button>
                            <Button variant="ghost" size="sm">
                              调整
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: 批次分布 */}
          <TabsContent value="batch" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead className="w-[140px]">批次号</TableHead>
                      <TableHead className="w-[120px]">生产日期</TableHead>
                      <TableHead className="w-[120px]">到期日期</TableHead>
                      <TableHead className="w-[100px] text-right">数量</TableHead>
                      <TableHead className="w-[100px]">分布库位数</TableHead>
                      <TableHead className="w-[100px]">状态</TableHead>
                      <TableHead className="w-[120px]">剩余保质期</TableHead>
                      <TableHead className="w-[120px] text-right">操作</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockBatchData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="font-mono text-sm">{item.batchNo}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.productionDate}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.expiryDate}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.quantity.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.locationCount}个库位</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge {...inventoryDetailStatusMap[item.status]} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-success-600">{item.remainingDays}天</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              查看分布
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: 库存流水 */}
          <TabsContent value="transaction" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead className="w-[100px]">交易类型</TableHead>
                      <TableHead className="w-[140px]">关联单号</TableHead>
                      <TableHead className="w-[140px]">批次号</TableHead>
                      <TableHead className="w-[160px]">库位</TableHead>
                      <TableHead className="w-[100px] text-right">变动数量</TableHead>
                      <TableHead className="w-[100px] text-right">变动后</TableHead>
                      <TableHead className="w-[100px]">操作人</TableHead>
                      <TableHead className="w-[140px]">操作时间</TableHead>
                      <TableHead className="w-[180px]">备注</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactionData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <StatusBadge {...transactionTypeStatusMap[item.transactionType]} />
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.referenceNo}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.batchNo}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.location}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm tabular-nums ${item.changeQty > 0 ? 'text-success-600' : item.changeQty < 0 ? 'text-error-600' : 'text-muted-foreground'}`}>
                            {item.changeQty > 0 ? '+' : ''}{item.changeQty}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.afterQty.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.operator}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.operateTime}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.remark}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: 预警信息 */}
          <TabsContent value="alert" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {mockAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg bg-warning-50 border-warning-200">
                        <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="border-warning-200 bg-warning-100 text-warning-700">
                              {alert.type}
                            </Badge>
                            <Badge variant="outline" className="border-warning-200 bg-warning-100 text-warning-700">
                              {alert.level}
                            </Badge>
                          </div>
                          <p className="mb-2 text-sm text-warning-700">{alert.message}</p>
                          <div className="flex items-center gap-2 text-xs text-warning-700">
                            <Clock className="w-3 h-3" />
                            {alert.createTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Package className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">暂无预警信息</p>
                    <p className="text-sm">库存状态正常</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WMSLayout>
  );
}
