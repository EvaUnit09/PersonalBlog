import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { heldCertificationCount, type Certification } from "@/content/about";
import { padIndex } from "@/lib/padIndex";
import styles from "./PathPanel.module.css";

interface CertificationsPanelProps {
  items: readonly Certification[];
}

export function CertificationsPanel({ items }: CertificationsPanelProps) {
  return (
    <Panel span={12} aria-labelledby="certs">
      <PanelHeader
        index="//"
        label="Certifications"
        labelId="certs"
        readout={`${heldCertificationCount(items)} HELD`}
      />
      <ol className={styles.list}>
        {items.map((item, i) => (
          <ListRow key={item.title} marker={padIndex(i + 1)} title={item.title} summary={item.summary} />
        ))}
      </ol>
    </Panel>
  );
}
