"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { readStoredProfilePhoto, writeStoredProfilePhoto } from "@/lib/profilePhoto";

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
}: {
  initialFirstName: string;
  initialLastName: string;
}) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("jane@example.com");
  const [city, setCity] = useState("Austin, TX");
  const [licenseType, setLicenseType] = useState("LPC");
  const [licenseNumber, setLicenseNumber] = useState("LPC-80042");
  const [supervisor, setSupervisor] = useState("");
  const [bio, setBio] = useState(
    "I'm a licensed professional counselor in Austin, TX with a focus on trauma and anxiety. I work primarily with adults using EMDR and somatic approaches."
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(["Anxiety", "Trauma", "EMDR"]);
  const [format, setFormat] = useState("Both");
  const [officeLocation, setOfficeLocation] = useState("");
  const [accepting, setAccepting] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore photo across navigations (localStorage — no file host in demo).
  useEffect(() => {
    const stored = readStoredProfilePhoto();
    if (stored) setPhotoPreview(stored);
  }, []);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Photo must be 2MB or smaller.");
        return;
      }
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
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
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
      // Re-persist photo on save so nav avatar stays in sync.
      if (photoPreview) writeStoredProfilePhoto(photoPreview);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="flex flex-col gap-8 max-w-4xl"
      style={{
        ["--input-label-color" as string]: "var(--color-text-secondary)",
        ["--input-hint-color" as string]: "var(--color-text-tertiary)",
        ["--input-text-color" as string]: "var(--color-text-primary)",
      }}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--color-sage-600)" }}>Profile</p>
        <h1 className="text-page-title">
          Edit your profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Your profile appears in The Circle member directory and clinician search. Your name here is also used on your membership certificate.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Photo */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-sage-700)" }}>Photo</h2>
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium overflow-hidden shrink-0"
              style={{ background: photoPreview ? "transparent" : "var(--color-sage-100)", color: "var(--color-sage-500)" }}
            >
              {photoPreview ? (
                // next/image's optimizer doesn't handle data: URLs (a local, unsaved
                // file preview) — a plain <img> is the correct choice here.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                (firstName || "?").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Upload profile photo"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handlePhotoClick}>
                {photoPreview ? "Change photo" : "Upload photo"}
              </Button>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                JPG or PNG. 2MB max. Square crops best.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ borderColor: "rgba(194,150,58,0.12)" }} />

        {/* Basic info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-sage-700)" }}>Basic information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} name="firstName" />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} name="lastName" />
          </div>
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
          <Input label="City, State" value={city} onChange={(e) => setCity(e.target.value)} name="city" hint="Displayed publicly on your profile." />
        </section>

        <hr style={{ borderColor: "rgba(194,150,58,0.12)" }} />

        {/* Credentials */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-sage-700)" }}>Credentials</h2>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>License type</label>
            <div className="flex flex-wrap gap-2">
              {LICENSE_TYPES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLicenseType(l)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: licenseType === l ? "var(--color-accent-highlight)" : "#fff",
                    color: licenseType === l ? "#fff" : "var(--color-sage-700)",
                    border: `1px solid ${licenseType === l ? "var(--color-accent-highlight)" : "rgba(194,150,58,0.18)"}`,
                  }}
                >{l}</button>
              ))}
            </div>
          </div>
          <Input label="License number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} name="licenseNumber" />
          <Input label="Supervising clinician (if applicable)" placeholder="Name, credentials" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} name="supervisor" />
        </section>

        <hr style={{ borderColor: "rgba(194,150,58,0.12)" }} />

        {/* Bio & specialties */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-sage-700)" }}>Practice profile</h2>
          <Textarea
            label="Professional bio"
            name="bio"
            rows={5}
            hint="Shown on your public directory listing. Write in first person, for a clinical audience."
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
                    style={{
                      background: sel ? "var(--color-accent-highlight)" : "#fff",
                      color: sel ? "#fff" : "var(--color-sage-700)",
                      border: `1px solid ${sel ? "var(--color-accent-highlight)" : "rgba(194,150,58,0.18)"}`,
                    }}
                  >{s}</button>
                );
              })}
            </div>
          </div>
        </section>

        <hr style={{ borderColor: "rgba(194,150,58,0.12)" }} />

        {/* Availability */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-sage-700)" }}>Availability</h2>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Service format</label>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: format === f ? "var(--color-accent-highlight)" : "#fff",
                    color: format === f ? "#fff" : "var(--color-sage-700)",
                    border: `1px solid ${format === f ? "var(--color-accent-highlight)" : "rgba(194,150,58,0.18)"}`,
                  }}
                >{f}</button>
              ))}
            </div>
          </div>
          {(format === "In-person" || format === "Both") && (
            <Input
              label="Office location"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              placeholder="Ex: South Austin, Westlake, Cedar Park, Dallas"
              hint="Shown on your public directory listing so clients know where you practice."
            />
          )}
          <Toggle checked={accepting} onChange={setAccepting} label="Currently accepting new clients" />
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" size="md" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {saved && (
            <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
              Profile saved.
            </p>
          )}
          {error && (
            <p className="text-sm font-medium" style={{ color: "var(--color-error)" }}>
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
