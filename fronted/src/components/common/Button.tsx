import React from 'react';
import { useAuthStore } from '../../store/authStore';

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
  
  // Base styles
  const baseStyles = "font-medium rounded-lg transition-colors flex items-center justify-center";
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  // 根据主题获取变体样式
  const getVariantStyles = () => {
    if (theme === 'dark') {
      return {
        primary: "bg-accent text-text-primary hover:bg-accent-hover border border-accent",
        secondary: "bg-bg-deep text-text-muted hover:bg-accent border border-accent",
        outline: "bg-transparent text-accent hover:bg-accent hover:text-text-primary border border-accent",
        danger: "bg-bg-deep text-text-muted hover:bg-danger hover:text-text-primary border border-accent",
        success: "bg-bg-deep text-text-muted hover:bg-success hover:text-text-primary border border-accent"
      };
    } else {
      return {
        primary: "bg-light-accent text-white hover:bg-light-accent-hover border border-light-accent",
        secondary: "bg-white text-bg-deep hover:bg-gray-100 border border-gray-300",
        outline: "bg-transparent text-light-accent hover:bg-blue-50 hover:text-light-accent-hover border border-light-accent",
        danger: "bg-white text-danger hover:bg-red-50 border border-red-300",
        success: "bg-white text-success hover:bg-green-50 border border-green-300"
      };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  // Disabled styles
  const disabledStyles = disabled 
    ? "opacity-60 cursor-not-allowed" 
    : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
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