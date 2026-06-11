# Vita Design System Starter

这是从 Vita-WMS 中抽取出来的后台 Design System starter。它不是 WMS 业务项目，而是一套可迁移到 ERP、SRM、OMMS、OMS、TMS、CRM 等后台系统的前端设计语言和组件模板。

## 快速运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run typecheck
npm run build
```

## 目录结构

```text
docs/design-system/             # 设计规范、迁移说明、AI 执行规则
src/styles/                     # Design Tokens 和全局样式
src/app/components/ui/          # 基础 UI 控件
src/app/components/business/    # 后台业务模式组件
src/app/components/layouts/     # AppShell 通用后台布局
src/app/types/design-system.ts  # 通用类型
src/app/templates/              # 可复制页面模板
src/app/pages/                  # 预览页
```

## 迁移到新系统时复制什么

最小迁移包：

```text
docs/design-system/
src/styles/
src/app/components/ui/
src/app/components/business/
src/app/components/layouts/AppShell.tsx
src/app/types/design-system.ts
src/app/templates/
```

新系统只需要替换：

```text
品牌主题
菜单配置
状态映射
业务类型
service/mock/API 数据层
页面字段和文案
```

## 给 AI 的提示词

```text
请先阅读 docs/design-system/。

目标是基于 Vita 后台 Design System 创建新的后台系统页面，不要直接复制 WMS 业务页面。

必须遵守：
1. 列表页从 src/app/templates/ListPageTemplate.tsx 开始。
2. 作业流页面从 src/app/templates/WorkflowPageTemplate.tsx 开始。
3. 详情页使用 DetailPageLayout。
4. 表单页使用 FormPageLayout。
5. 空状态使用 PageEmptyState。
6. 危险操作确认使用 ConfirmActionDialog。
7. 状态展示必须使用 statusMap + StatusBadge。
8. 不要直接写品牌色十六进制值。
9. 新系统只改主题、菜单配置、状态映射、业务类型和 service 数据层。
10. 不要修改 components/ui 和 AppShell 来适配单个页面。
```

## 后续建议

正式发布到 GitHub 前，建议用一个非 WMS 场景做迁移演练，例如：

- ERP 采购订单列表 + 采购订单详情
- SRM 供应商准入列表 + 准入审核页
- OMMS 工单列表 + 工单执行页

迁移演练通过后，再考虑抽成独立 npm package 或引入 Storybook。
