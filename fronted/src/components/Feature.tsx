import { buildCozeImageUrl } from '../constants/api';
import { useTheme } from '../hooks/useTheme';
import { HOVER_SHADOWS } from '../constants/theme';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  image: string;
}

export const Feature: React.FC = () => {
  const { theme } = useTheme();
  
  // 功能入口区数据
  const features: FeatureItem[] = [
    {
      id: "1",
      title: "艺术新作",
      description: "探索最新的艺术摄影作品，感受创作者的独特视角",
      icon: "fa-images",
      link: "/new-artworks",
      image: buildCozeImageUrl('contemporary art photography abstract composition', '3805149232bf973f6fefafdda0625e1c', 'landscape_4_3')
    },
    {
      id: "2",
      title: "黑白影像",
      description: "专注黑白摄影作品，欣赏光影、线条与质感的艺术表达",
      icon: "fa-monochrome",
      link: "/black-white",
      image: buildCozeImageUrl('black and white photography minimalist light shadow', 'feb6a8c250dd990bde311e318624c6fc', 'landscape_4_3')
    },
    {
      id: "3",
      title: "商业案例",
      description: "浏览专业摄影师的商业摄影作品，获取创作灵感",
      icon: "fa-briefcase",
      link: "/commercial",
      image: buildCozeImageUrl('commercial photography product minimalist lighting', 'd16a83dd10d81cdc1f75111914078131', 'landscape_4_3')
    }
  ];

  // 根据主题获取样式类
  const getBgClass = () => {
    return theme === 'dark' 
      ? 'bg-card border border-accent' 
      : 'bg-white border border-gray-200';
  };
  
  const getTextClass = (isPrimary: boolean) => {
    return isPrimary 
      ? (theme === 'dark' ? 'text-text-primary' : 'text-deep')
      : (theme === 'dark' ? 'text-text-muted' : 'text-accent-hover');
  };
  
  const getIconBgClass = () => {
    return theme === 'dark' ? 'bg-accent/20 text-accent' : 'bg-gray-100 text-light-accent';
  };
  
  const getLinkClass = () => {
    return theme === 'dark' 
      ? 'text-accent hover:text-accent-hover' 
      : 'text-light-accent hover:text-light-accent-hover';
  };
  
  const getShadowClass = () => {
    return theme === 'dark' 
      ? HOVER_SHADOWS.ACCENT_XL 
      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          whileHover={{ 
            y: -5,
            boxShadow: getShadowClass()
          }}
          transition={{ duration: 0.3 }}
          className={`${getBgClass()} rounded-xl overflow-hidden shadow-sm`}
        >
          <div className="h-48 overflow-hidden relative">
            <img 
              src={feature.image} 
              alt={feature.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-deep/80' : 'from-black/60'} to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end`}>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${getIconBgClass()} flex items-center justify-center`}>
                <i className={`fa-solid ${feature.icon} text-xl`}></i>
              </div>
              <div>
                <h3 className={`text-lg font-bold ${getTextClass(true)}`}>{feature.title}</h3>
                <p className={`text-sm ${getTextClass(false)}`}>{feature.description}</p>
              </div>
            </div>
            <Link 
              to={feature.link}
              className={`mt-6 inline-block ${getLinkClass()} font-medium transition-colors`}
            >
              探索更多 <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};