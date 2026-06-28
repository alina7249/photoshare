import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";

interface FormData {
    username: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    coverImage: string;
}

interface PrivacySettings {
    profileVisible: boolean;
    photosPublic: boolean;
    allowComments: boolean;
    allowFollowing: boolean;
    showLocation: boolean;
    showEmail: boolean;
    showPhone: boolean;
}

interface Preferences {
    theme: string;
    language: string;
    defaultTab: string;
    notifications: {
        newFollower: boolean;
        newLike: boolean;
        newComment: boolean;
        newMessage: boolean;
        systemUpdates: boolean;
        activityReminders: boolean;
    };
    emailNotifications: {
        weeklyDigest: boolean;
        eventReminders: boolean;
        promotionalOffers: boolean;
    };
    messageSettings: {
        pushEnabled: boolean;
        soundEnabled: boolean;
        notificationPreview: boolean;
        readReceipts: boolean;
        typingIndicators: boolean;
        autoDownloadMedia: "wifi" | "all" | "none";
        notificationSound: string;
    };
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastLogin: string;
    lastIp: string;
}

// 模拟订单数据
const mockOrders = [
  { id: "ORD20231025001", type: "会员订阅", status: "已完成", amount: "¥199", date: "2023-10-25", details: "银河会员年卡" },
  { id: "ORD20231020002", type: "课程购买", status: "已完成", amount: "¥299", date: "2023-10-20", details: "风光摄影进阶课程" },
  { id: "ORD20231015003", type: "器材租赁", status: "进行中", amount: "¥150", date: "2023-10-15", details: "索尼 A7R IV (3天)" },
];

// 模拟通知数据
const mockNotifications = [
  { id: "1", type: "like", content: "用户 @摄影爱好者 点赞了您的作品《晨曦中的山峦》", time: "5分钟前", read: false },
  { id: "2", type: "comment", content: "用户 @光影达人 评论了您的作品《城市剪影》", time: "1小时前", read: false },
  { id: "3", type: "follow", content: "用户 @新摄影师 关注了您", time: "3小时前", read: true },
  { id: "4", type: "system", content: "您的作品《星空下的古堡》被推荐到首页", time: "1天前", read: true },
];

const ProfileSettings: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    
    // 扩展标签页，包含订单和通知
    const [activeTab, setActiveTab] = useState<"account" | "privacy" | "preferences" | "messages" | "security" | "orders" | "notifications">("account");
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        username: user?.username || "@光影捕手",
        email: user?.email || "photographer@example.com",
        phone: "138****6789",
        bio: "热爱风光和人像摄影，正在不断学习和进步中",
        location: "上海",
        website: "https://photographer.example.com",
        avatar: user?.avatar || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc",
        coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20professional&sign=47d4a7099d77fa3997b410d6959c5bc6"
    });

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        profileVisible: true,
        photosPublic: true,
        allowComments: true,
        allowFollowing: true,
        showLocation: true,
        showEmail: false,
        showPhone: false
    });

    const [preferences, setPreferences] = useState<Preferences>({
        theme: "dark",
        language: "zh-CN",
        defaultTab: "feed",
        notifications: {
            newFollower: true,
            newLike: true,
            newComment: true,
            newMessage: true,
            systemUpdates: true,
            activityReminders: true
        },
        emailNotifications: {
            weeklyDigest: true,
            eventReminders: true,
            promotionalOffers: false
        },
        messageSettings: {
            pushEnabled: true,
            soundEnabled: true,
            notificationPreview: true,
            readReceipts: true,
            typingIndicators: true,
            autoDownloadMedia: "wifi",
            notificationSound: "default"
        }
    });

    const [securitySettings] = useState<SecuritySettings>({
        twoFactorEnabled: false,
        lastLogin: "2023-10-25 14:30:22",
        lastIp: "192.168.1.1"
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || prev.username,
                email: user.email || prev.email,
                avatar: user.avatar || prev.avatar
            }));
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean) => {
        setPrivacySettings(prev => ({ ...prev, [field]: value }));
    };

    const handlePreferencesChange = (field: keyof Preferences, value: string) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (field: keyof Preferences["notifications"], value: boolean) => {
        setPreferences(prev => ({ ...prev, notifications: { ...prev.notifications, [field]: value } }));
    };



    const handleSaveAccount = () => {
        setIsEditing(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 1500);
    };

    const handleSaveSettings = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 1500);
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning("请填写所有密码字段");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning("新密码与确认密码不匹配");
            return;
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 1500);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleLogout = () => {
        logout();
    };

    const handleFileSelect = (type: "avatar" | "cover", event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditing) return;
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.match("image.*")) {
            toast.warning("请选择图片文件");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.warning("文件大小不能超过5MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            if (type === "avatar") {
                setAvatarFile(file);
                setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
            } else {
                setCoverFile(file);
                setFormData(prev => ({ ...prev, coverImage: e.target?.result as string }));
            }
        };
        reader.readAsDataURL(file);
        simulateUpload(type);
    };

    const simulateUpload = (type: "avatar" | "cover") => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev === null || prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setUploadProgress(null);
                    toast.success(`${type === "avatar" ? "头像" : "封面"}更新成功`);
                    return null;
                }
                return prev + 10;
            });
        }, 200);
    };

    const triggerFileInput = (type: "avatar" | "cover") => {
        if (!isEditing) return;
        if (type === "avatar") {
            avatarInputRef.current?.click();
        } else {
            coverInputRef.current?.click();
        }
    };

    const toggleNotificationSelect = (id: string) => {
        setSelectedNotificationIds(prev => 
            prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
        );
    };

    const selectAllNotifications = () => {
        if (selectedNotificationIds.length === mockNotifications.length) {
            setSelectedNotificationIds([]);
        } else {
            setSelectedNotificationIds(mockNotifications.map(n => n.id));
        }
    };

    const markNotificationsAsRead = () => {
        toast.success("已标记为已读");
    };

    const deleteSelectedNotifications = () => {
        toast.success(`已删除 ${selectedNotificationIds.length} 条通知`);
        setSelectedNotificationIds([]);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
                        <i className="fa-solid fa-user-lock text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
                    <p className="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的账号设置和隐私偏好</p>
                    <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">立即登录</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* 返回按钮 */}
                <div className="mb-6">
                    <Link to="/profile" className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>返回个人主页</span>
                    </Link>
                </div>

                {/* 页面标题 */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">个人中心</h1>
                    <p className="text-[#B8C6D8] max-w-2xl mx-auto">管理您的账号信息、隐私设置和通知偏好</p>
                </div>

                {/* 标签页导航 */}
                <div className="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
                    <button onClick={() => setActiveTab("account")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "account" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>账号信息</button>
                    <button onClick={() => setActiveTab("orders")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "orders" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>我的订单</button>
                    <button onClick={() => setActiveTab("notifications")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "notifications" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>通知</button>
                    <button onClick={() => setActiveTab("privacy")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "privacy" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>隐私设置</button>
                    <button onClick={() => setActiveTab("preferences")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "preferences" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>偏好设置</button>
                    <button onClick={() => setActiveTab("security")} className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "security" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>安全设置</button>
                </div>

                {/* 保存成功提示 */}
                {showSuccessToast && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 bg-[#4A5F8B] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
                    <i className="fa-solid fa-check-circle mr-2"></i>
                    <span>保存成功！</span>
                </motion.div>}

                {/* 账号信息 */}
                {activeTab === "account" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">个人信息</h3>
                        <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] mt-3 md:mt-0">
                            {isEditing ? "取消" : "编辑"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-medium text-[#F5F7FA] mb-4">头像设置</h4>
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                                        <img src={formData.avatar} alt="User avatar" className="w-full h-full object-cover" />
                                    </div>
                                    {isEditing && <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors" onClick={() => triggerFileInput("avatar")}>
                                        <i className="fa-solid fa-camera"></i>
                                    </div>}
                                </div>
                                {isEditing && <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm" onClick={() => triggerFileInput("avatar")}>更换头像</button>}
                                {isUploading && avatarFile && <div className="w-full mt-2">
                                    <div className="flex justify-between items-center text-xs text-[#B8C6D8] mb-1">
                                        <span>上传头像...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#4A5F8B]" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>}
                            </div>
                            <h4 className="text-sm font-medium text-[#F5F7FA] mb-4">封面设置</h4>
                            <div className="relative mb-4">
                                <div className="h-40 rounded-lg overflow-hidden border-2 border-[#B8C6D8]">
                                    <img src={formData.coverImage} alt="Cover image" className="w-full h-full object-cover" />
                                </div>
                                {isEditing && <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors" onClick={() => triggerFileInput("cover")}>
                                    <i className="fa-solid fa-camera"></i>
                                </div>}
                            </div>
                            {isEditing && <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm" onClick={() => triggerFileInput("cover")}>更换封面</button>}
                            {isUploading && coverFile && <div className="w-full mt-2">
                                <div className="flex justify-between items-center text-xs text-[#B8C6D8] mb-1">
                                    <span>上传封面...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#4A5F8B]" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>}
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect("avatar", e)} />
                            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect("cover", e)} />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[#F5F7FA] mb-1">用户名</label>
                                <input type="text" id="username" value={formData.username} onChange={e => handleInputChange("username", e.target.value)} disabled={!isEditing} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱</label>
                                <input type="email" id="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} disabled={!isEditing} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码</label>
                                <input type="tel" id="phone" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} disabled={!isEditing} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-[#F5F7FA] mb-1">个人简介</label>
                                <textarea id="bio" value={formData.bio} onChange={e => handleInputChange("bio", e.target.value)} disabled={!isEditing} rows={3} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-[#F5F7FA] mb-1">所在地区</label>
                                <input type="text" id="location" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} disabled={!isEditing} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-[#F5F7FA] mb-1">个人网站</label>
                                <input type="url" id="website" value={formData.website} onChange={e => handleInputChange("website", e.target.value)} disabled={!isEditing} className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            {isEditing && <div className="flex justify-end mt-4">
                                <button onClick={handleSaveAccount} className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存更改</button>
                            </div>}
                        </div>
                    </div>
                </div>}

                {/* 我的订单 */}
                {activeTab === "orders" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <h3 className="text-lg font-bold text-[#F5F7FA] mb-6">我的订单</h3>
                    <div className="space-y-4">
                        {mockOrders.map(order => (
                            <div key={order.id} className="bg-[#1E2532] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#B8C6D8]">订单号: {order.id}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${order.status === "已完成" ? "bg-green-500/20 text-green-400" : order.status === "进行中" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-[#F5F7FA] mb-1">{order.details}</div>
                                    <div className="text-xs text-[#B8C6D8]">{order.date}</div>
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <span className="text-lg font-bold text-[#F5F7FA]">{order.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}

                {/* 通知 */}
                {activeTab === "notifications" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">通知</h3>
                        <div className="flex space-x-2">
                            <button onClick={selectAllNotifications} className="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-lg text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                {selectedNotificationIds.length === mockNotifications.length ? "取消全选" : "全选"}
                            </button>
                            <button onClick={markNotificationsAsRead} className="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-lg text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                标记已读
                            </button>
                            {selectedNotificationIds.length > 0 && <button onClick={deleteSelectedNotifications} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/40 transition-colors">
                                删除选中
                            </button>}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {mockNotifications.map(notification => (
                            <div key={notification.id} className={`bg-[#1E2532] rounded-lg p-4 flex items-start space-x-3 ${!notification.read ? "border-l-4 border-[#4A5F8B]" : ""}`}>
                                <input type="checkbox" checked={selectedNotificationIds.includes(notification.id)} onChange={() => toggleNotificationSelect(notification.id)} className="mt-1" />
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === "like" ? "bg-red-500/20 text-red-400" : notification.type === "comment" ? "bg-blue-500/20 text-blue-400" : notification.type === "follow" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                    {notification.type === "like" && <i className="fa-solid fa-heart"></i>}
                                    {notification.type === "comment" && <i className="fa-solid fa-comment"></i>}
                                    {notification.type === "follow" && <i className="fa-solid fa-user-plus"></i>}
                                    {notification.type === "system" && <i className="fa-solid fa-bell"></i>}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#F5F7FA]">{notification.content}</p>
                                    <span className="text-xs text-[#B8C6D8]">{notification.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}

                {/* 隐私设置 */}
                {activeTab === "privacy" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">隐私设置</h3>
                        <button onClick={handleSaveSettings} className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置</button>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">个人资料可见性</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人查看我的个人资料</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法找到和查看您的个人主页</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.profileVisible} onChange={e => handlePrivacyChange("profileVisible", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">作品公开可见</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，只有您关注的用户可以查看您的作品</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.photosPublic} onChange={e => handlePrivacyChange("photosPublic", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许评论我的作品</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法对您的作品发表评论</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.allowComments} onChange={e => handlePrivacyChange("allowComments", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人关注我</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法关注您的账号</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.allowFollowing} onChange={e => handlePrivacyChange("allowFollowing", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">个人信息展示</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的所在地区</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您设置的所在地区信息</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.showLocation} onChange={e => handlePrivacyChange("showLocation", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的电子邮箱</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您的电子邮箱地址</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.showEmail} onChange={e => handlePrivacyChange("showEmail", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的手机号码</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您的手机号码</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={privacySettings.showPhone} onChange={e => handlePrivacyChange("showPhone", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                {/* 偏好设置 */}
                {activeTab === "preferences" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">偏好设置</h3>
                        <button onClick={handleSaveSettings} className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置</button>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">界面设置</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">主题偏好</label>
                                    <select value={preferences.theme} onChange={e => handlePreferencesChange("theme", e.target.value)} className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="dark">深色模式</option>
                                        <option value="light">浅色模式</option>
                                        <option value="system">跟随系统</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">语言</label>
                                    <select value={preferences.language} onChange={e => handlePreferencesChange("language", e.target.value)} className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="zh-CN">简体中文</option>
                                        <option value="en-US">English (US)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">默认首页</label>
                                    <select value={preferences.defaultTab} onChange={e => handlePreferencesChange("defaultTab", e.target.value)} className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="feed">推荐动态</option>
                                        <option value="explore">发现作品</option>
                                        <option value="profile">个人主页</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">通知设置</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新粉丝通知</label>
                                        <p className="text-xs text-[#B8C6D8]">当有新用户关注您时</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={preferences.notifications.newFollower} onChange={e => handleNotificationChange("newFollower", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新点赞通知</label>
                                        <p className="text-xs text-[#B8C6D8]">当您的作品获得点赞时</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={preferences.notifications.newLike} onChange={e => handleNotificationChange("newLike", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新评论通知</label>
                                        <p className="text-xs text-[#B8C6D8]">当您的作品收到评论时</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={preferences.notifications.newComment} onChange={e => handleNotificationChange("newComment", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新消息通知</label>
                                        <p className="text-xs text-[#B8C6D8]">当您收到新消息时</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={preferences.notifications.newMessage} onChange={e => handleNotificationChange("newMessage", e.target.checked)} />
                                        <div className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                {/* 安全设置 */}
                {activeTab === "security" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <h3 className="text-lg font-bold text-[#F5F7FA] mb-6">安全设置</h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">账号安全</h4>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">修改密码</label>
                                    <p className="text-xs text-[#B8C6D8]">定期更换密码以保障账号安全</p>
                                </div>
                                <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">修改</button>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">登录记录</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B8C6D8]">上次登录时间</span>
                                    <span className="text-sm text-[#F5F7FA]">{securitySettings.lastLogin}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B8C6D8]">上次登录IP</span>
                                    <span className="text-sm text-[#F5F7FA]">{securitySettings.lastIp}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">退出登录</h4>
                            <p className="text-sm text-[#B8C6D8] mb-4">安全退出当前账号</p>
                            <button onClick={handleLogout} className="w-full py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg font-medium hover:bg-red-500/40 transition-colors">退出登录</button>
                        </div>
                    </div>
                </div>}

                {/* 修改密码弹窗 */}
                {showPasswordModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#2D3748] rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-[#F5F7FA] mb-6">修改密码</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">当前密码</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请输入当前密码" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新密码</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请输入新密码" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#F5F7FA] mb-1">确认新密码</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请再次输入新密码" />
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <button onClick={closePasswordModal} className="flex-1 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">取消</button>
                            <button onClick={handleChangePassword} className="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">确认修改</button>
                        </div>
                    </div>
                </motion.div>}
            </motion.div>
        </div>
    );
};

export default ProfileSettings;
