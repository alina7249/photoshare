import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

// 性能数据类型定义
interface PerformanceData {
  category: string;
  current: number;
  [key: string]: any; // 支持动态添加对比器材的数据字段
}

// 对比器材类型定义
interface CompareEquipment {
  id: string;
  name: string;
  performance: Record<string, number>;
}

// 组件Props类型定义
interface EquipmentComparisonChartProps {
  equipmentName: string;
  performance: Record<string, number>;
  darkMode?: boolean;
}

// 使用React.memo优化组件渲染性能
export const EquipmentComparisonChart: React.FC<EquipmentComparisonChartProps> = React.memo(({ 
  equipmentName, 
  performance,
  darkMode = true
}) => {
  // 状态管理
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [is3DMode, setIs3DMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [compareEquipmentList, setCompareEquipmentList] = useState<CompareEquipment[]>([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentPerformance, setNewEquipmentPerformance] = useState<Record<string, number>>({});
  const chartRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 翻译性能类别名称
  const translateCategory = (category: string): string => {
    const translations: {[key: string]: string} = {
      resolution: '分辨率',
      lowLight: '弱光性能',
      autofocus: '自动对焦',
      battery: '电池续航',
      speed: '连拍速度',
      sharpness: '锐度',
      bokeh: '虚化效果',
      buildQuality: '做工质量',
      versatility: '多功能性',
      valueForMoney: '性价比',
      stability: '稳定性',
      portability: '便携性',
    };
    
    return translations[category] || category;
  };
  
  // 计算综合评分
  const overallScore = useMemo(() => {
    const scores = Object.values(performance);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }, [performance]);
  
  // 筛选性能类别
  const filteredCategories = useMemo(() => {
    if (!filterKeyword.trim()) {
      return Object.entries(performance);
    }
    const keyword = filterKeyword.toLowerCase();
    return Object.entries(performance).filter(([key, _]) => 
      translateCategory(key).toLowerCase().includes(keyword)
    );
  }, [performance, filterKeyword]);
  
  // 转换性能数据为图表格式
  const chartData = useMemo(() => {
    const data: PerformanceData[] = filteredCategories.map(([key, value]) => ({
      category: translateCategory(key),
      current: value
    }));
    
    // 添加对比器材的数据
    compareEquipmentList.forEach((eq, index) => {
      data.forEach(item => {
        const originalKey = Object.entries(performance).find(([k, _]) => translateCategory(k) === item.category)?.[0];
        if (originalKey) {
          item[`compare${index + 1}`] = eq.performance[originalKey] || 0;
        }
      });
    });
    
    return data;
  }, [filteredCategories, compareEquipmentList, performance]);
  
  // 计算核心优势
  const coreStrengths = useMemo(() => {
    return Object.entries(performance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({
        key,
        value,
        evaluation: value >= 9.5 ? '卓越，业内顶尖水平' : 
                   value >= 9 ? '优秀，远超同类产品' : 
                   value >= 8.5 ? '良好，高于平均水平' : ''
      }));
  }, [performance]);
  
  // 计算待提升方面
  const areasForImprovement = useMemo(() => {
    return Object.entries(performance)
      .sort(([,a], [,b]) => a - b)
      .filter(([,value]) => value < 8)
      .slice(0, 2)
      .map(([key, value]) => ({
        key,
        value,
        evaluation: value >= 7 ? '基本满足需求，仍有提升空间' : 
                   value >= 6 ? '表现一般，可能影响特定使用场景' : 
                   '相对较弱，建议根据使用需求考虑'
      }));
  }, [performance]);
  
  // 生成适用场景建议
  const usageScenarios = useMemo(() => {
    const strengths = Object.entries(performance)
      .filter(([,value]) => value >= 9)
      .map(([key]) => translateCategory(key));
    
    if (strengths.length === 0) return '一般日常拍摄场景';
    
    let scenarios = '';
    if (strengths.includes('分辨率') || strengths.includes('锐度')) scenarios += '风光摄影、商业摄影、';
    if (strengths.includes('弱光性能')) scenarios += '夜景拍摄、室内人像、';
    if (strengths.includes('自动对焦') || strengths.includes('速度')) scenarios += '运动摄影、野生动物拍摄、';
    if (strengths.includes('虚化效果')) scenarios += '人像摄影、';
    if (strengths.includes('电池续航')) scenarios += '户外长时间拍摄、';
    
    return scenarios.replace(/、$/, '') || '各种摄影创作';
  }, [performance]);
  
  // 图表颜色配置
  const COLORS = ['#4A5F8B', '#8884d8', '#6B7C93', '#4CAF50'];
  
  // 图表高度（响应式）
  const chartHeight = useMemo(() => {
    return window.innerWidth <= 768 ? 300 : 400;
  }, []);
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 窗口大小变化时会触发组件重新渲染，因为chartHeight是依赖于window.innerWidth的useMemo值
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 初始化新器材性能数据
  useEffect(() => {
    // 当打开添加模态框时，初始化新器材性能数据与主器材相同
    if (showAddModal) {
      setNewEquipmentName('');
      setNewEquipmentPerformance({});
    }
  }, [showAddModal, performance]);
  
  // 添加对比器材
  const handleAddCompareEquipment = () => {
    if (!newEquipmentName.trim()) {
      toast.warning('请输入器材名称');
      return;
    }
    
    if (compareEquipmentList.length >= 3) {
      toast.warning('最多支持添加3个对比器材');
      return;
    }
    
    // 创建新的对比器材数据，使用用户输入的性能值或默认值
    const newEquipment: CompareEquipment = {
      id: `compare-${Date.now()}`,
      name: newEquipmentName.trim(),
      performance: Object.fromEntries(
        Object.entries(performance).map(([key, value]) => [
          key,
          newEquipmentPerformance[key] || value
        ])
      )
    };
    
    setCompareEquipmentList([...compareEquipmentList, newEquipment]);
    setShowAddModal(false);
    toast.success('已添加对比器材');
  };
  
  // 删除对比器材
  const handleRemoveCompareEquipment = (id: string) => {
    setCompareEquipmentList(compareEquipmentList.filter(eq => eq.id !== id));
    toast.success('已移除对比器材');
  };
  
  // 处理新器材性能值变化
  const handleNewEquipmentPerformanceChange = (key: string, value: number) => {
    setNewEquipmentPerformance(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 切换图表类型
  const handleChartTypeChange = (type: 'radar' | 'bar') => {
    setChartType(type);
  };
  
  // 切换3D模式
  const handleToggle3DMode = () => {
    setIs3DMode(!is3DMode);
  };
  
  // 导出图表
  const handleExportChart = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: darkMode ? '#2D3748' : '#F5F7FA',
        scale: 2 // 提高导出图片质量
      });
      
      const imageDataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `器材性能对比图_${equipmentName}.png`;
      link.href = imageDataURL;
      link.click();
      toast.success('图表导出成功');
    } catch (error) {
      console.error('导出图表失败:', error);
      toast.error('导出图表失败，请重试');
    }
  };
  
  // 获取主题样式
  const getThemeStyles = () => {
    if (darkMode) {
      return {
        container: "bg-[#2D3748] border-[#4A5F8B]",
        text: "text-[#B8C6D8]",
        primaryText: "text-[#F5F7FA]",
        secondaryText: "text-[#6B7C93]",
        button: "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]",
        buttonSecondary: "bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]",
        input: "bg-[#1E2532] border-[#4A5F8B] text-[#F5F7FA] placeholder:text-[#6B7C93]",
        chartContainer: "bg-[#1E2532] border-[#4A5F8B]",
        highlight: "text-[#4A5F8B]"
      };
    }
    
    return {
      container: "bg-[#F5F7FA] border-[#B8C6D8]",
      text: "text-[#4A5059]",
      primaryText: "text-[#4A5059]",
      secondaryText: "text-[#6B7C93]",
      button: "bg-[#4A5F8B] text-white hover:bg-[#6B7C93]",
      buttonSecondary: "bg-white text-[#4A5F8B] hover:bg-[#E6EBF2]",
      input: "bg-white border-[#B8C6D8] text-[#4A5059] placeholder:text-[#6B7C93]",
      chartContainer: "bg-white border-[#B8C6D8]",
      highlight: "text-[#4A5F8B]"
    };
  };
  
  const theme = getThemeStyles();
  
  // 渲染图表
  const renderChart = () => {
    const chartContainerClass = `rounded-lg p-4 ${theme.chartContainer} ${is3DMode ? 'perspective-1000 transform-style-3d transition-all duration-500' : ''} hover:rotate-x-5 hover:rotate-y-5`;
    
    return (
      <div ref={chartRef} className={chartContainerClass}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          {chartType === 'radar' ? (
            <RadarChart outerRadius={chartHeight * 0.35} data={chartData}>
              <PolarGrid stroke={darkMode ? "#4A5F8B" : "#B8C6D8"} />
              <PolarAngleAxis dataKey="category" tick={{ fill: darkMode ? "#B8C6D8" : "#4A5F8B", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: darkMode ? "#B8C6D8" : "#4A5F8B" }} />
              
              <Radar
                name={equipmentName}
                dataKey="current"
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              
              {compareEquipmentList.map((eq, index) => (
                <Radar
                  key={eq.id}
                  name={eq.name}
                  dataKey={`compare${index + 1}`}
                  stroke={COLORS[index + 1]}
                  fill={COLORS[index + 1]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              
              <Legend />
              <Tooltip />
            </RadarChart>
          ) : (
            <BarChart data={chartData} barGap={0} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4A5F8B" : "#B8C6D8"} />
              <XAxis 
                dataKey="category" 
                tick={{ fill: darkMode ? "#B8C6D8" : "#4A5F8B", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis domain={[0, 10]} tick={{ fill: darkMode ? "#B8C6D8" : "#4A5F8B" }} />
              
              <Bar 
                name={equipmentName}
                dataKey="current"
                fill={COLORS[0]}
                radius={[4, 4, 0, 0]}
                className={is3DMode ? "hover:translate-z-5 transition-transform duration-300" : ""}
              />
              
              {compareEquipmentList.map((eq, index) => (
                <Bar 
                  key={eq.id}
                  name={eq.name}
                  dataKey={`compare${index + 1}`}
                  fill={COLORS[index + 1]}
                  radius={[4, 4, 0, 0]}
                  className={is3DMode ? "hover:translate-z-5 transition-transform duration-300" : ""}
                />
              ))}
              
              <Legend />
              <Tooltip />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };
  
  // 渲染添加对比器材模态框
  const renderAddModal = () => {
    return (
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl ${theme.container} rounded-lg p-6`}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <h3 className={`text-xl font-bold ${theme.primaryText} mb-4`}>添加对比器材</h3>
              
              <div className="mb-4">
                <label className={`block ${theme.text} mb-2`}>器材名称</label>
                <input
                  type="text"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                  placeholder="请输入器材名称"
                  className={`w-full px-4 py-2 rounded-lg ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]`}
                />
              </div>
              
              <div className="mb-4">
                <label className={`block ${theme.text} mb-2`}>性能评分</label>
                <div className="space-y-4">
                  {Object.entries(performance).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className={theme.text}>{translateCategory(key)}</span>
                        <span className={`${theme.highlight} font-medium`}>
                          {newEquipmentPerformance[key] || value}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={newEquipmentPerformance[key] || value}
                        onChange={(e) => handleNewEquipmentPerformanceChange(key, parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none bg-[#1E2532] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} transition-colors`}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddCompareEquipment}
                  className={`px-4 py-2 rounded-lg ${theme.button} transition-colors`}
                >
                  添加
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // 渲染对比器材标签
  const renderCompareTags = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {compareEquipmentList.map((eq) => (
          <div key={eq.id} className={`inline-flex items-center px-3 py-1 rounded-full ${theme.buttonSecondary} text-sm`}>
            <span>{eq.name}</span>
            <button
              onClick={() => handleRemoveCompareEquipment(eq.id)}
              className="ml-2 text-[#F56565] hover:text-[#E53E3E]"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`mt-6 p-4 rounded-lg border ${theme.container}`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h3 className={`text-lg font-semibold ${theme.primaryText}`}>性能分析</h3>
        
        <div className="flex flex-wrap gap-2">
          {/* 图表类型切换 */}
          <div className="flex border rounded-lg overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChartTypeChange('radar')}
              className={`px-3 py-1.5 text-sm ${
                chartType === 'radar' 
                  ? theme.button 
                  : theme.buttonSecondary
              } transition-colors`}
            >
              雷达图
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChartTypeChange('bar')}
              className={`px-3 py-1.5 text-sm ${
                chartType === 'bar' 
                  ? theme.button 
                  : theme.buttonSecondary
              } transition-colors`}
            >
              柱状图
            </motion.button>
          </div>
          
          {/* 3D效果开关 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleToggle3DMode}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
              is3DMode 
                ? theme.button 
                : theme.buttonSecondary
            } transition-colors`}
          >
            <i className="fa-solid fa-cube"></i>
            {is3DMode ? '关闭3D' : '开启3D'}
          </motion.button>
          
          {/* 添加对比器材 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            disabled={compareEquipmentList.length >= 3}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
              compareEquipmentList.length >= 3
                ? 'opacity-50 cursor-not-allowed' 
                : theme.button
            } transition-colors`}
          >
            <i className="fa-solid fa-plus"></i>
            添加对比
          </motion.button>
          
          {/* 导出图表 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportChart}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${theme.button} transition-colors`}
          >
            <i className="fa-solid fa-download"></i>
            导出图表
          </motion.button>
        </div>
      </div>
      
      {/* 对比器材标签 */}
      {compareEquipmentList.length > 0 && renderCompareTags()}
      
      {/* 类别筛选 */}
      <div className="mb-4 mt-3">
        <div className="relative">
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="搜索性能类别..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]`}
          />
          <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
        </div>
      </div>
      
      {/* 图表区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderChart()}
      </motion.div>
      
      {/* 性能分析 */}
      <div className="mt-6">
        <h4 className={`text-sm font-medium ${theme.primaryText} mb-3`}>性能优势分析</h4>
        
        {/* 综合评分 */}
        <div className="mb-4">
          <p className={theme.text}>
            综合性能评分为 <span className={`font-semibold ${theme.highlight}`}>{overallScore.toFixed(1)}/10</span>，
            {overallScore >= 9 ? '处于行业领先水平' : 
             overallScore >= 8 ? '表现优秀' : 
             overallScore >= 7 ? '表现良好' : '表现一般'}。
          </p>
        </div>
        
        {/* 核心优势 */}
        <div className="mb-4">
          <h5 className={`text-xs uppercase tracking-wider ${theme.secondaryText} mb-2`}>核心优势</h5>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {coreStrengths.map((item, index) => (
              <li key={index} className={theme.text}>
                {translateCategory(item.key)} - {item.value}/10（{item.evaluation}）
              </li>
            ))}
          </ul>
        </div>
        
        {/* 待提升方面 */}
        <div className="mb-4">
          <h5 className={`text-xs uppercase tracking-wider ${theme.secondaryText} mb-2`}>待提升方面</h5>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {areasForImprovement.length > 0 ? (
              areasForImprovement.map((item, index) => (
                <li key={index} className={theme.text}>
                  {translateCategory(item.key)} - {item.value}/10（{item.evaluation}）
                </li>
              ))
            ) : (
              <li className={theme.text}>各方面性能表现均衡，无明显短板</li>
            )}
          </ul>
        </div>
        
        {/* 使用场景建议 */}
        <div className={`pt-3 border-t ${darkMode ? 'border-[#4A5F8B]' : 'border-[#B8C6D8]'}`}>
          <h5 className={`text-xs uppercase tracking-wider ${theme.secondaryText} mb-2`}>适用场景建议</h5>
          <p className={theme.text}>
            根据性能分析，该器材特别适合{usageScenarios}。
          </p>
        </div>
      </div>
      
      {/* 添加对比器材模态框 */}
      {renderAddModal()}
    </div>
  );
});

// 设置组件的displayName便于调试
EquipmentComparisonChart.displayName = 'EquipmentComparisonChart';