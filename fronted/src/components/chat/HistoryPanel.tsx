import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const HistoryPanel: React.FC = () => {
  const { theme } = useAuthStore();
  const { 
    chatHistories, 
    currentChatId, 
    setCurrentChat, 
    deleteChat, 
    createNewChat,
    updateChatTitle,
    toggleHistoryPanel
  } = useChatStore();
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chatHistories);
  
  // 过滤对话历史
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chatHistories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chatHistories.filter(chat => 
        chat.title.toLowerCase().includes(query) ||
        chat.messages.some(msg => msg.content.toLowerCase().includes(query))
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chatHistories]);
  
  // 处理编辑对话标题
  const handleEditTitle = (chatId: string, title: string) => {
    setEditingChatId(chatId);
    setEditingTitle(title);
  };
  
  // 保存对话标题
  const handleSaveTitle = (chatId: string) => {
    if (editingTitle.trim()) {
      updateChatTitle(chatId, editingTitle.trim());
      toast.success('标题已更新');
    }
    setEditingChatId(null);
    setEditingTitle('');
  };
  
  // 取消编辑
  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };
  
  // 渲染对话标题
  const renderChatTitle = (chat: any) => {
    if (editingChatId === chat.id) {
      return (
        <div className="flex items-center w-full">
          <input
            type="text"
            value={editingTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                handleSaveTitle(chat.id);
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            className={`flex-1 px-2 py-1 rounded text-sm ${
              theme === 'dark' 
                ? 'bg-[#4A5F8B] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#6B7C93]' 
                : 'bg-gray-200 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
            }`}
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              onClick={() => handleSaveTitle(chat.id)}
              className={`p-1 rounded text-xs ${
                theme === 'dark' ? 'text-white hover:bg-[#6B7C93]' : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button
              onClick={handleCancelEdit}
              className={`p-1 rounded text-xs ${
                theme === 'dark' ? 'text-white hover:bg-[#6B7C93]' : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentChat(chat.id);
        }}
      >
        <span className={`font-medium truncate ${
          currentChatId === chat.id 
            ? theme === 'dark' ? 'text-white' : 'text-gray-800'
            : theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'
        }`}>
          {chat.title}
        </span>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTitle(chat.id, chat.title);
            }}
            className={`p-1 rounded text-xs ${
              theme === 'dark' ? 'text-[#B8C6D8] hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="编辑标题"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('确定要删除这个对话吗？')) {
                deleteChat(chat.id);
                toast.success('对话已删除');
              }
            }}
            className={`p-1 rounded text-xs ${
              theme === 'dark' ? 'text-[#B8C6D8] hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="删除对话"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    );
  };
  
  // 格式化时间
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // 格式化日期
  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return '今天';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return '昨天';
    }
    
    return messageDate.toLocaleDateString();
  };
  
  return (
    <div className={`flex flex-col h-[calc(100vh-160px)] ${theme === 'dark' ? 'bg-[#2D3748]' : 'bg-white'} rounded-xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'}`}>
      {/* 面板头部 */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>对话历史</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={createNewChat}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="新建对话"
        >
          <i className="fa-solid fa-plus"></i>
        </motion.button>
      </div>
      
      {/* 搜索框 */}
      <div className={`p-3 border-b ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'}`}>
        <div className={`relative`}>
          <input
            type="text"
            placeholder="搜索对话历史..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-[#1E2532] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]' 
                : 'bg-gray-100 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
            }`}
          />
          <i className={`fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}></i>
        </div>
      </div>
      
      {/* 对话历史列表 */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-100">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-100'}`}
            >
              {searchQuery.trim() === '' ? (
                <i className={`fa-solid fa-history text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}></i>
              ) : (
                <i className={`fa-solid fa-search text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}></i>
              )}
            </motion.div>
            <p className={`${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'}`}>
              {searchQuery.trim() === '' ? 
                '暂无对话历史，开始您的第一次对话吧！' : 
                `没有找到包含"${searchQuery}"的对话`
              }
            </p>
            {searchQuery.trim() !== '' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery('')}
                className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark' 
                    ? 'bg-[#4A5F8B]/20 text-[#B8C6D8] hover:bg-[#4A5F8B]/40' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                清除搜索
              </motion.button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat, index) => {
              // 检查日期分组
              const isNewDateGroup = index === 0 || 
                formatDate(chat.lastActive) !== formatDate(filteredChats[index - 1].lastActive);
              
              return (
                <React.Fragment key={chat.id}>
                  {isNewDateGroup && (
                    <div className="mt-2 pt-2 border-t border-dashed text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        theme === 'dark' ? 'bg-[#4A5F8B] text-[#B8C6D8]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {formatDate(chat.lastActive)}
                      </span>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={chat.id}
                    className={`p-3 rounded-lg mb-1 cursor-pointer transition-all duration-300 group transform ${
                      currentChatId === chat.id
                        ? theme === 'dark' 
                          ? 'bg-[#4A5F8B]/30 border-l-2 border-[#4A5F8B] translate-x-1' 
                          : 'bg-blue-50 border-l-2 border-blue-500 translate-x-1'
                        : theme === 'dark' 
                          ? 'hover:bg-[#4A5F8B]/10 hover:translate-x-1' 
                          : 'hover:bg-gray-50 hover:translate-x-1'
                    }`}
                    onClick={() => setCurrentChat(chat.id)}
                  >
                    {renderChatTitle(chat)}
                    
                    {/* 最后一条消息预览 */}
                    {chat.messages.length > 0 && (
                      <div className="mt-1 flex items-center justify-between">
                        <p className={`text-xs truncate flex-1 ${
                          theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'
                        }`}>
                          <span className="mr-1">
                            {chat.messages[chat.messages.length - 1].sender === 'user' 
                              ? <i className="fa-solid fa-user text-xs"></i> 
                              : <i className="fa-solid fa-robot text-xs"></i>
                            }
                          </span>
                          {chat.messages[chat.messages.length - 1].content.substring(0, 50)}
                          {chat.messages[chat.messages.length - 1].content.length > 50 ? '...' : ''}
                        </p>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'
                        }`}>
                          {formatTime(chat.lastActive)}
                        </span>
                      </div>
                    )}
                    
                    {/* 收藏标记 */}
                    {chat.messages.some(msg => msg.isFavorite) && (
                      <div className="absolute right-8 top-3">
                        <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                      </div>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      
      {/* 面板底部 */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'}`}>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.confirm('确定要清空所有对话历史吗？此操作不可恢复。')) {
                chatHistories.forEach(chat => deleteChat(chat.id));
                createNewChat();
                toast.success('所有对话已清空');
              }
            }}
            className={`w-full text-sm py-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-trash-can mr-2"></i> 清空所有
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // 在实际应用中，这里会打开设置面板
              toast.info('设置功能已触发');
            }}
            className={`w-full text-sm py-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-cog mr-2"></i> 设置
          </motion.button>
        </div>
      </div>
    </div>
  );
};