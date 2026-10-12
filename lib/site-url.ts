const LOCAL_ORIGIN = "http://localhost:3000";

type Env = Readonly<Record<string, string | undefined>>;

function present(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseExplicitOrigin(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_URL must be an absolute http(s) URL, got "${raw}"`);
  }
  if ((url.protocol !== "http:" && url.protocol !== "https:") || !url.host) {
    throw new Error(`SITE_URL must be an absolute http(s) URL with a host, got "${raw}"`);
  }
  return raw.replace(/\/+$/, "");
}

/**
 * Production must never fall through to localhost, so a missing production host throws and fails the
 * Vercel build. Vercel's system variables are bare hosts ("example.com"), so the scheme is added here.
 */
export function resolveSiteOrigin(env: Env): string {
  const explicit = present(env.SITE_URL);
  if (explicit) return parseExplicitOrigin(explicit);

  if (env.VERCEL_ENV === "production") {
    const productionHost = present(env.VERCEL_PROJECT_PRODUCTION_URL);
    if (!productionHost) {
      throw new Error(
        "Cannot resolve the site origin for a production build: set SITE_URL or VERCEL_PROJECT_PRODUCTION_URL.",
      );
    }
    return `https://${productionHost}`;
  }

  const deploymentHost = present(env.VERCEL_URL);
  return deploymentHost ? `https://${deploymentHost}` : LOCAL_ORIGIN;
}

export function getSiteOrigin(env: Env = process.env): string {
  return resolveSiteOrigin(env);
}

/** Joins by string so a path that is already rooted never resets the origin's own path, and slashes at the seam never double. */
export function absoluteUrl(path: string, origin: string = getSiteOrigin()): string {
  return `${origin.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
