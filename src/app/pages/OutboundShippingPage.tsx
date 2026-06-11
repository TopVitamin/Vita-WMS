import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Barcode,
  CheckCircle2,
  PackageCheck,
  Printer,
  Ruler,
  Scale,
  Search,
  Truck,
  Weight,
} from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import {
  DataTableHeaderRow,
  KpiCard,
  ScanInputPanel,
  StatusBadge,
  WorkflowPageLayout,
  WorkflowStepBar,
} from "../components/business";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { outboundPackageStatusMap } from "../configs/wmsStatusMap";
import {
  confirmOutboundPackageWeight,
  listOutboundPackages,
  shipOutboundPackage,
  type OutboundPackage,
} from "../services/mock";

interface OutboundShippingPageProps {
  onNavigate?: (path: string) => void;
}

const carrierOptions = ["FedEx", "DHL", "UPS", "USPS", "顺丰"];

function buildTrackingNo(carrier: string, packageNo: string) {
  const suffix = packageNo.replace(/\D/g, "").slice(-8).padStart(8, "0");
  const prefix = carrier === "顺丰" ? "SF" : carrier.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  return `${prefix}${suffix}`;
}

export default function OutboundShippingPage({ onNavigate }: OutboundShippingPageProps) {
  const [packages, setPackages] = useState<OutboundPackage[]>(() => listOutboundPackages());
  const [scanInput, setScanInput] = useState("");
  const [selectedPackageNo, setSelectedPackageNo] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [keyword, setKeyword] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [carrier, setCarrier] = useState("FedEx");
  const [trackingNo, setTrackingNo] = useState("");

  const refreshPackages = () => setPackages(listOutboundPackages());
  const selectedPackage = packages.find((item) => item.packageNo === selectedPackageNo) || null;

  const filteredPackages = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return packages.filter((item) => {
      if (statusFilter !== "all") {
        if (statusFilter === "active" && item.status === "shipped") return false;
        if (statusFilter !== "active" && item.status !== statusFilter) return false;
      }

      if (!normalizedKeyword) return true;
      return [item.packageNo, item.boxNo, item.orderNo, item.customer, item.trackingNo || ""]
        .some((value) => value.toLowerCase().includes(normalizedKeyword));
    });
  }, [keyword, packages, statusFilter]);

  const stats = {
    pendingWeight: packages.filter((item) => item.status === "pending_weight").length,
    pendingShip: packages.filter((item) => item.status === "pending_ship").length,
    shipped: packages.filter((item) => item.status === "shipped").length,
    exception: packages.filter((item) => item.status === "exception").length,
  };

  const currentStepId = !selectedPackage
    ? "scan"
    : selectedPackage.status === "pending_weight"
      ? "weight"
      : selectedPackage.status === "pending_ship"
        ? "ship"
        : "complete";

  const selectPackage = (item: OutboundPackage) => {
    setSelectedPackageNo(item.packageNo);
    setWeight(item.weight?.toString() || "");
    setLength(item.length?.toString() || "");
    setWidth(item.width?.toString() || "");
    setHeight(item.height?.toString() || "");
    setCarrier(item.carrier === "-" ? "FedEx" : item.carrier);
    setTrackingNo(item.trackingNo || "");
  };

  const handleScan = () => {
    const input = scanInput.trim().toLowerCase();
    if (!input) return;

    const matched = packages.find((item) =>
      [item.packageNo, item.boxNo, item.orderNo, item.trackingNo || ""]
        .some((value) => value.toLowerCase() === input)
    );

    if (!matched) {
      toast.error("未找到匹配的包裹、箱号或运单号");
      return;
    }

    selectPackage(matched);
    setScanInput("");
    toast.success(`已加载 ${matched.packageNo}`);
  };

  const handleConfirmWeight = () => {
    if (!selectedPackage) return;
    const parsedWeight = Number(weight);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      toast.error("请输入有效重量");
      return;
    }

    const updated = confirmOutboundPackageWeight(selectedPackage.packageNo, {
      weight: parsedWeight,
      length: length ? Number(length) : undefined,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
      carrier,
      trackingNo: trackingNo || buildTrackingNo(carrier, selectedPackage.packageNo),
    });

    if (!updated) {
      toast.error("称重确认失败");
      return;
    }

    refreshPackages();
    selectPackage(updated);
    toast.success(`${updated.packageNo} 已称重，进入待出库`);
  };

  const handleShip = () => {
    if (!selectedPackage) return;
    const finalTrackingNo = trackingNo || selectedPackage.trackingNo || buildTrackingNo(carrier, selectedPackage.packageNo);
    const shipped = shipOutboundPackage(selectedPackage.packageNo, {
      carrier,
      trackingNo: finalTrackingNo,
    });

    if (!shipped) {
      toast.error("确认出库失败");
      return;
    }

    refreshPackages();
    selectPackage(shipped);
    toast.success(`${shipped.packageNo} 已确认出库`);
  };

  return (
    <WMSLayout title="称重出库" currentPath="/outbound/shipping" onNavigate={onNavigate}>
      <WorkflowPageLayout
        title="称重出库"
        description="扫描出库箱，完成称重、尺寸登记、面单补录和出库交接。"
        steps={
          <WorkflowStepBar
            currentStepId={currentStepId}
            steps={[
              { id: "scan", label: "扫描", description: "箱号/包裹" },
              { id: "weight", label: "称重", description: "重量尺寸" },
              { id: "ship", label: "出库", description: "交接承运商" },
              { id: "complete", label: "完成", description: "已出库" },
            ]}
          />
        }
        sidebar={
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Barcode className="h-5 w-5" />
                  扫描包裹
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScanInputPanel
                  label="包裹号 / 箱号 / 订单号 / 运单号"
                  placeholder="例如：PKG-20241020-0001"
                  value={scanInput}
                  onChange={setScanInput}
                  onEnter={(event) => {
                    if (event.key === "Enter") handleScan();
                  }}
                  actionLabel="加载包裹"
                  onAction={handleScan}
                />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {packages.slice(0, 4).map((item) => (
                    <Button key={item.packageNo} variant="outline" size="sm" onClick={() => selectPackage(item)}>
                      {item.packageNo}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="待称重" value={stats.pendingWeight} tone="info" />
              <KpiCard label="待出库" value={stats.pendingShip} tone="warning" />
              <KpiCard label="已出库" value={stats.shipped} tone="success" />
              <KpiCard label="异常" value={stats.exception} tone="error" />
            </div>

            {selectedPackage ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">当前包裹</CardTitle>
                  <CardDescription>{selectedPackage.packageNo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">状态</span>
                    <StatusBadge {...outboundPackageStatusMap[selectedPackage.status]} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">箱号</span>
                    <span className="font-mono">{selectedPackage.boxNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">订单号</span>
                    <span className="font-mono">{selectedPackage.orderNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">客户</span>
                    <span>{selectedPackage.customer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">商品</span>
                    <span>{selectedPackage.skuCount} SKU / {selectedPackage.itemCount} 件</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </>
        }
        primary={
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  称重与出库操作
                </CardTitle>
                <CardDescription>
                  {selectedPackage ? "录入物流数据后完成出库交接" : "请先扫描或选择一个待处理包裹"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>重量（kg）</Label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={weight}
                        onChange={(event) => setWeight(event.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        disabled={!selectedPackage || selectedPackage.status === "shipped"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>承运商</Label>
                    <Select
                      value={carrier}
                      onValueChange={setCarrier}
                      disabled={!selectedPackage || selectedPackage.status === "shipped"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择承运商" />
                      </SelectTrigger>
                      <SelectContent>
                        {carrierOptions.map((item) => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>长（cm）</Label>
                    <Input value={length} onChange={(event) => setLength(event.target.value)} placeholder="长" disabled={!selectedPackage || selectedPackage.status === "shipped"} />
                  </div>
                  <div className="space-y-2">
                    <Label>宽（cm）</Label>
                    <Input value={width} onChange={(event) => setWidth(event.target.value)} placeholder="宽" disabled={!selectedPackage || selectedPackage.status === "shipped"} />
                  </div>
                  <div className="space-y-2">
                    <Label>高（cm）</Label>
                    <Input value={height} onChange={(event) => setHeight(event.target.value)} placeholder="高" disabled={!selectedPackage || selectedPackage.status === "shipped"} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>运单号</Label>
                  <div className="flex gap-2">
                    <Input
                      value={trackingNo}
                      onChange={(event) => setTrackingNo(event.target.value)}
                      placeholder="确认称重时可自动生成"
                      disabled={!selectedPackage || selectedPackage.status === "shipped"}
                    />
                    <Button
                      variant="outline"
                      disabled={!selectedPackage || selectedPackage.status === "shipped"}
                      onClick={() => {
                        if (!selectedPackage) return;
                        setTrackingNo(buildTrackingNo(carrier, selectedPackage.packageNo));
                      }}
                    >
                      <Printer className="h-4 w-4" />
                      生成
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={!selectedPackage || selectedPackage.status === "shipped"}
                    onClick={handleConfirmWeight}
                  >
                    <Ruler className="h-4 w-4" />
                    确认称重
                  </Button>
                  <Button
                    variant="default"
                    disabled={!selectedPackage || selectedPackage.status !== "pending_ship"}
                    onClick={handleShip}
                  >
                    <Truck className="h-4 w-4" />
                    确认出库
                  </Button>
                  <Button variant="outline" disabled={!selectedPackage}>
                    <Printer className="h-4 w-4" />
                    打印面单
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>出库包裹列表</CardTitle>
                    <CardDescription>复核完成后进入待称重，称重完成后进入待出库。</CardDescription>
                  </div>
                  <Badge variant="secondary">{filteredPackages.length} 个包裹</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="搜索包裹号、箱号、订单号、客户"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="col-span-5">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="处理状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">待处理</SelectItem>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="pending_weight">待称重</SelectItem>
                        <SelectItem value="pending_ship">待出库</SelectItem>
                        <SelectItem value="shipped">已出库</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>包裹号</TableHead>
                        <TableHead>订单号</TableHead>
                        <TableHead>客户</TableHead>
                        <TableHead>承运商</TableHead>
                        <TableHead>重量</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPackages.map((item) => (
                        <TableRow key={item.packageNo} className={item.packageNo === selectedPackageNo ? "bg-table-row-hover" : ""}>
                          <TableCell className="font-mono">{item.packageNo}</TableCell>
                          <TableCell className="font-mono text-sm">{item.orderNo}</TableCell>
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>{item.carrier}</TableCell>
                          <TableCell>{item.weight ? `${item.weight} kg` : <span className="text-muted-foreground">未称重</span>}</TableCell>
                          <TableCell><StatusBadge {...outboundPackageStatusMap[item.status]} /></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => selectPackage(item)}>
                              {item.status === "shipped" ? <CheckCircle2 className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                              处理
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        }
      />
    </WMSLayout>
  );
}
