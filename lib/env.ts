const PLACEHOLDER_MARKERS = ["replace_me", "pk_test_replace_me", "sk_test_replace_me", "whsec_replace_me", "price_replace_me"];

export function isConfigured(value: string | undefined | null) {
  if (!value) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

/** Prefer explicit app URL; on Vercel fall back to the deployment host so OG/metadata aren't localhost. */
export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const hasClerkCredentials =
  isConfigured(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  isConfigured(process.env.CLERK_SECRET_KEY);

export const hasStripeSandboxConfig =
  isConfigured(process.env.STRIPE_SECRET_KEY) &&
  isConfigured(process.env.STRIPE_PRICE_ID);

export const hasDatabaseConfig = isConfigured(process.env.DATABASE_URL);

export const hasRobollyConfig =
  isConfigured(process.env.ROBOLLY_API_KEY) && isConfigured(process.env.ROBOLLY_TEMPLATE_ID);

export const robollyNameElement = process.env.ROBOLLY_NAME_ELEMENT || "Name";
export const robollyDateElement = process.env.ROBOLLY_DATE_ELEMENT || "Date";
export const robollyWorkshopElement = process.env.ROBOLLY_WORKSHOP_ELEMENT || "Workshop Title";
export const robollyCeHoursElement = process.env.ROBOLLY_CE_HOURS_ELEMENT || "CE Hour Total";

export const clerkAdminEmails = (process.env.CLERK_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const stripeSandboxSuccessUrl =
  process.env.STRIPE_SANDBOX_SUCCESS_URL || `${appUrl}/dashboard/billing?checkout=success`;

export const stripeSandboxCancelUrl =
  process.env.STRIPE_SANDBOX_CANCEL_URL || `${appUrl}/join?checkout=cancelled`;
