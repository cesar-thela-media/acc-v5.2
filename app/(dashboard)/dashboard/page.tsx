import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  CalendarDays,
  BookOpen,
  Folder,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  Users,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { CardBox } from "@/components/dashboard/CardBox";
import { StatCard } from "@/components/dashboard/StatCard";
import { hasClerkCredentials } from "@/lib/env";
import {
  daysFromNow,
  formatShortDate,
  formatShortWeekdayDate,
  nextFirstWeekdayOfMonth,
} from "@/lib/relativeDates";

const THURSDAY = 4;
const AMBER = "#C2963A";
const SAGE = "#4A5E48";

const upcomingEvents = [
  {
    title: "Monthly case consultation",
    date: `${formatShortWeekdayDate(nextFirstWeekdayOfMonth(THURSDAY, 0))} · 9:00–10:30am`,
    rsvp: true,
  },
  {
    title: "Practice building workshop",
    date: `${formatShortWeekdayDate(daysFromNow(22))} · 12:00–1:00pm`,
    rsvp: false,
  },
  {
    title: "Trauma-informed care CEU",
    date: `${formatShortWeekdayDate(daysFromNow(31))} · 10:00am–12:00pm`,
    rsvp: false,
  },
];

const recentResources = [
  { title: "CBT Session Planning Template", category: "Clinical" },
  { title: "Fee Setting for Private Practice", category: "Business" },
  { title: "Psychoeducation: Anxiety Handout", category: "Handouts" },
];

export default async function DashboardPage() {
  let firstName = "there";
  if (hasClerkCredentials) {
    const user = await currentUser();
    if (user?.firstName) firstName = user.firstName;
  } else {
    const jar = await cookies();
    const demoCookieName = jar.get("acc_demo_name")?.value;
    if (demoCookieName) {
      firstName = demoCookieName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "").split(" ")[0];
    }
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full min-w-0 max-w-full">
      {/* Template-style hero banner (ACC sage) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 w-full min-w-0">
        <div className="xl:col-span-7 min-w-0">
          <CardBox
            className="relative overflow-hidden h-full !p-0 min-w-0"
            style={{ background: SAGE, border: "none" }}
            padding={false}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 90% at 100% 0%, rgba(194,150,58,0.32) 0%, transparent 55%)",
              }}
            />
            <div className="relative px-6 py-7 sm:px-8 sm:py-9 flex flex-col gap-5 justify-between min-h-[180px]">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-2"
                  style={{ color: AMBER }}
                >
                  Austin Clinician Circle
                </p>
                <h1
                  className="text-2xl sm:text-3xl leading-tight"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontWeight: 400,
                    color: "#fff",
                  }}
                >
                  {greeting}, {firstName}.
                </h1>
                <p className="text-sm mt-2 max-w-md" style={{ color: "rgba(255,255,255,0.68)" }}>
                  Your membership hub for consultation, resources, CEUs, and billing.
                </p>
              </div>
              <Link
                href="/dashboard/events"
                className="inline-flex items-center gap-2 w-fit rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: AMBER, color: "#fff" }}
              >
                View upcoming events
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </CardBox>
        </div>

        <div className="xl:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
          <StatCard
            title="Events this month"
            value={upcomingEvents.length}
            hint="Consultation + CEU"
            icon={CalendarDays}
            href="/dashboard/events"
            accent="sage"
          />
          <StatCard
            title="Membership"
            value="$79"
            hint={`Renews ${formatShortDate(daysFromNow(18))}`}
            icon={CreditCard}
            href="/dashboard/billing"
            accent="amber"
          />
          <StatCard
            title="Resources"
            value={recentResources.length}
            hint="Recently added"
            icon={BookOpen}
            href="/dashboard/resources"
            accent="sage"
          />
          <StatCard
            title="Certificates"
            value="Files"
            hint="CEU downloads"
            icon={Folder}
            href="/dashboard/files"
            accent="success"
          />
        </div>
      </div>

      {/* Two-column content cards (template analytics layout) */}
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
          <Separator style={{ background: "rgba(45,59,44,0.08)" }} />
          <div className="px-5 py-4 flex flex-col gap-4">
            {upcomingEvents.map((ev) => (
              <div key={ev.title} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {ev.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {ev.date}
                  </p>
                </div>
                {ev.rsvp ? (
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
            <Link
              href="/dashboard/resources"
              className="text-xs font-semibold"
              style={{ color: AMBER }}
            >
              View all
            </Link>
          </div>
          <Separator style={{ background: "rgba(45,59,44,0.08)" }} />
          <div className="px-5 py-4 flex flex-col gap-4">
            {recentResources.map((r) => (
              <div key={r.title} className="flex items-center justify-between gap-3">
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

      {/* Membership strip */}
      <CardBox
        className="!py-5"
        style={{
          background: "linear-gradient(135deg, #F7F4EC 0%, #EDE8DC 100%)",
          borderColor: "rgba(194,150,58,0.2)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl"
              style={{ background: "rgba(194,150,58,0.18)", color: AMBER }}
            >
              <Users className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: SAGE }}>
                Membership active
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                $79/mo · Renews {formatShortDate(daysFromNow(18))}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-xs font-semibold inline-flex items-center gap-1"
            style={{ color: AMBER }}
          >
            Manage billing
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </CardBox>
    </div>
  );
}
