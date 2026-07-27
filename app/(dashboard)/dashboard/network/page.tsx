import Link from "next/link";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";

/** Demo stub — referral network not in this walkthrough build. */
export default function NetworkPage() {
  return (
    <div className="flex flex-col gap-5 w-full min-w-0">
      <PageHeader
        eyebrow="Network"
        title="Referral network"
        description="Coming later — not part of this product preview."
      />
      <CardBox className="py-16 text-center flex flex-col items-center gap-4">
        <p
          className="text-2xl"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            color: "var(--color-sage-800)",
          }}
        >
          Coming soon
        </p>
        <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          Member-to-member referrals will live here after launch. For this preview, use events and
          resources from the sidebar.
        </p>
        <Link
          href="/dashboard"
          className="text-sm font-semibold underline"
          style={{ color: "#B8892E", textUnderlineOffset: "3px" }}
        >
          Back to overview
        </Link>
      </CardBox>
    </div>
  );
}
