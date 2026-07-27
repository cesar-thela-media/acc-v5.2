import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, MapPin, Building2, ArrowUpRight } from "lucide-react";
import { GrowthFocusCta } from "@/components/cta/GrowthFocusCta";

/* HIDDEN SECTIONS (toggle to restore):
   - homepage testimonials carousel + filmstrip   (HIDE_TESTIMONIALS)
   - /who-we-are What-We-Believe cards                (HIDE_VALUES)
*/
const HIDE_VALUES = true;

const PAGE_SAGE = "#4A5E48";
const PAGE_SAGE_SOFT = "#5A6E58";
const PAGE_CREAM = "#E8EDE4";
const AMBER = "#C2963A";
const SAGE_800 = "#2D3B2C";

export const metadata: Metadata = {
  title: "Who We Are | Austin Clinician Circle",
  description: "Learn the story behind Austin Clinician Circle. Founded by Sarah Arnold, LPC-S, Austin Clinician Circle is a professional home and community for licensed therapists in Austin, TX.",
};

export default function WhoWeArePage() {
  return (
    <>
      <section style={{ background: PAGE_SAGE, padding: "clamp(4rem,8vw,6rem) 0" }}>
        <div className="container-fluid">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] mb-5" style={{ color: AMBER }}>
              Who we are
            </p>
            <h1
              className="leading-tight"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                color: "#fff",
              }}
            >
              A professional home and community for therapists.
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 col-span-12 flex flex-col gap-8">
              <div>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.28em] mb-4"
                  style={{ color: "rgba(194,150,58,0.85)" }}
                >
                  The founder
                </p>
                <h2
                  className="mb-6 leading-tight"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                    color: "#fff",
                  }}
                >
                  Sarah Arnold, LPC-S
                </h2>
                <div className="flex flex-col gap-5 text-lg leading-[1.6]" style={{ color: "rgba(255,255,255,0.78)" }}>
                  <p>
                    Sarah is a Licensed Professional Counselor and Supervisor based
                    in Austin, Texas, and the founder of Restored Family
                    Counseling. She has spent her career working with individuals
                    and couples doing the deeper work, exploring the parts of
                    themselves that have been running the show, releasing what no
                    longer serves them, and stepping into a life that feels in
                    alignment with who they truly desire to be.
                  </p>
                  <p>
                    As she built her group practice and supervised pre-licensed
                    associates, she noticed a pattern: once therapists became fully
                    licensed and launched their own practices, they lost the
                    built-in community they had during training. Supervision groups
                    ended. Colleagues scattered. What had once felt like a team
                    became, almost overnight, a practice of one.
                  </p>
                  <p>
                    Austin Clinician Circle is Sarah&apos;s answer to that problem. It is not
                    a supervision group, a continuing education provider, or a
                    therapist directory, though it includes elements of all
                    three. It is a membership network: a professional community for
                    therapists who want to keep growing, stay connected, and do
                    excellent work over the long term.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="rounded-xl p-3 shrink-0" style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
                    <Award className="size-5" style={{ color: "#fff" }} />
                  </div>
                  <p className="pt-2 text-base" style={{ color: "rgba(255,255,255,0.78)" }}>
                    Licensed Professional Counselor and Supervisor
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="rounded-xl p-3 shrink-0" style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
                    <MapPin className="size-5" style={{ color: "#fff" }} />
                  </div>
                  <p className="pt-2 text-base" style={{ color: "rgba(255,255,255,0.78)" }}>
                    Austin, Texas
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="rounded-xl p-3 shrink-0" style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
                    <Building2 className="size-5" style={{ color: "#fff" }} />
                  </div>
                  <p className="pt-2 text-base" style={{ color: "rgba(255,255,255,0.78)" }}>
                    Founder, Restored Family Counseling
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 lg:block hidden" />

            <div className="lg:col-span-5 md:col-span-6 col-span-12 relative">
              <div
                className="relative w-full rounded-2xl overflow-hidden mx-auto"
                style={{ aspectRatio: "9 / 16", maxWidth: 420 }}
              >
                <Image
                  src="/sarah-arnold.jpeg"
                  alt="Sarah Arnold, LPC-S"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center top" }}
                />
              </div>
              <a
                href="https://www.restoredfamily.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl shadow-lg px-5 py-4 flex items-center gap-2 max-w-3xs hover:opacity-90 transition-opacity"
                style={{ background: "#fff" }}
              >
                <span className="text-sm font-medium" style={{ color: SAGE_800 }}>
                  Visit Restored Family Counseling
                </span>
                <ArrowUpRight size={16} style={{ color: SAGE_800, flexShrink: 0 }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: PAGE_CREAM, padding: "clamp(4.5rem,9vw,7rem) 1.5rem" }}>
        <div className="container-fluid max-w-4xl mx-auto">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.28em] mb-5 text-center"
            style={{ color: AMBER }}
          >
            The origin
          </p>
          <h2
            className="mb-8 leading-tight text-center"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: SAGE_800,
            }}
          >
            Why Austin Clinician Circle exists.
          </h2>
          <div
            className="flex flex-col gap-6 text-lg leading-[1.65] text-center px-2 sm:px-4"
            style={{ color: "var(--color-text-secondary)", maxWidth: "48rem", margin: "0 auto" }}
          >
            <p>
              Most of us didn&apos;t fully anticipate how solo private practice would
              feel. You&apos;re doing meaningful work, but there may not be a team
              down the hall, no built-in debrief, and some days that absence is
              more noticeable than others.
            </p>
            <p>
              Austin Clinician Circle was designed to address that gap: a small network of
              clinicians who meet regularly, share resources, make referrals to
              each other, and show up for one another professionally and in real
              community.
            </p>
            <p>
              Founding members are therapists who have been part of Sarah&apos;s
              professional circle, former associates, trusted colleagues, and
              clinicians she has supervised. As Austin Clinician Circle grows, membership is
              open to any licensed therapist who shares this commitment to
              ongoing clinical growth and community.
            </p>
          </div>
        </div>
      </section>

      <GrowthFocusCta
        heading={
          <>
            This is the community
            <br />
            you&apos;ve been looking for.
          </>
        }
        subheading="Deepen your work. Find your community."
        showFilmstrip={false}
      />
    </>
  );
}
