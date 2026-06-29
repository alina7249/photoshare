import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRouter } from '../router/useRouter';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { Empty } from '../components/Empty';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '../composables/useToast';
import { useProfileApi } from '../composables/useProfileApi';
import { getAllTags, filterPosts } from '../composables/usePostFilter';
import { formatRelativeTime } from '../composables/useRelativeTime';
import { useProfile } from '../composables/useProfile';
import { ROUTES } from '../router/routes';

const Profile: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { initState, actions } = useProfile();
  const [activeTab, setActiveTab] = useState(initState.activeTab);
  const [sortBy, setSortBy] = useState(initState.sortBy);
  const [selectedTag, setSelectedTag] = useState(initState.selectedTag);
  const [searchTerm, setSearchTerm] = useState(initState.searchTerm);
  const [visibilityFilter, setVisibilityFilter] = useState(initState.visibilityFilter);
  const [formatFilter, setFormatFilter] = useState(initState.formatFilter);
  const [showUploadModal, setShowUploadModal] = useState(initState.showUploadModal);
  const [uploading, setUploading] = useState(initState.uploading);
  const [selectedFile, setSelectedFile] = useState<File | null>(initState.selectedFile);
  const [uploadProgress, setUploadProgress] = useState(initState.uploadProgress);
  const [newPostTitle, setNewPostTitle] = useState(initState.newPostTitle);
  const [newPostDescription, setNewPostDescription] = useState(initState.newPostDescription);
  const [newPostTags, setNewPostTags] = useState(initState.newPostTags);
  const [newPostVisibility, setNewPostVisibility] = useState(initState.newPostVisibility);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 用户资料数据
  const [profileUser, setProfileUser] = useState(initState.profileUser);
  const [profilePosts, setProfilePosts] = useState<any[]>(initState.profilePosts);
  const [loading, setLoading] = useState(initState.loading);
  const { fetchProfile, fetchProfilePosts } = useProfileApi();

  // 从API获取用户资料
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile();
        setProfileUser(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // 从API获取用户作品
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchProfilePosts();
        setProfilePosts(data);
      } catch (error) {
        console.error('Failed to fetch profile posts:', error);
      }
    };
    loadPosts();
  }, []);
  
  // 检查是否是当前用户自己的主页
  const isCurrentUser = isAuthenticated && user?.id === profileUser.id;
  
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(initState.isFollowing);
  
  // 获取所有标签
  const allTags = getAllTags(profilePosts);
  
  // 筛选作品
  const filteredPosts = filterPosts(profilePosts, {
    selectedTag,
    searchTerm,
    visibilityFilter,
    formatFilter,
    sortBy,
  });
  
  // 根据当前激活的标签显示对应的内容
  const displayPosts = activeTab === 'posts' ? filteredPosts : 
                      activeTab === 'collections' ? profilePosts.slice(0, 2) : 
                      profilePosts.slice(1, 3);
  
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
          const reset = actions.resetUploadForm();
          setSelectedFile(reset.selectedFile);
          setNewPostTitle(reset.newPostTitle);
          setNewPostDescription(reset.newPostDescription);
          setNewPostTags(reset.newPostTags);
          setNewPostVisibility(reset.newPostVisibility);
          setUploadProgress(reset.uploadProgress);
          setUploading(false);
          setShowUploadModal(false);
        }, 500);
      }
    }, 200);
  };
  
  const handleCancelUpload = () => {
    setShowUploadModal(false);
    const reset = actions.resetUploadForm();
    setSelectedFile(reset.selectedFile);
    setNewPostTitle(reset.newPostTitle);
    setNewPostDescription(reset.newPostDescription);
    setNewPostTags(reset.newPostTags);
    setNewPostVisibility(reset.newPostVisibility);
    setUploadProgress(reset.uploadProgress);
  };
  
  // 检查用户是否登录，如果没有登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
          <p className="text-text-muted mb-6 max-w-md">登录后查看用户主页内容，支持创作者</p>
          <button 
            onClick={() => router.push(ROUTES.LOGIN)}
            className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            立即登录
          </button>
        </div>
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
          <button
            onClick={() => router.push(ROUTES.HOME)}
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回首页</span>
          </button>
        </div>
        
        {/* 个人资料卡片 */}
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-accent mb-8">
          {/* 封面图 */}
          <div className="h-64 overflow-hidden">
            <img
              src={profileUser.avatar}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 用户信息 */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row -mt-20 mb-6">
              {/* 头像 */}
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-40 h-40 rounded-full border-4 border-card overflow-hidden shadow-md border-accent">
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
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                      {profileUser.username}
                    </h1>
                    <div className="ml-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 text-xs bg-accent/20 text-text-muted rounded">
                        {''}
                      </span>
                    </div>
                  </div>
                  
                  {/* 等级和进度条 */}
                  <div className="flex items-center mb-4">
                    <span className="text-text-muted text-sm mr-2">LV.0</span>
                    <div className="flex-1 h-2 bg-deep rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-accent" 
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <span className="text-text-muted text-xs">0/200</span>
                  </div>
                  
                  {/* 个人简介 */}
                  <p className="text-text-muted mb-4">{profileUser.bio}</p>
                  
                  {/* 关注与粉丝 */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <span className="font-bold text-text-primary">{profileUser.following}</span>
                      <span className="text-text-muted/70 text-sm ml-1">关注</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-text-primary">{profileUser.followers}</span>
                      <span className="text-text-muted/70 text-sm ml-1">粉丝</span>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3">
                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() => router.push(ROUTES.PROFILE_SETTINGS)}
                        className="px-4 py-2 bg-accent text-text-primary border border-accent rounded-lg font-medium hover:bg-accent-hover transition-colors"
                      >
                        <i className="fa-solid fa-pen-to-square mr-2 text-text-primary"></i> 编辑资料
                      </button>
                      <button
                        onClick={() => router.push(ROUTES.PROFILE_SETTINGS)}
                        className="px-4 py-2 bg-accent text-text-primary border border-accent rounded-lg font-medium hover:bg-accent-hover transition-colors"
                      >
                        <i className="fa-solid fa-cog mr-2 text-text-primary"></i> 设置
                      </button>
                    </>
                  )}
                  {!isCurrentUser && (
                     <div className="flex items-center space-x-3">
                     <button 
                       className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                         isFollowing 
                           ? 'bg-accent-hover text-text-primary border-accent-hover' 
                           : 'bg-accent text-text-primary border-accent'
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
                          <i className="fa-solid fa-check mr-2 text-text-primary"></i> 已关注
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus mr-2 text-text-primary"></i> 关注
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
                       className="p-2 bg-deep text-text-muted rounded-lg hover:bg-accent hover:text-text-primary transition-colors border border-accent relative z-10"
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
            <div className="flex flex-wrap border-t border-accent pt-4">
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-text-primary">
                    {profileUser.posts}
                  </span>
                  <i className="fa-solid fa-image text-text-muted"></i>
                </div>
                <span className="text-sm text-text-muted">作品</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-text-primary">
                    {profileUser.likes}
                  </span>
                  <i className="fa-solid fa-heart text-text-muted"></i>
                </div>
                <span className="text-sm text-text-muted">获赞</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-text-primary">
                    48
                  </span>
                  <i className="fa-solid fa-bookmark text-text-muted"></i>
                </div>
                <span className="text-sm text-text-muted">收藏</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 内容标签页 - 整合个人中心功能 */}
        <div className="bg-card rounded-xl shadow-sm border border-accent mb-8">
          <div className="flex border-b border-accent">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-text-primary border-b-2 border-accent'
                  : 'text-text-muted/70 hover:text-text-primary'
              }`}
            >
              作品 ({profileUser.posts})
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'collections'
                  ? 'text-text-primary border-b-2 border-accent'
                  : 'text-text-muted/70 hover:text-text-primary'
              }`}
            >
              收藏 (48)
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'likes'
                  ? 'text-text-primary border-b-2 border-accent'
                  : 'text-text-muted/70 hover:text-text-primary'
              }`}
            >
              点赞 ({profileUser.likes})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-text-primary border-b-2 border-accent'
                  : 'text-text-muted/70 hover:text-text-primary'
              }`}
            >
              数据统计
            </button>
          </div>
          
          {/* 数据统计页面 */}
          {activeTab === 'stats' && (
            <div className="p-6">
              {/* 创作数据趋势图 */}
              <div className="bg-deep rounded-xl p-6 shadow-sm border border-accent mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">创作数据</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyViewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--light-blue-gray)" />
                      <XAxis dataKey="date" stroke="var(--light-cool-gray)" />
                      <YAxis stroke="var(--light-cool-gray)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--deep-blue-gray)', borderColor: 'var(--light-blue-gray)', color: 'var(--light-white)' }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const viewsData = payload.find(item => item.dataKey === "views");
                            const likesData = payload.find(item => item.dataKey === "likes");
                            return (
                              <div className="bg-card border border-accent p-3 rounded-lg">
                                <p className="text-text-muted font-medium mb-2">{`${label}数据`}</p>
                                {viewsData && <p className="text-text-muted mb-1">浏览量: {viewsData.value}</p>}
                                {likesData && <p className="text-text-muted">点赞量: {likesData.value}</p>}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="var(--light-blue-gray)" strokeWidth={2} dot={false} name="浏览量" />
                      <Line type="monotone" dataKey="likes" stroke="var(--medium-blue-gray)" strokeWidth={2} dot={false} name="点赞量" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* 最近活动 */}
              <div className="bg-deep rounded-xl p-6 shadow-sm border border-accent mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">最近活动</h2>
                <div className="space-y-3">
                  {[].map(activity => (
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
                      <p className="text-sm text-text-muted">{activity.text}</p>
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
                  <div className="bg-deep rounded-xl p-6 shadow-sm border border-accent mb-8">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="搜索作品标题或描述..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                        />
                        <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                      </div>
                      <div className="flex space-x-4">
                        <select
                          value={visibilityFilter}
                          onChange={e => setVisibilityFilter(e.target.value)}
                          className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">全部可见性</option>
                          <option value="public">公开</option>
                          <option value="friends">仅好友可见</option>
                          <option value="private">私密</option>
                        </select>
                        <select
                          value={formatFilter}
                          onChange={e => setFormatFilter(e.target.value)}
                          className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">全部格式</option>
                          <option value="raw">RAW</option>
                          <option value="jpg">JPG</option>
                        </select>
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                        >
                          <option value="latest">最新发布</option>
                          <option value="popular">最受欢迎</option>
                          <option value="views">最多浏览</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* 标签筛选 */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-text-muted mb-2">按标签筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedTag === tag 
                                ? "bg-accent text-text-primary" 
                                : "bg-card text-text-muted border border-accent"
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
                      className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors inline-flex items-center"
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
                  backgroundColor="bg-card"
                  textColor="text-text-primary"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-deep rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                    >
                      <div className="relative">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs ${
                          post.copyrightType === "独家授权" ? "bg-accent text-text-primary" : "bg-accent-hover text-text-primary"
                        }`}>
                          {post.copyrightType}
                        </div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <span className="px-2 py-1 bg-card/80 text-text-muted text-xs rounded">
                            {post.format}
                          </span>
                          <span className="px-2 py-1 bg-card/80 text-text-muted text-xs rounded">
                            {post.visibility}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-text-primary mb-2">{post.title}</h3>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-accent text-text-primary text-xs rounded">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4 text-sm text-text-muted">
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
                              className="flex-1 py-2 text-center bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors text-sm border border-accent"
                            >
                              查看详情
                            </Link>
                            <button className="px-3 py-2 text-center bg-card text-text-muted rounded-lg font-medium hover:border-accent hover:text-text-primary transition-colors text-sm border border-accent">
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button className="px-3 py-2 text-center bg-card text-text-muted rounded-lg font-medium hover:border-accent hover:text-text-primary transition-colors text-sm border border-accent">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button className="px-3 py-2 text-center bg-gradient-to-r from-accent to-card text-text-primary rounded-lg font-medium hover:from-accent-hover hover:to-accent transition-colors text-sm border border-accent">
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
                    onClick={() => router.push(ROUTES.LOGIN)}
                    className="inline-flex items-center px-6 py-3 bg-card text-text-muted border border-accent hover:bg-accent hover:text-text-primary rounded-lg font-medium transition-colors"
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
          <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">个人中心</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 我的器材库 */}
              <div className="bg-deep rounded-lg p-5 border border-accent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-text-primary flex items-center">
                    <i className="fa-solid fa-video text-accent mr-2"></i>我的器材库
                  </h3>
                </div>
                <p className="text-xs text-text-muted/70 mb-4">最近浏览：索尼 A7R IV</p>
                <div className="space-y-3 mb-4">
                  {[].map(equipment => (
                    <div key={equipment.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                          <i className={`fa-solid ${
                            equipment.type === "camera" ? "fa-camera" : 
                            equipment.type === "lens" ? "fa-camera-retro" : "fa-drone"
                          }`}></i>
                        </div>
                        <span className="text-sm text-text-muted">{equipment.name}</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-xs text-accent"></i>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 text-center bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm">
                  <i className="fa-solid fa-plus mr-1"></i>添加器材
                </button>
              </div>
              
              {/* 会员中心 */}
              <div className="bg-deep rounded-lg p-5 border border-accent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-text-primary flex items-center">
                    <i className="fa-solid fa-crown text-accent mr-2"></i>会员中心
                  </h3>
                </div>
                <p className="text-xs text-text-muted/70 mb-4">您当前是 会员</p>
                <div className="bg-card p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-muted">会员有效期</span>
                    <span className="text-xs text-accent">剩余 0天</span>
                  </div>
                  <div className="w-full h-2 bg-deep rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 text-center bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm">
                    续费
                  </button>
                  <button className="flex-1 py-2 text-center bg-gradient-to-r from-accent to-accent-hover text-text-primary rounded-lg font-medium hover:from-accent-hover hover:to-accent transition-colors text-sm">
                    升级
                  </button>
                </div>
              </div>
              
              {/* 快速工具 */}
              <div className="bg-deep rounded-lg p-5 border border-accent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-text-primary flex items-center">
                    <i className="fa-solid fa-toolbox text-accent mr-2"></i>快速工具
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="flex flex-col items-center justify-center p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                    <i className="fa-solid fa-palette text-xl text-text-muted mb-2"></i>
                    <span className="text-sm text-text-muted">后期工具</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                    <i className="fa-solid fa-map-marker-alt text-xl text-text-muted mb-2"></i>
                    <span className="text-sm text-text-muted">拍摄地点</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                    <i className="fa-solid fa-flag text-xl text-text-muted mb-2"></i>
                    <span className="text-sm text-text-muted">摄影活动</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-card rounded-lg hover:bg-accent transition-colors">
                    <i className="fa-solid fa-bell text-xl text-text-muted mb-2"></i>
                    <span className="text-sm text-text-muted">我的通知</span>
                  </button>
                </div>
                <button onClick={() => router.push(ROUTES.PROFILE_SETTINGS)} className="w-full py-2 text-center bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm">
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
            className="bg-card rounded-xl p-6 w-full max-w-lg border border-accent"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">上传新作品</h2>
              <button onClick={handleCancelUpload} className="text-text-muted hover:text-text-primary">
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            
            {/* 文件上传区域 */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer transition-colors ${
                selectedFile ? 'border-accent bg-accent/10' : 'border-accent hover:border-accent-hover'
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
                  <p className="text-text-primary">{selectedFile.name}</p>
                  <p className="text-sm text-text-muted">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-upload text-accent text-4xl mb-2"></i>
                  <p className="text-text-primary">点击或拖拽上传图片</p>
                  <p className="text-sm text-text-muted">支持 JPG、PNG、RAW 格式，最大 5MB</p>
                </>
              )}
            </div>
            
            {/* 上传进度 */}
            {uploading && (
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs text-text-muted mb-1">
                  <span>上传中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-deep rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            
            {/* 表单字段 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">作品标题</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="输入作品标题..."
                  className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">作品描述</label>
                <textarea
                  value={newPostDescription}
                  onChange={e => setNewPostDescription(e.target.value)}
                  placeholder="描述您的作品..."
                  rows={3}
                  className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">标签</label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                  placeholder="输入标签，用逗号分隔..."
                  className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">可见性</label>
                <select
                  value={newPostVisibility}
                  onChange={e => setNewPostVisibility(e.target.value)}
                  className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
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
                className="flex-1 py-3 bg-deep text-text-muted border border-accent rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitUpload}
                disabled={!selectedFile || !newPostTitle.trim()}
                className="flex-1 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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