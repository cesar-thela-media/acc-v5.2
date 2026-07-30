/**
 * Canonical membership pricing checklist (public home + What We Offer).
 * Source: Sarah’s initial “10 benefits included” listing; CEU line updated
 * per her note to “Continuing Education Credits” (2nd, under consultation).
 */
export const MEMBERSHIP_BENEFITS = [
  "Monthly case consultation group",
  "Continuing Education Credits",
  "Curated resource library",
  "Public clinician directory listing",
  "Vetted referral network access",
  "Practice marketing and business guidance",
  "Mindfulness and burnout prevention resources",
  "Discounted coaching with Sarah Arnold, LPC-S",
  "Professional Will designation",
  "Private online community for real-time support",
] as const;

export type MembershipBenefit = (typeof MEMBERSHIP_BENEFITS)[number];
