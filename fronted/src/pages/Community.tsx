import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { ShareButton } from "../components/common/ShareButton";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LineChart,
    Line,
    Area,
    AreaChart,
    ComposedChart,
    CartesianGrid,
} from "recharts";

import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    avatar: string;
    level: number;
    stats: {
        posts: number;
        likes: number;
        days: number;
    };
}

interface Topic {
    id: string;
    title: string;
    content: string;
    author: User;
    tags: string[];
    createdAt: string;
    likes: number;
    comments: number;
    views: number;
    isEssential: boolean;
    isSticky: boolean;
    isSelected: boolean;
}

interface Notification {
    id: string;
    type: "like" | "comment" | "system" | "subscription";
    content: string;
    relatedId: string;
    createdAt: string;
    isRead: boolean;
}

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface ContributionDay {
    date: string;
    count: number;
    day: number;
    month: number;
    year: number;
}

interface Collection {
    id: string;
    name: string;
    description: string;
    topicIds: string[];
    createdAt: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: "active" | "contribution" | "social";
    progress: number;
    total: number;
    unlocked: boolean;
}

const mockUsers: User[] = [{
    id: "1",
    name: "极简摄影师林风",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
    level: 8,

    stats: {
        posts: 156,
        likes: 2345,
        days: 365}
}, {
    id: "2",
    name: "城市摄影师陈默",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1",
    level: 6,

    stats: {
        posts: 89,
        likes: 1234,
        days: 240
    }
}, {
    id: "3",
    name: "风景摄影爱好者",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91",
    level: 4,

    stats: {
        posts: 45,
        likes: 876,
        days: 180
    }
}];

const mockTopics: Topic[] = [{
    id: "1",
    title: "分享我的极简主义摄影心得",
    content: "在过去的一年里，我专注于极简主义摄影，通过简化构图和色彩，突出主题的本质。今天想和大家分享一些心得...",
    author: mockUsers[0],
    tags: ["极简主义", "构图", "心得"],
    createdAt: "2023-10-25",
    likes: 125,
    comments: 34,
    views: 890,
    isEssential: true,
    isSticky: false,
    isSelected: false
}, {
    id: "2",
    title: "【器材评测】索尼A7R V深度使用体验",
    content: "入手索尼A7R V已经三个月了，作为一名专业摄影师，我想从实际使用的角度分享一下这款相机的优缺点...",
    author: mockUsers[1],
    tags: ["器材评测", "索尼", "全画幅"],
    createdAt: "2023-10-24",
    likes: 230,
    comments: 56,
    views: 1250,
    isEssential: true,
    isSticky: true,
    isSelected: false
}, {
    id: "3",
    title: "寻找城市中的几何美感",
    content: "城市环境中蕴含着丰富的几何元素，这些线条和形状构成了独特的视觉语言。分享几个我常用的寻找和拍摄方法...",
    author: mockUsers[0],
    tags: ["城市摄影", "几何构图", "技巧"],
    createdAt: "2023-10-23",
    likes: 98,
    comments: 23,
    views: 650,
    isEssential: false,
    isSticky: false,
    isSelected: false
}, {
    id: "4",
    title: "风光摄影中的光线把握",
    content: "光线是摄影的灵魂，尤其是在风光摄影中。本文将探讨如何观察和利用不同时段的光线来创作精彩作品...",
    author: mockUsers[2],
    tags: ["风光摄影", "光线", "技巧"],
    createdAt: "2023-10-22",
    likes: 156,
    comments: 42,
    views: 980,
    isEssential: false,
    isSticky: false,
    isSelected: false
}];

const mockNotifications: Notification[] = [{
    id: "1",
    type: "like",
    content: "极简摄影师林风 点赞了你的作品",
    relatedId: "post123",
    createdAt: "2023-10-25 10:23",
    isRead: false
}, {
    id: "2",
    type: "comment",
    content: "城市摄影师陈默 评论了你的话题",
    relatedId: "topic456",
    createdAt: "2023-10-25 09:15",
    isRead: false
}, {
    id: "3",
    type: "system",
    content: "系统维护通知：平台将于今晚23:00-次日凌晨2:00进行维护",
    relatedId: "",
    createdAt: "2023-10-24 18:30",
    isRead: true
}];

const topicDistributionData: ChartData[] = [{
    name: "器材讨论",
    value: 35,
    color: "#4A5F8B"
}, {
    name: "摄影技巧",
    value: 25,
    color: "#6B7C93"
}, {
    name: "作品分享",
    value: 20,
    color: "#B8C6D8"
}, {
    name: "后期处理",
    value: 15,
    color: "#2D3748"
}, {
    name: "其他",
    value: 5,
    color: "#1E2532"
}];

const activityData7Days = [{
    date: "10/19",
    posts: 45,
    replies: 120,
    users: 89
}, {
    date: "10/20",
    posts: 52,
    replies: 130,
    users: 95
}, {
    date: "10/21",
    posts: 49,
    replies: 115,
    users: 92
}, {
    date: "10/22",
    posts: 63,
    replies: 145,
    users: 105
}, {
    date: "10/23",
    posts: 71,
    replies: 160,
    users: 110
}, {
    date: "10/24",
    posts: 85,
    replies: 190,
    users: 130
}, {
    date: "10/25",
    posts: 78,
    replies: 175,
    users: 125
}];

const activityData30Days = Array.from({
    length: 30
}).map((_, index) => ({
    date: `10/${index + 1}`,
    posts: Math.floor(Math.random() * 80) + 20,
    replies: Math.floor(Math.random() * 200) + 80,
    users: Math.floor(Math.random() * 140) + 60
}));

const activityData90Days = Array.from({
    length: 90
}).map((_, index) => ({
    date: `7/${index + 1}`,
    posts: Math.floor(Math.random() * 100) + 10,
    replies: Math.floor(Math.random() * 250) + 50,
    users: Math.floor(Math.random() * 160) + 40
}));

const generateContributionData = (): ContributionDay[] => {
    const data: ContributionDay[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        data.push({
            date: d.toISOString().split("T")[0],
            count: Math.floor(Math.random() * 5),
            day: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
        });
    }

    return data;
};

const mockCollections: Collection[] = [{
    id: "1",
    name: "摄影技巧",
    description: "收集各种摄影技巧和教程",
    topicIds: ["1", "3", "4"],
    createdAt: "2023-10-01"
}, {
    id: "2",
    name: "器材评测",
    description: "关注最新器材评测和体验",
    topicIds: ["2"],
    createdAt: "2023-10-15"
}];

const mockAchievements: Achievement[] = [{
    id: "active-1",
    title: "摄影新手",
    description: "发布第1篇帖子",
    icon: "fa-camera",
    category: "active",
    progress: 1,
    total: 1,
    unlocked: true
}, {
    id: "active-2",
    title: "坚持不懈",
    description: "连续登录7天",
    icon: "fa-calendar-check",
    category: "active",
    progress: 5,
    total: 7,
    unlocked: false
}, {
    id: "active-3",
    title: "创作达人",
    description: "发布50篇帖子",
    icon: "fa-pen-fancy",
    category: "active",
    progress: 12,
    total: 50,
    unlocked: false
}, {
    id: "contrib-1",
    title: "精华创作者",
    description: "获得5篇精华帖",
    icon: "fa-star",
    category: "contribution",
    progress: 2,
    total: 5,
    unlocked: false
}, {
    id: "contrib-2",
    title: "热门话题",
    description: "发布10个热门话题",
    icon: "fa-fire",
    category: "contribution",
    progress: 3,
    total: 10,
    unlocked: false
}, {
    id: "social-1",
    title: "社交达人",
    description: "拥有100个粉丝",
    icon: "fa-users",
    category: "social",
    progress: 72,
    total: 100,
    unlocked: false
}, {
    id: "social-2",
    title: "万人迷",
    description: "获得1000个点赞",
    icon: "fa-heart",
    category: "social",
    progress: 896,
    total: 1000,
    unlocked: false
}];

const ContributionCalendar: React.FC = () => {
    const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const [tooltipPosition, setTooltipPosition] = useState({
        x: 0,
        y: 0
    });

    useEffect(() => {
        setContributionData(generateContributionData());
    }, []);

    const getColorByCount = (count: number) => {
        if (count === 0)
            return "bg-[#1E2532]";

        if (count === 1)
            return "bg-[#4A5F8B]/30";

        if (count === 2)
            return "bg-[#4A5F8B]/60";

        return "bg-[#4A5F8B]";
    };

    const handleDayClick = (day: ContributionDay, event: React.MouseEvent) => {
        setSelectedDay(day);

        setTooltipPosition({
            x: event.clientX,
            y: event.clientY - 100
        });

        setShowTooltip(true);
    };

    const closeTooltip = () => {
        setShowTooltip(false);
        setSelectedDay(null);
    };

    const weeks = [];

    for (let i = 0; i < 52; i++) {
        weeks.push(contributionData.slice(i * 7, (i + 1) * 7));
    }

    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const firstDayOfWeek = new Date(2023, 0, 2).getDay();

    return (
        <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">用户贡献</h3>
            {}
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#B8C6D8]">过去一个月的活动</div>
                <div className="flex items-center space-x-2">
                    <div className="text-xs text-[#B8C6D8]">较少</div>
                    <div className="w-3 h-3 bg-[#1E2532] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#4A5F8B]/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-[#4A5F8B]/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-[#4A5F8B] rounded-full"></div>
                    <div className="text-xs text-[#B8C6D8]">较多</div>
                </div>
            </div>
            {}
            <div className="grid grid-cols-12 gap-1 mb-2">
                {monthNames.map((month, index) => <div
                    key={index}
                    className="text-center text-xs text-[#B8C6D8]"
                    style={{
                        gridColumnStart: index * 4.33 + 1
                    }}>
                    {month}
                </div>)}
            </div>
            {}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["一", "二", "三", "四", "五", "六", "日"].map(day => <div key={day} className="text-center text-xs text-[#B8C6D8]">
                    {day}
                </div>)}
            </div>
            {}
            <div className="grid grid-cols-7 gap-1" onMouseLeave={closeTooltip}>
                {}
                {Array.from({
                    length: firstDayOfWeek
                }).map(
                    (_, index) => <div key={`empty-${index}`} className="w-3 h-3 rounded-full"></div>
                )}
                {}
                {contributionData.map((day, index) => <div
                    key={day.date}
                    className={`w-3 h-3 rounded-full ${getColorByCount(day.count)} cursor-pointer hover:ring-2 hover:ring-[#F5F7FA]/50 transition-all`}
                    onClick={e => handleDayClick(day, e)}
                    title={`${day.date}: ${day.count} 次活动`}></div>)}
            </div>
            {}
            <div className="mt-4 flex justify-between text-sm text-[#B8C6D8]">
                <div>总活动天数: {contributionData.filter(day => day.count > 0).length}</div>
                <div>平均每天: {(contributionData.reduce((sum, day) => sum + day.count, 0) / contributionData.length).toFixed(1)}次</div>
                <div>总计: {contributionData.reduce((sum, day) => sum + day.count, 0)}次</div>
            </div>
            {}
            <AnimatePresence>
                {showTooltip && selectedDay && <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    className="fixed bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-3 shadow-lg z-50"
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y
                    }}>
                    <div className="font-medium text-[#F5F7FA]">{`${selectedDay.year}年${selectedDay.month + 1}月${selectedDay.day}日`}</div>
                    <div className="text-[#B8C6D8] text-sm">{`${selectedDay.count} 次活动`}</div>
                    {selectedDay.count > 0 && <div className="text-xs text-[#6B7C93] mt-1">
                        {selectedDay.count === 1 && "发布了1篇帖子"}
                        {selectedDay.count === 2 && "发布了1篇帖子，回复了1次"}
                        {selectedDay.count === 3 && "发布了1篇帖子，回复了2次"}
                        {selectedDay.count === 4 && "发布了2篇帖子，回复了2次"}
                    </div>}
                </motion.div>}
            </AnimatePresence>
        </div>
    );
};

const ActivityTrendChart: React.FC = () => {
    const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("7days");
    const [activityData, setActivityData] = useState(activityData7Days);

    useEffect(() => {
        switch (timeRange) {
        case "7days":
            setActivityData(activityData7Days);
            break;
        case "30days":
            setActivityData(activityData30Days);
            break;
        case "90days":
            setActivityData(activityData90Days);
            break;
        }
    }, [timeRange]);

    return (
        <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">活跃度趋势</h3>
            {}
            <div className="flex space-x-2 mb-6">
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setTimeRange("7days")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "7days" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B]/50"} transition-colors`}>7天
                                                                            </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setTimeRange("30days")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "30days" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B]/50"} transition-colors`}>30天
                                                                            </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setTimeRange("90days")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "90days" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B]/50"} transition-colors`}>90天
                                                                            </motion.button>
            </div>
            {}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                        <XAxis
                            dataKey="date"
                            tick={{
                                fill: "#B8C6D8"
                            }}
                            interval={timeRange === "7days" ? 0 : timeRange === "30days" ? 4 : 14} />
                        <YAxis
                            yAxisId="left"
                            tick={{
                                fill: "#B8C6D8"
                            }} />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{
                                fill: "#B8C6D8"
                            }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#2D3748",
                                borderColor: "#4A5F8B",
                                borderRadius: "8px"
                            }}
                            labelStyle={{
                                color: "#F5F7FA"
                            }}
                            itemStyle={{
                                color: "#B8C6D8"
                            }} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="posts"
                            stroke="#4A5F8B"
                            strokeWidth={2}
                            dot={{
                                r: 3
                            }}
                            activeDot={{
                                r: 5
                            }}
                            name="发帖数"
                            yAxisId="left" />
                        <Line
                            type="monotone"
                            dataKey="replies"
                            stroke="#6B7C93"
                            strokeWidth={2}
                            dot={{
                                r: 3
                            }}
                            activeDot={{
                                r: 5
                            }}
                            name="回复数"
                            yAxisId="left" />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#B8C6D8"
                            fill="#4A5F8B"
                            fillOpacity={0.3}
                            name="用户数"
                            yAxisId="right" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            {}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#1E2532] p-3 rounded-lg">
                    <div className="text-xs text-[#6B7C93]">总发帖数</div>
                    <div className="text-lg font-bold text-[#F5F7FA]">
                        {activityData.reduce((sum, day) => sum + day.posts, 0)}
                    </div>
                </div>
                <div className="bg-[#1E2532] p-3 rounded-lg">
                    <div className="text-xs text-[#6B7C93]">总回复数</div>
                    <div className="text-lg font-bold text-[#F5F7FA]">
                        {activityData.reduce((sum, day) => sum + day.replies, 0)}
                    </div>
                </div>
                <div className="bg-[#1E2532] p-3 rounded-lg">
                    <div className="text-xs text-[#6B7C93]">活跃用户</div>
                    <div className="text-lg font-bold text-[#F5F7FA]">
                        {Math.max(...activityData.map(day => day.users))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PollOption {
    id: string;
    text: string;
    votes: number;
    color: string;
}

interface PollProps {
    id: string;
    question: string;
    options: PollOption[];
    multiSelect?: boolean;
    expiresAt?: string;
    onVote?: (optionId: string, isAdd: boolean) => void;
}

export const Poll: React.FC<PollProps> = (
    {
        id,
        question,
        options,
        multiSelect = false,
        expiresAt,
        onVote
    }
) => {
    const {
        isAuthenticated
    } = useAuth();

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [voted, setVoted] = useState<boolean>(false);
    const [votedOptions, setVotedOptions] = useState<string[]>([]);

    useEffect(() => {
        const savedVote = localStorage.getItem(`poll_vote_${id}`);

        if (savedVote) {
            try {
                const saved = JSON.parse(savedVote);
                setVoted(true);
                setVotedOptions(saved.options || []);
            } catch (e) {
                console.error("Failed to parse saved vote", e);
            }
        }
    }, [id]);

    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

    const handleOptionSelect = (optionId: string) => {
        if (!isAuthenticated) {
            toast.info("请先登录后再投票");
            return;
        }

        if (voted)
            return;

        if (multiSelect) {
            setSelectedOptions(
                prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
            );
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const handleSubmitVote = () => {
        if (!isAuthenticated) {
            toast.info("请先登录后再投票");
            return;
        }

        if (selectedOptions.length === 0) {
            toast.warning("请选择至少一个选项");
            return;
        }

        localStorage.setItem(`poll_vote_${id}`, JSON.stringify({
            timestamp: new Date().toISOString(),
            options: selectedOptions
        }));

        setVoted(true);
        setVotedOptions(selectedOptions);

        selectedOptions.forEach(optionId => {
            if (onVote) {
                onVote(optionId, true);
            }
        });

        toast.success("投票成功！");
    };

    const renderOption = (option: PollOption, index: number) => {
        const percentage = totalVotes > 0 ? option.votes / totalVotes * 100 : 0;
        const isSelected = selectedOptions.includes(option.id);
        const isVotedFor = votedOptions.includes(option.id);

        return (
            <div key={option.id} className="mb-3">
                <div
                    className={`p-3 rounded-lg cursor-pointer transition-all ${voted ? isVotedFor ? "bg-[#4A5F8B]/20 border border-[#4A5F8B]" : "bg-[#2D3748] border border-[#4A5F8B]/30" : isSelected ? "bg-[#4A5F8B]/20 border border-[#4A5F8B]" : "bg-[#2D3748] border border-[#4A5F8B]/30 hover:border-[#4A5F8B]"}`}
                    onClick={() => handleOptionSelect(option.id)}>
                    <div className="flex items-center mb-2">
                        <div
                            className={`w-5 h-5 rounded-full border-2 mr-2 flex-shrink-0 flex items-center justify-center ${voted ? isVotedFor ? `border-${option.color} bg-${option.color}` : "border-[#6B7C93]" : isSelected ? `border-${option.color} bg-${option.color}` : "border-[#6B7C93]"}`}>
                            {voted && isVotedFor && <i className="fa-solid fa-check text-white text-xs"></i>}
                            {!voted && isSelected && <i className="fa-solid fa-check text-white text-xs"></i>}
                        </div>
                        <span className="text-[#F5F7FA]">{option.text}</span>
                    </div>
                    {voted && <div className="space-y-1">
                        <div className="w-full bg-[#1E2532] h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{
                                    width: 0
                                }}
                                animate={{
                                    width: `${percentage}%`
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}
                                className="h-full rounded-full"
                                style={{
                                    backgroundColor: option.color
                                }}></motion.div>
                        </div>
                        <div className="flex justify-between text-xs text-[#B8C6D8]">
                            <span>{option.votes}票</span>
                            <span>{percentage.toFixed(1)}%</span>
                        </div>
                    </div>}
                </div>
            </div>
        );
    };

    return <></>;
};

interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    role: "owner" | "admin" | "member";
    joinDate: string;
}

interface Group {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    avatar: string;
    members: GroupMember[];
    posts: number;
    createdAt: string;
    isPublic: boolean;
    joined: boolean;
    tags: string[];
}

interface GroupCardProps {
    group: Group;
    onJoin?: (groupId: string) => void;
    onLeave?: (groupId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = (
    {
        group,
        onJoin,
        onLeave
    }
) => {
    const {
        isAuthenticated
    } = useAuth();

    const handleJoinLeave = () => {
        if (!isAuthenticated) {
            toast.info("请先登录后再操作");
            return;
        }

        if (group.joined) {
            if (window.confirm(`确定要退出"${group.name}"小组吗？`)) {
                if (onLeave) {
                    onLeave(group.id);
                }

                toast.success(`已退出"${group.name}"小组`);
            }
        } else {
            if (onJoin) {
                onJoin(group.id);
            }

            toast.success(`已加入"${group.name}"小组`);
        }
    };

    return (
        <motion.div
            whileHover={{
                y: -5,
                boxShadow: "0 8px 24px rgba(74,95,139,0.3)",

                transition: {
                    duration: 0.3
                }
            }}
            style={{
                transformStyle: "preserve-3d",
                backgroundColor: "transparent"
            }}
            className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-32">
                <img
                    src={group.coverImage}
                    alt={`${group.name} cover`}
                    className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                    <div
                        className="w-16 h-16 rounded-full border-2 border-[#2D3748] overflow-hidden">
                        <img
                            src={group.avatar}
                            alt={group.name}
                            className="w-full h-full object-cover" />
                    </div>
                </div>
                {!group.isPublic && <div
                    className="absolute top-3 right-3 px-2 py-1 bg-[#1E2532]/80 text-white text-xs rounded-full">
                    <i className="fa-solid fa-lock mr-1"></i>私密
                                                                            </div>}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-1">{group.name}</h3>
                <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{group.description}</p>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <span className="text-sm text-[#B8C6D8]">
                            {group.members.length}成员
                                                                                 </span>
                        <span className="mx-2 text-[#6B7C93]">•</span>
                        <span className="text-sm text-[#B8C6D8]">
                            {group.posts}帖子
                                                                                 </span>
                    </div>
                    <span className="text-xs text-[#6B7C93]">创建于 {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                    {group.tags.map((tag, index) => <span
                        key={index}
                        className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}
                    </span>)}
                </div>
                <motion.button
                    whileHover={{
                        scale: 1.03
                    }}
                    whileTap={{
                        scale: 0.97
                    }}
                    onClick={handleJoinLeave}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${group.joined ? "bg-[#F56565] text-white hover:bg-[#E53E3E]" : "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]"}`}>
                    {group.joined ? "退出小组" : "加入小组"}
                </motion.button>
            </div>
        </motion.div>
    );
};

// 模拟小组数据
const mockGroups: Group[] = [
  {
    id: "g1",
    name: "风光摄影爱好者",
    description: "专注于分享和交流风光摄影技巧、作品和器材使用经验。无论你是专业摄影师还是业余爱好者，都能在这里找到志同道合的朋友。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104",
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    posts: 345,
    createdAt: "2023-01-15",
    isPublic: true,
    joined: true,
    tags: ["风光", "自然", "户外", "风景"]
  },
  {
    id: "g2",
    name: "人像摄影技巧交流",
    description: "探讨人像摄影的光线运用、构图技巧、引导模特等专业内容。分享最新人像作品，互相学习进步。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20group%20creative&sign=ad812d2b6b21ee3f52025b0964288c97",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57",
    members: [mockUsers[1], mockUsers[2]],
    posts: 267,
    createdAt: "2023-03-20",
    isPublic: true,
    joined: false,
    tags: ["人像", "肖像", "模特", "自然光"]
  },
  {
    id: "g3",
    name: "城市街头摄影",
    description: "记录城市生活的瞬间，捕捉街头的故事和人文情怀。分享街头摄影的技巧和设备推荐。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20city%20street%20group&sign=e076386c6e6cb8682835ab9a15e145e7",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo&sign=d6bc81adc6768a530f17c2ee445c92ce",
    members: [mockUsers[0], mockUsers[1]],
    posts: 189,
    createdAt: "2023-02-10",
    isPublic: true,
    joined: false,
    tags: ["街头", "城市", "人文", "纪实"]
  },
  {
    id: "g4",
    name: "器材玩家俱乐部",
    description: "摄影器材的深度评测、使用心得和购买建议。从相机、镜头到各种配件，我们聊的都是硬货。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20equipment%20camera%20lenses%20group&sign=de7808fe088e719e100bdd4ab79d5448",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20club%20logo&sign=11b90cf1c2e6893f916de925d4e82f15",
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    posts: 412,
    createdAt: "2023-04-05",
    isPublic: true,
    joined: true,
    tags: ["器材", "评测", "购买", "配件"]
  },
  {
    id: "g5",
    name: "后期修图大师班",
    description: "分享PS、Lightroom等后期修图技巧，从基础调整到高级合成，提升你的作品质感。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photo%20editing%20workspace%20post%20processing%20group&sign=bf46adb74ee31c030f652bf8ac9e19e7",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editing%20club%20logo&sign=0561d34d4200e2caa00089faf67fcaef",
    members: [mockUsers[1], mockUsers[2]],
    posts: 234,
    createdAt: "2023-05-15",
    isPublic: true,
    joined: false,
    tags: ["后期", "修图", "PS", "Lightroom"]
  },
  {
    id: "g6",
    name: "手机摄影达人",
    description: "用手机也能拍出大片！分享手机摄影技巧、配件使用和后期修图APP推荐。",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=mobile%20photography%20smartphone%20camera%20group&sign=7ad2126eb7f0147b6c8fbb8e6ba94dca",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mobile%20photography%20club%20logo&sign=07f813a1329616c29de7a5dccf800f5f",
    members: [mockUsers[0], mockUsers[2]],
    posts: 176,
    createdAt: "2023-06-10",
    isPublic: true,
    joined: false,
    tags: ["手机", "手机摄影", "APP", "便携"]
  }
];

const CollectionsManager: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>(mockCollections);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDesc, setNewCollectionDesc] = useState("");
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [showBatchActions, setShowBatchActions] = useState(false);

    const createCollection = () => {
        if (!newCollectionName.trim()) {
            toast.warning("请输入收藏夹名称");
            return;
        }

        const newCollection: Collection = {
            id: `collection-${Date.now()}`,
            name: newCollectionName,
            description: newCollectionDesc,
            topicIds: [],
            createdAt: new Date().toISOString().split("T")[0]
        };

        setCollections([newCollection, ...collections]);
        setNewCollectionName("");
        setNewCollectionDesc("");
        setShowCreateForm(false);
        toast.success("收藏夹创建成功");
    };

    const deleteCollection = (id: string) => {
        if (window.confirm("确定要删除这个收藏夹吗？")) {
            setCollections(collections.filter(collection => collection.id !== id));
            toast.success("收藏夹已删除");
        }
    };

    const toggleCollectionSelection = (id: string) => {
        setSelectedCollections(
            prev => prev.includes(id) ? prev.filter(collectionId => collectionId !== id) : [...prev, id]
        );
    };

    const exportCollections = () => {
        const selectedData = collections.filter(collection => selectedCollections.includes(collection.id)).map(collection => ({
            id: collection.id,
            name: collection.name,
            description: collection.description,

            topics: mockTopics.filter(topic => collection.topicIds.includes(topic.id)).map(topic => ({
                id: topic.id,
                title: topic.title,
                author: topic.author.name,
                createdAt: topic.createdAt
            }))
        }));

        const dataStr = JSON.stringify(selectedData, null, 2);

        const blob = new Blob([dataStr], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `collections-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("收藏夹导出成功");
        setSelectedCollections([]);
        setShowBatchActions(false);
    };

    const importCollections = () => {
        toast.info("导入功能即将上线");
    };

    return <></>;
};

const AchievementSystem: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
    const [activeCategory, setActiveCategory] = useState<"all" | "active" | "contribution" | "social">("all");

    const filteredAchievements = achievements.filter(
        achievement => activeCategory === "all" || achievement.category === activeCategory
    );

    const progress = (achievement: Achievement) => {
        return achievement.progress / achievement.total * 100;
    };

    const shareAchievement = (achievement: Achievement) => {
        toast.success(`已分享成就：${achievement.title}`);
    };

    const getCategoryName = (category: string) => {
        switch (category) {
        case "active":
            return "活跃成就";
        case "contribution":
            return "贡献成就";
        case "social":
            return "社交成就";
        default:
            return "全部成就";
        }
    };

    return <></>;
};

// 创建小组表单组件
const CreateGroupForm: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (group: Partial<Group>) => void }> = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("public");
  const [groupTags, setGroupTags] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.warning("请输入小组名称");
      return;
    }
    
    const newGroup = {
      name: groupName,
      description: groupDescription,
      isPublic: groupType === "public",
      tags: groupTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
    
    onCreate(newGroup);
    onClose();
    
    // 重置表单
    setGroupName("");
    setGroupDescription("");
    setGroupType("public");
    setGroupTags("");
    
    toast.success("小组创建成功！");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#F5F7FA]">创建摄影小组</h2>
            <button
              className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
              onClick={onClose}
            >
              <i className="fa-solid fa-times text-lg"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组名称 <span className="text-[#F56565]">*</span></label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="请输入小组名称"
                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                maxLength={50}
                required
              />
              <p className="text-xs text-[#6B7C93] mt-1">2-50个字符，简洁明了地表达小组主题</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组描述</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="介绍你的小组主题、目标和成员可以获得什么..."
                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-[#6B7C93] mt-1">最多500个字符，详细的介绍能吸引更多成员</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组类型</label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="groupType"
                    value="public"
                    checked={groupType === "public"}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-4 h-4 text-[#4A5F8B] bg-[#1E2532] border-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                  />
                  <span className="ml-2 text-[#B8C6D8]">公开小组</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="groupType"
                    value="private"
                    checked={groupType === "private"}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-4 h-4 text-[#4A5F8B] bg-[#1E2532] border-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                  />
                  <span className="ml-2 text-[#B8C6D8]">私密小组</span>
                </label>
              </div>
              <p className="text-xs text-[#6B7C93] mt-1">公开小组：任何人都可以发现并加入；私密小组：只有通过邀请才能加入</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#B8C6D8] mb-1">标签</label>
              <input
                type="text"
                value={groupTags}
                onChange={(e) => setGroupTags(e.target.value)}
                placeholder="输入标签，用逗号分隔，最多5个标签"
                className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <p className="text-xs text-[#6B7C93] mt-1">添加相关标签，让更多志同道合的人找到你的小组</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center justify-center"
              >
                <i className="fa-solid fa-plus-circle mr-2"></i>
                创建小组
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Community: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>(mockTopics);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [batchMode, setBatchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortType, setSortType] = useState("latest");
    const [bookmarkPositions, setBookmarkPositions] = useState<Record<string, number>>({});
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    // 小组相关状态
    const [groups, setGroups] = useState<Group[]>(mockGroups);
    const [showGroups, setShowGroups] = useState(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);

    const toggleTopicSelection = (id: string) => {
        setSelectedTopics(
            prev => prev.includes(id) ? prev.filter(topicId => topicId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTopics.length === topics.length) {
            setSelectedTopics([]);
        } else {
            setSelectedTopics(topics.map(topic => topic.id));
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({
            ...notification,
            isRead: true
        })));
    };

    const toggleBatchMode = () => {
        setBatchMode(!batchMode);
        setSelectedTopics([]);
    };

    const filteredAndSortedTopics = topics.filter(topic => {
        if (searchQuery && !topic.title.toLowerCase().includes(searchQuery.toLowerCase()) && !topic.content.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        if (filterType === "essential" && !topic.isEssential) {
            return false;
        } else if (filterType === "sticky" && !topic.isSticky) {
            return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortType === "popular") {
            return b.likes - a.likes;
        } else {
            return b.comments - a.comments;
        }
    });

    const getLevelBadgeClass = (level: number) => {
        if (level >= 9)
            return "bg-gradient-to-r from-yellow-400 to-amber-600 text-white";

        if (level >= 7)
            return "bg-blue-800 text-white";

        if (level >= 5)
            return "bg-[#4A5F8B] text-white";

        if (level >= 3)
            return "bg-gray-600 text-white";

        return "bg-gray-300 text-gray-800";
    };

    const getNotificationColorClass = (type: Notification["type"]) => {
        switch (type) {
        case "like":
            return "bg-red-500/10 text-red-400";
        case "comment":
            return "bg-blue-500/10 text-blue-400";
        case "system":
            return "bg-orange-500/10 text-orange-400";
        case "subscription":
            return "bg-green-500/10 text-green-400";
        default:
            return "bg-gray-500/10 text-gray-400";
        }
    };

    const getNotificationIcon = (type: Notification["type"]) => {
        switch (type) {
        case "like":
            return "fa-heart";
        case "comment":
            return "fa-comment";
        case "system":
            return "fa-bell";
        case "subscription":
            return "fa-rss";
        default:
            return "fa-info";
        }
    };

    const saveBookmarkPosition = (topicId: string, position: number) => {
        const newPositions = {
            ...bookmarkPositions,
            [topicId]: position
        };

        setBookmarkPositions(newPositions);
        localStorage.setItem("bookmarkPositions", JSON.stringify(newPositions));
        toast.success("阅读进度已保存");
    };

    useEffect(() => {
        const saved = localStorage.getItem("bookmarkPositions");

        if (saved) {
            setBookmarkPositions(JSON.parse(saved));
        }
    }, []);
    
    // 处理加入/退出小组
    const handleJoinLeaveGroup = (groupId: string) => {
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId 
            ? { ...group, joined: !group.joined } 
            : group
        )
      );
    };
    
    // 处理创建小组
    const handleCreateGroup = (newGroup: Partial<Group>) => {
      const group: Group = {
        id: `g${Date.now()}`,
        name: newGroup.name || "",
        description: newGroup.description || "",
        coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=default%20group%20cover%20photography&sign=3bc880c564b24e50436a36ff7e049628",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default%20group%20logo%20photography&sign=dffce2dd824c325946b2f4c9d5864412",
        members: [mockUsers[0]], // 假设创建者是当前用户
        posts: 0,
        createdAt: new Date().toISOString(),
        isPublic: newGroup.isPublic || true,
        joined: true, // 创建者默认加入
        tags: newGroup.tags || []
      };
      
      setGroups(prevGroups => [group, ...prevGroups]);
    };

    return (
        <div
            className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">摄影社区</h1>
                    <p className="text-[#B8C6D8]">与全球摄影爱好者分享交流，探讨摄影技术与艺术</p>
                </div>
                {}
                <div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    {}
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="搜索话题、用户或标签..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                        <i
                            className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        {}
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <div className="flex items-center">
                                <span className="text-sm text-[#B8C6D8] mr-2">筛选:</span>
                                <select
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                    className="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                    <option value="all">全部话题</option>
                                    <option value="essential">精华话题</option>
                                    <option value="sticky">置顶话题</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-[#B8C6D8] mr-2">排序:</span>
                                <select
                                    value={sortType}
                                    onChange={e => setSortType(e.target.value)}
                                    className="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                    <option value="latest">最新发布</option>
                                    <option value="popular">最多点赞</option>
                                    <option value="comments">最多评论</option>
                                </select>
                            </div>
                        </div>
                        {}
                        <motion.button
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={toggleBatchMode}
                            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center">
                            <i className={`fa-solid ${batchMode ? "fa-xmark" : "fa-list-check"} mr-2`}></i>
                            {batchMode ? "退出批量操作" : "批量管理"}
                        </motion.button>
                        {}
                        <div className="relative">
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center hover:bg-[#6B7C93] transition-colors">
                                <i className="fa-solid fa-bell"></i>
                                {unreadCount > 0 && <span
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F56565] text-white text-xs flex items-center justify-center">
                                    {unreadCount}
                                </span>}
                            </motion.button>
                            {}
                            <AnimatePresence>
                                {showNotifications && <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -10
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10
                                    }}
                                    className="absolute right-0 mt-2 w-80 bg-[#2D3748] border border-[#4A5F8B] rounded-lg shadow-lg z-10">
                                    <div
                                        className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
                                        <h3 className="font-medium text-[#F5F7FA]">通知</h3>
                                        {unreadCount > 0 && <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-[#4A5F8B] hover:text-[#B8C6D8]">全部已读
                                                                                                                                                             </button>}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? notifications.map(notification => <motion.div
                                            key={notification.id}
                                            initial={{
                                                opacity: 0,
                                                x: 20
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0
                                            }}
                                            transition={{
                                                duration: 0.3
                                            }}
                                            className={`p-4 border-b border-[#4A5F8B] ${notification.isRead ? "" : "bg-[#4A5F8B]/20"}`}>
                                            <div className="flex items-start">
                                                <div
                                                    className={`p-2 rounded-full ${getNotificationColorClass(notification.type)} mr-3`}>
                                                    <i className={`fa-solid ${getNotificationIcon(notification.type)}`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-[#F5F7FA]">{notification.content}</p>
                                                    <p className="text-xs text-[#6B7C93] mt-1">{notification.createdAt}</p>
                                                </div>
                                                {!notification.isRead && <span className="w-2 h-2 rounded-full bg-[#F56565]"></span>}
                                            </div>
                                        </motion.div>) : <div className="p-6 text-center text-[#B8C6D8]">
                                            <i className="fa-solid fa-bell-slash text-2xl mb-2"></i>
                                            <p>暂无通知</p>
                                        </div>}
                                    </div>
                                </motion.div>}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                {}
                <AnimatePresence>
                    {batchMode && <motion.div
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        exit={{
                            opacity: 0,
                            height: 0
                        }}
                        className="mb-6 bg-[#2D3748] rounded-lg border border-[#4A5F8B] p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedTopics.length > 0 && selectedTopics.length === topics.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B] mr-2" />
                                <span className="text-[#B8C6D8]">已选择 {selectedTopics.length}个话题</span>
                            </div>
                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    disabled={selectedTopics.length === 0}
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed" : "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]"}`}>
                                    <i className="fa-solid fa-star mr-1"></i>设为精华
                                                                                                                               </motion.button>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    disabled={selectedTopics.length === 0}
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed" : "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]"}`}>
                                    <i className="fa-solid fa-thumbtack mr-1"></i>置顶
                                                                                                                               </motion.button>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    disabled={selectedTopics.length === 0}
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed" : "bg-[#F56565] text-white hover:bg-[#E53E3E]"}`}>
                                    <i className="fa-solid fa-trash mr-1"></i>删除
                                                                                                                               </motion.button>
                            </div>
                        </div>
                    </motion.div>}
                </AnimatePresence>
                {}
                
                 {/* 小组入口 */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#F5F7FA]">摄影小组</h2>
                    <motion.button
                      whileHover={{
                        scale: 1.05
                      }}
                      whileTap={{
                        scale: 0.95
                      }}
                      className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center">
                      <i className="fa-solid fa-users mr-2"></i>
                      查看所有小组
                    </motion.button>
                  </div>
                  
                  {/* 小组卡片预览 - 只显示前3个 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {groups.slice(0, 3).map(group => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        onJoin={() => handleJoinLeaveGroup(group.id)}
                        onLeave={() => handleJoinLeaveGroup(group.id)}
                      />
                    ))}
                  </div>
1701|                   {/* 查看更多按钮 */}
                  <div className="mt-6 text-center">
                    <Link to="/groups">
                      <motion.button
                        whileHover={{
                          scale: 1.03
                        }}
                        whileTap={{
                          scale: 0.97
                        }}
                        className="px-6 py-2 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                      >
                        查看全部小组 <i className="fa-solid fa-chevron-right ml-1"></i>
                      </motion.button>
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-6">
                        {}
                        <></>
                        {filteredAndSortedTopics.map(topic => <motion.div
                            key={topic.id}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.3
                            }}
                            whileHover={{
                                rotateY: 1.5,
                                scale: 1.02,
                                boxShadow: "0 8px 24px rgba(74,95,139,0.3)",

                                transition: {
                                    duration: 0.3
                                }
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                                backgroundColor: "transparent"
                            }}
                            className={`bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm cursor-pointer relative ${topic.isSelected ? "ring-2 ring-[#4A5F8B]" : ""}`}
                            onClick={() => window.location.href = `/post/${topic.id}`}>
                            <div className="p-6">
                                {}
                                <ShareButton
                                    url={`${window.location.origin}/post/${topic.id}`}
                                    title={topic.title}
                                    className="absolute top-4 right-4"
                                    size="sm" />
                                {}
                                {batchMode && <div className="flex items-start mb-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(topic.id)}
                                        onChange={() => toggleTopicSelection(topic.id)}
                                        className="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B] mt-1" />
                                </div>}
                                {}
                                <div className="flex items-center space-x-2 mb-3">
                                    {topic.isEssential && <span
                                        className="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full flex items-center">
                                        <i className="fa-solid fa-star mr-1"></i>精华
                                                                                                                                               </span>}
                                    {topic.isSticky && <span
                                        className="px-2 py-1 bg-[#48BB78]/20 text-[#48BB78] text-xs rounded-full flex items-center">
                                        <i className="fa-solid fa-thumbtack mr-1"></i>置顶
                                                                                                                                               </span>}
                                </div>
                                {}
                                <h2 className="text-xl font-bold text-[#F5F7FA] mb-3">
                                    {topic.title}
                                </h2>
                                {}
                                <p className="text-[#B8C6D8] mb-4 line-clamp-2">
                                    {topic.content}
                                </p>
                                {}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {topic.tags.map((tag, index) => <span
                                        key={index}
                                        className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">
                                        {tag}
                                    </span>)}
                                </div>
                                {}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img
                                            src={topic.author.avatar}
                                            alt={topic.author.name}
                                            className="w-10 h-10 rounded-full object-cover mr-3" />
                                        <div>
                                            <div className="flex items-center">
                                                <span className="text-[#F5F7FA] font-medium">{topic.author.name}</span>
                                                <div className="ml-2 relative group">
                                                    <span
                                                        className={`text-xs px-1.5 py-0.5 rounded ${getLevelBadgeClass(topic.author.level)}`}>Lv{topic.author.level}
                                                    </span>
                                                    <div
                                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-[#1E2532] text-[#B8C6D8] text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">发帖: {topic.author.stats.posts}| 获赞: {topic.author.stats.likes}| 活跃: {topic.author.stats.days}天
                                                                                                                                                                                                     </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#6B7C93]">{topic.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center text-[#6B7C93]">
                                            <i className="fa-solid fa-heart mr-1"></i>
                                            <span>{topic.likes}</span>
                                        </div>
                                        <div className="flex items-center text-[#6B7C93]">
                                            <i className="fa-solid fa-comment mr-1"></i>
                                            <span>{topic.comments}</span>
                                        </div>
                                        <div className="flex items-center text-[#6B7C93]">
                                            <i className="fa-solid fa-eye mr-1"></i>
                                            <span>{topic.views}</span>
                                        </div>
                                    </div>
                                </div>
                                {}
                                {bookmarkPositions[topic.id] !== undefined && <div className="mt-4 flex items-center text-xs text-[#4A5F8B]">
                                    <i className="fa-solid fa-bookmark mr-1"></i>
                                    <span>上次阅读进度已保存</span>
                                </div>}
                            </div>
                        </motion.div>)}
                    </div>
                    {}
                    <div className="space-y-6">
                        {}
                        <ContributionCalendar />
                        {}
                        <ActivityTrendChart />
                        {}
                        <CollectionsManager />
                        {}
                        <AchievementSystem />
                        {}
                        {}
                        <Poll
                            id="weekly-poll"
                            question="你最常用的摄影题材是什么？"
                            options={[{
                                id: "landscape",
                                text: "风光摄影",
                                votes: 128,
                                color: "#4A5F8B"
                            }, {
                                id: "portrait",
                                text: "人像摄影",
                                votes: 95,
                                color: "#6B7C93"
                            }, {
                                id: "street",
                                text: "街头摄影",
                                votes: 76,
                                color: "#B8C6D8"
                            }, {
                                id: "architecture",
                                text: "建筑摄影",
                                votes: 54,
                                color: "#2D3748"
                            }, {
                                id: "wildlife",
                                text: "野生动物摄影",
                                votes: 32,
                                color: "#1E2532"
                            }]}
                            multiSelect={false}
                            expiresAt="2025-12-31" />
                        {}
                        {}
                        <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">话题分布</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topicDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            labelLine={false}
                                            label={(
                                                {
                                                    name,
                                                    percent
                                                }
                                            ) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {topicDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {}
                        {}
                        <></>
                        {}
                        <></>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Community;