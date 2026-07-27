"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Check } from "lucide-react";
import { Separator } from "@/components/ui/shadcn/separator";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

const AMBER = "#C2963A";
const BG    = "#2D3B2C";

const quickLinks = [
  { href: "/who-we-are",   label: "Who We Are" },
  { href: "/what-we-offer", label: "What We Offer" },
  { href: "/find-a-clinician",  label: "Find a Clinician" },
];



/** Decorative brand wordmark — full legal/brand name, scaled so it wraps on narrow screens. */
function SubFooter() {
  return (
    <div className="w-full overflow-hidden py-6 px-4" style={{ opacity: 0.1 }}>
      <p
        className="w-full text-center select-none"
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: "clamp(1.35rem, 5.5vw, 4.5rem)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "#fff",
          wordBreak: "break-word",
          hyphens: "auto",
        }}
      >
        Austin Clinician Circle
      </p>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer style={{ background: BG }} className="lg:pt-20 sm:pt-16 pt-8">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-6 sm:gap-12 md:mb-12 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-12 lg:gap-x-8 gap-y-10 px-6 xl:px-0">
            {/* Logo */}
            <div className="col-span-full lg:col-span-3">
              <Link href="/" aria-label="Austin Clinician Circle" className="inline-flex items-center gap-3 mb-3">
                <Image src="/logo-mark.png" alt="" width={2000} height={732} className="h-20 w-auto object-contain" />
              </Link>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.48)" }}>
                Deepen your work. Find your community.
              </p>
            </div>

            {/* Quick Links / Inside Austin Clinician Circle / Community */}
            <div className="lg:col-span-6 col-span-12 grid sm:grid-cols-2 grid-cols-1 gap-6 gap-y-10">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: AMBER }}>
                  Quick Links
                </p>
                <ul className="flex flex-col gap-3">
                  {quickLinks.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm transition-colors duration-150 hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: AMBER }}>
                  Community
                </p>
                <div className="flex flex-col gap-3">
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Austin, Texas</p>
                  <a href="mailto:sarah@restoredfamily.com" className="text-sm transition-colors duration-150 hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                    sarah@restoredfamily.com
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter — visual only, non-functional (no backend to receive submissions) */}
            <div className="lg:col-span-3 col-span-12">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.48)" }}>Stay Connected</p>
                <h3 className="text-lg font-medium" style={{ color: "#fff" }}>
                  Subscribe to our newsletter for the latest news
                </h3>
                {status === "sent" ? (
                  <p className="text-sm flex items-center gap-2" style={{ color: "#fff" }}>
                    <Check width={16} height={16} style={{ color: AMBER }} />
                    You&apos;re subscribed.
                  </p>
                ) : (
                  <form className="flex items-center gap-2" onSubmit={handleSubscribe}>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="py-2 px-4 h-9 shadow-xs rounded-full text-sm text-white placeholder:text-white/40"
                      style={{ borderColor: "rgba(255,255,255,0.2)" }}
                    />
                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="rounded-full p-2.5 h-auto shrink-0"
                      style={{ background: AMBER, color: "#fff" }}
                    >
                      <Mail width={16} height={16} />
                    </Button>
                  </form>
                )}
                {status === "error" && (
                  <p className="text-xs" style={{ color: "#fff" }}>Something went wrong. Please try again.</p>
                )}
              </div>
            </div>
          </div>

          <Separator orientation="horizontal" style={{ background: "rgba(194,150,58,0.2)" }} />

          <div className="flex items-center justify-between md:flex-nowrap flex-wrap gap-6">
            <div className="flex items-center flex-wrap gap-y-2 gap-x-3 text-sm" style={{ color: "rgba(255,255,255,0.32)" }}>
              <p>© {new Date().getFullYear()} Austin Clinician Circle. All rights reserved.</p>
              <span className="size-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
              <Link href="/privacy" className="transition-colors duration-150 hover:text-white">Privacy</Link>
              <span className="size-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
              <Link href="/terms" className="transition-colors duration-150 hover:text-white">Terms</Link>
            </div>
            <a
              href="mailto:sarah@restoredfamily.com"
              aria-label="Email Sarah"
              className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:text-white"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <Mail width={16} height={16} />
              <span className="hidden sm:inline">sarah@restoredfamily.com</span>
            </a>
          </div>
        </div>
        <SubFooter />
      </div>
    </footer>
  );
}
