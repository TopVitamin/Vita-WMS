import { useState, type ReactNode } from "react";
import type { ComponentType } from "react";
import { ChevronRight, CircleUser, LogOut, Search } from "lucide-react";
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

export interface AppShellMenuItem {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  path: string;
  match?: (path: string) => boolean;
  subItems?: AppShellMenuItem[];
}

export interface AppShellBrand {
  name: string;
  Icon?: ComponentType<{ className?: string }>;
}

interface AppShellProps {
  brand: AppShellBrand;
  children: ReactNode;
  currentPath: string;
  menuItems: AppShellMenuItem[];
  onNavigate: (path: string) => void;
  storageKey?: string;
  title: string;
  userName?: string;
}

function isMenuItemActive(item: AppShellMenuItem, currentPath: string) {
  if (item.match) return item.match(currentPath);
  return currentPath === item.path;
}

export function AppShell({
  brand,
  children,
  currentPath,
  menuItems,
  onNavigate,
  storageKey = "app_shell_open_menus",
  title,
  userName = "Vitamin",
}: AppShellProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    if (typeof sessionStorage !== "undefined") {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // Ignore invalid persisted menu state.
        }
      }
    }

    return menuItems
      .filter((item) => item.subItems && isMenuItemActive(item, currentPath))
      .map((item) => item.label);
  });

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => {
      const next = prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label];
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
  };

  const BrandIcon = brand.Icon;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                {BrandIcon ? <BrandIcon className="h-5 w-5 text-primary-foreground" /> : null}
              </div>
              <div className="text-sidebar-foreground text-base font-semibold">{brand.name}</div>
            </div>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const ItemIcon = item.icon;
                    const active = isMenuItemActive(item, currentPath);

                    return (
                      <SidebarMenuItem key={item.label}>
                        {item.subItems ? (
                          <>
                            <SidebarMenuButton onClick={() => toggleMenu(item.label)} className="w-full" isActive={active}>
                              {ItemIcon ? <ItemIcon className="h-4 w-4" /> : null}
                              <span>{item.label}</span>
                              <ChevronRight
                                className={`ml-auto h-4 w-4 transition-transform ${
                                  openMenus.includes(item.label) ? "rotate-90" : ""
                                }`}
                              />
                            </SidebarMenuButton>
                            {openMenus.includes(item.label) ? (
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.label}>
                                    <SidebarMenuSubButton
                                      isActive={isMenuItemActive(subItem, currentPath)}
                                      onClick={() => onNavigate(subItem.path)}
                                    >
                                      {subItem.label}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            ) : null}
                          </>
                        ) : (
                          <SidebarMenuButton isActive={active} onClick={() => onNavigate(item.path)}>
                            {ItemIcon ? <ItemIcon className="h-4 w-4" /> : null}
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Search className="h-4 w-4" />
              </Button>

              <div className="ml-1 flex items-center gap-1 border-l pl-2">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <CircleUser className="h-4 w-4" />
                  {userName}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => onNavigate("/logout")}
                  title="退出"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

