import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PhotographyCard } from "../components/PhotographyCard";
import { Banner } from "../components/Banner";
import { Feature } from "../components/Feature";

// 摄影作品数据
// TODO: from API
const photographyPosts: any[] = [];

// 热门标签数据
// TODO: from API
const popularTags: any[] = [];

// 推荐艺术家数据
// TODO: from API
const featuredPhotographers: any[] = [];

// 灵感专栏数据
// TODO: from API
const inspirationItems: any[] = [];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const filteredPosts = selectedCategory === "all" ? photographyPosts : photographyPosts.filter(post => post.tags.includes(selectedCategory));

    const theme = 'dark';
    
    // 根据主题获取背景和文本颜色类
    const getBgClass = () => {
      return theme === 'dark' ? 'bg-[#1E2532]' : 'bg-white';
    };

    return (
        <div className={`container mx-auto px-4 py-8 ${getBgClass()} star-texture min-h-screen`}>
            {/* 轮播图组件 */}
            <Banner />
            
            {/* 天气预报卡片 */}
            <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl p-6 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-full bg-[#4A5F8B] flex items-center justify-center mr-4">
                            <i className="fa-solid fa-cloud-sun text-2xl text-[#F5F7FA]"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#F5F7FA]">北京市 - 今天</h3>
                            <p className="text-sm text-[#B8C6D8]">2025年11月17日 17:41</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-[#F5F7FA] mr-2">15°C</span>
                        <div className="flex items-center">
                            <i className="fa-solid fa-temperature-low text-[#4A5F8B] mr-1"></i>
                            <span className="text-[#B8C6D8]">10°C</span>
                            <span className="mx-1 text-[#4A5F8B]">/</span>
                            <i className="fa-solid fa-temperature-high text-[#4A5F8B] mr-1"></i>
                            <span className="text-[#B8C6D8]">18°C</span>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#1E2532] rounded-lg p-3 text-center">
                        <p className="text-sm text-[#B8C6D8] mb-1">湿度</p>
                        <p className="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
                            <i className="fa-solid fa-tint mr-1 text-[#4A5F8B]"></i>45%
                        </p>
                    </div>
                    <div className="bg-[#1E2532] rounded-lg p-3 text-center">
                        <p className="text-sm text-[#B8C6D8] mb-1">风速</p>
                        <p className="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
                            <i className="fa-solid fa-wind mr-1 text-[#4A5F8B]"></i>3级
                        </p>
                    </div>
                    <div className="bg-[#1E2532] rounded-lg p-3 text-center">
                        <p className="text-sm text-[#B8C6D8] mb-1">紫外线</p>
                        <p className="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
                            <i className="fa-solid fa-sun mr-1 text-[#4A5F8B]"></i>弱
                        </p>
                    </div>
                    <div className="bg-[#1E2532] rounded-lg p-3 text-center">
                        <p className="text-sm text-[#B8C6D8] mb-1">日出日落</p>
                        <p className="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
                            <i className="fa-solid fa-sunrise mr-1 text-[#4A5F8B]"></i>06:58/17:05
                        </p>
                    </div>
                </div>
                
                <div className="bg-[#1E2532] rounded-lg p-4">
                    <h4 className="text-base font-medium text-[#F5F7FA] mb-3 flex items-center">
                        <i className="fa-solid fa-lightbulb text-[#4A5F8B] mr-2"></i>今日摄影建议
                    </h4>
                    <p className="text-sm text-[#B8C6D8] mb-4">今日天气晴朗，微风，非常适合户外摄影。下午光线柔和，是拍摄人像和风光的黄金时段。</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
                            <p className="text-xs text-[#B8C6D8] mb-1">风光摄影</p>
                            <div className="flex justify-center">
                                {[...Array(5)].map((_, i) => <i
                                    key={i}
                                    className={`fa-solid fa-star text-sm ${i < 4 ? "text-[#4A5F8B]" : "text-[#1E2532]"}`}></i>)}
                            </div>
                        </div>
                        <div className="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
                            <p className="text-xs text-[#B8C6D8] mb-1">人像摄影</p>
                            <div className="flex justify-center">
                                {[...Array(5)].map((_, i) => <i
                                    key={i}
                                    className={`fa-solid fa-star text-sm ${i < 5 ? "text-[#4A5F8B]" : "text-[#1E2532]"}`}></i>)}
                            </div>
                        </div>
                        <div className="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
                            <p className="text-xs text-[#B8C6D8] mb-1">街拍摄影</p>
                            <div className="flex justify-center">
                                {[...Array(5)].map((_, i) => <i
                                    key={i}
                                    className={`fa-solid fa-star text-sm ${i < 4 ? "text-[#4A5F8B]" : "text-[#1E2532]"}`}></i>)}
                            </div>
                        </div>
                        <div className="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
                            <p className="text-xs text-[#B8C6D8] mb-1">夜景摄影</p>
                            <div className="flex justify-center">
                                {[...Array(5)].map((_, i) => <i
                                    key={i}
                                    className={`fa-solid fa-star text-sm ${i < 3 ? "text-[#4A5F8B]" : "text-[#1E2532]"}`}></i>)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    <h4 className="text-base font-medium text-[#F5F7FA] mb-3">未来天气预报</h4>
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {[{
                            day: "明天",
                            weather: "多云",
                            temp: "12°/17°",
                            icon: "fa-cloud"
                        }, {
                            day: "周一",
                            weather: "晴",
                            temp: "10°/19°",
                            icon: "fa-sun"
                        }, {
                            day: "周二",
                            weather: "晴转多云",
                            temp: "9°/18°",
                            icon: "fa-cloud-sun"
                        }, {
                            day: "周三",
                            weather: "小雨",
                            temp: "8°/15°",
                            icon: "fa-cloud-rain"
                        }, {
                            day: "周四",
                            weather: "阴",
                            temp: "7°/14°",
                            icon: "fa-cloud"
                        }].map((day, index) => <div
                            key={index}
                            className="flex-shrink-0 w-24 bg-[#1E2532] rounded-lg p-3 text-center">
                            <p className="text-sm text-[#F5F7FA] mb-2">{day.day}</p>
                            <div className="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center mx-auto mb-2">
                                <i className={`fa-solid ${day.icon} text-[#4A5F8B]`}></i>
                            </div>
                            <p className="text-xs text-[#B8C6D8] mb-1">{day.weather}</p>
                            <p className="text-xs text-[#F5F7FA]">{day.temp}</p>
                        </div>)}
                    </div>
                </div>
            </div>
            
            {/* 功能入口区组件 */}
            <Feature />
            
            {/* 灵感专栏 */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#F5F7FA] mb-6">灵感专栏</h2>
                <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-6">
                    {inspirationItems.map(item => <motion.div
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="flex-shrink-0 w-80 bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm">
                        <div className="h-48 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{item.title}</h3>
                            <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex items-center text-sm text-[#4A5F8B]">
                                <span>by {item.author}</span>
                                <i className="fa-solid fa-chevron-right ml-auto text-xs"></i>
                            </div>
                        </div>
                    </motion.div>)}
                </div>
            </div>
            
            {/* 主要内容区 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 作品列表 */}
                <div className="lg:col-span-2">
                    {/* 分类筛选 */}
                    <div className="mb-8 overflow-x-auto pb-2">
                        <div className="flex space-x-2 min-w-max">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "all" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>
                                全部
                            </button>
                            <button
                                onClick={() => setSelectedCategory("极简主义")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "极简主义" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>
                                极简主义
                            </button>
                            <button
                                onClick={() => setSelectedCategory("黑白")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "黑白" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>
                                黑白
                            </button>
                            <button
                                onClick={() => setSelectedCategory("胶片")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "胶片" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>
                                胶片质感
                            </button>
                            <button
                                onClick={() => setSelectedCategory("暗调")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "暗调" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]"}`}>暗调氛围
                            </button>
                        </div>
                    </div>
                    
                    {/* 作品卡片列表 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map(post => <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}>
                            <PhotographyCard post={post} />
                        </motion.div>)}
                    </div>
                    
                    {/* 加载更多按钮 */}
                    <div className="mt-10 text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B] rounded-lg font-medium transition-colors">
                            加载更多作品
                        </motion.button>
                    </div>
                </div>
                
                {/* 侧边栏 */}
                <div className="lg:col-span-1 space-y-8">
                    {/* 搜索框 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索作品、摄影师或风格..."
                            className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                        <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                    </div>
                    
                    {/* 热门标签 */}
                    <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">热门风格</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularTags.map(tag => <Link
                                key={tag.id}
                                to={`/search?tag=${tag.name}`}
                                className="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">#{tag.name}({tag.count})
                            </Link>)}
                        </div>
                    </div>
                    
                    {/* 推荐艺术家 */}
                    <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-[#F5F7FA]">推荐艺术家</h3>
                        <div className="space-y-4">
                            {featuredPhotographers.map(
                                photographer => <div key={photographer.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={photographer.avatar}
                                            alt={photographer.name}
                                            className="w-12 h-12 rounded-full object-cover border border-[#B8C6D8]" />
                                        <div>
                                            <p className="font-medium text-[#F5F7FA]">{photographer.name}</p>
                                            <p className="text-xs text-[#4A5F8B]">{photographer.level}</p>
                                            <p className="text-sm text-[#B8C6D8]">
                                                {photographer.followers.toLocaleString()}粉丝 · {photographer.posts}作品
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#3A4B6F] rounded-full transition-colors">
                                        关注
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 专题推荐 */}
                    <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3 text-[#F5F7FA]">黑白影像专题</h3>
                        <p className="text-sm text-[#B8C6D8] mb-4">探索黑白摄影的艺术魅力，感受光影交织的视觉语言和情感表达</p>
                        <img
                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=black%20and%20white%20photography%20exhibition%20minimalist&sign=2604dd032070909ae9c1f7445ad24156"
                            alt="黑白影像专题"
                            className="w-full h-40 object-cover rounded-lg mb-4" />
                        <button
                            className="w-full py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]">
                            探索专题
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}