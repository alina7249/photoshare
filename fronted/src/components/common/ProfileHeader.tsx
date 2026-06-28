import React from 'react';
import { useAuthStore } from '../../store/authStore';

interface ProfileHeaderProps {
  username: string;
  tags?: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  memberStatus?: string;
  memberDaysLeft?: number;
  avatar: string;
  coverImage: string;
  stats: {
    posts: number;
    newPosts?: number;
    likes: number;
    newLikes?: number;
    collections: number;
    newCollections?: number;
    followers: number;
    following: number;
  };
   onEditProfile?: () => void;
  onSettings?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  tags,
  level,
  levelNum,
  progress,
  progressMax,
  memberStatus,
  memberDaysLeft,
  avatar,
  coverImage,
   stats,
  onEditProfile,
  onSettings,
  onFollow,
  isFollowing = false
}) => {
  const { theme } = useAuthStore();
  
  // 根据主题获取样式类
  const getBgClass = () => {
    return theme === 'dark' 
      ? 'bg-[#2D3748] border border-[#4A5F8B]' 
      : 'bg-white border border-gray-200';
  };
  
  const getAvatarBorderClass = () => {
    return theme === 'dark' 
      ? 'border-[#2D3748] border-[#4A5F8B]' 
      : 'border-white border-gray-200';
  };
  
  const getTextClass = (isPrimary: boolean) => {
    return isPrimary 
      ? (theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]')
      : (theme === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]');
  };
  
  const getTagBgClass = () => {
    return theme === 'dark' 
      ? 'bg-[#4A5F8B]/20 text-[#B8C6D8]' 
      : 'bg-blue-50 text-[#63B3ED]';
  };
  
  const getProgressBgClass = () => {
    return theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100';
  };
  
  const getProgressFillClass = () => {
    return theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-[#63B3ED]';
  };
  
  const getButtonClass = () => {
    return theme === 'dark' 
      ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] hover:bg-[#6B7C93]' 
      : 'bg-[#63B3ED] text-white border border-[#63B3ED] hover:bg-[#4299E1]';
  };
  
  const getIconClass = () => {
    return theme === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]';
  };
  
  const getBorderClass = () => {
    return theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200';
  };

  return (
    <div className={`${getBgClass()} rounded-xl overflow-hidden shadow-sm mb-8`}>
      {/* 封面图 */}
      <div className="h-64 overflow-hidden">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 用户信息 */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row -mt-20 mb-6">
          {/* 头像 */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className={`w-40 h-40 rounded-full border-4 overflow-hidden shadow-md ${getAvatarBorderClass()}`}>
              <img
                src={avatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* 用户信息和操作按钮 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${getTextClass(true)} mb-2`}>
                  {username}
                </h1>
                {tags && (
                  <div className="ml-3 flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 text-xs ${getTagBgClass()} rounded`}>
                      {tags}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 等级和进度条 */}
              <div className="flex items-center mb-4">
                <span className={`${getTextClass(false)} text-sm mr-2`}>{level} LV.{levelNum}</span>
                <div className={`flex-1 h-2 ${getProgressBgClass()} rounded-full overflow-hidden mr-2`}>
                  <div 
                    className={getProgressFillClass()} 
                    style={{ width: `${(progress / progressMax) * 100}%` }}
                  ></div>
                </div>
                <span className={`${getTextClass(false)} text-xs`}>{progress}/{progressMax}</span>
              </div>
              
              {/* 关注与粉丝 */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <span className={`font-bold ${getTextClass(true)}`}>{stats.following}</span>
                  <span className={`${getTextClass(false)}/70 text-sm ml-1`}>关注</span>
                </div>
                <div className="flex items-center">
                  <span className={`font-bold ${getTextClass(true)}`}>{stats.followers}</span>
                  <span className={`${getTextClass(false)}/70 text-sm ml-1`}>粉丝</span>
                </div>
              </div>
            </div>
            
           {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            {onEditProfile && (
              <button 
                onClick={onEditProfile}
                className={`px-4 py-2 ${getButtonClass()} rounded-lg font-medium transition-colors`}
              >
                <i className={`fa-solid fa-pen-to-square mr-2 ${getTextClass(true)}`}></i> 编辑资料
              </button>
            )}
            {onSettings && (
              <button 
                onClick={onSettings}
                className={`px-4 py-2 ${getButtonClass()} rounded-lg font-medium transition-colors`}
              >
                <i className={`fa-solid fa-cog mr-2 ${getTextClass(true)}`}></i> 设置
              </button>
            )}
            {onFollow && (
              <button 
                onClick={onFollow}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing 
                    ? 'bg-[#6B7C93] text-[#F5F7FA]' 
                    : 'bg-[#4A5F8B] text-[#F5F7FA]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <i className={`fa-solid fa-check mr-2 ${getTextClass(true)}`}></i> 已关注
                  </>
                ) : (
                  <>
                    <i className={`fa-solid fa-plus mr-2 ${getTextClass(true)}`}></i> 关注
                  </>
                )}
              </button>
            )}
          </div>
          </div>
        </div>
        
        {/* 统计数据 */}
        <div className={`flex flex-wrap border-t ${getBorderClass()} pt-4`}>
          <div className="mr-8 mb-2">
            <div className="flex items-center space-x-1">
              <span className={`text-xl font-bold ${getTextClass(true)}`}>
                {stats.posts}
              </span>
              <i className={`fa-solid fa-image ${getIconClass()}`}></i>
            </div>
            <span className={`text-sm ${getTextClass(false)}`}>作品</span>
          </div>
          <div className="mr-8 mb-2">
            <div className="flex items-center space-x-1">
              <span className={`text-xl font-bold ${getTextClass(true)}`}>
                {stats.likes}
              </span>
              <i className={`fa-solid fa-heart ${getIconClass()}`}></i>
            </div>
            <span className={`text-sm ${getTextClass(false)}`}>获赞</span>
          </div>
          <div className="mr-8 mb-2">
            <div className="flex items-center space-x-1">
              <span className={`text-xl font-bold ${getTextClass(true)}`}>
                {stats.collections}
              </span>
              <i className={`fa-solid fa-bookmark ${getIconClass()}`}></i>
            </div>
            <span className={`text-sm ${getTextClass(false)}`}>收藏</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;