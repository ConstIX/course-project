import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md1: { max: '1240px' },
      md2: { max: '992.98px' },
      md3: { max: '767.98px' },
      md4: { max: '450px' }
    },
    extend: {}
  },
  plugins: []
} satisfies Config
