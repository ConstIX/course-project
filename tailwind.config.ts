import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md1: { max: '1280px' },
      md2: { max: '992.98px' },
      md3: { max: '767.98px' },
      md4: { max: '450px' }
    },
    extend: {}
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.custom-container': {
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '150px 10px 60px 10px',
          '@media (max-width: 767.98px)': {
            padding: '120px 10px 60px 10px'
          }
        }
      })
    })
  ]
} satisfies Config
