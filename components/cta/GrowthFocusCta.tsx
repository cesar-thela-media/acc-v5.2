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

export function GrowthFocusCta({
  eyebrow,
  heading = (
    <>
      You&apos;ve been doing this alone
      <br />
      <em style={{ color: "#C2963A", fontStyle: "italic" }}>long enough.</em>
    </>
  ),
  subheading,
  ctaLabel = "Join the Circle",
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
          maxWidth: 720,
          padding: "clamp(3.5rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 5vw, 3.5rem)",
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
          className="leading-[1.1]"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
          }}
        >
          {heading}
        </h2>
        {subheading ? (
          <p className="text-base md:text-lg" style={{ color: "rgba(45,59,44,0.68)", maxWidth: 440 }}>
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
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex w-full items-end justify-center min-w-[600px] md:min-w-full">
            {FILMSTRIP.map((image, i) => (
              <div
                key={`${image.src}-${i}`}
                className={`flex-1 min-w-[100px] md:min-w-[140px] lg:min-w-[180px] relative overflow-hidden ${image.height}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
