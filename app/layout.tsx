import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { AosInit } from "@/components/AosInit";
import { appUrl, hasClerkCredentials } from "@/lib/env";

/* Playfair Display — high-contrast editorial display serif with beautiful calligraphic italic.
   Closest Google Fonts match to Tiempos Fine / Freight Display Light style.
   Weight 400 at large display sizes shows hairline thin strokes with dramatic thick-thin contrast. */
const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* DM Sans — clean humanist sans for body & UI */
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Austin Clinician Circle",
  description:
    "Austin Clinician Circle, a membership community for licensed clinicians in Austin, TX. Deepen your work. Find your community.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const appShell = (
    <>
      <AosInit />
      {children}
    </>
  );

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {hasClerkCredentials ? <ClerkProvider>{appShell}</ClerkProvider> : appShell}
      </body>
    </html>
  );
}
