/**
 * 滚动监听 — 纯 TS，可直接迁移到 Vue3
 * 返回 addScrollListener / removeScrollListener 函数对
 */
export const useScrollSpy = (threshold: number = 50) => {
  let ticking = false;

  const createScrollHandler = (onScrolled: (scrolled: boolean) => void) => {
    return () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  return { createScrollHandler };
};