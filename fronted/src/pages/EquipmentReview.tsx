import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { mockCameras, mockLenses } from '../lib/equipmentData';

// 模拟测评数据
const mockReviews = [
  {
    id: 'r1',
    title: `${mockCameras[0].name}深度测评：高像素摄影的新标杆`,
    type: '专业编辑测评',
    author: {
      id: '101',
      name: '器材专家张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20expert%20male%20professional&sign=56fa5f34db1fbce04f76c7576c6ad020',
      role: '资深器材编辑',
      experience: '10年摄影器材评测经验'
    },
    equipment: {
      id: '1',
      name: mockCameras[0].name,
      type: '微单相机',
      image: mockCameras[0].image
    },
    date: '2023-10-25',
    readTime: '15分钟',
    views: 12543,
    likes: 2890,
    comments: 345,
    rating: 9.4,
    credibilityRating: 9.6, // 测评可信度评分
    featuredImage: mockCameras[0].image,
    videoUrl: 'https://example.com/video1.mp4', // 视频URL
    tags: ['索尼', '全画幅', '高像素', '专业', '微单'],
    excerpt: `${mockCameras[0].name}作为一款高像素全画幅微单相机，带来了诸多技术革新。本文将从画质、对焦、视频、操控等多个维度进行深度测评，帮助您了解这款相机是否值得入手。`,
    pros: mockCameras[0].pros,
    cons: mockCameras[0].cons,
    performance: {
      imageQuality: 9.8,
      autofocus: 9.9,
      video: 9.5,
      handling: 9.0,
      battery: 9.2,
      value: 8.7
    },
    tips: [
      '使用A模式配合曝光补偿可以获得更精准的曝光',
      '高像素模式下建议使用三脚架以获得最佳画质',
      '自定义按钮可以提高操作效率',
      '使用原厂电池以获得最佳续航表现'
    ],
    faq: [
      {
        question: '这款相机适合入门用户吗？',
        answer: '这款相机功能强大但操作相对复杂，适合有一定摄影基础的用户。'
      },
      {
        question: '电池续航能力如何？',
        answer: '满电状态下可拍摄约500张照片，建议长时间拍摄时携带备用电池。'
      },
      {
        question: '是否支持无线传输？',
        answer: '支持Wi-Fi和蓝牙传输，可以方便地将照片传输到手机或电脑。'
      }
    ]
  },
  {
    id: 'r2',
    title: `${mockCameras[1].name}用户实测：婚礼摄影的可靠选择`,
    type: '用户实测分享',
    author: {
      id: '102',
      name: '婚礼摄影师李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20photographer%20male%20creative&sign=82c2687369cb5518e618423326b5a47c',
      role: '职业婚礼摄影师',
      experience: '8年婚礼拍摄经验'
    },
    equipment: {
      id: '2',
      name: mockCameras[1].name,
      type: '微单相机',
      image: mockCameras[1].image
    },
    date: '2023-10-20',
    readTime: '10分钟',
    views: 8765,
    likes: 1987,
    comments: 234,
    rating: 9.2,
    credibilityRating: 9.4, // 测评可信度评分
    featuredImage: mockCameras[1].image,
    videoUrl: 'https://example.com/video2.mp4', // 视频URL
    tags: ['佳能', '婚礼摄影', '高速连拍', '微单', '弱光性能'],
    excerpt: `作为一名职业婚礼摄影师，我在过去的三个月里使用${mockCameras[1].name}拍摄了20多场婚礼。本文将分享我的实际使用体验，包括对焦性能、高感表现、电池续航等关键指标。`,
    pros: mockCameras[1].pros,
    cons: mockCameras[1].cons,
    performance: {
      imageQuality: 9.3,
      autofocus: 9.8,
      video: 9.2,
      handling: 9.5,
      battery: 9.0,
      value: 9.0
    },
    tips: [
      '在弱光环境下使用高ISO拍摄时，推荐开启降噪功能',
      '婚礼拍摄时建议使用双存储卡模式以防数据丢失',
      '自定义快捷键可以快速切换不同的拍摄模式',
      '使用原厂电池充电器可以延长电池寿命'
    ],
    faq: [
      {
        question: '这款相机的弱光表现如何？',
        answer: '在ISO 6400以下表现优异，噪点控制良好，适合婚礼等弱光环境。'
      },
      {
        question: '连续拍摄时的缓冲深度如何？',
        answer: '使用高速SD卡时可以连续拍摄约30张RAW格式照片。'
      },
      {
        question: '是否支持4K视频拍摄？',
        answer: '支持4K 60fps视频拍摄，视频质量优秀。'
      }
    ]
  },
  {
    id: 'r3',
    title: `${mockCameras[3].name}开箱体验：复古外观与现代性能的完美结合`,
    type: '用户实测分享',
    author: {
      id: '103',
      name: '街头摄影师王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban&sign=c49a759749c39b9f82ea2702f7f9adc6',
      role: '街拍摄影师',
      experience: '5年街头摄影经验'
    },
    equipment: {
      id: '3',
      name: mockCameras[3].name,
      type: '微单相机',
      image: mockCameras[3].image
    },
    date: '2023-10-15',
    readTime: '8分钟',
    views: 7654,
    likes: 1765,
    comments: 189,
    rating: 9.0,
    credibilityRating: 9.3, // 测评可信度评分
    featuredImage: mockCameras[3].image,
    videoUrl: 'https://example.com/video3.mp4', // 视频URL
    tags: ['富士', '复古', '街拍', 'APS-C', '高像素'],
    excerpt: `${mockCameras[3].name}以其复古的外观设计和强大的性能吸引了众多摄影爱好者。本文将从开箱体验开始，详细介绍这款相机的外观、功能和实际拍摄表现。`,
    pros: mockCameras[3].pros,
    cons: mockCameras[3].cons,
    performance: {
      imageQuality: 9.5,
      autofocus: 9.0,
      video: 8.5,
      handling: 9.6,
      battery: 8.8,
      value: 8.9
    },
    tips: [
      '使用胶片模拟模式可以获得独特的色彩风格',
      '街拍时建议使用静音拍摄模式',
      '自定义ISO转盘可以快速调整感光度',
      '配合XF系列定焦镜头可以获得最佳成像质量'
    ],
    faq: [
      {
        question: '这款相机的操作复杂度如何？',
        answer: '虽然有复古外观，但操作直观，适合喜欢传统操作方式的用户。'
      },
      {
        question: '电池续航能力如何？',
        answer: '满电状态下可拍摄约300张照片，外出拍摄建议携带备用电池。'
      },
      {
        question: '是否支持镜头防抖？',
        answer: '支持机身防抖，配合防抖镜头可以获得更稳定的画面。'
      }
    ]
  },
  {
    id: 'r4',
    title: `${mockLenses[0].name}镜头深度测评`,
    type: '专业编辑测评',
    author: {
      id: '104',
      name: '镜头专家刘芳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20lens%20expert%20female%20professional&sign=c9dd2373388218683b3e980d22233258',
      role: '资深镜头评测师',
      experience: '12年摄影镜头评测经验'
    },
    equipment: {
      id: 'l1',
      name: mockLenses[0].name,
      type: '变焦镜头',
      image: mockLenses[0].image
    },
    date: '2023-10-10',
    readTime: '12分钟',
    views: 9876,
    likes: 2345,
    comments: 278,
    rating: 9.6,
    credibilityRating: 9.7, // 测评可信度评分
    featuredImage: mockLenses[0].image,
    videoUrl: 'https://example.com/video4.mp4', // 视频URL
    tags: ['索尼', '大三元', '标准变焦', '专业', '镜头'],
    excerpt: `作为索尼新一代大三元标准变焦镜头，${mockLenses[0].name}带来了哪些提升？本文通过实验室测试和实际拍摄，全面解析这款镜头的光学性能。`,
    pros: mockLenses[0].pros,
    cons: mockLenses[0].cons,
    performance: {
      sharpness: 9.8,
      bokeh: 9.2,
      autofocus: 9.7,
      buildQuality: 9.5,
      handling: 9.0,
      value: 8.5
    },
    tips: [
      '使用遮光罩可以有效减少眩光和鬼影',
      '拍摄人像时推荐使用f/2.8光圈以获得最佳虚化效果',
      '定期清洁镜头前组镜片以保持最佳成像质量',
      '存储时建议使用镜头盖保护镜片'
    ],
    faq: [
      {
        question: '这款镜头的锐度表现如何？',
        answer: '在全焦段和全光圈下都有优异的锐度表现，特别是中心区域。'
      },
      {
        question: '对焦速度和安静度如何？',
        answer: '采用最新的线性马达，对焦迅速且安静，适合拍摄动态场景。'
      },
      {
        question: '重量和体积如何？适合旅行携带吗？',
        answer: '相比上一代有所减重，但作为专业镜头体积仍然较大，旅行携带需要考虑。'
      }
    ]
  }
];

// 测评分类
const reviewCategories = [
  { id: 'all', name: '全部', count: mockReviews.length },
  { id: 'professional', name: '专业编辑测评', count: mockReviews.filter(r => r.type === '专业编辑测评').length },
  { id: 'user', name: '用户实测分享', count: mockReviews.filter(r => r.type === '用户实测分享').length },
];

// 器材类型标签
const equipmentTypeTags = ['相机', '镜头', '配件', '无人机', '三脚架', '滤镜', '闪光灯'];

// 价格区间标签
const priceRangeTags = ['入门级 (0-5000元)', '进阶级 (5000-15000元)', '专业级 (15000元以上)'];

// 使用场景标签
const usageScenarioTags = ['风光', '人像', '街头', '婚礼', '商业', '视频', '旅行'];

// 模拟对比测评数据
const comparisonReviewData = [
  { 
    category: '分辨率', 
    'A7R V': 9.8, 
    'EOS R5': 9.7, 
    'Z 7II': 9.6 
  },
  { 
    category: '低光性能', 
    'A7R V': 9.5, 
    'EOS R5': 9.3, 
    'Z 7II': 9.4 
  },
  { 
    category: '自动对焦', 
    'A7R V': 9.9, 
    'EOS R5': 9.8, 
    'Z 7II': 9.5 
  },
  { 
    category: '视频能力', 
    'A7R V': 9.5, 
    'EOS R5': 9.7, 
    'Z 7II': 9.2 
  },
  { 
    category: '电池续航', 
    'A7R V': 9.2, 
    'EOS R5': 8.8, 
    'Z 7II': 9.0 
  },
  { 
    category: '性价比', 
    'A7R V': 8.7, 
    'EOS R5': 8.5, 
    'Z 7II': 8.8 
  }
];

// 雷达图颜色
const RADAR_COLORS = ['#4A5F8B', '#8884d8', '#B8C6D8'];

const EquipmentReview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, rating
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]); // 用于对比测评
  const [showComparison, setShowComparison] = useState(false); // 是否显示对比测评

  // 过滤测评
  const getFilteredReviews = () => {
    let reviews = [...mockReviews];
    
    // 按分类过滤
    if (activeCategory === 'professional') {
      reviews = reviews.filter(review => review.type === '专业编辑测评');
    } else if (activeCategory === 'user') {
      reviews = reviews.filter(review => review.type === '用户实测分享');
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      reviews = reviews.filter(review => 
        review.title.toLowerCase().includes(term) || 
        review.equipment.name.toLowerCase().includes(term) ||
        review.author.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      reviews = reviews.filter(review => 
        review.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'latest') {
      reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      reviews.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'rating') {
      reviews.sort((a, b) => b.rating - a.rating);
    }
    
    return reviews;
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
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">专业测评</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            深入了解各类摄影器材的真实性能，专业编辑评测与用户实际使用体验分享
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 功能导航卡片 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <i className="fa-solid fa-lightbulb mr-2"></i>功能导航
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-video mr-2 text-[#F5F7FA]"></i>视频测评集成
                  </h4>
                  <p className="text-sm text-white/80">在测评卡片图片上点击播放图标查看相关视频</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-balance-scale mr-2 text-[#F5F7FA]"></i>对比测评功能
                  </h4>
                  <p className="text-sm text-white/80">点击卡片右上角勾选框选择测评，底部会出现对比按钮</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-shield-alt mr-2 text-[#F5F7FA]"></i>可信度评分
                  </h4>
                  <p className="text-sm text-white/80">每个测评卡片底部显示用户对测评真实性的评价</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-lightbulb mr-2 text-[#F5F7FA]"></i>器材使用技巧
                  </h4>
                  <p className="text-sm text-white/80">侧边栏下方"器材使用技巧"区域查看更多技巧</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-question-circle mr-2 text-[#F5F7FA]"></i>常见问题解答
                  </h4>
                  <p className="text-sm text-white/80">侧边栏下方"常见问题解答"区域查看FAQ汇总</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <i className="fa-solid fa-user-tie mr-2 text-[#F5F7FA]"></i>测评作者专栏
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
                  className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最多阅读</option>
                <option value="rating">最高评分</option>
              </select>
            </div>

            {/* 测评分类选项卡 */}
            <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
              <div className="flex">
                {reviewCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                        : 'text-[#B8C6D8] hover:text-[#F5F7FA]'
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
                className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#F5F7FA]">测评对比</h3>
                  <button 
                    onClick={handleCloseComparison}
                    className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                
                {/* 对比雷达图 */}
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={comparisonReviewData}>
                      <PolarGrid stroke="#B8C6D8" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#4A5059', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#4A5059' }} />
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
                  <p className="text-sm text-[#4A5059]">
                    <strong>分辨率对比：</strong> A7R V以9.8分领先，EOS R5和Z 7II紧随其后，三者在高分辨率拍摄方面都有出色表现。
                  </p>
                  <p className="text-sm text-[#4A5059]">
                    <strong>自动对焦对比：</strong> A7R V的自动对焦系统表现最为出色，尤其在复杂光线条件下的追踪能力优秀。
                  </p>
                  <p className="text-sm text-[#4A5059]">
                    <strong>视频能力对比：</strong> EOS R5在视频规格和质量上略占优势，支持8K 30p和4K 120p拍摄。
                  </p>
                  <p className="text-sm text-[#4A5059]">
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
                  whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                  className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
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
                              ? 'bg-[#4A5F8B] text-white'
                              : 'bg-[#2D3748]/80 text-[#B8C6D8]'
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
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B]">
                          {review.type}
                        </span>
                        <div className="text-xs text-[#B8C6D8] flex items-center space-x-2">
                          <span>{review.date}</span>
                          <span>•</span>
                          <span>{review.readTime}</span>
                        </div>
                      </div>
                      
                      {/* 标题和摘要 */}
                      <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#4A5F8B] transition-colors">
                        {review.title}
                      </h3>
                      <p className="text-sm text-[#B8C6D8] mb-4 line-clamp-2">
                        {review.excerpt}
                      </p>
                      
                      {/* 测评的器材 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={review.equipment.image}
                          alt={review.equipment.name}
                          className="w-10 h-10 object-cover rounded border border-[#4A5F8B] mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#F5F7FA]">{review.equipment.name}</p>
                          <p className="text-xs text-[#B8C6D8]">{review.equipment.type}</p>
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
                                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                                : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* 可信度评分 */}
                      <div className="mb-4 flex items-center">
                        <div className="flex items-center">
                          <i className="fa-solid fa-shield-alt text-[#4A5F8B] mr-2"></i>
                          <span className="text-sm text-[#B8C6D8]">可信度评分：</span>
                          <span className="text-sm font-bold text-[#4A5F8B] ml-1">{review.credibilityRating}/10</span>
                        </div>
                      </div>
                      
                      {/* 作者和统计信息 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Link to={`/author/${review.author.id}`} className="flex items-center">
                            <img
                              src={review.author.avatar}
                              alt={review.author.name}
                              className="w-8 h-8 rounded-full mr-2 object-cover border border-[#4A5F8B]"
                            />
                            <div>
                              <p className="text-sm font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">{review.author.name}</p><p className="text-xs text-[#B8C6D8]">{review.author.role}</p>
                            </div>
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-[#B8C6D8]">
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
                  <div className="px-5 py-4 bg-[#1E2532] border-t border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#F5F7FA]">性能评分</h4>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-[#4A5F8B]">{review.rating}</span>
                        <span className="text-sm text-[#B8C6D8] ml-1">/10</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(review.performance || {}).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="text-xs text-[#B8C6D8] mr-1">{translateKey(key)}:</span>
                          <div className="w-16 bg-[#4A5F8B]/30 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[#4A5F8B] rounded-full"
                              style={{ width: `${(value as number) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-[#F5F7FA] ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 底部操作按钮 */}
                  <div className="px-5 py-4 border-t border-[#4A5F8B] bg-[#2D3748] flex items-center justify-between">
                    <Link
                      to={`/review/${review.id}`}
                      className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
                    >
                      阅读全文
                    </Link>
                    <div className="flex items-center space-x-3">
                      <button className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors">
                        <i className="fa-solid fa-bookmark"></i>
                      </button>
                      <button className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors">
                        <i className="fa-solid fa-share-alt"></i>
                      </button>
                      <Link
                        to={`/equipment/${review.equipment.id}`}
                        className="text-sm text-[#4A5F8B] hover:underline transition-colors"
                      >
                        查看器材详情
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                  <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                    <i className="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关测评</h3>
                  <p className="text-[#B8C6D8]">
                    请尝试使用不同的关键词或筛选条件
                  </p>
                </div>
              )}
            </div>
            
            {/* 对比测评按钮 */}
            {selectedReviews.length > 0 && (
              <motion.div 
                className="fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] py-3 px-4 z-10 shadow-lg"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                  <div className="flex items-center">
                    <i className="fa-solid fa-balance-scale text-[#4A5F8B] mr-2"></i>
                    <span className="text-[#4A5059]">已选择 {selectedReviews.length} 篇测评进行对比</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShowComparison}
                    className="px-6 py-2 bg-[#4A5F8B] text-white rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
                  >
                    查看对比
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {/* 分页 */}
            {filteredReviews.length > 0 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-[#E6EBF2] p-2 rounded-lg border border-[#B8C6D8]">
                  <button className="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-[#B8C6D8] bg-[#F5F7FA] text-[#4A5059]">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                    2
                  </button>
                  <span className="px-2 text-[#4A5059]/70">...</span>
                  <button className="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                    5
                  </button>
                  <button className="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 测评标签筛选 */}
            <div className="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
              <h3 className="text-lg font-bold mb-4 text-[#4A5059]">筛选标签</h3>
              
              {/* 器材类型 */}
              <div className="mb-6"><h4 className="text-sm font-medium text-[#4A5059] mb-3">器材类型</h4>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypeTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 价格区间 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#4A5059] mb-3">价格区间</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRangeTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 使用场景 */}
              <div>
                <h4 className="text-sm font-medium text-[#4A5059] mb-3">使用场景</h4>
                <div className="flex flex-wrap gap-2">
                  {usageScenarioTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
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
                  className="mt-4 w-full py-2 text-center text-sm text-[#4A5059] hover:text-[#4A5F8B] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有筛选
                </button>
              )}
            </div>
            
            {/* 热门测评作者 */}
            <div className="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
              <h3 className="text-lg font-bold mb-4 text-[#4A5059]">热门测评作者</h3>
              <div className="space-y-4">
                {[
                  {
                    id: '101',
                    name: '器材专家张明',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20expert%20male%20professional&sign=56fa5f34db1fbce04f76c7576c6ad020',
                    reviews: 48,
                    followers: 12543,
                    rating: 9.4
                  },
                  {
                    id: '104',
                    name: '镜头专家刘芳',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20lens%20expert%20female%20professional&sign=c9dd2373388218683b3e980d22233258',
                    reviews: 36,
                    followers: 9876,
                    rating: 9.5
                  },
                  {
                    id: '102',
                    name: '婚礼摄影师李华',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20photographer%20male%20creative&sign=82c2687369cb5518e618423326b5a47c',
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
                        className="w-12 h-12 rounded-full object-cover border border-[#B8C6D8]"
                      />
                      <div>
                        <p className="font-medium text-[#4A5059]">{author.name}</p>
                        <p className="text-xs text-[#4A5F8B]">{author.reviews} 篇测评</p>
                      </div>
                    </Link>
                    <button className="px-3 py-1 text-xs font-medium text-[#4A5059] border border-[#B8C6D8] rounded-full hover:bg-[#E6EBF2] transition-colors">
                      关注
                    </button>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-[#4A5F8B] hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多作者</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 器材使用技巧 */}
            <div className="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
              <h3 className="text-lg font-bold mb-4 text-[#4A5059]">器材使用技巧</h3>
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
                    <p className="text-sm text-[#4A5059] hover:text-[#4A5F8B] transition-colors cursor-pointer">
                      {tip.title}
                    </p>
                    <span className="text-xs text-[#4A5059]/70">{tip.views} 阅读</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-[#4A5F8B] hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多技巧</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 常见问题解答 */}
            <div className="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
              <h3 className="text-lg font-bold mb-4 text-[#4A5059]">常见问题解答</h3>
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
                    className="border-b border-[#E6EBF2] pb-2"
                  >
                    <p className="text-sm text-[#4A5059] hover:text-[#4A5F8B] transition-colors cursor-pointer">
                      {faq.question}
                    </p>
                  </motion.div>
                ))}
              </div>
              <Link
                to="#"
                className="mt-4 inline-block text-sm text-[#4A5F8B] hover:underline transition-colors flex items-center justify-center"
              >
                <span>查看更多FAQ</span>
                <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
              </Link>
            </div>
            
            {/* 测评贡献者招募 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#B8C6D8] rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-3">成为测评作者</h3>
              <p className="text-sm mb-4 text-white/90">
                如果你对摄影器材有深入研究，欢迎加入我们的测评团队，分享你的专业见解
              </p>
              <button className="w-full py-2 bg-white text-[#4A5F8B] font-medium rounded-lg hover:bg-[#E6EBF2] transition-colors">
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