# Design System 抽取路线图

## 当前结论

Vita-WMS 已经具备可抽取为通用后台 Design System 的基础，但还不是独立 npm 包。当前最稳妥的方式是“源码迁移包”：

```text
规则文档 + styles + components/ui + components/business + AppShell + templates
```

## 已完成

| 阶段 | 状态 | 结果 |
|---|---|---|
| Design token 初步整理 | 已完成 | `src/styles/globals.css` 已有颜色、间距、圆角、阴影、表格 token。 |
| 通用布局壳 | 已完成 | `AppShell` 已从 WMS 菜单中解耦。 |
| 状态展示收口 | 已完成 | `StatusBadge + wmsStatusMap` 已成为推荐路径。 |
| 列表页模式 | 已完成 | `ListPageLayout`、`PageHeader`、`KpiGrid`、`DataTableShell` 已落地。 |
| 作业流模式 | 已完成 | `WorkflowPageLayout`、`WorkflowStepBar`、`ScanInputPanel` 等已落地。 |
| 详情页模式 | 已完成 | `DetailPageLayout` 已落地，覆盖单据详情、主从表、状态流转。 |
| 表单页模式 | 已完成 | `FormPageLayout` 已落地，覆盖新增、编辑、审核、配置表单。 |
| 通用空状态 | 已完成 | `PageEmptyState` 已从 WMS 专属层抽到通用业务模式层。 |
| 危险操作确认 | 已完成 | `ConfirmActionDialog` 已落地，统一关闭、取消、删除、作废等确认动作。 |
| 组件预览页 | 已完成 | `/design-system` 已接入路由和侧边栏菜单。 |
| 可迁移文档 | 已完成 | `docs/design-system/` 已建立规范、模板和 AI 规则。 |
| 页面模板 | 已完成 | `ListPageTemplate.tsx`、`WorkflowPageTemplate.tsx` 已可编译。 |

## P0：迁移前必须完成

| 任务 | 目的 | 建议做法 |
|---|---|---|
| 把 `WmsStatusTone` 改成通用命名 | 已完成 | 已新增 `DesignStatusTone`，并保留 `WmsStatusTone` 兼容别名。 |
| 把 `src/app/types/wms.ts` 拆出通用类型 | 已完成 | 已新增 `src/app/types/design-system.ts`，迁移 `DesignStatusTone`、`KpiMetric`、`WorkflowStep`、`OperationLogItem`。 |
| 检查 `components/business` 是否仍 import WMS 配置 | 已完成 | WMS 专属 badge wrapper 已拆到 `components/wms/WmsStatusBadges.tsx`。 |
| 固化迁移包清单 | 方便复制给其他项目 | 保持 `MIGRATION_GUIDE.md` 与 `docs/design-system/07-migration-guide.md` 同步。 |

## P1：迁移体验增强

| 任务 | 目的 | 建议做法 |
|---|---|---|
| 新增 `DetailPageLayout` | 已完成 | 已抽详情页 Header、状态区、主从表、操作区。 |
| 新增 `FormPageLayout` | 已完成 | 已抽分组表单、底部固定操作栏、校验提示。 |
| 新增 `PageEmptyState` | 已完成 | 已从 WMS 空状态抽成通用版本。 |
| 新增 `ConfirmActionDialog` | 已完成 | 已统一危险操作确认组件。 |
| 建立组件预览页 | 已完成 | 已接入 `/design-system` 内部路由。 |

## P2：独立产品化

| 任务 | 目的 |
|---|---|
| 抽成独立 package | 多项目统一升级。 |
| 建 Storybook | 组件视觉回归和文档化。 |
| 增加 visual regression | 防止主题或组件改动破坏页面。 |
| 增加 codemod | 从旧页面批量迁移到标准模式。 |

## 下一个建议执行批次

下一轮建议做 P2 前的迁移演练：

1. 选一个非 WMS 领域，例如 ERP 采购订单或 SRM 供应商准入。
2. 只使用 `docs/design-system/`、`templates` 和通用组件，生成 2 个示例页面。
3. 验证是否无需复制 WMS 业务页面也能完成。
4. 根据演练结果补齐 `DetailPageLayout`、`FormPageLayout` 的缺口。
5. 再决定是否需要独立 package 或 Storybook。

完成迁移演练后，这套 Design System 的可复用性才算经过真实验证。
