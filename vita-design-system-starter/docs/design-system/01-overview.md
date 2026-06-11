# Vita 后台 Design System 总览

## 定位

Vita 后台 Design System 是一套面向业务后台系统的前端设计规范和组件资产。当前来源于 Vita-WMS，但目标不是只服务 WMS，而是沉淀一套可迁移到 OMMS、SRM、ERP、OMS、TMS、CRM 等系统的后台设计语言。

## 设计原则

| 原则 | 说明 |
|---|---|
| 业务密度优先 | 后台系统以查找、筛选、对账、作业、异常处理为主，避免营销页式大留白和装饰性布局。 |
| 模式复用优先 | 新页面先判断属于列表页、详情页、作业流页、看板页，再套标准结构。 |
| 配置替换优先 | 新系统迁移时优先替换 theme、menuConfig、statusMap，不改基础组件源码。 |
| 状态语义统一 | 状态颜色必须从业务状态映射到 `success`、`warning`、`error`、`info`、`muted`、`primary`。 |
| 页面不散拼 | KPI、筛选区、批量操作、表格、步骤条、扫描框、异常弹窗必须优先使用模式组件。 |

## 分层结构

```text
src/styles/                     # Design Token、主题、全局样式
src/app/components/ui/          # 基础控件层，Button、Input、Table、Dialog 等
src/app/components/business/    # 业务模式层，列表页、作业流、高频后台模式组件
src/app/components/wms/         # WMS 专属业务包装，不作为通用迁移核心
src/app/components/layouts/     # 应用布局壳，AppShell、系统 Layout 包装
src/app/configs/                # 品牌、菜单、状态映射等配置
src/app/types/design-system.ts  # Design System 通用类型
src/app/templates/              # 可复制页面模板
docs/design-system/             # 设计规范、迁移说明、AI 执行规则
```

## 迁移边界

| 资产 | 是否推荐复制 | 说明 |
|---|---:|---|
| `src/styles/` | 是 | 复制后替换品牌色和主题 token。 |
| `src/app/components/ui/` | 是 | 基础控件层，尽量保持不改。 |
| `src/app/components/business/` | 是 | 后台页面模式层，迁移价值最高。 |
| `src/app/components/wms/` | 否 | WMS 专属包装，新系统应创建自己的业务包装层。 |
| `src/app/components/layouts/AppShell.tsx` | 是 | 通用后台框架壳。 |
| `src/app/types/design-system.ts` | 是 | 通用 tone、KPI、步骤、日志类型。 |
| `src/app/configs/wmsShellConfig.ts` | 参考 | 复制结构，不复制 WMS 菜单内容。 |
| `src/app/configs/wmsStatusMap.ts` | 参考 | 复制状态映射模式，不复制 WMS 状态枚举。 |
| `src/app/pages/` | 不建议整体复制 | 业务强绑定，只作为视觉和交互参考。 |

## 当前标准页面模式

| 页面类型 | 必用模式组件 | 适用场景 |
|---|---|---|
| 标准列表页 | `ListPageLayout`、`PageHeader`、`KpiGrid`、`FilterBar`、`BatchActionBar`、`DataTableShell` | SKU、库存、订单、供应商、客户、单据列表。 |
| 作业流页面 | `WorkflowPageLayout`、`WorkflowStepBar`、`ScanInputPanel`、`QuantityProgress`、`OperationLogList`、`ExceptionDialog` | 收货、上架、拣货、打包、复核、盘点、质检。 |
| 应用框架 | `AppShell` | 侧边栏菜单、顶部栏、用户区、主内容区域。 |

## 对其他 AI 的入口提示

把以下文件一起提供给另一个 AI：

```text
DESIGN_SYSTEM_RULES.md
MIGRATION_GUIDE.md
docs/design-system/
src/app/templates/
```

要求它先读规则，再写页面。不要让它直接从旧业务页面复制局部结构。
