import { useAuthStore } from '../store/authStore';

export const useAdminAuth = () => {
  const {
    isAdminAuthenticated,
    adminUser,
    userRole,
    adminLogin,
    adminLogout
  } = useAuthStore();

  return {
    isAuthenticated: isAdminAuthenticated,
    user: adminUser,
    userRole,
    login: adminLogin,
    logout: adminLogout
  };
};