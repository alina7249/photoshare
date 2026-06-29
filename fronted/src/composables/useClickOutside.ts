/**
 * 点击外部关闭 — 纯 TS，可直接迁移到 Vue3
 * 返回事件处理函数，由调用方负责 addEventListener / removeEventListener
 */
export const useClickOutside = (selector: string) => {
  const createHandler = (onOutsideClick: () => void) => {
    return (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(selector)) {
        onOutsideClick();
      }
    };
  };

  return { createHandler };
};