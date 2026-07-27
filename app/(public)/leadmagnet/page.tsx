"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LeadMagnetPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    if (!consent) {
      setError("Please agree to the privacy policy to receive your playbook.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden" style={{ background: "var(--color-sage-800)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 15% 20%, rgba(194,150,58,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 85% 70%, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-12 md:py-16 lg:py-20">
        {/* Two columns: left = copy + book, right = big form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start">
          {/* Left column — badge, headline, body, book */}
          <div className="flex flex-col gap-8 lg:gap-10">
            <div>
              <div
                className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full"
                style={{ background: "var(--color-accent-highlight)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
                  Free guide for Austin therapists
                </span>
              </div>
              <h1
                className="leading-[1.08] mb-5"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(2.5rem, 5.5vw, 3.75rem)",
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Stop building your{" "}
                <em style={{ color: "var(--color-cream-100)", fontStyle: "italic" }}>practice alone.</em>
              </h1>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,0.62)", maxWidth: "32rem" }}
              >
                Download <strong className="font-semibold text-white/90">The Private Practice Playbook</strong>
                {" "}— a free guide for licensed therapists building sustainable practices.
              </p>
            </div>

            <div className="w-full max-w-[260px] sm:max-w-[280px]">
              <Image
                src="/playbook-cover.svg"
                alt="The Private Practice Playbook"
                width={520}
                height={680}
                className="w-full h-auto rounded-lg"
                style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)" }}
                priority
              />
            </div>
          </div>

          {/* Right column — large form */}
          <div className="w-full lg:sticky lg:top-28">
            {!submitted ? (
              <div
                className="rounded-2xl p-8 sm:p-10 lg:p-12"
                style={{
                  background: "#F7F4EC",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 56px -16px rgba(0,0,0,0.4)",
                }}
              >
                <p
                  className="text-xl sm:text-2xl font-semibold mb-2"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    color: "var(--color-sage-800)",
                  }}
                >
                  Get the free playbook
                </p>
                <p className="text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
                  Delivered to your inbox. No spam.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      required
                      className="w-full px-5 py-4 rounded-xl text-base outline-none border bg-white"
                      style={{
                        borderColor: "rgba(45,59,44,0.12)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-5 py-4 rounded-xl text-base outline-none border bg-white"
                      style={{
                        borderColor: "rgba(45,59,44,0.12)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  {error && <p className="text-sm text-red-700">{error}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-[var(--color-accent-highlight)]"
                    />
                    <span className="text-sm leading-snug" style={{ color: "var(--color-text-secondary)" }}>
                      I agree to receive emails and have read the{" "}
                      <Link href="/privacy" className="underline" style={{ color: "var(--color-sage-700)" }}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !firstName.trim() || !email.trim() || !consent}
                    className="w-full py-4 sm:py-4.5 rounded-full text-base font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 mt-1"
                    style={{ background: "var(--color-accent-highlight)", color: "#fff" }}
                  >
                    {loading ? "Sending…" : "Send me the playbook →"}
                  </button>
                  <p className="text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                    Occasional emails from Austin Clinician Circle.{" "}
                    <Link href="/privacy" className="underline" style={{ color: "var(--color-sage-700)" }}>
                      Privacy
                    </Link>
                  </p>
                </form>
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 sm:p-10 lg:p-12 flex flex-col gap-5"
                style={{
                  background: "#F7F4EC",
                  boxShadow: "0 24px 56px -16px rgba(0,0,0,0.4)",
                }}
              >
                <p
                  className="text-xl sm:text-2xl font-semibold"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    color: "var(--color-sage-800)",
                  }}
                >
                  Check your inbox, {firstName}.
                </p>
                <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
                  The playbook is on its way to {email}.
                </p>
                <Link
                  href="/join"
                  className="w-full text-center py-4 rounded-full text-base font-semibold mt-2"
                  style={{ background: "var(--color-sage-800)", color: "#fff" }}
                >
                  Apply for membership →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
