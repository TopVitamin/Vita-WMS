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
import { 
  Search, 
  Plus, 
  Edit, 
  Warehouse, 
  MapPin,
  Package,
  PackageOpen,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { LoadingState } from "../components/wms/LoadingState";
import { EmptyState } from "../components/wms/EmptyState";

// 库区类型枚举
const ZONE_TYPES = [
  { value: "storage", label: "存储区", icon: Package, color: "var(--purple-600)" },
  { value: "pick_face", label: "拣货区", icon: PackageOpen, color: "var(--info-500)" },
  { value: "staging", label: "暂存区", icon: Truck, color: "var(--warning-500)" },
  { value: "qc_return", label: "异常区", icon: AlertTriangle, color: "var(--error-500)" },
] as const;

type ZoneType = typeof ZONE_TYPES[number]['value'];

interface Zone {
  id: string;
  zoneCode: string;
  zoneName: string;
  warehouseId: string;
  warehouseName: string;
  zoneType: ZoneType;
  replenishmentSource: boolean;
  isActive: boolean;
  locationCount: number;
  occupancyRate: number;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockZones: Zone[] = [
  {
    id: "1",
    zoneCode: "WH1-A01",
    zoneName: "整箱存储区A",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneType: "storage",
    replenishmentSource: true,
    isActive: true,
    locationCount: 120,
    occupancyRate: 85.5,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-01 14:20:00",
  },
  {
    id: "2",
    zoneCode: "WH1-B01",
    zoneName: "拆零拣货区B",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneType: "pick_face",
    replenishmentSource: false,
    isActive: true,
    locationCount: 80,
    occupancyRate: 92.3,
    createdAt: "2024-01-15 10:35:00",
    updatedAt: "2024-12-05 09:15:00",
  },
  {
    id: "3",
    zoneCode: "WH1-S01",
    zoneName: "收货暂存区",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneType: "staging",
    replenishmentSource: false,
    isActive: true,
    locationCount: 20,
    occupancyRate: 45.0,
    createdAt: "2024-01-15 10:40:00",
    updatedAt: "2024-12-07 11:30:00",
  },
  {
    id: "4",
    zoneCode: "WH1-Q01",
    zoneName: "质检异常区",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneType: "qc_return",
    replenishmentSource: false,
    isActive: true,
    locationCount: 30,
    occupancyRate: 20.5,
    createdAt: "2024-01-15 10:45:00",
    updatedAt: "2024-12-06 16:45:00",
  },
  {
    id: "5",
    zoneCode: "WH2-A01",
    zoneName: "整箱存储区A",
    warehouseId: "WH2",
    warehouseName: "香港仓",
    zoneType: "storage",
    replenishmentSource: true,
    isActive: true,
    locationCount: 150,
    occupancyRate: 78.2,
    createdAt: "2024-02-20 09:00:00",
    updatedAt: "2024-12-03 10:20:00",
  },
  {
    id: "6",
    zoneCode: "WH2-B01",
    zoneName: "快速拣货区",
    warehouseId: "WH2",
    warehouseName: "香港仓",
    zoneType: "pick_face",
    replenishmentSource: false,
    isActive: true,
    locationCount: 60,
    occupancyRate: 95.8,
    createdAt: "2024-02-20 09:10:00",
    updatedAt: "2024-12-07 08:45:00",
  },
  {
    id: "7",
    zoneCode: "WH1-A02",
    zoneName: "整箱存储区B",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneType: "storage",
    replenishmentSource: true,
    isActive: false,
    locationCount: 100,
    occupancyRate: 0,
    createdAt: "2024-03-10 14:20:00",
    updatedAt: "2024-11-20 15:30:00",
  },
  {
    id: "8",
    zoneCode: "WH3-A01",
    zoneName: "自动化存储区",
    warehouseId: "WH3",
    warehouseName: "美国仓",
    zoneType: "storage",
    replenishmentSource: true,
    isActive: true,
    locationCount: 200,
    occupancyRate: 88.9,
    createdAt: "2024-04-01 08:00:00",
    updatedAt: "2024-12-06 12:00:00",
  },
];

const warehouses = [
  { id: "WH1", name: "深圳仓" },
  { id: "WH2", name: "香港仓" },
  { id: "WH3", name: "美国仓" },
];

interface ZoneManagementPageProps {
  onNavigate?: (path: string) => void;
}

export default function ZoneManagementPage({ onNavigate }: ZoneManagementPageProps) {
  const [zones] = useState<Zone[]>(mockZones);
  const [isLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");
  const [zoneTypeFilter, setZoneTypeFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    zoneCode: "",
    zoneName: "",
    warehouseId: "",
    zoneType: "storage" as ZoneType,
    replenishmentSource: false,
    isActive: true,
  });

  // 筛选逻辑
  const filteredZones = zones.filter((zone) => {
    const matchesKeyword = 
      zone.zoneCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      zone.zoneName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesWarehouse = warehouseFilter === "all" || zone.warehouseId === warehouseFilter;
    const matchesZoneType = zoneTypeFilter === "all" || zone.zoneType === zoneTypeFilter;
    const matchesActive = 
      activeFilter === "all" || 
      (activeFilter === "active" && zone.isActive) ||
      (activeFilter === "inactive" && !zone.isActive);
    
    return matchesKeyword && matchesWarehouse && matchesZoneType && matchesActive;
  });

  // 统计数据
  const stats = {
    total: zones.length,
    active: zones.filter(z => z.isActive).length,
    inactive: zones.filter(z => !z.isActive).length,
    avgOccupancy: zones.filter(z => z.isActive).reduce((sum, z) => sum + z.occupancyRate, 0) / zones.filter(z => z.isActive).length,
  };

  // 获取库区类型配置
  const getZoneTypeConfig = (type: ZoneType) => {
    return ZONE_TYPES.find(t => t.value === type) || ZONE_TYPES[0];
  };

  // 打开编辑对话框
  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      zoneCode: zone.zoneCode,
      zoneName: zone.zoneName,
      warehouseId: zone.warehouseId,
      zoneType: zone.zoneType,
      replenishmentSource: zone.replenishmentSource,
      isActive: zone.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      zoneCode: "",
      zoneName: "",
      warehouseId: "",
      zoneType: "storage",
      replenishmentSource: false,
      isActive: true,
    });
    setEditingZone(null);
  };

  // 处理提交
  const handleSubmit = () => {
    console.log("提交数据:", formData);
    // 这里应该调用API保存数据
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // 切换启用/停用状态
  const handleToggleActive = (zone: Zone) => {
    console.log(`切换库区 ${zone.zoneCode} 状态:`, !zone.isActive);
    // 这里应该调用API更新状态
  };

  return (
    <WMSLayout title="库区管理" currentPath="/master-data/zones" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* Header */}
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
                  新增库区
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>新增库区</DialogTitle>
                  <DialogDescription>
                    创建新的库区，定义库区的基本信息和业务属性
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneCode">库区编号 *</Label>
                    <Input
                      id="zoneCode"
                      placeholder="例如：WH1-A01"
                      value={formData.zoneCode}
                      onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">建议包含仓库前缀，保证唯一性</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">库区名称 *</Label>
                    <Input
                      id="zoneName"
                      placeholder="例如：整箱存储区A"
                      value={formData.zoneName}
                      onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">所属仓库 *</Label>
                    <Select
                      value={formData.warehouseId}
                      onValueChange={(value) => setFormData({ ...formData, warehouseId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((wh) => (
                          <SelectItem key={wh.id} value={wh.id}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoneType">库区类型 *</Label>
                    <Select
                      value={formData.zoneType}
                      onValueChange={(value: ZoneType) => setFormData({ ...formData, zoneType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择库区类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {ZONE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" style={{ color: type.color }} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {formData.zoneType === 'storage' && '用于长期存储商品'}
                      {formData.zoneType === 'pick_face' && '用于快速拣货作业'}
                      {formData.zoneType === 'staging' && '收货/发货临时暂存'}
                      {formData.zoneType === 'qc_return' && '质检、退货等异常处理'}
                    </p>
                  </div>
                  <div className="space-y-3 col-span-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="replenishment" className="cursor-pointer">补货来源</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          该库区的库存是否可以作为拣货区的补货来源
                        </p>
                      </div>
                      <Switch
                        id="replenishment"
                        checked={formData.replenishmentSource}
                        onCheckedChange={(checked) => setFormData({ ...formData, replenishmentSource: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="isActive" className="cursor-pointer">启用状态</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          停用后该库区将无法进行入库、出库等操作
                        </p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSubmit}>
                    创建库区
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>总库区数</CardDescription>
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
                正常运营库区
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
                维护或盘点中
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
                启用库区平均值
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>关键词搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="库区编号/名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>所属仓库</Label>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部仓库</SelectItem>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>库区类型</Label>
                <Select value={zoneTypeFilter} onValueChange={setZoneTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    {ZONE_TYPES.map((type) => (
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
                <CardTitle>库区列表</CardTitle>
                <CardDescription>
                  共 {filteredZones.length} 条记录
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
              <LoadingState message="加载库区数据中..." />
            ) : filteredZones.length === 0 ? (
              <EmptyState
                icon="search"
                title="未找到匹配的库区"
                description="请尝试调整筛选条件"
              />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>库区编号</TableHead>
                      <TableHead>库区名称</TableHead>
                      <TableHead>所属仓库</TableHead>
                      <TableHead>库区类型</TableHead>
                      <TableHead className="text-center">补货来源</TableHead>
                      <TableHead className="text-right">库位数</TableHead>
                      <TableHead className="text-right">占用率</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredZones.map((zone) => {
                      const typeConfig = getZoneTypeConfig(zone.zoneType);
                      const TypeIcon = typeConfig.icon;
                      
                      return (
                        <TableRow key={zone.id}>
                          <TableCell className="font-mono">{zone.zoneCode}</TableCell>
                          <TableCell>{zone.zoneName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Warehouse className="w-4 h-4 text-muted-foreground" />
                              {zone.warehouseName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4" style={{ color: typeConfig.color }} />
                              <span>{typeConfig.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {zone.replenishmentSource ? (
                              <CheckCircle className="w-4 h-4 text-success inline-block" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground inline-block" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">{zone.locationCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${zone.occupancyRate}%` }}
                                />
                              </div>
                              <span className="text-sm w-12 text-right">
                                {zone.occupancyRate.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {zone.isActive ? (
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
                            {zone.updatedAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog open={isEditDialogOpen && editingZone?.id === zone.id} onOpenChange={(open) => {
                                setIsEditDialogOpen(open);
                                if (!open) resetForm();
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(zone)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>编辑库区</DialogTitle>
                                    <DialogDescription>
                                      修改库区 {zone.zoneCode} 的信息
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-zoneCode">库区编号 *</Label>
                                      <Input
                                        id="edit-zoneCode"
                                        value={formData.zoneCode}
                                        onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })}
                                        disabled
                                        className="bg-muted"
                                      />
                                      <p className="text-xs text-muted-foreground">编号不可修改</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-zoneName">库区名称 *</Label>
                                      <Input
                                        id="edit-zoneName"
                                        value={formData.zoneName}
                                        onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-warehouse">所属仓库 *</Label>
                                      <Select
                                        value={formData.warehouseId}
                                        onValueChange={(value) => setFormData({ ...formData, warehouseId: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {warehouses.map((wh) => (
                                            <SelectItem key={wh.id} value={wh.id}>
                                              {wh.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-zoneType">库区类型 *</Label>
                                      <Select
                                        value={formData.zoneType}
                                        onValueChange={(value: ZoneType) => setFormData({ ...formData, zoneType: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {ZONE_TYPES.map((type) => (
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
                                    <div className="space-y-3 col-span-2">
                                      <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                          <Label htmlFor="edit-replenishment" className="cursor-pointer">补货来源</Label>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            该库区的库存是否可以作为拣货区的补货来源
                                          </p>
                                        </div>
                                        <Switch
                                          id="edit-replenishment"
                                          checked={formData.replenishmentSource}
                                          onCheckedChange={(checked) => setFormData({ ...formData, replenishmentSource: checked })}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                          <Label htmlFor="edit-isActive" className="cursor-pointer">启用状态</Label>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            停用后该库区将无法进行入库、出库等操作
                                          </p>
                                        </div>
                                        <Switch
                                          id="edit-isActive"
                                          checked={formData.isActive}
                                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                      setIsEditDialogOpen(false);
                                      resetForm();
                                    }}>
                                      取消
                                    </Button>
                                    <Button onClick={handleSubmit}>
                                      保存修改
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(zone)}
                              >
                                {zone.isActive ? (
                                  <XCircle className="w-4 h-4 text-warning" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-success" />
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
      </div>
    </WMSLayout>
  );
}