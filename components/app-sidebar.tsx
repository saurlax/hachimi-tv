"use client";

import Link from "next/link";
import {
  Cat,
  Compass,
  FolderHeart,
  Images,
  Library,
  LogIn,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export type WorkspaceSection =
  "创作" | "发现" | "搜索" | "我的作品" | "参考素材" | "收藏";
const main = [
  { title: "创作" as const, icon: Sparkles },
  { title: "发现" as const, icon: Compass },
  { title: "搜索" as const, icon: Search },
];
const workspace = [
  { title: "我的作品" as const, icon: Library },
  { title: "参考素材" as const, icon: Images },
  { title: "收藏" as const, icon: FolderHeart },
];

export function AppSidebar({
  active = "发现",
  onNavigate,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  active?: WorkspaceSection;
  onNavigate?: (section: WorkspaceSection) => void;
}) {
  function menu(items: typeof main | typeof workspace) {
    return (
      <SidebarMenu>
        {items.map(({ title, icon: Icon }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton
              isActive={active === title}
              onClick={() => onNavigate?.(title)}
              aria-current={active === title ? "page" : undefined}
            >
              <Icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader className="relative overflow-hidden pt-5 pb-4">
        <div
          aria-hidden="true"
          className="racing-ribbon absolute inset-x-0 top-0 h-1.5"
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" aria-label="hachimi.tv 首页">
                <span className="flex size-9 items-center justify-center rounded-xl border border-amber-400/60 bg-primary">
                  <Cat className="size-6!" strokeWidth={1.75} />
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  hachimi.tv
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>{menu(main)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>我的空间</SidebarGroupLabel>
          <SidebarGroupContent>{menu(workspace)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t p-4">
        <p className="px-2 text-xs leading-5 text-muted-foreground">
          用参考素材，创作你的小马视频与音乐。
        </p>
        <Button asChild>
          <Link href="/login">
            <LogIn />
            登录 / 注册
          </Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
