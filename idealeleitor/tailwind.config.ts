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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#1e3364',
          900: '#172554',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        green: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
    },
  },
  plugins: [],
}

export default config
