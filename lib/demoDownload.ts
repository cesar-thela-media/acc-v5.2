/** Client-side file download helpers for demo mode (no cloud storage). */

export function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function slugifyFilename(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "download"
  );
}

/** Demo resource packet — text stand-in until real file storage is connected. */
export function downloadResourcePacket(resource: {
  title: string;
  category: string;
  type: string;
  description: string;
  date?: string;
}) {
  const body = [
    "Austin Clinician Circle — Resource Library",
    "==========================================",
    "",
    `Title: ${resource.title}`,
    `Category: ${resource.category}`,
    `Type: ${resource.type}`,
    resource.date ? `Added: ${resource.date}` : "",
    "",
    resource.description,
    "",
    "---",
    "This is a demo download for local/preview environments.",
    "Replace with the real file once storage is connected.",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  downloadTextFile(`${slugifyFilename(resource.title)}.txt`, body);
}

/** Demo CEU certificate when Robolly is not configured. */
export function downloadDemoCertificate(opts: {
  memberName: string;
  workshop: string;
  ceus: number | string;
  date?: string;
}) {
  const date = opts.date || new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const body = [
    "AUSTIN CLINICIAN CIRCLE",
    "Certificate of Attendance",
    "========================",
    "",
    `This certifies that`,
    "",
    `  ${opts.memberName}`,
    "",
    `attended`,
    "",
    `  ${opts.workshop}`,
    "",
    `for ${opts.ceus} continuing education unit(s).`,
    "",
    `Date: ${date}`,
    "",
    "Sarah Arnold, LPC-S",
    "Founder, Austin Clinician Circle",
    "",
    "---",
    "Demo certificate (Robolly not configured). Not valid for official CE reporting.",
    "",
  ].join("\n");

  downloadTextFile(
    `certificate-${slugifyFilename(opts.workshop)}.txt`,
    body,
  );
}
