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

// ===================== Button 组件样式 =====================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';

/** 获取按钮变体样式类名 */
export const getButtonVariantClass = (theme: Theme, variant: ButtonVariant): string => {
  if (theme === 'dark') {
    const map: Record<ButtonVariant, string> = {
      primary: 'bg-accent text-text-primary hover:bg-accent-hover border border-accent',
      secondary: 'bg-deep text-text-muted hover:bg-accent border border-accent',
      outline: 'bg-transparent text-accent hover:bg-accent hover:text-text-primary border border-accent',
      danger: 'bg-deep text-text-muted hover:bg-danger hover:text-text-primary border border-accent',
      success: 'bg-deep text-text-muted hover:bg-success hover:text-text-primary border border-accent',
    };
    return map[variant];
  }
  const map: Record<ButtonVariant, string> = {
    primary: 'bg-light-accent text-white hover:bg-light-accent-hover border border-light-accent',
    secondary: 'bg-white text-deep hover:bg-gray-100 border border-gray-300',
    outline: 'bg-transparent text-light-accent hover:bg-blue-50 hover:text-light-accent-hover border border-light-accent',
    danger: 'bg-white text-danger hover:bg-red-50 border border-red-300',
    success: 'bg-white text-success hover:bg-green-50 border border-green-300',
  };
  return map[variant];
};

// ===================== Card 组件样式 =====================

/** 获取卡片容器类名 */
export const getCardClass = (theme: Theme): string => {
  return theme === 'dark' ? 'bg-card border border-accent' : 'bg-white border border-gray-200';
};

/** 获取卡片悬停阴影 */
export const getCardHoverShadow = (theme: Theme, accentXl: string): string => {
  return theme === 'dark' ? accentXl : '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
};