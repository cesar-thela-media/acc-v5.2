import { Footer } from "@/components/layout/Footer";

/**
 * Focused funnel chrome: the brand logo is now rendered inside the right
 * "Membership application" column (see app/(funnel)/join/page.tsx). The
 * full public site footer sits below the form to keep applicants oriented.
 */
export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
