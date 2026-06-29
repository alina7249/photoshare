// TutorialResources.tsx - 卡片hover效果详细描述：
// 1. 工具卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 标签按钮：当鼠标悬停时，标签的背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)
// 3. 打开工具按钮：当鼠标悬停时，按钮的背景颜色会变为浅灰色(#6B7C93)，增强视觉反馈
// 4. 添加工具按钮：当鼠标悬停时，按钮的背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiGet } from '../lib/api';
import { HOVER_SHADOWS } from '../constants/theme';

const categories: string[] = ['全部'];

const TutorialResources: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'online' | 'presets'>('online');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('usage');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await apiGet('/tools');
        setTools(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch tools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 过滤已添加工具
  const getFilteredAddedTools = () => {
    let result = [...tools];
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      result = result.filter(tool => tool.category === selectedCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      result = result.filter(tool => 
        selectedTags.some(tag => tool.category === tag)
      );
    }
    
    // 排序
    if (sortBy === 'usage') {
      result.sort((a, b) => b.usageCount - a.usageCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return result;
  };

  // 过滤推荐工具
  const getFilteredRecommendedTools = () => {
    let result = [...tools];
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      result = result.filter(tool => tool.category === selectedCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      result = result.filter(tool => 
        selectedTags.some(tag => tool.category === tag)
      );
    }
    
    return result;
  };

  const filteredAddedTools = getFilteredAddedTools();
  const filteredRecommendedTools = getFilteredRecommendedTools();

  return (
    <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">我的后期工具</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            管理和使用您的在线后期工具，提升照片编辑效率
          </p>
        </div>

        {/* 顶部选项卡 */}
        <div className="bg-card rounded-xl shadow-sm border border-accent mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'online'
                  ? 'bg-accent text-text-primary'
                  : 'bg-card text-text-muted hover:text-text-primary'
              }`}
            >
              在线工具
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'bg-accent text-text-primary'
                  : 'bg-card text-text-muted hover:text-text-primary'
              }`}
            >
              个人预设
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索工具或功能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {activeTab === 'online' && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="usage">使用频率</option>
                  <option value="rating">评分</option>
                  <option value="name">名称排序</option>
                </select>
              )}
            </div>
          </div>
          
          {/* 标签筛选 */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-text-muted mb-2">按标签筛选</h4>
            <div className="flex flex-wrap gap-2">
              {categories.filter(cat => cat !== '全部').map((category) => (
                <button
                  key={category}
                  onClick={() => toggleTag(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(category)
                      ? 'bg-accent text-text-primary'
                      : 'bg-card text-text-muted border border-accent'
                  } transition-colors`}
                >
                  #{category}
                </button>
              ))}
            </div>
            
            {/* 清除标签 */}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                <i className="fa-solid fa-times mr-1"></i> 清除所有标签
              </button>
            )}
          </div>
        </div>

        {activeTab === 'online' && (
          <>
            {/* 已添加工具列表 */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <i className="fa-solid fa-toolbox mr-2 text-accent"></i>
                已添加工具
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAddedTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                    className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                  >
                    {/* 工具缩略图 */}
                    <div className="relative">
                      <img
                        src={tool.thumbnail}
                        alt={tool.name}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-accent/80 text-text-primary text-xs rounded">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* 工具信息 */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-text-primary mb-1">{tool.name}</h3>
                      <p className="text-xs text-text-muted mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs text-text-muted">
                          <span className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-accent"></i>
                            {tool.rating}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-clock mr-1 text-accent"></i>
                            {tool.usageCount}次使用
                          </span>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <button className="w-full py-2 text-center bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm">
                        <i className="fa-solid fa-external-link-alt mr-1"></i> 打开工具
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredAddedTools.length === 0 && (
                <div className="p-6 bg-card rounded-xl border border-accent text-center">
                  <div className="w-12 h-12 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                    <i className="fa-solid fa-toolbox text-xl"></i>
                  </div>
                  <p className="text-text-muted">暂无符合条件的已添加工具</p>
                </div>
              )}
            </div>

            {/* 推荐工具列表 */}
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <i className="fa-solid fa-thumbs-up mr-2 text-accent"></i>
                推荐工具
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRecommendedTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                    className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                  >
                    {/* 工具缩略图 */}
                    <div className="relative">
                      <img
                        src={tool.thumbnail}
                        alt={tool.name}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-accent/80 text-text-primary text-xs rounded">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* 工具信息 */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-text-primary mb-1">{tool.name}</h3>
                      <p className="text-xs text-text-muted mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs text-text-muted">
                          <span className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-accent"></i>
                            {tool.rating}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-user mr-1 text-accent"></i>
                            {tool.users}人使用
                          </span>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <button className="w-full py-2 text-center bg-accent-hover text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors text-sm">
                        <i className="fa-solid fa-plus mr-1"></i> 添加工具
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredRecommendedTools.length === 0 && (
                <div className="p-6 bg-card rounded-xl border border-accent text-center">
                  <div className="w-12 h-12 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                    <i className="fa-solid fa-thumbs-up text-xl"></i>
                  </div>
                  <p className="text-text-muted">暂无符合条件的推荐工具</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'presets' && (
          <div className="bg-card rounded-xl p-10 text-center border border-accent">
            <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
              <i className="fa-solid fa-palette text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">个人预设</h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              您的个人预设功能正在开发中，敬请期待
            </p>
            <button className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors inline-flex items-center">
              <i className="fa-solid fa-bell mr-2"></i>
              功能上线提醒我
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TutorialResources;