// EventsAndContests.tsx - 活动与赛事主页面
// 整合线下活动和摄影赛事，采用与资源模块类似的标签切换格式

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { EventCard } from '../components/EventCard';

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

// 模拟线下活动数据
const mockEvents: Event[] = [
  {
    id: 'e1',
    title: '新疆喀纳斯秋季风光摄影团',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20kanas%20autumn%20landscape%20photography%20tour&sign=80fdfc7396a896f951715b6544406409',
    location: '新疆·喀纳斯',
    date: '2025-12-15 至 2025-12-22',
    duration: '8天7晚',
    instructor: {
      id: 'i1',
      name: '风光摄影师张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor%20professional&sign=871dd04c358f08c5214aaf9a36e6bf27',
      title: '国家地理摄影师',
      experience: '15年'
    },
    price: 6999,
    participants: 12,
    maxParticipants: 20,
    description: '跟随国家地理摄影师张明，深入新疆喀纳斯，拍摄秋季绝美风光。行程涵盖喀纳斯湖、禾木村、白哈巴等著名景点，在最佳时间和地点拍摄金秋时节的层林尽染、晨雾缭绕的梦幻景色。',
    tags: ['风光', '新疆', '秋季', '长线', '深度']
  },
  {
    id: 'e2',
    title: '上海城市纪实摄影沙龙',
    type: '摄影沙龙',
    category: '纪实',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20urban%20documentary%20photography%20salon&sign=c10d47ff72e693e4aae932edd3732d15',
    location: '上海·静安区',
    date: '2025-12-28 14:00-17:00',
    duration: '3小时',
    instructor: {
      id: 'i2',
      name: '纪实摄影师李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street%20experienced&sign=c2d89b9f47e07118aab5b3aef7c5cdf3',
      title: '国际纪实摄影奖得主',
      experience: '10年'
    },price: 199,
    participants: 18,
    maxParticipants: 30,
    description: '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。沙龙将涵盖纪实摄影的构图技巧、光线运用、与被摄者沟通等实用内容，并进行现场拍摄指导。',
    tags: ['纪实', '城市', '上海', '沙龙', '短期']
  },
  {
    id: 'e3',
    title: '索尼Alpha新品体验会',
    type: '器材体验会',
    category: '器材',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20new%20camera%20experience%20event%20demo&sign=7801e7949f7d2a5e0e7c3a308a3fba3a',
    location: '北京·朝阳区',
    date: '2026-01-05 10:00-16:00',
    duration: '6小时',
    instructor: {
      id: 'i3',
      name: '索尼技术专家王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20camera%20technical%20expert%20male%20professional&sign=78333651a183c3049ee0b820a0642879',
      title: '索尼官方讲师',
      experience: '8年'
    },
    price: 0,
    participants: 25,
    maxParticipants: 50,
    description: '索尼Alpha系列新品体验会，现场体验最新的索尼相机和镜头，包括A7R V、A7S III等热门机型。专业技术专家现场讲解产品特性和使用技巧，并提供一对一咨询服务。',
    tags: ['器材', '索尼', '新品', '体验', '免费']
  }
];

// 模拟摄影赛事数据
const mockContests: Contest[] = [
  {
    id: 'c1',
    title: '2025年度黑白摄影大赛',
    type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20contest%20banner%20minimalist&sign=5958a9112dbd48d52283b3d3b68c22df',
    deadline: '2025-12-31',
    status: '进行中',
    entries: 1254,
    worksCount: 3458,
    participants: 1254,
    description: '展现黑白摄影的独特魅力，通过光影、构图和情感表达，呈现经典而永恒的视觉艺术作品。大赛面向全球摄影爱好者，欢迎各类黑白摄影作品参赛。',
    tags: ['黑白', '年度', '官方', '奖金', '全球']
  },
  {
    id: 'c2',
    title: '索尼Alpha创意摄影挑战赛',
    type: '合作赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20creative%20photography%20challenge%20banner&sign=38f14ccad69f3dbb399991f5317127ce',
    deadline: '2025-12-15',
    status: '进行中',
    entries: 876,
    worksCount: 2156,
    participants: 876,
    description: '使用索尼Alpha系列相机创作，展示你的创意视角和摄影才华。本次挑战赛不限题材，鼓励创新和实验性的摄影作品。',
    tags: ['索尼', '创意', '器材', '相机', '合作']
  },
  {
    id: 'c3',
    title: '城市人文纪实摄影大赛',
    type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20documentary%20photography%20contest%20banner%20street%20life&sign=818fdf65887ba3b9c9d321794542006b',
    deadline: '2025-12-30',
    status: '进行中',
    entries: 654,
    worksCount: 1890,
    participants: 654,
    description: '记录城市生活的瞬间，展现都市人文风情和社会变迁。通过摄影镜头，讲述城市中的故事，传递人文关怀和思考。',
    tags: ['城市', '人文', '纪实', '街拍', '官方']
  }
];

// 活动类型
const eventTypes = ['全部', '采风团', '摄影沙龙', '器材体验会'];

// 活动分类
const eventCategories = ['全部', '风光', '人像', '纪实', '商业', '器材', '街拍', '星空'];

// 赛事类型
const contestTypes = ['全部', '官方主办', '合作赛事', '用户自创'];

// 赛事状态
const contestStatuses = ['全部', '进行中', '已截止', '评选中', '已结束'];

// 热门标签
const popularTags = [
  { id: '1', name: '风光', count: 124 },
  { id: '2', name: '人像', count: 87 },
  { id: '3', name: '城市', count: 65 },
  { id: '4', name: '纪实', count: 43 },
  { id: '5', name: '器材', count: 32 },
  { id: '6', name: '秋季', count: 28 },
  { id: '7', name: '黑白', count: 25 },
  { id: '8', name: '创意', count: 20 },
];

const EventsAndContests: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
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
    let events = [...mockEvents];
    
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
    let contests = [...mockContests];
    
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
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">
            活动与赛事
          </h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            参与摄影活动和赛事，提升技能，结交同好，展示才华
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 顶部功能标签 */}
            <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === 'events'
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                  }`}
                >
                  线下活动
                </button>
                <button
                  onClick={() => setActiveTab('contests')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === 'contests'
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
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
                      className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                  </div>

                  {/* 活动类型和分类选项卡 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                      <div className="p-3 border-b border-[#4A5F8B]">
                        <h4 className="text-sm font-medium text-[#F5F7FA]">活动类型</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {eventTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedEventType(type)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedEventType === type
                                ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                                : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                      <div className="p-3 border-b border-[#4A5F8B]">
                        <h4 className="text-sm font-medium text-[#F5F7FA]">活动分类</h4>
                      </div>
                      <div className="grid grid-cols-4 p-2">
                        {eventCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedEventCategory(category)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedEventCategory === category
                                ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                                : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
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
                      <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                        <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                          <i className="fa-solid fa-search text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关活动</h3>
                        <p className="text-[#B8C6D8]">
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
                      className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                  </div>

                  {/* 赛事类型和状态选项卡 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                      <div className="p-3 border-b border-[#4A5F8B]">
                        <h4 className="text-sm font-medium text-[#F5F7FA]">赛事类型</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {contestTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedContestType(type)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedContestType === type
                                ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                                : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                      <div className="p-3 border-b border-[#4A5F8B]">
                        <h4 className="text-sm font-medium text-[#F5F7FA]">赛事状态</h4>
                      </div>
                      <div className="grid grid-cols-3 p-2">
                        {contestStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedContestStatus(status)}
                            className={`py-2 px-1 text-center text-sm font-medium transition-colors ${
                              selectedContestStatus === status
                                ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                                : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
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
                      <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                        <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                          <i className="fa-solid fa-search text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关赛事</h3>
                        <p className="text-[#B8C6D8]">
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
            <div className="bg-[#4A5F8B] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-[#F5F7FA] text-[#4A5F8B]'
                        : 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]'
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
                  className="mt-4 w-full py-2 text-center text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
            
            {/* 发布入口 */}
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white">
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
    className="w-full py-3 bg-[#F5F7FA] text-[#4A5F8B] font-medium rounded-lg hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">
                {activeTab === 'events' ? '即将开始' : '即将截止'}
              </h3>
              <div className="space-y-4">
                {(activeTab === 'events' ? mockEvents : mockContests)
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
                        <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-[#4A5F8B]/30 rounded-lg text-[#F5F7FA]">
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
                          <h4 className="font-medium text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-[#F5F7FA]/80">
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">
                {activeTab === 'events' ? '活动常见问题' : '参赛指南'}
              </h3>
              <div className="space-y-3">
                {activeTab === 'events' ? (
                  <>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">如何参加活动？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        浏览感兴趣的活动，点击"立即报名"按钮，按照要求提交信息即可完成报名。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">活动有什么要求？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        不同活动有不同的要求，包括摄影器材、经验水平等，请仔细阅读每个活动的详情。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">与资源模块的区别？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        线下活动提供集体参与的摄影体验，而资源模块是摄影师与客户之间的商业交易平台。
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">如何参赛？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        浏览感兴趣的赛事，点击"立即参赛"按钮，按照要求上传作品并填写相关信息即可完成报名。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">作品有什么要求？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        不同赛事有不同的作品要求，包括题材、格式、大小等，请务必仔细阅读每个赛事的具体规则。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F7FA] mb-1">与资源模块的区别？</h4>
                      <p className="text-sm text-[#B8C6D8]">
                        摄影赛事是展示作品、交流学习的平台，而资源模块专注于商业摄影服务的交易。
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* 相关链接 */}
              <div className="mt-6 pt-4 border-t border-[#4A5F8B]">
                <p className="text-sm text-[#B8C6D8] mb-2">您可能还对以下内容感兴趣：</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/resources" className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs hover:bg-[#6B7C93] transition-colors">
                    资源交易
                  </Link>
                  <Link to="/equipment-database" className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs hover:bg-[#6B7C93] transition-colors">
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
            className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#4A5F8B]">
              <h3 className="text-xl font-bold text-[#F5F7FA]">发布活动</h3>
              <button 
                className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                onClick={() => setShowEventForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="event-title" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    活动标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={newEventData.title}
                    onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入活动标题"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-type" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                      活动类型 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="event-type"
                      value={newEventData.type}
                      onChange={(e) => setNewEventData({...newEventData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      required
                    >
                      <option value="">请选择活动类型</option>
                      <option value="采风团">采风团</option>
                      <option value="摄影沙龙">摄影沙龙</option>
                      <option value="器材体验会">器材体验会</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="event-location" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                      活动地点 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-location"
                      type="text"
                      value={newEventData.location}
                      onChange={(e) => setNewEventData({...newEventData, location: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      placeholder="请输入活动地点"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                      活动日期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-date"
                      type="text"
                      value={newEventData.date}
                      onChange={(e) => setNewEventData({...newEventData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      placeholder="例如：2025-12-15 至 2025-12-22"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-duration" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                      活动时长 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="event-duration"
                      type="text"
                      value={newEventData.duration}
                      onChange={(e) => setNewEventData({...newEventData, duration: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      placeholder="例如：8天7晚"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="event-description" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    活动描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="event-description"
                    value={newEventData.description}
                    onChange={(e) => setNewEventData({...newEventData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[150px]"
                    placeholder="请详细描述活动内容、亮点和安排"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="event-tags" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    活动标签
                  </label>
                  <input
                    id="event-tags"
                    type="text"
                    value={newEventData.tags}
                    onChange={(e) => setNewEventData({...newEventData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入标签，用逗号分隔"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#4A5F8B]">
                <button 
                  type="button"
                  className="px-6 py-3 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                  onClick={() => setShowEventForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
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
            className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#4A5F8B]">
              <h3 className="text-xl font-bold text-[#F5F7FA]">发布赛事</h3>
              <button 
                className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                onClick={() => setShowContestForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitContest} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="contest-title" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    赛事标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contest-title"
                    type="text"
                    value={newContestData.title}
                    onChange={(e) => setNewContestData({...newContestData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入赛事标题"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contest-type" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    赛事类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contest-type"
                    value={newContestData.type}
                    onChange={(e) => setNewContestData({...newContestData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    required
                  >
                    <option value="">请选择赛事类型</option>
                    <option value="官方主办">官方主办</option>
                    <option value="合作赛事">合作赛事</option>
                    <option value="用户自创">用户自创</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contest-deadline" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    截止日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contest-deadline"
                    type="text"
                    value={newContestData.deadline}
                    onChange={(e) => setNewContestData({...newContestData, deadline: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="例如：2025-12-31"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contest-description" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    赛事描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contest-description"
                    value={newContestData.description}
                    onChange={(e) => setNewContestData({...newContestData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[150px]"
                    placeholder="请详细描述赛事主题、规则和奖励"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="contest-tags" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    赛事标签
                  </label>
                  <input
                    id="contest-tags"
                    type="text"
                    value={newContestData.tags}
                    onChange={(e) => setNewContestData({...newContestData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入标签，用逗号分隔"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#4A5F8B]">
                <button 
                  type="button"
                  className="px-6 py-3 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                  onClick={() => setShowContestForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
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
            className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#4A5F8B]">
              <h3 className="text-xl font-bold text-[#F5F7FA]">报名活动：{selectedEvent.title}</h3>
              <button 
                className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                onClick={() => setShowRegistrationForm(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    手机号码 <span className="text-red-500">*</span>
                  </label>
              <input
                id="phone"
                type="tel"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                placeholder="请输入11位手机号码"
                pattern="^1[3-9]\d{9}$"
                required
              />
              <p className="text-xs text-[#4A5F8B] mt-1">请输入有效的11位手机号码</p>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    电子邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入您的电子邮箱"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    摄影经验
                  </label>
                  <select
                    id="experience"
                    value={registrationData.experience}
                    onChange={(e) => setRegistrationData({...registrationData, experience: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  >
                    <option value="">请选择您的摄影经验</option>
                    <option value="beginner">初学者 (0-1年)</option>
                    <option value="intermediate">中级 (1-3年)</option>
                    <option value="advanced">高级 (3-5年)</option>
                    <option value="professional">专业 (5年以上)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-[#F5F7FA] mb-1">
                    特殊需求
                  </label>
                  <textarea
                    id="specialRequests"
                    value={registrationData.specialRequests}
                    onChange={(e) => setRegistrationData({...registrationData, specialRequests: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[100px]"
                    placeholder="如有任何特殊需求，请在此说明"
                  ></textarea>
                </div>
                
                <div className="flex items-start mt-4">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={registrationData.agreement}
                    onChange={(e) => setRegistrationData({...registrationData, agreement: e.target.checked})}
                    className="mt-1 h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] rounded border-[#4A5F8B] bg-[#1E2532]"
                    required
                  />
                  <label htmlFor="agreement" className="ml-2 block text-sm text-[#B8C6D8]">
                    我已阅读并同意<a href="#" className="text-[#4A5F8B] hover:underline">活动协议</a>和<a href="#" className="text-[#4A5F8B] hover:underline">隐私政策</a>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-[#4A5F8B]">
                <div className="text-[#B8C6D8] text-sm">
                  活动费用: <span className="font-bold text-[#F5F7FA]">
                    {selectedEvent.price === 0 ? '免费' : `¥${selectedEvent.price}`}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    className="px-6 py-3 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    onClick={() => setShowRegistrationForm(false)}
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
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