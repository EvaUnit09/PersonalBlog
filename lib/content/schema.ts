import { z } from "zod";

export const PROJECT_STATUSES = ["in-progress", "shipped"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "IN PROGRESS",
  shipped: "SHIPPED",
};

const ISO_DAY_LENGTH = "YYYY-MM-DD".length;

// YAML parses an unquoted 2026-10-11 into a Date and a quoted one into a string; accept both, emit one form.
const calendarDay = z
  .union([z.date(), z.iso.date()])
  .transform((day) => (typeof day === "string" ? day : day.toISOString().slice(0, ISO_DAY_LENGTH)));

const httpsUrl = z.url({ protocol: /^https$/ });

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
