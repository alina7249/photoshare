import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { apiGet } from '../lib/api';

// 饼图数据处理
const getPieChartData = (membershipData: any) => {
  if (!membershipData?.growthSystem?.usageChartData) return { data: [], COLORS: [] };
  const data = membershipData.growthSystem.usageChartData.map((item: any) => ({
    name: item.name,
    value: item.used,
    fullValue: item.total
  }));
  
  const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391', '#B8C6D8'];
  
  return { data, COLORS };
};

const ProfileBenefits: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [membershipData, setMembershipData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentMonth, setCurrentMonth] = useState(11); // 当前是11月
  const [showChatModal, setShowChatModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showClaimedRewards, setShowClaimedRewards] = useState(false);

  useEffect(() => {
    apiGet('/membership').then(setMembershipData).catch(console.error);
  }, []);
  
  const { data, COLORS } = getPieChartData(membershipData);
  
  // 计算已获得和可获得的成长值
  const totalPoints = membershipData?.growthBenefits?.growthHistory?.reduce((sum: number, item: any) => sum + item.points, 0) ?? 0;
  const totalAvailableRewardsPoints = membershipData?.growthBenefits?.availableRewards
    ?.filter((reward: any) => reward.available)
    ?.reduce((sum: number, reward: any) => sum + reward.points, 0) ?? 0;
  
  // 过滤奖励
  const getFilteredRewards = () => {
    return membershipData?.growthBenefits?.availableRewards?.filter((reward: any) => {
      if (showClaimedRewards) {
        return true;
      }
      return reward.available;
    }) ?? [];
  };
  
  const filteredRewards = getFilteredRewards();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
          <p className="text-text-muted mb-6 max-w-md">登录后查看您的会员等级和专属权益</p>
          <Link to="/login" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-accent"></i>
          </div>
          <p className="text-text-muted">加载中...</p>
        </div>
      </div>
    );
  }

  // 复制邀请码功能
  const copyReferralCode = () => {
    navigator.clipboard.writeText(membershipData.growthSystem.referralProgram.currentUser.referralCode);
    toast.success("邀请码已复制到剪贴板");
  };
  
  // 复制邀请链接功能
  const copyReferralLink = () => {
    navigator.clipboard.writeText(membershipData.growthSystem.referralProgram.currentUser.referralLink);
    toast.success("邀请链接已复制到剪贴板");
  };
  
  // 分享到社交媒体
  const shareToSocial = (platform: string) => {
    const url = membershipData.growthSystem.referralProgram.currentUser.referralLink;
    const text = `加入摄影社区，使用我的邀请码 ${membershipData.growthSystem.referralProgram.currentUser.referralCode} 注册，我们都能获得奖励！`;
    
    switch (platform) {
      case 'wechat':
        toast.info("请手动分享到微信");
        break;
      case 'weibo':
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        window.open(weiboUrl, '_blank');
        break;
      case 'qq':
        const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        window.open(qqUrl, '_blank');
        break;
      default:
        break;
    }
  };

  // 发送客服消息
  const sendChatMessage = () => {
    if (newNote.trim()) {
      toast.success("消息已发送，客服将尽快回复");
      setNewNote("");
    } else {
      toast.warning("请输入您的问题");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link to="/profile-center" className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">会员权益</h1>
          <p className="text-text-muted max-w-2xl mx-auto">查看您的会员等级、专属权益和成长进度</p>
        </div>

        {/* 会员信息卡片 */}
        <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-lg mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-crown text-3xl text-text-primary"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{membershipData.currentPlan.name}</h2>
                  <p className="text-text-primary">有效期至：{membershipData.currentPlan.endDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">{membershipData.currentPlan.daysLeft}</span>
                  <span className="text-text-primary">天剩余</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">LV.{membershipData.currentPlan.level}</span>
                  <span className="text-text-primary">会员等级</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3 md:items-end">
                <button 
                  className="px-6 py-3 bg-text-primary text-accent rounded-lg font-medium hover:bg-white transition-colors shadow-md"
                  onClick={() => {
                    toast.info("即将跳转到续费页面");
                    setTimeout(() => window.location.href = `/membership/pay?level=${membershipData.currentPlan.level}`, 800);
                  }}
                >
                  立即续费
                </button>
                <button 
                  className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors"
                  onClick={() => {
                    toast.info("即将跳转到升级页面");
                    setTimeout(() => window.location.href = `/membership/pay?level=${membershipData.currentPlan.level}`, 800);
                  }}
                >
                  升级会员
                </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-bg-card rounded-xl p-1 mb-8 flex flex-wrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "overview" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "benefits" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            会员权益
          </button>
          <button
            onClick={() => setActiveTab("upgrade")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "upgrade" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            等级提升
          </button>
          <button
            onClick={() => setActiveTab("growth")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "growth" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            成长福利
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "billing" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            账单管理
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "calendar" ? "bg-accent text-text-primary font-medium" : "text-text-muted hover:text-text-primary"}`}
          >
            活动日历
          </button>
        </div>

        {/* 内容区域 */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧栏 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 使用统计 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">使用统计</h3>
                <div className="space-y-4">
                  {Object.entries(membershipData.usageStats).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-text-muted">{key}</span>
                        <span className="text-sm text-accent">{value.used}/{value.total}</span>
                      </div>
                      <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${(value.used / value.total) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 当前订阅 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">当前订阅</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">会员等级</span>
                    <span className="text-sm text-text-muted font-medium">LV.{membershipData.currentPlan.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">订阅计划</span>
                    <span className="text-sm text-text-muted font-medium">{membershipData.currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">开始日期</span>
                    <span className="text-sm text-text-muted">{membershipData.currentPlan.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">结束日期</span>
                    <span className="text-sm text-text-muted">{membershipData.currentPlan.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">支付方式</span>
                    <span className="text-sm text-text-muted">{membershipData.currentPlan.paymentFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">下次付款</span>
                    <span className="text-sm text-text-muted">¥{membershipData.currentPlan.price}</span>
                  </div>
                </div>
                 <button className="w-full mt-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors border border-accent"
                         onClick={() => toast.info("管理订阅功能即将上线")}>
                   管理订阅
                 </button>
              </div>

              {/* 会员专属客服 */}
              <motion.div 
                className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm text-white"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fa-solid fa-headset mr-2"></i>会员专属客服
                </h3>
                <p className="text-sm mb-4">获得优先的技术支持，专业摄影顾问一对一解答问题</p>
                <button 
                  className="w-full py-3 bg-white text-accent rounded-lg font-medium hover:bg-text-primary transition-colors flex items-center justify-center"
                  onClick={() => setShowChatModal(true)}
                >
                  <i className="fa-solid fa-comments mr-2"></i>立即咨询
                </button>
              </motion.div>
            </div>

            {/* 右侧主内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 权益使用统计可视化 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">权益使用统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={membershipData.growthSystem.usageChartData}>
                        <XAxis dataKey="name" stroke="#B8C6D8" />
                        <YAxis stroke="#B8C6D8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1E2532", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                        />
                        <Bar dataKey="used" name="已使用" fill="#4A5F8B" />
                        <Bar dataKey="total" name="总量" fill="#6B7C93" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1E2532", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                          formatter={(value, name, props) => [`${value}/${props.payload.fullValue}`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 您的专属特权 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">您的专属特权</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {membershipData.benefits.active.slice(0, 4).map(benefit => (
                    <div key={benefit.id} className="flex items-start p-4 bg-bg-deep rounded-lg"><div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0"><i className={`fa-solid ${benefit.icon}`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-muted mb-1">{benefit.name}</h4>
                          <p className="text-sm text-text-muted mb-1">{benefit.description}</p>
                          {benefit.count && <span className="text-xs text-accent font-medium">{benefit.count}</span>}
                        </div>
                      </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="inline-flex items-center text-sm text-accent hover:underline transition-colors">
                    <span>查看全部会员特权</span>
                    <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>

              {/* 专属内容预览 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">专属内容预览</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {membershipData.growthSystem.exclusiveContent.map(content => (
                    <motion.div
                      key={content.id}
                      whileHover={{ y: -5, boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)" }}
                      className="bg-bg-deep rounded-xl overflow-hidden border border-accent"
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={content.image} 
                          alt={content.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-text-muted mb-2">{content.title}</h4>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">{content.description}</p>
                         <button className="w-full py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors text-sm"
                                 onClick={() => toast.info("课程详情即将显示")}>
                           了解详情
                         </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 推荐套餐 */}
              <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-muted mb-4">推荐套餐</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {membershipData.availablePlans.map(plan => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5, boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)" }}
                      className={`rounded-xl overflow-hidden border transition-all ${plan.recommended ? "border-accent bg-bg-deep relative" : "border-accent bg-bg-deep"}`}
                    >
                      {plan.recommended && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-accent text-text-primary text-xs px-3 py-1 font-medium rounded-bl-lg">
                            推荐
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-text-muted mb-2">{plan.name}</h4>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-accent">¥{plan.price}</span>
                          <span className="text-text-muted ml-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <i className="fa-solid fa-check text-accent mr-2 mt-0.5 flex-shrink-0"></i>
                              <span className="text-text-muted">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${plan.recommended ? "bg-accent text-text-primary hover:bg-light-accent" : "bg-accent text-text-primary hover:bg-light-accent border border-accent"}`}
                        >
                          {plan.id === 2 ? "当前套餐" : "立即订阅"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 会员权益标签页 */}
        {activeTab === "benefits" && (
          <div className="space-y-8">
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold text-text-muted mb-4">当前可用权益</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membershipData.benefits.active.map(benefit => (
                  <div key={benefit.id} className="flex items-start p-4 bg-bg-deep rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                      <i className={`fa-solid ${benefit.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-muted mb-1">{benefit.name}</h4>
                      <p className="text-sm text-text-muted mb-2">{benefit.description}</p>
                      <div className="flex justify-between items-center">
                        {benefit.count && <span className="text-xs text-accent font-medium">{benefit.count}本月</span>}
                         <button className="text-xs px-3 py-1 bg-accent text-text-primary rounded-full hover:bg-light-accent transition-colors"
                                 onClick={() => toast.success(`已使用${benefit.name}`)}>
                           立即使用
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold text-text-muted mb-4">即将解锁权益</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {membershipData.benefits.upcoming.map(benefit => (
                  <div key={benefit.id} className="flex flex-col p-4 bg-bg-deep rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                        <i className={`fa-solid ${benefit.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-muted">{benefit.name}</h4>
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-text-muted rounded-full">
                          LV.{benefit.level}解锁
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{benefit.description}</p>
                    <button className="mt-auto py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors border border-accent text-sm">
                      了解更多
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 会员成长体系 */}
        {activeTab === "upgrade" && (
          <div className="space-y-8">
            {/* 等级晋升路径 */}
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold text-text-muted mb-6">会员成长体系</h3>
              
              <div className="relative">
                {/* 连接线 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent hidden md:block"></div>
                
                <div className="space-y-6">
                  {membershipData.growthSystem.levels.map((level, index) => (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex md:items-center p-4 rounded-lg border ${level.isCurrent ? "bg-accent/20 border-accent" : "bg-bg-deep border-accent"}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold z-10 mb-4 md:mb-0 ${level.isCurrent ? "bg-accent text-white" : "bg-bg-deep text-accent border border-accent"}`}>
                        <i className={`fa-solid ${level.icon}`}></i>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex flex-wrap justify-between items-center mb-1">
                          <h4 className={`font-bold ${level.isCurrent ? "text-white" : "text-text-muted"}`}>
                            LV.{level.level} - {level.name}
                          </h4>
                          <span className="text-sm font-medium text-accent">{level.price}</span>
                        </div>
                        <p className="text-sm text-text-muted">{level.description}</p>
                      </div>
                      
                      {level.isCurrent && (
                        <span className="ml-4 px-3 py-1 bg-accent text-white text-xs rounded-full hidden md:block">
                          当前等级
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 升级任务 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-muted mb-4">当前等级</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center relative">
                      <span className="text-3xl font-bold text-accent">
                        LV.{membershipData.currentPlan.level}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-deep rounded-b-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-text-muted mb-1">{membershipData.currentPlan.name}</h4>
                    <p className="text-sm text-text-muted">距离升级还需完成以下任务</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-muted mb-4">
                    升级至 {membershipData.nextLevel.name}(LV.{membershipData.nextLevel.level})
                  </h3>
                  <div className="space-y-4">
                    {membershipData.nextLevel.requirements.map(req => (
                      <div key={req.id} className="p-4 bg-bg-deep rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${req.completed ? "bg-accent text-text-primary" : "bg-bg-deep text-text-muted border border-accent"}`}
                            >
                              {req.completed ? <i className="fa-solid fa-check"></i> : <span>{req.id}</span>}
                            </div>
                            <span className="text-text-muted">{req.name}</span>
                          </div>
                          {req.completed ? (
                            <span className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">已完成</span>
                          ) : (
                            <span className="px-3 py-1 bg-bg-deep text-text-muted text-xs rounded-full border border-accent">进行中</span>
                          )}
                        </div>
                        {!req.completed && req.progress !== undefined && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-text-muted">进度</span>
                              <span className="text-xs text-accent">{req.progress}/{req.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${(req.progress / req.total) * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-2 text-right">
                              <button className="text-xs text-accent hover:underline transition-colors">
                                去完成 <i className="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors shadow-md inline-flex items-center">
                      <i className="fa-solid fa-rocket mr-2"></i>加速升级
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 成长福利标签页 */}
        {activeTab === "growth" && (
          <div className="space-y-8">
            {/* 等级卡片 */}
            <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-lg mb-8 text-text-primary">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                {/* 左侧信息 */}
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <i className="fa-solid fa-trophy text-3xl text-text-primary"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{membershipData.growthBenefits.currentLevel.name}</h2>
                      <p className="text-text-primary/80">LV.{membershipData.growthBenefits.currentLevel.level}</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-accent" 
                      style={{ width: `${(membershipData.growthBenefits.currentLevel.progress / membershipData.growthBenefits.currentLevel.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>成长值: {membershipData.growthBenefits.currentLevel.progress}/{membershipData.growthBenefits.currentLevel.maxProgress}</span>
                    <span>距离升级还需: {membershipData.growthBenefits.currentLevel.maxProgress - membershipData.growthBenefits.currentLevel.progress}点</span>
                  </div>
                </div>
                
                {/* 右侧统计 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold mb-1">{totalPoints}</p>
                    <p className="text-sm text-text-primary/80">总成长值</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold mb-1">{Object.keys(membershipData.growthBenefits.completedTasks).length}</p>
                    <p className="text-sm text-text-primary/80">已完成任务</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 标签页导航 */}
            <div className="bg-bg-card rounded-xl p-1 mb-8 flex flex-wrap">
              <button
                onClick={() => setActiveTab('growth')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'growth'
                    ? 'bg-accent text-text-primary font-medium'
                    : 'bg-bg-card text-text-muted hover:text-text-primary'
                }`}
              >
                成长记录
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'rewards'
                    ? 'bg-accent text-text-primary font-medium'
                    : 'bg-bg-card text-text-muted hover:text-text-primary'
                }`}
              >
                福利兑换
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-accent text-text-primary font-medium'
                    : 'bg-bg-card text-text-muted hover:text-text-primary'
                }`}
              >
                任务中心
              </button>
              <button
                onClick={() => setActiveTab('referral')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'referral'
                    ? 'bg-accent text-text-primary font-medium'
                    : 'bg-bg-card text-text-muted hover:text-text-primary'
                }`}
              >
                推荐奖励
              </button>
            </div>

            {/* 成长记录 */}
            {activeTab === 'growth' && (
              <div className="space-y-8">
                {/* 成长值记录 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">成长值记录</h3>
                  <div className="space-y-4">
                    {membershipData.growthBenefits.growthHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-bg-deep rounded-lg border border-accent hover:border-accent hover:border-2 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4">
                            <i className="fa-solid fa-plus-circle"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{item.action}</h4>
                            <p className="text-sm text-text-muted">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-accent-hover font-bold">+{item.points}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 分页 */}
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center space-x-1 bg-bg-deep p-2 rounded-lg border border-accent">
                      <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                      </button>
                      <button className="px-3 py-2 rounded border border-accent bg-accent text-text-primary">1</button>
                      <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* 升级指南模块 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">升级指南</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                        <i className="fa-solid fa-chart-line"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">如何获得成长值？</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
                          <li>发布优质作品并获得点赞和收藏</li>
                          <li>参加摄影比赛和线上活动</li>
                          <li>完成新手任务和日常任务</li>
                          <li>邀请好友注册并活跃</li>
                          <li>发表高质量评论和互动</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                        <i className="fa-solid fa-gift"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">升级有什么好处？</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
                          <li>解锁更多高级功能和特权</li>
                          <li>获得专属的徽章和标识</li>
                          <li>作品获得更多曝光和推荐机会</li>
                          <li>参与独家活动和线下聚会</li>
                          <li>获得专业摄影师的指导和点评</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                        <i className="fa-solid fa-rocket"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary mb-1">加速升级的技巧</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
                          <li>保持每周至少发布1篇优质作品</li>
                          <li>积极参与社区互动，评论和点赞他人作品</li>
                          <li>加入摄影小组，与其他摄影师交流学习</li>
                          <li>参加平台组织的各类线上线下活动</li>
                          <li>分享您的作品到社交媒体，吸引更多关注</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 福利兑换 */}
            {activeTab === 'rewards' && (
              <div className="space-y-8">
                {/* 福利兑换 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-text-primary">可兑换福利</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-text-muted mr-2">显示已兑换:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={showClaimedRewards}
                          onChange={() => setShowClaimedRewards(!showClaimedRewards)}
                        />
                        <div className="w-9 h-5 bg-bg-deep peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                        className={`bg-bg-deep rounded-xl overflow-hidden border transition-all ${
                          reward.available 
                            ? 'border-accent' 
                            : 'border-accent/50 opacity-80'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={reward.image}
                            alt={reward.name}
                            className="w-full h-36 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 bg-accent/80 text-text-primary text-xs rounded-full flex items-center`}>
                              <i className="fa-solid fa-coins mr-1"></i>
                              {reward.points}
                            </span>
                          </div>
                          {!reward.available && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium">已兑换</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5">
                          <h4 className="font-bold text-text-primary mb-2">{reward.name}</h4>
                          <p className="text-sm text-text-muted mb-4">{reward.description}</p>
                          
                          <div className="flex justify-between items-center">
                            {reward.available ? (
                              <button 
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  totalPoints >= reward.points
                                    ? 'bg-accent text-text-primary hover:bg-light-accent'
                                    : 'bg-accent-hover text-text-muted cursor-not-allowed'
                                }`}
                                disabled={totalPoints < reward.points}
                              >
                                立即兑换
                              </button>
                            ) : (<span className="text-sm text-text-muted">兑换时间: 2023-10-15
                              </span>
                            )}
                            <div className={`text-sm font-medium ${
                              totalPoints >= reward.points && reward.available
                                ? 'text-accent'
                                : 'text-[#ED8936]'
                            }`}>
                              {reward.available && totalPoints < reward.points && `还需${reward.points - totalPoints}点`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredRewards.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                        <i className="fa-solid fa-gift text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">暂无可用福利</h3>
                      <p className="text-sm text-text-muted">
                        继续活跃获取更多成长值，解锁更多福利
                      </p>
                    </div>
                  )}
                </div>

                {/* 兑换记录 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">兑换记录</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-accent">
                          <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">福利名称</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">消耗积分</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">兑换时间</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">状态</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-accent">
                          <td className="px-4 py-4 text-sm text-text-muted">基础后期预设包</td>
                          <td className="px-4 py-4 text-sm text-text-muted">50</td>
                          <td className="px-4 py-4 text-sm text-text-muted">2023-10-10</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">已完成</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-sm text-accent hover:underline transition-colors">查看详情</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 text-sm text-text-muted">RAW素材下载券</td>
                          <td className="px-4 py-4 text-sm text-text-muted">80</td>
                          <td className="px-4 py-4 text-sm text-text-muted">2023-09-25</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">已完成</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-sm text-accent hover:underline transition-colors">查看详情</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 任务中心 */}
            {activeTab === 'tasks' && (
              <div className="space-y-8">
                {/* 进行中任务 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">进行中任务</h3>
                  <div className="space-y-4">
                    {membershipData.growthBenefits.ongoingTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-bg-deep rounded-lg border border-accent">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-bg-deep text-accent border border-accent flex items-center justify-center mr-3 flex-shrink-0">
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-text-primary">{task.name}</h4>
                              <p className="text-sm text-text-muted mt-1">{task.description}</p>
                            </div>
                          </div>
                          <div className="text-accent font-bold flex items-center">
                            <i className="fa-solid fa-coins mr-1"></i>
                            {task.points}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-muted">进度</span>
                            <span className="text-xs text-accent">{task.progress}/{task.total}</span>
                          </div>
                          <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden border border-accent">
                            <div 
                              className="h-full bg-accent" 
                              style={{ width: `${(task.progress / task.total) * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-right">
                            <button className="text-xs text-accent hover:underline transition-colors">
                              去完成 <i className="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 已完成任务 */}
                <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">已完成任务</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {membershipData.growthBenefits.completedTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-bg-deep rounded-lg border border-accent flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4">
                            <i className="fa-solid fa-check"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{task.name}</h4>
                            <p className="text-sm text-text-muted">{task.description}</p>
                          </div>
                        </div>
                        <div className="text-accent font-bold">+{task.points}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

               {/* 会员推荐奖励 */}
              {activeTab === "referral" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                    <h3 className="text-lg font-bold text-text-muted mb-4">推荐奖励计划</h3>
                    <p className="text-sm text-text-muted mb-6">邀请好友加入会员，您和好友都能获得丰厚奖励</p>
                    
                    <div className="bg-bg-deep rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium text-text-muted mb-3">我的邀请码</h4>
                      <div className="flex items-center justify-between bg-bg-card p-3 rounded-lg">
                        <span className="font-mono text-text-muted">{membershipData.growthSystem.referralProgram.currentUser.referralCode}</span>
                        <button 
                          className="px-3 py-1 bg-accent text-text-primary rounded-lg hover:bg-light-accent transition-colors text-sm"
                          onClick={copyReferralCode}
                        >
                          复制
                        </button>
                      </div>
                    </div>

                    <div className="bg-bg-deep rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium text-text-muted mb-3">我的邀请链接</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg-card p-3 rounded-lg space-y-3 sm:space-y-0">
                        <span className="font-mono text-text-muted text-sm truncate flex-1">
                          {membershipData.growthSystem.referralProgram.currentUser.referralLink}
                        </span>
                        <button 
                          className="px-3 py-1 bg-accent text-text-primary rounded-lg hover:bg-light-accent transition-colors text-sm whitespace-nowrap"
                          onClick={copyReferralLink}
                        >
                          复制链接
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-muted">总邀请人数</span>
                        <span className="font-medium text-accent">{membershipData.growthSystem.referralProgram.currentUser.totalInvites}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-muted">成功开通会员</span>
                        <span className="font-medium text-accent">{membershipData.growthSystem.referralProgram.currentUser.successfulInvites}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-muted">待确认邀请</span>
                        <span className="font-medium text-accent">{membershipData.growthSystem.referralProgram.currentUser.pendingInvites}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-text-muted mb-3">已获得奖励</h4>
                      <div className="space-y-3">
                        {membershipData.growthSystem.referralProgram.currentUser.rewards.map(reward => (
                          <div key={reward.id} className="flex justify-between items-center p-3 bg-bg-deep rounded-lg">
                            <div>
                              <span className="text-sm text-text-muted">{reward.name}</span>
                              {reward.date && (
                                <span className="text-xs text-accent-hover ml-2">({reward.date})</span>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              reward.status === "已获得" ? "bg-accent/20 text-accent" : "bg-accent-hover/20 text-accent-hover"
                            }`}>
                              {reward.status} {reward.requirement && `(${reward.requirement})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
                    <h3 className="text-lg font-bold text-text-muted mb-4">奖励等级</h3>
                    
                    <div className="space-y-6">
                      {membershipData.growthSystem.referralProgram.rewardTiers.map((tier, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            index < membershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                              ? "bg-accent/20 border-accent" 
                              : "bg-bg-deep border-accent"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 ${
                              index < membershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                                ? "bg-accent" 
                                : "bg-bg-deep border border-accent"
                            }`}>
                              {tier.invites}
                            </div>
                            <div>
                              <h4 className={`font-medium ${
                                index < membershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                                  ? "text-white" 
                                  : "text-text-muted"
                              }`}>
                                邀请{membershipData.growthSystem.referralProgram.currentUser.successfulInvites >= tier.invites ? "已完成" : `${tier.invites}位好友`}
                              </h4>
                              <p className="text-sm text-text-muted">{tier.reward}</p>
                              <p className="text-xs text-accent-hover">{tier.description}</p>
                            </div>
                          </div>
                          {index < membershipData.growthSystem.referralProgram.currentUser.successfulInvites && (
                            <span className="text-accent">
                              <i className="fa-solid fa-check-circle text-lg"></i>
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-text-muted mb-3">分享邀请</h4>
                      <div className="flex justify-center space-x-4 mb-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('wechat')}
                          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-primary hover:bg-light-accent transition-colors"
                        >
                          <i className="fa-brands fa-weixin"></i>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('weibo')}
                          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-primary hover:bg-light-accent transition-colors"
                        >
                          <i className="fa-brands fa-weibo"></i>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('qq')}
                          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-primary hover:bg-light-accent transition-colors"
                        >
                          <i className="fa-brands fa-qq"></i>
                        </motion.button>
                      </div>
                      
                      <button className="w-full py-3 bg-gradient-to-r from-accent to-accent-hover text-white rounded-lg font-medium hover:from-accent-hover hover:to-accent transition-all shadow-md flex items-center justify-center">
                        <i className="fa-solid fa-share-alt mr-2"></i>立即分享邀请
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* 账单管理标签页 */}
        {activeTab === "billing" && (
          <div className="space-y-8">
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-muted">支付方式</h3>
                <button className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-light-accent transition-colors border border-accent text-sm">
                  添加支付方式
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-deep rounded-lg border-2 border-accent">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4">
                      <i className="fa-credit-card"></i>
                    </div>
                    <div>
                      <p className="font-medium text-text-muted">支付宝</p>
                      <p className="text-sm text-text-muted">默认支付方式</p>
                    </div>
                  </div>
                  <button className="text-text-muted hover:text-accent transition-colors">
                    <i className="fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <h3 className="text-lg font-bold text-text-muted mb-6">交易记录</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-accent">
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">订单号</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">服务</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">金额</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">日期</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-accent">
                      <td className="px-4 py-4 text-sm text-text-muted">#20230615001</td>
                      <td className="px-4 py-4 text-sm text-text-muted">银河会员·年卡</td>
                      <td className="px-4 py-4 text-sm text-text-muted">¥299.00</td>
                      <td className="px-4 py-4 text-sm text-text-muted">2023-06-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-accent hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                    <tr className="border-b border-accent">
                      <td className="px-4 py-4 text-sm text-text-muted">#20230515002</td>
                      <td className="px-4 py-4 text-sm text-text-muted">银河会员·月卡</td>
                      <td className="px-4 py-4 text-sm text-text-muted">¥39.00</td>
                      <td className="px-4 py-4 text-sm text-text-muted">2023-05-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-accent hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm text-text-muted">#20230415003</td>
                      <td className="px-4 py-4 text-sm text-text-muted">银河会员·月卡</td>
                      <td className="px-4 py-4 text-sm text-text-muted">¥39.00</td>
                      <td className="px-4 py-4 text-sm text-text-muted">2023-04-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-accent hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-1 bg-bg-deep p-2 rounded-lg border border-accent">
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-accent bg-accent text-text-primary">1</button>
                  <button className="px-3 py-2 rounded border border-accent text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* 会员活动日历 */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="bg-bg-card rounded-xl p-6 shadow-sm border border-accent">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-muted">会员活动日历</h3>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-bg-deep text-text-muted rounded-lg hover:bg-accent hover:text-text-primary transition-colors"
                    onClick={() => setCurrentMonth(prev => Math.max(1, prev - 1))}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span className="px-3 py-1 bg-bg-deep text-text-muted rounded-lg">2023年{currentMonth}月</span>
                  <button 
                    className="px-3 py-1 bg-bg-deep text-text-muted rounded-lg hover:bg-accent hover:text-text-primary transition-colors"
                    onClick={() => setCurrentMonth(prev => Math.min(12, prev + 1))}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* 日历视图 */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["日", "一", "二", "三", "四", "五", "六"].map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-accent">
                    {day}
                  </div>
                ))}

                {/* 空白日期 */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-16"></div>
                ))}

                {/* 日期 */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const day = i + 1;
                  const hasEvent = [10, 15, 20, 25].includes(day);
                  return (
                    <div 
                      key={day} 
                      className={`p-2 h-16 rounded-lg border transition-colors relative ${
                        hasEvent ? "border-accent bg-accent/10 cursor-pointer hover:bg-accent/20" : "border-transparent hover:border-accent hover:bg-bg-deep"
                      }`}
                    >
                      <div className="text-center font-medium text-text-muted">{day}</div>
                      {hasEvent && (
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-accent rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 近期活动列表 */}
              <div>
                <h4 className="text-md font-medium text-text-muted mb-4">近期活动</h4>
                <div className="space-y-4">
                  {membershipData.growthSystem.events.map(event => (
                    <motion.div 
                      key={event.id}
                      whileHover={{ x: 5 }}
                      className="flex items-start p-4 bg-bg-deep rounded-lg border border-accent cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-accent text-white flex flex-col items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-lg font-bold">{event.date.split('-')[2]}</span>
                        <span className="text-xs">11月</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-text-muted">{event.title}</h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            event.type === "线下活动" ? "bg-accent/20 text-accent" : "bg-accent-hover/20 text-accent-hover"
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-text-muted">
                          <i className="fa-solid fa-map-marker-alt mr-2 text-accent"></i>
                          {event.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="inline-flex items-center text-sm text-accent hover:underline transition-colors">
                    <span>查看全部活动</span>
                    <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 会员专属客服聊天弹窗 */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-bg-deep rounded-xl border border-accent w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b border-accent">
              <h3 className="font-bold text-text-muted flex items-center">
                <i className="fa-solid fa-headset mr-2"></i>会员专属客服
              </h3>
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setShowChatModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <div className="bg-bg-card p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm text-text-muted">您好！我是您的专属客服，有什么可以帮助您的吗？</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-accent">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="输入您的问题..."
                  className="flex-1 px-4 py-2 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                />
                <button 
                  className="px-4 py-2 bg-accent text-text-primary rounded-lg hover:bg-light-accent transition-colors"
                  onClick={sendChatMessage}
                >
                  发送
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfileBenefits;