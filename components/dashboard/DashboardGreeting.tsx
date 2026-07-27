"use client";

import { useEffect, useState } from "react";

/** Client-only greeting so SSR/client clocks never hydrate-mismatch. */
export function DashboardGreeting({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <>
      {greeting}, {firstName}.
    </>
  );
}
