import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PhotographyCard } from "../components/PhotographyCard";
import { Banner } from "../components/Banner";
import { Feature } from "../components/Feature";

// 摄影作品数据
const photographyPosts = [{
    id: "1",
    title: "黑白光影",
    description: "Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52",
    author: {
        id: "1",
        name: "极简摄影师林风",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c"
    },
    likes: 342,
    comments: 42,
    collections: 28,
    tags: ["极简主义", "黑白", "建筑", "徕卡"],
    date: "2023-10-25"
}, {
    id: "2",
    title: "胶片质感人像",
    description: "Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20photography%20portrait%20natural%20light%20soft%20colors&sign=c33fc387d9611cfbf5948eab73b3426b",
    author: {
        id: "2",
        name: "胶片摄影师安娜",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2"
    },
    likes: 412,
    comments: 56,
    collections: 35,
    tags: ["人像", "胶片", "复古", "自然光"],
    date: "2023-10-24"
}, {
    id: "3",
    title: "暗调氛围",
    description: "Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=moody%20portrait%20low%20key%20dramatic%20lighting&sign=667d5b0612922acbe1a4e0355faeb800",
    author: {
        id: "3",
        name: "情绪摄影师李明",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47"
    },
    likes: 389,
    comments: 49,
    collections: 31,
    tags: ["暗调", "氛围", "情绪", "人像"],
    date: "2023-10-23"
}, {
    id: "4",
    title: "极简静物",
    description: "Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=minimalist%20still%20life%20composition%20natural%20light&sign=d50543b56e3575f63623ea5055f2f854",
    author: {
        id: "4",
        name: "静物摄影师王静",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=still%20life%20photographer%20female%20detail-oriented&sign=3bfd67c585c96ccf90c0560aadfc6c75"
    },
    likes: 276,
    comments: 32,
    collections: 22,
    tags: ["静物", "极简", "中画幅", "富士"],
    date: "2023-10-22"
}, {
    id: "5",
    title: "城市几何",
    description: "iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20geometry%20city%20architecture%20minimalist%20composition&sign=b5c56f91ceaddbb80362822c8664e0ae",
    author: {
        id: "5",
        name: "手机摄影师张强",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mobile%20photographer%20male%20urban%20explorer&sign=1eff3d26acd6475fd9c84ba0ee8e5d74"
    },
    likes: 321,
    comments: 41,
    collections: 25,
    tags: ["城市", "几何", "手机摄影", "极简"],
    date: "2023-10-21"
}, {
    id: "6",
    title: "黑白纪实",
    description: "Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20street%20photography%20documentary%20moment&sign=d29476f80a3d538bddc7d6b20fcd017d",
    author: {
        id: "6",
        name: "纪实摄影师陈默",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street&sign=788a26eea5ce0ca5b0473146963afcf0"
    },
    likes: 398,
    comments: 52,
    collections: 33,
    tags: ["黑白", "纪实", "人文", "街头"],
    date: "2023-10-20"
}];

// 热门标签数据
const popularTags = [{
    id: 1,
    name: "极简主义",
    count: 1456
}, {
    id: 2,
    name: "黑白",
    count: 1245
}, {
    id: 3,
    name: "胶片质感",
    count: 987
}, {
    id: 4,
    name: "暗调氛围",
    count: 765
}, {
    id: 5,
    name: "建筑",
    count: 654
}, {
    id: 6,
    name: "人像",
    count: 543
}, {
    id: 7,
    name: "城市几何",
    count: 432
}, {
    id: 8,
    name: "静物",
    count: 321
}];

// 推荐艺术家数据
const featuredPhotographers = [{
    id: "101",
    name: "黑白影像达人",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photographer%20male%20serious&sign=7651d7d16421ab76c2b59b1bd71a39c2",
    followers: 12543,
    posts: 324,
    level: "新锐艺术家"
}, {
    id: "102",
    name: "胶片艺术师",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage&sign=1742134c6641907308d9b1410d65842c",
    followers: 8765,
    posts: 213,
    level: "资深摄影师"
}, {
    id: "103",
    name: "建筑几何控",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20creative&sign=17c8985a6812f53b55a5f015db719ac3",
    followers: 6543,
    posts: 187,
    level: "创意摄影师"
}];

// 灵感专栏数据
const inspirationItems = [{
    id: "1",
    title: "黑白摄影的光影艺术",
    author: "林风",
    description: "探索如何通过光影对比创造出富有情感和深度的黑白影像作品...",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=black%20and%20white%20photography%20tutorial%20light%20shadow&sign=581ada31389ae6719d75794988b72a4c"
}, {
    id: "2",
    title: "胶片摄影的复兴与现代应用",
    author: "安娜",
    description: "探讨胶片摄影在数字时代的独特魅力和应用场景，以及如何将传统技术融入现代创作...",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20camera%20vintage%20photography%20process&sign=e4d693788f49256f00febe15b1f68df2"
}, {
    id: "3",
    title: "极简主义摄影的构图法则",
    author: "李明",
    description: "解析极简主义摄影的核心构图原则，帮助你创造简洁而有力的视觉表达...",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=minimalist%20photography%20composition%20rules&sign=fd587b41706f60a738a2464cc11304ac"
}, {
    id: "4",
    title: "暗房技术与现代数字暗房",
    author: "张强",
    description: "比较传统暗房技术与现代数字暗房的异同，以及如何在后期制作中保留胶片质感...",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=darkroom%20photography%20digital%20workflow&sign=c372da4647ca0d3c6ef6803314856aec"
}];

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