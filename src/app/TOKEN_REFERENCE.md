# Design Token 速查表

快速查找所有可用的 Design Token。

---

## 🎨 颜色 Token

### 品牌色（紫色）
```
--purple-50    #faf5ff
--purple-100   #f3e8ff
--purple-200   #e9d5ff
--purple-300   #d8b4fe
--purple-400   #c084fc
--purple-500   #a855f7  ⭐ 主色
--purple-600   #9333ea  ⭐ 品牌主色
--purple-700   #7e22ce
--purple-800   #6b21a8
--purple-900   #581c87
```

### 中性色（灰色）
```
--gray-50      #fafafa
--gray-100     #f5f5f5
--gray-200     #e5e5e5  ⭐ 边框
--gray-300     #d4d4d4
--gray-400     #a3a3a3
--gray-500     #737373  ⭐ 次要文字
--gray-600     #525252
--gray-700     #404040  ⭐ 主要文字
--gray-800     #262626
--gray-900     #171717  ⭐ 深色背景
```

### 功能色

#### 成功（绿色）
```
--success-50   #f0fdf4
--success-100  #dcfce7
--success-500  #22c55e  ⭐ 成功主色
--success-600  #16a34a
--success-700  #15803d
```

#### 警告（橙色）
```
--warning-50   #fffbeb
--warning-100  #fef3c7
--warning-500  #f59e0b  ⭐ 警告主色
--warning-600  #d97706
--warning-700  #b45309
```

#### 错误（红色）
```
--error-50     #fef2f2
--error-100    #fee2e2
--error-500    #ef4444  ⭐ 错误主色
--error-600    #dc2626
--error-700    #b91c1c
```

#### 信息（蓝色）
```
--info-50      #eff6ff
--info-100     #dbeafe
--info-500     #3b82f6  ⭐ 信息主色
--info-600     #2563eb
--info-700     #1d4ed8
```

### 语义化颜色
```
--primary                紫色品牌主色
--primary-foreground     主色前景（白色）

--secondary              次要背景
--secondary-foreground   次要前景

--muted                  静音背景
--muted-foreground       静音前景

--accent                 强调背景
--accent-foreground      强调前景

--destructive            危险/删除色
--destructive-foreground 危险前景

--background             页面背景
--foreground             页面前景
--card                   卡片背景
--card-foreground        卡片前景

--border                 边框色
--border-strong          加强边框
--input                  输入框边框
--input-background       输入框背景
--input-focus            输入框聚焦
```

---

## 📏 间距 Token

### 基础间距
```
--spacing-xs    4px    (0.25rem)  最小间距
--spacing-sm    8px    (0.5rem)   表格单元格
--spacing-md    12px   (0.75rem)  表格、表单
--spacing-lg    16px   (1rem)     卡片内边距
--spacing-xl    24px   (1.5rem)   区块间距
--spacing-2xl   32px   (2rem)     大区块
--spacing-3xl   48px   (3rem)     页面级间距
```

### 组件专用间距
```
--table-padding-x    12px   表格横向内边距
--table-padding-y    8px    表格纵向内边距
--form-spacing       16px   表单元素间距
--card-padding       24px   卡片内边距
```

---

## 🌑 阴影 Token

### 基础阴影（Elevation）
```
--shadow-xs     最小阴影，微弱边界
--shadow-sm     卡片默认阴影  ⭐
--shadow-md     悬浮卡片
--shadow-lg     下拉菜单、弹出框  ⭐
--shadow-xl     模态框
--shadow-2xl    最高层级
```

### 组件专用阴影
```
--shadow-card       卡片阴影（= shadow-sm）
--shadow-dropdown   下拉菜单阴影（= shadow-lg）
--shadow-modal      模态框阴影（= shadow-2xl）
--shadow-focus      聚焦状态紫色光圈
```

---

## 🎭 透明度 Token

```
--opacity-0      0%     完全透明
--opacity-10     10%
--opacity-20     20%
--opacity-30     30%
--opacity-40     40%    ⭐ 禁用状态
--opacity-50     50%    ⭐ 遮罩层
--opacity-60     60%
--opacity-70     70%
--opacity-80     80%    ⭐ 悬浮状态
--opacity-90     90%
--opacity-100    100%   完全不透明
```

### 语义化透明度
```
--opacity-disabled    40%   禁用状态
--opacity-hover       80%   悬浮状态
--opacity-overlay     50%   遮罩层
```

---

## 🎬 动画 Token

### 时长（Duration）
```
--duration-instant    0ms      立即响应
--duration-fast       150ms    ⭐ hover、focus
--duration-normal     250ms    ⭐ 默认过渡
--duration-slow       350ms    展开/收起
--duration-slower     500ms    页面级动画
```

### 缓动函数（Easing）
```
--ease-linear         linear                         匀速
--ease-in             cubic-bezier(0.4, 0, 1, 1)     加速进入
--ease-out            cubic-bezier(0, 0, 0.2, 1)     减速退出  ⭐
--ease-in-out         cubic-bezier(0.4, 0, 0.2, 1)   先加速后减速  ⭐
--ease-bounce         cubic-bezier(0.68, -0.55, 0.265, 1.55)  弹性
```

### 组合过渡
```
--transition-fast     150ms ease-out      快速反馈
--transition-normal   250ms ease-in-out   默认过渡  ⭐
--transition-slow     350ms ease-in-out   复杂动画
```

---

## 📐 边框 Token

### 边框宽度
```
--border-width-thin      1px   默认细边框  ⭐
--border-width-default   1px   默认边框
--border-width-thick     2px   加粗边框
--border-width-heavy     4px   超粗边框
```

### 圆角（Radius）
```
--radius-sm    4px    (radius - 4px)
--radius-md    6px    (radius - 2px)
--radius-lg    8px    ⭐ 默认圆角
--radius-xl    12px   (radius + 4px)
--radius       8px    基准圆角
```

---

## 📊 Z-Index Token

```
--z-base              0       基础层
--z-dropdown          1000    下拉菜单
--z-sticky            1100    粘性定位
--z-fixed             1200    固定定位
--z-modal-backdrop    1300    模态框背景
--z-modal             1400    模态框
--z-popover           1500    弹出层
--z-tooltip           1600    提示框
--z-notification      1700    通知（最高）
```

---

## 🎯 图标尺寸 Token

```
--icon-xs     12px   表格内图标
--icon-sm     16px   ⭐ 按钮、表单图标
--icon-md     20px   导航图标
--icon-lg     24px   ⭐ 页面图标
--icon-xl     32px   特色图标
--icon-2xl    48px   空状态图标
```

---

## 📱 断点 Token（参考）

```
--breakpoint-sm      640px
--breakpoint-md      768px
--breakpoint-lg      1024px   ⭐ 主要桌面端
--breakpoint-xl      1280px
--breakpoint-2xl     1536px
```

### 容器宽度
```
--container-sm       640px
--container-md       768px
--container-lg       1024px
--container-xl       1280px
--container-2xl      1400px   ⭐ 主容器
```

---

## 📝 字体 Token

### 字号
```
基础字号: 14px  （适合信息密集界面）

--text-xs        12px
--text-sm        14px
--text-base      14px   ⭐ 默认
--text-lg        16px
--text-xl        20px
--text-2xl       24px
--text-3xl       30px
```

### 字重
```
--font-weight-normal      400   ⭐ 正常文本
--font-weight-medium      500   ⭐ 中等强调（默认）
--font-weight-semibold    600   重点强调
```

---

## 📋 数据格式规范

### 数字
- 千分位: `1,234`
- 小数: `45.67 kg`
- 百分比: `98.5%`
- 大数字: `1.2M`

### 金额
- 美元: `$12,345.67`
- 人民币: `¥12,345.67`
- 欧元: `€12,345.67`
- 负数: <span style="color: var(--error-500)">-$1,234.56</span>

### 日期时间
- 完整: `2025-10-21 14:32:15`
- 常用: `2025-10-21 14:32` ⭐
- 仅日期: `2025-10-21`
- 相对: `2小时前`

---

## 🎨 表格专用 Token

```
--table-header-bg       表头背景色
--table-header-text     表头文字色
--table-row-hover       行悬浮背景
--table-border          表格边框
--table-stripe          斑马纹背景
```

---

## 💡 使用技巧

### CSS 中使用
```css
.my-component {
  color: var(--gray-700);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
}
```

### Tailwind 中使用
```jsx
<div className="text-primary bg-background p-4 rounded-lg shadow-sm">
  内容
</div>
```

### React 内联样式
```jsx
<div style={{
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
}}>
  内容
</div>
```

---

**提示**: ⭐ 标记的是最常用的 Token