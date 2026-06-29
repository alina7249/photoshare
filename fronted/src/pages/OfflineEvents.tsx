import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { apiGet } from '../services/api';
import { EVENT_API } from '../constants/api';
import { HOVER_SHADOWS } from '../constants/theme';
import { ROUTES } from '../router/routes';

const OfflineEvents: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // 检查是否是用户个人活动页面
  const isUserPersonalEvents = window.location.pathname.includes('/profile-center/events');
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiGet(EVENT_API.LIST);
        setAllEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventTypes: string[] = [];
  const eventCategories: string[] = [];
  const popularTags: { id: string; name: string; count: number }[] = [];

  const [selectedType, setSelectedType] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('upcoming'); // upcoming, popular, price-asc, price-desc
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 如果是用户个人活动页面，只显示已报名的活动
  const getFilteredEvents = () => {
    let events = isUserPersonalEvents 
      ? allEvents.filter(event => event.id === 'e1' || event.id === 'e2')
      : [...allEvents];
    
    // 按类型过滤
    if (selectedType !== '全部' && !isUserPersonalEvents) {
      events = events.filter(event => event.type === selectedType);
    }
    
    // 按分类过滤
    if (selectedCategory !== '全部' && !isUserPersonalEvents) {
      events = events.filter(event => event.category === selectedCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm && !isUserPersonalEvents) {
      const term = searchTerm.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0 && !isUserPersonalEvents) {
      events = events.filter(event => 
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }
    
    // 排序
    if (sortBy === 'upcoming') {
      events.sort((a, b) => new Date(a.date.split(' ')[0]).getTime() - new Date(b.date.split(' ')[0]).getTime());
    } else if (sortBy === 'popular') {
      events.sort((a, b) => b.participants - a.participants);
    } else if (sortBy === 'price-asc') {
      events.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      events.sort((a, b) => b.price - a.price);
    }
    
    return events;
  };

  const filteredEvents = getFilteredEvents();

  if (!isAuthenticated && isUserPersonalEvents) {
    return (
          <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
          <p className="text-text-muted mb-6 max-w-md">登录后查看您已报名的摄影活动</p>
          <Link to={ROUTES.LOGIN} className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-dark-hover transition-colors">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isUserPersonalEvents ? '我的活动' : '线下活动'}
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            {isUserPersonalEvents 
              ? '查看您已报名的摄影活动，管理活动行程和查看详情' 
              : '参与摄影采风、沙龙和器材体验活动，结交同好，提升技能，捕捉精彩瞬间'
            }
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 搜索和排序 */}
            {!isUserPersonalEvents && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="搜索活动、地点或主题..."
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
                  <option value="upcoming">即将开始</option>
                  <option value="popular">热门活动</option>
                  <option value="price-asc">价格从低到高</option>
                  <option value="price-desc">价格从高到低</option>
                </select>
              </div>
            )}

            {/* 活动类型和分类选项卡 - 仅在非个人活动页面显示 */}
            {!isUserPersonalEvents && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                  <div className="p-3 border-b border-accent">
                    <h4 className="text-sm font-medium text-text-primary">活动类型</h4>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    {eventTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-accent text-text-primary rounded-lg'
                            : 'bg-card text-text-muted hover:bg-accent/50'
                        }`}
                      >
                        {type}
                    </button>
                  ))}</div>
                </div>
                
                <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                  <div className="p-3 border-b border-accent">
                    <h4 className="text-sm font-medium text-text-primary">活动分类</h4>
                  </div>
                  <div className="grid grid-cols-4 p-2">
                    {eventCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-accent text-text-primary rounded-lg'
                            : 'bg-card text-text-muted hover:bg-accent/50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 活动列表 */}
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                  className="bg-gradient-to-r from-accent to-accent-hover rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
                >
                  {/* 活动图片 */}
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    
                    {/* 活动信息 */}
                    <div className="p-5 md:w-2/3">
                      {/* 活动类型和标签 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-primary font-medium">{event.type}</span>
                        <span className="text-xs px-2 py-1 bg-card/50 text-text-primary rounded-full">{event.category}</span>
                      </div>
                      
                      {/* 活动标题 */}
                      <h3 className="text-lg font-bold text-text-primary mb-2 hover:text-surface-light-hover transition-colors">
                        {event.title}
                      </h3>
                      
                      {/* 活动基本信息 */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-map-marker-alt mr-2 text-text-primary"></i>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-calendar-alt mr-2 text-text-primary"></i>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-primary">
                          <i className="fa-solid fa-clock mr-2 text-text-primary"></i>
                          <span>{event.duration}</span>
                        </div>
                      </div>
                      
                      {/* 导师信息 */}
                      <div className="flex items-center mb-4">
                        <img
                          src={event.instructor.avatar}
                          alt={event.instructor.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-text-muted"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{event.instructor.name}</p>
                          <p className="text-xs text-text-primary/80">{event.instructor.title}</p>
                        </div>
                      </div>
                      
                      {/* 活动描述 */}
                      <p className="text-sm text-text-primary/90 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* 价格和参与人数 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-text-primary">
                          {event.price === 0 ? '免费' : `¥${event.price}`}
                        </div>
                        <div className="text-sm text-text-primary">
                          {event.participants} 人已报名 / 限 {event.maxParticipants} 人
                        </div>
                      </div>
                      
                      {/* 活动标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.slice(0, 5).map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedTags.includes(tag)
                                ? 'bg-text-primary text-accent'
                                : 'bg-card/50 text-text-primary border border-accent/50'
                            } transition-colors`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/event/${event.id}`}
                          className="flex-1 py-2 text-center bg-text-primary text-accent rounded-lg font-medium hover:bg-surface-light-hover transition-colors border border-text-primary"
                        >
                          查看详情
                        </Link>
                        {isUserPersonalEvents ? (
                          <button className="flex-1 py-2 text-center bg-card text-text-primary rounded-lg font-medium hover:bg-accent transition-colors border border-accent">
                            <i className="fa-solid fa-calendar-check mr-1"></i> 已报名
                          </button>
                        ) : (
                          <button className="flex-1 py-2 text-center bg-text-primary text-accent rounded-lg font-medium hover:bg-surface-light-hover transition-colors border border-text-primary">
                            <i className="fa-solid fa-calendar-plus mr-1"></i> 立即报名
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div className="p-8 bg-card rounded-xl border border-accent text-center">
                  <div className="w-16 h-16 bg-dark-alt rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                    <i className="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关活动</h3>
                  <p className="text-text-muted">
                    请尝试使用不同的关键词或筛选条件
                  </p>
                </div>
              )}
            </div>
            
            {/* 分页 */}
            {filteredEvents.length > 0 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-card p-2 rounded-lg border border-accent">
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-accent bg-accent text-text-primary">
                    1
                  </button><button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    3
                  </button>
                  <span className="px-2 text-text-muted">...</span>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    8
                  </button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>

           {/* 侧边栏 - 仅在非个人活动页面显示 */}
           {!isUserPersonalEvents && (
              <div className="lg:col-span-1 space-y-6">
                {/* 热门标签模块 */}
                <div className="bg-accent rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold mb-4 text-text-primary">热门标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag.id}
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
                
                {/* 活动日历模块 */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold mb-4 text-text-primary">活动日历</h3>
                  {/* 简化的日历组件 */}
                  <div className="text-center mb-3">
                    <h4 className="font-medium text-text-primary">2023年10月</h4>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {/* 星期标题 */}
                    {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                      <div key={day} className="py-2 text-text-muted font-medium">
                        {day}
                      </div>
                    ))}
                    {/* 日期 */}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const hasEvent = [15, 22, 28].includes(day);
                      return (
                        <div
                          key={day}
                          className={`py-2 rounded-full transition-colors cursor-pointer ${
                            hasEvent
                              ? 'bg-accent text-text-primary font-medium'
                              : 'text-text-muted hover:bg-accent/20'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <button className="text-accent hover:text-accent-hover transition-colors">上个月</button>
                    <button className="text-accent hover:text-accent-hover transition-colors">下个月</button>
                  </div>
                </div>
                
                {/* 近期活动提醒模块 */}
                <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm border border-accent text-text-primary">
                  <h3 className="text-lg font-bold mb-3">近期活动提醒</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-card/30 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-sm font-medium">新疆喀纳斯秋季风光摄影团</p>
                      <p className="text-xs text-text-primary/90 mt-1">10月15日开始 · 剩余8个名额</p>
                    </div>
                    <div className="bg-card/30 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-sm font-medium">上海城市纪实摄影沙龙</p>
                      <p className="text-xs text-text-primary/90 mt-1">10月28日 · 剩余12个名额</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-text-primary text-accent font-medium rounded-lg hover:bg-surface-light-hover transition-colors">
                    查看全部活动
                  </button>
                </div>
                
                {/* 如何参加活动 */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold mb-4 text-text-primary">如何参加活动</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-primary mr-3 flex-shrink-0">
                        <span>1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">浏览活动</h4>
                        <p className="text-sm text-text-muted">
                          浏览各类摄影活动，根据兴趣和时间选择合适的活动
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-primary mr-3 flex-shrink-0">
                        <span>2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">报名确认</h4>
                        <p className="text-sm text-text-muted">
                          提交报名信息，支付费用（如有），等待确认
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-primary mr-3 flex-shrink-0">
                        <span>3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">接收通知</h4>
                        <p className="text-sm text-text-muted">
                          报名成功后，接收活动详情和注意事项的通知
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-primary mr-3 flex-shrink-0">
                        <span>4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">参加活动</h4>
                        <p className="text-sm text-text-muted">
                          按照活动时间和地点，准时参加活动
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
  );
};

export default OfflineEvents;