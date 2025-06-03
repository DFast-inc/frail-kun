import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "フレイルくん | 口腔機能低下症管理システム",
  description: "口腔機能低下症の検査から管理までを支援するシステム",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange> */}
        <Navbar />
        <main className="p-7">{children}</main>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
