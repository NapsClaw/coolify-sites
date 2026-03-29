import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1565C0',
          'blue-light': '#1976D2',
          'blue-dark': '#0D47A1',
          orange: '#FF6F00',
          'orange-light': '#FF8F00',
          'orange-dark': '#E65100',
        }
      }
    },
  },
  plugins: [],
}
export default config
