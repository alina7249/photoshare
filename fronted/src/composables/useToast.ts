/**
 * Toast 提示抽象层 — 封装 sonner
 * 迁移到 Vue3 时只需替换此文件内部实现
 */
import { toast } from 'sonner';

export const useToast = () => ({
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.info(msg),
  warning: (msg: string) => toast.warning(msg),
  loading: (msg: string) => toast.loading(msg),
  dismiss: () => toast.dismiss(),
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
});