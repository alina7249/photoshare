import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';

export const ChatInterface: React.FC = () => {
  const { theme } = useAuthStore();
  const { currentChatId, createNewChat, isTyping } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // 如果没有当前对话，创建一个新对话
  useEffect(() => {
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId, createNewChat]);
  
  // 监听消息变化，确保在切换对话时也能正确滚动到底部
  useEffect(() => {
    // 添加短暂延迟确保DOM已更新
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, 100);
  }, [currentChatId]);
  
  // 获取当前对话信息
  const currentChat = useChatStore(state => 
    state.chatHistories.find(chat => chat.id === state.currentChatId)
  );
  
  // 获取当前选中的AI角色
  const selectedRole = useChatStore(state => state.selectedRole);
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col h-[calc(100vh-160px)] ${theme === 'dark' ? 'bg-[#2D3748]' : 'bg-white'} rounded-xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'}`}
    >
      {/* 聊天头部 - 增强版 */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
        <div className="flex items-center space-x-3">
          {/* AI角色头像 */}
          {selectedRole && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
              <img 
                src={selectedRole.avatar} 
                alt={selectedRole.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {selectedRole?.name || '智能摄影助手'}
            </h2>
            <div className="flex items-center">
              <span className={`inline-flex items-center text-xs ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'}`}>
                {isTyping ? (
                  <div className="flex items-center">
                    <span className="mr-1">正在输入...</span>
                    <div className="flex space-x-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce [animation-delay:-0.3s]`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce [animation-delay:-0.15s]`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce`}></div>
                    </div>
                  </div>
                ) : (
                  '为您解答摄影相关问题，提供专业建议'
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'}`}
            title="新建对话"
            onClick={createNewChat}
          >
            <i className="fa-solid fa-plus"></i>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'}`}
            title="清空对话"
            onClick={useChatStore.getState().clearCurrentChat}
          >
            <i className="fa-solid fa-trash-can"></i>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'}`}
            title="更多选项"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </motion.button>
        </div>
      </div>
      
      {/* 消息列表区域 - 增强滚动体验 */}
      <div 
        ref={messageListRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-100"
        style={{ 
          // 确保滚动容器平滑滚动
          scrollBehavior: 'smooth',
          // 防止内容不足时出现不必要的滚动条
          minHeight: 0 
        }}
      >
        <MessageList />
      </div>
      
      {/* 输入区域 - 固定在底部 */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'} z-10`}>
        <InputArea />
      </div>
    </motion.div>
  );
};