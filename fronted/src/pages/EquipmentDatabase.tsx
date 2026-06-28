// EquipmentDatabase.tsx - 卡片hover效果详细描述：
// 1. 器材类型选择按钮：当鼠标悬停时，按钮会向上平移5个像素(y: -5)，提供清晰的交互反馈
// 2. 器材卡片：当鼠标悬停时，卡片会向上平移5个像素(y: -5)，同时阴影效果增强，给人一种浮动感
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { mockCameras, mockLenses, mockAccessories, allEquipments, Equipment } from '../lib/equipmentData';

import { EquipmentQuestions } from '../components/EquipmentQuestions';
import { toast } from 'sonner';
import { EquipmentRecommendations } from '../components/EquipmentRecommendations';
import { Empty } from '../components/Empty';

import { EquipmentComparisonChart } from '../components/EquipmentComparisonChart';

// 品牌列表
const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI'];

// 器材类型
const equipmentTypes = [
  { id: 'cameras', name: '相机', icon: 'fa-camera' },
  { id: 'lenses', name: '镜头', icon: 'fa-video' },
  { id: 'accessories', name: '配件', icon: 'fa-toolbox' }
];

  // AI推荐模态框组件
  interface AISuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: string;
    setPrompt: (value: string) => void;
    onSubmitPrompt: () => void;
    recommendations: Equipment[];
    isLoading: boolean;
    setSelectedEquipment: (equipment: Equipment) => void;
    aiConversation: {role: 'user' | 'ai', content: string, timestamp: Date}[];
  }

  const AISuggestionModal: React.FC<AISuggestionModalProps> = ({
  isOpen,
  onClose,
  prompt,
  setPrompt,
  onSubmitPrompt,
  recommendations,
  isLoading,
  setSelectedEquipment,
  aiConversation
}) => {
  if (!isOpen) return null;
  
  // 示例提示标签
  const examplePrompts = [
    '旅行便携相机推荐',
    '入门级微单对比',
    '长焦镜头选哪款',
    '预算5000元拍人像',
    '适合视频的全画幅相机'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
          <h3 className="font-bold text-[#F5F7FA] flex items-center">
            <i className="fa-solid fa-robot text-[#4A5F8B] mr-2"></i>
            AI器材推荐
          </h3>
          <button
            className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
            onClick={onClose}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="p-6">
          {/* 输入区域 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#B8C6D8] mb-2">描述你的需求</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：预算 5000 元，拍人像，新手适用"
              className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-24"
            ></textarea>
          </div>
          
          {/* 示例标签 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#B8C6D8] mb-2">快速选择</label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-lg text-sm hover:bg-[#4A5F8B]/30 transition-colors border border-[#4A5F8B]"
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
            >
              取消
            </button>
            <button
              onClick={onSubmitPrompt}
              disabled={isLoading}
              className="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  生成推荐...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic mr-2"></i>
                  获取推荐
                </>
              )}
            </button>
          </div>
          
           {/* AI回复和推荐结果 */}
          {aiConversation.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* 对话历史 */}
              <div className="bg-[#1E2532] p-4 rounded-lg">
                {aiConversation.map((message, index) => (
                  <div key={index} className={`mb-3 last:mb-0 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-br-none' 
                        : 'bg-[#2D3748] text-[#B8C6D8] rounded-bl-none'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 推荐结果 */}
              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-[#B8C6D8] mb-3">根据您的需求，为您推荐以下器材：</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((equipment) => (
                      <motion.div
                        key={equipment.id}
                        whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                        className="bg-[#1E2532] rounded-lg overflow-hidden border border-[#4A5F8B] transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedEquipment(equipment);
                          onClose();
                        }}
                      >
                        <div className="h-36 overflow-hidden">
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h5 className="font-medium text-[#F5F7FA] mb-1 line-clamp-1">{equipment.name}</h5>
                          <p className="text-xs text-[#6B7C93] mb-2">{equipment.brand} | {equipment.type}</p>
                          <p className="text-sm font-bold text-[#4A5F8B]">¥{parseInt(equipment.price).toLocaleString()}</p>
                          
                          {/* 显示推荐理由 */}
                          <div className="mt-2">
                            {equipment.tags.includes('便携') && (
                              <span className="inline-block px-2 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded mr-1 mb-1">便携设计</span>
                            )}
                            {equipment.tags.includes('入门') && (
                              <span className="inline-block px-2 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded mr-1 mb-1">适合新手</span>
                            )}
                            {parseInt(equipment.price) < 6000 && (
                              <span className="inline-block px-2 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded mr-1 mb-1">性价比高</span>
                            )}
                            {equipment.performance && equipment.performance.autofocus > 9 && (
                              <span className="inline-block px-2 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded mr-1 mb-1">对焦迅速</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

  const EquipmentDatabase: React.FC = () => {
  const [activeType, setActiveType] = useState('cameras');
  const [selectedBrand, setSelectedBrand] = useState('全部');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showAISuggestionModal, setShowAISuggestionModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<Equipment[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiConversation, setAiConversation] = useState<{role: 'user' | 'ai', content: string, timestamp: Date}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 每页显示9个器材
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [rentalDuration, setRentalDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [equipmentPrice, setEquipmentPrice] = useState(0);

  // 过滤器材
  const getFilteredEquipment = () => {
    let equipment = [];
    
    switch(activeType) {
      case 'cameras':
        equipment = mockCameras;
        break;
      case 'lenses':
        equipment = mockLenses;
        break;
      case 'accessories':
        equipment = mockAccessories;
        break;
      default:
        equipment = mockCameras;
    }
    
    // 按品牌过滤
    if (selectedBrand !== '全部') {
      equipment = equipment.filter(item => item.brand === selectedBrand);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      equipment = equipment.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.brand.toLowerCase().includes(term) ||
        (item.type && item.type.toLowerCase().includes(term))
      );
    }
    
    return equipment;
  };

  // 添加/移除对比项
  const toggleCompareItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      if (selectedItems.length < 3) {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };

  // 查看对比
  const viewComparison = () => {
    setIsComparisonMode(true);
  };

  // 获取对比数据
  const getComparisonData = () => {
    let allEquipment: any[] = [...mockCameras, ...mockLenses, ...mockAccessories];
    return selectedItems.map(id => allEquipment.find(item => item.id === id)).filter(Boolean);
  };

  // 获取性能雷达图数据
  const getRadarData = (items: any[]) => {
    if (!items || items.length === 0) return [];
    
    const radarData: any[] = [];
    const categories = Object.keys(items[0].performance);
    
    categories.forEach(category => {
      const dataPoint: any = { category: translateCategory(category) };
      items.forEach((item, index) => {
        dataPoint[`item${index + 1}`] = item.performance[category as keyof typeof item.performance] || 0;
      });
      radarData.push(dataPoint);
    });
    
    return radarData;
  };

  // 分类名称翻译
  const translateCategory = (category: string) => {
    const translations: {[key: string]: string} = {
      dynamicRange: '动态范围',
      lowLight: '弱光性能',
      autofocus: '自动对焦',
      ergonomics: '人体工学',
      buildQuality: '做工质量',
      valueForMoney: '性价比',
      sharpness: '锐度',
      bokeh: '虚化效果',
      handling: '操控性',
      stability: '稳定性',
      portability: '便携性',
      versatility: '多功能性',
      batteryLife: '电池续航',
      easeOfUse: '易用性',
      power: '功率'
    };
    
    return translations[category] || category;
  };

  // 颜色配置
  const COLORS = ['#4A5F8B', '#8884d8', '#B8C6D8', '#E6EBF2'];

  // 获取推荐器材
  const getRecommendedEquipment = (equipment: Equipment) => {
    let allEquipment: Equipment[] = [...mockCameras, ...mockLenses, ...mockAccessories];
    
    // 过滤掉当前器材和同类型器材
    let recommendations = allEquipment.filter(item => 
      item.id !== equipment.id && 
      item.type !== equipment.type &&
      item.brand === equipment.brand
    );
    
    // 如果同品牌推荐不足，补充其他品牌
    if (recommendations.length < 3) {
      const additionalRecommendations = allEquipment.filter(item => 
        item.id !== equipment.id && 
        item.type !== equipment.type &&
        !recommendations.some(r => r.id === item.id)
      );
      
      recommendations = [...recommendations, ...additionalRecommendations].slice(0, 3);
    } else {
      recommendations = recommendations.slice(0, 3);
    }
    
    return recommendations;
  };

  const filteredEquipment = getFilteredEquipment();
  const comparisonData = getComparisonData();
  const radarData = getRadarData(comparisonData);
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredEquipment.length / pageSize);
  const paginatedEquipment = filteredEquipment.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  // 生成页码范围
  const getPageRange = () => {
    const range = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4 && start > 1) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  // 处理查看详情
  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };
  
  // 处理图片预览
  const handleImagePreview = (image: string, price: string) => {
    setPreviewImage(image);
    setEquipmentPrice(parseInt(price));
    setShowImagePreviewModal(true);
  };
  
  // 处理租赁
  const handleRental = (price: string) => {
    setEquipmentPrice(parseInt(price));
    setRentalDuration('daily');
    setShowRentalModal(true);
  };

  // 返回列表
  const handleBackToList = () => {
    setSelectedEquipment(null);
  };

  // 处理AI推荐请求
  const handleAISuggestionRequest = async () => {
    if (!aiPrompt.trim()) {
      toast.warning('请输入您的需求');
      return;
    }
    
    // 记录用户消息到对话历史
    const newUserMessage = {
      role: 'user' as const,
      content: aiPrompt,
      timestamp: new Date()
    };
    setAiConversation(prev => [...prev, newUserMessage]);
    
    setIsAiLoading(true);
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 构建API请求参数，包括用户输入和当前筛选条件
      const requestParams = {
        prompt: aiPrompt,
        filters: {
          type: activeType,
          brand: selectedBrand !== '全部' ? selectedBrand : null,
        }
      };
      
      console.log('发送AI推荐请求:', requestParams);
      
      // 模拟API调用 - 这里使用假的API返回推荐结果
      const mockApiResponse = await simulateApiCall(requestParams);
      
      // 记录AI回复到对话历史
      const newAiMessage = {
        role: 'ai' as const,
        content: mockApiResponse.message,
        timestamp: new Date()
      };
      setAiConversation(prev => [...prev, newAiMessage]);
      
      setAiRecommendations(mockApiResponse.recommendations);
    } catch (error) {
      // 错误处理
      toast.error('推荐请求失败，请重试');
      console.error('AI推荐请求失败:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 模拟API调用函数
  const simulateApiCall = async (params: {
    prompt: string;
    filters: {
      type: string;
      brand: string | null;
    };
  }): Promise<{
    message: string;
    recommendations: Equipment[];
  }> => {
    // 根据提示内容返回不同的推荐
    let recommendations: Equipment[] = [];
    let message: string = '';
    
    // 模拟API处理逻辑
    const { prompt, filters } = params;
    
    // 根据不同条件进行推荐
    if (prompt.includes('旅行') || prompt.includes('便携')) {
      // 推荐便携器材
      recommendations = allEquipments.filter(item => 
        (item.type === '相机' || item.type === '无人机') && 
        (item.tags.includes('便携') || item.weight && parseFloat(item.weight.replace('g', '')) < 700)
      ).slice(0, 3);
      message = '根据您的需求，我为您推荐了几款便携的摄影器材，非常适合旅行携带。';
    } else if (prompt.includes('入门') || prompt.includes('新手')) {
      // 推荐入门器材
      recommendations = allEquipments.filter(item => 
        item.tags.includes('入门') || 
        (item.type === '相机' && parseInt(item.price) < 6000)
      ).slice(0, 3);
      message = '对于摄影新手，这些器材操作简单，性价比高，非常适合您入门学习。';
    } else if (prompt.includes('长焦') || prompt.includes('远摄')) {
      // 推荐长焦镜头
      recommendations = mockLenses.filter(item => 
        item.focalLength && 
        (item.focalLength.includes('70-200') || 
         item.focalLength.includes('100-400') || 
         item.focalLength.includes('85mm'))
      ).slice(0, 3);
      message = '这些长焦镜头可以帮助您拍摄远距离的主体，非常适合人像和野生动物摄影。';
    } else if (prompt.includes('预算')) {
      // 解析预算信息
      const budgetMatch = prompt.match(/预算\s*(\d+)/);
      if (budgetMatch && budgetMatch[1]) {
        const budget = parseInt(budgetMatch[1]);
        recommendations = allEquipments.filter(item => 
          parseInt(item.price) <= budget
        ).sort(() => Math.random() - 0.5).slice(0, 3);
        message = `在您的预算范围内，我为您推荐了这些性价比高的摄影器材。`;
      } else {
        // 默认推荐热门器材
        recommendations = allEquipments.slice(0, 3);
        message = '根据平台热门度和用户评价，我为您推荐了这些高品质器材。';
      }
    } else if (filters.brand && filters.brand !== '全部') {
      // 根据品牌筛选
      recommendations = allEquipments.filter(item => 
        item.brand === filters.brand
      ).slice(0, 3);
      message = `${filters.brand}品牌的热门器材推荐，品质可靠，值得信赖。`;
    } else if (filters.type) {
      // 根据类型筛选
      let typeRecommendations: Equipment[] = [];
      switch (filters.type) {
        case 'cameras':
          typeRecommendations = mockCameras;
          break;
        case 'lenses':
          typeRecommendations = mockLenses;
          break;
        case 'accessories':
          typeRecommendations = mockAccessories;
          break;
        default:
          typeRecommendations = allEquipments;
      }
      recommendations = typeRecommendations.slice(0, 3);
      message = `精选的${equipmentTypes.find(t => t.id === filters.type)?.name || '器材'}推荐，满足您的专业需求。`;
    } else {
      // 默认推荐热门器材
      recommendations = allEquipments.slice(0, 3);
      message = '根据平台热门度和用户评价，我为您推荐了这些高品质器材。';
    }
    
    // 确保至少有推荐结果
    if (recommendations.length === 0) {
      recommendations = allEquipments.slice(0, 3);
      message = '根据平台热门度，我为您推荐了这些高品质器材。';
    }
    
    return { message, recommendations };
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">器材数据库</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            探索专业摄影器材的详细参数、实测性能和用户评价，为您的创作选择最合适的工具
          </p>
        </div>

  {!isComparisonMode ? (
    <>
      {!selectedEquipment ? (
        // 器材列表视图
        <>
          {/* 搜索和筛选 */}
          <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索器材型号、品牌或功能..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
              </div>
              
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              
              {/* AI推荐按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAISuggestionModal(true)}
                className="px-4 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-robot"></i>
                <span>AI推荐</span>
              </motion.button>
            </div>
          </div>

                {/* 器材类型选择 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {equipmentTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setActiveType(type.id)}
                      className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                        activeType === type.id
                          ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md'
                          : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] hover:border-[#4A5F8B]'
                      }`}
                    >
                      <i className={`fa-solid ${type.icon} text-2xl mb-2 text-[#F5F7FA]`}></i>
                      <span className="font-medium">{type.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* 对比工具栏 */}
                {selectedItems.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] py-3 px-4 z-50 flex items-center justify-between shadow-lg">
                    <div className="flex items-center">
                      <i className="fa-solid fa-balance-scale text-[#4A5F8B] mr-2"></i>
                      <span className="text-[#F5F7FA]">已选择 {selectedItems.length}/3 件器材进行对比</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={viewComparison}
                      className="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors"
                    >
                      查看对比
                    </motion.button>
                  </div>
                )}

       {/* 器材列表 */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
         {paginatedEquipment.map((item) => (
           <motion.div
             key={item.id}
             whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)', rotateY: 5, translateZ: 10 }}
             className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm cursor-pointer"
             onClick={() => handleViewDetails(item)}
             style={{ transformStyle: 'preserve-3d' }}
           >
             {/* 器材图片和对比选择 */}
             <div className="relative">
               <motion.img
                 src={item.image}
                 alt={item.name}
                 className="w-full h-48 object-cover"
                 whileHover={{ scale: 1.05 }}
                 transition={{ duration: 0.3 }}
                 onClick={(e) => {
                   e.stopPropagation();
                   handleImagePreview(item.image, item.price);
                 }}
               />
               {/* 二手标签 - 如果是二手器材 */}
               {item.secondHandLink && (
                 <div className="absolute top-3 left-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium">
                   二手
                 </div>
               )}
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   toggleCompareItem(item.id);
                 }}
                 className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                   selectedItems.includes(item.id)
                     ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                     : 'bg-[#2D3748]/80 text-[#B8C6D8]'
                 } transition-colors`}
                 title={selectedItems.includes(item.id) ? '取消对比' : '添加对比'}
               >
                 <i className={`fa-solid ${selectedItems.includes(item.id) ? 'fa-check' : 'fa-plus'}`}></i>
               </button>
             </div>
             
             {/* 器材信息 */}
             <div className="p-5 bg-[#2D3748]">
               {/* 品牌和类型 */}
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm text-[#6B7C93] font-medium">{item.brand}</span><span className="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{item.type}</span>
               </div>
               
               {/* 器材名称和价格 */}
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{item.name}</h3>
                 <p className="text-[#6B7C93] mb-4">¥{parseInt(item.price).toLocaleString()}</p>
               
               {/* 评分 */}
               <div className="flex items-center mb-4">
                 <div className="flex items-center mr-2">
                   {Array.from({ length: 5 }).map((_, i) => (
                     <i
                       key={i}
                       className={`fa-solid fa-star ${
                         i < Math.floor(item.rating / 2)
                           ? 'text-[#4A5F8B]'
                           : 'text-[#B8C6D8]'
                       }`}
                     ></i>
                   ))}
                 </div>
                <span className="text-sm text-[#6B7C93]">{item.rating}/10 ({item.reviewCount} 评价)</span>
               </div>
               
               {/* 适用场景标签 */}
               <div className="flex flex-wrap gap-2 mb-4">
                 {item.suitableFor.slice(0, 3).map((scenario, index) => (
                  <span
                    key={index}
                     className="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                  >
                    {scenario}
                  </span>
                 ))}
               </div>
               
               {/* 操作按钮 */}
               <div className="grid grid-cols-2 gap-2">
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     handleViewDetails(item);
                   }}
                   className="py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]"
                 >
                   查看详情
                 </button>
                 {item.rentalInfo?.availability && (
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleRental(item.price);
                     }}
                     className="py-2 text-center bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B] hover:bg-[#4A5F8B]"
                   >
                     租赁
                   </button>
                 )}
               </div>
             </div>
           </motion.div>
         ))}
                  
            {paginatedEquipment.length === 0 && (
             <div className="col-span-full">
               <Empty 
                 type="empty"
                 size="lg"
                 text="未找到相关器材"
                 helperText="请尝试调整筛选条件或搜索其他关键词"
                 icon="fa-search"
                 backgroundColor="bg-[#2D3748]"
                 textColor="text-[#F5F7FA]"
               />
             </div>
           )}
         </div>
         
         {/* 分页控件 */}
         {totalPages > 1 && (
           <div className="flex justify-center mt-8">
             <nav className="inline-flex items-center rounded-md border border-[#4A5F8B] bg-[#1E2532] shadow-sm">
               <button
                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                 disabled={currentPage === 1}
                 className={`px-3 py-2 text-sm font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]'}`}
               >
                 <i className="fa-solid fa-chevron-left"></i>
               </button>
               {getPageRange().map(page => (
                 <button
                   key={page}
                   onClick={() => setCurrentPage(page)}
                   className={`px-3 py-2 text-sm font-medium ${currentPage === page ? 'bg-[#4A5F8B] text-white' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]'}`}
                 >
                   {page}
                 </button>
               ))}
               <button
                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                 disabled={currentPage === totalPages}
                 className={`px-3 py-2 text-sm font-medium ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]'}`}
               >
                 <i className="fa-solid fa-chevron-right"></i>
               </button>
             </nav>
           </div>
         )}
       </>
     ) : (
       // 器材详情视图
              <div>{/* 返回按钮 */}
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors mb-6"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>返回器材列表</span>
                </button>
                
                {/* 器材详情 */}
                <div className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden mb-8">
                  <div className="md:flex">
                    {/* 器材图片 */}
                    <div className="md:w-1/2">
                      <img
                        src={selectedEquipment.image}
                        alt={selectedEquipment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 器材基本信息 */}
                    <div className="md:w-1/2 p-6">
                      {/* 品牌和类型 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#4A5F8B] font-medium">{selectedEquipment.brand}</span>
                        <span className="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{selectedEquipment.type}</span>
                      </div>
                      
                      {/* 器材名称和价格 */}
                      <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">{selectedEquipment.name}</h2>
                      <p className="text-xl font-bold text-[#4A5F8B] mb-4">¥{parseInt(selectedEquipment.price).toLocaleString()}</p>
                      
                      {/* 评分 */}
                      <div className="flex items-center mb-6">
                        <div className="flex items-center mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(selectedEquipment.rating / 2)
                                  ? 'text-[#4A5F8B]'
                                  : 'text-[#B8C6D8]'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-sm text-[#6B7C93]">{selectedEquipment.rating}/10 ({selectedEquipment.reviewCount} 评价)</span>
                      </div>
                      
                      {/* 优缺点 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-[#F5F7FA] mb-2 flex items-center">
                            <i className="fa-solid fa-plus-circle text-[#4A5F8B] mr-2"></i>
                            优点
                          </h3>
                          <ul className="space-y-1">
                            {selectedEquipment.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-[#B8C6D8] flex items-start">
                                <i className="fa-solid fa-check text-[#4A5F8B] mt-1 mr-2"></i>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-[#F5F7FA] mb-2 flex items-center">
                            <i className="fa-solid fa-minus-circle text-[#4A5F8B] mr-2"></i>
                            缺点
                          </h3>
                          <ul className="space-y-1">
                            {selectedEquipment.cons.map((con, index) => (
                              <li key={index} className="text-sm text-[#B8C6D8] flex items-start">
                                <i className="fa-solid fa-times text-[#4A5F8B] mt-1 mr-2"></i>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* 适用场景 */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-[#F5F7FA] mb-2">适用场景</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEquipment.suitableFor.map((scenario, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                            >
                              {scenario}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* 标签 */}
                      <div>
                        <h3 className="text-sm font-medium text-[#F5F7FA] mb-2">标签</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEquipment.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 详细规格 */}
                  <div className="p-6 border-t border-[#4A5F8B]">
                    <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">详细规格</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {Object.entries(selectedEquipment.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-[#B8C6D8]">
                            {key === 'sensor' ? '传感器' : 
                             key === 'processor' ? '处理器' :
                             key === 'iso' ? 'ISO范围' :
                             key === 'autofocus' ? '自动对焦' :
                             key === 'video' ? '视频规格' :
                             key === 'battery' ? '电池' :
                             key === 'weight' ? '重量' :
                             key === 'focalLength' ? '焦距' :
                             key === 'aperture' ? '光圈' :
                             key === 'mount' ? '卡口' :
                             key === 'construction' ? '镜片结构' :
                             key === 'filterSize' ? '滤镜尺寸' :
                             key === 'minFocusDistance' ? '最近对焦距离' :
                             key === 'material' ? '材质' :
                             key === 'maximumHeight' ? '最大高度' :
                             key === 'minimumHeight' ? '最小高度' :
                             key === 'loadCapacity' ? '承重' :
                             key === 'sections' ? '节数' :
                             key === 'power' ? '功率' :
                             key === 'recyclingTime' ? '回电时间' :
                             key === 'compatibility' ? '兼容性' :
                             key === 'fps' ? '连拍速度' :
                             key === 'dimensions' ? '尺寸' :
                             key === 'batteryLife' ? '电池续航' :
                             key === 'camera' ? '相机规格' :
                             key === 'maxRange' ? '最大传输距离' :
                             key === 'includedItems' ? '包含配件' :
                             key === 'polarPattern' ? '指向性' :
                             key === 'frequencyResponse' ? '频率响应' :
                             key === 'sensitivity' ? '灵敏度' :
                             key === 'powerSupply' ? '供电方式' :
                             key === 'capacity' ? '容量' :
                             key === 'readSpeed' ? '读取速度' :
                             key === 'writeSpeed' ? '写入速度' :
                             key === 'guideNumber' ? '闪光指数' :
                             key === 'flightTime' ? '飞行时间' :
                             key === 'waterResistance' ? '防水性能' :
                             key === 'tripodMount' ? '三脚架接口' :
                             key}
                          </span>
                          <span className="text-sm text-[#F5F7FA] font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                 {/* 租赁信息和二手交易链接 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                  <h3 className="text-lg font-bold text-[#B8C6D8] mb-4">购买与租赁</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 租赁信息 */}
                    <div className="bg-[#1E2532] p-4 rounded-lg">
                      <h4 className="font-medium text-[#B8C6D8] mb-2 flex items-center">
                        <i className="fa-solid fa-calendar-days text-[#4A5F8B] mr-2"></i>
                        租赁信息
                      </h4>
                      <div className="space-y-2 text-sm text-[#B8C6D8]">
                        <div className="flex justify-between">
                          <span>日租金</span>
                          <span>¥{Math.round(parseInt(selectedEquipment.price) * 0.02)}/天</span>
                        </div>
                        <div className="flex justify-between">
                          <span>周租金</span>
                          <span>¥{Math.round(parseInt(selectedEquipment.price) * 0.1)}/周</span>
                        </div>
                        <div className="flex justify-between">
                          <span>月租金</span>
                          <span>¥{Math.round(parseInt(selectedEquipment.price) * 0.3)}/月</span>
                        </div>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleRental(selectedEquipment.price)}
                        className="w-full mt-3 py-2 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm"
                      >
                        立即租赁
                      </motion.button>
                    </div>
                    
                    {/* 二手交易 */}
                    <div className="bg-[#1E2532] p-4 rounded-lg">
                      <h4 className="font-medium text-[#B8C6D8] mb-2 flex items-center">
                        <i className="fa-solid fa-recycle text-[#4A5F8B] mr-2"></i>
                        二手交易
                      </h4>
                      <p className="text-sm text-[#B8C6D8] mb-3">
                        查看该器材的二手市场行情和在售商品
                      </p>
                     <motion.a 
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.97 }}
                       href="/equipment-trade"
                       className="w-full block text-center py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                     >
                       查看平台
                     </motion.a>
                    </div>
                  </div>
                </div>
                
                {/* 性能对比图表 */}
                <EquipmentComparisonChart 
                  equipmentName={selectedEquipment.name}
                  performance={selectedEquipment.performance}
                />
                
                {/* 器材搭配推荐 */}
                <EquipmentRecommendations 
                  currentEquipment={selectedEquipment}
                  recommendedEquipment={getRecommendedEquipment(selectedEquipment)}
                />
                
                 {/* 用户提问区 */}
                <EquipmentQuestions equipmentId={selectedEquipment.id} />
                
                {/* 图片预览模态框 */}
                {showImagePreviewModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setShowImagePreviewModal(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden max-w-4xl max-h-[90vh] relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 z-10"
                        onClick={() => setShowImagePreviewModal(false)}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                      <img
                        src={previewImage}
                        alt="器材预览"
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                      <div className="p-4 flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium border border-[#4A5F8B]"
                        >
                          <i className="fa-solid fa-download mr-2"></i>
                          保存图片
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium"
                        >
                          <i className="fa-solid fa-share-nodes mr-2"></i>
                          分享
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                
                {/* 租赁模态框 */}
                {showRentalModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setShowRentalModal(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden max-w-md w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-[#4A5F8B] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">器材租赁</h3>
                        <button
                          className="text-[#B8C6D8] hover:text-[#F5F7FA]"
                          onClick={() => setShowRentalModal(false)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-3">选择租赁时长</h4>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setRentalDuration('daily')}
                              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                rentalDuration === 'daily' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                              }`}
                            >
                              按天
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setRentalDuration('weekly')}
                              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                rentalDuration === 'weekly' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                              }`}
                            >
                              按周
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setRentalDuration('monthly')}
                              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                rentalDuration === 'monthly' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                              }`}
                            >
                              按月
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-3">租赁总价</h4>
                          <div className="bg-[#1E2532] p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#B8C6D8]">
                                {rentalDuration === 'daily' ? '日租金' : rentalDuration === 'weekly' ? '周租金' : '月租金'}
                              </span>
                              <span className="text-xl font-bold text-[#4A5F8B]">
                                ¥{rentalDuration === 'daily' 
                                  ? Math.round(equipmentPrice * 0.02) 
                                  : rentalDuration === 'weekly' 
                                  ? Math.round(equipmentPrice * 0.1) 
                                  : Math.round(equipmentPrice * 0.3)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6 text-sm text-[#B8C6D8]">
                          <p>需缴纳押金（设备价值的30%），归还后全额退还</p>
                          <p className="font-medium mt-1">押金金额：¥{Math.round(equipmentPrice * 0.3)}</p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                        >
                          确认租赁
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </>
        ) : (
          // 对比模式
          <div className="mb-8">
            {/* 返回按钮 */}
            <button
              onClick={() => setIsComparisonMode(false)}
              className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors mb-6"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>返回器材列表</span>
            </button>
            
            {/* 对比标题 */}
            <h2 className="text-2xl font-bold text-[#F5F7FA] mb-6">器材对比</h2>
            
            {/* 对比表格 */}
            <div className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#2D3748] border-b border-[#4A5F8B]">
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">参数</th>
                      {comparisonData.map((item, index) => (
                        <th key={index} className="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleCompareItem(item.id)}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-[#2D3748] text-[#4A5F8B] mr-2 text-xs"
                              title="移除对比"
                            >
                              <i className="fa-solid fa-times"></i>
                            </button>
                            <div>
                              <p className="font-bold text-[#F5F7FA]">{item.name}</p>
                              <p className="text-xs text-[#B8C6D8]">{item.brand}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 器材图片 */}
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">外观</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className="px-6 py-4 text-[#F5F7FA]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-16 object-cover rounded border border-[#4A5F8B]"
                          />
                        </td>
                      ))}
                    </tr>
                    
                    {/* 价格 */}
                    <tr className="border-b border-[#4A5F8B]">
                     <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">价格</td>
                      {comparisonData.map((item, index) => {
                        const isLowestPrice = comparisonData.length > 1 && 
                          item.price === Math.min(...comparisonData.map(i => parseInt(i.price))).toString();
                        return (
                          <td key={index} className={`px-6 py-4 text-sm ${
                            isLowestPrice
                              ? 'bg-[#4A5F8B] font-medium text-[#F5F7FA]'
                              : 'text-[#F5F7FA]'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>¥{parseInt(item.price).toLocaleString()}</span>
                              {isLowestPrice && (
                                <span className="text-xs px-2 py-0.5 bg-[#F5F7FA] text-[#4A5F8B] rounded-full">
                                  最低价
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 主要规格 */}
                    {(comparisonData[0].specs && Object.keys(comparisonData[0].specs).length > 0) && (
                      <>
                        {Object.entries(comparisonData[0].specs).map(([key, _], rowIndex) => (
                          <tr key={rowIndex} className="border-b border-[#4A5F8B]">
                            <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">
                              {key === 'sensor' ? '传感器' : 
                               key === 'processor' ? '处理器' :
                               key === 'iso' ? 'ISO范围' :
                               key === 'autofocus' ? '自动对焦' :
                               key === 'video' ? '视频规格' :
                               key === 'battery' ? '电池' :
                               key === 'weight' ? '重量' :
                               key === 'focalLength' ? '焦距' :
                               key === 'aperture' ? '光圈' :
                               key === 'mount' ? '卡口' :
                               key === 'construction' ? '镜片结构' :
                               key === 'filterSize' ? '滤镜尺寸' :
                               key === 'minFocusDistance' ? '最近对焦距离' :
                               key === 'material' ? '材质' :
                               key === 'maximumHeight' ? '最大高度' :
                               key === 'minimumHeight' ? '最小高度' :
                               key === 'loadCapacity' ? '承重' :
                               key === 'sections' ? '节数' :
                               key === 'power' ? '功率' :
                               key === 'recyclingTime' ? '回电时间' :
                               key === 'compatibility' ? '兼容性' :
                               key}
                            </td>
                            {comparisonData.map((item, index) => (
                              <td key={index} className="px-6 py-4 text-sm text-[#F5F7FA]">
                                {item.specs && item.specs[key as keyof typeof item.specs]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    )}
                    
                    {/* 优缺点 */}
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">优点</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className="px-6 py-4 text-sm text-[#F5F7FA]">
                          <ul className="list-disc pl-5 space-y-1">
                            {item.pros.slice(0, 3).map((pro, i) => (
                              <li key={i}>{pro}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">缺点</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className="px-6 py-4 text-sm text-[#F5F7FA]">
                          <ul className="list-disc pl-5 space-y-1">
                            {item.cons.slice(0, 3).map((con, i) => (
                              <li key={i}>{con}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    
                    {/* 适用场景 */}
                    <tr className="border-b border-[#4A5F8B]">
                      <td className="px-6 py-4 text-sm text-[#F5F7FA] font-medium">适用场景</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className="px-6 py-4 text-sm text-[#F5F7FA]">
                          <div className="flex flex-wrap gap-1">
                            {item.suitableFor.map((scenario, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                              >
                                {scenario}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 性能对比雷达图 */}
            {comparisonData.length > 0 && (
              <div className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-6 mb-8">
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">性能对比</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid stroke="#4A5F8B" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#B8C6D8', fontSize: 12 }} />
                      {comparisonData.map((item, index) => (
                        <Radar
                          key={index}
                          name={item.name}
                          dataKey={`item${index + 1}`}
                          stroke={COLORS[index % COLORS.length]}
                          fill={COLORS[index % COLORS.length]}
                          fillOpacity={0.3}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 space-x-6">
                  {comparisonData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="text-sm text-[#F5F7FA]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 推荐购买链接 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-4">
                  <h4 className="text-md font-medium text-[#F5F7FA] mb-3">{item.name}</h4>
                  <p className="text-lg font-bold text-[#F5F7FA] mb-4">¥{parseInt(item.price).toLocaleString()}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedEquipment(item)}
                      className="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
                    >
                      查看详情
                    </button>
                    <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                      立即购买
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      
       {/* AI推荐模态框 */}
      {showAISuggestionModal && (
        <AISuggestionModal
          isOpen={showAISuggestionModal}
          onClose={() => {
            setShowAISuggestionModal(false);
            setAiPrompt('');
            setAiRecommendations([]);
            setAiConversation([]);
          }}
          prompt={aiPrompt}
          setPrompt={setAiPrompt}
          onSubmitPrompt={handleAISuggestionRequest}
          recommendations={aiRecommendations}
          isLoading={isAiLoading}
          setSelectedEquipment={setSelectedEquipment}
          aiConversation={aiConversation}
        />
      )}
    </div>
  );
};

export default EquipmentDatabase;