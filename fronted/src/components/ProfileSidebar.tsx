// ProfileSidebar.tsx - 移动端侧边栏组件
// 提供完整的个人中心导航功能，包含用户信息、等级进度和菜单列表
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { profileMenuItems } from '../lib/menuConfig';

interface ProfileStats {
  posts: number;
  likes: number;
  collections: number;
}

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: ProfileStats;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  isOpen,
  onClose,
  username,
  level,
  levelNum,
  progress,
  progressMax,
  stats
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 侧边栏 */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute top-0 right-0 h-full w-[320px] max-w-[90%] bg-[#1E2532] border-l border-[#4A5F8B] star-texture overflow-y-auto"
      >
        {/* 顶部关闭按钮 */}
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#F5F7FA] hover:bg-[#2D3748] transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        {/* 顶部身份信息区 */}
        <div className="px-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#4A5F8B]">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-[#F5F7FA] mb-1">{username}</h2>
            <p className="text-[#B8C6D8]/70 text-sm">风光/人像双题材创作者</p>
          </div>
          
          {/* 等级和进度条 */}
          <div className="bg-[#2D3748] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#4A5F8B] text-sm">{level} LV.{levelNum}</span>
              <span className="text-[#4A5F8B] text-xs">{progress}/{progressMax}成长值</span>
            </div>
            <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4A5F8B]" 
                style={{ width: `${(progress / progressMax) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* 会员标识 */}
          <div className="bg-[#4A5F8B] text-[#F5F7FA] text-sm font-medium py-2 px-4 rounded-full text-center border border-[#4A5F8B]">
            银河会员·年卡（剩余128天）
          </div>
        </div>
        
        {/* 中间核心数据统计区 */}
        <div className="grid grid-cols-3 gap-1 px-6 mb-6">
          <div className="bg-[#2D3748] rounded-lg p-3 text-center">
            <p className="text-[#B8C6D8] text-sm mb-1">作品</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.posts}</p>
          </div>
          <div className="bg-[#2D3748] rounded-lg p-3 text-center">
            <p className="text-[#B8C6D8] text-sm mb-1">获赞</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.likes}</p>
          </div>
          <div className="bg-[#2D3748] rounded-lg p-3 text-center">
            <p className="text-[#B8C6D8] text-sm mb-1">收藏</p>
            <p className="text-[#F5F7FA] font-bold text-lg">{stats.collections}</p>
          </div>
        </div>
        
        {/* 下方功能列表区 */}
               <div className="px-4">
          {profileMenuItems.map((item) => (
            <Link 
              key={item.id}
              to={item.link}
              onClick={onClose}
              className={`flex items-center py-3 px-4 mb-1 rounded-lg transition-colors ${
                item.id === 'center' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
              }`}
            >
              <i className={`fa-solid ${item.icon} mr-3`}></i>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};