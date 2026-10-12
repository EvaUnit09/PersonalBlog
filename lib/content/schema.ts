import { z } from "zod";

export const PROJECT_STATUSES = ["in-progress", "shipped"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "CURRENTLY BUILDING",
  shipped: "SHIPPED",
};

/** YYYY-MM-DD, quoted or not; FRONTMATTER_OPTIONS keeps YAML from turning it into a Date first. */
const calendarDay = z.iso.date();

const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain }).regex(/^https:\/\//);

const tagList = z.array(z.string().min(1)).min(1);

export const projectFrontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: tagList,
  status: z.enum(PROJECT_STATUSES),
  /** 1-based position: 1 is featured, and it drives "PROJECT 01 OF 04" and previous/next. */
  order: z.number().int().positive(),
  updated: calendarDay.optional(),
  links: z.object({ demo: httpsUrl.optional(), source: httpsUrl.optional() }).default({}),
  /** Rows of the SPEC readout, shown in authored order. STATUS comes from `status`. */
  spec: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).default([]),
});

export type ProjectFrontmatter = z.output<typeof projectFrontmatter>;

export const logFrontmatter = z.object({
  title: z.string().min(1),
  date: calendarDay,
  excerpt: z.string().min(1),
  /** The first tag is the post's category on the home Log cards. */
  tags: tagList,
});

export type LogFrontmatter = z.output<typeof logFrontmatter>;
