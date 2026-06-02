import { useState, ReactNode } from "react";
import {
  Warehouse, PackageCheck, PackageMinus, BarChart3, Database,
  Home, Search, ChevronRight, ClipboardList, PackageOpen
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

interface WMSLayoutProps {
  children: ReactNode;
  title: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function WMSLayout({ children, title, currentPath, onNavigate }: WMSLayoutProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(["出库", "库存", "基础数据"]);

  const sidebarMenuItems: MenuItem[] = [
    { icon: Home, label: "首页", path: "/", isActive: currentPath === "/" },
    {
      icon: PackageCheck,
      label: "入库",
      path: "/inbound",
      isActive: currentPath.startsWith("/inbound") || currentPath.startsWith("/putaway"),
      subItems: [
        { label: "到仓扫描", path: "/inbound/arrival-scan", isActive: currentPath === "/inbound/arrival-scan" },
        { label: "入库管理", path: "/inbound/management", isActive: currentPath === "/inbound/management" },
        { label: "上架管理", path: "/putaway/management", isActive: currentPath === "/putaway/management" },
      ],
    },
    {
      icon: PackageMinus,
      label: "出库",
      path: "/outbound",
      isActive: currentPath.startsWith("/outbound") || currentPath.startsWith("/wave") || currentPath.startsWith("/picking") || currentPath.startsWith("/packing"),
      subItems: [
        { label: "出库管理", path: "/outbound/management", isActive: currentPath === "/outbound/management" },
        { label: "波次管理", path: "/wave/management", isActive: currentPath === "/wave/management" },
        { label: "拣货任务", path: "/picking/tasks", isActive: currentPath.startsWith("/picking") },
        { label: "打包任务", path: "/packing/tasks", isActive: currentPath.startsWith("/packing") },
        { label: "播种", path: "/outbound/seeding", isActive: currentPath === "/outbound/seeding" },
        { label: "出库复核", path: "/outbound/check", isActive: currentPath === "/outbound/check" },
      ],
    },
    {
      icon: Warehouse,
      label: "库存",
      path: "/inventory",
      isActive: currentPath.startsWith("/inventory"),
      subItems: [
        { label: "库存查询", path: "/inventory/query", isActive: currentPath === "/inventory/query" || currentPath === "/inventory/detail" },
        { label: "库存流水", path: "/inventory/transaction", isActive: currentPath === "/inventory/transaction" },
        { label: "库存调整（未完成）", path: "/inventory/adjustment" },
        { label: "库存盘点", path: "/inventory/stocktaking", isActive: currentPath.startsWith("/inventory/stocktaking") },
      ],
    },
    {
      icon: Database,
      label: "基础数据",
      path: "/master-data",
      isActive: currentPath.startsWith("/master-data"),
      subItems: [
        { label: "SKU管理", path: "/master-data/skus", isActive: currentPath.startsWith("/master-data/skus") },
        { label: "客户管理", path: "/master-data/customers", isActive: currentPath === "/master-data/customers" },
        { label: "库区管理", path: "/master-data/zones", isActive: currentPath === "/master-data/zones" },
        { label: "库位管理", path: "/master-data/locations", isActive: currentPath === "/master-data/locations" },
        { label: "容器管理", path: "/master-data/containers", isActive: currentPath === "/master-data/containers" },
        { label: "播种墙管理", path: "/master-data/seeding-walls", isActive: currentPath === "/master-data/seeding-walls" },
      ],
    },
    {
      icon: BarChart3,
      label: "报表",
      path: "/reports",
      isActive: currentPath.startsWith("/reports"),
      subItems: [
        { label: "入库报表（未完成）", path: "/reports/inbound" },
        { label: "出库报表（未完成）", path: "/reports/outbound" },
        { label: "库存报表（未完成）", path: "/reports/inventory" },
        { label: "人效报表（未完成）", path: "/reports/productivity" },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleMenuClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sidebar-foreground" style={{ fontSize: '16px', fontWeight: 600 }}>Vita-WMS</div>
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
                            onClick={() => toggleMenu(item.label)}
                            className="w-full"
                            isActive={item.isActive}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                            <ChevronRight
                              className={`ml-auto w-4 h-4 transition-transform ${
                                openMenus.includes(item.label) ? "rotate-90" : ""
                              }`}
                            />
                          </SidebarMenuButton>
                          {openMenus.includes(item.label) && (
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton 
                                    isActive={subItem.isActive}
                                    onClick={() => handleMenuClick(subItem.path)}
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
                          onClick={() => handleMenuClick(item.path)}
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
                Bobby
              </Button>
              <Button variant="outline" size="sm" onClick={() => onNavigate("/logout")}>
                退出
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
