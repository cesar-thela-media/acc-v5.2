import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TimelineItem = {
  id: string;
  title: string;
  meta?: string;
  badge?: ReactNode;
  accent?: "sage" | "amber" | "success" | "error";
};

const DOT: Record<NonNullable<TimelineItem["accent"]>, string> = {
  sage: "#4A5E48",
  amber: "#C2963A",
  success: "#4A7C59",
  error: "#B54B4B",
};

/** CRM-style activity list from the Space Admin template, ACC tokens. */
export function ActivityTimeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const color = DOT[item.accent ?? "sage"];
        const last = index === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className="absolute top-3 left-[7px] w-px"
                style={{
                  bottom: 0,
                  background: "rgba(45,59,44,0.12)",
                }}
              />
            ) : null}
            <span
              className="relative z-[1] mt-1.5 size-3.5 shrink-0 rounded-full ring-4 ring-white"
              style={{ background: color }}
            />
            <div className="min-w-0 flex-1 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {item.title}
                </p>
                {item.meta ? (
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {item.meta}
                  </p>
                ) : null}
              </div>
              {item.badge}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
