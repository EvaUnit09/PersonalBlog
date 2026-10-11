import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { ReadoutRow } from "@/components/hud/Readout";
import { TagList } from "@/components/hud/Tag";

// Placeholder exercising the HUD primitives until the dashboard grid lands (Phase 3).
export default function HomePage() {
  return (
    <main className="grid">
      <Panel span={8} size="hero" aria-labelledby="hero">
        <PanelHeader index="01" label="About" readout="NYC / ASTORIA" />
        <h1 id="hero" className="t-display" style={{ margin: 0 }}>
          Backend engineer. Network nerd turned developer.
        </h1>
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <Button href="/projects">▸ View projects</Button>
          <Button href="/about" variant="secondary">Contact</Button>
        </div>
      </Panel>
      <Panel as="aside" span={4} aria-label="Status">
        <PanelHeader index="//" label="Status" />
        <dl style={{ display: "flex", flexDirection: "column", gap: "14px", margin: 0 }}>
          <ReadoutRow label="ROLE" value="BACKEND / FULL-STACK" />
          <ReadoutRow label="BUILD" value="▲ PASSING" isAccent />
        </dl>
        <TagList label="Stack" tags={["Python", "Django", "FastAPI"]} />
      </Panel>
    </main>
  );
}
