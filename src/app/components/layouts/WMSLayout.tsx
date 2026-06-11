import type { ReactNode } from "react";
import { wmsBrandConfig, wmsMenuConfig } from "../../configs/wmsShellConfig";
import { AppShell } from "./AppShell";

interface WMSLayoutProps {
  children: ReactNode;
  title: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function WMSLayout({ children, title, currentPath, onNavigate }: WMSLayoutProps) {
  return (
    <AppShell
      brand={wmsBrandConfig}
      currentPath={currentPath}
      menuItems={wmsMenuConfig}
      onNavigate={onNavigate}
      storageKey="wms_sidebar_open_menus"
      title={title}
      userName="Vitamin"
    >
      {children}
    </AppShell>
  );
}

