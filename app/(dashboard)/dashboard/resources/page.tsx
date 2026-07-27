"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/shadcn/empty";
import { FileText, Search, X, Download } from "lucide-react";
import { downloadResourcePacket } from "@/lib/demoDownload";

const AMBER = "var(--color-accent-highlight)";

type Resource = {
  title: string;
  category: string;
  type: string;
  date: string;
  description: string;
};

const RESOURCES: Resource[] = [
  { title: "CBT Session Planning Template", category: "Clinical Tools", type: "PDF", date: "Apr 18, 2026", description: "A structured template for planning CBT sessions across presenting concerns." },
  { title: "Psychoeducation: Anxiety Handout", category: "Handouts", type: "PDF", date: "Apr 15, 2026", description: "Client-facing psychoeducation on the anxiety cycle, suitable for most adult clients." },
  { title: "Fee Setting for Private Practice", category: "Business", type: "Guide", date: "Apr 10, 2026", description: "A practical guide to setting, communicating, and adjusting fees in private practice." },
  { title: "Attachment Styles Explainer", category: "Handouts", type: "PDF", date: "Apr 8, 2026", description: "One-page overview of attachment styles for client psychoeducation." },
  { title: "EMDR Phase Protocol Checklist", category: "Clinical Tools", type: "PDF", date: "Apr 3, 2026", description: "Phase-by-phase checklist for standard EMDR protocol." },
  { title: "Marketing for Therapists: Getting Started", category: "Business", type: "Guide", date: "Mar 28, 2026", description: "How to build an effective online presence and fill your caseload." },
  { title: "Burnout Self-Assessment", category: "Self-Care", type: "Worksheet", date: "Mar 22, 2026", description: "A clinician self-assessment tool for recognizing and tracking burnout symptoms." },
  { title: "Gottman Four Horsemen Handout", category: "Handouts", type: "PDF", date: "Mar 17, 2026", description: "Client handout explaining the four communication patterns that predict relationship breakdown." },
  { title: "Mindfulness Practices for Clinicians", category: "Self-Care", type: "Guide", date: "Mar 10, 2026", description: "A curated set of brief mindfulness practices designed for therapist self-care between sessions." },
  { title: "Insurance vs. Private Pay: Pros & Cons", category: "Business", type: "Guide", date: "Mar 5, 2026", description: "An honest breakdown of the trade-offs between insurance panels and private pay practice." },
  { title: "Trauma-Informed Care Intro", category: "Clinical Tools", type: "Video", date: "Feb 28, 2026", description: "Introduction to trauma-informed principles for general clinical practice." },
  { title: "Intake Form Template", category: "Clinical Tools", type: "PDF", date: "Feb 20, 2026", description: "A customizable intake form template for new clients in private practice." },
];

const CATEGORIES = ["All", "Clinical Tools", "Handouts", "Business", "Self-Care"] as const;

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (!q) return true;
      return `${r.title} ${r.description} ${r.category} ${r.type}`.toLowerCase().includes(q);
    });
  }, [category, search]);

  const hasFilters = category !== "All" || search.trim().length > 0;

  function clearFilters() {
    setSearch("");
    setCategory("All");
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
      <PageHeader
        eyebrow="Resources"
        title="Resource library"
        description="Clinical tools, handouts, and practice guides for members. Downloads open once files are uploaded."
      />

      <CardBox className="!p-3 sm:!p-4 md:!p-5 w-full min-w-0">
        <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
          <div className="relative w-full min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              style={{ color: "var(--color-text-tertiary)" }}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or topic…"
              className="h-11 pl-10 w-full min-w-0"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5"
                aria-label="Clear search"
              >
                <X className="size-4" style={{ color: "var(--color-text-tertiary)" }} />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0"
                  style={{
                    background: active ? AMBER : "#fff",
                    color: active ? "#fff" : "var(--color-sage-700)",
                    border: `1px solid ${active ? AMBER : "rgba(194,150,58,0.18)"}`,
                  }}
                >
                  {item}
                </button>
              );
            })}
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium underline ml-1"
                style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </CardBox>

      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        {filtered.length} resource{filtered.length === 1 ? "" : "s"}
        {category !== "All" ? ` in ${category}` : ""}
        {search.trim() ? ` matching “${search.trim()}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No resources match</EmptyTitle>
            <EmptyDescription>
              Try another category or clear your search.
            </EmptyDescription>
          </EmptyHeader>
          <Button type="button" variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div className="app-shell-grid">
          {filtered.map((resource) => (
            <CardBox
              key={resource.title}
              className="flex flex-col gap-3 h-full min-w-0 w-full transition-shadow hover:shadow-md !p-4 sm:!p-5"
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <span
                  className="flex size-10 items-center justify-center rounded-xl shrink-0"
                  style={{ background: "rgba(74,94,72,0.1)", color: "var(--color-sage-600)" }}
                >
                  <FileText className="size-4" />
                </span>
                <div className="flex flex-wrap gap-1.5 justify-end min-w-0">
                  <Badge>{resource.category}</Badge>
                  <Badge variant="highlight">{resource.type}</Badge>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold break-words" style={{ color: "var(--color-sage-800)" }}>
                  {resource.title}
                </p>
                <p className="text-xs leading-relaxed mt-1.5 break-words" style={{ color: "var(--color-text-secondary)" }}>
                  {resource.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-[rgba(45,59,44,0.08)]">
                <p className="text-xs shrink-0" style={{ color: "var(--color-text-tertiary)" }}>
                  Added {resource.date}
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 w-full sm:w-auto shrink-0"
                  onClick={() =>
                    downloadResourcePacket({
                      title: resource.title,
                      category: resource.category,
                      type: resource.type,
                      description: resource.description,
                      date: resource.date,
                    })
                  }
                >
                  <Download className="size-3.5" />
                  Download
                </Button>
              </div>
            </CardBox>
          ))}
        </div>
      )}
    </div>
  );
}
