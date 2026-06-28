// ProfileDropdown.tsx - 个人资料下拉菜单组件
// 用于桌面端导航栏的下拉菜单，提供快速访问个人功能的入口
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { profileMenuItems } from '../lib/menuConfig';

interface ProfileStats {
  posts: number;
  likes: number;
  collections: number;
}

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: ProfileStats;
  avatarSrc: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  username,
  level,
  levelNum,
  progress,
  progressMax,
  stats,
  avatarSrc
}) => {
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.profile-dropdown-container')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* 背景遮罩 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 下拉面板 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-16 right-4 w-[320px] max-w-[90%] bg-[#1E2532] border border-[#4A5F8B] rounded-lg shadow-lg overflow-hidden z-50 profile-dropdown-container"
      >
        {/* 顶部身份信息区 */}
        <div className="px-6 py-4 border-b border-[#4A5F8B]">
          <div className="flex items-center space-x-4">
            {/* 头像 */}
            <div className="w-16 h-16 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md">
              <img 
                src={avatarSrc}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 用户信息 */}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#F5F7FA] mb-1">{username}</h2>
              <p className="text-[#B8C6D8]/70 text-sm">风光/人像双题材创作者</p>
              
              {/* 等级和进度条 */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#4A5F8B] text-xs">{level} LV.{levelNum}</span>
                  <span className="text-[#4A5F8B] text-xs">{progress}/{progressMax}成长值</span>
                </div>
                <div className="w-full h-1.5 bg-[#2D3748] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4A5F8B]" 
                    style={{ width: `${(progress / progressMax) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 会员标识 */}
          <div className="mt-4 bg-[#4A5F8B]/20 text-[#B8C6D8] text-xs font-medium py-1.5 px-3 rounded-full text-center border border-[#4A5F8B]">
            银河会员·年卡（剩余128天）
          </div>
        </div>
        
        {/* 中间核心数据统计区 */}
        <div className="grid grid-cols-3 gap-1 px-4 py-3 bg-[#2D3748]">
          <div className="text-center">
            <p className="text-[#B8C6D8]/70 text-xs mb-1">作品</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.posts}</p>
          </div>
          <div className="text-center">
            <p className="text-[#B8C6D8]/70 text-xs mb-1">获赞</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.likes}</p>
          </div>
          <div className="text-center">
            <p className="text-[#B8C6D8]/70 text-xs mb-1">收藏</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.collections}</p>
          </div>
        </div>
        
        {/* 下方功能列表区 */}
        <div className="max-h-[300px] overflow-y-auto">
            {profileMenuItems.map((item) => (
              <Link 
                key={item.id}
                to={item.link}
                onClick={onClose}
                className="flex items-center py-3 px-6 text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
              >
                <i className={`fa-solid ${item.icon} mr-3 text-[#4A5F8B]`}></i>
                <span>{item.text}</span>
              </Link>
            ))}
        </div>
      </motion.div>
    </div>
  );
};