import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { ReadoutRow } from "@/components/hud/Readout";
import { StatusDot } from "@/components/hud/StatusDot";
import type { Project } from "@/lib/content/projects";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/lib/content/schema";
import styles from "./ProjectSpec.module.css";

const STATUS_TONE: Record<ProjectStatus, "accent" | "warn"> = {
  "in-progress": "warn",
  shipped: "accent",
};

interface ProjectSpecProps {
  project: Project;
  /** Columns in the detail grid; the SPEC panel goes full width when there is no write-up beside it. */
  span: 4 | 12;
}

export function ProjectSpec({ project, span }: ProjectSpecProps) {
  const { demo, source } = project.links;

  return (
    <Panel as="aside" span={span} aria-label="Project facts" className={styles.panel}>
      <PanelHeader index="//" label="SPEC" />
      <dl className={styles.rows}>
        <ReadoutRow
          isRuled
          label="STATUS"
          value={
            <>
              <StatusDot tone={STATUS_TONE[project.status]} />
              {PROJECT_STATUS_LABEL[project.status]}
            </>
          }
        />
        {project.spec.map((row) => (
          <ReadoutRow key={row.label} isRuled label={row.label} value={row.value} />
        ))}
      </dl>
      {(demo !== undefined || source !== undefined) && (
        <div className={styles.links}>
          {demo !== undefined && (
            <Button href={demo} variant="secondary" aria-label={`${project.title} live demo`}>
              ▸ Live demo
            </Button>
          )}
          {source !== undefined && (
            <Button href={source} variant="secondary" aria-label={`${project.title} source`}>
              ▸ Source
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}
