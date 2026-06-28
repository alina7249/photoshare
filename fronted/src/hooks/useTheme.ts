import { useAuthStore } from '../store/authStore';

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useAuthStore();

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark'
  };
}
