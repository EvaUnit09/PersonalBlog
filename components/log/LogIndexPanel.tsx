import Link from "next/link";
import { ListRow } from "@/components/hud/ListRow";
import { Panel } from "@/components/hud/Panel";
import { PanelHeader } from "@/components/hud/PanelHeader";
import { TagList } from "@/components/hud/Tag";
import type { Post } from "@/lib/content/log";
import { padIndex } from "@/lib/padIndex";
import styles from "./LogIndexPanel.module.css";

interface LogIndexPanelProps {
  /** Newest first. */
  posts: readonly Post[];
}

export function LogIndexPanel({ posts }: LogIndexPanelProps) {
  return (
    <Panel span={12} aria-labelledby="log-title">
      <h1 id="log-title" className="visually-hidden">
        Log
      </h1>
      <PanelHeader index="04" label="Log" readout={`${padIndex(posts.length)} TOTAL`} />
      {posts.length === 0 ? (
        <p className={`t-readout ${styles.empty}`}>NO ENTRIES YET</p>
      ) : (
        <ol className={styles.list}>
          {posts.map((post) => (
            <ListRow
              key={post.slug}
              markerSize="period"
              marker={
                <>
                  LOG #{padIndex(post.number)}
                  <br />
                  <time dateTime={post.date}>{post.date}</time>
                </>
              }
              title={
                <Link href={`/log/${post.slug}`} className={styles.titleLink}>
                  {post.title}
                </Link>
              }
              summary={post.excerpt}
            >
              <div className={styles.meta}>
                <span className="t-readout">{post.readingMinutes} MIN READ</span>
                <TagList tags={post.tags} label={`${post.title} tags`} />
              </div>
            </ListRow>
          ))}
        </ol>
      )}
    </Panel>
  );
}
