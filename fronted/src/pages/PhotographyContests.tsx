// PhotographyContests.tsx - 卡片hover效果详细描述：
// 1. 赛事卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 赛事类型/状态按钮：当鼠标悬停时，按钮的背景颜色会发生变化，提供清晰的交互反馈
// 3. 标签按钮：当鼠标悬停时，标签的颜色会发生变化，增强视觉反馈
// 4. 即将截止日期提醒：当鼠标悬停时，整个提醒项会向右平移5个像素，产生一种被选中的动效

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { apiGet } from '../lib/api';

const PhotographyContests: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline'); // deadline, popular, newest
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null); // 控制分享菜单显示
  
  // 检查是否是用户个人赛事页面
  const isUserPersonalContests = window.location.pathname.includes('/profile-center/contests');

  const [allContests, setAllContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await apiGet('/contests');
        setAllContests(data);
      } catch (err) {
        console.error('Failed to fetch contests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const contestTypes: string[] = [];
  const contestStatuses: string[] = [];
  const popularTags: { id: string; name: string; count: number }[] = [];

  // 过滤赛事
   const getFilteredContests = () => {
    let contests = isUserPersonalContests 
      ? allContests.filter(contest => contest.id === 'c1' || contest.id === 'c2' || contest.id === 'c3') 
      : [...allContests];
    
    // 按类型过滤
    if (selectedType !== '全部' && !isUserPersonalContests) {
      contests = contests.filter(contest => contest.type === selectedType);
    }
    
    // 按状态过滤
    if (selectedStatus !== '全部' && !isUserPersonalContests) {
      contests = contests.filter(contest => contest.status === selectedStatus);
    }
    
   // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      contests = contests.filter(contest => 
        contest.title.toLowerCase().includes(term) || 
        contest.description.toLowerCase().includes(term) ||
        (contest.organizer && contest.organizer.toLowerCase().includes(term))
      );
    }
    
   // 按标签过滤
    if (selectedTags.length > 0) {
      contests = contests.filter(contest => 
        selectedTags.some(tag => contest.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'deadline') {
      contests.sort((a, b) => {
        if (a.status === '进行中' && b.status !== '进行中') return -1;
        if (a.status !== '进行中' && b.status === '进行中') return 1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'popular') {
      contests.sort((a, b) => b.entries - a.entries);
    } else if (sortBy === 'newest') {
      contests.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }
    
    return contests;
  };

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 分享赛事
  const shareContest = (contestId: string, platform: string) => {
    // 模拟分享功能
    toast.success(`已分享赛事到${platform}`);
    setShowShareMenu(null);
  };

  // 处理立即参赛
  const handleJoinContest = (contestId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // 模拟参赛逻辑
    toast.success('参赛成功！');
    // 实际应用中这里应该调用API进行参赛
  };

  const filteredContests = getFilteredContests();

  if (!isAuthenticated) {
    if (isUserPersonalContests) {
      // 即使未登录也显示个人赛事页面，但提示用户登录
      return (
        <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
              <i className="fa-solid fa-user-lock text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
            <p className="text-text-muted mb-6 max-w-md">登录后查看您参加的摄影赛事</p>
            <Link to="/login" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-bg-dark-hover transition-colors">
              立即登录
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isUserPersonalContests ? '我的赛事' : '摄影赛事'}
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            {isUserPersonalContests 
              ? '查看您已参加的摄影赛事，管理参赛作品和查看进度' 
              : '参与各类摄影比赛，展示你的才华，赢取丰厚奖金和专业认可'
            }
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 搜索和排序 */}
            {!isUserPersonalContests && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="搜索赛事、主题或关键词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  />
                  <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="deadline">按截止日期</option>
                  <option value="popular">最受欢迎</option>
                  <option value="newest">最新发布</option>
                </select>
              </div>
            )}

            {/* 赛事类型和状态选项卡 */}
            {!isUserPersonalContests && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                  <div className="p-3 border-b border-accent">
                    <h4 className="text-sm font-medium text-text-primary">赛事类型</h4>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    {contestTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-accent text-text-primary rounded-lg'
                            : 'bg-bg-card text-text-muted hover:bg-accent/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                  <div className="p-3 border-b border-accent">
                    <h4 className="text-sm font-medium text-text-primary">赛事状态</h4>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    {contestStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedStatus === status? 'bg-accent text-text-primary rounded-lg'
                            : 'bg-bg-card text-text-muted hover:bg-accent/50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 赛事列表 */}
            <div className="space-y-6">
              {filteredContests.map((contest) => {
                // 获取用户参赛状态
                const contestStatus = isUserPersonalContests ? null : null;
                
                return (
                <motion.div
                  key={contest.id}
                  whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                  className="bg-gradient-to-r from-accent to-accent-hover rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                >
                  {/* 赛事图片 */}
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={contest.image}
                        alt={contest.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    
                    {/* 赛事信息 */}
                    <div className="p-5 md:w-2/3">
                      {/* 赛事类型和状态 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-primary font-medium">{contest.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          contest.status === '进行中'
                            ? 'bg-bg-card/50 text-text-primary'
                            : contest.status === '已截止'
                              ? 'bg-accent-hover text-text-primary'
                              : 'bg-bg-card/50 text-text-primary'
                        }`}>
                          {contest.status}
                        </span>
                      </div>
                      
                      {/* 赛事标题和主办方 */}
                      <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-surface-light-hover transition-colors">
                        {contest.title}
                      </h3>
                      {contest.organizer && (
                        <p className="text-xs text-text-primary/80 mb-4">
                          主办方：{contest.organizer}
                        </p>
                      )}
                      
                      {/* 赛事基本信息 */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-calendar-alt mr-2 text-text-primary"></i>
                          <span>截止日期：{contest.deadline}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-user-group mr-2 text-text-primary"></i>
                          <span>已有 {contest.participants} 人参赛</span>
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-images mr-2 text-text-primary"></i>
                          <span>共提交 {contest.worksCount} 件作品</span>
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-tags mr-2 text-text-primary"></i>
                          <span>分类：{contest.categories.join('、')}</span>
                        </div>
                      </div>
                      
                      {/* 用户参赛进度跟踪 - 仅在个人赛事页面显示 */}
                      {isUserPersonalContests && contestStatus && (
                        <div className="mb-4 bg-bg-card/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-text-primary">参赛状态: <span className="font-medium">{contestStatus.status}</span></span>
                            <span className="text-sm text-text-primary">进度: <span className="font-medium">{contestStatus.progress}</span></span>
                          </div>
                          <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-text-primary" 
                              style={{ width: `${(contestStatus.submittedWorks / contestStatus.totalWorksLimit) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-text-primary/80 mt-1 text-right">
                            {contestStatus.submittedWorks}/{contestStatus.totalWorksLimit} 作品已提交
                          </div>
                        </div>
                      )}
                      
                      {/* 赛事描述 */}
                      <p className="text-sm text-text-primary/90 mb-4 line-clamp-2">
                        {contest.description}
                      </p>
                      
                      {/* 奖励信息 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-text-primary mb-2">奖励设置</h4>
                        <div className="flex flex-wrap gap-2">
                          {contest.prizes.slice(0, 3).map((prize, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-bg-card/50 text-text-primary rounded-full text-xs border border-accent-hover/30"
                            >
                              {prize.rank}
                            </span>
                          ))}
                          {contest.prizes.length > 3 && (
                            <span className="px-2 py-1 bg-bg-card/50 text-text-primary rounded-full text-xs border border-accent-hover/30">
                              +{contest.prizes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* 赛事标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {contest.tags.slice(0, 5).map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedTags.includes(tag)
                                ? 'bg-text-primary text-accent'
                                : 'bg-bg-card/50 text-text-primary border border-accent-hover/30'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                       {/* 操作按钮区域 */}
                       <div className="flex space-x-2">
                         {/* 查看详情按钮 */}
                         <Link
                           to={`/contest/${contest.id}`}
                           className="flex-1 py-2 text-center bg-text-primary text-accent rounded-lg font-medium hover:bg-surface-light-hover transition-colors border border-text-primary"
                         >
                           查看详情
                         </Link>
                        
                        {/* 分享按钮 */}
                        <div className="relative">
                          <button 
                            className="w-10 flex items-center justify-center text-text-primary hover:bg-text-primary hover:text-accent rounded-lg transition-colors border border-text-primary"
                            onClick={() => setShowShareMenu(showShareMenu === contest.id ? null : contest.id)}
                          >
                            <i className="fa-solid fa-share-alt"></i>
                          </button>
                          
                          {/* 分享菜单 */}
                          {showShareMenu === contest.id && (
                                 <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-lg shadow-lg border border-accent py-2 z-10">
                                <button 
                                  className="w-full text-left px-4 py-2 text-text-primary hover:bg-accent transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, '微博')}
                                >
                                  <i className="fa-brands fa-weibo mr-2 text-red-weibo"></i> 分享到微博
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-text-primary hover:bg-accent transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, '微信')}
                                >
                                  <i className="fa-brands fa-weixin mr-2 text-brand-wechat"></i> 分享到微信
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-text-primary hover:bg-accent transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, 'QQ')}
                                >
                                  <i className="fa-brands fa-qq mr-2 text-brand-qq"></i> 分享到QQ
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-text-primary hover:bg-accent transition-colors flex items-center"
                                  onClick={() => {
                                    const shareUrl = `${window.location.origin}/contest/${contest.id}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    toast.success('链接已复制到剪贴板');
                                    setShowShareMenu(null);
                                  }}
                                >
                                  <i className="fa-solid fa-link mr-2"></i> 复制链接
                                </button>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
              
               {filteredContests.length === 0 && (
                <div className="p-8 bg-bg-card rounded-xl border border-accent text-center">
                  <div className="w-16 h-16 bg-bg-dark-alt rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                    <i className={isUserPersonalContests ? "fa-solid fa-trophy text-2xl" : "fa-solid fa-search text-2xl"}></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {isUserPersonalContests ? "您还没有参加任何赛事" : "未找到相关赛事"}
                  </h3>
                  <p className="text-text-muted mb-6">
                    {isUserPersonalContests 
                      ? "浏览赛事页面，找到感兴趣的赛事并参加，展示您的摄影才华" 
                      : "请尝试使用不同的关键词或筛选条件"
                    }
                  </p>
                  {isUserPersonalContests && (
                    <Link to="/photography-contests" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-bg-dark-hover transition-colors inline-flex items-center">
                      <i className="fa-solid fa-compass mr-2"></i>
                      浏览更多赛事
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* 分页 */}
            {filteredContests.length > 0 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-bg-card p-2 rounded-lg border border-accent">
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-accent bg-accent text-text-primary">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    3
                  </button>
                  <span className="px-2 text-text-muted">...</span>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    6
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 热门标签模块 */}
            <div className="bg-accent rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-text-primary text-accent'
                        : 'bg-accent-hover text-text-primary border border-accent-hover'
                    } transition-colors`}
                  >
                    #{tag.name} ({tag.count})
                  </button>
                ))}
              </div>
              
              {/* 清除标签 */}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-4 w-full py-2 text-center text-sm text-text-primary hover:text-surface-light-hover transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
            
            {/* 即将截止 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm border border-accent text-text-primary">
              <h3 className="text-lg font-bold mb-4">即将截止</h3>
              <div className="space-y-4">
                {allContests
                  .filter(contest => contest.status === '进行中')
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .slice(0, 3)
                  .map((contest) => {
                    // 计算剩余天数
                    const now = new Date();
                    const deadline = new Date(contest.deadline);
                    const diffTime = deadline.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <motion.div
                        key={contest.id}
                        whileHover={{ x: 5 }}
                        className="flex space-x-3 cursor-pointer"
                      >
                        <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-bg-card/30 rounded-lg text-text-primary">
                          <span className="text-lg font-bold">{diffDays}</span>
                          <span className="text-xs">天后截止</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text-primary hover:text-surface-light-hover transition-colors truncate">
                            {contest.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-text-primary/80">
                            <span>{contest.type}</span>
                            <span>•</span>
                            <span>{contest.participants} 人参赛</span>
                            <span>•</span>
                            <span>{contest.worksCount} 件作品</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-text-primary hover:text-surface-light-hover transition-colors flex items-center justify-center w-full"
              >
                <span>查看全部即将截止的赛事</span>
              </Link>
            </div>
            
            {/* 赛事常见问题 */}
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">参赛指南</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-1">如何参赛？</h4>
                  <p className="text-sm text-text-muted">
                    浏览感兴趣的赛事，点击"立即参赛"按钮，按照要求上传作品并填写相关信息即可完成报名。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">作品有什么要求？</h4>
                  <p className="text-sm text-text-muted">
                    不同赛事有不同的作品要求，包括题材、格式、大小等，请务必仔细阅读每个赛事的具体规则。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">如何提高获奖几率？</h4>
                  <p className="text-sm text-text-muted">
                    了解赛事主题和评审标准，提交符合要求的高质量原创作品，注意作品的创意性、技术性和表现力。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">获奖后如何领奖？</h4>
                  <p className="text-sm text-text-muted">
                    赛事结果公布后，工作人员会通过站内信、邮件或电话联系获奖者，安排奖金发放和奖品寄送事宜。
                  </p>
                </div>
              </div>
            </div>
            
            {/* 赛事日历模块 */}
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">赛事日历</h3>
              {/* 简化的日历组件 */}
              <div className="text-center mb-3">
                <h4 className="font-medium text-text-primary">2023年四季度</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">10月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-accent text-text-primary text-xs flex items-center justify-center flex-shrink-0">15</span>
                      <span className="text-sm text-text-primary ml-2">自然生态摄影展截止</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">11月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-accent text-text-primary text-xs flex items-center justify-center flex-shrink-0">15</span>
                      <span className="text-sm text-text-primary ml-2">索尼Alpha创意摄影挑战赛截止</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-accent text-text-primary text-xs flex items-center justify-center flex-shrink-0">30</span>
                      <span className="text-sm text-text-primary ml-2">城市人文纪实摄影大赛截止</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">12月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-accent text-text-primary text-xs flex items-center justify-center flex-shrink-0">31</span>
                      <span className="text-sm text-text-primary ml-2">年度黑白摄影大赛截止</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 创建赛事 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-3">创建个人赛事</h3>
              <p className="text-sm mb-4 text-white/90">
                你也可以创建自己的摄影赛事，邀请好友参与，自定义规则和奖励
              </p>
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-2 bg-text-primary text-accent font-medium rounded-lg hover:bg-surface-light-hover transition-colors"
    onClick={() => {
      if (!isAuthenticated) {
        toast.info('请先登录后再创建赛事');
        navigate('/login');
      } else {
        // 这里可以跳转到赛事创建页面或显示创建表单
        toast.success('赛事创建功能已开启！');
        // 为了与EventsAndContests.tsx保持一致，这里也可以实现一个表单弹窗
        setTimeout(() => {
          window.location.href = '/events-and-contests';
        }, 1000);
      }
    }}
  >
    立即创建
  </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotographyContests;