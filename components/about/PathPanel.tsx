import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import type { PathStage } from "@/content/about";
import { padIndex } from "@/lib/padIndex";
import styles from "./PathPanel.module.css";

interface PathPanelProps {
  stages: readonly PathStage[];
}

export function PathPanel({ stages }: PathPanelProps) {
  return (
    <Panel span={7} aria-labelledby="path">
      <PanelHeader index="//" label="Path" labelId="path" readout={`${stages.length} STAGES`} />
      <ol className={styles.list}>
        {stages.map((stage, i) => (
          <ListRow key={stage.title} marker={padIndex(i + 1)} title={stage.title} summary={stage.summary} />
        ))}
      </ol>
    </Panel>
  );
}
