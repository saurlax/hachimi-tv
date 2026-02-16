import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-slate-950 min-h-screen`}
      >
        <Providers>
          <Navbar className="bg-slate-950">
            <NavbarContent justify="start">
              <NavbarItem>
                <Link color="foreground" href="/">
                  hachimi.tv
                </Link>
              </NavbarItem>
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
            <NavbarContent justify="center">
              <NavbarItem>
                <Input placeholder="Search" />
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>
                <Link color="foreground" size="sm" href="/login">
                  Sign up
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button color="primary" as={Link} href="/login">
                  Login
                </Button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          {children}
        </Providers>
      </body>
    </html>
  );
}
