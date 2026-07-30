"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { CardBox } from "@/components/dashboard/CardBox";
import { usePersistedState } from "@/lib/admin-store";
import { DEMO_EVENTS_KEY, SEED_DEMO_EVENTS, type DemoEvent } from "@/lib/demo-events";
import {
  DEMO_RESOURCES_KEY,
  SEED_DEMO_RESOURCES,
  type DemoResource,
} from "@/lib/demo-resources";

const AMBER = "#C2963A";
const SAGE = "#4A5E48";

function parseEventSort(dateStr: string): number {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? Number.MAX_SAFE_INTEGER : d.getTime();
}

/**
 * Member overview lists — same localStorage stores as admin events/resources.
 */
export function DashboardOverviewPanels({ rsvpIds = [1] }: { rsvpIds?: number[] }) {
  const [events] = usePersistedState<DemoEvent[]>(DEMO_EVENTS_KEY, SEED_DEMO_EVENTS);
  const [resources] = usePersistedState<DemoResource[]>(
    DEMO_RESOURCES_KEY,
    SEED_DEMO_RESOURCES,
  );
  const [rsvpd] = usePersistedState<number[]>("acc-demo-rsvp", rsvpIds);
  const rsvpSet = useMemo(() => new Set(rsvpd), [rsvpd]);

  const upcoming = useMemo(
    () =>
      [...events]
        .sort((a, b) => parseEventSort(a.date) - parseEventSort(b.date))
        .slice(0, 3),
    [events],
  );

  const recentResources = useMemo(
    () =>
      [...resources]
        .sort((a, b) => b.publishedSort.localeCompare(a.publishedSort))
        .slice(0, 3),
    [resources],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full min-w-0">
      <CardBox className="!p-0 overflow-hidden" padding={false}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-base font-semibold" style={{ color: SAGE }}>
              Upcoming events
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Calendar & consultation
            </p>
          </div>
          <Link href="/dashboard/events" className="text-xs font-semibold" style={{ color: AMBER }}>
            View all
          </Link>
        </div>
        <Separator style={{ background: "rgba(74,94,72,0.08)" }} />
        <div className="px-5 py-4 flex flex-col gap-4">
          {upcoming.length === 0 && (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No events scheduled yet.
            </p>
          )}
          {upcoming.map((ev) => (
            <div key={ev.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {ev.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                  {ev.date} · {ev.time}
                </p>
              </div>
              {rsvpSet.has(ev.id) ? (
                <Badge className="bg-[rgba(74,124,89,0.12)] text-[var(--color-success)] border-0 shrink-0">
                  RSVP&apos;d
                </Badge>
              ) : (
                <Link href="/dashboard/events" className="shrink-0">
                  <Badge
                    variant="outline"
                    className="border-[rgba(194,150,58,0.35)] text-[var(--color-sage-700)]"
                  >
                    RSVP
                  </Badge>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardBox>

      <CardBox className="!p-0 overflow-hidden" padding={false}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-base font-semibold" style={{ color: SAGE }}>
              Resource library
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Latest clinical tools
            </p>
          </div>
          <Link href="/dashboard/resources" className="text-xs font-semibold" style={{ color: AMBER }}>
            View all
          </Link>
        </div>
        <Separator style={{ background: "rgba(74,94,72,0.08)" }} />
        <div className="px-5 py-4 flex flex-col gap-4">
          {recentResources.length === 0 && (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No resources yet.
            </p>
          )}
          {recentResources.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="flex size-9 items-center justify-center rounded-lg shrink-0"
                  style={{ background: "rgba(74,94,72,0.08)", color: SAGE }}
                >
                  <FileText className="size-4" />
                </span>
                <p className="text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
                  {r.title}
                </p>
              </div>
              <Badge variant="secondary" className="font-normal shrink-0">
                {r.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardBox>
    </div>
  );
}

