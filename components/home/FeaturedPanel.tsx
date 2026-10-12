import { PROJECT_STATUS_LABEL, type Project } from "@/content/home";
import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import { padIndex } from "@/lib/padIndex";
import styles from "./FeaturedPanel.module.css";

interface FeaturedPanelProps {
  projects: readonly [Project, ...Project[]];
}

export function FeaturedPanel({ projects }: FeaturedPanelProps) {
  const [featured] = projects;

  return (
    <Panel id="projects" span={7} aria-labelledby="feat">
      <PanelHeader
        index="02"
        label="Featured"
        readout={`PROJECT ${padIndex(1)} OF ${padIndex(projects.length)}`}
      />
      <TagList tags={featured.tags} label="Stack" />
      <h2 id="feat" className={`t-h1 ${styles.title}`}>
        {featured.title}
      </h2>
      <p className={`t-body ${styles.summary}`}>{featured.summary}</p>
      <div aria-hidden="true" className={styles.shot}>
        <span className="t-readout">[SCREENSHOT: ITINERARY VIEW]</span>
      </div>
      <div className={styles.footer}>
        <Button href={`/projects/${featured.slug}`} variant="secondary">
          ▸ Read the write-up
        </Button>
        <span className={`t-readout ${styles.status}`}>STATUS: {PROJECT_STATUS_LABEL[featured.status]}</span>
      </div>
    </Panel>
  );
}
