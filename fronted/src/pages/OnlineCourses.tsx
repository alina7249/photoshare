// OnlineCourses.tsx - 卡片hover效果详细描述：
// 1. 课程卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 课程分类选项：当鼠标悬停时，文字颜色变为浅白色(#F5F7FA)
// 3. 内容类型切换按钮：当鼠标悬停时，按钮背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)
// 4. 标签按钮：当鼠标悬停时，标签的颜色会发生变化，提供视觉反馈
// 5. 查看课程按钮：当鼠标悬停时，按钮的渐变背景会产生变化，增强交互体验

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// 模拟课程数据
const mockCourses = [
  {
    id: 'c1',
    title: '摄影入门：曝光三要素详解',
    type: '免费',
    category: '基础知识',
    level: '入门',
    instructor: {
      id: 'i1',
      name: '摄影导师李明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20male%20professional&sign=3463768fb946a95d70afa8eb5967ad9c',
      title: '资深摄影师',
      students: 12543,
      courses: 28,
      rating: 4.9
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20basics%20exposure%20triangle%20tutorial&sign=e033925b5e39db550134d845baeaa825',
    duration: '1小时30分钟',
    lessons: 8,
    students: 12543,
    rating: 4.9,
    reviews: 2345,
    description: '本课程适合摄影初学者，详细讲解摄影的核心概念——曝光三要素（光圈、快门、ISO），让你掌握正确曝光的技巧，拍出专业水准的照片。',
    tags: ['曝光', '基础', '入门', '光圈', '快门', 'ISO'],
    price: 0
  },
  {
    id: 'c2',
    title: '风光摄影进阶：光影与构图',
    type: '付费',
    category: '风光摄影',
    level: '进阶',
    instructor: {
      id: 'i2',
      name: '风光摄影师王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67',
      title: '国家地理摄影师',
      students: 9876,
      courses: 16,
      rating: 4.8
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20photography%20composition%20light%20shadow%20advanced&sign=d8a2f766bd981adac3262311d398d1ef',
    duration: '2小时15分钟',
    lessons: 12,
    students: 9876,
    rating: 4.8,
    reviews: 1876,
    description: '深入学习风光摄影的高级技巧，掌握光影运用、构图法则、时机选择等关键技能，让你的风光作品更具艺术性和感染力。',
    tags: ['风光', '进阶', '构图', '光影', '自然'],
    price: 199
  },
  {
    id: 'c3',
    title: '人像摄影：自然光与室内布光',
    type: '付费',
    category: '人像摄影',
    level: '中级',
    instructor: {
      id: 'i3',
      name: '人像摄影师张婷',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20creative&sign=cd5ab328d0f9f41949035a23e571e1bd',
      title: '商业人像摄影师',
      students: 8765,
      courses: 22,
      rating: 4.9
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20photography%20natural%20light%20studio%20lighting&sign=18209112c8302f932e757d4e8c31b44d',
    duration: '2小时45分钟',
    lessons: 14,
    students: 8765,
    rating: 4.9,
    reviews: 1654,
    description: '学习如何在不同光线条件下拍摄出色的人像作品，掌握自然光运用和室内布光技巧，提升人像摄影的专业水准。',
    tags: ['人像', '中级', '布光', '自然光', '室内'],
    price: 249
  },
  {
    id: 'c4',
    title: 'Lightroom后期修图完全指南',
    type: '付费',
    category: '后期处理',
    level: '中级',
    instructor: {
      id: 'i4',
      name: '后期修图师刘芳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20female%20professional&sign=5ac7b833738b4d4851440943047a2269',
      title: 'Adobe认证讲师',
      students: 15678,
      courses: 32,
      rating: 4.9
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=lightroom%20photo%20editing%20workflow%20complete%20guide&sign=2489a81ae43b953f53d61d782fe1d37e',
    duration: '3小时30分钟',
    lessons: 18,
    students: 15678,
    rating: 4.9,
    reviews: 3245,
    description: '从基础操作到高级技巧，全面掌握Lightroom的修图工作流，学习调色、曝光调整、细节优化等专业后期处理技能。',
    tags: ['后期', 'Lightroom', '修图', '调色', '中级'],
    price: 299
  },
  {
    id: 'c5',
    title: '街头摄影：捕捉城市瞬间',
    type: '付费',
    category: '街头摄影',
    level: '中级',
    instructor: {
      id: 'i5',
      name: '街头摄影师陈明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban&sign=c49a759749c39b9f82ea2702f7f9adc6',
      title: '国际街头摄影奖得主',
      students: 7654,
      courses: 14,
      rating: 4.8
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=street%20photography%20capture%20urban%20moments%20tutorial&sign=a7b739310d7bda180284a12ef286f54f',
    duration: '2小时',
    lessons: 10,
    students: 7654,
    rating: 4.8,
    reviews: 1234,
    description: '学习街头摄影的构图技巧、时机把握、器材选择，以及如何克服拍摄陌生人的心理障碍，捕捉城市中的精彩瞬间。',
    tags: ['街头', '中级', '瞬间', '人文', '城市'],
    price: 189
  },
  {
    id: 'c6',
    title: '摄影创作思维提升',
    type: '付费',
    category: '创作思维',
    level: '高级',
    instructor: {
      id: 'i6',
      name: '艺术摄影师赵琳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20female%20creative&sign=6ab0fc66e2f8846484c0cd7cb1f2f95b',
      title: '摄影艺术教授',
      students: 6543,
      courses: 18,
      rating: 4.9
    },
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20creative%20thinking%20composition%20artistic&sign=88bdb7c23e78f66f50db5eef22c487ae',
    duration: '3小时',
    lessons: 15,
    students: 6543,
    rating: 4.9,
    reviews: 987,
    description: '突破创作瓶颈，提升摄影思维能力，学习如何发现独特视角，表达个人风格，创作出有深度和感染力的摄影作品。',
    tags: ['创作思维', '高级', '艺术', '风格', '表达'],
    price: 349
  },
];

// 模拟文字教程数据
const mockTextTutorials = [
  {
    id: 't1',
    title: '入门指南：摄影基础知识详解',
    description: '本教程适合摄影初学者，详细讲解摄影的基本概念、曝光三要素、构图技巧等基础知识。',
    author: {
      id: 't1',
      name: '摄影导师A',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20avatar%20male&sign=b23459644f685f38e900003dfc85a443',
    },
    category: '基础知识',
    level: '入门',
    duration: '30分钟',
    views: 12543,
    likes: 2543,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20basics%20tutorial%20camera%20settings&sign=5240d0109bb84f17e932bc9a6c120149',
    tags: ['曝光', '构图', '光圈', '快门', 'ISO'],
  },
  {
    id: 't2',
    title: '人像摄影：如何捕捉自然表情',
    description: '学习如何与模特沟通，引导自然表情，以及如何利用光线和环境拍出令人惊艳的人像作品。',
    author: {
      id: 't2',
      name: '人像大师B',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20avatar%20female&sign=f6c999d3d63c14af71aea3f5040e4c1e',
    },
    category: '人像摄影',
    level: '中级',
    duration: '45分钟',
    views: 8765,
    likes: 1892,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20photography%20tutorial%20model%20posing&sign=ed3198e582d93aa9bb684cfebc5a109e',
    tags: ['人像', '表情', '引导', '光线', '构图'],
  },
  {
    id: 't3',
    title: '后期修图：Lightroom基础工作流',
    description: '从导入到导出，完整讲解Lightroom的基础工作流程，包括组织照片、调整曝光、色彩校正等技巧。',
    author: {
      id: 't3',
      name: '后期专家C',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20avatar%20male&sign=7486bb00777acac959518af903d752a8',
    },
    category: '后期处理',
    level: '入门',
    duration: '60分钟',
    views: 15678,
    likes: 3245,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20editing%20tutorial%20lightroom%20workflow&sign=b916c7f932a3d1b98ebd046cd208086f',
    tags: ['Lightroom', '后期', '工作流', '修图', '调色'],
  },
];

// 课程分类 - 合并课程和文字教程的分类
const courseCategories = [
  { id: 'all', name: '全部', count: mockCourses.length + mockTextTutorials.length },
  { id: '基础知识', name: '基础知识', count: mockCourses.filter(c => c.category === '基础知识').length + mockTextTutorials.filter(t => t.category === '基础知识').length },
  { id: '风光摄影', name: '风光摄影', count: mockCourses.filter(c => c.category === '风光摄影').length },
  { id: '人像摄影', name: '人像摄影', count: mockCourses.filter(c => c.category === '人像摄影').length + mockTextTutorials.filter(t => t.category === '人像摄影').length },
  { id: '后期处理', name: '后期处理', count: mockCourses.filter(c => c.category === '后期处理').length + mockTextTutorials.filter(t => t.category === '后期处理').length },
  { id: '街头摄影', name: '街头摄影', count: mockCourses.filter(c => c.category === '街头摄影').length },
  { id: '创作思维', name: '创作思维', count: mockCourses.filter(c => c.category === '创作思维').length },
];

// 课程类型
const courseTypes = ['全部', '免费', '付费', '直播课', '文字教程'];

// 难度级别
const difficultyLevels = ['全部', '入门', '中级', '进阶', '高级'];

// 热门标签
const popularTags = [
  { id: '1', name: '曝光', count: 1245 },
  { id: '2', name: '构图', count: 987 },
  { id: '3', name: 'Lightroom', count: 876 },
  { id: '4', name: '后期', count: 765 },
  { id: '5', name: '人像', count: 654 },
  { id: '6', name: '风光', count: 543 },
  { id: '7', name: '街头', count: 432 },
  { id: '8', name: '创意', count: 321 },
];

const OnlineCourses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, newest, popular, price-asc, price-desc
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'textTutorials'>('courses');

  // 过滤课程
  const getFilteredCourses = () => {
    let courses = [...mockCourses];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      courses = courses.filter(course => course.category === activeCategory);
    }
    
    // 按类型过滤
    if (selectedType !== '全部') {
      courses = courses.filter(course => course.type === selectedType);
    }
    
    // 按难度级别过滤
    if (selectedLevel !== '全部') {
      courses = courses.filter(course => course.level === selectedLevel);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.instructor.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      courses = courses.filter(course => 
        selectedTags.every(tag => course.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'newest') {
      courses.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'popular') {
      courses.sort((a, b) => b.students - a.students);
    } else if (sortBy === 'price-asc') {
      courses.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      courses.sort((a, b) => b.price - a.price);
    }
    
    return courses;
  };

  // 过滤文字教程
  const getFilteredTextTutorials = () => {
    let tutorials = [...mockTextTutorials];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      tutorials = tutorials.filter(tutorial => tutorial.category === activeCategory);
    }
    
    // 按类型过滤
    if (selectedType === '文字教程') {
      tutorials = tutorials;
    } else if (selectedType !== '全部') {
      // 如果选择了其他类型，则不显示文字教程
      tutorials = [];
    }
    
    // 按难度级别过滤
    if (selectedLevel !== '全部') {
      tutorials = tutorials.filter(tutorial => tutorial.level === selectedLevel);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tutorials = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(term) || 
        tutorial.description.toLowerCase().includes(term) ||
        tutorial.author.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      tutorials = tutorials.filter(tutorial => 
        selectedTags.every(tag => tutorial.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'newest') {
      tutorials.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'popular') {
      tutorials.sort((a, b) => b.views - a.views);
    }
    
    return tutorials;
  };

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredCourses = getFilteredCourses();
  const filteredTextTutorials = getFilteredTextTutorials();

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}<div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">线上课程</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            学习专业摄影技巧，提升创作水平，从基础到精通的全面摄影课程和文字教程
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 搜索和排序 */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索课程、讲师或关键词..."
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
                <option value="recommended">推荐排序</option>
                <option value="newest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
              </select>
            </div>

            {/* 课程分类选项卡 */}
            <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
              <div className="overflow-x-auto">
                <div className="flex min-w-max">
                  {courseCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-6 py-4 whitespace-nowrap font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容类型切换 */}
            <div className="bg-[#2D3748] rounded-xl p-2 shadow-sm border border-[#4A5F8B]">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    activeTab === 'courses'
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                  }`}
                >
                  视频课程
                </button>
                <button
                  onClick={() => setActiveTab('textTutorials')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    activeTab === 'textTutorials'
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                  }`}
                >
                  文字教程
                </button>
              </div>
            </div>

            {/* 课程/教程列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'courses' ? (
                // 视频课程列表
                filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                    className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                  >
                    {/* 课程封面图 */}
                    <div className="relative">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">
                        {course.type}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#1E2532]/80 text-[#B8C6D8] rounded-full text-xs backdrop-blur-sm">
                        {course.duration}
                      </div>
                    </div>
                    
                    {/* 课程信息 */}
                    <div className="p-5">
                      {/* 分类和级别 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#4A5F8B] font-medium">{course.category}</span>
                        <span className="text-xs px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full">{course.level}</span>
                      </div>
                      
                      {/* 课程标题 */}
                      <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#4A5F8B] transition-colors">
                        {course.title}
                      </h3>
                      
                      {/* 课程描述 */}
                      <p className="text-sm text-[#B8C6D8] mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      {/* 讲师信息 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-[#4A5F8B]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#F5F7FA]">{course.instructor.name}</p>
                          <p className="text-xs text-[#B8C6D8]">{course.instructor.title}</p>
                        </div>
                      </div>
                      
                      {/* 课程统计 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-[#B8C6D8]">
                          <div className="flex items-center">
                            <i className="fa-solid fa-user mr-1"></i>
                            <span>{course.students.toLocaleString()} 学员</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-[#4A5F8B]"></i>
                            <span>{course.rating} ({course.reviews.toLocaleString()} 评价)</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-[#4A5F8B]">
                          {course.price === 0 ? '免费' : `¥${course.price}`}
                        </div>
                      </div>
                      
                      {/* 课程标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.slice(0, 4).map((tag, index) => (
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
                      
                       {/* 操作按钮 - 查看课程 */}
                      <Link
                        to={`/course/${course.id}`}
                        className="block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]"
                      >
                        {course.type === '免费' ? '立即学习' : '开始学习'}
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                // 文字教程列表
                filteredTextTutorials.map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                    className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                  >
                    {/* 教程图片 */}
                    <div className="relative">
                      <img
                        src={tutorial.image}
                        alt={tutorial.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">
                        文字教程
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#1E2532]/80 text-[#B8C6D8] rounded-full text-xs backdrop-blur-sm">
                        {tutorial.duration}
                      </div>
                    </div>
                    
                    {/* 教程信息 */}
                    <div className="p-5">
                      {/* 分类和级别 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#4A5F8B] font-medium">{tutorial.category}</span>
                        <span className="text-xs px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full">{tutorial.level}</span>
                      </div>
                      
                      {/* 教程标题 */}
                      <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#4A5F8B] transition-colors">
                        {tutorial.title}
                      </h3>
                      
                      {/* 教程描述 */}
                      <p className="text-sm text-[#B8C6D8] mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      
                      {/* 作者信息 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={tutorial.author.avatar}
                          alt={tutorial.author.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-[#4A5F8B]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#F5F7FA]">{tutorial.author.name}</p>
                        </div></div>
                      
                      {/* 教程统计 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-[#B8C6D8]">
                          <div className="flex items-center">
                            <i className="fa-solid fa-eye mr-1"></i>
                            <span>{tutorial.views.toLocaleString()} 阅读</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>
                            <span>{tutorial.likes.toLocaleString()} 喜欢</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 教程标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutorial.tags.slice(0, 4).map((tag, index) => (
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
                      
                       {/* 操作按钮 - 阅读教程 */}
                      <Link
                        to={`/tutorial/${tutorial.id}`}
                        className="block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B] hover:from-[#6B7C93] hover:to-[#4A5F8B]"
                      >
                        阅读教程
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
              
              {((activeTab === 'courses' && filteredCourses.length === 0) || 
                (activeTab === 'textTutorials' && filteredTextTutorials.length === 0)) && (
                <div className="col-span-full p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                  <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                    <i className="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关{activeTab === 'courses' ? '课程' : '教程'}</h3>
                  <p className="text-[#B8C6D8]">
                    请尝试使用不同的关键词或筛选条件
                  </p>
                </div>
              )}
            </div>
            
            {/* 分页 */}
            {((activeTab === 'courses' && filteredCourses.length > 0) || 
              (activeTab === 'textTutorials' && filteredTextTutorials.length > 0)) && (
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
            {/* 课程筛选 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">筛选条件</h3>
              
              {/* 课程类型 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#B8C6D8] mb-3">课程类型</h4>
                <div className="space-y-2">
                  {courseTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="course-type"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="ml-2 text-sm text-[#B8C6D8]"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 难度级别 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#B8C6D8] mb-3">难度级别</h4>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="radio"
                        id={`level-${level}`}
                        name="difficulty-level"
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                        className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                      />
                      <label
                        htmlFor={`level-${level}`}
                        className="ml-2 text-sm text-[#B8C6D8]"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 价格范围 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#B8C6D8] mb-3">价格范围</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    className="w-full h-2 bg-[#1E2532] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-xs text-[#B8C6D8]">
                    <span>¥0</span>
                    <span>¥500</span>
                  </div>
                </div>
              </div>
              
              {/* 应用筛选按钮 */}
              <button className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors border border-[#4A5F8B]">
                应用筛选
              </button>
            </div>
            
            {/* 热门标签 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]'
                        : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
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
                  className="mt-4 w-full py-2 text-center text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
            
            {/* 推荐讲师 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">推荐讲师</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 'i4',
                    name: '后期修图师刘芳',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20female%20professional&sign=5ac7b833738b4d4851440943047a2269',
                    title: 'Adobe认证讲师',
                    students: 15678,
                    courses: 32,
                    rating: 4.9
                  },
                  {
                    id: 'i1',
                    name: '摄影导师李明',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20male%20professional&sign=3463768fb946a95d70afa8eb5967ad9c',
                    title: '资深摄影师',
                    students: 12543,
                    courses: 28,
                    rating: 4.9
                  },
                  {
                    id: 'i3',
                    name: '人像摄影师张婷',
                    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20creative&sign=cd5ab328d0f9f41949035a23e571e1bd',
                    title: '商业人像摄影师',
                    students: 8765,
                    courses: 22,
                    rating: 4.9
                  }
                ].map((instructor) => (
                  <div key={instructor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={instructor.avatar}
                        alt={instructor.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#4A5F8B]"
                      />
                      <div>
                        <p className="font-medium text-[#F5F7FA]">{instructor.name}</p>
                        <p className="text-xs text-[#4A5F8B]">{instructor.courses} 门课程</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#3A4B6F] rounded-full transition-colors">
                      查看
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 会员专区 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-[#F5F7FA]">
              <h3 className="text-lg font-bold mb-3">会员专享</h3>
              <p className="text-sm mb-4 text-[#F5F7FA]">
                开通会员，畅享全部课程，获取专属学习资料和一对一指导
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  <span>无限观看所有课程</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  <span>下载课程配套素材</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  <span>参与会员专属直播</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  <span>获取专属学习路径</span>
                </div>
              </div>
              <button className="w-full py-2 bg-[#F5F7FA] text-[#4A5F8B] font-medium rounded-lg hover:bg-[#B8C6D8] transition-colors">
                立即开通
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnlineCourses;