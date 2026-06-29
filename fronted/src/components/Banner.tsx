import { buildCozeImageUrl } from '../constants/api';
import { useTheme } from '../hooks/useTheme';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  link: string;
}

export const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // 轮播图数据
  const slides: BannerSlide[] = [
    {
      id: "1",
      image: buildCozeImageUrl('minimalist black and white photography architecture geometric', '6a132f48365a1faa666584d6144957fd', 'landscape_16_9'),
      title: "极简黑白建筑摄影展",
      description: "探索建筑中的几何美感与光影艺术",
      author: "林风",
      avatar: buildCozeImageUrl('minimalist photographer male serious', 'fded36172bb86afa4dc326776156459c', 'square'),
      link: "/exhibition/minimalist-architecture"
    },
    {
      id: "2",
      image: buildCozeImageUrl('film photography portrait vintage style natural light', '04b4b9f4517dc870e3dfeac483c020d4', 'landscape_16_9'),
      title: "胶片摄影的永恒魅力",
      description: "专访胶片摄影师安娜，探讨传统摄影的现代意义",
      author: "安娜",
      avatar: buildCozeImageUrl('film photographer female vintage style', '5ec915debce76b46483be485e236cee2', 'square'),
      link: "/interview/film-photography"
    },
    {
      id: "3",
      image: buildCozeImageUrl('moody dark portrait atmospheric lighting', 'aa5713a64a57d8212d2c074cb9e608d2', 'landscape_16_9'),
      title: "暗调摄影的情绪表达",
      description: "如何通过暗调摄影传达深沉的情感与故事",
      author: "李明",
      avatar: buildCozeImageUrl('moody photographer male creative', 'b74f18a9e01693163824506fbbcc8c47', 'square'),
      link: "/tutorial/moody-photography"
    }
  ];

  // 自动播放轮播图
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // 切换到指定轮播图
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 下一张轮播图
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 上一张轮播图
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 根据主题获取样式类
  const getBgClass = () => {
    return theme === 'dark' 
      ? 'bg-card border border-accent' 
      : 'bg-gray-100 border border-gray-200';
  };
  
  const getGradientClass = () => {
    return theme === 'dark' 
      ? 'bg-gradient-to-t from-deep/80 to-transparent' 
      : 'bg-gradient-to-t from-black/60 to-transparent';
  };
  
  const getButtonClass = () => {
    return theme === 'dark' 
      ? 'border-2 border-accent bg-gradient-to-r from-accent to-card text-text-primary hover:from-accent-hover hover:to-accent' 
      : 'border-2 border-light-accent bg-gradient-to-r from-light-accent to-light-accent-hover text-white hover:from-light-accent-hover hover:to-blue-dark';
  };
  
  const getAvatarBorderClass = () => {
    return theme === 'dark' ? 'border-accent' : 'border-light-accent';
  };
  
  const getActiveDotClass = () => {
    return theme === 'dark' ? 'bg-accent' : 'bg-light-accent';
  };
  
  const getInactiveDotClass = () => {
    return theme === 'dark' ? 'bg-accent-hover/50' : 'bg-gray-400/50';
  };

  return (
    <div ref={slideRef} className={`relative h-[60vh] overflow-hidden rounded-xl mb-12 ${getBgClass()}`}>
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`absolute inset-0 w-full h-full ${index === currentSlide ? "z-10" : "z-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute bottom-0 left-0 right-0 ${getGradientClass()} p-8 h-1/2 flex flex-col justify-end`}>
            <div className="flex items-center mb-2">
              <img
                src={slide.avatar}
                alt={slide.author}
                className={`w-8 h-8 rounded-full mr-2 border-2 ${getAvatarBorderClass()}`}
              />
              <span className="text-text-primary text-sm">专访 {slide.author}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">{slide.title}</h2>
            <p className="text-text-muted/70 mb-2">{slide.description}</p>
            <Link 
              to={slide.link}
              className={`${getButtonClass()} px-6 py-2 rounded-lg font-medium transition-colors self-start`}
            >
              阅读详情
            </Link>
          </div>
        </motion.div>
      ))}

      {/* 轮播图导航按钮 */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-20 transition-all"
        aria-label="Previous slide"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-20 transition-all"
        aria-label="Next slide"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      {/* 轮播图指示器 */}
      <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? `${getActiveDotClass()} w-8` : getInactiveDotClass()}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};