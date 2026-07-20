import { SignIn } from "@clerk/nextjs";
import { MockSignIn } from "@/components/auth/MockSignIn";
import { hasClerkCredentials } from "@/lib/env";

export default function SignInPage() {
  if (!hasClerkCredentials) {
    return <MockSignIn showFreePreview={false} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F0EDE6" }}>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/join"
        fallbackRedirectUrl="/dashboard"
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
            card: { boxShadow: "0 4px 24px rgba(45,59,44,0.10)", border: "1px solid rgba(194,150,58,0.15)" },
            formButtonPrimary: { backgroundColor: "#C2963A" },
            footerActionLink: { color: "#C2963A" },
          },
        }}
      />
    </div>
  );
}
