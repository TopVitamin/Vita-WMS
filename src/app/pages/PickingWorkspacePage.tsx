import { useState } from "react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { QuantityProgress, ScanInputPanel, WorkflowPageLayout, WorkflowStepBar } from "../components/business";
import {
  ArrowLeft, Package, MapPin, AlertTriangle, Check, SkipForward,
  Image as ImageIcon
} from "lucide-react";

interface PickingWorkspacePageProps {
  onNavigate: (path: string) => void;
}

export default function PickingWorkspacePage({ onNavigate }: PickingWorkspacePageProps) {
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [inputQty, setInputQty] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock当前任务
  const taskInfo = {
    taskNo: "PK-20260602-0002",
    waveNo: "WV-20260602-002",
    totalItems: 45,
    pickedItems: 12,
  };

  // Mock拣货项
  const pickingItems = [
    {
      sequence: 13,
      skuCode: "ABC-123456",
      productName: "多功能蓝牙耳机",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      recommendedLocation: "A01-01-01",
      requiredQty: 20,
      unit: "件",
      batchNo: "LOT20260601",
    },
    {
      sequence: 14,
      skuCode: "ABC-123457",
      productName: "智能手环运动版",
      imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
      recommendedLocation: "A01-01-05",
      requiredQty: 15,
      unit: "件",
      batchNo: "LOT20260528",
    },
  ];

  const currentItem = pickingItems[currentIndex];
  const progress = ((taskInfo.pickedItems + currentIndex) / taskInfo.totalItems) * 100;

  // 确认拣货
  const handleConfirmPick = () => {
    toast.success(`确认拣货：${currentItem.productName}，数量：${inputQty || currentItem.requiredQty}`);
    if (currentIndex < pickingItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScannedBarcode("");
      setInputQty("");
    } else {
      toast.success("所有商品拣货完成");
      onNavigate("/picking/tasks");
    }
  };

  // 报缺货
  const handleReportShortage = () => {
    toast.warning(`已报告缺货：${currentItem.productName}`);
  };

  // 跳过
  const handleSkip = () => {
    toast.info(`已跳过当前商品：${currentItem.productName}`);
    if (currentIndex < pickingItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScannedBarcode("");
      setInputQty("");
    }
  };

  return (
    <WMSLayout title="拣货作业" currentPath="/picking/workspace" onNavigate={onNavigate}>
      <WorkflowPageLayout
        title="拣货作业"
        description="按推荐库位逐项扫描、确认数量并处理缺货异常。"
        actions={
          <Button variant="outline" onClick={() => onNavigate("/picking/tasks")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        }
        steps={
          <WorkflowStepBar
            currentStepId="pick"
            steps={[
              { id: "task", label: "任务", description: "读取拣货单" },
              { id: "pick", label: "拣货", description: "扫描商品" },
              { id: "confirm", label: "确认", description: "提交结果" },
            ]}
          />
        }
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">任务单号</div>
                <div className="font-mono text-lg font-medium">{taskInfo.taskNo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">波次号</div>
                <div className="font-mono text-lg">{taskInfo.waveNo}</div>
              </div>
            </div>
            <QuantityProgress current={taskInfo.pickedItems + currentIndex} total={taskInfo.totalItems} />
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">拣货进度</span>
              <span className="font-medium">
                {taskInfo.pickedItems + currentIndex} / {taskInfo.totalItems} 项
                <span className="text-muted-foreground ml-2">({progress.toFixed(0)}%)</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 中部：当前拣货项 */}
        <Card className="border-2 border-primary">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-lg px-4 py-1">
                第 {currentItem.sequence} 项
              </Badge>
            </div>

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

              {/* 推荐库位 */}
              <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-success-600" />
                  <span className="text-sm font-medium text-success-700">推荐库位</span>
                </div>
                <div className="text-center font-mono text-4xl font-semibold text-success-700">
                  {currentItem.recommendedLocation}
                </div>
              </div>

              {/* 应拣数量 */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">应拣数量</div>
                <div className="text-center text-5xl font-semibold text-primary tabular-nums">
                  {currentItem.requiredQty}
                  <span className="text-2xl font-normal text-muted-foreground ml-3">{currentItem.unit}</span>
                </div>
              </div>
            </div>

            {/* 扫描输入框 */}
            <div className="space-y-3">
              <ScanInputPanel
                label="扫描商品条码"
                placeholder="请扫描商品条码进行校验"
                value={scannedBarcode}
                onChange={setScannedBarcode}
                onEnter={(event) => {
                  if (event.key === "Enter") handleConfirmPick();
                }}
              />

              <ScanInputPanel
                label={`实际拣货数量（默认：${currentItem.requiredQty} ${currentItem.unit}）`}
                placeholder={currentItem.requiredQty.toString()}
                type="number"
                value={inputQty}
                onChange={setInputQty}
                onEnter={(event) => {
                  if (event.key === "Enter") handleConfirmPick();
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 底部：操作按钮 */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-16"
            onClick={handleReportShortage}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            <div>
              <div className="text-base">缺货上报</div>
              <div className="text-xs text-muted-foreground">库存不足</div>
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
              <div className="text-xs text-muted-foreground">暂不拣</div>
            </div>
          </Button>

          <Button
            size="lg"
            className="h-16"
            onClick={handleConfirmPick}
          >
            <Check className="w-5 h-5 mr-2" />
            <div>
              <div className="text-base">确认拣货</div>
              <div className="text-xs">进入下一项</div>
            </div>
          </Button>
        </div>

        {/* 提示信息 */}
        <Card className="bg-info-50 border-info-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 text-sm text-info-700">
              <Package className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">拣货路径已优化</p>
                <p className="text-info-600">
                  系统已根据库位位置优化拣货顺序，请按照推荐路径进行拣货以提高效率
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </WorkflowPageLayout>
    </WMSLayout>
  );
}
