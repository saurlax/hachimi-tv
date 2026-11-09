import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { PreferencesProvider } from "@/components/preferences-provider";
import { languagePreference, themePreference, messages, parseAcceptLanguage, resolveLocale } from "@/lib/i18n";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { InteractionEffects } from "@/components/interaction-effects";

const rounded = localFont({ src: "./fonts/hachimi-rounded.woff2", variable: "--font-rounded-cjk", weight: "400", display: "swap", adjustFontFallback: false });
const kuaile = localFont({ src: "./fonts/zcool-kuaile.woff2", variable: "--font-kuaile", weight: "400", display: "swap", adjustFontFallback: false });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
async function getPreferences() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const language = languagePreference(cookieStore.get("hachimi-language")?.value);
  const theme = themePreference(cookieStore.get("hachimi-theme")?.value);
  const locale = language === "system"
    ? resolveLocale(parseAcceptLanguage(headerStore.get("accept-language") ?? ""))
    : language;
  return { language, theme, locale };
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  return {
    title: `${messages[locale].brand} | ${messages[locale].siteTitle}`,
    description: messages[locale].siteDescription,
  };
}
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, language, theme } = await getPreferences();
  return (
    <html lang={locale} data-theme={theme}>
      <body
        className={`${kuaile.variable} ${rounded.variable} ${mono.variable} font-sans antialiased`}
      >
        <PreferencesProvider initialLocale={locale} initialLanguage={language} initialTheme={theme}>
          <InteractionEffects>{children}</InteractionEffects>
        </PreferencesProvider>
      </body>
    </html>
  );
}
