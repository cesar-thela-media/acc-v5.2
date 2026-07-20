"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { UserRound } from "lucide-react";

const AMBER = "#C2963A";

type Props = {
  redirectTo?: string;
  title?: string;
  description?: string;
  /** Show free-tier preview link (member login only). */
  showFreePreview?: boolean;
  /** Show join link under the form. */
  showJoinLink?: boolean;
};

export function MockSignIn({
  redirectTo = "/dashboard",
  title = "Log in to The Circle",
  description = "Clerk auth isn't configured. Enter any name and email to access the member dashboard.",
  /** Free-tier preview link is hidden by default. Pass `true` to re-show (currently never enabled). */
  showFreePreview = false,
  showJoinLink = true,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(name, email);
  }

  async function signIn(nameVal: string, emailVal: string) {
    if (!nameVal.trim() || !emailVal.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameVal.trim(), email: emailVal.trim() }),
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
    setError("");
    setName("Sarah Arnold");
    setEmail("sarah@restoredfamily.com");
    await signIn("Sarah Arnold", "sarah@restoredfamily.com");
  }

  return (
    <section className="relative min-h-screen">
      <Image src="/signin-bg.jpg" alt="" fill priority className="object-cover" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(45,59,44,0.75) 0%, rgba(45,59,44,0.35) 55%, rgba(45,59,44,0.15) 100%)" }}
      />
      <div className="relative flex items-end sm:items-center justify-center lg:justify-start min-h-screen">
        <div className="max-w-7xl p-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full">
          <Card
            className="w-full max-w-md px-6 py-8 sm:px-8 sm:py-12 border-none shadow-xl gap-8 rounded-3xl"
            style={{
              background: "linear-gradient(160deg, #3D4F3C 0%, #2D3B2C 48%, #243024 100%)",
              border: "1px solid rgba(194,150,58,0.28)",
              boxShadow: "0 16px 40px rgba(26,26,26,0.28)",
            }}
          >
            <CardHeader className="p-0 flex gap-6 flex-col">
              {/* Logo centered; card stays left-aligned on large screens */}
              <Link href="/" aria-label="The Circle" className="flex justify-center w-full">
                <Image src="/logo-mark.png" alt="" width={200} height={72} className="h-20 w-auto object-contain brightness-110" />
              </Link>
              <div className="flex gap-2 flex-col">
                <CardTitle className="text-2xl font-semibold" style={{ color: "#fff" }}>
                  {title}
                </CardTitle>
                <CardDescription className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.72)" }}>
                  {description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-6">
                  <div className="flex flex-col gap-4">
                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="name" className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.78)" }}>
                        Full name
                      </FieldLabel>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        required
                        className="h-9 shadow-xs text-white placeholder:text-white/40 caret-white"
                        style={{ color: "#fff", background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                      />
                    </Field>
                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="email" className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.78)" }}>
                        Email address
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        required
                        className="h-9 shadow-xs text-white placeholder:text-white/40 caret-white"
                        style={{ color: "#fff", background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                      />
                    </Field>
                  </div>

                  {error && <p className="text-sm" style={{ color: "var(--color-error)" }}>{error}</p>}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full rounded-lg h-10 cursor-pointer"
                    style={{ background: AMBER, color: "#fff" }}
                  >
                    {loading ? "Logging in…" : "Log in"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={demoLogin}
                    className="w-full rounded-lg h-9 gap-2 cursor-pointer border-white/25 bg-white/5 text-white hover:bg-white/10"
                  >
                    <UserRound className="size-4" />
                    {loading ? "Logging you in…" : "Log in as Demo User"}
                  </Button>

                  {showFreePreview && (
                    <Link
                      href="/dashboard/free"
                      className="text-center text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      Preview free tier →
                    </Link>
                  )}
                </FieldGroup>
              </form>
              {showJoinLink && (
              <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/join" className="font-medium underline" style={{ color: AMBER }}>
                  Join The Circle
                </Link>
              </p>
              )}
              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                To enable real auth, add <code className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
                <code className="font-mono">CLERK_SECRET_KEY</code> to your environment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
