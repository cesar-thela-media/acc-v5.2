"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface MobileSidePanelProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  side?: "left" | "right";
  hideAbove?: "md" | "lg";
  background: string;
  borderColor: string;
  titleColor?: string;
  closeColor?: string;
}

export function MobileSidePanel({
  open,
  onClose,
  title,
  children,
  side = "left",
  hideAbove = "md",
  background,
  borderColor,
  titleColor = "#fff",
  closeColor = "rgba(255,255,255,0.72)",
}: MobileSidePanelProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const edgeClass = side === "right" ? "right-0 border-l" : "left-0 border-r";
  const visibilityClass = hideAbove === "lg" ? "lg:hidden" : "md:hidden";

  return (
    <div className={`${visibilityClass} fixed inset-0 z-[70]`} role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close navigation panel"
        className="absolute inset-0"
        style={{ background: "rgba(15, 23, 42, 0.34)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className={`absolute top-0 h-full w-[min(22rem,88vw)] px-6 py-6 flex flex-col shadow-2xl ${edgeClass}`}
        style={{
          background,
          borderColor,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
        }}
      >
        <div className="relative flex items-center justify-center mb-8 min-h-14">
          <div className="flex flex-1 items-center justify-center pr-8" style={{ color: titleColor }}>
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: closeColor }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}