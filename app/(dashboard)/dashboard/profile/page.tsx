import { getCurrentMemberName } from "@/lib/auth";
import { readStoredProfile } from "@/lib/profile-store";
import { hasClerkCredentials } from "@/lib/env";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const { firstName, lastName } = await getCurrentMemberName();
  // Read full profile from cookie in demo mode so all fields survive refresh.
  const storedProfile = hasClerkCredentials ? null : await readStoredProfile();
  return (
    <ProfileForm
      initialFirstName={firstName}
      initialLastName={lastName}
      initialProfile={storedProfile}
    />
  );
}
