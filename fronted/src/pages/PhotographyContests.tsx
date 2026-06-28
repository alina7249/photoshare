// PhotographyContests.tsx - 卡片hover效果详细描述：
// 1. 赛事卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 赛事类型/状态按钮：当鼠标悬停时，按钮的背景颜色会发生变化，提供清晰的交互反馈
// 3. 标签按钮：当鼠标悬停时，标签的颜色会发生变化，增强视觉反馈
// 4. 即将截止日期提醒：当鼠标悬停时，整个提醒项会向右平移5个像素，产生一种被选中的动效

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';

// 模拟赛事数据
const mockContests = [
  {
    id: 'c1',
    title: '2025年度黑白摄影大赛',
    type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20contest%20banner%20minimalist&sign=5958a9112dbd48d52283b3d3b68c22df',
    deadline: '2025-12-31',
    status: '进行中',
    entries: 1254,
    worksCount: 3458, // 添加作品数量统计
    participants: 1254, // 添加参与人数统计
    prizes: [
      { rank: '一等奖', value: '20000元', count: 1 },
      { rank: '二等奖', value: '10000元', count: 2 },
      { rank: '三等奖', value: '5000元', count: 3 },
      { rank: '优秀奖', value: '1000元', count: 10 }
    ],
    description: '展现黑白摄影的独特魅力，通过光影、构图和情感表达，呈现经典而永恒的视觉艺术作品。大赛面向全球摄影爱好者，欢迎各类黑白摄影作品参赛。',
    categories: ['风光', '人像', '纪实', '创意'],
    rules: [
      '参赛作品必须为黑白照片',
      '每位参赛者最多提交5幅作品',
      '作品必须为原创，不得抄袭',
      '保留EXIF信息，便于评审',
      '投稿即视为同意主办方拥有作品使用权'
    ],
    tags: ['黑白', '年度', '官方', '奖金', '全球'],
    socialShareLinks: { // 添加分享链接
      weibo: 'https://weibo.com/share',
      wechat: 'https://weixin.qq.com/share',
      qq: 'https://connect.qq.com/widget/shareqq',
      twitter: 'https://twitter.com/intent/tweet'
    }
  },
  {
    id: 'c2',
    title: '索尼Alpha创意摄影挑战赛',
    type: '合作赛事',
    organizer: '索尼中国',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20creative%20photography%20challenge%20banner&sign=38f14ccad69f3dbb399991f5317127ce',
    deadline: '2025-12-25',
    status: '进行中',
    entries: 876,
    worksCount: 2156, // 添加作品数量统计
    participants: 876, // 添加参与人数统计
    prizes: [
      { rank: '金奖', value: '索尼A7R V相机一台', count: 1 },
      { rank: '银奖', value: '索尼FE 24-70mm F2.8 GM镜头', count: 2 },
      { rank: '铜奖', value: '索尼ZV-1相机一台', count: 3 },
      { rank: '入围奖', value: '索尼相机包一个', count: 20 }
    ],
    description: '使用索尼Alpha系列相机创作，展示你的创意视角和摄影才华。本次挑战赛不限题材，鼓励创新和实验性的摄影作品。',
    categories: ['不限'],
    rules: [
      '参赛作品必须使用索尼Alpha系列相机拍摄',
      '每位参赛者最多提交8幅作品',
      '作品可进行后期处理',
      '保留原始文件，获奖后需提供验证',
      '投稿即视为同意活动规则和版权条款'
    ],
    tags: ['索尼', '创意', '器材', '相机', '合作'],
    socialShareLinks: { // 添加分享链接
      weibo: 'https://weibo.com/share',
      wechat: 'https://weixin.qq.com/share',
      qq: 'https://connect.qq.com/widget/shareqq',
      twitter: 'https://twitter.com/intent/tweet'
    }
  },
  {
    id: 'c3',
    title: '城市人文纪实摄影大赛',
    type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20documentary%20photography%20contest%20banner%20street%20life&sign=818fdf65887ba3b9c9d321794542006b',
    deadline: '2025-12-30',
    status: '进行中',
    entries: 654,
    worksCount: 1890, // 添加作品数量统计
    participants: 654, // 添加参与人数统计
    prizes: [
      { rank: '金奖', value: '15000元', count: 1 },
      { rank: '银奖', value: '8000元', count: 2 },
      { rank: '铜奖', value: '3000元', count: 3 },
      { rank: '人气奖', value: '2000元', count: 1 }
    ],
    description: '记录城市生活的瞬间，展现都市人文风情和社会变迁。通过摄影镜头，讲述城市中的故事，传递人文关怀和思考。',
    categories: ['人文', '纪实', '街拍'],
    rules: [
      '参赛作品必须为纪实摄影风格',
      '每位参赛者最多提交6幅作品',
      '可以是单幅或组照（组照不超过8张）',
      '作品需附带简短文字说明',
      '保留真实性，不得过度修改',
    ],
    tags: ['城市', '人文', '纪实', '街拍', '官方'],
    socialShareLinks: { // 添加分享链接
      weibo: 'https://weibo.com/share',
      wechat: 'https://weixin.qq.com/share',
      qq: 'https://connect.qq.com/widget/shareqq',
      twitter: 'https://twitter.com/intent/tweet'
    }
  },
  {
    id: 'c4',
    title: '自然生态摄影展',
    type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=natural%20ecology%20photography%20exhibition%20banner%20wildlife&sign=c47d5cf3d76049534c98c3f640cbd2f0',
    deadline: '2025-12-10',
    status: '进行中',
    entries: 432,
    worksCount: 1256, // 添加作品数量统计
    participants: 432, // 添加参与人数统计
    prizes: [
      { rank: '金奖', value: '12000元', count: 1 },
      { rank: '银奖', value: '6000元', count: 2 },
      { rank: '铜奖', value: '3000元', count: 3 },
      { rank: '优秀奖', value: '1000元', count: 8 }
    ],
    description: '展现大自然的美丽与神奇，记录生态环境和野生动植物的精彩瞬间，提高公众的环保意识和对自然的敬畏之心。',
    categories: ['风光', '野生动物', '植物', '生态环境'],
    rules: [
      '参赛作品必须为自然生态主题',
      '每位参赛者最多提交5幅作品',
      '作品需注明拍摄地点和物种信息',
      '不得伤害或干扰拍摄对象',
      '严禁摆拍和人为干预自然行为',
    ],
    tags: ['自然', '生态', '风光', '野生动物', '环保'],
    socialShareLinks: { // 添加分享链接
      weibo: 'https://weibo.com/share',
      wechat: 'https://weixin.qq.com/share',
      qq: 'https://connect.qq.com/widget/shareqq',
      twitter: 'https://twitter.com/intent/tweet'
    }
  },
];

// 模拟用户参赛状态
const userContestStatus = {
  c1: {
    status: '已参赛',
    progress: '评审中',
    submittedWorks: 3,
    totalWorksLimit: 5,
    lastActivity: '2025-12-10'
  },
  c2: {
    status: '已参赛',
    progress: '待提交',
    submittedWorks: 0,
    totalWorksLimit: 8,
    lastActivity: null
  }
};

// 赛事类型
const contestTypes = ['全部', '官方主办', '合作赛事', '用户自创'];

// 赛事状态
const contestStatuses = ['全部', '进行中', '已截止', '评选中', '已结束'];

// 热门标签
const popularTags = [
  { id: '1', name: '黑白', count: 124 },
  { id: '2', name: '人文', count: 87 },
  { id: '3', name: '风光', count: 65 },
  { id: '4', name: '创意', count: 43 },
  { id: '5', name: '索尼', count: 32 },
  { id: '6', name: '城市', count: 28 },
  { id: '7', name: '自然', count: 25 },
  { id: '8', name: '生态', count: 20 },
];

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

  // 过滤赛事
   const getFilteredContests = () => {
    // 为个人赛事页面确保至少有2个模拟参赛赛事
    let contests = isUserPersonalContests 
      ? mockContests.filter(contest => contest.id === 'c1' || contest.id === 'c2' || contest.id === 'c3') 
      : [...mockContests];
    
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
        <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
              <i className="fa-solid fa-user-lock text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
            <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您参加的摄影赛事</p>
            <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
              立即登录
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">
            {isUserPersonalContests ? '我的赛事' : '摄影赛事'}
          </h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
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
                    className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                  />
                  <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                >
                  <option value="deadline">按截止日期</option>
                  <option value="popular">最受欢迎</option>
                  <option value="newest">最新发布</option>
                </select>
              </div>
            )}

            {/* 赛事类型和状态选项卡 */}
            {!isUserPersonalContests && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                  <div className="p-3 border-b border-[#4A5F8B]">
                    <h4 className="text-sm font-medium text-[#F5F7FA]">赛事类型</h4>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    {contestTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                            : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                  <div className="p-3 border-b border-[#4A5F8B]">
                    <h4 className="text-sm font-medium text-[#F5F7FA]">赛事状态</h4>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    {contestStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedStatus === status? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                            : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
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
                const contestStatus = isUserPersonalContests ? userContestStatus[contest.id as keyof typeof userContestStatus] : null;
                
                return (
                <motion.div
                  key={contest.id}
                  whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                  className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
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
                        <span className="text-sm text-[#F5F7FA] font-medium">{contest.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          contest.status === '进行中'
                            ? 'bg-[#2D3748]/50 text-[#F5F7FA]'
                            : contest.status === '已截止'
                              ? 'bg-[#6B7C93] text-[#F5F7FA]'
                              : 'bg-[#2D3748]/50 text-[#F5F7FA]'
                        }`}>
                          {contest.status}
                        </span>
                      </div>
                      
                      {/* 赛事标题和主办方 */}
                      <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#FFFFFF] transition-colors">
                        {contest.title}
                      </h3>
                      {contest.organizer && (
                        <p className="text-xs text-[#F5F7FA]/80 mb-4">
                          主办方：{contest.organizer}
                        </p>
                      )}
                      
                      {/* 赛事基本信息 */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-sm text-[#F5F7FA]">
                          <i className="fa-solid fa-calendar-alt mr-2 text-[#F5F7FA]"></i>
                          <span>截止日期：{contest.deadline}</span>
                        </div>
                        <div className="flex items-center text-sm text-[#F5F7FA]">
                          <i className="fa-solid fa-user-group mr-2 text-[#F5F7FA]"></i>
                          <span>已有 {contest.participants} 人参赛</span>
                        </div>
                        <div className="flex items-center text-sm text-[#F5F7FA]">
                          <i className="fa-solid fa-images mr-2 text-[#F5F7FA]"></i>
                          <span>共提交 {contest.worksCount} 件作品</span>
                        </div>
                        <div className="flex items-center text-sm text-[#F5F7FA]">
                          <i className="fa-solid fa-tags mr-2 text-[#F5F7FA]"></i>
                          <span>分类：{contest.categories.join('、')}</span>
                        </div>
                      </div>
                      
                      {/* 用户参赛进度跟踪 - 仅在个人赛事页面显示 */}
                      {isUserPersonalContests && contestStatus && (
                        <div className="mb-4 bg-[#2D3748]/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#F5F7FA]">参赛状态: <span className="font-medium">{contestStatus.status}</span></span>
                            <span className="text-sm text-[#F5F7FA]">进度: <span className="font-medium">{contestStatus.progress}</span></span>
                          </div>
                          <div className="w-full h-2 bg-[#2D3748] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#F5F7FA]" 
                              style={{ width: `${(contestStatus.submittedWorks / contestStatus.totalWorksLimit) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-[#F5F7FA]/80 mt-1 text-right">
                            {contestStatus.submittedWorks}/{contestStatus.totalWorksLimit} 作品已提交
                          </div>
                        </div>
                      )}
                      
                      {/* 赛事描述 */}
                      <p className="text-sm text-[#F5F7FA]/90 mb-4 line-clamp-2">
                        {contest.description}
                      </p>
                      
                      {/* 奖励信息 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-[#F5F7FA] mb-2">奖励设置</h4>
                        <div className="flex flex-wrap gap-2">
                          {contest.prizes.slice(0, 3).map((prize, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full text-xs border border-[#6B7C93]/30"
                            >
                              {prize.rank}
                            </span>
                          ))}
                          {contest.prizes.length > 3 && (
                            <span className="px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full text-xs border border-[#6B7C93]/30">
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
                                ? 'bg-[#F5F7FA] text-[#4A5F8B]'
                                : 'bg-[#2D3748]/50 text-[#F5F7FA] border border-[#6B7C93]/30'
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
                           className="flex-1 py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"
                         >
                           查看详情
                         </Link>
                        
                        {/* 分享按钮 */}
                        <div className="relative">
                          <button 
                            className="w-10 flex items-center justify-center text-[#F5F7FA] hover:bg-[#F5F7FA] hover:text-[#4A5F8B] rounded-lg transition-colors border border-[#F5F7FA]"
                            onClick={() => setShowShareMenu(showShareMenu === contest.id ? null : contest.id)}
                          >
                            <i className="fa-solid fa-share-alt"></i>
                          </button>
                          
                          {/* 分享菜单 */}
                          {showShareMenu === contest.id && (
                                 <div className="absolute right-0 mt-2 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] py-2 z-10">
                                <button 
                                  className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, '微博')}
                                >
                                  <i className="fa-brands fa-weibo mr-2 text-[#E6162D]"></i> 分享到微博
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, '微信')}
                                >
                                  <i className="fa-brands fa-weixin mr-2 text-[#07C160]"></i> 分享到微信
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
                                  onClick={() => shareContest(contest.id, 'QQ')}
                                >
                                  <i className="fa-brands fa-qq mr-2 text-[#12B7F5]"></i> 分享到QQ
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
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
                <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                  <div className="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                    <i className={isUserPersonalContests ? "fa-solid fa-trophy text-2xl" : "fa-solid fa-search text-2xl"}></i>
                  </div>
                  <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">
                    {isUserPersonalContests ? "您还没有参加任何赛事" : "未找到相关赛事"}
                  </h3>
                  <p className="text-[#B8C6D8] mb-6">
                    {isUserPersonalContests 
                      ? "浏览赛事页面，找到感兴趣的赛事并参加，展示您的摄影才华" 
                      : "请尝试使用不同的关键词或筛选条件"
                    }
                  </p>
                  {isUserPersonalContests && (
                    <Link to="/photography-contests" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors inline-flex items-center">
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
                <nav className="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    3
                  </button>
                  <span className="px-2 text-[#B8C6D8]">...</span>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    6
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 热门标签模块 */}
            <div className="bg-[#4A5F8B] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-[#F5F7FA] text-[#4A5F8B]'
                        : 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]'
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
                  className="mt-4 w-full py-2 text-center text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
            
            {/* 即将截止 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] text-[#F5F7FA]">
              <h3 className="text-lg font-bold mb-4">即将截止</h3>
              <div className="space-y-4">
                {mockContests
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
                        <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-[#2D3748]/30 rounded-lg text-[#F5F7FA]">
                          <span className="text-lg font-bold">{diffDays}</span>
                          <span className="text-xs">天后截止</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors truncate">
                            {contest.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-[#F5F7FA]/80">
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
                className="mt-4 inline-block text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors flex items-center justify-center w-full"
              >
                <span>查看全部即将截止的赛事</span>
              </Link>
            </div>
            
            {/* 赛事常见问题 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">参赛指南</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-[#F5F7FA] mb-1">如何参赛？</h4>
                  <p className="text-sm text-[#B8C6D8]">
                    浏览感兴趣的赛事，点击"立即参赛"按钮，按照要求上传作品并填写相关信息即可完成报名。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#F5F7FA] mb-1">作品有什么要求？</h4>
                  <p className="text-sm text-[#B8C6D8]">
                    不同赛事有不同的作品要求，包括题材、格式、大小等，请务必仔细阅读每个赛事的具体规则。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#F5F7FA] mb-1">如何提高获奖几率？</h4>
                  <p className="text-sm text-[#B8C6D8]">
                    了解赛事主题和评审标准，提交符合要求的高质量原创作品，注意作品的创意性、技术性和表现力。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#F5F7FA] mb-1">获奖后如何领奖？</h4>
                  <p className="text-sm text-[#B8C6D8]">
                    赛事结果公布后，工作人员会通过站内信、邮件或电话联系获奖者，安排奖金发放和奖品寄送事宜。
                  </p>
                </div>
              </div>
            </div>
            
            {/* 赛事日历模块 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">赛事日历</h3>
              {/* 简化的日历组件 */}
              <div className="text-center mb-3">
                <h4 className="font-medium text-[#F5F7FA]">2023年四季度</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-[#4A5F8B]">10月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0">15</span>
                      <span className="text-sm text-[#F5F7FA] ml-2">自然生态摄影展截止</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-[#4A5F8B]">11月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0">15</span>
                      <span className="text-sm text-[#F5F7FA] ml-2">索尼Alpha创意摄影挑战赛截止</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0">30</span>
                      <span className="text-sm text-[#F5F7FA] ml-2">城市人文纪实摄影大赛截止</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-16 text-center flex-shrink-0">
                    <span className="text-sm font-medium text-[#4A5F8B]">12月</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0">31</span>
                      <span className="text-sm text-[#F5F7FA] ml-2">年度黑白摄影大赛截止</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 创建赛事 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-3">创建个人赛事</h3>
              <p className="text-sm mb-4 text-white/90">
                你也可以创建自己的摄影赛事，邀请好友参与，自定义规则和奖励
              </p>
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-2 bg-[#F5F7FA] text-[#4A5F8B] font-medium rounded-lg hover:bg-[#FFFFFF] transition-colors"
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