"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { daysFromNow, formatAbbrevDate, nextFirstWeekdayOfMonth } from "@/lib/relativeDates";
import { usePersistedState } from "@/lib/admin-store";

const CATEGORIES = ["Consultation", "Workshop", "CEU", "Self-Care"];
const THURSDAY = 4;

// Two upcoming "first Thursday of the month" consultation dates, a full
// calendar month apart (per the client's literal FAQ wording for this event).
const firstConsultation = nextFirstWeekdayOfMonth(THURSDAY, 0);
const monthsUntilFirst =
  (firstConsultation.getFullYear() - new Date().getFullYear()) * 12 +
  (firstConsultation.getMonth() - new Date().getMonth());
const secondConsultation = nextFirstWeekdayOfMonth(THURSDAY, monthsUntilFirst + 1);

type SortKey = "title" | "date" | "category" | "rsvps";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="inline-block ml-1 text-xs" style={{ opacity: active ? 1 : 0.25 }}>
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

export type EventEntry = {
  id: number;
  title: string;
  date: string;
  time: string;
  format: string;
  category: string;
  ceus: number | null;
  rsvpCount: number;
  spots: number | null;
};

export const INITIAL_EVENTS: EventEntry[] = [
  { id: 1, title: "Monthly case consultation", date: formatAbbrevDate(firstConsultation), time: "9:00 – 10:30am", format: "Virtual (Zoom)", category: "Consultation", ceus: 1.5, rsvpCount: 9, spots: null },
  { id: 2, title: "Practice building workshop: Setting your fee", date: formatAbbrevDate(daysFromNow(22)), time: "12:00 – 1:00pm", format: "Virtual (Zoom)", category: "Workshop", ceus: null, rsvpCount: 4, spots: 20 },
  { id: 3, title: "Trauma-informed care: CEU training", date: formatAbbrevDate(daysFromNow(31)), time: "10:00am – 12:00pm", format: "Virtual (Zoom)", category: "CEU", ceus: 2.0, rsvpCount: 11, spots: 30 },
  { id: 4, title: "Monthly case consultation", date: formatAbbrevDate(secondConsultation), time: "9:00 – 10:30am", format: "Virtual (Zoom)", category: "Consultation", ceus: 1.5, rsvpCount: 0, spots: null },
  { id: 5, title: "Burnout prevention: clinician self-care", date: formatAbbrevDate(daysFromNow(56)), time: "1:00 – 2:30pm", format: "Virtual (Zoom)", category: "Self-Care", ceus: null, rsvpCount: 2, spots: 25 },
];

const CATEGORY_VARIANTS: Record<string, "default" | "accent" | "success" | "warning" | "highlight"> = {
  Consultation: "default",
  Workshop: "accent",
  CEU: "success",
  "Self-Care": "highlight",
};

const BLANK_FORM = { title: "", date: "", time: "", format: "Virtual (Zoom)", category: "Consultation", ceus: "", description: "", spots: "" };

export default function AdminEventsPage() {
  const [events, setEvents] = usePersistedState<EventEntry[]>("admin-events", INITIAL_EVENTS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formCategory, setFormCategory] = useState("Consultation");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "asc" : "desc");
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "title") return mul * a.title.localeCompare(b.title);
    if (sortKey === "category") return mul * a.category.localeCompare(b.category);
    if (sortKey === "rsvps") return mul * (a.rsvpCount - b.rsvpCount);
    return mul * a.date.localeCompare(b.date);
  });

  function openCreate() {
    setEditId(null);
    setForm(BLANK_FORM);
    setFormCategory("Consultation");
    setShowForm(true);
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
      description: "",
      spots: ev.spots != null ? String(ev.spots) : "",
    });
    setFormCategory(ev.category);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId != null) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editId
            ? {
                ...ev,
                title: form.title,
                date: form.date,
                time: form.time,
                format: form.format,
                category: formCategory,
                ceus: form.ceus ? parseFloat(form.ceus) : null,
                spots: form.spots ? parseInt(form.spots) : null,
              }
            : ev
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: form.title,
          date: form.date,
          time: form.time,
          format: form.format,
          category: formCategory,
          ceus: form.ceus ? parseFloat(form.ceus) : null,
          rsvpCount: 0,
          spots: form.spots ? parseInt(form.spots) : null,
        },
      ]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(BLANK_FORM);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow mb-1">Admin</p>
          <h1 className="text-page-title">Events</h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90 w-full sm:w-auto"
          style={{ background: "#C2963A", color: "#fff" }}
        >
          + Create event
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div
          className="rounded-2xl border p-6 bg-white flex flex-col gap-5"
          style={{ borderColor: "rgba(194,150,58,0.12)" }}
        >
          <h2
            className="text-base"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "var(--color-sage-800)",
            }}
          >
            {editId != null ? "Edit event" : "Create new event"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date"
                name="date"
                placeholder="e.g. May 1, 2026"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
              <Input
                label="Time"
                name="time"
                placeholder="e.g. 9:00 – 10:30am"
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
                label="Max spots (leave blank for unlimited)"
                name="spots"
                type="number"
                value={form.spots}
                onChange={(e) => setForm((f) => ({ ...f, spots: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormCategory(c)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background: formCategory === c ? "#C2963A" : "#fff",
                        color: formCategory === c ? "#fff" : "var(--color-sage-700)",
                        border: `1px solid ${formCategory === c ? "#C2963A" : "rgba(194,150,58,0.20)"}`,
                      }}
                    >{c}</button>
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
            </div>
            <Textarea
              label="Description"
              name="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Event description shown to members"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "#C2963A", color: "#fff" }}
              >
                {editId != null ? "Save changes" : "Create event"}
              </button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditId(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile event cards */}
      {events.length > 0 && (
        <div className="md:hidden flex flex-col gap-3">
          {sortedEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl border bg-white p-4 flex flex-col gap-3"
              style={{ borderColor: "rgba(194,150,58,0.12)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{ev.title}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>{ev.format}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={CATEGORY_VARIANTS[ev.category] ?? "default"}>{ev.category}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none">
                      <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(ev)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(ev.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="text-sm flex flex-col gap-1" style={{ color: "var(--color-text-secondary)" }}>
                <p>{ev.date}</p>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{ev.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {ev.ceus && <Badge variant="success">{ev.ceus} CEU{ev.ceus !== 1 ? "s" : ""}</Badge>}
                <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {ev.rsvpCount}{ev.spots ? ` / ${ev.spots}` : ""} RSVPs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border overflow-hidden bg-white" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(194,150,58,0.12)", background: "var(--color-cream-100)" }}>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#C2963A" }}
                  onClick={() => toggleSort("title")}
                >
                  Event
                  <SortIcon active={sortKey === "title"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#C2963A" }}
                  onClick={() => toggleSort("date")}
                >
                  Date & time
                  <SortIcon active={sortKey === "date"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#C2963A" }}
                  onClick={() => toggleSort("category")}
                >
                  Category
                  <SortIcon active={sortKey === "category"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#C2963A" }}
                  onClick={() => toggleSort("rsvps")}
                >
                  RSVPs
                  <SortIcon active={sortKey === "rsvps"} dir={sortDir} />
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((ev, i) => (
                <tr
                  key={ev.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: i < events.length - 1 ? "1px solid rgba(194,150,58,0.08)" : "none" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(194,150,58,0.04)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{ev.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>{ev.format}</p>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                    <p>{ev.date}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{ev.time}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      <Badge variant={CATEGORY_VARIANTS[ev.category] ?? "default"}>{ev.category}</Badge>
                      {ev.ceus && <Badge variant="success">{ev.ceus} CEU{ev.ceus !== 1 ? "s" : ""}</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                    {ev.rsvpCount}{ev.spots ? ` / ${ev.spots}` : ""}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none">
                          <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(ev)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => handleDelete(ev.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--color-text-tertiary)" }}>
            <p className="text-sm">No events yet. Create one above.</p>
          </div>
        )}
      </div>

      {events.length === 0 && (
        <div className="md:hidden py-16 text-center" style={{ color: "var(--color-text-tertiary)" }}>
          <p className="text-sm">No events yet. Create one above.</p>
        </div>
      )}
    </div>
  );
}
