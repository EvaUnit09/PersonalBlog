import type { ExperienceEntry } from "@/content/home";
import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import shared from "./shared.module.css";

const CURRENT_ROLE_END = "NOW";

interface ExperiencePanelProps {
  entries: readonly ExperienceEntry[];
}

export function ExperiencePanel({ entries }: ExperiencePanelProps) {
  return (
    <Panel id="experience" span={7} aria-labelledby="xp">
      <PanelHeader index="03" label="Experience" labelId="xp" readout="TIMELINE" />
      <ol className={shared.list}>
        {entries.map((entry) => (
          <ListRow
            key={entry.title}
            marker={`${entry.start} – ${entry.end ?? CURRENT_ROLE_END}`}
            markerSize="period"
            title={entry.title}
            summary={entry.summary}
          />
        ))}
      </ol>
    </Panel>
  );
}
