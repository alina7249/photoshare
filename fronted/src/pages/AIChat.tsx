import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { HistoryPanel } from '../components/chat/HistoryPanel';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useChatStore } from '../store/chatStore';
import { useAIChat } from '../composables/useAIChat';
import { motion } from 'framer-motion';

export default function AIChat() {
  const { theme } = useAuthStore();
  const { isHistoryPanelOpen, toggleHistoryPanel, createNewChat } = useChatStore();
  const { actions } = useAIChat();
  
  // 初始化时创建一个默认对话
  useEffect(() => {
    actions.initChat();
  }, []);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-deep' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6"
        >
          {/* 历史记录面板 - 增加响应式设计 */}
          <div className="hidden md:block w-80 lg:w-96 flex-shrink-0">
            <HistoryPanel />
          </div>
          
          {/* 主聊天界面 */}
          <div className="flex-1">
            <ChatInterface />
          </div>
        </motion.div>
      </div>
    </div>
  );
}