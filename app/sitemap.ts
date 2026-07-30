import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";

const routes = ["", "/who-we-are", "/what-we-offer", "/find-a-clinician", "/join", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
