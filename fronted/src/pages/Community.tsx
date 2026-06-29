import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { ShareButton } from "../components/common/ShareButton";
import { apiGet } from "../lib/api";

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
            return "bg-bg-deep";

        if (count === 1)
            return "bg-accent/30";

        if (count === 2)
            return "bg-accent/60";

        return "bg-accent";
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
        <div className="bg-bg-card border border-accent rounded-lg p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">用户贡献</h3>
            {}
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-text-muted">过去一个月的活动</div>
                <div className="flex items-center space-x-2">
                    <div className="text-xs text-text-muted">较少</div>
                    <div className="w-3 h-3 bg-bg-deep rounded-full"></div>
                    <div className="w-3 h-3 bg-accent/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-accent/60 rounded-full"></div>
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <div className="text-xs text-text-muted">较多</div>
                </div>
            </div>
            {}
            <div className="grid grid-cols-12 gap-1 mb-2">
                {monthNames.map((month, index) => <div
                    key={index}
                    className="text-center text-xs text-text-muted"
                    style={{
                        gridColumnStart: index * 4.33 + 1
                    }}>
                    {month}
                </div>)}
            </div>
            {}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["一", "二", "三", "四", "五", "六", "日"].map(day => <div key={day} className="text-center text-xs text-text-muted">
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
                    className={`w-3 h-3 rounded-full ${getColorByCount(day.count)} cursor-pointer hover:ring-2 hover:ring-text-primary/50 transition-all`}
                    onClick={e => handleDayClick(day, e)}
                    title={`${day.date}: ${day.count} 次活动`}></div>)}
            </div>
            {}
            <div className="mt-4 flex justify-between text-sm text-text-muted">
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
                    className="fixed bg-bg-card border border-accent rounded-lg p-3 shadow-lg z-50"
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y
                    }}>
                    <div className="font-medium text-text-primary">{`${selectedDay.year}年${selectedDay.month + 1}月${selectedDay.day}日`}</div>
                    <div className="text-text-muted text-sm">{`${selectedDay.count} 次活动`}</div>
                    {selectedDay.count > 0 && <div className="text-xs text-accent-hover mt-1">
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
        <div className="bg-bg-card border border-accent rounded-lg p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">活跃度趋势</h3>
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
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "7days" ? "bg-accent text-text-primary" : "bg-bg-deep text-text-muted hover:bg-accent/50"} transition-colors`}>7天
                                                                            </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setTimeRange("30days")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "30days" ? "bg-accent text-text-primary" : "bg-bg-deep text-text-muted hover:bg-accent/50"} transition-colors`}>30天
                                                                            </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onClick={() => setTimeRange("90days")}
                    className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === "90days" ? "bg-accent text-text-primary" : "bg-bg-deep text-text-muted hover:bg-accent/50"} transition-colors`}>90天
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
                <div className="bg-bg-deep p-3 rounded-lg">
                    <div className="text-xs text-accent-hover">总发帖数</div>
                    <div className="text-lg font-bold text-text-primary">
                        {activityData.reduce((sum, day) => sum + day.posts, 0)}
                    </div>
                </div>
                <div className="bg-bg-deep p-3 rounded-lg">
                    <div className="text-xs text-accent-hover">总回复数</div>
                    <div className="text-lg font-bold text-text-primary">
                        {activityData.reduce((sum, day) => sum + day.replies, 0)}
                    </div>
                </div>
                <div className="bg-bg-deep p-3 rounded-lg">
                    <div className="text-xs text-accent-hover">活跃用户</div>
                    <div className="text-lg font-bold text-text-primary">
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
                    className={`p-3 rounded-lg cursor-pointer transition-all ${voted ? isVotedFor ? "bg-accent/20 border border-accent" : "bg-bg-card border border-accent/30" : isSelected ? "bg-accent/20 border border-accent" : "bg-bg-card border border-accent/30 hover:border-accent"}`}
                    onClick={() => handleOptionSelect(option.id)}>
                    <div className="flex items-center mb-2">
                        <div
                            className={`w-5 h-5 rounded-full border-2 mr-2 flex-shrink-0 flex items-center justify-center ${voted ? isVotedFor ? `border-${option.color} bg-${option.color}` : "border-accent-hover" : isSelected ? `border-${option.color} bg-${option.color}` : "border-accent-hover"}`}>
                            {voted && isVotedFor && <i className="fa-solid fa-check text-white text-xs"></i>}
                            {!voted && isSelected && <i className="fa-solid fa-check text-white text-xs"></i>}
                        </div>
                        <span className="text-text-primary">{option.text}</span>
                    </div>
                    {voted && <div className="space-y-1">
                        <div className="w-full bg-bg-deep h-2 rounded-full overflow-hidden">
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
                        <div className="flex justify-between text-xs text-text-muted">
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
            className="bg-bg-card border border-accent rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-32">
                <img
                    src={group.coverImage}
                    alt={`${group.name} cover`}
                    className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                    <div
                        className="w-16 h-16 rounded-full border-2 border-bg-card overflow-hidden">
                        <img
                            src={group.avatar}
                            alt={group.name}
                            className="w-full h-full object-cover" />
                    </div>
                </div>
                {!group.isPublic && <div
                    className="absolute top-3 right-3 px-2 py-1 bg-bg-deep/80 text-white text-xs rounded-full">
                    <i className="fa-solid fa-lock mr-1"></i>私密
                                                                            </div>}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-text-primary mb-1">{group.name}</h3>
                <p className="text-sm text-text-muted mb-3 line-clamp-2">{group.description}</p>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <span className="text-sm text-text-muted">
                            {group.members.length}成员
                                                                                 </span>
                        <span className="mx-2 text-accent-hover">•</span>
                        <span className="text-sm text-text-muted">
                            {group.posts}帖子
                                                                                 </span>
                    </div>
                    <span className="text-xs text-accent-hover">创建于 {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                    {group.tags.map((tag, index) => <span
                        key={index}
                        className="px-2 py-1 bg-bg-deep text-text-muted rounded-full text-xs border border-accent">#{tag}
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
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${group.joined ? "bg-danger text-white hover:bg-danger" : "bg-accent text-text-primary hover:bg-accent-hover"}`}>
                    {group.joined ? "退出小组" : "加入小组"}
                </motion.button>
            </div>
        </motion.div>
    );
};

const CollectionsManager: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
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

            topics: [].filter(topic => collection.topicIds.includes(topic.id)).map(topic => ({
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
    const [achievements, setAchievements] = useState<Achievement[]>([]);
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
        className="bg-bg-card rounded-xl border border-accent w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary">创建摄影小组</h2>
            <button
              className="text-text-muted hover:text-text-primary transition-colors"
              onClick={onClose}
            >
              <i className="fa-solid fa-times text-lg"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-1">小组名称 <span className="text-danger">*</span></label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="请输入小组名称"
                className="w-full px-4 py-3 bg-bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                maxLength={50}
                required
              />
              <p className="text-xs text-accent-hover mt-1">2-50个字符，简洁明了地表达小组主题</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-1">小组描述</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="介绍你的小组主题、目标和成员可以获得什么..."
                className="w-full px-4 py-3 bg-bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-accent-hover mt-1">最多500个字符，详细的介绍能吸引更多成员</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted mb-1">小组类型</label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="groupType"
                    value="public"
                    checked={groupType === "public"}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-4 h-4 text-accent bg-bg-deep border-accent rounded focus:ring-accent"
                  />
                  <span className="ml-2 text-text-muted">公开小组</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="groupType"
                    value="private"
                    checked={groupType === "private"}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-4 h-4 text-accent bg-bg-deep border-accent rounded focus:ring-accent"
                  />
                  <span className="ml-2 text-text-muted">私密小组</span>
                </label>
              </div>
              <p className="text-xs text-accent-hover mt-1">公开小组：任何人都可以发现并加入；私密小组：只有通过邀请才能加入</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted mb-1">标签</label>
              <input
                type="text"
                value={groupTags}
                onChange={(e) => setGroupTags(e.target.value)}
                placeholder="输入标签，用逗号分隔，最多5个标签"
                className="w-full px-4 py-3 bg-bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <p className="text-xs text-accent-hover mt-1">添加相关标签，让更多志同道合的人找到你的小组</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center justify-center"
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
    const [topics, setTopics] = useState<Topic[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [batchMode, setBatchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortType, setSortType] = useState("latest");
    const [bookmarkPositions, setBookmarkPositions] = useState<Record<string, number>>({});
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    // 小组相关状态
    const [groups, setGroups] = useState<Group[]>([]);
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
            return "bg-accent text-white";

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

    // 从API获取话题列表
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await apiGet<Topic[]>('/topics');
                setTopics(data);
            } catch (error) {
                console.error('Failed to fetch topics:', error);
            }
        };
        fetchTopics();
    }, []);

    // 从API获取通知列表
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await apiGet<Notification[]>('/notifications');
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    // 从API获取小组列表
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await apiGet<Group[]>('/groups');
                setGroups(data);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }
        };
        fetchGroups();
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
        members: [], // 创建者为初始成员
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
            className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
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
                    <h1 className="text-3xl font-bold text-text-primary mb-2">摄影社区</h1>
                    <p className="text-text-muted">与全球摄影爱好者分享交流，探讨摄影技术与艺术</p>
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
                            className="w-full px-4 py-3 pl-12 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted" />
                        <i
                            className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        {}
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <div className="flex items-center">
                                <span className="text-sm text-text-muted mr-2">筛选:</span>
                                <select
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                    className="px-3 py-2 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer">
                                    <option value="all">全部话题</option>
                                    <option value="essential">精华话题</option>
                                    <option value="sticky">置顶话题</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-text-muted mr-2">排序:</span>
                                <select
                                    value={sortType}
                                    onChange={e => setSortType(e.target.value)}
                                    className="px-3 py-2 bg-bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer">
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
                            className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center">
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
                                className="w-10 h-10 rounded-full bg-accent text-text-primary flex items-center justify-center hover:bg-accent-hover transition-colors">
                                <i className="fa-solid fa-bell"></i>
                                {unreadCount > 0 && <span
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white text-xs flex items-center justify-center">
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
                                    className="absolute right-0 mt-2 w-80 bg-bg-card border border-accent rounded-lg shadow-lg z-10">
                                    <div
                                        className="flex justify-between items-center p-4 border-b border-accent">
                                        <h3 className="font-medium text-text-primary">通知</h3>
                                        {unreadCount > 0 && <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-accent hover:text-text-muted">全部已读
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
                                            className={`p-4 border-b border-accent ${notification.isRead ? "" : "bg-accent/20"}`}>
                                            <div className="flex items-start">
                                                <div
                                                    className={`p-2 rounded-full ${getNotificationColorClass(notification.type)} mr-3`}>
                                                    <i className={`fa-solid ${getNotificationIcon(notification.type)}`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-text-primary">{notification.content}</p>
                                                    <p className="text-xs text-accent-hover mt-1">{notification.createdAt}</p>
                                                </div>
                                                {!notification.isRead && <span className="w-2 h-2 rounded-full bg-danger"></span>}
                                            </div>
                                        </motion.div>) : <div className="p-6 text-center text-text-muted">
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
                        className="mb-6 bg-bg-card rounded-lg border border-accent p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedTopics.length > 0 && selectedTopics.length === topics.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 bg-bg-card border-accent text-accent rounded focus:ring-accent mr-2" />
                                <span className="text-text-muted">已选择 {selectedTopics.length}个话题</span>
                            </div>
                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    disabled={selectedTopics.length === 0}
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-accent-hover/50 text-text-muted cursor-not-allowed" : "bg-accent text-text-primary hover:bg-accent-hover"}`}>
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
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-accent-hover/50 text-text-muted cursor-not-allowed" : "bg-accent text-text-primary hover:bg-accent-hover"}`}>
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
                                    className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${selectedTopics.length === 0 ? "bg-accent-hover/50 text-text-muted cursor-not-allowed" : "bg-danger text-white hover:bg-danger"}`}>
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
                    <h2 className="text-2xl font-bold text-text-primary">摄影小组</h2>
                    <motion.button
                      whileHover={{
                        scale: 1.05
                      }}
                      whileTap={{
                        scale: 0.95
                      }}
                      className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center">
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
                        className="px-6 py-2 bg-bg-card text-text-muted border border-accent rounded-lg hover:bg-accent hover:text-text-primary transition-colors"
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
                            className={`bg-bg-card border border-accent rounded-lg overflow-hidden shadow-sm cursor-pointer relative ${topic.isSelected ? "ring-2 ring-accent" : ""}`}
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
                                        className="w-4 h-4 bg-bg-card border-accent text-accent rounded focus:ring-accent mt-1" />
                                </div>}
                                {}
                                <div className="flex items-center space-x-2 mb-3">
                                    {topic.isEssential && <span
                                        className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full flex items-center">
                                        <i className="fa-solid fa-star mr-1"></i>精华
                                                                                                                                               </span>}
                                    {topic.isSticky && <span
                                        className="px-2 py-1 bg-success/20 text-success text-xs rounded-full flex items-center">
                                        <i className="fa-solid fa-thumbtack mr-1"></i>置顶
                                                                                                                                               </span>}
                                </div>
                                {}
                                <h2 className="text-xl font-bold text-text-primary mb-3">
                                    {topic.title}
                                </h2>
                                {}
                                <p className="text-text-muted mb-4 line-clamp-2">
                                    {topic.content}
                                </p>
                                {}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {topic.tags.map((tag, index) => <span
                                        key={index}
                                        className="px-2 py-1 bg-bg-deep text-text-muted rounded-full text-xs border border-accent">
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
                                                <span className="text-text-primary font-medium">{topic.author.name}</span>
                                                <div className="ml-2 relative group">
                                                    <span
                                                        className={`text-xs px-1.5 py-0.5 rounded ${getLevelBadgeClass(topic.author.level)}`}>Lv{topic.author.level}
                                                    </span>
                                                    <div
                                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-bg-deep text-text-muted text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">发帖: {topic.author.stats.posts}| 获赞: {topic.author.stats.likes}| 活跃: {topic.author.stats.days}天
                                                                                                                                                                                                     </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-accent-hover">{topic.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center text-accent-hover">
                                            <i className="fa-solid fa-heart mr-1"></i>
                                            <span>{topic.likes}</span>
                                        </div>
                                        <div className="flex items-center text-accent-hover">
                                            <i className="fa-solid fa-comment mr-1"></i>
                                            <span>{topic.comments}</span>
                                        </div>
                                        <div className="flex items-center text-accent-hover">
                                            <i className="fa-solid fa-eye mr-1"></i>
                                            <span>{topic.views}</span>
                                        </div>
                                    </div>
                                </div>
                                {}
                                {bookmarkPositions[topic.id] !== undefined && <div className="mt-4 flex items-center text-xs text-accent">
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
                        <div className="bg-bg-card border border-accent rounded-lg p-6">
                            <h3 className="text-lg font-bold text-text-primary mb-4">话题分布</h3>
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