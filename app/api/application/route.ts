import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const SARAH_EMAIL = process.env.SARAH_EMAIL ?? "sarah@restoredfamily.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "Austin Clinician Circle <sarah@restoredfamily.com>";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, licenseType } = body;

  if (!firstName || !lastName || !email || !licenseType) {
    return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
  }
  if (!isValidEmail(String(email))) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const safeFirst = String(firstName).trim().slice(0, 80);
  const safeLast = String(lastName).trim().slice(0, 80);
  const safeEmail = String(email).trim().toLowerCase().slice(0, 254);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:9px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#75796E;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid #DFE3DA;font-size:13px;color:#1B1B1B;">${value || "Not provided"}</td>
    </tr>`;

  const specialties = Array.isArray(body.specialties)
    ? (body.specialties as string[]).join(", ")
    : "";
  const modalities = Array.isArray(body.modalities)
    ? (body.modalities as string[]).join(", ")
    : "";

  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const sarahHtml = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:Helvetica,Arial,sans-serif;background:#F8FAF3;padding:32px 16px;margin:0;">
  <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(74,93,78,0.07);">
    <tr><td style="background:#2D3B2C;padding:28px 36px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Austin Clinician Circle</p>
      <h1 style="margin:0;font-size:22px;font-weight:400;color:#fff;">New membership application</h1>
    </td></tr>
    <tr><td style="padding:28px 36px;">
      <p style="margin:0 0 20px;font-size:15px;color:#444841;line-height:1.6;">
        <strong>${safeFirst} ${safeLast}</strong> submitted an application on ${now} (CT).
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #DFE3DA;">
        ${row("Name", `${safeFirst} ${safeLast}`)}
        ${row("Email", `<a href="mailto:${safeEmail}" style="color:#4A5D4E;">${safeEmail}</a>`)}
        ${row("Phone", String(body.phone || ""))}
        ${row("License type", String(body.licenseType || ""))}
        ${row("License number", String(body.licenseNumber || ""))}
        ${row("Years licensed", String(body.yearsLicensed || ""))}
        ${row("Practice name", String(body.practiceName || ""))}
        ${row("City / area", String(body.practiceCity || ""))}
        ${row("Format", String(body.format || ""))}
        ${row("Specialties", specialties)}
        ${row("Modalities", modalities)}
        ${row("Bio", String(body.bio || ""))}
        ${row("Why Austin Clinician Circle", String(body.whyCircle || ""))}
      </table>
    </td></tr>
    <tr><td style="padding:16px 36px 28px;border-top:1px solid #ECEFE8;">
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#2D3B2C;color:#fff;text-decoration:none;padding:11px 22px;border-radius:100px;font-size:13px;font-weight:600;">
        Reply to ${safeFirst} →
      </a>
    </td></tr>
  </table>
</body>
</html>`;

  const notifyResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: SARAH_EMAIL,
    subject: `Application: ${safeFirst} ${safeLast} (${safeEmail})`,
    html: sarahHtml,
  });

  if (notifyResult.error) {
    console.error("[application] Resend error:", notifyResult.error);
    return NextResponse.json(
      { error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  const confirmHtml = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:Helvetica,Arial,sans-serif;background:#F8FAF3;padding:32px 16px;margin:0;">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(74,93,78,0.08);">
    <tr><td style="background:#2D3B2C;padding:32px 40px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Austin Clinician Circle</p>
      <h1 style="margin:0;font-size:24px;font-weight:400;color:#fff;line-height:1.25;">Your application is in, ${safeFirst}.</h1>
    </td></tr>
    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 16px;font-size:15px;color:#444841;line-height:1.65;">
        Thank you for applying to Austin Clinician Circle. Sarah reviews every application personally and will be in touch within a few business days.
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:#444841;line-height:1.65;">
        In the meantime, if you have any questions you can reply to this email or reach Sarah directly at
        <a href="mailto:sarah@restoredfamily.com" style="color:#4A5D4E;">sarah@restoredfamily.com</a>.
      </p>
      <hr style="border:none;border-top:1px solid #DFE3DA;margin:0 0 28px;" />
      <p style="margin:0;font-size:13px;color:#75796E;line-height:1.6;">
        Sarah Arnold, LPC-S · Austin Clinician Circle · Austin, TX
      </p>
    </td></tr>
  </table>
</body>
</html>`;

  resend.emails
    .send({
      from: FROM_EMAIL,
      to: safeEmail,
      subject: "Your application to Austin Clinician Circle, received",
      html: confirmHtml,
    })
    .catch((err) => console.error("[application] confirmation email failed:", err));

  return NextResponse.json({ ok: true });
}
