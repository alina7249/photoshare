import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

// 模拟会员数据
const mockMembershipData = {
  currentPlan: {
    name: "银河会员·年卡",
    level: "3",
    startDate: "2023-06-15",
    endDate: "2024-06-15",
    daysLeft: 128,
    price: "299",
    paymentFrequency: "年付"
  },
  nextLevel: {
    name: "星云会员",
    level: "4",
    requirements: [
      {
        id: 1,
        name: "连续开通会员6个月",
        completed: true
      },
      {
        id: 2,
        name: "发布10篇优质作品",
        completed: true
      },
      {
        id: 3,
        name: "获得500个收藏",
        completed: false,
        progress: 342,
        total: 500
      },
      {
        id: 4,
        name: "拥有100个粉丝",
        completed: false,
        progress: 72,
        total: 100
      }
    ]
  },
  benefits: {
    active: [
      {
        id: 1,
        name: "免费RAW素材下载",
        description: "每月可下载10个高质量RAW素材",
        icon: "fa-file-image",
        count: "10/10"
      },
      {
        id: 2,
        name: "赛事优先报名",
        description: "热门赛事提前3天报名资格",
        icon: "fa-trophy",
        count: null
      },
      {
        id: 3,
        name: "专属后期预设包",
        description: "10个专业摄影后期预设",
        icon: "fa-sliders-h",
        count: null
      },
      {
        id: 4,
        name: "免费在线课程",
        description: "每月2门会员专属摄影课程",
        icon: "fa-graduation-cap",
        count: "2/2"
      },
      {
        id: 5,
        name: "作品优先推荐",
        description: "作品在首页推荐几率提升50%",
        icon: "fa-star",
        count: null
      },
      {
        id: 6,
        name: "无水印导出",
        description: "在线编辑工具支持无水印导出",
        icon: "fa-image",
        count: null
      },
      {
        id: 7,
        name: "会员专属客服",
        description: "优先的技术支持通道，24小时响应",
        icon: "fa-headset",
        count: null
      }
    ],
    upcoming: [
      {
        id: 1,
        name: "专属客服通道",
        description: "1对1专属客服咨询服务",
        icon: "fa-headset",
        level: 4
      },
      {
        id: 2,
        name: "器材租赁优惠",
        description: "专业摄影器材租赁9折优惠",
        icon: "fa-video",
        level: 4
      },
      {
        id: 3,
        name: "线下活动免费",
        description: "每月1次免费参与线下摄影活动",
        icon: "fa-calendar-check",
        level: 5
      }
    ]
  },
  availablePlans: [
    {
      id: 1,
      name: "月卡",
      price: "39",
      period: "1个月",
      features: ["全部基础功能", "每月5个素材", "在线客服", "会员专属标识"]
    },
    {
      id: 2,
      name: "年卡",
      price: "299",
      period: "13个月",
      features: ["全部基础功能", "每月10个素材", "优先报名", "专属预设包", "免费课程", "作品优先推荐", "无水印导出", "会员专属客服"],
      recommended: true
    },
    {
      id: 3,
      name: "终身卡",
      price: "1999",
      period: "终身",
      features: ["全部高级功能", "无限素材下载", "专属客服", "器材租赁8折", "免费线下活动", "专属标识"]
    }
  ],
  usageStats: {
    "素材下载": {
      used: 8,
      total: 10
    },
    "课程学习": {
      used: 2,
      total: 2
    },
    "赛事报名": {
      used: 3,
      total: 10
    },
    "预设使用": {
      used: 5,
      total: 10
    }
  },
  // 会员成长体系详细数据
  growthSystem: {
    levels: [
      {
        level: 1,
        name: "入门会员",
        price: "免费",
        description: "基础功能访问权限，每月3个素材",
        icon: "fa-user",
        isCurrent: false
      },
      {
        level: 2,
        name: "进阶会员",
        price: "¥19/月",
        description: "扩展功能访问，每月5个素材",
        icon: "fa-user-plus",
        isCurrent: false
      },
      {
        level: 3,
        name: "银河会员",
        price: "¥39/月",
        description: "您当前的等级，每月10个素材，优先报名资格",
        icon: "fa-user-tie",
        isCurrent: true
      },
      {
        level: 4,
        name: "星云会员",
        price: "¥59/月",
        description: "高级功能访问，每月15个素材，专属客服",
        icon: "fa-user-edit",
        isCurrent: false
      },
      {
        level: 5,
        name: "宇宙会员",
        price: "¥99/月",
        description: "全部高级功能，无限素材下载，器材租赁优惠",
        icon: "fa-user-crown",
        isCurrent: false
      },
      {
        level: 6,
        name: "至尊会员",
        price: "¥199/月",
        description: "顶级会员特权，专属线下活动，一对一导师指导",
        icon: "fa-crown",
        isCurrent: false
      }
    ],
    // 会员专属内容预览数据
    exclusiveContent: [
      {
        id: 1,
        title: "风光摄影大师班",
        description: "由国际获奖摄影师亲自授课，学习专业风光拍摄技巧",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=professional%20landscape%20photography%20workshop%20banner%20mountain%20scenery&sign=0dafc8a260a28664bd392980e71a805c"
      },
      {
        id: 2,
        title: "高级后期修图工作流",
        description: "从RAW到成品的完整修图流程，掌握专业调色技巧",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photo%20editing%20workflow%20tutorial%20professional%20studio&sign=7e760f67fc2009a141b2828a5affabf7"
      },
      {
        id: 3,
        title: "商业摄影实战指南",
        description: "学习商业摄影的布光、构图和客户沟通技巧",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20photography%20studio%20setup%20lighting%20equipment&sign=1af5b7229aaeac89bfdec8f05214b754"
      }
    ],
    // 会员活动日历数据
    events: [
      {
        id: 1,
        title: "会员专属摄影沙龙·上海站",
        date: "2023-11-15",
        location: "上海·静安区",
        type: "线下活动"
      },
      {
        id: 2,
        title: "后期修图大师直播课",
        date: "2023-11-10",
        location: "线上直播",
        type: "线上活动"
      },
      {
        id: 3,
        title: "器材体验会·深圳站",
        date: "2023-11-20",
        location: "深圳·南山区",
        type: "线下活动"
      },
      {
        id: 4,
        title: "摄影大赛启动仪式",
        date: "2023-11-25",
        location: "线上直播",
        type: "线上活动"
      }
    ],
    // 权益使用统计数据（用于图表）
    usageChartData: [
      { name: "素材下载", used: 8, total: 10 },
      { name: "课程学习", used: 2, total: 2 },
      { name: "赛事报名", used: 3, total: 10 },
      { name: "预设使用", used: 5, total: 10 },
      { name: "客服咨询", used: 1, total: 3 }
    ],
  // 会员推荐奖励数据
  referralProgram: {
    currentUser: {
      referralCode: "PHOTOMASTER2023",
      referralLink: "https://photoshare.com/invite/PHOTOMASTER2023",
      totalInvites: 3,
      successfulInvites: 2,
      pendingInvites: 1,
      rewards: [
        { id: 1, name: "会员延长1个月", status: "已获得", date: "2023-09-15" },
        { id: 2, name: "RAW素材包1个", status: "已获得", date: "2023-10-02" },
        { id: 3, name: "高级预设包", status: "未获得", requirement: "再邀请1位好友" }
      ]
    },
    rewardTiers: [
      { invites: 1, reward: "RAW素材包1个", description: "包含20个高质量RAW格式风景照片素材" },
      { invites: 2, reward: "会员延长1个月", description: "当前会员有效期额外延长30天" },
      { invites: 5, reward: "高级预设包", description: "50个专业摄影后期Lightroom预设" },
      { invites: 10, reward: "线下活动免费券", description: "可免费参加1次平台组织的线下摄影活动" },
      { invites: 20, reward: "器材租赁8折券", description: "专业摄影器材租赁享受8折优惠" },
      { invites: 50, reward: "年度会员免费", description: "赠送一年高级会员资格" }
    ]
  }
  },
  // 成长福利数据
  growthBenefits: {
    currentLevel: {
      name: '新锐摄影师',
      level: 3,
      progress: 120,
      maxProgress: 200,
      joinDate: '2023-03-15',
    },
    growthHistory: [
      { date: '2023-10-25', action: '发布作品获得收藏', points: 15 },
      { date: '2023-10-22', action: '参加摄影比赛', points: 30 },
      { date: '2023-10-18', action: '作品获得点赞', points: 5 },
      { date: '2023-10-15', action: '完成新手任务', points: 20 },
      { date: '2023-10-10', action: '发布作品获得收藏', points: 10 },
      { date: '2023-10-05', action: '邀请好友注册', points: 20 },
    ],
    availableRewards: [
      { id: 'r1', name: '基础后期预设包', description: '10个专业摄影后期预设', points: 50, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20preset%20pack%20thumbnail%20photography%20editing&sign=e8c6e47f437ba890910bd7f636a11f1b', available: true },
      { id: 'r2', name: 'RAW素材下载券', description: '5个高质量RAW素材下载权限', points: 80, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=raw%20photo%20download%20voucher%20thumbnail&sign=05dbb388d7010c5c0355b7ca1fcf8775', available: true },
      { id: 'r3', name: '摄影课程折扣券', description: '线上摄影课程8折优惠', points: 100, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20course%20discount%20voucher%20thumbnail&sign=9ab6fe1c09a5f10cf322494fa9d02fdb', available: true },
      { id: 'r4', name: '高级会员体验卡', description: '7天高级会员免费体验', points: 150, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=premium%20membership%20trial%20card%20thumbnail%20gold%20glow&sign=1c989a761cbbc5239aefecefd0fb57bf', available: true },
      { id: 'r5', name: '专业器材租赁券', description: '专业相机镜头租赁一天免费', points: 200, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera%20equipment%20rental%20voucher%20thumbnail&sign=526fa89bffb356b8ee6de91d54131e4f', available: false },
      { id: 'r6', name: '线下活动免费券', description: '免费参加一次线下摄影活动', points: 250, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20event%20free%20ticket%20thumbnail&sign=603c66e6e40f8e7fb5a2c9abab507bff', available: false },
    ],
    completedTasks: [
      { id: 't1', name: '完善个人资料', description: '上传头像并填写个人简介', points: 10, completed: true },
      { id: 't2', name: '发布第一篇作品', description: '上传并发布您的第一篇摄影作品', points: 20, completed: true },
      { id: 't3', name: '关注5位摄影师', description: '关注5位您感兴趣的摄影师', points: 15, completed: true },
      { id: 't4', name: '收藏10篇作品', description: '收藏10篇您喜欢的摄影作品', points: 10, completed: true },
    ],
    ongoingTasks: [
      { id: 't5', name: '参加摄影比赛', description: '提交作品参加一次摄影比赛', points: 30, progress: 0, total: 1, completed: false },
      { id: 't6', name: '作品获得100赞', description: '您的作品累计获得100个点赞', points: 25, progress: 72, total: 100, completed: false },
      { id: 't7', name: '发布5篇优质作品', description: '上传并发布5篇获得推荐的优质作品', points: 50, progress: 2, total: 5, completed: false },
      { id: 't8', name: '邀请3位好友', description: '邀请3位好友注册并完成认证', points: 30, progress: 1, total: 3, completed: false },
    ]
  }
};

// 饼图数据处理
const getPieChartData = () => {
  const data = mockMembershipData.growthSystem.usageChartData.map(item => ({
    name: item.name,
    value: item.used,
    fullValue: item.total
  }));
  
  const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391', '#B8C6D8'];
  
  return { data, COLORS };
};

const ProfileBenefits: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentMonth, setCurrentMonth] = useState(11); // 当前是11月
  const [showChatModal, setShowChatModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showClaimedRewards, setShowClaimedRewards] = useState(false);
  
  const { data, COLORS } = getPieChartData();
  
  // 计算已获得和可获得的成长值
  const totalPoints = mockMembershipData.growthBenefits.growthHistory.reduce((sum, item) => sum + item.points, 0);
  const totalAvailableRewardsPoints = mockMembershipData.growthBenefits.availableRewards
    .filter(reward => reward.available)
    .reduce((sum, reward) => sum + reward.points, 0);
  
  // 过滤奖励
  const getFilteredRewards = () => {
    return mockMembershipData.growthBenefits.availableRewards.filter(reward => {
      if (showClaimedRewards) {
        return true;
      }
      return reward.available;
    });
  };
  
  const filteredRewards = getFilteredRewards();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的会员等级和专属权益</p>
          <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  // 复制邀请码功能
  const copyReferralCode = () => {
    navigator.clipboard.writeText(mockMembershipData.growthSystem.referralProgram.currentUser.referralCode);
    toast.success("邀请码已复制到剪贴板");
  };
  
  // 复制邀请链接功能
  const copyReferralLink = () => {
    navigator.clipboard.writeText(mockMembershipData.growthSystem.referralProgram.currentUser.referralLink);
    toast.success("邀请链接已复制到剪贴板");
  };
  
  // 分享到社交媒体
  const shareToSocial = (platform: string) => {
    const url = mockMembershipData.growthSystem.referralProgram.currentUser.referralLink;
    const text = `加入摄影社区，使用我的邀请码 ${mockMembershipData.growthSystem.referralProgram.currentUser.referralCode} 注册，我们都能获得奖励！`;
    
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
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link to="/profile-center" className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">会员权益</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">查看您的会员等级、专属权益和成长进度</p>
        </div>

        {/* 会员信息卡片 */}
        <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-crown text-3xl text-[#F5F7FA]"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{mockMembershipData.currentPlan.name}</h2>
                  <p className="text-[#F5F7FA]">有效期至：{mockMembershipData.currentPlan.endDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">{mockMembershipData.currentPlan.daysLeft}</span>
                  <span className="text-[#F5F7FA]">天剩余</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">LV.{mockMembershipData.currentPlan.level}</span>
                  <span className="text-[#F5F7FA]">会员等级</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3 md:items-end">
                <button 
                  className="px-6 py-3 bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-white transition-colors shadow-md"
                  onClick={() => {
                    toast.info("即将跳转到续费页面");
                    setTimeout(() => window.location.href = `/membership/pay?level=${mockMembershipData.currentPlan.level}`, 800);
                  }}
                >
                  立即续费
                </button>
                <button 
                  className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
                  onClick={() => {
                    toast.info("即将跳转到升级页面");
                    setTimeout(() => window.location.href = `/membership/pay?level=${mockMembershipData.currentPlan.level}`, 800);
                  }}
                >
                  升级会员
                </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "overview" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "benefits" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
          >
            会员权益
          </button>
          <button
            onClick={() => setActiveTab("upgrade")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "upgrade" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
          >
            等级提升
          </button>
          <button
            onClick={() => setActiveTab("growth")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "growth" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
          >
            成长福利
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "billing" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
          >
            账单管理
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "calendar" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "text-[#B8C6D8] hover:text-[#F5F7FA]"}`}
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
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">使用统计</h3>
                <div className="space-y-4">
                  {Object.entries(mockMembershipData.usageStats).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#B8C6D8]">{key}</span>
                        <span className="text-sm text-[#4A5F8B]">{value.used}/{value.total}</span>
                      </div>
                      <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4A5F8B]"
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
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">当前订阅</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">会员等级</span>
                    <span className="text-sm text-[#B8C6D8] font-medium">LV.{mockMembershipData.currentPlan.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">订阅计划</span>
                    <span className="text-sm text-[#B8C6D8] font-medium">{mockMembershipData.currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">开始日期</span>
                    <span className="text-sm text-[#B8C6D8]">{mockMembershipData.currentPlan.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">结束日期</span>
                    <span className="text-sm text-[#B8C6D8]">{mockMembershipData.currentPlan.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">支付方式</span>
                    <span className="text-sm text-[#B8C6D8]">{mockMembershipData.currentPlan.paymentFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">下次付款</span>
                    <span className="text-sm text-[#B8C6D8]">¥{mockMembershipData.currentPlan.price}</span>
                  </div>
                </div>
                 <button className="w-full mt-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B]"
                         onClick={() => toast.info("管理订阅功能即将上线")}>
                   管理订阅
                 </button>
              </div>

              {/* 会员专属客服 */}
              <motion.div 
                className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fa-solid fa-headset mr-2"></i>会员专属客服
                </h3>
                <p className="text-sm mb-4">获得优先的技术支持，专业摄影顾问一对一解答问题</p>
                <button 
                  className="w-full py-3 bg-white text-[#4A5F8B] rounded-lg font-medium hover:bg-[#F5F7FA] transition-colors flex items-center justify-center"
                  onClick={() => setShowChatModal(true)}
                >
                  <i className="fa-solid fa-comments mr-2"></i>立即咨询
                </button>
              </motion.div>
            </div>

            {/* 右侧主内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 权益使用统计可视化 */}
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">权益使用统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockMembershipData.growthSystem.usageChartData}>
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
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">您的专属特权</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockMembershipData.benefits.active.slice(0, 4).map(benefit => (
                    <div key={benefit.id} className="flex items-start p-4 bg-[#1E2532] rounded-lg"><div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"><i className={`fa-solid ${benefit.icon}`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#B8C6D8] mb-1">{benefit.name}</h4>
                          <p className="text-sm text-[#B8C6D8] mb-1">{benefit.description}</p>
                          {benefit.count && <span className="text-xs text-[#4A5F8B] font-medium">{benefit.count}</span>}
                        </div>
                      </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="inline-flex items-center text-sm text-[#4A5F8B] hover:underline transition-colors">
                    <span>查看全部会员特权</span>
                    <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>

              {/* 专属内容预览 */}
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">专属内容预览</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockMembershipData.growthSystem.exclusiveContent.map(content => (
                    <motion.div
                      key={content.id}
                      whileHover={{ y: -5, boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)" }}
                      className="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B]"
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={content.image} 
                          alt={content.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-[#B8C6D8] mb-2">{content.title}</h4>
                        <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{content.description}</p>
                         <button className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors text-sm"
                                 onClick={() => toast.info("课程详情即将显示")}>
                           了解详情
                         </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 推荐套餐 */}
              <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">推荐套餐</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockMembershipData.availablePlans.map(plan => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5, boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)" }}
                      className={`rounded-xl overflow-hidden border transition-all ${plan.recommended ? "border-[#4A5F8B] bg-[#1E2532] relative" : "border-[#4A5F8B] bg-[#1E2532]"}`}
                    >
                      {plan.recommended && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-[#4A5F8B] text-[#F5F7FA] text-xs px-3 py-1 font-medium rounded-bl-lg">
                            推荐
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-[#B8C6D8] mb-2">{plan.name}</h4>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-[#4A5F8B]">¥{plan.price}</span>
                          <span className="text-[#B8C6D8] ml-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <i className="fa-solid fa-check text-[#4A5F8B] mr-2 mt-0.5 flex-shrink-0"></i>
                              <span className="text-[#B8C6D8]">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${plan.recommended ? "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]" : "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED] border border-[#4A5F8B]"}`}
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">当前可用权益</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMembershipData.benefits.active.map(benefit => (
                  <div key={benefit.id} className="flex items-start p-4 bg-[#1E2532] rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                      <i className={`fa-solid ${benefit.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#B8C6D8] mb-1">{benefit.name}</h4>
                      <p className="text-sm text-[#B8C6D8] mb-2">{benefit.description}</p>
                      <div className="flex justify-between items-center">
                        {benefit.count && <span className="text-xs text-[#4A5F8B] font-medium">{benefit.count}本月</span>}
                         <button className="text-xs px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full hover:bg-[#63B3ED] transition-colors"
                                 onClick={() => toast.success(`已使用${benefit.name}`)}>
                           立即使用
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">即将解锁权益</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockMembershipData.benefits.upcoming.map(benefit => (
                  <div key={benefit.id} className="flex flex-col p-4 bg-[#1E2532] rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                        <i className={`fa-solid ${benefit.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#B8C6D8]">{benefit.name}</h4>
                        <span className="text-xs px-2 py-0.5 bg-[#4A5F8B]/20 text-[#B8C6D8] rounded-full">
                          LV.{benefit.level}解锁
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#B8C6D8] mb-3">{benefit.description}</p>
                    <button className="mt-auto py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B] text-sm">
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold text-[#B8C6D8] mb-6">会员成长体系</h3>
              
              <div className="relative">
                {/* 连接线 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#4A5F8B] hidden md:block"></div>
                
                <div className="space-y-6">
                  {mockMembershipData.growthSystem.levels.map((level, index) => (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex md:items-center p-4 rounded-lg border ${level.isCurrent ? "bg-[#4A5F8B]/20 border-[#4A5F8B]" : "bg-[#1E2532] border-[#4A5F8B]"}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold z-10 mb-4 md:mb-0 ${level.isCurrent ? "bg-[#4A5F8B] text-white" : "bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B]"}`}>
                        <i className={`fa-solid ${level.icon}`}></i>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex flex-wrap justify-between items-center mb-1">
                          <h4 className={`font-bold ${level.isCurrent ? "text-white" : "text-[#B8C6D8]"}`}>
                            LV.{level.level} - {level.name}
                          </h4>
                          <span className="text-sm font-medium text-[#4A5F8B]">{level.price}</span>
                        </div>
                        <p className="text-sm text-[#B8C6D8]">{level.description}</p>
                      </div>
                      
                      {level.isCurrent && (
                        <span className="ml-4 px-3 py-1 bg-[#4A5F8B] text-white text-xs rounded-full hidden md:block">
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
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">当前等级</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center relative">
                      <span className="text-3xl font-bold text-[#4A5F8B]">
                        LV.{mockMembershipData.currentPlan.level}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E2532] rounded-b-full overflow-hidden">
                        <div
                          className="h-full bg-[#4A5F8B]"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-[#B8C6D8] mb-1">{mockMembershipData.currentPlan.name}</h4>
                    <p className="text-sm text-[#B8C6D8]">距离升级还需完成以下任务</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">
                    升级至 {mockMembershipData.nextLevel.name}(LV.{mockMembershipData.nextLevel.level})
                  </h3>
                  <div className="space-y-4">
                    {mockMembershipData.nextLevel.requirements.map(req => (
                      <div key={req.id} className="p-4 bg-[#1E2532] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${req.completed ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]"}`}
                            >
                              {req.completed ? <i className="fa-solid fa-check"></i> : <span>{req.id}</span>}
                            </div>
                            <span className="text-[#B8C6D8]">{req.name}</span>
                          </div>
                          {req.completed ? (
                            <span className="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">已完成</span>
                          ) : (
                            <span className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]">进行中</span>
                          )}
                        </div>
                        {!req.completed && req.progress !== undefined && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-[#B8C6D8]">进度</span>
                              <span className="text-xs text-[#4A5F8B]">{req.progress}/{req.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#4A5F8B]"
                                style={{ width: `${(req.progress / req.total) * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-2 text-right">
                              <button className="text-xs text-[#4A5F8B] hover:underline transition-colors">
                                去完成 <i className="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors shadow-md inline-flex items-center">
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
            <div className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-[#F5F7FA]">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                {/* 左侧信息 */}
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <i className="fa-solid fa-trophy text-3xl text-[#F5F7FA]"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{mockMembershipData.growthBenefits.currentLevel.name}</h2>
                      <p className="text-[#F5F7FA]/80">LV.{mockMembershipData.growthBenefits.currentLevel.level}</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#4A5F8B]" 
                      style={{ width: `${(mockMembershipData.growthBenefits.currentLevel.progress / mockMembershipData.growthBenefits.currentLevel.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>成长值: {mockMembershipData.growthBenefits.currentLevel.progress}/{mockMembershipData.growthBenefits.currentLevel.maxProgress}</span>
                    <span>距离升级还需: {mockMembershipData.growthBenefits.currentLevel.maxProgress - mockMembershipData.growthBenefits.currentLevel.progress}点</span>
                  </div>
                </div>
                
                {/* 右侧统计 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold mb-1">{totalPoints}</p>
                    <p className="text-sm text-[#F5F7FA]/80">总成长值</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold mb-1">{Object.keys(mockMembershipData.growthBenefits.completedTasks).length}</p>
                    <p className="text-sm text-[#F5F7FA]/80">已完成任务</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 标签页导航 */}
            <div className="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
              <button
                onClick={() => setActiveTab('growth')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'growth'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                }`}
              >
                成长记录
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'rewards'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                }`}
              >
                福利兑换
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                }`}
              >
                任务中心
              </button>
              <button
                onClick={() => setActiveTab('referral')}
                className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
                  activeTab === 'referral'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                }`}
              >
                推荐奖励
              </button>
            </div>

            {/* 成长记录 */}
            {activeTab === 'growth' && (
              <div className="space-y-8">
                {/* 成长值记录 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">成长值记录</h3>
                  <div className="space-y-4">
                    {mockMembershipData.growthBenefits.growthHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-[#4A5F8B] hover:border-2 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                            <i className="fa-solid fa-plus-circle"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-[#F5F7FA]">{item.action}</h4>
                            <p className="text-sm text-[#B8C6D8]">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-[#6B7C93] font-bold">+{item.points}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 分页 */}
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
                      <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                      </button>
                      <button className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
                      <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* 升级指南模块 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">升级指南</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                        <i className="fa-solid fa-chart-line"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F5F7FA] mb-1">如何获得成长值？</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                          <li>发布优质作品并获得点赞和收藏</li>
                          <li>参加摄影比赛和线上活动</li>
                          <li>完成新手任务和日常任务</li>
                          <li>邀请好友注册并活跃</li>
                          <li>发表高质量评论和互动</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                        <i className="fa-solid fa-gift"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F5F7FA] mb-1">升级有什么好处？</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                          <li>解锁更多高级功能和特权</li>
                          <li>获得专属的徽章和标识</li>
                          <li>作品获得更多曝光和推荐机会</li>
                          <li>参与独家活动和线下聚会</li>
                          <li>获得专业摄影师的指导和点评</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                        <i className="fa-solid fa-rocket"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F5F7FA] mb-1">加速升级的技巧</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
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
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#F5F7FA]">可兑换福利</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-[#B8C6D8] mr-2">显示已兑换:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={showClaimedRewards}
                          onChange={() => setShowClaimedRewards(!showClaimedRewards)}
                        />
                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                        className={`bg-[#1E2532] rounded-xl overflow-hidden border transition-all ${
                          reward.available 
                            ? 'border-[#4A5F8B]' 
                            : 'border-[#4A5F8B]/50 opacity-80'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={reward.image}
                            alt={reward.name}
                            className="w-full h-36 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded-full flex items-center`}>
                              <i className="fa-solid fa-coins mr-1"></i>
                              {reward.points}
                            </span>
                          </div>
                          {!reward.available && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium">已兑换</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5">
                          <h4 className="font-bold text-[#F5F7FA] mb-2">{reward.name}</h4>
                          <p className="text-sm text-[#B8C6D8] mb-4">{reward.description}</p>
                          
                          <div className="flex justify-between items-center">
                            {reward.available ? (
                              <button 
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  totalPoints >= reward.points
                                    ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]'
                                    : 'bg-[#6B7C93] text-[#B8C6D8] cursor-not-allowed'
                                }`}
                                disabled={totalPoints < reward.points}
                              >
                                立即兑换
                              </button>
                            ) : (<span className="text-sm text-[#B8C6D8]">兑换时间: 2023-10-15
                              </span>
                            )}
                            <div className={`text-sm font-medium ${
                              totalPoints >= reward.points && reward.available
                                ? 'text-[#4A5F8B]'
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
                      <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                        <i className="fa-solid fa-gift text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无可用福利</h3>
                      <p className="text-sm text-[#B8C6D8]">
                        继续活跃获取更多成长值，解锁更多福利
                      </p>
                    </div>
                  )}
                </div>

                {/* 兑换记录 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">兑换记录</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-[#4A5F8B]">
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">福利名称</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">消耗积分</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">兑换时间</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">状态</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#4A5F8B]">
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">基础后期预设包</td>
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">50</td>
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">2023-10-10</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">RAW素材下载券</td>
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">80</td>
                          <td className="px-4 py-4 text-sm text-[#B8C6D8]">2023-09-25</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
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
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">进行中任务</h3>
                  <div className="space-y-4">
                    {mockMembershipData.growthBenefits.ongoingTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B] flex items-center justify-center mr-3 flex-shrink-0">
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-[#F5F7FA]">{task.name}</h4>
                              <p className="text-sm text-[#B8C6D8] mt-1">{task.description}</p>
                            </div>
                          </div>
                          <div className="text-[#4A5F8B] font-bold flex items-center">
                            <i className="fa-solid fa-coins mr-1"></i>
                            {task.points}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-[#B8C6D8]">进度</span>
                            <span className="text-xs text-[#4A5F8B]">{task.progress}/{task.total}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden border border-[#4A5F8B]">
                            <div 
                              className="h-full bg-[#4A5F8B]" 
                              style={{ width: `${(task.progress / task.total) * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-right">
                            <button className="text-xs text-[#4A5F8B] hover:underline transition-colors">
                              去完成 <i className="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 已完成任务 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">已完成任务</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockMembershipData.growthBenefits.completedTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                            <i className="fa-solid fa-check"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-[#F5F7FA]">{task.name}</h4>
                            <p className="text-sm text-[#B8C6D8]">{task.description}</p>
                          </div>
                        </div>
                        <div className="text-[#4A5F8B] font-bold">+{task.points}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

               {/* 会员推荐奖励 */}
              {activeTab === "referral" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">推荐奖励计划</h3>
                    <p className="text-sm text-[#B8C6D8] mb-6">邀请好友加入会员，您和好友都能获得丰厚奖励</p>
                    
                    <div className="bg-[#1E2532] rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium text-[#B8C6D8] mb-3">我的邀请码</h4>
                      <div className="flex items-center justify-between bg-[#2D3748] p-3 rounded-lg">
                        <span className="font-mono text-[#B8C6D8]">{mockMembershipData.growthSystem.referralProgram.currentUser.referralCode}</span>
                        <button 
                          className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors text-sm"
                          onClick={copyReferralCode}
                        >
                          复制
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#1E2532] rounded-lg p-4 mb-6">
                      <h4 className="text-md font-medium text-[#B8C6D8] mb-3">我的邀请链接</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#2D3748] p-3 rounded-lg space-y-3 sm:space-y-0">
                        <span className="font-mono text-[#B8C6D8] text-sm truncate flex-1">
                          {mockMembershipData.growthSystem.referralProgram.currentUser.referralLink}
                        </span>
                        <button 
                          className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors text-sm whitespace-nowrap"
                          onClick={copyReferralLink}
                        >
                          复制链接
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#B8C6D8]">总邀请人数</span>
                        <span className="font-medium text-[#4A5F8B]">{mockMembershipData.growthSystem.referralProgram.currentUser.totalInvites}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#B8C6D8]">成功开通会员</span>
                        <span className="font-medium text-[#4A5F8B]">{mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#B8C6D8]">待确认邀请</span>
                        <span className="font-medium text-[#4A5F8B]">{mockMembershipData.growthSystem.referralProgram.currentUser.pendingInvites}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-[#B8C6D8] mb-3">已获得奖励</h4>
                      <div className="space-y-3">
                        {mockMembershipData.growthSystem.referralProgram.currentUser.rewards.map(reward => (
                          <div key={reward.id} className="flex justify-between items-center p-3 bg-[#1E2532] rounded-lg">
                            <div>
                              <span className="text-sm text-[#B8C6D8]">{reward.name}</span>
                              {reward.date && (
                                <span className="text-xs text-[#6B7C93] ml-2">({reward.date})</span>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              reward.status === "已获得" ? "bg-[#4A5F8B]/20 text-[#4A5F8B]" : "bg-[#6B7C93]/20 text-[#6B7C93]"
                            }`}>
                              {reward.status} {reward.requirement && `(${reward.requirement})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">奖励等级</h3>
                    
                    <div className="space-y-6">
                      {mockMembershipData.growthSystem.referralProgram.rewardTiers.map((tier, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                              ? "bg-[#4A5F8B]/20 border-[#4A5F8B]" 
                              : "bg-[#1E2532] border-[#4A5F8B]"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 ${
                              index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                                ? "bg-[#4A5F8B]" 
                                : "bg-[#1E2532] border border-[#4A5F8B]"
                            }`}>
                              {tier.invites}
                            </div>
                            <div>
                              <h4 className={`font-medium ${
                                index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites 
                                  ? "text-white" 
                                  : "text-[#B8C6D8]"
                              }`}>
                                邀请{mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites >= tier.invites ? "已完成" : `${tier.invites}位好友`}
                              </h4>
                              <p className="text-sm text-[#B8C6D8]">{tier.reward}</p>
                              <p className="text-xs text-[#6B7C93]">{tier.description}</p>
                            </div>
                          </div>
                          {index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites && (
                            <span className="text-[#4A5F8B]">
                              <i className="fa-solid fa-check-circle text-lg"></i>
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-[#B8C6D8] mb-3">分享邀请</h4>
                      <div className="flex justify-center space-x-4 mb-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('wechat')}
                          className="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors"
                        >
                          <i className="fa-brands fa-weixin"></i>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('weibo')}
                          className="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors"
                        >
                          <i className="fa-brands fa-weibo"></i>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('qq')}
                          className="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors"
                        >
                          <i className="fa-brands fa-qq"></i>
                        </motion.button>
                      </div>
                      
                      <button className="w-full py-3 bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-white rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-all shadow-md flex items-center justify-center">
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#B8C6D8]">支付方式</h3>
                <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B] text-sm">
                  添加支付方式
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1E2532] rounded-lg border-2 border-[#4A5F8B]">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                      <i className="fa-credit-card"></i>
                    </div>
                    <div>
                      <p className="font-medium text-[#B8C6D8]">支付宝</p>
                      <p className="text-sm text-[#B8C6D8]">默认支付方式</p>
                    </div>
                  </div>
                  <button className="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                    <i className="fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold text-[#B8C6D8] mb-6">交易记录</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#4A5F8B]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">订单号</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">服务</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">金额</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">日期</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">#20230615001</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·年卡</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">¥299.00</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">2023-06-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">#20230515002</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·月卡</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">¥39.00</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">2023-05-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">#20230415003</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·月卡</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">¥39.00</td>
                      <td className="px-4 py-4 text-sm text-[#B8C6D8]">2023-04-15</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
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
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#B8C6D8]">会员活动日历</h3>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    onClick={() => setCurrentMonth(prev => Math.max(1, prev - 1))}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg">2023年{currentMonth}月</span>
                  <button 
                    className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    onClick={() => setCurrentMonth(prev => Math.min(12, prev + 1))}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* 日历视图 */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["日", "一", "二", "三", "四", "五", "六"].map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-[#4A5F8B]">
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
                        hasEvent ? "border-[#4A5F8B] bg-[#4A5F8B]/10 cursor-pointer hover:bg-[#4A5F8B]/20" : "border-transparent hover:border-[#4A5F8B] hover:bg-[#1E2532]"
                      }`}
                    >
                      <div className="text-center font-medium text-[#B8C6D8]">{day}</div>
                      {hasEvent && (
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-[#4A5F8B] rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 近期活动列表 */}
              <div>
                <h4 className="text-md font-medium text-[#B8C6D8] mb-4">近期活动</h4>
                <div className="space-y-4">
                  {mockMembershipData.growthSystem.events.map(event => (
                    <motion.div 
                      key={event.id}
                      whileHover={{ x: 5 }}
                      className="flex items-start p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#4A5F8B] text-white flex flex-col items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-lg font-bold">{event.date.split('-')[2]}</span>
                        <span className="text-xs">11月</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-[#B8C6D8]">{event.title}</h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            event.type === "线下活动" ? "bg-[#4A5F8B]/20 text-[#4A5F8B]" : "bg-[#6B7C93]/20 text-[#6B7C93]"
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-[#B8C6D8]">
                          <i className="fa-solid fa-map-marker-alt mr-2 text-[#4A5F8B]"></i>
                          {event.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="inline-flex items-center text-sm text-[#4A5F8B] hover:underline transition-colors">
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
            className="bg-[#1E2532] rounded-xl border border-[#4A5F8B] w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
              <h3 className="font-bold text-[#B8C6D8] flex items-center">
                <i className="fa-solid fa-headset mr-2"></i>会员专属客服
              </h3>
              <button 
                className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                onClick={() => setShowChatModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-[#4A5F8B] flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <div className="bg-[#2D3748] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm text-[#B8C6D8]">您好！我是您的专属客服，有什么可以帮助您的吗？</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[#4A5F8B]">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="输入您的问题..."
                  className="flex-1 px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                />
                <button 
                  className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors"
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