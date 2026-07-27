import { Suspense } from "react";
import { hasRobollyConfig } from "@/lib/env";
import { EventsClient } from "./EventsClient";

export default function EventsPage() {
  return (
    <Suspense fallback={<p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>Loading events…</p>}>
      <EventsClient hasCertificates={hasRobollyConfig} />
    </Suspense>
  );
}
