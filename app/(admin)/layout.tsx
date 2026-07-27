import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminNav } from "@/components/layout/AdminNav";
import { getCurrentMemberName, getCurrentViewer } from "@/lib/auth";
import { hasClerkCredentials } from "@/lib/env";
import { DEFAULT_PROFILE_PHOTO } from "@/lib/profilePhoto";

export const metadata: Metadata = {
  title: "Admin | Austin Clinician Circle",
  description:
    "Admin dashboard for managing members, applications, events, and resources.",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (hasClerkCredentials) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: "/admin" });
    }

    const viewer = await getCurrentViewer();
    if (!viewer.isAdmin) {
      redirect("/dashboard");
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
    <AdminNav viewerName={viewerName} viewerPhotoUrl={viewerPhotoUrl}>
      {children}
    </AdminNav>
  );
}
