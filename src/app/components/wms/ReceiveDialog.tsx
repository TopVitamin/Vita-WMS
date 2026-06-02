import { useState, useRef, useEffect } from "react";
import { Package, Scan, CheckCircle2, AlertCircle } from "lucide-react";
import { addInventoryStock } from "../../services/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";

const skuMapping: Record<string, string> = {
  "SKU-001": "ABC-123456", // 蓝牙耳机
  "SKU-002": "ABC-123457", // 智能手环
  "SKU-003": "JKL-901234", // 充电宝映射到 USB type-c 充电线
};

interface Container {
  containerNo: string;
  containerType: string;
}

interface InboundItem {
  sku: string;
  productName: string;
  barcode: string;
  spec: string;
  plannedQty: number;
  receivedQty: number;
}

interface ReceiveItem extends InboundItem {
  currentReceiveQty: number;
}

interface ReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inboundId: string;
  items: InboundItem[];
  onConfirm: (data: {
    container: Container;
    items: ReceiveItem[];
    note: string;
  }) => void;
}

export function ReceiveDialog({
  open,
  onOpenChange,
  inboundId,
  items,
  onConfirm,
}: ReceiveDialogProps) {
  const [step, setStep] = useState<"overview" | "container" | "scan">("overview");
  const [container, setContainer] = useState<Container | null>(null);
  const [containerNo, setContainerNo] = useState("");
  const [containerType, setContainerType] = useState("托盘");
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([]);
  const [scanInput, setScanInput] = useState("");
  const [note, setNote] = useState("");
  const containerInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // 初始化收货明细
  useEffect(() => {
    if (open && items.length > 0) {
      setReceiveItems(
        items.map((item) => ({
          ...item,
          currentReceiveQty: 0,
        }))
      );
      setStep("overview");
      setContainer(null);
      setContainerNo("");
      setContainerType("托盘");
      setScanInput("");
      setNote("");
    }
  }, [open, items]);

  // 容器输入框自动聚焦
  useEffect(() => {
    if (open && step === "container" && containerInputRef.current) {
      const timer = setTimeout(() => {
        containerInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, step]);

  // 扫码输入框自动聚焦
  useEffect(() => {
    if (open && step === "scan" && scanInputRef.current) {
      const timer = setTimeout(() => {
        scanInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, step]);

  const handleBindContainer = () => {
    if (!containerNo.trim()) {
      toast.error("请输入容器编号");
      return;
    }

    setContainer({ containerNo: containerNo.trim(), containerType });
    setStep("scan");
    toast.success(`容器 ${containerNo} 绑定成功，开始扫描SKU`);
  };

  const executeScanAction = (barcodeValue: string) => {
    const input = barcodeValue.trim();
    if (!input) return;

    // 查找匹配的SKU或条形码
    const matchedItem = receiveItems.find(
      (item) =>
        item.sku.toLowerCase() === input.toLowerCase() ||
        item.barcode.toLowerCase() === input.toLowerCase()
    );

    if (matchedItem) {
      // 增加收货数量
      setReceiveItems(
        receiveItems.map((item) =>
          item.sku === matchedItem.sku
            ? { ...item, currentReceiveQty: item.currentReceiveQty + 1 }
            : item
        )
      );
      toast.success(`${matchedItem.sku} 已加入容器 ${container?.containerNo}，数量 +1`);
    } else {
      toast.error(`未找到与 "${input}" 匹配的SKU或条形码`);
    }

    setScanInput("");
  };

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeScanAction(scanInput);
    }
  };

  const simulateScan = (barcode: string) => {
    executeScanAction(barcode);
  };

  const handleQtyChange = (sku: string, qty: string) => {
    const numQty = parseInt(qty) || 0;
    setReceiveItems(
      receiveItems.map((item) =>
        item.sku === sku ? { ...item, currentReceiveQty: numQty } : item
      )
    );
  };

  const handleConfirm = () => {
    // 校验
    if (!container) {
      toast.error("请先绑定容器");
      return;
    }

    const totalReceiveQty = receiveItems.reduce(
      (sum, item) => sum + item.currentReceiveQty,
      0
    );
    if (totalReceiveQty === 0) {
      toast.error("请至少收货一个商品");
      return;
    }

    // 过滤出有收货数量的商品
    const itemsToReceive = receiveItems.filter((item) => item.currentReceiveQty > 0);

    // 累加对应库存数量
    itemsToReceive.forEach((item) => {
      const inventorySku = skuMapping[item.sku] || item.sku;
      addInventoryStock(inventorySku, item.currentReceiveQty);
    });

    onConfirm({
      container,
      items: itemsToReceive,
      note,
    });

    // 重置
    setStep("container");
    setContainer(null);
    setContainerNo("");
    setContainerType("托盘");
    setNote("");
    setScanInput("");
  };

  const handleBackToOverview = () => {
    if (step === "scan" && receiveItems.some(item => item.currentReceiveQty > 0)) {
      if (window.confirm("当前容器中已添加商品，确认要返回吗？数据将丢失。")) {
        setStep("overview");
        setContainer(null);
        setReceiveItems(receiveItems.map(item => ({ ...item, currentReceiveQty: 0 })));
      }
    } else if (step === "container") {
      setStep("overview");
    } else {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const totalReceiveQty = receiveItems.reduce(
    (sum, item) => sum + item.currentReceiveQty,
    0
  );

  const itemsInContainer = receiveItems.filter(item => item.currentReceiveQty > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            收货 - {inboundId}
          </DialogTitle>
          <DialogDescription>
            {step === "overview" && "查看待收货清单，确认后开始收货流程"}
            {step === "container" && "绑定收货容器以开始扫描SKU"}
            {step === "scan" && "扫描SKU条形码加入容器"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 步骤0：待收货清单 */}
          {step === "overview" && (
            <div>
              <div className="mb-4">
                <h3 className="flex items-center gap-2 mb-2">
                  入库单待收货清单
                </h3>
                <p className="text-sm text-muted-foreground">
                  以下是本入库单的SKU清单和剩余待收货数量，确认后开始收货流程
                </p>
              </div>

              {/* 汇总信息 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">SKU种类</div>
                  <div className="text-2xl">{items.length}</div>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">计划总数量</div>
                  <div className="text-2xl">
                    {items.reduce((sum, item) => sum + item.plannedQty, 0)}
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-primary-light/30 border-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">剩余待收</div>
                  <div className="text-2xl text-primary">
                    {items.reduce((sum, item) => sum + (item.plannedQty - item.receivedQty), 0)}
                  </div>
                </div>
              </div>

              {/* SKU清单表格 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                      <TableHead>SKU</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead className="text-right">计划数量</TableHead>
                      <TableHead className="text-right">已收数量</TableHead>
                      <TableHead className="text-right">剩余待收</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const remaining = item.plannedQty - item.receivedQty;
                      const isCompleted = remaining === 0;
                      
                      return (
                        <TableRow
                          key={item.sku}
                          className={isCompleted ? "bg-muted/50 text-muted-foreground" : ""}
                        >
                          <TableCell>
                            <code className="text-xs font-mono text-primary">{item.sku}</code>
                          </TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.spec}
                          </TableCell>
                          <TableCell className="text-right">{item.plannedQty}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {item.receivedQty}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={remaining === 0 ? "text-success-600" : "text-primary"}>
                              {remaining}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {isCompleted ? (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                已收齐
                              </Badge>
                            ) : (
                              <Badge variant="outline">待收货</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* 提示信息 */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <div className="mb-1">收货流程说明：</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>每次收货需要先绑定一个容器（托盘/周转箱等）</li>
                      <li>扫描SKU条形码，商品会自动加入到容器中</li>
                      <li>一个入库单可以分多次收货，每次使用不同的容器</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步骤1：绑定容器 */}
          {step === "container" && (
            <div className="border rounded-lg p-6 bg-primary-light/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <Label className="text-lg">绑定收货容器</Label>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="containerNo">容器编号 *</Label>
                      <button
                        type="button"
                        onClick={() => {
                          const randomNo = `PL-${Date.now().toString().slice(-6)}`;
                          setContainerNo(randomNo);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        一键生成托盘号
                      </button>
                    </div>
                    <Input
                      id="containerNo"
                      ref={containerInputRef}
                      placeholder="扫描或输入容器编号..."
                      value={containerNo}
                      onChange={(e) => setContainerNo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleBindContainer();
                        }
                      }}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="containerType">容器类型 *</Label>
                    <Select value={containerType} onValueChange={setContainerType}>
                      <SelectTrigger id="containerType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="托盘">托盘</SelectItem>
                        <SelectItem value="周转箱">周转箱</SelectItem>
                        <SelectItem value="纸箱">纸箱</SelectItem>
                        <SelectItem value="散装">散装</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleBindContainer} className="w-full" size="lg">
                  <CheckCircle2 className="w-4 h-4" />
                  确认绑定容器
                </Button>
              </div>
            </div>
          )}

          {/* 步骤2：扫描SKU */}
          {step === "scan" && container && (
            <>
              {/* 当前容器信息 */}
              <div className="border rounded-lg p-4 bg-primary-light/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">当前容器</div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono">{container.containerNo}</code>
                        <Badge variant="secondary">{container.containerType}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">容器内商品</div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{itemsInContainer.length} 个SKU</span>
                      <span className="text-primary">{totalReceiveQty} 件</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 扫码录入区 */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <Label className="mb-3 block flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  扫描SKU加入容器
                </Label>
                <Input
                  ref={scanInputRef}
                  placeholder="扫描SKU或��形码..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={handleScan}
                  className="font-mono"
                />
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground">一键模拟扫码:</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => simulateScan("SKU-001")}
                  >
                    耳机 (SKU-001)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => simulateScan("SKU-002")}
                  >
                    手环 (SKU-002)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => simulateScan("SKU-003")}
                  >
                    充电宝 (SKU-003)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-error-600 hover:text-error-700 hover:bg-error-50"
                    onClick={() => simulateScan("UNKNOWN-BARCODE")}
                  >
                    模拟无效扫码
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  提示：扫描后按回车键自动增加数量，SKU将加入到容器 <code className="font-mono text-primary">{container.containerNo}</code>
                </p>
              </div>

              {/* 商品明细表格 */}
              <div>
                <Label className="mb-3 block flex items-center justify-between">
                  <span>商品明细</span>
                  <span className="text-primary">
                    本次收货：{totalReceiveQty} 件
                  </span>
                </Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>条形码</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">计划数量</TableHead>
                        <TableHead className="text-right">已收数量</TableHead>
                        <TableHead className="text-right">本次收货</TableHead>
                        <TableHead className="text-right">剩余待收</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receiveItems.map((item) => {
                        const remaining = item.plannedQty - item.receivedQty - item.currentReceiveQty;
                        const isOverReceive = item.receivedQty + item.currentReceiveQty > item.plannedQty;
                        const isInContainer = item.currentReceiveQty > 0;
                        
                        return (
                          <TableRow
                            key={item.sku}
                            className={isInContainer ? "bg-primary-light/30 border-l-4 border-l-primary" : ""}
                          >
                            <TableCell>
                              {isInContainer && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs font-mono text-primary">{item.sku}</code>
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <code className="text-xs font-mono text-muted-foreground">
                                {item.barcode}
                              </code>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.spec}
                            </TableCell>
                            <TableCell className="text-right">{item.plannedQty}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {item.receivedQty}
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                value={item.currentReceiveQty}
                                onChange={(e) => handleQtyChange(item.sku, e.target.value)}
                                className={`w-24 text-right font-mono ${isInContainer ? "border-primary" : ""}`}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  isOverReceive
                                    ? "text-warning-600 flex items-center justify-end gap-1"
                                    : remaining === 0
                                    ? "text-success-600"
                                    : ""
                                }
                              >
                                {isOverReceive && <AlertCircle className="w-4 h-4" />}
                                {remaining}
                                {isOverReceive && " (超收)"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {itemsInContainer.length > 0 && (
                  <div className="mt-4 p-4 bg-primary-light/20 border border-primary/30 rounded-lg">
                    <div className="text-sm mb-2">容器 <code className="font-mono text-primary">{container.containerNo}</code> 中的商品：</div>
                    <div className="flex flex-wrap gap-2">
                      {itemsInContainer.map((item) => (
                        <Badge key={item.sku} variant="secondary" className="gap-1">
                          {item.sku} × {item.currentReceiveQty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 收货备注 */}
              <div>
                <Label htmlFor="note">收货备注</Label>
                <Textarea
                  id="note"
                  placeholder="可选填写..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {step === "overview" ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={() => setStep("container")} size="lg">
                <Package className="w-4 h-4" />
                开始收货
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBackToOverview}>
                {step === "scan" ? "返回" : "返回"}
              </Button>
              {step === "scan" && (
                <Button onClick={handleConfirm}>
                  <CheckCircle2 className="w-4 h-4" />
                  保存收货记录
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
