export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Treats an unavailable matchMedia as "reduce": no animation is the safe default. */
export function prefersReducedMotion(): boolean {
  try {
    return matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return true;
  }
}
