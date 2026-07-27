import type { Metadata } from "next";
import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Austin Clinician Circle | Deepen your work. Find your community.",
  description:
    "Austin Clinician Circle is a membership network for licensed clinicians in Austin, TX. Deepen your work. Find your community.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
