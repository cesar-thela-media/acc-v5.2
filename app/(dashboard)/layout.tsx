import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { getCurrentMemberName, getCurrentViewer } from "@/lib/auth";
import { hasClerkCredentials } from "@/lib/env";

export const metadata: Metadata = {
  title: "Dashboard | The Circle",
  description:
    "Your member dashboard. Access resources, events, your referral network, billing, and profile settings.",
};

const DEFAULT_PHOTO = "/sarah-arnold.jpeg";

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
  const viewerPhotoUrl = hasClerkCredentials && viewer.user?.imageUrl ? viewer.user.imageUrl : DEFAULT_PHOTO;

  return (
    <div className="flex min-h-screen md:h-screen md:overflow-hidden" style={{ background: "var(--color-cream-100)" }}>
      <DashboardNav viewerName={viewerName} viewerPhotoUrl={viewerPhotoUrl} />
      <main
        className="flex-1 min-w-0 overflow-visible md:h-screen md:overflow-y-auto pt-16"
        style={{ background: "var(--color-cream-100)", color: "var(--color-text-primary)" }}
      >
        <div className="container-fluid py-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
