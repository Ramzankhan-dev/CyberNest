/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#00ff41',
          dim: '#00cc33',
          glow: 'rgba(0,255,65,0.15)',
        },
        red:  { DEFAULT: '#ff003c' },
        cyan: { DEFAULT: '#00eaff' },
        bg: {
          primary:   '#020c04',
          secondary: '#040d06',
          card:      '#060f08',
        },
      },
      fontFamily: {
        mono:    ['"Share Tech Mono"', 'monospace'],
        display: ['Orbitron', 'monospace'],
        body:    ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}