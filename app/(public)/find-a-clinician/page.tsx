import { MOCK_CLINICIANS, initialsFor } from "@/lib/mockClinicians";

const SAGE_800 = "#2D3B2C";
const AMBER = "#C2963A";
const PARCHMENT = "#F0EDE6";

/** Soft photo-plate backgrounds so placeholder avatars read as large portrait tiles. */
const PLATE = [
  "linear-gradient(160deg, #D8E0D4 0%, #B8C5B4 100%)",
  "linear-gradient(160deg, #E8E0D0 0%, #C9BBA8 100%)",
  "linear-gradient(160deg, #D4DCE8 0%, #A8B4C4 100%)",
  "linear-gradient(160deg, #E4D8D0 0%, #C4AFA4 100%)",
  "linear-gradient(160deg, #D8D4E0 0%, #B0A8C0 100%)",
  "linear-gradient(160deg, #D0E0DC 0%, #A0B8B0 100%)",
  "linear-gradient(160deg, #E0DCD0 0%, #C0B8A0 100%)",
  "linear-gradient(160deg, #D0D8E0 0%, #A8B0C0 100%)",
  "linear-gradient(160deg, #E0D4D8 0%, #C0A8B0 100%)",
];

export const metadata = {
  title: "Find a Clinician | The Circle",
  description:
    "Preview of The Circle clinician directory layout. Public directory coming soon.",
};

/**
 * Card layout similar to restoredfamily.com/team (large photo area, name, role, tags).
 * Placeholder clinicians only — not real practice names or photos.
 * Heading lives in the same section as the listing (not a separate hero band).
 */
export default function FindAClinicianPage() {
  return (
    <section style={{ background: PARCHMENT, padding: "clamp(3rem,6vw,5rem) 1.25rem" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <header className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <p className="font-medium uppercase tracking-[0.28em] text-[11px] mb-4" style={{ color: AMBER }}>
            Community
          </p>
          <h1
            className="leading-[1.08] mb-4"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: SAGE_800,
            }}
          >
            Find a clinician
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Directory layout preview. Live profiles open after launch.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {MOCK_CLINICIANS.map((c, i) => (
            <article
              key={c.name}
              className="flex flex-col overflow-hidden rounded-2xl bg-white border transition-shadow hover:shadow-lg"
              style={{ borderColor: "rgba(45,59,44,0.10)" }}
            >
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  aspectRatio: "3 / 4",
                  minHeight: 320,
                  background: PLATE[i % PLATE.length],
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-3xl sm:text-4xl font-semibold tracking-wide"
                  style={{
                    width: "42%",
                    maxWidth: 140,
                    aspectRatio: "1",
                    background: "rgba(255,255,255,0.55)",
                    color: SAGE_800,
                    boxShadow: "0 8px 24px rgba(45,59,44,0.12)",
                  }}
                  aria-hidden
                >
                  {initialsFor(c.name)}
                </div>
              </div>
              <div className="flex flex-col gap-3.5 p-6 flex-1">
                <div>
                  <h2
                    className="text-2xl leading-snug mb-1.5"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontWeight: 400,
                      color: SAGE_800,
                    }}
                  >
                    {c.name}
                  </h2>
                  <p className="text-sm leading-snug" style={{ color: "var(--color-text-secondary)" }}>
                    {c.role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.specialties.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(194,150,58,0.12)",
                        color: "#7A5E1E",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-auto pt-4 flex items-center justify-between gap-2 text-sm border-t"
                  style={{ borderColor: "rgba(45,59,44,0.08)", color: "var(--color-text-secondary)" }}
                >
                  <span>{c.rate}</span>
                  <span style={{ color: SAGE_800, fontWeight: 500 }}>{c.format}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
