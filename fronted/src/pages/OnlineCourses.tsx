// OnlineCourses.tsx - 卡片hover效果详细描述：
// 1. 课程卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
// 2. 课程分类选项：当鼠标悬停时，文字颜色变为浅白色(#F5F7FA)
// 3. 内容类型切换按钮：当鼠标悬停时，按钮背景变为蓝色(#4A5F8B)，文字变为浅白色(#F5F7FA)
// 4. 标签按钮：当鼠标悬停时，标签的颜色会发生变化，提供视觉反馈
// 5. 查看课程按钮：当鼠标悬停时，按钮的渐变背景会产生变化，增强交互体验

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COURSE_API } from '../constants/api';
import { HOVER_SHADOWS } from '../constants/theme';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiGet } from '../services/api';

const courseCategories: { id: string; name: string; count: number }[] = [];
const courseTypes: string[] = ['全部'];
const difficultyLevels: string[] = ['全部'];
const popularTags: { id: string; name: string; count: number }[] = [];

const OnlineCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, newest, popular, price-asc, price-desc
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'textTutorials'>('courses');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, tutorialsData] = await Promise.all([
          apiGet(COURSE_API.LIST),
          apiGet('/tutorials'),
        ]);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setTutorials(Array.isArray(tutorialsData) ? tutorialsData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 过滤课程
  const getFilteredCourses = () => {
    let result = [...courses];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(course => course.category === activeCategory);
    }
    
    // 按类型过滤
    if (selectedType !== '全部') {
      result = result.filter(course => course.type === selectedType);
    }
    
    // 按难度级别过滤
    if (selectedLevel !== '全部') {
      result = result.filter(course => course.level === selectedLevel);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.instructor.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      result = result.filter(course => 
        selectedTags.every(tag => course.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.students - a.students);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  };

  // 过滤文字教程
  const getFilteredTextTutorials = () => {
    let result = [...tutorials];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(tutorial => tutorial.category === activeCategory);
    }
    
    // 按类型过滤
    if (selectedType === '文字教程') {
      result = result;
    } else if (selectedType !== '全部') {
      // 如果选择了其他类型，则不显示文字教程
      result = [];
    }
    
    // 按难度级别过滤
    if (selectedLevel !== '全部') {
      result = result.filter(tutorial => tutorial.level === selectedLevel);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tutorial => 
        tutorial.title.toLowerCase().includes(term) || 
        tutorial.description.toLowerCase().includes(term) ||
        tutorial.author.name.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      result = result.filter(tutorial => 
        selectedTags.every(tag => tutorial.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    }
    
    return result;
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
    <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}<div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">线上课程</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
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
                  className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                <option value="recommended">推荐排序</option>
                <option value="newest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
              </select>
            </div>

            {/* 课程分类选项卡 */}
            <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
              <div className="overflow-x-auto">
                <div className="flex min-w-max">
                  {courseCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-6 py-4 whitespace-nowrap font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-accent text-text-primary'
                          : 'bg-card text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容类型切换 */}
            <div className="bg-card rounded-xl p-2 shadow-sm border border-accent">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    activeTab === 'courses'
                      ? 'bg-accent text-text-primary'
                      : 'bg-card text-text-muted hover:bg-accent hover:text-text-primary'
                  }`}
                >
                  视频课程
                </button>
                <button
                  onClick={() => setActiveTab('textTutorials')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    activeTab === 'textTutorials'
                      ? 'bg-accent text-text-primary'
                      : 'bg-card text-text-muted hover:bg-accent hover:text-text-primary'
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
                    whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                    className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                  >
                    {/* 课程封面图 */}
                    <div className="relative">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-text-primary rounded-full text-xs font-medium">
                        {course.type}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-deep/80 text-text-muted rounded-full text-xs backdrop-blur-sm">
                        {course.duration}
                      </div>
                    </div>
                    
                    {/* 课程信息 */}
                    <div className="p-5">
                      {/* 分类和级别 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-accent font-medium">{course.category}</span>
                        <span className="text-xs px-2 py-1 bg-deep text-text-muted rounded-full">{course.level}</span>
                      </div>
                      
                      {/* 课程标题 */}
                      <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      
                      {/* 课程描述 */}
                      <p className="text-sm text-text-muted mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      {/* 讲师信息 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-accent"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{course.instructor.name}</p>
                          <p className="text-xs text-text-muted">{course.instructor.title}</p>
                        </div>
                      </div>
                      
                      {/* 课程统计 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-text-muted">
                          <div className="flex items-center">
                            <i className="fa-solid fa-user mr-1"></i>
                            <span>{course.students.toLocaleString()} 学员</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-star mr-1 text-accent"></i>
                            <span>{course.rating} ({course.reviews.toLocaleString()} 评价)</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-accent">
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
                                ? 'bg-accent text-text-primary'
                                : 'bg-deep text-text-muted border border-accent'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                       {/* 操作按钮 - 查看课程 */}
                      <Link
                        to={`/course/${course.id}`}
                        className="block w-full py-2 text-center bg-gradient-to-r from-accent to-card text-text-primary rounded-lg font-medium transition-colors border border-accent"
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
                    whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                    className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                  >
                    {/* 教程图片 */}
                    <div className="relative">
                      <img
                        src={tutorial.image}
                        alt={tutorial.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-text-primary rounded-full text-xs font-medium">
                        文字教程
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-deep/80 text-text-muted rounded-full text-xs backdrop-blur-sm">
                        {tutorial.duration}
                      </div>
                    </div>
                    
                    {/* 教程信息 */}
                    <div className="p-5">
                      {/* 分类和级别 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-accent font-medium">{tutorial.category}</span>
                        <span className="text-xs px-2 py-1 bg-deep text-text-muted rounded-full">{tutorial.level}</span>
                      </div>
                      
                      {/* 教程标题 */}
                      <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-accent transition-colors">
                        {tutorial.title}
                      </h3>
                      
                      {/* 教程描述 */}
                      <p className="text-sm text-text-muted mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      
                      {/* 作者信息 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={tutorial.author.avatar}
                          alt={tutorial.author.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-accent"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{tutorial.author.name}</p>
                        </div></div>
                      
                      {/* 教程统计 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-text-muted">
                          <div className="flex items-center">
                            <i className="fa-solid fa-eye mr-1"></i>
                            <span>{tutorial.views.toLocaleString()} 阅读</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-heart mr-1 text-accent"></i>
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
                                ? 'bg-accent text-text-primary'
                                : 'bg-deep text-text-muted border border-accent'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                       {/* 操作按钮 - 阅读教程 */}
                      <Link
                        to={`/tutorial/${tutorial.id}`}
                        className="block w-full py-2 text-center bg-gradient-to-r from-accent to-card text-text-primary rounded-lg font-medium transition-colors border border-accent hover:from-accent-hover hover:to-accent"
                      >
                        阅读教程
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
              
              {((activeTab === 'courses' && filteredCourses.length === 0) || 
                (activeTab === 'textTutorials' && filteredTextTutorials.length === 0)) && (
                <div className="col-span-full p-8 bg-card rounded-xl border border-accent text-center">
                  <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                    <i className="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关{activeTab === 'courses' ? '课程' : '教程'}</h3>
                  <p className="text-text-muted">
                    请尝试使用不同的关键词或筛选条件
                  </p>
                </div>
              )}
            </div>
            
            {/* 分页 */}
            {((activeTab === 'courses' && filteredCourses.length > 0) || 
              (activeTab === 'textTutorials' && filteredTextTutorials.length > 0)) && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-card p-2 rounded-lg border border-accent">
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-accent bg-accent text-text-primary">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    2
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
            {/* 课程筛选 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">筛选条件</h3>
              
              {/* 课程类型 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-muted mb-3">课程类型</h4>
                <div className="space-y-2">
                  {courseTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="course-type"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        className="h-4 w-4 text-accent focus:ring-accent border-accent bg-deep"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="ml-2 text-sm text-text-muted"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 难度级别 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-muted mb-3">难度级别</h4>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="radio"
                        id={`level-${level}`}
                        name="difficulty-level"
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                        className="h-4 w-4 text-accent focus:ring-accent border-accent bg-deep"
                      />
                      <label
                        htmlFor={`level-${level}`}
                        className="ml-2 text-sm text-text-muted"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 价格范围 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-muted mb-3">价格范围</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-xs text-text-muted">
                    <span>¥0</span>
                    <span>¥500</span>
                  </div>
                </div>
              </div>
              
              {/* 应用筛选按钮 */}
              <button className="w-full py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-dark-hover transition-colors border border-accent">
                应用筛选
              </button>
            </div>
            
            {/* 热门标签 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-accent text-text-primary border border-accent'
                        : 'bg-card text-text-muted border border-accent'
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
                  className="mt-4 w-full py-2 text-center text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
            
            {/* 推荐讲师 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">推荐讲师</h3>
              <div className="space-y-4">
                {[
                ].map((instructor) => (
                  <div key={instructor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={instructor.avatar}
                        alt={instructor.name}
                        className="w-12 h-12 rounded-full object-cover border border-accent"
                      />
                      <div>
                        <p className="font-medium text-text-primary">{instructor.name}</p>
                        <p className="text-xs text-accent">{instructor.courses} 门课程</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium text-text-primary bg-accent hover:bg-dark-hover rounded-full transition-colors">
                      查看
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 会员专区 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm text-text-primary">
              <h3 className="text-lg font-bold mb-3">会员专享</h3>
              <p className="text-sm mb-4 text-text-primary">
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
              <button className="w-full py-2 bg-text-primary text-accent font-medium rounded-lg hover:bg-text-muted transition-colors">
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