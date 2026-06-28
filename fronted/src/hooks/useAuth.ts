import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated
  } = useAuthStore();

  return {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated
  };
};

export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('authToken');
  const authData = localStorage.getItem('auth-storage');
  
  return !!(token || (authData && JSON.parse(authData).isAuthenticated));
};