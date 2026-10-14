import Link from "next/link";
import type { ProjectList } from "@/lib/content/projects";
import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import { FEATURED_SLUGS, withoutFeatured } from "@/lib/featured";
import { padIndex } from "@/lib/padIndex";
import shared from "./shared.module.css";

interface AlsoBuiltPanelProps {
  /** Every project. Featured slugs are skipped here. */
  projects: ProjectList;
  featuredSlugs?: readonly string[];
}

export function AlsoBuiltPanel({ projects, featuredSlugs = FEATURED_SLUGS }: AlsoBuiltPanelProps) {
  const others = withoutFeatured(projects, featuredSlugs);

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
        {others.map((project) => (
          <ListRow
            key={project.slug}
            marker={padIndex(project.order)}
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
