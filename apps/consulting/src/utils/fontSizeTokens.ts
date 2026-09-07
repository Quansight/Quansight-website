// Elementor's per-widget font-size is an arbitrary literal px value picked
// per instance -- confirmed sitewide: 20 distinct values (16-70px, 294
// uses) for what's really only a handful of visual roles (small UI text,
// body text, lead/subtitle, sub-heading, heading, hero title, ...).
// Snapping every extracted size to the nearest step of a small defined
// scale (see tailwind.config.cjs's fontSize) turns hundreds of one-off
// inline `font-size:Npx` styles into a handful of shared Tailwind
// classes -- same idea as colorTokens.ts, and worth doing since two real
// sizes just 1-5px apart are visually indistinguishable at these sizes.
const FONT_SIZE_SCALE: [string, number][] = [
  ['xs', 16],
  ['sm', 18],
  ['base', 22],
  ['lg', 28],
  ['xl', 40],
  ['2xl', 47],
  ['3xl', 55],
  ['4xl', 70],
];

/** Returns the Tailwind fontSize-suffix (e.g. "lg") whose real px value is
 * closest to `px`, or undefined if px is falsy. Use as `text-${token}`. */
export function sizeToken(px?: number | null): string | undefined {
  if (!px) return undefined;
  let best = FONT_SIZE_SCALE[0];
  let bestDist = Math.abs(px - best[1]);
  for (const entry of FONT_SIZE_SCALE) {
    const dist = Math.abs(px - entry[1]);
    if (dist < bestDist) {
      best = entry;
      bestDist = dist;
    }
  }
  return best[0];
}
