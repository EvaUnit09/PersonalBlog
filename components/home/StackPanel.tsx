import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import type { Stack } from "@/content/home";
import styles from "./StackPanel.module.css";

interface StackPanelProps {
  stack: Stack;
}

export function StackPanel({ stack }: StackPanelProps) {
  return (
    <Panel as="aside" span={5} aria-label="Stack" className={styles.panel}>
      <PanelHeader index="//" label="Stack" readout="DAILY" />
      <TagList tags={stack.daily} label="Daily stack" />
      <div className={styles.learning}>
        <p className={`t-readout ${styles.label}`}>LEARNING</p>
        <TagList tags={stack.learning} label="Learning" />
      </div>
    </Panel>
  );
}
