// SearchResult.tsx - 卡片hover效果详细描述：
// 1. 搜索建议按钮：当鼠标悬停时按钮会轻微放大，点击时会轻微缩小，提供即时的交互反馈
// 2. 热门搜索项：当鼠标悬停时，整个项目会向右平移5个像素，产生一种被选中的动效
// 3. 相关标签链接：当鼠标悬停时，标签的背景颜色会发生变化，增强视觉反馈

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhotographyCard } from '../components/PhotographyCard';
import { POST_API } from '../constants/api';
import { apiGet } from '../services/api';
import { ROUTES } from '../router/routes';

// 推荐搜索关键词
const suggestedSearches = [
  '风景', '人像', '城市', '自然', '夜景', '纪实', '微距', '黑白',
  '日出', '日落', '星空', '街拍', '儿童', '宠物', '建筑', '旅行'
];

const SearchResult: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [landscapeResults, setLandscapeResults] = useState<any[]>([]);
  const [portraitResults, setPortraitResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('all'); // 'all', 'photos', 'users', 'tags'

  // 从URL获取搜索参数
  useEffect(() => {
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');
    
    if (tag) {
      setQuery(tag);
      // 模拟搜索请求
      search(tag);
    } else if (q) {
      setQuery(q);
      // 模拟搜索请求
      search(q);
    }
  }, [searchParams]);

  // 搜索功能
  const search = (keyword: string) => {
    setIsLoading(true);
    apiGet(`${POST_API.SEARCH}?q=${encodeURIComponent(keyword)}`)
      .then((data: any[]) => {
        setResults(data);
        setLandscapeResults(data.filter((item: any) => item.tags?.includes('风景') || item.tags?.includes('landscape')));
        setPortraitResults(data.filter((item: any) => item.tags?.includes('人像') || item.tags?.includes('portrait')));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  // 处理推荐搜索点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-surface-light-alt">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 搜索栏 */}
        <div className="mb-8 max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索作品、摄影师或标签..."
              className="w-full px-4 py-3 pl-12 pr-16 bg-surface-light border border-dark-surface text-dark-surface rounded-full focus:outline-none focus:ring-2 focus:ring-dark-surface transition-all text-lg"
            />
            <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-border-light"></i>
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-1.5 border-2 border-dark-surface bg-gradient-to-br from-border-light to-surface-light-alt hover:from-surface-light-alt hover:to-border-light text-dark-surface rounded-full text-sm font-medium transition-colors"
            >
              搜索
            </button>
          </form>
          
          {/* 搜索结果标题 */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-dark">
              {isLoading ? '搜索中...' : `搜索结果: "${query}"`}
            </h1>
            {!isLoading && results.length > 0 && (
              <p className="text-dark-surface/80 mt-2">
                找到 {results.length} 个相关结果
              </p>
            )}
          </div>
        </div>

        {/* 结果分类选项卡 */}
        {!isLoading && (
          <div className="mb-8 bg-border-light rounded-xl shadow-light-sm border border-dark-surface">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setSearchType('all')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'all'
                    ? 'text-dark-surface border-b-2 border-dark-surface'
                    : 'text-dark-surface/70 hover:text-dark-surface'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSearchType('photos')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'photos'
                    ? 'text-dark-surface border-b-2 border-dark-surface'
                    : 'text-dark-surface/70 hover:text-dark-surface'
                }`}
              >
                作品
              </button>
              <button
                onClick={() => setSearchType('users')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'users'
                    ? 'text-dark-surface border-b-2 border-dark-surface'
                    : 'text-dark-surface/70 hover:text-dark-surface'
                }`}
              >
                用户
              </button>
              <button
                onClick={() => setSearchType('tags')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'tags'
                    ? 'text-dark-surface border-b-2 border-dark-surface'
                    : 'text-dark-surface/70 hover:text-dark-surface'
                }`}
              >
                标签
              </button>
            </div>
          </div>
        )}

        {/* 搜索结果内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            {isLoading ? (
              // 加载状态
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-border-light rounded-xl overflow-hidden border border-dark-surface animate-pulse">
                    <div className="h-64 bg-surface-light-alt"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-surface-light rounded w-3/4"></div>
                      <div className="h-3 bg-surface-light rounded w-full"></div>
                      <div className="h-3 bg-surface-light rounded w-5/6"></div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-surface-light rounded-full"></div>
                        <div className="flex space-x-4">
                          <div className="h-4 bg-surface-light rounded w-10"></div>
                          <div className="h-4 bg-surface-light rounded w-10"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              // 搜索结果
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PhotographyCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              // 无结果状态
              <div className="bg-border-light rounded-xl p-12 text-center shadow-light-sm border border-dark-surface">
                <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center text-border-light mx-auto mb-6">
                  <i className="fa-solid fa-search text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">
                  未找到相关结果
                </h3>
                <p className="text-dark-surface/80 mb-6 max-w-md mx-auto">
                  尝试使用不同的关键词或检查拼写，也可以浏览我们的推荐内容
                </p>
                <Link
                  to={ROUTES.HOME}
                  className="inline-flex items-center px-6 py-3 border-2 border-dark-surface bg-gradient-to-br from-border-light to-surface-light-alt hover:from-surface-light-alt hover:to-border-light text-dark-surface rounded-lg font-medium transition-colors shadow-light-sm"
                >
                  <i className="fa-solid fa-home mr-2"></i>
                  返回首页
                </Link>
              </div>
            )}
            
            {/* 分页 */}
            {!isLoading && results.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-1 bg-border-light p-2 rounded-lg border border-dark-surface">
                  <button className="px-3 py-2 rounded border border-dark-surface text-dark-surface hover:bg-surface-light transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-dark-surface bg-surface-light text-dark-surface">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-dark-surface text-dark-surface hover:bg-surface-light transition-colors">
                    2
                  </button>
                  <span className="px-2 text-dark-surface/70">...</span>
                  <button className="px-3 py-2 rounded border border-dark-surface text-dark-surface hover:bg-surface-light transition-colors">
                    5
                  </button>
                  <button className="px-3 py-2 rounded border border-dark-surface text-dark-surface hover:bg-surface-light transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 搜索建议 */}
            <div className="bg-border-light rounded-xl p-6 shadow-light-sm border border-dark-surface">
              <h3 className="text-lg font-bold mb-4 text-gray-dark">搜索建议</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-surface-light text-dark-surface rounded-full text-sm hover:bg-surface-light-alt transition-colors border border-dark-surface/10"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 热门搜索 */}
            <div className="bg-border-light rounded-xl p-6 shadow-light-sm border border-dark-surface">
              <h3 className="text-lg font-bold mb-4 text-gray-dark">热门搜索</h3>
              <div className="space-y-3">
                {suggestedSearches.slice(0, 10).map((term, index) => (
                  <motion.div
                    key={term}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold ${
                        index < 3 
                          ? 'bg-brown/20 text-brown' 
                          : 'bg-surface-light text-dark-surface'
                      }`}>
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleSuggestionClick(term)}
                        className="text-dark-surface hover:text-border-light transition-colors"
                      >
                        {term}
                      </button>
                    </div>
                    <span className="text-xs text-dark-surface/70">
                      {Math.floor(Math.random() * 9000) + 1000} 搜索
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 相关标签 */}
            <div className="bg-border-light rounded-xl p-6 shadow-light-sm border border-dark-surface">
              <h3 className="text-lg font-bold mb-4 text-gray-dark">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {['摄影技巧', '器材推荐', '后期修图', '拍摄地点', '摄影比赛', '新手入门', '约拍活动'].map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="px-3 py-1 bg-surface-light text-dark-surface rounded-full text-sm hover:bg-surface-light-alt transition-colors border border-dark-surface/10"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchResult;