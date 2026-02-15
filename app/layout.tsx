import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hachimi.tv",
  description: "Share your hachimi with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="dark">
            <Navbar className="bg-slate-950">
              <NavbarBrand>
                <Link color="foreground" href="/">
                  hachimi.tv
                </Link>
              </NavbarBrand>
              <NavbarContent justify="center">
                <NavbarItem>
                  <Link href="/discover">Discover</Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/feed">Feed</Link>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/platform">Platform</Link>
                </NavbarItem>
              </NavbarContent>
              <NavbarContent justify="end">
                <NavbarItem>
                  <Link href="/login">Login</Link>
                </NavbarItem>
              </NavbarContent>
            </Navbar>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
