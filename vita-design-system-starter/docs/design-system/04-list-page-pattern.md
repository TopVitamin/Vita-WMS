# List Page Pattern

## 适用场景

列表页用于管理业务对象和单据，例如：

| 系统 | 页面示例 |
|---|---|
| WMS | SKU 管理、库存查询、入库管理、出库管理 |
| ERP | 采购订单、销售订单、库存台账、结算单 |
| SRM | 供应商档案、询价单、送货预约 |
| OMMS | 工单列表、设备台账、维保计划 |

## 标准结构

```tsx
<ListPageLayout
  header={<PageHeader />}
  kpis={<KpiGrid />}
  filters={<FilterBar />}
  batchActions={<BatchActionBar />}
  table={<DataTableShell />}
/>
```

## 组件职责

| 组件 | 职责 | 禁止承载 |
|---|---|---|
| `PageHeader` | 页面标题、说明、顶部主操作 | 表格筛选项 |
| `KpiGrid` | 页面级 KPI 指标组 | 单行状态 Badge |
| `FilterBar` | 查询条件、筛选条件 | 批量操作按钮 |
| `BatchActionBar` | 已选中数据后的批量动作 | 常驻工具按钮 |
| `DataTableShell` | 表格标题、说明、toolbar、分页外壳 | 页面级标题 |
| `StatusBadge` | 状态展示 | 业务判断逻辑 |

## 列表页规则

1. 新增列表页必须先使用 `ListPageLayout`。
2. KPI 不得直接散落在页面根部，必须进入 `KpiGrid`。
3. 筛选区不得直接用独立 `Card` 手拼，必须进入 `FilterBar`。
4. 表格外壳必须用 `DataTableShell`，分页进入 `pagination`。
5. 状态列必须用 `StatusBadge + statusMap`。
6. 批量操作只在有选中项时出现，使用 `BatchActionBar`。

## 推荐页面节奏

| 顺序 | 区块 | 说明 |
|---:|---|---|
| 1 | `PageHeader` | 说明当前业务对象和主操作。 |
| 2 | `KpiGrid` | 展示总数、异常数、待处理数等关键指标。 |
| 3 | `FilterBar` | 放高频筛选项，不超过 6 个首屏字段。 |
| 4 | `BatchActionBar` | 选中数据后出现。 |
| 5 | `DataTableShell` | 列表主体和分页。 |

## 模板

可直接复制：

```text
src/app/templates/ListPageTemplate.tsx
```

复制后必须替换：

| 模板项 | 替换为 |
|---|---|
| `TemplateRecord` | 新系统业务类型 |
| `templateRows` | service 返回数据 |
| `templateStatusMap` | 新系统状态映射 |
| 页面标题和字段 | 真实业务对象 |

## 反例

```tsx
// 禁止：页面自己拼多个 Card
<div className="p-6">
  <Card>总数</Card>
  <Card>筛选</Card>
  <Card><Table /></Card>
</div>
```

```tsx
// 推荐：使用标准模式
<ListPageLayout
  header={...}
  kpis={...}
  filters={...}
  table={...}
/>
```
