import type { ReactNode } from "react";

/** Template-style page title block used inside dashboard/admin content */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-1 w-full min-w-0">
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-1.5"
            style={{ color: "var(--color-accent-highlight)" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="text-xl sm:text-2xl md:text-[1.75rem] leading-tight break-words"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 400,
            color: "var(--color-sage-800)",
          }}
        >
          {title}
        </h1>
        {description ? (
          <p className="text-sm mt-1.5 max-w-3xl break-words" style={{ color: "var(--color-text-secondary)" }}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}
