# Vita-WMS 跨境电商海外仓核心作业前端演示系统

[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Vita-WMS** 是一款专门针对**跨境电商海外仓作业核心链路**设计的高保真、交互式前端演示系统。本项目以极具现代科技感的“紫灰色调”为主视觉设计，100% 还原了海外仓从**卡车到货、入库收货、移位上架、波次创建、拣货打包、出库复核到仓内库存盘点**的全生命周期作业场景。

系统内置了完整的 **Session 级动态模拟数据库与跨模块数据联动**，并针对仓内扫码高吞吐率诉求提供了**“一键扫码枪模拟”**等现场演示辅助工具。非常适用于**产品经理原型汇报、高校及物流培训课程教学演示、技术售前解决方案展示**等场景。

---

## 🚀 核心设计与功能特色

### 1. 完整的海外仓业务链覆盖 (End-to-End WMS Operations)
系统摆脱了传统 Demo 仅有静态展示的弊端，完整搭建了海外仓的核心骨架：
* **入库管理 (Inbound)**：到货扫描登记、入库单据列表管理、多步骤可视化收货暂存（Receive Dialog）、移位上架确认。
* **出库管理 (Outbound)**：出库订单管理、波次计划分配、多模式拣货任务（按单/批量/边拣边分）、播种墙分配、出库复核校验、打包工位控制。
* **仓内与库存 (Inventory & Control)**：库存综合查询（含可用/待检/在途/冻结等精细维度）、库存流水交易历史、库区库位维护、盘点单据派生与盘点工作台。
* **基础数据 (Master Data)**：SKU 商品档案维护、客户档案、货架库位图谱、容器与播种墙硬件建模。

### 2. 完美的“演示特化型”本地数据联动 (Live Session link)
* **跨页面无缝流转**：基于 `sessionStorage` 实现了极简的本地状态缓存。在单次浏览器会话中，菜单切换或刷新网页，之前所有的修改均被完整保留。
* **业务数据闭环**：
  * 在“入库管理”对单据保存收货 $\rightarrow$ 对应单据状态自动转为**已完成**并本地入账。
  * 实收商品数量会自动**实时累加**到“库存查询”对应 SKU 的库存总量中。
  * 返回首页工作台，**“当前库存总量”指标卡片与库容利用率进度条动态递增**，而 **“待处理任务数”** 相应向下扣减。

### 3. 专业级扫码枪现场一键模拟器 (Scan Simulators)
针对 WMS 仓内高频扫码作业，系统进行了专门的演示优化：
* **一键容器生成**：绑定周转箱/托盘时提供“一键生成托盘号”链接，根据时间戳自动注入 PL 格式容器号。
* **一键条码枪录入**：在所有扫码输入框（到货、收货、拣货等）下方内置了 `[模拟扫描 SKU-001 (耳机)]` 等快捷按钮。点击即可触发系统扫码装入逻辑，展示扫码成功（绿色 Toast）或无效码防错拦截（红色 Alert）的真实动效，演示现场无需敲击键盘。

### 4. 连续教学的一键数据还原 (Instant Reset)
在首页 Dashboard 工作台的“快捷操作”中，增设了 **`重置全套演示数据`** 按钮。现场演示完毕后，点击即可清空全部 sessionStorage 缓存，使系统瞬间还原为纯净的初始状态，完美支持多场次的连续教学。

---

## 🛠️ 技术栈与架构 (Tech Stack)

* **核心框架**：React 18, TypeScript, Vite (前端极速构建)
* **样式系统**：Tailwind CSS (响应式布局与微过渡过渡动画)
* **UI 组件库**：基于 HSL 变量自定义的轻量级原子化原子组件 (Shadcn UI)
* **图表控制**：Recharts (工作台业务趋势图、客户分布饼图)
* **图标库**：Lucide Icons
* **设计来源**：本项目代码设计来源于 Figma 精致紫色风格海外仓 WMS 视觉稿。

---

## 📦 快速开始与本地运行 (Quick Start)

### 1. 克隆并安装依赖
```bash
# 1. 安装依赖项目（推荐使用 npm 或 pnpm）
npm install

# 2. 启动本地开发服务
npm run dev
```

### 2. 演示登录说明
访问本地服务（默认为 `http://localhost:5173`），系统将展现高水准的两栏式 WMS 登录面板：
> 💡 **演示提示**：系统在演示环境中**不校验实际密码**。输入框已默认填充好 demo 账号，直接点击 **“登录并进入工作台”** 即可进入系统。

---

## 📖 推荐演示路径指南 (Recommended Demo Flow)

建议讲师或汇报人在现场展示时，采取以下闭环路径，以达到最佳的交互说服效果：

```
[Dashboard 看板：确认初始库存/待办数] 
      │
      ▼
[入库管理：选择待入库单 -> 点击收货] ──(一键生成容器 & 模拟扫码装箱)
      │
      ▼
[入库管理：点击保存收货] ──(入库单自动转为“已完成”)
      │
      ▼
[库存查询：查看对应 SKU] ──(亲眼查验总库存量实时累加)
      │
      ▼
[Dashboard 看板：查验数字] ──(总库存柱状条自动上涨，待办单量扣减一单)
      │
      ▼
[快捷操作：重置演示数据] ──(一键完美复原，等待下一批学员)
```

---

## 📄 开源许可证
本项目基于 [MIT](LICENSE) 许可证开源。仅供学术交流、高校教学与产品汇报展示使用。