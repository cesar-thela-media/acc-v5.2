import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Template CardBox pattern — white elevated card on cream canvas.
 * No customizer context; ACC shadow/border tokens only.
 */
export function CardBox({
  children,
  className,
  style,
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white shadow-sm w-full min-w-0 max-w-full box-border",
        padding && "p-4 sm:p-5 md:p-6",
        className,
      )}
      style={{
        border: "1px solid rgba(45,59,44,0.08)",
        boxShadow: "0 4px 20px rgba(45,59,44,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
