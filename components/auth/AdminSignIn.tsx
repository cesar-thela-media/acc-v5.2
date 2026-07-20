"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { UserRound } from "lucide-react";

const AMBER = "#C2963A";
/** Mid sage — matches app shell; keeps logo readable on the form pane */
const SAGE = "#4A5E48";
const SAGE_DEEP = "#3D4F3B";

type Props = {
  redirectTo?: string;
  title?: string;
  description?: string;
};

/**
 * Dedicated admin sign-in surface. Visually distinct from the member login —
 * image pane on the left, sage form pane on the right (logo-friendly contrast).
 */
export function AdminSignIn({
  redirectTo = "/admin",
  title = "Admin log in",
  description = "Owner access for members, applications, events, and resources.",
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("Log in failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin() {
    setName("Sarah Arnold");
    setEmail("sarah@restoredfamily.com");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Sarah Arnold", email: "sarah@restoredfamily.com" }),
      });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("Log in failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── Image pane (no founder portrait) ───────────────────────── */}
      <div className="relative hidden lg:block overflow-hidden" style={{ background: SAGE_DEEP }}>
        <Image
          src="/admin-login-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(150deg, rgba(45,59,44,0.72) 0%, rgba(61,79,59,0.55) 55%, rgba(74,94,72,0.35) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-10 xl:p-12">
          <div className="text-white max-w-sm">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-3"
              style={{ color: "rgba(194,150,58,0.95)" }}
            >
              Admin
            </p>
            <p
              className="leading-[1.2]"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)",
                fontWeight: 400,
                letterSpacing: "-0.015em",
              }}
            >
              Members, applications, events, resources.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form pane — sage green for logo contrast ───────────────── */}
      <div
        className="relative flex items-center justify-center px-6 py-12 sm:py-16 lg:py-20 min-h-screen lg:min-h-0"
        style={{ background: SAGE }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 10%, rgba(194,150,58,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(0,0,0,0.12) 0%, transparent 50%)",
          }}
        />
        <div className="relative w-full max-w-md flex flex-col gap-8">
          <Link href="/" aria-label="The Circle" className="flex justify-center w-full">
            <Image
              src="/logo-with-ACC-text.png"
              alt="Austin Clinician Circle"
              width={240}
              height={72}
              className="h-16 sm:h-[4.5rem] w-auto object-contain brightness-110"
              priority
            />
          </Link>

          <div className="w-full text-center">
            <h1
              className="text-2xl sm:text-[1.65rem] mb-2"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full text-left">
            <FieldGroup className="gap-5">
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="admin-name"
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  Full name
                </FieldLabel>
                <Input
                  id="admin-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="h-11 text-white placeholder:text-white/40 caret-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.16)",
                    color: "#fff",
                  }}
                />
              </Field>
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="admin-email"
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  Email address
                </FieldLabel>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="h-11 text-white placeholder:text-white/40 caret-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.16)",
                    color: "#fff",
                  }}
                />
              </Field>

              {error && <p className="text-sm" style={{ color: "#F0B4B4" }}>{error}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full rounded-lg h-11 cursor-pointer"
                style={{ background: AMBER, color: "#fff" }}
              >
                {loading ? "Logging in…" : "Continue →"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={demoLogin}
                className="w-full rounded-lg h-10 gap-2 cursor-pointer border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <UserRound className="size-4" />
                {loading ? "Logging you in…" : "Log in as Demo User"}
              </Button>
            </FieldGroup>
          </form>

          <p className="text-xs text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
            To enable real auth, add <code className="font-mono text-white/60">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
            <code className="font-mono text-white/60">CLERK_SECRET_KEY</code> to your environment.
          </p>
        </div>
      </div>
    </section>
  );
}
