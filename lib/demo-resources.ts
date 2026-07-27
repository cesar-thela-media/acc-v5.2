/**
 * Shared demo resources for admin library ↔ member library.
 * Client-only localStorage — presentation walkthrough, no backend.
 */

export const DEMO_RESOURCES_KEY = "acc-demo-resources";

export type DemoResource = {
  id: number;
  title: string;
  category: string;
  type: string;
  published: string;
  publishedSort: string;
  downloads: number;
  description: string;
};

export const SEED_DEMO_RESOURCES: DemoResource[] = [
  {
    id: 1,
    title: "CBT Session Planning Template",
    category: "Clinical Tools",
    type: "PDF",
    published: "Apr 18, 2026",
    publishedSort: "2026-04-18",
    downloads: 14,
    description: "A structured template for planning CBT sessions across presenting concerns.",
  },
  {
    id: 2,
    title: "Psychoeducation: Anxiety Handout",
    category: "Handouts",
    type: "PDF",
    published: "Apr 15, 2026",
    publishedSort: "2026-04-15",
    downloads: 22,
    description: "Client-facing psychoeducation on the anxiety cycle, suitable for most adult clients.",
  },
  {
    id: 3,
    title: "Fee Setting for Private Practice",
    category: "Business",
    type: "Guide",
    published: "Apr 10, 2026",
    publishedSort: "2026-04-10",
    downloads: 19,
    description: "A practical guide to setting, communicating, and adjusting fees in private practice.",
  },
  {
    id: 4,
    title: "Attachment Styles Explainer",
    category: "Handouts",
    type: "PDF",
    published: "Apr 8, 2026",
    publishedSort: "2026-04-08",
    downloads: 31,
    description: "One-page overview of attachment styles for client psychoeducation.",
  },
  {
    id: 5,
    title: "EMDR Phase Protocol Checklist",
    category: "Clinical Tools",
    type: "PDF",
    published: "Apr 3, 2026",
    publishedSort: "2026-04-03",
    downloads: 17,
    description: "Phase-by-phase checklist for standard EMDR protocol.",
  },
  {
    id: 6,
    title: "Marketing for Therapists: Getting Started",
    category: "Business",
    type: "Guide",
    published: "Mar 28, 2026",
    publishedSort: "2026-03-28",
    downloads: 25,
    description: "How to build an effective online presence and fill your caseload.",
  },
  {
    id: 7,
    title: "Burnout Self-Assessment",
    category: "Self-Care",
    type: "Worksheet",
    published: "Mar 22, 2026",
    publishedSort: "2026-03-22",
    downloads: 38,
    description: "A clinician self-assessment tool for recognizing and tracking burnout symptoms.",
  },
  {
    id: 8,
    title: "Trauma-Informed Care Intro",
    category: "Clinical Tools",
    type: "Video",
    published: "Feb 28, 2026",
    publishedSort: "2026-02-28",
    downloads: 42,
    description: "Introduction to trauma-informed principles for general clinical practice.",
  },
];
