import Link from "next/link";
import type { Project } from "@/content/home";
import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import { padIndex } from "@/lib/padIndex";
import shared from "./shared.module.css";

interface AlsoBuiltPanelProps {
  /** Every project, featured first. The featured one is skipped here. */
  projects: readonly [Project, ...Project[]];
}

export function AlsoBuiltPanel({ projects }: AlsoBuiltPanelProps) {
  const [, ...others] = projects;

  return (
    <Panel as="aside" span={5} aria-label="More projects">
      <PanelHeader
        index="//"
        label="Also built"
        readout={
          <Link href="/projects" className={shared.headerLink}>
            ALL ▸
          </Link>
        }
      />
      <ol className={shared.list}>
        {others.map((project, i) => (
          <ListRow
            key={project.slug}
            marker={padIndex(i + 2)}
            title={project.title}
            summary={project.summary}
          >
            <TagList tags={project.tags} label={`${project.title} stack`} />
          </ListRow>
        ))}
      </ol>
    </Panel>
  );
}
