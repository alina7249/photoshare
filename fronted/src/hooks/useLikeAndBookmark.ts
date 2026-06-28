import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// 自定义 hook 用于管理点赞和收藏状态
export const useLikeAndBookmark = (postId: string, initialLikes: number, initialCollections: number) => {
  const { isAuthenticated, user } = useAuth();
  
  // 从 localStorage 获取用户对该作品的点赞和收藏状态
  const [isLiked, setIsLiked] = useState(() => {
    if (isAuthenticated && user) {
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      if (savedLikes) {
        const likedPosts = JSON.parse(savedLikes);
        return likedPosts.includes(postId);
      }
    }
    return false;
  });
  
  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (isAuthenticated && user) {
      const savedBookmarks = localStorage.getItem(`user_bookmarks_${user.id}`);
      if (savedBookmarks) {
        const bookmarkedPosts = JSON.parse(savedBookmarks);
        return bookmarkedPosts.includes(postId);
      }
    }
    return false;
  });
  
  // 根据用户点赞状态计算点赞数
  const [likeCount, setLikeCount] = useState(isLiked ? initialLikes + 1 : initialLikes);
  // 根据用户收藏状态计算收藏数
  const [collectionCount, setCollectionCount] = useState(isBookmarked ? initialCollections + 1 : initialCollections);

  // 监听 localStorage 变化，实现组件间状态同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (isAuthenticated && user) {
        // 监听点赞状态变化
        if (e.key === `user_likes_${user.id}`) {
          if (e.newValue) {
            const likedPosts = JSON.parse(e.newValue);
            const newLikedState = likedPosts.includes(postId);
            
            if (newLikedState !== isLiked) {
              setIsLiked(newLikedState);
              setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
            }
          }
        }
        
        // 监听收藏状态变化
        if (e.key === `user_bookmarks_${user.id}`) {
          if (e.newValue) {
            const bookmarkedPosts = JSON.parse(e.newValue);
            const newBookmarkState = bookmarkedPosts.includes(postId);
            
            if (newBookmarkState !== isBookmarked) {
              setIsBookmarked(newBookmarkState);
              setCollectionCount(prevCount => newBookmarkState ? prevCount + 1 : prevCount - 1);
            }
          }
        }
      }
    };

    // 添加事件监听器
    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [postId, isAuthenticated, user, isLiked, isBookmarked]);

  // 处理点赞
  const handleLike = () => {
    if (!isAuthenticated) {
      // 如果未登录，引导用户登录
      toast.info('请先登录后再点赞');
      return;
    }
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // 更新点赞数量
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    
    // 保存点赞状态到 localStorage
    if (user) {
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      const likedPosts = savedLikes ? JSON.parse(savedLikes) : [];
      
      if (newLikedState) {
        likedPosts.push(postId);
      } else {
        const index = likedPosts.indexOf(postId);
        if (index > -1) {
          likedPosts.splice(index, 1);
        }
      }
      
      // 在当前标签页更新 localStorage
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(likedPosts));
      
      // 触发 storage 事件，通知其他标签页
      const event = new StorageEvent('storage', {
        key: `user_likes_${user.id}`,
        newValue: JSON.stringify(likedPosts),
        oldValue: savedLikes,
        storageArea: localStorage,
        url: window.location.href
      });
      
      // 在当前标签页手动触发自定义事件来更新状态
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: event }));
    }
    
    // 显示提示信息
    toast.success(newLikedState ? '点赞成功' : '取消点赞');
  };

  // 处理收藏
  const handleBookmark = () => {
    if (!isAuthenticated) {
      // 如果未登录，引导用户登录
      toast.info('请先登录后再收藏');
      return;
    }
    
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    
    // 更新收藏数量
    setCollectionCount(prevCount => newBookmarkState ? prevCount + 1 : prevCount - 1);
    
    // 保存收藏状态到 localStorage
    if (user) {
      const savedBookmarks = localStorage.getItem(`user_bookmarks_${user.id}`);
      const bookmarkedPosts = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      
      if (newBookmarkState) {
        bookmarkedPosts.push(postId);
      } else {
        const index = bookmarkedPosts.indexOf(postId);
        if (index > -1) {
          bookmarkedPosts.splice(index, 1);
        }
      }
      
      // 在当前标签页更新 localStorage
      localStorage.setItem(`user_bookmarks_${user.id}`, JSON.stringify(bookmarkedPosts));
      
      // 触发 storage 事件，通知其他标签页
      const event = new StorageEvent('storage', {
        key: `user_bookmarks_${user.id}`,
        newValue: JSON.stringify(bookmarkedPosts),
        oldValue: savedBookmarks,
        storageArea: localStorage,
        url: window.location.href
      });
      
      // 在当前标签页手动触发自定义事件来更新状态
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: event }));
    }
    
    // 显示提示信息
    toast.success(newBookmarkState ? '收藏成功' : '取消收藏');
  };

  return {
    isLiked,
    isBookmarked,
    likeCount,
    collectionCount,
    handleLike,
    handleBookmark
  };
};