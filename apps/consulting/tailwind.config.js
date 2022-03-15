const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFF',
      },
      fontFamily: {
        primary: ['Mukta', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
