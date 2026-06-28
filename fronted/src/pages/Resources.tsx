import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useEffect } from "react";
import { projectTypes, priceRanges, popularTags } from "../lib/projectFilters";
import { onboardingSteps, platformServices, securePaymentSteps } from "../lib/projectPageContent";

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

// TODO: from API
const mockProjects: Project[] = [];

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