const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      violet: '#452393',
      pink: '#A43A8F',
      green: '#99C941',
      black: '#191919',
    },
    maxWidth: {
      layout: '1440px',
    },
    extend: {},
  },
  plugins: [],
};
