import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { HistoryPanel } from '../components/chat/HistoryPanel';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useChatStore } from '../store/chatStore';
import { motion } from 'framer-motion';

export default function AIChat() {
  const { theme } = useAuthStore();
  const { isHistoryPanelOpen, toggleHistoryPanel, createNewChat } = useChatStore();
  
  // 初始化时创建一个默认对话
  useEffect(() => {
    const { chatHistories } = useChatStore.getState();
    if (chatHistories.length === 0) {
      createNewChat();
    }
  }, []);
  
  // 为了更好的用户体验，我们可以添加一些模拟对话数据
  useEffect(() => {
    const { chatHistories, addMessage } = useChatStore.getState();
    
    // 只在没有对话历史时添加模拟数据
    if (chatHistories.length === 1 && chatHistories[0].messages.length === 0) {
      const welcomeChatId = chatHistories[0].id;
      
      // 添加一条欢迎消息
      addMessage(welcomeChatId, {
        content: "嗨！我是您的摄影助手，有什么摄影相关的问题都可以问我。我可以帮您选择相机、提供拍摄技巧、解答后期问题等。您想了解哪方面的内容呢？",
        sender: 'ai'
      });
    }
  }, []);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-50'} transition-colors duration-300`}>
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