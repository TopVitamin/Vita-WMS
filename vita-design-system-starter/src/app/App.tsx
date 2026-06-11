import { useEffect, useState } from "react";
import { BarChart3, ClipboardList, Home, Palette, Settings } from "lucide-react";
import { AppShell } from "./components/layouts/AppShell";
import DesignSystemPreviewPage from "./pages/DesignSystemPreviewPage";
import type { AppShellBrand, AppShellMenuItem } from "./components/layouts/AppShell";

const brand: AppShellBrand = {
  name: "Vita Design",
  Icon: Palette,
};

const menuItems: AppShellMenuItem[] = [
  { icon: Home, label: "首页", path: "/", match: (path) => path === "/" },
  { icon: Palette, label: "设计系统", path: "/design-system", match: (path) => path.startsWith("/design-system") },
  {
    icon: ClipboardList,
    label: "页面模式",
    path: "/patterns",
    match: (path) => path.startsWith("/patterns"),
    subItems: [
      { label: "列表页", path: "/patterns/list" },
      { label: "详情页", path: "/patterns/detail" },
      { label: "表单页", path: "/patterns/form" },
      { label: "作业流", path: "/patterns/workflow" },
    ],
  },
  { icon: BarChart3, label: "组件预览", path: "/components", match: (path) => path.startsWith("/components") },
  { icon: Settings, label: "迁移说明", path: "/migration", match: (path) => path.startsWith("/migration") },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    window.location.pathname === "/" ? "/design-system" : window.location.pathname,
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname === "/" ? "/design-system" : window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path === "/logout") return;
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  return (
    <AppShell
      brand={brand}
      currentPath={currentPath}
      menuItems={menuItems}
      onNavigate={handleNavigate}
      storageKey="vita_design_system_open_menus"
      title="设计系统"
      userName="Designer"
    >
      <div className="p-6">
        <DesignSystemPreviewPage />
      </div>
    </AppShell>
  );
}
