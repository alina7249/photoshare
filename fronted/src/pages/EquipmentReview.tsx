import { buildCozeImageUrl } from '../constants/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { apiGet } from '../lib/api';
import { CHART_COLORS, HOVER_SHADOWS } from '../constants/theme';

// 雷达图颜色
const RADAR_COLORS = [...CHART_COLORS.RADAR];

const EquipmentReview: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, rating
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]); // 用于对比测评
  const [showComparison, setShowComparison] = useState(false); // 是否显示对比测评

  useEffect(() => {
    apiGet('/reviews').then(data => setReviews(data)).catch(() => setReviews([]));
  }, []);

  // 测评分类
  const reviewCategories = [
    { id: 'all', name: '全部', count: reviews.length },
    { id: 'professional', name: '专业编辑测评', count: reviews.filter((r: any) => r.type === '专业编辑测评').length },
    { id: 'user', name: '用户实测分享', count: reviews.filter((r: any) => r.type === '用户实测分享').length },
  ];

  // 器材类型标签
  const equipmentTypeTags: string[] = [];

  // 价格区间标签
  const priceRangeTags: string[] = [];

  // 使用场景标签
  const usageScenarioTags: string[] = [];

  // 对比测评数据
  const comparisonReviewData: any[] = [];

  // 过滤测评
  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // 按分类过滤
    if (activeCategory === 'professional') {
      filtered = filtered.filter(review => review.type === '专业编辑测评');
    } else if (activeCategory === 'user') {
      filtered = filtered.filter(review => review.type === '用户实测分享');
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(term) || 
        review.equipment.name.toLowerCase().includes(term) ||
        review.author.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(review => 
        review.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  };

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 切换对比测评选择
  const toggleCompareReview = (reviewId: string) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
    } else {
      if (selectedReviews.length < 3) { // 最多对比3篇
        setSelectedReviews([...selectedReviews, reviewId]);
      }
    }
  };

  // 显示对比测评
  const handleShowComparison = () => {
    setShowComparison(true);
  };

  // 关闭对比测评
  const handleCloseComparison = () => {
    setShowComparison(false);
  };

  // 键名翻译
  const translateKey = (key: string) => {
    const translations: {[key: string]: string} = {
      imageQuality: '画质',
      autofocus: '自动对焦',
      video: '视频',
      handling: '操控',
      battery: '电池',
      value: '性价比',
      sharpness: '锐度',
      bokeh: '虚化',
      buildQuality: '做工',
    };
    
    return translations[key] || key;
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">专业测评</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            深入了解各类摄影器材的真实性能，专业编辑评测与用户实际使用体验分享
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 功能导航卡片 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm text-white mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <i className="fa-solid fa-lightbulb mr-2"></i>功能导航
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-video mr-2 text-text-primary"></i>视频测评集成
                  </h4>
                  <p className="text-sm text-white/80">在测评卡片图片上点击播放图标查看相关视频</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-balance-scale mr-2 text-text-primary"></i>对比测评功能
                  </h4>
                  <p className="text-sm text-white/80">点击卡片右上角勾选框选择测评，底部会出现对比按钮</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-shield-alt mr-2 text-text-primary"></i>可信度评分
                  </h4>
                  <p className="text-sm text-white/80">每个测评卡片底部显示用户对测评真实性的评价</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-lightbulb mr-2 text-text-primary"></i>器材使用技巧
                  </h4>
                  <p className="text-sm text-white/80">侧边栏下方"器材使用技巧"区域查看更多技巧</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-question-circle mr-2 text-text-primary"></i>常见问题解答
                  </h4>
                  <p className="text-sm text-white/80">侧边栏下方"常见问题解答"区域查看FAQ汇总</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-user-tie mr-2 text-text-primary"></i>测评作者专栏
                  </h4>
                  <p className="text-sm text-white/80">点击测评卡片中作者头像或名称查看作者所有测评</p>
                </div>
              </div>
            </div>

            {/* 搜索和排序 */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索测评内容、器材型号或作者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最多阅读</option>
                <option value="rating">最高评分</option>
              </select>
            </div>

            {/* 测评分类选项卡 */}
            <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
              <div className="flex">
                {reviewCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'text-text-primary border-b-2 border-accent'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* 对比测评显示区域 */}
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card rounded-xl p-6 border border-accent overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-text-primary">测评对比</h3>
                  <button 
                    onClick={handleCloseComparison}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                
                {/* 对比雷达图 */}
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={comparisonReviewData}>
                      <PolarGrid stroke="var(--light-cool-gray)" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-light)', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'var(--text-light)' }} />
                      <Radar
                        name="A7R V"
                        dataKey="A7R V"
                        stroke={RADAR_COLORS[0]}
                        fill={RADAR_COLORS[0]}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="EOS R5"
                        dataKey="EOS R5"
                        stroke={RADAR_COLORS[1]}
                        fill={RADAR_COLORS[1]}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Z 7II"
                        dataKey="Z 7II"
                        stroke={RADAR_COLORS[2]}
                        fill={RADAR_COLORS[2]}
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 对比文字分析 */}
                <div className="space-y-4">
                  <p className="text-sm text-text-light">
                    <strong>分辨率对比：</strong> A7R V以9.8分领先，EOS R5和Z 7II紧随其后，三者在高分辨率拍摄方面都有出色表现。
                  </p>
                  <p className="text-sm text-text-light">
                    <strong>自动对焦对比：</strong> A7R V的自动对焦系统表现最为出色，尤其在复杂光线条件下的追踪能力优秀。
                  </p>
                  <p className="text-sm text-text-light">
                    <strong>视频能力对比：</strong> EOS R5在视频规格和质量上略占优势，支持8K 30p和4K 120p拍摄。
                  </p>
                  <p className="text-sm text-text-light">
                    <strong>性价比对比：</strong> Z 7II在三者中性价比最高，提供了专业级性能但价格更为亲民。
                  </p>
                </div>
              </motion.div>
            )}

            {/* 测评列表 */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                  className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                >
                  {/* 测评图片 */}
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <img
                        src={review.featuredImage}
                        alt={review.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      {/* 视频播放图标 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                          <i className="fa-solid fa-play text-xl"></i>
                        </button>
                      </div>
                      {/* 对比选择框 */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleCompareReview(review.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            selectedReviews.includes(review.id)
                              ? 'bg-accent text-white'
                              : 'bg-card/80 text-text-muted'
                          } transition-colors`}
                          title="添加到对比"
                        >
                          {selectedReviews.includes(review.id) && <i className="fa-solid fa-check text-xs"></i>}
                        </button>
                      </div>
                    </div>
                    
                    {/* 测评内容 */}
                    <div className="p-5 md:w-2/3">
                      {/* 测评类型和日期 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-deep text-accent border border-accent">
                          {review.type}
                        </span>
                        <div className="text-xs text-text-muted flex items-center space-x-2">
                          <span>{review.date}</span>
                          <span>•</span>
                          <span>{review.readTime}</span>
                        </div>
                      </div>
                      
                      {/* 标题和摘要 */}
                      <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-accent transition-colors">
                        {review.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-4 line-clamp-2">
                        {review.excerpt}
                      </p>
                      
                      {/* 测评的器材 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={review.equipment.image}
                          alt={review.equipment.name}
                          className="w-10 h-10 object-cover rounded border border-accent mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{review.equipment.name}</p>
                          <p className="text-xs text-text-muted">{review.equipment.type}</p>
                        </div>
                      </div>
                      
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedTags.includes(tag)
                                ? 'bg-accent text-text-primary'
                                : 'bg-deep text-text-muted border border-accent'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* 可信度评分 */}
                      <div className="mb-4 flex items-center">
                        <div className="flex items-center">
                          <i className="fa-solid fa-shield-alt text-accent mr-2"></i>
                          <span className="text-sm text-text-muted">可信度评分：</span>
                          <span className="text-sm font-bold text-accent ml-1">{review.credibilityRating}/10</span>
                        </div>
                      </div>
                      
                      {/* 作者和统计信息 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Link to={`/author/${review.author.id}`} className="flex items-center">
                            <img
                              src={review.author.avatar}
                              alt={review.author.name}
                              className="w-8 h-8 rounded-full mr-2 object-cover border border-accent"
                            />
                            <div>
                              <p className="text-sm font-medium text-text-primary hover:text-accent transition-colors">{review.author.name}</p><p className="text-xs text-text-muted">{review.author.role}</p>
                            </div>
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-muted">
                          <div className="flex items-center">
                            <i className="fa-solid fa-eye mr-1"></i>
                            <span>{review.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-heart mr-1"></i>
                            <span>{review.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-comment mr-1"></i>
                            <span>{review.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 性能摘要 */}
                  <div className="px-5 py-4 bg-deep border-t border-accent">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-text-primary">性能评分</h4>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-accent">{review.rating}</span>
                        <span className="text-sm text-text-muted ml-1">/10</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(review.performance || {}).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="text-xs text-text-muted mr-1">{translateKey(key)}:</span>
                          <div className="w-16 bg-accent/30 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${(value as number) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-text-primary ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 底部操作按钮 */}
                  <div className="px-5 py-4 border-t border-accent bg-card flex items-center justify-between">
                    <Link
                      to={`/review/${review.id}`}
                      className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
                    >
                      阅读全文
                    </Link>
                    <div className="flex items-center space-x-3">
                      <button className="text-text-muted hover:text-text-primary transition-colors">
                        <i className="fa-solid fa-bookmark"></i>
                      </button>
                      <button className="text-text-muted hover:text-text-primary transition-colors">
                        <i className="fa-solid fa-share-alt"></i>
                      </button>
                      <Link
                        to={`/equipment/${review.equipment.id}`}
                        className="text-sm text-accent hover:underline transition-colors"
                      >
                        查看器材详情
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="p-8 bg-card rounded-xl border border-accent text-center">
                  <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                    <i className="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关测评</h3>
                  <p className="text-text-muted">
                    请尝试使用不同的关键词或筛选条件
                  </p>
                </div>
              )}
            </div>
            
            {/* 对比测评按钮 */}
            {selectedReviews.length > 0 && (
              <motion.div 
                className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent py-3 px-4 z-10 shadow-lg"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                  <div className="flex items-center">
                    <i className="fa-solid fa-balance-scale text-accent mr-2"></i>
                    <span className="text-text-light">已选择 {selectedReviews.length} 篇测评进行对比</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShowComparison}
                    className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-light-accent transition-colors"
                  >
                    查看对比
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {/* 分页 */}
            {filteredReviews.length > 0 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-surface-light-card p-2 rounded-lg border border-text-muted">
                  <button className="px-3 py-2 rounded border border-text-muted text-text-light hover:bg-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-text-muted bg-text-primary text-text-light">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-text-muted text-text-light hover:bg-text-primary transition-colors">
                    2
                  </button>
                  <span className="px-2 text-text-light/70">...</span>
                  <button className="px-3 py-2 rounded border border-text-muted text-text-light hover:bg-text-primary transition-colors">
                    5
                  </button>
                  <button className="px-3 py-2 rounded border border-text-muted text-text-light hover:bg-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 测评标签筛选 */}
            <div className="bg-text-primary rounded-xl p-6 shadow-sm border border-text-muted">
              <h3 className="text-lg font-bold mb-4 text-text-light">筛选标签</h3>
              
              {/* 器材类型 */}
              <div className="mb-6"><h4 className="text-sm font-medium text-text-light mb-3">器材类型</h4>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypeTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-accent text-text-primary'
                          : 'bg-surface-light-card text-text-light border border-text-muted/30'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 价格区间 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-light mb-3">价格区间</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRangeTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-accent text-text-primary'
                          : 'bg-surface-light-card text-text-light border border-text-muted/30'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 使用场景 */}
              <div>
                <h4 className="text-sm font-medium text-text-light mb-3">使用场景</h4>
                <div className="flex flex-wrap gap-2">
                  {usageScenarioTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-accent text-text-primary'
                          : 'bg-surface-light-card text-text-light border border-text-muted/30'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 清除筛选 */}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-4 w-full py-2 text-center text-sm text-text-light hover:text-accent transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有筛选
                </button>
              )}
            </div>
            
            {/* 热门测评作者 */}
            <div className="bg-text-primary rounded-xl p-6 shadow-sm border border-text-muted">
              <h3 className="text-lg font-bold mb-4 text-text-light">热门测评作者</h3>
              <div className="space-y-4">
                {[
                  {
                    id: '101',
                    name: '器材专家张明',
                    avatar: buildCozeImageUrl('photography equipment expert male professional', '56fa5f34db1fbce04f76c7576c6ad020', 'square'),
                    reviews: 48,
                    followers: 12543,
                    rating: 9.4
                  },
                  {
                    id: '104',
                    name: '镜头专家刘芳',
                    avatar: buildCozeImageUrl('photography lens expert female professional', 'c9dd2373388218683b3e980d22233258', 'square'),
                    reviews: 36,
                    followers: 9876,
                    rating: 9.5
                  },
                  {
                    id: '102',
                    name: '婚礼摄影师李华',
                    avatar: buildCozeImageUrl('wedding photographer male creative', '82c2687369cb5518e618423326b5a47c', 'square'),
                    reviews: 24,
                    followers: 7654,
                    rating: 9.2
                  }
                ].map((author) => (
                  <motion.div 
                    key={author.id} 
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between"
                  >
                    <Link to={`/author/${author.id}`} className="flex items-center space-x-3">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-12 h-12 rounded-full object-cover border border-text-muted"
                      />
                      <div>
                        <p className="font-medium text-text-light">{author.name}</p>
                        <p className="text-xs text-accent">{author.reviews} 篇测评</p>
                      </div>
                    </Link>
                    <button className="px-3 py-1 text-xs font-medium text-text-light border border-text-muted rounded-full hover:bg-surface-light-card transition-colors">
                      关注
                    </button>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-accent hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多作者</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 器材使用技巧 */}
            <div className="bg-text-primary rounded-xl p-6 shadow-sm border border-text-muted">
              <h3 className="text-lg font-bold mb-4 text-text-light">器材使用技巧</h3>
              <div className="space-y-3">
                {[
                  {
                    id: 't1',
                    title: '如何延长相机电池续航',
                    views: 5678
                  },
                  {
                    id: 't2',
                    title: '镜头清洁保养完全指南',
                    views: 4321
                  },
                  {
                    id: 't3',
                    title: '相机存储格式选择技巧',
                    views: 3245
                  },
                  {
                    id: 't4',
                    title: '三脚架选购与使用技巧',
                    views: 2890
                  }
                ].map((tip) => (
                  <motion.div
                    key={tip.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-text-light hover:text-accent transition-colors cursor-pointer">
                      {tip.title}
                    </p>
                    <span className="text-xs text-text-light/70">{tip.views} 阅读</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-accent hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多技巧</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 常见问题解答 */}
            <div className="bg-text-primary rounded-xl p-6 shadow-sm border border-text-muted">
              <h3 className="text-lg font-bold mb-4 text-text-light">常见问题解答</h3>
              <div className="space-y-3">
                {[
                  {
                    id: 'q1',
                    question: '如何选择适合自己的相机？'
                  },
                  {
                    id: 'q2',
                    question: '全画幅与APS-C相机的区别？'
                  },
                  {
                    id: 'q3',
                    question: '如何正确清洁相机传感器？'
                  },
                  {
                    id: 'q4',
                    question: '新手如何学习摄影？'
                  }
                ].map((faq) => (
                  <motion.div
                    key={faq.id}
                    whileHover={{ x: 5 }}
                    className="border-b border-surface-light-card pb-2"
                  >
                    <p className="text-sm text-text-light hover:text-accent transition-colors cursor-pointer">
                      {faq.question}
                    </p>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-accent hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多FAQ</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 测评贡献者招募 */}
            <div className="bg-gradient-to-r from-accent to-text-muted rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-3">成为测评作者</h3>
              <p className="text-sm mb-4 text-white/90">
                如果你对摄影器材有深入研究，欢迎加入我们的测评团队，分享你的专业见解
              </p>
              <button className="w-full py-2 bg-white text-accent font-medium rounded-lg hover:bg-surface-light-card transition-colors">
                了解详情
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EquipmentReview;