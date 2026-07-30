"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 md:px-6"
      style={{ background: "#4A5E48" }}
    >
      <div className="max-w-md text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(194,150,58,0.15)", color: "#C2963A" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p
          className="text-[11px] font-medium uppercase tracking-[0.2em] mb-4"
          style={{ color: "#C2963A" }}
        >
          Something went wrong
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "rgba(255,255,255,0.88)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          This page couldn&apos;t load.
        </h1>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.48)" }}
        >
          A temporary error occurred. This is likely a network issue or a
          momentary glitch. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "#C2963A", color: "#fff" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
