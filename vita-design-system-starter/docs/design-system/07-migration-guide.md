# Migration Guide

## 结论

只复制一份 CSS 不够。要复用 Vita 后台设计语言，必须迁移“规则 + tokens + 组件 + 配置模式 + 页面模板”。

## 最小迁移包

```text
src/styles/
src/app/components/ui/
src/app/components/business/
src/app/components/layouts/AppShell.tsx
src/app/types/design-system.ts
src/app/templates/
docs/design-system/
DESIGN_SYSTEM_RULES.md
```

## 参考复制包

```text
src/app/components/wms/
src/app/configs/wmsShellConfig.ts
src/app/configs/wmsStatusMap.ts
MIGRATION_GUIDE.md
VITA_WMS_DESIGN_SYSTEM_AUDIT.md
```

参考复制包用于学习结构，复制到新系统后必须改名和改业务内容。

## 新系统需要替换的内容

| 内容 | 新系统怎么做 |
|---|---|
| 品牌名 | 新建 `erpBrandConfig`、`srmBrandConfig`。 |
| 菜单 | 新建 `erpMenuConfig`、`srmMenuConfig`。 |
| 状态 | 新建对应 `statusMap`。 |
| 业务类型 | 新系统业务类型单独维护，保留 `types/design-system.ts` 给通用组件使用。 |
| Mock/API | 替换 service 层，不直接在页面写大段 mock。 |
| 页面字段 | 从模板复制后替换列、筛选项、操作。 |

## 迁移步骤

### 1. 复制设计系统代码

复制最小迁移包，保证路径不变。路径变化会增加 AI 和开发者理解成本。

### 2. 替换主题

打开：

```text
src/styles/globals.css
```

只替换 semantic token 或品牌色源头。页面和组件继续使用 `bg-primary`、`text-muted-foreground`、`border` 等语义 class。

### 3. 建立系统布局包装

不要复制 `WMSLayout` 的名字。新系统新建自己的 Layout：

```tsx
import { AppShell } from "../components/layouts/AppShell";
import { erpBrandConfig, erpMenuConfig } from "../configs/erpShellConfig";

export function ERPLayout({ children, title, currentPath, onNavigate }) {
  return (
    <AppShell
      brand={erpBrandConfig}
      menuItems={erpMenuConfig}
      currentPath={currentPath}
      onNavigate={onNavigate}
      title={title}
      storageKey="erp_open_menus"
    >
      {children}
    </AppShell>
  );
}
```

### 4. 建立状态映射

每个系统都必须维护自己的状态映射。页面只消费映射结果，不决定颜色。

```tsx
export const supplierStatusMap = {
  待准入: { label: "待准入", tone: "warning" },
  合作中: { label: "合作中", tone: "success" },
  已停用: { label: "已停用", tone: "muted" },
};
```

### 5. 从模板创建页面

列表页从这里复制：

```text
src/app/templates/ListPageTemplate.tsx
```

作业流页从这里复制：

```text
src/app/templates/WorkflowPageTemplate.tsx
```

### 6. 运行检查

每迁移一批页面后运行：

```bash
npm run typecheck
npm run build
```

## 给另一个 AI 的执行提示

```text
你必须先阅读 DESIGN_SYSTEM_RULES.md 和 docs/design-system/。
创建后台列表页时必须从 ListPageTemplate.tsx 开始。
创建作业流页面时必须从 WorkflowPageTemplate.tsx 开始。
状态展示必须通过 statusMap + StatusBadge。
不要直接复制 WMS 业务页面。
不要只复制 CSS。
不要修改 components/ui 和 AppShell 来适配单个页面。
```

## 完成验收

| 验收项 | 通过标准 |
|---|---|
| 视觉一致 | 新系统页面使用同一 token、间距、圆角、状态色。 |
| 结构一致 | 列表页和作业流页使用标准 Layout。 |
| 配置可替换 | 品牌、菜单、状态映射独立于基础组件。 |
| AI 可学习 | 文档说明了什么时候用什么组件。 |
| 构建可过 | `typecheck` 和 `build` 通过。 |
