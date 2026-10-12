import type { ReactNode } from "react";
import { Crumbs } from "@/components/hud/Crumbs";
import { PostNav, type PostNavTarget } from "@/components/hud/PostNav";
import { TagList } from "@/components/hud/Tag";
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

function toTarget(post: Post | undefined): PostNavTarget | undefined {
  return post && { href: `/log/${post.slug}`, title: post.title };
}

export function LogPostView({ post, neighbors, body }: LogPostViewProps) {
  return (
    <main className={styles.column}>
      <Crumbs
        backHref="/log"
        backLabel="ALL ENTRIES"
        items={[`04 / LOG #${padIndex(post.number)}`, post.date, `${post.readingMinutes} MIN READ`]}
        className={styles.crumbs}
      />
      <TagList tags={post.tags} label="Topics" className={styles.topTags} />
      <h1 className={`t-display ${styles.title}`}>{post.title}</h1>
      <p className={styles.lede}>{post.excerpt}</p>
      <article aria-label={`${post.title} text`} className={styles.body}>
        {body}
      </article>
      <div className={styles.footerTags}>
        <span className="t-readout">TAGS</span>
        <TagList tags={post.tags} label="Tags" />
      </div>
      <PostNav label="Post navigation" previous={toTarget(neighbors.previous)} next={toTarget(neighbors.next)} />
    </main>
  );
}
