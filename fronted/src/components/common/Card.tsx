import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { HOVER_SHADOWS } from '../../constants/theme';
import { getCardClass, getCardHoverShadow } from '../../composables/useThemeHelpers';

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
  
  const baseStyles = "rounded-xl overflow-hidden shadow-sm";
  const cardClasses = `${baseStyles} ${getCardClass(theme)} ${className}`;
  const interactiveClasses = onClick ? "cursor-pointer" : "";
  
  const hoverVariants = {
    initial: { y: 0 },
    hover: { 
      y: -5,
      boxShadow: getCardHoverShadow(theme, HOVER_SHADOWS.ACCENT_XL),
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