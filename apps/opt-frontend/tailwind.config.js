const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'Inter', 'Roboto', 'ui-sans-serif', 'system-ui'],
      serif: ['Merriweather', 'Georgia', 'serif'],
    },
    fontSize: {
      sm: '0.875rem',
      base: '1.2rem',
      xl: '1.5rem',
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
    },
    extend: {
      colors: {
        primary: '#FF8000', // Orange : primary color
        secondary: '#ffffff', // White : backgrounds
        textBlack: '#222222', // Dark text : contrast
      },
    },
  },
  daisyui: {
    themes: [
      {
        smartroute: {
          primary: '#FF8000',
          'primary-content': 'white',
          secondary: '#ffffff',
          neutral: '#f6f6f6',
          'base-100': '#ffffff',
          'base-content': '#222222',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};
