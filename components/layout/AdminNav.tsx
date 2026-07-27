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
      {children}
    </AppShell>
  );
}
