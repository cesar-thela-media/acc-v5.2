import {
  Document,
  type DocumentProps,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { appUrl } from "@/lib/env";

// ─── Palette ──────────────────────────────────────────────────────────────
const SAGE_900 = "#1B1B1B";
const SAGE_700 = "#4A5D4E";
const SAGE_600 = "#5A7060";
const SAGE_100 = "#E4EBE6";
const GOLD = "#C9A96E";
const CREAM = "#F8FAF3";
const TEXT = "#1B1B1B";
const TEXT_SEC = "#444841";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
    paddingHorizontal: 52,
    paddingTop: 48,
    paddingBottom: 56,
    fontSize: 10,
    color: TEXT,
    lineHeight: 1.6,
  },

  // Cover page
  coverPage: {
    fontFamily: "Helvetica",
    backgroundColor: SAGE_900,
    paddingHorizontal: 52,
    paddingTop: 72,
    paddingBottom: 52,
    justifyContent: "space-between",
  },
  coverEyebrow: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 40,
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 36,
    color: "#fff",
    lineHeight: 1.1,
    marginBottom: 12,
  },
  coverTitleAccent: {
    color: GOLD,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.5,
    maxWidth: 320,
    marginBottom: 40,
  },
  coverDivider: {
    width: 40,
    height: 1.5,
    backgroundColor: GOLD,
    marginBottom: 16,
  },
  coverByline: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.5,
  },
  coverName: {
    fontFamily: "Helvetica-Bold",
    color: "rgba(255,255,255,0.7)",
  },
  coverPersonalisedFor: {
    marginTop: 36,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
  },
  coverPersonalisedName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },

  // TOC
  tocTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: SAGE_900,
    marginBottom: 24,
  },
  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: SAGE_100,
  },
  tocNum: {
    fontSize: 9,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    width: 24,
  },
  tocLabel: {
    fontSize: 11,
    color: SAGE_900,
    flex: 1,
  },
  tocPage: {
    fontSize: 9,
    color: TEXT_SEC,
  },

  // Section pages
  sectionHeader: {
    backgroundColor: SAGE_900,
    paddingHorizontal: 52,
    paddingVertical: 40,
    marginHorizontal: -52,
    marginTop: -48,
    marginBottom: 32,
  },
  sectionNum: {
    fontSize: 9,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: "#fff",
    lineHeight: 1.15,
  },
  sectionTagline: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
    lineHeight: 1.5,
  },

  // Body copy
  h2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: SAGE_900,
    marginTop: 20,
    marginBottom: 6,
  },
  h3: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: SAGE_700,
    marginTop: 14,
    marginBottom: 4,
  },
  p: {
    fontSize: 10,
    color: TEXT_SEC,
    lineHeight: 1.65,
    marginBottom: 8,
  },
  pBold: {
    fontFamily: "Helvetica-Bold",
    color: TEXT,
  },

  // Callout box
  callout: {
    backgroundColor: "#FFF4EC",
    borderLeftWidth: 3,
    borderLeftColor: SAGE_600,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 12,
    borderRadius: 4,
  },
  calloutText: {
    fontSize: 9.5,
    color: SAGE_900,
    lineHeight: 1.6,
    fontFamily: "Helvetica-Oblique",
  },

  // Gold highlight box
  goldBox: {
    backgroundColor: "#FFF7DB",
    borderWidth: 1,
    borderColor: "#F3D36D",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 14,
  },
  goldBoxTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: GOLD,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  goldBoxText: {
    fontSize: 9.5,
    color: TEXT,
    lineHeight: 1.6,
  },

  // Checklist
  checkRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
    alignItems: "flex-start",
  },
  checkBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: SAGE_600,
    marginTop: 1,
    flexShrink: 0,
  },
  checkText: {
    fontSize: 9.5,
    color: TEXT_SEC,
    lineHeight: 1.5,
    flex: 1,
  },

  // Numbered list
  numRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  numBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: SAGE_900,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  numBadgeText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: "#fff",
  },
  numText: {
    fontSize: 9.5,
    color: TEXT_SEC,
    lineHeight: 1.55,
    flex: 1,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: SAGE_100,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 7.5,
    color: "rgba(0,0,0,0.25)",
  },
  footerRight: {
    fontSize: 7.5,
    color: "rgba(0,0,0,0.25)",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────

function CheckItem({ text }: { text: string }) {
  return (
    <View style={s.checkRow}>
      <View style={s.checkBox} />
      <Text style={s.checkText}>{text}</Text>
    </View>
  );
}

function NumItem({ n, text }: { n: number; text: string }) {
  return (
    <View style={s.numRow}>
      <View style={s.numBadge}>
        <Text style={s.numBadgeText}>{n}</Text>
      </View>
      <Text style={s.numText}>{text}</Text>
    </View>
  );
}

function Footer({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>The Private Practice Playbook · Austin Clinician Circle</Text>
      <Text style={s.footerRight}>{page}</Text>
    </View>
  );
}

// ─── Document ─────────────────────────────────────────────────────────────

export function PlaybookDocument({ firstName }: { firstName: string }): ReactElement<DocumentProps> {
  return (
    <Document
      title="The Private Practice Playbook"
      author="Sarah Arnold, LPC-S"
      subject="Building a sustainable, fulfilling private practice"
      creator="Austin Clinician Circle"
    >
      {/* ── COVER ── */}
      <Page size="A4" style={s.coverPage}>
        <View>
          <Text style={s.coverEyebrow}>Austin Clinician Circle</Text>
          <Text style={s.coverTitle}>
            The Private{"\n"}
            <Text style={s.coverTitleAccent}>Practice</Text>
            {"\n"}Playbook
          </Text>
          <Text style={s.coverSubtitle}>
            Four frameworks used by Austin&apos;s most sustainable independent practices: fee-setting, referral building, burnout prevention, and community.
          </Text>
          <View style={s.coverDivider} />
          <Text style={s.coverByline}>
            <Text style={s.coverName}>Sarah Arnold, LPC-S</Text>
            {"\n"}Founder, Austin Clinician Circle{"\n"}
            Restored Family Counseling · Austin, TX
          </Text>
        </View>
        <View style={s.coverPersonalisedFor}>
          <Text>Prepared for</Text>
          <Text style={s.coverPersonalisedName}>{firstName}</Text>
        </View>
      </Page>

      {/* ── TABLE OF CONTENTS ── */}
      <Page size="A4" style={s.page}>
        <Text style={s.tocTitle}>What&apos;s inside</Text>
        {[
          ["01", "The Fee-Setting Framework", "3"],
          ["02", "The Referral Network Blueprint", "6"],
          ["03", "The Burnout Early-Warning Checklist", "9"],
          ["04", "Austin Clinician Circle Community Playbook", "12"],
        ].map(([num, label, pg]) => (
          <View key={num} style={s.tocRow}>
            <Text style={s.tocNum}>{num}</Text>
            <Text style={s.tocLabel}>{label}</Text>
            <Text style={s.tocPage}>{pg}</Text>
          </View>
        ))}
        <View style={s.callout}>
          <Text style={s.calloutText}>
            &quot;The isolation of private practice is the single biggest threat to clinician longevity, not caseload, not documentation, not billing. It&apos;s being alone with hard work.&quot; (Sarah Arnold, LPC-S)
          </Text>
        </View>
        <Footer page={2} />
      </Page>

      {/* ── SECTION 1: FEE-SETTING ── */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionNum}>Section 01</Text>
          <Text style={s.sectionTitle}>The Fee-Setting Framework</Text>
          <Text style={s.sectionTagline}>Stop undercharging, and stop apologizing for what you&apos;re worth.</Text>
        </View>

        <Text style={s.p}>
          Most therapists set their fees too low. Not because they don&apos;t know their value, but because they&apos;ve been conditioned to apologize for it. This section gives you a systematic way to set fees that reflect the true cost of your work and hold them.
        </Text>

        <Text style={s.h2}>Step 1: Calculate your true hourly cost</Text>
        <Text style={s.p}>
          Before you set a client-facing rate, calculate what one clinical hour actually costs you to deliver. Include: your time in session, documentation (typically 20–30 min per hour), administrative overhead, continuing education amortized monthly, liability insurance, EHR and billing software, office rent or platform fees, and unpaid no-shows or late cancellations at your current rate.
        </Text>
        <NumItem n={1} text="Track your actual billable hours vs. total hours worked this month." />
        <NumItem n={2} text="Add up all fixed monthly practice costs (rent, software, insurance, phone)." />
        <NumItem n={3} text="Divide total cost by billable hours. This is your floor. Your rate must exceed it." />

        <Text style={s.h2}>Step 2: Know your local market ceiling</Text>
        <Text style={s.p}>
          In the Austin metro, licensed therapist rates currently range from $140–$250/hr for individual therapy, with specialists (EMDR, IFS, trauma) regularly billing $175–$275. If you&apos;re below $150, you&apos;re likely underpriced relative to your training and licensure.
        </Text>

        <View style={s.goldBox}>
          <Text style={s.goldBoxTitle}>The $30 Raise Rule</Text>
          <Text style={s.goldBoxText}>
            If no prospective client has pushed back on your fee in the last 6 months, your rate is too low. Raise it by $30 for all new clients. Give existing clients 60 days&apos; notice. You will not lose them all, and the ones who leave at $30 were not your clients anyway.
          </Text>
        </View>
        <Footer page={3} />
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Step 3: The sliding scale decision framework</Text>
        <Text style={s.p}>
          Sliding scale is a values decision, not a default. Before offering reduced fees, decide in advance: How many reduced-fee slots will I hold at any one time? What is my floor? What documentation or process will I use?
        </Text>
        <NumItem n={1} text="Decide your hard floor, the minimum you will accept for any session, and write it down." />
        <NumItem n={2} text="Limit reduced-fee slots to no more than 20% of your caseload unless it's a core part of your mission." />
        <NumItem n={3} text="Consider a brief financial screening so you're giving reduced fees to clients who genuinely need them." />
        <NumItem n={4} text="Revisit reduced-fee clients annually. Circumstances change." />

        <Text style={s.h2}>Step 4: Communicating fees without apology</Text>
        <Text style={s.p}>
          The language you use to discuss fees signals your relationship to your own value. Compare:
        </Text>
        <View style={s.callout}>
          <Text style={s.calloutText}>
            ✗ &quot;I know it&apos;s a lot... my rate is $175... but I do have some sliding scale if that&apos;s a problem.&quot;{"\n\n"}
            ✓ &quot;My rate is $175 per session. Do you have questions about that before we continue?&quot;
          </Text>
        </View>
        <Text style={s.p}>
          The second version is complete. It does not pre-emptively apologize. It invites dialogue from a place of stability. Practice this phrasing until it feels neutral, because it is.
        </Text>

        <Text style={s.h3}>When to raise existing client rates</Text>
        <Text style={s.p}>
          The answer is: regularly. Annual increases of $10–$20 are expected, professional, and appropriate. Give written notice 60 days in advance. A brief, warm letter works well: &quot;As of [date], my rate for new and existing clients will be $[amount]. I value our work together and want to let you know well in advance.&quot;
        </Text>
        <Footer page={4} />
      </Page>

      {/* ── SECTION 2: REFERRAL NETWORK ── */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionNum}>Section 02</Text>
          <Text style={s.sectionTitle}>The Referral Network Blueprint</Text>
          <Text style={s.sectionTagline}>Build trust before you need it. Refer with confidence. Get referred.</Text>
        </View>

        <Text style={s.p}>
          Most clinicians wait until they have a referral need to start building referral relationships. This is backwards. A strong referral network is built over months and years, and it pays dividends when you need it most.
        </Text>

        <Text style={s.h2}>The three-ring referral model</Text>
        <Text style={s.p}>
          Think of your referral network as three concentric rings:
        </Text>
        <NumItem n={1} text="Ring 1: Warm. Clinicians you know personally, trust clinically, and would refer your own family member to. Aim for 5–8 across key specialties (trauma, couples, children, psychiatry, EMDR, somatic)." />
        <NumItem n={2} text="Ring 2: Cool. Clinicians you've met at trainings, supervision groups, or through shared clients. You have a sense of their work. Worth developing into Ring 1." />
        <NumItem n={3} text="Ring 3: Cold. Names in your EHR or Psychology Today, known to you but not known by you. Don't refer to cold contacts for high-acuity clients." />

        <Text style={s.h2}>Building Ring 1 referral relationships</Text>
        <NumItem n={1} text="Reach out to one clinician per month with a specific, genuine message: 'I've heard good things about your work with attachment-based couples therapy. I'm a trauma-focused IFS therapist, and I'd love to know more about your practice.'" />
        <NumItem n={2} text="Meet for coffee or a 20-minute video call. Ask about their specialty, client fit, and what kinds of referrals they can't always take." />
        <NumItem n={3} text="Follow up when you send a referral. A quick message like 'I referred Jane Doe, she'll reach out this week' builds trust and shows professionalism." />
        <NumItem n={4} text="Track who you've referred to and who has referred to you. Reciprocity matters, but it's rarely equal, and that's okay." />

        <View style={s.goldBox}>
          <Text style={s.goldBoxTitle}>The Best Referral You Can Give</Text>
          <Text style={s.goldBoxText}>
            Never refer a client to someone you don&apos;t actually know. When you receive a referral from an unknown source, call to introduce yourself before the client arrives. The 5-minute call becomes the foundation of a Ring 2 relationship.
          </Text>
        </View>
        <Footer page={6} />
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Specialty gaps to fill first</Text>
        <Text style={s.p}>
          The most common referral gaps for Austin-area private practice therapists:
        </Text>
        <CheckItem text="Child therapist (ages 5–12), almost always needed" />
        <CheckItem text="Adolescent therapist with eating disorder experience" />
        <CheckItem text="Psychiatrist or PMHNP for medication consultation" />
        <CheckItem text="Bilingual (Spanish) therapist for referrals you can't take" />
        <CheckItem text="Couples therapist (Gottman or EFT trained)" />
        <CheckItem text="Somatic or body-based therapist" />
        <CheckItem text="Group therapy options for social anxiety, grief, or men's groups" />

        <Text style={s.h2}>The referral pipeline mindset</Text>
        <Text style={s.p}>
          Your referral network is not a backup plan. It&apos;s an asset. Clinicians with strong Ring 1 networks:
        </Text>
        <NumItem n={1} text="Maintain fuller caseloads because trusted referrals convert at 3–4x the rate of cold inquiries." />
        <NumItem n={2} text="Give better care because they can quickly place clients who need a different fit." />
        <NumItem n={3} text="Experience less burnout because they're not holding clients beyond their scope out of necessity." />

        <View style={s.callout}>
          <Text style={s.calloutText}>
            &quot;The clinicians I see burn out fastest are the ones trying to be everything to every client. A strong referral network is what lets you specialize, and specialization is what lets you do your best work.&quot; (Sarah Arnold)
          </Text>
        </View>
        <Footer page={7} />
      </Page>

      {/* ── SECTION 3: BURNOUT CHECKLIST ── */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionNum}>Section 03</Text>
          <Text style={s.sectionTitle}>The Burnout Early-Warning Checklist</Text>
          <Text style={s.sectionTagline}>12 signs most clinicians miss, and what to do about each one.</Text>
        </View>

        <Text style={s.p}>
          Burnout in therapists rarely arrives as a single dramatic event. It accumulates as small erosions in boundary, motivation, and presence that, over months, become chronic. The checklist below is designed for early detection, not crisis response.
        </Text>
        <Text style={s.p}>
          Check any item you&apos;ve experienced more than twice in the past 30 days. Three or more checked items is a signal worth taking seriously.
        </Text>

        <Text style={s.h2}>Clinical signs</Text>
        <CheckItem text="You find yourself clock-watching during sessions more than once per week." />
        <CheckItem text="You've noticed yourself mentally rehearsing what you'll say instead of listening." />
        <CheckItem text="You feel relief when a client cancels rather than neutral or mild disappointment." />
        <CheckItem text="You've had difficulty recalling details of a client's case you know well." />

        <Text style={s.h2}>Relational and boundary signs</Text>
        <CheckItem text="You've said yes to a scheduling request that crossed a boundary you've set in the past." />
        <CheckItem text="You've responded to a client text or email outside your stated availability more than twice in the past month." />
        <CheckItem text="You've noticed yourself being less honest in supervision or consultation than you'd want a supervisee to be." />
        <CheckItem text="You've taken on a client outside your specialty or scope because you didn't want to disappoint them." />

        <Text style={s.h2}>Personal and systemic signs</Text>
        <CheckItem text="Work conversations dominate your social interactions even when you're 'off.'" />
        <CheckItem text="You're using alcohol, food, screens, or exercise in ways that feel compensatory rather than nourishing." />
        <CheckItem text="You feel resentment toward the field, your clients, or the healthcare system, and it's not moving through you." />
        <CheckItem text="You can't remember the last time you felt genuinely curious about a clinical case." />
        <Footer page={9} />
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Early intervention: what to do with your score</Text>

        <Text style={s.h3}>1–2 items checked</Text>
        <Text style={s.p}>
          Normal occupational load. Notice the pattern and what may have triggered it. Consider whether any structural change (caseload cap, schedule adjustment, peer consultation) would help.
        </Text>

        <Text style={s.h3}>3–5 items checked</Text>
        <Text style={s.p}>
          This is a signal. Don&apos;t wait. Take one concrete action this week: reduce caseload by one client, add a supervision appointment, book a personal therapy session, or restructure one persistent boundary violation.
        </Text>

        <Text style={s.h3}>6+ items checked</Text>
        <Text style={s.p}>
          You are likely already in secondary trauma or clinical burnout. This is not a character failing. It is occupational injury. Stop adding clients. Seek consultation or personal therapy immediately. Consider whether a caseload reduction is necessary for client safety as much as your own.
        </Text>

        <View style={s.goldBox}>
          <Text style={s.goldBoxTitle}>The Most Protective Structure Known</Text>
          <Text style={s.goldBoxText}>
            Research consistently shows that peer consultation, regular, structured, honest clinical consultation with colleagues, is the single most protective factor against burnout in licensed therapists. Not self-care in the conventional sense. Community. That&apos;s what Austin Clinician Circle is built for.
          </Text>
        </View>

        <Text style={s.h2}>Building protective structures</Text>
        <NumItem n={1} text="A hard caseload ceiling. Decide the maximum number of clients you will see per week and hold it. Write it in your scheduling software as a block." />
        <NumItem n={2} text="Regular peer consultation. Not just once when things are hard. Weekly or biweekly as a standing commitment." />
        <NumItem n={3} text="Personal therapy. Most licensing boards don't require it. The research says it matters anyway." />
        <NumItem n={4} text="At least one non-clinical professional relationship per week. Lunch with a colleague who isn't your client, supervisee, or supervisor." />
        <Footer page={10} />
      </Page>

      {/* ── SECTION 4: COMMUNITY PLAYBOOK ── */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionNum}>Section 04</Text>
          <Text style={s.sectionTitle}>Austin Clinician Circle Community Playbook</Text>
          <Text style={s.sectionTagline}>What thriving private practices have in common, and what you can start doing today.</Text>
        </View>

        <Text style={s.p}>
          Through years running peer consultation groups, Sarah Arnold identified a consistent pattern: the therapists who built sustainable, fulfilling practices weren&apos;t the most experienced, the most credentialed, or the best at marketing. They were the ones who stayed connected.
        </Text>

        <Text style={s.h2}>What thriving practices have in common</Text>
        <NumItem n={1} text="They consult regularly, not just on crisis cases, but as a standing practice habit. Weekly or biweekly consultation is the norm, not the exception." />
        <NumItem n={2} text="They refer generously, because they have a network they trust, and they can place clients well rather than holding them past fit." />
        <NumItem n={3} text="They keep learning, not just CEUs for license renewal, but trainings they actually want to take because they're curious." />
        <NumItem n={4} text="They talk about money: fees, billing, overhead, with peers. The stigma around pricing in the helping professions is real and actively harmful." />
        <NumItem n={5} text="They have at least one person who knows their full caseload and practice reality. Not just a supervisor, a peer." />

        <Text style={s.h2}>The isolation tax</Text>
        <Text style={s.p}>
          Working in isolation has a compounding cost that rarely shows up on a ledger. It shows up as: lower fees (no benchmark), worse referrals (no network), slower clinical growth (no consultation), and earlier burnout (no community). Call it the isolation tax.
        </Text>
        <Footer page={12} />
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>What Austin Clinician Circle offers</Text>
        <Text style={s.p}>
          Austin Clinician Circle is a curated membership community for licensed therapists, built around the structures that research and experience show actually protect clinician longevity:
        </Text>
        <CheckItem text="Monthly group case consultation led by Sarah Arnold, LPC-S, bring a real case and get real support." />
        <CheckItem text="CEU trainings each month on clinical and business topics, all archived." />
        <CheckItem text="A vetted referral network of Austin-area clinicians you can actually trust." />
        <CheckItem text="A curated resource library of clinical tools, handouts, and business guides." />
        <CheckItem text="A public directory listing, professionally maintained and searchable by specialty." />
        <CheckItem text="Discounted 1-on-1 practice coaching with Sarah on fees, marketing, and burnout." />

        <Text style={s.h2}>Your next step</Text>
        <Text style={s.p}>
          We&apos;re currently accepting founding members, therapists who will help shape the community from its first year. Founding members lock in the lowest membership rate Austin Clinician Circle will ever offer, receive priority access to all programming, and have direct input with Sarah on what gets built.
        </Text>

        <View style={s.goldBox}>
          <Text style={s.goldBoxTitle}>Ready to apply?</Text>
          <Text style={s.goldBoxText}>
            Applications are reviewed weekly. Visit {appUrl.replace(/^https?:\/\//, "")}/join to apply. It takes about 10 minutes and there&apos;s no commitment required to apply.{"\n\n"}
            Questions? Email Sarah directly at{" "}
            <Link src="mailto:sarah@restoredfamily.com" style={{ color: GOLD }}>
              sarah@restoredfamily.com
            </Link>
          </Text>
        </View>

        <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: SAGE_100 }}>
          <Text style={{ fontSize: 8, color: "rgba(0,0,0,0.3)", lineHeight: 1.6 }}>
            This guide is provided for educational purposes and reflects the professional experience and perspective of Sarah Arnold, LPC-S. It is not a substitute for clinical supervision, consultation, or personal therapy. Austin Clinician Circle is a membership community for licensed mental health professionals.
          </Text>
        </View>
        <Footer page={13} />
      </Page>
    </Document>
  );
}
