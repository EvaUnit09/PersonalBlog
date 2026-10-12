import type { Metadata } from "next";
import { AboutIntroPanel } from "@/components/about/AboutIntroPanel";
import { ContactPanel } from "@/components/about/ContactPanel";
import { IdentityPanel } from "@/components/about/IdentityPanel";
import { PathPanel } from "@/components/about/PathPanel";
import { StackPanel } from "@/components/home/StackPanel";
import { ABOUT } from "@/content/about";
import { STACK, STATUS } from "@/content/home";
import { CONTACT_LINKS } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${ABOUT.headline} Network infrastructure in Okinawa, film school in Los Angeles, then software at BBC Studios.`,
};

export default function AboutPage() {
  return (
    <main className="grid">
      <AboutIntroPanel about={ABOUT} />
      <IdentityPanel rows={ABOUT.identity} isOpenToWork={STATUS.isOpenToWork} />
      <PathPanel stages={ABOUT.path} />
      <StackPanel stack={STACK} />
      <ContactPanel prompt={ABOUT.contactPrompt} links={CONTACT_LINKS} />
    </main>
  );
}
