import { AboutIntroPanel } from "@/components/about/AboutIntroPanel";
import { CertificationsPanel } from "@/components/about/CertificationsPanel";
import { ContactPanel } from "@/components/about/ContactPanel";
import { IdentityPanel } from "@/components/about/IdentityPanel";
import { PathPanel } from "@/components/about/PathPanel";
import { StackPanel } from "@/components/home/StackPanel";
import { ABOUT } from "@/content/about";
import { STACK, STATUS } from "@/content/home";
import { CONTACT_LINKS } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "About",
  `${ABOUT.headline} Network infrastructure in Okinawa, film school in Los Angeles, then software at BBC Studios.`,
);

export default function AboutPage() {
  return (
    <main className="grid">
      <AboutIntroPanel about={ABOUT} />
      <IdentityPanel rows={ABOUT.identity} isOpenToWork={STATUS.isOpenToWork} />
      <PathPanel stages={ABOUT.path} />
      <StackPanel stack={STACK} />
      <CertificationsPanel items={ABOUT.certifications} />
      <ContactPanel prompt={ABOUT.contactPrompt} links={CONTACT_LINKS} />
    </main>
  );
}
