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
      <div aria-hidden="true" className={styles.portrait}>
        <span className="t-readout">[PORTRAIT, 4:5]</span>
      </div>
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
