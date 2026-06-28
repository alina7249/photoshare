import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import EquipmentDatabase from './EquipmentDatabase';
import EquipmentReview from './EquipmentReview';
import EquipmentTrade from './EquipmentTrade';
import EquipmentLibrary from './EquipmentLibrary';

const tabs = [
  { id: 'database', name: '器材库', icon: 'fa-database' },
  { id: 'review', name: '专业测评', icon: 'fa-star' },
  { id: 'trade', name: '二手交易', icon: 'fa-shopping-cart' },
  { id: 'library', name: '资料库', icon: 'fa-book-open' },
];

const EquipmentHub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('database');

  // 根据URL路径设置当前Tab
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tabId = pathParts[2] || 'database';
    
    if (tabs.some(tab => tab.id === tabId)) {
      setActiveTab(tabId);
    } else {
      setActiveTab('database');
    }
  }, [location.pathname]);

  // 切换Tab时更新URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'database') {
      navigate('/equipment');
    } else {
      navigate(`/equipment/${tabId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E2532]">
      {/* Tab 导航 */}
      <div className="bg-[#2D3748] border-b border-[#4A5F8B] sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-[#4A5F8B] text-[#F5F7FA]'
                      : 'border-transparent text-[#B8C6D8] hover:text-[#F5F7FA]'
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} mr-2`}></i>
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'database' && <EquipmentDatabase />}
          {activeTab === 'review' && <EquipmentReview />}
          {activeTab === 'trade' && <EquipmentTrade />}
          {activeTab === 'library' && <EquipmentLibrary />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EquipmentHub;