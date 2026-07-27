"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CardBox } from "@/components/dashboard/CardBox";
import { usePersistedState } from "@/lib/admin-store";
import {
  APPLICATIONS_STORAGE_KEY,
  SEED_APPLICATIONS,
  type Application,
  type AppStatus,
} from "@/lib/applications";

/** Re-export seed list for admin overview charts / static imports */
export { SEED_APPLICATIONS as APPLICATIONS, type Application, type AppStatus } from "@/lib/applications";

const AMBER = "#B8892E";
const SAGE = "#4A5E48";

const COLUMNS: { key: AppStatus; title: string; accent: string }[] = [
  { key: "pending", title: "Pending", accent: AMBER },
  { key: "approved", title: "Approved", accent: "#4A7C59" },
  { key: "rejected", title: "Rejected", accent: "#B54B4B" },
];

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const [apps, setApps] = usePersistedState<Application[]>(
    APPLICATIONS_STORAGE_KEY,
    SEED_APPLICATIONS,
  );
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [openId, setOpenId] = useState<number | null>(null);

  function decide(id: number, decision: AppStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: decision } : a)));
    setOpenId(null);
  }

  const q = search.trim().toLowerCase();
  const matchesSearch = (a: Application) =>
    !q ||
    a.name.toLowerCase().includes(q) ||
    a.email.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.credentials.toLowerCase().includes(q);

  const pendingCount = useMemo(
    () => apps.filter((a) => a.status === "pending").length,
    [apps],
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      <CardBox className="!py-4 !px-5 sm:!px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1
              className="text-xl sm:text-2xl leading-tight"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 400,
                color: "var(--color-sage-800)",
              }}
            >
              Applications
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              {pendingCount} pending review
              <span className="hidden sm:inline">
                {" "}
                · submissions from /join appear here automatically
              </span>
            </p>
          </div>
          <div
            className="relative flex items-center gap-2 h-10 rounded-full px-3.5 w-full sm:w-72"
            style={{
              background: "var(--color-cream-100)",
              border: "1px solid rgba(45,59,44,0.1)",
            }}
          >
            <Search className="size-4 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
            <input
              type="search"
              placeholder="Search applicants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              style={{ color: "var(--color-text-primary)" }}
              aria-label="Search applications"
            />
          </div>
        </div>
      </CardBox>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-start w-full min-w-0">
        {COLUMNS.map((col) => {
          const items = apps.filter((a) => a.status === col.key && matchesSearch(a));
          return (
            <div key={col.key} className="flex flex-col gap-3 min-h-0">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: col.accent }} />
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-sage-800)" }}
                  >
                    {col.title}
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold rounded-full px-2 py-0.5 tabular-nums"
                  style={{ background: "rgba(74,94,72,0.1)", color: "var(--color-sage-700)" }}
                >
                  {items.length}
                </span>
              </div>

              <CardBox
                className="!p-2.5 flex flex-col gap-2.5 min-h-[220px]"
                style={{ background: "var(--color-cream-100)" }}
              >
                {items.map((app) => {
                  const open = openId === app.id;
                  return (
                    <div
                      key={app.id}
                      className="rounded-xl bg-white border shadow-sm overflow-hidden"
                      style={{ borderColor: "rgba(45,59,44,0.08)" }}
                    >
                      <button
                        type="button"
                        className="w-full text-left p-3.5 flex flex-col gap-1.5"
                        onClick={() => setOpenId(open ? null : app.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="size-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-white"
                            style={{ background: col.accent }}
                          >
                            {app.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className="text-sm font-semibold truncate"
                                style={{ color: "var(--color-sage-800)" }}
                              >
                                {app.name}
                                <span
                                  className="font-normal"
                                  style={{ color: "var(--color-text-tertiary)" }}
                                >
                                  , {app.credentials}
                                </span>
                              </p>
                              {app.source === "join" && (
                                <span
                                  className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                                  style={{
                                    background: "rgba(184,137,46,0.15)",
                                    color: AMBER,
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>
                              {app.city} · {app.submitted}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {app.specialties.slice(0, 3).map((s) => (
                            <Badge key={s}>{s}</Badge>
                          ))}
                        </div>
                      </button>

                      {open && (
                        <div
                          className="px-3.5 pb-3.5 pt-0 flex flex-col gap-3 border-t"
                          style={{ borderColor: "rgba(45,59,44,0.06)" }}
                        >
                          <p
                            className="text-sm leading-relaxed pt-3 whitespace-pre-wrap"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {app.bio}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                            {app.email}
                            {app.phone ? ` · ${app.phone}` : ""}
                            {` · ${app.licenseNumber} · ${app.format}`}
                            {app.practiceName ? ` · ${app.practiceName}` : ""}
                          </p>

                          {app.status === "pending" ? (
                            <div className="flex gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => decide(app.id, "approved")}
                                className="flex-1 text-xs font-semibold py-2 rounded-full text-white transition-opacity hover:opacity-90"
                                style={{ background: AMBER, color: "#fff" }}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => decide(app.id, "rejected")}
                                className="flex-1 text-xs font-semibold py-2 rounded-full border transition-colors"
                                style={{
                                  borderColor: "rgba(181,75,75,0.4)",
                                  color: "var(--color-error)",
                                  background: "rgba(181,75,75,0.06)",
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => decide(app.id, "pending")}
                              className="text-xs font-semibold py-2 rounded-full border w-full"
                              style={{
                                borderColor: "rgba(45,59,44,0.12)",
                                color: SAGE,
                                background: "var(--color-cream-100)",
                              }}
                            >
                              Move back to pending
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <p
                    className="text-xs text-center py-10 px-2"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {q ? "No matches" : "Nothing here"}
                  </p>
                )}
              </CardBox>
            </div>
          );
        })}
      </div>
    </div>
  );
}
