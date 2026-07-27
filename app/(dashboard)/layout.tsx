import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { getCurrentMemberName, getCurrentViewer } from "@/lib/auth";
import { hasClerkCredentials } from "@/lib/env";
import { DEFAULT_PROFILE_PHOTO } from "@/lib/profilePhoto";

export const metadata: Metadata = {
  title: "Dashboard | Austin Clinician Circle",
  description:
    "Your member dashboard. Access resources, events, your referral network, billing, and profile settings.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (hasClerkCredentials) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: "/dashboard" });
    }
  }

  const [{ firstName }, viewer] = await Promise.all([
    getCurrentMemberName(),
    getCurrentViewer(),
  ]);
  const viewerName = firstName || "Account";
  const viewerPhotoUrl =
    hasClerkCredentials && viewer.user?.imageUrl
      ? viewer.user.imageUrl
      : DEFAULT_PROFILE_PHOTO;

  return (
    <DashboardNav viewerName={viewerName} viewerPhotoUrl={viewerPhotoUrl}>
      {children}
    </DashboardNav>
  );
}
