import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { setCurrentMemberName } from "@/lib/auth";
import { hasClerkCredentials, hasDatabaseConfig } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  licenseType?: string;
  licenseNumber?: string;
  supervisor?: string;
  bio?: string;
  specialties?: string[];
  format?: string;
  officeLocation?: string;
  accepting?: boolean;
};

const PROFILE_COOKIE = "acc_demo_profile";

function buildProfilePayload(body: ProfilePayload, firstName: string, lastName: string) {
  return {
    email: body.email ?? "",
    city: body.city ?? "",
    licenseType: body.licenseType ?? "",
    licenseNumber: body.licenseNumber ?? "",
    supervisor: body.supervisor ?? "",
    bio: body.bio ?? "",
    specialties: body.specialties ?? [],
    format: body.format ?? "",
    officeLocation: body.officeLocation ?? "",
    accepting: body.accepting ?? true,
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as ProfilePayload;
  const firstName = (body.firstName ?? "").trim().slice(0, 80);
  const lastName = (body.lastName ?? "").trim().slice(0, 80);

  if (!firstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  try {
    await setCurrentMemberName({ firstName, lastName });
  } catch (err) {
    console.error("[profile] failed to update name:", err);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }

  // Demo mode: persist ALL profile fields to a JSON cookie so the form
  // retains email, city, license, bio, specialties, format, officeLocation,
  // and accepting across page loads — not just firstName/lastName.
  if (!hasClerkCredentials) {
    const profilePayload = buildProfilePayload(body, firstName, lastName);
    const value = JSON.stringify(profilePayload);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(PROFILE_COOKIE, value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  // Full practice-profile fields (bio, specialties, format, etc.) need a real
  // signed-in User row to attach to — only possible once Clerk + a live
  // Postgres database are both configured.
  if (hasDatabaseConfig) {
    try {
      const { userId } = await auth();
      if (userId) {
        const displayName = `${firstName} ${lastName}`.trim();
        await prisma.clinicianProfile.upsert({
          where: { userId },
          create: {
            userId,
            slug: userId,
            displayName,
            credentials: body.licenseType ?? "",
            bio: body.bio,
            emailPublic: body.email,
            city: body.city,
            licenseNumber: body.licenseNumber,
            supervisorName: body.supervisor,
            formats: body.format ? [body.format] : [],
            officeLocation: body.officeLocation,
            acceptingClients: body.accepting ?? true,
          },
          update: {
            displayName,
            credentials: body.licenseType ?? "",
            bio: body.bio,
            emailPublic: body.email,
            city: body.city,
            licenseNumber: body.licenseNumber,
            supervisorName: body.supervisor,
            formats: body.format ? [body.format] : [],
            officeLocation: body.officeLocation,
            acceptingClients: body.accepting ?? true,
          },
        });
      }
    } catch (err) {
      console.error("[profile] failed to persist practice profile (continuing anyway):", err);
    }
  }

  return NextResponse.json({ ok: true });
}
