import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CardBox } from "@/components/dashboard/CardBox";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  href,
  accent = "sage",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  accent?: "sage" | "amber" | "success";
}) {
  const colors = {
    sage: { bg: "rgba(74,94,72,0.10)", fg: "#4A5E48" },
    amber: { bg: "rgba(194,150,58,0.14)", fg: "#C2963A" },
    success: { bg: "rgba(74,124,89,0.12)", fg: "#4A7C59" },
  }[accent];

  const inner = (
    <CardBox className="h-full min-w-0 transition-shadow hover:shadow-md !p-4 sm:!p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide truncate" style={{ color: "var(--color-text-tertiary)" }}>
            {title}
          </p>
          <p
            className="text-xl sm:text-2xl mt-1 sm:mt-1.5 tabular-nums break-words"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              color: "var(--color-sage-800)",
            }}
          >
            {value}
          </p>
          {hint ? (
            <p className="text-[11px] sm:text-xs mt-1 break-words" style={{ color: "var(--color-text-tertiary)" }}>
              {hint}
            </p>
          ) : null}
        </div>
        <span
          className="flex size-9 sm:size-11 items-center justify-center rounded-xl shrink-0"
          style={{ background: colors.bg, color: colors.fg }}
        >
          <Icon className="size-4 sm:size-5" />
        </span>
      </div>
    </CardBox>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full min-w-0 no-underline">
        {inner}
      </Link>
    );
  }
  return inner;
}
