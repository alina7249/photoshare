// EventsAndContests.tsx - 活动与赛事主页面
// 整合线下活动和摄影赛事，采用与资源模块类似的标签切换格式

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { EventCard } from '../components/EventCard';
import { apiGet } from '../lib/api';

// 线下活动类型定义
interface Event {
  id: string;
  title: string;
  type: string;
  category: string;
  image: string;
  location: string;
  date: string;
  duration: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    experience: string;
  };
  price: number;
  participants: number;
  maxParticipants: number;
  description: string;
  tags: string[];
}

// 摄影赛事类型定义
interface Contest {
  id: string;
  title: string;
  type: string;
  image: string;
  deadline: string;
  status: string;
  entries: number;
  worksCount: number;
  participants: number;
  description: string;
  tags: string[];
}

// 报名表单数据类型
interface RegistrationFormData {
  name: string;
  phone: string;
  email: string;
  experience: string;
  specialRequests: string;
  agreement: boolean;
}

const EventsAndContests: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allContests, setAllContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, contestsData] = await Promise.all([
          apiGet('/events'),
          apiGet('/contests'),
        ]);
        setAllEvents(eventsData);
        setAllContests(contestsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const eventTypes: string[] = [];
  const eventCategories: string[] = [];
  const contestTypes: string[] = [];
  const contestStatuses: string[] = [];
  const popularTags: { id: string; name: string; count: number }[] = [];

  const [activeTab, setActiveTab] = useState<'events' | 'contests'>('events');
  const [selectedEventType, setSelectedEventType] = useState('全部');
  const [selectedEventCategory, setSelectedEventCategory] = useState('全部');
  const [selectedContestType, setSelectedContestType] = useState('全部');
  const [selectedContestStatus, setSelectedContestStatus] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newEventData, setNewEventData] = useState({
    title: '',
    type: '',
    location: '',
    date: '',
    duration: '',
    description: '',
    tags: ''
  });
  const [newContestData, setNewContestData] = useState({
    title: '',
    type: '',
    deadline: '',
    description: '',
    tags: ''
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [showContestForm, setShowContestForm] = useState(false);
  
  // 报名表单状态
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationFormData>({
    name: '',
    phone: '',
    email: '',
    experience: '',
    specialRequests: '',
    agreement: false
  });
  
  const navigate = useNavigate();

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 过滤线下活动
  const getFilteredEvents = () => {
    let events = [...allEvents];
    
    // 按类型过滤
    if (selectedEventType !== '全部') {
      events = events.filter(event => event.type === selectedEventType);
    }
    
    // 按分类过滤
    if (selectedEventCategory !== '全部') {
      events = events.filter(event => event.category === selectedEventCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      events = events.filter(event => 
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }
    
    return events;
  };

  // 过滤摄影赛事
  const getFilteredContests = () => {
    let contests = [...allContests];
    
    // 按类型过滤
    if (selectedContestType !== '全部') {
      contests = contests.filter(contest => contest.type === selectedContestType);
    }
    
    // 按状态过滤
    if (selectedContestStatus !== '全部') {
      contests = contests.filter(contest => contest.status === selectedContestStatus);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      contests = contests.filter(contest => 
        contest.title.toLowerCase().includes(term) || 
        contest.description.toLowerCase().includes(term)
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      contests = contests.filter(contest => 
        selectedTags.some(tag => contest.tags.includes(tag))
      );
    }
    
    return contests;
  };

  // 提交新活动
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('请先登录后再发布活动');
      return;
    }
    
    // 验证表单数据
    if (!newEventData.title || !newEventData.type || !newEventData.location || 
        !newEventData.date || !newEventData.duration || !newEventData.description) {
      toast.warning('请填写所有必填字段');
      return;
    }
    
    // 模拟提交成功
    toast.success('活动发布成功！我们将为您审核并上线');
    
    // 重置表单并关闭表单
    setNewEventData({
      title: '',
      type: '',
      location: '',
      date: '',
      duration: '',
      description: '',
      tags: ''
    });
    
    setShowEventForm(false);
  };

  // 提交新赛事
  const handleSubmitContest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('请先登录后再发布赛事');
      return;
    }
    
    // 验证表单数据
    if (!newContestData.title || !newContestData.type || !newContestData.deadline || 
        !newContestData.description) {
      toast.warning('请填写所有必填字段');
      return;
    }
    
    // 模拟提交成功
    toast.success('赛事发布成功！我们将为您审核并上线');
    
    // 重置表单并关闭表单
    setNewContestData({
      title: '',
      type: '',
      deadline: '',
      description: '',
      tags: ''
    });
    
    setShowContestForm(false);
  };

  // 打开报名表单 - 兼容Event和Contest类型
  const openRegistrationForm = (item: Event | Contest) => {
    if (!isAuthenticated) {
      toast.info('请先登录后再报名');
      navigate('/login');
      return;
    }
    
    // 存储选中的活动或赛事
    if ('type' in item && 'location' in item) {
      setSelectedEvent(item as Event);
    } else {
      // 为赛事创建一个兼容Event类型的对象
      const contestAsEvent: Event = {
        id: item.id,
        title: item.title,
        type: item.type,
        category: item.tags[0] || '赛事',
        image: item.image,
        location: '线上参与',
        date: item.deadline,
        duration: '不限',
        instructor: {
          id: 'organizer',
          name: '赛事主办方',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=event%20organizer%20avatar&sign=efef52c916bdf2cefedc9df51f81ca5b',
          title: '赛事组织方',
          experience: '专业'
        },
        price: 0,
        participants: item.participants,
        maxParticipants: item.participants + 100,
        description: item.description,
        tags: item.tags
      };
      setSelectedEvent(contestAsEvent);
    }
    
    setRegistrationData({
      name: user?.username || '',
      phone: '',
      email: user?.email || '',
      experience: '',
      specialRequests: '',
      agreement: false
    });
    setShowRegistrationForm(true);
  };

  // 提交报名表单
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单数据
    if (!registrationData.name || !registrationData.phone || !registrationData.email || !registrationData.agreement) {
      toast.warning('请填写所有必填字段并同意条款');
      return;
    }
    
    // 模拟提交成功
    toast.success(`已成功报名 ${selectedEvent?.title}`);
    
    // 重置表单并关闭表单
    setShowRegistrationForm(false);
    setSelectedEvent(null);
    
    // 可以在这里添加更新活动参与人数的逻辑
  };

  const filteredEvents = getFilteredEvents();
  const filteredContests = getFilteredContests();

  return (
    <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            活动与赛事
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            参与摄影活动和赛事，提升技能，结交同好，展示才华
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 顶部功能标签 */}
            <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === 'events'
                      ? 'bg-accent text-text-primary'
                      : 'bg-card text-text-muted hover:text-text-primary'
                  }`}
                >
                  线下活动
                </button>
                <button
                  onClick={() => setActiveTab('contests')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === 'contests'
                      ? 'bg-accent text-text-primary'
                      : 'bg-card text-text-muted hover:text-text-primary'
                  }`}
                >
                  摄影赛事
                </button>
              </div>
            </div>

            {/* 内容切换容器 */}
            <motion.div
              key={activeTab} // 使用key强制重新渲染，保证切换时的动画效果
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden" // 确保内容溢出时不会破坏布局
            >
              {/* 线下活动内容 */}
              {activeTab === 'events' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* 搜索 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索活动、地点或主题..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  </div>

                  {/* 活动类型和分类选项卡 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                      <div className="p-3 border-b border-accent">
                        <h4 className="text-sm font-medium text-text-primary">活动类型</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {eventTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedEventType(type)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedEventType === type
                                ? 'bg-accent text-text-primary rounded-lg'
                                : 'bg-card text-text-muted hover:bg-accent/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                      <div className="p-3 border-b border-accent">
                        <h4 className="text-sm font-medium text-text-primary">活动分类</h4>
                      </div>
                      <div className="grid grid-cols-4 p-2">
                        {eventCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedEventCategory(category)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedEventCategory === category
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

                   {/* 活动卡片列表 */}
                  <div className="space-y-6">
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id}
                        item={event}
                        isContest={false}
                        onRegister={() => openRegistrationForm(event)}
                        selectedTags={selectedTags}
                        toggleTag={toggleTag}
                      />
                    ))}
                    
                    {filteredEvents.length === 0 && (
                      <div className="p-8 bg-card rounded-xl border border-accent text-center">
                        <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                          <i className="fa-solid fa-search text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关活动</h3>
                        <p className="text-text-muted">
                          请尝试使用不同的关键词或筛选条件
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 摄影赛事内容 */}
              {activeTab === 'contests' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* 搜索 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索赛事、主题或关键词..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  </div>

                  {/* 赛事类型和状态选项卡 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                      <div className="p-3 border-b border-accent">
                        <h4 className="text-sm font-medium text-text-primary">赛事类型</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {contestTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedContestType(type)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedContestType === type
                                ? 'bg-accent text-text-primary rounded-lg'
                                : 'bg-card text-text-muted hover:bg-accent/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-xl shadow-sm border border-accent overflow-hidden">
                      <div className="p-3 border-b border-accent">
                        <h4 className="text-sm font-medium text-text-primary">赛事状态</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {contestStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedContestStatus(status)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedContestStatus === status
                                ? 'bg-accent text-text-primary rounded-lg'
                                : 'bg-card text-text-muted hover:bg-accent/50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                   {/* 赛事卡片列表 */}
                  <div className="space-y-6">
                    {filteredContests.map((contest) => (
                      <EventCard 
                        key={contest.id}
                        item={contest}
                        isContest={true}
                        onRegister={() => openRegistrationForm(contest)}
                        selectedTags={selectedTags}
                        toggleTag={toggleTag}
                      />
                    ))}
                    
                    {filteredContests.length === 0 && (
                      <div className="p-8 bg-card rounded-xl border border-accent text-center">
                        <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                          <i className="fa-solid fa-search text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关赛事</h3>
                        <p className="text-text-muted">
                          请尝试使用不同的关键词或筛选条件
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* 侧边栏内容 */}
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
            
            {/* 发布入口 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-3">发布{activeTab === 'events' ? '活动' : '赛事'}</h3>
              <p className="text-sm mb-4 text-white/90">
                {activeTab === 'events' 
                  ? '创建自己的摄影活动，邀请同好参与，分享摄影技巧和经验' 
                  : '创建摄影赛事，展示你的创意主题，吸引更多摄影师参与'
                }
              </p>
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-3 bg-text-primary text-accent font-medium rounded-lg hover:bg-surface-light-hover transition-colors border border-text-primary"
    onClick={() => {
      if (!isAuthenticated) {
        toast.info('请先登录后再发布');
        navigate('/login');
      } else {
        // 显示发布表单
        if (activeTab === 'events') {
          setShowEventForm(true);
        } else {
          setShowContestForm(true);
        }
      }
    }}
  >
    立即发布
  </motion.button>
            </div>
            
            {/* 即将开始/截止提醒 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">
                {activeTab === 'events' ? '即将开始' : '即将截止'}
              </h3>
              <div className="space-y-4">
                {(activeTab === 'events' ? allEvents : allContests)
                  .filter(item => activeTab === 'events' ? true : item.status === '进行中')
                  .sort((a, b) => {
                    const dateA = new Date(activeTab === 'events' ? a.date.split(' ')[0] : a.deadline).getTime();
                    const dateB = new Date(activeTab === 'events' ? b.date.split(' ')[0] : b.deadline).getTime();
                    return dateA - dateB;
                  })
                  .slice(0, 3)
                  .map((item) => {
                    // 计算剩余天数
                    const now = new Date();
                    const targetDate = new Date(activeTab === 'events' ? item.date.split(' ')[0] : item.deadline);
                    const diffTime = targetDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 5 }}
                        className="flex space-x-3 cursor-pointer"
                      >
                        <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-accent/30 rounded-lg text-text-primary">
                          {diffDays > 0 ? (
                            <>
                              <span className="text-lg font-bold">{diffDays}</span>
                              <span className="text-xs">天后{activeTab === 'events' ? '开始' : '截止'}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg font-bold">0</span>
                              <span className="text-xs">{activeTab === 'events' ? '已开始' : '已截止'}</span>
                            </>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text-primary hover:text-surface-light-hover transition-colors truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-text-primary/80">
                            <span>{activeTab === 'events' ? item.type : item.type}</span>
                            <span>•</span>
                            <span>{activeTab === 'events' ? `${item.participants} 人报名` : `${item.participants} 人参赛`}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
            
            {/* 常见问题 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold mb-4 text-text-primary">
                {activeTab === 'events' ? '活动常见问题' : '参赛指南'}
              </h3>
              <div className="space-y-3">
                {activeTab === 'events' ? (
                  <>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">如何参加活动？</h4>
                      <p className="text-sm text-text-muted">
                        浏览感兴趣的活动，点击"立即报名"按钮，按照要求提交信息即可完成报名。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">活动有什么要求？</h4>
                      <p className="text-sm text-text-muted">
                        不同活动有不同的要求，包括摄影器材、经验水平等，请仔细阅读每个活动的详情。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">与资源模块的区别？</h4>
                      <p className="text-sm text-text-muted">
                        线下活动提供集体参与的摄影体验，而资源模块是摄影师与客户之间的商业交易平台。
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">如何参赛？</h4>
                      <p className="text-sm text-text-muted">
                        浏览感兴趣的赛事，点击"立即参赛"按钮，按照要求上传作品并填写相关信息即可完成报名。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">作品有什么要求？</h4>
                      <p className="text-sm text-text-muted">
                        不同赛事有不同的作品要求，包括题材、格式、大小等，请务必仔细阅读每个赛事的具体规则。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">与资源模块的区别？</h4>
                      <p className="text-sm text-text-muted">
                        摄影赛事是展示作品、交流学习的平台，而资源模块专注于商业摄影服务的交易。
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* 相关链接 */}
              <div className="mt-6 pt-4 border-t border-accent">
                <p className="text-sm text-text-muted mb-2">您可能还对以下内容感兴趣：</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/resources" className="px-3 py-1 bg-accent text-text-primary rounded-full text-xs hover:bg-accent-hover transition-colors">
                    资源交易
                  </Link>
                  <Link to="/equipment-database" className="px-3 py-1 bg-accent text-text-primary rounded-full text-xs hover:bg-accent-hover transition-colors">
                    器材数据库
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 活动发布表单弹窗 */}
      {showEventForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-accent">
              <h3 className="text-xl font-bold text-text-primary">发布活动</h3>
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setShowEventForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="event-title" className="block text-sm font-medium text-text-primary mb-1">
                    活动标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={newEventData.title}
                    onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入活动标题"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-type" className="block text-sm font-medium text-text-primary mb-1">
                      活动类型 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="event-type"
                      value={newEventData.type}
                      onChange={(e) => setNewEventData({...newEventData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      required
                    >
                      <option value="">请选择活动类型</option>
                      <option value="采风团">采风团</option>
                      <option value="摄影沙龙">摄影沙龙</option>
                      <option value="器材体验会">器材体验会</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="event-location" className="block text-sm font-medium text-text-primary mb-1">
                      活动地点 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-location"
                      type="text"
                      value={newEventData.location}
                      onChange={(e) => setNewEventData({...newEventData, location: e.target.value})}
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="请输入活动地点"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-text-primary mb-1">
                      活动日期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-date"
                      type="text"
                      value={newEventData.date}
                      onChange={(e) => setNewEventData({...newEventData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="例如：2025-12-15 至 2025-12-22"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-duration" className="block text-sm font-medium text-text-primary mb-1">
                      活动时长 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-duration"
                      type="text"
                      value={newEventData.duration}
                      onChange={(e) => setNewEventData({...newEventData, duration: e.target.value})}
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="例如：8天7晚"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="event-description" className="block text-sm font-medium text-text-primary mb-1">
                    活动描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="event-description"
                    value={newEventData.description}
                    onChange={(e) => setNewEventData({...newEventData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[150px]"
                    placeholder="请详细描述活动内容、亮点和安排"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="event-tags" className="block text-sm font-medium text-text-primary mb-1">
                    活动标签
                  </label>
                  <input
                    id="event-tags"
                    type="text"
                    value={newEventData.tags}
                    onChange={(e) => setNewEventData({...newEventData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入标签，用逗号分隔"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-accent">
                <button 
                  type="button"
                  className="px-6 py-3 bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
                  onClick={() => setShowEventForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
                >
                  发布活动
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* 赛事发布表单弹窗 */}
      {showContestForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-accent">
              <h3 className="text-xl font-bold text-text-primary">发布赛事</h3>
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setShowContestForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitContest} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="contest-title" className="block text-sm font-medium text-text-primary mb-1">
                    赛事标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contest-title"
                    type="text"
                    value={newContestData.title}
                    onChange={(e) => setNewContestData({...newContestData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入赛事标题"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contest-type" className="block text-sm font-medium text-text-primary mb-1">
                    赛事类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contest-type"
                    value={newContestData.type}
                    onChange={(e) => setNewContestData({...newContestData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    required
                  >
                    <option value="">请选择赛事类型</option>
                    <option value="官方主办">官方主办</option>
                    <option value="合作赛事">合作赛事</option>
                    <option value="用户自创">用户自创</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contest-deadline" className="block text-sm font-medium text-text-primary mb-1">
                    截止日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contest-deadline"
                    type="text"
                    value={newContestData.deadline}
                    onChange={(e) => setNewContestData({...newContestData, deadline: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="例如：2025-12-31"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contest-description" className="block text-sm font-medium text-text-primary mb-1">
                    赛事描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contest-description"
                    value={newContestData.description}
                    onChange={(e) => setNewContestData({...newContestData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[150px]"
                    placeholder="请详细描述赛事主题、规则和奖励"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="contest-tags" className="block text-sm font-medium text-text-primary mb-1">
                    赛事标签
                  </label>
                  <input
                    id="contest-tags"
                    type="text"
                    value={newContestData.tags}
                    onChange={(e) => setNewContestData({...newContestData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入标签，用逗号分隔"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-accent">
                <button 
                  type="button"
                  className="px-6 py-3 bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
                  onClick={() => setShowContestForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
                >
                  发布赛事
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* 报名表单弹窗 */}
       {/* 报名表单弹窗 - 适用于活动和赛事 */}
       {showRegistrationForm && selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-accent">
              <h3 className="text-xl font-bold text-text-primary">报名活动：{selectedEvent.title}</h3>
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setShowRegistrationForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
                    手机号码 <span className="text-red-500">*</span>
                  </label>
              <input
                id="phone"
                type="tel"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="请输入11位手机号码"
                pattern="^1[3-9]\d{9}$"
                required
              />
              <p className="text-xs text-accent mt-1">请输入有效的11位手机号码</p>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                    电子邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="请输入您的电子邮箱"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-text-primary mb-1">
                    摄影经验
                  </label>
                  <select
                    id="experience"
                    value={registrationData.experience}
                    onChange={(e) => setRegistrationData({...registrationData, experience: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  >
                    <option value="">请选择您的摄影经验</option>
                    <option value="beginner">初学者 (0-1年)</option>
                    <option value="intermediate">中级 (1-3年)</option>
                    <option value="advanced">高级 (3-5年)</option>
                    <option value="professional">专业 (5年以上)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-text-primary mb-1">
                    特殊需求
                  </label>
                  <textarea
                    id="specialRequests"
                    value={registrationData.specialRequests}
                    onChange={(e) => setRegistrationData({...registrationData, specialRequests: e.target.value})}
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[100px]"
                    placeholder="如有任何特殊需求，请在此说明"
                  ></textarea>
                </div>
                
                <div className="flex items-start mt-4">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={registrationData.agreement}
                    onChange={(e) => setRegistrationData({...registrationData, agreement: e.target.checked})}
                    className="mt-1 h-4 w-4 text-accent focus:ring-accent rounded border-accent bg-deep"
                    required
                  />
                  <label htmlFor="agreement" className="ml-2 block text-sm text-text-muted">
                    我已阅读并同意<a href="#" className="text-accent hover:underline">活动协议</a>和<a href="#" className="text-accent hover:underline">隐私政策</a>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-accent">
                <div className="text-text-muted text-sm">
                  活动费用: <span className="font-bold text-text-primary">
                    {selectedEvent.price === 0 ? '免费' : `¥${selectedEvent.price}`}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    className="px-6 py-3 bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
                    onClick={() => setShowRegistrationForm(false)}
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
                  >
                    确认报名
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default EventsAndContests;