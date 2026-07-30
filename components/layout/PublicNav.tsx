"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/shadcn/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { Separator } from "@/components/ui/shadcn/separator";

const navigationData = [
  { name: "Who We Are", href: "/who-we-are" },
  { name: "What We Offer", href: "/what-we-offer" },
  { name: "Find a Clinician", href: "/find-a-clinician" },
];

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu after navigation (effect avoids render-time setState / hydration risk).
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 p-3 sm:p-4 pt-3 sm:pt-4" style={{ background: "transparent" }}>
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <nav
          className="w-full flex items-center h-fit justify-between gap-2 sm:gap-3.5 lg:gap-6 p-2 sm:p-2.5 rounded-full shadow-md mt-1 sm:mt-2 px-3 sm:px-4 min-w-0"
          style={{
            background: "var(--color-sage-800)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 28px rgba(26,26,26,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-5 pl-1 sm:pl-2 min-w-0">
            {/* Logo — smaller on phones so the pill nav doesn't dominate */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Austin Clinician Circle">
              <Image src="/logo-mark.png" alt="" width={160} height={58} className="h-10 sm:h-12 lg:h-14 w-auto object-contain" priority />
            </Link>

            <Separator
              orientation="vertical"
              className="h-4 data-[orientation=vertical]:self-center max-lg:hidden"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />

            {/* Navigation */}
            <NavigationMenu className="max-lg:hidden">
              <NavigationMenuList className="flex gap-0.5">
                {navigationData.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        className="px-2 lg:px-4 py-1.5 text-base rounded-xl transition tracking-normal whitespace-nowrap hover:bg-white/10"
                        style={{
                          /* Active must stay light on sage-800 — sage-on-sage made links invisible. */
                          color: active ? "#fff" : "rgba(255,255,255,0.72)",
                          fontWeight: active ? 600 : 400,
                          background: active ? "rgba(255,255,255,0.12)" : "transparent",
                        }}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/sign-in"
              className="h-10 flex items-center px-5 text-sm font-medium rounded-xl transition-colors hover:bg-white/10"
              style={{ color: "#fff" }}
            >
              Log in
            </Link>
            <Button
              render={<Link href="/join" />}
              nativeButton={false}
              className="h-10 px-5 rounded-xl cursor-pointer"
              style={{ background: "#fff", color: "var(--color-sage-800)" }}
            >
              Join Austin Clinician Circle
            </Button>
          </div>

          {/* Mobile menu — icon must live on the button (empty render hid the Menu glyph). */}
          <div className="lg:hidden pr-1">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border h-10 w-10 cursor-pointer inline-flex items-center justify-center"
                    style={{
                      borderColor: "rgba(255,255,255,0.35)",
                      color: "#fff",
                      background: "rgba(255,255,255,0.08)",
                    }}
                    aria-label="Open menu"
                  >
                    <Menu size={20} strokeWidth={2} />
                  </Button>
                }
              />
              <SheetContent showCloseButton={false} side="right" className="min-w-80 p-0">
                <ScrollArea className="h-full">
                  <SheetHeader className="p-4">
                    <SheetTitle className="text-left">
                      <Image src="/logo-mark.png" alt="Austin Clinician Circle" width={160} height={58} className="h-12 w-auto object-contain" />
                    </SheetTitle>
                    <SheetClose className="absolute top-4 right-4 rounded-xl bg-black text-white p-2.5 cursor-pointer">
                      <X size={16} />
                    </SheetClose>
                  </SheetHeader>
                  <div className="px-4 py-2">
                    <div className="flex flex-col gap-1">
                      {navigationData.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-base rounded-xl px-3 py-3 min-h-12 flex items-center transition-colors hover:bg-black/5"
                            style={{ color: active ? "var(--color-sage-800)" : "rgba(26,26,26,0.8)", fontWeight: active ? 600 : 400 }}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-5 flex flex-col gap-2.5">
                      <Link
                        href="/sign-in"
                        onClick={() => setIsOpen(false)}
                        className="text-center py-3 min-h-12 flex items-center justify-center rounded-xl text-sm border"
                        style={{ borderColor: "rgba(74,94,72,0.2)", color: "#1A1A1A" }}
                      >
                        Log in
                      </Link>
                      <Button
                        render={<Link href="/join" onClick={() => setIsOpen(false)} />}
                        nativeButton={false}
                        className="w-full rounded-xl h-12 cursor-pointer"
                        style={{ background: "var(--color-sage-800)", color: "#fff" }}
                      >
                        Join Austin Clinician Circle
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
