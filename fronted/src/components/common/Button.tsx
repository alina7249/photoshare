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
        primary: "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93] border border-[#4A5F8B]",
        secondary: "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] border border-[#4A5F8B]",
        outline: "bg-transparent text-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B]",
        danger: "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#F56565] hover:text-[#F5F7FA] border border-[#4A5F8B]",
        success: "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#48BB78] hover:text-[#F5F7FA] border border-[#4A5F8B]"
      };
    } else {
      return {
        primary: "bg-[#63B3ED] text-white hover:bg-[#4299E1] border border-[#63B3ED]",
        secondary: "bg-white text-[#1E2532] hover:bg-gray-100 border border-gray-300",
        outline: "bg-transparent text-[#63B3ED] hover:bg-blue-50 hover:text-[#4299E1] border border-[#63B3ED]",
        danger: "bg-white text-[#E53E3E] hover:bg-red-50 border border-red-300",
        success: "bg-white text-[#48BB78] hover:bg-green-50 border border-green-300"
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