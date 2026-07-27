"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { EVENTS } from "@/lib/events";
import { downloadIcsEvent } from "@/lib/ics";
import { downloadDemoCertificate } from "@/lib/demoDownload";

const categoryColor: Record<string, "default" | "success" | "warning" | "accent" | "highlight"> = {
  Consultation: "default",
  Workshop: "accent",
  CEU: "success",
  "Self-Care": "highlight",
};

export function EventsClient({ hasCertificates }: { hasCertificates: boolean }) {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set([1]));
  const [expanded, setExpanded] = useState<number | null>(null);

  const listEvents = useMemo(() => {
    if (!q) return EVENTS;
    return EVENTS.filter((ev) =>
      `${ev.title} ${ev.category} ${ev.description} ${ev.date}`.toLowerCase().includes(q),
    );
  }, [q]);

  function toggleRsvp(id: number) {
    setRsvpd((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Simple month calendar cells from event dates (template calendar surface) */
  const calendarCells = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startPad = first.getDay();
    const cells: { day: number | null; events: typeof EVENTS }[] = [];
    for (let i = 0; i < startPad; i++) cells.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const label = new Date(year, month, d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const dayEvents = EVENTS.filter((ev) => ev.date.includes(label.split(",")[0]) || ev.date.includes(`${d},`));
      // Match by day number appearing in date string when full label fails
      const loose = EVENTS.filter((ev) => {
        const m = ev.date.match(/(\w+)\s+(\d+)/);
        if (!m) return false;
        const monthName = now.toLocaleDateString("en-US", { month: "long" });
        const shortMonth = now.toLocaleDateString("en-US", { month: "short" });
        return (
          Number(m[2]) === d &&
          (ev.date.includes(monthName) || ev.date.includes(shortMonth))
        );
      });
      cells.push({ day: d, events: dayEvents.length ? dayEvents : loose });
    }
    return cells;
  }, []);

  const monthTitle = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Events"
        title="Upcoming events"
        description="Case consultation, CEU trainings, and workshops. Add to calendar or download certificates when available."
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 flex flex-col gap-4">
          {listEvents.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: "var(--color-text-tertiary)" }}>
              No events match “{searchParams.get("q")}”.
            </p>
          )}
          {listEvents.map((ev) => {
            const isRsvpd = rsvpd.has(ev.id);
            const isExpanded = expanded === ev.id;
            return (
              <CardBox key={ev.id} className="!p-0 overflow-hidden" padding={false}>
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                  onClick={() => setExpanded(isExpanded ? null : ev.id)}
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={categoryColor[ev.category] ?? "default"}>{ev.category}</Badge>
                      {ev.ceus && (
                        <Badge variant="success">
                          {ev.ceus} CEU{ev.ceus !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {isRsvpd && <Badge variant="success">RSVP&apos;d</Badge>}
                    </div>
                    <p className="text-base font-semibold mt-1" style={{ color: "var(--color-sage-800)" }}>
                      {ev.title}
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                      {ev.date} · {ev.time} · {ev.format}
                    </p>
                  </div>
                  <span
                    className="text-lg mt-1 shrink-0 transition-transform"
                    style={{
                      color: "var(--color-text-tertiary)",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ⌄
                  </span>
                </button>

                {isExpanded && (
                  <div
                    className="px-6 pb-6 border-t pt-4 flex flex-col gap-4"
                    style={{ borderColor: "rgba(194,150,58,0.10)" }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {ev.description}
                    </p>
                    {ev.spots && (
                      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        {ev.spots} spots available
                      </p>
                    )}
                    <div className="flex gap-3 items-center flex-wrap">
                      <Button
                        variant={isRsvpd ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => toggleRsvp(ev.id)}
                      >
                        {isRsvpd ? "Cancel RSVP" : "RSVP"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          downloadIcsEvent({
                            title: ev.title,
                            description: ev.description,
                            dateLabel: ev.date,
                            startHour: ev.startHour,
                            durationMinutes: ev.durationMinutes,
                          })
                        }
                      >
                        Add to calendar
                      </Button>
                      {isRsvpd && ev.ceus ? (
                        hasCertificates ? (
                          <a
                            href={`/api/certificate?workshop=${encodeURIComponent(ev.title)}&ceus=${ev.ceus}`}
                            className="text-xs font-medium underline"
                            style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
                          >
                            Download certificate →
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-medium underline"
                            style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
                            onClick={() =>
                              downloadDemoCertificate({
                                memberName: "Member",
                                workshop: ev.title,
                                ceus: ev.ceus ?? 0,
                                date: ev.date,
                              })
                            }
                          >
                            Download demo certificate →
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                )}
              </CardBox>
            );
          })}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <CardBox>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-sage-800)" }}>
              {monthTitle}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-tertiary)" }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, i) => (
                <div
                  key={i}
                  className="min-h-[72px] rounded-lg p-1.5 text-left"
                  style={{
                    background: cell.day ? "#fff" : "transparent",
                    border: cell.day ? "1px solid rgba(45,59,44,0.08)" : "none",
                  }}
                >
                  {cell.day != null && (
                    <>
                      <p className="text-xs font-medium" style={{ color: "var(--color-sage-800)" }}>
                        {cell.day}
                      </p>
                      {cell.events.slice(0, 2).map((ev) => (
                        <p
                          key={ev.id}
                          className="text-[9px] leading-tight mt-0.5 truncate rounded px-0.5"
                          style={{ background: "rgba(194,150,58,0.15)", color: "#7A5E1E" }}
                          title={ev.title}
                        >
                          {ev.title}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardBox>
        </TabsContent>

        <TabsContent value="coaching" className="mt-4">
          <CardBox>
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--color-sage-600)" }}>
                Practice coaching
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--color-sage-900)",
                }}
              >
                Book a session with Sarah
              </h2>
            </div>
            <CalendlyEmbed />
          </CardBox>
        </TabsContent>
      </Tabs>
    </div>
  );
}
