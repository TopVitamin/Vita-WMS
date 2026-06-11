import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRightLeft, CheckCircle2, MapPin, ScanLine } from "lucide-react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { completeTransferOrder, listTransferOrders } from "../services/mock";

interface InventoryTransferWorkspacePageProps {
  onNavigate: (path: string) => void;
}

export default function InventoryTransferWorkspacePage({ onNavigate }: InventoryTransferWorkspacePageProps) {
  const [sourceScan, setSourceScan] = useState("");
  const [targetScan, setTargetScan] = useState("");
  const [qtyScan, setQtyScan] = useState("");
  const [sourceConfirmed, setSourceConfirmed] = useState(false);
  const [targetConfirmed, setTargetConfirmed] = useState(false);
  const [qtyConfirmed, setQtyConfirmed] = useState(false);

  const transferNo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("transferNo") || "";
  }, []);
  const transfer = listTransferOrders().find((item) => item.transferNo === transferNo) || listTransferOrders()[0];
  const progress = [sourceConfirmed, targetConfirmed, qtyConfirmed].filter(Boolean).length / 3 * 100;

  const handleConfirmSource = () => {
    if (sourceScan.trim() !== transfer.fromLocation) {
      toast.error("来源库位不匹配");
      return;
    }
    setSourceConfirmed(true);
    toast.success("来源库位已确认");
  };

  const handleConfirmTarget = () => {
    if (targetScan.trim() !== transfer.toLocation) {
      toast.error("目标库位不匹配");
      return;
    }
    setTargetConfirmed(true);
    toast.success("目标库位已确认");
  };

  const handleConfirmQty = () => {
    if (Number(qtyScan) !== transfer.qty) {
      toast.error("移库数量不匹配");
      return;
    }
    setQtyConfirmed(true);
    toast.success("移库数量已确认");
  };

  const handleComplete = () => {
    if (!sourceConfirmed || !targetConfirmed || !qtyConfirmed) {
      toast.error("请先完成库位和数量校验");
      return;
    }

    const completed = completeTransferOrder(transfer.transferNo);
    if (!completed) {
      toast.error("提交失败");
      return;
    }
    toast.success(`${completed.transferNo} 已完成，库存流水已生成`);
    onNavigate("/inventory/transfer");
  };

  return (
    <WMSLayout title="移库执行" currentPath="/inventory/transfer" onNavigate={onNavigate}>
      <div className="mx-auto max-w-4xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onNavigate("/inventory/transfer")}>
            <ArrowLeft className="h-4 w-4" />
            返回移库列表
          </Button>
          <Badge variant="outline">{transfer.status}</Badge>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">移库单号</div>
                <div className="font-mono text-lg font-medium">{transfer.transferNo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">SKU</div>
                <div className="font-mono">{transfer.skuCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">商品</div>
                <div>{transfer.productName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">移库数量</div>
                <div className="text-lg font-medium">{transfer.qty} 件</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">执行进度</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className={sourceConfirmed ? "border-success-200 bg-success-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                扫描来源库位
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{transfer.fromLocation}</Badge>
              <div className="space-y-2">
                <Label>来源库位</Label>
                <Input value={sourceScan} onChange={(event) => setSourceScan(event.target.value)} placeholder={transfer.fromLocation} />
              </div>
              <Button className="w-full" onClick={handleConfirmSource} disabled={sourceConfirmed}>
                <ScanLine className="h-4 w-4" />
                确认来源
              </Button>
            </CardContent>
          </Card>

          <Card className={targetConfirmed ? "border-success-200 bg-success-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowRightLeft className="h-5 w-5" />
                扫描目标库位
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{transfer.toLocation}</Badge>
              <div className="space-y-2">
                <Label>目标库位</Label>
                <Input value={targetScan} onChange={(event) => setTargetScan(event.target.value)} placeholder={transfer.toLocation} />
              </div>
              <Button className="w-full" onClick={handleConfirmTarget} disabled={targetConfirmed}>
                <ScanLine className="h-4 w-4" />
                确认目标
              </Button>
            </CardContent>
          </Card>

          <Card className={qtyConfirmed ? "border-success-200 bg-success-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5" />
                确认数量
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{transfer.qty} 件</Badge>
              <div className="space-y-2">
                <Label>实移数量</Label>
                <Input value={qtyScan} onChange={(event) => setQtyScan(event.target.value)} placeholder={String(transfer.qty)} />
              </div>
              <Button className="w-full" onClick={handleConfirmQty} disabled={qtyConfirmed}>
                <CheckCircle2 className="h-4 w-4" />
                确认数量
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button className="h-12 w-full text-base" onClick={handleComplete} disabled={transfer.status === "已完成"}>
          <CheckCircle2 className="h-5 w-5" />
          提交移库完成
        </Button>
      </div>
    </WMSLayout>
  );
}
