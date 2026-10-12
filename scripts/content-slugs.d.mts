export function buildSlugManifest(contentDir?: string): Promise<{ projects: string[]; log: string[] }>;
export function serializeManifest(manifest: { projects: string[]; log: string[] }): string;
