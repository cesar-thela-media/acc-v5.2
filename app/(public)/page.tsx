import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, MapPin, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/shadcn/carousel";
import { Separator } from "@/components/ui/shadcn/separator";
import { MembershipCarousel } from "@/components/landing/MembershipCarousel";
import { GrowthFocusCta } from "@/components/cta/GrowthFocusCta";
import { CTA_FILMSTRIP, MEMBERSHIP_ITEMS } from "@/lib/membershipAssets";

/* HIDDEN SECTIONS (toggle to restore):
   - homepage testimonials carousel + filmstrip   (HIDE_TESTIMONIALS)
   - /who-we-are What-We-Believe cards                (HIDE_VALUES)
*/
const HIDE_TESTIMONIALS = true; /* flip to false to restore the hidden block below */

/* ── Reference design tokens ───────────────────────────────── */
const HERO_BG   = "#2D3B2C";   // deep forest sage — hero, CTA band, footer
const AMBER     = "#C2963A";   // muted warm amber — accents, CTAs

/* ── Pricing features ─────────────────────────────────────── */
const pricingFeatures = [
  ["Monthly case consultation",       "Public directory listing"],
  ["Full access to resource library", "Practice coaching support"],
  ["Referral network connection",     "Continuing education discounts"],
  ["Private online community",        "Professional will designation"],
];

const membershipItems = MEMBERSHIP_ITEMS;
const ctaImages = CTA_FILMSTRIP;

/* ── Testimonials (testimonial-02) — optional / preview only ─ */
const placeholderTestimonials = [
  {
    quote: "This is placeholder testimonial text, shown here so we can preview how member testimonials would look on the page. Not a real quote from a real member.",
    author: "Member Name",
    role: "Licensed Clinician, The Circle",
    image: "/testimonial-1.jpg",
  },
  {
    quote: "A second placeholder quote for layout purposes only. Once Sarah approves real member testimonials, they would replace this text.",
    author: "Member Name",
    role: "Licensed Clinician, The Circle",
    image: "/testimonial-2.jpg",
  },
];

/* ── Shared components ────────────────────────────────────── */
function AmberCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="8" fill={AMBER} />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="p-4 pt-0">
        <div
          className="relative flex flex-col items-start justify-end overflow-hidden rounded-3xl"
          style={{ minHeight: "calc(100svh - 88px)" }}
        >
          {/* Background video — calm nature stock (real footage, not Ken Burns) */}
          <video
            src="/hero-video.mp4"
            poster="/hero-bg-2.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "50% 40%" }}
          />

          {/* Dark gradient scrim for legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${HERO_BG} 0%, rgba(45,59,44,0.92) 42%, rgba(45,59,44,0.55) 70%, transparent 100%)` }}
          />

          {/* Content */}
          <div className="relative z-10 w-full" style={{ maxWidth: 1100, padding: "0 2rem 4.5rem", margin: "0 auto" }}>
            {/* Eyebrow */}
            <p
              className="uppercase tracking-[0.28em] font-medium mb-6 text-xs"
              style={{
                color: `rgba(194,150,58,0.85)`,
                animation: "fadeInUp 0.55s 0.1s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              For licensed clinicians in Austin, TX
            </p>

            {/* Headline — Playfair Display 400 (closest free match to Tiempos Fine / Freight Display Light) */}
            <h1
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.0,
                marginBottom: "1.75rem",
                animation: "fadeInUp 0.75s 0.2s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              <span style={{ color: "#fff", display: "block" }}>Deepen your work.</span>
              <em style={{ color: AMBER, fontStyle: "italic", display: "block" }}>Find your community.</em>
            </h1>

            {/* Sub-headline */}
            <p
              className="text-sm md:text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: "rgba(255,255,255,0.62)", animation: "fadeInUp 0.75s 0.28s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              A membership network for licensed therapists who want to do deeper work, together.
            </p>

            {/* CTA row */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5"
              style={{ animation: "fadeInUp 0.75s 0.36s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <Link
                href="/join"
                className="relative overflow-hidden group inline-flex items-center justify-center rounded-full text-sm font-medium"
                style={{ background: "#fff", color: "#1A1A1A", padding: "0.85rem 2.2rem" }}
              >
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-10 h-10 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-[18]"
                  style={{ background: AMBER }}
                />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  Apply for membership
                  <ArrowRight size={16} className="group-hover:-rotate-45 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                href="/what-we-offer"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                See what&apos;s included →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY THE CIRCLE EXISTS (about-us-section-09) ══════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#F7F5F0", padding: "clamp(3rem,6vw,5.5rem) 0" }}
      >
        {/* Stronger top-left quarter-circle gradient (distinct from Membership includes). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top: "-22%",
            left: "-14%",
            width: "min(58vw, 520px)",
            height: "min(58vw, 520px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 38%, rgba(194,150,58,0.48) 0%, rgba(194,150,58,0.22) 38%, rgba(74,94,72,0.12) 58%, transparent 72%)",
          }}
        />
        {/* Mirror amber bloom — bottom-right, slightly smaller, sits inside section padding. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            bottom: "-18%",
            right: "-12%",
            width: "min(46vw, 420px)",
            height: "min(46vw, 420px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 60% 60%, rgba(194,150,58,0.38) 0%, rgba(232,213,163,0.16) 45%, transparent 72%)",
          }}
        />
        <div className="container-fluid relative z-10" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* Left: content */}
            <div className="md:col-span-6 col-span-12 flex flex-col justify-center" data-aos="fade-in-up">
              <p className="uppercase tracking-[0.28em] font-medium text-[11px] mb-5" style={{ color: `rgba(194,150,58,0.85)` }}>
                Why The Circle exists
              </p>

              <h2
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(2.1rem, 4.8vw, 3.5rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  color: "#1A1A1A",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ display: "block" }}>Private practice can feel isolating.</span>
                <em style={{ color: AMBER, fontStyle: "italic", display: "block" }}>You don&apos;t have to do this alone.</em>
              </h2>

              <p className="text-lg leading-[1.6] mb-4" style={{ color: "#3D4A3B" }}>
                When you leave an agency, you gain autonomy and lose the built-in support from colleagues that keeps your clinical work sharp. Most private practitioners never fully replace it.
              </p>
              <p className="text-lg font-semibold mb-8" style={{ color: "#1A1A1A" }}>
                The Circle is here to change that.
              </p>

              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <Award size={18} style={{ color: "#5A7060", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#5A7060" }}>Founded by Sarah Arnold, LPC-S</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={18} style={{ color: "#5A7060", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#5A7060" }}>Austin, Texas</span>
                </li>
              </ul>
            </div>

            {/* Spacer column (matches about-us-09's own 6-1-5 split) */}
            <div className="lg:col-span-1 lg:block hidden" />

            {/* Right: taller photo — unique path (not reused on who-we-are believe cards) */}
            <div
              className="relative lg:col-span-5 md:col-span-6 col-span-12 rounded-2xl overflow-hidden"
              data-aos="fade-in"
              data-delay="150"
              style={{ minHeight: "clamp(420px, 62vh, 560px)" }}
            >
              <Image
                src="/private-practice-can.jpg"
                alt="Private practice can feel isolating — The Circle offers connection"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ MEMBERSHIP INCLUDES (feature-19 + carousel-07) ═══ */}
      {/* Hero-section pattern: white outer section with padding, one big
          rounded card inside holding all the section's real content. */}
      <section className="p-4" style={{ background: "#fff" }}>
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{ background: "#4A5E48", padding: "clamp(2.5rem,5vw,4rem) 0" }}
        >
        {/* Abstract decorative layers — organic sage/amber linework in place of plain radial blobs. */}
        <Image
          src="/membership-abstract-top.svg"
          alt=""
          fill
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 object-cover opacity-35 mix-blend-screen"
          sizes="100vw"
          priority={false}
        />
        <Image
          src="/membership-abstract-bottom.svg"
          alt=""
          fill
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 object-cover opacity-30 mix-blend-screen"
          sizes="100vw"
          priority={false}
        />
        {/* Soft warm bloom retained for depth — sits between the two abstract layers and content. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            bottom: "-28%",
            right: "-16%",
            width: "min(62vw, 540px)",
            height: "min(62vw, 540px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 55% 55%, rgba(194,150,58,0.32) 0%, rgba(232,213,163,0.12) 40%, transparent 70%)",
          }}
        />
        <div className="container-fluid relative z-10">
          <div className="text-center mb-10" data-aos="fade-in-up">
            <p className="uppercase tracking-[0.28em] font-medium text-[11px] mb-4" style={{ color: AMBER }}>
              Membership includes
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(1.5rem, 4.2vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.018em",
                lineHeight: 1.18,
                color: "#fff",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              Everything you need to
              <br />
              thrive in private practice.
            </h2>
          </div>

          <MembershipCarousel
            slides={membershipItems.map((item) => ({
              image: item.img,
              title: item.title,
              description: item.body,
              badge: item.badge,
            }))}
          />
        </div>
        </div>
      </section>

      {/* ══ PRICING (pricing-14 + background photo) ══════════ */}
      {/* Bottom padding is intentionally larger than top: the header block above the
          card already eats into the "visible photo" space up top, so the extra room
          below balances how much background shows above vs. below the card. */}
      <section className="relative overflow-hidden" style={{ paddingTop: "clamp(2.5rem,5vw,4rem)", paddingBottom: "clamp(5rem,10vw,8rem)" }}>
        <Image src="/pricing-bg.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(rgba(45,59,44,0.88), rgba(45,59,44,0.92))" }} />
        <div className="container-fluid relative z-10">
          {/* Centered header */}
          <div className="text-center mb-8" data-aos="fade-in-up">
            <p className="uppercase tracking-[0.28em] font-medium text-[11px] mb-3" style={{ color: AMBER }}>
              Membership
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(1.8rem, 4.2vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.018em",
                lineHeight: 1.18,
                color: "#fff",
              }}
            >
              Simple, all-inclusive pricing.
            </h2>
          </div>

          {/* Pricing card — single centered card (pricing-14's literal shape, no left/right split) */}
          <div className="flex justify-center">
            <div
              data-aos="scale-in"
              data-delay="80"
              className="rounded-2xl flex flex-col gap-8"
              style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.22)", padding: "2rem", width: "100%", maxWidth: 368 }}
            >
              <div className="flex items-baseline gap-1">
                <span
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(3rem, 7vw, 5rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#1A1A1A",
                  }}
                >
                  $79
                </span>
                <span style={{ fontSize: 14, color: "#7A7A6E" }}>/ month</span>
              </div>

              <Separator style={{ background: "rgba(194,150,58,0.2)" }} />

              <ul className="flex flex-col gap-4">
                {pricingFeatures.flat().map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <AmberCheck />
                    <span style={{ fontSize: 14, color: "#3D4A3B" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/join"
                className="block text-center w-full rounded-lg text-sm font-medium"
                style={{ background: AMBER, color: "#fff", padding: "0.7rem 1.5rem" }}
              >
                Join the Circle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS + CTA (merged; shared light background photo) ══ */}
      {/* Merged per feedback: a separate dark CTA band right after a photo-backed
          Testimonials section would mean two competing background images back to
          back. One light section instead — CTA's heading just loses its dark bg
          and goes to dark-on-light text, matching Testimonials' existing palette. */}
      {!HIDE_TESTIMONIALS && (
      <section className="relative overflow-hidden text-center" style={{ paddingTop: "clamp(2.5rem,5vw,4rem)" }}>
        <Image src="/testimonials-cta-bg.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(240,237,230,0.90)" }} />

        <div className="container-fluid relative z-10">
          <div className="text-center mb-4" data-aos="fade-in">
            <span
              className="inline-flex items-center rounded-full text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ border: "1px dashed rgba(194,150,58,0.5)", color: AMBER, padding: "0.35rem 0.9rem" }}
            >
              Optional / Preview
            </span>
          </div>
          <div className="text-center mb-10" data-aos="fade-in-up" data-delay="80">
            <p className="uppercase tracking-[0.28em] font-medium text-[11px] mb-3" style={{ color: AMBER }}>
              Testimonials
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(1.8rem, 4.2vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.018em",
                lineHeight: 1.18,
                color: "#1A1A1A",
              }}
            >
              From members of The Circle.
            </h2>
          </div>

          <div className="max-w-5xl mx-auto mb-16" data-aos="fade-in-up" data-delay="150">
            <Carousel>
              {/* Nav buttons in normal document flow, not absolute-positioned over the
                  carousel content — measured the vendor's own -top-20 offset landing
                  directly on top of the testimonial photo (both breakpoints), which
                  would only get worse once a background photo sits behind everything. */}
              <div className="flex justify-end gap-2 mb-4">
                <CarouselPrevious className="static translate-y-0 size-8 cursor-pointer" />
                <CarouselNext className="static translate-y-0 size-8 cursor-pointer" />
              </div>
              <CarouselContent>
                {placeholderTestimonials.map((t, i) => (
                  <CarouselItem key={i}>
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-7 col-span-12 flex sm:flex-row flex-col sm:gap-10 gap-6 lg:pe-12">
                        <div className="shrink-0 flex items-start">
                          <Quote size={32} style={{ color: "rgba(194,150,58,0.4)" }} />
                        </div>
                        <div className="flex flex-col gap-6">
                          <p className="text-lg leading-relaxed italic" style={{ color: "#3D4A3B" }}>
                            {t.quote}
                          </p>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{t.author}</p>
                            <p className="text-xs" style={{ color: "#7A7A6E" }}>{t.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-5 col-span-12">
                        <div
                          className="relative rounded-2xl overflow-hidden mx-auto"
                          style={{
                            minHeight: "clamp(420px, 55vh, 520px)",
                            width: "100%",
                            maxWidth: 420,
                            aspectRatio: "3 / 4",
                          }}
                        >
                          <Image
                            src={t.image}
                            alt={`${t.author}, ${t.role}`}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 420px"
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Filmstrip — stays at the very bottom of the merged section */}
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex w-full items-end justify-center min-w-[600px] md:min-w-full">
            {ctaImages.map((image, i) => (
              <div
                key={i}
                className={`flex-1 min-w-[100px] md:min-w-[160px] lg:min-w-[200px] relative overflow-hidden ${image.height}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover grayscale hover:grayscale-0 duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <GrowthFocusCta />
    </>
  );
}
