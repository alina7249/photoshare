/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        'bg-deep': '#1E2532',
        'bg-card': '#2D3748',
        'accent': '#4A5F8B',
        'accent-hover': '#6B7C93',
        'text-muted': '#B8C6D8',
        'text-primary': '#F5F7FA',
        'light-accent': '#63B3ED',
        'light-accent-hover': '#4299E1',
        'danger': '#F56565',
        'success': '#48BB78',
      },
      zIndex: {
        'dropdown': 100,
        'header': 50,
        'modal': 200,
        'toast': 300,
      },
    },
  },
  plugins: [],
};
