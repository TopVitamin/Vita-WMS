# Vita-WMS Design System 走查报告

## 结论

当前项目已经具备 Design System 雏形，但还没有达到“可稳定复制给其他系统使用”的程度。核心问题不是缺少 UI 组件，而是规范边界没有收口：Token、组件、业务状态、布局配置和文档之间还没有形成单一真相源。

如果后续要迁移给 ERP、OMS、TMS、CRM 等其他后台系统使用，应先完成一轮项目内收口，再抽出通用设计系统资产。

## 当前资产盘点

| 类型 | 当前资产 | 判断 |
|---|---|---|
| CSS Token | `src/styles/globals.css`、`src/styles/index.css` | 有完整 token 基础，但品牌色和应用语义仍混在一个文件中 |
| 基础组件 | `src/app/components/ui`，约 48 个文件 | 可作为迁移基础，主要来自 shadcn/Radix 风格 |
| 业务组件 | `src/app/components/business`，约 8 个 TSX 组件 | 已开始抽象，但仍偏 WMS 场景 |
| 布局组件 | `src/app/components/layouts/WMSLayout.tsx` | 可支撑当前系统，但强绑定 WMS 菜单和品牌 |
| 文档 | `DESIGN_SYSTEM_GUIDE.md`、`TOKEN_REFERENCE.md`、`README.md` | 信息量足，但存在过时示例和互相冲突 |
| 页面 | `src/app/pages`，约 33 个页面 | 部分页面已迁移到业务组件，仍有大量局部样式和局部状态函数 |

## P0 问题

### P0-1：Design System 没有单一真相源

**现象**

- `src/styles/globals.css` 是实际 token 来源。
- `src/app/TOKEN_REFERENCE.md` 是 token 速查表。
- `src/app/DESIGN_SYSTEM_GUIDE.md` 是设计系统说明。
- `src/app/README.md` 仍保留旧状态色 token 示例。

**证据**

- `DESIGN_SYSTEM_GUIDE.md` 明确说明业务状态色不应定义在 token 层，应在应用层映射。
- `README.md` 仍出现 `--status-in-stock`、`--status-low-stock`、`--status-out-of-stock` 等旧示例。

**影响**

另一个 AI 或新开发者迁移时会不知道该相信哪份文档。它可能复制 README 中的旧状态 token，导致新项目继续扩散错误模式。

**建议改法**

1. 保留一份主入口文档：`DESIGN_SYSTEM_RULES.md`。
2. 把 `README.md` 中的旧状态 token 示例删除或标注为弃用。
3. `TOKEN_REFERENCE.md` 只保留实际存在于 CSS 中的 token。
4. `DESIGN_SYSTEM_GUIDE.md` 从“大而全说明”降级为参考文档，不作为 AI 迁移主入口。

建议主入口结构：

```text
DESIGN_SYSTEM_RULES.md
MIGRATION_GUIDE.md
src/design-system/
  styles/
  components/
  patterns/
```

### P0-2：业务状态展示仍大量散落在页面内

**现象**

多页面仍定义局部 `getStatusBadge` 或类似函数。扫描结果显示，至少以下页面存在局部状态 Badge 逻辑：

- `WaveDetailPage.tsx`
- `WaveListPage.tsx`
- `PutawayDetailPage.tsx`
- `InventoryDetailPage.tsx`
- `PackingTaskListPage.tsx`
- `InboundListPage.tsx`
- `InboundDetailPage.tsx`
- `OutboundDetailPage.tsx`
- `PutawayListPage.tsx`
- `PickingTaskDetailPage.tsx`
- `OutboundListPage.tsx`
- `StocktakingPlanListPage.tsx`
- `StocktakingDetailPage.tsx`

**影响**

状态展示是后台系统最容易不一致的地方。如果每个页面都自己写状态颜色，后续迁移到其他项目时无法保证状态语义一致。

**建议改法**

拆成三层：

```text
src/design-system/components/patterns/StatusBadge.tsx
src/design-system/configs/statusTone.ts
src/wms/configs/wmsStatusMap.ts
```

目标用法：

```tsx
<StatusBadge label={status.label} tone={status.tone} icon={status.icon} />
```

WMS 页面只负责选择业务状态映射，不直接写颜色：

```tsx
const status = wmsStatusMap.inboundOrder[item.status];
return <StatusBadge {...status} />;
```

### P0-3：`WMSLayout` 强绑定业务，不能原样迁移

**现象**

`WMSLayout.tsx` 内部硬编码：

- 品牌名：`Vita-WMS`
- 菜单：入库、出库、库存、基础数据、报表
- 路由匹配逻辑
- `sessionStorage` key：`wms_sidebar_open_menus`

**影响**

复制给其他系统时，必须修改组件源码。这会让“设计系统组件”退化成“业务页面代码”，迁移成本高，也容易改坏布局。

**建议改法**

拆成：

```text
src/design-system/components/patterns/AppShell.tsx
src/wms/configs/wmsMenuConfig.ts
src/wms/configs/wmsBrandConfig.ts
```

`AppShell` 只接收配置：

```tsx
<AppShell
  brand={wmsBrandConfig}
  menuItems={wmsMenuConfig}
  currentPath={pathname}
  onNavigate={navigate}
  user={currentUser}
/>
```

### P0-4：Token 层级没有拆分，主题迁移不够干净

**现象**

`globals.css` 同时包含：

- 基础色阶：`--purple-*`、`--gray-*`
- 语义 token：`--primary`、`--background`、`--card`
- 组件 token：`--table-header-bg`、`--sidebar`
- 布局 token：`--header-height`、`--sidebar-width`
- 图表 token
- dark mode token

**影响**

复制到其他系统时，很难判断哪些是“必须带走”，哪些是“Vita-WMS 专属主题”。如果新系统要换品牌色，容易直接改 `globals.css`，导致基础组件和业务组件耦合继续加深。

**建议改法**

拆成：

```text
src/design-system/styles/
  foundation.css       # gray、success、warning、error、info、spacing、radius、shadow
  semantic.css         # primary、background、card、border、input
  components.css       # table、sidebar、modal、chart
  theme-vita.css       # Vita 紫色品牌主题
  index.css
```

对外迁移时只要求新系统替换：

```text
theme-vita.css
menuConfig.ts
statusMap.ts
```

## P1 问题

### P1-1：业务组件抽象粒度还偏薄

**现象**

`DataTableShell` 当前只是一个外壳：

```tsx
<div className="rounded-lg border bg-card overflow-hidden">{children}</div>
```

`FilterBar` 当前只是固定 grid：

```tsx
<div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-6">{children}</div>
```

**影响**

它们能减少重复，但不能真正约束列表页规范。其他 AI 仍然可能自己写分页、空态、批量操作、表格标题、筛选按钮。

**建议改法**

把列表页模式升级为组件协议：

```tsx
<ListPageLayout
  header={<PageHeader />}
  kpis={<KpiGrid />}
  filters={<FilterBar />}
  actions={<BatchActionBar />}
  table={<DataTableShell />}
/>
```

`DataTableShell` 增加标准参数：

```tsx
type DataTableShellProps = {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  empty?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
};
```

### P1-2：页面里仍大量手写表格容器和表头背景

**现象**

多个页面直接写：

```tsx
<TableRow style={{ backgroundColor: "var(--table-header-bg)" }}>
```

或者：

```tsx
<div className="border rounded-lg overflow-hidden">
```

**影响**

表格视觉靠页面自觉维护，而不是靠组件保证。后续换主题或调整密度时要改很多页面。

**建议改法**

1. 给 `TableHeaderRow` 或 `DataTable` 提供统一组件。
2. 页面不再直接设置表头背景。
3. 所有列表页和详情页明细表统一使用 `DataTableShell`。

### P1-3：基础组件仍有部分规范和 token 不一致

**现象**

- `Card` 使用 `rounded-xl`，而当前设计规范更偏后台工具，建议控制在 8px 左右。
- 部分组件和页面存在 `text-[10px]`、`text-[0.8rem]` 等任意值。
- 页面中存在大量 `px-6`、`gap-6`、`p-4` 这类 Tailwind 直接值。

**影响**

这些不一定是错误，但它说明当前规范靠 Tailwind 原子类堆叠，而不是靠明确的设计 token 和组件密度控制。迁移后新项目容易走样。

**建议改法**

1. 明确后台系统密度规范：`comfortable`、`compact` 两档即可。
2. `Card`、`Table`、`Form`、`Dialog` 提供统一尺寸 variant。
3. 禁止页面层新增任意字号，如 `text-[10px]`，除非在规则文档中列入例外。

### P1-4：Design System 目录边界不清

**现象**

当前可迁移资产分散在：

```text
src/styles/
src/app/components/ui/
src/app/components/business/
src/app/components/layouts/
src/app/*.md
```

**影响**

给另一个项目复制时，很难判断应该带哪些文件。另一个 AI 可能把页面、mock、WMS 业务配置也一起复制过去。

**建议改法**

建立清晰目录：

```text
src/design-system/
  styles/
  components/
    ui/
    patterns/
  configs/
  docs/

src/wms/
  configs/
  pages/
  services/
```

## P2 问题

### P2-1：缺少给 AI 使用的短规则文档

**现象**

现有 `DESIGN_SYSTEM_GUIDE.md` 内容很全，但过长，不适合作为另一个 AI 的执行入口。

**影响**

AI 会摘取它认为重要的部分，但不一定抓住约束重点。

**建议改法**

新增 `DESIGN_SYSTEM_RULES.md`，控制在 1 到 2 页，只写强规则：

```md
1. 页面不得直接写业务状态 Badge，必须使用 StatusBadge + statusMap。
2. 列表页必须使用 PageHeader、KpiCard、FilterBar、DataTableShell。
3. 不允许在页面中直接写品牌色十六进制值。
4. 不允许复制旧页面里的 getStatusBadge 局部函数。
5. 新系统迁移时只改 theme、menuConfig、statusMap，不改基础组件源码。
```

### P2-2：缺少标准页面模板

**现象**

目前页面是业务实现，不是模板。虽然 SKU 管理、库存查询、拣货任务列表已经更接近标准列表页，但还没有明确的模板文件。

**影响**

复制到新系统时，另一个 AI 容易从任意页面学习，学到旧写法。

**建议改法**

新增：

```text
src/design-system/examples/
  StandardListPageExample.tsx
  StandardDetailPageExample.tsx
  StandardWorkflowPageExample.tsx
```

这三个文件只用于迁移参考，不接真实业务。

### P2-3：缺少自动化约束

**现象**

目前没有 lint 规则阻止页面层继续新增：

- 局部 `getStatusBadge`
- 硬编码色值
- 页面直接写表格头背景
- 业务状态 token

**影响**

即使完成一次整改，后续迭代也可能再次发散。

**建议改法**

后续可加轻量扫描脚本：

```text
scripts/check-design-system-rules.js
```

先不需要复杂 ESLint 插件，只做关键字符串扫描即可：

- 禁止 `--status-`
- 警告页面内 `getStatusBadge`
- 警告页面内 `style={{ backgroundColor: "var(--table-header-bg)" }}`
- 警告十六进制颜色出现在页面组件中

## 建议整改路线

### 第一阶段：规范收口

目标：先解决“谁是真相源”。

任务：

1. 新增 `DESIGN_SYSTEM_RULES.md`。
2. 新增 `MIGRATION_GUIDE.md`。
3. 清理 `README.md` 旧状态 token。
4. 校准 `TOKEN_REFERENCE.md` 和 `globals.css` 的实际 token。

### 第二阶段：状态体系收口

目标：让所有状态展示走统一入口。

任务：

1. 重构 `StatusBadge` 为纯展示组件。
2. 新增 `wmsStatusMap.ts`。
3. 先迁移列表页状态：
   - 入库列表
   - 出库列表
   - 波次列表
   - 上架列表
   - 拣货任务列表
   - 盘点计划列表

### 第三阶段：布局和列表模式收口

目标：让页面结构可复制。

任务：

1. 拆 `WMSLayout` 为 `AppShell + wmsMenuConfig + wmsBrandConfig`。
2. 增强 `DataTableShell`。
3. 新增 `PageHeader`、`KpiGrid`、`ListPageLayout`。
4. 迁移代表页面：
   - SKU 管理
   - 库存查询
   - 客户管理
   - 入库管理
   - 出库管理

### 第四阶段：抽通用目录

目标：形成可复制资产。

任务：

1. 建立 `src/design-system/`。
2. 把通用组件、样式、规则文档移入设计系统目录。
3. 把 WMS 业务配置留在 `src/wms/` 或当前业务目录。
4. 用一个标准页面示例验证迁移方式。

## 推荐优先处理清单

| 优先级 | 任务 | 价值 |
|---|---|---|
| P0 | 清理文档真相源 | 避免 AI 和开发者复制错误规范 |
| P0 | 拆状态映射 | 解决后台系统最大的不一致来源 |
| P0 | 拆 `AppShell` | 让布局可以迁移到其他系统 |
| P1 | 增强列表页组件协议 | 让页面结构可复制 |
| P1 | 收口表格外壳和表头 | 降低页面重复样式 |
| P2 | 补标准示例页 | 让另一个 AI 有稳定学习样本 |
| P2 | 加设计系统规则扫描脚本 | 防止后续迭代继续发散 |

## 迁移成熟度判断

当前成熟度：**2.5 / 5**

| 分数 | 含义 |
|---|---|
| 1 | 只有页面，没有规范 |
| 2 | 有 CSS token 和基础组件 |
| 3 | 有业务组件，但业务和通用未拆清 |
| 4 | 有通用设计系统目录、配置化布局、状态映射和规则文档 |
| 5 | 有示例页、自动化检查、可复制迁移包 |

当前 Vita-WMS 已经超过普通 Demo，但还没到可直接作为迁移包的状态。下一步最应该做的是 P0 三件事：文档真相源、状态体系、AppShell 拆分。
