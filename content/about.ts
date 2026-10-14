export interface IdentityRow {
  label: string;
  value: string;
}

export interface PathStage {
  title: string;
  summary: string;
}

export type CertificationStatus = "held" | "in-progress";

export interface Certification {
  title: string;
  summary: string;
  status: CertificationStatus;
}

export function heldCertificationCount(items: readonly Certification[]): number {
  return items.filter((item) => {
    switch (item.status) {
      case "held":
        return true;
      case "in-progress":
        return false;
      default: {
        const _exhaustive: never = item.status;
        throw new Error(`Unhandled certification status: ${_exhaustive}`);
      }
    }
  }).length;
}

export interface AboutContent {
  baseReadout: string;
  headline: string;
  bio: readonly string[];
  identity: readonly IdentityRow[];
  path: readonly PathStage[];
  certifications: readonly Certification[];
  contactPrompt: string;
}

export const ABOUT = {
  baseReadout: "NYC",
  headline: "Marine, filmmaker, now backend engineer.",
  bio: [
    "I spent five years as a Network Infrastructure Specialist in the Marine Corps in Okinawa, keeping switches, routers, DNS, and DHCP up for 500+ users, including during exercises and deployments.",
    "After that I completed an Associate of Science in Film, Cinematography at The Los Angeles Film School. I then joined BBC Studios in New York as a Software Engineer, building internal platforms in FastAPI, Django, React, and PostgreSQL, including LLM-powered ops workflows.",
    "I like the parts of software that have to keep working: data models, APIs, and the plumbing under them. Right now I am going deeper on backend engineering and building projects in the open.",
  ],
  identity: [
    { label: "NAME", value: "NOAH DECAILLE" },
    { label: "BASE", value: "NYC" },
    { label: "FOCUS", value: "BACKEND" },
  ],
  path: [
    { title: "Network infrastructure", summary: "U.S. Marine Corps, Okinawa. Jun 2015 to Jun 2020." },
    {
      title: "Film school",
      summary: "The Los Angeles Film School. Associate of Science in Film, Cinematography. Jan 2021 to Sep 2023.",
    },
    { title: "Software", summary: "Software Engineer, BBC Studios, New York. Aug 2024 to Aug 2026." },
  ],
  certifications: [
    { title: "CompTIA Security+", summary: "CompTIA", status: "held" },
    { title: "CompTIA A+", summary: "CompTIA", status: "held" },
    { title: "CompTIA Network+", summary: "CompTIA", status: "held" },
    { title: "AWS Solutions Architect Associate (in progress)", summary: "Amazon Web Services", status: "in-progress" },
  ],
  contactPrompt: "Hiring for backend, or want to build something?",
} as const satisfies AboutContent;
