/**
 * Demo-mode profile persistence via a single JSON cookie.
 * Previously, POST /api/profile only persisted firstName/lastName — all other
 * fields (email, city, license, bio, specialties, format, officeLocation,
 * accepting) were silently discarded. The API route now writes the full payload
 * into a JSON cookie, and this module reads it back so the ProfileForm can
 * hydrate across page loads.
 */
import { cookies } from "next/headers";

const PROFILE_COOKIE = "acc_demo_profile";

export type StoredProfile = {
  email: string;
  city: string;
  licenseType: string;
  licenseNumber: string;
  supervisor: string;
  bio: string;
  specialties: string[];
  format: string;
  officeLocation: string;
  accepting: boolean;
};

const DEFAULT_PROFILE: StoredProfile = {
  email: "jane@example.com",
  city: "Austin, TX",
  licenseType: "LPC",
  licenseNumber: "LPC-80042",
  supervisor: "",
  bio: "I'm a licensed professional counselor in Austin, TX with a focus on trauma and anxiety. I work primarily with adults using EMDR and somatic approaches.",
  specialties: ["Anxiety", "Trauma", "EMDR"],
  format: "Both",
  officeLocation: "",
  accepting: true,
};

/** Server-side: read stored profile from cookie. */
export async function readStoredProfile(): Promise<StoredProfile> {
  const jar = await cookies();
  const raw = jar.get(PROFILE_COOKIE)?.value;
  if (!raw) return { ...DEFAULT_PROFILE };
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}
