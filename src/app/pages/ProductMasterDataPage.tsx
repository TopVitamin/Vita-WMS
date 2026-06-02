import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Search, Plus, Filter, Download, Upload, Edit, Trash2, Package, 
  Ruler, Weight, Tag, Building2, Image as ImageIcon, X
} from "lucide-react";

interface ProductMasterDataPageProps {
  onNavigate: (path: string) => void;
}

export default function ProductMasterDataPage({ onNavigate }: ProductMasterDataPageProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [newBarcode, setNewBarcode] = useState("");

  // 模拟数据 - 支持一品多码
  const productData = [
    {
      productId: "PROD-001",
      sku: "SKU-2024-001",
      productName: "无线蓝牙耳机",
      productNameEn: "Wireless Bluetooth Earbuds",
      category: "电子产品",
      customer: "Amazon US",
      customerCode: "AMZ-US",
      barcodes: ["6901234567890", "0123456789012", "4567890123456"],
      weight: 0.05,
      length: 6,
      width: 4,
      height: 3,
      volume: 0.072,
      safetyStock: 500,
      currentStock: 1250,
      status: "启用",
      imageUrl: "https://images.unsplash.com/photo-1591923271591-478bb32b57ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBwcm9kdWN0fGVufDF8fHx8MTc2MTU0NjA0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-01-15",
    },
    {
      productId: "PROD-002",
      sku: "SKU-2024-002",
      productName: "智能手环",
      productNameEn: "Smart Fitness Band",
      category: "电子产品",
      customer: "eBay UK",
      customerCode: "EBAY-UK",
      barcodes: ["6901234567891", "0123456789013"],
      weight: 0.025,
      length: 8,
      width: 2.5,
      height: 1.5,
      volume: 0.03,
      safetyStock: 300,
      currentStock: 2300,
      status: "启用",
      imageUrl: "https://images.unsplash.com/photo-1690016424217-03f4d9427a6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwZml0bmVzc3xlbnwxfHx8fDE3NjE2MzMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-02-10",
    },
    {
      productId: "PROD-003",
      sku: "SKU-2024-003",
      productName: "运动水杯",
      productNameEn: "Sports Water Bottle",
      category: "运动用品",
      customer: "Walmart Canada",
      customerCode: "WMT-CA",
      barcodes: ["6901234567892"],
      weight: 0.15,
      length: 20,
      width: 7,
      height: 7,
      volume: 0.98,
      safetyStock: 200,
      currentStock: 850,
      status: "启用",
      imageUrl: "https://images.unsplash.com/photo-1525397053281-a37d8a2ff7ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMHNwb3J0c3xlbnwxfHx8fDE3NjE1NjI4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-03-05",
    },
    {
      productId: "PROD-004",
      sku: "SKU-2024-004",
      productName: "USB-C数据线",
      productNameEn: "USB-C Cable",
      category: "电子配件",
      customer: "Amazon US",
      customerCode: "AMZ-US",
      barcodes: ["6901234567893", "0123456789014", "4567890123457", "7890123456789"],
      weight: 0.03,
      length: 15,
      width: 5,
      height: 2,
      volume: 0.15,
      safetyStock: 1000,
      currentStock: 3500,
      status: "启用",
      imageUrl: "https://images.unsplash.com/photo-1615086169217-83e1c06c9f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2IlMjBjYWJsZSUyMHRlY2h8ZW58MXx8fHwxNzYxNjMzMDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-01-20",
    },
    {
      productId: "PROD-005",
      sku: "SKU-2024-005",
      productName: "手机支架",
      productNameEn: "Phone Holder",
      category: "电子配件",
      customer: "Shopify Merchants",
      customerCode: "SHOP-001",
      barcodes: ["6901234567894"],
      weight: 0.08,
      length: 10,
      width: 8,
      height: 5,
      volume: 0.4,
      safetyStock: null,
      currentStock: 1100,
      status: "启用",
      imageUrl: "https://images.unsplash.com/photo-1708063784456-9b9d60058c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGhvbGRlciUyMGNhcnxlbnwxfHx8fDE3NjE2NDMwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-04-12",
    },
    {
      productId: "PROD-006",
      sku: "SKU-2024-006",
      productName: "笔记本电脑支架",
      productNameEn: "Laptop Stand",
      category: "办公用品",
      customer: "Zalando Germany",
      customerCode: "ZAL-DE",
      barcodes: ["6901234567895", "0123456789015"],
      weight: 0.45,
      length: 25,
      width: 22,
      height: 5,
      volume: 2.75,
      safetyStock: 150,
      currentStock: 420,
      status: "启用",
      imageUrl: "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzdGFuZCUyMGRlc2t8ZW58MXx8fHwxNzYxNTczMTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      createTime: "2024-05-08",
    },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(productData.map((_, index) => `product-${index}`));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index: number) => {
    const itemId = `product-${index}`;
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setBarcodes(product.barcodes || []);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    // 实际项目中这里应该调用API
    console.log("Delete product:", productId);
  };

  const handleAddBarcode = () => {
    if (newBarcode.trim()) {
      setBarcodes([...barcodes, newBarcode.trim()]);
      setNewBarcode("");
    }
  };

  const handleRemoveBarcode = (index: number) => {
    setBarcodes(barcodes.filter((_, i) => i !== index));
  };

  const openAddDialog = () => {
    setBarcodes([]);
    setNewBarcode("");
    setIsAddDialogOpen(true);
  };

  return (
    <WMSLayout title="商品资料" currentPath="/master-data/products" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="搜索SKU/产品名称/条形码..." 
                className="pl-9 w-80" 
              />
            </div>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="商品分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="electronics">电子产品</SelectItem>
                <SelectItem value="accessories">电子配件</SelectItem>
                <SelectItem value="sports">运动用品</SelectItem>
                <SelectItem value="office">办公用品</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="所属客户" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部客户</SelectItem>
                <SelectItem value="amazon">Amazon US</SelectItem>
                <SelectItem value="ebay">eBay UK</SelectItem>
                <SelectItem value="walmart">Walmart Canada</SelectItem>
                <SelectItem value="shopify">Shopify Merchants</SelectItem>
                <SelectItem value="zalando">Zalando Germany</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="商品状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              更多筛选
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              批量导入
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button size="sm" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              新增商品
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-4">
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">商品总数</div>
            <div className="text-2xl">{productData.length}</div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">启用商品</div>
            <div className="text-2xl text-success-600">
              {productData.filter(p => p.status === "启用").length}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">总库存</div>
            <div className="text-2xl">
              {productData.reduce((sum, p) => sum + p.currentStock, 0).toLocaleString()}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">条形码总数</div>
            <div className="text-2xl">
              {productData.reduce((sum, p) => sum + p.barcodes.length, 0)}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">低于安全库存</div>
            <div className="text-2xl text-warning-600">
              {productData.filter(p => p.safetyStock && p.currentStock < p.safetyStock).length}
            </div>
          </div>
        </div>

        {/* 批量操作提示 */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm">
              已选择 <span className="font-mono mx-1">{selectedItems.length}</span> 个商品
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">批量修改分类</Button>
              <Button variant="outline" size="sm">批量启用</Button>
              <Button variant="outline" size="sm">批量停用</Button>
              <Button variant="outline" size="sm">批量删除</Button>
            </div>
          </div>
        )}

        {/* 表格 */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--table-header-bg)' }}>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === productData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>商品图片</TableHead>
                <TableHead>SKU编号</TableHead>
                <TableHead>商品名称</TableHead>
                <TableHead>所属客户</TableHead>
                <TableHead>商品分类</TableHead>
                <TableHead>条形码（一品多码）</TableHead>
                <TableHead className="text-right">规格(cm)</TableHead>
                <TableHead className="text-right">重量(kg)</TableHead>
                <TableHead className="text-right">当前库存</TableHead>
                <TableHead className="text-right">安全库存</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product, index) => (
                <TableRow
                  key={product.productId}
                  className="hover:bg-table-row-hover transition-colors"
                  style={{
                    backgroundColor: selectedItems.includes(`product-${index}`)
                      ? "var(--table-row-hover)"
                      : undefined,
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(`product-${index}`)}
                      onCheckedChange={() => handleSelectItem(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-16 h-16 rounded object-cover border"
                    />
                  </TableCell>
                  <TableCell>
                    <code className="text-sm font-mono text-primary">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <div className="truncate">{product.productName}</div>
                      <div className="text-xs text-muted-foreground truncate">{product.productNameEn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{product.customer}</div>
                        <div className="text-xs text-muted-foreground font-mono">{product.customerCode}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {product.barcodes.map((barcode, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="font-mono text-xs"
                        >
                          {barcode}
                        </Badge>
                      ))}
                      {product.barcodes.length > 1 && (
                        <Badge variant="outline" className="text-xs">
                          共{product.barcodes.length}码
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-xs font-mono">
                      <Ruler className="w-3 h-3 text-muted-foreground" />
                      <span>{product.length}×{product.width}×{product.height}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-xs font-mono">
                      <Weight className="w-3 h-3 text-muted-foreground" />
                      <span>{product.weight}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <div className={product.safetyStock && product.currentStock < product.safetyStock ? "text-warning-600" : ""}>
                      {product.currentStock.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {product.safetyStock ? product.safetyStock.toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.status === "启用" ? "default" : "secondary"}
                      className={product.status === "启用" 
                        ? "bg-success-50 text-success-700 border-success-200" 
                        : "bg-gray-100 text-gray-600 border-gray-200"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(product.productId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {productData.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>上一页</Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="min-w-[36px]">1</Button>
            </div>
            <Button variant="outline" size="sm" disabled>下一页</Button>
          </div>
        </div>
      </div>

      {/* 新增商品对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增商品</DialogTitle>
            <DialogDescription>
              填写商品详细信息，创建新的商品档案（支持一品多码）
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="productImage">商品图片</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU编号 *</Label>
              <Input id="sku" placeholder="例如：SKU-2024-001" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productName">商品名称(中文) *</Label>
              <Input id="productName" placeholder="商品中文名称" />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="productNameEn">商品名称(英文)</Label>
              <Input id="productNameEn" placeholder="Product Name in English" />
            </div>

            {/* 条形码管理 - 一品多码 */}
            <div className="space-y-2 col-span-2">
              <Label>条形码（一品多码）</Label>
              <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <div className="flex gap-2">
                  <Input 
                    placeholder="输入条形码" 
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddBarcode()}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddBarcode}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加
                  </Button>
                </div>
                
                {barcodes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      已添加 {barcodes.length} 个条形码
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {barcodes.map((barcode, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="font-mono text-xs gap-1 pr-1"
                        >
                          {barcode}
                          <button
                            type="button"
                            onClick={() => handleRemoveBarcode(index)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">商品分类 *</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">电子产品</SelectItem>
                  <SelectItem value="accessories">电子配件</SelectItem>
                  <SelectItem value="sports">运动用品</SelectItem>
                  <SelectItem value="office">办公用品</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">所属客户 *</Label>
              <Select>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="选择客户" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon">Amazon US</SelectItem>
                  <SelectItem value="ebay">eBay UK</SelectItem>
                  <SelectItem value="walmart">Walmart Canada</SelectItem>
                  <SelectItem value="shopify">Shopify Merchants</SelectItem>
                  <SelectItem value="zalando">Zalando Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">长度 (cm) *</Label>
              <Input id="length" type="number" placeholder="0.00" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">宽度 (cm) *</Label>
              <Input id="width" type="number" placeholder="0.00" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">高度 (cm) *</Label>
              <Input id="height" type="number" placeholder="0.00" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">重量 (kg) *</Label>
              <Input id="weight" type="number" placeholder="0.00" step="0.001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyStock">安全库存</Label>
              <Input id="safetyStock" type="number" placeholder="选填，不填则无安全库存限制" />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">商品描述</Label>
              <Textarea id="description" placeholder="商品详细描述" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch id="status" defaultChecked />
                <Label htmlFor="status">启用</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              确认新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑商品对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑商品</DialogTitle>
            <DialogDescription>
              修改商品详细信息（支持一品多码）
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-productImage">商品图片</Label>
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={editingProduct.imageUrl}
                    alt={editingProduct.productName}
                    className="w-24 h-24 border-2 rounded object-cover"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    更换图片
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU编号 *</Label>
                <Input 
                  id="edit-sku" 
                  defaultValue={editingProduct.sku}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-productName">商品名称(中文) *</Label>
                <Input 
                  id="edit-productName" 
                  defaultValue={editingProduct.productName}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-productNameEn">商品名称(英文)</Label>
                <Input 
                  id="edit-productNameEn" 
                  defaultValue={editingProduct.productNameEn}
                />
              </div>

              {/* 条形码管理 - 一品多码 */}
              <div className="space-y-2 col-span-2">
                <Label>条形码（一品多码）</Label>
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="输入条形码" 
                      value={newBarcode}
                      onChange={(e) => setNewBarcode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddBarcode()}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddBarcode}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加
                    </Button>
                  </div>
                  
                  {barcodes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        已添加 {barcodes.length} 个条形码
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {barcodes.map((barcode, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="font-mono text-xs gap-1 pr-1"
                          >
                            {barcode}
                            <button
                              type="button"
                              onClick={() => handleRemoveBarcode(index)}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">商品分类 *</Label>
                <Select defaultValue={editingProduct.category}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="电子产品">电子产品</SelectItem>
                    <SelectItem value="电子配件">电子配件</SelectItem>
                    <SelectItem value="运动用品">运动用品</SelectItem>
                    <SelectItem value="办公用品">办公用品</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer">所属客户 *</Label>
                <Select defaultValue={editingProduct.customer}>
                  <SelectTrigger id="edit-customer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amazon US">Amazon US</SelectItem>
                    <SelectItem value="eBay UK">eBay UK</SelectItem>
                    <SelectItem value="Walmart Canada">Walmart Canada</SelectItem>
                    <SelectItem value="Shopify Merchants">Shopify Merchants</SelectItem>
                    <SelectItem value="Zalando Germany">Zalando Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-length">长度 (cm) *</Label>
                <Input 
                  id="edit-length" 
                  type="number" 
                  defaultValue={editingProduct.length}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-width">宽度 (cm) *</Label>
                <Input 
                  id="edit-width" 
                  type="number" 
                  defaultValue={editingProduct.width}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-height">高度 (cm) *</Label>
                <Input 
                  id="edit-height" 
                  type="number" 
                  defaultValue={editingProduct.height}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">重量 (kg) *</Label>
                <Input 
                  id="edit-weight" 
                  type="number" 
                  defaultValue={editingProduct.weight}
                  step="0.001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-safetyStock">安全库存</Label>
                <Input 
                  id="edit-safetyStock" 
                  type="number" 
                  defaultValue={editingProduct.safetyStock || ""}
                  placeholder="选填，不填则无安全库存限制"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">状态</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch 
                    id="edit-status" 
                    defaultChecked={editingProduct.status === "启用"}
                  />
                  <Label htmlFor="edit-status">启用</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WMSLayout>
  );
}
