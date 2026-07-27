"use client";

import type { ReactNode } from "react";
import { LayoutGrid, BookOpen, Folder, CalendarDays, User, CreditCard } from "lucide-react";
import { AppShell, type AppShellLink } from "@/components/layout/AppShell";

const featureLinks: AppShellLink[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutGrid className="size-[18px]" /> },
  { href: "/dashboard/resources", label: "Resources", icon: <BookOpen className="size-[18px]" /> },
  { href: "/dashboard/files", label: "Files", icon: <Folder className="size-[18px]" /> },
  { href: "/dashboard/events", label: "Events", icon: <CalendarDays className="size-[18px]" /> },
];

const settingsLinks: AppShellLink[] = [
  { href: "/dashboard/profile", label: "Profile", icon: <User className="size-[18px]" /> },
  { href: "/dashboard/billing", label: "Billing", icon: <CreditCard className="size-[18px]" /> },
];

type Props = {
  viewerName?: string;
  viewerPhotoUrl?: string;
  children: ReactNode;
};

/**
 * Member portal chrome — shared light AppShell; role-specific nav only.
 */
export function DashboardNav({ viewerName = "Account", viewerPhotoUrl, children }: Props) {
  return (
    <AppShell
      homeHref="/dashboard"
      tone="member"
      brandLabel="Austin Clinician Circle"
      sectionLabel="Member"
      featureLinks={featureLinks}
      settingsLinks={settingsLinks}
      viewerName={viewerName}
      viewerPhotoUrl={viewerPhotoUrl}
      signOutRedirectTo="/sign-in"
      signOutLabel="Sign out"
      preferLocalProfilePhoto
    >
      {children}
    </AppShell>
  );
}
