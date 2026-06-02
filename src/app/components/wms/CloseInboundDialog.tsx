import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface CloseInboundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inboundId: string;
  onConfirm: (data: { reason: string; note: string }) => void;
}

export function CloseInboundDialog({
  open,
  onOpenChange,
  inboundId,
  onConfirm,
}: CloseInboundDialogProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!reason) {
      return;
    }
    onConfirm({ reason, note });
    setReason("");
    setNote("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-600" />
            关闭入库单
          </AlertDialogTitle>
          <AlertDialogDescription>
            确认要关闭入库单 <span className="font-mono text-foreground">{inboundId}</span> 吗？
            关闭后该入库单将无法继续收货和上架。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">关闭原因 *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="请选择关闭原因" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_cancel">客户取消</SelectItem>
                <SelectItem value="supplier_delay">供应商延期</SelectItem>
                <SelectItem value="order_error">单据错误</SelectItem>
                <SelectItem value="quality_issue">质量问题</SelectItem>
                <SelectItem value="other">其他原因</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">关闭说明</Label>
            <Textarea
              id="note"
              placeholder="可选填写详细说明..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            返回
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason}
          >
            确认关闭
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
