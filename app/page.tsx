import { AlsoBuiltPanel } from "@/components/home/AlsoBuiltPanel";
import { ExperiencePanel } from "@/components/home/ExperiencePanel";
import { FeaturedPanel } from "@/components/home/FeaturedPanel";
import { HeroPanel } from "@/components/home/HeroPanel";
import { LogPanel } from "@/components/home/LogPanel";
import { StackPanel } from "@/components/home/StackPanel";
import { StatusPanel } from "@/components/home/StatusPanel";
import { EXPERIENCE, HERO, LOG_ENTRIES, PROJECTS, STACK, STATUS } from "@/content/home";

export default function HomePage() {
  return (
    <main className="grid">
      <HeroPanel hero={HERO} />
      <StatusPanel status={STATUS} />
      <FeaturedPanel projects={PROJECTS} />
      <AlsoBuiltPanel projects={PROJECTS} />
      <ExperiencePanel entries={EXPERIENCE} />
      <StackPanel stack={STACK} />
      <LogPanel entries={LOG_ENTRIES} />
    </main>
  );
}
