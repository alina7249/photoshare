/**
 * 主题样式辅助函数 — 纯 TS，可直接迁移到 Vue3
 * 所有返回值均为 Tailwind 类名字符串
 */

type Theme = 'dark' | 'light';

/** 获取导航栏背景类名 */
export const getHeaderBgClass = (theme: Theme, scrolled: boolean): string => {
  if (scrolled) {
    return theme === 'dark' ? 'bg-deep/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm shadow-md';
  }
  return theme === 'dark' ? 'bg-deep' : 'bg-white';
};

/** 获取导航链接文字类名 */
export const getNavTextClass = (theme: Theme, isActive: boolean): string => {
  if (isActive) {
    return theme === 'dark' ? 'text-text-primary' : 'text-deep';
  }
  return theme === 'dark' ? 'text-text-muted/70 hover:text-text-primary' : 'text-accent-hover/70 hover:text-deep';
};

/** 获取页面背景类名 */
export const getPageBgClass = (theme: Theme): string => {
  return theme === 'dark' ? 'bg-deep' : 'bg-white';
};