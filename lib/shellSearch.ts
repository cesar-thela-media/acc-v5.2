/**
 * Global search index for member + admin AppShell search bars.
 * Rebuilds from demo localStorage keys on each query so new events/resources/members appear.
 */

import { SEED_DEMO_EVENTS, DEMO_EVENTS_KEY, type DemoEvent } from "@/lib/demo-events";
import {
  SEED_DEMO_RESOURCES,
  DEMO_RESOURCES_KEY,
  type DemoResource,
} from "@/lib/demo-resources";
import {
  SEED_DEMO_MEMBERS,
  DEMO_MEMBERS_KEY,
  type DemoMember,
} from "@/lib/demo-members";
import {
  SEED_APPLICATIONS,
  APPLICATIONS_STORAGE_KEY,
  type Application,
} from "@/lib/applications";

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

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as T;
    if (Array.isArray(parsed) && parsed.length === 0) return fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function liveEvents(): DemoEvent[] {
  return readStorage(DEMO_EVENTS_KEY, SEED_DEMO_EVENTS);
}

function liveResources(): DemoResource[] {
  return readStorage(DEMO_RESOURCES_KEY, SEED_DEMO_RESOURCES);
}

function liveMembers(): DemoMember[] {
  return readStorage(DEMO_MEMBERS_KEY, SEED_DEMO_MEMBERS);
}

function liveApplications(): Application[] {
  return readStorage(APPLICATIONS_STORAGE_KEY, SEED_APPLICATIONS);
}

function buildMemberIndex(): ShellSearchHit[] {
  const hits: ShellSearchHit[] = [...MEMBER_PAGES];
  const events = liveEvents();
  const resources = liveResources();

  for (const ev of events) {
    hits.push({
      id: `m-ev-${ev.id}`,
      title: ev.title,
      subtitle: `${ev.category} · ${ev.date}`,
      href: `/dashboard/events?q=${encodeURIComponent(ev.title)}`,
      group: "Events",
      keywords: `${ev.title} ${ev.category} ${ev.description} ${ev.date} ${ev.format} ceu event`,
    });
  }

  for (const r of resources) {
    hits.push({
      id: `m-res-${r.id}`,
      title: r.title,
      subtitle: r.category,
      href: `/dashboard/resources?q=${encodeURIComponent(r.title)}`,
      group: "Resources",
      keywords: `${r.title} ${r.category} ${r.description} resource library download`,
    });
  }

  for (const ev of events.filter((e) => e.ceus)) {
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
  const members = liveMembers();
  const apps = liveApplications();
  const events = liveEvents();
  const resources = liveResources();

  for (const m of members) {
    hits.push({
      id: `a-mem-${m.id}`,
      title: `${m.name} ${m.credentials}`,
      subtitle: `Member · ${m.email}`,
      href: `/admin/members?q=${encodeURIComponent(m.name.split(" ")[0] ?? m.name)}`,
      group: "Members",
      keywords: `${m.name} ${m.credentials} ${m.email} member roster clinician ${m.status}`,
    });
  }

  for (const a of apps) {
    hits.push({
      id: `a-app-${a.id}`,
      title: a.credentials ? `${a.name}, ${a.credentials}` : a.name,
      subtitle: `Application · ${a.status}${a.source === "join" ? " · new" : ""}`,
      href: `/admin/applications?q=${encodeURIComponent(a.name.split(" ")[0] ?? a.name)}`,
      group: "Applications",
      keywords: `${a.name} ${a.credentials} ${a.email} application applicant ${a.status} ${a.source ?? ""}`,
    });
  }

  for (const ev of events) {
    hits.push({
      id: `a-ev-${ev.id}`,
      title: ev.title,
      subtitle: `Event · ${ev.category}`,
      href: `/admin/events`,
      group: "Events",
      keywords: `${ev.title} ${ev.category} calendar event schedule ${ev.date}`,
    });
  }

  for (const r of resources) {
    hits.push({
      id: `a-res-${r.id}`,
      title: r.title,
      subtitle: "Admin resources",
      href: `/admin/resources?q=${encodeURIComponent(r.title)}`,
      group: "Resources",
      keywords: `${r.title} ${r.category} ${r.description} resource publish`,
    });
  }

  return hits;
}

function scoreHit(hit: ShellSearchHit, tokens: string[]): number {
  const hay = `${hit.title} ${hit.subtitle ?? ""} ${hit.keywords}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (hit.title.toLowerCase().includes(t)) score += 10;
    else if ((hit.subtitle ?? "").toLowerCase().includes(t)) score += 5;
    else if (hay.includes(t)) score += 2;
    else return 0;
  }
  return score;
}

export function searchShell(query: string, scope: ShellSearchScope, limit = 12): ShellSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  // Rebuild every search so localStorage mutations are visible immediately
  const index = scope === "admin" ? buildAdminIndex() : buildMemberIndex();
  const scored = index
    .map((hit) => ({ hit, score: scoreHit(hit, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title));
  return scored.slice(0, limit).map((x) => x.hit);
}
