"use client";

import { Fragment, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Download, EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { daysAgo, formatAbbrevDate } from "@/lib/relativeDates";
import { usePersistedState } from "@/lib/admin-store";

export type AppStatus = "pending" | "approved" | "rejected";

export const APPLICATIONS = [
  {
    id: 1,
    name: "Lauren Park",
    credentials: "LPC",
    email: "lauren@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(1)),
    status: "pending" as AppStatus,
    bio: "I'm a licensed counselor with 4 years of experience specializing in anxiety, perfectionism, and identity work with young adults. I'm looking for a collegial community to support my private practice growth.",
    specialties: ["Anxiety", "Young Adults", "Identity"],
    format: "Telehealth",
    licenseNumber: "LPC-91032",
  },
  {
    id: 2,
    name: "DeShawn Morris",
    credentials: "LCSW",
    email: "deshawn@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(2)),
    status: "pending" as AppStatus,
    bio: "Clinical social worker with 7 years experience, primarily working with men, cultural identity, and workplace stress. Private practice for 2 years.",
    specialties: ["Men", "Cultural Identity", "Workplace"],
    format: "Both",
    licenseNumber: "LCSW-44820",
  },
  {
    id: 3,
    name: "Ingrid Larsson",
    credentials: "LMFT",
    email: "ingrid@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(4)),
    status: "pending" as AppStatus,
    bio: "Marriage and family therapist with a focus on couples and attachment. I've been in private practice for 6 years and am passionate about peer consultation.",
    specialties: ["Couples", "Attachment", "Family"],
    format: "In-person",
    licenseNumber: "LMFT-77391",
  },
  {
    id: 4,
    name: "Tamara Wells",
    credentials: "LPC",
    email: "tamara@example.com",
    city: "Austin, TX",
    submitted: formatAbbrevDate(daysAgo(11)),
    status: "approved" as AppStatus,
    bio: "LPC specializing in perinatal mental health and postpartum support.",
    specialties: ["Perinatal", "Postpartum", "Women"],
    format: "Telehealth",
    licenseNumber: "LPC-60812",
  },
  {
    id: 5,
    name: "Ryan Calloway",
    credentials: "LPC",
    email: "ryan@example.com",
    city: "Houston, TX",
    submitted: formatAbbrevDate(daysAgo(13)),
    status: "rejected" as AppStatus,
    bio: "Counselor based in Houston, applied but does not meet Austin-area requirement.",
    specialties: ["Depression", "CBT"],
    format: "Telehealth",
    licenseNumber: "LPC-55144",
  },
];

type Application = (typeof APPLICATIONS)[number];

const STATUS_VARIANTS: Record<AppStatus, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const AMBER = "#C2963A";

function exportCSV(rows: Application[]) {
  const headers = ["Name", "Credentials", "Email", "City", "Submitted", "Status", "Specialties"];
  const csvRows = rows.map((a) =>
    [a.name, a.credentials, a.email, a.city, a.submitted, a.status, a.specialties.join("; ")]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "applications.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const columnHelper = createColumnHelper<Application>();

export default function AdminApplicationsPage() {
  const [statuses, setStatuses] = usePersistedState<Record<number, AppStatus>>(
    "admin-applications",
    Object.fromEntries(APPLICATIONS.map((a) => [a.id, a.status]))
  );
  const [filter, setFilter] = useState<"all" | AppStatus>("pending");
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function decide(id: number, decision: AppStatus) {
    setStatuses((prev) => ({ ...prev, [id]: decision }));
  }

  const dataWithLiveStatus = useMemo(
    () => APPLICATIONS.map((a) => ({ ...a, status: statuses[a.id] })),
    [statuses]
  );

  const filtered = useMemo(
    () => dataWithLiveStatus.filter((a) => filter === "all" || a.status === filter),
    [dataWithLiveStatus, filter]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
            className="data-checked:bg-[#4A5E48] data-checked:border-[#4A5E48]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(checked)}
            className="data-checked:bg-[#4A5E48] data-checked:border-[#4A5E48]"
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "Applicant",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
              style={{ background: "rgba(194,150,58,0.10)", color: AMBER }}
            >
              {row.original.name.charAt(0)}
            </div>
            <div>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}
              >
                {row.original.name}, {row.original.credentials}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{row.original.email}</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("city", { header: "City" }),
      columnHelper.accessor("submitted", { header: "Submitted" }),
      columnHelper.accessor("specialties", {
        header: "Specialties",
        cell: ({ getValue }) => (
          <div className="flex flex-wrap gap-1.5">
            {getValue().map((s) => <Badge key={s}>{s}</Badge>)}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          return <Badge variant={STATUS_VARIANTS[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          const app = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none">
                <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                  {expandedId === app.id ? "Hide statement" : "View statement"}
                </DropdownMenuItem>
                {app.status === "pending" ? (
                  <>
                    <DropdownMenuItem onClick={() => decide(app.id, "approved")}>Approve</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => decide(app.id, "rejected")}>Reject</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => decide(app.id, app.status === "approved" ? "rejected" : "approved")}>
                    Undo: mark {app.status === "approved" ? "rejected" : "approved"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [expandedId]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { rowSelection, globalFilter: search },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    getRowId: (row) => String(row.id),
    globalFilterFn: (row, _columnId, value) => {
      const q = String(value).toLowerCase();
      const a = row.original;
      return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  function handleBulkDecision(decision: AppStatus) {
    const ids = selectedRows.map((r) => r.original.id);
    setStatuses((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = decision; });
      return next;
    });
    setRowSelection({});
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-eyebrow mb-1">Admin</p>
        <h1 className="text-page-title">Applications</h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border outline-none transition-colors"
          style={{ borderColor: "rgba(194,150,58,0.20)", background: "#fff", color: "var(--color-text-primary)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = AMBER; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(194,150,58,0.20)"; }}
        />
        <div className="flex gap-2 flex-wrap">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => {
            const count = f === "all" ? dataWithLiveStatus.length : dataWithLiveStatus.filter((a) => a.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors"
                style={{
                  background: filter === f ? AMBER : "var(--color-cream-100)",
                  color: filter === f ? "#fff" : "var(--color-sage-700)",
                  border: filter === f ? "none" : "1px solid rgba(194,150,58,0.20)",
                }}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk action bar — only appears once rows are selected */}
      {selectedRows.length > 0 ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(194,150,58,0.08)", border: "1px solid rgba(194,150,58,0.20)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-sage-800)" }}>
            {selectedRows.length} selected
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => handleBulkDecision("approved")}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90"
              style={{ background: AMBER, color: "#fff" }}
            >
              Approve selected
            </button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkDecision("rejected")}>
              Reject selected
            </Button>
            <button
              onClick={() => exportCSV(selectedRows.map((r) => r.original))}
              className="inline-flex items-center gap-1.5 text-xs font-medium underline"
              style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
            >
              <Download size={13} /> Export CSV
            </button>
            <button
              onClick={() => setRowSelection({})}
              className="text-xs underline"
              style={{ color: "var(--color-text-tertiary)", textUnderlineOffset: "3px" }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        rows.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => exportCSV(filtered)}
              className="inline-flex items-center gap-1.5 text-xs font-medium underline"
              style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        )
      )}

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {rows.map(({ original: app }) => (
          <div key={app.id} className="bg-white rounded-2xl border p-4 flex flex-col gap-3" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ background: "rgba(194,150,58,0.10)", color: AMBER }}
                >
                  {app.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "var(--color-sage-800)" }}
                  >
                    {app.name}, {app.credentials}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>{app.email} · {app.city}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none shrink-0">
                  <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                    {expandedId === app.id ? "Hide statement" : "View statement"}
                  </DropdownMenuItem>
                  {app.status === "pending" ? (
                    <>
                      <DropdownMenuItem onClick={() => decide(app.id, "approved")}>Approve</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => decide(app.id, "rejected")}>Reject</DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => decide(app.id, app.status === "approved" ? "rejected" : "approved")}>
                      Undo: mark {app.status === "approved" ? "rejected" : "approved"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={STATUS_VARIANTS[app.status]}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
              <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Submitted {app.submitted}</span>
            </div>
            {expandedId === app.id && (
              <div className="pt-3 border-t flex flex-col gap-3" style={{ borderColor: "rgba(194,150,58,0.10)" }}>
                <div className="flex flex-wrap gap-1.5">
                  {app.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{app.bio}</p>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{app.credentials} · {app.licenseNumber} · {app.format}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border overflow-hidden bg-white" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(194,150,58,0.12)", background: "var(--color-cream-100)" }}>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: AMBER }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className="transition-colors duration-150"
                    style={{
                      background: row.getIsSelected() ? "rgba(194,150,58,0.05)" : undefined,
                      borderBottom: "1px solid rgba(194,150,58,0.08)",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3.5 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {expandedId === row.original.id && (
                    <tr style={{ borderBottom: "1px solid rgba(194,150,58,0.08)" }}>
                      <td colSpan={row.getVisibleCells().length} className="px-5 pb-5 pt-0 bg-white">
                        <div className="rounded-xl p-4" style={{ background: "var(--color-cream-100)" }}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: AMBER }}>
                            Statement
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{row.original.bio}</p>
                          <p className="text-xs mt-3" style={{ color: "var(--color-text-tertiary)" }}>
                            {row.original.credentials} · {row.original.licenseNumber} · {row.original.format}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rows.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-3" style={{ color: "var(--color-text-tertiary)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>
          <p className="text-sm">No applications match your filters.</p>
          <button
            onClick={() => { setFilter("pending"); setSearch(""); }}
            className="text-xs font-medium underline"
            style={{ color: AMBER, textUnderlineOffset: "3px" }}
          >
            View pending applications
          </button>
        </div>
      )}
    </div>
  );
}
