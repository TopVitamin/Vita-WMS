# Component Usage

## 基础控件层

`src/app/components/ui/` 是基础控件层，来自 shadcn/Radix 风格组件。迁移时整体复制，业务页面不应修改这些组件来适配某个页面。

常用控件：

| 控件 | 用法 |
|---|---|
| `Button` | 页面动作、表格操作、弹窗确认。 |
| `Input` | 普通输入，扫描输入优先用 `ScanInputPanel`。 |
| `Select` | 枚举筛选、状态筛选。 |
| `Table` | 数据表格，必须放入 `DataTableShell`。 |
| `Dialog` | 基础弹窗，异常类弹窗优先用 `ExceptionDialog`。 |
| `Badge` | 基础徽标，业务状态优先用 `StatusBadge`。 |

## 业务模式层

| 组件 | 类型 | 迁移价值 | 说明 |
|---|---|---:|---|
| `KpiCard` | 数据展示 | 高 | 页面级指标卡。 |
| `PageHeader` | 页面结构 | 高 | 标题、说明、顶部动作。 |
| `KpiGrid` | 页面结构 | 高 | KPI 响应式网格。 |
| `FilterBar` | 页面结构 | 高 | 标准筛选区。 |
| `BatchActionBar` | 操作模式 | 高 | 表格多选后的批量操作。 |
| `DataTableShell` | 页面结构 | 高 | 表格标题、说明、toolbar、分页外壳。 |
| `ListPageLayout` | 页面模式 | 高 | 标准列表页总装。 |
| `DetailPageLayout` | 页面模式 | 高 | 单据详情、主从表、状态流转页面总装。 |
| `FormPageLayout` | 页面模式 | 高 | 新增、编辑、审核、配置表单页面总装。 |
| `StatusBadge` | 状态展示 | 高 | 所有业务状态统一入口。 |
| `PageEmptyState` | 状态展示 | 高 | 空数据、搜索无结果、未配置状态。 |
| `ConfirmActionDialog` | 操作模式 | 高 | 关闭、取消、删除、作废、驳回等危险动作确认。 |
| `WorkflowPageLayout` | 页面模式 | 高 | 标准作业页总装。 |
| `WorkflowStepBar` | 作业模式 | 高 | 步骤流展示。 |
| `ScanInputPanel` | 作业模式 | 高 | 扫描输入统一样式。 |
| `QuantityProgress` | 作业模式 | 高 | 数量进度统一样式。 |
| `OperationLogList` | 作业模式 | 中 | 操作日志列表。 |
| `ExceptionDialog` | 作业模式 | 高 | 异常处理弹窗外壳。 |

## 状态映射写法

新系统必须建立自己的状态映射：

```tsx
import type { DesignStatusTone } from "../types/design-system";

export const purchaseOrderStatusMap: Record<string, { label: string; tone: DesignStatusTone }> = {
  草稿: { label: "草稿", tone: "muted" },
  待审核: { label: "待审核", tone: "warning" },
  已审核: { label: "已审核", tone: "success" },
  已关闭: { label: "已关闭", tone: "muted" },
};
```

页面里：

```tsx
<StatusBadge {...purchaseOrderStatusMap[row.status]} />
```

## 图标规则

1. 按钮、菜单、步骤尽量使用 `lucide-react`。
2. 不手写 SVG 图标，除非项目已有专属图标资产。
3. 表格行操作优先用 icon button 或短文本按钮。
4. 不熟悉的 icon 必须有 `title` 或可见文本。

## 组件命名规则

| 类型 | 命名 |
|---|---|
| 页面模式 | `ListPageLayout`、`WorkflowPageLayout` |
| 详情/表单模式 | `DetailPageLayout`、`FormPageLayout` |
| 基础业务片段 | `KpiCard`、`StatusBadge` |
| 作业流片段 | `ScanInputPanel`、`QuantityProgress` |
| 系统配置 | `erpMenuConfig`、`srmStatusMap` |

## 不要做

1. 不要在 `components/ui` 写业务文案。
2. 不要为每个页面复制一个 `getStatusBadge`。
3. 不要为了单个页面修改 `AppShell`。
4. 不要把 WMS 的菜单和状态枚举复制到 ERP/SRM。
5. 不要只复制 CSS 后让页面自由发挥。
6. 不要把关闭、取消、删除、作废等危险动作做成普通按钮直接执行。
