import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { getButtonVariantClass } from '../../composables/useThemeHelpers';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  loading = false
}) => {
  const { theme } = useAuthStore();
  
  const baseStyles = "font-medium rounded-lg transition-colors flex items-center justify-center";
  
  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${getButtonVariantClass(theme, variant)} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <>
          <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;