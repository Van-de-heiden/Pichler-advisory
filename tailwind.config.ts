import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5EF',
        bordeaux: {
          50:  '#F7EDEF',
          100: '#E8C9CF',
          300: '#B45C6A',
          500: '#7A1D2B',
          600: '#6A1523',
          700: '#5A0F1B',
          800: '#3F0812',
          900: '#26050B',
        },
        ink:      '#151417',
        charcoal: '#262126',
        graphite: '#3B3638',
        slate:    '#5B5558',
        taupe:    '#A99D90',
        stone:    '#D8D2C8',
        mist:     '#EEEAE3',
        gold: {
          300: '#D8C58B',
          500: '#B89B5E',
          700: '#7F6736',
        },
        positive:       '#2F6B4F',
        'positive-soft': '#E6F1EB',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        body:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        xs:    '0 1px 2px rgba(21,20,23,0.04)',
        sm:    '0 1px 3px rgba(21,20,23,0.06), 0 1px 2px rgba(21,20,23,0.04)',
        md:    '0 4px 14px rgba(21,20,23,0.07), 0 2px 5px rgba(21,20,23,0.04)',
        lg:    '0 14px 40px rgba(21,20,23,0.10), 0 4px 12px rgba(21,20,23,0.05)',
        brand: '0 10px 30px rgba(90,15,27,0.18)',
      },
      borderRadius: {
        xs:   '2px',
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '18px',
        pill: '999px',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2,0,0,1)',
        enter:    'cubic-bezier(0.16,1,0.3,1)',
        exit:     'cubic-bezier(0.7,0,0.84,0)',
      },
      transitionDuration: {
        '120': '120ms',
        '180': '180ms',
        '280': '280ms',
        '420': '420ms',
      },
      screens: {
        sm:  '560px',
        md:  '768px',
        lg:  '980px',
        xl:  '1240px',
      },
    },
  },
  plugins: [],
} satisfies Config;
