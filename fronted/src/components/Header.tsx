import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { ProfileDropdown } from "./ProfileDropdown";

export const Header: React.FC = () => {
    const {
        isAuthenticated,
        user,
        logout,
        theme,
        toggleTheme
    } = useAuthStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const mockUserData = {
        username: "@光影捕手",
        level: "新锐摄影师",
        levelNum: 3,
        progress: 120,
        progressMax: 200,

        stats: {
            posts: 12,
            likes: 236,
            collections: 48
        }
    };

    const navLinks = [{
        name: "作品库",
        path: "/"
    }, {
        name: "器材中心",
        path: "/equipment"
    }, {
        name: "课程",
        path: "/online-courses"
    }, {
        name: "社区",
        path: "/community"
    }, {
        name: "资源",
        path: "/resources"
    }, {
        name: "AI助手",
        path: "/ai-chat"
    }, {
        name: "活动与赛事",
        path: "/events-and-contests"
    }];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const userAvatar = user?.avatar || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional&sign=b0609ecfca466fa5510f7df4adb33529";
    const username = user?.username || mockUserData.username;

    const getBgClass = () => {
        if (scrolled) {
            return theme === "dark" ? "bg-[#1E2532]/95 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm shadow-md";
        }

        return theme === "dark" ? "bg-[#1E2532]" : "bg-white";
    };

    const getTextClass = (isActive: boolean) => {
        if (isActive) {
            return theme === "dark" ? "text-[#F5F7FA]" : "text-[#1E2532]";
        }

        return theme === "dark" ? "text-[#B8C6D8]/70 hover:text-[#F5F7FA]" : "text-[#6B7C93]/70 hover:text-[#1E2532]";
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full ${getBgClass()} border-b border-[#4A5F8B] transition-all duration-300`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <motion.div
                                whileHover={{
                                    rotate: 10
                                }}
                                className={`mr-2 text-2xl ${theme === "dark" ? "text-[#63B3ED]" : "text-[#4A5F8B]"}`}>
                                <i className="fa-solid fa-camera"></i>
                            </motion.div>
                            <span
                                className={`text-xl font-bold ${theme === "dark" ? "text-[#F5F7FA]" : "text-[#1E2532]"}`}>影研社
                                              </span>
                        </Link>
                    </div>
                    {}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => <Link
                            key={link.path}
                            to={link.path}
                            className={`font-medium transition-colors relative ${getTextClass(location.pathname === link.path)} 
                  ${location.pathname === link.path ? `after:content-[""] after:block after:w-full after:h-[2px] after:${theme === "dark" ? "bg-[#4A5F8B]" : "bg-[#63B3ED]"} after:absolute after:bottom-[-6px] after:left-0` : ""}`}>
                            {link.name}
                        </Link>)}
            {/* 管理后台入口 - 桌面端显示 */}
            <Link
              to="/admin"
              className={`font-medium transition-colors relative ${getTextClass(location.pathname.startsWith('/admin'))} 
            ${location.pathname.startsWith('/admin') ? `after:content-[""] after:block after:w-full after:h-[2px] after:${theme === "dark" ? "bg-[#4A5F8B]" : "bg-[#63B3ED]"} after:absolute after:bottom-[-6px] after:left-0` : ""}`}
            >
              管理后台
            </Link>
                        {}
                        {isAuthenticated ? <div className="relative">
                            <button
                                className="flex items-center space-x-2"
                                onClick={toggleProfileDropdown}
                                aria-label="打开个人信息下拉菜单">
                                <motion.img
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                    src={userAvatar}
                                    alt={username}
                                    className={`w-10 h-10 rounded-full object-cover border-2 ${theme === "dark" ? "border-[#4A5F8B]" : "border-[#63B3ED]"} cursor-pointer transition-transform relative`} />
                                <span
                                    className={`font-medium ${theme === "dark" ? "text-[#F5F7FA]" : "text-[#1E2532]"} hidden lg:inline`}>
                                    {username}
                                </span>
                            </button>
                        </div> : <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "text-[#F5F7FA] border border-[#4A5F8B] hover:bg-[#4A5F8B]/20" : "text-[#1E2532] border border-gray-300 hover:bg-gray-100"} transition-colors`}>登录
                                                </Link>
                            <Link
                                to="/register"
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93] shadow-[0_2px_8px_rgba(74,95,139,0.3)]" : "text-white bg-[#63B3ED] hover:bg-[#4299E1] shadow-[0_2px_8px_rgba(99,179,237,0.3)]"} transition-colors`}>注册
                                                </Link>
                        </div>}
                    </nav>
                    {}
                    <div className="md:hidden flex items-center space-x-3">
                        {}
                        <motion.button
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8]" : "bg-gray-100 text-[#6B7C93]"} transition-colors`}
                            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}>
                            <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                        </motion.button>
                        {isAuthenticated && <motion.button
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={toggleProfileDropdown}
                            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-[#2D3748]" : "hover:bg-gray-100"} transition-colors`}
                            aria-label="打开个人侧边栏">
                            <img
                                src={userAvatar}
                                alt={username}
                                className="w-8 h-8 rounded-full object-cover cursor-pointer" />
                        </motion.button>}
                        <motion.button
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-[#2D3748] text-[#B8C6D8]" : "hover:bg-gray-100 text-[#6B7C93]"} transition-colors`}
                            aria-label="Open menu">
                            <i
                                className={`fa-solid ${isMobileMenuOpen ? "fa-times" : "fa-bars"} ${theme === "dark" ? "text-[#B8C6D8]" : "text-[#6B7C93]"}`}></i>
                        </motion.button>
                    </div>
                </div>
                {}
                {isMobileMenuOpen && <motion.div
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
                    className={`md:hidden py-4 space-y-4 border-t ${theme === "dark" ? "border-[#4A5F8B] bg-[#1E2532]" : "border-gray-200 bg-white"}`}>
                    {navLinks.map(link => <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 font-medium transition-colors ${location.pathname === link.path ? theme === "dark" ? "text-[#F5F7FA] bg-[#2D3748] rounded-lg border-l-2 border-[#4A5F8B]" : "text-[#1E2532] bg-gray-100 rounded-lg border-l-2 border-[#63B3ED]" : theme === "dark" ? "text-[#B8C6D8]/70 hover:text-[#F5F7FA]" : "text-[#6B7C93]/70 hover:text-[#1E2532]"}`}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        {link.name}
                    </Link>)}
                    {isAuthenticated ? <div className="px-4 space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                        <Link
                            to={`/profile/${user?.id}`}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-image mb-1"></i>作品
                                            </Link>
                        <Link
                            to="#"
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-heart mb-1"></i>收藏
                                            </Link>
                        <Link
                            to="#"
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-cog mb-1"></i>设置
                                            </Link>
                        {/* 管理后台入口 */}
                        <Link
                            to="/admin"
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#4A5F8B]/20 text-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-[#63B3ED]/10 text-[#63B3ED] hover:bg-[#63B3ED]/20 hover:text-[#4299E1]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-user-shield mb-1"></i>管理后台
                        </Link>
                        </div>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]"} transition-colors`}>
                            <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                                            </button>
                    </div> : <div className="px-4 space-y-3">
                        <Link
                            to="/login"
                            className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]" : "bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>登录
                                            </Link>
                        <Link
                            to="/register"
                            className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93]" : "text-white bg-[#63B3ED] hover:bg-[#4299E1]"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>注册
                                            </Link>
                    </div>}
                </motion.div>}
            </div>
            {}
            <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                username={username}
                level={mockUserData.level}
                levelNum={mockUserData.levelNum}
                progress={mockUserData.progress}
                progressMax={mockUserData.progressMax}
                stats={mockUserData.stats}
                avatarSrc={userAvatar} />
        </header>
    );
};