"use client";

import { useRef, useState } from "react";
import { EllipsisVertical, FileText, BookOpen, ClipboardList, PlayCircle, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { usePersistedState } from "@/lib/admin-store";
import { downloadResourcePacket } from "@/lib/demoDownload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

const CATEGORIES = ["All", "Clinical Tools", "Handouts", "Business", "Self-Care"];
const RESOURCE_TYPES = ["PDF", "Guide", "Worksheet", "Video"];

const TYPE_ICONS: Record<string, LucideIcon> = {
  PDF: FileText,
  Guide: BookOpen,
  Worksheet: ClipboardList,
  Video: PlayCircle,
};

type SortKey = "title" | "category" | "type" | "published" | "downloads";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="inline-block ml-1 text-xs" style={{ opacity: active ? 1 : 0.25 }}>
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

export const RESOURCES = [
  { id: 1, title: "CBT Session Planning Template", category: "Clinical Tools", type: "PDF", published: "Apr 18, 2026", publishedSort: "2026-04-18", downloads: 14 },
  { id: 2, title: "Psychoeducation: Anxiety Handout", category: "Handouts", type: "PDF", published: "Apr 15, 2026", publishedSort: "2026-04-15", downloads: 22 },
  { id: 3, title: "Fee Setting for Private Practice", category: "Business", type: "Guide", published: "Apr 10, 2026", publishedSort: "2026-04-10", downloads: 19 },
  { id: 4, title: "Attachment Styles Explainer", category: "Handouts", type: "PDF", published: "Apr 8, 2026", publishedSort: "2026-04-08", downloads: 31 },
  { id: 5, title: "EMDR Phase Protocol Checklist", category: "Clinical Tools", type: "PDF", published: "Apr 3, 2026", publishedSort: "2026-04-03", downloads: 17 },
  { id: 6, title: "Marketing for Therapists: Getting Started", category: "Business", type: "Guide", published: "Mar 28, 2026", publishedSort: "2026-03-28", downloads: 25 },
  { id: 7, title: "Burnout Self-Assessment", category: "Self-Care", type: "Worksheet", published: "Mar 22, 2026", publishedSort: "2026-03-22", downloads: 38 },
  { id: 8, title: "Trauma-Informed Care Intro", category: "Clinical Tools", type: "Video", published: "Feb 28, 2026", publishedSort: "2026-02-28", downloads: 42 },
];

type ResourceRow = (typeof RESOURCES)[number];

export default function AdminResourcesPage() {
  const [resources, setResources] = usePersistedState("admin-resources", RESOURCES);
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Clinical Tools");
  const [formType, setFormType] = useState("PDF");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("published");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" ? "asc" : "desc");
    }
  }

  function resetForm() {
    setEditId(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("Clinical Tools");
    setFormType("PDF");
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(r: ResourceRow) {
    setEditId(r.id);
    setFormTitle(r.title);
    setFormDescription(`${r.type} · ${r.category}`);
    setFormCategory(r.category);
    setFormType(r.type);
    setFileName(null);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setResources((prev) => prev.filter((r) => r.id !== id));
    if (editId === id) {
      setShowForm(false);
      resetForm();
    }
  }

  const filtered = resources.filter((r) => category === "All" || r.category === category);
  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "title") return mul * a.title.localeCompare(b.title);
    if (sortKey === "category") return mul * a.category.localeCompare(b.category);
    if (sortKey === "type") return mul * a.type.localeCompare(b.type);
    if (sortKey === "downloads") return mul * (a.downloads - b.downloads);
    return mul * a.publishedSort.localeCompare(b.publishedSort);
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = formTitle.trim() || "Untitled resource";
    const today = new Date();
    if (editId != null) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editId
            ? { ...r, title, category: formCategory, type: formType }
            : r,
        ),
      );
    } else {
      setResources((prev) => [
        {
          id: Math.max(0, ...prev.map((r) => r.id)) + 1,
          title,
          category: formCategory,
          type: formType,
          published: today.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          publishedSort: today.toISOString().slice(0, 10),
          downloads: 0,
        },
        ...prev,
      ]);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      resetForm();
    }, 800);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
      <PageHeader
        eyebrow="Admin"
        title="Resources"
        description="Publish clinical tools, handouts, and guides for members."
        action={
          <button
            type="button"
            onClick={() => (showForm ? (setShowForm(false), resetForm()) : openCreate())}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90 w-full sm:w-auto"
            style={{ background: "#B8892E", color: "#fff" }}
          >
            {showForm ? "Cancel" : "+ Upload resource"}
          </button>
        }
      />

      {/* Upload / edit form */}
      {showForm && (
        <CardBox className="flex flex-col gap-5">
          <h2
            className="text-base"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "var(--color-sage-800)",
            }}
          >
            {editId != null ? "Edit resource" : "Upload new resource"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              name="title"
              placeholder="Resource title"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <Textarea
              label="Description"
              name="description"
              rows={3}
              placeholder="Brief description shown to members"
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormCategory(c)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background: formCategory === c ? "#B8892E" : "#fff",
                        color: formCategory === c ? "#fff" : "var(--color-sage-700)",
                        border: `1px solid ${formCategory === c ? "#B8892E" : "rgba(45,59,44,0.12)"}`,
                      }}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Type</label>
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background: formType === t ? "#B8892E" : "#fff",
                        color: formType === t ? "#fff" : "var(--color-sage-700)",
                        border: `1px solid ${formType === t ? "#B8892E" : "rgba(45,59,44,0.12)"}`,
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.mp4,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFileName(f ? f.name : null);
                  if (f && !formTitle.trim()) {
                    setFormTitle(f.name.replace(/\.[^.]+$/, ""));
                  }
                }}
              />
              <div
                className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:bg-[rgba(255,185,0,0.04)]"
                style={{ borderColor: "rgba(194,150,58,0.25)" }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
                role="button"
                tabIndex={0}
              >
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  {fileName ? (
                    <>
                      Selected: <strong style={{ color: "var(--color-sage-800)" }}>{fileName}</strong>
                      {" · "}
                      <span className="underline" style={{ color: "#9A7426" }}>change</span>
                    </>
                  ) : (
                    <>
                      Drag & drop a file or{" "}
                      <span className="underline" style={{ color: "#9A7426" }}>
                        browse
                      </span>
                    </>
                  )}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                  PDF, DOC, MP4 · 50MB max · demo stores metadata only
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "#B8892E", color: "#fff" }}
              >
                {submitted ? "Saving…" : editId != null ? "Save changes" : "Publish resource"}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBox>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
            style={{
              background: category === c ? "#B8892E" : "var(--color-cream-100)",
              color: category === c ? "#fff" : "var(--color-sage-700)",
              border: category === c ? "none" : "1px solid rgba(45,59,44,0.12)",
            }}
          >{c}</button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {sorted.map((r) => {
          const TypeIcon = TYPE_ICONS[r.type] ?? FileText;
          return (
            <div
              key={r.id}
              className="rounded-2xl border bg-white p-4 flex flex-col gap-3"
              style={{ borderColor: "rgba(194,150,58,0.12)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(194,150,58,0.10)", color: "#B8892E" }}
                  >
                    <TypeIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{r.title}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>{r.published}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge>{r.category}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none">
                      <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(r)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          downloadResourcePacket({
                            title: r.title,
                            category: r.category,
                            type: r.type,
                            description: `${r.type} resource published ${r.published}.`,
                            date: r.published,
                          })
                        }
                      >
                        Download preview
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(r.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                <span>{r.type}</span>
                <span>•</span>
                <span>{r.downloads} downloads</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-3" style={{ color: "var(--color-text-tertiary)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p className="text-sm">No resources match this category yet.</p>
          <button
            onClick={() => setCategory("All")}
            className="text-xs font-medium underline"
            style={{ color: "#B8892E", textUnderlineOffset: "3px" }}
          >
            View all categories
          </button>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border overflow-hidden bg-white" style={{ borderColor: "rgba(194,150,58,0.12)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(194,150,58,0.12)", background: "var(--color-cream-100)" }}>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#B8892E" }}
                  onClick={() => toggleSort("title")}
                >
                  Title
                  <SortIcon active={sortKey === "title"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#B8892E" }}
                  onClick={() => toggleSort("category")}
                >
                  Category
                  <SortIcon active={sortKey === "category"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#B8892E" }}
                  onClick={() => toggleSort("type")}
                >
                  Type
                  <SortIcon active={sortKey === "type"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#B8892E" }}
                  onClick={() => toggleSort("published")}
                >
                  Published
                  <SortIcon active={sortKey === "published"} dir={sortDir} />
                </th>
                <th
                  className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] cursor-pointer select-none hover:opacity-70 transition-opacity"
                  style={{ color: "#B8892E" }}
                  onClick={() => toggleSort("downloads")}
                >
                  Downloads
                  <SortIcon active={sortKey === "downloads"} dir={sortDir} />
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const TypeIcon = TYPE_ICONS[r.type] ?? FileText;
                return (
                  <tr
                    key={r.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: i < sorted.length - 1 ? "1px solid rgba(194,150,58,0.08)" : "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(194,150,58,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(194,150,58,0.10)", color: "#B8892E" }}
                        >
                          <TypeIcon size={15} />
                        </div>
                        <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{r.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><Badge>{r.category}</Badge></td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "var(--color-text-tertiary)" }}>{r.type}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-tertiary)" }}>{r.published}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>{r.downloads}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded-full hover:bg-black/5 p-1.5 cursor-pointer outline-none">
                            <EllipsisVertical size={16} style={{ color: "var(--color-text-tertiary)" }} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(r)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                downloadResourcePacket({
                                  title: r.title,
                                  category: r.category,
                                  type: r.type,
                                  description: `${r.type} resource published ${r.published}.`,
                                  date: r.published,
                                })
                              }
                            >
                              Download preview
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(r.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
