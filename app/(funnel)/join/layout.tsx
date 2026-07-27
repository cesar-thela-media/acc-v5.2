import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Austin Clinician Circle | Membership Application",
  description:
    "Apply for membership in Austin Clinician Circle, a professional community for licensed therapists in Austin, TX. Sarah reviews every application personally.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
