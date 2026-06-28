import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useEffect } from "react";

interface Project {
    id: string;
    title: string;
    type: string;
    location: string;
    price: string;
    deadline: string;
    description: string;
    requirements: string[];
    tags: string[];
    company: {
        name: string;
        avatar: string;
        verified: boolean;
        completedProjects: number;
        rating: number;
    };
    views: number;
    applications: number;
    status?: "pending" | "inProgress" | "completed" | "cancelled";
    progress?: number;
    matchedPhotographers?: MatchedPhotographer[];
    contractSigned?: boolean;
    paymentStatus?: "pending" | "escrowed" | "released" | "refunded";
    deliveryStatus?: "pending" | "delivered" | "approved";
}

interface MatchedPhotographer {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedProjects: number;
    matchScore: number;
    skills: string[];
    priceRange: string;
}

const mockProjects: Project[] = [{
    id: "p1",
    title: "商业人像拍摄",
    type: "人像摄影",
    location: "上海市",
    price: "5000-8000",
    deadline: "2025-12-10",
    description: "为服装品牌拍摄秋冬季新品宣传照，需要拍摄模特人像照片，包含室内和室外场景，提供完整的后期修图服务。",
    requirements: ["具有商业人像拍摄经验", "能够指导模特摆姿", "提供专业摄影设备", "熟悉后期修图流程"],
    tags: ["商业", "人像", "服装", "后期"],

    company: {
        name: "时尚前沿服饰有限公司",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20company%20logo%20professional&sign=cdf45d87bd032e57c2a0dcbfc02251e9",
        verified: true,
        completedProjects: 125,
        rating: 4.8
    },

    views: 324,
    applications: 18,

    matchedPhotographers: [{
        id: "ph1",
        name: "专业人像摄影师",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20portrait%20photographer%20male&sign=0067b197499a57ebe45e179c20f30d8f",
        rating: 4.9,
        completedProjects: 89,
        matchScore: 95,
        skills: ["人像摄影", "商业摄影", "后期修图"],
        priceRange: "6000-9000"
    }, {
        id: "ph2",
        name: "时尚摄影师",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20photographer%20female%20stylish&sign=658ed80f4ae9d9cb10f4ff2d279e7ac7",
        rating: 4.7,
        completedProjects: 65,
        matchScore: 92,
        skills: ["时尚摄影", "模特指导", "灯光布置"],
        priceRange: "5000-8000"
    }]
}, {
    id: "p2",
    title: "产品摄影服务",
    type: "产品摄影",
    location: "北京市",
    price: "3000-5000",
    deadline: "2025-12-15",
    description: "为电子产品新品拍摄高清产品照片，主要用于电商平台展示和宣传资料。需要拍摄多角度产品图和场景图。",
    requirements: ["有产品摄影经验", "拥有专业摄影棚和灯光设备", "能够处理产品反光问题", "提供快速出图服务"],
    tags: ["产品", "电商", "静物", "电子"],

    company: {
        name: "科技创新有限公司",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20company%20logo%20modern&sign=445a51379e165c0a7195033431714e16",
        verified: true,
        completedProjects: 89,
        rating: 4.7
    },

    views: 256,
    applications: 12,
    status: "inProgress",
    progress: 65,
    contractSigned: true,
    paymentStatus: "escrowed",
    deliveryStatus: "pending"
}, {
    id: "p3",
    title: "婚礼跟拍服务",
    type: "婚礼摄影",
    location: "广州市",
    price: "8000-12000",
    deadline: "2026-01-05",
    description: "为新人提供全程婚礼跟拍服务，包括接亲、仪式、晚宴等环节，要求捕捉温馨感人的瞬间，提供高质量的照片和视频。",
    requirements: ["有婚礼摄影经验", "熟悉婚礼流程", "能够捕捉瞬间情感", "提供快速精修服务"],
    tags: ["婚礼", "跟拍", "纪实", "人像"],

    company: {
        name: "幸福时刻婚礼策划",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20planner%20logo%20elegant&sign=9b3474ad243bb441517ed4ad3fc149f4",
        verified: true,
        completedProjects: 156,
        rating: 4.9
    },

    views: 412,
    applications: 23
}, {
    id: "p4",
    title: "活动现场摄影",
    type: "活动摄影",
    location: "深圳市",
    price: "4000-6000",
    deadline: "2025-12-20",
    description: "为科技峰会活动提供现场摄影服务，需要拍摄演讲嘉宾、互动环节、产品展示等内容，用于活动宣传和媒体报道。",
    requirements: ["有活动摄影经验", "能够在弱光环境下拍摄", "熟悉大型活动流程", "提供快速出图服务"],
    tags: ["活动", "会议", "科技", "纪实"],

    company: {
        name: "未来科技峰会组委会",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20conference%20logo%20futuristic&sign=c8f9692a8042dfb02e2775e75fbca398",
        verified: true,
        completedProjects: 67,
        rating: 4.6
    },

    views: 189,
    applications: 9,
    status: "completed",
    progress: 100,
    contractSigned: true,
    paymentStatus: "released",
    deliveryStatus: "approved"
}, {
    id: "p5",
    title: "建筑空间摄影",
    type: "建筑摄影",
    location: "成都市",
    price: "6000-10000",
    deadline: "2026-01-10",
    description: "为新建成的商业中心拍摄建筑空间照片，需要展示建筑外观、内部空间设计和细节，用于宣传和招商资料。",
    requirements: ["有建筑摄影经验", "拥有广角和移轴镜头", "能够处理大光比场景", "熟悉建筑空间构图"],
    tags: ["建筑", "空间", "商业", "广角"],

    company: {
        name: "城市建设发展有限公司",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=construction%20company%20logo%20professional&sign=5c942136e148b13f0761427e7784f634",
        verified: true,
        completedProjects: 54,
        rating: 4.8
    },

    views: 225,
    applications: 14,

    matchedPhotographers: [{
        id: "ph3",
        name: "建筑摄影师",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20professional&sign=c9c3dd9b1a675af9316c70a07245da80",
        rating: 4.8,
        completedProjects: 45,
        matchScore: 96,
        skills: ["建筑摄影", "广角拍摄", "大光比处理"],
        priceRange: "7000-10000"
    }]
}, {
    id: "p6",
    title: "美食摄影服务",
    type: "美食摄影",
    location: "杭州市",
    price: "3000-5000",
    deadline: "2025-12-25",
    description: "为新开业的高级餐厅拍摄菜品照片，需要拍摄20道菜品，风格偏向清新自然，突出食物的质感和色彩，用于菜单设计和社交媒体宣传。",
    requirements: ["有美食摄影经验", "拥有专业灯光设备", "熟悉食物造型和摆盘", "能够突出菜品质感"],
    tags: ["美食", "餐厅", "静物", "商业"],

    company: {
        name: "品味人生餐饮管理",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=restaurant%20logo%20elegant%20food&sign=60810ff0ccd916355892a13144957b65",
        verified: true,
        completedProjects: 78,
        rating: 4.7
    },

    views: 267,
    applications: 15
}];

const projectTypes = [{
    id: "all",
    name: "全部类型"
}, {
    id: "portrait",
    name: "人像摄影"
}, {
    id: "product",
    name: "产品摄影"
}, {
    id: "wedding",
    name: "婚礼摄影"
}, {
    id: "event",
    name: "活动摄影"
}, {
    id: "architecture",
    name: "建筑摄影"
}, {
    id: "food",
    name: "美食摄影"
}];

const priceRanges = [{
    id: "all",
    name: "全部价格"
}, {
    id: "0-3000",
    name: "3000元以下"
}, {
    id: "3000-6000",
    name: "3000-6000元"
}, {
    id: "6000-10000",
    name: "6000-10000元"
}, {
    id: "10000+",
    name: "10000元以上"
}];

const popularTags = [{
    id: "1",
    name: "商业",
    count: 124
}, {
    id: "2",
    name: "人像",
    count: 98
}, {
    id: "3",
    name: "产品",
    count: 87
}, {
    id: "4",
    name: "婚礼",
    count: 76
}, {
    id: "5",
    name: "活动",
    count: 65
}, {
    id: "6",
    name: "建筑",
    count: 54
}, {
    id: "7",
    name: "美食",
    count: 43
}, {
    id: "8",
    name: "电商",
    count: 32
}];

const onboardingSteps = [{
    id: "step1",
    title: "注册账号",
    description: "创建您的摄影师账号，填写基本信息",
    icon: "fa-user-plus"
}, {
    id: "step2",
    title: "完善资料",
    description: "上传作品集，填写专业技能和服务内容",
    icon: "fa-pencil-alt"
}, {
    id: "step3",
    title: "资质认证",
    description: "提交身份证明和相关专业资质",
    icon: "fa-id-card"
}, {
    id: "step4",
    title: "开始接单",
    description: "设置服务价格，开始接收项目邀请",
    icon: "fa-check-circle"
}];

const platformServices = [{
    id: "service1",
    title: "智能匹配系统",
    description: "根据技能、需求和历史表现，精准匹配摄影师与客户",
    icon: "fa-magic",
    benefits: ["AI智能匹配算法", "技能标签匹配", "历史项目匹配度分析", "个性化推荐"]
}, {
    id: "service2",
    title: "项目进度管理",
    description: "实时追踪项目各阶段进展，确保项目按时高质量完成",
    icon: "fa-tasks",
    benefits: ["阶段里程碑管理", "时间节点提醒", "进度可视化", "团队协作功能"]
}, {
    id: "service3",
    title: "在线合同签署",
    description: "提供标准合同模板，支持在线电子签名，保障双方权益",
    icon: "fa-file-signature",
    benefits: ["标准化合同模板", "电子签名技术", "合同安全存储", "法律条款保障"]
}, {
    id: "service4",
    title: "支付担保服务",
    description: "平台资金托管，项目验收后再付款，保障交易安全",
    icon: "fa-shield-alt",
    benefits: ["资金安全托管", "分阶段支付", "纠纷协调机制", "退款保障"]
}, {
    id: "service5",
    title: "作品交付系统",
    description: "安全的作品上传和交付流程，支持多种格式和版本管理",
    icon: "fa-cloud-upload-alt",
    benefits: ["安全加密传输", "版本控制管理", "批量上传下载", "在线预览功能"]
}, {
    id: "service6",
    title: "评价反馈系统",
    description: "交易完成后双方互评，建立公平公正的信用评价体系",
    icon: "fa-star",
    benefits: ["双向评价机制", "信用积分系统", "评价真实性验证", "优质服务推荐"]
}];

const securePaymentSteps = [{
    id: "pay1",
    title: "客户支付",
    description: "客户将项目款支付至平台托管账户"
}, {
    id: "pay2",
    title: "项目启动",
    description: "摄影师开始项目服务，按计划进行"
}, {
    id: "pay3",
    title: "阶段性验收",
    description: "按项目里程碑逐步验收并确认进度"
}, {
    id: "pay4",
    title: "最终确认",
    description: "客户确认项目完成，平台释放资金"
}, {
    id: "pay5",
    title: "交易完成",
    description: "摄影师收到款项，双方进行评价"
}];

const Resources: React.FC = () => {
    const {
        isAuthenticated,
        user
    } = useAuth();

    const [activeTab, setActiveTab] = useState<"browse" | "post">("browse");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedPriceRange, setSelectedPriceRange] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recommended");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);

    const [newProjectData, setNewProjectData] = useState({
        title: "",
        type: "",
        location: "",
        priceRange: "",
        deadline: "",
        description: "",
        requirements: [""],
        tags: ""
    });

    const getFilteredProjects = () => {
        let projects = [...mockProjects];

        if (selectedType !== "all") {
            const typeMap: {
                [key: string]: string;
            } = {
                "portrait": "人像摄影",
                "product": "产品摄影",
                "wedding": "婚礼摄影",
                "event": "活动摄影",
                "architecture": "建筑摄影",
                "food": "美食摄影"
            };

            projects = projects.filter(project => project.type === typeMap[selectedType]);
        }

        if (selectedPriceRange !== "all") {
            projects = projects.filter(project => {
                const priceRange = project.price.split("-");
                const minPrice = parseInt(priceRange[0]);
                const maxPrice = priceRange.length > 1 ? parseInt(priceRange[1]) : minPrice;

                switch (selectedPriceRange) {
                case "0-3000":
                    return maxPrice <= 3000;
                case "3000-6000":
                    return minPrice >= 3000 && maxPrice <= 6000;
                case "6000-10000":
                    return minPrice >= 6000 && maxPrice <= 10000;
                case "10000+":
                    return minPrice >= 10000;
                default:
                    return true;
                }
            });
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            projects = projects.filter(
                project => project.title.toLowerCase().includes(term) || project.description.toLowerCase().includes(term) || project.company.name.toLowerCase().includes(term)
            );
        }

        if (selectedTags.length > 0) {
            projects = projects.filter(project => selectedTags.every(tag => project.tags.includes(tag)));
        }

        if (sortBy === "newest") {
            projects.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        } else if (sortBy === "price-asc") {
            projects.sort((a, b) => {
                const aPrice = parseInt(a.price.split("-")[0]);
                const bPrice = parseInt(b.price.split("-")[0]);
                return aPrice - bPrice;
            });
        } else if (sortBy === "price-desc") {
            projects.sort((a, b) => {
                const aPrice = parseInt(a.price.split("-")[0]);
                const bPrice = parseInt(b.price.split("-")[0]);
                return bPrice - aPrice;
            });
        }

        return projects;
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
  };

  // 初始化收藏项目
  useEffect(() => {
    // 从localStorage加载收藏的项目
    const savedFavorites = localStorage.getItem('favoriteProjects');
    if (savedFavorites) {
      setFavoriteProjects(JSON.parse(savedFavorites));
    }
  }, []);

  // 收藏/取消收藏项目
  const toggleFavorite = (projectId: string) => {
    if (!isAuthenticated) {
      toast.info('请先登录后再收藏项目');
      return;
    }

    let newFavorites: string[];
    if (favoriteProjects.includes(projectId)) {
      newFavorites = favoriteProjects.filter(id => id !== projectId);
      toast.success('已取消收藏');
    } else {
      newFavorites = [...favoriteProjects, projectId];
      toast.success('收藏成功');
    }
    
    setFavoriteProjects(newFavorites);
    // 保存到localStorage
    localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
  };

    const handleRequirementChange = (index: number, value: string) => {
        const newRequirements = [...newProjectData.requirements];
        newRequirements[index] = value;

        setNewProjectData({
            ...newProjectData,
            requirements: newRequirements
        });
    };

    const addRequirement = () => {
        setNewProjectData({
            ...newProjectData,
            requirements: [...newProjectData.requirements, ""]
        });
    };

    const removeRequirement = (index: number) => {
        if (newProjectData.requirements.length > 1) {
            const newRequirements = newProjectData.requirements.filter((_, i) => i !== index);

            setNewProjectData({
                ...newProjectData,
                requirements: newRequirements
            });
        }
    };

    const handleSubmitProject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.info("请先登录后再发布需求");
            return;
        }

        if (!newProjectData.title || !newProjectData.type || !newProjectData.location || !newProjectData.priceRange || !newProjectData.deadline || !newProjectData.description) {
            toast.warning("请填写所有必填字段");
            return;
        }

        toast.success("项目需求发布成功！我们将为您智能匹配合适的摄影师");

        setNewProjectData({
            title: "",
            type: "",
            location: "",
            priceRange: "",
            deadline: "",
            description: "",
            requirements: [""],
            tags: ""
        });

        setTimeout(() => {
            setActiveTab("browse");
        }, 100);
    };

    const handleSwitchToPost = () => {
        if (!isAuthenticated) {
            toast.info("请先登录后再发布需求");
            return;
        }

        setActiveTab("post");
    };

    const filteredProjects = getFilteredProjects();

    return (
        <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}>
                {}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">资源交易平台
                                  </h1>
                    <p className="text-[#B8C6D8] max-w-2xl mx-auto">连接摄影师与客户的专业平台，智能匹配、安全交易、高效管理
                                  </p>
                </div>
                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-6">
                        {}
                        <div
                            className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab("browse")}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "browse" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>浏览项目
                                                    </button>
                                <button
                                    onClick={handleSwitchToPost}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "post" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>发布需求
                                                    </button>
                            </div>
                        </div>
                        {}
                        <motion.div
                            key={activeTab}
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                y: -10
                            }}
                            transition={{
                                duration: 0.3
                            }}
                            className="overflow-hidden">
                            {}
                            {activeTab === "post" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                                <h3 className="text-xl font-bold text-[#F5F7FA] mb-4">发布项目需求</h3>
                                <form onSubmit={handleSubmitProject}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label
                                                htmlFor="projectTitle"
                                                className="block text-sm font-medium text-[#B8C6D8] mb-1">项目标题 *</label>
                                            <input
                                                type="text"
                                                id="projectTitle"
                                                value={newProjectData.title}
                                                onChange={e => setNewProjectData({
                                                    ...newProjectData,
                                                    title: e.target.value
                                                })}
                                                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                                                placeholder="请输入项目标题" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="projectType"
                                                className="block text-sm font-medium text-[#B8C6D8] mb-1">项目类型 *</label>
                                            <select
                                                id="projectType"
                                                value={newProjectData.type}
                                                onChange={e => setNewProjectData({
                                                    ...newProjectData,
                                                    type: e.target.value
                                                })}
                                                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                                <option value="">请选择项目类型</option>
                                                <option value="人像摄影">人像摄影</option>
                                                <option value="产品摄影">产品摄影</option>
                                                <option value="婚礼摄影">婚礼摄影</option>
                                                <option value="活动摄影">活动摄影</option>
                                                <option value="建筑摄影">建筑摄影</option>
                                                <option value="美食摄影">美食摄影</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label
                                                htmlFor="projectLocation"
                                                className="block text-sm font-medium text-[#B8C6D8] mb-1">项目地点 *</label>
                                            <input
                                                type="text"
                                                id="projectLocation"
                                                value={newProjectData.location}
                                                onChange={e => setNewProjectData({
                                                    ...newProjectData,
                                                    location: e.target.value
                                                })}
                                                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                                                placeholder="请输入项目地点" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="projectPriceRange"
                                                className="block text-sm font-medium text-[#B8C6D8] mb-1">预算范围 *</label>
                                            <select
                                                id="projectPriceRange"
                                                value={newProjectData.priceRange}
                                                onChange={e => setNewProjectData({
                                                    ...newProjectData,
                                                    priceRange: e.target.value
                                                })}
                                                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                                <option value="">请选择预算范围</option>
                                                <option value="0-3000">3000元以下</option>
                                                <option value="3000-6000">3000-6000元</option>
                                                <option value="6000-10000">6000-10000元</option>
                                                <option value="10000-20000">10000-20000元</option>
                                                <option value="20000+">20000元以上</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="projectDeadline"
                                            className="block text-sm font-medium text-[#B8C6D8] mb-1">截止日期 *</label>
                                        <input
                                            type="date"
                                            id="projectDeadline"
                                            value={newProjectData.deadline}
                                            onChange={e => setNewProjectData({
                                                ...newProjectData,
                                                deadline: e.target.value
                                            })}
                                            className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="projectDescription"
                                            className="block text-sm font-medium text-[#B8C6D8] mb-1">项目描述 *</label>
                                        <textarea
                                            id="projectDescription"
                                            value={newProjectData.description}
                                            onChange={e => setNewProjectData({
                                                ...newProjectData,
                                                description: e.target.value
                                            })}
                                            className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] h-32 resize-none"
                                            placeholder="请详细描述您的项目需求，包括拍摄内容、风格要求、交付标准等" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#B8C6D8] mb-1">具体要求</label>
                                        {newProjectData.requirements.map((req, index) => <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={e => handleRequirementChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                                                placeholder={`要求 ${index + 1}`} />
                                            <button
                                                type="button"
                                                onClick={() => removeRequirement(index)}
                                                className="ml-2 p-2 text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                                                disabled={newProjectData.requirements.length <= 1}>
                                                <i className="fa-solid fa-trash-alt"></i>
                                            </button>
                                        </div>)}
                                        <button
                                            type="button"
                                            onClick={addRequirement}
                                            className="mt-2 px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors">
                                            <i className="fa-solid fa-plus mr-1"></i>添加要求
                                                                  </button>
                                    </div>
                                    <div className="mb-6">
                                        <label
                                            htmlFor="projectTags"
                                            className="block text-sm font-medium text-[#B8C6D8] mb-1">项目标签</label>
                                        <input
                                            type="text"
                                            id="projectTags"
                                            value={newProjectData.tags}
                                            onChange={e => setNewProjectData({
                                                ...newProjectData,
                                                tags: e.target.value
                                            })}
                                            className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                                            placeholder="请输入标签，用逗号分隔，如：商业,人像,后期" />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("browse")}
                                            className="px-6 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">取消
                                                                  </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">发布需求
                                                                  </button>
                                    </div>
                                </form>
                            </div>}
                            {}
                            {activeTab === "browse" && <div
                                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {}
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="搜索项目、客户或关键词..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                                        <i
                                            className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                                    </div>
                                    <select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value)}
                                        className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="recommended">推荐排序</option>
                                        <option value="newest">最新发布</option>
                                        <option value="price-asc">价格从低到高</option>
                                        <option value="price-desc">价格从高到低</option>
                                    </select>
                                </div>
                                {}
                                <div className="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B]">
                                    <div className="flex flex-wrap gap-2">
                                        {projectTypes.map(type => <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedType === type.id ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>
                                            {type.name}
                                        </button>)}
                                    </div>
                                </div>
                                {}
                                <div className="space-y-6">
                                    {filteredProjects.map(project => <motion.div
                                        key={project.id}
                                        whileHover={{
                                            y: -3,
                                            boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)"
                                        }}
                                        className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm">
                                        {}
                                        <div className="p-5 border-b border-[#4A5F8B]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#F5F7FA] mb-1">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-3 text-sm text-[#B8C6D8]">
                                                        <span className="px-2 py-0.5 bg-[#1E2532] rounded-md border border-[#4A5F8B]">
                                                            {project.type}
                                                        </span>
                                                        <div className="flex items-center">
                                                            <i className="fa-solid fa-map-marker-alt mr-1"></i>
                                                            {project.location}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <i className="fa-solid fa-eye mr-1"></i>
                                                            {project.views}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <i className="fa-solid fa-file-signature mr-1"></i>
                                                            {project.applications}
                                                        </div>
                                                        {project.status && <span
                                                            className={`px-2 py-0.5 rounded-md border ${project.status === "pending" ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : project.status === "inProgress" ? "bg-blue-900/30 text-blue-300 border-blue-700" : project.status === "completed" ? "bg-green-900/30 text-green-300 border-green-700" : "bg-red-900/30 text-red-300 border-red-700"}`}>
                                                            {project.status === "pending" ? "待开始" : project.status === "inProgress" ? "进行中" : project.status === "completed" ? "已完成" : "已取消"}
                                                        </span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-[#F5F7FA]">¥{project.price}
                                                    </p>
                                                    <p className="text-sm text-[#F5F7FA]">截止日期: {project.deadline}
                                                    </p>
                                                </div>
                                            </div>
                                            {}
                                            {project.status === "inProgress" && project.progress !== undefined && <div className="mb-3">
                                                <div className="flex justify-between text-sm text-[#B8C6D8] mb-1">
                                                    <span>项目进度</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#4A5F8B]"
                                                        style={{
                                                            width: `${project.progress}%`
                                                        }}></div>
                                                </div>
                                            </div>}
                                            {}
                                            {(project.contractSigned !== undefined || project.paymentStatus || project.deliveryStatus) && <div className="flex flex-wrap gap-2 mb-3">
                                                {project.contractSigned && <span
                                                    className="px-2 py-0.5 bg-green-900/30 text-green-300 rounded-md border border-green-700 text-xs">
                                                    <i className="fa-solid fa-file-signature mr-1"></i>合同已签署
                                                                                    </span>}
                                                {project.paymentStatus === "escrowed" && <span
                                                    className="px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded-md border border-blue-700 text-xs">
                                                    <i className="fa-solid fa-shield-alt mr-1"></i>资金已托管
                                                                                    </span>}
                                                {project.paymentStatus === "released" && <span
                                                    className="px-2 py-0.5 bg-green-900/30 text-green-300 rounded-md border border-green-700 text-xs">
                                                    <i className="fa-solid fa-check-circle mr-1"></i>资金已结算
                                                                                    </span>}
                                                {project.deliveryStatus === "delivered" && <span
                                                    className="px-2 py-0.5 bg-yellow-900/30 text-yellow-300 rounded-md border border-yellow-700 text-xs">
                                                    <i className="fa-solid fa-cloud-upload-alt mr-1"></i>作品已交付
                                                                                    </span>}
                                                {project.deliveryStatus === "approved" && <span
                                                    className="px-2 py-0.5 bg-green-900/30 text-green-300 rounded-md border border-green-700 text-xs">
                                                    <i className="fa-solid fa-check-circle mr-1"></i>作品已验收
                                                                                    </span>}
                                            </div>}
                                            {}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        <img
                                                            src={project.company.avatar}
                                                            alt={project.company.name}
                                                            className="w-10 h-10 rounded-full object-cover border border-[#4A5F8B]" />
                                                        {project.company.verified && <div
                                                            className="absolute bottom-0 right-0 w-3 h-3 bg-[#4A5F8B] rounded-full border-2 border-[#2D3748]"></div>}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium text-[#F5F7FA]">{project.company.name}</p>
                                                        <div className="flex items-center text-xs text-[#B8C6D8]">
                                                            <div className="flex items-center mr-2">
                                                                <i className="fa-solid fa-star text-[#4A5F8B] mr-1"></i>
                                                                <span>{project.company.rating}</span>
                                                            </div>
                                                            <span>{project.company.completedProjects}个项目</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {}
                                        <div className="p-5 border-b border-[#4A5F8B]">
                                            <h4 className="font-medium text-[#F5F7FA] mb-2">项目描述</h4>
                                            <p className="text-sm text-[#B8C6D8] mb-4">
                                                {project.description}
                                            </p>
                                            <h4 className="font-medium text-[#F5F7FA] mb-2">需求要求</h4>
                                            <ul className="space-y-1 mb-4">
                                                {project.requirements.map(
                                                    (req, index) => <li key={index} className="flex items-start text-sm text-[#B8C6D8]">
                                                        <i
                                                            className="fa-solid fa-check-circle text-[#4A5F8B] mt-1 mr-2 flex-shrink-0"></i>
                                                        <span>{req}</span>
                                                    </li>
                                                )}
                                            </ul>
                                            {}
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag, index) => <span
                                                    key={index}
                                                    className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}
                                                </span>)}
                                            </div>
                                        </div>
                                        {}
                                        {project.matchedPhotographers && project.matchedPhotographers.length > 0 && <></>}
                                        {}
                                        <div className="p-5 flex justify-between items-center">
                                            <div className="flex space-x-3">
                   <button
                       onClick={() => toggleFavorite(project.id)}
                       className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                         favoriteProjects.includes(project.id) 
                           ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' 
                           : 'bg-[#1E2532] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                       }`}>
                       <i className={`fa-solid ${favoriteProjects.includes(project.id) ? 'fa-bookmark-check' : 'fa-bookmark'} mr-2`}></i>
                       {favoriteProjects.includes(project.id) ? '已收藏' : '收藏'}
                     </button>
                                                {isAuthenticated && project.status === "completed" && <button
                                                    className="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                                    <i className="fa-solid fa-star mr-2"></i>评价
                                                                                  </button>}
                                            </div>
                     <Link
                       to={`/project/${project.id}`}
                       className="px-6 py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B] hover:from-[#6B7C93] hover:to-[#4A5F8B]">查看详情
                     </Link>
                                        </div>
                                    </motion.div>)}
                                    {filteredProjects.length === 0 && <div
                                        className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                                        <div
                                            className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                                            <i className="fa-solid fa-search text-2xl"></i>
                                        </div>
                                        <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关项目</h3>
                                        <p className="text-[#B8C6D8]">请尝试调整筛选条件或搜索其他关键词
                                                                    </p>
                                    </div>}
                                </div>
                                {}
                                {filteredProjects.length > 0 && <div className="flex justify-center">
                                    <nav
                                        className="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                                        <button
                                            className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                            <i className="fa-solid fa-chevron-left text-xs"></i>
                                        </button>
                                        <button
                                            className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1
                                                                    </button>
                                        <button
                                            className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">2
                                                                    </button>
                                        <span className="px-2 text-[#B8C6D8]">...</span>
                                        <button
                                            className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">5
                                                                    </button>
                                        <button
                                            className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                            <i className="fa-solid fa-chevron-right text-xs"></i>
                                        </button>
                                    </nav>
                                </div>}
                            </div>}
                        </motion.div>
                    </div>
                    {}
                    <div className="lg:col-span-1 space-y-6">
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                            <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">平台服务</h3>
                            <div className="space-y-4">
                                {platformServices.map(service => <div key={service.id} className="flex items-start">
                                    <div
                                        className="w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className={`fa-solid ${service.icon}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#F5F7FA] mb-1">{service.title}</h4>
                                        <p className="text-sm text-[#B8C6D8]">{service.description}</p>
                                    </div>
                                </div>)}
                            </div>
                            {}
                            <div className="mt-6 pt-4 border-t border-[#4A5F8B]">
                                <p className="text-sm text-[#B8C6D8] mb-2">您可能还对以下内容感兴趣：</p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/events-and-contests"
                                        className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs hover:bg-[#6B7C93] transition-colors">线下活动
                                                          </Link>
                                    <Link
                                        to="/photography-contests"
                                        className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs hover:bg-[#6B7C93] transition-colors">摄影赛事
                                                          </Link>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                            <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">安全支付流程</h3>
                            <div className="relative">
                                {}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#4A5F8B] z-0"></div>
                                {}
                                <div className="space-y-4 relative z-10">
                                    {securePaymentSteps.map((step, index) => <div key={step.id} className="flex">
                                        <div
                                            className="w-8 h-8 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center mr-3 flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[#F5F7FA] mb-1">{step.title}</h4>
                                            <p className="text-sm text-[#B8C6D8]">{step.description}</p>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                            <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">价格区间</h3>
                            <div className="space-y-2">
                                {priceRanges.map(range => <div key={range.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`price-${range.id}`}
                                        name="price-range"
                                        checked={selectedPriceRange === range.id}
                                        onChange={() => setSelectedPriceRange(range.id)}
                                        className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]" />
                                    <label htmlFor={`price-${range.id}`} className="ml-2 text-sm text-[#B8C6D8]">
                                        {range.name}
                                    </label>
                                </div>)}
                            </div>
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                            <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map(tag => <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.name)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag.name) ? "bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]"}`}>#{tag.name}({tag.count})
                                                      </button>)}
                            </div>
                            {}
                            {selectedTags.length > 0 && <button
                                onClick={() => setSelectedTags([])}
                                className="mt-4 w-full py-2 text-center text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors">
                                <i className="fa-solid fa-times mr-1"></i>清除所有标签
                                                </button>}
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                            <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">摄影师入驻指南</h3>
                            <div className="space-y-6">
                                {onboardingSteps.map((step, index) => <div key={step.id} className="flex">
                                    <div className="flex-shrink-0 mr-4">
                                        <div
                                            className="w-8 h-8 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#F5F7FA] mb-1">{step.title}</h4>
                                        <p className="text-sm text-[#B8C6D8]">{step.description}</p>
                                    </div>
                                </div>)}
                            </div>
                            <motion.button
                                whileHover={{
                                    scale: 1.02
                                }}
                                whileTap={{
                                    scale: 0.98
                                }}
                                className="w-full mt-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">立即入驻
                                              </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Resources;