import React, { useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore, Message } from '../../store/chatStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// 文本清理函数，用于防止XSS攻击
const sanitizeText = (text: string): string => {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
};

// 增强的Markdown解析函数
const parseMarkdown = (text: string): string => {
  // 转义特殊字符
  let parsedText = sanitizeText(text);
  
  // 处理标题
  parsedText = parsedText.replace(/^### (.*$)/gm, '<h3 class="font-bold text-lg my-3">$1</h3>');
  parsedText = parsedText.replace(/^## (.*$)/gm, '<h2 class="font-bold text-xl my-4">$1</h2>');
  parsedText = parsedText.replace(/^# (.*$)/gm, '<h1 class="font-bold text-2xl my-5">$1</h1>');
  
  // 处理加粗
  parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  parsedText = parsedText.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // 处理斜体
  parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  parsedText = parsedText.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // 处理代码
  parsedText = parsedText.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-[#4A5F8B] px-1 py-0.5 rounded text-sm">$1</code>');
  
  // 处理代码块
  parsedText = parsedText.replace(/```([^\n]*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-[#4A5F8B] p-4 rounded-lg overflow-x-auto text-sm my-3"><code>$2</code></pre>');
  
  // 处理有序列表
  parsedText = parsedText.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  parsedText = parsedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-decimal list-inside ml-2">$&</ul>');
  parsedText = parsedText.replace(/<\/ul>\s*<ul class="list-decimal list-inside ml-2">/g, '');
  
  // 处理无序列表
  parsedText = parsedText.replace(/^\- (.*$)/gm, '<li>$1</li>');
  parsedText = parsedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc list-inside ml-2">$&</ul>');
  parsedText = parsedText.replace(/<\/ul>\s*<ul class="list-disc list-inside ml-2">/g, '');
  
  // 处理引用块
  parsedText = parsedText.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-3 italic my-3">$1</blockquote>');
  
  // 处理链接
  parsedText = parsedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-600">$1</a>');
  
  // 处理换行
  parsedText = parsedText.replace(/\n/g, '<br>');
  
  return parsedText;
};

export const MessageList: React.FC = () => {
  const { theme } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentChatId, chatHistories, toggleMessageFavorite, isTyping } = useChatStore();
  
  // 获取当前对话的消息
  const messages = React.useMemo(() => {
    if (!currentChatId) return [];
    const currentChat = chatHistories.find(chat => chat.id === currentChatId);
    return currentChat?.messages || [];
  }, [currentChatId, chatHistories]);
  
  // 优化的自动滚动到底部功能
  useEffect(() => {
    // 强制布局更新后再滚动，确保新消息已经渲染完成
    setTimeout(() => {
      if (messagesEndRef.current) {
        // 使用block: 'nearest'确保即使手动滚动后新消息出现也会滚动到底部
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 100);
  }, [messages, isTyping]);
  
  // 复制消息内容
  const handleCopyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        toast.success('消息已复制到剪贴板');
      })
      .catch(err => {
        toast.error('复制失败，请重试');
        console.error('复制失败:', err);
      });
  };
  
  // 引用消息
  const handleQuoteMessage = (message: Message) => {
    // 在实际应用中，这里会将引用内容添加到输入框
    toast.info('引用功能已触发');
  };
  
   // 分享消息
  const handleShareMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('消息内容已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };
  
  // 渲染消息内容
  const renderMessageContent = (message: Message) => {
    if (message.sender === 'ai') {
      return (
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
        />
      );
    }
    return <p>{message.content}</p>;
  };
  
  // 如果没有消息，显示欢迎信息
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-100'}`}
        >
          <i className={`fa-solid fa-robot text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}></i>
        </motion.div>
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            欢迎使用AI助手
          </h3>
          <p className={`max-w-md ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'}`}>
            我是您的智能摄影助手，有什么摄影相关的问题都可以问我。我可以提供器材建议、技术指导、后期处理技巧等。
        </p>
        
        {/* 快速问题建议 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            "推荐适合初学者的相机",
            "如何拍摄星空照片",
            "摄影构图技巧",
            "后期修图推荐"
          ].map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-sm rounded-full ${
                theme === 'dark' 
                  ? 'bg-[#4A5F8B]/20 text-[#B8C6D8] hover:bg-[#4A5F8B]/40' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              onClick={() => {
                // 在实际应用中，这里会将问题添加到输入框并发送
                toast.info(`已选择问题: ${question}`);
              }}
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      {messages.map((message, index) => (
        <motion.div 
          key={message.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {/* 用户头像 */}
          {message.sender !== 'user' && (
            <div className={`w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1`}>
              <img 
                src={useChatStore.getState().selectedRole?.avatar} 
                alt="AI Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div 
            className={`max-w-[80%] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 ${
              message.sender === 'user'
                ? theme === 'dark' 
                  ? 'bg-[#4A5F8B] text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-[#1E2532] text-[#F5F7FA] border border-[#4A5F8B]'
                  : 'bg-gray-50 text-gray-800 border border-gray-200'
            }`}
          >
            {/* 消息内容 */}
            {renderMessageContent(message)}
            
            {/* 消息时间戳 */}
            <div className={`mt-2 flex justify-between items-center`}>
              <span className={`text-xs opacity-70 ${
                theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {/* 消息操作按钮组 */}
              <div className="flex space-x-1">
                {/* 收藏按钮 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full text-xs ${
                    theme === 'dark' 
                      ? message.isFavorite 
                        ? 'text-yellow-400' 
                        : 'hover:bg-[#6B7C93] text-[#B8C6D8]' 
                      : message.isFavorite 
                        ? 'text-yellow-500' 
                        : 'hover:bg-gray-300 text-gray-600'
                  }`}
                  onClick={() => toggleMessageFavorite(currentChatId!, message.id)}
                  title={message.isFavorite ? '取消收藏' : '收藏'}
                >
                  <i className={`fa-solid ${message.isFavorite ? 'fa-star' : 'fa-star'}`}></i>
                </motion.button>
                
                {/* 复制按钮 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full text-xs ${
                    theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'
                  }`}
                  onClick={() => handleCopyMessage(message)}
                  title="复制"
                >
                  <i className="fa-solid fa-copy"></i>
                </motion.button>
                
                {/* 引用按钮 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full text-xs ${
                    theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'
                  }`}
                  onClick={() => handleQuoteMessage(message)}
                  title="引用"
                >
                  <i className="fa-solid fa-quote-right"></i>
                </motion.button>
                
                {/* 分享按钮 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full text-xs ${
                    theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'
                  }`}
                  onClick={() => handleShareMessage(message)}
                  title="分享"
                >
                  <i className="fa-solid fa-share-nodes"></i>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* AI正在输入指示器 */}
      {isTyping && (
        <div className="flex justify-start">
          <div className={`w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1`}>
            <img 
              src={useChatStore.getState().selectedRole?.avatar} 
              alt="AI Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`p-4 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-[#1E2532] text-[#F5F7FA] border border-[#4A5F8B]' 
              : 'bg-gray-50 text-gray-800 border border-gray-200'
          }`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce [animation-delay:-0.3s]`}></div>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce [animation-delay:-0.15s]`}></div>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'} animate-bounce`}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* 确保这个元素始终在最底部并获得焦点 */}
      <div 
        ref={messagesEndRef} 
        className="scroll-mt-16" // 添加足够的margin确保滚动到视图时不会被输入框遮挡
      />
    </div>
  );
};