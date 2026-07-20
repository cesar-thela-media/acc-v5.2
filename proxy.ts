import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextMiddleware } from "next/server";
import { hasClerkCredentials } from "@/lib/env";

// When Clerk isn't configured, gate /dashboard routes behind the demo-auth
// cookie instead, so unauthenticated visitors (e.g. clicking a footer link)
// land on /sign-in rather than straight into the dashboard.
const demoAuthProxy: NextMiddleware = (req) => {
  const { pathname } = req.nextUrl;
  const hasDemo = Boolean(req.cookies.get("acc_demo_email")?.value);

  // Member portal
  if (pathname.startsWith("/dashboard") && !hasDemo) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Admin portal — dedicated login at /admin/login (not member /sign-in)
  const isAdminLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  if (pathname.startsWith("/admin") && !isAdminLogin && !hasDemo) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
};

export default hasClerkCredentials ? clerkMiddleware() : demoAuthProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
