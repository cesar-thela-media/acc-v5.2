import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Clinician | The Circle",
  description:
    "Our curated directory of licensed clinician members is coming soon. Apply for membership to be one of the first therapists listed.",
};

export default function FindAClinicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
