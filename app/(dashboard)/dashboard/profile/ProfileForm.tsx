"use client";

import { useState, useRef, useEffect } from "react";
import { User, Bell, Lock, BadgeCheck, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  DEFAULT_PROFILE_PHOTO,
  readStoredProfilePhoto,
  resolveProfilePhotoUrl,
  writeStoredProfilePhoto,
} from "@/lib/profilePhoto";
import type { StoredProfile } from "@/lib/profile-store";

const LICENSE_TYPES = ["LPC", "LCSW", "LMFT", "LPC-S", "PhD", "PsyD", "Other"];
const SPECIALTIES = [
  "Anxiety", "Trauma", "Depression", "EMDR", "Somatic", "OCD", "Couples",
  "Family", "LGBTQ+", "Grief", "Adolescents", "Men", "Women", "Perinatal",
  "Workplace", "Burnout", "Mindfulness", "Cultural Identity",
];
const FORMATS = ["In-person", "Telehealth", "Both"];

export function ProfileForm({
  initialFirstName,
  initialLastName,
  initialProfile,
  initialPhotoUrl = DEFAULT_PROFILE_PHOTO,
}: {
  initialFirstName: string;
  initialLastName: string;
  initialProfile: StoredProfile | null;
  /** Clerk avatar or demo headshot — same source as the shell header avatar. */
  initialPhotoUrl?: string;
}) {
  const p = initialProfile;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(p?.email ?? "jane@example.com");
  const [city, setCity] = useState(p?.city ?? "Austin, TX");
  const [licenseType, setLicenseType] = useState(p?.licenseType ?? "LPC");
  const [licenseNumber, setLicenseNumber] = useState(p?.licenseNumber ?? "LPC-80042");
  const [supervisor, setSupervisor] = useState(p?.supervisor ?? "");
  const [bio, setBio] = useState(
    p?.bio ??
      "I'm a licensed professional counselor in Austin, TX with a focus on trauma and anxiety. I work primarily with adults using EMDR and somatic approaches.",
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    p?.specialties ?? ["Anxiety", "Trauma", "EMDR"],
  );
  const [format, setFormat] = useState(p?.format ?? "Both");
  const [officeLocation, setOfficeLocation] = useState(p?.officeLocation ?? "");
  const [accepting, setAccepting] = useState(p?.accepting ?? true);
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyResources, setNotifyResources] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);
  /** Custom upload only; null means show initialPhotoUrl / default. */
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = readStoredProfilePhoto();
    if (stored) setPhotoPreview(stored);
    setPhotoReady(true);
  }, []);

  const displayPhoto = resolveProfilePhotoUrl(photoPreview, initialPhotoUrl);
  const hasCustomPhoto = Boolean(photoPreview);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoReset() {
    setPhotoPreview(null);
    writeStoredProfilePhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Photo must be 2MB or smaller.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setPhotoPreview(dataUrl);
        writeStoredProfilePhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          city,
          licenseType,
          licenseNumber,
          supervisor,
          bio,
          specialties: selectedSpecialties,
          format,
          officeLocation,
          accepting,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save profile.");
      }
      if (photoPreview) writeStoredProfilePhoto(photoPreview);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  const chip = (active: boolean) => ({
    background: active ? "var(--color-accent-highlight)" : "#fff",
    color: active ? "#fff" : "var(--color-sage-700)",
    border: `1px solid ${active ? "var(--color-accent-highlight)" : "rgba(194,150,58,0.18)"}`,
  });

  return (
    <div
      className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full"
      style={{
        ["--input-label-color" as string]: "var(--color-text-secondary)",
        ["--input-hint-color" as string]: "var(--color-text-tertiary)",
        ["--input-text-color" as string]: "var(--color-text-primary)",
      }}
    >
      <PageHeader
        eyebrow="Account"
        title="Account settings"
        description="Your directory listing, credentials, and membership profile for Austin Clinician Circle."
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif"
        onChange={handlePhotoChange}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {/* Template Account Setting shell: tabs + cards */}
      <CardBox className="!p-0 overflow-hidden" padding={false}>
        <form onSubmit={handleSave}>
          <Tabs defaultValue="account" className="w-full">
            <div
              className="px-4 sm:px-5 pt-4 pb-0 border-b"
              style={{ borderColor: "rgba(45,59,44,0.08)", background: "var(--color-cream-100)" }}
            >
              <TabsList className="w-full max-w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger value="account" className="gap-1.5 data-[state=active]:bg-white">
                  <User className="size-4 opacity-70" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="credentials" className="gap-1.5 data-[state=active]:bg-white">
                  <BadgeCheck className="size-4 opacity-70" />
                  Credentials
                </TabsTrigger>
                <TabsTrigger value="practice" className="gap-1.5 data-[state=active]:bg-white">
                  <Briefcase className="size-4 opacity-70" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="availability" className="gap-1.5 data-[state=active]:bg-white">
                  <Calendar className="size-4 opacity-70" />
                  Availability
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-1.5 data-[state=active]:bg-white">
                  <Lock className="size-4 opacity-70" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Account: photo + summary + personal details (template layout) ── */}
            <TabsContent value="account" className="m-0 p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-5 min-w-0">
                {/* Change Profile — centered large photo like Space template */}
                <CardBox className="flex flex-col h-full">
                  <div className="mb-1">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "var(--color-sage-800)" }}
                    >
                      Change profile
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      Change your profile picture from here
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center flex-1 justify-center py-4">
                    <div
                      className="w-[120px] h-[120px] rounded-full overflow-hidden ring-4 ring-[rgba(74,94,72,0.12)] bg-[var(--color-cream-200)]"
                    >
                      {photoReady ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayPhoto}
                          alt={`${firstName} ${lastName}`.trim() || "Profile photo"}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span
                          className="flex w-full h-full items-center justify-center text-3xl font-medium"
                          style={{ color: "var(--color-sage-700)" }}
                        >
                          {(firstName || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 py-5">
                      <Button type="button" variant="primary" size="sm" onClick={handlePhotoClick}>
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handlePhotoReset}
                        disabled={!hasCustomPhoto}
                      >
                        Reset
                      </Button>
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      Allowed JPG, GIF or PNG. Max size of 2MB
                    </p>
                  </div>
                </CardBox>

                {/* Directory preview (ACC equivalent of template’s right card) */}
                <CardBox className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "var(--color-sage-800)" }}
                    >
                      Directory preview
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      How members see you in the clinician directory
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[rgba(194,150,58,0.25)]">
                        {photoReady ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={displayPhoto}
                            alt=""
                            className="w-full h-full object-cover object-top"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-base truncate"
                          style={{
                            fontFamily: "var(--font-serif), Georgia, serif",
                            color: "var(--color-sage-800)",
                          }}
                        >
                          {firstName} {lastName}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                          {licenseType}
                          {licenseNumber ? ` · ${licenseNumber}` : ""} · {city}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed line-clamp-4"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {selectedSpecialties.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                          style={{
                            background: "rgba(194,150,58,0.12)",
                            color: "var(--color-sage-800)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                      {format} · {accepting ? "Accepting new clients" : "Not accepting clients"}
                    </p>
                  </div>
                </CardBox>
              </div>

              {/* Personal Details */}
              <CardBox>
                <div className="mb-5">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: "var(--color-sage-800)" }}
                  >
                    Personal details
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    Edit your basic contact details and save from here
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    name="firstName"
                  />
                  <Input
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    name="lastName"
                  />
                  <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                  />
                  <Input
                    label="City, State"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    name="city"
                    hint="Displayed publicly on your profile."
                  />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 pt-6">
                  {error && (
                    <p className="text-sm font-medium mr-auto" style={{ color: "var(--color-error)" }}>
                      {error}
                    </p>
                  )}
                  {saved && (
                    <p className="text-sm font-medium mr-auto" style={{ color: "var(--color-success)" }}>
                      Profile saved.
                    </p>
                  )}
                  <Button type="submit" variant="primary" size="md" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </CardBox>
            </TabsContent>

            <TabsContent value="credentials" className="m-0 p-4 sm:p-6">
              <CardBox className="flex flex-col gap-4">
                <div className="mb-1">
                  <h3 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                    Credentials
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    License information shown on your public listing
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    License type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LICENSE_TYPES.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLicenseType(l)}
                        className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={chip(licenseType === l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  label="License number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  name="licenseNumber"
                />
                <Input
                  label="Supervising clinician (if applicable)"
                  placeholder="Name, credentials"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  name="supervisor"
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </CardBox>
            </TabsContent>

            <TabsContent value="practice" className="m-0 p-4 sm:p-6">
              <CardBox className="flex flex-col gap-4">
                <div className="mb-1">
                  <h3 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                    Practice
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    Bio and specialties for the member directory
                  </p>
                </div>
                <Textarea
                  label="Professional bio"
                  name="bio"
                  rows={5}
                  hint="Shown on your public directory listing. Write in first person."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    Specialties <span style={{ color: "var(--color-text-tertiary)" }}>(select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((s) => {
                      const sel = selectedSpecialties.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpecialty(s)}
                          className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                          style={chip(sel)}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </CardBox>
            </TabsContent>

            <TabsContent value="availability" className="m-0 p-4 sm:p-6">
              <CardBox className="flex flex-col gap-4">
                <div className="mb-1">
                  <h3 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                    Availability
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    How and where you see clients
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    Service format
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {FORMATS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFormat(f)}
                        className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={chip(format === f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {(format === "In-person" || format === "Both") && (
                  <Input
                    label="Office location"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="Ex: South Austin, Westlake, Cedar Park, Dallas"
                    hint="Shown on your public directory listing."
                  />
                )}
                <Toggle checked={accepting} onChange={setAccepting} label="Currently accepting new clients" />
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </CardBox>
            </TabsContent>

            <TabsContent value="security" className="m-0 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CardBox>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                      Change password
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      Password is managed by your sign-in provider
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Input label="Current password" type="password" name="currentPassword" disabled autoComplete="current-password" />
                    <Input label="New password" type="password" name="newPassword" disabled autoComplete="new-password" />
                    <Input label="Confirm password" type="password" name="confirmPassword" disabled autoComplete="new-password" />
                  </div>
                  <p className="text-xs mt-3" style={{ color: "var(--color-text-tertiary)" }}>
                    Passwords are managed by the sign-in provider (Clerk) or demo cookie auth.
                  </p>
                  <a
                    href="/sign-in"
                    className="inline-flex mt-3 text-sm font-semibold underline"
                    style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
                  >
                    Open sign-in settings →
                  </a>
                </CardBox>
                <CardBox>
                  <div className="mb-4 flex items-start gap-2">
                    <Bell className="size-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent-highlight)" }} />
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                        Notifications
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                        Event and community email preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Toggle checked={notifyEvents} onChange={setNotifyEvents} label="Event reminders" />
                    <Toggle checked={notifyResources} onChange={setNotifyResources} label="New resource announcements" />
                    <Toggle
                      checked={notifyMarketing}
                      onChange={setNotifyMarketing}
                      label="Marketing from Austin Clinician Circle"
                    />
                  </div>
                  <p className="text-xs mt-4" style={{ color: "var(--color-text-tertiary)" }}>
                    Preferences are stored with your profile when notification APIs are wired.
                  </p>
                </CardBox>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardBox>
    </div>
  );
}
