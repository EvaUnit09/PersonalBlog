export interface ExperienceEntry {
  start: string;
  /** Omitted for the current role, rendered as "NOW". */
  end?: string;
  title: string;
  summary: string;
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
  lede: "Four years running Marine Corps network infrastructure in Okinawa, film school in Los Angeles, then software engineer at BBC Studios in New York. Building backend and full-stack systems.",
} as const satisfies Hero;

// Location is "NYC, ET" because a fixed UTC offset is wrong half the year.
export const STATUS = {
  isOpenToWork: true,
  role: "BACKEND / FULL-STACK",
  location: "NYC, ET",
  coordinates: "40.7644 / -73.9235",
  previous: "BBC STUDIOS NY",
} as const satisfies Status;

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    start: "2024",
    end: "2026",
    title: "Software Engineer, BBC Studios",
    summary:
      "New York City, NY, Aug 2024 to Aug 2026. Built and owned a FastAPI, PostgreSQL, and React/TypeScript asset platform for 2000+ assets, saving $5000/yr in licensing. Added Microsoft Entra ID SSO with AD group RBAC. Cut asset lookup and reporting by 10 hours/week with a LangGraph agent, with tracing and evaluation. Replaced an Excel JML process with a REST API and React app (30% faster onboarding and offboarding, 150+ employees/year) and built a Django checkout app that emails overdue returns for 350+ loaner requests a year.",
  },
  {
    start: "2015",
    end: "2020",
    title: "Network Infrastructure Specialist, United States Marine Corps",
    summary:
      "Okinawa, Japan, Jun 2015 to Jun 2020. Administered switches, routers, DNS, and DHCP for 500+ users across the battalion, including exercises and deployments. Automated patch deployment with PowerShell and Windows Task Scheduler to 98% compliance.",
  },
];

export const STACK = {
  daily: ["Python", "TypeScript", "FastAPI", "Django", "PostgreSQL", "React", "Next.js"],
  learning: ["LangGraph", "AWS"],
} as const satisfies Stack;
