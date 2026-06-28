import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { Empty } from '../components/Empty';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// 模拟用户数据
const mockUser = {
  id: 'user-123',
  username: '@光影捕手',
  email: 'user@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male%20portrait&sign=e53a45a0e2ef5ba23982d6db8693456b',
  bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
  joinDate: '2023-01-15',
  followers: 123,
  following: 45,
  posts: 28,
  coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20modern%20minimalist&sign=8848033bdf94e05818be4d57164ea015',
  level: '新锐摄影师',
  levelNum: 3,
  progress: 120,
  progressMax: 200,
  tags: '风光/人像双题材创作者',
  memberStatus: '银河会员·年卡',
  memberDaysLeft: 128
};

// 模拟作品数据
const mockPhotographyPosts = [
  {
    id: "1",
    title: "晨曦中的山峦",
    description: "捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 324,
    comments: 45,
    tags: ["风光", "日出", "云海", "自然"],
    date: "2023-10-25",
    views: 1256,
    format: "RAW",
    visibility: "公开",
    copyrightType: "独家授权"
  },
  {
    id: "2",
    title: "城市剪影",
    description: "从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 289,
    comments: 37,
    tags: ["城市", "建筑", "剪影", "夕阳"],
    date: "2023-10-22",
    views: 987,
    format: "JPG",
    visibility: "公开",
    copyrightType: "非独家"
  },
  {
    id: "3",
    title: "海浪与礁石",
    description: "长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 412,
    comments: 53,
    tags: ["海景", "慢门", "自然", "礁石"],
    date: "2023-10-18",
    views: 1452,
    format: "RAW",
    visibility: "仅好友可见",
    copyrightType: "独家授权"
  },
  {
    id: "4",
    title: "森林晨雾",
    description: "在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 387,
    comments: 49,
    tags: ["森林", "晨雾", "丁达尔效应", "自然"],
    date: "2023-10-15",
    views: 1328,
    format: "JPG",
    visibility: "公开",
    copyrightType: "非独家"
  },
  {
    id: "5",
    title: "湖畔日落",
    description: "平静的湖面倒映着绚丽的晚霞，形成对称的美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf074634422a50690ffb6c",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 456,
    comments: 61,
    tags: ["湖泊", "日落", "倒影", "晚霞"],
    date: "2023-10-12",
    views: 1689,
    format: "RAW",
    visibility: "公开",
    copyrightType: "独家授权"
  },
  {
    id: "6",
    title: "星空下的古堡",
    description: "在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2",
    author: {
      id: "user-123",
      name: "@光影捕手",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },
    likes: 523,
    comments: 78,
    tags: ["星空", "夜景", "古堡", "银河"],
    date: "2023-10-08",
    views: 1976,
    format: "RAW",
    visibility: "私密",
    copyrightType: "独家授权"
  }
];

// 月度浏览数据
const monthlyViewsData = [
  { date: "10/1", views: 150, likes: 25 },
  { date: "10/5", views: 250, likes: 45 },
  { date: "10/10", views: 210, likes: 38 },
  { date: "10/15", views: 240, likes: 44 },
  { date: "10/20", views: 190, likes: 35 },
  { date: "10/25", views: 220, likes: 40 },
];

// 最近活动
const recentActivities = [
  { id: 1, text: "3天前发布作品《城市剪影》，获赞23次", type: "post" },
  { id: 2, text: "1周前获得新粉丝5人", type: "follower" },
  { id: 3, text: "2周前完成新手任务《发布第一张作品》", type: "task" },
  { id: 4, text: "3周前作品《森林晨雾》被推荐到首页", type: "featured" },
];

// 最近器材
const recentEquipment = [
  { id: 1, name: "索尼 A7R IV", type: "camera" },
  { id: 2, name: "佳能 EF 24-70mm f/2.8L", type: "lens" },
  { id: 3, name: "DJI Mavic 3", type: "drone" },
];

const Profile: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'likes' | 'stats'>('posts');
  const [sortBy, setSortBy] = useState("latest");
  const [selectedTag, setSelectedTag] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [newPostVisibility, setNewPostVisibility] = useState("公开");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 初始化模拟用户数据
  const [profileUser] = useState({
    id: 'user-123',
    username: '@光影捕手',
    email: 'user@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male%20portrait&sign=e53a45a0e2ef5ba23982d6db8693456b',
    bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
    joinDate: '2023-01-15',
    followers: 123,
    following: 45,
    posts: 28,
    likes: mockPhotographyPosts.reduce((sum, post) => sum + post.likes, 0)
  });
  
  // 检查是否是当前用户自己的主页
  const isCurrentUser = isAuthenticated && user?.id === profileUser.id;
  
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(false);
  
  // 获取所有标签
  const getAllTags = () => {
    const tags = ["全部"];
    mockPhotographyPosts.forEach(post => {
      post.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    return tags;
  };
  
  // 筛选作品
  const getFilteredPosts = () => {
    let posts = [...mockPhotographyPosts];
    
    if (selectedTag !== "全部") {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(
        post => post.title.toLowerCase().includes(term) || 
                post.description.toLowerCase().includes(term) || 
                post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    if (visibilityFilter !== "all") {
      posts = posts.filter(post => {
        if (visibilityFilter === "public") return post.visibility === "公开";
        if (visibilityFilter === "friends") return post.visibility === "仅好友可见";
        if (visibilityFilter === "private") return post.visibility === "私密";
        return true;
      });
    }
    
    if (formatFilter !== "all") {
      posts = posts.filter(post => {
        if (formatFilter === "raw") return post.format === "RAW";
        if (formatFilter === "jpg") return post.format === "JPG";
        return true;
      });
    }
    
    if (sortBy === "latest") {
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "popular") {
      posts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "views") {
      posts.sort((a, b) => b.views - a.views);
    }
    
    return posts;
  };
  
  const filteredPosts = getFilteredPosts();
  const allTags = getAllTags();
  
  // 根据当前激活的标签显示对应的内容
  const displayPosts = activeTab === 'posts' ? filteredPosts : 
                      activeTab === 'collections' ? mockPhotographyPosts.slice(0, 2) : 
                      mockPhotographyPosts.slice(1, 3);
  
  // 格式化日期为相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "刚刚";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`;
    return date.toLocaleDateString('zh-CN');
  };
  
  // 处理上传
  const handleUpload = () => {
    setShowUploadModal(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };
  
  const handleSubmitUpload = () => {
    if (!selectedFile || !newPostTitle.trim()) {
      toast.warning("请选择图片并填写标题");
      return;
    }
    
    setUploading(true);
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast.success("作品上传成功");
          setSelectedFile(null);
          setNewPostTitle("");
          setNewPostDescription("");
          setNewPostTags("");
          setNewPostVisibility("公开");
          setUploading(false);
          setShowUploadModal(false);
        }, 500);
      }
    }, 200);
  };
  
  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setNewPostTitle("");
    setNewPostDescription("");
    setNewPostTags("");
    setNewPostVisibility("公开");
    setUploadProgress(0);
  };
  
  // 检查用户是否登录，如果没有登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看用户主页内容，支持创作者</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
          >
            立即登录
          </button>
        </div>
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
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回首页</span>
          </button>
        </div>
        
        {/* 个人资料卡片 */}
        <div className="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm border border-[#4A5F8B] mb-8">
          {/* 封面图 */}
          <div className="h-64 overflow-hidden">
            <img
              src={mockUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 用户信息 */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row -mt-20 mb-6">
              {/* 头像 */}
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-40 h-40 rounded-full border-4 border-[#2D3748] overflow-hidden shadow-md border-[#4A5F8B]">
                  <img
                    src={profileUser.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* 用户信息和操作按钮 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-[#F5F7FA] mb-2">
                      {profileUser.username}
                    </h1>
                    <div className="ml-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 text-xs bg-[#4A5F8B]/20 text-[#B8C6D8] rounded">
                        {mockUser.tags}
                      </span>
                    </div>
                  </div>
                  
                  {/* 等级和进度条 */}
                  <div className="flex items-center mb-4">
                    <span className="text-[#B8C6D8] text-sm mr-2">{mockUser.level} LV.{mockUser.levelNum}</span>
                    <div className="flex-1 h-2 bg-[#1E2532] rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-[#4A5F8B]" 
                        style={{ width: `${(mockUser.progress / mockUser.progressMax) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[#B8C6D8] text-xs">{mockUser.progress}/{mockUser.progressMax}</span>
                  </div>
                  
                  {/* 个人简介 */}
                  <p className="text-[#B8C6D8] mb-4">{profileUser.bio}</p>
                  
                  {/* 关注与粉丝 */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <span className="font-bold text-[#F5F7FA]">{profileUser.following}</span>
                      <span className="text-[#B8C6D8]/70 text-sm ml-1">关注</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-[#F5F7FA]">{profileUser.followers}</span>
                      <span className="text-[#B8C6D8]/70 text-sm ml-1">粉丝</span>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3">
                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() => navigate('/profile/settings')}
                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                      >
                        <i className="fa-solid fa-pen-to-square mr-2 text-[#F5F7FA]"></i> 编辑资料
                      </button>
                      <button
                        onClick={() => navigate('/profile/settings')}
                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                      >
                        <i className="fa-solid fa-cog mr-2 text-[#F5F7FA]"></i> 设置
                      </button>
                    </>
                  )}
                  {!isCurrentUser && (
                     <div className="flex items-center space-x-3">
                     <button 
                       className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                         isFollowing 
                           ? 'bg-[#6B7C93] text-[#F5F7FA] border-[#6B7C93]' 
                           : 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]'
                       }`}
                       onClick={() => {
                         if (!isAuthenticated) {
                           toast.info('请先登录后再关注用户');
                           return;
                         }
                         
                         setIsFollowing(!isFollowing);
                         toast.success(isFollowing ? '已取消关注' : `已关注 ${profileUser.username}`);
                       }}
                     >
                      {isFollowing ? (
                        <>
                          <i className="fa-solid fa-check mr-2 text-[#F5F7FA]"></i> 已关注
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus mr-2 text-[#F5F7FA]"></i> 关注
                        </>
                      )}
                    </button>
                     <button 
                       onClick={async () => {
                         try {
                           await navigator.clipboard.writeText(`${window.location.origin}/profile/${profileUser.id}`);
                           toast.success('用户主页链接已复制到剪贴板');
                         } catch (err) {
                           toast.error('复制失败，请手动复制');
                         }
                       }}
                       className="p-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] relative z-10"
                       title="分享用户主页"
                     >
                       <i className="fa-solid fa-share-nodes"></i>
                     </button>
                     </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 统计数据 */}
            <div className="flex flex-wrap border-t border-[#4A5F8B] pt-4">
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    {profileUser.posts}
                  </span>
                  <i className="fa-solid fa-image text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">作品</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    {profileUser.likes}
                  </span>
                  <i className="fa-solid fa-heart text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">获赞</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    48
                  </span>
                  <i className="fa-solid fa-bookmark text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">收藏</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 内容标签页 - 整合个人中心功能 */}
        <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex border-b border-[#4A5F8B]">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              作品 ({profileUser.posts})
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'collections'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              收藏 (48)
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'likes'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              点赞 ({profileUser.likes})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              数据统计
            </button>
          </div>
          
          {/* 数据统计页面 */}
          {activeTab === 'stats' && (
            <div className="p-6">
              {/* 创作数据趋势图 */}
              <div className="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">创作数据</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyViewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                      <XAxis dataKey="date" stroke="#B8C6D8" />
                      <YAxis stroke="#B8C6D8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5F8B', color: '#F5F7FA' }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const viewsData = payload.find(item => item.dataKey === "views");
                            const likesData = payload.find(item => item.dataKey === "likes");
                            return (
                              <div className="bg-[#2D3748] border border-[#4A5F8B] p-3 rounded-lg">
                                <p className="text-[#B8C6D8] font-medium mb-2">{`${label}数据`}</p>
                                {viewsData && <p className="text-[#B8C6D8] mb-1">浏览量: {viewsData.value}</p>}
                                {likesData && <p className="text-[#B8C6D8]">点赞量: {likesData.value}</p>}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#4A5F8B" strokeWidth={2} dot={false} name="浏览量" />
                      <Line type="monotone" dataKey="likes" stroke="#6B7C93" strokeWidth={2} dot={false} name="点赞量" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* 最近活动 */}
              <div className="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">最近活动</h2>
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "post" ? "bg-blue-500/20 text-blue-400" :
                        activity.type === "follower" ? "bg-green-500/20 text-green-400" :
                        activity.type === "task" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-purple-500/20 text-purple-400"
                      }`}>
                        {activity.type === "post" && <i className="fa-solid fa-image"></i>}
                        {activity.type === "follower" && <i className="fa-solid fa-user-plus"></i>}
                        {activity.type === "task" && <i className="fa-solid fa-check-circle"></i>}
                        {activity.type === "featured" && <i className="fa-solid fa-star"></i>}
                      </div>
                      <p className="text-sm text-[#B8C6D8]">{activity.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* 作品展示页面 */}
          {(activeTab === 'posts' || activeTab === 'collections' || activeTab === 'likes') && (
            <div className="p-6">
              {/* 筛选和搜索 */}
              {activeTab === 'posts' && isCurrentUser && (
                <>
                  <div className="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="搜索作品标题或描述..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                        />
                        <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                      </div>
                      <div className="flex space-x-4">
                        <select
                          value={visibilityFilter}
                          onChange={e => setVisibilityFilter(e.target.value)}
                          className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">全部可见性</option>
                          <option value="public">公开</option>
                          <option value="friends">仅好友可见</option>
                          <option value="private">私密</option>
                        </select>
                        <select
                          value={formatFilter}
                          onChange={e => setFormatFilter(e.target.value)}
                          className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">全部格式</option>
                          <option value="raw">RAW</option>
                          <option value="jpg">JPG</option>
                        </select>
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                        >
                          <option value="latest">最新发布</option>
                          <option value="popular">最受欢迎</option>
                          <option value="views">最多浏览</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* 标签筛选 */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedTag === tag 
                                ? "bg-[#4A5F8B] text-[#F5F7FA]" 
                                : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]"
                            } transition-colors`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* 上传按钮 */}
                  <div className="mb-8 text-center">
                    <button
                      onClick={handleUpload}
                      className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>添加新作品（支持RAW/JPG/视频）
                    </button>
                  </div>
                </>
              )}
              
              {/* 作品列表 */}
              {displayPosts.length === 0 ? (
                <Empty 
                  type="empty"
                  size="md"
                  text={activeTab === 'posts' ? '暂无作品' : activeTab === 'collections' ? '暂无收藏' : '暂无点赞'}
                  helperText={activeTab === 'posts' 
                    ? '上传你的第一张作品，开始创作之旅吧！' 
                    : activeTab === 'collections'
                      ? '收藏喜欢的作品，建立你的灵感库'
                      : '为喜欢的作品点赞，支持创作者'}
                  icon="fa-image"
                  actionText={activeTab === 'posts' && isCurrentUser ? '上传作品' : undefined}
                  onActionClick={() => activeTab === 'posts' && isCurrentUser ? handleUpload() : undefined}
                  backgroundColor="bg-[#2D3748]"
                  textColor="text-[#F5F7FA]"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                    >
                      <div className="relative">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs ${
                          post.copyrightType === "独家授权" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#6B7C93] text-[#F5F7FA]"
                        }`}>
                          {post.copyrightType}
                        </div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <span className="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                            {post.format}
                          </span>
                          <span className="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                            {post.visibility}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-[#F5F7FA] mb-2">{post.title}</h3>
                        <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4 text-sm text-[#B8C6D8]">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <i className="fa-solid fa-heart mr-1"></i>{post.likes}
                            </span>
                            <span className="flex items-center">
                              <i className="fa-solid fa-comment mr-1"></i>{post.comments}
                            </span>
                            <span className="flex items-center">
                              <i className="fa-solid fa-eye mr-1"></i>{post.views}
                            </span>
                          </div>
                          <span>{formatRelativeTime(post.date)}</span>
                        </div>
                        {isCurrentUser && (
                          <div className="flex justify-between space-x-2">
                            <Link
                              to={`/photo/${post.id}`}
                              className="flex-1 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
                            >
                              查看详情
                            </Link>
                            <button className="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:border-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]">
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button className="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:border-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button className="px-3 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                              <i className="fa-solid fa-copyright"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* 加载更多按钮 */}
              {displayPosts.length > 0 && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-6 py-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] rounded-lg font-medium transition-colors"
                  >
                    加载更多
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 个人中心快捷入口 */}
        {isCurrentUser && (
          <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
            <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">个人中心</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 我的器材库 */}
              <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i className="fa-solid fa-video text-[#4A5F8B] mr-2"></i>我的器材库
                  </h3>
                </div>
                <p className="text-xs text-[#B8C6D8]/70 mb-4">最近浏览：索尼 A7R IV</p>
                <div className="space-y-3 mb-4">
                  {recentEquipment.map(equipment => (
                    <div key={equipment.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                          <i className={`fa-solid ${
                            equipment.type === "camera" ? "fa-camera" : 
                            equipment.type === "lens" ? "fa-camera-retro" : "fa-drone"
                          }`}></i>
                        </div>
                        <span className="text-sm text-[#B8C6D8]">{equipment.name}</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-xs text-[#4A5F8B]"></i>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                  <i className="fa-solid fa-plus mr-1"></i>添加器材
                </button>
              </div>
              
              {/* 会员中心 */}
              <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i className="fa-solid fa-crown text-[#4A5F8B] mr-2"></i>会员中心
                  </h3>
                </div>
                <p className="text-xs text-[#B8C6D8]/70 mb-4">您当前是 {mockUser.memberStatus}</p>
                <div className="bg-[#2D3748] p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#B8C6D8]">会员有效期</span>
                    <span className="text-xs text-[#4A5F8B]">剩余 {mockUser.memberDaysLeft}天</span>
                  </div>
                  <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4A5F8B]" style={{ width: `${mockUser.memberDaysLeft / 365 * 100}%` }}></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                    续费
                  </button>
                  <button className="flex-1 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm">
                    升级
                  </button>
                </div>
              </div>
              
              {/* 快速工具 */}
              <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i className="fa-solid fa-toolbox text-[#4A5F8B] mr-2"></i>快速工具
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                    <i className="fa-solid fa-palette text-xl text-[#B8C6D8] mb-2"></i>
                    <span className="text-sm text-[#B8C6D8]">后期工具</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                    <i className="fa-solid fa-map-marker-alt text-xl text-[#B8C6D8] mb-2"></i>
                    <span className="text-sm text-[#B8C6D8]">拍摄地点</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                    <i className="fa-solid fa-flag text-xl text-[#B8C6D8] mb-2"></i>
                    <span className="text-sm text-[#B8C6D8]">摄影活动</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                    <i className="fa-solid fa-bell text-xl text-[#B8C6D8] mb-2"></i>
                    <span className="text-sm text-[#B8C6D8]">我的通知</span>
                  </button>
                </div>
                <button onClick={() => navigate('/profile/settings')} className="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                  <i className="fa-solid fa-cog mr-1"></i>更多设置
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* 上传模态框 */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCancelUpload}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-[#2D3748] rounded-xl p-6 w-full max-w-lg border border-[#4A5F8B]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#F5F7FA]">上传新作品</h2>
              <button onClick={handleCancelUpload} className="text-[#B8C6D8] hover:text-[#F5F7FA]">
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            
            {/* 文件上传区域 */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer transition-colors ${
                selectedFile ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B] hover:border-[#6B7C93]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.raw"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <>
                  <i className="fa-solid fa-check-circle text-green-400 text-4xl mb-2"></i>
                  <p className="text-[#F5F7FA]">{selectedFile.name}</p>
                  <p className="text-sm text-[#B8C6D8]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-upload text-[#4A5F8B] text-4xl mb-2"></i>
                  <p className="text-[#F5F7FA]">点击或拖拽上传图片</p>
                  <p className="text-sm text-[#B8C6D8]">支持 JPG、PNG、RAW 格式，最大 5MB</p>
                </>
              )}
            </div>
            
            {/* 上传进度 */}
            {uploading && (
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs text-[#B8C6D8] mb-1">
                  <span>上传中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4A5F8B]" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            
            {/* 表单字段 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">作品标题</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="输入作品标题..."
                  className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">作品描述</label>
                <textarea
                  value={newPostDescription}
                  onChange={e => setNewPostDescription(e.target.value)}
                  placeholder="描述您的作品..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none placeholder:text-[#B8C6D8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">标签</label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                  placeholder="输入标签，用逗号分隔..."
                  className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">可见性</label>
                <select
                  value={newPostVisibility}
                  onChange={e => setNewPostVisibility(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                >
                  <option value="公开">公开</option>
                  <option value="仅好友可见">仅好友可见</option>
                  <option value="私密">私密</option>
                </select>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleCancelUpload}
                className="flex-1 py-3 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitUpload}
                disabled={!selectedFile || !newPostTitle.trim()}
                className="flex-1 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '上传中...' : '上传作品'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
