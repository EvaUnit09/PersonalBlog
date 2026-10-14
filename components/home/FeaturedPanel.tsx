import type { Project, ProjectList } from "@/lib/content/projects";
import { PROJECT_STATUS_LABEL } from "@/lib/content/schema";
import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import { FEATURED_SLUGS, pickFeatured } from "@/lib/featured";
import { padIndex } from "@/lib/padIndex";
import styles from "./FeaturedPanel.module.css";

interface FeaturedPanelProps {
  projects: ProjectList;
  featuredSlugs?: readonly string[];
}

interface FeaturedCardProps {
  project: Project;
  total: number;
}

function FeaturedCard({ project, total }: FeaturedCardProps) {
  const titleId = `${project.slug}-feat`;
  const { demo } = project.links;

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <p className={`t-readout ${styles.position}`}>
        PROJECT {padIndex(project.order)} OF {padIndex(total)}
      </p>
      <TagList tags={project.tags} label={`${project.title} stack`} />
      <h2 id={titleId} className={`t-h1 ${styles.title}`}>
        {project.title}
      </h2>
      <p className={`t-body ${styles.summary}`}>{project.summary}</p>
      <div className={styles.footer}>
        {demo !== undefined && <Button href={demo}>▸ Live demo</Button>}
        <Button href={`/projects/${project.slug}`} variant="secondary">
          ▸ Read the write-up
        </Button>
        <span className={`t-readout ${styles.status}`}>STATUS: {PROJECT_STATUS_LABEL[project.status]}</span>
      </div>
    </article>
  );
}

export function FeaturedPanel({ projects, featuredSlugs = FEATURED_SLUGS }: FeaturedPanelProps) {
  const featured = pickFeatured(projects, featuredSlugs);

  return (
    <Panel id="projects" span={7} aria-labelledby="feat">
      <PanelHeader
        index="02"
        label="Featured"
        labelId="feat"
        readout={`${padIndex(featured.length)} FEATURED`}
      />
      <ol className={styles.cards}>
        {featured.map((project) => (
          <li key={project.slug}>
            <FeaturedCard project={project} total={projects.length} />
          </li>
        ))}
      </ol>
    </Panel>
  );
}
