import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { toast } from 'sonner';

// 定义类型
interface GroupMember {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  avatar: string;
  coverImage: string;
  joined: boolean;
  tags?: string[];
}

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
  canDelete?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = (
  {
    group,
    onJoin,
    onLeave,
    onDelete,
    canDelete = false
  }
) => {
  const { isAuthenticated } = useAuth();

  const handleJoinLeave = () => {
    if (!isAuthenticated) {
      toast.info("请先登录后再操作");
      return;
    }

    if (group.joined) {
      if (window.confirm(`确定要退出"${group.name}"小组吗？`)) {
        if (onLeave) {
          onLeave(group.id);
        }
      }
    } else {
      if (onJoin) {
        onJoin(group.id);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm(`确定要删除"${group.name}"小组吗？此操作不可撤销。`)) {
      if (onDelete) {
        onDelete(group.id);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] hover:shadow-lg transition-shadow"
    >
      {/* 封面图 */}
      <div className="relative h-32">
        <img
          src={group.coverImage}
          alt={`${group.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* 小组头像 */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="w-16 h-16 rounded-full border-4 border-[#2D3748] overflow-hidden">
            <img
              src={group.avatar}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">
            <Link to={`/groups/${group.id}`} className="hover:text-[#63B3ED] transition-colors">
              {group.name}
            </Link>
          </h3>
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              title="删除小组"
            >
              <i className="fa-solid fa-trash-can text-sm" />
            </button>
          )}
        </div>

        <p className="text-[#B8C6D8] text-sm mb-3 line-clamp-2">
          {group.description}
        </p>

        {/* 标签 */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#4A5F8B]/30 text-[#B8C6D8] text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-[#4A5F8B]/30 text-[#B8C6D8] text-xs rounded-full">
                +{group.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 统计信息和操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-[#B8C6D8]">
              <i className="fa-solid fa-users mr-1" />
              {group.members}
            </span>
            <span className="text-[#B8C6D8]">
              <i className="fa-solid fa-message-circle mr-1" />
              {group.posts}
            </span>
          </div>

          <button
            onClick={handleJoinLeave}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              group.joined
                ? 'bg-[#4A5F8B]/30 text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                : 'bg-[#63B3ED] text-white hover:bg-[#4A9DE6]'
            }`}
          >
            {group.joined ? '退出' : '加入'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;
