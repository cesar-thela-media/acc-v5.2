import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { CalendarDays, BookOpen, Folder, CreditCard, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { hasClerkCredentials } from "@/lib/env";
import { daysFromNow, formatShortDate, formatShortWeekdayDate, nextFirstWeekdayOfMonth } from "@/lib/relativeDates";

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

const quickLinks = [
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
  { href: "/dashboard/files", label: "Files", icon: Folder },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
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

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome band — text only (no portrait image) */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-8"
        style={{ background: SAGE }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(194,150,58,0.28) 0%, transparent 55%)",
          }}
        />
        <div className="relative min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: AMBER }}>
            The Circle
          </p>
          <h1
            className="text-2xl sm:text-3xl leading-tight"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "#fff",
            }}
          >
            Welcome back, {firstName}.
          </h1>
        </div>
      </section>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(45,59,44,0.08)" }}
          >
            <span
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(45,59,44,0.06)", color: SAGE }}
            >
              <item.icon className="size-4.5" />
            </span>
            <span className="text-sm font-medium" style={{ color: SAGE }}>
              {item.label}
            </span>
            <ArrowUpRight className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-50" style={{ color: SAGE }} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="rounded-2xl border-0 shadow-sm gap-0 py-0 overflow-hidden" style={{ background: "#fff" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold" style={{ color: SAGE }}>
              Upcoming events
            </h2>
            <Link href="/dashboard/events" className="text-xs font-medium" style={{ color: AMBER }}>
              View all
            </Link>
          </div>
          <Separator />
          <CardContent className="px-5 py-4 flex flex-col gap-4">
            {upcomingEvents.map((ev) => (
              <div key={ev.title} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {ev.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {ev.date}
                  </p>
                </div>
                {ev.rsvp ? (
                  <Badge className="bg-[rgba(74,124,89,0.12)] text-[var(--color-success)] border-0">
                    RSVP&apos;d
                  </Badge>
                ) : (
                  <Link href="/dashboard/events">
                    <Badge variant="outline" className="border-[rgba(194,150,58,0.35)] text-[var(--color-sage-700)]">
                      RSVP
                    </Badge>
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm gap-0 py-0 overflow-hidden" style={{ background: "#fff" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold" style={{ color: SAGE }}>
              New resources
            </h2>
            <Link href="/dashboard/resources" className="text-xs font-medium" style={{ color: AMBER }}>
              View all
            </Link>
          </div>
          <Separator />
          <CardContent className="px-5 py-4 flex flex-col gap-4">
            {recentResources.map((r) => (
              <div key={r.title} className="flex items-center justify-between gap-3">
                <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {r.title}
                </p>
                <Badge variant="secondary" className="font-normal">
                  {r.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card
        className="rounded-2xl border-0 shadow-sm py-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F7F4EC 0%, #EDE8DC 100%)" }}
      >
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-5">
          <div>
            <p className="text-sm font-semibold" style={{ color: SAGE }}>
              Membership active
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              $79/mo · Renews {formatShortDate(daysFromNow(18))}
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-xs font-semibold inline-flex items-center gap-1"
            style={{ color: AMBER }}
          >
            Billing
            <ArrowUpRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
