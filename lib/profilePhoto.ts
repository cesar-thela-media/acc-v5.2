/** Client-side persistence for profile photo (demo mode / no file storage). */
export const PROFILE_PHOTO_KEY = "acc_profile_photo";
export const PROFILE_PHOTO_EVENT = "acc-profile-photo";

/**
 * Demo / fallback headshot used in member + admin shells and profile banner
 * when Clerk has no imageUrl and the user has not uploaded a custom photo.
 */
export const DEFAULT_PROFILE_PHOTO = "/sarah-arnold.jpeg";

export function readStoredProfilePhoto(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PROFILE_PHOTO_KEY);
  } catch {
    return null;
  }
}

export function writeStoredProfilePhoto(dataUrl: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (dataUrl) localStorage.setItem(PROFILE_PHOTO_KEY, dataUrl);
    else localStorage.removeItem(PROFILE_PHOTO_KEY);
    window.dispatchEvent(new Event(PROFILE_PHOTO_EVENT));
  } catch {
    // Quota or private mode — ignore; UI still shows in-memory preview.
  }
}

/** Prefer uploaded local photo, then server/Clerk URL, then demo default. */
export function resolveProfilePhotoUrl(
  storedOrUploaded: string | null | undefined,
  fallbackUrl?: string | null,
): string {
  if (storedOrUploaded) return storedOrUploaded;
  if (fallbackUrl) return fallbackUrl;
  return DEFAULT_PROFILE_PHOTO;
}
