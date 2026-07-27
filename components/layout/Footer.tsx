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

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.228.413.56.218.96.478 1.38.898s.68.82.898 1.38c.164.423.36 1.058.413 2.228.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.053 1.17-.249 1.805-.413 2.228a3.7 3.7 0 0 1-.898 1.38c-.42.42-.82.68-1.38.898-.423.164-1.058.36-2.228.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.17-.053-1.805-.249-2.228-.413a3.7 3.7 0 0 1-1.38-.898c-.42-.42-.68-.82-.898-1.38-.164-.423-.36-1.058-.413-2.228-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.054-1.17.249-1.805.413-2.228.218-.56.478-.96.898-1.38s.82-.68 1.38-.898c.423-.164 1.058-.36 2.228-.413 1.265-.058 1.645-.07 4.849-.07M12 0C8.741 0 8.332.014 7.052.072 5.775.131 4.902.333 4.14.63a5.9 5.9 0 0 0-2.126 1.384A5.9 5.9 0 0 0 .63 4.14c-.297.763-.5 1.635-.558 2.912C.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.059 1.277.261 2.15.558 2.912.307.79.717 1.459 1.384 2.126A5.9 5.9 0 0 0 4.14 23.37c.763.297 1.635.5 2.912.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.059 2.15-.261 2.912-.558a5.9 5.9 0 0 0 2.126-1.384 5.9 5.9 0 0 0 1.384-2.126c.297-.763.5-1.635.558-2.912.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.059-1.277-.261-2.15-.558-2.912a5.9 5.9 0 0 0-1.384-2.126A5.9 5.9 0 0 0 19.86.63c-.763-.297-1.635-.5-2.912-.558C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.846-10.406a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0" fill="currentColor" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.633 13.633h-2.37V9.92c0-.885-.017-2.025-1.234-2.025-1.235 0-1.424.965-1.424 1.96v3.778h-2.37V5.998H8.51v1.043h.031a2.5 2.5 0 0 1 2.246-1.233c2.403 0 2.846 1.58 2.846 3.637zM3.56 4.954a1.376 1.376 0 1 1 0-2.751 1.376 1.376 0 0 1 0 2.751m1.185 8.679H2.372V5.998h2.373zM14.815.001H1.18A1.17 1.17 0 0 0 0 1.154v13.691A1.17 1.17 0 0 0 1.18 16h13.635A1.17 1.17 0 0 0 16 14.845V1.153A1.17 1.17 0 0 0 14.815 0" fill="currentColor" />
  </svg>
);

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
                Deepen your Work. Find your community.
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
            {/* social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors duration-150 hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors duration-150 hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <LinkedinIcon />
              </a>
              <a
                href="mailto:sarah@restoredfamily.com"
                aria-label="Email"
                className="transition-colors duration-150 hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <Mail width={16} height={16} />
              </a>
            </div>
          </div>
        </div>
        <SubFooter />
      </div>
    </footer>
  );
}
