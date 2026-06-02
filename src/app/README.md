# 🎨 WMS Design System

> 专为跨境电商仓储管理系统（WMS）打造的完整 Design System 和 Design Token 体系

[![Version](https://img.shields.io/badge/version-1.0.0-purple)](/)
[![Design Tokens](https://img.shields.io/badge/design_tokens-complete-success)](/)
[![组件](https://img.shields.io/badge/components-shadcn%2Fui-blue)](https://ui.shadcn.com/)

---

## 📖 简介

这是一套完整的 Design System，包含从 Design Token 到组件、模式的全方位规范，专为信息密集型的 B 端 WMS 系统设计。

### ✨ 核心特点

- 🟣 **紫色科技风主题** - 现代、专业、有科技感
- 📊 **信息密集优化** - 14px 基础字号，紧凑间距，清晰层级
- 🎯 **完整 Token 体系** - 颜色、间距、阴影、动画等 9 大类 Token
- 📦 **WMS 业务定制** - 7 种状态色、数据格式规范、专用组件
- 🚀 **开箱即用** - 基于 shadcn/ui，配套完整示例

---

## 🗂️ 文件结构

```
├── App.tsx                          # Design System 展示页面（可视化预览）
├── DESIGN_SYSTEM_GUIDE.md          # 📚 详细使用指南
├── TOKEN_REFERENCE.md              # 📋 Token 速查表
├── README.md                        # 本文件
├── styles/
│   └── globals.css                  # 🎨 所有 Design Token 定义
├── components/
│   ├── ui/                          # shadcn/ui 组件库
│   └── wms/                         # WMS 专用组件
│       ├── LoadingState.tsx         # 加载状态组件
│       ├── EmptyState.tsx           # 空状态组件
│       └── ErrorState.tsx           # 错误状态组件
```

---

## 🎨 Design Token 体系

### 1. 颜色系统（9 大色系）

| 类别          | Token 数量 | 主要用途                     |
| ------------- | ---------- | ---------------------------- |
| 🟣 紫色品牌色 | 10 个色阶  | 主按钮、品牌识别、主色调     |
| ⚫ 中性灰色   | 10 个色阶  | 文字、边框、背景层次         |
| ✅ 成功色     | 5 个色阶   | 成功提示、库存充足           |
| ⚠️ 警告色     | 5 个色阶   | 警告提示、低库存             |
| ❌ 错误色     | 5 个色阶   | 错误提示、缺货               |
| ℹ️ 信息色     | 5 个色阶   | 信息提示、待处理             |
| 📦 WMS 状态色 | 7 个       | 在库、低库存、缺货、待处理等 |

**示例**:

```css
--purple-600: #9333ea; /* 品牌主色 */
--status-in-stock: #22c55e; /* 在库状态 */
--status-low-stock: #f59e0b; /* 低库存 */
```

### 2. 间距系统（基于 4px）

```
--spacing-xs:  4px   | --spacing-xl:   24px
--spacing-sm:  8px   | --spacing-2xl:  32px
--spacing-md:  12px  | --spacing-3xl:  48px
--spacing-lg:  16px  |
```

**组件专用**:

- `--table-padding-x: 12px` (表格)
- `--form-spacing: 16px` (表单)
- `--card-padding: 24px` (卡片)

### 3. 阴影系统（6 级 Elevation）

```css
--shadow-xs    /* 微弱边界 */
--shadow-sm    /* 卡片默认 ⭐ */
--shadow-md    /* 悬浮卡片 */
--shadow-lg    /* 下拉菜单 ⭐ */
--shadow-xl    /* 模态框 */
--shadow-2xl   /* 最高层级 */
```

### 4. 动画系统

**时长**: `instant` (0ms) → `fast` (150ms) → `normal` (250ms) → `slow` (350ms)

**缓动**: `linear` | `ease-in` | `ease-out` | `ease-in-out` | `ease-bounce`

### 5. 更多 Token

- ✅ **透明度系统** - 0% 到 100% (11 个档位)
- ✅ **Z-Index 层级** - 9 层堆叠管理
- ✅ **图标尺寸** - xs (12px) 到 2xl (48px)
- ✅ **边框宽度** - thin/default/thick/heavy
- ✅ **圆角** - sm/md/lg/xl
- ✅ **字体** - 3 种字重、7 种字号

---

## 🧩 组件库

### Shadcn/UI 基础组件（43个）

Button, Input, Select, Table, Card, Badge, Dialog, Dropdown, Tooltip, Form... 等

### WMS 专用组件（3个）

#### 1. LoadingState - 加载状态

```jsx
<LoadingState size="md" message="加载库存数据..." />
```

#### 2. EmptyState - 空状态

```jsx
<EmptyState
  icon="package"
  title="暂无库存"
  description="还没有添加任何SKU"
  action={{ label: "添加SKU", onClick: handleAdd }}
/>
```

#### 3. ErrorState - 错误状态

```jsx
<ErrorState
  type="network"
  showAlert
  onRetry={handleRetry}
/>
```

---

## 📦 WMS 业务规范

### 状态色体系

| 状态   | Token                   | 颜色    | 使用场景 |
| ------ | ----------------------- | ------- | -------- |
| 在库   | `--status-in-stock`     | 🟢 绿色 | 库存充足 |
| 低库存 | `--status-low-stock`    | 🟡 橙色 | 需要补货 |
| 缺货   | `--status-out-of-stock` | 🔴 红色 | 无库存   |
| 待处理 | `--status-pending`      | 🔵 蓝色 | 等待操作 |
| 处理中 | `--status-processing`   | 🟣 紫色 | 进行中   |
| 已完成 | `--status-completed`    | 🟢 深绿 | 操作完成 |
| 已取消 | `--status-cancelled`    | ⚪ 灰色 | 已取消   |

### 数据格式规范

```
数字:    1,234 件
金额:    $12,345.67
日期:    2025-10-21 14:32
百分比:  98.5%
趋势:    ↑ 8.2% (绿色) / ↓ 3.5% (红色)
```

---

## 🚀 快速开始

### 1. 查看可视化展示

运行 `App.tsx`，查看所有 Token 和组件的可视化展示，包含 9 个 Tab：

- **颜色** - 所有颜色 Token 和色板
- **阴影** - 阴影体系和 Z-index 层级
- **间距** - 间距系统和使用场景
- **字体** - 字体层级和字重
- **图标** - 图标尺寸和 WMS 常用图标
- **动画** - 动画时长、缓动、透明度
- **数据** - 数据格式规范和示例
- **状态** - Loading/Empty/Error 组件展示
- **模式** - 表格、筛选、详情页等实际应用

### 2. 阅读使用指南

查看 `DESIGN_SYSTEM_GUIDE.md`，包含：

- ✅ 详细的 Token 使用方法
- ✅ 组件 API 文档
- ✅ 实际应用示例（库存列表、看板、表单）
- ✅ 最佳实践

### 3. 查询 Token

需要快速查找 Token？打开 `TOKEN_REFERENCE.md`，按类别索引所有 Token。

### 4. 在项目中使用

```jsx
// 1. 引入 Token（已在 globals.css 中定义）
import "./styles/globals.css";

// 2. 使用组件
import { Button } from "./components/ui/button";
import { LoadingState } from "./components/wms/LoadingState";

// 3. 使用 Token
<div style={{
  backgroundColor: 'var(--primary)',
  padding: 'var(--spacing-lg)',
  boxShadow: 'var(--shadow-card)'
}}>
  <Button>主操作</Button>
</div>
```

---

## 💡 设计理念

### 为什么是紫色？

紫色结合了红色的能量和蓝色的稳定，传达**科技感、专业性和创新**，适合现代 B 端产品。

### 为什么 14px 基础字号？

传统 B 端系统常用 16px，但 WMS 需要**在有限空间展示更多信息**，14px 在保证可读性的同时提升信息密度。

### 为什么这么多 Token？

完整的 Token 体系确保：

- ✅ **一致性** - 全局统一的视觉语言
- ✅ **可维护** - 改一处，全局更新
- ✅ **可扩展** - 轻松支持主题切换、多品牌
- ✅ **开发效率** - 设计师和开发对齐，减少沟通成本

---

## 📊 Token 统计

| 类别      | Token 数量 |
| --------- | ---------- |
| 颜色      | 70+        |
| 间距      | 11         |
| 阴影      | 10         |
| 动画      | 12         |
| 透明度    | 14         |
| Z-Index   | 9          |
| 图标尺寸  | 6          |
| 边框/圆角 | 8          |
| **总计**  | **140+**   |

---

## 🎯 适用场景

✅ **适合**:

- 跨境电商 WMS 系统
- ERP、CRM 等信息密集型 B 端系统
- 需要大量表格、表单、数据展示的后台
- 需要完整 Design System 的中大型项目

❌ **不适合**:

- C 端营销页面（过于正式）
- 移动端优先的应用（针对桌面端优化）
- 极简风格产品（Token 较丰富）

---

## 🔧 技术栈

- **React** - UI 框架
- **Tailwind CSS v4** - 样式框架
- **shadcn/ui** - 组件库
- **Lucide Icons** - 图标库
- **CSS Variables** - Token 实现

---

## 📝 最佳实践

### ✅ 推荐

```jsx
// 使用语义化 Token
<div style={{ color: 'var(--status-in-stock)' }}>在库</div>

// 使用专用状态组件
{loading && <LoadingState />}

// 使用统一的数据格式
{amount.toLocaleString()} 件
```

### ❌ 避免

```jsx
// 硬编码颜色
<div style={{ color: '#22c55e' }}>在库</div>

// 自定义简陋状态
{loading && <div>加载中...</div>}

// 不规范的数字格式
{amount} 件  // 没有千分位
```

---

## 🗺️ Roadmap

- [ ] 支持更多主题（蓝色、绿色版本）
- [ ] 暗色模式完善
- [ ] 可访问性（A11y）增强
- [ ] Figma 设计文件
- [ ] Storybook 文档
- [ ] 更多业务组件（图表、高级表格等）

---

## 📚 参考资源

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Design Tokens - W3C](https://www.w3.org/community/design-tokens/)
- [Material Design](https://m3.material.io/)

---

## 📄 许可证

MIT License - 可自由使用和修改

---

## 👥 维护团队

**产品经理** - WMS 产品团队  
**最后更新** - 2025-10-21

---

## 💬 反馈和建议

如有问题或建议，欢迎通过以下方式联系：

- 📧 Email: your-email@example.com
- 💬 Slack: #design-system
- 📝 Issues: GitHub Issues

---

<div align="center">
  <strong>用心打造的 WMS Design System 🎨</strong>
  <br>
  让设计和开发更高效，让产品更专业
</div>