import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ArrowLeft, Package, MapPin, Check, SkipForward, Camera,
  Image as ImageIcon, AlertCircle
} from "lucide-react";

interface StocktakingWorkspacePageProps {
  onNavigate: (path: string) => void;
}

export default function StocktakingWorkspacePage({ onNavigate }: StocktakingWorkspacePageProps) {
  const [scannedLocation, setScannedLocation] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [inputQty, setInputQty] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLocationInput, setShowLocationInput] = useState(true);

  // Mock当前盘点任务
  const taskInfo = {
    planNo: "PD-20260602-002",
    planName: "A库区定期盘点",
    totalItems: 45,
    countedItems: 12,
  };

  // Mock当前库位的商品列表
  const locationItems = [
    {
      skuCode: "ABC-123456",
      productName: "多功能蓝牙耳机",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      batchNo: "LOT20260601",
      bookQty: 150,
    },
    {
      skuCode: "ABC-123457",
      productName: "智能手环运动版",
      imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
      batchNo: "LOT20260528",
      bookQty: 200,
    },
  ];

  const currentLocation = "A01-01-01";
  const currentItem = showLocationInput ? null : locationItems[currentIndex];
  const progress = ((taskInfo.countedItems + currentIndex) / taskInfo.totalItems) * 100;

  // 扫描库位
  const handleScanLocation = () => {
    if (scannedLocation) {
      setShowLocationInput(false);
      setScannedLocation("");
    }
  };

  // 确认盘点
  const handleConfirmCount = () => {
    alert(`确认盘点：${currentItem?.productName}，实盘数量：${inputQty || currentItem?.bookQty}`);
    if (currentIndex < locationItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScannedBarcode("");
      setInputQty("");
    } else {
      // 完成当前库位，进入下一个库位
      alert("当前库位盘点完成！");
      setShowLocationInput(true);
      setCurrentIndex(0);
      setScannedBarcode("");
      setInputQty("");
    }
  };

  // 上报异常
  const handleReportIssue = () => {
    alert(`上报异常：${currentItem?.productName}`);
  };

  // 跳过
  const handleSkip = () => {
    alert(`跳过当前商品：${currentItem?.productName}`);
    if (currentIndex < locationItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScannedBarcode("");
      setInputQty("");
    }
  };

  return (
    <WMSLayout title="盘点作业" currentPath="/inventory/stocktaking/workspace" onNavigate={onNavigate}>
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {/* 顶部：任务信息 */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">盘点单号</div>
                <div className="font-mono text-lg font-medium">{taskInfo.planNo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">盘点名称</div>
                <div className="text-lg">{taskInfo.planName}</div>
              </div>
              <Button variant="outline" onClick={() => onNavigate("/inventory/stocktaking")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">盘点进度</span>
                <span className="font-medium">
                  {taskInfo.countedItems + currentIndex} / {taskInfo.totalItems} 项
                  <span className="text-muted-foreground ml-2">({progress.toFixed(0)}%)</span>
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* 中部：盘点操作区 */}
        {showLocationInput ? (
          // 步骤1：扫描库位
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-lg px-4 py-1">
                  第 1 步：扫描库位
                </Badge>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-primary" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-medium">扫描库位条码</label>
                  <Input
                    placeholder="请扫描库位条码"
                    value={scannedLocation}
                    onChange={(e) => setScannedLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScanLocation()}
                    className="text-lg h-14"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground">
                    扫描库位条码后，将显示该库位内的所有待盘点商品
                  </p>
                </div>

                <Button className="w-full h-14 text-lg" onClick={handleScanLocation} disabled={!scannedLocation}>
                  <Check className="w-5 h-5 mr-2" />
                  确认库位
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 步骤2：盘点商品
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200 px-4 py-1 mb-2">
                  当前库位：{currentLocation}
                </Badge>
                <div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-lg px-4 py-1">
                    第 {currentIndex + 1} / {locationItems.length} 个商品
                  </Badge>
                </div>
              </div>

              {currentItem && (
                <>
                  {/* 商品图片 */}
                  <div className="flex justify-center mb-6">
                    {currentItem.imageUrl ? (
                      <ImageWithFallback
                        src={currentItem.imageUrl}
                        alt={currentItem.productName}
                        className="w-48 h-48 rounded-lg object-cover border-2"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-lg border-2 bg-muted flex items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">商品名称</div>
                      <div className="text-2xl font-medium">{currentItem.productName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">SKU编码</div>
                        <div className="font-mono text-lg">{currentItem.skuCode}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">批次号</div>
                        <div className="font-mono text-lg">{currentItem.batchNo}</div>
                      </div>
                    </div>

                    {/* 账面数量（非盲盘模式显示） */}
                    <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
                      <div className="text-sm text-info-700 mb-2">账面数量（参考）</div>
                      <div className="text-4xl font-bold text-info-700 text-center">
                        {currentItem.bookQty}
                        <span className="text-xl font-normal text-info-600 ml-3">件</span>
                      </div>
                    </div>
                  </div>

                  {/* 输入区域 */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">扫描商品条码（可选）</label>
                      <Input
                        placeholder="扫描商品条码进行校验"
                        value={scannedBarcode}
                        onChange={(e) => setScannedBarcode(e.target.value)}
                        className="text-lg h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        实盘数量 <span className="text-error-500">*</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="请输入实际盘点数量"
                        value={inputQty}
                        onChange={(e) => setInputQty(e.target.value)}
                        className="text-lg h-14"
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground">
                        不填写将使用账面数量 {currentItem.bookQty} 件
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* 底部：操作按钮 */}
        {!showLocationInput && currentItem && (
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={handleReportIssue}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              <div>
                <div className="text-base">上报异常</div>
                <div className="text-xs text-muted-foreground">拍照记录</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={handleSkip}
            >
              <SkipForward className="w-5 h-5 mr-2" />
              <div>
                <div className="text-base">跳过</div>
                <div className="text-xs text-muted-foreground">暂不盘</div>
              </div>
            </Button>

            <Button
              size="lg"
              className="h-16"
              onClick={handleConfirmCount}
            >
              <Check className="w-5 h-5 mr-2" />
              <div>
                <div className="text-base">确认盘点</div>
                <div className="text-xs">进入下一项</div>
              </div>
            </Button>
          </div>
        )}

        {/* 提示信息 */}
        <Card className="bg-info-50 border-info-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 text-sm text-info-700">
              <Package className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">盘点流程</p>
                <ul className="text-info-600 space-y-1 list-disc list-inside">
                  <li>扫描库位条码，定位到具体库位</li>
                  <li>系统显示该库位内的所有待盘点商品</li>
                  <li>逐个盘点商品，输入实际数量</li>
                  <li>完成当前库位后，自动跳转到下一库位</li>
                  <li>如遇异常可拍照上报并继续</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WMSLayout>
  );
}
