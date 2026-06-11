import { useState } from "react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DataTableHeaderRow } from "../components/business";
import { containerCategoryVisualMap } from "../configs/wmsVisualConfig";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  Search, 
  Plus, 
  Edit, 
  Box,
  Package,
  Cuboid,
  Scan,
  Download,
  RefreshCw,
  Ruler,
  Weight,
  Maximize2,
  Calculator
} from "lucide-react";
import { LoadingState } from "../components/wms/LoadingState";
import { EmptyState } from "../components/wms/EmptyState";

// 容器类型枚举（用于UI展示和分类）
const CONTAINER_CATEGORIES = [
  { value: "box", label: "周转箱", icon: Box },
  { value: "pallet", label: "托盘", icon: Package },
  { value: "cage", label: "笼车", icon: Cuboid },
  { value: "carton", label: "纸箱", icon: Package },
] as const;

interface Container {
  id: string;
  typeCode: string;
  containerName: string;
  category: string;
  length: number;
  width: number;
  height: number;
  maxVolume: number;
  maxWeight: number;
  tareWeight: number;
  isReusable: boolean;
  quantityInStock: number;
  quantityInUse: number;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockContainers: Container[] = [
  {
    id: "1",
    typeCode: "BOX_STD",
    containerName: "蓝色标准周转箱",
    category: "box",
    length: 60,
    width: 40,
    height: 30,
    maxVolume: 72000,
    maxWeight: 30,
    tareWeight: 2.5,
    isReusable: true,
    quantityInStock: 150,
    quantityInUse: 85,
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-12-01 14:20:00",
  },
  {
    id: "2",
    typeCode: "BOX_LG",
    containerName: "大号周转箱",
    category: "box",
    length: 80,
    width: 60,
    height: 40,
    maxVolume: 192000,
    maxWeight: 50,
    tareWeight: 4.0,
    isReusable: true,
    quantityInStock: 80,
    quantityInUse: 45,
    createdAt: "2024-01-15 10:35:00",
    updatedAt: "2024-12-05 09:15:00",
  },
  {
    id: "3",
    typeCode: "PALLET_1200",
    containerName: "1.2米欧标托盘",
    category: "pallet",
    length: 120,
    width: 80,
    height: 15,
    maxVolume: 144000,
    maxWeight: 1000,
    tareWeight: 25,
    isReusable: true,
    quantityInStock: 200,
    quantityInUse: 180,
    createdAt: "2024-01-15 10:40:00",
    updatedAt: "2024-12-07 11:30:00",
  },
  {
    id: "4",
    typeCode: "PALLET_1100",
    containerName: "1.1米亚洲托盘",
    category: "pallet",
    length: 110,
    width: 110,
    height: 14,
    maxVolume: 169400,
    maxWeight: 1000,
    tareWeight: 22,
    isReusable: true,
    quantityInStock: 150,
    quantityInUse: 120,
    createdAt: "2024-01-15 10:45:00",
    updatedAt: "2024-12-06 16:45:00",
  },
  {
    id: "5",
    typeCode: "CAGE_01",
    containerName: "标准笼车",
    category: "cage",
    length: 100,
    width: 70,
    height: 150,
    maxVolume: 1050000,
    maxWeight: 300,
    tareWeight: 45,
    isReusable: true,
    quantityInStock: 50,
    quantityInUse: 38,
    createdAt: "2024-02-20 09:00:00",
    updatedAt: "2024-12-03 10:20:00",
  },
  {
    id: "6",
    typeCode: "CARTON_SM",
    containerName: "小号纸箱",
    category: "carton",
    length: 30,
    width: 25,
    height: 20,
    maxVolume: 15000,
    maxWeight: 10,
    tareWeight: 0.3,
    isReusable: false,
    quantityInStock: 5000,
    quantityInUse: 1200,
    createdAt: "2024-02-20 09:10:00",
    updatedAt: "2024-12-07 08:45:00",
  },
  {
    id: "7",
    typeCode: "CARTON_MD",
    containerName: "中号纸箱",
    category: "carton",
    length: 45,
    width: 35,
    height: 30,
    maxVolume: 47250,
    maxWeight: 20,
    tareWeight: 0.5,
    isReusable: false,
    quantityInStock: 3000,
    quantityInUse: 800,
    createdAt: "2024-03-10 14:20:00",
    updatedAt: "2024-12-06 12:00:00",
  },
  {
    id: "8",
    typeCode: "BOX_SM",
    containerName: "小号周转箱",
    category: "box",
    length: 40,
    width: 30,
    height: 20,
    maxVolume: 24000,
    maxWeight: 15,
    tareWeight: 1.5,
    isReusable: true,
    quantityInStock: 200,
    quantityInUse: 120,
    createdAt: "2024-04-01 08:00:00",
    updatedAt: "2024-12-07 09:30:00",
  },
];

interface ContainerManagementPageProps {
  onNavigate?: (path: string) => void;
}

export default function ContainerManagementPage({ onNavigate }: ContainerManagementPageProps) {
  const [containers] = useState<Container[]>(mockContainers);
  const [isLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    typeCode: "",
    containerName: "",
    category: "box",
    length: "",
    width: "",
    height: "",
    maxVolume: "",
    maxWeight: "",
    tareWeight: "",
    isReusable: true,
  });

  // 自动计算容积
  const calculateVolume = () => {
    const length = parseFloat(formData.length) || 0;
    const width = parseFloat(formData.width) || 0;
    const height = parseFloat(formData.height) || 0;
    if (length && width && height) {
      const volume = length * width * height;
      setFormData({ ...formData, maxVolume: volume.toFixed(0) });
    }
  };

  // 筛选逻辑
  const filteredContainers = containers.filter((container) => {
    const matchesKeyword = 
      container.typeCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      container.containerName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = categoryFilter === "all" || container.category === categoryFilter;
    
    return matchesKeyword && matchesCategory;
  });

  // 统计数据
  const stats = {
    totalTypes: containers.length,
    reusableTypes: containers.filter(c => c.isReusable).length,
    disposableTypes: containers.filter(c => !c.isReusable).length,
    totalQuantity: containers.reduce((sum, c) => sum + c.quantityInStock, 0),
  };

  // 按类别统计
  const categoryStats = CONTAINER_CATEGORIES.map(cat => ({
    ...cat,
    visualColor: containerCategoryVisualMap[cat.value].color,
    count: containers.filter(c => c.category === cat.value).length,
  }));

  // 获取容器类别配置
  const getCategoryConfig = (category: string) => {
    const config = CONTAINER_CATEGORIES.find(c => c.value === category) || CONTAINER_CATEGORIES[0];
    return { ...config, visualColor: containerCategoryVisualMap[config.value].color };
  };

  // 打开编辑对话框
  const handleEdit = (container: Container) => {
    setEditingContainer(container);
    setFormData({
      typeCode: container.typeCode,
      containerName: container.containerName,
      category: container.category,
      length: container.length.toString(),
      width: container.width.toString(),
      height: container.height.toString(),
      maxVolume: container.maxVolume.toString(),
      maxWeight: container.maxWeight.toString(),
      tareWeight: container.tareWeight.toString(),
      isReusable: container.isReusable,
    });
    setIsEditDialogOpen(true);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      typeCode: "",
      containerName: "",
      category: "box",
      length: "",
      width: "",
      height: "",
      maxVolume: "",
      maxWeight: "",
      tareWeight: "",
      isReusable: true,
    });
    setEditingContainer(null);
  };

  // 处理提交
  const handleSubmit = () => {
    toast.success(editingContainer ? "容器类型已更新" : "容器类型已创建");
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // 格式化容积显示（cm³转为L）
  const formatVolume = (volume: number) => {
    const liters = volume / 1000;
    return liters >= 1 ? `${liters.toFixed(1)}L` : `${volume}cm³`;
  };

  return (
    <WMSLayout title="容器管理" currentPath="/master-data/containers" onNavigate={onNavigate}>
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
                  新增容器类型
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新增容器类型</DialogTitle>
                  <DialogDescription>
                    定义新的容器类型，设置容器的物理规格和承重限制
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeCode">容器类型代码 *</Label>
                    <Input
                      id="typeCode"
                      placeholder="例如：BOX_STD, PALLET_1200"
                      value={formData.typeCode}
                      onChange={(e) => setFormData({ ...formData, typeCode: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground">
                      建议使用大写字母和下划线，作为唯一标识
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="containerName">容器名称 *</Label>
                    <Input
                      id="containerName"
                      placeholder="例如：蓝色标准周转箱"
                      value={formData.containerName}
                      onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>容器类别 *</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {CONTAINER_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.category === cat.value;
                        const visual = containerCategoryVisualMap[cat.value];
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                          >
                            <Icon 
                              className="w-6 h-6" 
                              style={{ color: isSelected ? visual.color : 'var(--muted-foreground)' }}
                            />
                            <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                              {cat.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        容器尺寸（内径）
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={calculateVolume}
                        disabled={!formData.length || !formData.width || !formData.height}
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        计算容积
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">长度 (cm) *</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.1"
                          placeholder="60"
                          value={formData.length}
                          onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">宽度 (cm) *</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.1"
                          placeholder="40"
                          value={formData.width}
                          onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">高度 (cm) *</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          placeholder="30"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="mb-4 flex items-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      容积与重量限制
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxVolume">最大容积 (cm³) *</Label>
                        <Input
                          id="maxVolume"
                          type="number"
                          placeholder="72000"
                          value={formData.maxVolume}
                          onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.maxVolume && `≈ ${formatVolume(parseFloat(formData.maxVolume))}`}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxWeight">最大承重 (kg) *</Label>
                        <Input
                          id="maxWeight"
                          type="number"
                          step="0.1"
                          placeholder="30"
                          value={formData.maxWeight}
                          onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          超过此重量提示满箱
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tareWeight">皮重/自重 (kg) *</Label>
                        <Input
                          id="tareWeight"
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={formData.tareWeight}
                          onChange={(e) => setFormData({ ...formData, tareWeight: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          用于毛重-皮重=净重计算
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <Label htmlFor="isReusable" className="cursor-pointer flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isReusable"
                            className="w-4 h-4 rounded border-input"
                            checked={formData.isReusable}
                            onChange={(e) => setFormData({ ...formData, isReusable: e.target.checked })}
                          />
                          <span>可重复使用（固定资产）</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-2 ml-6">
                          勾选：周转箱、托盘、笼车等需要回收的容器<br />
                          不勾选：一次性纸箱等消耗品
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 p-4 bg-info/5 border border-info/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Scan className="w-5 h-5 text-info mt-0.5" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">容器条码管理说明：</span>
                        </p>
                        <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                          <li>• 固定资产容器：需为每个容器打印唯一条码，便于追踪和管理</li>
                          <li>• 一次性容器：只需按类型管理，无需单独编码</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSubmit}>
                    创建容器类型
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
              <CardDescription>容器类型总数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.totalTypes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                已定义的类型
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>可重复使用</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-success">{stats.reusableTypes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                周转箱、托盘等
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>一次性容器</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-warning">{stats.disposableTypes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                纸箱等消耗品
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>总库存数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.totalQuantity.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                所有容器总数
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">容器类别分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryStats.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.value}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setCategoryFilter(cat.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5" style={{ color: cat.visualColor }} />
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                    <p className="text-sm">{cat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>关键词搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="容器类型代码/名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>容器类别</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={categoryFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter("all")}
                  >
                    全部
                  </Button>
                  {CONTAINER_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const visual = containerCategoryVisualMap[cat.value];
                    return (
                      <Button
                        key={cat.value}
                        variant={categoryFilter === cat.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter(cat.value)}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>容器类型列表</CardTitle>
                <CardDescription>
                  共 {filteredContainers.length} 条记录
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
              <LoadingState message="加载容器数据中..." />
            ) : filteredContainers.length === 0 ? (
              <EmptyState
                icon="search"
                title="未找到匹配的容器类型"
                description="请尝试调整筛选条件"
              />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow>
                      <TableHead>类型代码</TableHead>
                      <TableHead>容器名称</TableHead>
                      <TableHead className="text-center">类别</TableHead>
                      <TableHead className="text-right">尺寸 (长x宽x高)</TableHead>
                      <TableHead className="text-right">容积</TableHead>
                      <TableHead className="text-right">最大承重</TableHead>
                      <TableHead className="text-right">皮重</TableHead>
                      <TableHead className="text-center">可重复使用</TableHead>
                      <TableHead className="text-right">库存数量</TableHead>
                      <TableHead className="text-right">使用中</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContainers.map((container) => {
                      const categoryConfig = getCategoryConfig(container.category);
                      const CategoryIcon = categoryConfig.icon;
                      const utilizationRate = (container.quantityInUse / container.quantityInStock * 100).toFixed(1);
                      
                      return (
                        <TableRow key={container.id}>
                          <TableCell className="font-mono">{container.typeCode}</TableCell>
                          <TableCell>{container.containerName}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <CategoryIcon className="w-4 h-4" style={{ color: categoryConfig.visualColor }} />
                              <span className="text-sm">{categoryConfig.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {container.length} x {container.width} x {container.height} cm
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="tabular-nums">{formatVolume(container.maxVolume)}</span>
                              <span className="text-xs text-muted-foreground">
                                {container.maxVolume.toLocaleString()} cm³
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums">{container.maxWeight}</span>
                            <span className="text-muted-foreground text-sm ml-1">kg</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span>{container.tareWeight}</span>
                            <span className="text-muted-foreground text-sm ml-1">kg</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {container.isReusable ? (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                是
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground">
                                否
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="tabular-nums">{container.quantityInStock.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="tabular-nums">{container.quantityInUse.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground">
                                使用率 {utilizationRate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {container.updatedAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(container)}
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
              <DialogTitle>编辑容器类型</DialogTitle>
              <DialogDescription>
                修改容器类型 {editingContainer?.typeCode} 的信息
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-typeCode">容器类型代码 *</Label>
                <Input
                  id="edit-typeCode"
                  value={formData.typeCode}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">代码不可修改</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-containerName">容器名称 *</Label>
                <Input
                  id="edit-containerName"
                  value={formData.containerName}
                  onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>容器类别 *</Label>
                <div className="grid grid-cols-4 gap-3">
                  {CONTAINER_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.value;
                    const visual = containerCategoryVisualMap[cat.value];
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: isSelected ? visual.color : 'var(--muted-foreground)' }}
                        />
                        <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    容器尺寸（内径）
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={calculateVolume}
                    disabled={!formData.length || !formData.width || !formData.height}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    计算容积
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-length">长度 (cm) *</Label>
                    <Input
                      id="edit-length"
                      type="number"
                      step="0.1"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-width">宽度 (cm) *</Label>
                    <Input
                      id="edit-width"
                      type="number"
                      step="0.1"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-height">高度 (cm) *</Label>
                    <Input
                      id="edit-height"
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <h4 className="mb-4 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  容积与重量限制
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxVolume">最大容积 (cm³) *</Label>
                    <Input
                      id="edit-maxVolume"
                      type="number"
                      value={formData.maxVolume}
                      onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.maxVolume && `≈ ${formatVolume(parseFloat(formData.maxVolume))}`}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxWeight">最大承重 (kg) *</Label>
                    <Input
                      id="edit-maxWeight"
                      type="number"
                      step="0.1"
                      value={formData.maxWeight}
                      onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-tareWeight">皮重/自重 (kg) *</Label>
                    <Input
                      id="edit-tareWeight"
                      type="number"
                      step="0.1"
                      value={formData.tareWeight}
                      onChange={(e) => setFormData({ ...formData, tareWeight: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <Label htmlFor="edit-isReusable" className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-isReusable"
                        className="w-4 h-4 rounded border-input"
                        checked={formData.isReusable}
                        onChange={(e) => setFormData({ ...formData, isReusable: e.target.checked })}
                      />
                      <span>可重复使用（固定资产）</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2 ml-6">
                      勾选：周转箱、托盘、笼车等需要回收的容器<br />
                      不勾选：一次性纸箱等消耗品
                    </p>
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
