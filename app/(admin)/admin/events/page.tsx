"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CardBox } from "@/components/dashboard/CardBox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { formatAbbrevDate } from "@/lib/relativeDates";
import { usePersistedState } from "@/lib/admin-store";
import {
  DEMO_EVENTS_KEY,
  SEED_DEMO_EVENTS,
  defaultDescription,
  type DemoEvent,
} from "@/lib/demo-events";

const CATEGORIES = ["Consultation", "Workshop", "CEU", "Self-Care"] as const;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type EventEntry = DemoEvent;
/** @deprecated use SEED_DEMO_EVENTS — kept for overview imports */
export const INITIAL_EVENTS = SEED_DEMO_EVENTS;

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Consultation: { bg: "#4A5E48", color: "#fff" },
  Workshop: { bg: "#B8892E", color: "#fff" },
  CEU: { bg: "#4A6F8C", color: "#fff" },
  "Self-Care": { bg: "#4A7C59", color: "#fff" },
};

type ViewMode = "month" | "agenda";

const BLANK_FORM = {
  title: "",
  date: "",
  time: "9:00 – 11:00am",
  format: "Virtual (Zoom)",
  category: "Consultation",
  ceus: "",
  description: "",
  spots: "",
};

function parseEventDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null;
  // Prefer local noon to avoid TZ day-shift for date-only strings
  const tryLocal = (s: string) => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  return (
    tryLocal(dateStr) ||
    tryLocal(`${dateStr}T12:00:00`) ||
    tryLocal(dateStr.replace(/(\w{3})\s+(\d{1,2}),\s*(\d{4})/, "$1 $2 $3"))
  );
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromDateInputValue(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return formatAbbrevDate(new Date(y, m - 1, d));
}

function abbrevToDateInput(abbrev: string): string {
  const d = parseEventDate(abbrev);
  return d ? toDateInputValue(d) : "";
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Monday-first grid cells for a month */
function buildMonthCells(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = startOfMonth(cursor);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < startPad; i++) {
    cells.push({ date: new Date(year, month, 1 - (startPad - i)), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  return cells;
}

export default function AdminEventsPage() {
  const [events, setEvents] = usePersistedState<EventEntry[]>(DEMO_EVENTS_KEY, SEED_DEMO_EVENTS);
  const [cursor, setCursor] = useState(() => {
    // Open on a month that has events when possible
    const first = parseEventDate(SEED_DEMO_EVENTS[0]?.date ?? "");
    return first ?? new Date();
  });
  const [view, setView] = useState<ViewMode>("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formCategory, setFormCategory] = useState("Consultation");
  const [dateIso, setDateIso] = useState("");

  const monthTitle = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();
  const todayKey = dayKey(today);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventEntry[]>();
    for (const ev of events) {
      const d = parseEventDate(ev.date);
      if (!d) continue;
      const k = dayKey(d);
      const list = map.get(k) ?? [];
      list.push(ev);
      map.set(k, list);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => buildMonthCells(cursor), [cursor]);

  const agendaEvents = useMemo(() => {
    return [...events]
      .map((ev) => ({ ev, d: parseEventDate(ev.date) }))
      .filter((x): x is { ev: EventEntry; d: Date } => x.d != null)
      .sort((a, b) => a.d.getTime() - b.d.getTime());
  }, [events]);

  function goToday() {
    setCursor(new Date());
  }
  function goPrev() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }
  function goNext() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  function openCreate(prefillDate?: Date) {
    const d = prefillDate ?? new Date();
    setEditId(null);
    setForm({
      ...BLANK_FORM,
      date: formatAbbrevDate(d),
    });
    setDateIso(toDateInputValue(d));
    setFormCategory("Consultation");
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setDialogOpen(true);
  }

  function openEdit(ev: EventEntry) {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      format: ev.format,
      category: ev.category,
      ceus: ev.ceus != null ? String(ev.ceus) : "",
      description: ev.description ?? "",
      spots: ev.spots != null ? String(ev.spots) : "",
    });
    setDateIso(abbrevToDateInput(ev.date));
    setFormCategory(ev.category);
    const d = parseEventDate(ev.date);
    if (d) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditId(null);
    setForm(BLANK_FORM);
    setDateIso("");
  }

  function handleDelete() {
    if (editId == null) return;
    setEvents((prev) => prev.filter((e) => e.id !== editId));
    closeDialog();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dateLabel = dateIso ? fromDateInputValue(dateIso) : form.date;
    if (!form.title.trim() || !dateLabel) return;

    const title = form.title.trim();
    const desc =
      form.description.trim() || defaultDescription(formCategory, title);

    if (editId != null) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editId
            ? {
                ...ev,
                title,
                date: dateLabel,
                time: form.time,
                format: form.format,
                category: formCategory,
                description: desc,
                ceus: form.ceus ? parseFloat(form.ceus) : null,
                spots: form.spots ? parseInt(form.spots, 10) : null,
              }
            : ev,
        ),
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Date.now(),
          title,
          date: dateLabel,
          time: form.time,
          format: form.format,
          category: formCategory,
          description: desc,
          ceus: form.ceus ? parseFloat(form.ceus) : null,
          rsvpCount: 0,
          spots: form.spots ? parseInt(form.spots, 10) : null,
          startTime: form.time.split("–")[0]?.trim() || "9:00am",
          startHour: 9,
          durationMinutes: 60,
        },
      ]);
    }
    // Keep calendar on the month of the saved event
    const saved = parseEventDate(dateLabel);
    if (saved) setCursor(new Date(saved.getFullYear(), saved.getMonth(), 1));
    closeDialog();
  }

  const chip = (active: boolean) => ({
    background: active ? "#B8892E" : "#fff",
    color: active ? "#fff" : "var(--color-sage-700)",
    border: `1px solid ${active ? "#B8892E" : "rgba(74,94,72,0.12)"}`,
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
      <CardBox className="!py-4 !px-5 sm:!px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1
            className="text-xl sm:text-2xl leading-tight"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "var(--color-sage-800)",
            }}
          >
            Calendar
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Admin</span>
            <span className="mx-1.5">/</span>
            Calendar
          </p>
        </div>
      </CardBox>

      <CardBox className="!p-0 overflow-hidden w-full min-w-0" padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-[rgba(74,94,72,0.08)]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={goToday}
                className="min-h-9 px-3 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-[var(--color-cream-100)]"
                style={{ borderColor: "rgba(74,94,72,0.12)", color: "var(--color-sage-800)" }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={goPrev}
                className="min-h-9 min-w-9 px-2.5 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-[var(--color-cream-100)]"
                style={{ borderColor: "rgba(74,94,72,0.12)", color: "var(--color-sage-800)" }}
                aria-label="Previous month"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="min-h-9 min-w-9 px-2.5 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-[var(--color-cream-100)]"
                style={{ borderColor: "rgba(74,94,72,0.12)", color: "var(--color-sage-800)" }}
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <button
              type="button"
              onClick={() => openCreate()}
              className="min-h-9 px-3.5 sm:px-4 py-1.5 rounded-full text-sm font-semibold shrink-0"
              style={{ background: "#B8892E", color: "#fff" }}
            >
              + Event
            </button>
          </div>

          <p
            className="text-center text-base sm:text-lg font-semibold"
            style={{ color: "var(--color-sage-800)" }}
          >
            {monthTitle}
          </p>

          <div className="flex items-center justify-center">
            <div
              className="inline-flex rounded-full p-0.5 border w-full sm:w-auto max-w-xs"
              style={{ borderColor: "rgba(74,94,72,0.12)", background: "var(--color-cream-100)" }}
            >
              {(
                [
                  ["month", "Month"],
                  ["agenda", "Agenda"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  className="flex-1 sm:flex-none min-h-9 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: view === key ? "#4A5E48" : "transparent",
                    color: view === key ? "#fff" : "var(--color-text-secondary)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Month grid — fully interactive */}
        {view === "month" && (
          <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
            {/* Full-width on phones; only enforce horizontal scroll min-width from sm up */}
            <div className="w-full min-w-0 sm:min-w-[520px]">
              <div
                className="grid grid-cols-7 border-b"
                style={{ borderColor: "rgba(74,94,72,0.08)", background: "var(--color-cream-100)" }}
              >
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="px-0.5 sm:px-2 py-2 text-center text-[9px] sm:text-xs font-semibold"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((cell, i) => {
                  const k = dayKey(cell.date);
                  const dayEvents = eventsByDay.get(k) ?? [];
                  const isToday = k === todayKey;
                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => openCreate(cell.date)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openCreate(cell.date);
                        }
                      }}
                      className="group min-h-[64px] sm:min-h-[100px] lg:min-h-[112px] border-b border-r p-0.5 sm:p-1.5 flex flex-col gap-0.5 min-w-0 cursor-pointer transition-colors hover:bg-[rgba(184,137,46,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8892E]"
                      style={{
                        borderColor: "rgba(74,94,72,0.06)",
                        background: cell.inMonth
                          ? isToday
                            ? "rgba(74,94,72,0.04)"
                            : "#fff"
                          : "rgba(240,237,230,0.45)",
                      }}
                      title="Click to add event on this day"
                    >
                      <div className="flex items-center justify-between gap-1 shrink-0">
                        <span
                          className="flex size-6 sm:size-7 items-center justify-center rounded-full text-[11px] sm:text-xs font-medium tabular-nums"
                          style={{
                            color: cell.inMonth
                              ? isToday
                                ? "#fff"
                                : "var(--color-text-secondary)"
                              : "var(--color-text-tertiary)",
                            background: isToday ? "#4A5E48" : "transparent",
                          }}
                        >
                          {cell.date.getDate()}
                        </span>
                        {cell.inMonth && dayEvents.length === 0 && (
                          <span
                            className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "#B8892E" }}
                          >
                            +
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-h-0 min-w-0 flex-1">
                        {dayEvents.slice(0, 3).map((ev) => {
                          const c = CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS.Consultation;
                          return (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(ev);
                              }}
                              className="w-full text-left text-[9px] sm:text-[11px] font-medium leading-tight px-1 py-0.5 rounded truncate min-w-0 hover:opacity-90"
                              style={{ background: c.bg, color: c.color }}
                              title={`${ev.title} · ${ev.time} — click to edit`}
                            >
                              {ev.title}
                            </button>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span
                            className="text-[9px] sm:text-[10px] px-1 truncate"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            +{dayEvents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === "agenda" && (
          <div className="divide-y" style={{ borderColor: "rgba(74,94,72,0.08)" }}>
            {agendaEvents.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  No events scheduled.
                </p>
                <button
                  type="button"
                  onClick={() => openCreate()}
                  className="mt-3 text-sm font-semibold underline"
                  style={{ color: "#B8892E", textUnderlineOffset: "3px" }}
                >
                  Add an event
                </button>
              </div>
            )}
            {agendaEvents.map(({ ev, d }) => {
              const c = CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS.Consultation;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => openEdit(ev)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[rgba(74,94,72,0.03)]"
                >
                  <div className="sm:w-36 shrink-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-sage-800)" }}>
                      {d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      {ev.time}
                    </p>
                  </div>
                  <span
                    className="inline-flex w-fit text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: c.bg, color: c.color }}
                  >
                    {ev.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {ev.title}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      {ev.format}
                      {ev.ceus ? ` · ${ev.ceus} CEU` : ""}
                      {` · ${ev.rsvpCount} RSVP${ev.rsvpCount === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div
          className="flex flex-wrap gap-3 px-5 py-3 border-t"
          style={{ borderColor: "rgba(74,94,72,0.08)", background: "var(--color-cream-100)" }}
        >
          {CATEGORIES.map((cat) => {
            const c = CATEGORY_COLORS[cat];
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="size-2.5 rounded-sm" style={{ background: c.bg }} />
                {cat}
              </span>
            );
          })}
          <span className="text-xs w-full sm:w-auto sm:ml-auto" style={{ color: "var(--color-text-tertiary)" }}>
            Click any day to create · click an event chip to edit
          </span>
        </div>
      </CardBox>

      {/* Modal create / edit — no separate page section */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}
      >
        <DialogContent
          className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0"
          showCloseButton
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-[rgba(74,94,72,0.08)]">
              <DialogTitle>
                {editId != null ? "Edit event" : "New event"}
              </DialogTitle>
              <DialogDescription>
                {editId != null
                  ? "Update details and save — changes stay on this calendar."
                  : "Click a day on the calendar to pre-fill the date, then save."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-4 flex flex-col gap-4">
              <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                autoFocus
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-text-secondary)" }}
                    htmlFor="event-date"
                  >
                    Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    required
                    value={dateIso}
                    onChange={(e) => {
                      setDateIso(e.target.value);
                      setForm((f) => ({
                        ...f,
                        date: fromDateInputValue(e.target.value),
                      }));
                    }}
                    className="w-full h-10 rounded-lg border px-3 text-sm outline-none focus:border-[#B8892E]"
                    style={{
                      borderColor: "rgba(74,94,72,0.15)",
                      color: "var(--color-text-primary)",
                      background: "#fff",
                    }}
                  />
                </div>
                <Input
                  label="Time"
                  name="time"
                  placeholder="e.g. 9:00 – 11:00am"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Format"
                  name="format"
                  value={form.format}
                  onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                />
                <Input
                  label="Spots (optional)"
                  name="spots"
                  type="number"
                  value={form.spots}
                  onChange={(e) => setForm((f) => ({ ...f, spots: e.target.value }))}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormCategory(c)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={chip(formCategory === c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="CEU credits (optional)"
                name="ceus"
                type="number"
                step="0.5"
                placeholder="e.g. 1.5"
                value={form.ceus}
                onChange={(e) => setForm((f) => ({ ...f, ceus: e.target.value }))}
              />
              <Textarea
                label="Description"
                name="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Shown to members"
              />
            </div>

            <DialogFooter className="px-5 py-4 gap-2 sm:gap-3">
              {editId != null && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="sm:mr-auto text-[var(--color-error)]"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={closeDialog}>
                Cancel
              </Button>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold"
                style={{ background: "#B8892E", color: "#fff" }}
              >
                {editId != null ? "Save changes" : "Add to calendar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
