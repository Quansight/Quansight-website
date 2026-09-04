/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,ts,tsx,html,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mukta', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      colors: {
        // Real per-page Elementor CSS exports the "same" design color as
        // several slightly different literal hexes (global-kit-resolved
        // vs per-widget color-picker rounding -- e.g. violet shows up as
        // #452391/#452392/#452393 depending on the source, all one
        // intended color) -- these values are the dominant real one from
        // auditing every extracted color sitewide, not a guess; see
        // src/lib/colorTokens.ts for the full hex-to-token merge table
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
