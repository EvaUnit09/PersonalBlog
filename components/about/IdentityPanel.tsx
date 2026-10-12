import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { ReadoutRow } from "@/components/hud/Readout";
import { StatusDot } from "@/components/hud/StatusDot";
import type { IdentityRow } from "@/content/about";
import styles from "./IdentityPanel.module.css";

interface IdentityPanelProps {
  rows: readonly IdentityRow[];
  isOpenToWork: boolean;
}

export function IdentityPanel({ rows, isOpenToWork }: IdentityPanelProps) {
  return (
    <Panel as="aside" span={4} aria-label="Identity" className={styles.panel}>
      <PanelHeader index="//" label="ID" />
      <dl className={styles.rows}>
        {rows.map((row) => (
          <ReadoutRow key={row.label} isRuled label={row.label} value={row.value} />
        ))}
        {isOpenToWork && (
          <ReadoutRow
            isRuled
            label="STATUS"
            value={
              <>
                <StatusDot tone="accent" />
                OPEN TO WORK
              </>
            }
          />
        )}
      </dl>
    </Panel>
  );
}
