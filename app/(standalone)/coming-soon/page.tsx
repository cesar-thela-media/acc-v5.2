import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// DRAFT — placeholder copy, not yet reviewed/approved by the client.
// Built to satisfy "a site they can find before the page is ready to go"
// for pre-launch invitations (see context.md). Confirm wording with her
// before this URL goes into any real invitation.
const SAGE_800 = "#2D3B2C";
const AMBER = "#C2963A";

export const metadata: Metadata = {
  title: "You're Invited | Austin Clinician Circle",
  description: "Austin Clinician Circle's member portal is almost ready. You've been personally invited to join as a founding member.",
  robots: { index: false, follow: false },
};

export default function InvitePage() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: SAGE_800 }}
    >
      {/* Decorative rings */}
      <div
        className="absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      />
      <div
        className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
      />

      {/* Header */}
      <header className="relative z-10 px-5 md:px-6 pt-6 md:pt-8">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <Link href="/" aria-label="Austin Clinician Circle" className="no-underline flex items-center gap-3">
            <Image src="/logo-mark.png" alt="Austin Clinician Circle" width={2000} height={732} className="h-16 w-auto object-contain" />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full"
            style={{ background: "rgba(194,150,58,0.16)", border: "1px solid rgba(194,150,58,0.3)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: AMBER }}>
              You&apos;re invited
            </span>
          </div>

          <h1
            className="leading-[1.1] mb-6"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Austin Clinician Circle is almost ready.
          </h1>

          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.62)" }}
          >
            We&apos;re putting the finishing touches on the member portal, subscriptions, your resource library, and CEU tracking. You&apos;ve been personally invited to join as a founding member.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold px-8 py-3.5 transition-opacity hover:opacity-90"
              style={{ background: AMBER, color: "#fff" }}
            >
              Apply for founding membership →
            </Link>
            <Link
              href="/what-we-offer"
              className="inline-flex items-center justify-center rounded-full text-sm font-medium px-8 py-3.5 transition-colors hover:bg-white/10"
              style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.24)" }}
            >
              See what&apos;s included
            </Link>
          </div>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Questions before you apply? Email{" "}
            <a href="mailto:sarah@restoredfamily.com" className="underline" style={{ color: "rgba(255,255,255,0.62)", textUnderlineOffset: "3px" }}>
              sarah@restoredfamily.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 md:px-6 pb-8 md:pb-10 text-center">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.26)" }}>
          Founded by Sarah Arnold, LPC-S · Austin, TX
        </p>
      </footer>
    </div>
  );
}
