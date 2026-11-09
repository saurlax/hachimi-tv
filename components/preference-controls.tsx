"use client";

import { Languages, SunMoon } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import { languagePreference, themePreference } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PreferenceControls() {
  const { t, language, theme, setLanguage, setTheme } = usePreferences();
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("language")}>
            <Languages />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(languagePreference(value))} aria-label={t("language")}>
            <DropdownMenuRadioItem value="system">{t("browser")}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="zh-CN">简体中文</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="zh-TW">繁體中文</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("appearance")}>
            <SunMoon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(themePreference(value))} aria-label={t("appearance")}>
            <DropdownMenuRadioItem value="system">{t("system")}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">{t("light")}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">{t("dark")}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
