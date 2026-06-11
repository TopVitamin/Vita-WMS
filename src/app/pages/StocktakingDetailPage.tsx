import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { countingTaskStatusMap, stocktakingPlanStatusMap } from "../configs/wmsStatusMap";
import { toast } from "sonner";
import { applyStocktakingAdjustment } from "../services/mock";
import {
  ArrowLeft, Play, CheckCircle, X, Download, AlertTriangle,
  Package, Clock, User, FileText, Image as ImageIcon
} from "lucide-react";

interface StocktakingDetailPageProps {
  onNavigate: (path: string) => void;
  planId?: string;
}

// Mock盘点明细数据
const mockStocktakingItems = [
  {
    id: "1",
    skuCode: "ABC-123456",
    productName: "多功能蓝牙耳机",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    location: "A01-01-01",
    batchNo: "LOT20260601",
    bookQty: 150,
    actualQty: 148,
    diffQty: -2,
    diffRate: -1.33,
    countingStatus: "已盘点",
    counter: "张三",
    countingTime: "2026-06-02 10:23",
    remark: "发现2件外包装破损",
  },
  {
    id: "2",
    skuCode: "ABC-123457",
    productName: "智能手环运动版",
    imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
    location: "A01-01-05",
    batchNo: "LOT20260528",
    bookQty: 200,
    actualQty: 203,
    diffQty: 3,
    diffRate: 1.5,
    countingStatus: "已盘点",
    counter: "张三",
    countingTime: "2026-06-02 10:28",
    remark: "多出3件，待核实",
  },
  {
    id: "3",
    skuCode: "DEF-789012",
    productName: "运动水杯 1L",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    location: "B01-02-08",
    batchNo: "LOT20260525",
    bookQty: 300,
    actualQty: 300,
    diffQty: 0,
    diffRate: 0,
    countingStatus: "已盘点",
    counter: "李四",
    countingTime: "2026-06-02 11:15",
    remark: "",
  },
];

// Mock差异明细（只显示有差异的）
const mockDiffItems = mockStocktakingItems.filter(item => item.diffQty !== 0);

// Mock操作日志
const mockLogs = [
  {
    id: "1",
    action: "完成盘点",
    operator: "张三",
    operateTime: "2026-06-02 15:30",
    detail: "完成全部商品盘点，总差异+12件",
  },
  {
    id: "2",
    action: "审核通过",
    operator: "系统管理员",
    operateTime: "2026-06-02 15:35",
    detail: "审核盘点结果，确认差异调整",
  },
  {
    id: "3",
    action: "开始盘点",
    operator: "张三",
    operateTime: "2026-06-02 09:15",
    detail: "开始执行盘点任务",
  },
  {
    id: "4",
    action: "创建计划",
    operator: "系统管理员",
    operateTime: "2026-06-01 08:00",
    detail: "创建盘点计划：2026年6月全库盘点",
  },
];

export default function StocktakingDetailPage({ onNavigate, planId = "1" }: StocktakingDetailPageProps) {
  const [activeTab, setActiveTab] = useState("items");
  const [adjustmentApplied, setAdjustmentApplied] = useState(false);

  // Mock盘点计划信息
  const planInfo = {
    planNo: "PD-20260602-001",
    planName: "2026年6月全库盘点",
    stocktakingType: "全盘",
    scope: "全库",
    skuCount: 156,
    plannedQty: 8950,
    countedQty: 8950,
    diffQty: 12,
    supervisor: { name: "王五", avatar: "WW" },
    counters: ["张三", "李四"],
    status: "已完成",
    createTime: "2026-06-01 08:00",
    planStartTime: "2026-06-02 09:00",
    actualStartTime: "2026-06-02 09:15",
    completeTime: "2026-06-02 15:30",
  };

  const progress = planInfo.plannedQty > 0 ? (planInfo.countedQty / planInfo.plannedQty) * 100 : 0;

  const handleApplyAdjustment = () => {
    applyStocktakingAdjustment({
      planNo: planInfo.planNo,
      items: mockDiffItems.map((item) => ({
        skuCode: item.skuCode,
        diffQty: item.diffQty,
        location: item.location,
      })),
      operator: "系统管理员",
    });
    setAdjustmentApplied(true);
    toast.success("盘点差异已生成库存调整流水");
  };

  return (
    <WMSLayout title="盘点任务详情" currentPath="/inventory/stocktaking" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onNavigate("/inventory/stocktaking")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回盘点列表
          </Button>
          <div className="flex gap-2">
            {planInfo.status === "待开始" && (
              <Button>
                <Play className="w-4 h-4 mr-2" />
                开始盘点
              </Button>
            )}
            {planInfo.status === "盘点中" && (
              <>
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  完成盘点
                </Button>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  取消盘点
                </Button>
              </>
            )}
            {planInfo.status === "待审核" && (
              <Button onClick={handleApplyAdjustment}>
                <CheckCircle className="w-4 h-4 mr-2" />
                审核通过
              </Button>
            )}
            {planInfo.status === "已完成" && (
              <Button variant={adjustmentApplied ? "outline" : "default"} onClick={handleApplyAdjustment} disabled={adjustmentApplied}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {adjustmentApplied ? "差异已入流水" : "生成差异流水"}
              </Button>
            )}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出盘点单
            </Button>
          </div>
        </div>

        {/* 盘点计划基本信息卡片 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-6">
              {/* 左侧：基本信息 */}
              <div className="col-span-8 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点单号</div>
                  <div className="font-mono font-medium">{planInfo.planNo}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点名称</div>
                  <div className="font-medium">{planInfo.planName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点类型</div>
                  <Badge variant="outline">{planInfo.stocktakingType}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点范围</div>
                  <div>{planInfo.scope}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点状态</div>
                  <StatusBadge {...stocktakingPlanStatusMap[planInfo.status]} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">盘点负责人</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{planInfo.supervisor.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{planInfo.supervisor.name}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">计划开始</div>
                  <div className="text-sm">{planInfo.planStartTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">实际开始</div>
                  <div className="text-sm">{planInfo.actualStartTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">完成时间</div>
                  <div className="text-sm">{planInfo.completeTime}</div>
                </div>
              </div>

              {/* 右侧：进度指标 */}
              <div className="col-span-4 border-l pl-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">盘点进度</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-medium">{planInfo.countedQty.toLocaleString()}</span>
                      <span className="text-muted-foreground">/ {planInfo.plannedQty.toLocaleString()} 件</span>
                      <span className="text-sm text-muted-foreground">({progress.toFixed(0)}%)</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">SKU数</div>
                      <div className="text-xl font-medium">{planInfo.skuCount}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">总件数</div>
                      <div className="text-xl font-medium">{planInfo.plannedQty.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">差异数</div>
                      <div className={`text-xl font-medium ${planInfo.diffQty > 0 ? 'text-success-600' : planInfo.diffQty < 0 ? 'text-error-600' : 'text-muted-foreground'}`}>
                        {planInfo.diffQty > 0 ? '+' : ''}{planInfo.diffQty}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="items" className="group gap-1">
              盘点明细
              <StatusTabCount count={mockStocktakingItems.length} />
            </TabsTrigger>
            <TabsTrigger value="diff" className="group gap-1">
              差异明细
              <StatusTabCount count={mockDiffItems.length} />
            </TabsTrigger>
            <TabsTrigger value="logs" className="group gap-1">
              盘点日志
              <StatusTabCount count={mockLogs.length} />
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: 盘点明细 */}
          <TabsContent value="items" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead className="w-[140px]">SKU编码</TableHead>
                      <TableHead className="w-[200px]">商品信息</TableHead>
                      <TableHead className="w-[100px]">库位</TableHead>
                      <TableHead className="w-[120px]">批次号</TableHead>
                      <TableHead className="w-[90px] text-right">账面数量</TableHead>
                      <TableHead className="w-[90px] text-right">实盘数量</TableHead>
                      <TableHead className="w-[90px] text-right">差异数量</TableHead>
                      <TableHead className="w-[80px] text-right">差异率</TableHead>
                      <TableHead className="w-[100px]">盘点状态</TableHead>
                      <TableHead className="w-[100px]">盘点员</TableHead>
                      <TableHead className="w-[140px]">盘点时间</TableHead>
                      <TableHead className="w-[160px]">备注</TableHead>
                      <TableHead className="w-[120px] text-right">操作</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockStocktakingItems.map((item) => (
                      <TableRow key={item.id}>
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
                            <span className="text-sm">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.location}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.batchNo}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.bookQty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.actualQty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm tabular-nums ${item.diffQty > 0 ? 'text-success-600' : item.diffQty < 0 ? 'text-error-600' : 'text-muted-foreground'}`}>
                            {item.diffQty > 0 ? '+' : ''}{item.diffQty}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm ${Math.abs(item.diffRate) > 5 ? 'text-error-600' : 'text-muted-foreground'}`}>
                            {item.diffRate > 0 ? '+' : ''}{item.diffRate.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge {...countingTaskStatusMap[item.countingStatus]} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.counter}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.countingTime}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.remark || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {item.countingStatus !== "已盘点" && (
                              <Button variant="ghost" size="sm">
                                复盘
                              </Button>
                            )}
                            {item.diffQty !== 0 && (
                              <Button variant="ghost" size="sm">
                                调整
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: 差异明细 */}
          <TabsContent value="diff" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                  差异商品明细（共{mockDiffItems.length}个SKU有差异）
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead>SKU编码</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead>库位</TableHead>
                      <TableHead className="text-right">账面数量</TableHead>
                      <TableHead className="text-right">实盘数量</TableHead>
                      <TableHead className="text-right">差异数量</TableHead>
                      <TableHead className="text-right">差异率</TableHead>
                      <TableHead>备注</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockDiffItems.map((item) => (
                      <TableRow key={item.id} className={Math.abs(item.diffRate) > 5 ? "bg-error-50" : ""}>
                        <TableCell><span className="font-mono text-sm">{item.skuCode}</span></TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell><span className="font-mono text-sm">{item.location}</span></TableCell>
                        <TableCell className="text-right">{item.bookQty}</TableCell>
                        <TableCell className="text-right">{item.actualQty}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${item.diffQty > 0 ? 'text-success-600' : 'text-error-600'}`}>
                            {item.diffQty > 0 ? '+' : ''}{item.diffQty}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${Math.abs(item.diffRate) > 5 ? 'text-error-600' : 'text-warning-600'}`}>
                            {item.diffRate > 0 ? '+' : ''}{item.diffRate.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{item.remark || "-"}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: 盘点日志 */}
          <TabsContent value="logs" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {mockLogs.map((log, index) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {index === 0 ? (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        {index < mockLogs.length - 1 && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-1">
                          <span>{log.action}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{log.operateTime}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{log.detail}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{log.operator}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WMSLayout>
  );
}
