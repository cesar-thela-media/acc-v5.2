"use client";

import { useState } from "react";

/**
 * Video section: shows a branded poster by default.
 * On click reveals a "coming soon" message. Swap in a real YouTube
 * embed ID when the video is ready.
 */
export function VideoPlayer() {
  const [played, setPlayed] = useState(false);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        aspectRatio: "16 / 9",
        boxShadow: "0 24px 64px rgba(27,27,27,0.18)",
        background: "var(--color-sage-900)",
      }}
      onClick={() => !played && setPlayed(true)}
    >
      {/* ── Background layers ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-sage-900) 0%, var(--color-sage-700) 100%)",
        }}
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.18,
        }}
      />

      {/* Highlight radial accent */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 25% 55%, rgba(var(--color-accent-highlight-rgb), 0.12) 0%, transparent 55%)",
        }}
      />

      {/* Terracotta accent */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 30%, rgba(74,93,78,0.12) 0%, transparent 45%)",
        }}
      />

      {/* ── Poster state ── */}
      {!played ? (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
            {/* Eyebrow */}
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Austin Clinician Circle
            </p>

            {/* Play button */}
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(10px)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                style={{ transform: "translateX(2px)" }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center px-6">
              <p
                className="text-xl font-light"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Sarah Arnold, LPC-S
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Founder of Austin Clinician Circle · 3-minute introduction
              </p>
            </div>
          </div>

          {/* Bottom overlay */}
          <div
            className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 py-5 z-10"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.45) 0%, transparent 100%)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              No sign-up required
            </p>
            <span
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Watch now
            </span>
          </div>
        </>
      ) : (
        /* ── Played / coming-soon state ── */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
          style={{ background: "var(--color-sage-900)" }}
        >
          <p
            className="text-2xl font-light"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              color: "#fff",
            }}
          >
            Coming soon.
          </p>
          <p
            className="text-sm max-w-xs text-center"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Sarah&apos;s intro video will be available at launch.
          </p>
          <button
            className="mt-2 text-xs underline"
            style={{
              color: "var(--color-accent-highlight)",
              textUnderlineOffset: "3px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPlayed(false);
            }}
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
}
