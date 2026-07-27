/**
 * Shared demo member roster. Approve on applications appends here.
 * Client-only localStorage — presentation walkthrough, no backend.
 */

import { formatAbbrevDate } from "@/lib/relativeDates";
import type { Application } from "@/lib/applications";

export const DEMO_MEMBERS_KEY = "acc-demo-members";

export type DemoMemberStatus = "active" | "inactive" | "suspended";

export type DemoMember = {
  id: number;
  name: string;
  credentials: string;
  email: string;
  joined: string;
  joinedSort: string;
  status: DemoMemberStatus;
  accepting: boolean;
};

export const SEED_DEMO_MEMBERS: DemoMember[] = [
  { id: 1, name: "Dr. Maya Okonkwo", credentials: "LCSW", email: "maya@example.com", joined: "Jan 12, 2026", joinedSort: "2026-01-12", status: "active", accepting: true },
  { id: 2, name: "James Whitfield", credentials: "LPC", email: "james@example.com", joined: "Jan 28, 2026", joinedSort: "2026-01-28", status: "active", accepting: false },
  { id: 3, name: "Sofia Reyes", credentials: "LMFT", email: "sofia@example.com", joined: "Feb 5, 2026", joinedSort: "2026-02-05", status: "active", accepting: true },
  { id: 4, name: "Dr. Claire Hutchinson", credentials: "PhD", email: "claire@example.com", joined: "Feb 14, 2026", joinedSort: "2026-02-14", status: "active", accepting: true },
  { id: 5, name: "Marcus Lee", credentials: "LPC", email: "marcus@example.com", joined: "Apr 15, 2026", joinedSort: "2026-04-15", status: "active", accepting: true },
  { id: 6, name: "Priya Nair", credentials: "LCSW", email: "priya@example.com", joined: "Apr 10, 2026", joinedSort: "2026-04-10", status: "active", accepting: false },
  { id: 7, name: "Thomas Garza", credentials: "LMFT", email: "thomas@example.com", joined: "Apr 3, 2026", joinedSort: "2026-04-03", status: "active", accepting: true },
  { id: 8, name: "Rachel Bloom", credentials: "LPC", email: "rachel@example.com", joined: "Mar 20, 2026", joinedSort: "2026-03-20", status: "active", accepting: true },
  { id: 9, name: "Dr. Ade Kolade", credentials: "PsyD", email: "ade@example.com", joined: "Mar 8, 2026", joinedSort: "2026-03-08", status: "inactive", accepting: false },
  { id: 10, name: "Christine Walsh", credentials: "LPC-S", email: "christine@example.com", joined: "Feb 22, 2026", joinedSort: "2026-02-22", status: "suspended", accepting: false },
];

function todaySortKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Remove a member by email (e.g. after reject in the demo walkthrough). */
export function removeMemberByEmail(email: string): DemoMember[] {
  if (typeof window === "undefined") return SEED_DEMO_MEMBERS;

  let list: DemoMember[] = SEED_DEMO_MEMBERS;
  try {
    const raw = window.localStorage.getItem(DEMO_MEMBERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoMember[];
      if (Array.isArray(parsed) && parsed.length) list = parsed;
    }
  } catch {
    list = [...SEED_DEMO_MEMBERS];
  }

  const next = list.filter((m) => m.email.toLowerCase() !== email.toLowerCase());
  // Never wipe the whole seed if email matches nothing meaningful
  try {
    window.localStorage.setItem(DEMO_MEMBERS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

/** Upsert an approved applicant onto the demo roster (localStorage). */
export function upsertMemberFromApplication(app: Application): DemoMember[] {
  if (typeof window === "undefined") return SEED_DEMO_MEMBERS;

  let list: DemoMember[] = SEED_DEMO_MEMBERS;
  try {
    const raw = window.localStorage.getItem(DEMO_MEMBERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoMember[];
      if (Array.isArray(parsed) && parsed.length) list = parsed;
    }
  } catch {
    list = [...SEED_DEMO_MEMBERS];
  }

  const email = app.email.toLowerCase();
  const existing = list.find((m) => m.email.toLowerCase() === email);
  const joinedSort = todaySortKey();
  const joined = formatAbbrevDate(new Date());

  let next: DemoMember[];
  if (existing) {
    next = list.map((m) =>
      m.email.toLowerCase() === email
        ? {
            ...m,
            name: app.name,
            credentials: app.credentials,
            status: "active" as const,
            accepting: true,
          }
        : m,
    );
  } else {
    const member: DemoMember = {
      id: Date.now(),
      name: app.name,
      credentials: app.credentials,
      email: app.email,
      joined,
      joinedSort,
      status: "active",
      accepting: true,
    };
    next = [member, ...list];
  }

  try {
    window.localStorage.setItem(DEMO_MEMBERS_KEY, JSON.stringify(next));
  } catch {
    // ignore quota
  }
  return next;
}
