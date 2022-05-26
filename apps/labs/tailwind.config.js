const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mukta', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',
        violet: '#452393',
        pink: '#A43A8F',
        green: '#99C941',
        black: '#191919',
        white: '#ffffff',
        gray: {
          100: '#707070',
          200: '#C4C4C4',
          300: '#C5C5C5',
          400: '#EBEBEB',
          500: '#CED0D4',
        },
      },
      maxWidth: {
        layout: '144rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '1.6rem',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
