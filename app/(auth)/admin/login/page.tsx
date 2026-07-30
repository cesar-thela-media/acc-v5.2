import { SignIn } from "@clerk/nextjs";
import { AdminSignIn } from "@/components/auth/AdminSignIn";
import { hasClerkCredentials } from "@/lib/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Log In | Austin Clinician Circle",
  description: "Log in to the Austin Clinician Circle admin dashboard.",
};

/**
 * Dedicated admin auth surface — visually distinct from member `/sign-in`.
 * Demo/mock mode posts cookies then routes to `/admin`.
 */
export default function AdminLoginPage() {
  if (!hasClerkCredentials) {
    return <AdminSignIn />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F0EDE6" }}>
      <SignIn
        path="/admin/login"
        routing="path"
        signUpUrl="/join"
        fallbackRedirectUrl="/admin"
        forceRedirectUrl="/admin"
        appearance={{
          variables: {
            colorPrimary: "#C2963A",
            colorBackground: "#F0EDE6",
            colorInputBackground: "#ffffff",
            colorInputText: "#1A1A1A",
            borderRadius: "10px",
            fontFamily: "inherit",
          },
          elements: {
            card: { boxShadow: "0 4px 24px rgba(74,94,72,0.10)", border: "1px solid rgba(194,150,58,0.15)" },
            formButtonPrimary: { backgroundColor: "#C2963A" },
            footerActionLink: { color: "#C2963A" },
          },
        }}
      />
    </div>
  );
}
