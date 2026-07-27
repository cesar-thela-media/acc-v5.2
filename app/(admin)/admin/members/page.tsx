"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { EllipsisVertical, Search } from "lucide-react";
import { CardBox } from "@/components/dashboard/CardBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { usePersistedState } from "@/lib/admin-store";

import {
  DEMO_MEMBERS_KEY,
  SEED_DEMO_MEMBERS,
  type DemoMember,
  type DemoMemberStatus,
} from "@/lib/demo-members";

export type Status = DemoMemberStatus;
export type Member = DemoMember;
/** Seed roster for overview charts */
export const ALL_MEMBERS = SEED_DEMO_MEMBERS;

const STATUS_LABELS: Record<Status, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

/** Template-style solid status pills (Space basic table) with ACC colors */
function StatusPill({ status }: { status: Status }) {
  const styles: Record<Status, { bg: string; color: string }> = {
    active: { bg: "#2D3B2C", color: "#fff" },
    inactive: { bg: "rgba(45,59,44,0.12)", color: "#3D4F3B" },
    suspended: { bg: "#B54B4B", color: "#fff" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

const AVATAR_COLORS = [
  "#4A5E48",
  "#B8892E",
  "#4A7C59",
  "#6B8A69",
  "#9A7426",
  "#3D4F3B",
  "#B8892E",
  "#5A7A58",
];

function MemberAvatar({ name, id }: { name: string; id: number }) {
  const bg = AVATAR_COLORS[id % AVATAR_COLORS.length];
  const initial = name.replace(/^Dr\.\s*/i, "").charAt(0).toUpperCase();
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-white"
      style={{ background: bg }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

const columnHelper = createColumnHelper<Member>();

export default function AdminMembersPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "joinedSort", desc: true }]);
  const [members, setMembers] = usePersistedState<Member[]>(
    DEMO_MEMBERS_KEY,
    SEED_DEMO_MEMBERS,
  );
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  function setMemberStatus(id: number, status: Status) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  const filteredByStatus = useMemo(
    () =>
      statusFilter === "all"
        ? members
        : members.filter((m) => m.status === statusFilter),
    [members, statusFilter],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Member", sortingFn: "alphanumeric" }),
      columnHelper.accessor("email", { header: "Email", enableSorting: false }),
      columnHelper.accessor("credentials", { header: "License", enableSorting: false }),
      columnHelper.accessor("status", { header: "Status" }),
      columnHelper.accessor("joinedSort", { header: "Joined", sortingFn: "alphanumeric" }),
    ],
    [],
  );

  const table = useReactTable({
    data: filteredByStatus as Member[],
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
    <div className="flex flex-col gap-5 w-full">
      {/* Template page title bar */}
      <CardBox className="!py-4 !px-5 sm:!px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1
            className="text-xl sm:text-2xl leading-tight"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "var(--color-sage-800)",
            }}
          >
            Members
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Admin</span>
            <span className="mx-1.5">/</span>
            Members
          </p>
        </div>
      </CardBox>

      {/* Basic table card — Space shadcn-tables/basic layout */}
      <CardBox className="!p-0 overflow-hidden" padding={false}>
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-b"
          style={{ borderColor: "rgba(45,59,44,0.08)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
              Member roster
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              {total} member{total !== 1 ? "s" : ""}
              {statusFilter !== "all" ? ` · ${STATUS_LABELS[statusFilter]}` : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div
              className="relative flex items-center gap-2 h-9 rounded-lg px-3 min-w-[200px]"
              style={{
                background: "var(--color-cream-100)",
                border: "1px solid rgba(45,59,44,0.1)",
              }}
            >
              <Search className="size-3.5 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
              <input
                type="search"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                style={{ color: "var(--color-text-primary)" }}
                aria-label="Search members"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "active", "inactive", "suspended"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-medium capitalize transition-colors"
                  style={{
                    background: statusFilter === s ? "#2D3B2C" : "var(--color-cream-100)",
                    color: statusFilter === s ? "#fff" : "var(--color-sage-700)",
                    border:
                      statusFilter === s ? "none" : "1px solid rgba(45,59,44,0.1)",
                  }}
                >
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile list */}
        <div className="md:hidden divide-y" style={{ borderColor: "rgba(45,59,44,0.08)" }}>
          {rows.map(({ original: m }) => (
            <div key={m.id} className="px-5 py-4 flex items-start gap-3">
              <MemberAvatar name={m.name} id={m.id} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {m.name}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {m.credentials} · {m.email}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StatusPill status={m.status} />
                  <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                    {m.joined}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-black/5 outline-none">
                  <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {m.status === "active" && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setMemberStatus(m.id, "suspended")}
                    >
                      Suspend
                    </DropdownMenuItem>
                  )}
                  {m.status === "suspended" && (
                    <DropdownMenuItem onClick={() => setMemberStatus(m.id, "active")}>
                      Reinstate
                    </DropdownMenuItem>
                  )}
                  {m.status === "inactive" && (
                    <DropdownMenuItem onClick={() => setMemberStatus(m.id, "active")}>
                      Mark active
                    </DropdownMenuItem>
                  )}
                  {m.status === "active" && (
                    <DropdownMenuItem onClick={() => setMemberStatus(m.id, "inactive")}>
                      Mark inactive
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-12 text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No members match your filters.
            </p>
          )}
        </div>

        {/* Desktop table — Space basic table pattern */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow
                className="hover:bg-transparent border-b"
                style={{ borderColor: "rgba(45,59,44,0.08)" }}
              >
                <TableHead
                  className="h-12 px-6 font-medium normal-case tracking-normal text-[13px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Member
                </TableHead>
                <TableHead
                  className="h-12 px-4 font-medium normal-case tracking-normal text-[13px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Email
                </TableHead>
                <TableHead
                  className="h-12 px-4 font-medium normal-case tracking-normal text-[13px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Clients
                </TableHead>
                <TableHead
                  className="h-12 px-4 font-medium normal-case tracking-normal text-[13px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Status
                </TableHead>
                <TableHead
                  className="h-12 px-4 font-medium normal-case tracking-normal text-[13px] cursor-pointer select-none"
                  style={{ color: "var(--color-text-secondary)" }}
                  onClick={() =>
                    setSorting((prev) => {
                      const cur = prev[0];
                      if (cur?.id === "joinedSort") {
                        return [{ id: "joinedSort", desc: !cur.desc }];
                      }
                      return [{ id: "joinedSort", desc: true }];
                    })
                  }
                >
                  Joined
                </TableHead>
                <TableHead className="h-12 w-12 px-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ original: m }) => (
                <TableRow
                  key={m.id}
                  className="border-b last:border-0"
                  style={{ borderColor: "rgba(45,59,44,0.06)" }}
                >
                  {/* User column: avatar + name + role */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <MemberAvatar name={m.name} id={m.id} />
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {m.name}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>
                          {m.credentials}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4" style={{ color: "var(--color-text-secondary)" }}>
                    {m.email}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center -space-x-1.5">
                      {m.accepting ? (
                        <span
                          className="inline-flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
                          style={{ background: "#4A7C59" }}
                          title="Accepting clients"
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          className="inline-flex size-7 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white"
                          style={{ background: "var(--color-cream-300)", color: "var(--color-text-tertiary)" }}
                          title="Not accepting"
                        >
                          —
                        </span>
                      )}
                      <span
                        className="inline-flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white"
                        style={{ background: "#B8892E", color: "#1A1A1A" }}
                        title={m.credentials}
                      >
                        {m.credentials.slice(0, 1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <StatusPill status={m.status} />
                  </TableCell>
                  <TableCell
                    className="px-4 py-4 tabular-nums"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {m.joined}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-black/5 outline-none inline-flex">
                        <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {m.status === "active" && (
                          <>
                            <DropdownMenuItem onClick={() => setMemberStatus(m.id, "inactive")}>
                              Mark inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setMemberStatus(m.id, "suspended")}
                            >
                              Suspend
                            </DropdownMenuItem>
                          </>
                        )}
                        {m.status === "suspended" && (
                          <DropdownMenuItem onClick={() => setMemberStatus(m.id, "active")}>
                            Reinstate
                          </DropdownMenuItem>
                        )}
                        {m.status === "inactive" && (
                          <DropdownMenuItem onClick={() => setMemberStatus(m.id, "active")}>
                            Mark active
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                      No members match your filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("all");
                      }}
                      className="text-xs font-medium underline mt-2"
                      style={{ color: "#2D3B2C", textUnderlineOffset: "3px" }}
                    >
                      Reset filters
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        {total > 0 && (
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-3.5 border-t"
            style={{ borderColor: "rgba(45,59,44,0.08)", background: "var(--color-cream-100)" }}
          >
            <div className="flex items-center gap-2">
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                Show
              </p>
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  setPagination(() => ({ pageIndex: 0, pageSize: Number(e.target.value) }))
                }
                className="text-xs px-2 py-1.5 rounded-md border bg-white"
                style={{ borderColor: "rgba(45,59,44,0.12)", color: "var(--color-text-primary)" }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                per page
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {Math.max(table.getPageCount(), 1)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border bg-white disabled:opacity-40"
                  style={{ borderColor: "rgba(45,59,44,0.12)", color: "var(--color-sage-800)" }}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-white disabled:opacity-40"
                  style={{ background: "#2D3B2C" }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </CardBox>
    </div>
  );
}
