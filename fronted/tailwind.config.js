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
        // 深色主题色板
        'bg-deep': '#1E2532',
        'bg-card': '#2D3748',
        'bg-dark-surface': '#2B3445',
        'bg-dark-alt': '#1E2A3A',
        'bg-dark-tertiary': '#232D3F',
        'bg-dark-hover': '#3A4B6F',
        'accent': '#4A5F8B',
        'accent-hover': '#6B7C93',
        'text-muted': '#B8C6D8',
        'text-primary': '#F5F7FA',
        'text-dark-inverse': '#0F1C2D',
        // 亮色主题色板
        'light-accent': '#63B3ED',
        'light-accent-hover': '#4299E1',
        'surface-light': '#FAF9F6',
        'surface-light-card': '#E6EBF2',
        'surface-light-alt': '#E5E9F0',
        'surface-light-hover': '#FFFFFF',
        'text-light': '#4A5059',
        'text-light-muted': '#718096',
        'text-light-label': '#E2E8F0',
        'text-light-footer': '#E0E5EC',
        'border-light': '#D0D7DE',
        'border-light-form': '#4A5568',
        'gray-dark': '#2D2D2D',
        // 语义色
        'danger': '#F56565',
        'danger-dark': '#4A1A1A',
        'success': '#48BB78',
        'success-dark': '#38A169',
        'teal': '#38B2AC',
        'orange': '#F6AD55',
        'orange-dark': '#ED8936',
        'orange-darker': '#DD6B20',
        'purple': '#9F7AEA',
        'pink': '#F687B3',
        'red-weibo': '#E6162D',
        'brown': '#8B4513',
        // 品牌/社交色
        'brand-qq': '#12B7F5',
        'brand-wechat': '#07C160',
        'blue-medium': '#4A9DE6',
        'blue-dark': '#3182CE',
        // 图表色
        'chart-purple': '#8884d8',
        'chart-green': '#68D391',
        'chart-mint': '#4CAF50',
        'canvas-light': '#f8fafc',
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
