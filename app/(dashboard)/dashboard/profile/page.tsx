import { getCurrentMemberName, getCurrentViewer } from "@/lib/auth";
import { readStoredProfile } from "@/lib/profile-store";
import { hasClerkCredentials } from "@/lib/env";
import { DEFAULT_PROFILE_PHOTO } from "@/lib/profilePhoto";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const [{ firstName, lastName }, viewer] = await Promise.all([
    getCurrentMemberName(),
    getCurrentViewer(),
  ]);
  // Same photo source as the dashboard header avatar:
  // Clerk image when configured, otherwise demo headshot.
  const initialPhotoUrl =
    hasClerkCredentials && viewer.user?.imageUrl
      ? viewer.user.imageUrl
      : DEFAULT_PROFILE_PHOTO;
  // Read full profile from cookie in demo mode so all fields survive refresh.
  const storedProfile = hasClerkCredentials ? null : await readStoredProfile();
  return (
    <ProfileForm
      initialFirstName={firstName}
      initialLastName={lastName}
      initialProfile={storedProfile}
      initialPhotoUrl={initialPhotoUrl}
    />
  );
}
