import { redirect } from "next/navigation";

/** /dashboard/network intentionally disabled — the Referral Network feature is
 *  no longer part of the member experience. URL hits redirect to the
 *  dashboard. The page is preserved in git history for fast restoration. */
export default function NetworkPage() {
  redirect("/dashboard");
}
