import { useState, useRef, useEffect } from "react";
import { Package, Scan, MapPin, CheckCircle2, ArrowUpToLine } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DataTableHeaderRow, NoticePanel, StatusBadge } from "../business";
import { toast } from "sonner";

interface ContainerItem {
  sku: string;
  productName: string;
  spec: string;
  qty: number;
  putawayQty: number;
}

interface Container {
  containerNo: string;
  containerType: string;
  inboundId: string;
  receiveTime: string;
  customerName: string;
  skuCount: number;
  totalQty: number;
  items: ContainerItem[];
}

interface PutawayLocation {
  sku: string;
  locationCode: string;
  qty: number;
}

interface PutawayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
  onConfirm: (data: {
    containerNo: string;
    locations: PutawayLocation[];
    note: string;
  }) => void;
}

// 模拟可用库位数据
const mockLocations = [
  "A-01-01-01",
  "A-01-01-02",
  "A-01-01-03",
  "A-01-02-01",
  "A-01-02-02",
  "B-01-01-01",
  "B-01-01-02",
  "B-02-01-01",
];

export function PutawayDialog({
  open,
  onOpenChange,
  container,
  onConfirm,
}: PutawayDialogProps) {
  const [step, setStep] = useState<"scan" | "allocate">("scan");
  const [scannedContainer, setScannedContainer] = useState<string>("");
  const [containerVerified, setContainerVerified] = useState(false);
  const [putawayItems, setPutawayItems] = useState<
    (ContainerItem & { locations: { locationCode: string; qty: number }[] })[]
  >([]);
  const [currentSku, setCurrentSku] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [note, setNote] = useState("");
  const scanInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // 初始化
  useEffect(() => {
    if (open) {
      setStep("scan");
      setScannedContainer("");
      setContainerVerified(false);
      setPutawayItems(
        container.items.map((item) => ({
          ...item,
          locations: [],
        }))
      );
      setCurrentSku(null);
      setLocationInput("");
      setQtyInput("");
      setNote("");
    }
  }, [open, container]);

  // 扫码输入框自动聚焦
  useEffect(() => {
    if (open && step === "scan" && !containerVerified && scanInputRef.current) {
      const timer = setTimeout(() => {
        scanInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, step, containerVerified]);

  // 库位输入框自动聚焦
  useEffect(() => {
    if (open && step === "allocate" && currentSku && locationInputRef.current) {
      const timer = setTimeout(() => {
        locationInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, step, currentSku]);

  const verifyContainer = () => {
    const input = scannedContainer.trim();
    if (!input) {
      toast.error("请扫描或输入容器编号");
      return;
    }

    if (input.toUpperCase() === container.containerNo.toUpperCase()) {
      setContainerVerified(true);
      setStep("allocate");
      toast.success(`容器 ${container.containerNo} 验证成功，开始分配库位`);
    } else {
      toast.error(`容器编号不匹配，请扫描 ${container.containerNo}`);
      setScannedContainer("");
    }
  };

  const verifyExpectedContainer = () => {
    setScannedContainer(container.containerNo);
    setContainerVerified(true);
    setStep("allocate");
    toast.success(`容器 ${container.containerNo} 验证成功，开始分配库位`);
  };

  // 扫描容器
  const handleScanContainer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      verifyContainer();
    }
  };

  // 选择SKU进行上架
  const handleSelectSku = (sku: string) => {
    const item = putawayItems.find((i) => i.sku === sku);
    if (!item) return;

    const remainingQty = item.qty - item.putawayQty - item.locations.reduce((sum, loc) => sum + loc.qty, 0);
    if (remainingQty === 0) {
      toast.error(`SKU ${sku} 已全部分配库位`);
      return;
    }

    setCurrentSku(sku);
    setQtyInput(remainingQty.toString());
    setLocationInput("");
  };

  const allocateCurrentLocation = () => {
    if (!currentSku) {
      toast.error("请先选择要上架的SKU");
      return;
    }

    const locationCode = locationInput.trim().toUpperCase();
    const qty = parseInt(qtyInput) || 0;

    if (!locationCode) {
      toast.error("请输入库位编号");
      return;
    }

    if (qty <= 0) {
      toast.error("数量必须大于0");
      return;
    }

    const item = putawayItems.find((i) => i.sku === currentSku);
    if (!item) return;

    const allocatedQty = item.putawayQty + item.locations.reduce((sum, loc) => sum + loc.qty, 0);
    const remainingQty = item.qty - allocatedQty;

    if (qty > remainingQty) {
      toast.error(`上架数量不能超过剩余数量 ${remainingQty}`);
      return;
    }

    // 检查库位是否已使用（同一SKU）
    const locationExists = item.locations.some(loc => loc.locationCode === locationCode);
    if (locationExists) {
      toast.error(`库位 ${locationCode} 已被使用`);
      return;
    }

    // 添加库位分配
    setPutawayItems(
      putawayItems.map((i) =>
        i.sku === currentSku
          ? {
              ...i,
              locations: [...i.locations, { locationCode, qty }],
            }
          : i
      )
    );

    toast.success(`${currentSku} → ${locationCode} 分配成功，数量: ${qty}`);

    const newRemainingQty = remainingQty - qty;
    if (newRemainingQty > 0) {
      setQtyInput(newRemainingQty.toString());
      setLocationInput("");
    } else {
      setCurrentSku(null);
      setLocationInput("");
      setQtyInput("");
    }
  };

  // 分配库位
  const handleAllocateLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      allocateCurrentLocation();
    }
  };

  // 移除库位分配
  const handleRemoveLocation = (sku: string, locationCode: string) => {
    setPutawayItems(
      putawayItems.map((item) =>
        item.sku === sku
          ? {
              ...item,
              locations: item.locations.filter((loc) => loc.locationCode !== locationCode),
            }
          : item
      )
    );
    toast.success("已移除库位分配");
  };

  // 确认上架
  const handleConfirm = () => {
    // 校验所有SKU是否都已分配完毕
    const allAllocated = putawayItems.every((item) => {
      const allocatedQty = item.putawayQty + item.locations.reduce((sum, loc) => sum + loc.qty, 0);
      return allocatedQty === item.qty;
    });

    if (!allAllocated) {
      toast.error("请完成所有SKU的库位分配");
      return;
    }

    // 构建上架数据
    const locations: PutawayLocation[] = [];
    putawayItems.forEach((item) => {
      item.locations.forEach((loc) => {
        locations.push({
          sku: item.sku,
          locationCode: loc.locationCode,
          qty: loc.qty,
        });
      });
    });

    onConfirm({
      containerNo: container.containerNo,
      locations,
      note,
    });
  };

  const totalAllocatedQty = putawayItems.reduce(
    (sum, item) => sum + item.putawayQty + item.locations.reduce((s, loc) => s + loc.qty, 0),
    0
  );

  const allItemsAllocated = putawayItems.every((item) => {
    const allocatedQty = item.putawayQty + item.locations.reduce((sum, loc) => sum + loc.qty, 0);
    return allocatedQty === item.qty;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpToLine className="w-5 h-5" />
            上架操作 - {container.containerNo}
          </DialogTitle>
          <DialogDescription>
            {step === "scan" && "扫描容器编号以验证容器"}
            {step === "allocate" && "为容器内的SKU分配库位"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* 步骤1：扫描容器 */}
          {step === "scan" && !containerVerified && (
            <div className="rounded-lg border bg-primary/5 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Scan className="w-4 h-4" />
                </div>
                <span>扫描容器</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="scanContainer">请扫描容器编号 *</Label>
                  <Input
                    id="scanContainer"
                    ref={scanInputRef}
                    placeholder={`扫描容器 ${container.containerNo}...`}
                    value={scannedContainer}
                    onChange={(e) => setScannedContainer(e.target.value)}
                    onKeyDown={handleScanContainer}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    扫描容器条形码后按回车键验证
                  </p>
                  <Button onClick={verifyContainer} className="mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    验证容器
                  </Button>
                  <Button type="button" variant="outline" onClick={verifyExpectedContainer} className="mt-2 ml-2">
                    <Package className="w-4 h-4" />
                    使用当前容器
                  </Button>
                </div>

                {/* 容器信息预览 */}
                <div className="border rounded-lg p-4 bg-background">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">容器编号</div>
                      <code className="font-mono text-primary">{container.containerNo}</code>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">容器类型</div>
                      <Badge variant="secondary">{container.containerType}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">入库单号</div>
                      <code className="font-mono text-sm">{container.inboundId}</code>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">客户</div>
                      <div>{container.customerName}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">SKU种类</div>
                      <div>{container.skuCount}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">总数量</div>
                      <div>{container.totalQty}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步骤2：分配库位 */}
          {step === "allocate" && (
            <>
              {/* 容器信息卡片 */}
              <div className="rounded-lg border bg-primary/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs text-muted-foreground">当前容器</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="font-mono">{container.containerNo}</code>
                        <Badge variant="secondary">{container.containerType}</Badge>
                        <StatusBadge label="已验证" tone="success" Icon={CheckCircle2} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground mb-1.5">上架进度</div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">
                        {totalAllocatedQty} / {container.totalQty}
                      </span>
                      <span className="text-muted-foreground">
                        ({Math.round((totalAllocatedQty / container.totalQty) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 库位分配输入区 */}
              {currentSku && (
                <NoticePanel
                  tone="info"
                  icon={MapPin}
                  title={
                    <span>
                      正在为 <code className="font-mono text-primary">{currentSku}</code> 分配库位
                    </span>
                  }
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locationInput">库位编号 *</Label>
                      <Input
                        id="locationInput"
                        ref={locationInputRef}
                        placeholder="扫描或输入库位编号..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={handleAllocateLocation}
                        className="font-mono"
                      />
                      <div className="flex flex-wrap gap-2">
                        {mockLocations.map((location) => (
                          <Button
                            key={location}
                            type="button"
                            variant={locationInput === location ? "default" : "outline"}
                            size="sm"
                            className="h-7 px-2 font-mono text-xs"
                            onClick={() => setLocationInput(location)}
                          >
                            {location}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qtyInput">上架数量 *</Label>
                      <Input
                        id="qtyInput"
                        type="number"
                        min="1"
                        placeholder="输入数量..."
                        value={qtyInput}
                        onChange={(e) => setQtyInput(e.target.value)}
                        onKeyDown={handleAllocateLocation}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={allocateCurrentLocation}>
                      <MapPin className="w-4 h-4" />
                      确认分配
                    </Button>
                  </div>
                  <p className="text-xs text-current/80 mt-3">
                    提示：输入库位和数量后按回车键或点击确认分配，完成当前SKU上架库位绑定
                  </p>
                </NoticePanel>
              )}

              {/* SKU列表和库位分配 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>SKU清单与库位分配</Label>
                  {allItemsAllocated && (
                    <StatusBadge label="全部完成" tone="success" Icon={CheckCircle2} />
                  )}
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">数量</TableHead>
                        <TableHead className="text-right">已分配</TableHead>
                        <TableHead className="text-right">待分配</TableHead>
                        <TableHead>已分配库位</TableHead>
                        <TableHead className="text-center">操作</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {putawayItems.map((item) => {
                        const allocatedQty = item.putawayQty + item.locations.reduce((sum, loc) => sum + loc.qty, 0);
                        const remainingQty = item.qty - allocatedQty;
                        const isCompleted = remainingQty === 0;
                        const isSelected = currentSku === item.sku;

                        return (
                          <TableRow
                            key={item.sku}
                            className={
                              isSelected
                                ? "border-l-4 border-l-primary bg-primary/5"
                                : isCompleted
                                ? "bg-success-50/50"
                                : ""
                            }
                          >
                            <TableCell>
                              {isCompleted && (
                                <CheckCircle2 className="w-4 h-4 text-success-600" />
                              )}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs font-mono text-primary">{item.sku}</code>
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.spec}
                            </TableCell>
                            <TableCell className="text-right">{item.qty}</TableCell>
                            <TableCell className="text-right">
                              <span className={isCompleted ? "text-success-600" : ""}>
                                {allocatedQty}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  remainingQty > 0 ? "text-warning-600" : "text-success-600"
                                }
                              >
                                {remainingQty}
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.locations.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {item.locations.map((loc) => (
                                    <Badge
                                      key={loc.locationCode}
                                      variant="secondary"
                                      className="gap-1 text-xs"
                                    >
                                      <MapPin className="w-3 h-3" />
                                      {loc.locationCode} × {loc.qty}
                                      <button
                                        onClick={() => handleRemoveLocation(item.sku, loc.locationCode)}
                                        className="ml-1 hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">未分配</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {!isCompleted && (
                                <Button
                                  size="sm"
                                  variant={isSelected ? "default" : "outline"}
                                  onClick={() => handleSelectSku(item.sku)}
                                  className="gap-1.5"
                                >
                                  <MapPin className="w-4 h-4" />
                                  {isSelected ? "分配中" : "分配库位"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* 上架备注 */}
              <div className="space-y-2">
                <Label htmlFor="note">上架备注</Label>
                <Textarea
                  id="note"
                  placeholder="可选填写..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>

              {/* 提示信息 */}
              {!allItemsAllocated && (
                <NoticePanel tone="warning" title="请完成所有SKU的库位分配">
                  <ul className="list-disc list-inside space-y-1.5">
                    <li>点击"分配库位"按钮选择要上架的SKU</li>
                    <li>扫描或输入库位编号和数量</li>
                    <li>同一SKU可以分配到多个库位</li>
                    <li>必须将所有数量分配完毕才能完成上架</li>
                  </ul>
                </NoticePanel>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === "scan" && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
          )}
          {step === "allocate" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button onClick={handleConfirm} disabled={!allItemsAllocated} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                确认上架
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
