import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-[rgba(45,59,44,0.15)] bg-white px-2.5 py-2 text-base text-[var(--color-text-primary)] shadow-xs outline-none transition-[color,box-shadow] md:text-sm",
        "placeholder:text-[var(--color-text-tertiary)]",
        "focus-visible:border-[var(--color-accent-highlight)] focus-visible:ring-[3px] focus-visible:ring-[rgba(194,150,58,0.25)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--color-error)] aria-invalid:ring-[3px] aria-invalid:ring-[rgba(181,75,75,0.2)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
