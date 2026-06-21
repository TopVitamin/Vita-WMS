import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, Play, XCircle } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "../components/business";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";
import { createPutawayOrderFromReceipt, completeInspectionTask, listInspectionTasks, startInspectionTask, type InspectionConclusion, type InspectionTask } from "../services/mock";

const inspectionStatusMap = {
  待质检: { label: "待质检", tone: "warning" as const },
  质检中: { label: "质检中", tone: "info" as const },
  已质检: { label: "已质检", tone: "success" as const },
  待退货处理: { label: "待退货处理", tone: "error" as const },
};

interface InboundInspectionPageProps {
  onNavigate: (path: string) => void;
}

export default function InboundInspectionPage({ onNavigate }: InboundInspectionPageProps) {
  const [tasks, setTasks] = useState<InspectionTask[]>(() => listInspectionTasks());
  const [selectedTaskNo, setSelectedTaskNo] = useState<string | null>(() => listInspectionTasks()[0]?.taskNo || null);
  const [conclusions, setConclusions] = useState<Record<string, InspectionConclusion>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const task = useMemo(() => tasks.find((item) => item.taskNo === selectedTaskNo) || null, [selectedTaskNo, tasks]);

  const refresh = (nextSelectedTaskNo?: string) => {
    const nextTasks = listInspectionTasks();
    setTasks(nextTasks);
    setSelectedTaskNo(nextSelectedTaskNo || selectedTaskNo || nextTasks[0]?.taskNo || null);
  };

  const handleStart = () => {
    if (!task) return;
    const started = startInspectionTask(task.taskNo);
    if (!started) {
      toast.error("当前任务不能开始质检");
      return;
    }
    refresh(started.taskNo);
    toast.success(`质检任务 ${started.taskNo} 已开始`);
  };

  const handleSubmit = () => {
    if (!task) return;
    if (task.items.some((item) => !conclusions[item.sku])) {
      toast.error("请为每个 SKU 选择质检结论");
      return;
    }
    try {
      const result = completeInspectionTask(
        task.taskNo,
        task.items.map((item) => ({ sku: item.sku, conclusion: conclusions[item.sku], note: notes[item.sku] }))
      );
      if (!result) {
        toast.error("当前任务不能提交质检结果");
        return;
      }
      const putawayOrder = result.qualifiedReceipt ? createPutawayOrderFromReceipt(result.qualifiedReceipt) : undefined;
      refresh(result.task.taskNo);
      setConclusions({});
      setNotes({});
      toast.success(
        putawayOrder
          ? `质检完成，合格品已生成上架单 ${putawayOrder.putawayNo}`
          : "质检完成：全部商品待退货处理"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "提交质检结果失败");
    }
  };

  return (
    <WMSLayout title="质检任务" currentPath="/inbound/inspection" onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">质检任务</h1>
            <p className="mt-1 text-sm text-muted-foreground">收货后先质检，合格品才允许进入上架任务；不合格品保留在隔离/退货处理链路。</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refresh()}><ClipboardCheck className="mr-2 h-4 w-4" />刷新任务</Button>
            {task?.status === "待质检" && <Button onClick={handleStart}><Play className="mr-2 h-4 w-4" />开始质检</Button>}
            {task?.status === "质检中" && <Button onClick={handleSubmit}><CheckCircle2 className="mr-2 h-4 w-4" />提交质检结果</Button>}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader><CardTitle>待处理任务</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {tasks.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">暂无质检任务</p>
              ) : tasks.map((item) => (
                <button
                  key={item.taskNo}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${item.taskNo === selectedTaskNo ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                  onClick={() => { setSelectedTaskNo(item.taskNo); setConclusions({}); setNotes({}); }}
                >
                  <div className="flex items-center justify-between gap-2"><span className="font-mono text-sm font-medium">{item.taskNo}</span><StatusBadge {...inspectionStatusMap[item.status]} /></div>
                  <p className="mt-2 text-xs text-muted-foreground">ASN：{item.inboundId} · 容器：{item.containerNo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.items.length} 个 SKU · {item.items.reduce((sum, line) => sum + line.qty, 0)} 件</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{task ? `任务明细：${task.taskNo}` : "选择一个质检任务"}</CardTitle></CardHeader>
            <CardContent>
              {!task ? <p className="py-16 text-center text-sm text-muted-foreground">收货后生成的质检任务会显示在这里。</p> : (
                <>
                  <div className="mb-5 grid gap-3 rounded-lg bg-muted/40 p-4 text-sm md:grid-cols-4">
                    <div><span className="text-muted-foreground">入库单</span><p className="font-mono">{task.inboundId}</p></div>
                    <div><span className="text-muted-foreground">收货批次</span><p className="font-mono">{task.receiptBatchNo}</p></div>
                    <div><span className="text-muted-foreground">暂存库位</span><p className="font-mono">{task.sourceLocationCode}</p></div>
                    <div><span className="text-muted-foreground">当前状态</span><p className="mt-1"><StatusBadge {...inspectionStatusMap[task.status]} /></p></div>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>商品</TableHead><TableHead className="text-right">数量</TableHead><TableHead>质检结论</TableHead><TableHead>备注</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {task.items.map((item) => {
                        const disabled = task.status !== "质检中";
                        const conclusion = item.conclusion || conclusions[item.sku];
                        return <TableRow key={item.sku}>
                          <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                          <TableCell><p>{item.productName}</p><p className="text-xs text-muted-foreground">{item.spec}</p></TableCell>
                          <TableCell className="text-right font-mono">{item.qty}</TableCell>
                          <TableCell>
                            {disabled ? <StatusBadge {...(conclusion === "合格" ? { label: "合格", tone: "success" as const } : conclusion === "不合格" ? { label: "不合格", tone: "error" as const } : { label: "待检", tone: "muted" as const })} /> : (
                              <Select value={conclusion || ""} onValueChange={(value) => setConclusions((prev) => ({ ...prev, [item.sku]: value as InspectionConclusion }))}>
                                <SelectTrigger className="w-[110px]"><SelectValue placeholder="选择" /></SelectTrigger>
                                <SelectContent><SelectItem value="合格">合格</SelectItem><SelectItem value="不合格">不合格</SelectItem></SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>{disabled ? <span className="text-sm text-muted-foreground">{item.note || "-"}</span> : <Textarea value={notes[item.sku] || ""} onChange={(event) => setNotes((prev) => ({ ...prev, [item.sku]: event.target.value }))} className="min-h-9" placeholder="选填" />}</TableCell>
                        </TableRow>;
                      })}
                    </TableBody>
                  </Table>
                  {task.status === "待退货处理" && <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><XCircle className="h-4 w-4" />存在不合格品：合格品已转上架，不合格品需由采购退货流程接管。</div>}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WMSLayout>
  );
}
