"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchShell, type ShellSearchHit, type ShellSearchScope } from "@/lib/shellSearch";

const CREAM = "var(--color-cream-100)";
const TEXT = "var(--color-text-primary)";

export function ShellSearch({
  scope,
  placeholder = "Search…",
}: {
  scope: ShellSearchScope;
  placeholder?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchShell(query, scope), [query, scope]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(hit: ShellSearchHit) {
    setOpen(false);
    setQuery("");
    router.push(hit.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter") && query.trim()) {
      setOpen(true);
    }
    if (!results.length) {
      if (e.key === "Enter" && query.trim()) {
        // Fall back: search within current portal home with q
        const base = scope === "admin" ? "/admin/members" : "/dashboard/resources";
        router.push(`${base}?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active] ?? results[0];
      if (hit) go(hit);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && query.trim().length > 0;

  // Group for display
  const groups = useMemo(() => {
    const map = new Map<string, ShellSearchHit[]>();
    for (const hit of results) {
      const list = map.get(hit.group) ?? [];
      list.push(hit);
      map.set(hit.group, list);
    }
    return [...map.entries()];
  }, [results]);

  let flatIndex = -1;

  return (
    <div ref={rootRef} className="relative flex-1 min-w-0 w-full">
      <div
        className="flex items-center gap-2 h-10 w-full min-w-0 rounded-full px-3 sm:px-3.5"
        style={{
          background: CREAM,
          border: "1px solid rgba(45,59,44,0.10)",
        }}
      >
        <Search size={16} className="shrink-0" style={{ color: "rgba(45,59,44,0.45)" }} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[rgba(45,59,44,0.4)] min-w-0 w-full"
          style={{ color: TEXT }}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
          role="combobox"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="p-0.5 rounded hover:bg-black/5 shrink-0"
            aria-label="Clear search"
          >
            <X size={14} style={{ color: "rgba(45,59,44,0.45)" }} />
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[min(420px,70vh)] overflow-y-auto overflow-x-hidden rounded-xl border bg-white py-2 shadow-lg w-full min-w-0 sm:min-w-[280px]"
          style={{
            borderColor: "rgba(45,59,44,0.1)",
            boxShadow: "0 12px 40px rgba(45,59,44,0.14)",
          }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                No results for “{query.trim()}”
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
                Try a member name, event title, or page like “billing”
              </p>
            </div>
          ) : (
            groups.map(([group, hits]) => (
              <div key={group} className="pb-1">
                <p
                  className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {group}
                </p>
                {hits.map((hit) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const isActive = idx === active;
                  return (
                    <button
                      key={hit.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className="w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors"
                      style={{
                        background: isActive ? "rgba(74,94,72,0.08)" : "transparent",
                      }}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(hit)}
                    >
                      <span className="text-sm font-medium" style={{ color: "var(--color-sage-800)" }}>
                        {hit.title}
                      </span>
                      {hit.subtitle ? (
                        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {hit.subtitle}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
