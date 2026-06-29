/**
 * 动画抽象层 — 封装 framer-motion Variants
 * 参数对齐 Vue Transition 规范（enter-from / enter-to / leave-from / leave-to）
 * 迁移到 Vue3 时只需替换此文件内部实现
 */

// ===================== 入场动画 =====================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

export const slideDown = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const slideLeft = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// ===================== 列表动画 =====================

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const listItem = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

// ===================== 悬停动画 =====================

export const hoverLift = {
  initial: { y: 0 },
  hover: { y: -5, transition: { duration: 0.3 } },
};

export const hoverScale = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

// ===================== 页面过渡 =====================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};