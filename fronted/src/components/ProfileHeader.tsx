// ProfileHeader.tsx - 可复用的用户信息展示组件
// 专注于用户信息展示，不含导航功能，可嵌入到其他页面中
import React from 'react';

interface ProfileStats {
  posts: number;
  likes: number;
  collections: number;
}

interface ProfileHeaderProps {
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: ProfileStats;
  avatarSrc?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  level,
  levelNum,
  progress,
  progressMax,
  stats,
  avatarSrc
}) => {
  // 计算进度百分比
  const progressPercentage = (progress / progressMax) * 100;
  
  return (
    <>
      {/* 用户信息部分 */}
      {avatarSrc && (
        <div className="w-16 h-16 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md mb-3">
          <img 
            src={avatarSrc}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h2 className="text-lg font-bold text-[#F5F7FA] mb-1">{username}</h2>
      <p className="text-[#B8C6D8]/70 text-sm mb-3">风光/人像双题材创作者</p>
      
      {/* 等级和进度条 */}
      <div className="bg-[#2D3748] p-3 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#4A5F8B] text-xs">{level} LV.{levelNum}</span>
          <span className="text-[#4A5F8B] text-xs">{progress}/{progressMax}成长值</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4A5F8B]" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* 会员标识 */}
      <div className="bg-[#4A5F8B]/20 text-[#B8C6D8] text-xs font-medium py-1.5 px-3 rounded-full text-center border border-[#4A5F8B] mb-4">
        银河会员·年卡（剩余128天）
      </div>
      
      {/* 核心数据统计区 */}
      <div className="grid grid-cols-3 gap-1 px-4 py-3 bg-[#2D3748] rounded-lg">
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
    </>
  );
};