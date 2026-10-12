import { Button } from "@/components/hud/Button";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import type { ContactLink } from "@/content/site";
import styles from "./ContactPanel.module.css";

const EMAIL_PROTOCOL = "mailto:";

interface ContactPanelProps {
  prompt: string;
  links: readonly ContactLink[];
}

export function ContactPanel({ prompt, links }: ContactPanelProps) {
  const email = links.find((link) => link.href.startsWith(EMAIL_PROTOCOL));
  const others = links.filter((link) => link !== email);

  return (
    <Panel id="contact" span={12} aria-labelledby="contact-title">
      <PanelHeader index="05" label="Contact" labelId="contact-title" />
      <div className={styles.row}>
        <p className={`t-h2 ${styles.prompt}`}>{prompt}</p>
        <div className={styles.actions}>
          {email && (
            <Button href={email.href}>▸ {email.label} me</Button>
          )}
          {others.map((link) => (
            <Button key={link.label} href={link.href} variant="secondary">
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
