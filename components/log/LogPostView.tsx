import type { ReactNode } from "react";
import { Crumbs } from "@/components/hud/Crumbs";
import { PostNav } from "@/components/hud/PostNav";
import { TagList } from "@/components/hud/Tag";
import { toNavTarget } from "@/components/hud/toNavTarget";
import type { Post } from "@/lib/content/log";
import type { Neighbors } from "@/lib/neighbors";
import { padIndex } from "@/lib/padIndex";
import styles from "./LogPostView.module.css";

interface LogPostViewProps {
  post: Post;
  /** previous is the next-older post, next is the next-newer one. */
  neighbors: Neighbors<Post>;
  /** Rendered MDX body. */
  body: ReactNode;
}

export function LogPostView({ post, neighbors, body }: LogPostViewProps) {
  return (
    <main className={styles.column}>
      <Crumbs
        backHref="/log"
        backLabel="ALL ENTRIES"
        items={[`04 / LOG #${padIndex(post.number)}`, <time key="date" dateTime={post.date}>{post.date}</time>, `${post.readingMinutes} MIN READ`]}
        className={styles.crumbs}
      />
      <TagList tags={post.tags} label="Topics" className={styles.topTags} />
      <h1 className={`t-display ${styles.title}`}>{post.title}</h1>
      <p className="t-lede">{post.excerpt}</p>
      <article aria-label={`${post.title} text`} className={styles.body}>
        {body}
      </article>
      <div className={styles.footerTags}>
        <span className="t-readout">TAGS</span>
        <TagList tags={post.tags} label="Tags" />
      </div>
      <PostNav label="Post navigation" previous={toNavTarget("/log", neighbors.previous)} next={toNavTarget("/log", neighbors.next)} />
    </main>
  );
}
