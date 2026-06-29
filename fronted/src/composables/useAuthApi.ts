import { apiPost } from '../services/api';
import { USER_API } from '../constants/api';
import { UserRoleEnum } from '../constants/enums';

/**
 * 认证 API 调用 — 纯 TS，可直接迁移到 Vue3
 * 从 authStore 中抽离的登录/登出逻辑
 */

interface LoginResult {
  success: boolean;
  userData?: any;
  error?: string;
}

export const useAuthApi = () => {
  /** 执行登录请求，返回标准化的结果 */
  const performLogin = async (form: { username: string; password: string }): Promise<LoginResult> => {
    try {
      const responseData = await apiPost<any>(USER_API.LOGIN, form);
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token || `token_${Date.now()}`);
        return { success: true, userData: responseData };
      }
      return { success: false, error: responseData?.message || '登录失败' };
    } catch (error: any) {
      return { success: false, error: error?.message || '网络错误' };
    }
  };

  /** 验证是否为管理员角色 */
  const isAdminRole = (userData: any): boolean => {
    return userData?.userRole === UserRoleEnum.ADMIN;
  };

  /** 清除登录状态 */
  const clearAuth = (): void => {
    localStorage.removeItem('token');
  };

  return { performLogin, isAdminRole, clearAuth };
};