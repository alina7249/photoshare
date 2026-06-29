// ============================================================
// 颜色常量 — 纯 TS，无框架依赖，可直接复制到 Vue3 项目
// ============================================================

/** 基础颜色（hex 值，用于图表组件的 COLORS 数组） */
export const COLORS = {
  ACCENT: '#4A5F8B',
  ACCENT_RGB: '74, 95, 139',
  ACCENT_HOVER: '#6B7C93',
  ACCENT_HOVER_RGB: '107, 124, 147',
  MUTED: '#B8C6D8',
  MUTED_RGB: '184, 198, 216',
  PRIMARY: '#F5F7FA',
  DEEP: '#1E2532',
  DEEP_RGB: '30, 37, 50',
  CARD: '#2D3748',
  CARD_RGB: '45, 55, 72',
  DARK_SURFACE: '#2B3445',
  DARK_SURFACE_RGB: '43, 52, 69',
  LIGHT_ACCENT: '#63B3ED',
  LIGHT_ACCENT_RGB: '99, 179, 237',
  BLUE_500: '#3B82F6',
  BLUE_500_RGB: '59, 130, 246',
  DANGER: '#F56565',
  SUCCESS: '#48BB78',
  TEAL: '#38B2AC',
  ORANGE: '#F6AD55',
  PURPLE: '#9F7AEA',
  PINK: '#F687B3',
} as const;

/** 阴影常量（引用 CSS 变量） */
export const SHADOWS = {
  ACCENT_SM: 'var(--shadow-accent-sm)',
  ACCENT_MD: 'var(--shadow-accent-md)',
  ACCENT_LG: 'var(--shadow-accent-lg)',
  ACCENT_XL: 'var(--shadow-accent-xl)',
  LIGHT_SM: 'var(--shadow-light-sm)',
  LIGHT_LG: 'var(--shadow-light-lg)',
  LIGHT_ACCENT_SM: 'var(--shadow-light-accent-sm)',
  BLUE_MD: 'var(--shadow-blue-md)',
  SOFT: 'var(--shadow-soft)',
} as const;

/** 图表颜色预设（hex 值，用于 recharts 的 COLORS 数组） */
export const CHART_COLORS = {
  PRIMARY: ['#4A5F8B', '#8884d8', '#6B7C93'] as const,
  EXTENDED: ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391'] as const,
  FULL: ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391', '#B8C6D8'] as const,
  COMPARISON: ['#4A5F8B', '#8884d8', '#6B7C93', '#4CAF50'] as const,
  RADAR: ['#4A5F8B', '#8884d8', '#B8C6D8'] as const,
  DATABASE: ['#4A5F8B', '#8884d8', '#B8C6D8', '#E6EBF2'] as const,
  PROJECT: ['#4A5F8B', '#1E2532'] as const,
} as const;

/** framer-motion whileHover 阴影常量（命名风格与 SHADOWS 对齐，均为 SCREAMING_SNAKE_CASE） */
export const HOVER_SHADOWS = {
  ACCENT_MD: '0 2px 12px rgba(74, 95, 139, 0.3)',
  ACCENT_XL: '0 10px 25px -5px rgba(74, 95, 139, 0.2)',
  ACCENT_LG: '0 8px 24px rgba(74, 95, 139, 0.3)',
  SOFT: '0 2px 12px rgba(74, 95, 139, 0.2)',
  DARK_SM: '0 2px 8px rgba(0, 0, 0, 0.1)',
  DARK_LG: '0 8px 24px rgba(0, 0, 0, 0.15)',
} as const;