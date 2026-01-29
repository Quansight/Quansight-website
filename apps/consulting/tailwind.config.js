const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  mode: 'jit',
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{ts,tsx,html,md,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mukta', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      colors: {
        transparent: 'transparent',
        violet: '#452393',
        'violet-code': '#b2399a',
        pink: '#A43A8F',
        green: '#99C941',
        black: '#191919',
        white: '#ffffff',
        lightgray: '#fafaff',
        gray: {
          50: '#FAFAFF',
          100: '#C5C5C5',
          200: '#F6F5F5',
          300: '#CED0D4',
          400: '#EBEBEB',
        },
        red: '#F53126',
      },
      maxWidth: {
        layout: '144rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            figure: {
              '> img': {
                padding: 0,
                margin: 0,
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
