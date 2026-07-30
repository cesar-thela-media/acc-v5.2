import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Austin Clinician Circle | Membership",
  description:
    "Join Austin Clinician Circle for $79/month. Complete membership and get immediate access to the member portal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
