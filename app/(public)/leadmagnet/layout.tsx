import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Guide for Austin Therapists: Austin Clinician Circle",
  description:
    "Download The Private Practice Playbook: a free guide used by licensed therapists in Austin to build sustainable, fulfilling practices.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
