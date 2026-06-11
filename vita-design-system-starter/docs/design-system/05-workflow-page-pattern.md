# Workflow Page Pattern

## 适用场景

作业流页面用于“按步骤推进”的后台或一线操作页面，例如：

| 系统 | 页面示例 |
|---|---|
| WMS | 到仓扫描、上架、拣货、打包、出库复核、盘点 |
| ERP | 采购收货、门店验收、退货处理、调拨出入库 |
| SRM | 送货签到、质检确认、对账异常处理 |
| OMMS | 工单派工、现场签到、维修执行、验收关闭 |

## 标准结构

```tsx
<WorkflowPageLayout
  title="作业标题"
  description="作业说明"
  steps={<WorkflowStepBar />}
  sidebar={操作区}
  primary={结果区}
>
  其他补充区块
</WorkflowPageLayout>
```

## 必用组件

| 组件 | 职责 |
|---|---|
| `WorkflowPageLayout` | 标准作业页外壳、标题、步骤区、左右栏。 |
| `WorkflowStepBar` | 展示当前作业步骤和进度位置。 |
| `ScanInputPanel` | 扫描枪输入、条码输入、Enter 触发。 |
| `QuantityProgress` | 当前数量 / 目标数量。 |
| `OperationLogList` | 最近操作记录。 |
| `ExceptionDialog` | 缺货、错货、破损、超量等异常登记。 |

## 作业流规则

1. 新增作业流页面必须先使用 `WorkflowPageLayout`。
2. 步骤条必须使用 `WorkflowStepBar`，不得手写散落步骤圆点。
3. 扫描输入必须使用 `ScanInputPanel`，不得每页重复写 Label + Input + Enter 逻辑样式。
4. 数量进度必须使用 `QuantityProgress`，不得直接散写 `Progress`。
5. 操作日志必须使用 `OperationLogList`。
6. 异常弹窗必须使用 `ExceptionDialog`。
7. 页面状态复杂时优先用局部 reducer 收口，不要把大量步骤状态散落在多个 `useState`。

## 左右栏分工

| 区域 | 放什么 |
|---|---|
| `sidebar` | 当前步骤操作区、扫描区、当前单据摘要、异常入口。 |
| `primary` | 明细表、进度、容器/箱/工单结果、待处理清单。 |
| `children` | 底部操作栏、日志、补充区块、弹窗挂载点。 |

## 模板

可直接复制：

```text
src/app/templates/WorkflowPageTemplate.tsx
```

复制后必须替换：

| 模板项 | 替换为 |
|---|---|
| `workflowSteps` | 新作业步骤 |
| `scanCode` | 实际扫描对象 |
| `operationLogs` | service 或本地状态日志 |
| `ExceptionDialog` 内容 | 业务异常字段 |

## 作业流命名

标题使用业务动作，不用系统名：

| 推荐 | 不推荐 |
|---|---|
| 到仓扫描 | 入库模块页面 |
| 出库复核 | 出库功能 |
| 采购收货 | 采购订单处理 |
| 工单验收 | OMMS 操作 |

## 反例

```tsx
// 禁止：每页重复写扫描输入样式
<Label>扫描条码</Label>
<Input className="text-lg h-14 font-mono" onKeyDown={handleScan} />
```

```tsx
// 推荐
<ScanInputPanel
  label="扫描条码"
  value={scanCode}
  onChange={setScanCode}
  onEnter={handleScan}
/>
```
