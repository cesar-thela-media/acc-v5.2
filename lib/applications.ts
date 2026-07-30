/**
 * Shared membership applications for the join funnel → admin pipeline demo.
 *
 * /join appends to localStorage; /admin/applications (and overview) read the
 * same key via usePersistedState so real submissions show up alongside seed data.
 */

import { daysAgo, formatAbbrevDate } from "@/lib/relativeDates";

export type AppStatus = "pending" | "approved" | "rejected";

export type Application = {
  id: number;
  name: string;
  credentials: string;
  email: string;
  city: string;
  submitted: string;
  status: AppStatus;
  bio: string;
  specialties: string[];
  format: string;
  licenseNumber: string;
  /** seed demo rows vs live /join submissions */
  source?: "seed" | "join";
  phone?: string;
  practiceName?: string;
  whyCircle?: string;
};

/** localStorage key shared by join form + admin applications UI */
export const APPLICATIONS_STORAGE_KEY = "acc-applications";

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 1,
    name: "Lauren Park",
    credentials: "LPC",
    email: "lauren@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(1)),
    status: "pending",
    bio: "I'm a licensed counselor with 4 years of experience specializing in anxiety, perfectionism, and identity work with young adults. I'm looking for a collegial community to support my private practice growth.",
    specialties: ["Anxiety", "Young Adults", "Identity"],
    format: "Telehealth",
    licenseNumber: "LPC-91032",
    source: "seed",
  },
  {
    id: 2,
    name: "DeShawn Morris",
    credentials: "LCSW",
    email: "deshawn@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(2)),
    status: "pending",
    bio: "Clinical social worker with 7 years experience, primarily working with men, cultural identity, and workplace stress. Private practice for 2 years.",
    specialties: ["Men", "Cultural Identity", "Workplace"],
    format: "Both",
    licenseNumber: "LCSW-44820",
    source: "seed",
  },
  {
    id: 3,
    name: "Ingrid Larsson",
    credentials: "LMFT",
    email: "ingrid@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(4)),
    status: "pending",
    bio: "Marriage and family therapist with a focus on couples and attachment. I've been in private practice for 6 years and am passionate about peer consultation.",
    specialties: ["Couples", "Attachment", "Family"],
    format: "In-person",
    licenseNumber: "LMFT-77391",
    source: "seed",
  },
  {
    id: 4,
    name: "Tamara Wells",
    credentials: "LPC",
    email: "tamara@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(11)),
    status: "approved",
    bio: "LPC specializing in perinatal mental health and postpartum support.",
    specialties: ["Perinatal", "Postpartum", "Women"],
    format: "Telehealth",
    licenseNumber: "LPC-60812",
    source: "seed",
  },
  {
    id: 5,
    name: "Ryan Calloway",
    credentials: "LPC",
    email: "ryan@example.com",
    city: "Houston, TX",
    submitted: formatAbbrevDate(daysAgo(13)),
    status: "rejected",
    bio: "Counselor based in Houston, applied but does not meet Austin-area requirement.",
    specialties: ["Depression", "CBT"],
    format: "Telehealth",
    licenseNumber: "LPC-55144",
    source: "seed",
  },
];

/** @deprecated use SEED_APPLICATIONS — kept for existing imports */
export const APPLICATIONS = SEED_APPLICATIONS;

export type JoinApplicationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseType: string;
  licenseNumber?: string;
  yearsLicensed?: string;
  practiceName?: string;
  practiceCity?: string;
  format?: string;
  specialties?: string[];
  modalities?: string[];
  bio?: string;
  whyCircle?: string;
};

export function buildApplicationFromJoin(form: JoinApplicationPayload): Application {
  const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
  const specialties =
    form.specialties && form.specialties.length > 0
      ? form.specialties
      : form.modalities && form.modalities.length > 0
        ? form.modalities
        : ["General"];

  const bioParts = [form.bio?.trim(), form.whyCircle?.trim()].filter(Boolean);
  const bio =
    bioParts.join("\n\n") ||
    `Applied via membership form${form.yearsLicensed ? ` · ${form.yearsLicensed} years licensed` : ""}.`;

  return {
    id: Date.now(),
    name: name || "Applicant",
    credentials: form.licenseType || "—",
    email: form.email.trim().toLowerCase(),
    city: form.practiceCity?.trim() || "—",
    submitted: formatAbbrevDate(new Date()),
    status: "pending",
    bio,
    specialties,
    format: form.format?.trim() || "—",
    licenseNumber: form.licenseNumber?.trim() || "—",
    source: "join",
    phone: form.phone?.trim(),
    practiceName: form.practiceName?.trim(),
    whyCircle: form.whyCircle?.trim(),
  };
}

/**
 * Persist a join submission so /admin/applications can show it.
 * Merges with any existing list (or seed if first write). Dedupes by email:
 * re-submitting updates the pending card instead of stacking duplicates.
 */
export function appendSubmittedApplication(app: Application): Application[] {
  if (typeof window === "undefined") return SEED_APPLICATIONS;

  let list: Application[] = SEED_APPLICATIONS;
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (raw != null) {
      const parsed = JSON.parse(raw) as Application[];
      if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
    }
  } catch {
    // corrupted — fall back to seed
    list = [...SEED_APPLICATIONS];
  }

  const email = app.email.toLowerCase();
  const existingIdx = list.findIndex((a) => a.email.toLowerCase() === email);

  let next: Application[];
  if (existingIdx >= 0) {
    const prev = list[existingIdx];
    const merged: Application = {
      ...app,
      id: prev.id,
      // keep status from payload (e.g. approved on direct join)
      status: app.status ?? "pending",
    };
    next = list.map((a, i) => (i === existingIdx ? merged : a));
  } else {
    // newest submissions first
    next = [app, ...list];
  }

  try {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / private mode
  }

  return next;
}
