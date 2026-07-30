import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CTA_FILMSTRIP } from "@/lib/membershipAssets";

/**
 * Landing bottom CTA (cta-12 pattern):
 * light parchment wash + centered headline + amber Join button + grayscale filmstrip.
 * Matches the production look on acc-v4 (filmstrip always visible, not tied to testimonials).
 */
type Props = {
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** When false, omit the image filmstrip (e.g. interior pages). Default true. */
  showFilmstrip?: boolean;
};

const FILMSTRIP = CTA_FILMSTRIP;

/** Exactly two lines: "You've been doing this alone" / "long enough." */
export const GROWTH_FOCUS_HEADING = (
  <>
    <span style={{ display: "block", whiteSpace: "nowrap" }}>
      You&apos;ve been doing this alone
    </span>
    <em style={{ display: "block", color: "#C2963A", fontStyle: "italic", whiteSpace: "nowrap" }}>
      long enough.
    </em>
  </>
);

export function GrowthFocusCta({
  eyebrow,
  heading = GROWTH_FOCUS_HEADING,
  subheading,
  ctaLabel = "Join Austin Clinician Circle",
  ctaHref = "/join",
  showFilmstrip = true,
}: Props) {
  return (
    <section className="relative overflow-hidden text-center" style={{ background: "#F0EDE6" }}>
      {/* Soft photo wash behind copy */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/testimonials-cta-bg.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(240,237,230,0.88) 0%, rgba(240,237,230,0.78) 55%, rgba(240,237,230,0.92) 100%)",
          }}
        />
      </div>

      <div
        className="relative z-10 mx-auto flex flex-col items-center gap-5"
        style={{
          maxWidth: 800,
          padding: "clamp(3.5rem, 8vw, 6rem) 1.25rem clamp(2.5rem, 5vw, 3.5rem)",
        }}
      >
        {eyebrow ? (
          <p
            className="text-[11px] font-medium uppercase tracking-[0.28em]"
            style={{ color: "#C2963A" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className="leading-[1.15]"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            /* slightly smaller floor so line 1 fits on phones without wrapping */
            fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
          }}
        >
          {heading}
        </h2>
        {subheading ? (
          <p className="text-base md:text-lg" style={{ color: "rgba(74,94,72,0.68)", maxWidth: 440 }}>
            {subheading}
          </p>
        ) : null}
        <Link
          href={ctaHref}
          className="relative mt-2 inline-flex items-center text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 overflow-hidden"
          style={{ background: "#C2963A", color: "#fff" }}
        >
          <span className="relative z-10 transition-all duration-500">{ctaLabel}</span>
          <span
            className="absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45"
            style={{ background: "#fff", color: "#C2963A" }}
          >
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>

      {showFilmstrip ? (
        <div className="relative z-10 w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-full min-w-0 md:min-w-full items-end justify-start md:justify-center">
            {FILMSTRIP.map((image, i) => (
              <div
                key={`${image.src}-${i}`}
                className={`relative overflow-hidden shrink-0 w-[28vw] max-w-[140px] md:flex-1 md:w-auto md:max-w-none md:min-w-[140px] lg:min-w-[180px] ${image.height}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  sizes="(max-width: 768px) 28vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
