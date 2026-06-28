import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { CommentSection } from '../components/CommentSection';

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

// TODO: Replace with API call
const mockProjects: Project[] = [];

const calculateDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const ProjectDetail: React.FC = () => {
    const {
        id
    } = useParams<{
        id: string;
    }>();

    const {
        isAuthenticated,
        user
    } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [applicationText, setApplicationText] = useState("");
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const foundProject = mockProjects.find(p => p.id === id);
            setProject(foundProject || null);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    const handleSubmitApplication = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.info("请先登录后再申请项目");
            return;
        }

        if (!applicationText.trim()) {
            toast.warning("请填写申请理由");
            return;
        }

        setIsSubmittingApplication(true);

        setTimeout(() => {
            setIsSubmittingApplication(false);
            toast.success("申请提交成功！客户将尽快与您联系");
            setApplicationText("");
        }, 1500);
    };

    const handleFavoriteProject = () => {
        if (!isAuthenticated) {
            toast.info("请先登录后再收藏项目");
            return;
        }

        toast.success("项目收藏成功！");
    };

    if (loading) {
        return (
            <div
                className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
                <div
                    className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
                <div
                    className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div
                        className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
                        <i className="fa-solid fa-exclamation-circle text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">未找到该项目</h2>
                    <p className="text-[#B8C6D8] mb-6 max-w-md">抱歉，您访问的项目不存在或已被删除</p>
                    <Link
                        to="/resources"
                        className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">返回资源列表
                                  </Link>
                </div>
            </div>
        );
    }

    const daysRemaining = calculateDaysRemaining(project.deadline);

    const progressData = [{
        name: "已完成",
        value: project.progress || 0
    }, {
        name: "未完成",
        value: 100 - (project.progress || 0)
    }];

    const COLORS = ["#4A5F8B", "#1E2532"];

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
                <div className="mb-6">
                    <Link
                        to="/resources"
                        className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>返回资源列表</span>
                    </Link>
                </div>
                {}
                <div
                    className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 border border-[#4A5F8B] mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span
                                    className="px-3 py-1 bg-[#1E2532] text-[#F5F7FA] text-sm rounded-full border border-[#4A5F8B]">
                                    {project.type}
                                </span>
                                {project.status && <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === "pending" ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700" : project.status === "inProgress" ? "bg-blue-900/30 text-blue-300 border border-blue-700" : project.status === "completed" ? "bg-green-900/30 text-green-300 border border-green-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
                                    {project.status === "pending" ? "待开始" : project.status === "inProgress" ? "进行中" : project.status === "completed" ? "已完成" : "已取消"}
                                </span>}
                            </div>
                            <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#F5F7FA]">
                                <div className="flex items-center">
                                    <i className="fa-solid fa-map-marker-alt mr-2"></i>
                                    <span>{project.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="fa-solid fa-calendar-alt mr-2"></i>
                                    <span>截止日期: {project.deadline}</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="fa-solid fa-eye mr-2"></i>
                                    <span>{project.views}浏览</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="fa-solid fa-file-signature mr-2"></i>
                                    <span>{project.applications}申请</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#F5F7FA]">¥{project.price}</p>
                            <div
                                className={`mt-2 px-3 py-1.5 inline-block rounded-full text-xs font-medium ${daysRemaining > 14 ? "bg-green-900/30 text-green-300 border border-green-700" : daysRemaining > 7 ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700" : daysRemaining > 0 ? "bg-orange-900/30 text-orange-300 border border-orange-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
                                {daysRemaining > 0 ? `${daysRemaining} 天后截止` : "已截止"}
                            </div>
                        </div>
                    </div>
                    {}
                    {(project.status === "inProgress" || project.status === "completed") && <div className="mb-4">
                        <div className="flex justify-between text-sm text-[#F5F7FA] mb-2">
                            <span>项目进度</span>
                            <span>{project.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-[#1E2532] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#4A5F8B]"
                                style={{
                                    width: `${project.progress}%`
                                }}></div>
                        </div>
                    </div>}
                    {}
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => <span
                            key={index}
                            className="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}
                        </span>)}
                    </div>
                </div>
                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-8">
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">项目描述</h2>
                            <p className="text-[#B8C6D8] leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">项目要求</h2>
                            <ul className="space-y-3">
                                {project.requirements.map(
                                    (req, index) => <li key={index} className="flex items-start text-[#B8C6D8]">
                                        <i
                                            className="fa-solid fa-check-circle text-[#4A5F8B] mt-1 mr-3 flex-shrink-0"></i>
                                        <span>{req}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {}
                        {project.status && (project.contractSigned !== undefined || project.paymentStatus || project.deliveryStatus) && <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">项目状态详情</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {project.contractSigned && <div className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#B8C6D8]">合同状态</span>
                                        <span
                                            className="px-2 py-1 bg-green-900/30 text-green-300 rounded-md border border-green-700 text-xs">已签署
                                                                    </span>
                                    </div>
                                    <p className="text-xs text-[#B8C6D8]">合同已于 {project.deadline}前签署完成
                                                              </p>
                                </div>}
                                {project.paymentStatus && <div className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#B8C6D8]">支付状态</span>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs border ${project.paymentStatus === "escrowed" ? "bg-blue-900/30 text-blue-300 border-blue-700" : project.paymentStatus === "released" ? "bg-green-900/30 text-green-300 border-green-700" : project.paymentStatus === "refunded" ? "bg-red-900/30 text-red-300 border-red-700" : "bg-yellow-900/30 text-yellow-300 border-yellow-700"}`}>
                                            {project.paymentStatus === "escrowed" ? "资金已托管" : project.paymentStatus === "released" ? "资金已结算" : project.paymentStatus === "refunded" ? "已退款" : "待支付"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#B8C6D8]">
                                        {project.paymentStatus === "escrowed" ? "资金已存入平台托管账户，待项目完成后释放" : project.paymentStatus === "released" ? "项目已完成，资金已释放给摄影师" : project.paymentStatus === "refunded" ? "项目已取消，资金已退还客户" : "等待客户支付项目费用"}
                                    </p>
                                </div>}
                                {project.deliveryStatus && <div className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[#B8C6D8]">交付状态</span>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs border ${project.deliveryStatus === "delivered" ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : project.deliveryStatus === "approved" ? "bg-green-900/30 text-green-300 border-green-700" : "bg-blue-900/30 text-blue-300 border-blue-700"}`}>
                                            {project.deliveryStatus === "delivered" ? "作品已交付" : project.deliveryStatus === "approved" ? "作品已验收" : "待交付"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#B8C6D8]">
                                        {project.deliveryStatus === "delivered" ? "摄影师已交付作品，等待客户验收" : project.deliveryStatus === "approved" ? "客户已确认验收作品，项目即将完成" : "摄影师正在准备作品交付"}
                                    </p>
                                </div>}
                            </div>
                        </div>}
                        {}
                        {project.matchedPhotographers && project.matchedPhotographers.length > 0 && <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">已匹配摄影师</h2>
                            <div className="space-y-4">
                                {project.matchedPhotographers.map(photographer => <></>)}
                            </div>
                        </div>}
                        {}
                        {isAuthenticated && project.status !== "completed" && project.status !== "cancelled" && <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">申请该项目</h2>
                            <form onSubmit={handleSubmitApplication}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="application"
                                        className="block text-sm font-medium text-[#B8C6D8] mb-2">申请理由
                                                            </label>
                                    <textarea
                                        id="application"
                                        value={applicationText}
                                        onChange={e => setApplicationText(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] h-32 resize-none"
                                        placeholder="请简要描述您为什么适合该项目，以及您的相关经验和优势..."></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <motion.button
                                        type="submit"
                                        whileHover={{
                                            scale: 1.02
                                        }}
                                        whileTap={{
                                            scale: 0.98
                                        }}
                                        disabled={isSubmittingApplication}
                                        className="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">
                                        {isSubmittingApplication ? <>
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>提交中...
                                                                    </> : <>
                                            <i className="fa-solid fa-paper-plane mr-2"></i>提交申请
                                                                    </>}
                                    </motion.button>
                                </div>
                            </form>
                        </div>}
                    </div>
                    {}
                    <div className="lg:col-span-1 space-y-6">
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">客户信息</h2>
                            <div className="flex items-center mb-4">
                                <div className="relative">
                                    <img
                                        src={project.company.avatar}
                                        alt={project.company.name}
                                        className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]" />
                                    {project.company.verified && <div
                                        className="absolute bottom-0 right-0 w-4 h-4 bg-[#4A5F8B] rounded-full border-2 border-[#2D3748] flex items-center justify-center">
                                        <i className="fa-solid fa-check text-[#F5F7FA] text-xs"></i>
                                    </div>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#F5F7FA]">{project.company.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <div className="flex items-center mr-3">
                                            <i className="fa-solid fa-star text-[#4A5F8B] mr-1"></i>
                                            <span className="text-sm text-[#B8C6D8]">{project.company.rating}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fa-solid fa-building mr-1 text-[#4A5F8B]"></i>
                                            <span className="text-sm text-[#B8C6D8]">{project.company.completedProjects}个项目</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                  // 查看客户主页
                                  toast.success(`查看客户 ${project.company.name} 主页`);
                                }}
                                className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">查看客户主页
                                             </button>
                        </div>
                        {}
                        {(project.status === "inProgress" || project.status === "completed") && <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">项目进度</h2>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={progressData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="transparent">
                                            {progressData.map(
                                                (entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            )}
                                        </Pie>
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-xl font-bold text-[#F5F7FA]">
                                            {project.progress}%
                                                                  </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>}
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">快捷操作</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={handleFavoriteProject}
                                    className="w-full py-2 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                                    <i className="fa-solid fa-bookmark mr-2"></i>收藏项目
                                                    </button>
                                 <button
                                     onClick={async () => {
                                       try {
                                         await navigator.clipboard.writeText(`${window.location.origin}/project/${id}`);
                                         toast.success('链接已复制到剪贴板');
                                       } catch (err) {
                                         toast.error('复制失败，请手动复制');
                                       }
                                     }}
                                     className="w-full py-2 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] relative z-10">
                                     <i className="fa-solid fa-share-alt mr-2"></i>分享项目
                                 </button>
                                <button
                                    className="w-full py-2 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                                    <i className="fa-solid fa-download mr-2"></i>下载项目资料
                                                    </button>
                                {isAuthenticated && project.status !== "completed" && project.status !== "cancelled" && <motion.button
                                    whileHover={{
                                        scale: 1.02
                                    }}
                                    whileTap={{
                                        scale: 0.98
                                    }}
                                    onClick={handleSubmitApplication}
                                    className="w-full py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">立即申请
                                                      </motion.button>}
                            </div>
                        </div>
                        {}
                        <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">项目咨询</h2>
                            <p className="text-sm text-[#B8C6D8] mb-4">如有任何疑问，可以直接联系客户进行咨询
                                              </p>
                            <button
                                className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                                <i className="fa-solid fa-comment-dots mr-2"></i>联系客户
                                              </button>
                        </div>
                    </div>
                </div>
                {/* 评论区 */}
                <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
                  <CommentSection postId={project.id} />
                </div>
            </motion.div>
        </div>
     );
  };

export default ProjectDetail;