// SearchResult.tsx - 卡片hover效果详细描述：
// 1. 搜索建议按钮：当鼠标悬停时按钮会轻微放大，点击时会轻微缩小，提供即时的交互反馈
// 2. 热门搜索项：当鼠标悬停时，整个项目会向右平移5个像素，产生一种被选中的动效
// 3. 相关标签链接：当鼠标悬停时，标签的背景颜色会发生变化，增强视觉反馈

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhotographyCard } from '../components/PhotographyCard';

// 模拟搜索结果数据
const mockSearchResults = {
  '风景': [
    {
      id: '101',
      title: '山水之间',
      description: '壮丽的山水风光，大自然的鬼斧神工',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=mountain%20landscape%20river%20nature%20scenery&sign=1ebfb3d0a3aabb7b0d0208e56d87faab',
      author: {
        id: '201',
        name: '山水摄影师',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20nature&sign=d2909ca21847a589724e375f707f0c30',
      },
      likes: 356,
      comments: 42,
      tags: ['风景', '山水', '自然'],
      date: '2023-10-25',
    },
    {
      id: '102',
      title: '云海奇观',
      description: '壮观的云海景观，宛如仙境',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sea%20of%20clouds%20mountain%20peak%20spectacular&sign=8942a52199358f7bfc5daabce6ff87b5',
      author: {
        id: '202',
        name: '云海拍摄者',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20cloud&sign=31c14761db1c0116595f984e6c8612a0',
      },
      likes: 289,
      comments: 35,
      tags: ['风景', '云海', '高山'],
      date: '2023-10-24',
    },
    {
      id: '103',
      title: '海边日落',
      description: '浪漫的海边日落，金色的阳光洒在海面上',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sunset%20at%20beach%20golden%20light%20waves&sign=96158b5722f8d2bdf5a194341611e00a',
      author: {
        id: '203',
        name: '海景摄影师',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20beach&sign=49ff3b599ac6461498299f7ce099fc87',
      },
      likes: 423,
      comments: 56,
      tags: ['风景', '海边', '日落'],
      date: '2023-10-23',
    },
  ],
  '人像': [
    {
      id: '104',
      title: '都市人像',
      description: '现代都市背景下的时尚人像摄影',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=urban%20portrait%20modern%20fashion%20city&sign=138dd578a7705dd37ddac86727b5619b',
      author: {
        id: '204',
        name: '时尚摄影师',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20photographer%20avatar%20female&sign=5d573110bed3aa6476481a358aacfcf9',
      },
      likes: 387,
      comments: 48,
      tags: ['人像', '时尚', '都市'],
      date: '2023-10-22',
    },
    {
      id: '105',
      title: '自然光影人像',
      description: '利用自然光线打造的唯美人像作品',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=natural%20light%20portrait%20soft%20shadow%20outdoor&sign=1f351c2bbca721b34bec99b730cc7f80',
      author: {
        id: '205',
        name: '光影摄影师',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20avatar%20male%20light&sign=41f9af8620a61e383eaca864c3409ef8',
      },
      likes: 456,
      comments: 62,
      tags: ['人像', '自然光', '唯美'],
      date: '2023-10-21',
    },
  ],
  // 其他标签的结果...
};

// 推荐搜索关键词
const suggestedSearches = [
  '风景', '人像', '城市', '自然', '夜景', '纪实', '微距', '黑白',
  '日出', '日落', '星空', '街拍', '儿童', '宠物', '建筑', '旅行'
];

const SearchResult: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockSearchResults['风景']>([]);
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

  // 模拟搜索功能
  const search = (keyword: string) => {
    setIsLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      // 查找匹配的结果
      let searchResults: typeof mockSearchResults['风景'] = [];
      
      // 检查是否有匹配的标签结果
      for (const tag in mockSearchResults) {
        if (tag.includes(keyword)) {
          searchResults = [...searchResults, ...mockSearchResults[tag as keyof typeof mockSearchResults]];
        }
      }
      
      // 如果没有匹配的标签结果，返回一些默认结果
      if (searchResults.length === 0) {
        // 合并所有结果
        for (const tag in mockSearchResults) {
          searchResults = [...searchResults, ...mockSearchResults[tag as keyof typeof mockSearchResults]];
        }
        // 随机取一些结果
        searchResults = searchResults.sort(() => 0.5 - Math.random()).slice(0, 4);
      }
      
      setResults(searchResults);
      setIsLoading(false);
    }, 500);
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
    <div className="container mx-auto px-4 py-8 bg-[#E5E9F0]">
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
              className="w-full px-4 py-3 pl-12 pr-16 bg-[#FAF9F6] border border-[#2B3445] text-[#2B3445] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2B3445] transition-all text-lg"
            />
            <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D0D7DE]"></i>
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-1.5 border-2 border-[#2B3445] bg-gradient-to-br from-[#D0D7DE] to-[#E5E9F0] hover:from-[#E5E9F0] hover:to-[#D0D7DE] text-[#2B3445] rounded-full text-sm font-medium transition-colors"
            >
              搜索
            </button>
          </form>
          
          {/* 搜索结果标题 */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-[#2D2D2D]">
              {isLoading ? '搜索中...' : `搜索结果: "${query}"`}
            </h1>
            {!isLoading && results.length > 0 && (
              <p className="text-[#2B3445]/80 mt-2">
                找到 {results.length} 个相关结果
              </p>
            )}
          </div>
        </div>

        {/* 结果分类选项卡 */}
        {!isLoading && (
          <div className="mb-8 bg-[#D0D7DE] rounded-xl shadow-[0_2px_8px_rgba(43,52,69,0.1)] border border-[#2B3445]">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setSearchType('all')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'all'
                    ? 'text-[#2B3445] border-b-2 border-[#2B3445]'
                    : 'text-[#2B3445]/70 hover:text-[#2B3445]'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSearchType('photos')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'photos'
                    ? 'text-[#2B3445] border-b-2 border-[#2B3445]'
                    : 'text-[#2B3445]/70 hover:text-[#2B3445]'
                }`}
              >
                作品
              </button>
              <button
                onClick={() => setSearchType('users')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'users'
                    ? 'text-[#2B3445] border-b-2 border-[#2B3445]'
                    : 'text-[#2B3445]/70 hover:text-[#2B3445]'
                }`}
              >
                用户
              </button>
              <button
                onClick={() => setSearchType('tags')}
                className={`px-6 py-4 flex-shrink-0 font-medium transition-colors ${
                  searchType === 'tags'
                    ? 'text-[#2B3445] border-b-2 border-[#2B3445]'
                    : 'text-[#2B3445]/70 hover:text-[#2B3445]'
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
                  <div key={item} className="bg-[#D0D7DE] rounded-xl overflow-hidden border border-[#2B3445] animate-pulse">
                    <div className="h-64 bg-[#E5E9F0]"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-[#FAF9F6] rounded w-3/4"></div>
                      <div className="h-3 bg-[#FAF9F6] rounded w-full"></div>
                      <div className="h-3 bg-[#FAF9F6] rounded w-5/6"></div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-[#FAF9F6] rounded-full"></div>
                        <div className="flex space-x-4">
                          <div className="h-4 bg-[#FAF9F6] rounded w-10"></div>
                          <div className="h-4 bg-[#FAF9F6] rounded w-10"></div>
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
              <div className="bg-[#D0D7DE] rounded-xl p-12 text-center shadow-[0_2px_8px_rgba(43,52,69,0.1)] border border-[#2B3445]">
                <div className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#D0D7DE] mx-auto mb-6">
                  <i className="fa-solid fa-search text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">
                  未找到相关结果
                </h3>
                <p className="text-[#2B3445]/80 mb-6 max-w-md mx-auto">
                  尝试使用不同的关键词或检查拼写，也可以浏览我们的推荐内容
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 border-2 border-[#2B3445] bg-gradient-to-br from-[#D0D7DE] to-[#E5E9F0] hover:from-[#E5E9F0] hover:to-[#D0D7DE] text-[#2B3445] rounded-lg font-medium transition-colors shadow-[0_2px_8px_rgba(43,52,69,0.1)]"
                >
                  <i className="fa-solid fa-home mr-2"></i>
                  返回首页
                </Link>
              </div>
            )}
            
            {/* 分页 */}
            {!isLoading && results.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-1 bg-[#D0D7DE] p-2 rounded-lg border border-[#2B3445]">
                  <button className="px-3 py-2 rounded border border-[#2B3445] text-[#2B3445] hover:bg-[#FAF9F6] transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-[#2B3445] bg-[#FAF9F6] text-[#2B3445]">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-[#2B3445] text-[#2B3445] hover:bg-[#FAF9F6] transition-colors">
                    2
                  </button>
                  <span className="px-2 text-[#2B3445]/70">...</span>
                  <button className="px-3 py-2 rounded border border-[#2B3445] text-[#2B3445] hover:bg-[#FAF9F6] transition-colors">
                    5
                  </button>
                  <button className="px-3 py-2 rounded border border-[#2B3445] text-[#2B3445] hover:bg-[#FAF9F6] transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 搜索建议 */}
            <div className="bg-[#D0D7DE] rounded-xl p-6 shadow-[0_2px_8px_rgba(43,52,69,0.1)] border border-[#2B3445]">
              <h3 className="text-lg font-bold mb-4 text-[#2D2D2D]">搜索建议</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-[#FAF9F6] text-[#2B3445] rounded-full text-sm hover:bg-[#E5E9F0] transition-colors border border-[#2B3445]/10"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 热门搜索 */}
            <div className="bg-[#D0D7DE] rounded-xl p-6 shadow-[0_2px_8px_rgba(43,52,69,0.1)] border border-[#2B3445]">
              <h3 className="text-lg font-bold mb-4 text-[#2D2D2D]">热门搜索</h3>
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
                          ? 'bg-[#8B4513]/20 text-[#8B4513]' 
                          : 'bg-[#FAF9F6] text-[#2B3445]'
                      }`}>
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleSuggestionClick(term)}
                        className="text-[#2B3445] hover:text-[#D0D7DE] transition-colors"
                      >
                        {term}
                      </button>
                    </div>
                    <span className="text-xs text-[#2B3445]/70">
                      {Math.floor(Math.random() * 9000) + 1000} 搜索
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 相关标签 */}
            <div className="bg-[#D0D7DE] rounded-xl p-6 shadow-[0_2px_8px_rgba(43,52,69,0.1)] border border-[#2B3445]">
              <h3 className="text-lg font-bold mb-4 text-[#2D2D2D]">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {['摄影技巧', '器材推荐', '后期修图', '拍摄地点', '摄影比赛', '新手入门', '约拍活动'].map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="px-3 py-1 bg-[#FAF9F6] text-[#2B3445] rounded-full text-sm hover:bg-[#E5E9F0] transition-colors border border-[#2B3445]/10"
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