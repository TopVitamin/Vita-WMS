import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Search, 
  Plus, 
  Edit, 
  Grid3x3,
  Power,
  PowerOff,
  Download,
  RefreshCw,
  Eye,
  Printer,
  ArrowUpDown,
  Zap,
  CheckCircle2,
  XCircle,
  Grid2x2,
  Package,
  Box
} from "lucide-react";
import { LoadingState } from "../components/wms/LoadingState";
import { EmptyState } from "../components/wms/EmptyState";

// 用途类型枚举
const USAGE_TYPES = [
  { value: "order_seeding", label: "订单播种墙", icon: Package, color: "var(--purple-600)" },
  { value: "collection_seeding", label: "集货播种墙", icon: Box, color: "var(--info-500)" },
] as const;

type UsageType = typeof USAGE_TYPES[number]['value'];

// 顺序策略枚举
const SORT_STRATEGIES = [
  { value: "z_shape", label: "Z字形（左→右，换行回左）", description: "1→2→3，换行4→5→6" },
  { value: "s_shape", label: "S字形（蛇形往返）", description: "1→2→3，换行6←5←4" },
  { value: "top_down", label: "从上到下（按列）", description: "按列从上到下遍历" },
  { value: "center_out", label: "中间向两边", description: "减少走动距离" },
] as const;

type SortStrategy = typeof SORT_STRATEGIES[number]['value'];

// 方位枚举
const ZONE_SIDES = [
  { value: "left", label: "左侧" },
  { value: "center", label: "中间" },
  { value: "right", label: "右侧" },
] as const;

type ZoneSide = typeof ZONE_SIDES[number]['value'];

interface WallSlot {
  slotCode: string;
  wallCode: string;
  rowIndex: number;
  colIndex: number;
  sortSequence: number;
  checkDigit: string;
  isActive: boolean;
  tagId?: string;
  zone?: ZoneSide;
}

interface SeedingWall {
  id: string;
  wallCode: string;
  wallName: string;
  rows: number;
  columns: number;
  totalSlots: number;
  usageType: UsageType;
  isActive: boolean;
  activeSlots: number;
  occupancyRate: number;
  createdAt: string;
  updatedAt: string;
  slots?: WallSlot[];
}

// 生成校验码（两位随机字符，避免相邻重复）
const generateCheckDigit = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去掉易混淆的 I、O、0、1
  return chars[Math.floor(Math.random() * chars.length)] + 
         chars[Math.floor(Math.random() * chars.length)];
};

// 生成播种位数据
const generateSlots = (
  wallCode: string, 
  rows: number, 
  cols: number,
  strategy: SortStrategy = "s_shape"
): WallSlot[] => {
  const slots: WallSlot[] = [];
  let sequence = 1;
  
  if (strategy === "s_shape") {
    // S字形：奇数行从左到右，偶数行从右到左
    for (let r = 1; r <= rows; r++) {
      if (r % 2 === 1) {
        // 奇数行：从左到右
        for (let c = 1; c <= cols; c++) {
          slots.push({
            slotCode: `${wallCode}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`,
            wallCode,
            rowIndex: r,
            colIndex: c,
            sortSequence: sequence++,
            checkDigit: generateCheckDigit(),
            isActive: true,
            zone: c <= Math.floor(cols / 3) ? "left" : c >= Math.ceil(cols * 2 / 3) ? "right" : "center",
          });
        }
      } else {
        // 偶数行：从右到左
        for (let c = cols; c >= 1; c--) {
          slots.push({
            slotCode: `${wallCode}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`,
            wallCode,
            rowIndex: r,
            colIndex: c,
            sortSequence: sequence++,
            checkDigit: generateCheckDigit(),
            isActive: true,
            zone: c <= Math.floor(cols / 3) ? "left" : c >= Math.ceil(cols * 2 / 3) ? "right" : "center",
          });
        }
      }
    }
  } else if (strategy === "z_shape") {
    // Z字形：所有行都从左到右
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        slots.push({
          slotCode: `${wallCode}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`,
          wallCode,
          rowIndex: r,
          colIndex: c,
          sortSequence: sequence++,
          checkDigit: generateCheckDigit(),
          isActive: true,
          zone: c <= Math.floor(cols / 3) ? "left" : c >= Math.ceil(cols * 2 / 3) ? "right" : "center",
        });
      }
    }
  } else if (strategy === "top_down") {
    // 从上到下（按列）
    for (let c = 1; c <= cols; c++) {
      for (let r = 1; r <= rows; r++) {
        slots.push({
          slotCode: `${wallCode}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`,
          wallCode,
          rowIndex: r,
          colIndex: c,
          sortSequence: sequence++,
          checkDigit: generateCheckDigit(),
          isActive: true,
          zone: c <= Math.floor(cols / 3) ? "left" : c >= Math.ceil(cols * 2 / 3) ? "right" : "center",
        });
      }
    }
  } else if (strategy === "center_out") {
    // 中间向两边
    const midCol = Math.ceil(cols / 2);
    const positions: Array<{r: number, c: number}> = [];
    
    for (let r = 1; r <= rows; r++) {
      for (let offset = 0; offset < cols; offset++) {
        const c1 = midCol + offset;
        const c2 = midCol - offset - 1;
        if (c1 <= cols) positions.push({r, c: c1});
        if (c2 >= 1 && c2 !== c1) positions.push({r, c: c2});
      }
    }
    
    positions.forEach(({r, c}) => {
      slots.push({
        slotCode: `${wallCode}-${String(r).padStart(2, '0')}-${String(c).padStart(2, '0')}`,
        wallCode,
        rowIndex: r,
        colIndex: c,
        sortSequence: sequence++,
        checkDigit: generateCheckDigit(),
        isActive: true,
        zone: c <= Math.floor(cols / 3) ? "left" : c >= Math.ceil(cols * 2 / 3) ? "right" : "center",
      });
    });
  }
  
  return slots.sort((a, b) => {
    if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex;
    return a.colIndex - b.colIndex;
  });
};

// 模拟数据
const mockWalls: SeedingWall[] = [
  {
    id: "1",
    wallCode: "WALL-A",
    wallName: "电商复核墙A组",
    rows: 4,
    columns: 6,
    totalSlots: 24,
    usageType: "order_seeding",
    isActive: true,
    activeSlots: 23,
    occupancyRate: 85.5,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-07 14:20:00",
  },
  {
    id: "2",
    wallCode: "WALL-B",
    wallName: "电商复核墙B组",
    rows: 5,
    columns: 8,
    totalSlots: 40,
    usageType: "order_seeding",
    isActive: true,
    activeSlots: 40,
    occupancyRate: 92.3,
    createdAt: "2024-01-15 10:35:00",
    updatedAt: "2024-12-07 09:15:00",
  },
  {
    id: "3",
    wallCode: "WALL-C",
    wallName: "批发集货墙",
    rows: 3,
    columns: 10,
    totalSlots: 30,
    usageType: "collection_seeding",
    isActive: true,
    activeSlots: 30,
    occupancyRate: 45.0,
    createdAt: "2024-02-20 11:00:00",
    updatedAt: "2024-12-06 16:30:00",
  },
  {
    id: "4",
    wallCode: "WALL-D",
    wallName: "预留播种墙",
    rows: 4,
    columns: 8,
    totalSlots: 32,
    usageType: "order_seeding",
    isActive: false,
    activeSlots: 0,
    occupancyRate: 0,
    createdAt: "2024-03-10 09:00:00",
    updatedAt: "2024-11-20 10:00:00",
  },
];

interface SeedingWallManagementPageProps {
  onNavigate?: (path: string) => void;
}

export default function SeedingWallManagementPage({ onNavigate }: SeedingWallManagementPageProps) {
  const [walls] = useState<SeedingWall[]>(mockWalls);
  const [isLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [usageTypeFilter, setUsageTypeFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [editingWall, setEditingWall] = useState<SeedingWall | null>(null);
  const [previewWall, setPreviewWall] = useState<SeedingWall | null>(null);
  const [previewSlots, setPreviewSlots] = useState<WallSlot[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    wallCode: "",
    wallName: "",
    rows: 4,
    columns: 6,
    usageType: "order_seeding" as UsageType,
    isActive: true,
    sortStrategy: "s_shape" as SortStrategy,
  });

  // 筛选逻辑
  const filteredWalls = walls.filter((wall) => {
    const matchesKeyword = 
      wall.wallCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      wall.wallName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesUsageType = usageTypeFilter === "all" || wall.usageType === usageTypeFilter;
    const matchesActive = 
      activeFilter === "all" || 
      (activeFilter === "active" && wall.isActive) ||
      (activeFilter === "inactive" && !wall.isActive);
    
    return matchesKeyword && matchesUsageType && matchesActive;
  });

  // 统计数据
  const stats = {
    total: walls.length,
    active: walls.filter(w => w.isActive).length,
    inactive: walls.filter(w => !w.isActive).length,
    totalSlots: walls.reduce((sum, w) => sum + w.totalSlots, 0),
    avgOccupancy: walls.filter(w => w.isActive).reduce((sum, w) => sum + w.occupancyRate, 0) / 
                  (walls.filter(w => w.isActive).length || 1),
  };

  // 获取用途类型配置
  const getUsageTypeConfig = (type: UsageType) => {
    return USAGE_TYPES.find(t => t.value === type) || USAGE_TYPES[0];
  };

  // 打开编辑对话框
  const handleEdit = (wall: SeedingWall) => {
    setEditingWall(wall);
    setFormData({
      wallCode: wall.wallCode,
      wallName: wall.wallName,
      rows: wall.rows,
      columns: wall.columns,
      usageType: wall.usageType,
      isActive: wall.isActive,
      sortStrategy: "s_shape",
    });
    setIsEditDialogOpen(true);
  };

  // 打开预览对话框
  const handlePreview = (wall: SeedingWall) => {
    setPreviewWall(wall);
    // 生成或获取格口数据用于预览
    const slots = generateSlots(wall.wallCode, wall.rows, wall.columns, "s_shape");
    // 模拟一个格口被禁用
    if (slots.length > 5) {
      slots[5].isActive = false;
    }
    setPreviewSlots(slots);
    setIsPreviewDialogOpen(true);
  };

  // 打开打印对话框
  const handlePrint = (wall: SeedingWall) => {
    setPreviewWall(wall);
    const slots = generateSlots(wall.wallCode, wall.rows, wall.columns, "s_shape");
    setPreviewSlots(slots);
    setIsPrintDialogOpen(true);
  };

  // 预览生成的格口
  const handlePreviewGeneration = () => {
    const slots = generateSlots(
      formData.wallCode, 
      formData.rows, 
      formData.columns,
      formData.sortStrategy
    );
    setPreviewSlots(slots);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      wallCode: "",
      wallName: "",
      rows: 4,
      columns: 6,
      usageType: "order_seeding",
      isActive: true,
      sortStrategy: "s_shape",
    });
    setEditingWall(null);
    setPreviewSlots([]);
  };

  // 处理提交
  const handleSubmit = () => {
    console.log("提交数据:", formData);
    console.log("生成的格口数据:", previewSlots);
    // 这里应该调用API保存数据
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // 切换启用/停用状态
  const handleToggleActive = (wall: SeedingWall) => {
    console.log(`切换播种墙 ${wall.wallCode} 状态:`, !wall.isActive);
    // 这里应该调用API更新状态
  };

  return (
    <WMSLayout title="播种墙管理" currentPath="/master-data/seeding-walls" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增播种墙
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新增播种墙</DialogTitle>
                  <DialogDescription>
                    创建新的播种墙，系统将根据行列数自动生成格口数据
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">基本信息</TabsTrigger>
                    <TabsTrigger value="preview" disabled={!formData.wallCode || formData.rows < 1 || formData.columns < 1}>
                      格口预览 ({formData.rows * formData.columns}个)
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wallCode">墙编号 *</Label>
                        <Input
                          id="wallCode"
                          placeholder="例如：WALL-A"
                          value={formData.wallCode}
                          onChange={(e) => setFormData({ ...formData, wallCode: e.target.value.toUpperCase() })}
                        />
                        <p className="text-xs text-muted-foreground">用于生成格口编号前缀</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wallName">墙名称 *</Label>
                        <Input
                          id="wallName"
                          placeholder="例如：电商复核墙A组"
                          value={formData.wallName}
                          onChange={(e) => setFormData({ ...formData, wallName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rows">层数（行数）*</Label>
                        <Input
                          id="rows"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.rows}
                          onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) || 1 })}
                        />
                        <p className="text-xs text-muted-foreground">建议：2-6 层</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="columns">列数 *</Label>
                        <Input
                          id="columns"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.columns}
                          onChange={(e) => setFormData({ ...formData, columns: parseInt(e.target.value) || 1 })}
                        />
                        <p className="text-xs text-muted-foreground">建议：4-12 列</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="usageType">用途类型 *</Label>
                        <Select
                          value={formData.usageType}
                          onValueChange={(value: UsageType) => setFormData({ ...formData, usageType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {USAGE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4" style={{ color: type.color }} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sortStrategy">作业顺序策略 *</Label>
                        <Select
                          value={formData.sortStrategy}
                          onValueChange={(value: SortStrategy) => {
                            setFormData({ ...formData, sortStrategy: value });
                            setPreviewSlots([]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SORT_STRATEGIES.map((strategy) => (
                              <SelectItem key={strategy.value} value={strategy.value}>
                                <div>
                                  <div>{strategy.label}</div>
                                  <div className="text-xs text-muted-foreground">{strategy.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">决定播种时的遍历顺序</p>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <Label htmlFor="isActive" className="cursor-pointer">启用状态</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              停用后该播种墙将无法分配波次任务
                            </p>
                          </div>
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Zap className="w-4 h-4 text-primary" />
                              一键生成说明
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• 系统将自动生成 <span className="text-foreground">{formData.rows} × {formData.columns} = {formData.rows * formData.columns} 个格口</span></p>
                            <p>• 格口编号规则：<code className="text-xs bg-background px-1 py-0.5 rounded">{formData.wallCode || "WALL-A"}-01-01</code> 到 <code className="text-xs bg-background px-1 py-0.5 rounded">{formData.wallCode || "WALL-A"}-{String(formData.rows).padStart(2, '0')}-{String(formData.columns).padStart(2, '0')}</code></p>
                            <p>• 每个格口自动分配随机校验码（两位字符）</p>
                            <p>• 可在"格口预览"标签页查看生成结果</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">格口布局预览</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.rows} 层 × {formData.columns} 列 = {formData.rows * formData.columns} 个格口
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePreviewGeneration}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        生成预览
                      </Button>
                    </div>
                    
                    {previewSlots.length > 0 ? (
                      <div className="space-y-4">
                        {/* 网格预览 */}
                        <div className="border rounded-lg p-4 bg-muted/20">
                          <div 
                            className="grid gap-2"
                            style={{
                              gridTemplateColumns: `repeat(${formData.columns}, 1fr)`,
                            }}
                          >
                            {Array.from({ length: formData.rows }, (_, r) => 
                              Array.from({ length: formData.columns }, (_, c) => {
                                const slot = previewSlots.find(s => s.rowIndex === r + 1 && s.colIndex === c + 1);
                                return (
                                  <div
                                    key={`${r}-${c}`}
                                    className="aspect-square border rounded flex flex-col items-center justify-center gap-1 p-2 bg-background hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="text-xs font-mono">{slot?.slotCode.split('-').slice(1).join('-')}</div>
                                    <div className="text-[10px] text-muted-foreground">#{slot?.sortSequence}</div>
                                    <div className="text-xs font-mono text-primary">{slot?.checkDigit}</div>
                                  </div>
                                );
                              })
                            ).flat()}
                          </div>
                        </div>
                        
                        {/* 格口列表 */}
                        <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>格口编号</TableHead>
                                <TableHead className="text-center">层</TableHead>
                                <TableHead className="text-center">列</TableHead>
                                <TableHead className="text-center">作业顺序</TableHead>
                                <TableHead className="text-center">校验码</TableHead>
                                <TableHead className="text-center">方位</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {previewSlots.slice(0, 10).map((slot) => (
                                <TableRow key={slot.slotCode}>
                                  <TableCell className="font-mono text-sm">{slot.slotCode}</TableCell>
                                  <TableCell className="text-center">{slot.rowIndex}</TableCell>
                                  <TableCell className="text-center">{slot.colIndex}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="outline">{slot.sortSequence}</Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <code className="text-xs bg-muted px-2 py-1 rounded">{slot.checkDigit}</code>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="secondary">
                                      {ZONE_SIDES.find(z => z.value === slot.zone)?.label}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {previewSlots.length > 10 && (
                            <div className="text-center text-xs text-muted-foreground py-2 border-t">
                              显示前 10 个，共 {previewSlots.length} 个格口
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon="grid"
                        title={'点击"生成预览"查看格口布局'}
                        description="系统将根据您设置的行列数和顺序策略生成格口"
                      />
                    )}
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    取消
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.wallCode || !formData.wallName || formData.rows < 1 || formData.columns < 1}
                  >
                    创建播种墙
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>总播种墙数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                已启用 {stats.active} 个
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>启用中</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-success">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">
                正常使用
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>已停用</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-muted-foreground">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground mt-1">
                维护或闲置
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>总格口数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.totalSlots}</div>
              <p className="text-xs text-muted-foreground mt-1">
                所有播种墙
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>平均占用率</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.avgOccupancy.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                启用墙平均值
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>关键词搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="墙编号/名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>用途类型</Label>
                <Select value={usageTypeFilter} onValueChange={setUsageTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    {USAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">启用中</SelectItem>
                    <SelectItem value="inactive">已停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>播种墙列表</CardTitle>
                <CardDescription>
                  共 {filteredWalls.length} 条记录
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="加载播种墙数据中..." />
            ) : filteredWalls.length === 0 ? (
              <EmptyState
                icon="search"
                title="未找到匹配的播种墙"
                description="请尝试调整筛选条件"
              />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>墙编号</TableHead>
                      <TableHead>墙名称</TableHead>
                      <TableHead>用途类型</TableHead>
                      <TableHead className="text-center">规格（层×列）</TableHead>
                      <TableHead className="text-right">总格口</TableHead>
                      <TableHead className="text-right">可用格口</TableHead>
                      <TableHead className="text-right">占用率</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWalls.map((wall) => {
                      const typeConfig = getUsageTypeConfig(wall.usageType);
                      const TypeIcon = typeConfig.icon;
                      
                      return (
                        <TableRow key={wall.id}>
                          <TableCell className="font-mono">{wall.wallCode}</TableCell>
                          <TableCell>{wall.wallName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4" style={{ color: typeConfig.color }} />
                              <span>{typeConfig.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Grid2x2 className="w-4 h-4 text-muted-foreground" />
                              <span>{wall.rows} × {wall.columns}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{wall.totalSlots}</TableCell>
                          <TableCell className="text-right">
                            <span className={wall.activeSlots < wall.totalSlots ? "text-warning" : ""}>
                              {wall.activeSlots}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${wall.occupancyRate}%` }}
                                />
                              </div>
                              <span className="text-sm w-12 text-right">
                                {wall.occupancyRate.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {wall.isActive ? (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                启用中
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground">
                                已停用
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {wall.updatedAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePreview(wall)}
                                title="预览墙面"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrint(wall)}
                                title="打印标签"
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(wall)}
                                title="编辑"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(wall)}
                                title={wall.isActive ? "停用" : "启用"}
                              >
                                {wall.isActive ? (
                                  <PowerOff className="w-4 h-4 text-warning" />
                                ) : (
                                  <Power className="w-4 h-4 text-success" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>播种墙预览 - {previewWall?.wallName}</DialogTitle>
              <DialogDescription>
                {previewWall?.wallCode} | {previewWall?.rows} 层 × {previewWall?.columns} 列 | 
                可用格口: {previewSlots.filter(s => s.isActive).length}/{previewSlots.length}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 墙面网格 */}
              <div className="border rounded-lg p-6 bg-muted/10">
                <div 
                  className="grid gap-2 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${previewWall?.columns || 1}, 1fr)`,
                    maxWidth: `${(previewWall?.columns || 1) * 100}px`,
                  }}
                >
                  {previewWall && Array.from({ length: previewWall.rows }, (_, r) => 
                    Array.from({ length: previewWall.columns }, (_, c) => {
                      const slot = previewSlots.find(s => s.rowIndex === r + 1 && s.colIndex === c + 1);
                      const isDisabled = !slot?.isActive;
                      
                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`aspect-square border-2 rounded-lg flex flex-col items-center justify-center gap-1 p-2 transition-all ${
                            isDisabled 
                              ? 'bg-muted/50 border-muted-foreground/20 opacity-50' 
                              : 'bg-background border-primary/30 hover:border-primary hover:shadow-md cursor-pointer'
                          }`}
                          title={slot?.slotCode}
                        >
                          <div className={`text-[10px] font-mono ${isDisabled ? 'text-muted-foreground' : ''}`}>
                            {slot?.slotCode.split('-').slice(1).join('-')}
                          </div>
                          <div className={`text-xs ${isDisabled ? 'text-muted-foreground' : 'text-primary'}`}>
                            #{slot?.sortSequence}
                          </div>
                          <code className={`text-xs px-1 rounded ${isDisabled ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                            {slot?.checkDigit}
                          </code>
                          {isDisabled && (
                            <XCircle className="w-3 h-3 text-error absolute" />
                          )}
                        </div>
                      );
                    })
                  ).flat()}
                </div>
              </div>
              
              {/* 图例 */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 bg-background rounded"></div>
                  <span>可用格口</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-muted-foreground/20 bg-muted/50 rounded opacity-50"></div>
                  <span>已禁用</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">A9</code>
                  <span>校验码</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#1</span>
                  <span>作业顺序</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print Dialog */}
        <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>打印格口标签 - {previewWall?.wallName}</DialogTitle>
              <DialogDescription>
                为 {previewWall?.wallCode} 的所有格口生成条码标签
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>标签规格</Label>
                  <Select defaultValue="50x30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50x30">50mm × 30mm（推荐）</SelectItem>
                      <SelectItem value="40x30">40mm × 30mm</SelectItem>
                      <SelectItem value="60x40">60mm × 40mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>打印内容</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">条码 + 编号 + 校验码</SelectItem>
                      <SelectItem value="simple">仅条码 + 编号</SelectItem>
                      <SelectItem value="check">仅校验码（大字体）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">打印预览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded bg-background p-4 text-center space-y-2">
                    <div className="text-xs text-muted-foreground">█║█║║█║█║█ ║█║║ █║█</div>
                    <div className="font-mono">{previewWall?.wallCode}-01-01</div>
                    <div className="text-xs text-muted-foreground">校验码:</div>
                    <code className="text-lg bg-muted px-3 py-1 rounded">A9</code>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-start gap-2 p-3 border rounded-lg bg-info/5 border-info/20">
                <CheckCircle2 className="w-4 h-4 text-info mt-0.5" />
                <div className="text-sm text-info-foreground">
                  <p>将打印 <span className="font-medium">{previewSlots.filter(s => s.isActive).length}</span> 个可用格口的标签</p>
                  <p className="text-xs mt-1">已禁用的格口不会打印</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => {
                console.log("打印标签:", previewWall?.wallCode);
                setIsPrintDialogOpen(false);
              }}>
                <Printer className="w-4 h-4 mr-2" />
                开始打印
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WMSLayout>
  );
}