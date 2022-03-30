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
        },
      },
      maxWidth: {
        layout: '144rem',
      },
    },
  },
  plugins: [],
};
