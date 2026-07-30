import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Austin Clinician Circle",
  description: "Terms of service for Austin Clinician Circle membership.",
};

const SECTIONS = [
  {
    title: "Membership",
    body: "Membership is billed monthly. You can cancel anytime from your billing settings, and you'll keep access through the end of the period you've already paid for.",
  },
  {
    title: "Eligibility",
    body: "Austin Clinician Circle is for licensed mental health clinicians. Membership applications are reviewed personally by Sarah, and approval isn't guaranteed.",
  },
  {
    title: "Community conduct",
    body: "Consultation groups, the referral network, and the private community are professional spaces. We expect members to treat each other, and any client information discussed, with the same confidentiality and professionalism they bring to their own practice.",
  },
  {
    title: "Changes",
    body: "We may update these terms as Austin Clinician Circle grows. If we make a material change, we'll let members know by email.",
  },
];

export default function TermsPage() {
  return (
    <section
      className="min-h-screen flex flex-col items-center px-5 md:px-6"
      style={{ background: "#4A5E48", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="text-center mb-12">
        <p className="font-medium uppercase tracking-[0.28em] text-[11px] mb-6" style={{ color: "#C2963A" }}>
          Legal
        </p>
        <h1
          className="leading-tight"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 400,
            color: "#fff",
          }}
        >
          Terms of Service
        </h1>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C2963A" }}>
              {s.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm mt-10" style={{ color: "rgba(255,255,255,0.35)" }}>
        For questions, contact sarah@restoredfamily.com
      </p>
    </section>
  );
}
