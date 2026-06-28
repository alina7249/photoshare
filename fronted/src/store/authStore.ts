import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister } from '../services/api';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
}

// 定义用户角色类型
export type UserRole = 'superAdmin' | 'admin' | 'operator';

// 定义管理员用户类型
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// 主题类型
export type Theme = 'light' | 'dark';

// 需要持久化的状态
interface AuthPersistState {
  user: User | null;
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  userRole: UserRole;
  theme: Theme;
}

// 认证状态接口
interface AuthState extends AuthPersistState {
  // 用户认证方法
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userAccount: string, password: string, checkPassword: string, userName: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  
  // 管理员认证方法
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  
  // 主题方法
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 创建认证状态管理
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 用户认证状态
      isAuthenticated: false,
      user: null,
      
      // 管理员认证状态
      isAdminAuthenticated: false,
      adminUser: null,
      userRole: 'operator',
      
      // 主题状态
      theme: (localStorage.getItem('theme') as Theme) || 'dark',
      
      // 普通用户登录方法
      login: async (username: string, password: string): Promise<boolean> => {
        try {
          const response = await apiLogin(username, password);
          const responseData = response.data as any;
          
          if (response.status === 200 && responseData) {
            const userData = responseData;
            
            const user: User = {
              id: userData.id || `user-${Date.now()}`,
              username: userData.username || username,
              email: userData.email || `${username}@example.com`,
              avatar: userData.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
              bio: userData.bio || '热爱风光和人像摄影，正在不断学习和进步中',
              joinDate: userData.joinDate || '2023-01-15',
              followers: userData.followers || 0,
              following: userData.following || 0,
              posts: userData.posts || 0
            };
            
            set({ 
              user: user,
              isAuthenticated: true 
            });
            
            localStorage.setItem('authToken', userData.token || `token_${Date.now()}`);
            
            return true;
          } else {
            console.error('Login failed:', responseData?.message || 'Unknown error');
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      // 普通用户登出方法
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false
        });
        
        localStorage.removeItem('authToken');
      },
      
      // 注册方法
      register: async (userAccount: string, password: string, checkPassword: string, userName: string): Promise<boolean> => {
        try {
          const response = await apiRegister(userAccount, password, checkPassword, userName);
          const responseData = response.data as any;
          
          if (response.status === 200 && responseData) {
            return true;
          } else {
            console.error('Register failed:', responseData?.message || 'Unknown error');
            return false;
          }
        } catch (error) {
          console.error('Register error:', error);
          return false;
        }
      },
      
      // 设置用户信息
      setUser: (user: User | null) => {
        set({ user });
      },
      
      // 设置认证状态
      setIsAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      },
      
      // 管理员登录方法
      adminLogin: async (username: string, password: string): Promise<boolean> => {
        try {
          const response = await apiLogin(username, password);
          const responseData = response.data as any;
          
          if (response.status === 200 && responseData) {
            const userData = responseData;
            
            const adminUser: AdminUser = {
              id: userData.id || `admin-${Date.now()}`,
              username: userData.username || username,
              email: userData.email || `${username}@example.com`,
              role: (userData.role as UserRole) || 'operator',
              avatar: userData.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=admin%20avatar%20professional&sign=b128ffccccb2deff34af58059c3f52df',
            };
            
            set({ 
              adminUser,
              isAdminAuthenticated: true,
              userRole: adminUser.role
            });
            
            localStorage.setItem('authToken', userData.token || `token_${Date.now()}`);
            
            return true;
          } else {
            console.error('Admin login failed:', responseData?.message || 'Unknown error');
            return false;
          }
        } catch (error) {
          console.error('Admin login error:', error);
          return false;
        }
      },
      
      // 管理员登出方法
      adminLogout: () => {
        set({ 
          adminUser: null,
          isAdminAuthenticated: false,
          userRole: 'operator'
        });
        
        localStorage.removeItem('authToken');
      },
      
      // 切换主题
      toggleTheme: () => {
        set((state: AuthState) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(newTheme);
          localStorage.setItem('theme', newTheme);
          return { ...state, theme: newTheme };
        });
      },
      
      // 设置主题
      setTheme: (theme: Theme) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
        set({ theme });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        isAdminAuthenticated: state.isAdminAuthenticated,
        userRole: state.userRole,
        theme: state.theme
      }) as AuthPersistState
    }
  )
);
