import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MEMBERSHIP_BENEFITS } from "./membershipBenefits";

const ROOT = join(import.meta.dirname, "..");

/** Exact 10-item list from Sarah’s reference image (CEU → Continuing Education Credits). */
const EXPECTED_TEN = [
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

describe("MEMBERSHIP_BENEFITS (shipped checklist)", () => {
  it("is the 10-item Sarah reference list in order", () => {
    assert.equal(MEMBERSHIP_BENEFITS.length, 10);
    assert.deepEqual([...MEMBERSHIP_BENEFITS], [...EXPECTED_TEN]);
  });

  it("puts Continuing Education Credits second; no legacy CEU/discount labels", () => {
    assert.equal(MEMBERSHIP_BENEFITS[0], "Monthly case consultation group");
    assert.equal(MEMBERSHIP_BENEFITS[1], "Continuing Education Credits");
    const joined = MEMBERSHIP_BENEFITS.join(" | ").toLowerCase();
    assert.equal(joined.includes("ceu trainings"), false);
    assert.equal(joined.includes("continuing education discounts"), false);
  });

  it("is imported by home and What We Offer pricing pages", () => {
    const home = readFileSync(join(ROOT, "app/(public)/page.tsx"), "utf8");
    const offer = readFileSync(join(ROOT, "app/(public)/what-we-offer/page.tsx"), "utf8");
    assert.match(home, /MEMBERSHIP_BENEFITS/);
    assert.match(offer, /MEMBERSHIP_BENEFITS/);
    assert.match(home, /Membership Benefits/);
    assert.equal(home.includes("Simple, all-inclusive pricing"), false);
    assert.equal(home.includes("all-inclusive pricing"), false);
  });
});

describe("Public playbook unlisted", () => {
  it("removes Free playbook from PublicNav and sitemap; leadmagnet redirects", () => {
    const nav = readFileSync(join(ROOT, "components/layout/PublicNav.tsx"), "utf8");
    const sitemap = readFileSync(join(ROOT, "app/sitemap.ts"), "utf8");
    const lead = readFileSync(join(ROOT, "app/(public)/leadmagnet/page.tsx"), "utf8");
    assert.equal(nav.includes("Free playbook"), false);
    assert.equal(nav.includes("/leadmagnet"), false);
    assert.equal(sitemap.includes("/leadmagnet"), false);
    assert.match(lead, /HIDE_LEADMAGNET/);
    assert.match(lead, /handleSubmit/);
    assert.match(lead, /redirect\(/);
  });
});

describe("Consultation window 9–11am", () => {
  it("states 9–11am and drops 10:30 from What We Offer + FAQ", () => {
    const offer = readFileSync(join(ROOT, "app/(public)/what-we-offer/page.tsx"), "utf8");
    assert.match(offer, /9:00 to 11:00am/);
    const consultationBlocks = offer.match(/first Thursday[\s\S]{0,220}/g) ?? [];
    assert.ok(consultationBlocks.length >= 2);
    for (const block of consultationBlocks) {
      assert.equal(block.includes("10:30"), false, block);
      assert.match(block, /11:00am|9:00 to 11/);
    }
  });

  it("uses 9:00 – 11:00am on demo/member consultation events", () => {
    const demo = readFileSync(join(ROOT, "lib/demo-events.ts"), "utf8");
    const events = readFileSync(join(ROOT, "lib/events.ts"), "utf8");
    assert.equal(demo.includes("10:30"), false);
    assert.equal(events.includes("10:30"), false);
    assert.match(demo, /9:00 – 11:00am/);
    assert.match(events, /9:00 – 11:00am/);
  });
});

describe("MembershipCarousel controls", () => {
  it("ships prev/next buttons wired to slide stepping", () => {
    const src = readFileSync(join(ROOT, "components/landing/MembershipCarousel.tsx"), "utf8");
    assert.match(src, /Previous membership benefit/);
    assert.match(src, /Next membership benefit/);
    assert.match(src, /stepSlide/);
    assert.match(src, /scrollProgress\.get\(\)/);
    assert.match(src, /goToSlideIndex/);
    assert.match(src, /ChevronLeft/);
    assert.match(src, /ChevronRight/);
  });
});
