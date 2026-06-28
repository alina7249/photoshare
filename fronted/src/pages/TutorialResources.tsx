// TutorialResources.tsx - 卡片hover效果详细描述：
// 1. 工具卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 标签按钮：当鼠标悬停时，标签的背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)
// 3. 打开工具按钮：当鼠标悬停时，按钮的背景颜色会变为浅灰色(#6B7C93)，增强视觉反馈
// 4. 添加工具按钮：当鼠标悬停时，按钮的背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 模拟已添加工具数据
const mockAddedTools = [
  {
    id: 't1',
    name: 'Lightroom 预设编辑器',
    description: '自定义和应用Lightroom预设，调整照片色调、对比度等参数',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=lightroom%20preset%20editor%20interface%20tool&sign=42661b7d2c987e965f113dcc6f3dac60',
    category: '预设工具',
    usageCount: 35,
    rating: 4.8,
  },
  {
    id: 't2',
    name: 'Photoshop 在线编辑器',
    description: '基础的在线Photoshop功能，适合快速编辑和调整照片',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photoshop%20online%20editor%20interface%20tool&sign=ba958b5aae10d256ff78fd63cdd9317e',
    category: '图像编辑',
    usageCount: 28,
    rating: 4.7,
  },
  {
    id: 't3',
    name: 'RAW 格式转换器',
    description: '将RAW格式照片转换为各种常用图像格式，支持批量处理',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=raw%20format%20converter%20interface%20tool&sign=4b092bc64a2cfa96e4b3e8a40f290cf7',
    category: '格式转换',
    usageCount: 19,
    rating: 4.5,
  },
  {
    id: 't4',
    name: '批量水印工具',
    description: '为多张照片添加自定义水印，支持调整位置、透明度和大小',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=batch%20watermark%20tool%20interface%20utility&sign=a1f93a0268496bbb87f0338ad8bf46f9',
    category: '批量处理',
    usageCount: 14,
    rating: 4.6,
  },
];

// 模拟推荐工具数据
const mockRecommendedTools = [
  {
    id: 'r1',
    name: 'AI 图像增强器',
    description: '利用AI技术增强照片细节，提升图像质量和清晰度',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=ai%20image%20enhancer%20interface%20technology&sign=768e0f379d08771771ae078ef49eea14',
    category: 'AI工具',
    rating: 4.9,
    users: 1254,
  },
  {
    id: 'r2',
    name: '智能修图助手',
    description: '自动识别照片问题并提供智能修复建议，简化后期流程',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=smart%20photo%20editing%20assistant%20interface&sign=b84f99b6914c313fa707037053558c76',
    category: 'AI工具',
    rating: 4.8,
    users: 987,
  },
  {
    id: 'r3',
    name: '照片拼接工具',
    description: '将多张照片拼接成全景图或接片，支持自动对齐和色调匹配',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20stitching%20tool%20interface%20panorama&sign=f7e67a8de86c9cb816820d67f4fd53a0',
    category: '图像合成',
    rating: 4.7,
    users: 876,
  },
  {
    id: 'r4',
    name: 'HDR 合成工具',
    description: '将多张不同曝光的照片合成为HDR图像，保留更多细节',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=hdr%20image%20merge%20tool%20interface%20photography&sign=941b75b668557d29e52aefb0289a6d9a',
    category: '图像合成',
    rating: 4.6,
    users: 765,
  },
];

// 分类列表
const categories = ['全部', '预设工具', '图像编辑', '格式转换', '批量处理', 'AI工具', '图像合成'];

const TutorialResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'online' | 'presets'>('online');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('usage');

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
    let tools = [...mockAddedTools];
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      tools = tools.filter(tool => 
        selectedTags.some(tag => tool.category === tag)
      );
    }
    
    // 排序
    if (sortBy === 'usage') {
      tools.sort((a, b) => b.usageCount - a.usageCount);
    } else if (sortBy === 'rating') {
      tools.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      tools.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return tools;
  };

  // 过滤推荐工具
  const getFilteredRecommendedTools = () => {
    let tools = [...mockRecommendedTools];
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      tools = tools.filter(tool => 
        selectedTags.some(tag => tool.category === tag)
      );
    }
    
    return tools;
  };

  const filteredAddedTools = getFilteredAddedTools();
  const filteredRecommendedTools = getFilteredRecommendedTools();

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的后期工具</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            管理和使用您的在线后期工具，提升照片编辑效率
          </p>
        </div>

        {/* 顶部选项卡 */}
        <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'online'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
              }`}
            >
              在线工具
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
              }`}
            >
              个人预设
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索工具或功能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {activeTab === 'online' && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
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
            <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
            <div className="flex flex-wrap gap-2">
              {categories.filter(cat => cat !== '全部').map((category) => (
                <button
                  key={category}
                  onClick={() => toggleTag(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(category)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
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
                className="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
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
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
                <i className="fa-solid fa-toolbox mr-2 text-[#4A5F8B]"></i>
                已添加工具
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAddedTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                    className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                  >
                    {/* 工具缩略图 */}
                    <div className="relative">
                      <img
                        src={tool.thumbnail}
                        alt={tool.name}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* 工具信息 */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-[#F5F7FA] mb-1">{tool.name}</h3>
                      <p className="text-xs text-[#B8C6D8] mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs text-[#B8C6D8]">
                          <span className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-[#4A5F8B]"></i>
                            {tool.rating}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-clock mr-1 text-[#4A5F8B]"></i>
                            {tool.usageCount}次使用
                          </span>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <button className="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                        <i className="fa-solid fa-external-link-alt mr-1"></i> 打开工具
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredAddedTools.length === 0 && (
                <div className="p-6 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                  <div className="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3">
                    <i className="fa-solid fa-toolbox text-xl"></i>
                  </div>
                  <p className="text-[#B8C6D8]">暂无符合条件的已添加工具</p>
                </div>
              )}
            </div>

            {/* 推荐工具列表 */}
            <div>
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
                <i className="fa-solid fa-thumbs-up mr-2 text-[#4A5F8B]"></i>
                推荐工具
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRecommendedTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                    className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                  >
                    {/* 工具缩略图 */}
                    <div className="relative">
                      <img
                        src={tool.thumbnail}
                        alt={tool.name}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* 工具信息 */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-[#F5F7FA] mb-1">{tool.name}</h3>
                      <p className="text-xs text-[#B8C6D8] mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs text-[#B8C6D8]">
                          <span className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-[#4A5F8B]"></i>
                            {tool.rating}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-user mr-1 text-[#4A5F8B]"></i>
                            {tool.users}人使用
                          </span>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <button className="w-full py-2 text-center bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm">
                        <i className="fa-solid fa-plus mr-1"></i> 添加工具
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredRecommendedTools.length === 0 && (
                <div className="p-6 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                  <div className="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3">
                    <i className="fa-solid fa-thumbs-up text-xl"></i>
                  </div>
                  <p className="text-[#B8C6D8]">暂无符合条件的推荐工具</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'presets' && (
          <div className="bg-[#2D3748] rounded-xl p-10 text-center border border-[#4A5F8B]">
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-palette text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">个人预设</h3>
            <p className="text-[#B8C6D8] mb-6 max-w-md mx-auto">
              您的个人预设功能正在开发中，敬请期待
            </p>
            <button className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center">
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