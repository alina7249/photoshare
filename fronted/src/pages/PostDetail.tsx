import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';
import { ShareButton } from '../components/common/ShareButton';

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

// 模拟帖子数据
const mockPosts: Post[] = [
  {
    id: '1',
    title: '分享我的极简主义摄影心得',
    content: `在过去的一年里，我专注于极简主义摄影，通过简化构图和色彩，突出主题的本质。今天想和大家分享一些心得和技巧。

## 极简主义摄影的核心原则

极简主义摄影的核心理念是"少即是多"（Less is more）。在构图时，我会问自己：这个元素是否必要？它是否能为主题服务？如果答案是否定的，我就会尝试移除它。

## 构图技巧分享

1. **负空间的运用**
   负空间是极简摄影中最强大的工具之一。留出足够的空白可以让主体更加突出，也能创造出宁静、简约的氛围。

2. **线条与几何形状**
   在城市环境中，我特别关注线条和几何形状。重复的图案、对角线、三角形等都能为照片增添结构感和视觉趣味。

3. **色彩的减法**
   我通常会限制照片的色彩范围，有时候甚至会直接转换为黑白。这样可以让观众的注意力更加集中在构图和光影上。

## 拍摄建议

- 随身携带相机，随时捕捉灵感
- 尝试从不同角度观察同一个场景
- 练习"框式思维"，用手或者取景器提前构图
- 后期处理时注重细节，保持简洁

希望这些心得对大家有所帮助！欢迎在评论区分享你们的作品和想法。`,
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
      level: 8,
      stats: {
        posts: 156,
        likes: 2345,
        days: 365
      }
    },
    tags: ['极简主义', '构图', '心得', '技巧'],
    createdAt: '2023-10-25',
    likes: 125,
    comments: 34,
    views: 890,
    isEssential: true,
    isSticky: false
  },
  {
    id: '2',
    title: '【器材评测】索尼A7R V深度使用体验',
    content: `入手索尼A7R V已经三个月了，作为一名专业摄影师，我想从实际使用的角度分享一下这款相机的优缺点。

## 外观与操控

A7R V的外观设计延续了索尼A7系列的经典风格，但在细节上有一些改进：

- 握把更深，长时间使用更舒适
- 新增的转盘锁定功能非常实用
- 屏幕素质提升明显，触控反应迅速

## 核心性能表现

### 画质表现
作为一台6100万像素的全画幅相机，A7R V的画质表现令人印象深刻：
- 细节保留能力极强，即使在高ISO下也能保持良好的锐度
- 宽容度表现出色，暗部提亮后噪点控制得当
- 色彩还原准确，直出色彩更加讨喜

### 对焦系统
这是A7R V最大的升级点之一：
- 新的AI对焦系统非常智能，人物、动物、鸟类识别精准
- 弱光环境下对焦速度和准确性都有显著提升
- 跟踪对焦稳定性大大增强，适合拍摄运动题材

## 电池续航与发热

- 电池续航相比上一代有明显提升，正常拍摄可以坚持一天
- 4K60P录制时发热控制良好，连续拍摄半小时没有明显过热现象
- 充电速度快，支持USB-C快充

## 总结

索尼A7R V是一款非常全面的旗舰相机，特别适合风光、人像和商业摄影。6100万像素的高分辨率传感器配合优秀的对焦系统和操控体验，使其成为专业摄影师的理想选择。当然，它的价格也不便宜，但考虑到其性能表现，我认为是值得的。

如果你对高像素有需求，并且预算充足，A7R V绝对是一个值得考虑的选择。`,
    author: {
      id: '2',
      name: '城市摄影师陈默',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1',
      level: 6,
      stats: {
        posts: 89,
        likes: 1234,
        days: 240
      }
    },
    tags: ['器材评测', '索尼', '全画幅', 'A7R5'],
    createdAt: '2023-10-24',
    likes: 230,
    comments: 56,
    views: 1250,
    isEssential: true,
    isSticky: true
  },
  {
    id: '3',
    title: '寻找城市中的几何美感',
    content: `城市环境中蕴含着丰富的几何元素，这些线条和形状构成了独特的视觉语言。分享几个我常用的寻找和拍摄方法：

### 1. 寻找重复图案

在城市中，重复的窗户、阳台、栏杆等都是很好的拍摄对象。它们可以创造出节奏感和韵律感，让照片更有视觉冲击力。

拍摄技巧：
- 使用长焦镜头压缩空间，增强重复感
- 尝试不同角度，找到最佳的构图方式
- 注意光线的方向，利用阴影增强立体感

### 2. 发现对角线和引导线

城市中的道路、桥梁、楼梯等常常形成自然的对角线和引导线，引导观众的视线。

拍摄技巧：
- 将主体放在线条的交点或尽头
- 使用广角镜头增强线条的透视感
- 尝试从高处拍摄，获得更好的线条视角

### 3. 利用建筑的几何形状

现代建筑的几何形状往往非常简洁明了，是极简摄影的绝佳素材。

拍摄技巧：
- 寻找对称的建筑结构
- 利用玻璃幕墙的反射创造有趣的画面
- 在不同时段拍摄，利用光线创造不同的效果

希望这些方法能帮助你发现城市中隐藏的几何美感。下次出门拍照时，不妨尝试用这些方法寻找新的拍摄角度！`,
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
      level: 8,
      stats: {
        posts: 156,
        likes: 2345,
        days: 365
      }
    },
    tags: ['城市摄影', '几何构图', '技巧'],
    createdAt: '2023-10-23',
    likes: 98,
    comments: 23,
    views: 650,
    isEssential: false,
    isSticky: false
  }
];

// 生成相关帖子
const generateRelatedPosts = (currentId: string): Post[] => {
  return mockPosts
    .filter(post => post.id !== currentId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
};

 const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // 查找当前帖子
    const currentPost = mockPosts.find(p => p.id === id);
    if (currentPost) {
      setPost(currentPost);
      setLikes(currentPost.likes);
      // 生成相关帖子
      setRelatedPosts(generateRelatedPosts(id));
    }
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
    if (level >= 5) return 'bg-[#4A5F8B] text-white';
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
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
        <div className="text-[#B8C6D8]">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
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
                boxShadow: "0 8px 24px rgba(74,95,139,0.3)",
                transition: { duration: 0.3 }
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                backgroundColor: "transparent",
              }}
              className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                {/* 话题标签 */}
                <div className="flex items-center space-x-2 mb-3">
                  {post.isEssential && (
                    <span className="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full flex items-center">
                      <i className="fa-solid fa-star mr-1"></i> 精华
                    </span>
                  )}
                  {post.isSticky && (
                    <span className="px-2 py-1 bg-[#48BB78]/20 text-[#48BB78] text-xs rounded-full flex items-center">
                      <i className="fa-solid fa-thumbtack mr-1"></i> 置顶
                    </span>
                  )}
                </div>
                
                {/* 帖子标题 */}
                <h1 className="text-2xl font-bold text-[#F5F7FA] mb-4">
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
                        <Link to={`/profile/${post.author.id}`} className="font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">
                          {post.author.name}
                        </Link>
                        <div className="ml-2 relative group">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getLevelBadgeClass(post.author.level)}`}>
                            Lv{post.author.level}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-[#1E2532] text-[#B8C6D8] text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">
                            发帖: {post.author.stats.posts} | 获赞: {post.author.stats.likes} | 活跃: {post.author.stats.days}天
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B7C93]">{formatRelativeTime(post.createdAt)} · {post.views} 浏览</p>
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
                        <h2 key={index} className="text-xl font-bold text-[#F5F7FA] mt-6 mb-3">
                          {title}
                        </h2>
                      );
                    } else if (paragraph.startsWith('### ')) {
                      const title = paragraph.replace('### ', '');
                      return (
                        <h3 key={index} className="text-lg font-bold text-[#F5F7FA] mt-5 mb-2">
                          {title}
                        </h3>
                      );
                    } else if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={index} className="list-disc pl-5 space-y-1 mt-2 mb-4">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-[#B8C6D8]">
                              {item.replace('- ', '')}
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return (
                        <p key={index} className="text-[#B8C6D8] mb-4 leading-relaxed">
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
                      className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 互动按钮 */}
                <div className="flex justify-between items-center pt-4 border-t border-[#4A5F8B]">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      className={`flex items-center space-x-1 transition-colors ${
                        isLiked ? 'text-[#F56565]' : 'text-[#6B7C93] hover:text-[#B8C6D8]'
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
                      className="flex items-center space-x-1 text-[#6B7C93] hover:text-[#B8C6D8] transition-colors"
                    >
                      <i className="fa-solid fa-comment"></i>
                      <span>{post.comments}</span>
                    </button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBookmark}
                      className={`flex items-center space-x-1 transition-colors ${
                        isBookmarked ? 'text-[#F6AD55]' : 'text-[#6B7C93] hover:text-[#B8C6D8]'
                      }`}
                    >
                      <i className={`fa-solid ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                      <span>收藏</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => saveReadingProgress()}
                      className="text-[#6B7C93] hover:text-[#B8C6D8] transition-colors"
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
            <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#F5F7FA]">{post.author.name}</h3>
                  <p className="text-xs text-[#4A5F8B]">Lv{post.author.level}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{post.author.stats.posts}</p>
                  <p className="text-xs text-[#B8C6D8]">帖子</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{post.author.stats.likes}</p>
                  <p className="text-xs text-[#B8C6D8]">获赞</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{post.author.stats.days}</p>
                  <p className="text-xs text-[#B8C6D8]">活跃天</p>
                </div>
              </div>
              
               <button 
                 className={`w-full py-2 rounded-lg font-medium transition-colors ${
                   isFollowing 
                     ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#718096]' 
                     : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'
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
            <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">相关帖子</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <motion.div
                    key={relatedPost.id}
                    whileHover={{ scale: 1.03 }}
                    className="group"
                  >
                    <Link to={`/post/${relatedPost.id}`} className="block">
                      <div className="bg-[#1E2532] rounded-lg p-4 border border-[#4A5F8B] group-hover:border-[#4A5F8B] transition-colors">
                        <h4 className="font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors mb-1 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-[#B8C6D8]">
                          {relatedPost.author.name} · {formatRelativeTime(relatedPost.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* 热门标签 */}
            <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(mockPosts.flatMap(p => p.tags))]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 10)
                  .map((tag, index) => (
                    <a
                      key={index}
                      href={`/search?tag=${tag}`}
                      className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
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