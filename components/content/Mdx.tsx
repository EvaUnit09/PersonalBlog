import type { ComponentPropsWithoutRef } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { createCssVariablesTheme } from "shiki/core";
import { cx } from "@/lib/cx";
import { externalLinkAttrs } from "@/lib/external-href";
import styles from "./Mdx.module.css";

// Token colours resolve to design tokens in Mdx.module.css, so code follows the site theme without a second render.
const codeTheme = createCssVariablesTheme({ name: "hud", variablePrefix: "--code-" });

function CodeSample({ className, ...rest }: ComponentPropsWithoutRef<"pre">) {
  return <pre {...rest} role="region" aria-label="Code sample" tabIndex={0} className={cx(styles.code, className)} />;
}

function ProseLink({ href, ...rest }: ComponentPropsWithoutRef<"a">) {
  const extra = href === undefined ? {} : externalLinkAttrs(href);
  return <a href={href} {...rest} {...extra} />;
}

interface MdxProps {
  source: string;
}

/** Renders an MDX body at the 70ch prose measure. JS expressions stay disabled (next-mdx-remote's default). */
export async function Mdx({ source }: MdxProps) {
  const { content } = await compileMDX({
    source,
    components: { pre: CodeSample, a: ProseLink },
    options: {
      mdxOptions: { rehypePlugins: [[rehypePrettyCode, { theme: codeTheme, keepBackground: false }]] },
    },
  });

  return (
    <div data-prose className={cx(styles.prose, "t-body")}>
      {content}
    </div>
  );
}
