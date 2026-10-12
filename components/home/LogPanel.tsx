import Link from "next/link";
import type { LogEntry } from "@/content/home";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import shared from "./shared.module.css";
import styles from "./LogPanel.module.css";

interface LogPanelProps {
  entries: readonly LogEntry[];
}

export function LogPanel({ entries }: LogPanelProps) {
  return (
    <Panel id="log" span={12} aria-labelledby="lg">
      <PanelHeader
        index="04"
        label="Log"
        labelId="lg"
        readout={
          <Link href="/log" className={shared.headerLink}>
            ALL ENTRIES ▸
          </Link>
        }
      />
      {entries.length === 0 ? (
        <p className={`t-readout ${styles.empty}`}>NO ENTRIES YET</p>
      ) : (
        <ul className={`grid ${shared.list} ${styles.entries}`}>
          {entries.map((entry) => (
            <li key={entry.slug} className="span-4">
              <Link href={`/log/${entry.slug}`} className={styles.card}>
                <span className={`t-readout ${styles.meta}`}>
                  {entry.date} · <span className={styles.category}>{entry.category}</span>
                </span>
                <span className={`t-h3 ${styles.title}`}>{entry.title}</span>
                <span className={`t-body-sm ${styles.excerpt}`}>{entry.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
