import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';
import { apiGet } from '../lib/api';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const data = await apiGet(`/events/${id}`);
        if (data) setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event detail:', err);
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
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">未找到该活动</h2>
          <p className="text-text-muted mb-6 max-w-md">抱歉，您访问的活动不存在或已被删除</p>
          <Link to="/offline-events" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-dark-hover transition-colors">
            返回活动列表
          </Link>
             </div>
             
             {/* 评论区 */}
             <div className="bg-card rounded-xl p-6 border border-accent mt-8">
               <CommentSection postId={event.id} />
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
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/offline-events"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回活动列表</span>
          </Link>
        </div>

        {/* 活动主图 */}
        <div className="relative rounded-xl overflow-hidden mb-8 bg-card border border-accent">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-accent text-text-primary text-sm rounded-full">
                {event.type}
              </span>
              <span className="px-3 py-1 bg-card text-text-primary text-sm rounded-full">
                {event.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
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
        <div className="flex flex-col sm:flex-row justify-between items-center bg-card rounded-xl p-6 mb-8 border border-accent">
          <div>
            <h3 className="text-lg font-medium text-text-muted mb-1">活动费用</h3>
            <p className="text-3xl font-bold text-text-primary">
              {event.price === 0 ? '免费' : `¥${event.price}`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center text-sm text-text-muted">
              <i className="fa-solid fa-user-group mr-2 text-accent"></i>
              <span>已有 {event.participants} 人报名 / 限 {event.maxParticipants} 人</span>
            </div>
             <div className="flex flex-col">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegister}
                className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
              >
                <i className="fa-solid fa-calendar-plus mr-2"></i> 立即报名
              </motion.button>
              <p className="text-xs text-text-muted mt-1 text-center">
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
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">活动详情</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-text-muted leading-relaxed">
                  {event.description}
                </p>
              </div>
              
              {/* 活动标签 */}
              <div className="flex flex-wrap gap-2 mt-6">
                {event.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-deep text-text-muted rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 行程安排 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">行程安排</h2>
              <div className="space-y-4">
                {event.itinerary.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用包含/不包含 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border border-accent">
                <h3 className="text-lg font-bold text-text-primary mb-4">费用包含</h3>
                <ul className="space-y-2">
                  {event.inclusion.map((item: string, index: number) => (
                    <li key={index} className="flex items-center text-text-muted">
                      <i className="fa-solid fa-check-circle text-accent mr-2"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-accent">
                <h3 className="text-lg font-bold text-text-primary mb-4">费用不包含</h3>
                <ul className="space-y-2">
                  {event.exclusion.map((item: string, index: number) => (
                    <li key={index} className="flex items-center text-text-muted">
                      <i className="fa-solid fa-times-circle text-accent-hover mr-2"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

             {/* 注意事项 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">注意事项</h2>
              <ul className="space-y-2">
                {/* 添加报名条件提示 */}
                <li className="flex items-center text-text-muted bg-accent/10 p-3 rounded-lg border border-accent/30">
                  <i className="fa-solid fa-circle-info text-accent mr-3 text-lg"></i>
                  <div>
                    <span className="font-medium text-text-primary block mb-1">报名条件：</span>
                    <span className="block">1. 需登录账号</span>
                    <span className="block">2. 部分活动可能需要摄影基础或特定器材</span>
                    <span className="block">3. 请仔细阅读活动详情，符合条件再报名</span>
                  </div>
                </li>
                {event.notes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center text-text-muted">
                    <i className="fa-solid fa-circle-exclamation text-accent-hover mr-2"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 导师信息 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">导师信息</h2>
              <div className="flex items-center mb-4">
                <img
                  src={event.instructor.avatar}
                  alt={event.instructor.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-accent"
                />
                <div>
                  <h3 className="font-bold text-text-primary">{event.instructor.name}</h3>
                  <p className="text-sm text-accent">{event.instructor.title}</p>
                  <p className="text-xs text-text-muted">{event.instructor.experience}摄影经验</p>
                </div>
              </div>
              <button className="w-full py-2 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent text-sm">
                查看导师主页
              </button>
            </div>

            {/* 活动日历 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">活动日历</h2>
              <div className="p-4 bg-deep rounded-lg text-center">
                <div className="text-sm text-text-muted mb-1">
                  {event.date.split(' ')[0]}
                </div>
                <div className="text-4xl font-bold text-accent">
                  {new Date(event.date.split(' ')[0]).getDate()}
                </div>
                <div className="text-sm text-text-muted">
                  {['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(event.date.split(' ')[0]).getMonth()]}
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent text-sm">
                添加到日历
              </button>
            </div>

            {/* 分享 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">分享活动</h2>
              <div className="grid grid-cols-4 gap-3">
                <button className="w-full h-12 bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                  <i className="fa-brands fa-weixin text-xl"></i>
                </button>
                <button className="w-full h-12 bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                  <i className="fa-brands fa-weibo text-xl"></i>
                </button>
                <button className="w-full h-12 bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                  <i className="fa-brands fa-qq text-xl"></i>
                </button>
                <button className="w-full h-12 bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                  <i className="fa-solid fa-link text-xl"></i>
                </button>
              </div>
            </div>

            {/* 常见问题 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">常见问题</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-text-primary mb-1">如何确认是否报名成功？</h3>
                  <p className="text-sm text-text-muted">报名成功后，系统将发送确认邮件和短信到您的注册邮箱和手机，请注意查收。</p>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">如何申请退款？</h3>
                  <p className="text-sm text-text-muted">活动开始前7天可申请全额退款，7天内申请退款将收取30%手续费。</p>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">活动当天需要携带什么物品？</h3>
                  <p className="text-sm text-text-muted">请携带身份证、摄影器材、充电器、充电宝等个人物品，具体请参考"注意事项"。</p>
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
            className="bg-card rounded-xl border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-accent">
              <h3 className="text-xl font-bold text-text-primary">报名活动：{event.title}</h3>
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
                <div className="text-text-muted text-sm">活动费用: <span className="font-bold text-text-primary">
                    {event.price === 0 ? '免费' : `¥${event.price}`}
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
};

export default EventDetail;