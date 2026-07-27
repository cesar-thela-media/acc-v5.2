"use client";

import { CalendarDays, BookOpen, Folder, CreditCard } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePersistedState } from "@/lib/admin-store";
import { DEMO_EVENTS_KEY, SEED_DEMO_EVENTS, type DemoEvent } from "@/lib/demo-events";
import {
  DEMO_RESOURCES_KEY,
  SEED_DEMO_RESOURCES,
  type DemoResource,
} from "@/lib/demo-resources";
import { daysFromNow, formatShortDate } from "@/lib/relativeDates";

export function DashboardOverviewStats() {
  const [events] = usePersistedState<DemoEvent[]>(DEMO_EVENTS_KEY, SEED_DEMO_EVENTS);
  const [resources] = usePersistedState<DemoResource[]>(
    DEMO_RESOURCES_KEY,
    SEED_DEMO_RESOURCES,
  );

  return (
    <div className="xl:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
      <StatCard
        title="Events this month"
        value={events.length}
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
        value={resources.length}
        hint="In the library"
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
  );
}
