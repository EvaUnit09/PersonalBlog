export type ProjectStatus = "in-progress" | "shipped";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "IN PROGRESS",
  shipped: "SHIPPED",
};

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  status: ProjectStatus;
}

export interface ExperienceEntry {
  start: string;
  /** Omitted for the current role, rendered as "NOW". */
  end?: string;
  title: string;
  summary: string;
}

export interface LogEntry {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
}

export interface Hero {
  headline: string;
  lede: string;
}

export interface Stack {
  daily: readonly string[];
  learning: readonly string[];
}

export interface Status {
  isOpenToWork: boolean;
  role: string;
  location: string;
  coordinates: string;
  previous: string;
}

export const HERO = {
  headline: "Backend engineer. Network nerd turned developer.",
  lede: "Four years running network infrastructure for the Marines in Okinawa, a detour through film production, then sole developer of internal apps at BBC Studios NY. Now going deeper on backend.",
} as const satisfies Hero;

// Location is "NYC, ET" because a fixed UTC offset is wrong half the year.
export const STATUS = {
  isOpenToWork: true,
  role: "BACKEND / FULL-STACK",
  location: "NYC, ET",
  coordinates: "40.7644 / -73.9235",
  previous: "BBC STUDIOS NY",
} as const satisfies Status;

/** The first project is the featured one. The tuple type guarantees it exists. */
export const PROJECTS: readonly [Project, ...Project[]] = [
  {
    slug: "nightcap",
    title: "Nightcap",
    summary:
      "An AI planner for date and hangout nights in NYC. Tell it the vibe and the budget, get a route of places that fit.",
    tags: ["FastAPI", "Postgres", "React", "AI agents"],
    status: "in-progress",
  },
  {
    slug: "foodsy",
    title: "Foodsy",
    summary: "Full-stack food app, end to end.",
    tags: ["Full-stack"],
    status: "in-progress",
  },
  {
    slug: "opsagent",
    title: "OpsAgent",
    summary: "AI agent orchestration for ops workflows.",
    tags: ["Agents"],
    status: "in-progress",
  },
  {
    slug: "ticketing",
    title: "Ticketing practice build",
    summary: "Ticketmaster-style system design exercise.",
    tags: ["Django", "React"],
    status: "in-progress",
  },
];

// PLACEHOLDER: years are user-supplied (see docs/design-handoff/README.md).
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    start: "[YYYY]",
    title: "Independent, backend focus",
    summary: "Portfolio builds in Django, FastAPI and Postgres.",
  },
  {
    start: "[YYYY]",
    end: "[YYYY]",
    title: "Software engineer, BBC Studios NY",
    summary: "Sole developer of internal applications on a five-person IT team.",
  },
  {
    start: "[YYYY]",
    end: "[YYYY]",
    title: "Film production, Los Angeles",
    summary: "Film school on the GI Bill, then on set. Taught myself to code here.",
  },
  {
    start: "[YYYY]",
    end: "[YYYY]",
    title: "Network Infrastructure Specialist, USMC",
    summary: "Four years in Okinawa.",
  },
];

export const STACK = {
  daily: ["Python", "Django", "FastAPI", "PostgreSQL", "TypeScript", "React"],
  learning: ["Agent observability", "System design"],
} as const satisfies Stack;

export const LOG_ENTRIES: readonly LogEntry[] = [];
