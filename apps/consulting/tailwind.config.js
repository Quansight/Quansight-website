const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  mode: 'jit',
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
        lightgray: '#fafaff',
        gray: '#C5C5C5',
      },
      maxWidth: {
        layout: '144rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
