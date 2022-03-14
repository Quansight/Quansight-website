const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '**/!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      height: {
        heroLarge: '970px',
        heroMedium: '730px',
        heroSmall: '244px',
      },
      fontSize: {
        heroTitle: ['3.125rem', '3.75rem'],
        heroSubTitle: ['2.5rem', '3rem'],
      },
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
