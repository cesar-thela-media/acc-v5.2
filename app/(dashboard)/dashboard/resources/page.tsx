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
import { usePersistedState } from "@/lib/admin-store";
import {
  DEMO_RESOURCES_KEY,
  SEED_DEMO_RESOURCES,
  type DemoResource,
} from "@/lib/demo-resources";
import { downloadResourcePacket } from "@/lib/demoDownload";

const AMBER = "var(--color-accent-highlight)";

const CATEGORIES = ["All", "Clinical Tools", "Handouts", "Business", "Self-Care"] as const;

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const [resources] = usePersistedState<DemoResource[]>(
    DEMO_RESOURCES_KEY,
    SEED_DEMO_RESOURCES,
  );
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (!q) return true;
      return `${r.title} ${r.description} ${r.category} ${r.type}`.toLowerCase().includes(q);
    });
  }, [category, search, resources]);

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
        description="Clinical tools, handouts, and practice guides: same library managed in admin."
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
              className="pl-10 w-full"
              aria-label="Search resources"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="size-4" style={{ color: "var(--color-text-tertiary)" }} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: category === item ? "#4A5E48" : "var(--color-cream-100)",
                  color: category === item ? "#fff" : "var(--color-text-secondary)",
                  border: `1px solid ${category === item ? "#4A5E48" : "rgba(74,94,72,0.1)"}`,
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium self-start underline"
              style={{ color: AMBER, textUnderlineOffset: "3px" }}
            >
              Clear filters
            </button>
          )}
        </div>
      </CardBox>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No resources found</EmptyTitle>
            <EmptyDescription>
              Try another category or search term.
            </EmptyDescription>
          </EmptyHeader>
          <Button type="button" variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
          {filtered.map((r) => (
            <CardBox key={r.id} className="flex flex-col gap-3 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Badge>{r.category}</Badge>
                <span className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                  {r.type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-sage-800)" }}>
                  {r.title}
                </p>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {r.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                  {r.published}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    downloadResourcePacket({
                      title: r.title,
                      category: r.category,
                      type: r.type,
                      description: r.description,
                    })
                  }
                >
                  <Download className="size-3.5 mr-1.5" />
                  Sample download
                </Button>
              </div>
            </CardBox>
          ))}
        </div>
      )}
    </div>
  );
}
