import { buildCozeImageUrl } from '../constants/api';
import { HOVER_SHADOWS } from '../constants/theme';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { useToast } from '../composables/useToast';
import { apiGet } from '../services/api';
import { ROUTES } from '../router/routes';

// 器材接口定义
interface Equipment {
  id: string;
  name: string;
  type: 'camera' | 'lens' | 'tripod' | 'flash' | 'other';
  brand: string;
  model: string;
  purchaseDate: string;
  condition: 'new' | 'like-new' | 'good' | 'used';
  image: string;
  serialNumber?: string;
  notes?: string;
  isPublic: boolean;
}

const EquipmentLibrary: React.FC = () => {
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();
  const [selectedType, setSelectedType] = useState('all'); // all, camera, lens, tripod, flash, other
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, name, brand
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    type: 'camera',
    brand: '',
    model: '',
    purchaseDate: '',
    condition: 'new',
    isPublic: false
  });
  
  // 初始化器材列表
  const [loading, setLoading] = useState(true);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const data = await apiGet<Equipment[]>('/equipment/library');
        setEquipmentList(data || []);
      } catch (error) {
        console.error('Failed to load equipment:', error);
        toast.error('器材数据加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);
  
  // 获取所有品牌
  const getAllBrands = () => {
    const brands = ['all'];
    equipmentList.forEach(item => {
      if (!brands.includes(item.brand)) {
        brands.push(item.brand);
      }
    });
    return brands;
  };
  
  // 过滤器材
  const getFilteredEquipment = () => {
    let equipment = [...equipmentList];
    
    // 按类型过滤
    if (selectedType !== 'all') {
      equipment = equipment.filter(item => item.type === selectedType);
    }
    
    // 按品牌过滤
    if (selectedBrand !== 'all') {
      equipment = equipment.filter(item => item.brand === selectedBrand);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      equipment = equipment.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.brand.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term)
      );
    }
    
    // 排序
    if (sortBy === 'recent') {
      equipment.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    } else if (sortBy === 'name') {
      equipment.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'brand') {
      equipment.sort((a, b) => a.brand.localeCompare(b.brand));
    }
    
    return equipment;
  };
  
  const filteredEquipment = getFilteredEquipment();
  const allBrands = getAllBrands();
  
  // 添加新器材
  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.brand || !newEquipment.model || !newEquipment.purchaseDate) {
      toast.warning('请填写必要的器材信息');
      return;
    }
    
    const equipmentToAdd: Equipment = {
      id: `eq-${Date.now()}`,
      name: newEquipment.name,
      type: newEquipment.type as 'camera' | 'lens' | 'tripod' | 'flash' | 'other',
      brand: newEquipment.brand,
      model: newEquipment.model,
      purchaseDate: newEquipment.purchaseDate,
      condition: newEquipment.condition as 'new' | 'like-new' | 'good' | 'used',
      image: buildCozeImageUrl('camera equipment placeholder', '3b459504fe868e742ae48b1a1488be95', 'square'),
      serialNumber: newEquipment.serialNumber,
      notes: newEquipment.notes,
      isPublic: newEquipment.isPublic || false
    };
    
    setEquipmentList([equipmentToAdd, ...equipmentList]);
    setIsAddingNew(false);
    setNewEquipment({
      name: '',
      type: 'camera',
      brand: '',
      model: '',
      purchaseDate: '',
      condition: 'new',
      isPublic: false
    });
    toast.success('器材添加成功');
  };
  
  // 删除器材
  const handleDeleteEquipment = (id: string) => {
    if (window.confirm('确定要删除这个器材吗？')) {
      setEquipmentList(equipmentList.filter(item => item.id !== id));
      toast.success('器材删除成功');
    }
  };
  
  // 切换公开状态
  const togglePublicStatus = (id: string) => {
    setEquipmentList(equipmentList.map(item => 
      item.id === id ? { ...item, isPublic: !item.isPublic } : item
    ));
    toast.success('器材状态更新成功');
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">请先登录</h2>
          <p className="text-text-muted mb-6 max-w-md">登录后管理您的摄影器材，记录购买信息和使用情况</p>
          <Link to={ROUTES.LOGIN} className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors">
            立即登录
          </Link>
        </div>
      </div>
    );
  }
  
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
            to={ROUTES.PROFILE_CENTER}
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">我的器材库</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            记录和管理您的摄影器材，查看他人常用器材，分享使用心得
          </p>
        </div>
        
        {/* 添加新器材按钮 - 浅蓝灰 #4A5F8B + 浅白 #F5F7FA */}
        <div className="mb-8 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors inline-flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            {isAddingNew ? '取消添加' : '添加新器材'}
          </motion.button>
        </div>
        
        {/* 添加新器材表单 */}
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8"
          >
            <h3 className="text-lg font-bold text-text-primary mb-6">添加新器材</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">器材名称</label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  placeholder="例如：索尼 A7R IV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">器材类型</label>
                <select
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="camera">相机</option>
                  <option value="lens">镜头</option>
                  <option value="tripod">三脚架</option>
                  <option value="flash">闪光灯</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">品牌</label>
                <input
                  type="text"
                  value={newEquipment.brand}
                  onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  placeholder="例如：Sony"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">型号</label>
                <input
                  type="text"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  placeholder="例如：A7R IV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">购买日期</label>
                <input
                  type="date"
                  value={newEquipment.purchaseDate}
                  onChange={(e) => setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">成色</label>
                <select
                  value={newEquipment.condition}
                  onChange={(e) => setNewEquipment({ ...newEquipment, condition: e.target.value as any })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="new">全新</option>
                  <option value="like-new">几乎全新</option>
                  <option value="good">良好</option>
                  <option value="used">使用过</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-1">序列号（选填）</label>
                <input
                  type="text"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  placeholder="输入器材序列号"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-1">备注（选填）</label>
                <textarea
                  value={newEquipment.notes}
                  onChange={(e) => setNewEquipment({ ...newEquipment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none placeholder:text-text-muted"
                  placeholder="输入器材相关备注信息"
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={newEquipment.isPublic}
                  onChange={(e) => setNewEquipment({ ...newEquipment, isPublic: e.target.checked })}
                  className="w-4 h-4 bg-card border-accent text-accent rounded focus:ring-accent"
                />
                <label htmlFor="is-public" className="ml-2 text-text-muted">
                  设为公开，允许其他用户查看
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEquipment}
                className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                保存器材
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* 搜索和筛选 */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索器材名称、品牌或型号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部类型</option>
                <option value="camera">相机</option>
                <option value="lens">镜头</option>
                <option value="tripod">三脚架</option>
                <option value="flash">闪光灯</option>
                <option value="other">其他</option>
              </select>
              
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                {allBrands.map(brand => (
                  <option key={brand} value={brand}>{brand === 'all' ? '全部品牌' : brand}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                <option value="recent">最新添加</option>
                <option value="name">按名称排序</option>
                <option value="brand">按品牌排序</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-text-muted">加载器材数据中...</p>
            </div>
          </div>
        )}

        {/* 器材列表 */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((equipment) => (
            <motion.div
              key={equipment.id}
              whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
              className="bg-card rounded-xl overflow-hidden border border-accent transition-all shadow-sm"
            >
              {/* 器材图片 */}
              <div className="relative">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-48 object-cover"
                />
                {/* 类型标签 */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-accent/80 text-text-primary text-xs rounded-full">
                    {equipment.type === 'camera' ? '相机' : 
                     equipment.type === 'lens' ? '镜头' : 
                     equipment.type === 'tripod' ? '三脚架' : 
                     equipment.type === 'flash' ? '闪光灯' : '其他'}
                  </span>
                </div>
                {/* 公开状态标签 */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    equipment.isPublic 
                      ? 'bg-accent/80 text-text-primary' 
                      : 'bg-accent-hover/80 text-text-primary'
                  } flex items-center`}>
                    <i className={`fa-solid mr-1 ${equipment.isPublic ? 'fa-globe' : 'fa-lock'}`}></i>
                    {equipment.isPublic ? '公开' : '私密'}
                  </span>
                </div>
              </div>
              
              {/* 器材信息 */}
              <div className="p-5">
                {/* 器材名称和品牌 */}
                <h3 className="text-lg font-bold text-text-primary mb-1">{equipment.name}</h3>
                <p className="text-sm text-text-muted mb-3">{equipment.brand} {equipment.model}</p>
                
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-text-muted">购买日期</p>
                    <p className="text-text-primary">{equipment.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">成色</p>
                    <p className="text-text-primary">
                      {equipment.condition === 'new' ? '全新' : 
                       equipment.condition === 'like-new' ? '几乎全新' : 
                       equipment.condition === 'good' ? '良好' : '使用过'}
                    </p>
                  </div>
                </div>
                
                {/* 备注 */}
                {equipment.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-text-muted mb-1">备注</p>
                    <p className="text-xs text-text-primary">{equipment.notes}</p>
                  </div>
                )}
                
                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => togglePublicStatus(equipment.id)}
                    className="flex-1 py-2 text-center bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors text-sm border border-accent"
                  >
                    <i className={`fa-solid mr-1 ${equipment.isPublic ? 'fa-lock' : 'fa-globe'}`}></i>
                    {equipment.isPublic ? '设为私密' : '设为公开'}
                  </button>
                  <button 
                    onClick={() => handleDeleteEquipment(equipment.id)}
                    className="px-3 py-2 text-center bg-card text-text-muted rounded-lg font-medium hover:bg-accent-hover hover:text-text-primary transition-colors text-sm border border-accent"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
        
        {!loading && filteredEquipment.length === 0 && (
          <div className="p-8 bg-card rounded-xl border border-accent text-center mt-8">
            <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
              <i className="fa-solid fa-video text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">暂无器材</h3>
            <p className="text-text-muted mb-6">
              点击"添加新器材"开始记录您的摄影装备
            </p>
            <button 
              onClick={() => setIsAddingNew(true)}
              className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              添加新器材
            </button>
          </div>
        )}
        
        {/* 统计信息 */}
        {equipmentList.length > 0 && (
          <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-6 shadow-sm border border-accent mt-8">
            <h3 className="text-lg font-bold text-text-primary mb-4">器材统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{equipmentList.length}</p>
                <p className="text-sm text-text-primary/80">总器材数</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{equipmentList.filter(item => item.type === 'camera').length}</p>
                <p className="text-sm text-text-primary/80">相机</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{equipmentList.filter(item => item.type === 'lens').length}</p>
                <p className="text-sm text-text-primary/80">镜头</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{equipmentList.filter(item => item.isPublic).length}</p>
                <p className="text-sm text-text-primary/80">公开器材</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">{new Set(equipmentList.map(item => item.brand)).size}</p>
                <p className="text-sm text-text-primary/80">品牌数</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EquipmentLibrary;