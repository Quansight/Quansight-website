/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,ts,tsx,html,md,mdx}'],
  // Several components pick a color class at runtime from a small, fixed
  // set of tokens (see src/utils/colorTokens.ts) via a template literal
  // like `bg-${token}` -- Tailwind's JIT only generates CSS for class
  // names it can find as a literal string while scanning source files, so
  // a name built at runtime is otherwise silently dropped (the element
  // renders with NO background/text/border color at all, not a wrong
  // one). This safelist is what makes those actually ship.
  safelist: [
    {
      pattern:
        /^(bg|text|border|border-l|fill)-(violet|magenta|pink|white|black|lightgray|green|gray-400|gray-500|gray-900)$/,
    },
    // Same reasoning, for the font-size scale below picked at runtime via
    // src/utils/fontSizeTokens.ts's `text-${token}`.
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl)$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mukta', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      // Real per-widget font-size scale, snapped from a 20-value, 294-use
      // sitewide audit (see src/utils/fontSizeTokens.ts for the nearest-fit
      // logic) -- overrides Tailwind's own default named scale, which is
      // unrelated to this project's real sizes and its 62.5%-root (1rem ==
      // 10px) convention.
      fontSize: {
        xs: '1.6rem',
        sm: '1.8rem',
        base: '2.2rem',
        lg: '2.8rem',
        xl: '4rem',
        '2xl': '4.7rem',
        '3xl': '5.5rem',
        '4xl': '7rem',
      },
      colors: {
        // Real per-page Elementor CSS exports the "same" design color as
        // several slightly different literal hexes (global-kit-resolved
        // vs per-widget color-picker rounding -- e.g. violet shows up as
        // #452391/#452392/#452393 depending on the source, all one
        // intended color) -- these values are the dominant real one from
        // auditing every extracted color sitewide, not a guess; see
        // src/utils/colorTokens.ts for the full hex-to-token merge table
        // every component should go through instead of repeating its own
        // raw inline color.
        transparent: 'transparent',
        violet: '#452392',
        'violet-code': '#b2399a',
        pink: '#A43A8F',
        magenta: '#963895',
        green: '#99C941',
        black: '#000000',
        white: '#ffffff',
        lightgray: '#fafaff',
        gray: {
          50: '#FAFAFF',
          100: '#C5C5C5',
          200: '#F6F5F5',
          300: '#CED0D4',
          400: '#EBEBEB',
          500: '#A0A0A0',
          900: '#252525',
        },
        red: '#F53126',
      },
      maxWidth: {
        // The site's real boxed content width, confirmed via its own
        // global CSS (.elementor-section-boxed > .elementor-container /
        // .e-con --container-max-width, both 1140px) -- inherited as
        // 144rem (1440px) from labs' own config, which is a different
        // site with its own real width, never actually matched
        // quansight.com's. A handful of individual sections set their own
        // wider max-width (e.g. 1500px on one row) -- those aren't
        // per-widget-extracted, so this is the sitewide default, not a
        // per-section-accurate value everywhere.
        layout: '114rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '1.6rem',
            figure: { '> img': { padding: 0, margin: 0 } },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
