"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/shadcn/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/shadcn/empty";
import { EVENTS } from "@/lib/events";
import { downloadDemoCertificate } from "@/lib/demoDownload";
import { Download, FileText, Info } from "lucide-react";

export function FilesClient({
  hasCertificates,
  memberName = "Member",
}: {
  hasCertificates: boolean;
  memberName?: string;
}) {
  const ceuEvents = EVENTS.filter((ev) => ev.ceus);
  const [busyId, setBusyId] = useState<number | null>(null);

  function handleDemoDownload(ev: (typeof EVENTS)[number]) {
    setBusyId(ev.id);
    downloadDemoCertificate({
      memberName,
      workshop: ev.title,
      ceus: ev.ceus ?? 0,
      date: ev.date,
    });
    setTimeout(() => setBusyId(null), 400);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
      <PageHeader
        eyebrow="Files"
        title="CEU certificates"
        description="Download attendance certificates for CEU-eligible sessions."
      />

      {!hasCertificates && (
        <Alert variant="amber">
          <Info />
          <AlertTitle>Demo certificates</AlertTitle>
          <AlertDescription>
            Official Robolly templates aren&apos;t configured. You can still download a
            demo attendance certificate for each CEU session below.
          </AlertDescription>
        </Alert>
      )}

      {ceuEvents.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No CEU sessions yet</EmptyTitle>
            <EmptyDescription>
              Certificates show up after you RSVP to CEU-eligible events.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          {ceuEvents.map((ev) => (
            <CardBox
              key={ev.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(74,94,72,0.1)", color: "var(--color-sage-600)" }}
                >
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold break-words" style={{ color: "var(--color-sage-800)" }}>
                    {ev.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Badge variant="success">
                      {ev.ceus} CEU{ev.ceus !== 1 ? "s" : ""}
                    </Badge>
                    <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      {ev.date}
                    </span>
                  </div>
                </div>
              </div>
              {hasCertificates ? (
                <a
                  href={`/api/certificate?workshop=${encodeURIComponent(ev.title)}&ceus=${ev.ceus}`}
                  className={`sm:shrink-0 inline-flex items-center justify-center gap-1.5 ${buttonClasses("secondary", "sm")}`}
                >
                  <Download className="size-3.5" />
                  Download
                </a>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="sm:shrink-0"
                  disabled={busyId === ev.id}
                  onClick={() => handleDemoDownload(ev)}
                >
                  <Download className="size-3.5" />
                  {busyId === ev.id ? "Preparing…" : "Download demo"}
                </Button>
              )}
            </CardBox>
          ))}
        </div>
      )}
    </div>
  );
}
