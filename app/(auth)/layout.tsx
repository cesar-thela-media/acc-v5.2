import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Austin Clinician Circle",
  description:
    "Log in to your Austin Clinician Circle member account to access the resource library, events, referral network, and more.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
