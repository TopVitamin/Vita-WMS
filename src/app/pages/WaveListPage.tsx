import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, MoreHorizontal, Eye, Search, Layers, UserPlus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { WMSLayout } from "../components/layouts/WMSLayout";

// 模拟数据
const waveOrders = [
  {
    id: "WAVE-2024-0028",
    orderCount: 3,
    skuCount: 8,
    totalQty: 120,
    waveType: "multi_mixed",
    pickedQty: 120,
    pickProgress: 100,
    picker: "张三",
    status: "picked",
    createdAt: "2024-10-20 14:20",
    createdBy: "李四",
  },
  {
    id: "WAVE-2024-0027",
    orderCount: 5,
    skuCount: 12,
    totalQty: 85,
    waveType: "multi_mixed",
    pickedQty: 60,
    pickProgress: 70.6,
    picker: "李四",
    status: "picking",
    createdAt: "2024-10-15 11:30",
    createdBy: "张三",
  },
  {
    id: "WAVE-2024-0026",
    orderCount: 8,
    skuCount: 15,
    totalQty: 200,
    waveType: "multi_mixed",
    pickedQty: 0,
    pickProgress: 0,
    picker: "王五",
    status: "pending",
    createdAt: "2024-10-10 09:15",
    createdBy: "demo",
  },
  {
    id: "WAVE-2024-0025",
    orderCount: 2,
    skuCount: 2,
    totalQty: 10,
    waveType: "single_multi",
    pickedQty: 0,
    pickProgress: 0,
    picker: "-",
    status: "pending",
    createdAt: "2024-10-08 16:40",
    createdBy: "demo",
  },
  {
    id: "WAVE-2024-0024",
    orderCount: 10,
    skuCount: 25,
    totalQty: 300,
    waveType: "multi_mixed",
    pickedQty: 300,
    pickProgress: 100,
    picker: "赵六",
    status: "picked",
    createdAt: "2024-10-05 10:20",
    createdBy: "张三",
  },
  {
    id: "WAVE-2024-0023",
    orderCount: 1,
    skuCount: 1,
    totalQty: 5,
    waveType: "single_single",
    pickedQty: 0,
    pickProgress: 0,
    picker: "-",
    status: "pending",
    createdAt: "2024-10-03 14:15",
    createdBy: "李四",
  },
  {
    id: "WAVE-2024-0022",
    orderCount: 4,
    skuCount: 10,
    totalQty: 150,
    waveType: "multi_mixed",
    pickedQty: 80,
    pickProgress: 53.3,
    picker: "张三",
    status: "picking",
    createdAt: "2024-10-01 09:30",
    createdBy: "demo",
  },
];

interface WaveListPageProps {
  onNavigate?: (path: string) => void;
}

export default function WaveListPage({ onNavigate }: WaveListPageProps) {
  const [selectedWaves, setSelectedWaves] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleSelectAll = () => {
    if (selectedWaves.length === waveOrders.length) {
      setSelectedWaves([]);
    } else {
      setSelectedWaves(waveOrders.map((wave) => wave.id));
    }
  };

  const handleSelectWave = (waveId: string) => {
    setSelectedWaves((prev) =>
      prev.includes(waveId) ? prev.filter((id) => id !== waveId) : [...prev, waveId]
    );
  };

  // 检查选中波次是否都是待拣货状态
  const canBatchAssignPicker = () => {
    const selected = waveOrders.filter((wave) => selectedWaves.includes(wave.id));
    return selected.length > 0 && selected.every((wave) => wave.status === "pending");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
      pending: { 
        label: "待拣货", 
        bg: "hsl(40 96% 95%)", 
        text: "hsl(40 96% 35%)",
        border: "hsl(40 96% 85%)"
      },
      picking: { 
        label: "拣货中", 
        bg: "hsl(267 84% 95%)", 
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)"
      },
      picked: { 
        label: "已拣货", 
        bg: "hsl(142 76% 95%)", 
        text: "hsl(142 76% 30%)",
        border: "hsl(142 76% 85%)"
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge 
        variant="outline"
        style={{ 
          backgroundColor: config.bg, 
          color: config.text,
          borderColor: config.border
        }}
      >
        {config.label}
      </Badge>
    );
  };

  const getWaveTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
      single_single: { 
        label: "单品单件", 
        bg: "hsl(218 92% 95%)", 
        text: "hsl(218 92% 35%)",
        border: "hsl(218 92% 85%)"
      },
      single_multi: { 
        label: "单品多件", 
        bg: "hsl(267 84% 95%)", 
        text: "hsl(267 84% 35%)",
        border: "hsl(267 84% 85%)"
      },
      multi_mixed: { 
        label: "多品混合", 
        bg: "hsl(28 100% 95%)", 
        text: "hsl(28 100% 35%)",
        border: "hsl(28 100% 85%)"
      },
    };
    const config = typeConfig[type] || typeConfig.single_single;
    return (
      <Badge 
        variant="outline"
        style={{ 
          backgroundColor: config.bg, 
          color: config.text,
          borderColor: config.border
        }}
      >
        {config.label}
      </Badge>
    );
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <WMSLayout 
      title="波次管理" 
      currentPath="/wave/management"
      onNavigate={handleNavigate}
    >
      <div className="p-6 space-y-5">
        {/* Status Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              全部
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              待拣货 <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="picking" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              拣货中 <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="picked" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
              已拣货 <Badge variant="secondary">2</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="波次号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wave_no">波次号</SelectItem>
              <SelectItem value="outbound_no">出库单号</SelectItem>
              <SelectItem value="order_no">订单号</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="搜索..." className="w-64" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="波次类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="single_single">单品单件</SelectItem>
              <SelectItem value="single_multi">单品多件</SelectItem>
              <SelectItem value="multi_mixed">多品混合</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="拣货员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="unassigned">未分配</SelectItem>
              <SelectItem value="zhangsan">张三</SelectItem>
              <SelectItem value="lisi">李四</SelectItem>
              <SelectItem value="wangwu">王五</SelectItem>
              <SelectItem value="zhaoliu">赵六</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="创建人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="demo">demo</SelectItem>
              <SelectItem value="zhangsan">张三</SelectItem>
              <SelectItem value="lisi">李四</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="space-y-2">
          {/* Action Bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedWaves.length === waveOrders.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                已选择 {selectedWaves.length} 项
              </span>
            </div>
            <div className="flex gap-2">
              {canBatchAssignPicker() && (
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4" />
                  批量指定拣货员
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                导出
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedWaves.length === waveOrders.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>波次号</TableHead>
                  <TableHead className="text-center">订单数</TableHead>
                  <TableHead className="text-center">SKU数</TableHead>
                  <TableHead className="text-center">商品总数</TableHead>
                  <TableHead>波次类型</TableHead>
                  <TableHead className="text-center">已拣货数/总数</TableHead>
                  <TableHead className="w-48">拣货进度</TableHead>
                  <TableHead>拣货员</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>创建人</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waveOrders.map((wave) => (
                  <TableRow
                    key={wave.id}
                    className="hover:bg-table-row-hover transition-colors"
                    style={{
                      backgroundColor: selectedWaves.includes(wave.id)
                        ? "var(--table-row-hover)"
                        : undefined,
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedWaves.includes(wave.id)}
                        onCheckedChange={() => handleSelectWave(wave.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href="#"
                        className="font-mono text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate("/wave/detail");
                        }}
                      >
                        {wave.id}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">{wave.orderCount}</TableCell>
                    <TableCell className="text-center">{wave.skuCount}</TableCell>
                    <TableCell className="text-center">{wave.totalQty}</TableCell>
                    <TableCell>{getWaveTypeBadge(wave.waveType)}</TableCell>
                    <TableCell className="text-center">
                      <span className={wave.pickedQty > 0 ? "text-success-600" : ""}>
                        {wave.pickedQty}
                      </span>
                      <span className="text-muted-foreground"> / {wave.totalQty}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono">{wave.pickProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={wave.pickProgress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className={wave.picker === "-" ? "text-muted-foreground" : ""}>
                      {wave.picker}
                    </TableCell>
                    <TableCell>{getStatusBadge(wave.status)}</TableCell>
                    <TableCell className="text-sm">{wave.createdAt}</TableCell>
                    <TableCell>{wave.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleNavigate("/wave/detail")}
                        >
                          <Eye className="w-4 h-4" />
                          查看
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="flex items-center gap-1">
                                操作
                                <MoreHorizontal className="w-4 h-4" />
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {wave.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  指定拣货员
                                </DropdownMenuItem>
                                {wave.picker !== "-" && (
                                  <DropdownMenuItem>
                                    <Layers className="w-4 h-4 mr-2" />
                                    开始拣货
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                            {wave.status === "picking" && (
                              <>
                                <DropdownMenuItem>查看拣货进度</DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  更换拣货员
                                </DropdownMenuItem>
                              </>
                            )}
                            {wave.status === "picked" && (
                              <DropdownMenuItem>打印拣货单</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {waveOrders.length} 条
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
      </div>
    </WMSLayout>
  );
}
