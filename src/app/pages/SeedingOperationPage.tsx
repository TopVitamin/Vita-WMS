import { useState, useRef, useEffect } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DataTableHeaderRow } from "../components/business";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";
import { 
  Scan, 
  Grid3x3,
  Waves,
  CheckCircle2, 
  AlertCircle, 
  Printer,
  ArrowRight,
  Box,
  Package,
  MapPin,
  Target,
  PackageCheck,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface SeedingOperationPageProps {
  onNavigate?: (path: string) => void;
}

// 订单商品明细
interface OrderItem {
  sku: string;
  productName: string;
  barcode: string;
  plannedQty: number;
  seededQty: number;
}

// 订单数据
interface Order {
  orderNo: string;
  customer: string;
  items: OrderItem[];
  totalItems: number;
  seededItems: number;
  status: "pending" | "seeding" | "completed";
}

// 波次数据
interface Wave {
  waveNo: string;
  waveType: string;
  orderCount: number;
  totalItems: number;
  orders: Order[];
  createdAt: string;
}

// 格口数据
interface Slot {
  row: number;
  col: number;
  slotCode: string;
  shortCode: string;
  order: Order | null;
  status: "idle" | "working" | "completed";
  highlight: boolean;
  targetQty?: number; // 当前SKU需要投放的数量
}

// 播种墙数据
interface SeedingWall {
  wallCode: string;
  wallName: string;
  rows: number;
  cols: number;
  slots: Slot[];
}

// 扫描历史
interface ScanRecord {
  timestamp: string;
  type: "sku" | "slot";
  value: string;
  slotCode?: string;
  qty: number;
  success: boolean;
}

// 模拟波次数据
const mockWaves: Record<string, Wave> = {
  "WAVE-001": {
    waveNo: "WAVE-001",
    waveType: "普通波次",
    orderCount: 6,
    totalItems: 25,
    createdAt: "2024-12-08 09:00:00",
    orders: [
      {
        orderNo: "SO-2024-001",
        customer: "客户A",
        totalItems: 5,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", plannedQty: 2, seededQty: 0 },
          { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", plannedQty: 1, seededQty: 0 },
          { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", plannedQty: 2, seededQty: 0 },
        ],
      },
      {
        orderNo: "SO-2024-002",
        customer: "客户B",
        totalItems: 3,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", plannedQty: 1, seededQty: 0 },
          { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", plannedQty: 2, seededQty: 0 },
        ],
      },
      {
        orderNo: "SO-2024-003",
        customer: "客户C",
        totalItems: 4,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", plannedQty: 3, seededQty: 0 },
          { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", plannedQty: 1, seededQty: 0 },
        ],
      },
      {
        orderNo: "SO-2024-004",
        customer: "客户D",
        totalItems: 5,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", plannedQty: 2, seededQty: 0 },
          { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", plannedQty: 3, seededQty: 0 },
        ],
      },
      {
        orderNo: "SO-2024-005",
        customer: "客户E",
        totalItems: 4,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", plannedQty: 2, seededQty: 0 },
          { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", plannedQty: 2, seededQty: 0 },
        ],
      },
      {
        orderNo: "SO-2024-006",
        customer: "客户F",
        totalItems: 4,
        seededItems: 0,
        status: "pending",
        items: [
          { sku: "SKU-001", productName: "无线蓝牙耳机", barcode: "6901234567890", plannedQty: 1, seededQty: 0 },
          { sku: "SKU-002", productName: "智能手环", barcode: "6901234567891", plannedQty: 2, seededQty: 0 },
          { sku: "SKU-003", productName: "充电宝", barcode: "6901234567892", plannedQty: 1, seededQty: 0 },
        ],
      },
    ],
  },
};

// 模拟播种墙数据
const mockSeedingWalls: Record<string, SeedingWall> = {
  "SW-001": {
    wallCode: "SW-001",
    wallName: "播种墙A区",
    rows: 3,
    cols: 3,
    slots: [],
  },
};

export default function SeedingOperationPage({ onNavigate }: SeedingOperationPageProps) {
  // 步骤状态
  const [currentStep, setCurrentStep] = useState<"wave" | "wall" | "seeding">("wave");
  
  // 波次相关
  const [waveInput, setWaveInput] = useState("");
  const [currentWave, setCurrentWave] = useState<Wave | null>(null);
  
  // 播种墙相关
  const [wallInput, setWallInput] = useState("");
  const [currentWall, setCurrentWall] = useState<SeedingWall | null>(null);
  
  // 扫描相关
  const [skuInput, setSkuInput] = useState("");
  const [slotInput, setSlotInput] = useState("");
  const [currentSKU, setCurrentSKU] = useState<string | null>(null);
  const [targetSlots, setTargetSlots] = useState<Slot[]>([]);
  const [requireSlotVerify, setRequireSlotVerify] = useState(true); // 是否需要扫描格口码校验
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  
  // Dialog状态
  const [isOrderCompleteDialogOpen, setIsOrderCompleteDialogOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  
  // Refs
  const waveInputRef = useRef<HTMLInputElement>(null);
  const wallInputRef = useRef<HTMLInputElement>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);
  const slotInputRef = useRef<HTMLInputElement>(null);
  
  // 自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === "wave" && waveInputRef.current) {
        waveInputRef.current.focus();
      } else if (currentStep === "wall" && wallInputRef.current) {
        wallInputRef.current.focus();
      } else if (currentStep === "seeding" && !currentSKU && skuInputRef.current) {
        skuInputRef.current.focus();
      } else if (currentStep === "seeding" && currentSKU && requireSlotVerify && slotInputRef.current) {
        slotInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, currentSKU, requireSlotVerify]);
  
  // 处理波次扫描
  const handleWaveScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && waveInput.trim()) {
      const input = waveInput.trim().toUpperCase();
      const foundWave = mockWaves[input];
      
      if (foundWave) {
        setCurrentWave(foundWave);
        setCurrentStep("wall");
        toast.success(`波次 ${foundWave.waveNo} 绑定成功`);
      } else {
        toast.error("未找到匹配的波次");
      }
      setWaveInput("");
    }
  };
  
  // 处理播种墙扫描
  const handleWallScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && wallInput.trim() && currentWave) {
      const input = wallInput.trim().toUpperCase();
      const foundWall = mockSeedingWalls[input];
      
      if (foundWall) {
        // 初始化播种墙格口
        const slots: Slot[] = [];
        let orderIndex = 0;
        
        for (let row = 1; row <= foundWall.rows; row++) {
          for (let col = 1; col <= foundWall.cols; col++) {
            const slotCode = `${foundWall.wallCode}-${String(row).padStart(2, '0')}-${String(col).padStart(2, '0')}`;
            const shortCode = `${row}${col}`;
            
            // 分配订单到格口
            const order = orderIndex < currentWave.orders.length ? currentWave.orders[orderIndex] : null;
            if (order) orderIndex++;
            
            slots.push({
              row,
              col,
              slotCode,
              shortCode,
              order,
              status: order ? "working" : "idle",
              highlight: false,
            });
          }
        }
        
        setCurrentWall({ ...foundWall, slots });
        setCurrentStep("seeding");
        toast.success(`播种墙 ${foundWall.wallCode} 绑定成功，已分配 ${orderIndex} 个订单到格口`);
      } else {
        toast.error("未找到匹配的播种墙");
      }
      setWallInput("");
    }
  };
  
  // 处理SKU扫描
  const handleSKUScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skuInput.trim() && currentWave && currentWall) {
      const input = skuInput.trim();
      
      // 查找哪些格口需要这个SKU
      const targets: Slot[] = [];
      
      currentWall.slots.forEach((slot) => {
        if (slot.order && slot.status === "working") {
          const item = slot.order.items.find(
            (item) => 
              item.sku.toLowerCase() === input.toLowerCase() || 
              item.barcode.toLowerCase() === input.toLowerCase()
          );
          
          if (item && item.seededQty < item.plannedQty) {
            const remainingQty = item.plannedQty - item.seededQty;
            targets.push({ ...slot, targetQty: remainingQty });
          }
        }
      });
      
      if (targets.length > 0) {
        // 高亮目标格口
        setCurrentWall({
          ...currentWall,
          slots: currentWall.slots.map((slot) => ({
            ...slot,
            highlight: targets.some((t) => t.slotCode === slot.slotCode),
            targetQty: targets.find((t) => t.slotCode === slot.slotCode)?.targetQty,
          })),
        });
        
        setCurrentSKU(input);
        setTargetSlots(targets);
        setSkuInput("");
        
        toast.success(`识别SKU成功，需投放 ${targets.length} 个格口`);
      } else {
        toast.error("当前波次中没有订单需要该SKU，或已全部播种完成");
        setSkuInput("");
      }
    }
  };
  
  // 处理格口扫描确认
  const handleSlotScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && slotInput.trim() && currentSKU && currentWall && currentWave) {
      const input = slotInput.trim();
      
      // 查找匹配的格口（支持完整编码或短码）
      const targetSlot = currentWall.slots.find(
        (slot) => 
          slot.slotCode.toLowerCase() === input.toLowerCase() || 
          slot.shortCode.toLowerCase() === input.toLowerCase()
      );
      
      if (!targetSlot) {
        toast.error("格口编码不存在");
        setSlotInput("");
        return;
      }
      
      if (!targetSlot.highlight) {
        toast.error("该格口不需要当前SKU");
        setSlotInput("");
        return;
      }
      
      // 执行播种
      performSeeding(targetSlot);
      setSlotInput("");
    }
  };
  
  // 执行播种（无需扫描格口码时直接调用）
  const performSeeding = (slot: Slot) => {
    if (!currentSKU || !currentWave || !currentWall || !slot.order) return;
    
    // 找到对应的商品项
    const item = slot.order.items.find(
      (item) => 
        item.sku.toLowerCase() === currentSKU.toLowerCase() || 
        item.barcode.toLowerCase() === currentSKU.toLowerCase()
    );
    
    if (!item) return;
    
    // 更新播种数量
    const newSeededQty = item.seededQty + 1;
    
    // 更新波次数据
    const updatedOrders = currentWave.orders.map((order) => {
      if (order.orderNo === slot.order!.orderNo) {
        const updatedItems = order.items.map((i) =>
          i.sku === item.sku ? { ...i, seededQty: newSeededQty } : i
        );
        const seededItems = updatedItems.reduce((sum, i) => sum + i.seededQty, 0);
        const isCompleted = updatedItems.every((i) => i.seededQty >= i.plannedQty);
        
        return {
          ...order,
          items: updatedItems,
          seededItems,
          status: isCompleted ? "completed" as const : "seeding" as const,
        };
      }
      return order;
    });
    
    setCurrentWave({ ...currentWave, orders: updatedOrders });
    
    // 更新播种墙格口
    const updatedSlots = currentWall.slots.map((s) => {
      if (s.slotCode === slot.slotCode) {
        const updatedOrder = updatedOrders.find((o) => o.orderNo === slot.order!.orderNo);
        return {
          ...s,
          order: updatedOrder!,
          status: updatedOrder!.status === "completed" ? "completed" as const : "working" as const,
        };
      }
      return s;
    });
    
    setCurrentWall({ ...currentWall, slots: updatedSlots });
    
    // 添加扫描历史
    setScanHistory([
      {
        timestamp: new Date().toLocaleTimeString("zh-CN"),
        type: "slot",
        value: currentSKU,
        slotCode: slot.slotCode,
        qty: 1,
        success: true,
      },
      ...scanHistory,
    ]);
    
    toast.success(`${slot.slotCode} 播种成功，${item.sku} +1`);
    
    // 检查是否还有其他格口需要这个SKU
    const remainingTargets = updatedSlots.filter(
      (s) => 
        s.highlight && 
        s.slotCode !== slot.slotCode &&
        s.order?.items.some((i) => 
          (i.sku === item.sku || i.barcode === currentSKU) && 
          i.seededQty < i.plannedQty
        )
    );
    
    if (remainingTargets.length === 0) {
      // 当前SKU已全部播种完成
      setCurrentSKU(null);
      setTargetSlots([]);
      setCurrentWall({
        ...currentWall,
        slots: updatedSlots.map((s) => ({ ...s, highlight: false, targetQty: undefined })),
      });
      toast.info("当前SKU已全部播种完成，请扫描下一个SKU");
    } else {
      // 更新高亮状态
      setCurrentWall({
        ...currentWall,
        slots: updatedSlots.map((s) => ({
          ...s,
          highlight: remainingTargets.some((t) => t.slotCode === s.slotCode),
        })),
      });
      setTargetSlots(remainingTargets);
    }
    
    // 检查订单是否完成
    const completedOrderData = updatedOrders.find((o) => 
      o.orderNo === slot.order!.orderNo && o.status === "completed"
    );
    
    if (completedOrderData && slot.order!.status !== "completed") {
      setCompletedOrder(completedOrderData);
      setIsOrderCompleteDialogOpen(true);
    }
  };
  
  // 手动选择格口投放（不需要扫描码时）
  const handleSlotClick = (slot: Slot) => {
    if (!currentSKU || !slot.highlight) return;
    
    if (requireSlotVerify) {
      toast.warning("请扫描格口短码进行确认");
      return;
    }
    
    performSeeding(slot);
  };
  
  // 重置流程
  const handleReset = () => {
    setCurrentStep("wave");
    setCurrentWave(null);
    setCurrentWall(null);
    setWaveInput("");
    setWallInput("");
    setSkuInput("");
    setSlotInput("");
    setCurrentSKU(null);
    setTargetSlots([]);
    setScanHistory([]);
  };
  
  // 计算播种进度
  const getWaveProgress = () => {
    if (!currentWave) return 0;
    const totalPlanned = currentWave.orders.reduce(
      (sum, order) => sum + order.totalItems,
      0
    );
    const totalSeeded = currentWave.orders.reduce(
      (sum, order) => sum + order.seededItems,
      0
    );
    return totalPlanned > 0 ? (totalSeeded / totalPlanned) * 100 : 0;
  };
  
  const getCompletedOrderCount = () => {
    return currentWave?.orders.filter((o) => o.status === "completed").length || 0;
  };
  
  return (
    <WMSLayout title="图形化波次播种" currentPath="/outbound/seeding" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* 步骤指示器 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${currentStep === "wave" ? "text-primary" : currentWave ? "text-success" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "wave" ? "bg-primary text-primary-foreground" : currentWave ? "bg-success text-success-foreground" : "bg-muted"}`}>
                  {currentWave ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <div>
                  <div className="text-sm">绑定波次</div>
                  <div className="text-xs text-muted-foreground">扫描波次号</div>
                </div>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              
              <div className={`flex items-center gap-3 ${currentStep === "wall" ? "text-primary" : currentWall ? "text-success" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "wall" ? "bg-primary text-primary-foreground" : currentWall ? "bg-success text-success-foreground" : "bg-muted"}`}>
                  {currentWall ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <div>
                  <div className="text-sm">绑定播种墙</div>
                  <div className="text-xs text-muted-foreground">扫描墙编码</div>
                </div>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              
              <div className={`flex items-center gap-3 ${currentStep === "seeding" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "seeding" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  3
                </div>
                <div>
                  <div className="text-sm">扫描播种</div>
                  <div className="text-xs text-muted-foreground">SKU → 格口</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* 左侧：操作控制台 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: 绑定波次 */}
            {currentStep === "wave" && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-5 h-5" />
                    绑定波次
                  </CardTitle>
                  <CardDescription>
                    扫描或输入波次号
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>波次号</Label>
                    <Input
                      ref={waveInputRef}
                      value={waveInput}
                      onChange={(e) => setWaveInput(e.target.value)}
                      onKeyDown={handleWaveScan}
                      placeholder="按 Enter 确认"
                      className="text-lg h-12"
                    />
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                    <p className="text-muted-foreground">提示：</p>
                    <p>• 扫描波次号（如：WAVE-001）</p>
                    <p>• 系统将加载波次订单明细</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: 绑定播种墙 */}
            {currentStep === "wall" && currentWave && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5" />
                    绑定播种墙
                  </CardTitle>
                  <CardDescription>
                    扫描或输入播种墙编码
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>播种墙编码</Label>
                    <Input
                      ref={wallInputRef}
                      value={wallInput}
                      onChange={(e) => setWallInput(e.target.value)}
                      onKeyDown={handleWallScan}
                      placeholder="例如：SW-001"
                      className="text-lg h-12"
                    />
                  </div>
                  
                  <div className="rounded-lg border border-info/20 bg-info/10 p-3 text-sm text-info-700">
                    系统将自动分配 {currentWave.orderCount} 个订单到播种墙格口
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: 扫描播种 */}
            {currentStep === "seeding" && currentWall && (
              <>
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scan className="w-5 h-5" />
                      扫描播种
                    </CardTitle>
                    <CardDescription>
                      {currentSKU ? "扫描格口短码确认投放" : "扫描商品条码"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!currentSKU ? (
                      <>
                        <div className="space-y-2">
                          <Label>扫描SKU条码</Label>
                          <Input
                            ref={skuInputRef}
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            onKeyDown={handleSKUScan}
                            placeholder="扫描产品条码"
                            className="text-lg h-14 font-mono"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-primary mb-3">
                            <Target className="w-4 h-4" />
                            <span>当前SKU：{currentSKU}</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>需投放格口：{targetSlots.length} 个</p>
                            <p className="text-muted-foreground">
                              {targetSlots.map((s) => s.shortCode).join(", ")}
                            </p>
                          </div>
                        </div>
                        
                        {requireSlotVerify ? (
                          <div className="space-y-2">
                            <Label>扫描格口短码</Label>
                            <Input
                              ref={slotInputRef}
                              value={slotInput}
                              onChange={(e) => setSlotInput(e.target.value)}
                              onKeyDown={handleSlotScan}
                              placeholder="扫描格口上的短码"
                              className="text-lg h-14 font-mono"
                            />
                          </div>
                        ) : (
                          <div className="rounded-lg border border-info/20 bg-info/10 p-3 text-sm text-info-700">
                            点击右侧高亮格口进行投放
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setCurrentSKU(null);
                            setTargetSlots([]);
                            setCurrentWall({
                              ...currentWall,
                              slots: currentWall.slots.map((s) => ({ ...s, highlight: false, targetQty: undefined })),
                            });
                          }}
                        >
                          取消当前SKU
                        </Button>
                      </>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="verify"
                        checked={requireSlotVerify}
                        onCheckedChange={(checked) => setRequireSlotVerify(checked as boolean)}
                      />
                      <Label htmlFor="verify" className="text-sm cursor-pointer">
                        需要扫描格口短码校验
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 扫描历史 */}
                {scanHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">播种历史（最近5条）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {scanHistory.slice(0, 5).map((record, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between text-sm p-2 rounded bg-success/10"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-success" />
                              <span className="font-mono text-xs">{record.slotCode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{record.value}</span>
                              <Badge variant="outline" className="text-xs">
                                +{record.qty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
            
            {/* 波次信息卡片 */}
            {currentWave && currentStep !== "wave" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">波次信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">波次号</span>
                    <span className="font-mono">{currentWave.waveNo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">订单数</span>
                    <span>{getCompletedOrderCount()} / {currentWave.orderCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">总商品数</span>
                    <span>{currentWave.totalItems}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">播种进度</span>
                      <span>{getWaveProgress().toFixed(1)}%</span>
                    </div>
                    <Progress value={getWaveProgress()} />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 播种墙信息卡片 */}
            {currentWall && currentStep === "seeding" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">播种墙信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">墙编码</span>
                    <span className="font-mono">{currentWall.wallCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">墙名称</span>
                    <span>{currentWall.wallName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">规格</span>
                    <span>{currentWall.rows} 行 × {currentWall.cols} 列</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总格口</span>
                    <span>{currentWall.slots.length}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* 右侧：可视化播种墙 */}
          <div className="lg:col-span-5 space-y-6">
            {currentWall && currentStep === "seeding" ? (
              <>
                {/* 播种墙可视化 */}
                <Card>
                  <CardHeader>
                    <CardTitle>播种墙可视化</CardTitle>
                    <CardDescription>
                      {currentSKU ? (
                        <span className="text-primary">高亮格口需要投放当前SKU</span>
                      ) : (
                        <span>扫描SKU后将高亮显示目标格口</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 图例 */}
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-muted rounded"></div>
                          <span className="text-muted-foreground">空闲</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-warning/20 border-2 border-warning rounded"></div>
                          <span className="text-muted-foreground">作业中</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-success/20 border-2 border-success rounded"></div>
                          <span className="text-muted-foreground">已完成</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary animate-pulse rounded"></div>
                          <span className="text-muted-foreground">需投放</span>
                        </div>
                      </div>
                      
                      {/* 播种墙格子 */}
                      <div className="border-2 border-border rounded-lg p-6 bg-muted/5">
                        <div 
                          className="grid gap-4"
                          style={{
                            gridTemplateColumns: `repeat(${currentWall.cols}, 1fr)`,
                          }}
                        >
                          {currentWall.slots.map((slot) => {
                            const progressPercent = slot.order 
                              ? (slot.order.seededItems / slot.order.totalItems) * 100 
                              : 0;
                            
                            return (
                              <div
                                key={slot.slotCode}
                                onClick={() => handleSlotClick(slot)}
                                className={`
                                  relative border-2 rounded-lg p-4 transition-all cursor-pointer
                                  ${slot.highlight 
                                    ? 'bg-primary/20 border-primary shadow-lg animate-pulse' 
                                    : slot.status === 'completed'
                                    ? 'bg-success/10 border-success'
                                    : slot.status === 'working'
                                    ? 'bg-warning/10 border-warning'
                                    : 'bg-muted border-muted-foreground/20'
                                  }
                                  ${slot.highlight && !requireSlotVerify ? 'hover:bg-primary/30' : ''}
                                `}
                              >
                                {/* 格口短码 */}
                                <div className="absolute top-1 left-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-1.5 py-0.5 ${
                                      slot.highlight ? 'bg-primary text-primary-foreground border-primary' : ''
                                    }`}
                                  >
                                    {slot.shortCode}
                                  </Badge>
                                </div>
                                
                                {/* 状态图标 */}
                                {slot.status === 'completed' && (
                                  <div className="absolute top-1 right-1">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                  </div>
                                )}
                                
                                {/* 订单信息 */}
                                {slot.order ? (
                                  <div className="mt-4 space-y-2">
                                    <div className="font-mono text-sm">{slot.order.orderNo}</div>
                                    <div className="text-xs text-muted-foreground">{slot.order.customer}</div>
                                    
                                    {/* 进度 */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>{slot.order.seededItems}/{slot.order.totalItems}</span>
                                        <span>{progressPercent.toFixed(0)}%</span>
                                      </div>
                                      <Progress value={progressPercent} className="h-1.5" />
                                    </div>
                                    
                                    {/* 目标数量提示 */}
                                    {slot.highlight && slot.targetQty && (
                                      <div className="mt-2 p-2 bg-primary/30 rounded text-center">
                                        <div className="text-primary text-lg">
                                          +{slot.targetQty}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-4 text-center text-muted-foreground text-sm">
                                    空闲
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 订单明细表 */}
                <Card>
                  <CardHeader>
                    <CardTitle>订单播种明细</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <DataTableHeaderRow>
                            <TableHead>格口</TableHead>
                            <TableHead>订单号</TableHead>
                            <TableHead>客户</TableHead>
                            <TableHead className="text-right">总件数</TableHead>
                            <TableHead className="text-right">已播种</TableHead>
                            <TableHead className="text-right">进度</TableHead>
                            <TableHead className="text-center">状态</TableHead>
                          </DataTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {currentWall.slots
                            .filter((slot) => slot.order)
                            .map((slot) => {
                              const progress = (slot.order!.seededItems / slot.order!.totalItems) * 100;
                              return (
                                <TableRow key={slot.slotCode}>
                                  <TableCell>
                                    <Badge variant="outline">{slot.shortCode}</Badge>
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {slot.order!.orderNo}
                                  </TableCell>
                                  <TableCell>{slot.order!.customer}</TableCell>
                                  <TableCell className="text-right">{slot.order!.totalItems}</TableCell>
                                  <TableCell className="text-right">
                                    <span className={slot.order!.seededItems > 0 ? "text-primary" : ""}>
                                      {slot.order!.seededItems}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">{progress.toFixed(0)}%</TableCell>
                                  <TableCell className="text-center">
                                    {slot.status === "completed" ? (
                                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                        已完成
                                      </Badge>
                                    ) : slot.order!.seededItems > 0 ? (
                                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                        播种中
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                                        待播种
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : currentWave && currentStep === "wall" ? (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Grid3x3 className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg">等待绑定播种墙</h3>
                    <p className="text-sm text-muted-foreground">
                      请在左侧扫描播种墙编码
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Waves className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg">等待绑定波次</h3>
                    <p className="text-sm text-muted-foreground">
                      请在左侧扫描波次号开始播种作业
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* 底部操作栏 */}
        {currentWave && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新开始
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  提示：播种完成的订单将自动弹窗提示，可打印装箱清单和标签
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* 订单完成对话框 */}
      <Dialog open={isOrderCompleteDialogOpen} onOpenChange={setIsOrderCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-success" />
              订单播种完成
            </DialogTitle>
            <DialogDescription>
              以下订单已完成播种，可以打印装箱清单和标签
            </DialogDescription>
          </DialogHeader>
          
          {completedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">订单号</div>
                  <div className="font-mono mt-1">{completedOrder.orderNo}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">客户</div>
                  <div className="mt-1">{completedOrder.customer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">总件数</div>
                  <div className="mt-1">{completedOrder.totalItems}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">已播种</div>
                  <div className="text-success mt-1">{completedOrder.seededItems}</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 bg-muted/30 max-h-40 overflow-y-auto">
                <div className="text-sm space-y-1">
                  <div className="text-muted-foreground mb-2">商品明细：</div>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.sku} - {item.productName}</span>
                      <span>× {item.plannedQty}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-sm text-success-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>播种完成！格口将在打印后自动释放，可继续下一波次作业</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOrderCompleteDialogOpen(false);
                setCompletedOrder(null);
              }}
            >
              稍后处理
            </Button>
            <Button onClick={() => {
              toast.success("装箱清单打印任务已发送");
              setTimeout(() => {
                toast.success("装箱标签打印任务已发送");
              }, 500);
              setIsOrderCompleteDialogOpen(false);
              setCompletedOrder(null);
            }}>
              <Printer className="w-4 h-4 mr-2" />
              打印清单 & 标签
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WMSLayout>
  );
}
