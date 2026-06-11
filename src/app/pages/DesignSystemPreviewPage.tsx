import { useState } from "react";
import { DataTableHeaderRow, BatchActionBar, ConfirmActionDialog, DataTableShell, DetailPageLayout, FilterBar, FormPageLayout, KpiCard, KpiGrid, ListPageLayout, OperationLogList, PageEmptyState, PageHeader, QuantityProgress, ScanInputPanel, StatusBadge, WorkflowPageLayout, WorkflowStepBar } from "../components/business";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface DesignSystemPreviewPageProps {
  onNavigate: (path: string) => void;
}

const steps = [
  { id: "identify", label: "识别对象", description: "扫描单号" },
  { id: "execute", label: "执行作业", description: "扫描明细" },
  { id: "confirm", label: "确认完成", description: "提交结果" },
];

const logs = [
  { id: "1", time: "09:30", action: "创建任务", detail: "系统生成待处理任务。", operator: "Vitamin" },
  { id: "2", time: "09:36", action: "扫描成功", detail: "识别对象 DEMO-001。", operator: "Vitamin" },
];

export default function DesignSystemPreviewPage({ onNavigate }: DesignSystemPreviewPageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");

  return (
    <WMSLayout title="设计系统" currentPath="/design-system" onNavigate={onNavigate}>
      <div className="space-y-6 p-6">
        <PageHeader
          title="Vita 后台 Design System"
          description="用于沉淀后台系统的设计语言、页面模式和可迁移组件。"
          actions={
            <Button variant="outline" onClick={() => onNavigate("/master-data/skus")}>
              查看业务页面示例
            </Button>
          }
        />

        <Tabs defaultValue="tokens">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="list">列表页</TabsTrigger>
            <TabsTrigger value="detail">详情页</TabsTrigger>
            <TabsTrigger value="form">表单页</TabsTrigger>
            <TabsTrigger value="workflow">作业流</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="mt-6 space-y-4">
            <KpiGrid columns={4}>
              <KpiCard label="主色" value="Primary" tone="primary" helper="用于主按钮、当前步骤、品牌高亮" />
              <KpiCard label="成功" value="Success" tone="success" helper="完成、正常、通过" />
              <KpiCard label="预警" value="Warning" tone="warning" helper="待处理、进行中、库存不足" />
              <KpiCard label="错误" value="Error" tone="error" helper="失败、取消、严重异常" />
            </KpiGrid>

            <Card>
              <CardHeader>
                <CardTitle>状态语义</CardTitle>
                <CardDescription>所有业务状态都应先映射到 tone，再通过 StatusBadge 展示。</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <StatusBadge label="已完成" tone="success" />
                <StatusBadge label="待处理" tone="warning" />
                <StatusBadge label="异常" tone="error" />
                <StatusBadge label="已创建" tone="info" />
                <StatusBadge label="已关闭" tone="muted" />
                <StatusBadge label="当前作业" tone="primary" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>空状态与确认弹窗</CardTitle>
                <CardDescription>空数据、搜索无结果、危险操作确认都应该使用统一组件。</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border">
                  <PageEmptyState
                    icon="search"
                    title="未找到匹配数据"
                    description="调整筛选条件或重置搜索后再试。"
                    action={{ label: "重置筛选", onClick: () => undefined }}
                  />
                </div>
                <div className="flex items-center justify-center rounded-lg border p-8">
                  <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                    打开危险操作确认
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <ListPageLayout
              header={<PageHeader title="标准列表页模式" description="用于 SKU、订单、供应商、工单等对象管理页。" />}
              kpis={
                <KpiGrid columns={4}>
                  <KpiCard label="总数" value={1280} />
                  <KpiCard label="待处理" value={42} tone="warning" />
                  <KpiCard label="处理中" value={86} tone="primary" />
                  <KpiCard label="已完成" value={1152} tone="success" />
                </KpiGrid>
              }
              filters={
                <FilterBar>
                  <Input placeholder="搜索编码或名称" />
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="done">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterBar>
              }
              batchActions={
                <BatchActionBar selectedCount={2}>
                  <Button size="sm" variant="outline">
                    批量导出
                  </Button>
                  <Button size="sm">批量处理</Button>
                </BatchActionBar>
              }
              table={
                <DataTableShell title="对象列表" pagination={<div className="text-sm text-muted-foreground">共 3 条</div>}>
                  <Table>
                    <TableHeader>
                      <DataTableHeaderRow>
                        <TableHead>编码</TableHead>
                        <TableHead>名称</TableHead>
                        <TableHead className="text-right">数量</TableHead>
                        <TableHead className="text-center">状态</TableHead>
                      </DataTableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {["DEMO-001", "DEMO-002", "DEMO-003"].map((code, index) => (
                        <TableRow key={code}>
                          <TableCell className="font-mono text-sm">{code}</TableCell>
                          <TableCell>示例业务对象 {index + 1}</TableCell>
                          <TableCell className="text-right">{(index + 1) * 24}</TableCell>
                          <TableCell className="text-center">
                            <StatusBadge label={index === 2 ? "已完成" : "处理中"} tone={index === 2 ? "success" : "primary"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DataTableShell>
              }
            />
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            <DetailPageLayout
              title="单据详情页模式"
              status={<StatusBadge label="执行中" tone="primary" />}
              description="用于 ERP/SRM/OMMS 中的订单、工单、对账单、送货单详情。"
              meta={
                <>
                  <span>单据号：DEMO-DETAIL-001</span>
                  <span>创建人：Vitamin</span>
                  <span>更新时间：2026-06-03 09:30</span>
                </>
              }
              actions={
                <>
                  <Button variant="outline">导出</Button>
                  <Button>审核通过</Button>
                </>
              }
              aside={
                <Card>
                  <CardHeader>
                    <CardTitle>状态流转</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OperationLogList logs={logs} />
                  </CardContent>
                </Card>
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>主信息</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
                  <div>
                    <div className="text-muted-foreground">业务对象</div>
                    <div className="mt-1">示例单据</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">组织</div>
                    <div className="mt-1">华东仓配中心</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">负责人</div>
                    <div className="mt-1">运营一组</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">优先级</div>
                    <div className="mt-1">
                      <Badge variant="outline">高</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DetailPageLayout>
          </TabsContent>

          <TabsContent value="form" className="mt-6">
            <FormPageLayout
              title="标准表单页模式"
              description="用于新增、编辑、审核配置等后台表单页面。"
              onCancel={() => undefined}
              onSubmit={() => undefined}
              submitLabel="保存配置"
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>对象名称</Label>
                  <Input placeholder="输入业务对象名称" />
                </div>
                <div className="space-y-2">
                  <Label>对象类型</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">标准对象</SelectItem>
                      <SelectItem value="exception">异常对象</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormPageLayout>
          </TabsContent>

          <TabsContent value="workflow" className="mt-6">
            <WorkflowPageLayout
              title="标准作业流模式"
              description="用于收货、拣货、打包、复核、盘点、质检、工单执行等按步骤推进页面。"
              steps={<WorkflowStepBar currentStepId="execute" steps={steps} />}
              sidebar={
                <>
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>扫描操作</CardTitle>
                      <CardDescription>扫描枪输入统一使用 ScanInputPanel。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ScanInputPanel
                        label="扫描条码"
                        value={scanCode}
                        onChange={setScanCode}
                        onEnter={() => undefined}
                        placeholder="按 Enter 确认"
                      />
                      <QuantityProgress current={8} total={12} />
                    </CardContent>
                  </Card>
                </>
              }
              primary={
                <Card>
                  <CardHeader>
                    <CardTitle>作业明细</CardTitle>
                    <CardDescription>右侧承载明细、结果、待处理清单和操作日志。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OperationLogList logs={logs} />
                  </CardContent>
                </Card>
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="确认执行危险操作？"
        description="该组件用于关闭、取消、删除、作废、驳回等需要二次确认的动作。"
        confirmLabel="确认执行"
        destructive
        onConfirm={() => setConfirmOpen(false)}
      />
    </WMSLayout>
  );
}
