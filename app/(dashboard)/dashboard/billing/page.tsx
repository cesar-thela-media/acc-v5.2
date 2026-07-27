import Stripe from "stripe";
import { BillingActions } from "@/components/billing/BillingActions";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/shadcn/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/shadcn/empty";
import { getCurrentViewer } from "@/lib/auth";
import { hasClerkCredentials, hasStripeSandboxConfig } from "@/lib/env";
import { findSandboxCustomerByEmail, getStripe } from "@/lib/stripe";
import { CreditCard, Info, Receipt } from "lucide-react";

function formatMoney(amount?: number | null, currency = "usd") {
  if (amount == null) return "Not available yet";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value?: number | string | null) {
  if (!value) return "Not available yet";
  const date = new Date(typeof value === "number" ? value * 1000 : value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toBadgeVariant(status?: string | null) {
  if (status === "active") return "success" as const;
  if (status === "trialing") return "accent" as const;
  if (status === "past_due" || status === "unpaid") return "warning" as const;
  if (status === "canceled") return "error" as const;
  return "default" as const;
}

function toLabel(status?: string | null, hasCustomer?: boolean) {
  if (!status) return hasCustomer ? "Customer created" : "Not started";
  return status.replace(/_/g, " ");
}

export default async function BillingPage() {
  const viewer = await getCurrentViewer();
  let customer: Stripe.Customer | null = null;
  let subscription: Stripe.Subscription | null = null;
  let invoices: Stripe.Invoice[] = [];

  if (hasStripeSandboxConfig && viewer.primaryEmail) {
    const foundCustomer = await findSandboxCustomerByEmail(viewer.primaryEmail);
    if (foundCustomer && !("deleted" in foundCustomer && foundCustomer.deleted)) {
      customer = foundCustomer;
      const stripe = getStripe();
      const subscriptionList = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 1,
      });
      subscription = subscriptionList.data[0] ?? null;

      const invoiceList = await stripe.invoices.list({
        customer: customer.id,
        limit: 5,
      });
      invoices = invoiceList.data;
    }
  }

  const planAmount = subscription?.items.data[0]?.price.unit_amount ?? null;
  const planCurrency = subscription?.currency ?? "usd";
  const renewalDate = subscription?.items.data[0]?.current_period_end
    ? formatDate(subscription.items.data[0].current_period_end)
    : customer
      ? "Awaiting first sandbox invoice"
      : "Not started";

  const sandboxCopy = hasStripeSandboxConfig
    ? "Stripe is configured for test mode. Use test cards and webhook forwarding to validate checkout, renewals, failures, and cancellation flows safely."
    : "Add STRIPE_SECRET_KEY, STRIPE_PRICE_ID, and STRIPE_WEBHOOK_SECRET test values in .env to enable sandbox billing.";

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
      <PageHeader
        eyebrow="Billing"
        title="Subscription & billing"
        description="Sandbox-ready Stripe billing for Austin Clinician Circle membership."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full min-w-0">
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Plan
          </p>
          <p className="text-xl mt-1" style={{ fontFamily: "var(--font-serif), Georgia, serif", color: "var(--color-sage-800)" }}>
            {formatMoney(planAmount, planCurrency)}
            <span className="text-sm font-normal ml-1" style={{ color: "var(--color-text-tertiary)" }}>/mo</span>
          </p>
        </CardBox>
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Status
          </p>
          <div className="mt-2">
            <Badge variant={toBadgeVariant(subscription?.status)}>
              {toLabel(subscription?.status, Boolean(customer))}
            </Badge>
          </div>
        </CardBox>
        <CardBox>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
            Renewal
          </p>
          <p className="text-sm mt-2 font-medium" style={{ color: "var(--color-sage-800)" }}>
            {renewalDate}
          </p>
        </CardBox>
      </div>

      {isActive && (
        <CardBox>
          <Progress value={72}>
            <ProgressLabel>Billing period</ProgressLabel>
            <ProgressValue />
          </Progress>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
            Approximate progress through the current membership period.
          </p>
        </CardBox>
      )}

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
                Full access to community resources, events, and the member directory.
              </p>
            </div>
          </div>
          <Badge variant={toBadgeVariant(subscription?.status)}>
            {toLabel(subscription?.status, Boolean(customer))}
          </Badge>
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
              {formatMoney(planAmount, planCurrency)}
              <span className="text-sm font-normal ml-1" style={{ color: "var(--color-text-tertiary)" }}>
                /month
              </span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              {renewalDate} · {hasStripeSandboxConfig ? "Sandbox billing active" : "Sandbox not configured"}
            </p>
          </div>
          <div className="text-xs sm:text-right" style={{ color: "var(--color-text-tertiary)" }}>
            {viewer.primaryEmail ||
              "Sign in with Clerk sandbox auth to attach billing to an account."}
          </div>
        </div>

        <div
          className="rounded-xl px-4 sm:px-5 py-4 flex flex-col gap-1"
          style={{ background: "var(--color-cream-100)", border: "1px solid var(--color-cream-300)" }}
        >
          <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Sandbox customer
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-primary)" }}>
            {customer
              ? `Stripe customer ${customer.id}`
              : "No sandbox customer exists for this account yet."}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Payment methods, invoices, and cancellations are managed through Stripe&apos;s test
            customer portal.
          </p>
        </div>

        <BillingActions
          hasStripeSandboxConfig={hasStripeSandboxConfig && hasClerkCredentials}
          hasActiveCustomer={Boolean(customer)}
        />
      </CardBox>

      <Alert variant="sage">
        <Info />
        <AlertTitle>Stripe sandbox mode</AlertTitle>
        <AlertDescription>
          {sandboxCopy} Recommended test card: 4242 4242 4242 4242 · Webhook: /api/stripe/webhook
        </AlertDescription>
      </Alert>

      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-sage-900)" }}>
          Invoice history
        </h2>
        {invoices.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>No invoices yet</EmptyTitle>
              <EmptyDescription>
                Once you complete a test checkout, invoice history will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="md:hidden flex flex-col gap-3">
              {invoices.map((invoice) => (
                <CardBox key={invoice.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {invoice.number || invoice.id}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                        {formatDate(invoice.created)}
                      </p>
                    </div>
                    <Badge variant={toBadgeVariant(invoice.status)}>
                      {toLabel(invoice.status, true)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {formatMoney(
                        invoice.amount_paid || invoice.amount_due,
                        invoice.currency || "usd",
                      )}
                    </p>
                    {invoice.invoice_pdf ? (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline"
                        style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
                      >
                        Download
                      </a>
                    ) : null}
                  </div>
                </CardBox>
              ))}
            </div>
            <CardBox className="hidden md:block !p-0 overflow-hidden" padding={false}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--color-cream-100)] hover:bg-[var(--color-cream-100)]">
                    <TableHead className="px-6">Invoice</TableHead>
                    <TableHead className="px-6">Date</TableHead>
                    <TableHead className="px-6">Amount</TableHead>
                    <TableHead className="px-6">Status</TableHead>
                    <TableHead className="px-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="px-6" style={{ color: "var(--color-text-primary)" }}>
                        {invoice.number || invoice.id}
                      </TableCell>
                      <TableCell className="px-6" style={{ color: "var(--color-text-secondary)" }}>
                        {formatDate(invoice.created)}
                      </TableCell>
                      <TableCell className="px-6 font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {formatMoney(
                          invoice.amount_paid || invoice.amount_due,
                          invoice.currency || "usd",
                        )}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge variant={toBadgeVariant(invoice.status)}>
                          {toLabel(invoice.status, true)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        {invoice.invoice_pdf ? (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs underline"
                            style={{ color: "var(--color-sage-700)", textUnderlineOffset: "3px" }}
                          >
                            Download
                          </a>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBox>
          </>
        )}
      </div>

      <CardBox className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Cancellation flow
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            Sandbox cancellations are handled through the Stripe customer portal so you can validate
            end-of-period cancellation without touching live billing.
          </p>
        </div>
        <Badge variant={hasStripeSandboxConfig ? "warning" : "default"}>
          {hasStripeSandboxConfig ? "Test mode only" : "Awaiting Stripe config"}
        </Badge>
      </CardBox>
    </div>
  );
}
