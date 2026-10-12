import { z } from "zod";

export const PROJECT_STATUSES = ["in-progress", "shipped"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "IN PROGRESS",
  shipped: "SHIPPED",
};

export const projectFrontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  status: z.enum(PROJECT_STATUSES),
  /** 1-based position: 1 is featured, and it drives "PROJECT 01 OF 04" and previous/next. */
  order: z.number().int().positive(),
  // TODO(human): fields the project detail page needs. See the handoff notes in the PR.
});

export type ProjectFrontmatter = z.output<typeof projectFrontmatter>;
