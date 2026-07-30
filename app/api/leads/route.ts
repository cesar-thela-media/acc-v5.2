import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import { PlaybookDocument } from "@/lib/pdf/playbook";
import { appUrl } from "@/lib/env";

// Next.js App Router default runtime is Node.js and required for renderToBuffer
export const runtime = "nodejs";

const SARAH_EMAIL = process.env.SARAH_EMAIL ?? "sarah@restoredfamily.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Austin Clinician Circle <sarah@restoredfamily.com>";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  // ── Parse & validate ──────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, email } = body as { firstName?: string; email?: string };

  if (!firstName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "firstName and email are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const safeName = firstName.trim().slice(0, 80);
  const safeEmail = email.trim().toLowerCase().slice(0, 254);

  // ── Generate PDF ──────────────────────────────────────────────────────
  let pdfBuffer: Buffer;
  try {
    const pdfArrayBuffer = await renderToBuffer(PlaybookDocument({ firstName: safeName }));
    pdfBuffer = Buffer.from(pdfArrayBuffer);
  } catch (err) {
    console.error("[leads] PDF generation failed:", err);
    return NextResponse.json({ error: "Failed to generate guide. Please try again." }, { status: 500 });
  }

  // ── Send via Resend ───────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev mode: PDF generated successfully but email not sent
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  // 1. Deliver guide to the lead
  const deliveryResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: safeEmail,
    subject: "Your Private Practice Playbook: Austin Clinician Circle",
    html: buildDeliveryEmail(safeName),
    attachments: [
      {
        filename: "private-practice-playbook.pdf",
        content: pdfBuffer,
      },
    ],
  });

  if (deliveryResult.error) {
    console.error("[leads] Resend delivery error:", deliveryResult.error);
    return NextResponse.json({ error: "Failed to send guide. Please try again." }, { status: 502 });
  }

  // 2. Notify Sarah of new lead (fire-and-forget, don't fail the response)
  resend.emails
    .send({
      from: FROM_EMAIL,
      to: SARAH_EMAIL,
      subject: `New lead: ${safeName} (${safeEmail})`,
      html: buildNotificationEmail(safeName, safeEmail),
    })
    .catch((err) => console.error("[leads] Sarah notification failed:", err));

  return NextResponse.json({ ok: true });
}

// ─── Email templates ──────────────────────────────────────────────────────

function buildDeliveryEmail(firstName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Private Practice Playbook</title>
</head>
<body style="margin:0;padding:0;background:#F8FAF3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF3;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(74,94,72,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1B1B1B;padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Austin Clinician Circle</p>
              <h1 style="margin:0;font-size:24px;font-weight:400;color:#ffffff;line-height:1.2;">Your playbook is attached, ${firstName}.</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:15px;color:#444841;line-height:1.65;">
                Thanks for downloading <strong style="color:#1B1B1B;">The Private Practice Playbook</strong>. The PDF is attached to this email, and you can open it now or save it for later.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444841;line-height:1.65;">
                Inside you'll find four frameworks for building a sustainable practice: fee-setting, referral networks, burnout prevention, and community. I wrote it based on the patterns I see in the clinicians who thrive long-term.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444841;line-height:1.65;">
                I'd love to know which section lands most for you. Reply to this email anytime.
              </p>
              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #DFE3DA;margin:0 0 28px;" />
              <!-- CTA -->
              <p style="margin:0 0 12px;font-size:13px;color:#5A7060;font-weight:600;letter-spacing:1px;text-transform:uppercase;">One more thing</p>
              <p style="margin:0 0 16px;font-size:15px;color:#1B1B1B;font-weight:500;">We're accepting founding members right now.</p>
              <p style="margin:0 0 20px;font-size:14px;color:#444841;line-height:1.65;">
                Austin Clinician Circle is a virtual membership network for licensed therapists with monthly case consultation, a vetted referral network, clinical resources, and CEU trainings each month. We're launching with a founding cohort of therapists.
              </p>
              <a href="${appUrl}/join"
                 style="display:inline-block;background:#4A5E48;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:600;">
                Apply for founding membership →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #ECEFE8;">
              <p style="margin:0;font-size:12px;color:#75796E;line-height:1.6;">
                Sarah Arnold, LPC-S · Restored Family Counseling · Austin, TX<br />
                <a href="mailto:sarah@restoredfamily.com" style="color:#4A5E48;">sarah@restoredfamily.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildNotificationEmail(firstName: string, email: string) {
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" });
  return `<!DOCTYPE html>
<html lang="en">
<body style="font-family:Helvetica,Arial,sans-serif;background:#F8FAF3;padding:32px 16px;">
  <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:28px 32px;box-shadow:0 2px 12px rgba(74,94,72,0.06);">
    <tr><td>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#75796E;">New lead</p>
        <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;color:#1B1B1B;">${firstName}</h2>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #DFE3DA;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#75796E;width:120px;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#1B1B1B;"><a href="mailto:${email}" style="color:#4A5E48;">${email}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#75796E;">Source</td>
          <td style="padding:10px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#1B1B1B;">Coming soon: playbook download</td></tr>
        <tr><td style="padding:10px 0;font-size:13px;color:#75796E;">Time (CT)</td>
          <td style="padding:10px 0;font-size:13px;color:#1B1B1B;">${now}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
