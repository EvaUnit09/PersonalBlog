import Link from "next/link";
import type { Post } from "@/lib/content/log";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import shared from "./shared.module.css";
import styles from "./LogPanel.module.css";

const HOME_POST_LIMIT = 3;

interface LogPanelProps {
  /** Newest first. */
  posts: readonly Post[];
}

export function LogPanel({ posts }: LogPanelProps) {
  const latest = posts.slice(0, HOME_POST_LIMIT);

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
      {latest.length === 0 ? (
        <p className={`t-readout ${styles.empty}`}>NO ENTRIES YET</p>
      ) : (
        <ul className={`grid ${shared.list} ${styles.entries}`}>
          {latest.map((post) => (
            <li key={post.slug} className="span-4">
              <Link href={`/log/${post.slug}`} className={styles.card}>
                <span className={`t-readout ${styles.meta}`}>
                  <time dateTime={post.date}>{post.date}</time> · <span className={styles.category}>{post.tags[0]}</span>
                </span>
                <span className={`t-h3 ${styles.title}`}>{post.title}</span>
                <span className={`t-body-sm ${styles.excerpt}`}>{post.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
