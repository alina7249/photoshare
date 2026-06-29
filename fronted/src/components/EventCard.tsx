// EventCard.tsx - 可复用的活动展示卡片组件
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HOVER_SHADOWS } from '../constants/theme';

interface EventType {
  id: string;
  title: string;
  type: string;
  image: string;
  location?: string;
  date: string;
  duration?: string;
  description: string;
  tags: string[];
  participants: number;
  maxParticipants?: number;
  price?: number;
  status?: string;
  worksCount?: number;
}

interface EventCardProps {
  item: EventType;
  isContest?: boolean;
  onRegister: () => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  item, 
  isContest = false, 
  onRegister, 
  selectedTags, 
  toggleTag 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
      className="bg-gradient-to-r from-accent to-accent-hover rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
    >
      {/* 活动/赛事图片 */}
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        
        {/* 活动/赛事信息 */}
        <div className="p-5 md:w-2/3">
          {/* 活动类型和标签 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-primary font-medium">{item.type}</span>
            {isContest ? (
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === '进行中'
                  ? 'bg-card/50 text-text-primary'
                  : item.status === '已截止'
                    ? 'bg-accent-hover text-text-primary'
                    : 'bg-card/50 text-text-primary'
              }`}>
                {item.status}
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-card/50 text-text-primary rounded-full">
                {item.tags[0] || '其他'}
              </span>
            )}
          </div>
          
          {/* 活动/赛事标题 */}
          <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-surface-light-hover transition-colors">
            {item.title}
          </h3>
          
          {/* 活动/赛事基本信息 */}
          <div className="space-y-1 mb-4">
            {!isContest && item.location && (
              <div className="flex items-center text-sm text-text-primary">
                <i className="fa-solid fa-map-marker-alt mr-2 text-text-primary"></i>
                <span>{item.location}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-text-primary">
              <i className="fa-solid fa-calendar-alt mr-2 text-text-primary"></i>
              <span>{isContest ? `截止日期：${item.date}` : item.date}</span>
            </div>
            
            {!isContest && item.duration && (
              <div className="flex items-center text-sm text-text-primary">
                <i className="fa-solid fa-clock mr-2 text-text-primary"></i>
                <span>{item.duration}</span>
              </div>
            )}
            
            {isContest && (
              <div className="flex items-center text-sm text-text-primary">
                <i className="fa-solid fa-user-group mr-2 text-text-primary"></i>
                <span>已有 {item.participants} 人{isContest ? '参赛' : '报名'}</span>
              </div>
            )}
            
            {isContest && item.worksCount && (
              <div className="flex items-center text-sm text-text-primary">
                <i className="fa-solid fa-images mr-2 text-text-primary"></i>
                <span>共提交 {item.worksCount} 件作品</span>
              </div>
            )}
          </div>
          
          {/* 描述 */}
          <p className="text-sm text-text-primary/90 mb-4 line-clamp-2">
            {item.description}
          </p>
          
          {/* 价格和参与人数 */}
          {!isContest && item.price !== undefined && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-text-primary">
                {item.price === 0 ? '免费' : `¥${item.price}`}
              </div>
              {item.maxParticipants && (
                <div className="text-sm text-text-primary">
                  {item.participants} 人已报名 / 限 {item.maxParticipants} 人
                </div>
              )}
            </div>
          )}
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 5).map((tag, index) => (
              <button
                key={index}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedTags.includes(tag)
                    ? 'bg-text-primary text-accent'
                    : 'bg-card/50 text-text-primary border border-accent-hover/30'
                } transition-colors`}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <Link
              to={isContest ? `/contest/${item.id}` : `/event/${item.id}`}
              className="flex-1 py-2 text-center bg-text-primary text-accent rounded-lg font-medium hover:bg-surface-light-hover transition-colors border border-text-primary"
            >
              查看详情
            </Link>
            <button 
              className="flex-1 py-2 text-center bg-text-primary text-accent rounded-lg font-medium hover:bg-surface-light-hover transition-colors border border-text-primary"
              onClick={onRegister}
            >
              <i className="fa-solid fa-calendar-plus mr-1"></i> {isContest ? '立即参赛' : '立即报名'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};