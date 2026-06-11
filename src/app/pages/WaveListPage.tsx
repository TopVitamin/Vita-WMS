import "../../styles/globals.css";
import { useState } from "react";
import { 
  Filter, Download, MoreHorizontal, Eye, Search, Layers, UserPlus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import { DataTableHeaderRow, StatusBadge, StatusTabCount } from "../components/business";
import { waveStatusMap, orderStructureStatusMap } from "../configs/wmsStatusMap";
import {
  createPickingWorkFromWave,
  listWaveOrders,
  setSelectedWaveId,
  startPickingWork,
  type WaveOrder,
} from "../services/mock";
import { toast } from "sonner";

interface WaveListPageProps {
  onNavigate?: (path: string) => void;
}

export default function WaveListPage({ onNavigate }: WaveListPageProps) {
  const [waveOrders, setWaveOrders] = useState<WaveOrder[]>(() => listWaveOrders());
  const [selectedWaves, setSelectedWaves] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchField, setSearchField] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [waveTypeFilter, setWaveTypeFilter] = useState("all");
  const [pickerFilter, setPickerFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const statusTabs = [
    { value: "all", label: "全部", statuses: [] },
    { value: "created", label: "已创建", statuses: ["created"] },
    { value: "assigned", label: "已分配", statuses: ["assigned"] },
    { value: "picking", label: "拣货中", statuses: ["picking"] },
    { value: "picked", label: "已拣货", statuses: ["picked"] },
    { value: "sorting", label: "分拣中", statuses: ["sorting"] },
    { value: "sorted", label: "已分拣", statuses: ["sorted"] },
    { value: "completed", label: "已完成", statuses: ["completed"] },
    { value: "exception", label: "异常/取消", statuses: ["exception", "cancelled"] },
  ];

  const activeTab = statusTabs.find((tab) => tab.value === activeStatus) ?? statusTabs[0];
  const getTabCount = (statuses: string[]) => {
    if (statuses.length === 0) return waveOrders.length;
    return waveOrders.filter((wave) => statuses.includes(wave.status)).length;
  };

  const filteredWaves = waveOrders.filter((wave) => {
    if (activeTab.statuses.length > 0 && !activeTab.statuses.includes(wave.status)) return false;
    if (waveTypeFilter !== "all" && wave.waveType !== waveTypeFilter) return false;
    if (pickerFilter === "unassigned" && wave.picker) return false;
    if (pickerFilter !== "all" && pickerFilter !== "unassigned" && wave.picker !== pickerFilter) return false;
    if (creatorFilter !== "all" && wave.createdBy !== creatorFilter) return false;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      const fieldValues: Record<string, string> = {
        wave_no: wave.id,
        outbound_no: wave.outboundOrderIds.join(" "),
        picking_no: wave.pickingWorkNos.join(" "),
        picker: wave.picker || "",
        creator: wave.createdBy,
        all: [wave.id, wave.outboundOrderIds.join(" "), wave.pickingWorkNos.join(" "), wave.picker || "", wave.createdBy].join(" "),
      };
      if (!fieldValues[searchField].toLowerCase().includes(keyword)) return false;
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedWaves.length === filteredWaves.length) {
      setSelectedWaves([]);
    } else {
      setSelectedWaves(filteredWaves.map((wave) => wave.id));
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
    return selected.length > 0 && selected.every((wave) => wave.status === "created");
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const openWaveDetail = (waveId: string) => {
    setSelectedWaveId(waveId);
    handleNavigate("/wave/detail");
  };

  const refreshWaves = () => {
    setWaveOrders(listWaveOrders());
  };

  const handleGeneratePickingWork = (wave: WaveOrder) => {
    const work = createPickingWorkFromWave(wave.id, { picker: wave.picker || "李四" });
    if (work) {
      refreshWaves();
      toast.success(`已为波次 ${wave.id} 生成拣货单 ${work.taskNo}`);
    }
  };

  const handleStartPicking = (wave: WaveOrder) => {
    const work = wave.pickingWorkNos[0]
      ? startPickingWork(wave.pickingWorkNos[0])
      : createPickingWorkFromWave(wave.id, { picker: wave.picker || "李四" });
    if (work) {
      startPickingWork(work.taskNo);
      refreshWaves();
      toast.success(`波次 ${wave.id} 已开始拣货`);
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
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="h-auto flex-wrap justify-start">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="group gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {tab.label}
                <StatusTabCount count={getTabCount(tab.statuses)} inverseOnActive />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filter Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="波次号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部字段</SelectItem>
              <SelectItem value="wave_no">波次号</SelectItem>
              <SelectItem value="outbound_no">出库单号</SelectItem>
              <SelectItem value="picking_no">拣货单号</SelectItem>
              <SelectItem value="picker">拣货员</SelectItem>
              <SelectItem value="creator">创建人</SelectItem>
            </SelectContent>
          </Select>
          <Input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="搜索波次、出库单、拣货单、人员..." className="w-80" />
          <Select value={waveTypeFilter} onValueChange={setWaveTypeFilter}>
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
          <Select value={pickerFilter} onValueChange={setPickerFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="拣货员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="unassigned">未分配</SelectItem>
              <SelectItem value="张三">张三</SelectItem>
              <SelectItem value="李四">李四</SelectItem>
              <SelectItem value="王五">王五</SelectItem>
              <SelectItem value="赵六">赵六</SelectItem>
            </SelectContent>
          </Select>
          <Select value={creatorFilter} onValueChange={setCreatorFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="创建人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="demo">demo</SelectItem>
              <SelectItem value="张三">张三</SelectItem>
              <SelectItem value="李四">李四</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Search className="w-4 h-4" />
            搜索
          </Button>
          <Button variant="outline" onClick={() => {
            setActiveStatus("all");
            setSearchField("all");
            setSearchKeyword("");
            setWaveTypeFilter("all");
            setPickerFilter("all");
            setCreatorFilter("all");
          }}>
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
                checked={selectedWaves.length === filteredWaves.length && filteredWaves.length > 0}
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
                <DataTableHeaderRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedWaves.length === filteredWaves.length && filteredWaves.length > 0}
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
                </DataTableHeaderRow>
              </TableHeader>
              <TableBody>
                {filteredWaves.map((wave) => (
                  <TableRow
                    key={wave.id}
                    className={`hover:bg-table-row-hover transition-colors ${selectedWaves.includes(wave.id) ? "bg-table-row-hover" : ""}`}
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
                          openWaveDetail(wave.id);
                        }}
                      >
                        {wave.id}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">{wave.orderCount}</TableCell>
                    <TableCell className="text-center">{wave.skuCount}</TableCell>
                    <TableCell className="text-center">{wave.totalQty}</TableCell>
                    <TableCell><StatusBadge {...orderStructureStatusMap[wave.waveType]} /></TableCell>
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
                    <TableCell className={!wave.picker ? "text-muted-foreground" : ""}>
                      {wave.picker || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge {...(waveStatusMap[wave.status] ?? waveStatusMap.pending)} />
                    </TableCell>
                    <TableCell className="text-sm">{wave.createdAt}</TableCell>
                    <TableCell>{wave.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openWaveDetail(wave.id)}
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
                            {(wave.status === "created" || wave.status === "assigned") && (
                              <>
                                <DropdownMenuItem>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  指定拣货员
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGeneratePickingWork(wave)}>
                                  <Layers className="w-4 h-4 mr-2" />
                                  生成拣货单
                                </DropdownMenuItem>
                                {wave.picker && (
                                  <DropdownMenuItem onClick={() => handleStartPicking(wave)}>
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
            共 {filteredWaves.length} 条
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
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
