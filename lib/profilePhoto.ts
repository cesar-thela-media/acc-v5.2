/** Client-side persistence for profile photo (demo mode / no file storage). */
export const PROFILE_PHOTO_KEY = "acc_profile_photo";
export const PROFILE_PHOTO_EVENT = "acc-profile-photo";

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
