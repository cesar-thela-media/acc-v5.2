"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Users,
  FileClock,
  CalendarDays,
  BookOpen,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
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
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { CardBox } from "@/components/dashboard/CardBox";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { usePersistedState } from "@/lib/admin-store";
import {
  APPLICATIONS_STORAGE_KEY,
  SEED_APPLICATIONS,
  type Application,
} from "@/lib/applications";
import { ALL_MEMBERS } from "./members/page";
import { INITIAL_EVENTS } from "./events/page";
import { RESOURCES } from "./resources/page";

const SAGE = "#4A5E48";
const AMBER = "#B8892E";
const SUCCESS = "#4A7C59";
const ERROR = "#B54B4B";
const CREAM_LINE = "rgba(194,150,58,0.14)";

/** Seed-only for static chart scaffolding; live pending counts come from storage */
const seedRejected = SEED_APPLICATIONS.filter((a) => a.status === "rejected");
const activeMembers = ALL_MEMBERS.filter((m) => m.status === "active");
const recentMembers = [...ALL_MEMBERS]
  .sort((a, b) => b.joinedSort.localeCompare(a.joinedSort))
  .slice(0, 4);

function monthLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "short" });
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}

/** Members joined by month — growth bars */
const membersByMonth = (() => {
  const counts = new Map<string, { month: string; joined: number; key: string }>();
  for (const m of ALL_MEMBERS) {
    const key = monthKey(m.joinedSort);
    const existing = counts.get(key);
    if (existing) existing.joined++;
    else counts.set(key, { month: monthLabel(m.joinedSort), joined: 1, key });
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
})();

/**
 * Template-style signed bar chart: joined (up) vs churned/rejected (down).
 * Built from real mock roster + application decisions.
 */
const pipelineChart = (() => {
  const byMonth = new Map<string, { label: string; joined: number; left: number }>();
  for (const m of ALL_MEMBERS) {
    const key = monthKey(m.joinedSort);
    const label = monthLabel(m.joinedSort);
    const row = byMonth.get(key) ?? { label, joined: 0, left: 0 };
    row.joined += 1;
    if (m.status === "suspended" || m.status === "inactive") row.left += 1;
    byMonth.set(key, row);
  }
  // Distribute rejected apps across months for visual balance
  seedRejected.forEach((a, i) => {
    const keys = Array.from(byMonth.keys());
    const k = keys[i % Math.max(keys.length, 1)] ?? "2026-01";
    const row = byMonth.get(k);
    if (row) row.left += 1;
  });
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({
      month: v.label,
      Joined: v.joined,
      Left: -Math.max(v.left, 0),
    }));
})();

const monthlyTrend = membersByMonth.map((m, i, arr) => ({
  month: m.month,
  members: arr.slice(0, i + 1).reduce((sum, x) => sum + x.joined, 0),
}));

const latestMonth = membersByMonth[membersByMonth.length - 1];
const prevMonth = membersByMonth[membersByMonth.length - 2];
const monthDelta =
  latestMonth && prevMonth
    ? latestMonth.joined - prevMonth.joined
    : latestMonth?.joined ?? 0;
const monthDeltaPct =
  prevMonth && prevMonth.joined > 0
    ? Math.round((monthDelta / prevMonth.joined) * 100)
    : latestMonth
      ? 100
      : 0;

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
    { name: "Inactive", value: counts.inactive, color: "#C2BDB0" },
    { name: "Suspended", value: counts.suspended, color: ERROR },
  ].filter((s) => s.value > 0);
})();

/** $79/mo membership estimate from active roster */
const estimatedMrr = activeMembers.length * 79;
const estimatedArr = estimatedMrr * 12;

function DeltaPill({ value, positive }: { value: string; positive?: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: positive ? "rgba(74,124,89,0.12)" : "rgba(181,75,75,0.12)",
        color: positive ? SUCCESS : ERROR,
      }}
    >
      {value}
    </span>
  );
}

export default function AdminOverviewPage() {
  const [applications] = usePersistedState<Application[]>(
    APPLICATIONS_STORAGE_KEY,
    SEED_APPLICATIONS,
  );

  const pendingApplications = useMemo(
    () => applications.filter((a) => a.status === "pending"),
    [applications],
  );
  const approvedApplications = useMemo(
    () => applications.filter((a) => a.status === "approved"),
    [applications],
  );
  const rejectedApplications = useMemo(
    () => applications.filter((a) => a.status === "rejected"),
    [applications],
  );

  const timelineItems = useMemo(
    () => [
      ...pendingApplications.slice(0, 3).map((a) => ({
        id: `app-${a.id}`,
        title: `${a.name} applied`,
        meta: `Submitted ${a.submitted} · ${a.city}`,
        accent: "amber" as const,
        badge: <Badge variant="warning">Pending</Badge>,
      })),
      ...recentMembers.slice(0, 2).map((m) => ({
        id: `mem-${m.id}`,
        title: `${m.name} joined`,
        meta: `Member since ${m.joined}`,
        accent: "success" as const,
        badge: (
          <Badge variant={m.status === "active" ? "success" : "default"}>
            {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
          </Badge>
        ),
      })),
    ],
    [pendingApplications],
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
      {/* ── Row 1: Analytics banner + two KPI cards (Space analytics layout) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 sm:gap-5 w-full min-w-0">
        {/* Hero banner */}
        <div className="sm:col-span-2 xl:col-span-6 min-w-0">
          <CardBox className="relative overflow-hidden h-full min-h-[200px] !py-6">
            <div className="relative z-[1] flex flex-col gap-5 max-w-md">
              <div>
                <h1
                  className="text-xl sm:text-2xl leading-tight"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontWeight: 400,
                    color: "var(--color-sage-800)",
                  }}
                >
                  Membership dashboard
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  Check pipeline, roster, and engagement statistics
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-6 sm:gap-10">
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                    Active members
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className="text-2xl sm:text-3xl tabular-nums"
                      style={{
                        fontFamily: "var(--font-serif), Georgia, serif",
                        color: "var(--color-sage-800)",
                      }}
                    >
                      {activeMembers.length}
                    </p>
                    <DeltaPill
                      value={`${monthDeltaPct >= 0 ? "+" : ""}${monthDeltaPct}%`}
                      positive={monthDeltaPct >= 0}
                    />
                  </div>
                </div>
                <div
                  className="hidden sm:block w-px self-stretch"
                  style={{ background: CREAM_LINE }}
                />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                    Pending applications
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className="text-2xl sm:text-3xl tabular-nums"
                      style={{
                        fontFamily: "var(--font-serif), Georgia, serif",
                        color: "var(--color-sage-800)",
                      }}
                    >
                      {pendingApplications.length}
                    </p>
                    <DeltaPill
                      value={pendingApplications.length > 0 ? "Review" : "Clear"}
                      positive={pendingApplications.length === 0}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 50% 80% at 100% 50%, rgba(194,150,58,0.12) 0%, transparent 60%)",
              }}
            />
          </CardBox>
        </div>

        {/* KPI pair — template Weekly Sales / Purchase Orders */}
        <div className="xl:col-span-3 min-w-0">
          <CardBox className="h-full flex flex-col gap-4 min-h-0 sm:min-h-[180px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                  Pending applications
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p
                    className="text-3xl tabular-nums"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      color: "var(--color-sage-800)",
                    }}
                  >
                    {pendingApplications.length}
                  </p>
                  <DeltaPill value={`${applications.length} total`} positive={false} />
                </div>
              </div>
              <span
                className="flex size-12 items-center justify-center rounded-full shrink-0"
                style={{ background: "rgba(255,185,0,0.2)", color: "#9A7426" }}
              >
                <FileClock className="size-5" />
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {approvedApplications.length} approved · {rejectedApplications.length} rejected
            </p>
            <Link
              href="/admin/applications"
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold w-fit"
              style={{ color: AMBER }}
            >
              View applications
              <ArrowRight className="size-4" />
            </Link>
          </CardBox>
        </div>

        <div className="xl:col-span-3 min-w-0">
          <CardBox className="h-full flex flex-col gap-4 min-h-0 sm:min-h-[180px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                  Scheduled events
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p
                    className="text-3xl tabular-nums"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      color: "var(--color-sage-800)",
                    }}
                  >
                    {INITIAL_EVENTS.length}
                  </p>
                  <DeltaPill value="+2" positive />
                </div>
              </div>
              <span
                className="flex size-12 items-center justify-center rounded-full shrink-0"
                style={{ background: "rgba(74,94,72,0.12)", color: SAGE }}
              >
                <CalendarDays className="size-5" />
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              Consultations, CEUs & workshops
            </p>
            <Link
              href="/admin/events"
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold w-fit"
              style={{ color: AMBER }}
            >
              View calendar
              <ArrowRight className="size-4" />
            </Link>
          </CardBox>
        </div>
      </div>

      {/* ── Row 2: Revenue-style pipeline chart + side metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full min-w-0">
        <div className="lg:col-span-8 min-w-0">
          <CardBox className="h-full flex flex-col gap-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--color-sage-800)" }}>
                  Membership updates
                </h2>
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Overview of joins vs. exits
                </p>
              </div>
              <span
                className="self-start text-xs font-medium rounded-full px-3 py-1.5"
                style={{
                  background: "var(--color-cream-100)",
                  border: "1px solid rgba(45,59,44,0.1)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Year 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center min-w-0">
              <div className="md:col-span-8 min-w-0 w-full" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineChart} stackOffset="sign" margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CREAM_LINE} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                    />
                    <ReferenceLine y={0} stroke="rgba(45,59,44,0.15)" />
                    <Tooltip
                      contentStyle={{
                        fontSize: 13,
                        borderRadius: 8,
                        borderColor: "rgba(194,150,58,0.25)",
                      }}
                    />
                    <Bar dataKey="Joined" fill={SAGE} stackId="stack" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="Left" fill="rgba(74,94,72,0.28)" stackId="stack" radius={[0, 0, 4, 4]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-4 flex flex-col gap-5 px-1">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-10 items-center justify-center rounded-lg shrink-0"
                    style={{ background: "rgba(74,94,72,0.1)", color: SAGE }}
                  >
                    <LayoutGrid className="size-4" />
                  </span>
                  <div>
                    <p
                      className="text-2xl tabular-nums leading-none"
                      style={{
                        fontFamily: "var(--font-serif), Georgia, serif",
                        color: "var(--color-sage-800)",
                      }}
                    >
                      {ALL_MEMBERS.length}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                      Total members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full shrink-0" style={{ background: SAGE }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      Joined this month
                    </p>
                    <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-sage-800)" }}>
                      {latestMonth?.joined ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ background: "rgba(74,94,72,0.35)" }}
                  />
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      Inactive / suspended
                    </p>
                    <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-sage-800)" }}>
                      {ALL_MEMBERS.length - activeMembers.length}
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/members"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: SAGE }}
                >
                  View members
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </CardBox>
        </div>

        {/* Right column: monthly growth + status donut */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 min-w-0">
          <CardBox className="flex flex-col gap-2 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                  Monthly growth
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <p
                    className="text-2xl tabular-nums"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      color: "var(--color-sage-800)",
                    }}
                  >
                    {ALL_MEMBERS.length}
                  </p>
                  <DeltaPill
                    value={`${monthDeltaPct >= 0 ? "+" : ""}${monthDeltaPct}%`}
                    positive={monthDeltaPct >= 0}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  roster size vs prior month
                </p>
              </div>
              <span
                className="flex size-10 items-center justify-center rounded-full"
                style={{ background: "rgba(255,185,0,0.2)", color: "#9A7426" }}
              >
                <Users className="size-4" />
              </span>
            </div>
            <div className="w-full min-w-0" style={{ height: 88 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SAGE} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={SAGE} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke={SAGE}
                    strokeWidth={2}
                    fill="url(#growthFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBox>

          <CardBox className="flex flex-col gap-3 flex-1">
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                Member status
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <p
                  className="text-2xl tabular-nums"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    color: "var(--color-sage-800)",
                  }}
                >
                  {activeMembers.length}
                </p>
                <DeltaPill
                  value={`${Math.round((activeMembers.length / Math.max(ALL_MEMBERS.length, 1)) * 100)}% active`}
                  positive
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 min-w-0">
              <div style={{ width: 120, height: 120 }} className="shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={54}
                      paddingAngle={2}
                      isAnimationActive={false}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex flex-col gap-2 text-xs">
                {statusBreakdown.map((s) => (
                  <li key={s.name} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {s.name}{" "}
                      <strong style={{ color: "var(--color-sage-800)" }}>{s.value}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardBox>
        </div>
      </div>

      {/* ── Row 3: compact KPI strip + activity ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        {[
          {
            label: "Members",
            value: ALL_MEMBERS.length,
            hint: `+${latestMonth?.joined ?? 0} latest month`,
            icon: Users,
            href: "/admin/members",
            color: SAGE,
            bg: "rgba(74,94,72,0.1)",
          },
          {
            label: "Applications",
            value: pendingApplications.length,
            hint: "Awaiting review",
            icon: FileClock,
            href: "/admin/applications",
            color: AMBER,
            bg: "rgba(194,150,58,0.14)",
          },
          {
            label: "Events",
            value: INITIAL_EVENTS.length,
            hint: "On the calendar",
            icon: CalendarDays,
            href: "/admin/events",
            color: SAGE,
            bg: "rgba(74,94,72,0.1)",
          },
          {
            label: "Resources",
            value: RESOURCES.length,
            hint: `+${resourcesThisMonth} this month`,
            icon: BookOpen,
            href: "/admin/resources",
            color: SUCCESS,
            bg: "rgba(74,124,89,0.12)",
          },
        ].map((k) => (
          <Link key={k.label} href={k.href} className="block no-underline h-full">
            <CardBox className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
                    {k.label}
                  </p>
                  <p
                    className="text-2xl mt-1 tabular-nums"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      color: "var(--color-sage-800)",
                    }}
                  >
                    {k.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                    {k.hint}
                  </p>
                </div>
                <span
                  className="flex size-10 items-center justify-center rounded-full shrink-0"
                  style={{ background: k.bg, color: k.color }}
                >
                  <k.icon className="size-4" />
                </span>
              </div>
            </CardBox>
          </Link>
        ))}
      </div>

      {/* Est. membership revenue strip (template earnings callout) */}
      <CardBox
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, #F7F4EC 0%, #EDE8DC 100%)",
          borderColor: "rgba(194,150,58,0.2)",
        }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Estimated membership revenue
          </p>
          <p
            className="text-2xl mt-1 tabular-nums"
            style={{ fontFamily: "var(--font-serif), Georgia, serif", color: "var(--color-sage-800)" }}
          >
            ${estimatedMrr.toLocaleString()}
            <span className="text-sm font-normal ml-1" style={{ color: "var(--color-text-tertiary)" }}>
              /mo
            </span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            ~${estimatedArr.toLocaleString()}/yr · {activeMembers.length} active × $79
          </p>
        </div>
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: AMBER }}
        >
          View roster
          <ArrowRight className="size-4" />
        </Link>
      </CardBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full min-w-0">
        <CardBox className="min-w-0">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-semibold" style={{ color: SAGE }}>
                Activity
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                Applications & new members
              </p>
            </div>
            <Link href="/admin/applications" className="text-xs font-semibold" style={{ color: AMBER }}>
              View pipeline
            </Link>
          </div>
          {timelineItems.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No recent activity.
            </p>
          ) : (
            <ActivityTimeline items={timelineItems} />
          )}
        </CardBox>

        <CardBox>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: SAGE }}>
                Recently joined
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                Latest roster additions
              </p>
            </div>
            <Link href="/admin/members" className="text-xs font-semibold" style={{ color: AMBER }}>
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                    style={{ background: "rgba(194,150,58,0.12)", color: AMBER }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
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
        </CardBox>
      </div>
    </div>
  );
}
