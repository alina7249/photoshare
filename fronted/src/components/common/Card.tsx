import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  onClick 
}) => {
  const { theme } = useAuthStore();
  
  // 基础卡片样式
  const baseStyles = "rounded-xl overflow-hidden shadow-sm";
  
  // 根据主题获取背景和边框颜色
  const themeStyles = theme === 'dark' 
    ? "bg-[#2D3748] border border-[#4A5F8B]" 
    : "bg-white border border-gray-200";
  
  // 组合所有样式
  const cardClasses = `${baseStyles} ${themeStyles} ${className}`;
  
  // 如果有点击事件，则添加cursor-pointer
  const interactiveClasses = onClick ? "cursor-pointer" : "";
  
  // 悬停效果配置
  const hoverVariants = {
    initial: { y: 0 },
    hover: { 
      y: -5,
      boxShadow: theme === 'dark' 
        ? "0 10px 25px -5px rgba(74, 95, 139, 0.2)" 
        : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  // 如果启用悬停效果，则使用motion组件
  if (hoverEffect) {
    return (
      <motion.div
        variants={hoverVariants}
        initial="initial"
        whileHover="hover"
        className={`${cardClasses} ${interactiveClasses}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
  
  // 否则使用普通div
  return (
    <div className={`${cardClasses} ${interactiveClasses}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;