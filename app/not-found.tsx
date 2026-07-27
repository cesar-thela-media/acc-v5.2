import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 md:px-6"
      style={{ background: "#2D3B2C" }}
    >
      <div className="max-w-md text-center">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.2em] mb-4"
          style={{ color: "#C2963A" }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(4rem, 12vw, 7rem)",
            color: "rgba(255,255,255,0.12)",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "rgba(255,255,255,0.88)",
            marginBottom: "1.25rem",
          }}
        >
          Page not found.
        </h2>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.48)" }}
        >
          This page doesn&apos;t exist or has been moved. Austin Clinician Circle is still
          growing, and some pages may have shifted.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#C2963A", color: "#fff" }}
          >
            Back to home
          </Link>
          <Link
            href="/what-we-offer"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium transition-colors hover:bg-white/[0.06]"
            style={{
              color: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            Explore membership
          </Link>
        </div>
      </div>
    </div>
  );
}
