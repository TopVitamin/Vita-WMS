# WMS Design System 使用指南

## 📋 目录

1. [设计系统概述](#设计系统概述)
2. [Design Token 使用](#design-token-使用)
   - [颜色 Token](#1-颜色-token)
   - [间距 Token](#2-间距-token)
   - [阴影 Token](#3-阴影-token)
   - [动画 Token](#4-动画-token)
   - [Z-Index Token](#5-z-index-token)
   - [字体 Token](#6-字体-token)
   - [图标 Token](#7-图标-token)
   - [数据展示 Token](#8-数据展示-token)
   - [UI 状态 Token](#9-ui-状态-token)
3. [布局框架规范](#布局框架规范)
4. [组件使用指南](#组件使用指南)
5. [复杂交互规范](#复杂交互规范)
6. [图表规范](#图表规范)
7. [实际应用示例](#实际应用示例)
8. [最佳实践](#最佳实践)

---

## 🎨 设计系统概述

本 Design System 专为**跨境电商 WMS（仓储管理系统）**打造，采用紫色科技风主题，优化信息密集型界面的可读性和操作效率。

### 核心特点

- **紫色品牌色**:科技感的紫色系（`#9333ea`），传达专业和创新
- **信息密集优化**:基础字号 14px,紧凑的间距系统
- **语义化色彩系统**:Success/Warning/Error/Info 四种状态色系
- **响应式设计**:主要为桌面端优化,支持不同屏幕尺寸

---

## 🎯 Design Token 使用

### 1. 颜色 Token

#### 使用 CSS 变量

```css
/* 基础色 */
background-color: var(--purple-500); /* 品牌主色 */
color: var(--gray-700); /* 深色文字 */

/* 语义色 */
background-color: var(--primary); /* 主色 */
background-color: var(--success-500); /* 成功 */
background-color: var(--warning-500); /* 警告 */
background-color: var(--error-500); /* 错误 */
background-color: var(--info-500); /* 信息 */
```

#### 使用 Tailwind Class

```jsx
<div className="bg-primary text-primary-foreground">主按钮</div>
<div className="text-muted-foreground">次要文字</div>
<Badge className="bg-success text-white">成功</Badge>
```

#### 业务状态映射

**重要**：Design Token 应保持原子性，业务状态色应在应用层通过逻辑映射，而非在 Token 层定义。

```jsx
// ✅ 推荐：在组件/页面中定义业务逻辑映射
function getInventoryStatusColor(status) {
  const statusMap = {
    'in_stock': { color: 'var(--success-500)', label: '在库' },
    'low_stock': { color: 'var(--warning-500)', label: '低库存' },
    'out_of_stock': { color: 'var(--error-500)', label: '缺货' },
  };
  return statusMap[status] || { color: 'var(--gray-500)', label: '未知' };
}

// 使用
const status = getInventoryStatusColor(item.status);
<Badge style={{ backgroundColor: status.color, color: 'white' }}>
  {status.label}
</Badge>
```

```jsx
// 出库单状态映射示例
function getOrderStatusColor(status) {
  const statusMap = {
    'pending': { color: 'var(--info-500)', label: '待处理' },
    'picking': { color: 'var(--primary)', label: '拣货中' },
    'completed': { color: 'var(--success-600)', label: '已完成' },
    'cancelled': { color: 'var(--gray-400)', label: '已取消' },
  };
  return statusMap[status] || { color: 'var(--gray-500)', label: '未知' };
}
```

### 2. 间距 Token

```css
/* CSS 变量（注：因根字号 14px，实际渲染值为原注释的 7/8） */
padding: var(--spacing-sm); /* 实际渲染 7px - 表格内边距 */
padding: var(--spacing-md); /* 实际渲染 10.5px - 表格/表单 */
padding: var(--spacing-lg); /* 实际渲染 14px - 卡片 */
padding: var(--spacing-xl); /* 实际渲染 21px - 大区块 */

/* 组件专用 */
padding: var(--table-padding-x) var(--table-padding-y); /* 表格 */
gap: var(--form-spacing); /* 表单元素间距 */
```

### 3. 阴影 Token

```css
box-shadow: var(--shadow-sm); /* 卡片默认 */
box-shadow: var(--shadow-lg); /* 下拉菜单 */
box-shadow: var(--shadow-2xl); /* 模态框 */
box-shadow: var(--shadow-focus); /* 聚焦状态 */
```

### 4. 动画 Token

```css
transition: all var(--transition-fast); /* 150ms - hover */
transition: all var(--transition-normal); /* 250ms - 默认 */
transition: all var(--transition-slow); /* 350ms - 复杂动画 */

/* 带缓动函数 */
transition: transform var(--duration-normal) var(--ease-out);
```

### 5. Z-Index Token

```css
z-index: var(--z-dropdown); /* 1000 - 下拉菜单 */
z-index: var(--z-modal-backdrop); /* 1300 - 模态背景 */
z-index: var(--z-modal); /* 1400 - 模态框 */
z-index: var(--z-tooltip); /* 1600 - 提示框 */
```

### 6. 字体 Token

#### 字号系统

```css
/* 16px 根字号下的标准 B 端字号层级 */
--text-xs: 0.75rem;      /* 12px - 次要标签、辅助文字 */
--text-sm: 0.875rem;     /* 14px - 正文、表格、按钮 */
--text-base: 0.875rem;   /* 14px - 后台默认正文 */
--text-lg: 1rem;         /* 16px - 卡片和区块标题 */
--text-xl: 1.25rem;      /* 20px - 页面副标题 */
--text-2xl: 1.5rem;      /* 24px - 页面主标题 */
--text-3xl: 1.875rem;    /* 30px - KPI 和关键数据 */
```

#### 字重系统

```css
/* 字重 */
--font-weight-normal: 400;    /* 正文 */
--font-weight-medium: 500;    /* 标题、强调 */
--font-weight-semibold: 600;  /* 重要标题 */
```

#### 行高系统

```css
/* 行高 - 针对密集数据优化 */
--line-height-tight: 1.25;   /* 紧凑型，用于表格 */
--line-height-normal: 1.5;   /* 标准行高 */
--line-height-relaxed: 1.75; /* 放松型，用于长文本 */
```

#### 字体应用示例

```jsx
// 标题层级
<h1 className="text-2xl font-semibold">库存管理系统</h1>   {/* 24px, 600 */}
<h2 className="text-xl font-semibold">出库单详情</h2>      {/* 20px, 600 */}
<h3 className="text-lg font-medium">基本信息</h3>          {/* 16px, 500 */}

// 正文内容
<p className="text-base">这是标准文本内容</p>              {/* 14px, 400 */}
<span className="text-sm text-muted-foreground">辅助说明文字</span> {/* 14px, 400, 灰色 */}
<small className="text-xs text-muted-foreground">备注信息</small>  {/* 12px, 400, 灰色 */}

// 表格数据
<TableCell className="text-sm font-mono">SKU-001</TableCell> {/* 等宽字体 */}
<TableHead className="text-sm font-medium">商品名称</TableHead>

// 数字强调
<div className="text-3xl font-medium tabular-nums">12,458</div> {/* KPI */}
```

### 7. 图标 Token

#### 图标尺寸

```css
/* 图标尺寸系统 */
--icon-xs: 12px;   /* 最小图标，用于标签内部 */
--icon-sm: 16px;   /* 小图标，用于按钮、表格 */
--icon-md: 20px;   /* 中等图标，用于导航菜单 */
--icon-lg: 24px;   /* 大图标，用于标题旁边 */
--icon-xl: 32px;   /* 超大图标，用于空状态 */
--icon-2xl: 48px;  /* 特大图标，用于占位符 */
```

#### 图标使用规范

```jsx
import { Package, Search, AlertCircle, CheckCircle } from 'lucide-react';

// 按钮中的图标
<Button>
  <Package className="w-4 h-4 mr-2" /> {/* 16px, icon-sm */}
  添加商品
</Button>

// 表格操作图标
<Button variant="ghost" size="icon">
  <Search className="w-4 h-4" /> {/* 16px */}
</Button>

// 导航菜单图标
<MenuItem>
  <Package className="w-5 h-5 mr-3" /> {/* 20px, icon-md */}
  <span>库存管理</span>
</MenuItem>

// 状态指示图标
<div className="flex items-center gap-2">
  <CheckCircle className="w-4 h-4 text-success" />
  <span>操作成功</span>
</div>

// 空状态图标
<EmptyState>
  <Package className="w-12 h-12 text-muted-foreground" /> {/* 48px, icon-2xl */}
</EmptyState>
```

#### 图标颜色规范

```jsx
// ✅ 推荐：使用语义化颜色类
<CheckCircle className="w-4 h-4 text-success" />      {/* 成功 - 绿色 */}
<AlertCircle className="w-4 h-4 text-warning" />      {/* 警告 - 橙色 */}
<XCircle className="w-4 h-4 text-destructive" />      {/* 错误 - 红色 */}
<Info className="w-4 h-4 text-info" />                {/* 信息 - 蓝色 */}
<Package className="w-4 h-4 text-muted-foreground" /> {/* 中性 - 灰色 */}
<Sparkles className="w-4 h-4 text-primary" />         {/* 品牌 - 紫色 */}
```

### 8. 数据展示 Token

#### 数字格式化规范

```jsx
// 千分位格式
{quantity.toLocaleString('zh-CN')}  // 1,234,567

// 货币格式
{`¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}  // ¥12,345.67

// 百分比格式
{(rate * 100).toFixed(1)}%  // 85.5%

// 小数位控制
{weight.toFixed(2)} kg  // 15.50 kg
```

#### 日期时间格式化

```jsx
// 推荐使用 date-fns 或 dayjs
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 完整日期时间
{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}  // 2025-11-19 14:30:45

// 日期
{format(new Date(order.createdAt), 'yyyy-MM-dd')}  // 2025-11-19

// 时间
{format(new Date(order.createdAt), 'HH:mm')}  // 14:30

// 相对时间
{format(new Date(order.createdAt), 'MM月dd日')}  // 11月19日
```

#### 数字对齐规范

```jsx
// ✅ 推荐：数字右对齐
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>商品名称</TableHead>
      <TableHead className="text-right">数量</TableHead>
      <TableHead className="text-right">金额</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>商品A</TableCell>
      <TableCell className="text-right font-mono">1,234</TableCell>
      <TableCell className="text-right font-mono">¥12,345.67</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### 代码类数据展示

```jsx
// SKU、订单号等使用等宽字体
<span className="font-mono text-sm">SKU-20251119-001</span>
<span className="font-mono text-sm bg-muted px-2 py-1 rounded">IB-20251119-0001</span>

// 代码块
<pre className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
  {JSON.stringify(data, null, 2)}
</pre>
```

### 9. UI 状态 Token

#### 交互状态

```css
/* Hover 状态 */
--hover-bg: var(--accent);              /* hover 背景 */
--hover-opacity: 0.8;                   /* hover 透明度 */

/* Active 状态 */
--active-bg: var(--accent);             /* 激活背景 */
--active-scale: 0.98;                   /* 激活缩放 */

/* Focus 状态 */
--focus-ring: var(--ring);              /* 聚焦环颜色 */
--focus-ring-width: 2px;                /* 聚焦环宽度 */
--focus-ring-offset: 2px;               /* 聚焦环偏移 */

/* Disabled 状态 */
--disabled-opacity: 0.5;                /* 禁用透明度 */
--disabled-cursor: not-allowed;         /* 禁用鼠标样式 */
```

#### 状态应用示例

```jsx
// 按钮状态
<Button 
  className="transition-all hover:opacity-80 active:scale-98 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
>
  提交
</Button>

// 输入框状态
<Input
  className="focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={isSubmitting}
/>

// 表格行 hover
<TableRow className="hover:bg-accent/50 transition-colors cursor-pointer">
  <TableCell>...</TableCell>
</TableRow>

// 卡片 hover
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <CardContent>...</CardContent>
</Card>

// 链接状态
<a className="text-primary hover:underline hover:text-primary/80 transition-colors">
  查看详情
</a>
```

#### 加载状态规范

```jsx
// 按钮加载状态
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      处理中...
    </>
  ) : (
    '提交'
  )}
</Button>

// 表格加载状态
{isLoading ? (
  <TableRow>
    <TableCell colSpan={5} className="text-center py-8">
      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">加载中...</p>
    </TableCell>
  </TableRow>
) : (
  data.map(item => <TableRow key={item.id}>...</TableRow>)
)}

// Skeleton 加载占位
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
</div>
```

---

## 📐 布局框架规范

### 1. 整体布局结构

```
┌────────────────────────────────────────────────────────────┐
│  顶部导航栏 (Header) - 64px                                    │
├──────────┬────────────────────────────────────────────────┤
│          │                                                 │
│  侧边栏   │  主内容区 (Main Content)                          │
│  240px   │  padding: 24px                                  │
│          │                                                 │
│  (可收起  │                                                 │
│  64px)   │                                                 │
└──────────┴────────────────────────────────────────────────┘
```

### 2. 布局尺寸 Token

```css
/* 顶部栏 */
--header-height: 64px;
--header-padding-x: 24px;
--header-border-bottom: 1px solid var(--border);

/* 侧边栏 */
--sidebar-width: 240px;
--sidebar-width-collapsed: 64px;
--sidebar-padding-x: 16px;
--sidebar-menu-item-height: 40px;
--sidebar-submenu-indent: 24px;

/* 主内容区 */
--content-padding: 24px;
--content-max-width: 1600px; /* 超宽屏时的最大宽度 */
--content-spacing: 24px; /* 内容区块之间的间距 */

/* 页面标题区 */
--page-header-height: 72px;
--page-header-margin-bottom: 24px;
```

### 3. 布局应用示例

```jsx
// 主框架布局
<div className="flex h-screen">
  {/* 侧边栏 */}
  <aside 
    className="border-r transition-all"
    style={{ 
      width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
      transition: 'width var(--transition-normal)'
    }}
  >
    {/* 菜单内容 */}
  </aside>

  {/* 主内容区 */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* 顶部栏 */}
    <header 
      className="border-b flex items-center"
      style={{ 
        height: 'var(--header-height)',
        padding: '0 var(--header-padding-x)'
      }}
    >
      {/* 顶部导航 */}
    </header>

    {/* 页面内容 */}
    <main 
      className="flex-1 overflow-auto"
      style={{ padding: 'var(--content-padding)' }}
    >
      {/* 页面内容 */}
    </main>
  </div>
</div>
```

### 4. 响应式断点

```css
/* 桌面优先，向下兼容 */
--breakpoint-xl: 1536px; /* 超宽屏 */
--breakpoint-lg: 1280px; /* 大屏 */
--breakpoint-md: 1024px; /* 中屏（最小推荐尺寸）*/
--breakpoint-sm: 768px;  /* 小屏（收起侧边栏）*/
```

```jsx
// 响应式侧边栏示例
<aside className={cn(
  "border-r transition-all",
  "md:w-[240px]", // 中屏及以上显示完整侧边栏
  "sm:w-[64px]"   // 小屏自动收起
)}>
```

---

## 🎭 复杂交互规范

### 1. Modal / Dialog（模态框）

#### 尺寸规范

```css
/* 模态框尺寸 */
--modal-sm: 400px;   /* 小型确认框 */
--modal-md: 600px;   /* 中型表单 */
--modal-lg: 800px;   /* 大型表单 */
--modal-xl: 1000px;  /* 超大详情页 */
--modal-full: 90vw;  /* 全屏模式 */

/* 模态框组成部分 */
--modal-header-height: 64px;
--modal-header-padding: 20px 24px;
--modal-body-padding: 24px;
--modal-footer-height: 72px;
--modal-footer-padding: 16px 24px;
--modal-border-radius: 8px;
```

#### 样式规范

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Button } from "./components/ui/button";

// 标准模态框结构
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[600px]"> {/* 中型 */}
    {/* 标题区 - 64px 高 */}
    <DialogHeader style={{ minHeight: 'var(--modal-header-height)' }}>
      <DialogTitle>创建入库单</DialogTitle>
      <DialogDescription>
        请填写以下信息以创建新的入库单
      </DialogDescription>
    </DialogHeader>

    {/* 内容区 - 可滚动 */}
    <div style={{ padding: 'var(--modal-body-padding)' }}>
      {/* 表单内容 */}
    </div>

    {/* 底部按钮区 - 72px 高，按钮右对齐 */}
    <DialogFooter style={{ 
      minHeight: 'var(--modal-footer-height)',
      padding: 'var(--modal-footer-padding)'
    }}>
      <Button variant="outline" onClick={() => setOpen(false)}>
        取消
      </Button>
      <Button onClick={handleSubmit}>
        确认创建
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 按钮位置规范

```jsx
// ✅ 推荐：主要操作在右侧（符合阅读习惯）
<DialogFooter className="flex justify-end gap-3">
  <Button variant="outline">取消</Button>
  <Button variant="default">确定</Button>
</DialogFooter>

// ⚠️ 危险操作时：危险按钮在左侧（需要用户特意移动鼠标）
<DialogFooter className="flex justify-between">
  <Button variant="destructive">删除</Button>
  <div className="flex gap-3">
    <Button variant="outline">取消</Button>
    <Button variant="default">确定</Button>
  </div>
</DialogFooter>
```

### 2. Drawer（抽屉）

#### 适用场景

- 详情查看（如库存详情、出库单详情）
- 快速编辑
- 分步表单

#### 尺寸规范

```css
--drawer-sm: 360px;  /* 小抽屉 - 简单信息 */
--drawer-md: 480px;  /* 中抽屉 - 标准详情 */
--drawer-lg: 640px;  /* 大抽屉 - 复杂表单 */
--drawer-xl: 800px;  /* 超大抽屉 - 详细信息 */
```

### 3. Pagination（分页器）

#### 样式规范

```jsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "./components/ui/pagination";

// WMS 标准分页器 - 紧凑型，适合密集数据
<div className="flex items-center justify-between" style={{ marginTop: 'var(--spacing-lg)' }}>
  {/* 左侧：总数信息 */}
  <div className="text-sm text-muted-foreground">
    共 <span className="font-medium text-foreground">{total}</span> 条记录，
    第 <span className="font-medium text-foreground">{currentPage}</span> / {totalPages} 页
  </div>

  {/* 中间：页码 */}
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious 
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
      </PaginationItem>
      
      {/* 页码按钮 */}
      {[1, 2, 3, '...', totalPages].map((page, index) => (
        <PaginationItem key={index}>
          {page === '...' ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink 
              onClick={() => setPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
      
      <PaginationItem>
        <PaginationNext 
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>

  {/* 右侧：每页条数 */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">每页显示</span>
    <Select value={pageSize} onValueChange={setPageSize}>
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
        <SelectItem value="200">200</SelectItem>
      </SelectContent>
    </Select>
    <span className="text-sm text-muted-foreground">条</span>
  </div>
</div>
```

### 4. Toast / Notification（消息提示）

#### 规范

```jsx
import { toast } from "sonner";

// 成功提示
toast.success("入库单创建成功", {
  description: "单号：IB20251119001",
  duration: 3000,
});

// 错误提示
toast.error("操作失败", {
  description: error.message,
  duration: 5000,
});

// 警告提示
toast.warning("库存不足", {
  description: "SKU-001 当前库存仅剩 5 件",
  duration: 4000,
});

// 加载提示（需手动关闭）
const loadingToast = toast.loading("正在处理中...");
// 处理完成后
toast.dismiss(loadingToast);
toast.success("处理完成");
```

### 5. Popover / Tooltip（弹出层）

#### 定位优先级

```jsx
// 推荐使用顺序
placement="bottom-start"  // 1. 底部左对齐（默认）
placement="top-start"     // 2. 顶部左对齐
placement="right"         // 3. 右侧
placement="left"          // 4. 左侧
```

---

## 📊 图表规范

### 1. 图表配色序列

#### 主色系（用于单数据系列）

```css
--chart-primary: var(--primary);        /* #9333ea 紫色 */
--chart-primary-light: var(--purple-400); /* #c084fc */
--chart-primary-dark: var(--purple-600);  /* #7c3aed */
```

#### 多色系（用于多数据系列对比）

```css
/* 6色循环方案 - 兼顾区分度和美观 */
--chart-color-1: #9333ea; /* 紫色 - 主品牌色 */
--chart-color-2: #3b82f6; /* 蓝色 - 稳定可靠 */
--chart-color-3: #10b981; /* 绿色 - 增长趋势 */
--chart-color-4: #f59e0b; /* 橙色 - 警示 */
--chart-color-5: #ec4899; /* 粉色 - 补充 */
--chart-color-6: #06b6d4; /* 青色 - 中性 */

/* 渐变色（面积图） */
--chart-gradient-start: rgba(147, 51, 234, 0.2);
--chart-gradient-end: rgba(147, 51, 234, 0);
```

### 2. 图表类型使用场景

| 图表类型 | 使用场景 | 推荐配色 |
|---------|---------|---------|
| **折线图** | 库存趋势、出入库走势 | 单色：`--chart-primary`<br/>多色：color-1 ~ color-6 |
| **柱状图** | 月度对比、SKU排行 | 单色：`--chart-primary`<br/>多组：color-1, color-2 |
| **饼图** | 库存占比、状态分布 | 使用 WMS 状态色系 |
| **面积图** | 累计入库、库存变化 | 渐变：gradient-start → gradient-end |
| **条形图** | TOP N 排名、分类对比 | 单色：`--chart-primary` |

### 3. Recharts 配置示例

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 库存走势图（单线）
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis 
      dataKey="date" 
      tick={{ fill: 'var(--muted-foreground)' }}
      stroke="var(--border)"
    />
    <YAxis 
      tick={{ fill: 'var(--muted-foreground)' }}
      stroke="var(--border)"
    />
    <Tooltip 
      contentStyle={{
        backgroundColor: 'var(--popover)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
      }}
    />
    <Legend 
      wrapperStyle={{ color: 'var(--foreground)' }}
    />
    <Line 
      type="monotone" 
      dataKey="quantity" 
      stroke="var(--chart-color-1)" 
      strokeWidth={2}
      dot={{ fill: 'var(--chart-color-1)', r: 4 }}
      activeDot={{ r: 6 }}
      name="库存数量"
    />
  </LineChart>
</ResponsiveContainer>

// 出入库对比图（双线）
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="inbound" 
      stroke="var(--chart-color-3)" 
      strokeWidth={2}
      name="入库量"
    />
    <Line 
      type="monotone" 
      dataKey="outbound" 
      stroke="var(--chart-color-4)" 
      strokeWidth={2}
      name="出库量"
    />
  </LineChart>
</ResponsiveContainer>

// 库存状态饼图
<ResponsiveContainer width="100%" height={320}>
  <PieChart>
    <Pie
      data={statusData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={renderCustomLabel}
      outerRadius={100}
      fill="var(--chart-color-1)"
      dataKey="value"
    >
      {statusData.map((entry, index) => (
        <Cell 
          key={`cell-${index}`} 
          fill={entry.color} /* 使用 WMS 状态色 */
        />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### 4. 图表样式 Token

```css
/* 图表通用样式 */
--chart-height-sm: 240px;
--chart-height-md: 320px;
--chart-height-lg: 400px;
--chart-height-xl: 480px;

/* 图表间距 */
--chart-margin: 24px;
--chart-padding: 16px;

/* 网格线 */
--chart-grid-color: var(--border);
--chart-grid-dash: 3 3;

/* 坐标轴 */
--chart-axis-color: var(--muted-foreground);
--chart-axis-font-size: 12px;

/* Tooltip */
--chart-tooltip-bg: var(--popover);
--chart-tooltip-border: var(--border);
--chart-tooltip-shadow: var(--shadow-lg);
```

### 5. 图表容器示例

```jsx
// 标准图表卡片
<Card>
  <CardHeader>
    <CardTitle>库存走势</CardTitle>
    <CardDescription>最近30天库存变化趋势</CardDescription>
  </CardHeader>
  <CardContent style={{ padding: 'var(--chart-padding)' }}>
    <ResponsiveContainer width="100%" height={320}>
      {/* 图表内容 */}
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

## 🧩 组件使用指南

### 状态组件

#### LoadingState - 加载状态

```jsx
import { LoadingState } from "./components/wms/LoadingState";

<LoadingState size="md" message="正在加载库存数据..." />
<LoadingState size="sm" message="加载中..." />
<LoadingState size="lg" message="处理中，请稍候..." />
```

#### EmptyState - 空状态

```jsx
import { EmptyState } from "./components/wms/EmptyState";

<EmptyState
  icon="inbox"
  title="暂无数据"
  description="当前还没有任何记录"
/>

<EmptyState
  icon="search"
  title="未找到匹配结果"
  description="尝试调整筛选条件"
  action={{
    label: "清除筛选",
    onClick: () => handleClearFilters()
  }}
/>

<EmptyState
  icon="package"
  title="库存为空"
  description="该SKU当前库存为0，请及时补货"
  action={{
    label: "创建补货单",
    onClick: () => handleCreateOrder()
  }}
/>
```

**可用图标**：`package` | `search` | `inbox` | `alert`

#### ErrorState - 错误状态

```jsx
import { ErrorState } from "./components/wms/ErrorState";

// Alert 样式（页面顶部）
<ErrorState
  type="network"
  showAlert
  onRetry={() => handleRetry()}
/>

// 完整页面样式
<ErrorState
  type="server"
  title="加载失败"
  message="无法加载库存数据，请稍后重试"
  onRetry={() => handleRetry()}
/>
```

**可用类型**：`general` | `network` | `server` | `notfound`

---

## 💼 实际应用示例

### 示例 1: 库存列表页

```jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import { LoadingState } from "./components/wms/LoadingState";
import { EmptyState } from "./components/wms/EmptyState";

function InventoryListPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  if (loading) {
    return <LoadingState message="加载库存数据..." />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="暂无库存"
        description="还没有添加任何SKU"
        action={{
          label: "添加SKU",
          onClick: () => navigate('/inventory/add')
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 筛选表单 */}
      <div className="grid grid-cols-4 gap-4">
        <Input placeholder="搜索SKU..." />
        <Select placeholder="选择仓库" />
        <Select placeholder="状态筛选" />
        <Button>搜索</Button>
      </div>

      {/* 数据表格 */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU编码</TableHead>
            <TableHead>产品名称</TableHead>
            <TableHead>库存数量</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.sku}>
              <TableCell className="font-mono">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  style={{
                    backgroundColor: getStatusColor(item.status),
                    color: 'white'
                  }}
                >
                  {item.statusText}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">编辑</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusColor(status) {
  const colorMap = {
    'in_stock': 'var(--success-500)',
    'low_stock': 'var(--warning-500)',
    'out_of_stock': 'var(--error-500)',
  };
  return colorMap[status] || 'var(--gray-500)';
}
```

### 示例 2: 统计看板

```jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1>仓储数据看板</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总库存</CardDescription>
            <CardTitle className="text-3xl">12,458</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm" style={{ color: 'var(--success-500)' }}>
              ↑ 8.2% 较上月
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>低库存SKU</CardDescription>
            <CardTitle className="text-3xl">23</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm" style={{ color: 'var(--warning-500)' }}>
              ⚠ 需要补货
            </div>
          </CardContent>
        </Card>

        {/* 更多卡片... */}
      </div>
    </div>
  );
}
```

### 示例 3: 表单验证

```jsx
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";

function CreateWarehouseForm() {
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-4" style={{ gap: 'var(--form-spacing)' }}>
      {/* 正常字段 */}
      <div className="space-y-2">
        <Label>仓库名称</Label>
        <Input placeholder="请输入仓库名称" />
      </div>

      {/* 错误字段 */}
      <div className="space-y-2">
        <Label className="text-error">仓库编码 *</Label>
        <Input
          placeholder="请输入仓库编码"
          className="border-error focus-visible:ring-error"
        />
        <p className="text-sm" style={{ color: 'var(--error-500)' }}>
          此字段为必填项
        </p>
      </div>

      {/* 成功字段 */}
      <div className="space-y-2">
        <Label className="text-success">地址</Label>
        <Input
          defaultValue="1234 Main St"
          className="border-success"
        />
        <p className="text-sm" style={{ color: 'var(--success-500)' }}>
          ✓ 地址验证通过
        </p>
      </div>

      <Button type="submit">提交</Button>
    </form>
  );
}
```

---

## ✅ 最佳实践

### 1. 颜色使用

**✅ 推荐**

```jsx
// 使用基础语义化 Token + 应用层映射
const statusColor = getInventoryStatusColor(item.status);
<Badge style={{ backgroundColor: statusColor.color }}>
  {statusColor.label}
</Badge>
```

**❌ 避免**

```jsx
// 硬编码颜色值或在Token层定义业务状态
<Badge style={{ backgroundColor: '#22c55e' }}>在库</Badge>
<Badge style={{ backgroundColor: 'var(--status-in-stock)' }}>在库</Badge> {/* 业务状态应在应用层映射 */}
```

### 2. 间距使用

**✅ 推荐**

```jsx
// 使用间距 Token
<div style={{ padding: 'var(--spacing-lg)' }}>内容</div>
<div className="space-y-4">  {/* Tailwind 间距 */}
```

**❌ 避免**

```jsx
// 随意的像素值
<div style={{ padding: '17px' }}>内容</div>
```

### 3. 组件状态

**✅ 推荐**

```jsx
// 使用专用状态组件
{loading && <LoadingState />}
{!data.length && <EmptyState title="暂无数据" />}
{error && <ErrorState type="network" onRetry={refetch} />}
```

**❌ 避免**

```jsx
// 自定义简陋的状态
{loading && <div>加载中...</div>}
{!data.length && <div>没有数据</div>}
```

### 4. 数据格式

**✅ 推荐**

```jsx
// 统一的数据格式
<div className="text-2xl">{quantity.toLocaleString()}</div>  {/* 1,234 */}
<div>${amount.toFixed(2)}</div>  {/* $12,345.67 */}
<div>{date.format('YYYY-MM-DD HH:mm')}</div>  {/* 2025-10-21 14:32 */}
```

### 5. 表格设计

**✅ 推荐**

```jsx
// 信息密集但清晰
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>SKU编码</TableHead>  {/* 清晰的列标题 */}
      <TableHead className="text-right">数量</TableHead>  {/* 数字右对齐 */}
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-mono">SKU-001</TableCell>  {/* 等宽字体显示代码 */}
      <TableCell className="text-right">1,234</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 6. 状态徽章

**✅ 推荐**

```jsx
// 在应用层定义业务状态映射
function getInventoryStatusColor(status) {
  const statusMap = {
    'in_stock': { color: 'var(--success-500)', label: '在库' },
    'low_stock': { color: 'var(--warning-500)', label: '低库存' },
    'out_of_stock': { color: 'var(--error-500)', label: '缺货' },
  };
  return statusMap[status] || { color: 'var(--gray-500)', label: '未知' };
}

const statusInfo = getInventoryStatusColor(status);
<Badge style={{ backgroundColor: statusInfo.color, color: 'white' }}>
  {statusInfo.label}
</Badge>
```

---

## 📚 更多资源

- **Shadcn UI 文档**: https://ui.shadcn.com/
- **Lucide Icons**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🔄 更新日志

### v1.0.0 (2025-10-21)

- ✨ 初始版本发布
- 🎨 完整的 Design Token 体系
- 📦 WMS 专用组件和模式
- 📖 使用指南和示例

---

**维护者**: WMS 产品团队  
**最后更新**: 2025-10-21
