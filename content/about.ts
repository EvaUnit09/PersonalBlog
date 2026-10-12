export interface IdentityRow {
  label: string;
  value: string;
}

export interface PathStage {
  title: string;
  summary: string;
}

export interface AboutContent {
  baseReadout: string;
  headline: string;
  bio: readonly string[];
  identity: readonly IdentityRow[];
  path: readonly PathStage[];
  contactPrompt: string;
}

export const ABOUT = {
  baseReadout: "NYC / ASTORIA",
  headline: "Marine, filmmaker, now backend engineer.",
  bio: [
    "I started in the Marine Corps as a network infrastructure specialist, four years in Okinawa keeping systems up. After that I went to film school on the GI Bill and worked in production in Los Angeles.",
    "Along the way I taught myself to code, and ended up as the sole developer of internal applications on a five-person IT team at BBC Studios in New York. I like the parts of software that have to keep working: data models, APIs, and the plumbing under them.",
    "Right now I'm going deeper on backend engineering and building portfolio projects in the open.",
  ],
  identity: [
    { label: "NAME", value: "NOAH DECAILLE" },
    { label: "BASE", value: "ASTORIA, NYC" },
    { label: "FOCUS", value: "BACKEND" },
  ],
  path: [
    { title: "Network infrastructure", summary: "U.S. Marine Corps, Okinawa." },
    { title: "Film production", summary: "Film school and sets in Los Angeles." },
    { title: "Software", summary: "Self-taught, then BBC Studios NY, now backend." },
  ],
  contactPrompt: "Hiring for backend, or want to build something?",
} as const satisfies AboutContent;
