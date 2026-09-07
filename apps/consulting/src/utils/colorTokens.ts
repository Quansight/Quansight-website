// Elementor's per-page CSS exports the "same" design color as several
// slightly different literal hexes -- a global-kit-color reference (e.g.
// var(--e-global-color-primary)) resolves to one value, while a per-widget
// color-picker override that was meant to match it lands a rounding step
// away (confirmed sitewide: violet alone shows up as #452391/#452392/
// #452393). Without this, every component that renders an extracted color
// repeats its own raw inline `color:#452392`-style hex, and the site ends
// up with dozens of near-identical CSS values instead of one shared
// Tailwind class.
//
// This is the single merge table: every real color found anywhere in the
// scraped content maps to a Tailwind color-suffix already defined in
// tailwind.config.cjs. A hex with no entry here falls through as-is --
// callers should keep an inline-style fallback for that case rather than
// force a wrong match.
const COLOR_TOKENS: Record<string, string> = {
  '#452391': 'violet',
  '#452392': 'violet',
  '#452393': 'violet',
  '#963895': 'magenta',
  '#A43A8F': 'pink',
  '#FFFFFF': 'white',
  '#000000': 'black',
  '#191919': 'black',
  '#161515': 'black',
  '#222222': 'black',
  '#252525': 'gray-900',
  '#A0A0A0': 'gray-500',
  '#FAFAFF': 'lightgray',
  '#F3F5F8': 'lightgray',
  '#FAFAFA': 'lightgray',
  '#EBEBEB': 'gray-400',
  '#99C941': 'green',
};

/** Returns the Tailwind color-suffix (e.g. "violet", "gray-900") for a
 * real extracted hex, or undefined if it isn't one of the site's known
 * colors. Use as `text-${token}`, `bg-${token}`, `border-${token}`. */
export function colorToken(hex?: string | null): string | undefined {
  if (!hex) return undefined;
  return COLOR_TOKENS[hex.toUpperCase()];
}
