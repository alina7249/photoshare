import { buildCozeImageUrl } from '../constants/api';
// Hover效果描述：
// 1. 地图标记点：使用framer-motion的whileHover属性，实现标记点缩放效果(scale: 1.2)
// 2. 位置列表卡片：使用framer-motion的whileHover属性，实现卡片向上平移(y: -5)
// 3. 位置列表项：使用Tailwind的hover伪类，悬停时边框变化

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShareButton } from '../components/common/ShareButton';
import { toast } from 'sonner';
import { apiGet } from '../lib/api';

// 位置信息接口
interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: number;
  image: string;
  categories: string[];
  // 新增字段
  visitCount: number; // 访问次数
  firstVisit: string; // 首次访问
  lastVisit: string; // 最近访问
  rating: number; // 评分(1-5)
  notes?: string; // 笔记
  isFavorite: boolean; // 是否收藏
}

// 摄影作品接口
interface PhotographyPost {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  likes: number;
  comments: number;
}

// 新位置表单接口
interface NewLocationForm {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categories: string[];
  notes?: string;
  rating: number;
}

const PhotoLocations: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('全部');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState('全部');
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewLocationModalOpen, setIsNewLocationModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newLocationForm, setNewLocationForm] = useState<NewLocationForm>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    categories: [],
    notes: '',
    rating: 3,
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    apiGet('/locations').then(setLocations).catch(console.error);
  }, []);

  // 模拟位置相关的作品数据
  const getPhotosByLocation = (locationId: string): PhotographyPost[] => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return [];
    
    // 为每个位置生成固定的作品数据，使用常量URL
    const locationImages: Record<string, string[]> = {
      '1': [
        buildCozeImageUrl('shanghai bund night photography 1', 'c8632ab0baac9118aae370c9eba03560', 'landscape_4_3'),
        buildCozeImageUrl('shanghai bund architecture photography 2', '73abc13d604aacd63477f0e580ab50a8', 'landscape_4_3'),
        buildCozeImageUrl('shanghai skyline photography 3', '176e9027d3008a6f4f33eebb8fa8a29e', 'landscape_4_3')
      ],
      '2': [
        buildCozeImageUrl('beijing forbidden city sunset photography 1', '73f666bf8bd3385d90765b17645661f0', 'landscape_4_3'),
        buildCozeImageUrl('beijing ancient architecture photography 2', '62eb7f3ee8320f591b037414b2d69358', 'landscape_4_3')
      ],
      '3': [
        buildCozeImageUrl('hangzhou west lake morning photography 1', 'fffc651f0aa5ad61cf22a9fa5d243683', 'landscape_4_3'),
        buildCozeImageUrl('west lake pagoda photography 2', '4590a8dda0aac1ed428c53a8b561cb71', 'landscape_4_3'),
        buildCozeImageUrl('hangzhou garden photography 3', 'ea347165f0dc375a7ebda5fb1aa035c4', 'landscape_4_3')
      ],
      '4': [
        buildCozeImageUrl('chengdu jinli ancient street night 1', '4afd852ddebde6f9093ea00d9c6247e3', 'landscape_4_3'),
        buildCozeImageUrl('jinli traditional architecture 2', 'c206a633862358ad06e149b114bd0672', 'landscape_4_3')
      ],
      '5': [
        buildCozeImageUrl('zhangjiajie mountains cloud photography 1', '55a785ce2ab9c389fc508cf4e996e71e', 'landscape_4_3'),
        buildCozeImageUrl('zhangjiajie forest park 2', '7e44e8a25986262bd92f640e276d0541', 'landscape_4_3')
      ],
      '6': [
        buildCozeImageUrl('guangzhou tower night photography 1', 'e22b19a088cd6bd7acc85661bac8b588', 'landscape_4_3'),
        buildCozeImageUrl('guangzhou cbd skyline photography 2', '6d76ebd95c29e78ec9e5cfef5445c71c', 'landscape_4_3')
      ]
    };
    
    const images = locationImages[locationId] || [];
    
    // 为每个位置生成模拟的作品数据
    return Array.from({ length: Math.min(4, images.length) }, (_, i) => ({
      id: `${locationId}-photo-${i + 1}`,
      title: `${location.name}作品 ${i + 1}`,
      image: images[i],
      location: location.name,
      date: `2023-10-${10 + i}`,
      likes: Math.floor(Math.random() * 100) + 50,
      comments: Math.floor(Math.random() * 20) + 5,
    }));
  };
  
  // 过滤位置数据
  const getFilteredLocations = () => {
    let filtered = [...locations];
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(term) || 
        location.address.toLowerCase().includes(term)
      );
    }
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(location => 
        location.categories.includes(selectedCategory)
      );
    }
    
    // 按时间过滤
    if (selectedTimeFilter !== '全部') {
      const now = new Date();
      filtered = filtered.filter(location => {
        const lastVisitDate = new Date(location.lastVisit);
        const diffTime = now.getTime() - lastVisitDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (selectedTimeFilter === '一周内') return diffDays <= 7;
        if (selectedTimeFilter === '一月内') return diffDays <= 30;
        if (selectedTimeFilter === '三月内') return diffDays <= 90;
        if (selectedTimeFilter === '一年内') return diffDays <= 365;
        
        return true;
      });
    }
    
    // 按活跃度过滤
    if (selectedActivityFilter !== '全部') {
      filtered = filtered.filter(location => {
        if (selectedActivityFilter === '高活跃') return location.visitCount >= 10;
        if (selectedActivityFilter === '中活跃') return location.visitCount >= 5 && location.visitCount < 10;
        if (selectedActivityFilter === '低活跃') return location.visitCount < 5;
        
        return true;
      });
    }
    
    return filtered;
  };
  
  // 获取所有分类
  const getAllCategories = () => {
    const categories = ['全部'];
    locations.forEach(location => {
      location.categories.forEach(category => {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
    });
    return categories;
  };
  
  // 生成统计数据
  const generateStatsData = () => {
    return locations.map(location => ({
      name: location.name,
      photos: location.photos,
      visits: location.visitCount,
    }));
  };
  
  // 地图交互处理
  const handleMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setMapZoom(prev => Math.min(Math.max(0.5, prev * delta), 3));
  };
  
  const handleMapMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setMapPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMapMouseUp = () => {
    setIsDragging(false);
  };
  
  // 打开详情模态框
  const openDetailModal = (locationId: string) => {
    setSelectedLocation(locationId);
    setIsDetailModalOpen(true);
  };
  
  // 打开新建位置模态框
  const openNewLocationModal = () => {
    setIsEditMode(false);
    setNewLocationForm({
      name: '',
      address: '',
      latitude: 30.0, // 默认中国中部
      longitude: 115.0, // 默认中国中部
      categories: [],
      notes: '',
      rating: 3,
    });
    setIsNewLocationModalOpen(true);
  };
  
  // 打开编辑位置模态框
  const openEditLocationModal = (location: Location) => {
    setIsEditMode(true);
    setNewLocationForm({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      categories: [...location.categories],
      notes: location.notes || '',
      rating: location.rating,
    });
    setSelectedLocation(location.id);
    setIsNewLocationModalOpen(true);
  };
  
  // 提交新建/编辑位置
  const handleSubmitLocation = () => {
    // 模拟提交成功
    toast.success(isEditMode ? '地点信息已更新' : '新地点已添加');
    setIsNewLocationModalOpen(false);
    
    // 重置表单
    setNewLocationForm({
      name: '',
      address: '',
      latitude: 30.0,
      longitude: 115.0,
      categories: [],
      notes: '',
      rating: 3,
    });
  };
  
  // 删除位置
  const handleDeleteLocation = (locationId: string) => {
    if (window.confirm('确定要删除这个拍摄地点吗？此操作无法撤销。')) {
      // 模拟删除成功
      toast.success('地点已删除');
      setIsDetailModalOpen(false);
      setSelectedLocation(null);
    }
  };
  
  // 处理分类选择
  const handleCategoryToggle = (category: string) => {
    setNewLocationForm(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };
  
  // 从本地存储加载数据
  useEffect(() => {
    // 这里可以添加从本地存储加载数据的逻辑
  }, []);
  
  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMapMouseMove);
      document.addEventListener('mouseup', handleMapMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMapMouseMove);
        document.removeEventListener('mouseup', handleMapMouseUp);
      };
    }
  }, [isDragging, dragStart]);
  
  const filteredLocations = getFilteredLocations();
  const allCategories = getAllCategories();
  const locationPhotos = selectedLocation ? getPhotosByLocation(selectedLocation) : [];
  const statsData = generateStatsData();
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
          <p className="text-text-muted mb-6 max-w-md">登录后查看您的拍摄地点分布和相关作品</p>
          <Link to="/login" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors">
            立即登录
          </Link>
        </div>
      </div>
    );
  }
  
  const selectedLocationData = selectedLocation ? locations.find(loc => loc.id === selectedLocation) : null;
  
  return (
    <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题和添加按钮 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-text-primary mb-2">我的拍摄地点</h1>
            <p className="text-text-muted max-w-2xl mx-auto md:mx-0">
              展示您发布作品的拍摄地点分布，探索新的创作灵感
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openNewLocationModal}
            className="mt-4 md:mt-0 px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            添加新地点
          </motion.button>
        </div>
        
        {/* 搜索和筛选 */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索地点名称或地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
            >
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
            >
              <option value="全部">全部时间</option>
              <option value="一周内">一周内</option>
              <option value="一月内">一月内</option>
              <option value="三月内">三月内</option>
              <option value="一年内">一年内</option>
            </select>
            
            <select
              value={selectedActivityFilter}
              onChange={(e) => setSelectedActivityFilter(e.target.value)}
              className="px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
            >
              <option value="全部">全部活跃度</option>
              <option value="高活跃">高活跃 (≥10次)</option>
              <option value="中活跃">中活跃 (5-9次)</option>
              <option value="低活跃">低活跃 (&lt;5次)</option>
            </select>
          </div>
        </div>
        
        {/* 数据统计 */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
          <h3 className="text-lg font-bold text-text-primary mb-4">拍摄地点统计</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--light-blue-gray)" />
                <XAxis dataKey="name" stroke="var(--light-cool-gray)" />
                <YAxis stroke="var(--light-cool-gray)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--deep-blue-gray)', borderColor: 'var(--light-blue-gray)', color: 'var(--light-white)' }} 
                />
                <Bar dataKey="photos" name="作品数量" fill="var(--light-blue-gray)" />
                <Bar dataKey="visits" name="访问次数" fill="var(--medium-blue-gray)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-deep p-4 rounded-lg border border-accent">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div>
                  <p className="text-sm text-text-muted">总地点数</p>
                  <p className="text-xl font-bold text-text-primary">{locations.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-deep p-4 rounded-lg border border-accent">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                  <i className="fa-solid fa-camera"></i>
                </div>
                <div>
                  <p className="text-sm text-text-muted">总作品数</p>
                  <p className="text-xl font-bold text-text-primary">{locations.reduce((sum, loc) => sum + loc.photos, 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-deep p-4 rounded-lg border border-accent">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div>
                  <p className="text-sm text-text-muted">收藏地点</p>
                  <p className="text-xl font-bold text-text-primary">{locations.filter(loc => loc.isFavorite).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧位置列表 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 模拟地图区域 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">拍摄地点地图</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setMapZoom(1)}
                    className="p-2 bg-deep rounded-lg text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                  >
                    <i className="fa-solid fa-location-crosshairs"></i>
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 3))}
                    className="p-2 bg-deep rounded-lg text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                  <button 
                    onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.5))}
                    className="p-2 bg-deep rounded-lg text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                </div>
              </div>
              
              <div 
                ref={mapRef}
                className="h-[500px] relative bg-deep rounded-lg overflow-hidden cursor-move"
                onWheel={handleMapWheel}
                onMouseDown={handleMapMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {/* 模拟地图背景 */}
                <motion.div 
                  className="absolute inset-0 opacity-30 origin-center"
                  style={{ 
                    scale: mapZoom,
                    x: mapPosition.x,
                    y: mapPosition.y,
                  }}
                >
                  <img 
                    src={buildCozeImageUrl('world map vintage paper texture blue', 'a7e6038b84e3276bdf4bf7abc3a1ddb7', 'landscape_16_9')}
                    alt="Map background"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* 地图标记点 */}
                {locations.map((location) => (
                  <motion.div
                    key={location.id}
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: selectedLocation === location.id ? [1, 1.2, 1] : 1,
                      transition: selectedLocation === location.id ? { duration: 2, repeat: Infinity } : {}
                    }}
                    whileHover={{ scale: 1.2 }}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer shadow-lg ${
                      selectedLocation === location.id ? 'bg-accent border-2 border-text-primary' : 'bg-accent-hover border-2 border-card'
                    }`}
                    style={{
                      left: `${(location.longitude + 180) / 360 * 100}%`,
                      top: `${(90 - location.latitude) / 180 * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                    onClick={() => openDetailModal(location.id)}
                  >
                    <motion.div 
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card text-text-primary text-xs rounded whitespace-nowrap opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {location.name} ({location.photos}张作品)
                    </motion.div>
                    
                    {/* 显示作品数量的小徽章 */}
                    <div className="absolute -top-1 -right-1 bg-danger text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {Math.min(location.photos, 99)}+
                    </div>
                    
                    {/* 收藏标记 */}
                    {location.isFavorite && (
                      <div className="absolute -bottom-1 -right-1 text-yellow-400">
                        <i className="fa-solid fa-star text-xs"></i>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between text-sm text-text-muted">
                <p>提示：点击地图上的标记点查看详细信息</p><p>按住鼠标拖动地图，滚轮缩放</p>
              </div>
            </div>
            
            {/* 位置列表 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">位置列表</h3>
                <span className="text-sm text-text-muted">{filteredLocations.length} 个地点</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ y: -5 }}
                    className={`bg-deep rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      selectedLocation === location.id 
                        ? 'border-accent shadow-lg' 
                        : 'border-accent hover:border-accent'
                    }`}
                    onClick={() => openDetailModal(location.id)}
                  >
                    <div className="relative"><img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <div className="bg-deep/80 text-text-primary text-xs px-2 py-1 rounded-full">
                          {location.photos} 张作品
                        </div>
                        {location.isFavorite && (
                          <div className="bg-deep/80 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
                            <i className="fa-solid fa-star mr-1"></i> 收藏
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-text-primary">{location.name}</h4>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i 
                              key={i}
                              className={`fa-solid fa-star text-xs ${i < location.rating ? 'text-yellow-400' : 'text-accent'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-muted mb-3 line-clamp-1">{location.address}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {location.categories.map((category, index) => (
                          <span key={index} className="px-2 py-0.5 bg-card text-text-muted text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-accent-hover">
                        <span><i className="fa-solid fa-calendar-alt mr-1"></i> 最近访问: {location.lastVisit}</span>
                        <span><i className="fa-solid fa-map-marker-alt mr-1"></i> 访问 {location.visitCount} 次</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredLocations.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                    <i className="fa-solid fa-map-marker-alt text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关地点</h3>
                  <p className="text-text-muted">
                    尝试使用其他关键词或分类进行搜索
                  </p>
                  <button
                    onClick={openNewLocationModal}
                    className="mt-4 px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
                  >
                    添加新地点
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧位置详情和作品 */}
          <div className="space-y-6">
            {selectedLocation ? (
              <>
                {/* 位置详情 - 简洁版 */}
                <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm border border-accent">
                  {(() => {
                    const location = locations.find(loc => loc.id === selectedLocation);
                    if (!location) return null;
                    
                    return (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-text-primary">{location.name}</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                // 模拟切换收藏状态
                                toast.success(location.isFavorite ? '已取消收藏' : '已添加到收藏');
                              }}
                              className={`p-1.5 rounded-full ${location.isFavorite ? 'bg-yellow-400 text-deep' : 'bg-card/50 text-text-primary'}`}
                              title={location.isFavorite ? '取消收藏' : '收藏地点'}
                            >
                              <i className="fa-solid fa-star"></i>
                            </button>
                            <ShareButton
                              url={`${window.location.origin}/photo-locations/${location.id}`}
                              title={location.name}
                              size="sm"
                            />
                          </div>
                        </div>
                        
                        <p className="text-sm text-text-primary/80 mb-4">{location.address}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <i className="fa-solid fa-camera text-text-primary mr-2"></i>
                            <span className="text-text-primary">{location.photos} 张作品</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-map-pin text-text-primary mr-2"></i>
                            <span className="text-text-primary">
                              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-calendar-alt text-text-primary mr-2"></i>
                            <span className="text-text-primary">
                              最近: {location.lastVisit}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-history text-text-primary mr-2"></i>
                            <span className="text-text-primary">
                              访问 {location.visitCount} 次
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {location.categories.map((category, index) => (
                            <span key={index} className="px-2 py-0.5 bg-card/50 text-text-primary text-xs rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <button 
                            onClick={() => openEditLocationModal(location)}
                            className="flex-1 py-2 bg-card text-text-primary rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                          >
                            <i className="fa-solid fa-pen-to-square mr-1"></i> 编辑
                          </button>
                          <button 
                            onClick={() => navigate(`/profile-center/works?location=${location.id}`)}
                            className="flex-1 py-2 bg-card text-text-primary rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                          >
                            <i className="fa-solid fa-images mr-1"></i> 查看作品
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* 位置相关作品 */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">该地点的作品</h3>
                  <div className="space-y-4">
                    {locationPhotos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex space-x-3 p-3 bg-deep rounded-lg border border-accent hover:border-accent transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // 防止触发父元素的点击事件
                          navigate(`/photo/${photo.id}`);
                        }}
                      >
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary mb-1">{photo.title}</h4>
                          <p className="text-xs text-text-muted mb-2">{photo.date}</p>
                          <div className="flex space-x-3 text-xs">
                            <span className="flex items-center text-text-muted">
                              <i className="fa-solid fa-heart mr-1 text-danger"></i> {photo.likes}
                            </span>
                            <span className="flex items-center text-text-muted">
                              <i className="fa-solid fa-comment mr-1 text-accent"></i> {photo.comments}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {locationPhotos.length === 0 && (
                      <div className="p-4 text-center">
                        <p className="text-text-muted">该地点暂无作品</p>
                        <button
                          onClick={() => navigate('/profile-center/works?action=upload')}
                          className="mt-3 px-4 py-2 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                        >
                          上传作品
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {locationPhotos.length > 0 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => navigate(`/profile-center/works?location=${selectedLocation}`)}
                        className="inline-flex items-center text-sm text-accent hover:text-accent-hover transition-colors"
                      >
                        查看更多作品 <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* 拍摄建议 */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
                  <h3 className="text-lg font-bold text-text-primary mb-4">拍摄建议</h3>
                  {selectedLocationData?.notes && (
                    <div className="mb-4 p-3 bg-deep rounded-lg border border-accent text-sm text-text-muted">
                      {selectedLocationData.notes}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <i className="fa-solid fa-clock text-accent mt-1 mr-3 flex-shrink-0"></i>
                      <div>
                        <h4 className="font-medium text-text-primary text-sm">最佳拍摄时间</h4>
                        <p className="text-xs text-text-muted mt-1">根据地点特点，建议在日出、日落或特定季节前往拍摄</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <i className="fa-solid fa-camera text-accent mt-1 mr-3 flex-shrink-0"></i>
                      <div>
                        <h4 className="font-medium text-text-primary text-sm">推荐器材</h4>
                        <p className="text-xs text-text-muted mt-1">广角镜头适合风景，长焦镜头适合人像或细节捕捉</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <i className="fa-solid fa-sun text-accent mt-1 mr-3 flex-shrink-0"></i>
                      <div>
                        <h4 className="font-medium text-text-primary text-sm">光线考虑</h4>
                        <p className="text-xs text-text-muted mt-1">注意不同时间段光线角度的变化，准备反光板或补光设备</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-xl p-6 shadow-sm border border-accent">
                <h3 className="text-lg font-bold text-text-primary mb-2">位置详情</h3>
                <p className="text-text-muted">
                  从地图或位置列表中选择一个地点，查看详细信息和相关作品
                </p>
                <div className="mt-6 flex flex-col space-y-3">
                  <div className="p-3 bg-deep rounded-lg border border-accent">
                    <h4 className="font-medium text-text-primary mb-1 flex items-center">
                      <i className="fa-solid fa-info-circle text-accent mr-2"></i>
                      如何添加新地点？
                    </h4>
                    <p className="text-sm text-text-muted">
                      点击"添加新地点"按钮，填写地点信息，系统会自动将其添加到您的地点列表中
                    </p>
                  </div>
                  <div className="p-3 bg-deep rounded-lg border border-accent">
                    <h4 className="font-medium text-text-primary mb-1 flex items-center">
                      <i className="fa-solid fa-lightbulb text-accent mr-2"></i>
                      创作提示
                    </h4>
                    <p className="text-sm text-text-muted">
                      探索新的拍摄地点可以激发创作灵感，尝试在不同时间和天气条件下拍摄同一地点
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* 位置详情模态框 */}
      {isDetailModalOpen && selectedLocationData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl border border-accent max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedLocationData.image}
                alt={selectedLocationData.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => {
                    // 模拟切换收藏状态
                    toast.success(selectedLocationData.isFavorite ? '已取消收藏' : '已添加到收藏');
                  }}
                  className={`p-2 rounded-full ${selectedLocationData.isFavorite ? 'bg-yellow-400 text-deep' : 'bg-deep/80 text-text-primary'}`}
                  title={selectedLocationData.isFavorite ? '取消收藏' : '收藏地点'}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
                <ShareButton
                  url={`${window.location.origin}/photo-locations/${selectedLocationData.id}`}
                  title={selectedLocationData.name}
                  size="sm"
                />
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 bg-deep/80 text-text-primary rounded-full hover:bg-accent transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedLocationData.name}</h2>
                  <div className="flex items-center text-sm text-text-muted mb-4">
                    <i className="fa-solid fa-map-marker-alt mr-2"></i>
                    <span>{selectedLocationData.address}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i 
                      key={i}
                      className={`fa-solid fa-star ${i < selectedLocationData.rating ? 'text-yellow-400' : 'text-accent'}`}
                    ></i>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-deep rounded-lg border border-accent">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">作品数量</p>
                      <p className="text-xl font-bold text-text-primary">{selectedLocationData.photos}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-deep rounded-lg border border-accent">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                      <i className="fa-solid fa-history"></i>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">访问次数</p>
                      <p className="text-xl font-bold text-text-primary">{selectedLocationData.visitCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-deep rounded-lg border border-accent">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                      <i className="fa-solid fa-calendar-alt"></i>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">首次访问</p>
                      <p className="text-lg font-bold text-text-primary">{selectedLocationData.firstVisit}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-deep rounded-lg border border-accent">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">最近访问</p>
                      <p className="text-lg font-bold text-text-primary">{selectedLocationData.lastVisit}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-3">地点分类</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLocationData.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1.5 bg-deep text-text-muted rounded-full text-sm border border-accent">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-3">拍摄笔记</h3>
                {selectedLocationData.notes ? (
                  <div className="p-4 bg-deep rounded-lg border border-accent text-text-muted">
                    {selectedLocationData.notes}
                  </div>
                ) : (
                  <div className="p-4 bg-deep rounded-lg border border-accent text-text-muted text-center">
                    <p>暂无拍摄笔记</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-3">坐标信息</h3>
                <div className="p-4 bg-deep rounded-lg border border-accent flex justify-between items-center">
                  <div>
                    <p className="text-text-primary">{selectedLocationData.latitude.toFixed(6)}, {selectedLocationData.longitude.toFixed(6)}</p>
                    <p className="text-xs text-text-muted mt-1">点击复制坐标</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selectedLocationData.latitude.toFixed(6)}, ${selectedLocationData.longitude.toFixed(6)}`);
                      toast.success('坐标已复制到剪贴板');
                    }}
                    className="px-4 py-2 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                  >
                    复制
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary mb-3">相关作品</h3>
                {locationPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {locationPhotos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.05 }}
                        className="group"
                        onClick={() => navigate(`/photo/${photo.id}`)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden border border-accent cursor-pointer">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">{photo.title}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-deep rounded-lg border border-accent text-center">
                    <p className="text-text-muted">暂无相关作品</p>
                    <button
                      onClick={() => navigate('/profile-center/works?action=upload')}
                      className="mt-3 px-4 py-2 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                    >
                      上传作品
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => openEditLocationModal(selectedLocationData)}
                  className="flex-1 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
                >
                  <i className="fa-solid fa-pen-to-square mr-2"></i> 编辑地点信息
                </button>
                <button
                  onClick={() => navigate(`/profile-center/works?location=${selectedLocationData.id}`)}
                  className="flex-1 py-3 bg-card text-text-primary border border-accent rounded-lg font-medium hover:bg-accent transition-colors"
                >
                  <i className="fa-solid fa-images mr-2"></i> 查看全部作品
                </button>
                <button
                  onClick={() => handleDeleteLocation(selectedLocationData.id)}
                  className="py-3 px-4 bg-danger text-text-primary rounded-lg font-medium hover:bg-danger transition-colors"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* 新建/编辑位置模态框 */}
      {isNewLocationModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsNewLocationModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl border border-accent max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-accent">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-text-primary">{isEditMode ? '编辑地点' : '添加新地点'}</h3>
                <button
                  onClick={() => setIsNewLocationModalOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">地点名称</label>
                  <input
                    type="text"
                    value={newLocationForm.name}
                    onChange={(e) => setNewLocationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入地点名称"
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">详细地址</label>
                  <input
                    type="text"
                    value={newLocationForm.address}
                    onChange={(e) => setNewLocationForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入详细地址"
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">纬度</label>
                    <input
                      type="number"
                      value={newLocationForm.latitude}
                      onChange={(e) => setNewLocationForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                      step="0.000001"
                      placeholder="请输入纬度"
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">经度</label>
                    <input
                      type="number"
                      value={newLocationForm.longitude}
                      onChange={(e) => setNewLocationForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                      step="0.000001"
                      placeholder="请输入经度"
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">地点分类</label>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.filter(c => c !== '全部').map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newLocationForm.categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="accent-accent text-accent"
                        />
                        <span className="text-sm text-text-primary">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">评分</label>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewLocationForm(prev => ({ ...prev, rating: i + 1 }))}
                        className={`p-2 rounded-lg transition-colors ${newLocationForm.rating >= i + 1 ? 'text-yellow-400 bg-deep' : 'text-accent'}`}
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">拍摄笔记</label>
                  <textarea
                    value={newLocationForm.notes}
                    onChange={(e) => setNewLocationForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="记录该地点的拍摄建议、最佳时间等信息"
                    className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted h-32 resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-accent flex justify-end space-x-3">
              <button
                onClick={() => setIsNewLocationModalOpen(false)}
                className="px-6 py-3 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
              >
                取消
              </button>
              <button
                onClick={handleSubmitLocation}
                className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                {isEditMode ? '保存修改' : '添加地点'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoLocations;