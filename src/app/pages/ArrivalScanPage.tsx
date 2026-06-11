import { useState, useRef, useEffect } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, OperationLogList, QuantityProgress, ScanInputPanel, WorkflowPageLayout, WorkflowStepBar } from "../components/business";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { 
  Scan, 
  Package, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Printer,
  RotateCcw,
  Plus,
  Box,
  Trash2,
  FileText,
  Truck,
  PackageCheck,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface ArrivalScanPageProps {
  onNavigate?: (path: string) => void;
}

// ASN数据结构
interface ASNItem {
  sku: string;
  productName: string;
  barcode: string;
  spec: string;
  plannedQty: number;
  scannedQty: number;
}

interface ASN {
  id: string;
  asnNo: string;
  referenceNo: string;
  trackingNo: string;
  customer: string;
  estimatedDate: string;
  items: ASNItem[];
}

// 容器数据结构
interface Container {
  containerNo: string;
  containerType: string;
  location: string;
  scannedItems: {
    sku: string;
    productName: string;
    qty: number;
    scanTime: string;
  }[];
  totalQty: number;
  createdAt: string;
}

// 扫描历史
interface ScanHistory {
  timestamp: string;
  type: "sku" | "container" | "location";
  value: string;
  qty: number;
  success: boolean;
}

// 模拟ASN数据
const mockASNData: Record<string, ASN> = {
  "ASN-2024-001": {
    id: "1",
    asnNo: "ASN-2024-001",
    referenceNo: "REF-2024-1201",
    trackingNo: "SF1234567890",
    customer: "ab00-HK买汇",
    estimatedDate: "2024-12-08",
    items: [
      {
        sku: "SKU-001",
        productName: "无线蓝牙耳机",
        barcode: "6901234567890",
        spec: "黑色/标准版",
        plannedQty: 100,
        scannedQty: 0,
      },
      {
        sku: "SKU-002",
        productName: "智能手环",
        barcode: "6901234567891",
        spec: "运动版/蓝色",
        plannedQty: 50,
        scannedQty: 0,
      },
      {
        sku: "SKU-003",
        productName: "充电宝",
        barcode: "6901234567892",
        spec: "20000mAh",
        plannedQty: 80,
        scannedQty: 0,
      },
    ],
  },
  "SF1234567890": {
    id: "1",
    asnNo: "ASN-2024-001",
    referenceNo: "REF-2024-1201",
    trackingNo: "SF1234567890",
    customer: "ab00-HK买汇",
    estimatedDate: "2024-12-08",
    items: [
      {
        sku: "SKU-001",
        productName: "无线蓝牙耳机",
        barcode: "6901234567890",
        spec: "黑色/标准版",
        plannedQty: 100,
        scannedQty: 0,
      },
      {
        sku: "SKU-002",
        productName: "智能手环",
        barcode: "6901234567891",
        spec: "运动版/蓝色",
        plannedQty: 50,
        scannedQty: 0,
      },
      {
        sku: "SKU-003",
        productName: "充电宝",
        barcode: "6901234567892",
        spec: "20000mAh",
        plannedQty: 80,
        scannedQty: 0,
      },
    ],
  },
};

// 库位数据
const mockLocations = [
  { code: "RCV-STAGING", name: "收货暂存区（默认）" },
  { code: "RCV-01", name: "收货区1号位" },
  { code: "RCV-02", name: "收货区2号位" },
  { code: "QC-AREA", name: "质检区" },
];

// 生成容器编号
const generateContainerNo = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `PLT-${timestamp}`;
};

export default function ArrivalScanPage({ onNavigate }: ArrivalScanPageProps) {
  // 步骤状态
  const [currentStep, setCurrentStep] = useState<"asn" | "container" | "location" | "scan">("asn");
  
  // ASN相关
  const [asnInput, setAsnInput] = useState("");
  const [currentASN, setCurrentASN] = useState<ASN | null>(null);
  
  // 容器相关
  const [containerInput, setContainerInput] = useState("");
  const [containerType, setContainerType] = useState("托盘");
  const [currentContainer, setCurrentContainer] = useState<Container | null>(null);
  const [completedContainers, setCompletedContainers] = useState<Container[]>([]);
  
  // 库位相关
  const [selectedLocation, setSelectedLocation] = useState("RCV-STAGING");
  
  // 扫描相关
  const [scanInput, setScanInput] = useState("");
  const [scanMode, setScanMode] = useState<"single" | "batch">("single");
  const [qtyInput, setQtyInput] = useState("");
  const [pendingSKU, setPendingSKU] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  
  // Dialog状态
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  // Refs
  const asnInputRef = useRef<HTMLInputElement>(null);
  const containerInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);
  
  // 自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === "asn" && asnInputRef.current) {
        asnInputRef.current.focus();
      } else if (currentStep === "container" && containerInputRef.current) {
        containerInputRef.current.focus();
      } else if (currentStep === "scan" && scanInputRef.current) {
        scanInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  // 处理ASN扫描
  const handleASNScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && asnInput.trim()) {
      const input = asnInput.trim().toUpperCase();
      const foundASN = mockASNData[input];
      
      if (foundASN) {
        setCurrentASN({
          ...foundASN,
          items: foundASN.items.map(item => ({ ...item, scannedQty: 0 }))
        });
        setCurrentStep("container");
        toast.success(`ASN ${foundASN.asnNo} 定位成功`);
      } else {
        toast.error("未找到匹配的ASN，请检查单号/物流单号");
      }
      setAsnInput("");
    }
  };
  
  // 自动生成容器
  const handleAutoGenerateContainer = () => {
    const containerNo = generateContainerNo();
    setContainerInput(containerNo);
    toast.success(`自动生成容器编号：${containerNo}`);
  };
  
  // 绑定容器
  const handleBindContainer = () => {
    if (!containerInput.trim()) {
      toast.error("请输入或生成容器编号");
      return;
    }
    
    const newContainer: Container = {
      containerNo: containerInput.trim(),
      containerType,
      location: selectedLocation,
      scannedItems: [],
      totalQty: 0,
      createdAt: new Date().toLocaleString("zh-CN"),
    };
    
    setCurrentContainer(newContainer);
    setCurrentStep("location");
    toast.success(`容器 ${containerInput} 绑定成功`);
  };
  
  // 确认库位
  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      toast.error("请选择收货库位");
      return;
    }
    
    if (currentContainer) {
      setCurrentContainer({ ...currentContainer, location: selectedLocation });
      setCurrentStep("scan");
      toast.success(`库位 ${selectedLocation} 确认成功，开始扫描SKU`);
    }
  };
  
  // 处理SKU扫描
  const handleSKUScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && scanInput.trim() && currentASN && currentContainer) {
      const input = scanInput.trim();
      
      // 查找匹配的SKU
      const matchedItem = currentASN.items.find(
        item => item.sku.toLowerCase() === input.toLowerCase() || 
                item.barcode.toLowerCase() === input.toLowerCase()
      );
      
      if (matchedItem) {
        // 逐件扫描模式：直接+1
        if (scanMode === "single") {
          const qty = 1;
          const newScannedQty = matchedItem.scannedQty + qty;
          
          // 检查是否超量
          if (newScannedQty > matchedItem.plannedQty) {
            toast.error(`${matchedItem.sku} 扫描数量超出计划数量，已拒绝`);
            setScanInput("");
            return;
          }
          
          // 更新数据并清空输入
          updateScannedData(matchedItem, qty);
          setScanInput("");
        } 
        // 批量扫描模式：等待输入数量
        else {
          setPendingSKU(matchedItem.sku);
          setScanInput("");
          toast.info(`已识别 ${matchedItem.sku}，请输入数量`);
          // 聚焦数量输入框
          setTimeout(() => {
            qtyInputRef.current?.focus();
          }, 100);
        }
      } else {
        toast.error("未找到匹配的SKU或条形码");
        setScanHistory([
          {
            timestamp: new Date().toLocaleTimeString("zh-CN"),
            type: "sku",
            value: input,
            qty: 0,
            success: false,
          },
          ...scanHistory,
        ]);
        setScanInput("");
      }
    }
  };
  
  // 处理批量数量输入
  const handleQtyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && qtyInput.trim() && pendingSKU && currentASN && currentContainer) {
      const qty = parseInt(qtyInput);
      
      if (isNaN(qty) || qty <= 0) {
        toast.error("请输入有效的数量");
        return;
      }
      
      // 找到对应的SKU
      const matchedItem = currentASN.items.find(item => item.sku === pendingSKU);
      if (!matchedItem) {
        toast.error("SKU数据异常");
        setPendingSKU(null);
        setQtyInput("");
        return;
      }
      
      const newScannedQty = matchedItem.scannedQty + qty;
      
      // 检查是否超量
      if (newScannedQty > matchedItem.plannedQty) {
        toast.error(`${matchedItem.sku} 扫描数量超出计划数量，已拒绝`);
        setPendingSKU(null);
        setQtyInput("");
        // 返回SKU输入框
        setTimeout(() => {
          scanInputRef.current?.focus();
        }, 100);
        return;
      }
      
      // 更新数据
      updateScannedData(matchedItem, qty);
      
      // 清空状态
      setPendingSKU(null);
      setQtyInput("");
      
      // 返回SKU输入框
      setTimeout(() => {
        scanInputRef.current?.focus();
      }, 100);
    }
  };
  
  // 更新扫描数据的通用方法
  const updateScannedData = (matchedItem: ASNItem, qty: number) => {
    // 更新ASN中的已扫描数量
    setCurrentASN({
      ...currentASN!,
      items: currentASN!.items.map(item =>
        item.sku === matchedItem.sku
          ? { ...item, scannedQty: item.scannedQty + qty }
          : item
      ),
    });
    
    // 更新当前容器
    const existingItem = currentContainer!.scannedItems.find(
      si => si.sku === matchedItem.sku
    );
    
    if (existingItem) {
      setCurrentContainer({
        ...currentContainer!,
        scannedItems: currentContainer!.scannedItems.map(si =>
          si.sku === matchedItem.sku
            ? { ...si, qty: si.qty + qty }
            : si
        ),
        totalQty: currentContainer!.totalQty + qty,
      });
    } else {
      setCurrentContainer({
        ...currentContainer!,
        scannedItems: [
          ...currentContainer!.scannedItems,
          {
            sku: matchedItem.sku,
            productName: matchedItem.productName,
            qty,
            scanTime: new Date().toLocaleTimeString("zh-CN"),
          },
        ],
        totalQty: currentContainer!.totalQty + qty,
      });
    }
    
    // 添加扫描历史
    setScanHistory([
      {
        timestamp: new Date().toLocaleTimeString("zh-CN"),
        type: "sku",
        value: matchedItem.sku,
        qty,
        success: true,
      },
      ...scanHistory,
    ]);
    
    toast.success(`${matchedItem.sku} 收货成功，数量 +${qty}`);
    
    // 检查是否满箱（假设满箱阈值为50）
    if (currentContainer!.totalQty + qty >= 50) {
      toast.warning("容器即将满箱，建议确认收货");
    }
  };
  
  // 撤销上次扫描
  const handleUndoLastScan = () => {
    if (!currentASN || !currentContainer || scanHistory.length === 0) {
      toast.error("没有可撤销的扫描记录");
      return;
    }
    
    const lastScan = scanHistory[0];
    if (!lastScan.success) {
      toast.error("上次扫描失败，无需撤销");
      return;
    }
    
    // 找到对应的SKU
    const matchedItem = currentASN.items.find(item => item.sku === lastScan.value);
    if (!matchedItem) return;
    
    // 更新ASN数量
    setCurrentASN({
      ...currentASN,
      items: currentASN.items.map(item =>
        item.sku === matchedItem.sku
          ? { ...item, scannedQty: Math.max(0, item.scannedQty - lastScan.qty) }
          : item
      ),
    });
    
    // 更新容器数量
    const containerItem = currentContainer.scannedItems.find(si => si.sku === matchedItem.sku);
    if (containerItem) {
      if (containerItem.qty <= lastScan.qty) {
        // 移除该项
        setCurrentContainer({
          ...currentContainer,
          scannedItems: currentContainer.scannedItems.filter(si => si.sku !== matchedItem.sku),
          totalQty: currentContainer.totalQty - lastScan.qty,
        });
      } else {
        // 减少数量
        setCurrentContainer({
          ...currentContainer,
          scannedItems: currentContainer.scannedItems.map(si =>
            si.sku === matchedItem.sku
              ? { ...si, qty: si.qty - lastScan.qty }
              : si
          ),
          totalQty: currentContainer.totalQty - lastScan.qty,
        });
      }
    }
    
    // 移除历史记录
    setScanHistory(scanHistory.slice(1));
    toast.success(`已撤销 ${matchedItem.sku} 的扫描，数量 -${lastScan.qty}`);
  };
  
  // 确认收货
  const handleConfirmReceive = () => {
    if (!currentContainer || currentContainer.totalQty === 0) {
      toast.error("当前容器无扫描数据，无法确认收货");
      return;
    }
    
    setIsConfirmDialogOpen(true);
  };
  
  // 执行确认收货
  const executeConfirmReceive = () => {
    if (!currentContainer) return;
    
    // 保存已完成容器
    setCompletedContainers([...completedContainers, currentContainer]);
    
    // 检查ASN是否全部完成
    const allCompleted = currentASN?.items.every(item => item.scannedQty >= item.plannedQty);
    
    toast.success(
      `容器 ${currentContainer.containerNo} 收货成功！共 ${currentContainer.totalQty} 件`
    );
    
    if (allCompleted) {
      toast.success(`ASN ${currentASN?.asnNo} 已全部收货完成！`);
    }
    
    setIsConfirmDialogOpen(false);
    
    // 询问是否继续
    if (!allCompleted) {
      // 重置容器，继续扫描
      setCurrentContainer(null);
      setContainerInput("");
      setCurrentStep("container");
      setScanHistory([]);
    } else {
      // 全部完成，返回第一步
      handleReset();
    }
  };
  
  // 重置流程
  const handleReset = () => {
    setCurrentStep("asn");
    setCurrentASN(null);
    setCurrentContainer(null);
    setCompletedContainers([]);
    setAsnInput("");
    setContainerInput("");
    setSelectedLocation("RCV-STAGING");
    setScanInput("");
    setScanHistory([]);
  };
  
  // 计算统计数据
  const getTotalScanned = () => {
    return currentASN?.items.reduce((sum, item) => sum + item.scannedQty, 0) || 0;
  };
  
  const getTotalPlanned = () => {
    return currentASN?.items.reduce((sum, item) => sum + item.plannedQty, 0) || 0;
  };
  
  const operationLogs = scanHistory.slice(0, 5).map((record, idx) => ({
    id: `${record.timestamp}-${idx}`,
    time: record.timestamp,
    action: record.success ? "扫描成功" : "扫描异常",
    detail: `${record.value}${record.success ? `，数量 +${record.qty}` : ""}`,
  }));
  
  return (
    <WMSLayout title="到仓扫描" currentPath="/inbound/arrival-scan" onNavigate={onNavigate}>
      <WorkflowPageLayout
        title="到仓扫描"
        description="按 ASN、容器、库位、SKU 条码推进收货作业。"
        steps={
          <WorkflowStepBar
            currentStepId={currentStep}
            steps={[
              { id: "asn", label: "定位ASN", description: "扫描单号" },
              { id: "container", label: "绑定容器", description: "托盘/周转箱" },
              { id: "location", label: "指定库位", description: "收货位置" },
              { id: "scan", label: "扫描货物", description: "SKU条码" },
            ]}
          />
        }
      >
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* 左侧：扫描操作区 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Step 1: ASN定位 */}
            {currentStep === "asn" && (
              <Card className="border-primary flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    扫描ASN单号
                  </CardTitle>
                  <CardDescription>
                    支持扫描ASN单号、箱号或物流单号
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <ScanInputPanel
                    label="扫描或输入单号"
                    value={asnInput}
                    inputRef={asnInputRef}
                    onChange={setAsnInput}
                    onEnter={handleASNScan}
                    placeholder="按 Enter 确认"
                  />
                  
                  <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1 mt-auto">
                    <p className="text-muted-foreground">提示：</p>
                    <p>• 扫描ASN单号（如：ASN-2024-001）</p>
                    <p>• 扫描物流单号（如：SF1234567890）</p>
                    <p>• 扫描箱唛/箱号定位</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: 容器绑定 */}
            {currentStep === "container" && currentASN && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    绑定容器/跟踪号
                  </CardTitle>
                  <CardDescription>
                    扫描或生成新的容器编号
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>容器编号</Label>
                    <div className="flex gap-2">
                      <Input
                        ref={containerInputRef}
                        value={containerInput}
                        onChange={(e) => setContainerInput(e.target.value)}
                        placeholder="扫描或输入容器号"
                        className="text-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={handleAutoGenerateContainer}
                        title="自动生成容器编号"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>容器类型</Label>
                    <Select value={containerType} onValueChange={setContainerType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="托盘">托盘（Pallet）</SelectItem>
                        <SelectItem value="周转箱">周转箱（Tote）</SelectItem>
                        <SelectItem value="纸箱">纸箱（Carton）</SelectItem>
                        <SelectItem value="笼车">笼车（Cage）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBindContainer}
                    disabled={!containerInput.trim()}
                  >
                    确认绑定
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: 库位指定 */}
            {currentStep === "location" && currentContainer && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    指定收货库位
                  </CardTitle>
                  <CardDescription>
                    选择或扫描收货存放位置
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>收货库位</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLocations.map((loc) => (
                          <SelectItem key={loc.code} value={loc.code}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                    <p className="text-info-700">
                      默认使用收货暂存区，后续可在上架时调整
                    </p>
                  </div>
                  
                  <Button className="w-full" onClick={handleConfirmLocation}>
                    确认库位
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: SKU扫描 */}
            {currentStep === "scan" && currentContainer && (
              <>
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scan className="w-5 h-5" />
                      扫描SKU条码
                    </CardTitle>
                    <CardDescription>
                      容器：{currentContainer.containerNo} | 库位：{currentContainer.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>扫描模式</Label>
                      <Select value={scanMode} onValueChange={(v) => {
                        setScanMode(v as any);
                        setPendingSKU(null);
                        setQtyInput("");
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">逐件扫描（每次+1）</SelectItem>
                          <SelectItem value="batch">批量扫描（自定义数量）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <ScanInputPanel
                      label="扫描条码"
                      value={scanInput}
                      inputRef={scanInputRef}
                      onChange={setScanInput}
                      onEnter={handleSKUScan}
                      placeholder="扫描SKU或条形码，按 Enter"
                    />
                    
                    {scanMode === "batch" && pendingSKU && (
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-primary mb-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>已识别SKU：{pendingSKU}</span>
                        </div>
                        <div className="space-y-2">
                          <Label>输入数量</Label>
                          <Input
                            ref={qtyInputRef}
                            type="number"
                            min="1"
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value)}
                            onKeyDown={handleQtyInput}
                            placeholder="输入数量后按 Enter 确认"
                            className="text-lg h-12"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleUndoLastScan}
                        disabled={scanHistory.length === 0}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        撤销
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleConfirmReceive}
                        disabled={!currentContainer || currentContainer.totalQty === 0}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        确认收货
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 当前容器状态 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">当前容器状态</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">总件数</span>
                      <span className="text-lg">{currentContainer.totalQty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">SKU种类</span>
                      <span className="text-lg">{currentContainer.scannedItems.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">满箱提示</span>
                      <Badge variant={currentContainer.totalQty >= 50 ? "destructive" : "secondary"}>
                        {currentContainer.totalQty >= 50 ? "接近满箱" : "正常"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 扫描历史 */}
                {scanHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">扫描历史（最近5条）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OperationLogList logs={operationLogs} />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
            
            {/* ASN信息卡片（步骤2-4显示） */}
            {currentASN && currentStep !== "asn" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ASN信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ASN单号</span>
                    <span className="font-mono">{currentASN.asnNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">客户</span>
                    <span>{currentASN.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">物流单号</span>
                    <span className="font-mono">{currentASN.trackingNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计到货</span>
                    <span>{currentASN.estimatedDate}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* 右侧：数据展示区 */}
          <div className="lg:col-span-3 space-y-6">
            {/* ASN收货进度 */}
            {currentASN && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>收货进度</CardTitle>
                      <CardDescription>
                        {currentASN.asnNo} - {currentASN.customer}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl">
                        {getTotalScanned()} / {getTotalPlanned()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        已收货 / 计划收货
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <QuantityProgress current={getTotalScanned()} total={getTotalPlanned()} />
                  
                  {/* ASN明细表格 */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <DataTableHeaderRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>产品名称</TableHead>
                          <TableHead>规格</TableHead>
                          <TableHead className="text-right">计划数量</TableHead>
                          <TableHead className="text-right">已扫描</TableHead>
                          <TableHead className="text-right">待收货</TableHead>
                          <TableHead className="text-center">状态</TableHead>
                        </DataTableHeaderRow>
                      </TableHeader>
                      <TableBody>
                        {currentASN.items.map((item) => {
                          const remaining = item.plannedQty - item.scannedQty;
                          const isCompleted = item.scannedQty >= item.plannedQty;
                          const progress = (item.scannedQty / item.plannedQty) * 100;
                          
                          return (
                            <TableRow key={item.sku}>
                              <TableCell className="font-mono">{item.sku}</TableCell>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {item.spec}
                              </TableCell>
                              <TableCell className="text-right">{item.plannedQty}</TableCell>
                              <TableCell className="text-right">
                                <span className={item.scannedQty > 0 ? "text-primary" : ""}>
                                  {item.scannedQty}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={remaining > 0 ? "text-warning" : "text-success"}>
                                  {remaining}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {isCompleted ? (
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                    已完成
                                  </Badge>
                                ) : item.scannedQty > 0 ? (
                                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                    进行中 {progress.toFixed(0)}%
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                                    未开始
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
            )}
            
            {/* 当前容器明细 */}
            {currentContainer && currentContainer.scannedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>当前容器明细</CardTitle>
                      <CardDescription>
                        {currentContainer.containerNo} - {currentContainer.containerType}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {currentContainer.totalQty} 件
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <DataTableHeaderRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>产品名称</TableHead>
                          <TableHead className="text-right">数量</TableHead>
                          <TableHead>扫描时间</TableHead>
                        </DataTableHeaderRow>
                      </TableHeader>
                      <TableBody>
                        {currentContainer.scannedItems.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono">{item.sku}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary">{item.qty}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.scanTime}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 已完成容器列表 */}
            {completedContainers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>已完成容器</CardTitle>
                  <CardDescription>
                    本次ASN已收货 {completedContainers.length} 个容器
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedContainers.map((container, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg bg-success/5"
                      >
                        <div className="flex items-center gap-3">
                          <PackageCheck className="w-5 h-5 text-success" />
                          <div>
                            <div className="font-mono">{container.containerNo}</div>
                            <div className="text-xs text-muted-foreground">
                              {container.containerType} | {container.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg">{container.totalQty} 件</div>
                          <div className="text-xs text-muted-foreground">
                            {container.scannedItems.length} SKU
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 空状态 */}
            {!currentASN && (
              <Card className="h-[400px] flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg">等待扫描ASN</h3>
                    <p className="text-sm text-muted-foreground">
                      请在左侧扫描区扫描ASN单号或物流单号
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* 底部操作栏 */}
        {currentASN && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新开始
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setIsPrintDialogOpen(true)}
                    disabled={completedContainers.length === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    打印标签
                  </Button>
                  
                  {currentStep === "scan" && (
                    <Button 
                      onClick={handleConfirmReceive}
                      disabled={!currentContainer || currentContainer.totalQty === 0}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      确认当前容器收货
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </WorkflowPageLayout>
      
      {/* 确认收货对话框 */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认收货</DialogTitle>
            <DialogDescription>
              请核对收货信息，确认后将生成收货记录
            </DialogDescription>
          </DialogHeader>
          
          {currentContainer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">容器编号</div>
                  <div className="font-mono mt-1">{currentContainer.containerNo}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">容器类型</div>
                  <div className="mt-1">{currentContainer.containerType}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">收货库位</div>
                  <div className="mt-1">{currentContainer.location}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">总件数</div>
                  <div className="text-lg mt-1">{currentContainer.totalQty}</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 bg-muted/30 text-sm space-y-1">
                <div>收货明细：</div>
                {currentContainer.scannedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.sku} - {item.productName}</span>
                    <span>× {item.qty}</span>
                  </div>
                ))}
              </div>
              
              <div className="rounded-lg border border-info/20 bg-info/10 p-3 text-sm text-info-700">
                确认后将扣减ASN待收数量，增加库存
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={executeConfirmReceive}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              确认收货
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 打印标签对话框 */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>打印容器标签</DialogTitle>
            <DialogDescription>
              为已完成的容器打印标签
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>选择要打印的容器</Label>
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {completedContainers.map((container, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <div>
                        <div className="font-mono text-sm">{container.containerNo}</div>
                        <div className="text-xs text-muted-foreground">
                          {container.containerType} | {container.totalQty} 件
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>标签规格</Label>
              <Select defaultValue="100x100">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100x100">100mm × 100mm（推荐）</SelectItem>
                  <SelectItem value="100x150">100mm × 150mm</SelectItem>
                  <SelectItem value="80x60">80mm × 60mm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success("打印任务已发送");
              setIsPrintDialogOpen(false);
            }}>
              <Printer className="w-4 h-4 mr-2" />
              开始打印
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WMSLayout>
  );
}
