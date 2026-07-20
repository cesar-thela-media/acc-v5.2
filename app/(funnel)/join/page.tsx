"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/shadcn/separator";

const STEPS = ["About you", "Your practice", "Confirm"];

const licenseTypes = ["LPC", "LCSW", "LMFT", "PhD", "PsyD", "LPC-A", "Other"];
const specialtyOptions = [
  "Anxiety & OCD",
  "Attachment & Relational",
  "Couples & Marriage",
  "Depression",
  "EMDR",
  "Family Systems",
  "Grief & Loss",
  "Trauma & PTSD",
  "Somatic",
  "Adolescents",
  "Children",
  "LGBTQ+",
  "Perinatal Mental Health",
  "Spirituality & Faith",
];
const modalityOptions = [
  "Individual therapy",
  "Couples therapy",
  "Family therapy",
  "Group therapy",
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseType: string;
  licenseNumber: string;
  yearsLicensed: string;
  practiceName: string;
  practiceCity: string;
  format: string;
  specialties: string[];
  modalities: string[];
  bio: string;
  whyCircle: string;
};

const empty: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  licenseType: "",
  licenseNumber: "",
  yearsLicensed: "",
  practiceName: "",
  practiceCity: "",
  format: "",
  specialties: [],
  modalities: [],
  bio: "",
  whyCircle: "",
};

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stepError, setStepError] = useState("");

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateStep(current: number): string {
    if (current === 0) {
      if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your first and last name.";
      if (!form.email.trim()) return "Please enter your email address.";
      if (!form.phone.trim()) return "Please enter your phone number.";
      if (!form.licenseType) return "Please select your license type.";
      if (!form.licenseNumber.trim()) return "Please enter your license number.";
      if (!form.yearsLicensed.trim()) return "Please enter how many years you have been licensed.";
    }
    if (current === 1) {
      if (!form.practiceCity.trim()) return "Please enter your city or area.";
      if (!form.format) return "Please select a practice format.";
      if (!form.bio.trim()) return "Please write a brief bio.";
    }
    return "";
  }

  function goToStep(next: number) {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");
    setStep(next);
  }

  async function handleSubmit() {
    const error = validateStep(0) || validateStep(1);
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError((data as { error?: string }).error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMulti(field: "specialties" | "modalities", value: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  if (submitted) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-16 px-5 md:px-6"
        style={{ background: "#2D3B2C" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 38%, rgba(194,150,58,0.42) 0%, rgba(194,150,58,0.18) 45%, transparent 74%)" }}
        />
        <div className="relative max-w-md text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl"
            style={{ background: "#C2963A", color: "#fff" }}
          >
            {"?"}
          </div>
          <h1 className="text-page-title mb-4" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 400, color: "#fff" }}>
            Application received.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Thank you, {form.firstName}. Sarah reviews every application personally and will be in touch within a few business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen pt-2 md:pt-3 pb-10 md:pb-12 overflow-hidden"
      style={{ background: "#2D3B2C" }}
    >
      <nav className="relative z-20 w-full flex items-center justify-center py-3 md:py-4 px-4">
        <Link href="/" aria-label="The Circle" className="inline-flex items-center no-underline">
          <Image
            src="/logo-mark.png"
            alt="The Circle"
            width={200}
            height={72}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
      </nav>

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 28%, rgba(194,150,58,0.42) 0%, rgba(194,150,58,0.18) 45%, transparent 74%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-16 xl:px-16">
        <div className="flex lg:flex-row flex-col items-start justify-center gap-10 lg:gap-16">
          <div className="w-full lg:flex-[1.4] sm:py-8 py-4">
            <div
              className="relative rounded-2xl p-6 sm:p-8"
              style={{ background: "#fff", border: "1px solid rgba(197,200,190,0.7)" }}
            >
              <div className="flex items-center justify-center gap-2 mb-10">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
                      style={{
                        background: i <= step ? "var(--color-accent-highlight)" : "var(--color-cream-300)",
                        color: i <= step ? "#fff" : "var(--color-text-tertiary)",
                      }}
                    >
                      {i < step ? "?" : i + 1}
                    </div>
                    <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? "var(--color-accent-highlight)" : "var(--color-text-tertiary)" }}>
                      {label}
                    </span>
                    {i < STEPS.length - 1 && <span className="w-4 h-px hidden sm:block" style={{ background: "var(--color-cream-300)" }} />}
                  </div>
                ))}
              </div>

              <div key={step} style={{ animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}>

                {step === 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="First name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Jane" />
                      <Input label="Last name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Smith" />
                    </div>
                    <Input label="Email address" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
                    <Input label="Phone number" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(512) 000-0000" />
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>License type</label>
                      <div className="flex flex-wrap gap-2">
                        {licenseTypes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => set("licenseType", t)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{
                              background: form.licenseType === t ? "var(--color-accent-highlight)" : "var(--color-sage-50)",
                              color: form.licenseType === t ? "#fff" : "var(--color-sage-700)",
                              border: form.licenseType === t ? "none" : "1px solid var(--color-cream-300)",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input label="License number" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} placeholder="TX-12345" />
                    <Input label="Years licensed" type="number" min="0" value={form.yearsLicensed} onChange={(e) => set("yearsLicensed", e.target.value)} placeholder="3" />
                    {stepError && step === 0 && (
                      <p className="text-sm text-center" style={{ color: "var(--color-error)" }}>{stepError}</p>
                    )}
                    <Button onClick={() => goToStep(1)} className="w-full mt-2">
                      Continue ?
                    </Button>
                  </div>
                )}

                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <Input label="Practice name (if any)" value={form.practiceName} onChange={(e) => set("practiceName", e.target.value)} placeholder="Clarity Counseling" />
                    <Input label="City / area" value={form.practiceCity} onChange={(e) => set("practiceCity", e.target.value)} placeholder="Austin, TX" />
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Practice format</label>
                      <div className="flex flex-wrap gap-2">
                        {["Virtual only", "In-person only", "Hybrid"].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => set("format", f)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{
                              background: form.format === f ? "var(--color-accent-highlight)" : "var(--color-sage-50)",
                              color: form.format === f ? "#fff" : "var(--color-sage-700)",
                              border: form.format === f ? "none" : "1px solid var(--color-cream-300)",
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                        Specialties <span style={{ color: "var(--color-text-tertiary)" }}>(select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {specialtyOptions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleMulti("specialties", s)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{
                              background: form.specialties.includes(s) ? "var(--color-accent-highlight)" : "var(--color-sage-50)",
                              color: form.specialties.includes(s) ? "#fff" : "var(--color-sage-700)",
                              border: form.specialties.includes(s) ? "none" : "1px solid var(--color-cream-300)",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Modalities</label>
                      <div className="flex flex-wrap gap-2">
                        {modalityOptions.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleMulti("modalities", m)}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{
                              background: form.modalities.includes(m) ? "var(--color-accent-highlight)" : "var(--color-sage-50)",
                              color: form.modalities.includes(m) ? "#fff" : "var(--color-sage-700)",
                              border: form.modalities.includes(m) ? "none" : "1px solid var(--color-cream-300)",
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      label="Brief bio"
                      rows={4}
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="A short paragraph about your clinical background and approach (this will appear on your directory profile)."
                      hint="This will appear on your public directory listing."
                    />
                    <Textarea label="Why do you want to join The Circle?" rows={3} value={form.whyCircle} onChange={(e) => set("whyCircle", e.target.value)} placeholder="What are you hoping to get from this community?" />
                    {stepError && step === 1 && (
                      <p className="text-sm text-center" style={{ color: "var(--color-error)" }}>{stepError}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <Button variant="secondary" onClick={() => { setStepError(""); setStep(0); }} className="flex-1">? Back</Button>
                      <Button onClick={() => goToStep(2)} className="flex-1">Continue ?</Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ borderColor: "var(--color-cream-300)", background: "#fff" }}>
                      <h3 className="text-sm font-semibold" style={{ color: "var(--color-sage-800)" }}>Review your application</h3>
                      <div className="flex flex-col gap-2 text-sm">
                        {[
                          ["Name", `${form.firstName} ${form.lastName}`],
                          ["Email", form.email],
                          ["License", `${form.licenseType} ${form.licenseNumber}`],
                          ["Years licensed", form.yearsLicensed],
                          ["Practice", form.practiceName || "Not provided"],
                          ["Location", form.practiceCity],
                          ["Format", form.format],
                          ["Specialties", form.specialties.join(", ") || "Not provided"],
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                            <span className="w-full sm:w-32 shrink-0 font-medium" style={{ color: "var(--color-text-tertiary)" }}>{label}</span>
                            <span style={{ color: "var(--color-text-primary)" }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border p-5 text-sm" style={{ borderColor: "var(--color-sage-100)", background: "var(--color-sage-50)", color: "var(--color-sage-700)" }}>
                      Membership is $79/month, billed monthly. Payment details will be collected after Sarah reviews and approves your application.
                    </div>
                    {submitError && (
                      <p className="text-sm text-center" style={{ color: "var(--color-error)" }}>{submitError}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="secondary" onClick={() => setStep(1)} className="flex-1" disabled={submitting}>? Back</Button>
                      <Button onClick={handleSubmit} className="flex-1" disabled={submitting}>{submitting ? "Submitting…" : "Submit application"}</Button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden lg:block self-stretch" style={{ background: "rgba(255,255,255,0.12)" }} />
          <Separator orientation="horizontal" className="lg:hidden w-full" style={{ background: "rgba(255,255,255,0.12)" }} />

          <div className="w-full lg:max-w-sm sm:px-0 sm:py-8 py-4 lg:pt-32">
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#C2963A" }}>Membership application</p>
              <h2 className="leading-tight" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#fff" }}>
                Join The Circle.
              </h2>
              <p className="text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
                A professional community for licensed therapists. Sarah reviews every application personally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
