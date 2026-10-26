import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InteractionEffects } from "@/components/interaction-effects";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "hachimi.tv | 好心情，随时播放",
  description: "发现、收藏和分享你的哈基米时刻",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <InteractionEffects>{children}</InteractionEffects>
      </body>
    </html>
  );
}
