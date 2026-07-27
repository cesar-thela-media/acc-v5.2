/**
 * Unit tests for shipped navShell helpers — drives the real module, not a reimplementation.
 * Run: npx tsx --test lib/navShell.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findDuplicateImagePaths,
  isExactOrChildPath,
  isFreeTierPath,
  partitionShellLinks,
  shellActiveStyle,
} from "./navShell";

describe("isFreeTierPath", () => {
  it("is a defensive no-op after free-tier removal", () => {
    assert.equal(isFreeTierPath("/dashboard/free"), false);
    assert.equal(isFreeTierPath("/dashboard/free/extra"), false);
    assert.equal(isFreeTierPath("/dashboard"), false);
    assert.equal(isFreeTierPath(null), false);
  });
});

describe("partitionShellLinks", () => {
  it("separates platform features from settings hrefs", () => {
    const links = [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/resources", label: "Resources" },
      { href: "/dashboard/profile", label: "Profile" },
      { href: "/dashboard/billing", label: "Billing" },
    ];
    const { features, settings } = partitionShellLinks(links, [
      "/dashboard/profile",
      "/dashboard/billing",
    ]);
    assert.deepEqual(
      features.map((l) => l.href),
      ["/dashboard", "/dashboard/resources"],
    );
    assert.deepEqual(
      settings.map((l) => l.href),
      ["/dashboard/profile", "/dashboard/billing"],
    );
  });
});

describe("isExactOrChildPath", () => {
  it("matches overview roots exactly only", () => {
    assert.equal(isExactOrChildPath("/dashboard", "/dashboard"), true);
    assert.equal(isExactOrChildPath("/dashboard/resources", "/dashboard"), false);
    assert.equal(isExactOrChildPath("/dashboard/resources", "/dashboard/resources"), true);
  });
});

describe("shellActiveStyle", () => {
  it("never applies heavy box-shadow glow", () => {
    const active = shellActiveStyle(true);
    const idle = shellActiveStyle(false);
    assert.equal(active.boxShadow, "none");
    assert.equal(idle.boxShadow, "none");
    assert.equal(active.background.includes("gradient"), false);
  });

  it("light mode uses near-black active pill like Shadcn Space", () => {
    const active = shellActiveStyle(true, "light");
    const idle = shellActiveStyle(false, "light");
    assert.equal(active.background, "#1A1A1A");
    assert.equal(active.color, "#FFFFFF");
    assert.equal(idle.boxShadow, "none");
  });

  it("admin mode uses light text on muted amber chrome", () => {
    const active = shellActiveStyle(true, "admin");
    const idle = shellActiveStyle(false, "admin");
    assert.equal(active.color, "#FFFFFF");
    assert.equal(idle.color, "rgba(255,255,255,0.78)");
    assert.equal(active.boxShadow, "none");
  });
});

describe("findDuplicateImagePaths", () => {
  it("flags repeated major-slot image paths", () => {
    const dups = findDuplicateImagePaths([
      "/about-us.jpg",
      "/believe-clinical.jpg",
      "/about-us.jpg",
      "/cta-3.jpg",
    ]);
    assert.deepEqual(dups, ["/about-us.jpg"]);
  });

  it("returns empty when all major slots are unique", () => {
    assert.deepEqual(
      findDuplicateImagePaths([
        "/about-us.jpg",
        "/believe-clinical.jpg",
        "/believe-sustainable.jpg",
        "/believe-professional.jpg",
        "/cta-3.jpg",
        "/sarah-arnold.jpeg",
      ]),
      [],
    );
  });
});
