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
import { pickingDetailStatusMap, priorityStatusMap } from "../configs/wmsStatusMap";
import {
  ArrowLeft, Package, Play, CheckCircle, X, Download, AlertCircle,
  MapPin, Clock, User, FileText, Image as ImageIcon
} from "lucide-react";

interface PickingTaskDetailPageProps {
  onNavigate: (path: string) => void;
  taskId?: string;
}

// Mock拣货明细数据
const mockPickingItems = [
  {
    id: "1",
    sequence: 1,
    skuCode: "ABC-123456",
    productName: "多功能蓝牙耳机",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    recommendedLocation: "A01-01-01",
    requiredQty: 20,
    pickedQty: 20,
    remainingQty: 0,
    unit: "件",
    batchNo: "LOT20260601",
    relatedOrders: 5,
    pickingStatus: "已完成",
    actualLocation: "A01-01-01",
    pickingTime: "2026-06-02 10:23",
  },
  {
    id: "2",
    sequence: 2,
    skuCode: "ABC-123457",
    productName: "智能手环运动版",
    imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
    recommendedLocation: "A01-01-05",
    requiredQty: 15,
    pickedQty: 15,
    remainingQty: 0,
    unit: "件",
    batchNo: "LOT20260528",
    relatedOrders: 8,
    pickingStatus: "已完成",
    actualLocation: "A01-01-05",
    pickingTime: "2026-06-02 10:28",
  },
  {
    id: "3",
    sequence: 3,
    skuCode: "DEF-789012",
    productName: "运动水杯 1L",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    recommendedLocation: "B01-02-08",
    requiredQty: 30,
    pickedQty: 30,
    remainingQty: 0,
    unit: "件",
    batchNo: "LOT20260525",
    relatedOrders: 12,
    pickingStatus: "已完成",
    actualLocation: "B01-02-08",
    pickingTime: "2026-06-02 10:35",
  },
];

// Mock操作日志
const mockLogs = [
  {
    id: "1",
    action: "完成拣货",
    operator: "张三",
    operateTime: "2026-06-02 10:45",
    detail: "完成全部商品拣货，总计156件",
  },
  {
    id: "2",
    action: "开始拣货",
    operator: "张三",
    operateTime: "2026-06-02 09:30",
    detail: "开始执行拣货任务",
  },
  {
    id: "3",
    action: "分配任务",
    operator: "系统管理员",
    operateTime: "2026-06-02 09:25",
    detail: "将任务分配给拣货员：张三",
  },
  {
    id: "4",
    action: "创建任务",
    operator: "系统",
    operateTime: "2026-06-02 09:23",
    detail: "从波次 WV-20260602-001 创建拣货任务",
  },
];

export default function PickingTaskDetailPage({ onNavigate, taskId = "1" }: PickingTaskDetailPageProps) {
  const [activeTab, setActiveTab] = useState("items");

  // Mock任务基本信息
  const taskInfo = {
    taskNo: "PK-20260602-0001",
    waveNo: "WV-20260602-001",
    pickingType: "按单拣货",
    priority: "紧急",
    orderCount: 8,
    skuCount: 23,
    totalQty: 156,
    pickedQty: 156,
    picker: { name: "张三", avatar: "ZS" },
    status: "已完成",
    createTime: "2026-06-02 09:23",
    estimatedTime: "2026-06-02 11:00",
    actualTime: "2026-06-02 10:45",
  };

  const progress = (taskInfo.pickedQty / taskInfo.totalQty) * 100;

  return (
    <WMSLayout title="拣货任务详情" currentPath="/picking/tasks" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onNavigate("/picking/tasks")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回任务列表
          </Button>
          <div className="flex gap-2">
            {taskInfo.status === "待拣货" && (
              <Button>
                <Play className="w-4 h-4 mr-2" />
                开始拣货
              </Button>
            )}
            {taskInfo.status === "拣货中" && (
              <>
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  完成拣货
                </Button>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  取消任务
                </Button>
              </>
            )}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              打印拣货单
            </Button>
          </div>
        </div>

        {/* 任务基本信息卡片 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-6">
              {/* 左侧：基本信息 */}
              <div className="col-span-8 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">任务单号</div>
                  <div className="font-mono font-medium">{taskInfo.taskNo}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">波次号</div>
                  <div className="font-mono">{taskInfo.waveNo}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">拣货类型</div>
                  <div>{taskInfo.pickingType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">优先级</div>
                  <StatusBadge {...priorityStatusMap[taskInfo.priority as keyof typeof priorityStatusMap]} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">任务状态</div>
                  <StatusBadge {...pickingDetailStatusMap[taskInfo.status]} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">拣货员</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{taskInfo.picker.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{taskInfo.picker.name}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                  <div className="text-sm">{taskInfo.createTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">预计完成</div>
                  <div className="text-sm">{taskInfo.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">实际完成</div>
                  <div className="text-sm">{taskInfo.actualTime}</div>
                </div>
              </div>

              {/* 右侧：进度指标 */}
              <div className="col-span-4 border-l pl-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">拣货进度</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-medium">{taskInfo.pickedQty}</span>
                      <span className="text-muted-foreground">/ {taskInfo.totalQty} 件</span>
                      <span className="text-sm text-muted-foreground">({progress.toFixed(0)}%)</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">订单数</div>
                      <div className="text-xl font-medium">{taskInfo.orderCount}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">SKU数</div>
                      <div className="text-xl font-medium">{taskInfo.skuCount}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">总件数</div>
                      <div className="text-xl font-medium">{taskInfo.totalQty}</div>
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
              拣货明细
              <StatusTabCount count={mockPickingItems.length} />
            </TabsTrigger>
            <TabsTrigger value="logs" className="group gap-1">
              操作日志
              <StatusTabCount count={mockLogs.length} />
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: 拣货明细 */}
          <TabsContent value="items" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow className="bg-muted/50">
                      <TableHead className="w-[60px]">序号</TableHead>
                      <TableHead className="w-[140px]">SKU编码</TableHead>
                      <TableHead className="w-[200px]">商品信息</TableHead>
                      <TableHead className="w-[100px]">推荐库位</TableHead>
                      <TableHead className="w-[80px] text-right">应拣数量</TableHead>
                      <TableHead className="w-[80px] text-right">已拣数量</TableHead>
                      <TableHead className="w-[80px] text-right">剩余数量</TableHead>
                      <TableHead className="w-[60px]">单位</TableHead>
                      <TableHead className="w-[120px]">批次号</TableHead>
                      <TableHead className="w-[80px]">关联订单</TableHead>
                      <TableHead className="w-[100px]">拣货状态</TableHead>
                      <TableHead className="w-[100px]">实际库位</TableHead>
                      <TableHead className="w-[140px]">拣货时间</TableHead>
                      <TableHead className="w-[120px] text-right">操作</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {mockPickingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          <span className="tabular-nums">{item.sequence}</span>
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
                            <span className="text-sm">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {item.recommendedLocation}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{item.requiredQty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums text-success-600">{item.pickedQty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm">{item.remainingQty}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.unit}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.batchNo}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.relatedOrders}单</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge {...pickingDetailStatusMap[item.pickingStatus]} />
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{item.actualLocation}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.pickingTime}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {item.pickingStatus !== "已完成" && (
                              <>
                                <Button variant="ghost" size="sm">
                                  标记缺货
                                </Button>
                                <Button variant="ghost" size="sm">
                                  调整
                                </Button>
                              </>
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

          {/* Tab 2: 操作日志 */}
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
