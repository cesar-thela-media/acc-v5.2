import { hasRobollyConfig } from "@/lib/env";
import { getCurrentMemberName } from "@/lib/auth";
import { FilesClient } from "./FilesClient";

export default async function FilesPage() {
  const { firstName, lastName } = await getCurrentMemberName();
  const memberName = [firstName, lastName].filter(Boolean).join(" ") || "Member";
  return (
    <FilesClient hasCertificates={hasRobollyConfig} memberName={memberName} />
  );
}
