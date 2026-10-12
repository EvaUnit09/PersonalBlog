import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import type { AboutContent } from "@/content/about";
import styles from "./AboutIntroPanel.module.css";

interface AboutIntroPanelProps {
  about: Pick<AboutContent, "baseReadout" | "headline" | "bio">;
}

export function AboutIntroPanel({ about }: AboutIntroPanelProps) {
  return (
    <Panel span={8} size="hero" aria-labelledby="about-title">
      <PanelHeader index="01" label="About" readout={about.baseReadout} className={styles.header} />
      <h1 id="about-title" className={`t-display ${styles.headline}`}>
        {about.headline}
      </h1>
      <div className={styles.bio}>
        {about.bio.map((paragraph) => (
          <p key={paragraph} className="t-body">
            {paragraph}
          </p>
        ))}
      </div>
    </Panel>
  );
}
