"use client";

import { Fragment, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/Badge";
import { usePersistedState } from "@/lib/admin-store";

export type Status = "active" | "inactive" | "suspended";

export type Member = {
  id: number;
  name: string;
  credentials: string;
  email: string;
  joined: string;
  joinedSort: string;
  status: Status;
  accepting: boolean;
};

export const ALL_MEMBERS: Member[] = [
  { id: 1, name: "Dr. Maya Okonkwo", credentials: "LCSW", email: "maya@example.com", joined: "Jan 12, 2026", joinedSort: "2026-01-12", status: "active", accepting: true },
  { id: 2, name: "James Whitfield", credentials: "LPC", email: "james@example.com", joined: "Jan 28, 2026", joinedSort: "2026-01-28", status: "active", accepting: false },
  { id: 3, name: "Sofia Reyes", credentials: "LMFT", email: "sofia@example.com", joined: "Feb 5, 2026", joinedSort: "2026-02-05", status: "active", accepting: true },
  { id: 4, name: "Dr. Claire Hutchinson", credentials: "PhD", email: "claire@example.com", joined: "Feb 14, 2026", joinedSort: "2026-02-14", status: "active", accepting: true },
  { id: 5, name: "Marcus Lee", credentials: "LPC", email: "marcus@example.com", joined: "Apr 15, 2026", joinedSort: "2026-04-15", status: "active", accepting: true },
  { id: 6, name: "Priya Nair", credentials: "LCSW", email: "priya@example.com", joined: "Apr 10, 2026", joinedSort: "2026-04-10", status: "active", accepting: false },
  { id: 7, name: "Thomas Garza", credentials: "LMFT", email: "thomas@example.com", joined: "Apr 3, 2026", joinedSort: "2026-04-03", status: "active", accepting: true },
  { id: 8, name: "Rachel Bloom", credentials: "LPC", email: "rachel@example.com", joined: "Mar 20, 2026", joinedSort: "2026-03-20", status: "active", accepting: true },
  { id: 9, name: "Dr. Ade Kolade", credentials: "PsyD", email: "ade@example.com", joined: "Mar 8, 2026", joinedSort: "2026-03-08", status: "inactive", accepting: false },
  { id: 10, name: "Christine Walsh", credentials: "LPC-S", email: "christine@example.com", joined: "Feb 22, 2026", joinedSort: "2026-02-22", status: "suspended", accepting: false },
];

const STATUS_LABELS: Record<Status, string> = { active: "Active", inactive: "Inactive", suspended: "Suspended" };
const STATUS_VARIANTS: Record<Status, "success" | "default" | "error"> = {
  active: "success",
  inactive: "default",
  suspended: "error",
};

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  return (
    <span className="inline-block ml-1 text-xs" style={{ opacity: direction ? 1 : 0.25 }}>
      {direction === "asc" ? "▲" : "▼"}
    </span>
  );
}

const columnHelper = createColumnHelper<Member>();

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "joinedSort", desc: true }]);
  const [statusOverrides, setStatusOverrides] = usePersistedState<Record<number, Status>>("admin-members", {});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function setMemberStatus(id: number, status: Status) {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
  }

  const dataWithLiveStatus = useMemo(
    () => ALL_MEMBERS.map((m) => ({ ...m, status: statusOverrides[m.id] ?? m.status })),
    [statusOverrides]
  );

  const filteredByStatus = useMemo(
    () => (statusFilter === "all" ? dataWithLiveStatus : dataWithLiveStatus.filter((m) => m.status === statusFilter)),
    [dataWithLiveStatus, statusFilter]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name", sortingFn: "alphanumeric" }),
      columnHelper.accessor("email", { header: "Email", enableSorting: false }),
      columnHelper.accessor("joinedSort", { header: "Joined", sortingFn: "alphanumeric" }),
      columnHelper.accessor("status", { header: "Status" }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredByStatus,
    columns,
    state: { sorting, globalFilter: search, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      const m = row.original;
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-eyebrow mb-1">Admin</p>
        <h1 className="text-page-title">Members</h1>
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
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C2963A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(194,150,58,0.20)"; }}
        />
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "inactive", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors"
              style={{
                background: statusFilter === s ? "#C2963A" : "var(--color-cream-100)",
                color: statusFilter === s ? "#fff" : "var(--color-sage-700)",
                border: statusFilter === s ? "none" : "1px solid rgba(194,150,58,0.20)",
              }}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        {total} member{total !== 1 ? "s" : ""}
      </p>

      {/* Mobile cards */}
      {rows.length > 0 && (
        <div className="md:hidden flex flex-col gap-3">
          {rows.map(({ original: m }) => (
            <div key={m.id} className="rounded-2xl border bg-white p-4 flex flex-col gap-4" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0" style={{ background: "rgba(194,150,58,0.10)", color: "#C2963A" }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{m.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{m.credentials}</p>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANTS[m.status]}>{STATUS_LABELS[m.status]}</Badge>
              </div>
              <div className="text-sm flex flex-col gap-1.5">
                <p style={{ color: "var(--color-text-secondary)" }}>{m.email}</p>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Joined {m.joined}</p>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {m.accepting ? "Accepting clients" : "Not accepting clients"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button className="text-xs underline" style={{ color: "#C2963A", textUnderlineOffset: "3px" }} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                  {expandedId === m.id ? "Hide details" : "View"}
                </button>
                {m.status === "active" && (
                  <button className="text-xs underline" style={{ color: "var(--color-error)", textUnderlineOffset: "3px" }} onClick={() => setMemberStatus(m.id, "suspended")}>
                    Suspend
                  </button>
                )}
                {m.status === "suspended" && (
                  <button className="text-xs underline" style={{ color: "var(--color-success)", textUnderlineOffset: "3px" }} onClick={() => setMemberStatus(m.id, "active")}>
                    Reinstate
                  </button>
                )}
              </div>
              {expandedId === m.id && (
                <div className="pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: "rgba(194,150,58,0.10)" }}>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Credentials: {m.credentials}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Email: {m.email}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Member since {m.joined}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                    {m.accepting ? "Currently accepting new clients" : "Not currently accepting new clients"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border overflow-hidden bg-white" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(194,150,58,0.12)", background: "var(--color-cream-100)" }}>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] select-none"
                    style={{ color: "#C2963A", cursor: header.column.getCanSort() ? "pointer" : "default" }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && <SortIcon direction={header.column.getIsSorted()} />}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ original: m }, i) => (
                <Fragment key={m.id}>
                  <tr
                    className="transition-colors duration-150"
                    style={{ borderBottom: expandedId === m.id ? "none" : i < rows.length - 1 ? "1px solid rgba(194,150,58,0.08)" : "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(194,150,58,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0" style={{ background: "rgba(194,150,58,0.10)", color: "#C2963A" }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>{m.name}</p>
                            {m.accepting && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-success)" }} />}
                          </div>
                          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{m.credentials}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>{m.email}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-tertiary)" }}>{m.joined}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_VARIANTS[m.status]}>{STATUS_LABELS[m.status]}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-xs underline" style={{ color: "#C2963A", textUnderlineOffset: "3px" }} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                          {expandedId === m.id ? "Hide" : "View"}
                        </button>
                        {m.status === "active" && (
                          <button className="text-xs underline" style={{ color: "var(--color-error)", textUnderlineOffset: "3px" }} onClick={() => setMemberStatus(m.id, "suspended")}>
                            Suspend
                          </button>
                        )}
                        {m.status === "suspended" && (
                          <button className="text-xs underline" style={{ color: "var(--color-success)", textUnderlineOffset: "3px" }} onClick={() => setMemberStatus(m.id, "active")}>
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === m.id && (
                    <tr style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(194,150,58,0.08)" : "none" }}>
                      <td colSpan={5} className="px-5 pb-4 pt-0 bg-white">
                        <div className="rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-1.5" style={{ background: "var(--color-cream-100)" }}>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Credentials: {m.credentials}</p>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Member since {m.joined}</p>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {m.accepting ? "Currently accepting new clients" : "Not currently accepting new clients"}
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

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Show</p>
            <select
              value={pagination.pageSize}
              onChange={(e) => setPagination(() => ({ pageIndex: 0, pageSize: Number(e.target.value) }))}
              className="text-xs px-2 py-1.5 rounded border"
              style={{ borderColor: "rgba(194,150,58,0.20)", color: "var(--color-text-primary)" }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>per page</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2.5 py-1 rounded text-xs font-medium border disabled:opacity-40"
                style={{ borderColor: "rgba(194,150,58,0.20)", color: "var(--color-sage-700)" }}
              >
                ← Prev
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2.5 py-1 rounded text-xs font-medium border disabled:opacity-40"
                style={{ borderColor: "rgba(194,150,58,0.20)", color: "var(--color-sage-700)" }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-3" style={{ color: "var(--color-text-tertiary)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><circle cx="12" cy="10" r="3"/><path d="M12 13v4"/><path d="M8 17h8"/><circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><path d="M6.5 8.5 9 10"/><path d="M15 10l2.5-1.5"/></svg>
          <p className="text-sm">No members match your filters.</p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="text-xs font-medium underline"
            style={{ color: "#C2963A", textUnderlineOffset: "3px" }}
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
