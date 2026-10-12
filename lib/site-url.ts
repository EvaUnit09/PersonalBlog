const LOCAL_ORIGIN = "http://localhost:3000";

type Env = Readonly<Record<string, string | undefined>>;

/** Vercel's system variable is a bare host ("example.com"), so the scheme is added here. */
export function getSiteOrigin(env: Env = process.env): string {
  const host = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return host ? `https://${host}` : LOCAL_ORIGIN;
}

export function absoluteUrl(path: string, origin: string = getSiteOrigin()): string {
  return new URL(path, origin).toString();
}
