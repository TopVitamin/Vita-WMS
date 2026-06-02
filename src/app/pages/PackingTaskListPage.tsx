import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Search, RefreshCcw, Download, Package, Clock, Play, CheckCircle
} from "lucide-react";

interface PackingTaskListPageProps {
  onNavigate: (path: string) => void;
}

const mockPackingTasks = [
  {
    id: "1",
    orderNo: "SO-20260602-0089",
    customerName: "维他很忙",
    skuCount: 3,
    totalQty: 6,
    courier: "顺丰速运",
    trackingNo: "SF1234567890",
    status: "已打包",
    packer: { name: "李四", avatar: "LS" },
    packageWeight: 2.5,
    packageSize: "30x20x15cm",
    packingTime: "2026-06-02 14:23",
  },
  {
    id: "2",
    orderNo: "SO-20260602-0090",
    customerName: "跨境小王",
    skuCount: 5,
    totalQty: 12,
    courier: null,
    trackingNo: null,
    status: "打包中",
    packer: { name: "王五", avatar: "WW" },
    packageWeight: null,
    packageSize: null,
    packingTime: null,
  },
  {
    id: "3",
    orderNo: "SO-20260602-0091",
    customerName: "维他很忙",
    skuCount: 2,
    totalQty: 4,
    courier: null,
    trackingNo: null,
    status: "待打包",
    packer: null,
    packageWeight: null,
    packageSize: null,
    packingTime: null,
  },
];

export default function PackingTaskListPage({ onNavigate }: PackingTaskListPageProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = mockPackingTasks.filter(item => {
    if (searchKeyword && !item.orderNo.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待打包":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">待打包</Badge>;
      case "打包中":
        return <Badge variant="outline" className="bg-warning-50 text-warning-600 border-warning-200">
          <Play className="w-3 h-3 mr-1" />
          打包中
        </Badge>;
      case "已打包":
        return <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          已打包
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalTasks = mockPackingTasks.length;
  const pendingTasks = mockPackingTasks.filter(t => t.status === "待打包").length;
  const packingTasks = mockPackingTasks.filter(t => t.status === "打包中").length;
  const completedTasks = mockPackingTasks.filter(t => t.status === "已打包").length;

  return (
    <WMSLayout title="打包任务列表" currentPath="/packing/tasks" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">总任务数</div>
                  <div className="text-3xl font-medium">{totalTasks}</div>
                </div>
                <Package className="w-12 h-12 text-muted-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">待打包</div>
                  <div className="text-3xl font-medium text-gray-600">{pendingTasks}</div>
                </div>
                <Clock className="w-12 h-12 text-gray-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">打包中</div>
                  <div className="text-3xl font-medium text-warning-600">{packingTasks}</div>
                </div>
                <Play className="w-12 h-12 text-warning-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">已完成</div>
                  <div className="text-3xl font-medium text-success-600">{completedTasks}</div>
                </div>
                <CheckCircle className="w-12 h-12 text-success-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="订单号"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待打包">待打包</SelectItem>
                    <SelectItem value="打包中">打包中</SelectItem>
                    <SelectItem value="已打包">已打包</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-5"></div>
              <div className="col-span-1">
                <Button variant="outline" className="w-full" onClick={() => { setSearchKeyword(""); setStatusFilter("all"); }}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据表格 */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>订单号</TableHead>
                  <TableHead>客户名称</TableHead>
                  <TableHead>SKU数</TableHead>
                  <TableHead>商品件数</TableHead>
                  <TableHead>快递公司</TableHead>
                  <TableHead>快递单号</TableHead>
                  <TableHead>打包状态</TableHead>
                  <TableHead>打包员</TableHead>
                  <TableHead>重量</TableHead>
                  <TableHead>尺寸</TableHead>
                  <TableHead>打包时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><span className="font-mono text-sm">{item.orderNo}</span></TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.skuCount}个</TableCell>
                    <TableCell>{item.totalQty}件</TableCell>
                    <TableCell>{item.courier || "-"}</TableCell>
                    <TableCell>{item.trackingNo ? <span className="font-mono text-sm">{item.trackingNo}</span> : "-"}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.packer ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{item.packer.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.packer.name}</span>
                        </div>
                      ) : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>{item.packageWeight ? `${item.packageWeight}kg` : "-"}</TableCell>
                    <TableCell>{item.packageSize || "-"}</TableCell>
                    <TableCell><span className="text-sm text-muted-foreground">{item.packingTime || "-"}</span></TableCell>
                    <TableCell className="text-right">
                      {item.status === "待打包" && (
                        <Button variant="ghost" size="sm" onClick={() => onNavigate("/packing/workspace")}>
                          开始打包
                        </Button>
                      )}
                      {item.status !== "待打包" && (
                        <Button variant="ghost" size="sm">详情</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </WMSLayout>
  );
}
