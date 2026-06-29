/**
 * 摄影社区业务逻辑 — 纯 TS，可直接迁移到 Vue3
 */
import { apiGet } from '../services/api';
import { buildCozeImageUrl } from '../constants/api';

// ===================== 类型定义 =====================

export interface CommunityUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  stats: {
    posts: number;
    likes: number;
    days: number;
  };
}

export interface CommunityTopic {
  id: string;
  title: string;
  content: string;
  author: CommunityUser;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  isEssential: boolean;
  isSticky: boolean;
  isSelected: boolean;
}

export interface CommunityNotification {
  id: string;
  type: 'like' | 'comment' | 'system' | 'subscription';
  content: string;
  relatedId: string;
  createdAt: string;
  isRead: boolean;
}

export interface CommunityGroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  joinDate: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  avatar: string;
  members: CommunityGroupMember[];
  posts: number;
  createdAt: string;
  isPublic: boolean;
  joined: boolean;
  tags: string[];
}

export type CommunityFilterType = 'all' | 'essential' | 'sticky';
export type CommunitySortType = 'latest' | 'popular' | 'comments';

// ===================== 初始状态 =====================

export const initCommunityState = {
  topics: [] as CommunityTopic[],
  notifications: [] as CommunityNotification[],
  showNotifications: false,
  selectedTopics: [] as string[],
  batchMode: false,
  searchQuery: '',
  filterType: 'all' as CommunityFilterType,
  sortType: 'latest' as CommunitySortType,
  bookmarkPositions: {} as Record<string, number>,
  groups: [] as CommunityGroup[],
  showGroups: false,
  showCreateGroupForm: false,
};

// ===================== 纯函数：筛选与排序 =====================

export const filterAndSortTopics = (
  topics: CommunityTopic[],
  searchQuery: string,
  filterType: CommunityFilterType,
  sortType: CommunitySortType
): CommunityTopic[] => {
  let result = [...topics];

  // 搜索过滤
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query)
    );
  }

  // 类型过滤
  if (filterType === 'essential') {
    result = result.filter((topic) => topic.isEssential);
  } else if (filterType === 'sticky') {
    result = result.filter((topic) => topic.isSticky);
  }

  // 排序
  result.sort((a, b) => {
    if (sortType === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortType === 'popular') {
      return b.likes - a.likes;
    } else {
      return b.comments - a.comments;
    }
  });

  return result;
};

// ===================== 纯函数：辅助工具 =====================

export const getLevelBadgeClass = (level: number): string => {
  if (level >= 9) return 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white';
  if (level >= 7) return 'bg-blue-800 text-white';
  if (level >= 5) return 'bg-accent text-white';
  if (level >= 3) return 'bg-gray-600 text-white';
  return 'bg-gray-300 text-gray-800';
};

export const getNotificationColorClass = (type: CommunityNotification['type']): string => {
  switch (type) {
    case 'like': return 'bg-red-500/10 text-red-400';
    case 'comment': return 'bg-blue-500/10 text-blue-400';
    case 'system': return 'bg-orange-500/10 text-orange-400';
    case 'subscription': return 'bg-green-500/10 text-green-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

export const getNotificationIcon = (type: CommunityNotification['type']): string => {
  switch (type) {
    case 'like': return 'fa-heart';
    case 'comment': return 'fa-comment';
    case 'system': return 'fa-bell';
    case 'subscription': return 'fa-rss';
    default: return 'fa-info';
  }
};

export const unreadCount = (notifications: CommunityNotification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

// ===================== 纯函数：状态操作 =====================

export const toggleTopicSelection = (selectedTopics: string[], id: string): string[] => {
  return selectedTopics.includes(id)
    ? selectedTopics.filter((topicId) => topicId !== id)
    : [...selectedTopics, id];
};

export const toggleSelectAll = (selectedTopics: string[], topics: CommunityTopic[]): string[] => {
  return selectedTopics.length === topics.length
    ? []
    : topics.map((topic) => topic.id);
};

export const markAllAsRead = (notifications: CommunityNotification[]): CommunityNotification[] => {
  return notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
};

export const saveBookmarkPosition = (
  bookmarkPositions: Record<string, number>,
  topicId: string,
  position: number
): Record<string, number> => {
  const newPositions = { ...bookmarkPositions, [topicId]: position };
  localStorage.setItem('bookmarkPositions', JSON.stringify(newPositions));
  return newPositions;
};

export const loadBookmarkPositions = (): Record<string, number> => {
  try {
    const saved = localStorage.getItem('bookmarkPositions');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const handleJoinLeaveGroup = (groups: CommunityGroup[], groupId: string): CommunityGroup[] => {
  return groups.map((group) =>
    group.id === groupId ? { ...group, joined: !group.joined } : group
  );
};

export const createNewGroup = (
  groups: CommunityGroup[],
  newGroup: Partial<CommunityGroup>
): CommunityGroup[] => {
  const group: CommunityGroup = {
    id: `g${Date.now()}`,
    name: newGroup.name || '',
    description: newGroup.description || '',
    coverImage: buildCozeImageUrl('default group cover photography', '3bc880c564b24e50436a36ff7e049628', 'landscape_16_9'),
    avatar: buildCozeImageUrl('default group logo photography', 'dffce2dd824c325946b2f4c9d5864412', 'square'),
    members: [],
    posts: 0,
    createdAt: new Date().toISOString(),
    isPublic: newGroup.isPublic || true,
    joined: true,
    tags: newGroup.tags || [],
  };

  return [group, ...groups];
};

// ===================== API 调用 =====================

export const fetchTopics = async (): Promise<CommunityTopic[]> => {
  try {
    return await apiGet<CommunityTopic[]>('/topics');
  } catch {
    return [];
  }
};

export const fetchNotifications = async (): Promise<CommunityNotification[]> => {
  try {
    return await apiGet<CommunityNotification[]>('/notifications');
  } catch {
    return [];
  }
};

export const fetchGroups = async (): Promise<CommunityGroup[]> => {
  try {
    return await apiGet<CommunityGroup[]>('/groups');
  } catch {
    return [];
  }
};

// ===================== Composable 入口 =====================

export const useCommunity = () => {
  return {
    initState: initCommunityState,
    actions: {
      fetchTopics,
      fetchNotifications,
      fetchGroups,
      filterAndSortTopics,
      getLevelBadgeClass,
      getNotificationColorClass,
      getNotificationIcon,
      unreadCount,
      toggleTopicSelection,
      toggleSelectAll,
      markAllAsRead,
      saveBookmarkPosition,
      loadBookmarkPositions,
      handleJoinLeaveGroup,
      createNewGroup,
    },
  };
};