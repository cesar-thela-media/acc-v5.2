import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Users } from "lucide-react";
import { CardBox } from "@/components/dashboard/CardBox";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { DashboardOverviewPanels } from "@/components/dashboard/DashboardOverviewPanels";
import { DashboardOverviewStats } from "@/components/dashboard/DashboardOverviewStats";
import { hasClerkCredentials } from "@/lib/env";
import { daysFromNow, formatShortDate } from "@/lib/relativeDates";

const AMBER = "#C2963A";
const SAGE = "#4A5E48";

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
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full min-w-0 max-w-full">
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
                  <DashboardGreeting firstName={firstName} />
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

        <DashboardOverviewStats />
      </div>

      {/* Shared demo stores: same events/resources as admin */}
      <DashboardOverviewPanels />

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
