import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Austin Clinician Circle",
  description: "Privacy policy for Austin Clinician Circle.",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you apply for membership, download a resource, or contact us, we collect the information you provide directly: your name, email, phone number, and professional details like license type and number. If you subscribe, payment details are collected and processed securely by Stripe. We never see or store your card information ourselves.",
  },
  {
    title: "How we use it",
    body: "We use your information to review membership applications, deliver the resources you request, send you information about events and your account, and process billing. We don't use your information for anything beyond running Austin Clinician Circle.",
  },
  {
    title: "What we don't do",
    body: "We don't sell your information, and we don't share it with third parties for marketing purposes. Your directory listing (if you're an active member) is visible to other members and, for approved public-directory fields, to prospective clients, and nothing beyond that.",
  },
  {
    title: "Your rights",
    body: "You can ask us to update or delete your information at any time by emailing us. If you unsubscribe from our emails, we'll stop sending them right away.",
  },
];

export default function PrivacyPage() {
  return (
    <section
      className="min-h-screen flex flex-col items-center px-5 md:px-6"
      style={{ background: "#4A5E48", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="text-center mb-12">
        <p className="font-medium uppercase tracking-[0.28em] text-[11px] mb-6" style={{ color: "#C2963A" }}>
          Legal
        </p>
        <h1
          className="leading-tight"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 400,
            color: "#fff",
          }}
        >
          Privacy Policy
        </h1>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C2963A" }}>
              {s.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm mt-10" style={{ color: "rgba(255,255,255,0.35)" }}>
        For questions or data requests, contact sarah@restoredfamily.com
      </p>
    </section>
  );
}
