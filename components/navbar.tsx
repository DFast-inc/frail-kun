"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Settings, Menu } from "lucide-react";
import { LogoIcon } from "@/components/logo-icon";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [{ href: "/settings", label: "設定", icon: Settings }];

  return (
    <nav
      className={cn(
        "bg-white text-gray-800 p-2 sticky top-0 z-10 shadow-sm border-b ",
        pathname.includes("/print") ? "print:hidden" : ""
      )}
    >
      <div className="mx-auto px-4">
        <div className="flex items-center min-h-[48px]">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-auto">
                <LogoIcon className="h-full w-auto" />
              </div>
            </Link>
          </div>

          {/* モバイルメニュー */}
          <div className="md:hidden ml-auto">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white text-gray-800"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">メニュー</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="flex justify-center mb-6 mt-4">
                  <div className="h-10 w-auto">
                    <LogoIcon className="h-full w-auto" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        href={item.href}
                        key={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <div
                          className={cn(
                            "flex items-center p-3 rounded-md",
                            isActive
                              ? "bg-gray-100 text-primary font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <Icon
                            className={cn(
                              "mr-3 h-5 w-5",
                              isActive ? "text-primary" : "text-gray-600"
                            )}
                          />
                          {item.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={cn(
                      "text-lg py-3 px-4 flex items-center",
                      isActive
                        ? "border-primary text-primary border-b-2"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-2 h-5 w-5",
                        isActive ? "text-primary" : "text-gray-600"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
