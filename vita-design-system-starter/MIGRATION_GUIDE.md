# Vita 后台 Design System 迁移入口

这份文件是根目录入口。完整规范已经沉淀到：

```text
docs/design-system/
```

## 迁移结论

只复制 CSS 不够。要复用 Vita-WMS 已经沉淀出的后台设计语言，必须一起迁移：

```text
DESIGN_SYSTEM_RULES.md
docs/design-system/
src/styles/
src/app/components/ui/
src/app/components/business/
src/app/components/layouts/AppShell.tsx
src/app/types/design-system.ts
src/app/templates/
```

## 文档阅读顺序

| 顺序 | 文档 | 用途 |
|---:|---|---|
| 1 | `DESIGN_SYSTEM_RULES.md` | 强制规则，给开发者和 AI 看的红线。 |
| 2 | `docs/design-system/01-overview.md` | 设计系统定位、分层和迁移边界。 |
| 3 | `docs/design-system/02-design-tokens.md` | 颜色、状态、密度、间距、表格规范。 |
| 4 | `docs/design-system/03-layout-patterns.md` | AppShell、菜单、Header、页面容器。 |
| 5 | `docs/design-system/04-list-page-pattern.md` | 标准列表页模式。 |
| 6 | `docs/design-system/05-workflow-page-pattern.md` | 标准作业流页面模式。 |
| 7 | `docs/design-system/06-component-usage.md` | 组件职责和使用边界。 |
| 8 | `docs/design-system/07-migration-guide.md` | 迁移步骤和验收标准。 |
| 9 | `docs/design-system/08-ai-implementation-rules.md` | 让另一个 AI 按规则生成页面。 |
| 10 | `docs/design-system/09-extraction-roadmap.md` | 后续继续抽取和产品化路线。 |

## 可复制模板

```text
src/app/templates/ListPageTemplate.tsx
src/app/templates/WorkflowPageTemplate.tsx
```

新建 OMMS、SRM、ERP 页面时，应先复制模板，再替换字段、状态、service 和页面文案。

## 组件预览页

当前项目内置预览页：

```text
/design-system
```

该页面用于快速查看 tokens、列表页、详情页、表单页、作业流、空状态和危险操作确认组件。

## 不建议复制的内容

| 内容 | 原因 |
|---|---|
| `src/app/pages/` 全量页面 | 业务强绑定 WMS，只适合参考。 |
| `src/app/components/wms/` | WMS 专属包装，只参考结构，新系统应建立自己的业务包装层。 |
| `WMSLayout` 名称和菜单 | 新系统应新建自己的 `ERPLayout`、`SRMLayout`、`OMMSLayout`。 |
| WMS mock 数据 | 字段和流程不通用。 |
| 页面里的临时业务逻辑 | 迁移应走 service、types、statusMap 和模板。 |

## 给另一个 AI 的最短提示

```text
先读 DESIGN_SYSTEM_RULES.md 和 docs/design-system/。
只复制 CSS 不够，必须复制 components/ui、components/business、AppShell、templates 和规则文档。
新增列表页从 ListPageTemplate.tsx 开始。
新增作业流页面从 WorkflowPageTemplate.tsx 开始。
状态展示必须使用 statusMap + StatusBadge。
不要整页复制 WMS 业务页面。
```
