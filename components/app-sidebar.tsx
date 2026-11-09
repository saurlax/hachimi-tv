"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { usePreferences } from "@/components/preferences-provider";
import {
  Cat,
  Compass,
  FolderHeart,
  Images,
  Library,
  LogIn,
  LogOut,
  Sparkles,
  UsersRound,
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
  useSidebar,
} from "@/components/ui/sidebar";

export type WorkspaceSection =
  "create" | "discover" | "works" | "characters" | "assets" | "favorites";
const main = [
  { title: "create" as const, icon: Sparkles },
  { title: "discover" as const, icon: Compass },
  { title: "characters" as const, icon: UsersRound },
  { title: "assets" as const, icon: Images },
];
const workspace = [
  { title: "works" as const, icon: Library },
  { title: "favorites" as const, icon: FolderHeart },
];

export function AppSidebar({
  active = "discover",
  onNavigate,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  active?: WorkspaceSection;
  onNavigate?: (section: WorkspaceSection) => void;
}) {
  const { t } = usePreferences();
  const { data: session, isPending } = authClient.useSession();
  const [sessionError, setSessionError] = useState(false);
  const { isMobile, setOpenMobile } = useSidebar();
  function menu(items: typeof main | typeof workspace) {
    return (
      <SidebarMenu>
        {items.map(({ title, icon: Icon }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton
              isActive={active === title}
              onClick={() => { onNavigate?.(title); if (isMobile) setOpenMobile(false); }}
              aria-current={active === title ? "page" : undefined}
            >
              <Icon />
              <span>{t(title)}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader className="relative overflow-hidden pt-4">
        <div
          aria-hidden="true"
          className="racing-ribbon absolute inset-x-0 top-0 h-1.5"
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" aria-label={`${t("brand")} ${t("home")}`}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cat className="size-5!" strokeWidth={1.75} />
                </span>
                <span className="truncate text-base font-semibold">
                  {t("brand")}
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
          <SidebarGroupLabel>{t("workspace")}</SidebarGroupLabel>
          <SidebarGroupContent>{menu(workspace)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {session ? <>
          <span className="truncate px-2 text-sm">{session.user.name}</span>
          <Button variant="outline" onClick={async () => { const result = await authClient.signOut(); setSessionError(!!result.error); }}><LogOut />{t("signOut")}</Button>
          {sessionError && <p role="alert" className="text-xs text-destructive">{t("authFailed")}</p>}
        </> : <Button asChild disabled={isPending}><Link href="/login"><LogIn />{t("signIn")}</Link></Button>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
