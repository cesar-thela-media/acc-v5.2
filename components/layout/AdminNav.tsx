"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutGrid, Users, FileText, BookOpen, CalendarDays, ChevronDown } from "lucide-react";
import { MobileSidePanel } from "@/components/layout/MobileSidePanel";
import { SignOutAction } from "@/components/auth/SignOutAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import { isExactOrChildPath, shellActiveStyle } from "@/lib/navShell";

/** Mid sage shell — solid hex so chrome never falls back to transparent */
const APP_SHELL = "#4A5E48";

const featureLinks = [
  { href: "/admin", label: "Overview", icon: <LayoutGrid className="size-[18px]" /> },
  { href: "/admin/members", label: "Members", icon: <Users className="size-[18px]" /> },
  { href: "/admin/applications", label: "Applications", icon: <FileText className="size-[18px]" /> },
  { href: "/admin/resources", label: "Resources", icon: <BookOpen className="size-[18px]" /> },
  { href: "/admin/events", label: "Events", icon: <CalendarDays className="size-[18px]" /> },
];

type Props = {
  viewerName?: string;
  viewerPhotoUrl?: string;
};

export function AdminNav({ viewerName = "Account", viewerPhotoUrl }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const initials = viewerName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16 flex items-stretch"
        style={{
          background: APP_SHELL,
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="hidden md:flex w-56 shrink-0 items-center justify-center px-3">
          <Link href="/admin" className="flex items-center max-w-full" aria-label="The Circle">
            <Image
              src="/logo-with-ACC-text.png"
              alt="Austin Clinician Circle"
              width={240}
              height={72}
              className="h-12 w-auto max-h-12 object-contain"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between gap-3 px-4 md:px-6 min-w-0">
          <Link href="/admin" className="md:hidden flex items-center max-w-[13rem]" aria-label="The Circle">
            <Image
              src="/logo-with-ACC-text.png"
              alt="Austin Clinician Circle"
              width={220}
              height={64}
              className="h-11 w-auto max-h-11 object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2.5 rounded-full pl-1.5 pr-2.5 py-1.5 text-sm outline-none hover:bg-white/10 data-popup-open:bg-white/10"
              style={{ color: "#fff" }}
            >
              <Avatar size="sm" className="size-8 after:border-white/20">
                {viewerPhotoUrl ? (
                  <AvatarImage src={viewerPhotoUrl} alt="" className="object-cover object-top" />
                ) : null}
                <AvatarFallback className="bg-[rgba(194,150,58,0.4)] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline max-w-[8rem] truncate font-medium">{viewerName}</span>
              <ChevronDown className="size-3.5 opacity-70 hidden sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-48 rounded-xl p-1.5 border-0"
              style={{ background: APP_SHELL, color: "#fff", boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 px-2 py-1.5">{viewerName}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="px-0.5 py-0.5">
                <SignOutAction
                  label="Log out"
                  redirectTo="/admin/login"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            aria-label="Open admin menu"
          >
            <Menu size={18} />
          </button>
          </div>
        </div>
      </header>

      <aside
        className="hidden md:flex fixed top-16 left-0 bottom-0 w-56 z-30 flex-col py-6 px-3"
        style={{
          background: APP_SHELL,
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Menu
        </p>
        <nav className="flex flex-col gap-1.5">
          {featureLinks.map((link) => {
            const active = isExactOrChildPath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                style={shellActiveStyle(active)}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="hidden md:block w-56 shrink-0" aria-hidden="true" />

      <MobileSidePanel
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        background={APP_SHELL}
        borderColor="rgba(255,255,255,0.08)"
        closeColor="rgba(255,255,255,0.72)"
        title={<Image src="/logo-with-ACC-text.png" alt="Austin Clinician Circle" width={220} height={64} className="h-11 w-auto object-contain" />}
      >
        <nav className="flex flex-col gap-1.5">
          {featureLinks.map((link) => {
            const active = isExactOrChildPath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={shellActiveStyle(active)}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <SignOutAction
            label="Log out"
            redirectTo="/admin/login"
            onSignedOut={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.52)" }}
          />
        </div>
      </MobileSidePanel>
    </>
  );
}
