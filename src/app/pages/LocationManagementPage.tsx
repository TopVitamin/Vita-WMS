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
import { Checkbox } from "../components/ui/checkbox";
import { 
  Search, 
  Plus, 
  Edit, 
  Warehouse, 
  MapPin,
  Package,
  PackageOpen,
  Truck,
  Wrench,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Printer,
  Grid3x3,
  Layers,
  AlertTriangle
} from "lucide-react";
import { LoadingState } from "../components/wms/LoadingState";
import { EmptyState } from "../components/wms/EmptyState";

// 库位用途枚举
const USAGE_TYPES = [
  { value: "bulk_storage", label: "存储位", icon: Package, color: "var(--purple-600)" },
  { value: "pick_face", label: "拣货位", icon: PackageOpen, color: "var(--info-500)" },
  { value: "transit", label: "过渡位", icon: Truck, color: "var(--warning-500)" },
  { value: "workstation", label: "工作台", icon: Wrench, color: "var(--success-600)" },
] as const;

type UsageType = typeof USAGE_TYPES[number]['value'];

// 库位状态枚举
const LOCATION_STATUS = [
  { value: "normal", label: "正常", color: "var(--success-500)", bgColor: "var(--success-50)" },
  { value: "sealed", label: "封存", color: "var(--error-500)", bgColor: "var(--error-50)" },
  { value: "inbound_only", label: "只进不出", color: "var(--info-500)", bgColor: "var(--info-50)" },
  { value: "outbound_only", label: "只出不进", color: "var(--warning-500)", bgColor: "var(--warning-50)" },
] as const;

type LocationStatus = typeof LOCATION_STATUS[number]['value'];

interface Location {
  id: string;
  locationCode: string;
  warehouseId: string;
  warehouseName: string;
  zoneId: string;
  zoneName: string;
  usageType: UsageType;
  status: LocationStatus;
  priorityNumber: number;
  mixSku: boolean;
  mixBatch: boolean;
  maxVolume: number | null;
  maxWeight: number | null;
  coordinateX: number | null;
  coordinateY: number | null;
  coordinateZ: number | null;
  currentSku: string | null;
  occupancyRate: number;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockLocations: Location[] = [
  {
    id: "1",
    locationCode: "A-01-01",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-A01",
    zoneName: "整箱存储区A",
    usageType: "bulk_storage",
    status: "normal",
    priorityNumber: 100,
    mixSku: false,
    mixBatch: true,
    maxVolume: 1.5,
    maxWeight: 500,
    coordinateX: 1,
    coordinateY: 1,
    coordinateZ: 1,
    currentSku: "SKU-001",
    occupancyRate: 85,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-01 14:20:00",
  },
  {
    id: "2",
    locationCode: "A-01-02",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-A01",
    zoneName: "整箱存储区A",
    usageType: "bulk_storage",
    status: "normal",
    priorityNumber: 101,
    mixSku: false,
    mixBatch: true,
    maxVolume: 1.5,
    maxWeight: 500,
    coordinateX: 1,
    coordinateY: 1,
    coordinateZ: 2,
    currentSku: null,
    occupancyRate: 0,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-05 09:15:00",
  },
  {
    id: "3",
    locationCode: "B-02-01",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-B01",
    zoneName: "拆零拣货区B",
    usageType: "pick_face",
    status: "normal",
    priorityNumber: 50,
    mixSku: true,
    mixBatch: true,
    maxVolume: 0.5,
    maxWeight: 100,
    coordinateX: 2,
    coordinateY: 2,
    coordinateZ: 1,
    currentSku: "SKU-002",
    occupancyRate: 60,
    createdAt: "2024-01-15 10:35:00",
    updatedAt: "2024-12-07 11:30:00",
  },
  {
    id: "4",
    locationCode: "S-01-01",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-S01",
    zoneName: "收货暂存区",
    usageType: "transit",
    status: "inbound_only",
    priorityNumber: 10,
    mixSku: true,
    mixBatch: true,
    maxVolume: 2.0,
    maxWeight: 800,
    coordinateX: 3,
    coordinateY: 1,
    coordinateZ: 1,
    currentSku: null,
    occupancyRate: 0,
    createdAt: "2024-01-15 10:40:00",
    updatedAt: "2024-12-06 16:45:00",
  },
  {
    id: "5",
    locationCode: "W-01",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-W01",
    zoneName: "打包工作区",
    usageType: "workstation",
    status: "normal",
    priorityNumber: 1,
    mixSku: true,
    mixBatch: true,
    maxVolume: null,
    maxWeight: null,
    coordinateX: 4,
    coordinateY: 1,
    coordinateZ: 1,
    currentSku: null,
    occupancyRate: 0,
    createdAt: "2024-02-20 09:00:00",
    updatedAt: "2024-12-03 10:20:00",
  },
  {
    id: "6",
    locationCode: "A-01-03",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-A01",
    zoneName: "整箱存储区A",
    usageType: "bulk_storage",
    status: "sealed",
    priorityNumber: 102,
    mixSku: false,
    mixBatch: true,
    maxVolume: 1.5,
    maxWeight: 500,
    coordinateX: 1,
    coordinateY: 1,
    coordinateZ: 3,
    currentSku: null,
    occupancyRate: 0,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-11-20 15:30:00",
  },
  {
    id: "7",
    locationCode: "A-02-01",
    warehouseId: "WH1",
    warehouseName: "深圳仓",
    zoneId: "ZONE-A01",
    zoneName: "整箱存储区A",
    usageType: "bulk_storage",
    status: "normal",
    priorityNumber: 200,
    mixSku: false,
    mixBatch: false,
    maxVolume: 1.5,
    maxWeight: 500,
    coordinateX: 1,
    coordinateY: 2,
    coordinateZ: 1,
    currentSku: "SKU-003",
    occupancyRate: 100,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-07 08:45:00",
  },
  {
    id: "8",
    locationCode: "B-01-01",
    warehouseId: "WH2",
    warehouseName: "香港仓",
    zoneId: "ZONE-B02",
    zoneName: "快速拣货区",
    usageType: "pick_face",
    status: "normal",
    priorityNumber: 30,
    mixSku: true,
    mixBatch: true,
    maxVolume: 0.3,
    maxWeight: 50,
    coordinateX: 1,
    coordinateY: 1,
    coordinateZ: 1,
    currentSku: "SKU-004",
    occupancyRate: 75,
    createdAt: "2024-03-10 14:20:00",
    updatedAt: "2024-12-06 12:00:00",
  },
];

const warehouses = [
  { id: "WH1", name: "深圳仓" },
  { id: "WH2", name: "香港仓" },
  { id: "WH3", name: "美国仓" },
];

const zones = [
  { id: "ZONE-A01", name: "整箱存储区A", warehouseId: "WH1" },
  { id: "ZONE-B01", name: "拆零拣货区B", warehouseId: "WH1" },
  { id: "ZONE-S01", name: "收货暂存区", warehouseId: "WH1" },
  { id: "ZONE-W01", name: "打包工作区", warehouseId: "WH1" },
  { id: "ZONE-B02", name: "快速拣货区", warehouseId: "WH2" },
];

interface LocationManagementPageProps {
  onNavigate?: (path: string) => void;
}

export default function LocationManagementPage({ onNavigate }: LocationManagementPageProps) {
  const [locations] = useState<Location[]>(mockLocations);
  const [isLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [usageTypeFilter, setUsageTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    locationCode: "",
    warehouseId: "",
    zoneId: "",
    usageType: "bulk_storage" as UsageType,
    status: "normal" as LocationStatus,
    priorityNumber: 100,
    mixSku: false,
    mixBatch: false,
    maxVolume: "",
    maxWeight: "",
    coordinateX: "",
    coordinateY: "",
    coordinateZ: "",
  });

  // Batch generation form state
  const [batchForm, setBatchForm] = useState({
    warehouseId: "",
    zoneId: "",
    prefix: "",
    aisleStart: 1,
    aisleEnd: 10,
    bayStart: 1,
    bayEnd: 20,
    levelStart: 1,
    levelEnd: 5,
    usageType: "bulk_storage" as UsageType,
    status: "normal" as LocationStatus,
    priorityIncrement: 10,
    mixSku: false,
    mixBatch: false,
    maxVolume: "",
    maxWeight: "",
  });

  // 筛选逻辑
  const filteredLocations = locations.filter((location) => {
    const matchesKeyword = 
      location.locationCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      location.zoneName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesWarehouse = warehouseFilter === "all" || location.warehouseId === warehouseFilter;
    const matchesZone = zoneFilter === "all" || location.zoneId === zoneFilter;
    const matchesUsageType = usageTypeFilter === "all" || location.usageType === usageTypeFilter;
    const matchesStatus = statusFilter === "all" || location.status === statusFilter;
    
    return matchesKeyword && matchesWarehouse && matchesZone && matchesUsageType && matchesStatus;
  });

  // 根据仓库筛选库区
  const availableZones = zones.filter(zone => 
    warehouseFilter === "all" || zone.warehouseId === warehouseFilter
  );

  // 统计数据
  const stats = {
    total: locations.length,
    occupied: locations.filter(l => l.occupancyRate > 0).length,
    empty: locations.filter(l => l.occupancyRate === 0).length,
    avgOccupancy: locations.reduce((sum, l) => sum + l.occupancyRate, 0) / locations.length,
  };

  // 获取库位用途配置
  const getUsageTypeConfig = (type: UsageType) => {
    return USAGE_TYPES.find(t => t.value === type) || USAGE_TYPES[0];
  };

  // 获取库位状态配置
  const getStatusConfig = (status: LocationStatus) => {
    return LOCATION_STATUS.find(s => s.value === status) || LOCATION_STATUS[0];
  };

  // 打开编辑对话框
  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      locationCode: location.locationCode,
      warehouseId: location.warehouseId,
      zoneId: location.zoneId,
      usageType: location.usageType,
      status: location.status,
      priorityNumber: location.priorityNumber,
      mixSku: location.mixSku,
      mixBatch: location.mixBatch,
      maxVolume: location.maxVolume?.toString() || "",
      maxWeight: location.maxWeight?.toString() || "",
      coordinateX: location.coordinateX?.toString() || "",
      coordinateY: location.coordinateY?.toString() || "",
      coordinateZ: location.coordinateZ?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      locationCode: "",
      warehouseId: "",
      zoneId: "",
      usageType: "bulk_storage",
      status: "normal",
      priorityNumber: 100,
      mixSku: false,
      mixBatch: false,
      maxVolume: "",
      maxWeight: "",
      coordinateX: "",
      coordinateY: "",
      coordinateZ: "",
    });
    setEditingLocation(null);
  };

  // 重置批量生成表单
  const resetBatchForm = () => {
    setBatchForm({
      warehouseId: "",
      zoneId: "",
      prefix: "",
      aisleStart: 1,
      aisleEnd: 10,
      bayStart: 1,
      bayEnd: 20,
      levelStart: 1,
      levelEnd: 5,
      usageType: "bulk_storage",
      status: "normal",
      priorityIncrement: 10,
      mixSku: false,
      mixBatch: false,
      maxVolume: "",
      maxWeight: "",
    });
  };

  // 处理单个库位提交
  const handleSubmit = () => {
    console.log("提交库位数据:", formData);
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // 处理批量生成
  const handleBatchGenerate = () => {
    const totalCount = 
      (batchForm.aisleEnd - batchForm.aisleStart + 1) *
      (batchForm.bayEnd - batchForm.bayStart + 1) *
      (batchForm.levelEnd - batchForm.levelStart + 1);
    
    console.log("批量生成库位:", {
      ...batchForm,
      estimatedCount: totalCount,
    });
    
    setIsBatchDialogOpen(false);
    resetBatchForm();
  };

  // 处理库位选择
  const handleSelectLocation = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedLocations.length === filteredLocations.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(filteredLocations.map(l => l.id));
    }
  };

  // 打印库位标签
  const handlePrintLabels = () => {
    console.log("打印库位标签:", selectedLocations);
    setIsPrintDialogOpen(false);
    setSelectedLocations([]);
  };

  return (
    <WMSLayout title="库位管理" currentPath="/master-data/locations" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={selectedLocations.length === 0}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  打印标签 ({selectedLocations.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>打印库位标签</DialogTitle>
                  <DialogDescription>
                    为选中的 {selectedLocations.length} 个库位生成条码标签
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">已选择库位：</span>
                      </div>
                      <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                        {selectedLocations.map(id => {
                          const location = locations.find(l => l.id === id);
                          return location ? (
                            <div key={id} className="py-1">
                              {location.locationCode} - {location.zoneName}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>标签尺寸</Label>
                      <Select defaultValue="40x30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="40x30">40mm x 30mm</SelectItem>
                          <SelectItem value="50x30">50mm x 30mm</SelectItem>
                          <SelectItem value="60x40">60mm x 40mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Checkbox id="include-qr" defaultChecked />
                      <Label htmlFor="include-qr" className="cursor-pointer flex-1">
                        包含二维码校验码
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handlePrintLabels}>
                    <Printer className="w-4 h-4 mr-2" />
                    确认打印
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetBatchForm}>
                  <Layers className="w-4 h-4 mr-2" />
                  批量生成
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>批量生成库位</DialogTitle>
                  <DialogDescription>
                    根据排-列-层规则批量生成库位数据
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-warehouse">所属仓库 *</Label>
                    <Select
                      value={batchForm.warehouseId}
                      onValueChange={(value) => setBatchForm({ ...batchForm, warehouseId: value, zoneId: "" })}
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
                    <Label htmlFor="batch-zone">所属库区 *</Label>
                    <Select
                      value={batchForm.zoneId}
                      onValueChange={(value) => setBatchForm({ ...batchForm, zoneId: value })}
                      disabled={!batchForm.warehouseId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择库区" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.filter(z => z.warehouseId === batchForm.warehouseId).map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4 flex items-center gap-2">
                      <Grid3x3 className="w-4 h-4" />
                      库位编码规则
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-4">
                        <Label htmlFor="batch-prefix">前缀（可选）</Label>
                        <Input
                          id="batch-prefix"
                          placeholder="例如：A"
                          value={batchForm.prefix}
                          onChange={(e) => setBatchForm({ ...batchForm, prefix: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          示例编码：{batchForm.prefix || ""}
                          {batchForm.prefix && "-"}01-01-01
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>排（Aisle）起始</Label>
                        <Input
                          type="number"
                          value={batchForm.aisleStart}
                          onChange={(e) => setBatchForm({ ...batchForm, aisleStart: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>排（Aisle）结束</Label>
                        <Input
                          type="number"
                          value={batchForm.aisleEnd}
                          onChange={(e) => setBatchForm({ ...batchForm, aisleEnd: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>列（Bay）起始</Label>
                        <Input
                          type="number"
                          value={batchForm.bayStart}
                          onChange={(e) => setBatchForm({ ...batchForm, bayStart: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>列（Bay）结束</Label>
                        <Input
                          type="number"
                          value={batchForm.bayEnd}
                          onChange={(e) => setBatchForm({ ...batchForm, bayEnd: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>层（Level）起始</Label>
                        <Input
                          type="number"
                          value={batchForm.levelStart}
                          onChange={(e) => setBatchForm({ ...batchForm, levelStart: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>层（Level）结束</Label>
                        <Input
                          type="number"
                          value={batchForm.levelEnd}
                          onChange={(e) => setBatchForm({ ...batchForm, levelEnd: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>优先级递增值</Label>
                        <Input
                          type="number"
                          value={batchForm.priorityIncrement}
                          onChange={(e) => setBatchForm({ ...batchForm, priorityIncrement: parseInt(e.target.value) || 10 })}
                        />
                        <p className="text-xs text-muted-foreground">
                          每个库位优先级递增的数值（用于拣货路径优化）
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4">库位属性设置</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>库位用途</Label>
                        <Select
                          value={batchForm.usageType}
                          onValueChange={(value: UsageType) => setBatchForm({ ...batchForm, usageType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {USAGE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>库位状态</Label>
                        <Select
                          value={batchForm.status}
                          onValueChange={(value: LocationStatus) => setBatchForm({ ...batchForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATION_STATUS.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>最大体积 (m³)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="例如：1.5"
                          value={batchForm.maxVolume}
                          onChange={(e) => setBatchForm({ ...batchForm, maxVolume: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>最大重量 (kg)</Label>
                        <Input
                          type="number"
                          placeholder="例如：500"
                          value={batchForm.maxWeight}
                          onChange={(e) => setBatchForm({ ...batchForm, maxWeight: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-3">
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Checkbox 
                        id="batch-mixSku"
                        checked={batchForm.mixSku}
                        onCheckedChange={(checked) => setBatchForm({ ...batchForm, mixSku: checked as boolean })}
                      />
                      <Label htmlFor="batch-mixSku" className="cursor-pointer flex-1">
                        允许混品（Mix SKU）
                        <p className="text-xs text-muted-foreground mt-1">
                          允许存放不同的SKU
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Checkbox 
                        id="batch-mixBatch"
                        checked={batchForm.mixBatch}
                        onCheckedChange={(checked) => setBatchForm({ ...batchForm, mixBatch: checked as boolean })}
                      />
                      <Label htmlFor="batch-mixBatch" className="cursor-pointer flex-1">
                        允许混批（Mix Batch）
                        <p className="text-xs text-muted-foreground mt-1">
                          允许存放同SKU但不同批次的商品
                        </p>
                      </Label>
                    </div>
                  </div>

                  <div className="col-span-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm">
                          预计生成库位数量：
                          <span className="ml-2 font-mono text-lg text-primary">
                            {(batchForm.aisleEnd - batchForm.aisleStart + 1) *
                             (batchForm.bayEnd - batchForm.bayStart + 1) *
                             (batchForm.levelEnd - batchForm.levelStart + 1)}
                          </span> 个
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          请确认参数无误后再生成，批量操作不可撤销
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleBatchGenerate}>
                    <Layers className="w-4 h-4 mr-2" />
                    确认生成
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增库位
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新增库位</DialogTitle>
                  <DialogDescription>
                    创建单个库位，定义库位的基本信息和作业属性
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationCode">库位编码 *</Label>
                    <Input
                      id="locationCode"
                      placeholder="例如：A-01-01"
                      value={formData.locationCode}
                      onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priorityNumber">优先级数字 *</Label>
                    <Input
                      id="priorityNumber"
                      type="number"
                      placeholder="100"
                      value={formData.priorityNumber}
                      onChange={(e) => setFormData({ ...formData, priorityNumber: parseInt(e.target.value) || 100 })}
                    />
                    <p className="text-xs text-muted-foreground">
                      用于拣货路径优化，数字越小优先级越高
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">所属仓库 *</Label>
                    <Select
                      value={formData.warehouseId}
                      onValueChange={(value) => setFormData({ ...formData, warehouseId: value, zoneId: "" })}
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
                    <Label htmlFor="zone">所属库区 *</Label>
                    <Select
                      value={formData.zoneId}
                      onValueChange={(value) => setFormData({ ...formData, zoneId: value })}
                      disabled={!formData.warehouseId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="先选择仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.filter(z => z.warehouseId === formData.warehouseId).map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageType">库位用途 *</Label>
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
                    <Label htmlFor="status">库位状态 *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: LocationStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4">混放规则</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Checkbox 
                          id="mixSku"
                          checked={formData.mixSku}
                          onCheckedChange={(checked) => setFormData({ ...formData, mixSku: checked as boolean })}
                        />
                        <Label htmlFor="mixSku" className="cursor-pointer flex-1">
                          允许混品
                          <p className="text-xs text-muted-foreground mt-1">
                            可存放不同SKU
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Checkbox 
                          id="mixBatch"
                          checked={formData.mixBatch}
                          onCheckedChange={(checked) => setFormData({ ...formData, mixBatch: checked as boolean })}
                        />
                        <Label htmlFor="mixBatch" className="cursor-pointer flex-1">
                          允许混批
                          <p className="text-xs text-muted-foreground mt-1">
                            可存放不同批次
                          </p>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4">物理限制</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxVolume">最大体积 (m³)</Label>
                        <Input
                          id="maxVolume"
                          type="number"
                          step="0.1"
                          placeholder="例如：1.5"
                          value={formData.maxVolume}
                          onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxWeight">最大重量 (kg)</Label>
                        <Input
                          id="maxWeight"
                          type="number"
                          placeholder="例如：500"
                          value={formData.maxWeight}
                          onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4">3D坐标（可选）</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coordinateX">X 坐标</Label>
                        <Input
                          id="coordinateX"
                          type="number"
                          placeholder="1"
                          value={formData.coordinateX}
                          onChange={(e) => setFormData({ ...formData, coordinateX: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="coordinateY">Y 坐标</Label>
                        <Input
                          id="coordinateY"
                          type="number"
                          placeholder="1"
                          value={formData.coordinateY}
                          onChange={(e) => setFormData({ ...formData, coordinateY: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="coordinateZ">Z 坐标</Label>
                        <Input
                          id="coordinateZ"
                          type="number"
                          placeholder="1"
                          value={formData.coordinateZ}
                          onChange={(e) => setFormData({ ...formData, coordinateZ: e.target.value })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      用于3D可视化或就近计算
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSubmit}>
                    创建库位
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
              <CardDescription>总库位数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                全部库位
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>已占用</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-warning">{stats.occupied}</div>
              <p className="text-xs text-muted-foreground mt-1">
                有货库位
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>空库位</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-success">{stats.empty}</div>
              <p className="text-xs text-muted-foreground mt-1">
                可用库位
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
                库位利用率
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>关键词搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="库位编码/库区"
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
                <Label>所属库区</Label>
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部库区</SelectItem>
                    {availableZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>库位用途</Label>
                <Select value={usageTypeFilter} onValueChange={setUsageTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部用途</SelectItem>
                    {USAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>库位状态</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    {LOCATION_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
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
                <CardTitle>库位列表</CardTitle>
                <CardDescription>
                  共 {filteredLocations.length} 条记录
                  {selectedLocations.length > 0 && ` • 已选择 ${selectedLocations.length} 项`}
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
              <LoadingState message="加载库位数据中..." />
            ) : filteredLocations.length === 0 ? (
              <EmptyState
                icon="search"
                title="未找到匹配的库位"
                description="请尝试调整筛选条件"
              />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedLocations.length === filteredLocations.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>库位编码</TableHead>
                      <TableHead>所属仓库</TableHead>
                      <TableHead>所属库区</TableHead>
                      <TableHead>库位用途</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-right">优先级</TableHead>
                      <TableHead className="text-center">混品</TableHead>
                      <TableHead className="text-center">混批</TableHead>
                      <TableHead>当前SKU</TableHead>
                      <TableHead className="text-right">占用率</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => {
                      const usageConfig = getUsageTypeConfig(location.usageType);
                      const statusConfig = getStatusConfig(location.status);
                      const UsageIcon = usageConfig.icon;
                      
                      return (
                        <TableRow key={location.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedLocations.includes(location.id)}
                              onCheckedChange={() => handleSelectLocation(location.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono">{location.locationCode}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Warehouse className="w-4 h-4 text-muted-foreground" />
                              {location.warehouseName}
                            </div>
                          </TableCell>
                          <TableCell>{location.zoneName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UsageIcon className="w-4 h-4" style={{ color: usageConfig.color }} />
                              <span>{usageConfig.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="outline" 
                              style={{ 
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.color,
                                borderColor: statusConfig.color 
                              }}
                            >
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {location.priorityNumber}
                          </TableCell>
                          <TableCell className="text-center">
                            {location.mixSku ? (
                              <CheckCircle className="w-4 h-4 text-success inline-block" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground inline-block" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {location.mixBatch ? (
                              <CheckCircle className="w-4 h-4 text-success inline-block" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground inline-block" />
                            )}
                          </TableCell>
                          <TableCell>
                            {location.currentSku ? (
                              <span className="font-mono text-sm">{location.currentSku}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">空</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    location.occupancyRate === 0 ? 'bg-muted' :
                                    location.occupancyRate < 50 ? 'bg-success' :
                                    location.occupancyRate < 80 ? 'bg-warning' :
                                    'bg-error'
                                  }`}
                                  style={{ width: `${location.occupancyRate}%` }}
                                />
                              </div>
                              <span className="text-sm w-12 text-right">
                                {location.occupancyRate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(location)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑库位</DialogTitle>
              <DialogDescription>
                修改库位 {editingLocation?.locationCode} 的信息
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-locationCode">库位编码 *</Label>
                <Input
                  id="edit-locationCode"
                  value={formData.locationCode}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">编码不可修改</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priorityNumber">优先级数字 *</Label>
                <Input
                  id="edit-priorityNumber"
                  type="number"
                  value={formData.priorityNumber}
                  onChange={(e) => setFormData({ ...formData, priorityNumber: parseInt(e.target.value) || 100 })}
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
                <Label htmlFor="edit-zone">所属库区 *</Label>
                <Select
                  value={formData.zoneId}
                  onValueChange={(value) => setFormData({ ...formData, zoneId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.filter(z => z.warehouseId === formData.warehouseId).map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usageType">库位用途 *</Label>
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
                <Label htmlFor="edit-status">库位状态 *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: LocationStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <h4 className="mb-4">混放规则</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Checkbox 
                      id="edit-mixSku"
                      checked={formData.mixSku}
                      onCheckedChange={(checked) => setFormData({ ...formData, mixSku: checked as boolean })}
                    />
                    <Label htmlFor="edit-mixSku" className="cursor-pointer flex-1">
                      允许混品
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Checkbox 
                      id="edit-mixBatch"
                      checked={formData.mixBatch}
                      onCheckedChange={(checked) => setFormData({ ...formData, mixBatch: checked as boolean })}
                    />
                    <Label htmlFor="edit-mixBatch" className="cursor-pointer flex-1">
                      允许混批
                    </Label>
                  </div>
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <h4 className="mb-4">物理限制</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxVolume">最大体积 (m³)</Label>
                    <Input
                      id="edit-maxVolume"
                      type="number"
                      step="0.1"
                      value={formData.maxVolume}
                      onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxWeight">最大重量 (kg)</Label>
                    <Input
                      id="edit-maxWeight"
                      type="number"
                      value={formData.maxWeight}
                      onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <h4 className="mb-4">3D坐标</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-coordinateX">X 坐标</Label>
                    <Input
                      id="edit-coordinateX"
                      type="number"
                      value={formData.coordinateX}
                      onChange={(e) => setFormData({ ...formData, coordinateX: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-coordinateY">Y 坐标</Label>
                    <Input
                      id="edit-coordinateY"
                      type="number"
                      value={formData.coordinateY}
                      onChange={(e) => setFormData({ ...formData, coordinateY: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-coordinateZ">Z 坐标</Label>
                    <Input
                      id="edit-coordinateZ"
                      type="number"
                      value={formData.coordinateZ}
                      onChange={(e) => setFormData({ ...formData, coordinateZ: e.target.value })}
                    />
                  </div>
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
      </div>
    </WMSLayout>
  );
}
