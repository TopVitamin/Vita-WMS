# Vita-WMS Design System Rules

这份文档是给后续开发者和 AI 使用的设计系统执行规则。规则优先级高于 `README.md`、页面示例和历史代码。

## 必须遵守

1. 页面不得直接写业务状态 Badge，必须使用 `StatusBadge` 或 WMS 状态映射配置。
2. 列表页必须优先使用 `ListPageLayout` 组织 `PageHeader`、`KpiGrid`、`FilterBar`、`BatchActionBar`、`DataTableShell`。
3. 作业流页面必须优先使用 `WorkflowPageLayout` 组织 `WorkflowStepBar`、`ScanInputPanel`、`QuantityProgress`、`OperationLogList`、`ExceptionDialog`。
4. 详情页必须优先使用 `DetailPageLayout`，表单页必须优先使用 `FormPageLayout`。
5. 空数据、搜索无结果、未配置状态必须优先使用 `PageEmptyState`。
6. 关闭、取消、删除、作废、驳回等危险动作必须优先使用 `ConfirmActionDialog`。
7. 页面不得直接写品牌色十六进制值，例如 `#9333ea`、`#22c55e`。
8. 页面不得新增局部 `getStatusBadge` 作为长期方案；确需临时处理时，后续必须迁移到状态映射。
9. 新系统迁移时只改主题、菜单配置、状态映射，不改基础组件源码。
10. `components/ui` 是基础控件层，不能写 WMS 业务文案。
11. `components/business` 是业务模式层，应尽量接收配置和 children，不直接绑定某个页面。
12. `layouts/AppShell.tsx` 是通用后台布局壳；WMS 菜单和品牌应放在配置文件中。
13. 新增列表页不得自己拼散落的 KPI、筛选卡片、表格外壳、分页卡片；如确需例外，必须在代码旁说明原因。
14. 新增作业流页面不得自己拼散落的步骤条、扫描输入框、数量进度、异常弹窗和操作日志；如确需例外，必须在代码旁说明原因。
15. 字体只使用 400、500、600 三档常规字重；700 仅允许品牌或阻断性作业结果，禁止正文、表格数据和普通卡片使用。
16. 页面标题固定为 24px/600，区块标题为 16px/500，正文、表格、按钮和 Tab 为 14px/400；表头和字段标签为 14px/500。
17. 页面容器统一使用 24px 内边距，一级区块间距统一使用 16px；不得通过修改根字号压缩间距。
18. 卡片圆角统一为 8px，按钮、输入框和 Tab 子项统一为 6px；不得在业务页面新增装饰性大圆角。
19. 页面颜色必须使用语义 Token。除图表数据序列、进度宽度和第三方组件适配外，不得新增内联颜色。
20. 业务页面新增任意尺寸 class 前必须确认它属于表格列宽、弹窗视口上限或业务画布，否则使用标准 Tailwind 尺寸。
21. 移动端业务 Grid 必须收敛为单列，工具栏允许换行；Tab 和表格应在自身容器内滚动，不得撑宽 `body` 或整个主内容区。

## 推荐目录边界

```text
src/app/components/ui/          # Button、Input、Table、Dialog 等基础控件
src/app/components/business/    # KPI、筛选栏、状态徽标、作业流等模式组件
src/app/components/wms/         # WMS 专属包装，新系统迁移时只参考结构
src/app/components/layouts/     # AppShell、WMSLayout 包装
src/app/configs/                # 菜单、品牌、状态映射
src/app/types/design-system.ts  # Design System 通用类型
src/app/templates/              # 可复制页面模板
src/styles/                     # Design Token 与主题 CSS
docs/design-system/             # 设计规范、迁移说明、AI 执行规则
```

## 禁止写法

```tsx
// 禁止：页面局部散落状态颜色
const getStatusBadge = (status: string) => {
  return <Badge className="bg-success-50 text-success-600">已完成</Badge>;
};

// 禁止：页面写品牌色硬编码
<div style={{ color: "#9333ea" }} />

// 禁止：使用不存在的业务状态 token
<Badge style={{ backgroundColor: "var(--status-in-stock)" }} />
```

## 推荐写法

### 列表页结构

```tsx
import {
  BatchActionBar,
  DataTableShell,
  KpiCard,
  KpiGrid,
  ListPageLayout,
  PageHeader,
} from "./components/business";

<ListPageLayout
  header={<PageHeader title="SKU管理" description="维护 SKU 基础资料和库存策略。" />}
  kpis={
    <KpiGrid columns={4}>
      <KpiCard label="总SKU数" value={1280} />
      <KpiCard label="启用中" value={1200} tone="success" />
    </KpiGrid>
  }
  filters={<FilterBar>{/* filter controls */}</FilterBar>}
  batchActions={<BatchActionBar selectedCount={selectedCount}>{/* actions */}</BatchActionBar>}
  table={<DataTableShell title="SKU列表">{/* table */}</DataTableShell>}
/>
```

### 状态展示

- 普通 `Badge` 与业务 `StatusBadge` 最小高度统一为 `24px`，默认 `12px/16px` 字号与行高。
- 徽标水平内边距统一为 `10px`，状态图标统一为 `14px`；页面不得用局部样式压缩高度。

```tsx
import { StatusBadge } from "./components/business";
import { inboundOrderStatusMap } from "./configs/wmsStatusMap";

const status = inboundOrderStatusMap[item.status];
return <StatusBadge {...status} />;
```

### 作业流页面结构

```tsx
import {
  ExceptionDialog,
  OperationLogList,
  QuantityProgress,
  ScanInputPanel,
  WorkflowPageLayout,
  WorkflowStepBar,
} from "./components/business";

<WorkflowPageLayout
  title="到仓扫描"
  description="按 ASN、容器、库位、SKU 条码推进收货作业。"
  steps={<WorkflowStepBar currentStepId={currentStep} steps={steps} />}
  sidebar={<ScanInputPanel label="扫描条码" value={scanCode} onChange={setScanCode} onEnter={handleScan} />}
  primary={<QuantityProgress current={scannedQty} total={plannedQty} />}
>
  <OperationLogList logs={logs} />
  <ExceptionDialog open={open} onOpenChange={setOpen} title="异常处理" />
</WorkflowPageLayout>
```

```tsx
import { WMSLayout } from "./components/layouts/WMSLayout";

<WMSLayout title={title} currentPath={pathname} onNavigate={navigate}>
  {children}
</WMSLayout>
```

## 迁移原则

迁移到其他系统时，优先复制设计系统代码和规则文档。业务页面只作为参考，不作为规范来源。

新系统应优先替换：

1. `theme`：品牌色和主色。
2. `menuConfig`：侧边栏菜单。
3. `statusMap`：业务状态到视觉语义的映射。

## AI 执行入口

后续让 AI 复用这套设计系统时，必须提供：

```text
DESIGN_SYSTEM_RULES.md
docs/design-system/
src/app/templates/
```

列表页从 `src/app/templates/ListPageTemplate.tsx` 开始，作业流页面从 `src/app/templates/WorkflowPageTemplate.tsx` 开始。
