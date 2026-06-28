import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';

// 模拟活动数据
const mockEvents = [
  {
    id: 'e1',
    title: '新疆喀纳斯秋季风光摄影团',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20kanas%20autumn%20landscape%20photography%20tour&sign=80fdfc7396a896f951715b6544406409',
    location: '新疆·喀纳斯',
    date: '2023-10-15 至 2023-10-22',
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
    itinerary: [
      '第1天：全国各地 - 乌鲁木齐集合',
      '第2天：乌鲁木齐 - 布尔津 - 五彩滩',
      '第3天：布尔津 - 喀纳斯湖 - 观鱼台',
      '第4天：喀纳斯 - 白哈巴村',
      '第5天：白哈巴 - 禾木村',
      '第6天：禾木村全天拍摄',
      '第7天：禾木 - 可可托海',
      '第8天：可可托海 - 乌鲁木齐解散'
    ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差', '额外景点门票'],
    notes: ['需自带摄影器材', '有一定摄影基础', '适应高原气候', '尊重当地风俗'],
    tags: ['风光', '新疆', '秋季', '长线', '深度']
  },
  {
    id: 'e2',
    title: '上海城市纪实摄影沙龙',
    type: '摄影沙龙',
    category: '纪实',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20urban%20documentary%20photography%20salon&sign=c10d47ff72e693e4aae932edd3732d15',
    location: '上海·静安区',
    date: '2023-10-28 14:00-17:00',
    duration: '3小时',
    instructor: {
      id: 'i2',
      name: '纪实摄影师李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street%20experienced&sign=c2d89b9f47e07118aab5b3aef7c5cdf3',
      title: '国际纪实摄影奖得主',
      experience: '10年'
    },
    price: 199,
    participants: 18,
    maxParticipants: 30,
    description: '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。沙龙将涵盖纪实摄影的构图技巧、光线运用、与被摄者沟通等实用内容，并进行现场拍摄指导。',
    itinerary: [
      '14:00-14:30：签到与破冰',
      '14:30-15:30：纪实摄影理论分享',
      '15:30-16:30：户外实战拍摄指导',
      '16:30-17:00：作品点评与交流'
    ],
    inclusion: ['场地', '指导', '资料', '茶点'],
    exclusion: ['交通', '器材', '个人消费'],
    notes: ['自带摄影器材', '提前报名确认', '尊重拍摄对象'],
    tags: ['纪实', '城市', '上海', '沙龙', '短期']
  },
  {
    id: 'e3',
    title: '索尼Alpha新品体验会',
    type: '器材体验会',
    category: '器材',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20new%20camera%20experience%20event%20demo&sign=7801e7949f7d2a5e0e7c3a308a3fba3a',
    location: '北京·朝阳区',
    date: '2023-11-05 10:00-16:00',
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
    itinerary: [
      '10:00-10:30：签到与自由体验',
      '10:30-11:30：新品技术解析',
      '11:30-12:30：午餐交流',
      '12:30-15:00：分组体验与指导',
      '15:00-16:00：问答与抽奖'
    ],
    inclusion: ['场地', '指导', '资料', '午餐', '抽奖'],
    exclusion: ['交通', '个人消费'],
    notes: ['无需自带器材', '提前报名确认', '遵守活动秩序'],
    tags: ['器材', '索尼', '新品', '体验', '免费']
  },
  {
    id: 'e4',
    title: '云南元阳梯田春季摄影创作',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=yunnan%20yuanyang%20rice%20terraces%20spring%20photography%20tour&sign=09c3d6131214921bb3af386fac7bdba4',
    location: '云南·元阳',
    date: '2024-02-20 至 2024-02-25',
    duration: '6天5晚',
    instructor: {
      id: 'i4',
      name: '风光摄影师刘芳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20female%20nature%20professional&sign=c3336bf3ce1c7229154ec96830fedbfc',
      title: '国际风光摄影奖得主',
      experience: '12年'
    },
    price: 5699,
    participants: 8,
    maxParticipants: 15,
    description: '春季元阳梯田灌水期，是拍摄梯田云海、日出日落的最佳时节。跟随国际风光摄影奖得主刘芳，深入元阳梯田核心景区，在最佳拍摄点和时间，捕捉梯田如镜面般倒映天空和云霞的壮观景象。',
    itinerary: [
      '第1天：昆明集合',
      '第2天：昆明 - 元阳 - 老虎嘴梯田',
      '第3天：多依树梯田日出 - 爱春蓝梯田',
      '第4天：箐口梯田 - 坝达梯田日落',
      '第5天：龙树坝梯田 - 阿者科古村',
      '第6天：元阳 - 昆明解散'
    ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差'],
    notes: ['需自带摄影器材', '有一定摄影基础', '早起拍摄'],
    tags: ['风光', '云南', '春季', '梯田', '经典']
  },
];

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从API获取活动详情
    const fetchEventDetail = async () => {
      // 在真实应用中，这里应该是一个API调用
      const foundEvent = mockEvents.find(e => e.id === id);
      
      if (foundEvent) {
        setEvent(foundEvent);
      }
      
      setLoading(false);
    };

    fetchEventDetail();
  }, [id]);

  // 报名表单数据类型
  interface RegistrationFormData {
    name: string;
    phone: string;
    email: string;
    experience: string;
    specialRequests: string;
    agreement: boolean;
  }
  
  // 报名表单状态
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationFormData>({
    name: user?.username || '',
    phone: '',
    email: user?.email || '',
    experience: '',
    specialRequests: '',
    agreement: false
  });

  // 处理报名按钮点击
  const handleRegister = () => {
    if (!isAuthenticated) {
      // 未登录时跳转到登录页，携带重定向参数
      window.location.href = `/login?redirect=/event/${id}`;
      return;
    }

    // 显示报名表单
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
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(registrationData.phone)) {
      toast.warning('请输入有效的11位手机号码');
      return;
    }
    
    // 模拟提交成功
    toast.success(`已成功报名 ${event.title}`);
    
    // 更新活动参与人数状态
    setEvent(prevEvent => {
      if (prevEvent && prevEvent.participants < prevEvent.maxParticipants) {
        return {
          ...prevEvent,
          participants: prevEvent.participants + 1
        };
      }
      return prevEvent;
    });
    
    // 重置表单并关闭表单
    setShowRegistrationForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">未找到该活动</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">抱歉，您访问的活动不存在或已被删除</p>
          <Link to="/offline-events" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
            返回活动列表
          </Link>
             </div>
             
             {/* 评论区 */}
             <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
               <CommentSection postId={event.id} />
             </div>
           </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/offline-events"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回活动列表</span>
          </Link>
        </div>

        {/* 活动主图 */}
        <div className="relative rounded-xl overflow-hidden mb-8 bg-[#2D3748] border border-[#4A5F8B]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full">
                {event.type}
              </span>
              <span className="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] text-sm rounded-full">
                {event.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F7FA] mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#B8C6D8]">
              <div className="flex items-center">
                <i className="fa-solid fa-map-marker-alt mr-2"></i>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-calendar-alt mr-2"></i>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-clock mr-2"></i>
                <span>{event.duration}</span>
              </div>
            </div>
          </div>
        </div>

         {/* 价格和报名按钮 */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
          <div>
            <h3 className="text-lg font-medium text-[#B8C6D8] mb-1">活动费用</h3>
            <p className="text-3xl font-bold text-[#F5F7FA]">
              {event.price === 0 ? '免费' : `¥${event.price}`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center text-sm text-[#B8C6D8]">
              <i className="fa-solid fa-user-group mr-2 text-[#4A5F8B]"></i>
              <span>已有 {event.participants} 人报名 / 限 {event.maxParticipants} 人</span>
            </div>
             <div className="flex flex-col">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegister}
                className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
              >
                <i className="fa-solid fa-calendar-plus mr-2"></i> 立即报名
              </motion.button>
              <p className="text-xs text-[#B8C6D8] mt-1 text-center">
                <i className="fa-solid fa-circle-info mr-1"></i> 报名需填写表单，详情见注意事项
              </p>
            </div>
          </div>
        </div>

        {/* 内容主体 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 活动详情 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">活动详情</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-[#B8C6D8] leading-relaxed">
                  {event.description}
                </p>
              </div>
              
              {/* 活动标签 */}
              <div className="flex flex-wrap gap-2 mt-6">
                {event.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 行程安排 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">行程安排</h2>
              <div className="space-y-4">
                {event.itinerary.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-[#B8C6D8]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用包含/不包含 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">费用包含</h3>
                <ul className="space-y-2">
                  {event.inclusion.map((item: string, index: number) => (
                    <li key={index} className="flex items-center text-[#B8C6D8]">
                      <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">费用不包含</h3>
                <ul className="space-y-2">
                  {event.exclusion.map((item: string, index: number) => (
                    <li key={index} className="flex items-center text-[#B8C6D8]">
                      <i className="fa-solid fa-times-circle text-[#6B7C93] mr-2"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

             {/* 注意事项 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">注意事项</h2>
              <ul className="space-y-2">
                {/* 添加报名条件提示 */}
                <li className="flex items-center text-[#B8C6D8] bg-[#4A5F8B]/10 p-3 rounded-lg border border-[#4A5F8B]/30">
                  <i className="fa-solid fa-circle-info text-[#4A5F8B] mr-3 text-lg"></i>
                  <div>
                    <span className="font-medium text-[#F5F7FA] block mb-1">报名条件：</span>
                    <span className="block">1. 需登录账号</span>
                    <span className="block">2. 部分活动可能需要摄影基础或特定器材</span>
                    <span className="block">3. 请仔细阅读活动详情，符合条件再报名</span>
                  </div>
                </li>
                {event.notes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center text-[#B8C6D8]">
                    <i className="fa-solid fa-circle-exclamation text-[#6B7C93] mr-2"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 导师信息 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">导师信息</h2>
              <div className="flex items-center mb-4">
                <img
                  src={event.instructor.avatar}
                  alt={event.instructor.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]"
                />
                <div>
                  <h3 className="font-bold text-[#F5F7FA]">{event.instructor.name}</h3>
                  <p className="text-sm text-[#4A5F8B]">{event.instructor.title}</p>
                  <p className="text-xs text-[#B8C6D8]">{event.instructor.experience}摄影经验</p>
                </div>
              </div>
              <button className="w-full py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
                查看导师主页
              </button>
            </div>

            {/* 活动日历 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">活动日历</h2>
              <div className="p-4 bg-[#1E2532] rounded-lg text-center">
                <div className="text-sm text-[#B8C6D8] mb-1">
                  {event.date.split(' ')[0]}
                </div>
                <div className="text-4xl font-bold text-[#4A5F8B]">
                  {new Date(event.date.split(' ')[0]).getDate()}
                </div>
                <div className="text-sm text-[#B8C6D8]">
                  {['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(event.date.split(' ')[0]).getMonth()]}
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
                添加到日历
              </button>
            </div>

            {/* 分享 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">分享活动</h2>
              <div className="grid grid-cols-4 gap-3">
                <button className="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-brands fa-weixin text-xl"></i>
                </button>
                <button className="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-brands fa-weibo text-xl"></i>
                </button>
                <button className="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-brands fa-qq text-xl"></i>
                </button>
                <button className="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-solid fa-link text-xl"></i>
                </button>
              </div>
            </div>

            {/* 常见问题 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">常见问题</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#F5F7FA] mb-1">如何确认是否报名成功？</h3>
                  <p className="text-sm text-[#B8C6D8]">报名成功后，系统将发送确认邮件和短信到您的注册邮箱和手机，请注意查收。</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#F5F7FA] mb-1">如何申请退款？</h3>
                  <p className="text-sm text-[#B8C6D8]">活动开始前7天可申请全额退款，7天内申请退款将收取30%手续费。</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#F5F7FA] mb-1">活动当天需要携带什么物品？</h3>
                  <p className="text-sm text-[#B8C6D8]">请携带身份证、摄影器材、充电器、充电宝等个人物品，具体请参考"注意事项"。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 报名表单弹窗 */}
      {showRegistrationForm && (
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
              <h3 className="text-xl font-bold text-[#F5F7FA]">报名活动：{event.title}</h3>
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
                <div className="text-[#B8C6D8] text-sm">活动费用: <span className="font-bold text-[#F5F7FA]">
                    {event.price === 0 ? '免费' : `¥${event.price}`}
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
};

export default EventDetail;