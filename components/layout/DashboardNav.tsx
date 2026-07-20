"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutGrid, BookOpen, Folder, CalendarDays, User, CreditCard, ChevronDown } from "lucide-react";
import { PROFILE_PHOTO_EVENT, readStoredProfilePhoto } from "@/lib/profilePhoto";
import { MobileSidePanel } from "@/components/layout/MobileSidePanel";
import { SignOutAction } from "@/components/auth/SignOutAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import { Separator } from "@/components/ui/shadcn/separator";
import { isExactOrChildPath, partitionShellLinks, shellActiveStyle } from "@/lib/navShell";

/** Mid sage shell — solid hex so chrome never falls back to transparent */
const APP_SHELL = "#4A5E48";

const featureLinks = [
  { href: "/dashboard", label: "Overview", icon: <LayoutGrid className="size-[18px]" /> },
  { href: "/dashboard/resources", label: "Resources", icon: <BookOpen className="size-[18px]" /> },
  { href: "/dashboard/files", label: "Files", icon: <Folder className="size-[18px]" /> },
  { href: "/dashboard/events", label: "Events", icon: <CalendarDays className="size-[18px]" /> },
];

const settingsLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: <User className="size-[18px]" /> },
  { href: "/dashboard/billing", label: "Billing", icon: <CreditCard className="size-[18px]" /> },
];

const SETTINGS_HREFS = settingsLinks.map((l) => l.href);

type Props = {
  viewerName?: string;
  viewerPhotoUrl?: string;
};

export function DashboardNav({ viewerName = "Account", viewerPhotoUrl }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(viewerPhotoUrl);
  const { features: mobileFeatures, settings: mobileSettings } = partitionShellLinks(
    [...featureLinks, ...settingsLinks],
    SETTINGS_HREFS,
  );

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Prefer locally uploaded profile photo when present (persists across pages).
  useEffect(() => {
    function syncPhoto() {
      const stored = readStoredProfilePhoto();
      setAvatarUrl(stored || viewerPhotoUrl);
    }
    syncPhoto();
    window.addEventListener(PROFILE_PHOTO_EVENT, syncPhoto);
    window.addEventListener("storage", syncPhoto);
    return () => {
      window.removeEventListener(PROFILE_PHOTO_EVENT, syncPhoto);
      window.removeEventListener("storage", syncPhoto);
    };
  }, [viewerPhotoUrl]);

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
        {/* Logo sits in the sidebar column (left), not floating mid-content */}
        <div className="hidden md:flex w-56 shrink-0 items-center justify-center px-3">
          <Link href="/dashboard" className="flex items-center max-w-full" aria-label="The Circle">
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
          <Link href="/dashboard" className="md:hidden flex items-center max-w-[13rem]" aria-label="The Circle">
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
              className="flex items-center gap-2.5 rounded-full pl-1.5 pr-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-white/10 data-popup-open:bg-white/10"
              style={{ color: "#fff" }}
            >
              <Avatar size="sm" className="size-8 after:border-white/20">
                {avatarUrl ? (
                  // data: URLs from profile upload need a plain img path via AvatarImage src
                  <AvatarImage src={avatarUrl} alt="" className="object-cover object-top" />
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
              className="min-w-52 rounded-xl p-1.5 border-0"
              style={{
                background: APP_SHELL,
                color: "#fff",
                boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
              }}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-white/50 px-2 py-1.5">
                  {viewerName}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                {settingsLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    className="rounded-lg px-2 py-2 text-white/85 focus:bg-white/10 focus:text-white cursor-pointer"
                    onClick={() => {
                      window.location.href = link.href;
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="px-0.5 py-0.5">
                <SignOutAction
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
            aria-label="Open menu"
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
          borderRight: "1px solid rgba(255, 255, 255, 0.10)",
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
        <div className="mt-auto px-2 pt-4">
          <Separator className="mb-4 bg-white/10" />
          <p className="px-1 text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>
            The Circle
          </p>
        </div>
      </aside>

      <div className="hidden md:block w-56 shrink-0" aria-hidden="true" />

      <MobileSidePanel
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        background={APP_SHELL}
        borderColor="rgba(255,255,255,0.10)"
        title={<Image src="/logo-with-ACC-text.png" alt="Austin Clinician Circle" width={220} height={64} className="h-11 w-auto object-contain" />}
      >
        <nav className="flex flex-col gap-1.5">
          {mobileFeatures.map((link) => {
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
        {mobileSettings.length > 0 && (
          <>
            <p className="px-4 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Account
            </p>
            <nav className="flex flex-col gap-1.5">
              {mobileSettings.map((link) => {
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
          </>
        )}
        <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <SignOutAction
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.72)" }}
            onSignedOut={() => setMobileOpen(false)}
          />
        </div>
      </MobileSidePanel>
    </>
  );
}
