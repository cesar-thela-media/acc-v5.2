"use client";

import type { ReactNode } from "react";
import { LayoutGrid, Users, FileText, BookOpen, CalendarDays } from "lucide-react";
import { AppShell, type AppShellLink } from "@/components/layout/AppShell";

const featureLinks: AppShellLink[] = [
  { href: "/admin", label: "Overview", icon: <LayoutGrid className="size-[18px]" /> },
  { href: "/admin/members", label: "Members", icon: <Users className="size-[18px]" /> },
  { href: "/admin/applications", label: "Applications", icon: <FileText className="size-[18px]" /> },
  { href: "/admin/resources", label: "Resources", icon: <BookOpen className="size-[18px]" /> },
  { href: "/admin/events", label: "Events", icon: <CalendarDays className="size-[18px]" /> },
];

type Props = {
  viewerName?: string;
  viewerPhotoUrl?: string;
  children: ReactNode;
};

/**
 * Admin portal chrome — shared light AppShell (same as members); role-specific nav only.
 */
export function AdminNav({ viewerName = "Account", viewerPhotoUrl, children }: Props) {
  return (
    <AppShell
      homeHref="/admin"
      tone="admin"
      brandLabel="Austin Clinician Circle"
      sectionLabel="Admin"
      featureLinks={featureLinks}
      viewerName={viewerName}
      viewerPhotoUrl={viewerPhotoUrl}
      signOutRedirectTo="/admin/login"
      signOutLabel="Log out"
    >
      <div
        className="mx-0 mb-3 sm:mb-4 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-[11px] sm:text-sm leading-snug"
        style={{
          background: "rgba(184,137,46,0.12)",
          border: "1px solid rgba(184,137,46,0.28)",
          color: "var(--color-sage-800)",
        }}
        role="status"
      >
        <span className="font-semibold" style={{ color: "#9A7426" }}>
          Sample data
        </span>
        <span style={{ color: "var(--color-text-secondary)" }}>
          <span className="sm:hidden">: demo content; stays in this browser.</span>
          <span className="hidden sm:inline">
            {": "}
            roster, applications, events, and resources are demo content for this preview. Changes stay
            in this browser only.
          </span>
        </span>
      </div>
      {children}
    </AppShell>
  );
}
