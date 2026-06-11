# Layout Patterns

## AppShell

`AppShell` 是通用后台应用框架，负责：

| 区域 | 职责 |
|---|---|
| Sidebar | 品牌、一级菜单、二级菜单、激活态。 |
| Header | 当前页面标题、搜索入口、用户区、退出入口。 |
| Main | 页面内容滚动区。 |

迁移到新系统时，不要改 `AppShell.tsx`。只新增系统自己的配置：

```tsx
export const erpBrandConfig = {
  name: "Vita-ERP",
  Icon: Building2,
};

export const erpMenuConfig = [
  { label: "首页", path: "/" },
  {
    label: "采购",
    path: "/purchase",
    subItems: [
      { label: "采购订单", path: "/purchase/orders" },
      { label: "采购入库", path: "/purchase/receipts" },
    ],
  },
];
```

## 页面容器

| 页面类型 | 外层结构 |
|---|---|
| 列表页 | `ListPageLayout` |
| 作业流页 | `WorkflowPageLayout` |
| 特殊看板 | `p-6 space-y-4`，但应优先抽出新的模式组件 |

## 侧边栏菜单规则

1. 一级菜单不超过 8 个。
2. 二级菜单使用业务对象或工作台名称，不使用技术名称。
3. 菜单激活态必须由 `match(path)` 配置，不在页面里手写。
4. 未完成页面可以标注“未完成”，但不应混入核心演示路径。

## Header 规则

1. Header 标题显示当前页面名称。
2. 页面内的 `PageHeader` 用于说明页面业务目标，不能替代 Header。
3. 搜索、用户、退出等全局动作放在 `AppShell`，不要每页重复写。

## 页面宽度

| 场景 | 建议 |
|---|---|
| 标准列表 | 内容区全宽，`p-6`。 |
| 作业流 | `max-w-7xl mx-auto p-6`，左右栏不超过 12 栅格。 |
| 详情页 | 使用 `DetailPageLayout`，承载 Header、状态、主从表和右侧状态流转。 |
| 表单页 | 使用 `FormPageLayout`，承载分组表单和底部操作栏。 |

## 迁移注意

`WMSLayout` 是 WMS 包装层，不是通用资产核心。迁移新系统时应建立自己的 `ERPLayout`、`SRMLayout` 或直接使用 `AppShell`。
