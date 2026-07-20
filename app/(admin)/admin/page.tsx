"use client";

import Link from "next/link";
import { Users, FileClock, CalendarDays, BookOpen } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ALL_MEMBERS } from "./members/page";
import { APPLICATIONS } from "./applications/page";
import { INITIAL_EVENTS } from "./events/page";
import { RESOURCES } from "./resources/page";

// Matches the site's real design tokens (app/globals.css / Badge.tsx) exactly —
// --color-sage-600, --color-accent-highlight, --color-success, --color-error —
// rather than approximated hex values.
const SAGE = "#4A5E48";
const AMBER = "#C2963A";
const SUCCESS = "var(--color-success)";
const ERROR = "var(--color-error)";
const SUCCESS_BG = "rgba(74,124,89,0.12)"; // matches Badge.tsx's success variant background exactly
const ERROR_BG = "rgba(181,75,75,0.12)"; // matches Badge.tsx's error variant background exactly

// All real, derived from the same mock data the Members/Applications/Events/
// Resources pages use — not separately invented numbers.
const pendingApplications = APPLICATIONS.filter((a) => a.status === "pending");
const recentMembers = [...ALL_MEMBERS].sort((a, b) => b.joinedSort.localeCompare(a.joinedSort)).slice(0, 3);

function monthLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "short" });
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // YYYY-MM, sorts chronologically as a string
}

const membersByMonth = (() => {
  const counts = new Map<string, { month: string; members: number }>();
  for (const m of ALL_MEMBERS) {
    const key = monthKey(m.joinedSort);
    const existing = counts.get(key);
    if (existing) existing.members++;
    else counts.set(key, { month: monthLabel(m.joinedSort), members: 1 });
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
})();

const latestMonth = membersByMonth[membersByMonth.length - 1];

const resourcesThisMonth = (() => {
  const latest = [...RESOURCES].sort((a, b) => b.publishedSort.localeCompare(a.publishedSort))[0];
  const latestLabel = monthLabel(latest.publishedSort);
  return RESOURCES.filter((r) => monthLabel(r.publishedSort) === latestLabel).length;
})();

const statusBreakdown = (() => {
  const counts: Record<string, number> = { active: 0, inactive: 0, suspended: 0 };
  for (const m of ALL_MEMBERS) counts[m.status]++;
  return [
    { name: "Active", value: counts.active, color: SUCCESS },
    { name: "Inactive", value: counts.inactive, color: "var(--color-cream-400)" },
    { name: "Suspended", value: counts.suspended, color: ERROR },
  ].filter((s) => s.value > 0);
})();

const stats = [
  {
    label: "Members",
    value: ALL_MEMBERS.length,
    delta: `+${latestMonth?.members ?? 0}`,
    icon: Users,
    href: "/admin/members",
  },
  {
    label: "Applications",
    value: pendingApplications.length,
    delta: pendingApplications.length > 0 ? "Pending" : "Clear",
    icon: FileClock,
    href: "/admin/applications",
    urgent: pendingApplications.length > 0,
  },
  {
    label: "Events",
    value: INITIAL_EVENTS.length,
    delta: "Scheduled",
    icon: CalendarDays,
    href: "/admin/events",
  },
  {
    label: "Resources published",
    value: RESOURCES.length,
    delta: `+${resourcesThisMonth} this month`,
    icon: BookOpen,
    href: "/admin/resources",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-eyebrow mb-1">Admin</p>
        <h1 className="text-page-title">Overview</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card hover className="flex flex-col gap-3 py-5 h-full" style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.12)" }}>
              <div className="flex items-center justify-between">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(194,150,58,0.10)", color: AMBER }}
                >
                  <s.icon size={17} />
                </span>
                <span
                  className="text-[11px] font-medium px-2 py-1 rounded-full"
                  style={{
                    background: s.urgent ? ERROR_BG : SUCCESS_BG,
                    color: s.urgent ? ERROR : SUCCESS,
                  }}
                >
                  {s.delta}
                </span>
              </div>
              <p className="text-3xl" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}>
                {s.value}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                {s.label}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col gap-5" style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.12)" }}>
          <h2 className="text-base" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}>
            Members joined by month
          </h2>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={membersByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(194,150,58,0.12)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: "rgba(194,150,58,0.25)" }} />
                <Bar dataKey="members" fill={SAGE} radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col gap-5" style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.12)" }}>
          <h2 className="text-base" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}>
            Member status
          </h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: "rgba(194,150,58,0.25)" }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending applications */}
        <Card className="flex flex-col gap-5" style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.12)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}>
              Pending applications
            </h2>
            <Link href="/admin/applications" className="text-xs underline" style={{ color: AMBER, textUnderlineOffset: "3px" }}>
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {pendingApplications.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>No pending applications.</p>
            )}
            {pendingApplications.map((a) => (
              <div key={a.name} className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {a.name}, {a.credentials}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    Submitted {a.submitted}
                  </p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent members */}
        <Card className="flex flex-col gap-5" style={{ background: "#fff", border: "1px solid rgba(194,150,58,0.12)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}>
              Recently joined
            </h2>
            <Link href="/admin/members" className="text-xs underline" style={{ color: AMBER, textUnderlineOffset: "3px" }}>
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentMembers.map((m) => (
              <div key={m.name} className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0" style={{ background: "rgba(194,150,58,0.10)", color: AMBER }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {m.name}, {m.credentials}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      Joined {m.joined}
                    </p>
                  </div>
                </div>
                <Badge variant={m.status === "active" ? "success" : m.status === "suspended" ? "error" : "default"}>
                  {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
