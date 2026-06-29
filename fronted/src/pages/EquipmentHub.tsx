import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter } from '../router/useRouter';
import EquipmentDatabase from './EquipmentDatabase';
import EquipmentReview from './EquipmentReview';
import EquipmentTrade from './EquipmentTrade';
import EquipmentLibrary from './EquipmentLibrary';
import { useEquipmentHub, EQUIPMENT_TABS } from '../composables/useEquipmentHub';

const EquipmentHub: React.FC = () => {
  const router = useRouter();
  const { initState, actions } = useEquipmentHub();
  const [activeTab, setActiveTab] = useState(initState.activeTab);

  // 根据URL路径设置当前Tab
  useEffect(() => {
    const tabId = actions.getTabFromPath(router.currentPath);
    setActiveTab(tabId);
  }, [router.currentPath]);

  // 切换Tab时更新URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(actions.getTabNavigationPath(tabId));
  };

  return (
    <div className="min-h-screen bg-deep">
      {/* Tab 导航 */}
      <div className="bg-card border-b border-accent sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              {EQUIPMENT_TABS.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-accent text-text-primary'
                      : 'border-transparent text-text-muted hover:text-text-primary'
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