// PhotographyCard.tsx - 卡片hover效果详细描述：
// 1. 卡片容器：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时边框颜色变为蓝色(#4A5F8B)，整体产生一种轻微上浮的效果
// 2. 图片：鼠标悬停在图片上时，图片会以1.05的比例进行缩放，增强视觉焦点
// 3. 作者名称链接：当鼠标悬停时，作者名称的文字颜色变为蓝色(#4A5F8B)
// 4. 标题链接：当鼠标悬停时，作品标题的文字颜色变为蓝色(#4A5F8B)
// 5. 点赞按钮：当鼠标悬停时，点赞按钮的文字颜色变为蓝色(#4A5F8B)
// 6. 评论按钮：当鼠标悬停时，评论按钮的文字颜色变为蓝色(#4A5F8B)
// 7. 收藏按钮：当鼠标悬停时，收藏按钮的文字颜色变为蓝色(#4A5F8B)

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLikeAndBookmark } from '../hooks/useLikeAndBookmark';

// 摄影作品类型定义
export interface PhotographyPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  collections: number;
  tags: string[];
  date: string;
}

// 摄影卡片组件
interface PhotographyCardProps {
  post: PhotographyPost;
}

export const PhotographyCard: React.FC<PhotographyCardProps> = ({ post }) => {
  // 使用自定义 hook 管理点赞和收藏状态
  const { 
    isLiked, 
    isBookmarked, 
    likeCount, 
    collectionCount, 
    handleLike, 
    handleBookmark 
  } = useLikeAndBookmark(post.id, post.likes, post.collections);

  // handleLike 和 handleBookmark 已在 useLikeAndBookmark hook 中定义

  // 提取设备参数信息
  const getEquipmentParams = () => {
    const firstLine = post.description.split('\n')[0];
    // 检查是否包含设备参数格式
    if (firstLine.includes('|')) {
      return firstLine;
    }
    return '';
  };

  const equipmentParams = getEquipmentParams();

  return (
    <motion.div
      whileHover={{ y: -5, borderColor: '#4A5F8B' }}
      className="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#4A5F8B] h-[500px] flex flex-col"
    >
      {/* 图片容器 */}
      <div className="relative flex-shrink-0">
        <Link to={`/photo/${post.id}`} className="block">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={post.image}
            alt={post.title}
            className="w-full h-60 object-cover"
          />
        </Link>
        
        {/* 标签 - 作品标签浅蓝灰 #4A5F8B + 浅白 #F5F7FA */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {post.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]">
              +{post.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* 内容容器 */}
      <div className="p-5 flex flex-col flex-grow">
        {/* 作者信息 */}
        <div className="flex items-center mb-3">
          <Link to={`/profile/${post.author.id}`} className="block mr-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-[#B8C6D8]"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.id}`}
              className="block font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-[#B8C6D8]">
              {post.date}
            </p>
          </div>
        </div>

        {/* 标题 */}
        <Link to={`/photo/${post.id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* 设备参数 */}
         {equipmentParams && (
          <p className="text-xs text-[#B8C6D8] mb-4 font-mono">{equipmentParams}</p>
        )}

        {/* 互动按钮 - 互动数据 (点赞/评论) 浅冷灰 #B8C6D8 */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked
                  ? 'text-red-500'
                  : 'text-[#B8C6D8] hover:text-red-500'
              }`}
              aria-label={isLiked ? "取消点赞" : "点赞"}
            >
              <motion.i
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`fa-solid ${isLiked ? 'fa-heart' : 'fa-heart'}`}
              ></motion.i>
              <span>{likeCount}</span>
            </button>
            <Link
              to={`/photo/${post.id}#comments`}
              className="flex items-center space-x-1 text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
            >
              <i className="fa-solid fa-comment"></i>
              <span>{post.comments}</span>
            </Link>
          </div>
          
            <button 
              onClick={handleBookmark}
              className={`text-sm transition-colors ${
                isBookmarked
                  ? 'text-yellow-500'
                  : 'text-[#B8C6D8] hover:text-yellow-500'
              }`}
              aria-label={isBookmarked ? "取消收藏" : "收藏"}
            >
              <i className="fa-solid fa-bookmark"></i>
              <span className="ml-1">{collectionCount}</span>
            </button>
        </div>
      </div>
    </motion.div>
  );
};