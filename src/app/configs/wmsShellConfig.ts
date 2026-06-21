import {
  BarChart3,
  Database,
  Home,
  PackageCheck,
  PackageMinus,
  Palette,
  Warehouse,
} from "lucide-react";
import type { AppShellBrand, AppShellMenuItem } from "../components/layouts/AppShell";

export const wmsBrandConfig: AppShellBrand = {
  name: "Vita-WMS",
  Icon: Warehouse,
};

export const wmsMenuConfig: AppShellMenuItem[] = [
  { icon: Home, label: "首页", path: "/", match: (path) => path === "/" },
  { icon: Palette, label: "设计系统", path: "/design-system", match: (path) => path.startsWith("/design-system") },
  {
    icon: PackageCheck,
    label: "入库",
    path: "/inbound",
    match: (path) => path.startsWith("/inbound") || path.startsWith("/putaway"),
    subItems: [
      { label: "到仓扫描", path: "/inbound/arrival-scan" },
      { label: "入库管理", path: "/inbound/management" },
      { label: "质检任务", path: "/inbound/inspection" },
      { label: "上架管理", path: "/putaway/management" },
    ],
  },
  {
    icon: PackageMinus,
    label: "出库",
    path: "/outbound",
    match: (path) =>
      path.startsWith("/outbound") ||
      path.startsWith("/wave") ||
      path.startsWith("/picking") ||
      path.startsWith("/packing"),
    subItems: [
      { label: "出库管理", path: "/outbound/management" },
      { label: "波次管理", path: "/wave/management" },
      { label: "拣货任务", path: "/picking/tasks", match: (path) => path.startsWith("/picking") },
      { label: "打包任务", path: "/packing/tasks", match: (path) => path.startsWith("/packing") },
      { label: "播种", path: "/outbound/seeding" },
      { label: "出库复核", path: "/outbound/check" },
      { label: "称重出库", path: "/outbound/shipping" },
    ],
  },
  {
    icon: Warehouse,
    label: "库存",
    path: "/inventory",
    match: (path) => path.startsWith("/inventory"),
    subItems: [
      { label: "库存查询", path: "/inventory/query", match: (path) => path === "/inventory/query" || path.startsWith("/inventory/detail") },
      { label: "库存流水", path: "/inventory/transaction" },
      { label: "移库管理", path: "/inventory/transfer", match: (path) => path.startsWith("/inventory/transfer") },
      { label: "库存调整", path: "/inventory/adjustment" },
      { label: "补货管理", path: "/inventory/replenishment" },
      { label: "库存盘点", path: "/inventory/stocktaking", match: (path) => path.startsWith("/inventory/stocktaking") },
    ],
  },
  {
    icon: Database,
    label: "基础数据",
    path: "/master-data",
    match: (path) => path.startsWith("/master-data"),
    subItems: [
      { label: "SKU管理", path: "/master-data/skus", match: (path) => path.startsWith("/master-data/skus") },
      { label: "客户管理", path: "/master-data/customers" },
      { label: "库区管理", path: "/master-data/zones" },
      { label: "库位管理", path: "/master-data/locations" },
      { label: "容器管理", path: "/master-data/containers" },
      { label: "播种墙管理", path: "/master-data/seeding-walls" },
    ],
  },
  {
    icon: BarChart3,
    label: "报表",
    path: "/reports",
    match: (path) => path.startsWith("/reports"),
    subItems: [
      { label: "入库报表", path: "/reports/inbound" },
      { label: "出库报表", path: "/reports/outbound" },
      { label: "库存报表", path: "/reports/inventory" },
      { label: "人效报表", path: "/reports/productivity" },
    ],
  },
];
