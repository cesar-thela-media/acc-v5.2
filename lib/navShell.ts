/**
 * Pure helpers for app-shell navigation grouping (member + admin).
 * Kept free of React so unit tests can drive the real shipped implementation.
 */

export type ShellNavLink = {
  href: string;
  label: string;
  group: "feature" | "settings";
};

export const MEMBER_FEATURE_HREFS = [
  "/dashboard",
  "/dashboard/resources",
  "/dashboard/files",
  "/dashboard/events",
] as const;

export const MEMBER_SETTINGS_HREFS = [
  "/dashboard/profile",
  "/dashboard/billing",
] as const;

export const ADMIN_FEATURE_HREFS = [
  "/admin",
  "/admin/members",
  "/admin/applications",
  "/admin/resources",
  "/admin/events",
] as const;

export const ADMIN_SETTINGS_HREFS = [] as const;

/**
 * Free-tier surfaces used to live under /dashboard/free (account-based preview).
 * No longer in use after free-tier removal — kept as a defensive no-op so callers
 * that still import it compile and behave as if no path qualifies.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isFreeTierPath(pathname: string | null | undefined): boolean {
  return false;
}

export function isExactOrChildPath(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard" || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Split a flat nav list into platform features vs account/settings. */
export function partitionShellLinks<T extends { href: string }>(
  links: T[],
  settingsHrefs: readonly string[],
): { features: T[]; settings: T[] } {
  const settingsSet = new Set(settingsHrefs);
  const features: T[] = [];
  const settings: T[] = [];
  for (const link of links) {
    if (settingsSet.has(link.href)) settings.push(link);
    else features.push(link);
  }
  return { features, settings };
}

/** Active item styles without heavy glow/shadow “AI slop”.
 *  `light` = Shadcn Space template (white sidebar, near-black active pill).
 *  `dark`  = sage chrome (white text on dark green).
 *  `admin` = bright gold admin shell (#ffb900) with dark text.
 */
export function shellActiveStyle(
  active: boolean,
  mode: "dark" | "light" | "admin" = "dark",
): {
  background: string;
  color: string;
  borderLeft: string;
  boxShadow: string;
} {
  if (mode === "light") {
    return {
      background: active ? "#1A1A1A" : "transparent",
      color: active ? "#FFFFFF" : "rgba(26,26,26,0.62)",
      borderLeft: "2px solid transparent",
      boxShadow: "none",
    };
  }
  if (mode === "admin") {
    // Muted amber shell — light text like dark mode, soft white active pill
    return {
      background: active ? "rgba(255,255,255,0.16)" : "transparent",
      color: active ? "#FFFFFF" : "rgba(255,255,255,0.78)",
      borderLeft: active ? "2px solid #F0EDE6" : "2px solid transparent",
      boxShadow: "none",
    };
  }
  return {
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    color: active ? "#FFFFFF" : "rgba(255,255,255,0.72)",
    borderLeft: active ? "2px solid #C2963A" : "2px solid transparent",
    boxShadow: "none",
  };
}

/**
 * Returns duplicate image paths when the same src appears more than once
 * in a list of major content slots (home + who-we-are marketing photos).
 */
export function findDuplicateImagePaths(paths: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const p of paths) {
    if (!p) continue;
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n > 1).map(([p]) => p);
}
