import { useMemo, useState, type KeyboardEvent } from "react";
import {
  ExceptionDialog,
  DataTableHeaderRow,
  OperationLogList,
  QuantityProgress,
  ScanInputPanel,
  WorkflowPageLayout,
  WorkflowStepBar,
} from "../components/business";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import type { OperationLogItem, WorkflowStep } from "../types/design-system";

const workflowSteps: WorkflowStep[] = [
  { id: "identify", label: "识别对象", description: "扫描单号" },
  { id: "execute", label: "执行作业", description: "扫描明细" },
  { id: "confirm", label: "确认完成", description: "提交结果" },
];

export function WorkflowPageTemplate() {
  const [currentStep, setCurrentStep] = useState("identify");
  const [scanCode, setScanCode] = useState("");
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [exceptionRemark, setExceptionRemark] = useState("");
  const [completedQty, setCompletedQty] = useState(0);
  const targetQty = 12;

  const operationLogs = useMemo<OperationLogItem[]>(
    () => [
      {
        id: "1",
        time: "09:30",
        action: "作业创建",
        detail: "系统生成待执行任务。",
        operator: "Vitamin",
      },
      {
        id: "2",
        time: "09:35",
        action: currentStep === "identify" ? "等待扫描" : "扫描完成",
        detail: currentStep === "identify" ? "请扫描业务单号进入下一步。" : `已完成 ${completedQty}/${targetQty}。`,
        operator: "Vitamin",
      },
    ],
    [completedQty, currentStep],
  );

  const handleScan = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !scanCode.trim()) return;

    if (currentStep === "identify") {
      setCurrentStep("execute");
    } else if (currentStep === "execute") {
      const nextQty = Math.min(targetQty, completedQty + 1);
      setCompletedQty(nextQty);
      if (nextQty >= targetQty) setCurrentStep("confirm");
    }

    setScanCode("");
  };

  return (
    <WorkflowPageLayout
      title="标准作业流页面模板"
      description="复制此模板创建收货、质检、派工、验收、复核等按步骤推进的页面。"
      steps={<WorkflowStepBar currentStepId={currentStep} steps={workflowSteps} />}
      sidebar={
        <>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>扫描操作</CardTitle>
              <CardDescription>根据当前步骤扫描单号、条码或对象编码。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScanInputPanel
                label={currentStep === "identify" ? "扫描业务单号" : "扫描明细条码"}
                value={scanCode}
                onChange={setScanCode}
                onEnter={handleScan}
                placeholder="按 Enter 确认"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setExceptionOpen(true)}>
                  登记异常
                </Button>
                <Button className="flex-1" disabled={completedQty < targetQty} onClick={() => setCurrentStep("confirm")}>
                  确认完成
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">数量进度</CardTitle>
            </CardHeader>
            <CardContent>
              <QuantityProgress current={completedQty} total={targetQty} />
            </CardContent>
          </Card>
        </>
      }
      primary={
        <>
          <Card>
            <CardHeader>
              <CardTitle>作业明细</CardTitle>
              <CardDescription>替换为新系统的明细表、任务清单或执行结果。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <DataTableHeaderRow>
                    <TableHead>对象编码</TableHead>
                    <TableHead>对象名称</TableHead>
                    <TableHead className="text-right">目标数量</TableHead>
                    <TableHead className="text-right">完成数量</TableHead>
                  </DataTableHeaderRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">TASK-001</TableCell>
                    <TableCell>示例作业对象</TableCell>
                    <TableCell className="text-right">{targetQty}</TableCell>
                    <TableCell className="text-right">{completedQty}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>操作日志</CardTitle>
            </CardHeader>
            <CardContent>
              <OperationLogList logs={operationLogs} />
            </CardContent>
          </Card>
        </>
      }
    >
      <ExceptionDialog
        open={exceptionOpen}
        onOpenChange={setExceptionOpen}
        title="异常处理"
        description="替换为缺货、错货、破损、超量、设备异常等业务字段。"
        footer={
          <>
            <Button variant="outline" onClick={() => setExceptionOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setExceptionOpen(false)}>确认登记</Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label>异常说明</Label>
          <Input value={exceptionRemark} onChange={(event) => setExceptionRemark(event.target.value)} placeholder="输入异常说明" />
        </div>
      </ExceptionDialog>
    </WorkflowPageLayout>
  );
}
