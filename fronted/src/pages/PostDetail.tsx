import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from '../router/useRouter';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { useToast } from '../composables/useToast';
import { CommentSection } from '../components/CommentSection';
import { ShareButton } from '../components/common/ShareButton';
import { apiGet } from '../services/api';
import { HOVER_SHADOWS } from '../constants/theme';
import { ROUTES } from '../router/routes';

// 帖子接口定义
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    stats: {
      posts: number;
      likes: number;
      days: number;
    };
  };
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  isEssential: boolean;
  isSticky: boolean;
  relatedPosts?: Post[];
}

const PostDetail: React.FC = () => {
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // 从API获取当前帖子
    apiGet<Post>(`/topics/${id}`)
      .then((data) => {
        setPost(data);
        setLikes(data.likes);
        setRelatedPosts(data.relatedPosts || []);
      })
      .catch(() => {
        setPost(null);
        setRelatedPosts([]);
      });
  }, [id]);

  // 处理点赞
  const handleLike = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再点赞');
      return;
    }
    
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // 处理收藏
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再收藏');
      return;
    }
    
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? '已取消收藏' : '收藏成功');
  };

  // 保存阅读进度
  const saveReadingProgress = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再保存阅读进度');
      return;
    }
    
    const scrollPosition = window.scrollY;
    // 保存到localStorage
    const bookmarkPositions = JSON.parse(localStorage.getItem('bookmarkPositions') || '{}');
    bookmarkPositions[post?.id] = scrollPosition;
    localStorage.setItem('bookmarkPositions', JSON.stringify(bookmarkPositions));
    toast.success('阅读进度已保存');
  };
  
  // 处理分享
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/post/${post?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('链接已复制到剪贴板');
  };
  
  // 获取等级徽章颜色
  const getLevelBadgeClass = (level: number) => {
    if (level >= 9) return 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white';
    if (level >= 7) return 'bg-blue-800 text-white';
    if (level >= 5) return 'bg-accent text-white';
    if (level >= 3) return 'bg-gray-600 text-white';
    return 'bg-gray-300 text-gray-800';
  };
  
  // 格式化日期为相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "刚刚";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分钟前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小时前`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen flex items-center justify-center">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to={ROUTES.COMMUNITY}
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回社区</span>
          </Link>
        </div>
        
        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧帖子详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 帖子卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ 
                rotateY: 1.5, 
                scale: 1.02,
                boxShadow: HOVER_SHADOWS.ACCENT_LG,
                transition: { duration: 0.3 }
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                backgroundColor: "transparent",
              }}
              className="bg-card border border-accent rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                {/* 话题标签 */}
                <div className="flex items-center space-x-2 mb-3">
                  {post.isEssential && (
                    <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full flex items-center">
                      <i className="fa-solid fa-star mr-1"></i> 精华
                    </span>
                  )}
                  {post.isSticky && (
                    <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full flex items-center">
                      <i className="fa-solid fa-thumbtack mr-1"></i> 置顶
                    </span>
                  )}
                </div>
                
                {/* 帖子标题 */}
                <h1 className="text-2xl font-bold text-text-primary mb-4">
                  {post.title}
                </h1>
                
                {/* 作者信息 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <Link to={`/profile/${post.author.id}`} className="font-medium text-text-primary hover:text-accent transition-colors">
                          {post.author.name}
                        </Link>
                        <div className="ml-2 relative group">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getLevelBadgeClass(post.author.level)}`}>
                            Lv{post.author.level}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-deep text-text-muted text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">
                            发帖: {post.author.stats.posts} | 获赞: {post.author.stats.likes} | 活跃: {post.author.stats.days}天
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-accent-hover">{formatRelativeTime(post.createdAt)} · {post.views} 浏览</p>
                    </div>
                  </div>
                </div>
                
                {/* 帖子内容 */}
                <div className="prose prose-invert max-w-none">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    // 检查是否为标题行
                    if (paragraph.startsWith('## ')) {
                      const title = paragraph.replace('## ', '');
                      return (
                        <h2 key={index} className="text-xl font-bold text-text-primary mt-6 mb-3">
                          {title}
                        </h2>
                      );
                    } else if (paragraph.startsWith('### ')) {
                      const title = paragraph.replace('### ', '');
                      return (
                        <h3 key={index} className="text-lg font-bold text-text-primary mt-5 mb-2">
                          {title}
                        </h3>
                      );
                    } else if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={index} className="list-disc pl-5 space-y-1 mt-2 mb-4">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-text-muted">
                              {item.replace('- ', '')}
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return (
                        <p key={index} className="text-text-muted mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    }
                  })}
                </div>
                
                {/* 帖子标签 */}
                <div className="flex flex-wrap gap-2 my-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-deep text-text-muted rounded-full text-xs border border-accent"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 互动按钮 */}
                <div className="flex justify-between items-center pt-4 border-t border-accent">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      className={`flex items-center space-x-1 transition-colors ${
                        isLiked ? 'text-danger' : 'text-accent-hover hover:text-text-muted'
                      }`}
                    >
                      <motion.i
                        animate={isLiked ? { scale: [1, 1.2, 1], rotateY: 360 } : {}}
                        transition={{ duration: 0.5 }}
                        className="fa-solid fa-heart"
                      ></motion.i>
                      <span>{likes}</span>
                    </motion.button>
                    
                    <button
                      className="flex items-center space-x-1 text-accent-hover hover:text-text-muted transition-colors"
                    >
                      <i className="fa-solid fa-comment"></i>
                      <span>{post.comments}</span>
                    </button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBookmark}
                      className={`flex items-center space-x-1 transition-colors ${
                        isBookmarked ? 'text-orange' : 'text-accent-hover hover:text-text-muted'
                      }`}
                    >
                      <i className={`fa-solid ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                      <span>收藏</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => saveReadingProgress()}
                      className="text-accent-hover hover:text-text-muted transition-colors"
                      title="保存阅读进度"
                    >
                      <i className="fa-solid fa-save"></i>
                    </motion.button>
                  </div>
                  
                    <ShareButton
                       url={`${window.location.origin}/post/${post?.id}`}
                       title={post?.title}
                       className="ml-2 relative z-10"
                     />
                </div>
              </div>
            </motion.div>
            
            {/* 评论区 */}
            <CommentSection postId={post.id} />
          </div>
          
          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息卡片 */}
            <div className="bg-card border border-accent rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">{post.author.name}</h3>
                  <p className="text-xs text-accent">Lv{post.author.level}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="font-bold text-text-primary">{post.author.stats.posts}</p>
                  <p className="text-xs text-text-muted">帖子</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-primary">{post.author.stats.likes}</p>
                  <p className="text-xs text-text-muted">获赞</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-primary">{post.author.stats.days}</p>
                  <p className="text-xs text-text-muted">活跃天</p>
                </div>
              </div>
              
               <button 
                 className={`w-full py-2 rounded-lg font-medium transition-colors ${
                   isFollowing 
                     ? 'bg-accent-hover text-text-primary hover:bg-text-light-muted' 
                     : 'bg-accent text-text-primary hover:bg-accent-hover'
                 }`}
                 onClick={() => {
                   if (!isAuthenticated) {
                     toast.info('请先登录后再关注作者');
                     return;
                   }
                   
                   setIsFollowing(!isFollowing);
                   toast.success(isFollowing ? '已取消关注作者' : `已关注 ${post?.author.name}`);
                 }}
               >
                 {isFollowing ? '已关注' : '关注作者'}
               </button>
            </div>
            
            {/* 相关帖子 */}
            <div className="bg-card border border-accent rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">相关帖子</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <motion.div
                    key={relatedPost.id}
                    whileHover={{ scale: 1.03 }}
                    className="group"
                  >
                    <Link to={`/post/${relatedPost.id}`} className="block">
                      <div className="bg-deep rounded-lg p-4 border border-accent group-hover:border-accent transition-colors">
                        <h4 className="font-medium text-text-primary group-hover:text-accent transition-colors mb-1 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-text-muted">
                          {relatedPost.author.name} · {formatRelativeTime(relatedPost.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* 热门标签 */}
            <div className="bg-card border border-accent rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {post?.tags.map((tag, index) => (
                    <a
                      key={index}
                      href={`/search?tag=${tag}`}
                      className="px-3 py-1 bg-deep text-text-muted rounded-full text-xs border border-accent hover:bg-accent hover:text-text-primary transition-colors"
                    >
                      #{tag}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetail;