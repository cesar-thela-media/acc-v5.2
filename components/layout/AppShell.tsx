"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { MobileSidePanel } from "@/components/layout/MobileSidePanel";
import { ShellSearch } from "@/components/layout/ShellSearch";
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
import { isExactOrChildPath, shellActiveStyle } from "@/lib/navShell";
import { PROFILE_PHOTO_EVENT, readStoredProfilePhoto } from "@/lib/profilePhoto";

/**
 * ACC design tokens (docs/DESIGN.md + globals.css)
 * Structure stays Shadcn Space (sidebar + search header + inset content);
 * member = sage; admin = muted warm amber (not neon yellow).
 */
const CREAM = "var(--color-cream-100)"; /* #F0EDE6 */
const TEXT = "var(--color-text-primary)";

/** Admin portal chrome — muted ACC amber (distinct from member sage) */
const ADMIN_SHELL = "#B8892E";
const ADMIN_SHELL_DEEP = "#9A7426";
const ADMIN_INK = "#FFFFFF";

export type AppShellLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export type AppShellTone = "member" | "admin";

type AppShellProps = {
  homeHref: string;
  /** member = sage sidebar; admin = muted amber chrome */
  tone?: AppShellTone;
  brandLabel?: string;
  sectionLabel?: string;
  featureLinks: AppShellLink[];
  settingsLinks?: AppShellLink[];
  viewerName?: string;
  viewerPhotoUrl?: string;
  signOutRedirectTo?: string;
  signOutLabel?: string;
  preferLocalProfilePhoto?: boolean;
  children: ReactNode;
};

/**
 * Layout pattern: Shadcn Space (full-height sidebar, search header, rounded inset).
 * Palette: ACC sage (member) / muted amber (admin), cream content canvas.
 */
export function AppShell({
  homeHref,
  tone = "member",
  brandLabel = "Austin Clinician Circle",
  sectionLabel = "Menu",
  featureLinks,
  settingsLinks = [],
  viewerName = "Account",
  viewerPhotoUrl,
  signOutRedirectTo = "/sign-in",
  signOutLabel = "Sign out",
  preferLocalProfilePhoto = false,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(viewerPhotoUrl);

  const isAdmin = tone === "admin";
  const MEMBER_SHELL = "#4A5E48"; /* same sage as member sidebar */
  const shellTop = isAdmin ? ADMIN_SHELL : MEMBER_SHELL;
  const shellBottom = isAdmin ? ADMIN_SHELL_DEEP : "#4A5E48";
  const shellSolid = isAdmin ? ADMIN_SHELL : MEMBER_SHELL;
  /** Outer frame/gutter matches sidebar chrome */
  const shellChrome = isAdmin ? ADMIN_SHELL : MEMBER_SHELL;
  /** Admin amber is dark enough for light nav text (same as member sage). */
  const navMode = "dark";
  const mutedOnShell = "rgba(255,255,255,0.42)";
  const textOnShell = "#fff";
  const textOnShellMuted = "rgba(255,255,255,0.58)";
  const shellDivider = "rgba(255,255,255,0.12)";
  const shellCardBg = "rgba(255,255,255,0.08)";
  const shellCardBorder = "rgba(255,255,255,0.12)";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!preferLocalProfilePhoto) {
      setAvatarUrl(viewerPhotoUrl);
      return;
    }
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
  }, [viewerPhotoUrl, preferLocalProfilePhoto]);

  const initials = viewerName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function NavLinkList({
    links,
    onNavigate,
  }: {
    links: AppShellLink[];
    onNavigate?: () => void;
  }) {
    return (
      <nav className="flex flex-col gap-0.5">
        {links.map((link) => {
          const active = isExactOrChildPath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150"
              style={shellActiveStyle(active, navMode)}
            >
              <span className="shrink-0 opacity-90">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  const sidebarBody = (
    <>
      <div className="app-shell-scroll flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
        <p
          className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: mutedOnShell }}
        >
          {sectionLabel}
        </p>
        <NavLinkList links={featureLinks} onNavigate={() => setMobileOpen(false)} />

        {settingsLinks.length > 0 && (
          <>
            <p
              className="px-3 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: mutedOnShell }}
            >
              Account
            </p>
            <NavLinkList links={settingsLinks} onNavigate={() => setMobileOpen(false)} />
          </>
        )}
      </div>
      <div
        className="mx-3 mb-4 rounded-xl p-3.5"
        style={{
          background: shellCardBg,
          border: `1px solid ${shellCardBorder}`,
        }}
      >
        <p className="text-[11px] font-semibold leading-snug" style={{ color: textOnShell }}>
          Austin Clinician Circle
        </p>
        <p className="text-[11px] mt-1 leading-snug" style={{ color: textOnShellMuted }}>
          Deepen your work. Find your community.
        </p>
        <div
          className="mt-2 h-0.5 w-8 rounded-full"
          style={{ background: isAdmin ? ADMIN_INK : "#C2963A" }}
          aria-hidden
        />
      </div>
    </>
  );

  const profileMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-90">
        <Avatar size="sm" className="size-9 after:border-black/10">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="" className="object-cover object-top" />
          ) : null}
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ background: shellSolid }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-52 rounded-xl p-1.5 border-0"
        style={{
          background: shellSolid,
          color: "#fff",
          boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-sm text-white/55">
            {viewerName}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {settingsLinks.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-white/15" />
            <DropdownMenuGroup>
              {settingsLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  className="rounded-lg px-2 py-2 cursor-pointer text-white/90 focus:bg-white/10 focus:text-white"
                  onClick={() => {
                    window.location.href = link.href;
                  }}
                >
                  {link.icon}
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator className="bg-white/15" />
        <div className="px-0.5 py-0.5">
          <SignOutAction
            label={signOutLabel}
            redirectTo={signOutRedirectTo}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      className="app-shell flex min-h-dvh md:h-dvh md:max-h-dvh md:overflow-hidden w-full max-w-[100vw]"
      style={{ background: shellChrome }}
    >
      {/* Brand sidebar: sage (member) / muted amber (admin) */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[220px] lg:w-[248px] flex-col"
        style={{
          background: `linear-gradient(180deg, ${shellTop} 0%, ${shellBottom} 100%)`,
          borderRight: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="flex h-[80px] lg:h-[96px] shrink-0 items-center justify-center px-3 lg:px-5"
          style={{ borderBottom: `1px solid ${shellDivider}` }}
        >
          <Link
            href={homeHref}
            className="flex w-full items-center justify-center py-2"
            aria-label={brandLabel}
          >
            <Image
              src="/logo-with-ACC-text.png"
              alt="Austin Clinician Circle"
              width={320}
              height={96}
              className="h-12 lg:h-16 w-auto max-w-full object-contain object-center"
              priority
            />
          </Link>
        </div>
        {sidebarBody}
      </aside>

      <div className="hidden md:block w-[220px] lg:w-[248px] shrink-0" aria-hidden="true" />

      {/* Inset content panel — fills remaining viewport */}
      <div className="flex-1 min-w-0 w-full flex flex-col p-0 md:p-2 md:pl-0 md:pr-2 md:pb-2 lg:p-2.5 lg:pl-0 lg:pr-2.5 lg:pb-2.5">
        <div
          className="flex flex-1 flex-col min-h-0 h-full w-full min-w-0 md:rounded-2xl md:overflow-hidden"
          style={{
            background: CREAM,
            border: "1px solid rgba(74,94,72,0.10)",
            boxShadow: "0 4px 24px rgba(74,94,72,0.06)",
          }}
        >
          <header
            className="sticky top-0 z-20 h-[56px] sm:h-[60px] shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 w-full min-w-0"
            style={{
              background: "rgba(255,255,255,0.97)",
              borderBottom: "1px solid rgba(74,94,72,0.08)",
            }}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ background: "rgba(74,94,72,0.08)", color: "#4A5E48" }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <ShellSearch
              scope={isAdmin ? "admin" : "member"}
              placeholder={isAdmin ? "Search…" : "Search…"}
            />

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex relative items-center justify-center w-10 h-10 min-w-10 min-h-10 rounded-full transition-colors hover:bg-black/5 outline-none"
                  style={{ color: "rgba(74,94,72,0.55)" }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  <span
                    className="absolute top-2 right-2 size-2 rounded-full ring-2 ring-white"
                    style={{ background: isAdmin ? "#E8C56A" : "#C2963A" }}
                    aria-hidden
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-72 rounded-xl p-0 overflow-hidden">
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: "rgba(74,94,72,0.08)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-sage-800)" }}>
                      Notifications
                    </p>
                  </div>
                  <DropdownMenuGroup>
                    {(isAdmin
                      ? [
                          {
                            href: "/admin/applications",
                            title: "Applications need review",
                            meta: "3 pending membership applications",
                          },
                          {
                            href: "/admin/events",
                            title: "Upcoming event this week",
                            meta: "Monthly case consultation",
                          },
                          {
                            href: "/admin/members",
                            title: "New members joined",
                            meta: "Roster updated this month",
                          },
                        ]
                      : [
                          {
                            href: "/dashboard/events",
                            title: "Event reminder",
                            meta: "Monthly case consultation, RSVP open",
                          },
                          {
                            href: "/dashboard/resources",
                            title: "New resource available",
                            meta: "CBT Session Planning Template",
                          },
                          {
                            href: "/dashboard/billing",
                            title: "Membership renewal",
                            meta: "Review your subscription anytime",
                          },
                        ]
                    ).map((n) => (
                      <DropdownMenuItem
                        key={n.href + n.title}
                        className="rounded-none px-3 py-2.5 cursor-pointer flex flex-col items-start gap-0.5"
                        onClick={() => {
                          window.location.href = n.href;
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: "var(--color-sage-800)" }}>
                          {n.title}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {n.meta}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {profileMenu}
            </div>
          </header>

          {/* Scroll lives on main only; themed track sits flush to the panel edge */}
          <main
            className="app-shell-scroll flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden"
            style={{ background: CREAM, color: TEXT }}
          >
            <div className="w-full max-w-full min-w-0 px-3 py-3.5 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </main>
        </div>
      </div>

      <MobileSidePanel
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        background={shellSolid}
        borderColor={shellDivider}
        titleColor={textOnShell}
        closeColor={textOnShellMuted}
        title={
          <Image
            src="/logo-with-ACC-text.png"
            alt="Austin Clinician Circle"
            width={280}
            height={80}
            className="h-12 w-auto max-w-[200px] object-contain object-center"
          />
        }
      >
        <div className="flex flex-col flex-1 min-h-0 -mx-2">
          {sidebarBody}
          <div className="px-3 pb-2" style={{ borderTop: `1px solid ${shellDivider}` }}>
            <SignOutAction
              label={signOutLabel}
              redirectTo={signOutRedirectTo}
              onSignedOut={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium w-full hover:opacity-80"
              style={{ color: textOnShellMuted }}
            />
          </div>
        </div>
      </MobileSidePanel>
    </div>
  );
}

export const APP_SHELL_COLOR = "#4A5E48";
