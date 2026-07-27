import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { searchShell } from "./shellSearch";

describe("searchShell", () => {
  it("finds member resources by title token", () => {
    const hits = searchShell("CBT", "member");
    assert.ok(hits.some((h) => h.title.includes("CBT")));
    assert.ok(hits.every((h) => h.href.length > 0));
  });

  it("finds member pages and events", () => {
    const pages = searchShell("billing", "member");
    assert.ok(pages.some((h) => h.href === "/dashboard/billing"));
    const events = searchShell("consultation", "member");
    assert.ok(events.some((h) => h.group === "Events" || h.title.toLowerCase().includes("consultation")));
  });

  it("finds admin members and applications", () => {
    const members = searchShell("Maya", "admin");
    assert.ok(members.some((h) => h.group === "Members"));
    const apps = searchShell("Lauren", "admin");
    assert.ok(apps.some((h) => h.group === "Applications"));
  });

  it("returns empty for empty query", () => {
    assert.deepEqual(searchShell("   ", "member"), []);
  });
});
