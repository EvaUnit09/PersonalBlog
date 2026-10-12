import type { Status } from "@/content/home";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { ReadoutRow } from "@/components/hud/Readout";
import styles from "./StatusPanel.module.css";

interface StatusPanelProps {
  status: Status;
}

export function StatusPanel({ status }: StatusPanelProps) {
  return (
    <Panel as="aside" span={4} aria-label="Status">
      <PanelHeader index="//" label="Status" />
      {status.isOpenToWork && (
        <p className={`t-code ${styles.open}`}>
          <span aria-hidden="true" className={styles.dot} />
          OPEN TO WORK
        </p>
      )}
      <dl className={styles.readouts}>
        <ReadoutRow label="ROLE" value={status.role} />
        <ReadoutRow label="LOCATION" value={status.location} />
        <ReadoutRow label="COORD" value={status.coordinates} />
        <ReadoutRow label="PREV" value={status.previous} />
      </dl>
      {status.isOpenToWork && (
        <p className={`t-readout ${styles.prompt}`}>
          noah@astoria:~$ <span className={styles.available}>available</span>
        </p>
      )}
    </Panel>
  );
}
