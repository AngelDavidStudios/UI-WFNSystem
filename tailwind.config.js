/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: '#0A2342',
          primary: '#00FFFF',
          light: '#E0F7FA',
          dark: '#061829',
          grid: 'rgba(0, 255, 255, 0.1)',
        },
      },
      animation: {
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5', filter: 'brightness(1)' },
          '100%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'blueprint-grid': `
          repeating-linear-gradient(
            0deg,
            rgba(0, 255, 255, 0.03) 0px,
            transparent 1px,
            transparent 20px,
            rgba(0, 255, 255, 0.03) 21px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 255, 255, 0.03) 0px,
            transparent 1px,
            transparent 20px,
            rgba(0, 255, 255, 0.03) 21px
          )
        `,
      },
    },
  },
  plugins: [],
}
