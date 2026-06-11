# Design Tokens

## Token 分层

| 层级 | 示例 | 用法 |
|---|---|---|
| Foundation | `--purple-600`、`--gray-200`、`--success-500` | 定义基础色阶，不建议页面直接使用。 |
| Semantic | `--primary`、`--background`、`--card`、`--border` | 组件和页面优先使用。 |
| Component | `--table-header-bg`、`--shadow-card`、`--card-padding` | 面向具体后台控件和布局。 |

## 品牌色迁移

Vita-WMS 当前使用紫色主题。迁移到 OMMS、SRM、ERP 时，只替换品牌色源头和语义映射，不要逐页改 class。

推荐替换点：

```css
--primary
--primary-hover
--primary-light
--accent
--accent-foreground
--ring
--sidebar-primary
```

示例：

```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --accent: #eff6ff;
  --accent-foreground: #1d4ed8;
  --ring: #2563eb;
  --sidebar-primary: #3b82f6;
}
```

## 状态色规范

业务状态不得直接绑定颜色，必须先映射到语义 tone。

| Tone | 语义 | 示例 |
|---|---|---|
| `success` | 已完成、启用、正常、通过 | 已收货、已审核、可用 |
| `warning` | 进行中、待处理、部分异常 | 拣货中、待审核、库存不足 |
| `error` | 失败、阻断、严重异常 | 已取消、缺货、超量 |
| `info` | 信息提示、中性进行态 | 已分配、待打印、已创建 |
| `muted` | 停用、关闭、未开始 | 停用、草稿、未开始 |
| `primary` | 当前步骤、主业务高亮 | 当前作业、主推荐动作 |

## 字体与密度

后台系统采用紧凑但可读的数据密度。根字号固定为 `16px`，业务正文使用 14px，禁止通过缩小根字号间接压缩整个界面。

| Token | 值 | 用法 |
|---|---:|---|
| `--font-size` | `16px` | 浏览器根字号，不允许页面覆盖。 |
| `--text-xs` | `0.75rem` | 12px，辅助信息、计数、时间。 |
| `--text-sm` | `0.875rem` | 14px，正文、表格、筛选和按钮。 |
| `--text-lg` | `1rem` | 16px，区块标题。 |
| `--text-2xl` | `1.5rem` | 24px，页面主标题。 |

### 字重层级

| 层级 | 字重 | 使用范围 |
|---|---:|---|
| 页面标题、弹窗标题 | 600 | 每个视觉区域仅保留一个主标题。 |
| 区块标题、表头、字段标签、选中导航 | 500 | 用于建立结构，不用于普通数据。 |
| 正文、表格数据、普通按钮和 Tab | 400 | 系统默认字重。 |
| KPI、库存数量、关键进度 | 500 | 必须同时配合字号或颜色形成层级。 |
| 作业大数字、阻断性结果 | 600 | 仅限扫描、盘点、称重等工作台。 |
| 700 | 禁止常规使用 | 仅允许品牌展示或极端警示。 |

同一组件不得仅依靠字重区分超过三个层级。普通表格单元格、日志正文、描述文字不得使用 `font-medium`。

禁止为了视觉冲击在后台列表、卡片、表格里使用 hero 级大字号。

## 圆角与间距

| Token | 值 | 说明 |
|---|---:|---|
| `--radius` | `0.5rem` | 后台卡片和按钮默认 8px 圆角。 |
| `--spacing-sm` | `0.5rem` | 控件内部紧凑间距。 |
| `--spacing-lg` | `1rem` | 表单组、工具栏间距。 |
| `--spacing-xl` | `1.5rem` | 页面区块 padding。 |

页面容器推荐 `p-6`、区块间距推荐 `space-y-4` 或 `space-y-6`。不要用装饰性大留白。

控件高度统一为 36px，紧凑控件为 32px；卡片圆角统一为 8px，按钮、输入框和 Tab 子项统一为 6px。任意尺寸只允许用于表格列宽、弹窗视口上限和业务可视化画布。

## 响应式护栏

- 桌面端使用多列数据布局，`1024px` 以下应逐步收敛列数。
- `640px` 以下业务 Grid 默认单列，工具栏必须允许换行。
- 状态 Tab 在窄屏内横向滚动，不得撑宽整个页面。
- 表格只能在自己的滚动容器内横向滚动，禁止让 `body` 或整个业务主区域横向滚动。
- 固定宽度输入框和 Select 必须受父容器 `max-width` 约束。

## 表格规范

表格用于密集信息展示，应遵循：

| 项 | 规则 |
|---|---|
| 表头 | 使用 `--table-header-bg` 和 `--table-header-text`。 |
| 行 hover | 使用 `--table-row-hover`。 |
| 数字列 | 右对齐。 |
| 编码列 | 使用 `font-mono text-sm`。 |
| 状态列 | 居中，使用 `StatusBadge`。 |

### 徽标尺寸

- 普通 `Badge` 与业务 `StatusBadge` 的最小高度统一为 `24px`。
- 默认字号为 `12px`，行高为 `16px`，水平内边距为 `10px`。
- 状态图标使用 `14px`，由组件内部统一控制，页面不得压缩徽标高度。
| 操作列 | 固定在最右侧，按钮用 icon 或短文本。 |

## 禁止

```tsx
// 禁止：页面直接写品牌色
<div className="text-[#9333ea]" />

// 禁止：页面直接写状态色
<Badge className="bg-green-100 text-green-700">已完成</Badge>

// 推荐：从 statusMap 到 StatusBadge
<StatusBadge {...orderStatusMap[item.status]} />
```
