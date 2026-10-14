import type { Hero } from "@/content/home";
import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import styles from "./HeroPanel.module.css";

interface HeroPanelProps {
  hero: Hero;
}

export function HeroPanel({ hero }: HeroPanelProps) {
  return (
    <Panel id="about" span={8} size="hero" aria-labelledby="hero">
      <PanelHeader index="01" label="About" readout="NYC" className={styles.header} />
      <h1 id="hero" className={`t-display ${styles.headline}`}>
        {hero.headline}
        <span aria-hidden="true" className={styles.cursor}>
          ▌
        </span>
      </h1>
      <p className={`t-body ${styles.lede}`}>{hero.lede}</p>
      <div className={styles.actions}>
        <Button href="/projects">▸ View projects</Button>
        <Button href="/about#contact" variant="secondary">
          Contact
        </Button>
      </div>
    </Panel>
  );
}
