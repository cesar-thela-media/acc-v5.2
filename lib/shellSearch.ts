/**
 * Global search index for member + admin AppShell search bars.
 * Results navigate to real routes (optional ?q= for page-level filters).
 */

import { EVENTS } from "@/lib/events";

export type ShellSearchScope = "member" | "admin";

export type ShellSearchHit = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: string;
  keywords: string;
};

const MEMBER_PAGES: ShellSearchHit[] = [
  {
    id: "m-overview",
    title: "Overview",
    subtitle: "Member dashboard home",
    href: "/dashboard",
    group: "Pages",
    keywords: "home overview dashboard hub",
  },
  {
    id: "m-resources",
    title: "Resource library",
    subtitle: "Clinical tools, handouts, guides",
    href: "/dashboard/resources",
    group: "Pages",
    keywords: "resources library tools pdf handouts",
  },
  {
    id: "m-files",
    title: "CEU certificates",
    subtitle: "Download attendance certificates",
    href: "/dashboard/files",
    group: "Pages",
    keywords: "files certificates ceu download",
  },
  {
    id: "m-events",
    title: "Events",
    subtitle: "Consultation, workshops, CEUs",
    href: "/dashboard/events",
    group: "Pages",
    keywords: "events calendar rsvp consultation workshop",
  },
  {
    id: "m-profile",
    title: "Profile",
    subtitle: "Account settings & directory listing",
    href: "/dashboard/profile",
    group: "Pages",
    keywords: "profile account settings photo bio",
  },
  {
    id: "m-billing",
    title: "Billing",
    subtitle: "Subscription & invoices",
    href: "/dashboard/billing",
    group: "Pages",
    keywords: "billing subscription stripe invoice membership payment",
  },
];

const ADMIN_PAGES: ShellSearchHit[] = [
  {
    id: "a-overview",
    title: "Overview",
    subtitle: "Admin membership dashboard",
    href: "/admin",
    group: "Pages",
    keywords: "home overview analytics stats",
  },
  {
    id: "a-members",
    title: "Members",
    subtitle: "Member roster",
    href: "/admin/members",
    group: "Pages",
    keywords: "members roster clinicians status",
  },
  {
    id: "a-applications",
    title: "Applications",
    subtitle: "Review membership applications",
    href: "/admin/applications",
    group: "Pages",
    keywords: "applications pending approve reject pipeline",
  },
  {
    id: "a-resources",
    title: "Resources",
    subtitle: "Publish library content",
    href: "/admin/resources",
    group: "Pages",
    keywords: "resources upload library content",
  },
  {
    id: "a-events",
    title: "Calendar",
    subtitle: "Manage events",
    href: "/admin/events",
    group: "Pages",
    keywords: "events calendar schedule consultation ceu",
  },
];

/** Mirrors member dashboard resource library titles for search */
const MEMBER_RESOURCES: { title: string; category: string; description: string }[] = [
  { title: "CBT Session Planning Template", category: "Clinical Tools", description: "planning CBT sessions" },
  { title: "Psychoeducation: Anxiety Handout", category: "Handouts", description: "anxiety cycle handout" },
  { title: "Fee Setting for Private Practice", category: "Business", description: "fees private practice" },
  { title: "Attachment Styles Explainer", category: "Handouts", description: "attachment styles" },
  { title: "EMDR Phase Protocol Checklist", category: "Clinical Tools", description: "EMDR protocol" },
  { title: "Marketing for Therapists: Getting Started", category: "Business", description: "marketing caseload" },
  { title: "Burnout Self-Assessment", category: "Self-Care", description: "burnout assessment" },
  { title: "Gottman Four Horsemen Handout", category: "Handouts", description: "gottman couples" },
  { title: "Mindfulness Practices for Clinicians", category: "Self-Care", description: "mindfulness self-care" },
  { title: "Insurance vs. Private Pay: Pros & Cons", category: "Business", description: "insurance private pay" },
  { title: "Trauma-Informed Care Intro", category: "Clinical Tools", description: "trauma informed" },
  { title: "Intake Form Template", category: "Clinical Tools", description: "intake form" },
];

/** Static admin roster keywords (matches mock members list) */
const ADMIN_MEMBERS = [
  "Dr. Maya Okonkwo LCSW",
  "James Whitfield LPC",
  "Sofia Reyes LMFT",
  "Dr. Claire Hutchinson PhD",
  "Marcus Lee LPC",
  "Priya Nair LCSW",
  "Thomas Garza LMFT",
  "Rachel Bloom LPC",
  "Dr. Ade Kolade PsyD",
  "Christine Walsh LPC-S",
];

const ADMIN_APPLICANTS = [
  "Lauren Park LPC",
  "DeShawn Morris LCSW",
  "Ingrid Larsson LMFT",
  "Tamara Wells LPC",
  "Ryan Calloway LPC",
];

/** Pull live join submissions into admin search when available */
function liveApplicantHits(): ShellSearchHit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("acc-applications");
    if (!raw) return [];
    const list = JSON.parse(raw) as {
      id: number;
      name: string;
      credentials?: string;
      source?: string;
      email?: string;
    }[];
    if (!Array.isArray(list)) return [];
    return list
      .filter((a) => a.source === "join")
      .map((a) => ({
        id: `a-app-live-${a.id}`,
        title: a.credentials ? `${a.name} ${a.credentials}` : a.name,
        subtitle: a.email ? `Application · ${a.email}` : "Application",
        href: `/admin/applications?q=${encodeURIComponent(a.name.split(" ")[0] ?? a.name)}`,
        group: "Applications",
        keywords: `${a.name} ${a.credentials ?? ""} ${a.email ?? ""} application applicant join`,
      }));
  } catch {
    return [];
  }
}

function buildMemberIndex(): ShellSearchHit[] {
  const hits: ShellSearchHit[] = [...MEMBER_PAGES];

  for (const ev of EVENTS) {
    hits.push({
      id: `m-ev-${ev.id}`,
      title: ev.title,
      subtitle: `${ev.category} · ${ev.date}`,
      href: `/dashboard/events?q=${encodeURIComponent(ev.title)}`,
      group: "Events",
      keywords: `${ev.title} ${ev.category} ${ev.description} ${ev.date} ${ev.format} ceu event`,
    });
  }

  for (const r of MEMBER_RESOURCES) {
    hits.push({
      id: `m-res-${r.title}`,
      title: r.title,
      subtitle: r.category,
      href: `/dashboard/resources?q=${encodeURIComponent(r.title)}`,
      group: "Resources",
      keywords: `${r.title} ${r.category} ${r.description} resource library download`,
    });
  }

  for (const ev of EVENTS.filter((e) => e.ceus)) {
    hits.push({
      id: `m-file-${ev.id}`,
      title: `${ev.title} certificate`,
      subtitle: `${ev.ceus} CEU`,
      href: "/dashboard/files",
      group: "Files",
      keywords: `certificate ceu ${ev.title} download files`,
    });
  }

  return hits;
}

function buildAdminIndex(): ShellSearchHit[] {
  const hits: ShellSearchHit[] = [...ADMIN_PAGES];

  ADMIN_MEMBERS.forEach((name, i) => {
    hits.push({
      id: `a-mem-${i}`,
      title: name,
      subtitle: "Member roster",
      href: `/admin/members?q=${encodeURIComponent(name.split(" ")[0] ?? name)}`,
      group: "Members",
      keywords: `${name} member roster clinician`,
    });
  });

  ADMIN_APPLICANTS.forEach((name, i) => {
    hits.push({
      id: `a-app-${i}`,
      title: name,
      subtitle: "Application",
      href: `/admin/applications?q=${encodeURIComponent(name.split(" ")[0] ?? name)}`,
      group: "Applications",
      keywords: `${name} application applicant pending approve`,
    });
  });

  hits.push(...liveApplicantHits());

  for (const ev of EVENTS) {
    hits.push({
      id: `a-ev-${ev.id}`,
      title: ev.title,
      subtitle: `Event · ${ev.category}`,
      href: `/admin/events?q=${encodeURIComponent(ev.title)}`,
      group: "Events",
      keywords: `${ev.title} ${ev.category} calendar event schedule`,
    });
  }

  for (const r of MEMBER_RESOURCES) {
    hits.push({
      id: `a-res-${r.title}`,
      title: r.title,
      subtitle: "Admin resources",
      href: `/admin/resources?q=${encodeURIComponent(r.title)}`,
      group: "Resources",
      keywords: `${r.title} ${r.category} resource publish`,
    });
  }

  return hits;
}

const INDEX: Record<ShellSearchScope, ShellSearchHit[]> = {
  member: buildMemberIndex(),
  admin: buildAdminIndex(),
};

function scoreHit(hit: ShellSearchHit, tokens: string[]): number {
  const hay = `${hit.title} ${hit.subtitle ?? ""} ${hit.keywords}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (hit.title.toLowerCase().includes(t)) score += 10;
    else if ((hit.subtitle ?? "").toLowerCase().includes(t)) score += 5;
    else if (hay.includes(t)) score += 2;
    else return 0; // require all tokens somewhere
  }
  return score;
}

export function searchShell(query: string, scope: ShellSearchScope, limit = 12): ShellSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = INDEX[scope]
    .map((hit) => ({ hit, score: scoreHit(hit, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title));
  return scored.slice(0, limit).map((x) => x.hit);
}
