# 维他很忙ERP - 项目迁移指南

> 从 WMS Design System 迁移到零售ERP系统  
> 主题色：橙红色 `#f54a00`  
> 基于现有Design System，保持100%设计一致性

---

## 📋 目录

1. [迁移概述](#迁移概述)
2. [主题色替换对照表](#主题色替换对照表)
3. [文件迁移清单](#文件迁移清单)
4. [核心文件代码](#核心文件代码)
   - [globals.css (新主题)](#globalscss-新主题)
   - [ERPLayout.tsx](#erplayouttsx)
   - [商品管理列表页](#商品管理列表页)
   - [商品详情页](#商品详情页)
5. [迁移步骤](#迁移步骤)
6. [菜单结构说明](#菜单结构说明)

---

## 🎯 迁移概述

### 项目信息

- **项目名称**: 维他很忙ERP
- **主题色**: 橙红色 `#f54a00`
- **设计系统**: 完全复用WMS Design System
- **UI框架**: shadcn/ui风格
- **核心模块**: 9个业务中心

### 迁移原则

✅ **保持不变**:

- Design Token结构（间距/阴影/动画/字体等）
- 所有UI组件（40+个组件完全复用）
- 布局框架规范
- 设计系统文档结构

🎨 **需要修改**:

- 品牌色：紫色系 → 橙红色系
- 项目名称：保匣WMS → 维他很忙ERP
- 业务菜单：仓储模块 → 零售模块
- 业务页面：根据零售ERP需求开发

---

## 🎨 主题色替换对照表

### 从紫色系到橙红色系的映射

| 用途           | WMS紫色   | 零售ERP橙红色 | 色值       |
| -------------- | --------- | ------------- | ---------- |
| 50 (最浅)      | `#faf5ff` | `#fff7ed`     | Orange-50  |
| 100            | `#f3e8ff` | `#ffedd5`     | Orange-100 |
| 200            | `#e9d5ff` | `#fed7aa`     | Orange-200 |
| 300            | `#d8b4fe` | `#fdba74`     | Orange-300 |
| 400            | `#c084fc` | `#fb923c`     | Orange-400 |
| **500 主色**   | `#a855f7` | `#f54a00`     | 品牌主色   |
| **600 主色深** | `#9333ea` | `#ea580c`     | 主要使用   |
| 700            | `#7e22ce` | `#c2410c`     | 深色调     |
| 800            | `#6b21a8` | `#9a3412`     | 更深       |
| 900 (最深)     | `#581c87` | `#7c2d12`     | 最深色     |

### 语义色保持不变

- ✅ Success (绿色): `#22c55e` - 保持
- ⚠️ Warning (琥珀色): `#f59e0b` - 保持
- ❌ Error (红色): `#ef4444` - 保持
- ℹ️ Info (蓝色): `#3b82f6` - 保持

---

## 📁 文件迁移清单

### ✅ 完全复用（无需修改）

```
components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── alert.tsx
├── aspect-ratio.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── carousel.tsx
├── chart.tsx
├── checkbox.tsx
├── collapsible.tsx
├── command.tsx
├── context-menu.tsx
├── dialog.tsx
├── drawer.tsx
├── dropdown-menu.tsx
├── form.tsx
├── hover-card.tsx
├── input-otp.tsx
├── input.tsx
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── pagination.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── resizable.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── sidebar.tsx
├── skeleton.tsx
├── slider.tsx
├── sonner.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toggle-group.tsx
├── toggle.tsx
├── tooltip.tsx
├── use-mobile.ts
└── utils.ts

components/figma/
└── ImageWithFallback.tsx

components/wms/ (可选复用，改为 components/erp/)
├── EmptyState.tsx
├── ErrorState.tsx
└── LoadingState.tsx
```

### 🎨 需要修改主题色

```
styles/
└── globals.css          ← 替换紫色为橙红色
```

### 🔄 需要调整业务逻辑

```
components/layouts/
└── WMSLayout.tsx        → ERPLayout.tsx (修改菜单和项目名)

DESIGN_SYSTEM_GUIDE.md   ← 更新项目名称
TOKEN_REFERENCE.md       ← 更新项目名称（可选）
README.md                ← 更新项目说明
App.tsx                  ← 新业务路由
```

### 🆕 新建业务页面

```
pages/
├── products/
│   ├── ProductListPage.tsx     ← 商品列表
│   └── ProductDetailPage.tsx   ← 商品详情
├── purchase/
│   └── PurchaseOrderListPage.tsx
├── orders/
│   └── OrderListPage.tsx
├── distribution/
│   └── DistributionListPage.tsx
├── inventory/
│   └── InventoryQueryPage.tsx
├── stores/
│   └── StoreListPage.tsx
├── marketing/
│   └── CampaignListPage.tsx
├── strategy/
│   └── PricingStrategyPage.tsx
└── DashboardPage.tsx
```

---

## 💻 核心文件代码

### `globals.css` (新主题)

> ⚠️ 在新项目中完整替换此文件

```css
@custom-variant dark (&:is(.dark *));

:root {
  /* ========================================
     DESIGN TOKEN SYSTEM - 维他很忙ERP橙红主题
     ======================================== */

  /* Base Settings */
  --font-size: 14px; /* Smaller for dense data */
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;

  /* Text Size Tokens */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 0.875rem; /* 14px - Default */
  --text-lg: 1rem;       /* 16px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* ========================================
     COLOR TOKENS - Foundation Layer
     ======================================== */

  /* Orange Brand Colors (Primary) - 维他很忙橙红色 */
  --orange-50: #fff7ed;
  --orange-100: #ffedd5;
  --orange-200: #fed7aa;
  --orange-300: #fdba74;
  --orange-400: #fb923c;
  --orange-500: #f54a00;  /* Main brand color */
  --orange-600: #ea580c;
  --orange-700: #c2410c;
  --orange-800: #9a3412;
  --orange-900: #7c2d12;

  /* Neutral Colors (Grays) */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;

  /* Success Colors (Green) */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;

  /* Warning Colors (Amber) */
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;

  /* Error Colors (Red) */
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;

  /* Info Colors (Blue) */
  --info-50: #eff6ff;
  --info-100: #dbeafe;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;

  /* ========================================
     SEMANTIC TOKENS - Application Layer
     ======================================== */

  /* Layout & Background */
  --background: #ffffff;
  --foreground: var(--gray-900);
  --card: #ffffff;
  --card-foreground: var(--gray-900);

  /* Primary (Brand) */
  --primary: var(--orange-600);
  --primary-foreground: #ffffff;
  --primary-hover: var(--orange-700);
  --primary-light: var(--orange-50);

  /* Secondary */
  --secondary: var(--gray-100);
  --secondary-foreground: var(--gray-900);
  --secondary-hover: var(--gray-200);

  /* Muted (Subtle backgrounds) */
  --muted: var(--gray-100);
  --muted-foreground: var(--gray-500);

  /* Accent */
  --accent: var(--orange-50);
  --accent-foreground: var(--orange-700);

  /* Destructive */
  --destructive: var(--error-600);
  --destructive-foreground: #ffffff;

  /* Borders & Inputs */
  --border: var(--gray-200);
  --border-strong: var(--gray-300);
  --input: var(--gray-300);
  --input-background: #ffffff;
  --input-focus: var(--orange-500);
  --switch-background: var(--gray-300);
  --ring: var(--orange-500);

  /* Popover */
  --popover: #ffffff;
  --popover-foreground: var(--gray-900);

  /* Table Specific - For Dense Data */
  --table-header-bg: var(--gray-50);
  --table-header-text: var(--gray-700);
  --table-row-hover: var(--orange-50);
  --table-border: var(--gray-200);
  --table-stripe: var(--gray-50);

  /* Chart Colors */
  --chart-1: var(--orange-500);
  --chart-2: var(--info-500);
  --chart-3: var(--success-500);
  --chart-4: var(--warning-500);
  --chart-5: var(--error-500);

  /* Sidebar */
  --sidebar: var(--gray-900);
  --sidebar-foreground: var(--gray-100);
  --sidebar-primary: var(--orange-500);
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: var(--gray-800);
  --sidebar-accent-foreground: var(--gray-100);
  --sidebar-border: var(--gray-800);
  --sidebar-ring: var(--orange-500);

  /* ========================================
     SPACING TOKENS - For Dense Layouts
     ======================================== */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 0.75rem;   /* 12px */
  --spacing-lg: 1rem;      /* 16px */
  --spacing-xl: 1.5rem;    /* 24px */
  --spacing-2xl: 2rem;     /* 32px */
  --spacing-3xl: 3rem;     /* 48px */

  /* Component Specific Spacing */
  --table-padding-x: var(--spacing-md);
  --table-padding-y: var(--spacing-sm);
  --form-spacing: var(--spacing-lg);
  --card-padding: var(--spacing-xl);

  /* ========================================
     RADIUS TOKENS
     ======================================== */
  --radius: 0.5rem;  /* 8px - Modern but not too rounded */

  /* ========================================
     SHADOW TOKENS - Elevation System
     ======================================== */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Component Specific Shadows */
  --shadow-card: var(--shadow-sm);
  --shadow-dropdown: var(--shadow-lg);
  --shadow-modal: var(--shadow-2xl);
  --shadow-focus: 0 0 0 3px rgba(234, 88, 12, 0.1); /* Orange focus ring */

  /* ========================================
     BORDER WIDTH TOKENS
     ======================================== */
  --border-width-thin: 1px;
  --border-width-default: 1px;
  --border-width-thick: 2px;
  --border-width-heavy: 4px;

  /* ========================================
     OPACITY TOKENS
     ======================================== */
  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-30: 0.3;
  --opacity-40: 0.4;
  --opacity-50: 0.5;
  --opacity-60: 0.6;
  --opacity-70: 0.7;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-100: 1;

  /* State Opacities */
  --opacity-disabled: var(--opacity-40);
  --opacity-hover: var(--opacity-80);
  --opacity-overlay: var(--opacity-50);

  /* ========================================
     Z-INDEX TOKENS - Layer Management
     ======================================== */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  --z-notification: 1700;

  /* ========================================
     ANIMATION/TRANSITION TOKENS
     ======================================== */
  /* Duration */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;

  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Common Transitions */
  --transition-fast: var(--duration-fast) var(--ease-out);
  --transition-normal: var(--duration-normal) var(--ease-in-out);
  --transition-slow: var(--duration-slow) var(--ease-in-out);

  /* ========================================
     BREAKPOINT TOKENS (for reference)
     ======================================== */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;

  /* ========================================
     ICON SIZE TOKENS
     ======================================== */
  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
  --icon-2xl: 48px;

  /* ========================================
     LAYOUT FRAMEWORK TOKENS
     ======================================== */
  /* Header / Top Navigation */
  --header-height: 64px;
  --header-padding-x: 24px;

  /* Sidebar / Side Navigation */
  --sidebar-width: 240px;
  --sidebar-width-collapsed: 64px;
  --sidebar-padding-x: 16px;
  --sidebar-menu-item-height: 40px;
  --sidebar-submenu-indent: 24px;

  /* Main Content Area */
  --content-padding: 24px;
  --content-max-width: 1600px;
  --content-spacing: 24px;

  /* Page Header */
  --page-header-height: 72px;
  --page-header-margin-bottom: 24px;

  /* ========================================
     MODAL / DIALOG TOKENS
     ======================================== */
  /* Modal Sizes */
  --modal-sm: 400px;
  --modal-md: 600px;
  --modal-lg: 800px;
  --modal-xl: 1000px;
  --modal-full: 90vw;

  /* Modal Structure */
  --modal-header-height: 64px;
  --modal-header-padding: 20px 24px;
  --modal-body-padding: 24px;
  --modal-footer-height: 72px;
  --modal-footer-padding: 16px 24px;
  --modal-border-radius: 8px;

  /* Drawer Sizes */
  --drawer-sm: 360px;
  --drawer-md: 480px;
  --drawer-lg: 640px;
  --drawer-xl: 800px;

  /* ========================================
     CHART TOKENS
     ======================================== */
  /* Chart Colors - Sequence for multiple series */
  --chart-color-1: #ea580c; /* Orange - Brand */
  --chart-color-2: #3b82f6; /* Blue - Stability */
  --chart-color-3: #10b981; /* Green - Growth */
  --chart-color-4: #f59e0b; /* Amber - Warning */
  --chart-color-5: #ec4899; /* Pink - Accent */
  --chart-color-6: #06b6d4; /* Cyan - Neutral */

  /* Chart Primary Colors */
  --chart-primary: var(--primary);
  --chart-primary-light: var(--orange-400);
  --chart-primary-dark: var(--orange-600);

  /* Chart Gradients (for area charts) */
  --chart-gradient-start: rgba(234, 88, 12, 0.2);
  --chart-gradient-end: rgba(234, 88, 12, 0);

  /* Chart Dimensions */
  --chart-height-sm: 240px;
  --chart-height-md: 320px;
  --chart-height-lg: 400px;
  --chart-height-xl: 480px;

  /* Chart Spacing */
  --chart-margin: 24px;
  --chart-padding: 16px;

  /* Chart Grid & Axis */
  --chart-grid-color: var(--border);
  --chart-axis-color: var(--muted-foreground);
  --chart-axis-font-size: 12px;

  /* Chart Tooltip */
  --chart-tooltip-bg: var(--popover);
  --chart-tooltip-border: var(--border);
  --chart-tooltip-shadow: var(--shadow-lg);

  /* ========================================
     DATA FORMAT TOKENS
     ======================================== */
  /* These are reference values for formatting */
  --data-number-decimals: 2;
  --data-currency-symbol: '¥';
  --data-date-format: 'YYYY-MM-DD HH:mm';
}

.dark {
  /* Layout & Background */
  --background: var(--gray-900);
  --foreground: var(--gray-50);
  --card: var(--gray-800);
  --card-foreground: var(--gray-50);

  /* Primary */
  --primary: var(--orange-500);
  --primary-foreground: #ffffff;
  --primary-hover: var(--orange-400);
  --primary-light: var(--orange-900);

  /* Secondary */
  --secondary: var(--gray-800);
  --secondary-foreground: var(--gray-50);
  --secondary-hover: var(--gray-700);

  /* Muted */
  --muted: var(--gray-800);
  --muted-foreground: var(--gray-400);

  /* Accent */
  --accent: var(--gray-800);
  --accent-foreground: var(--orange-400);

  /* Destructive */
  --destructive: var(--error-500);
  --destructive-foreground: #ffffff;

  /* Borders & Inputs */
  --border: var(--gray-700);
  --border-strong: var(--gray-600);
  --input: var(--gray-700);
  --input-background: var(--gray-800);
  --input-focus: var(--orange-500);
  --switch-background: var(--gray-600);
  --ring: var(--orange-400);

  /* Popover */
  --popover: var(--gray-800);
  --popover-foreground: var(--gray-50);

  /* Table Specific */
  --table-header-bg: var(--gray-800);
  --table-header-text: var(--gray-200);
  --table-row-hover: rgba(245, 74, 0, 0.1);
  --table-border: var(--gray-700);
  --table-stripe: var(--gray-800);

  /* Chart Colors */
  --chart-1: var(--orange-400);
  --chart-2: var(--info-400);
  --chart-3: var(--success-400);
  --chart-4: var(--warning-400);
  --chart-5: var(--error-400);

  /* Sidebar */
  --sidebar: var(--gray-950);
  --sidebar-foreground: var(--gray-50);
  --sidebar-primary: var(--orange-500);
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: var(--gray-800);
  --sidebar-accent-foreground: var(--gray-50);
  --sidebar-border: var(--gray-800);
  --sidebar-ring: var(--orange-400);
}

@theme inline {
  /* Tailwind Color Mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);

  /* Chart Colors */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Radius Tokens */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Success/Warning/Error/Info */
  --color-success: var(--success-500);
  --color-success-light: var(--success-50);
  --color-warning: var(--warning-500);
  --color-warning-light: var(--warning-50);
  --color-error: var(--error-500);
  --color-error-light: var(--error-50);
  --color-info: var(--info-500);
  --color-info-light: var(--info-50);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/**
 * Base typography. This is not applied to elements which have an ancestor with a Tailwind text class.
 */
@layer base {
  :where(:not(:has([class*=" text-"]), :not(:has([class^="text-\"])))) {
    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h4 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    p {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }

    label {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    button {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    input {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }
  }
}

html {
  font-size: var(--font-size);
}
```

---

### `ERPLayout.tsx`

> 新建文件: `components/layouts/ERPLayout.tsx`

```tsx
import { useState, ReactNode } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Truck,
  Warehouse,
  Store,
  Megaphone,
  Settings,
  TrendingUp,
  Search,
  ChevronRight,
  Box,
  ShoppingBag,
  ClipboardList,
  MapPin,
  BarChart3,
  Tag,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "../ui/sidebar";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  isActive?: boolean;
  subItems?: {
    label: string;
    path: string;
    isActive?: boolean;
  }[];
}

interface ERPLayoutProps {
  children: ReactNode;
  title: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function ERPLayout({
  children,
  title,
  currentPath,
  onNavigate,
}: ERPLayoutProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([
    "商品中心",
    "采购中心",
    "订单中心",
    "配送中心",
    "库存中心",
    "门店中心",
    "营销中心",
    "策略中心",
    "配置中心",
  ]);

  const sidebarMenuItems: MenuItem[] = [
    {
      icon: Home,
      label: "首页",
      path: "/",
      isActive: currentPath === "/",
    },
    {
      icon: Package,
      label: "商品中心",
      path: "/products",
      isActive: currentPath.startsWith("/products"),
      subItems: [
        {
          label: "商品管理",
          path: "/products/management",
          isActive: currentPath === "/products/management",
        },
        {
          label: "分类管理",
          path: "/products/categories",
          isActive: currentPath === "/products/categories",
        },
        {
          label: "品牌管理",
          path: "/products/brands",
          isActive: currentPath === "/products/brands",
        },
        {
          label: "SKU管理",
          path: "/products/sku",
          isActive: currentPath === "/products/sku",
        },
        {
          label: "价格管理",
          path: "/products/pricing",
          isActive: currentPath === "/products/pricing",
        },
      ],
    },
    {
      icon: ShoppingCart,
      label: "采购中心",
      path: "/purchase",
      isActive: currentPath.startsWith("/purchase"),
      subItems: [
        {
          label: "采购订单",
          path: "/purchase/orders",
          isActive: currentPath === "/purchase/orders",
        },
        {
          label: "供应商管理",
          path: "/purchase/suppliers",
          isActive: currentPath === "/purchase/suppliers",
        },
        {
          label: "采购入库",
          path: "/purchase/receiving",
          isActive: currentPath === "/purchase/receiving",
        },
        {
          label: "采购退货",
          path: "/purchase/returns",
          isActive: currentPath === "/purchase/returns",
        },
      ],
    },
    {
      icon: FileText,
      label: "订单中心",
      path: "/orders",
      isActive: currentPath.startsWith("/orders"),
      subItems: [
        {
          label: "销售订单",
          path: "/orders/sales",
          isActive: currentPath === "/orders/sales",
        },
        {
          label: "退货单",
          path: "/orders/returns",
          isActive: currentPath === "/orders/returns",
        },
        {
          label: "订单查询",
          path: "/orders/query",
          isActive: currentPath === "/orders/query",
        },
        {
          label: "售后管理",
          path: "/orders/aftersales",
          isActive: currentPath === "/orders/aftersales",
        },
      ],
    },
    {
      icon: Truck,
      label: "配送中心",
      path: "/distribution",
      isActive: currentPath.startsWith("/distribution"),
      subItems: [
        {
          label: "配送任务",
          path: "/distribution/tasks",
          isActive: currentPath === "/distribution/tasks",
        },
        {
          label: "配送员管理",
          path: "/distribution/drivers",
          isActive: currentPath === "/distribution/drivers",
        },
        {
          label: "配送路线",
          path: "/distribution/routes",
          isActive: currentPath === "/distribution/routes",
        },
        {
          label: "运费管理",
          path: "/distribution/shipping",
          isActive: currentPath === "/distribution/shipping",
        },
      ],
    },
    {
      icon: Warehouse,
      label: "库存中心",
      path: "/inventory",
      isActive: currentPath.startsWith("/inventory"),
      subItems: [
        {
          label: "库存查询",
          path: "/inventory/query",
          isActive: currentPath === "/inventory/query",
        },
        {
          label: "库存流水",
          path: "/inventory/transaction",
          isActive: currentPath === "/inventory/transaction",
        },
        {
          label: "库存调拨",
          path: "/inventory/transfer",
          isActive: currentPath === "/inventory/transfer",
        },
        {
          label: "库存盘点",
          path: "/inventory/stocktaking",
          isActive: currentPath === "/inventory/stocktaking",
        },
        {
          label: "库存预警",
          path: "/inventory/alerts",
          isActive: currentPath === "/inventory/alerts",
        },
      ],
    },
    {
      icon: Store,
      label: "门店中心",
      path: "/stores",
      isActive: currentPath.startsWith("/stores"),
      subItems: [
        {
          label: "门店管理",
          path: "/stores/management",
          isActive: currentPath === "/stores/management",
        },
        {
          label: "门店业绩",
          path: "/stores/performance",
          isActive: currentPath === "/stores/performance",
        },
        {
          label: "门店调拨",
          path: "/stores/transfer",
          isActive: currentPath === "/stores/transfer",
        },
        {
          label: "门店盘点",
          path: "/stores/stocktaking",
          isActive: currentPath === "/stores/stocktaking",
        },
      ],
    },
    {
      icon: Megaphone,
      label: "营销中心",
      path: "/marketing",
      isActive: currentPath.startsWith("/marketing"),
      subItems: [
        {
          label: "促销活动",
          path: "/marketing/campaigns",
          isActive: currentPath === "/marketing/campaigns",
        },
        {
          label: "优惠券",
          path: "/marketing/coupons",
          isActive: currentPath === "/marketing/coupons",
        },
        {
          label: "会员管理",
          path: "/marketing/members",
          isActive: currentPath === "/marketing/members",
        },
        {
          label: "积分管理",
          path: "/marketing/points",
          isActive: currentPath === "/marketing/points",
        },
      ],
    },
    {
      icon: TrendingUp,
      label: "策略中心",
      path: "/strategy",
      isActive: currentPath.startsWith("/strategy"),
      subItems: [
        {
          label: "定价策略",
          path: "/strategy/pricing",
          isActive: currentPath === "/strategy/pricing",
        },
        {
          label: "补货策略",
          path: "/strategy/replenishment",
          isActive: currentPath === "/strategy/replenishment",
        },
        {
          label: "促销策略",
          path: "/strategy/promotion",
          isActive: currentPath === "/strategy/promotion",
        },
        {
          label: "数据分析",
          path: "/strategy/analytics",
          isActive: currentPath === "/strategy/analytics",
        },
      ],
    },
    {
      icon: Settings,
      label: "配置中心",
      path: "/settings",
      isActive: currentPath.startsWith("/settings"),
      subItems: [
        {
          label: "系统设置",
          path: "/settings/system",
          isActive: currentPath === "/settings/system",
        },
        {
          label: "用户管理",
          path: "/settings/users",
          isActive: currentPath === "/settings/users",
        },
        {
          label: "角色权限",
          path: "/settings/roles",
          isActive: currentPath === "/settings/roles",
        },
        {
          label: "操作日志",
          path: "/settings/logs",
          isActive: currentPath === "/settings/logs",
        },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleMenuClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <div
            className="h-16 flex items-center px-6 border-b"
            style={{ borderColor: "var(--sidebar-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div
                  className="text-sidebar-foreground"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  维他很忙ERP
                </div>
              </div>
            </div>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarMenuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      {item.subItems ? (
                        <>
                          <SidebarMenuButton
                            onClick={() =>
                              toggleMenu(item.label)
                            }
                            className="w-full"
                            isActive={item.isActive}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                            <ChevronRight
                              className={`ml-auto w-4 h-4 transition-transform ${
                                openMenus.includes(item.label)
                                  ? "rotate-90"
                                  : ""
                              }`}
                            />
                          </SidebarMenuButton>
                          {openMenus.includes(item.label) && (
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem
                                  key={subItem.label}
                                >
                                  <SidebarMenuSubButton
                                    isActive={subItem.isActive}
                                    onClick={() =>
                                      handleMenuClick(
                                        subItem.path,
                                      )
                                    }
                                  >
                                    {subItem.label}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          isActive={item.isActive}
                          onClick={() =>
                            handleMenuClick(item.path)
                          }
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-14 border-b flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-4">
              <h1 className="text-xl">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

---

### 商品管理列表页

> 新建文件: `pages/products/ProductListPage.tsx`

```tsx
import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// 模拟数据
const mockProducts = [
  {
    id: "SKU001",
    name: "有机红富士苹果 500g装",
    category: "生鲜水果",
    brand: "新疆果园",
    price: 29.9,
    cost: 18.5,
    stock: 1580,
    status: "on_sale",
    sales30d: 856,
    createdAt: "2024-11-15",
  },
  {
    id: "SKU002",
    name: "特仑苏纯牛奶 250ml*16盒",
    category: "乳制品",
    brand: "蒙牛",
    price: 79.9,
    cost: 52.0,
    stock: 320,
    status: "on_sale",
    sales30d: 425,
    createdAt: "2024-11-10",
  },
  {
    id: "SKU003",
    name: "三只松鼠每日坚果 30包",
    category: "休闲食品",
    brand: "三只松鼠",
    price: 89.0,
    cost: 58.0,
    stock: 0,
    status: "out_of_stock",
    sales30d: 0,
    createdAt: "2024-10-20",
  },
  {
    id: "SKU004",
    name: "农夫山泉 550ml*24瓶",
    category: "饮料",
    brand: "农夫山泉",
    price: 35.9,
    cost: 22.0,
    stock: 2450,
    status: "on_sale",
    sales30d: 1250,
    createdAt: "2024-09-05",
  },
  {
    id: "SKU005",
    name: "可口可乐 330ml*24罐",
    category: "饮料",
    brand: "可口可乐",
    price: 42.0,
    cost: 28.0,
    stock: 680,
    status: "on_sale",
    sales30d: 320,
    createdAt: "2024-09-01",
  },
  {
    id: "SKU006",
    name: "金龙鱼 5L 调和油",
    category: "粮油调味",
    brand: "金龙鱼",
    price: 68.9,
    cost: 45.0,
    stock: 156,
    status: "low_stock",
    sales30d: 89,
    createdAt: "2024-08-15",
  },
  {
    id: "SKU007",
    name: "海天生抽酱油 1.9L",
    category: "粮油调味",
    brand: "海天",
    price: 25.9,
    cost: 16.0,
    stock: 890,
    status: "on_sale",
    sales30d: 456,
    createdAt: "2024-07-20",
  },
  {
    id: "SKU008",
    name: "维达抽纸 3层130抽*20包",
    category: "日用百货",
    brand: "维达",
    price: 45.9,
    cost: 28.0,
    stock: 1200,
    status: "on_sale",
    sales30d: 658,
    createdAt: "2024-06-10",
  },
];

interface ProductListPageProps {
  onNavigate: (path: string) => void;
}

export function ProductListPage({
  onNavigate,
}: ProductListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 状态映射
  const getStatusConfig = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string }
    > = {
      on_sale: {
        label: "在售",
        color: "bg-success text-white",
      },
      off_sale: {
        label: "下架",
        color: "bg-gray-400 text-white",
      },
      out_of_stock: {
        label: "缺货",
        color: "bg-error text-white",
      },
      low_stock: {
        label: "低库存",
        color: "bg-warning text-white",
      },
    };
    return (
      statusMap[status] || {
        label: "未知",
        color: "bg-gray-400 text-white",
      }
    );
  };

  const handleViewDetail = (productId: string) => {
    onNavigate(`/products/detail/${productId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 筛选栏 */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          {/* 搜索 */}
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索商品名称、SKU、品牌..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* 分类筛选 */}
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="生鲜水果">生鲜水果</SelectItem>
              <SelectItem value="乳制品">乳制品</SelectItem>
              <SelectItem value="休闲食品">休闲食品</SelectItem>
              <SelectItem value="饮料">饮料</SelectItem>
              <SelectItem value="粮油调味">粮油调味</SelectItem>
              <SelectItem value="日用百货">日用百货</SelectItem>
            </SelectContent>
          </Select>

          {/* 状态筛选 */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="on_sale">在售</SelectItem>
              <SelectItem value="off_sale">下架</SelectItem>
              <SelectItem value="out_of_stock">缺货</SelectItem>
              <SelectItem value="low_stock">低库存</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            高级筛选
          </Button>
        </div>
      </Card>

      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            新建商品
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            导入
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          共 {mockProducts.length} 个商品
        </div>
      </div>

      {/* 表格 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">SKU编码</TableHead>
              <TableHead className="min-w-60">
                商品名称
              </TableHead>
              <TableHead>分类</TableHead>
              <TableHead>品牌</TableHead>
              <TableHead className="text-right">
                售价(¥)
              </TableHead>
              <TableHead className="text-right">
                成本(¥)
              </TableHead>
              <TableHead className="text-right">库存</TableHead>
              <TableHead className="text-right">
                30日销量
              </TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => {
              const statusConfig = getStatusConfig(
                product.status,
              );
              return (
                <TableRow
                  key={product.id}
                  className="hover:bg-table-row-hover"
                >
                  <TableCell className="font-mono">
                    {product.id}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="text-right">
                    {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {product.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.stock === 0
                          ? "text-error"
                          : product.stock < 200
                            ? "text-warning"
                            : ""
                      }
                    >
                      {product.stock.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.sales30d.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleViewDetail(product.id)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

### 商品详情页

> 新建文件: `pages/products/ProductDetailPage.tsx`

```tsx
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// 模拟商品数据
const mockProductDetail = {
  id: "SKU001",
  name: "有机红富士苹果 500g装",
  category: "生鲜水果",
  brand: "新疆果园",
  price: 29.9,
  cost: 18.5,
  stock: 1580,
  status: "on_sale",
  description:
    "精选新疆阿克苏红富士苹果，生长在海拔1000米以上的高原地区，昼夜温差大，果肉脆甜多汁，富含维生素和矿物质。",
  barcode: "6901234567890",
  weight: "500g",
  shelf_life: "7天",
  storage: "常温存储",
  supplier: "新疆果园供应商",
  sales30d: 856,
  sales90d: 2340,
  createdAt: "2024-11-15 10:30:00",
  updatedAt: "2024-12-08 14:20:00",
};

// 库存流水
const mockStockHistory = [
  {
    date: "2024-12-10 09:15",
    type: "销售出库",
    quantity: -45,
    balance: 1580,
    operator: "系统自动",
  },
  {
    date: "2024-12-09 14:30",
    type: "采购入库",
    quantity: 500,
    balance: 1625,
    operator: "张三",
  },
  {
    date: "2024-12-08 16:45",
    type: "销售出库",
    quantity: -38,
    balance: 1125,
    operator: "系统自动",
  },
  {
    date: "2024-12-07 11:20",
    type: "库存调整",
    quantity: 50,
    balance: 1163,
    operator: "李四",
  },
  {
    date: "2024-12-06 10:00",
    type: "销售出库",
    quantity: -52,
    balance: 1113,
    operator: "系统自动",
  },
];

// 价格历史
const mockPriceHistory = [
  {
    date: "2024-12-01",
    price: 29.9,
    type: "调价",
    operator: "王五",
    reason: "市场价格调整",
  },
  {
    date: "2024-11-15",
    price: 32.9,
    type: "促销",
    operator: "赵六",
    reason: "双十一促销",
  },
  {
    date: "2024-11-01",
    price: 29.9,
    type: "调价",
    operator: "张三",
    reason: "常规定价",
  },
];

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export function ProductDetailPage({
  productId,
  onNavigate,
}: ProductDetailPageProps) {
  const product = mockProductDetail;

  const getStatusConfig = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; color: string }
    > = {
      on_sale: {
        label: "在售",
        color: "bg-success text-white",
      },
      off_sale: {
        label: "下架",
        color: "bg-gray-400 text-white",
      },
      out_of_stock: {
        label: "缺货",
        color: "bg-error text-white",
      },
      low_stock: {
        label: "低库存",
        color: "bg-warning text-white",
      },
    };
    return (
      statusMap[status] || {
        label: "未知",
        color: "bg-gray-400 text-white",
      }
    );
  };

  const statusConfig = getStatusConfig(product.status);
  const profitMargin = (
    ((product.price - product.cost) / product.price) *
    100
  ).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/products/management")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl">{product.name}</h2>
              <Badge className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              SKU: {product.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
          <Button
            variant="outline"
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                当前库存
              </div>
              <div className="text-2xl mt-1">
                {product.stock.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                30日销量
              </div>
              <div className="text-2xl mt-1">
                {product.sales30d.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-warning/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                售价
              </div>
              <div className="text-2xl mt-1">
                ¥{product.price}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-info/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                毛利率
              </div>
              <div className="text-2xl mt-1">
                {profitMargin}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="stock">库存流水</TabsTrigger>
          <TabsTrigger value="price">价格历史</TabsTrigger>
          <TabsTrigger value="sales">销售数据</TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="pb-2 border-b">商品信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      商品名称
                    </div>
                    <div className="mt-1">{product.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      SKU编码
                    </div>
                    <div className="mt-1 font-mono">
                      {product.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      商品分类
                    </div>
                    <div className="mt-1">
                      {product.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      品牌
                    </div>
                    <div className="mt-1">{product.brand}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      条形码
                    </div>
                    <div className="mt-1 font-mono">
                      {product.barcode}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      规格
                    </div>
                    <div className="mt-1">{product.weight}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      保质期
                    </div>
                    <div className="mt-1">
                      {product.shelf_life}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      存储条件
                    </div>
                    <div className="mt-1">
                      {product.storage}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="pb-2 border-b">价格信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      销售价格
                    </div>
                    <div className="mt-1 text-xl text-primary">
                      ¥{product.price}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      成本价格
                    </div>
                    <div className="mt-1 text-xl">
                      ¥{product.cost}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      毛利
                    </div>
                    <div className="mt-1 text-xl text-success">
                      ¥
                      {(product.price - product.cost).toFixed(
                        2,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      毛利率
                    </div>
                    <div className="mt-1 text-xl text-success">
                      {profitMargin}%
                    </div>
                  </div>
                </div>

                <h3 className="pb-2 border-b mt-6">其他信息</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      供应商
                    </div>
                    <div className="mt-1">
                      {product.supplier}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      商品描述
                    </div>
                    <div className="mt-1 text-sm">
                      {product.description}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        创建时间
                      </div>
                      <div className="mt-1 text-sm">
                        {product.createdAt}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        更新时间
                      </div>
                      <div className="mt-1 text-sm">
                        {product.updatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 库存流水 */}
        <TabsContent value="stock">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>业务类型</TableHead>
                  <TableHead className="text-right">
                    变动数量
                  </TableHead>
                  <TableHead className="text-right">
                    结存数量
                  </TableHead>
                  <TableHead>操作人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStockHistory.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">
                      {record.date}
                    </TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell
                      className={`text-right ${
                        record.quantity > 0
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {record.quantity > 0 ? "+" : ""}
                      {record.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.balance}
                    </TableCell>
                    <TableCell>{record.operator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 价格历史 */}
        <TabsContent value="price">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>调价时间</TableHead>
                  <TableHead className="text-right">
                    价格(¥)
                  </TableHead>
                  <TableHead>调价类型</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPriceHistory.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">
                      {record.date}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      ¥{record.price}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.operator}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 销售数据 */}
        <TabsContent value="sales">
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded">
                <div className="text-sm text-muted-foreground">
                  近30日销量
                </div>
                <div className="text-3xl mt-2">
                  {product.sales30d}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  件
                </div>
              </div>
              <div className="text-center p-6 border rounded">
                <div className="text-sm text-muted-foreground">
                  近90日销量
                </div>
                <div className="text-3xl mt-2">
                  {product.sales90d}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  件
                </div>
              </div>
              <div className="text-center p-6 border rounded">
                <div className="text-sm text-muted-foreground">
                  日均销量
                </div>
                <div className="text-3xl mt-2">
                  {Math.round(product.sales30d / 30)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  件/天
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded text-sm text-muted-foreground text-center">
              📊 更详细的销售趋势图表可在数据分析模块查看
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🚀 迁移步骤

### 步骤1：创建新项目

在新的Figma Make项目或本地开发环境中创建空白项目。

### 步骤2：复制UI组件库

完整复制以下文件夹（**无需任何修改**）:

```
components/ui/          ← 所有文件
components/figma/       ← ImageWithFallback.tsx
```

### 步骤3：替换样式文件

复制并替换 `styles/globals.css`，使用本文档中提供的新版本（橙红色主题）。

### 步骤4：创建布局组件

创建 `components/layouts/ERPLayout.tsx`，复制本文档中的完整代码。

### 步骤5：创建业务页面

根据需要创建业务页面:

```
pages/products/ProductListPage.tsx       ← 商品列表
pages/products/ProductDetailPage.tsx     ← 商品详情
pages/...                                ← 其他页面
```

### 步骤6：更新App.tsx

创建路由逻辑，参考示例:

```tsx
import { useState } from "react";
import { ERPLayout } from "./components/layouts/ERPLayout";
import { ProductListPage } from "./pages/products/ProductListPage";
import { ProductDetailPage } from "./pages/products/ProductDetailPage";

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    "/products/management",
  );
  const [selectedProductId, setSelectedProductId] = useState<
    string | null
  >(null);

  const handleNavigate = (path: string) => {
    // 处理详情页路由
    if (path.startsWith("/products/detail/")) {
      const productId = path.split("/").pop();
      setSelectedProductId(productId || null);
      setCurrentPath("/products/detail");
    } else {
      setCurrentPath(path);
      setSelectedProductId(null);
    }
  };

  const getPageTitle = () => {
    if (currentPath === "/") return "首页";
    if (currentPath === "/products/management")
      return "商品管理";
    if (currentPath === "/products/detail") return "商品详情";
    // ... 其他页面标题
    return "维他很忙ERP";
  };

  const renderPage = () => {
    if (currentPath === "/products/management") {
      return <ProductListPage onNavigate={handleNavigate} />;
    }
    if (
      currentPath === "/products/detail" &&
      selectedProductId
    ) {
      return (
        <ProductDetailPage
          productId={selectedProductId}
          onNavigate={handleNavigate}
        />
      );
    }
    // ... 其他页面路由
    return <div className="p-6">欢迎使用维他很忙ERP</div>;
  };

  return (
    <ERPLayout
      title={getPageTitle()}
      currentPath={currentPath}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </ERPLayout>
  );
}
```

### 步骤7：更新文档（可选）

修改 `DESIGN_SYSTEM_GUIDE.md` 和 `README.md`，将项目名称从"WMS"改为"维他很忙ERP"。

---

## 📊 菜单结构说明

### 九大业务中心

1. **商品中心** (Package)
   - 商品管理、分类管理、品牌管理、SKU管理、价格管理

2. **采购中心** (ShoppingCart)
   - 采购订单、供应商管理、采购入库、采购退货

3. **订单中心** (FileText)
   - 销售订单、退货单、订单查询、售后管理

4. **配送中心** (Truck)
   - 配送任务、配送员管理、配送路线、运费管理

5. **库存中心** (Warehouse)
   - 库存查询、库存流水、库存调拨、库存盘点、库存预警

6. **门店中心** (Store)
   - 门店管理、门店业绩、门店调拨、门店盘点

7. **营销中心** (Megaphone)
   - 促销活动、优惠券、会员管理、积分管理

8. **策略中心** (TrendingUp)
   - 定价策略、补货策略、促销策略、数据分析

9. **配置中心** (Settings)
   - 系统设置、用户管理、角色权限、操作日志

---

## ✅ 完成清单

迁移完成后，您将拥有：

- [x] 橙红色主题的完整Design Token系统
- [x] 9个业务中心的菜单结构
- [x] 完整的ERPLayout布局组件
- [x] 商品管理列表页（含筛选、搜索、导入导出）
- [x] 商品详情页（含基本信息、库存流水、价格历史、销售数据）
- [x] 40+个可复用的UI组件
- [x] 完整的Design System文档

---

## 💡 后续开发建议

### 1. 优先级页面开发顺序

建议按以下顺序开发页面：

1. ✅ 商品管理（已完成）
2. 采购订单管理
3. 销售订单管理
4. 库存查询
5. 数据看板
6. 其他业务页面

### 2. 复用现有页面模板

参考WMS项目的以下页面作为模板：

- **列表页**: `LocationManagementPage.tsx`、`ZoneManagementPage.tsx`
- **详情页**: `InboundDetailPage.tsx`、`OutboundDetailPage.tsx`
- **操作页**: `ArrivalScanPage.tsx`、`SeedingOperationPage.tsx`

### 3. 保持设计一致性

- 使用相同的表格布局（筛选栏 + 操作栏 + 数据表格）
- 使用相同的状态Badge样式
- 保持相同的间距和排版规范
- 使用Design Token中定义的颜色和样式

### 4. 共享组件开发

可以将WMS的通用组件改造为ERP使用：

```
components/wms/EmptyState.tsx    → components/erp/EmptyState.tsx
components/wms/ErrorState.tsx    → components/erp/ErrorState.tsx
components/wms/LoadingState.tsx  → components/erp/LoadingState.tsx
```

---

## 📞 技术支持

如有任何问题，请参考：

1. WMS项目的 `DESIGN_SYSTEM_GUIDE.md`
2. WMS项目的 `TOKEN_REFERENCE.md`
3. 现有页面代码作为参考模板

---

**祝您开发顺利！维他很忙ERP 🎉**