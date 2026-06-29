import { buildCozeImageUrl } from '../constants/api';
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { ProfileDropdown } from "./ProfileDropdown";
import { getHeaderBgClass, getNavTextClass } from '../composables/useThemeHelpers';
import { useScrollSpy } from '../composables/useScrollSpy';
import { useProfileApi } from '../composables/useProfileApi';
import { EMPTY_TEXT } from '../constants/text';

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

    const [userData, setUserData] = useState<any>(null);
    const { fetchProfile } = useProfileApi();
    const { createScrollHandler } = useScrollSpy();

    useEffect(() => {
        fetchProfile().then((data) => {
            setUserData(data);
        });
    }, []);

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
        const handleScroll = createScrollHandler(setScrolled);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const userAvatar = user?.avatar || buildCozeImageUrl('photographer avatar professional', 'b0609ecfca466fa5510f7df4adb33529', 'square');
    const username = user?.username || userData?.username;

    const getBgClass = () => getHeaderBgClass(theme, scrolled);

    const getTextClass = (isActive: boolean) => getNavTextClass(theme, isActive);

    return (
        <header
            className={`sticky top-0 z-50 w-full ${getBgClass()} border-b border-accent transition-all duration-300`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <motion.div
                                whileHover={{
                                    rotate: 10
                                }}
                                className={`mr-2 text-2xl ${theme === "dark" ? "text-light-accent" : "text-accent"}`}>
                                <i className="fa-solid fa-camera"></i>
                            </motion.div>
                            <span
                                className={`text-xl font-bold ${theme === "dark" ? "text-text-primary" : "text-deep"}`}>影研社
                                              </span>
                        </Link>
                    </div>
                    {}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => <Link
                            key={link.path}
                            to={link.path}
                            className={`font-medium transition-colors relative ${getTextClass(location.pathname === link.path)} 
                  ${location.pathname === link.path ? `after:content-[""] after:block after:w-full after:h-[2px] after:${theme === "dark" ? "bg-accent" : "bg-light-accent"} after:absolute after:bottom-[-6px] after:left-0` : ""}`}>
                            {link.name}
                        </Link>)}
            {/* 管理后台入口 - 桌面端显示 */}
            <Link
              to="/admin"
              className={`font-medium transition-colors relative ${getTextClass(location.pathname.startsWith('/admin'))} 
            ${location.pathname.startsWith('/admin') ? `after:content-[""] after:block after:w-full after:h-[2px] after:${theme === "dark" ? "bg-accent" : "bg-light-accent"} after:absolute after:bottom-[-6px] after:left-0` : ""}`}
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
                                    className={`w-10 h-10 rounded-full object-cover border-2 ${theme === "dark" ? "border-accent" : "border-light-accent"} cursor-pointer transition-transform relative`} />
                                <span
                                    className={`font-medium ${theme === "dark" ? "text-text-primary" : "text-deep"} hidden lg:inline`}>
                                    {username}
                                </span>
                            </button>
                        </div> : <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "text-text-primary border border-accent hover:bg-accent/20" : "text-deep border border-gray-300 hover:bg-gray-100"} transition-colors`}>登录
                                                </Link>
                            <Link
                                to="/register"
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === "dark" ? "text-deep bg-accent hover:bg-accent-hover shadow-accent-md" : "text-white bg-light-accent hover:bg-light-accent-hover shadow-light-accent-sm"} transition-colors`}>注册
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
                            className={`p-2 rounded-full ${theme === "dark" ? "bg-card text-text-muted" : "bg-gray-100 text-accent-hover"} transition-colors`}
                            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}>
                            <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                        </motion.button>
                        {isAuthenticated && <motion.button
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={toggleProfileDropdown}
                            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-card" : "hover:bg-gray-100"} transition-colors`}
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
                            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-card text-text-muted" : "hover:bg-gray-100 text-accent-hover"} transition-colors`}
                            aria-label="Open menu">
                            <i
                                className={`fa-solid ${isMobileMenuOpen ? "fa-times" : "fa-bars"} ${theme === "dark" ? "text-text-muted" : "text-accent-hover"}`}></i>
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
                    className={`md:hidden py-4 space-y-4 border-t ${theme === "dark" ? "border-accent bg-deep" : "border-gray-200 bg-white"}`}>
                    {navLinks.map(link => <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 font-medium transition-colors ${location.pathname === link.path ? theme === "dark" ? "text-text-primary bg-card rounded-lg border-l-2 border-accent" : "text-deep bg-gray-100 rounded-lg border-l-2 border-light-accent" : theme === "dark" ? "text-text-muted/70 hover:text-text-primary" : "text-accent-hover/70 hover:text-deep"}`}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        {link.name}
                    </Link>)}
                    {isAuthenticated ? <div className="px-4 space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                        <Link
                            to={`/profile/${user?.id}`}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-card text-text-muted hover:bg-accent hover:text-text-primary" : "bg-gray-100 text-accent-hover hover:bg-gray-200 hover:text-deep"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-image mb-1"></i>作品
                                            </Link>
                        <button
                            disabled
                            title={EMPTY_TEXT.COMING_SOON}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-card text-text-muted/50 cursor-not-allowed" : "bg-gray-100 text-accent-hover/50 cursor-not-allowed"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-heart mb-1"></i>收藏
                                            </button>
                        <button
                            disabled
                            title={EMPTY_TEXT.COMING_SOON}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-card text-text-muted/50 cursor-not-allowed" : "bg-gray-100 text-accent-hover/50 cursor-not-allowed"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-cog mb-1"></i>设置
                                            </button>
                        {/* 管理后台入口 */}
                        <Link
                            to="/admin"
                            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-accent/20 text-accent hover:bg-accent hover:text-text-primary" : "bg-light-accent/10 text-light-accent hover:bg-light-accent/20 hover:text-light-accent-hover"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <i className="fa-solid fa-user-shield mb-1"></i>管理后台
                        </Link>
                        </div>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-card text-text-muted hover:bg-accent hover:text-text-primary" : "bg-gray-100 text-accent-hover hover:bg-gray-200 hover:text-deep"} transition-colors`}>
                            <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                                            </button>
                    </div> : <div className="px-4 space-y-3">
                        <Link
                            to="/login"
                            className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "bg-card text-text-muted hover:bg-accent hover:text-text-primary" : "bg-gray-100 text-accent-hover hover:bg-gray-200 hover:text-deep"} transition-colors`}
                            onClick={() => setIsMobileMenuOpen(false)}>登录
                                            </Link>
                        <Link
                            to="/register"
                            className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-medium ${theme === "dark" ? "text-deep bg-accent hover:bg-accent-hover" : "text-white bg-light-accent hover:bg-light-accent-hover"} transition-colors`}
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
                level={userData?.level}
                levelNum={userData?.levelNum}
                progress={userData?.progress}
                progressMax={userData?.progressMax}
                stats={userData?.stats}
                avatarSrc={userAvatar} />
        </header>
    );
};