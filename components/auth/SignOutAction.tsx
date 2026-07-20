"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/public-env";

type SignOutActionProps = {
  label?: string;
  className?: string;
  style?: CSSProperties;
  onSignedOut?: () => void;
  /** Where to go after sign-out. Defaults to member login. */
  redirectTo?: string;
};

export function SignOutAction({
  label = "Sign out",
  className = "",
  style,
  onSignedOut,
  redirectTo = "/sign-in",
}: SignOutActionProps) {
  const router = useRouter();

  if (!hasClerkPublishableKey) {
    async function handleDemoSignOut() {
      await fetch("/api/mock-auth", { method: "DELETE" });
      onSignedOut?.();
      router.push(redirectTo);
      router.refresh();
    }
    return (
      <button type="button" className={className} style={style} onClick={handleDemoSignOut}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mr-1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        {label}
      </button>
    );
  }

  return (
    <SignOutButton redirectUrl={redirectTo}>
      <button type="button" className={className} style={style} onClick={onSignedOut}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mr-1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        {label}
      </button>
    </SignOutButton>
  );
}
