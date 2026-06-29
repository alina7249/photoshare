import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthApi } from '../composables/useAuthApi';
import { UserRoleEnum } from '../constants/enums';

const authApi = useAuthApi();

// ===================== 类型定义 =====================

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  userRole: UserRoleEnum;
  [key: string]: any;
}

interface AuthState {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  adminUser: User | null;
  isAdminAuthenticated: boolean;
  userRole: UserRoleEnum;
  theme: 'dark' | 'light';

  // 用户方法
  login: (form: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;

  // 管理员方法
  adminLogin: (form: { username: string; password: string }) => Promise<boolean>;
  adminLogout: () => void;

  // 主题方法
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

// ===================== Store 实现 =====================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      adminUser: null,
      isAdminAuthenticated: false,
      userRole: UserRoleEnum.USER,
      theme: 'dark',

      // 用户登录
      login: async (form) => {
        const result = await authApi.performLogin(form);
        if (result.success && result.userData) {
          set({
            user: result.userData,
            isAuthenticated: true,
            userRole: result.userData.userRole || UserRoleEnum.USER,
          });
          return true;
        }
        console.error('Login failed:', result.error);
        return false;
      },

      // 用户登出
      logout: () => {
        set({ user: null, isAuthenticated: false, userRole: UserRoleEnum.USER });
        authApi.clearAuth();
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // 管理员登录
      adminLogin: async (form) => {
        const result = await authApi.performLogin(form);
        if (result.success && result.userData) {
          if (!authApi.isAdminRole(result.userData)) {
            console.error('Admin login failed: user is not admin');
            return false;
          }
          set({
            adminUser: result.userData,
            isAdminAuthenticated: true,
            userRole: UserRoleEnum.ADMIN,
          });
          return true;
        }
        console.error('Admin login failed:', result.error);
        return false;
      },

      // 管理员登出
      adminLogout: () => {
        set({ adminUser: null, isAdminAuthenticated: false, userRole: UserRoleEnum.USER });
        authApi.clearAuth();
      },

      // 主题切换
      toggleTheme: () => {
        const current = get().theme;
        set({ theme: current === 'dark' ? 'light' : 'dark' });
      },

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        isAdminAuthenticated: state.isAdminAuthenticated,
        theme: state.theme,
      }),
    }
  )
);