import type { Metadata } from "next";
import Link from "next/link";

const SAGE_800 = "#2D3B2C";
const AMBER = "#C2963A";
const PARCHMENT = "#F0EDE6";

export const metadata: Metadata = {
  title: "Find a Clinician | Austin Clinician Circle",
  description: "Austin Clinician Circle clinician directory — coming soon.",
};

export default function FindAClinicianPage() {
  return (
    <section
      style={{ background: PARCHMENT, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="text-center px-6 max-w-lg">
        <span
          className="inline-block text-[11px] font-medium uppercase tracking-[0.28em] mb-6"
          style={{ color: AMBER }}
        >
          Directory
        </span>
        <h1
          className="leading-[1.08] mb-5"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: SAGE_800,
          }}
        >
          Coming soon
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed mb-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Our clinician directory will go live after launch. Licensed members
          of Austin Clinician Circle will be searchable by specialty, modality, location,
          and availability.
        </p>
        <Link
          href="/join"
          className="inline-flex items-center justify-center rounded-full text-sm font-semibold px-8 py-3.5 transition-opacity hover:opacity-90"
          style={{ background: AMBER, color: "#fff" }}
        >
          Apply for membership →
        </Link>
      </div>
    </section>
  );
}
