import { useAuthStore } from '../store/authStore';
import { UserRoleEnum } from '../constants/enums';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    login,
    logout,
    setUser,
  } = useAuthStore();

  return {
    isAuthenticated,
    user,
    login,
    logout,
    setUser,
  };
};

export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('token');
  const authData = localStorage.getItem('auth-storage');
  return !!(token || (authData && JSON.parse(authData).isAuthenticated));
};

export const isAdmin = (userRole: string): boolean => {
  return userRole === UserRoleEnum.ADMIN;
};