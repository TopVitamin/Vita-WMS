import { useState } from "react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { QuantityProgress, ScanInputPanel, WorkflowPageLayout, WorkflowStepBar } from "../components/business";
import {
  Package, CheckCircle, Scan, Ruler, Weight, Camera, Printer,
  Image as ImageIcon, AlertCircle, Check, X
} from "lucide-react";
import { completePackingForOutboundOrder } from "../services/mock";

interface PackingWorkspacePageProps {
  onNavigate: (path: string) => void;
}

export default function PackingWorkspacePage({ onNavigate }: PackingWorkspacePageProps) {
  const [orderNo, setOrderNo] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [currentStep, setCurrentStep] = useState<"scan-order" | "scan-items" | "package-info" | "complete">("scan-order");

  // Mock订单信息
  const orderInfo = currentStep !== "scan-order" ? {
    orderNo: orderNo || "SPF-2024-088888",
    customerName: "Shopify-US",
    recipientName: "张三",
    recipientPhone: "138****5678",
    address: "广东省深圳市南山区科技园南区深圳湾科技生态园10栋A座2001",
    items: [
      {
        skuCode: "ABC-123456",
        productName: "多功能蓝牙耳机",
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
        requiredQty: 2,
      },
      {
        skuCode: "ABC-123457",
        productName: "智能手环运动版",
        imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
        requiredQty: 1,
      },
      {
        skuCode: "JKL-901234",
        productName: "USB Type-C 充电线",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        requiredQty: 3,
      },
    ],
  } : null;

  // 扫描订单号
  const handleScanOrder = () => {
    if (orderNo) {
      setCurrentStep("scan-items");
    }
  };

  // 扫描商品
  const handleScanItem = (skuCode: string) => {
    setScannedItems([...scannedItems, skuCode]);
  };

  // 完成商品扫描
  const handleCompleteItemScan = () => {
    const allScanned = orderInfo?.items.every(item =>
      scannedItems.filter(s => s === item.skuCode).length >= item.requiredQty
    );
    if (allScanned) {
      setCurrentStep("package-info");
    } else {
      toast.error("还有商品未扫描完成");
    }
  };

  const handleMockCompleteScan = () => {
    if (!orderInfo) return;
    setScannedItems(orderInfo.items.flatMap((item) => Array.from({ length: item.requiredQty }, () => item.skuCode)));
    setCurrentStep("package-info");
  };

  // 完成打包
  const handleCompletePacking = () => {
    if (!orderInfo) return;

    const outboundPackage = completePackingForOutboundOrder({
      orderNo: orderInfo.orderNo,
      customer: orderInfo.customerName,
      boxNo: trackingNo || `BOX-${orderInfo.orderNo}`,
      items: orderInfo.items.map((item) => ({ sku: item.skuCode, qty: item.requiredQty })),
      weight: packageWeight ? Number(packageWeight) : undefined,
      length: packageLength ? Number(packageLength) : undefined,
      width: packageWidth ? Number(packageWidth) : undefined,
      height: packageHeight ? Number(packageHeight) : undefined,
      carrier: courier || undefined,
      trackingNo: trackingNo || undefined,
    });

    toast.success(`订单 ${orderInfo.orderNo} 打包完成，已生成包裹 ${outboundPackage.packageNo}`);
    setCurrentStep("complete");
    setTimeout(() => {
      // 重置状态，准备打包下一单
      setOrderNo("");
      setScannedItems([]);
      setPackageLength("");
      setPackageWidth("");
      setPackageHeight("");
      setPackageWeight("");
      setCourier("");
      setTrackingNo("");
      setCurrentStep("scan-order");
    }, 2000);
  };

  // 计算扫描进度
  const getItemProgress = (skuCode: string, requiredQty: number) => {
    const scannedCount = scannedItems.filter(s => s === skuCode).length;
    return Math.min((scannedCount / requiredQty) * 100, 100);
  };

  const currentStepId =
    currentStep === "scan-order" ? "order" : currentStep === "scan-items" ? "items" : currentStep === "package-info" ? "package" : "complete";

  return (
    <WMSLayout title="打包工作台" currentPath="/packing/workspace" onNavigate={onNavigate}>
      <WorkflowPageLayout
        title="打包工作台"
        description="扫描订单、校验商品、录入包裹信息并完成出库打包。"
        steps={
          <WorkflowStepBar
            currentStepId={currentStepId}
            steps={[
              { id: "order", label: "订单", description: "扫描订单号" },
              { id: "items", label: "校验", description: "扫描商品" },
              { id: "package", label: "打包", description: "重量尺寸" },
              { id: "complete", label: "完成", description: "提交结果" },
            ]}
          />
        }
        sidebar={
          <>
            {/* 步骤1：扫描订单号 */}
            {currentStep === "scan-order" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5" />
                    扫描订单号
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScanInputPanel
                    label="订单号 / 拣货单号"
                    placeholder="请扫描或输入订单号"
                    value={orderNo}
                    onChange={setOrderNo}
                    onEnter={(event) => {
                      if (event.key === "Enter") handleScanOrder();
                    }}
                    actionLabel="确认订单"
                    onAction={handleScanOrder}
                  />
                </CardContent>
              </Card>
            )}

            {/* 订单基本信息 */}
            {orderInfo && currentStep !== "scan-order" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">订单信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">订单号：</span>
                      <span className="font-mono">{orderInfo.orderNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">客户：</span>
                      <span>{orderInfo.customerName}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">收货信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">收货人</div>
                      <div className="font-medium">{orderInfo.recipientName}</div>
                      <div className="text-muted-foreground">{orderInfo.recipientPhone}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">收货地址</div>
                      <div>{orderInfo.address}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">商品清单</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {orderInfo.items.map((item, index) => {
                      const scannedCount = scannedItems.filter(s => s === item.skuCode).length;
                      const progress = getItemProgress(item.skuCode, item.requiredQty);
                      const isComplete = scannedCount >= item.requiredQty;

                      return (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          {item.imageUrl ? (
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-12 h-12 rounded object-cover border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium mb-1 truncate">{item.productName}</div>
                            <div className="text-xs text-muted-foreground mb-2 font-mono">{item.skuCode}</div>
                            {currentStep === "scan-items" && (
                              <>
                                <div className="flex items-center gap-2 mb-1 text-sm">
                                  <span className={isComplete ? "text-success-600" : "text-muted-foreground"}>
                                    {scannedCount} / {item.requiredQty} 件
                                  </span>
                                  {isComplete && <CheckCircle className="w-4 h-4 text-success-600" />}
                                </div>
                                <QuantityProgress current={scannedCount} total={item.requiredQty} />
                              </>
                            )}
                            {currentStep !== "scan-items" && (
                              <div className="text-sm text-muted-foreground">
                                数量：{item.requiredQty} 件
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        }
        primary={
          <>
            {/* 步骤2：扫描商品校验 */}
            {currentStep === "scan-items" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5" />
                    商品扫描校验
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScanInputPanel
                    label="扫描商品条码"
                    placeholder="请扫描商品条码进行校验"
                    value=""
                    onChange={() => {}}
                    onEnter={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          handleScanItem(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    helper="请逐个扫描商品条码，确保与订单清单一致"
                  />

                  <div className="flex gap-3">
                    <Button className="flex-1 h-12" onClick={handleCompleteItemScan}>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      完成扫描，进入打包
                    </Button>
                    <Button variant="secondary" className="h-12" onClick={handleMockCompleteScan}>
                      自动扫齐
                    </Button>
                    <Button variant="outline" className="h-12" onClick={() => setScannedItems([])}>
                      重新扫描
                    </Button>
                  </div>

                  {/* 已扫商品列表 */}
                  {scannedItems.length > 0 && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="text-sm font-medium mb-2">已扫描记录</div>
                        <div className="flex flex-wrap gap-2">
                          {scannedItems.map((sku, index) => (
                            <Badge key={index} variant="secondary" className="font-mono">
                              {sku}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 步骤3：包裹信息录入 */}
            {currentStep === "package-info" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="w-5 h-5" />
                      包裹信息录入
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 称重 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Weight className="w-4 h-4" />
                        包裹重量（kg）
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="请输入或自动获取重量"
                        value={packageWeight}
                        onChange={(e) => setPackageWeight(e.target.value)}
                        className="text-lg h-12"
                      />
                      <Button variant="outline" size="sm" className="w-full">
                        <Weight className="w-4 h-4 mr-2" />
                        连接电子秤读取
                      </Button>
                    </div>

                    {/* 测量尺寸 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        包裹尺寸（cm）
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          type="number"
                          placeholder="长"
                          value={packageLength}
                          onChange={(e) => setPackageLength(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="宽"
                          value={packageWidth}
                          onChange={(e) => setPackageWidth(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="高"
                          value={packageHeight}
                          onChange={(e) => setPackageHeight(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 上传照片 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        包裹照片（可选）
                      </Label>
                      <Button variant="outline" className="w-full h-12">
                        <Camera className="w-5 h-5 mr-2" />
                        拍照上传
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Printer className="w-5 h-5" />
                      快递信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 选择快递公司 */}
                    <div className="space-y-2">
                      <Label>快递公司</Label>
                      <Select value={courier} onValueChange={setCourier}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="选择快递公司" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SF">顺丰速运</SelectItem>
                          <SelectItem value="YTO">圆通速递</SelectItem>
                          <SelectItem value="ZTO">中通快递</SelectItem>
                          <SelectItem value="STO">申通快递</SelectItem>
                          <SelectItem value="EMS">中国邮政EMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 打印面单 */}
                    <Button variant="outline" className="w-full h-12">
                      <Printer className="w-5 h-5 mr-2" />
                      打印快递面单
                    </Button>

                    {/* 录入快递单号 */}
                    <div className="space-y-2">
                      <Label>快递单号</Label>
                      <Input
                        placeholder="扫描或输入快递单号"
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        className="font-mono h-12"
                      />
                    </div>

                    {/* 完成打包 */}
                    <Button
                      className="w-full h-14 text-lg"
                      onClick={handleCompletePacking}
                      disabled={!courier || !trackingNo}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      完成打包
                    </Button>
                  </CardContent>
                </Card>

                {/* 超重预警 */}
                {packageWeight && parseFloat(packageWeight) > 30 && (
                  <Card className="border-warning-200 bg-warning-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3 text-sm text-warning-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">超重提示</p>
                          <p className="text-warning-600">
                            当前包裹重量 {packageWeight}kg 超过快递限重 30kg，建议分包发货
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* 步骤4：完成状态 */}
            {currentStep === "complete" && (
              <Card className="border-success-200 bg-success-50">
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="w-24 h-24 text-success-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-medium text-success-700 mb-2">打包完成！</h3>
                  <p className="text-success-600">
                    订单 {orderInfo?.orderNo} 已完成打包
                  </p>
                  <p className="text-sm text-success-600 mt-4">
                    正在准备下一单...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 提示信息 */}
            {currentStep === "scan-order" && (
              <Card className="bg-info-50 border-info-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 text-sm text-info-700">
                    <Package className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">打包流程</p>
                      <ul className="text-info-600 space-y-1 list-disc list-inside">
                        <li>扫描订单号 / 拣货单号</li>
                        <li>逐个扫描商品条码进行校验</li>
                        <li>称重、测量尺寸、拍照</li>
                        <li>打印快递面单并粘贴</li>
                        <li>完成打包，进入下一单</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        }
      />
    </WMSLayout>
  );
}
