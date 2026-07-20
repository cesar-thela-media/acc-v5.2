import { redirect } from "next/navigation";

/** Free-tier account surface intentionally disabled.
 *  Direct URLs to /dashboard/free now route to /join. The underlying feature
 *  is preserved in git history so it can be restored without a re-merge. */
export default function FreeDashboardPage() {
  redirect("/join");
}
