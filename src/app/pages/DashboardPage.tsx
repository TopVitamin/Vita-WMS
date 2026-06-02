import { WMSLayout } from "../components/layouts/WMSLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { listInventoryItems, resetMockInventory } from "../services/mock";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PackageCheck,
  PackageMinus,
  Package,
  AlertTriangle,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  RefreshCcw,
  FileText,
  Warehouse,
  ShoppingCart,
  Box,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  // 动态获取缓存入库单与实时库存总量
  const storedInbound = typeof window !== "undefined" ? sessionStorage.getItem("wms_mock_inbound_orders") : null;
  const currentInboundOrders = storedInbound ? JSON.parse(storedInbound) : [];
  
  // 统计待收货的订单数 (即 pending 或 in_progress)
  const pendingInboundCount = currentInboundOrders.length > 0 
    ? currentInboundOrders.filter((o: any) => o.status === "pending" || o.status === "in_progress").length
    : 12; // 兜底初始12个

  const inventoryItems = listInventoryItems();
  const totalStockQty = inventoryItems.reduce((sum, item) => sum + item.totalStock, 0);
  const totalSKUs = inventoryItems.length;

  // 模拟数据 - 核心指标
  const todayMetrics = {
    inbound: {
      orders: 45,
      items: 3580,
      trend: 12.5,
      status: "up" as const,
    },
    outbound: {
      orders: 128,
      items: 2840,
      trend: -5.2,
      status: "down" as const,
    },
    inventory: {
      totalItems: totalStockQty,
      totalSKUs: totalSKUs,
      capacity: parseFloat((70.0 + (totalStockQty / 2000)).toFixed(1)), // 库容率随库存数量变动
      trend: 3.8,
      status: "up" as const,
    },
    pending: {
      toReceive: pendingInboundCount,
      toPick: 45,
      toPack: 28,
      exceptions: 3,
    },
  };

  // 一键重置演示数据逻辑
  const handleResetAllDemoData = () => {
    if (window.confirm("确定要重置所有演示数据吗？这会清除您刚才做的全部收货与库存修改。")) {
      sessionStorage.removeItem("wms_mock_inbound_orders");
      resetMockInventory();
      window.location.reload();
    }
  };

  // 7天业务趋势数据 (动态接入今日库存量)
  const trendData = [
    { date: "10/22", inbound: 42, outbound: 135, inventory: 122500 },
    { date: "10/23", inbound: 38, outbound: 128, inventory: 123100 },
    { date: "10/24", inbound: 51, outbound: 142, inventory: 122800 },
    { date: "10/25", inbound: 47, outbound: 131, inventory: 123500 },
    { date: "10/26", inbound: 40, outbound: 125, inventory: 124200 },
    { date: "10/27", inbound: 43, outbound: 138, inventory: 124800 },
    { date: "10/28", inbound: 45, outbound: 128, inventory: totalStockQty },
  ];

  // 待办任务
  const todoTasks = [
    {
      id: 1,
      type: "异常",
      title: "INB-20241028-003 商品数量不符",
      priority: "high",
      time: "10分钟前",
    },
    {
      id: 2,
      type: "待处理",
      title: "45个出库单待分配拣货",
      priority: "medium",
      time: "30分钟前",
    },
    {
      id: 3,
      type: "预警",
      title: "15个SKU低于安全库存",
      priority: "high",
      time: "1小时前",
    },
    {
      id: 4,
      type: "待处理",
      title: `${pendingInboundCount}个入库单待收货`,
      priority: "medium",
      time: "2小时前",
    },
  ];

  // 库存预警
  const inventoryAlerts = [
    {
      sku: "SKU-2024-001",
      name: "无线蓝牙耳机",
      currentStock: 180,
      safetyStock: 500,
      type: "低库存",
      customer: "Amazon US",
    },
    {
      sku: "SKU-2024-015",
      name: "运动腰包",
      currentStock: 45,
      safetyStock: 200,
      type: "低库存",
      customer: "eBay UK",
    },
    {
      sku: "SKU-2023-088",
      name: "夏季遮阳帽",
      currentStock: 1250,
      daysInStock: 180,
      type: "滞销",
      customer: "Walmart Canada",
    },
    {
      sku: "SKU-2024-032",
      name: "智能手环",
      currentStock: 85,
      safetyStock: 300,
      type: "低库存",
      customer: "Shopify Merchants",
    },
  ];

  // 客户库存分布
  const customerDistribution = [
    { name: "Amazon US", value: 45200, color: "var(--purple-600)" },
    { name: "eBay UK", value: 28500, color: "var(--purple-400)" },
    { name: "Walmart Canada", value: 22100, color: "var(--purple-300)" },
    { name: "Shopify", value: 18900, color: "var(--purple-200)" },
    { name: "其他", value: 10980, color: "var(--gray-300)" },
  ];

  // 最新动态
  const recentActivities = [
    {
      id: 1,
      type: "出库",
      title: "OUT-20241028-128 已完成拣货",
      time: "刚刚",
      user: "张三",
    },
    {
      id: 2,
      type: "入库",
      title: "INB-20241028-045 已完成上架",
      time: "5分钟前",
      user: "李四",
    },
    {
      id: 3,
      type: "出库",
      title: "OUT-20241028-127 已完成打包",
      time: "8分钟前",
      user: "王五",
    },
    {
      id: 4,
      type: "入库",
      title: "INB-20241028-044 质检通过",
      time: "12分钟前",
      user: "赵六",
    },
    {
      id: 5,
      type: "出库",
      title: "OUT-20241028-126 已出库",
      time: "15分钟前",
      user: "张三",
    },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
  };

  return (
    <WMSLayout title="工作台" currentPath="/" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 核心业务指标 */}
        <div className="grid grid-cols-4 gap-4">
          {/* 今日入库 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PackageCheck className="w-4 h-4" />
                    今日入库
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl">
                      {todayMetrics.inbound.orders}
                      <span className="text-sm text-muted-foreground ml-1">单</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {todayMetrics.inbound.items.toLocaleString()} 件
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">{todayMetrics.inbound.trend}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 今日出库 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PackageMinus className="w-4 h-4" />
                    今日出库
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl">
                      {todayMetrics.outbound.orders}
                      <span className="text-sm text-muted-foreground ml-1">单</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {todayMetrics.outbound.items.toLocaleString()} 件
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-error-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">{Math.abs(todayMetrics.outbound.trend)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 当前库存 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    当前库存
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl">
                      {(todayMetrics.inventory.totalItems / 1000).toFixed(1)}K
                      <span className="text-sm text-muted-foreground ml-1">件</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {todayMetrics.inventory.totalSKUs} SKU
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">
                    库容 {todayMetrics.inventory.capacity}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 待处理任务 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  待处理任务
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">待入库</div>
                    <div className="text-xl">{todayMetrics.pending.toReceive}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">待拣货</div>
                    <div className="text-xl">{todayMetrics.pending.toPick}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">待打包</div>
                    <div className="text-xl">{todayMetrics.pending.toPack}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">异常</div>
                    <div className="text-xl text-error-600">{todayMetrics.pending.exceptions}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 左侧区域 - 2列 */}
          <div className="col-span-2 space-y-6">
            {/* 业务趋势图表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  业务趋势（最近7天）
                </CardTitle>
                <CardDescription>入库/出库单量趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                    <XAxis dataKey="date" stroke="var(--gray-600)" />
                    <YAxis stroke="var(--gray-600)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="inbound" name="入库单" fill="var(--success-500)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outbound" name="出库单" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 待办任务 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      待办任务
                    </CardTitle>
                    <CardDescription>需要及时处理的事项</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    查看全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todoTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Badge
                          variant={task.priority === "high" ? "destructive" : "secondary"}
                          className={
                            task.priority === "high"
                              ? "bg-error-50 text-error-700 border-error-200"
                              : ""
                          }
                        >
                          {task.type}
                        </Badge>
                        <div className="flex-1">
                          <div className="text-sm">{task.title}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{task.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 库存预警 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning-600" />
                      库存预警
                    </CardTitle>
                    <CardDescription>需要关注的库存异常</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate("/inventory/query")}
                  >
                    查看详情
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                      <TableHead>SKU</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead>所属客户</TableHead>
                      <TableHead className="text-right">当前库存</TableHead>
                      <TableHead className="text-right">安全库存</TableHead>
                      <TableHead>类型</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryAlerts.map((alert, index) => (
                      <TableRow key={index} className="hover:bg-table-row-hover">
                        <TableCell>
                          <code className="text-xs font-mono text-primary">{alert.sku}</code>
                        </TableCell>
                        <TableCell>{alert.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {alert.customer}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {alert.currentStock.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {alert.type === "低库存"
                            ? alert.safetyStock?.toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              alert.type === "低库存"
                                ? "bg-warning-50 text-warning-700 border-warning-200"
                                : "bg-info-50 text-info-700 border-info-200"
                            }
                          >
                            {alert.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* 右侧区域 - 1列 */}
          <div className="space-y-6">
            {/* 快捷操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
                <CardDescription>常用功能快速入口</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleNavigate("/inbound/management")}
                  >
                    <PackageCheck className="w-5 h-5" />
                    <span className="text-sm">创建入库单</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleNavigate("/outbound/management")}
                  >
                    <PackageMinus className="w-5 h-5" />
                    <span className="text-sm">创建出库单</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleNavigate("/inventory/query")}
                  >
                    <Search className="w-5 h-5" />
                    <span className="text-sm">库存查询</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleNavigate("/inventory/transaction")}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-sm">库存流水</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="col-span-2 mt-2 border-dashed border-primary/40 hover:bg-primary-light/10 text-primary flex items-center justify-center gap-2"
                    onClick={handleResetAllDemoData}
                  >
                    <RefreshCcw className="w-4 h-4" />
                    重置全套演示数据
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 客户库存分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  客户库存分布
                </CardTitle>
                <CardDescription>按客户统计的库存占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={customerDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {customerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => value.toLocaleString() + " 件"}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {customerDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 最新动态 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  最新动态
                </CardTitle>
                <CardDescription>实时业务操作记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 space-y-1">
                        <div className="text-sm">{activity.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className={
                              activity.type === "入库"
                                ? "bg-success-50 text-success-700 border-success-200"
                                : "bg-primary/10 text-primary border-primary/20"
                            }
                          >
                            {activity.type}
                          </Badge>
                          <span>{activity.user}</span>
                          <span>·</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 仓库利用率 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="w-5 h-5" />
                  仓库利用率
                </CardTitle>
                <CardDescription>各库区库容使用情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>A库区</span>
                    <span className="font-mono">85.2%</span>
                  </div>
                  <Progress value={85.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>B库区</span>
                    <span className="font-mono">72.8%</span>
                  </div>
                  <Progress value={72.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>C库区</span>
                    <span className="font-mono">68.5%</span>
                  </div>
                  <Progress value={68.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>D库区</span>
                    <span className="font-mono">45.3%</span>
                  </div>
                  <Progress value={45.3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WMSLayout>
  );
}
