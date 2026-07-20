import Link from "next/link";
import { ArrowUpRight, BookOpen, MessageCircle, UserPlus } from "lucide-react";

type Choice = {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  variant: "primary" | "secondary" | "tertiary";
};

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  choices?: Choice[];
  background?: "sage" | "parchment" | "cream";
};

const DEFAULT_CHOICES: Choice[] = [
  {
    href: "/join",
    icon: <UserPlus className="size-5" />,
    eyebrow: "Membership",
    title: "Apply for founding membership.",
    description: "Bring your practice into a trusted circle of clinicians. Founding members keep their seat as long as they renew.",
    cta: "Apply now",
    variant: "primary",
  },
  {
    href: "mailto:sarah@restoredfamily.com",
    icon: <MessageCircle className="size-5" />,
    eyebrow: "Discovery",
    title: "Talk it through with Sarah first.",
    description: "Have questions, or want to know whether The Circle is the right fit before you commit to an application? Sarah reads every email.",
    cta: "Email Sarah",
    variant: "secondary",
  },
  {
    href: "/leadmagnet",
    icon: <BookOpen className="size-5" />,
    eyebrow: "Free guide",
    title: "Read The Private Practice Playbook.",
    description: "A free guide used by Austin therapists to build sustainable, fulfilling practices. Delivered instantly. No commitment required.",
    cta: "Get the playbook",
    variant: "tertiary",
  },
];

export function ChoiceBasedCta({
  eyebrow = "Next step",
  heading = "Three ways to move forward.",
  subheading = "Choose what fits — there is no wrong place to start.",
  choices = DEFAULT_CHOICES,
  background = "sage",
}: Props) {
  const bgVar = background === "sage" ? "var(--color-sage-800)" : background === "parchment" ? "var(--color-parchment)" : "#FBF8F1";
  const headingColor = background === "sage" ? "#fff" : "var(--color-sage-800)";
  const subColor = background === "sage" ? "rgba(255,255,255,0.65)" : "rgba(45,59,44,0.70)";
  const eyebrowColor = "#C2963A";
  const cardBg = background === "sage" ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = background === "sage" ? "rgba(255,255,255,0.10)" : "rgba(194,150,58,0.20)";
  const cardTitleColor = background === "sage" ? "#fff" : "var(--color-sage-800)";
  const cardTextColor = background === "sage" ? "rgba(255,255,255,0.62)" : "var(--color-text-secondary)";
  const mutedPillBg = background === "sage" ? "rgba(255,255,255,0.10)" : "rgba(45,59,44,0.06)";
  const mutedPillColor = background === "sage" ? "rgba(255,255,255,0.55)" : "var(--color-sage-700)";

  return (
    <section className="relative overflow-hidden" style={{ background: bgVar, padding: "clamp(3.5rem, 7vw, 6rem) 1.5rem" }}>
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <div className="text-center mb-10 md:mb-14">
          <p className="font-medium uppercase tracking-[0.28em] text-[11px] mb-3" style={{ color: eyebrowColor }}>{eyebrow}</p>
          <h2 className="leading-[1.08] mb-4" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(2rem, 4.2vw, 3.25rem)", fontWeight: 400, letterSpacing: "-0.02em", color: headingColor }}>
            {heading}
          </h2>
          {subheading && (
            <p className="text-base md:text-lg leading-relaxed mx-auto" style={{ color: subColor, maxWidth: 560 }}>{subheading}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {choices.map((choice) => {
            const isPrimary = choice.variant === "primary";
            return (
              <Link
                key={choice.title}
                href={choice.href}
                className="group relative flex flex-col gap-5 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: isPrimary ? "#C2963A" : mutedPillBg, color: isPrimary ? "#fff" : mutedPillColor }} aria-hidden="true">
                  {choice.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: eyebrowColor }}>{choice.eyebrow}</p>
                  <h3 className="text-lg font-semibold leading-snug" style={{ color: cardTitleColor }}>{choice.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: cardTextColor }}>{choice.description}</p>
                </div>
                <div className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: isPrimary ? "#C2963A" : cardTitleColor }}>
                  {choice.cta} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
