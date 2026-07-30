"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

const AMBER = "#C2963A";
const SAGE = "#4A5E48";
const SAGE_DEEP = "#4A5E48";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Admin", email: email.trim() }),
      });
      if (res.ok) {
        router.push("/admin");
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
    <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="relative hidden lg:block overflow-hidden" style={{ background: SAGE_DEEP }}>
        <Image
          src="/admin-login-bg.jpg"
          alt="Austin Clinician Circle membership"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, rgba(74,94,72,0.72) 0%, rgba(61,79,59,0.55) 55%, rgba(74,94,72,0.35) 100%)",
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

      <div
        className="relative flex items-center justify-center p-6 sm:p-10 min-h-screen lg:min-h-0"
        style={{ background: SAGE }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 10%, rgba(194,150,58,0.14) 0%, transparent 55%)",
          }}
        />
        <div className="relative w-full max-w-md flex flex-col gap-8">
          <Link href="/" aria-label="Austin Clinician Circle" className="flex justify-center">
            <Image
              src="/logo-with-ACC-text.png"
              alt="Austin Clinician Circle"
              width={240}
              height={72}
              className="h-16 sm:h-[4.5rem] w-auto object-contain brightness-110"
              priority
            />
          </Link>
          <div className="flex gap-2 flex-col text-center">
            <h1
              className="text-2xl sm:text-[1.65rem]"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Admin access
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
              Admin access for Austin Clinician Circle.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
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
                  placeholder="you@example.com"
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
                  htmlFor="admin-password"
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  Password
                </FieldLabel>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                className="w-full rounded-lg h-11 cursor-pointer mt-2"
                style={{ background: AMBER, color: "#fff" }}
              >
                {loading ? "Signing in…" : "Continue"}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </section>
  );
}
