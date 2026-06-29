/**
 * 路由导航抽象层 — 完全隔离 react-router 原生钩子
 * 迁移到 Vue Router 时只需替换此文件内部实现
 */
import { useNavigate, useLocation, useParams as useRouterParams } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    /** 导航到指定路径 */
    push: (path: string) => navigate(path),
    /** 返回上一页 */
    back: () => navigate(-1),
    /** 替换当前路径 */
    replace: (path: string) => navigate(path, { replace: true }),
    /** 当前路径 */
    currentPath: location.pathname,
    /** 当前查询参数 */
    query: Object.fromEntries(new URLSearchParams(location.search)),
    /** 当前位置状态 */
    state: location.state as Record<string, unknown> | null,
  };
};

/** 路由参数抽象 — 对齐 Vue Router useRoute().params */
export const useParams = <T extends Record<string, string>>() => {
  return useRouterParams<T>();
};