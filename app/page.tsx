import { AlsoBuiltPanel } from "@/components/home/AlsoBuiltPanel";
import { ExperiencePanel } from "@/components/home/ExperiencePanel";
import { FeaturedPanel } from "@/components/home/FeaturedPanel";
import { HeroPanel } from "@/components/home/HeroPanel";
import { LogPanel } from "@/components/home/LogPanel";
import { StackPanel } from "@/components/home/StackPanel";
import { StatusPanel } from "@/components/home/StatusPanel";
import { EXPERIENCE, HERO, LOG_ENTRIES, STACK, STATUS } from "@/content/home";
import { getProjects } from "@/lib/content/projects";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main className="grid">
      <HeroPanel hero={HERO} />
      <StatusPanel status={STATUS} />
      <FeaturedPanel projects={projects} />
      <AlsoBuiltPanel projects={projects} />
      <ExperiencePanel entries={EXPERIENCE} />
      <StackPanel stack={STACK} />
      <LogPanel entries={LOG_ENTRIES} />
    </main>
  );
}
