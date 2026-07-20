/**
 * Canonical membership carousel slides + public image paths.
 * Keep paths here so homepage (and any reuse) cannot drift.
 *
 * Images live in /public as optimized JPEGs. Raw source dumps go in
 * _source-assets/ (gitignored) — never commit multi‑MB source PNGs.
 */

export type MembershipItem = {
  title: string;
  badge: string;
  body: string;
  /** Absolute public path, e.g. /membership-consultation.jpg */
  img: string;
};

export const MEMBERSHIP_ITEMS: MembershipItem[] = [
  {
    title: "Monthly case consultation",
    badge: "Consultation",
    body: "A structured consultation group led by Sarah Arnold, LPC-S. Bring a real case, get real support from peers who understand the clinical realities of your work.",
    img: "/membership-consultation.jpg",
  },
  {
    title: "Curated resource library",
    badge: "Resources",
    body: "Clinical tools, handouts, and business guides, organized, downloadable, and built for active private practice.",
    img: "/membership-resources.jpg",
  },
  {
    title: "Referral network",
    badge: "Referrals",
    body: "A trusted, vetted circle of clinicians. Get referred, refer with confidence. Build relationships that last longer than a single consult.",
    img: "/membership-referral.jpg",
  },
  {
    title: "Continuing education",
    badge: "CEUs",
    body: "CEU trainings each month on clinical and business topics, all virtual, all archived, and all included in your membership.",
    img: "/membership-ce.jpg",
  },
  {
    title: "Public directory listing",
    badge: "Directory",
    body: "A professionally crafted listing in our public clinician directory, searchable by specialty, format, and availability. Clients find you here.",
    img: "/membership-directory.jpg",
  },
  {
    title: "Practice coaching access",
    badge: "Coaching",
    body: "Discounted one-on-one practice-building sessions with Sarah Arnold, LPC-S on fees, marketing, burnout, and long-term sustainability.",
    img: "/membership-coaching.jpg",
  },
  {
    title: "Professional Will designation",
    badge: "Will Planning",
    body: "Guidance and structure for putting a professional will in place so your practice is cared for responsibly.",
    img: "/membership-will.jpg",
  },
  {
    title: "Private online community",
    badge: "Community",
    body: "A private online community for real-time support, connection, and steady encouragement between meetings.",
    img: "/membership-community.jpg",
  },
];

/** Homepage CTA filmstrip (cta-12). Paths must stay unique vs major content slots. */
export const CTA_FILMSTRIP = [
  { src: "/cta-1.jpg", height: "h-[154px] md:h-[214px]" },
  { src: "/cta-2.jpg", height: "h-[244px] md:h-[324px]" },
  { src: "/cta-4.jpg", height: "h-[176px] md:h-[226px]" },
  { src: "/cta-5.jpg", height: "h-[230px] md:h-[300px]" },
  { src: "/cta-6.jpg", height: "h-[154px] md:h-[214px]" },
  { src: "/cta-3.jpg", height: "h-[188px] md:h-[268px]" },
] as const;
