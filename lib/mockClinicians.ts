/**
 * Placeholder directory data for layout preview only.
 * Card shape follows restoredfamily.com/team UI patterns — names/photos are not real members.
 */
export type MockClinician = {
  name: string;
  role: string;
  specialties: string[];
  format: string;
  rate: string;
};

export const MOCK_CLINICIANS: MockClinician[] = [
  { name: "Alex Morgan", role: "Licensed Professional Counselor", specialties: ["Anxiety", "Depression", "Trauma"], format: "Virtual only", rate: "$150/session" },
  { name: "Jordan Lee", role: "Licensed Clinical Social Worker", specialties: ["Couples", "Attachment", "Grief"], format: "Virtual & In-Person", rate: "$140/session" },
  { name: "Casey Rivera", role: "Licensed Marriage & Family Therapist", specialties: ["Family", "Anxiety", "Teens"], format: "Hybrid", rate: "Inquire for details" },
  { name: "Riley Chen", role: "Licensed Professional Counselor", specialties: ["OCD", "Anxiety", "ERP"], format: "Virtual only", rate: "$160/session" },
  { name: "Sam Patel", role: "Licensed Professional Counselor Associate", specialties: ["Burnout", "Mindfulness", "Stress"], format: "In-person only", rate: "$125/session" },
  { name: "Taylor Brooks", role: "Licensed Clinical Social Worker", specialties: ["Perinatal", "Postpartum", "Women"], format: "Hybrid", rate: "Inquire for details" },
  { name: "Morgan Ellis", role: "Licensed Professional Counselor", specialties: ["LGBTQ+", "Identity", "Couples"], format: "Virtual only", rate: "$145/session" },
  { name: "Avery Quinn", role: "Licensed Professional Counselor Associate", specialties: ["Adolescents", "Transitions", "Anxiety"], format: "Hybrid", rate: "$130/session" },
  { name: "Jamie Torres", role: "Licensed Psychologist", specialties: ["Trauma", "Workplace", "Identity"], format: "Virtual only", rate: "$175/session" },
];

export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
