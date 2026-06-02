import { useState, useRef, useEffect } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { ExceptionDialog } from "../components/business";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { 
  Scan, 
  Package,
  CheckCircle2, 
  AlertCircle, 
  Printer,
  Box,
  Scale,
  Camera,
  XCircle,
  PackageCheck,
  PackageX,
  PackagePlus,
  BarChart3,
  Sparkles,
  Zap,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface OutboundCheckPageProps {
  onNavigate?: (path: string) => void;
}

// 商品明细
interface ProductItem {
  sku: string;
  productName: string;
  barcode: string;
  imageUrl?: string;
  requiredQty: number;
  checkedQty: number;
  status: "pending" | "checking" | "completed" | "shortage" | "excess";
  location?: string;
}

// 订单数据
interface Order {
  orderNo: string;
  customer: string;
  items: ProductItem[];
  totalItems: number;
  checkedItems: number;
  status: "pending" | "checking" | "completed";
  priority: "normal" | "urgent";
  orderType: "B2C" | "B2B";
}

// 波次数据
interface Wave {
  waveNo: string;
  orders: Order[];
  totalOrders: number;
}

// 装箱记录
interface PackingBox {
  boxNo: string;
  orderNo?: string;
  customer?: string;
  items: Array<{
    sku: string;
    productName: string;
    qty: number;
  }>;
  weight?: number;
  createdAt: string;
  printed: boolean;
}

// 异常记录
interface AnomalyRecord {
  sku: string;
  productName: string;
  type: "shortage" | "excess" | "damage" | "wrong";
  expectedQty: number;
  actualQty: number;
  remark: string;
  timestamp: string;
}

// 模拟订单数据
const mockOrders: Record<string, Order> = {
  "SO-2024-001": {
    orderNo: "SO-2024-001",
    customer: "客户A - 张三",
    priority: "normal",
    orderType: "B2C",
    totalItems: 5,
    checkedItems: 0,
    status: "pending",
    items: [
      { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", requiredQty: 2, checkedQty: 0, status: "pending", location: "A-01-02-03" },
      { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", requiredQty: 1, checkedQty: 0, status: "pending", location: "A-02-01-05" },
      { sku: "SKU-003", productName: "充电宝 10000mAh", barcode: "6901234567892", requiredQty: 2, checkedQty: 0, status: "pending", location: "B-01-03-02" },
    ],
  },
  "SO-2024-002": {
    orderNo: "SO-2024-002",
    customer: "客户B - 李四",
    priority: "urgent",
    orderType: "B2C",
    totalItems: 3,
    checkedItems: 0,
    status: "pending",
    items: [
      { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", requiredQty: 1, checkedQty: 0, status: "pending", location: "A-01-02-03" },
      { sku: "SKU-004", productName: "数据线 Type-C", barcode: "6901234567893", requiredQty: 2, checkedQty: 0, status: "pending", location: "C-01-01-01" },
    ],
  },
  "SO-2024-003": {
    orderNo: "SO-2024-003",
    customer: "客户C - 王五",
    priority: "normal",
    orderType: "B2C",
    totalItems: 1,
    checkedItems: 0,
    status: "pending",
    items: [
      { sku: "SKU-005", productName: "无线鼠标", barcode: "6901234567894", requiredQty: 1, checkedQty: 0, status: "pending", location: "A-03-02-01" },
    ],
  },
};

// 模拟波次数据（用于单品复核模式）
const mockWaves: Record<string, Wave> = {
  "WAVE-SINGLE-001": {
    waveNo: "WAVE-SINGLE-001",
    totalOrders: 5,
    orders: [
      mockOrders["SO-2024-003"], // 单品订单：无线鼠标
      {
        orderNo: "SO-2024-005",
        customer: "客户E - 孙七",
        priority: "normal",
        orderType: "B2C",
        totalItems: 1,
        checkedItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-007", productName: "笔记本支架", barcode: "6901234567896", requiredQty: 1, checkedQty: 0, status: "pending" },
        ],
      },
      {
        orderNo: "SO-2024-006",
        customer: "客户F - 周八",
        priority: "normal",
        orderType: "B2C",
        totalItems: 1,
        checkedItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-008", productName: "USB集线器", barcode: "6901234567897", requiredQty: 1, checkedQty: 0, status: "pending" },
        ],
      },
      {
        orderNo: "SO-2024-007",
        customer: "客户G - 吴九",
        priority: "normal",
        orderType: "B2C",
        totalItems: 1,
        checkedItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-009", productName: "显示器挂灯", barcode: "6901234567898", requiredQty: 1, checkedQty: 0, status: "pending" },
        ],
      },
      {
        orderNo: "SO-2024-008",
        customer: "客户H - 郑十",
        priority: "normal",
        orderType: "B2C",
        totalItems: 1,
        checkedItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-006", productName: "键盘", barcode: "6901234567895", requiredQty: 1, checkedQty: 0, status: "pending" },
        ],
      },
    ],
  },
};

export default function OutboundCheckPage({ onNavigate }: OutboundCheckPageProps) {
  // 模式切换
  const [checkMode, setCheckMode] = useState<"standard" | "single">("standard");
  
  // 标准模式状态
  const [orderInput, setOrderInput] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [boxInput, setBoxInput] = useState("");
  const [currentBox, setCurrentBox] = useState<string | null>(null);
  const [skuInput, setSkuInput] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [batchQty, setBatchQty] = useState("");
  const [packedBoxes, setPackedBoxes] = useState<PackingBox[]>([]);
  const [currentStep, setCurrentStep] = useState<"order" | "box" | "check">("order");
  
  // 单品模式状态
  const [singleSkuInput, setSingleSkuInput] = useState("");
  const [singleWaveInput, setSingleWaveInput] = useState("");
  const [singleWaveData, setSingleWaveData] = useState<Wave | null>(null);
  const [singleModeStep, setSingleModeStep] = useState<"wave" | "scan">("wave");
  const [singleModeStats, setSingleModeStats] = useState({
    todayCount: 0,
    avgTime: 0,
  });
  
  // 异常处理
  const [isAnomalyDialogOpen, setIsAnomalyDialogOpen] = useState(false);
  const [anomalyItem, setAnomalyItem] = useState<ProductItem | null>(null);
  const [anomalyType, setAnomalyType] = useState<"shortage" | "excess" | "damage" | "wrong">("shortage");
  const [anomalyQty, setAnomalyQty] = useState("");
  const [anomalyRemark, setAnomalyRemark] = useState("");
  const [anomalyRecords, setAnomalyRecords] = useState<AnomalyRecord[]>([]);
  
  // 称重
  const [weightInput, setWeightInput] = useState("");
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [pendingBox, setPendingBox] = useState<PackingBox | null>(null);
  
  // Refs
  const orderInputRef = useRef<HTMLInputElement>(null);
  const boxInputRef = useRef<HTMLInputElement>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);
  const batchQtyInputRef = useRef<HTMLInputElement>(null);
  const singleSkuInputRef = useRef<HTMLInputElement>(null);
  
  // 自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (checkMode === "standard") {
        if (currentStep === "order" && orderInputRef.current) {
          orderInputRef.current.focus();
        } else if (currentStep === "box" && boxInputRef.current) {
          boxInputRef.current.focus();
        } else if (currentStep === "check" && !batchMode && skuInputRef.current) {
          skuInputRef.current.focus();
        } else if (currentStep === "check" && batchMode && batchQtyInputRef.current) {
          batchQtyInputRef.current.focus();
        }
      } else if (checkMode === "single" && singleSkuInputRef.current) {
        singleSkuInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [checkMode, currentStep, batchMode, skuInput, singleModeStep]);
  
  // 处理订单扫描（标准模式）
  const handleOrderScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && orderInput.trim()) {
      const input = orderInput.trim().toUpperCase();
      const order = mockOrders[input];
      
      if (order) {
        setCurrentOrder(JSON.parse(JSON.stringify(order))); // 深拷贝
        setCurrentStep("box");
        toast.success(`订单 ${order.orderNo} 加载成功`);
      } else {
        toast.error("未找到匹配的订单");
      }
      setOrderInput("");
    }
  };
  
  // 生成新箱号
  const handleGenerateBox = () => {
    const newBoxNo = `BOX-${Date.now().toString().slice(-8)}`;
    setCurrentBox(newBoxNo);
    setCurrentStep("check");
    toast.success(`新箱号已生成：${newBoxNo}`);
  };
  
  // 处理箱号扫描（标准模式）
  const handleBoxScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && boxInput.trim()) {
      const input = boxInput.trim().toUpperCase();
      setCurrentBox(input);
      setCurrentStep("check");
      toast.success(`出库箱 ${input} 已绑定`);
      setBoxInput("");
    }
  };
  
  // 处理SKU扫描（标准模式）
  const handleSkuScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skuInput.trim() && currentOrder) {
      const input = skuInput.trim();
      
      // 查找匹配的商品
      const item = currentOrder.items.find(
        (item) => 
          item.sku.toLowerCase() === input.toLowerCase() || 
          item.barcode.toLowerCase() === input.toLowerCase()
      );
      
      if (!item) {
        toast.error("该商品不在当前订单中");
        setSkuInput("");
        return;
      }
      
      if (item.checkedQty >= item.requiredQty) {
        toast.warning(`${item.sku} 已复核完成，无需重复扫描`);
        setSkuInput("");
        return;
      }
      
      if (batchMode) {
        // 批量模式：等待输入数量
        return;
      } else {
        // 逐件模式：自动+1
        performCheck(item, 1);
        setSkuInput("");
      }
    }
  };
  
  // 处理批量数量输入
  const handleBatchQtyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && batchQty.trim() && skuInput.trim() && currentOrder) {
      const qty = parseInt(batchQty);
      
      if (isNaN(qty) || qty <= 0) {
        toast.error("请输入有效数量");
        return;
      }
      
      const input = skuInput.trim();
      const item = currentOrder.items.find(
        (item) => 
          item.sku.toLowerCase() === input.toLowerCase() || 
          item.barcode.toLowerCase() === input.toLowerCase()
      );
      
      if (item) {
        performCheck(item, qty);
        setSkuInput("");
        setBatchQty("");
      }
    }
  };
  
  // 执行复核
  const performCheck = (item: ProductItem, qty: number) => {
    if (!currentOrder) return;
    
    const newCheckedQty = item.checkedQty + qty;
    
    // 检查是否超量
    if (newCheckedQty > item.requiredQty) {
      toast.error(`超量！${item.sku} 需求 ${item.requiredQty}，已扫描 ${item.checkedQty}，本次扫描 ${qty}`);
      // 打开异常处理对话框
      setAnomalyItem(item);
      setAnomalyType("excess");
      setAnomalyQty(qty.toString());
      setIsAnomalyDialogOpen(true);
      return;
    }
    
    // 更新订单数据
    const updatedItems = currentOrder.items.map((i) => {
      if (i.sku === item.sku) {
        const newQty = i.checkedQty + qty;
        return {
          ...i,
          checkedQty: newQty,
          status: newQty >= i.requiredQty ? "completed" as const : "checking" as const,
        };
      }
      return i;
    });
    
    const totalChecked = updatedItems.reduce((sum, i) => sum + i.checkedQty, 0);
    const allCompleted = updatedItems.every((i) => i.checkedQty >= i.requiredQty);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      checkedItems: totalChecked,
      status: allCompleted ? "completed" : "checking",
    });
    
    toast.success(`${item.sku} +${qty}，已复核 ${newCheckedQty}/${item.requiredQty}`);
    
    // 如果订单全部复核完成
    if (allCompleted) {
      toast.success("🎉 订单复核完成！可以装箱了");
    }
  };
  
  // 装箱完成
  const handlePackingComplete = () => {
    if (!currentOrder || !currentBox) return;
    
    // 检查是否所有商品都已复核完成
    const allCompleted = currentOrder.items.every((i) => i.checkedQty >= i.requiredQty);
    
    if (!allCompleted) {
      const remaining = currentOrder.items.filter((i) => i.checkedQty < i.requiredQty);
      toast.error(`还有 ${remaining.length} 个商品未复核完成`);
      return;
    }
    
    // 创建装箱记录
    const newBox: PackingBox = {
      boxNo: currentBox,
      orderNo: currentOrder.orderNo,
      customer: currentOrder.customer,
      items: currentOrder.items.map((i) => ({
        sku: i.sku,
        productName: i.productName,
        qty: i.checkedQty,
      })),
      createdAt: new Date().toLocaleString("zh-CN"),
      printed: false,
    };
    
    setPendingBox(newBox);
    setIsWeightDialogOpen(true);
  };
  
  // 确认称重并装箱
  const handleConfirmWeight = () => {
    if (!pendingBox) return;
    
    const weight = weightInput ? parseFloat(weightInput) : undefined;
    
    const finalBox: PackingBox = {
      ...pendingBox,
      weight,
    };
    
    setPackedBoxes([...packedBoxes, finalBox]);
    
    toast.success(`装箱完成！箱号：${finalBox.boxNo}`);
    
    // 重置状态
    setCurrentOrder(null);
    setCurrentBox(null);
    setCurrentStep("order");
    setWeightInput("");
    setIsWeightDialogOpen(false);
    setPendingBox(null);
  };
  
  // 打印标签
  const handlePrintLabel = (box: PackingBox) => {
    toast.success(`正在打印箱号 ${box.boxNo} 的标签...`);
    
    // 更新打印状态
    setPackedBoxes(packedBoxes.map((b) => 
      b.boxNo === box.boxNo ? { ...b, printed: true } : b
    ));
  };
  
  // 处理异常登记
  const handleAnomalySubmit = () => {
    if (!anomalyItem) return;
    
    const record: AnomalyRecord = {
      sku: anomalyItem.sku,
      productName: anomalyItem.productName,
      type: anomalyType,
      expectedQty: anomalyItem.requiredQty,
      actualQty: parseInt(anomalyQty) || 0,
      remark: anomalyRemark,
      timestamp: new Date().toLocaleTimeString("zh-CN"),
    };
    
    setAnomalyRecords([...anomalyRecords, record]);
    toast.warning(`异常已登记：${record.productName}`);
    
    // 重置
    setIsAnomalyDialogOpen(false);
    setAnomalyItem(null);
    setAnomalyQty("");
    setAnomalyRemark("");
  };
  
  // 单品复核：波次扫描
  const handleSingleWaveScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && singleWaveInput.trim()) {
      const input = singleWaveInput.trim().toUpperCase();
      const wave = mockWaves[input];
      
      if (!wave) {
        toast.error("未找到匹配的波次");
        setSingleWaveInput("");
        return;
      }
      
      // 检查波次中是否有单品订单
      const singleItemCount = wave.orders.filter((order) => order.items.length === 1).length;
      
      if (singleItemCount === 0) {
        toast.error("该波次中没有单品订单，请使用标准复核模式");
        setSingleWaveInput("");
        return;
      }
      
      setSingleWaveData(wave);
      setSingleModeStep("scan");
      toast.success(`波次 ${wave.waveNo} 加载成功，共 ${wave.totalOrders} 个订单，其中 ${singleItemCount} 个单品订单`);
      setSingleWaveInput("");
    }
  };
  
  // 单品复核：商品扫描
  const handleSingleSkuScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && singleSkuInput.trim() && singleWaveData) {
      const input = singleSkuInput.trim();
      
      // 在当前波次中查找单品订单
      const matchedOrder = singleWaveData.orders.find((order) => {
        // 只匹配单品订单（items长度为1）
        if (order.items.length !== 1) return false;
        
        const item = order.items[0];
        return item.sku.toLowerCase() === input.toLowerCase() || 
               item.barcode.toLowerCase() === input.toLowerCase();
      });
      
      if (!matchedOrder) {
        toast.error("未在当前波次中找到匹配的单品订单");
        setSingleSkuInput("");
        return;
      }
      
      // 单品订单自动处理
      const item = matchedOrder.items[0];
      const autoBoxNo = `AUTO-${Date.now().toString().slice(-8)}`;
      
      // 显示匹配到的订单信息
      toast.info(`📦 匹配到订单：${matchedOrder.orderNo} - ${matchedOrder.customer}`);
      
      setTimeout(() => {
        const newBox: PackingBox = {
          boxNo: autoBoxNo,
          orderNo: matchedOrder.orderNo,
          customer: matchedOrder.customer,
          items: [{
            sku: item.sku,
            productName: item.productName,
            qty: item.requiredQty,
          }],
          createdAt: new Date().toLocaleString("zh-CN"),
          printed: true,
        };
        
        setPackedBoxes([...packedBoxes, newBox]);
        
        // 更新统计
        setSingleModeStats({
          todayCount: singleModeStats.todayCount + 1,
          avgTime: 3,
        });
        
        toast.success(`✨ 复核完成！箱号：${autoBoxNo}`);
        setTimeout(() => {
          toast.success(`📄 面单已自动打印`);
        }, 300);
      }, 500);
      
      setSingleSkuInput("");
    }
  };
  
  // 单品复核模式统一入口
  const handleSingleModeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (singleModeStep === "wave") {
      handleSingleWaveScan(e);
    } else {
      handleSingleSkuScan(e);
    }
  };
  
  // 重置流程
  const handleReset = () => {
    setCurrentOrder(null);
    setCurrentBox(null);
    setCurrentStep("order");
    setSkuInput("");
    setBatchQty("");
  };
  
  return (
    <WMSLayout title="出库复核" currentPath="/outbound/check" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* 模式切换 */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={checkMode} onValueChange={(v) => setCheckMode(v as "standard" | "single")}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="standard" className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" />
                  标准复核模式
                </TabsTrigger>
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  单品复核模式
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* 标准复核模式 */}
        {checkMode === "standard" && (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* 左侧：操作区 */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: 扫描订单 */}
              {currentStep === "order" && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scan className="w-5 h-5" />
                      扫描订单
                    </CardTitle>
                    <CardDescription>
                      扫描或输入订单号、波次号、拣货箱号
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>订单号</Label>
                      <Input
                        ref={orderInputRef}
                        value={orderInput}
                        onChange={(e) => setOrderInput(e.target.value)}
                        onKeyDown={handleOrderScan}
                        placeholder="按 Enter 确认"
                        className="text-lg h-14 font-mono"
                      />
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                      <p className="text-muted-foreground">提示：</p>
                      <p>• 扫描订单号（如：SO-2024-001）</p>
                      <p>• 系统将加载待复核清单</p>
                    </div>
                    
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-info" />
                        <div className="text-info-foreground">
                          <p>测试订单号：</p>
                          <p className="font-mono mt-1">SO-2024-001</p>
                          <p className="font-mono">SO-2024-002</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Step 2: 确定出库箱 */}
              {currentStep === "box" && currentOrder && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Box className="w-5 h-5" />
                      确定出库箱
                    </CardTitle>
                    <CardDescription>
                      生成新箱号或扫描已有箱号
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>出库箱号</Label>
                      <div className="flex gap-2">
                        <Input
                          ref={boxInputRef}
                          value={boxInput}
                          onChange={(e) => setBoxInput(e.target.value)}
                          onKeyDown={handleBoxScan}
                          placeholder="扫描箱号或快递单号"
                          className="flex-1 text-lg h-12 font-mono"
                        />
                        <Button onClick={handleGenerateBox} size="lg">
                          <PackagePlus className="w-4 h-4 mr-2" />
                          新箱号
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm text-info-foreground">
                      点击"新箱号"自动生成系统箱号
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Step 3: 扫描复核 */}
              {currentStep === "check" && currentOrder && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scan className="w-5 h-5" />
                      扫描复核
                    </CardTitle>
                    <CardDescription>
                      {batchMode ? "批量扫描：扫描后输入数量" : "逐件扫描：自动+1"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>扫描商品条码</Label>
                      <Input
                        ref={skuInputRef}
                        value={skuInput}
                        onChange={(e) => setSkuInput(e.target.value)}
                        onKeyDown={handleSkuScan}
                        placeholder={batchMode ? "扫描后输入数量" : "扫描自动+1"}
                        className="text-lg h-14 font-mono"
                      />
                    </div>
                    
                    {batchMode && skuInput && (
                      <div className="space-y-2">
                        <Label>输入数量</Label>
                        <Input
                          ref={batchQtyInputRef}
                          type="number"
                          value={batchQty}
                          onChange={(e) => setBatchQty(e.target.value)}
                          onKeyDown={handleBatchQtyInput}
                          placeholder="输入数量后按 Enter"
                          className="text-lg h-14"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant={batchMode ? "default" : "outline"}
                        onClick={() => setBatchMode(!batchMode)}
                        size="sm"
                      >
                        {batchMode ? "批量模式" : "逐件模式"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAnomalyItem(currentOrder.items[0]);
                          setIsAnomalyDialogOpen(true);
                        }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        异常处理
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 订单信息 */}
              {currentOrder && currentStep !== "order" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">订单信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">订单号</span>
                      <span className="font-mono">{currentOrder.orderNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">客户</span>
                      <span>{currentOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">类型</span>
                      <Badge variant="outline">{currentOrder.orderType}</Badge>
                    </div>
                    {currentOrder.priority === "urgent" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">优先级</span>
                        <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                          紧急
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">总件数</span>
                      <span>{currentOrder.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">已复核</span>
                      <span className={currentOrder.checkedItems > 0 ? "text-primary" : ""}>
                        {currentOrder.checkedItems}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">进度</span>
                      <span>
                        {currentOrder.totalItems > 0 
                          ? ((currentOrder.checkedItems / currentOrder.totalItems) * 100).toFixed(0) 
                          : 0}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 出库箱信息 */}
              {currentBox && currentStep === "check" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">出库箱信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">箱号</span>
                      <span className="font-mono">{currentBox}</span>
                    </div>
                    
                    {currentOrder && currentOrder.status === "completed" && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={handlePackingComplete}
                      >
                        <PackageCheck className="w-4 h-4 mr-2" />
                        装箱完成
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* 异常记录 */}
              {anomalyRecords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      异常记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {anomalyRecords.slice(0, 3).map((record, idx) => (
                        <div 
                          key={idx}
                          className="p-2 border rounded-lg bg-warning/5 text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs">{record.sku}</span>
                            <Badge variant="outline" className="text-xs">
                              {record.type === "shortage" ? "缺货" : 
                               record.type === "excess" ? "超量" :
                               record.type === "damage" ? "破损" : "错货"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{record.productName}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* 右侧：复核明细 */}
            <div className="lg:col-span-4 space-y-6">
              {currentOrder ? (
                <>
                  {/* 复核明细表 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>复核明细</CardTitle>
                      <CardDescription>
                        订单 {currentOrder.orderNo} - 共 {currentOrder.items.length} 个SKU
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>SKU</TableHead>
                              <TableHead>产品名称</TableHead>
                              <TableHead>库位</TableHead>
                              <TableHead className="text-right">需求</TableHead>
                              <TableHead className="text-right">已复核</TableHead>
                              <TableHead className="text-center">状态</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentOrder.items.map((item) => (
                              <TableRow 
                                key={item.sku}
                                className={item.status === "checking" ? "bg-primary/5" : ""}
                              >
                                <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>
                                  {item.location && (
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {item.location}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">{item.requiredQty}</TableCell>
                                <TableCell className="text-right">
                                  <span className={item.checkedQty > 0 ? "text-primary" : ""}>
                                    {item.checkedQty}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.status === "completed" ? (
                                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      完成
                                    </Badge>
                                  ) : item.status === "checking" ? (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                      复核中
                                    </Badge>
                                  ) : item.status === "shortage" ? (
                                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                      缺货
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                                      待复核
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* 操作按钮 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={handleReset}>
                          重新开始
                        </Button>
                        
                        <div className="text-sm text-muted-foreground">
                          已复核 {currentOrder.checkedItems} / {currentOrder.totalItems} 件
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg">等待扫描订单</h3>
                      <p className="text-sm text-muted-foreground">
                        请在左侧扫描订单号开始复核作业
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* 已装箱列表 */}
              {packedBoxes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>已装箱列表（今日）</CardTitle>
                    <CardDescription>
                      共 {packedBoxes.length} 箱
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {packedBoxes.slice().reverse().slice(0, 5).map((box, idx) => (
                        <div 
                          key={idx}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-mono text-sm">{box.boxNo}</div>
                              <div className="text-xs text-muted-foreground">{box.createdAt}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {box.weight && (
                                <Badge variant="outline" className="text-xs">
                                  <Scale className="w-3 h-3 mr-1" />
                                  {box.weight}kg
                                </Badge>
                              )}
                              {box.printed ? (
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                                  已打印
                                </Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePrintLabel(box)}
                                >
                                  <Printer className="w-3 h-3 mr-1" />
                                  打印
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {box.items.map((item) => `${item.sku} × ${item.qty}`).join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        
        {/* 单品复核模式 */}
        {checkMode === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* 左侧：操作区 */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    单品快速复核
                  </CardTitle>
                  <CardDescription>
                    {singleModeStep === "wave" 
                      ? "先扫描波次号，限定查找范围" 
                      : `波次 ${singleWaveData?.waveNo} - 扫描商品条码自动匹配订单`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {singleModeStep === "wave" ? (
                    <>
                      {/* 步骤1：扫描波次 */}
                      <div className="space-y-2">
                        <Label>扫描波次号</Label>
                        <Input
                          ref={singleSkuInputRef}
                          value={singleWaveInput}
                          onChange={(e) => setSingleWaveInput(e.target.value)}
                          onKeyDown={handleSingleModeScan}
                          placeholder="扫描波次号（如：WAVE-SINGLE-001）"
                          className="text-xl h-20 font-mono text-center"
                        />
                      </div>
                      
                      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-info-foreground space-y-1">
                            <p>操作流程：</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              <li>先扫描波次号，系统加载该波次的单品订单</li>
                              <li>然后扫描商品条码，在波次内匹配对应订单</li>
                              <li>系统显示匹配的订单信息</li>
                              <li>自动完成复核、生成箱号、打印面单</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="text-muted-foreground mb-2">测试波次号：</p>
                        <p className="font-mono">WAVE-SINGLE-001</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 步骤2：扫描商品 */}
                      <div className="space-y-2">
                        <Label>扫描商品条码</Label>
                        <Input
                          ref={singleSkuInputRef}
                          value={singleSkuInput}
                          onChange={(e) => setSingleSkuInput(e.target.value)}
                          onKeyDown={handleSingleModeScan}
                          placeholder="扫描商品条码自动匹配订单"
                          className="text-xl h-20 font-mono text-center"
                        />
                      </div>
                      
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-success-foreground">
                            波次已加载！扫描商品条码即可自动完成复核
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="text-muted-foreground mb-2">该波次可用条码：</p>
                        <p className="font-mono">6901234567894（无线鼠标）</p>
                        <p className="font-mono">6901234567895（键盘）</p>
                        <p className="font-mono">6901234567896（笔记本支架）</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* 当前波次信息 */}
              {singleWaveData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">当前波次信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">波次号</span>
                      <span className="font-mono">{singleWaveData.waveNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">总订单</span>
                      <span>{singleWaveData.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">单品订单</span>
                      <span className="text-primary">
                        {singleWaveData.orders.filter((o) => o.items.length === 1).length}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        setSingleModeStep("wave");
                        setSingleWaveData(null);
                        setSingleSkuInput("");
                        setSingleWaveInput("");
                      }}
                    >
                      重新选择波次
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* 右侧：统计看板 + 处理记录 */}
            <div className="lg:col-span-4 space-y-6">
              {/* 统计看板 */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>今日已复核</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">{singleModeStats.todayCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>平均耗时</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">{singleModeStats.avgTime}s</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>效率提升</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-success">3.5x</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 处理记录 */}
              {packedBoxes.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>处理记录</CardTitle>
                    <CardDescription>
                      最近 {packedBoxes.length} 笔
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>箱号</TableHead>
                            <TableHead>订单号</TableHead>
                            <TableHead>客户</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>产品名称</TableHead>
                            <TableHead className="text-right">数量</TableHead>
                            <TableHead>处理时间</TableHead>
                            <TableHead className="text-center">状态</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {packedBoxes.slice().reverse().map((box, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono text-sm">{box.boxNo}</TableCell>
                              <TableCell className="font-mono text-sm">{box.orderNo || '-'}</TableCell>
                              <TableCell className="text-sm">{box.customer || '-'}</TableCell>
                              <TableCell className="font-mono text-sm">{box.items[0].sku}</TableCell>
                              <TableCell>{box.items[0].productName}</TableCell>
                              <TableCell className="text-right">{box.items[0].qty}</TableCell>
                              <TableCell className="text-sm">{box.createdAt}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  已完成
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg">等待扫描商品</h3>
                      <p className="text-sm text-muted-foreground">
                        扫描波次号和商品条码即可开始复核
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 异常处理对话框 */}
      <ExceptionDialog
        open={isAnomalyDialogOpen}
        onOpenChange={setIsAnomalyDialogOpen}
        title="异常处理"
        description="登记复核过程中发现的异常情况"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAnomalyDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAnomalySubmit}>
              确认登记
            </Button>
          </>
        }
      >
          {anomalyItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-muted-foreground">SKU</div>
                    <div className="font-mono mt-1">{anomalyItem.sku}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">产品名称</div>
                    <div className="mt-1">{anomalyItem.productName}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">需求数量</div>
                    <div className="mt-1">{anomalyItem.requiredQty}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">已复核</div>
                    <div className="mt-1">{anomalyItem.checkedQty}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>异常类型</Label>
                <Select value={anomalyType} onValueChange={(v) => setAnomalyType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortage">缺货</SelectItem>
                    <SelectItem value="excess">超量</SelectItem>
                    <SelectItem value="damage">破损</SelectItem>
                    <SelectItem value="wrong">错货</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>实际数量</Label>
                <Input
                  type="number"
                  value={anomalyQty}
                  onChange={(e) => setAnomalyQty(e.target.value)}
                  placeholder="输入实际数量"
                />
              </div>
              
              <div className="space-y-2">
                <Label>备注说明</Label>
                <Textarea
                  value={anomalyRemark}
                  onChange={(e) => setAnomalyRemark(e.target.value)}
                  placeholder="描述异常情况..."
                  rows={3}
                />
              </div>
            </div>
          )}
      </ExceptionDialog>
      
      {/* 称重对话框 */}
      <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              称重确认
            </DialogTitle>
            <DialogDescription>
              {pendingBox && `箱号：${pendingBox.boxNo}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>重量（kg）</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="输入重量或跳过"
                />
                <Button variant="outline">
                  <Scale className="w-4 h-4 mr-2" />
                  读取
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <div className="text-muted-foreground mb-2">装箱明细：</div>
              {pendingBox && pendingBox.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.sku} - {item.productName}</span>
                  <span>× {item.qty}</span>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setWeightInput("");
              handleConfirmWeight();
            }}>
              跳过称重
            </Button>
            <Button onClick={handleConfirmWeight}>
              <Printer className="w-4 h-4 mr-2" />
              确认并打印
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WMSLayout>
  );
}
