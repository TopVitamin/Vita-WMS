import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Save, X, Plus, Trash2, Upload, Image as ImageIcon, Package,
  Ruler, Weight, Layers, Tags, Building2, ShoppingCart, Calendar,
  AlertCircle, Info
} from "lucide-react";

interface SKUFormPageProps {
  onNavigate: (path: string) => void;
  skuId?: string; // undefined表示新建，有值表示编辑
}

export default function SKUFormPage({ onNavigate, skuId }: SKUFormPageProps) {
  const isEditMode = !!skuId;

  // 表单状态
  const [formData, setFormData] = useState({
    // 基本信息
    skuCode: isEditMode ? "ABC-123456" : "",
    productName: isEditMode ? "多功能蓝牙耳机" : "",
    productNameEn: isEditMode ? "Multi-function Bluetooth Headphones" : "",
    customer: isEditMode ? "维他很忙" : "",
    category: isEditMode ? "电子产品" : "",
    subCategory: isEditMode ? "数码配件" : "",
    description: isEditMode ? "支持蓝牙5.0，续航8小时，主动降噪功能" : "",

    // 规格信息
    specifications: isEditMode ? "黑色 / 标准版" : "",
    mainBarcode: isEditMode ? "6901234567890" : "",
    alternateBarcodes: isEditMode ? ["0123456789012"] : [] as string[],
    unit: isEditMode ? "件" : "",
    conversionRatio: isEditMode ? "12" : "",
    conversionUnit: isEditMode ? "箱" : "",

    // 尺寸重量
    length: isEditMode ? "10" : "",
    width: isEditMode ? "8" : "",
    height: isEditMode ? "3" : "",
    grossWeight: isEditMode ? "0.15" : "",
    netWeight: isEditMode ? "0.12" : "",

    // 库存策略
    safetyStock: isEditMode ? "500" : "",
    maxStock: isEditMode ? "3000" : "",
    replenishmentCycle: isEditMode ? "7" : "",
    enableExpiryManagement: isEditMode ? true : false,
    shelfLife: isEditMode ? "365" : "",
    enableBatchManagement: isEditMode ? true : false,
    enableSerialManagement: isEditMode ? false : false,

    // 存储策略
    recommendedZones: isEditMode ? ["A库区", "B库区"] : [] as string[],
    recommendedLocations: isEditMode ? [] : [] as string[],
    storageType: isEditMode ? "常温" : "",
    stackingLayers: isEditMode ? "5" : "",
    allowMixedStorage: isEditMode ? false : false,

    // 成本信息
    purchasePrice: isEditMode ? "29.99" : "",
    sellingPrice: isEditMode ? "49.99" : "",
    currency: isEditMode ? "USD" : "",

    // 状态
    status: isEditMode ? "启用" : "启用",
    notes: isEditMode ? "" : "",
  });

  // 图片上传
  const [imageUrls, setImageUrls] = useState<string[]>(
    isEditMode ? ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"] : []
  );

  // 新增条码输入
  const [newBarcode, setNewBarcode] = useState("");

  // 更新表单字段
  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // 添加备用条码
  const handleAddBarcode = () => {
    if (newBarcode && !formData.alternateBarcodes.includes(newBarcode)) {
      updateField("alternateBarcodes", [...formData.alternateBarcodes, newBarcode]);
      setNewBarcode("");
    }
  };

  // 删除备用条码
  const handleRemoveBarcode = (index: number) => {
    const updated = formData.alternateBarcodes.filter((_, i) => i !== index);
    updateField("alternateBarcodes", updated);
  };

  // 添加推荐库区
  const handleAddZone = (zone: string) => {
    if (!formData.recommendedZones.includes(zone)) {
      updateField("recommendedZones", [...formData.recommendedZones, zone]);
    }
  };

  // 删除推荐库区
  const handleRemoveZone = (zone: string) => {
    updateField("recommendedZones", formData.recommendedZones.filter(z => z !== zone));
  };

  // 自动计算体积
  const calculateVolume = () => {
    const l = parseFloat(formData.length) || 0;
    const w = parseFloat(formData.width) || 0;
    const h = parseFloat(formData.height) || 0;
    return (l * w * h / 1000000).toFixed(6); // 转换为立方米
  };

  // 保存
  const handleSave = () => {
    console.log("保存SKU:", formData);
    alert(isEditMode ? `SKU ${formData.skuCode} 已更新` : `新建SKU ${formData.skuCode} 成功`);
    onNavigate("/master-data/skus");
  };

  // 保存并新增
  const handleSaveAndNew = () => {
    console.log("保存并新增SKU:", formData);
    alert(`SKU ${formData.skuCode} 已保存，继续新增下一个`);
    // 重置表单
    window.location.reload();
  };

  return (
    <WMSLayout
      title={isEditMode ? `编辑SKU - ${formData.skuCode}` : "新建SKU"}
      currentPath="/master-data/skus"
      onNavigate={onNavigate}
    >
      <div className="p-6 space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onNavigate("/master-data/skus")}>
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <Button variant="outline" onClick={handleSaveAndNew}>
                <Save className="w-4 h-4 mr-2" />
                保存并新增
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? "保存" : "保存"}
            </Button>
          </div>
        </div>

        {/* 主要表单区域 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 左侧表单 */}
          <div className="col-span-9 space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="specs">规格信息</TabsTrigger>
                <TabsTrigger value="dimensions">尺寸重量</TabsTrigger>
                <TabsTrigger value="inventory">库存策略</TabsTrigger>
                <TabsTrigger value="storage">存储策略</TabsTrigger>
              </TabsList>

              {/* Tab 1: 基本信息 */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      基本信息
                    </CardTitle>
                    <CardDescription>SKU的基础信息，带*为必填项</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="skuCode">
                          SKU编码 <span className="text-error-500">*</span>
                        </Label>
                        <Input
                          id="skuCode"
                          placeholder="请输入SKU编码"
                          value={formData.skuCode}
                          onChange={(e) => updateField("skuCode", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">唯一标识，不可重复</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer">
                          客户名称 <span className="text-error-500">*</span>
                        </Label>
                        <Select value={formData.customer} onValueChange={(val) => updateField("customer", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择客户" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="维他很忙">维他很忙</SelectItem>
                            <SelectItem value="跨境小王">跨境小王</SelectItem>
                            <SelectItem value="电商老李">电商老李</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productName">
                        商品名称（中文） <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        id="productName"
                        placeholder="请输入商品名称"
                        value={formData.productName}
                        onChange={(e) => updateField("productName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productNameEn">商品名称（英文）</Label>
                      <Input
                        id="productNameEn"
                        placeholder="Please enter product name"
                        value={formData.productNameEn}
                        onChange={(e) => updateField("productNameEn", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          商品分类 <span className="text-error-500">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={(val) => updateField("category", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一级分类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="电子产品">电子产品</SelectItem>
                            <SelectItem value="运动用品">运动用品</SelectItem>
                            <SelectItem value="家居用品">家居用品</SelectItem>
                            <SelectItem value="服装鞋包">服装鞋包</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCategory">二级分类</Label>
                        <Select value={formData.subCategory} onValueChange={(val) => updateField("subCategory", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择二级分类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="数码配件">数码配件</SelectItem>
                            <SelectItem value="可穿戴设备">可穿戴设备</SelectItem>
                            <SelectItem value="充电设备">充电设备</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">商品描述</Label>
                      <Textarea
                        id="description"
                        placeholder="请输入商品描述"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: 规格信息 */}
              <TabsContent value="specs" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tags className="w-5 h-5" />
                      规格信息
                    </CardTitle>
                    <CardDescription>商品的规格、条码和单位信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specifications">规格型号</Label>
                      <Input
                        id="specifications"
                        placeholder="如：黑色 / 标准版"
                        value={formData.specifications}
                        onChange={(e) => updateField("specifications", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">颜色、尺寸、版本等规格信息</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="mainBarcode">
                        主条码 <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        id="mainBarcode"
                        placeholder="请输入主条码"
                        value={formData.mainBarcode}
                        onChange={(e) => updateField("mainBarcode", e.target.value)}
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">唯一标识，通常为EAN-13或UPC-A条码</p>
                    </div>

                    <div className="space-y-2">
                      <Label>备用条码（一品多码）</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="输入备用条码"
                          value={newBarcode}
                          onChange={(e) => setNewBarcode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddBarcode();
                            }
                          }}
                          className="font-mono"
                        />
                        <Button type="button" variant="outline" onClick={handleAddBarcode}>
                          <Plus className="w-4 h-4 mr-2" />
                          添加
                        </Button>
                      </div>
                      {formData.alternateBarcodes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.alternateBarcodes.map((barcode, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              <span className="font-mono">{barcode}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBarcode(index)}
                                className="ml-2 hover:text-error-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="unit">
                          计量单位 <span className="text-error-500">*</span>
                        </Label>
                        <Select value={formData.unit} onValueChange={(val) => updateField("unit", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择单位" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="件">件</SelectItem>
                            <SelectItem value="箱">箱</SelectItem>
                            <SelectItem value="托">托</SelectItem>
                            <SelectItem value="个">个</SelectItem>
                            <SelectItem value="条">条</SelectItem>
                            <SelectItem value="盒">盒</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="conversionRatio">换算关系（数量）</Label>
                        <Input
                          id="conversionRatio"
                          type="number"
                          placeholder="12"
                          value={formData.conversionRatio}
                          onChange={(e) => updateField("conversionRatio", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conversionUnit">换算单位</Label>
                        <Select value={formData.conversionUnit} onValueChange={(val) => updateField("conversionUnit", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择单位" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="箱">箱</SelectItem>
                            <SelectItem value="托">托</SelectItem>
                            <SelectItem value="包">包</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.conversionRatio && formData.conversionUnit && (
                      <div className="flex items-center gap-2 p-3 bg-info-50 border border-info-200 rounded-lg">
                        <Info className="w-4 h-4 text-info-600" />
                        <span className="text-sm text-info-700">
                          1 {formData.conversionUnit} = {formData.conversionRatio} {formData.unit}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: 尺寸重量 */}
              <TabsContent value="dimensions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="w-5 h-5" />
                      尺寸重量
                    </CardTitle>
                    <CardDescription>商品的物理尺寸和重量信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="length">长（cm）</Label>
                          <Input
                            id="length"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={formData.length}
                            onChange={(e) => updateField("length", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="width">宽（cm）</Label>
                          <Input
                            id="width"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={formData.width}
                            onChange={(e) => updateField("width", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">高（cm）</Label>
                          <Input
                            id="height"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={formData.height}
                            onChange={(e) => updateField("height", e.target.value)}
                          />
                        </div>
                      </div>

                      {formData.length && formData.width && formData.height && (
                        <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-lg">
                          <Package className="w-4 h-4 text-success-600" />
                          <span className="text-sm text-success-700">
                            体积：{calculateVolume()} m³ ({formData.length} x {formData.width} x {formData.height} cm)
                          </span>
                        </div>
                      )}

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="grossWeight">毛重（kg）</Label>
                          <Input
                            id="grossWeight"
                            type="number"
                            step="0.001"
                            placeholder="0.000"
                            value={formData.grossWeight}
                            onChange={(e) => updateField("grossWeight", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">含包装的总重量</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="netWeight">净重（kg）</Label>
                          <Input
                            id="netWeight"
                            type="number"
                            step="0.001"
                            placeholder="0.000"
                            value={formData.netWeight}
                            onChange={(e) => updateField("netWeight", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">不含包装的重量</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 4: 库存策略 */}
              <TabsContent value="inventory" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      库存策略
                    </CardTitle>
                    <CardDescription>库存管理相关的策略配置</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="safetyStock">安全库存</Label>
                        <Input
                          id="safetyStock"
                          type="number"
                          placeholder="0"
                          value={formData.safetyStock}
                          onChange={(e) => updateField("safetyStock", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxStock">最高库存</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          placeholder="0"
                          value={formData.maxStock}
                          onChange={(e) => updateField("maxStock", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="replenishmentCycle">补货周期（天）</Label>
                        <Input
                          id="replenishmentCycle"
                          type="number"
                          placeholder="0"
                          value={formData.replenishmentCycle}
                          onChange={(e) => updateField("replenishmentCycle", e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <Label>有效期管理</Label>
                          <p className="text-xs text-muted-foreground">开启后需要记录商品的生产日期和保质期</p>
                        </div>
                        <Switch
                          checked={formData.enableExpiryManagement}
                          onCheckedChange={(checked) => updateField("enableExpiryManagement", checked)}
                        />
                      </div>

                      {formData.enableExpiryManagement && (
                        <div className="ml-4 space-y-2">
                          <Label htmlFor="shelfLife">保质期（天）</Label>
                          <Input
                            id="shelfLife"
                            type="number"
                            placeholder="365"
                            value={formData.shelfLife}
                            onChange={(e) => updateField("shelfLife", e.target.value)}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <Label>批次管理</Label>
                          <p className="text-xs text-muted-foreground">开启后可以按批次追溯商品</p>
                        </div>
                        <Switch
                          checked={formData.enableBatchManagement}
                          onCheckedChange={(checked) => updateField("enableBatchManagement", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <Label>序列号管理</Label>
                          <p className="text-xs text-muted-foreground">开启后每个商品都有唯一序列号</p>
                        </div>
                        <Switch
                          checked={formData.enableSerialManagement}
                          onCheckedChange={(checked) => updateField("enableSerialManagement", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 5: 存储策略 */}
              <TabsContent value="storage" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      存储策略
                    </CardTitle>
                    <CardDescription>商品在仓库中的存储相关配置</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>推荐库区</Label>
                      <Select onValueChange={handleAddZone}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择库区" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A库区">A库区</SelectItem>
                          <SelectItem value="B库区">B库区</SelectItem>
                          <SelectItem value="C库区">C库区</SelectItem>
                          <SelectItem value="D库区">D库区</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.recommendedZones.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.recommendedZones.map((zone) => (
                            <Badge key={zone} variant="secondary" className="px-3 py-1">
                              {zone}
                              <button
                                type="button"
                                onClick={() => handleRemoveZone(zone)}
                                className="ml-2 hover:text-error-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="storageType">存储类型</Label>
                        <Select value={formData.storageType} onValueChange={(val) => updateField("storageType", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择存储类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="常温">常温</SelectItem>
                            <SelectItem value="冷藏">冷藏（2-8°C）</SelectItem>
                            <SelectItem value="冷冻">冷冻（-18°C以下）</SelectItem>
                            <SelectItem value="危险品">危险品</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stackingLayers">堆码层数</Label>
                        <Input
                          id="stackingLayers"
                          type="number"
                          placeholder="5"
                          value={formData.stackingLayers}
                          onChange={(e) => updateField("stackingLayers", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <Label>是否可混放</Label>
                        <p className="text-xs text-muted-foreground">允许与其他SKU混合存放在同一库位</p>
                      </div>
                      <Switch
                        checked={formData.allowMixedStorage}
                        onCheckedChange={(checked) => updateField("allowMixedStorage", checked)}
                      />
                    </div>

                    {formData.storageType === "危险品" && (
                      <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-error-600" />
                        <span className="text-sm text-error-700">
                          该商品为危险品，请确保存储在专用危险品库区并遵守安全规范
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 成本信息 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      成本信息（选填）
                    </CardTitle>
                    <CardDescription>商品的采购价和销售价信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">采购价</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.purchasePrice}
                          onChange={(e) => updateField("purchasePrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice">销售价</Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.sellingPrice}
                          onChange={(e) => updateField("sellingPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">币种</Label>
                        <Select value={formData.currency} onValueChange={(val) => updateField("currency", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择币种" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - 美元</SelectItem>
                            <SelectItem value="EUR">EUR - 欧元</SelectItem>
                            <SelectItem value="GBP">GBP - 英镑</SelectItem>
                            <SelectItem value="CNY">CNY - 人民币</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧侧边栏 */}
          <div className="col-span-3 space-y-4">
            {/* 商品图片 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">商品图片</CardTitle>
                <CardDescription className="text-xs">支持上传多张图片，第一张为主图</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`商品图片${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-primary">主图</Badge>
                    )}
                  </div>
                ))}

                <Button variant="outline" className="w-full" onClick={() => alert("打开图片上传对话框")}>
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  建议尺寸：800x800px，支持JPG/PNG
                </p>
              </CardContent>
            </Card>

            {/* 状态控制 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">状态控制</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>启用状态</Label>
                  <Switch
                    checked={formData.status === "启用"}
                    onCheckedChange={(checked) => updateField("status", checked ? "启用" : "停用")}
                  />
                </div>
                {formData.status === "停用" && (
                  <div className="flex items-center gap-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-warning-600" />
                    <span className="text-xs text-warning-700">停用后无法进行入库和出库操作</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 备注 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">备注</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入备注信息..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </CardContent>
            </Card>

            {/* 时间信息（编辑模式） */}
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    时间信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建时间：</span>
                    <span>2026-05-01 10:23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">更新时间：</span>
                    <span>2026-06-02 14:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建人：</span>
                    <span>Bobby</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </WMSLayout>
  );
}
