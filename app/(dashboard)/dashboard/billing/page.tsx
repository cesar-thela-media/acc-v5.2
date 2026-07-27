import { Badge } from "@/components/ui/Badge";
import { CardBox } from "@/components/dashboard/CardBox";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/shadcn/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { getCurrentViewer } from "@/lib/auth";
import { daysFromNow, formatAbbrevDate } from "@/lib/relativeDates";
import { CreditCard, Receipt } from "lucide-react";

/**
 * Demo billing surface for client walkthrough.
 * Shows an active $79 membership matching the dashboard — no Stripe env dumps.
 */
export default async function BillingPage() {
  const viewer = await getCurrentViewer();
  const email = viewer.primaryEmail || "sarah@restoredfamily.com";
  const renewal = formatAbbrevDate(daysFromNow(18));
  const invoiceDate = formatAbbrevDate(daysFromNow(-12));

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
      <PageHeader
        eyebrow="Billing"
        title="Subscription & billing"
        description="Your Austin Clinician Circle membership plan and invoices."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full min-w-0">
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Plan
          </p>
          <p className="text-xl mt-1" style={{ fontFamily: "var(--font-serif), Georgia, serif", color: "var(--color-sage-800)" }}>
            $79
            <span className="text-sm font-normal ml-1" style={{ color: "var(--color-text-tertiary)" }}>/mo</span>
          </p>
        </CardBox>
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Status
          </p>
          <div className="mt-2">
            <Badge variant="success">Active</Badge>
          </div>
        </CardBox>
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Renewal
          </p>
          <p className="text-sm mt-2 font-medium" style={{ color: "var(--color-sage-800)" }}>
            {renewal}
          </p>
        </CardBox>
      </div>

      <CardBox>
        <Progress value={72}>
          <ProgressLabel>Billing period</ProgressLabel>
          <ProgressValue />
        </Progress>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
          Approximate progress through the current membership period.
        </p>
      </CardBox>

      <CardBox className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(194,150,58,0.14)", color: "#C2963A" }}
            >
              <CreditCard className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--color-sage-800)" }}>
                Austin Clinician Circle membership
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                Full access to consultation, resources, events, and CEU materials.
              </p>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        <div
          className="rounded-xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ background: "var(--color-cream-100)", border: "1px solid var(--color-cream-300)" }}
        >
          <div>
            <p
              className="text-2xl font-light"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 400,
                color: "var(--color-sage-700)",
              }}
            >
              $79
              <span className="text-sm font-normal ml-1" style={{ color: "var(--color-text-tertiary)" }}>
                /month
              </span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Renews {renewal} · Billed monthly
            </p>
          </div>
          <div className="text-xs sm:text-right" style={{ color: "var(--color-text-tertiary)" }}>
            {email}
          </div>
        </div>

        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Payment method updates and cancellations are managed with Sarah after membership is active.
          Email{" "}
          <a href="mailto:sarah@restoredfamily.com" className="underline" style={{ color: "var(--color-sage-700)" }}>
            sarah@restoredfamily.com
          </a>{" "}
          for billing questions.
        </p>
      </CardBox>

      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-sage-900)" }}>
          Invoice history
        </h2>
        <CardBox className="hidden md:block !p-0 overflow-hidden" padding={false}>
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--color-cream-100)] hover:bg-[var(--color-cream-100)]">
                <TableHead className="px-6">Invoice</TableHead>
                <TableHead className="px-6">Date</TableHead>
                <TableHead className="px-6">Amount</TableHead>
                <TableHead className="px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="px-6" style={{ color: "var(--color-text-primary)" }}>
                  ACC-2026-0042
                </TableCell>
                <TableCell className="px-6" style={{ color: "var(--color-text-secondary)" }}>
                  {invoiceDate}
                </TableCell>
                <TableCell className="px-6 font-medium" style={{ color: "var(--color-text-primary)" }}>
                  $79.00
                </TableCell>
                <TableCell className="px-6">
                  <Badge variant="success">Paid</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBox>
        <CardBox className="md:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                ACC-2026-0042
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                {invoiceDate}
              </p>
            </div>
            <Badge variant="success">Paid</Badge>
          </div>
          <p className="text-sm font-medium">$79.00</p>
        </CardBox>
      </div>

      <CardBox className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Receipt className="size-5 shrink-0 mt-0.5" style={{ color: "var(--color-text-tertiary)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Cancel anytime
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              You keep access through the end of the paid period. Contact Sarah to cancel.
            </p>
          </div>
        </div>
        <Badge variant="default">Monthly</Badge>
      </CardBox>
    </div>
  );
}
