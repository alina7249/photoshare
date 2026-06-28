import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore, AIRole } from '../../store/chatStore';
import { toast } from 'sonner';

export const InputArea: React.FC = () => {
  const { theme } = useAuthStore();
  const { 
    currentChatId, 
    addMessage, 
    isFileUploading, 
    uploadingProgress, 
    setFileUploadProgress, 
    setIsFileUploading, 
    selectedRole, 
    setSelectedRole, 
    availableRoles,
    setIsTyping
  } = useChatStore();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    const validTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('仅支持TXT、PDF和常见图片格式');
      return;
    }
    
    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过10MB');
      return;
    }
    
    // 设置上传状态
    setIsFileUploading(true);
    setIsUploading(true);
    setFileUploadProgress(0);
    
    // 模拟文件上传进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setFileUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // 模拟AI回复
        setTimeout(() => {
          if (currentChatId) {
            // 添加用户上传文件的消息
            addMessage(currentChatId, {
              content: `已上传文件: ${file.name}`,
              sender: 'user'
            });
            
            // 模拟AI处理后的回复
            setIsTyping(true);
            setTimeout(() => {
              addMessage(currentChatId, {
                content: `我已经分析了您上传的文件 ${file.name}。这是一份关于摄影技巧的文档，主要包含了曝光三要素、构图技巧和后期处理的基础知识。请问您对哪部分内容有特别的疑问？`,
                sender: 'ai'
              });
              setIsFileUploading(false);
              setIsUploading(false);
              setIsTyping(false);
            }, 1000);
          }
        }, 500);
      }
    }, 150);
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 处理发送消息
  const handleSendMessage = () => {
    if (!message.trim() || !currentChatId) return;
    
    // 添加用户消息
    const userMessage = addMessage(currentChatId, {
      content: message.trim(),
      sender: 'user'
    });
    
    // 清空输入框
    setMessage('');
    
    // 模拟AI回复 - 设置打字状态
    setIsTyping(true);
    
    // 模拟AI回复
    setTimeout(() => {
      let aiResponse = '';
      const lowerMessage = message.toLowerCase();
      
      // 根据当前选中的角色生成对应专业领域的回复
      if (selectedRole) {
        switch (selectedRole.id) {
          case 'photography-expert': // 摄影专家
            if (lowerMessage.includes('曝光') || lowerMessage.includes('光圈') || lowerMessage.includes('快门') || lowerMessage.includes('iso')) {
              aiResponse = `曝光三要素是摄影的基础：\n\n**1. 光圈**：控制进光量和景深\n   - 大光圈(f/1.4-f/2.8)：进光量大，景深浅，适合人像、微距\n   - 小光圈(f/8-f/16)：进光量小，景深深，适合风光、建筑\n\n**2. 快门速度**：控制曝光时间和动态模糊\n   - 高速快门(1/500s以上)：凝固运动，适合体育、野生动物\n   - 低速快门(1/30s以下)：创造模糊效果，适合流水、光轨\n\n**3. ISO**：控制传感器对光线的敏感度\n   - 低ISO(100-400)：画质细腻，适合光线充足的场景\n   - 高ISO(1600以上)：噪点增加，但适合暗光环境\n\n这三者需要相互平衡，才能获得正确的曝光。`;
            } else if (lowerMessage.includes('构图')) {
              aiResponse = `摄影构图是创作优秀作品的关键，以下是几种常用的构图技巧：\n\n1. **三分法**：将画面分为九宫格，将主体放在交叉点上\n2. **引导线**：利用线条（如道路、河流）引导观众视线到主体\n3. **框架构图**：利用前景元素（如门窗、树枝）创建框架\n4. **对比构图**：通过大小、颜色、明暗的对比突出主体\n5. **对称构图**：创造平衡、稳定的视觉效果\n\n构图没有固定规则，关键是要表达您的创意和主题。`;
            } else {
              aiResponse = `作为摄影专家，我可以为您提供以下方面的帮助：\n\n- 摄影基础理论知识（曝光、对焦、白平衡等）\n- 各类题材拍摄技巧（风光、人像、纪实、微距等）\n- 光线控制与运用技巧\n- 色彩理论与搭配建议\n- 创意拍摄思路与构图指导\n\n您有什么具体的摄影技术问题需要我解答吗？`;
            }
            break;
            
          case 'equipment-advisor': // 器材顾问
            if (lowerMessage.includes('相机') || lowerMessage.includes('镜头')) {
              aiResponse = `关于相机和镜头的选择，我建议您考虑以下几个方面：\n\n1. **预算范围**：确定您的预算，这将决定可选择的相机和镜头档次\n2. **拍摄题材**：\n   - 风光摄影：建议选择广角镜头，如16-35mm\n   - 人像摄影：建议选择中长焦镜头，如85mm\n   - 野生动物：建议选择超长焦镜头，如200-500mm\n3. **品牌生态**：考虑未来可能的扩展需求，选择一个完整的品牌生态系统\n\n您主要拍摄什么类型的照片？我可以给出更具体的建议。`;
            } else if (lowerMessage.includes('三脚架') || lowerMessage.includes('滤镜') || lowerMessage.includes('配件')) {
              aiResponse = `摄影配件是提升拍摄体验的重要工具：\n\n**三脚架**：\n- 碳纤维材质轻便但价格较高，适合户外拍摄\n- 铝合金材质稳定但较重，适合室内或固定位置拍摄\n- 建议选择承重超过您设备总重量1.5倍的三脚架\n\n**滤镜**：\n- UV镜：保护镜头，轻度防尘防刮\n- CPL镜：消除反光，增强色彩饱和度\n- ND镜：减少进光量，适合慢门拍摄\n- GND镜：平衡明暗对比，适合风光摄影\n\n您目前使用什么相机系统？我可以为您推荐更匹配的配件。`;
            } else {
              aiResponse = `作为器材顾问，我可以为您提供以下方面的专业建议：\n\n- 相机和镜头的选择与推荐\n- 各类摄影配件的使用技巧\n- 器材参数解读与性能对比\n- 相机系统生态分析\n- 器材保养与维护指南\n\n您在器材选择或使用上有什么具体问题吗？`;
            }
            break;
            
          case 'copywriter': // 文案专家
            if (lowerMessage.includes('标题') || lowerMessage.includes('描述')) {
              aiResponse = `为摄影作品创作吸引人的标题和描述，需要抓住作品的核心情感和视觉特点：\n\n**标题创作技巧**：\n1. **简洁有力**：用简短的文字传达作品的核心\n2. **引发共鸣**：使用能唤起情感的词汇\n3. **制造悬念**：激发观众的好奇心\n4. **加入细节**：突出作品的独特之处\n\n**描述撰写要点**：\n- 分享拍摄背景和故事\n- 描述技术细节和创作思路\n- 使用生动的语言描绘画面\n- 表达作品想要传达的情感或观点\n\n您可以分享一下您的作品主题或上传一张样图，我可以帮您创作具体的文案。`;
            } else if (lowerMessage.includes('社交媒体') || lowerMessage.includes('instagram') || lowerMessage.includes('朋友圈')) {
              aiResponse = `在不同社交媒体平台发布摄影作品，需要针对性地调整文案风格：\n\n**Instagram**：\n- 简洁有力的标题+emoji表情\n- 使用相关热门标签（如#摄影 #风光 #人像）\n- 简短的描述，重点突出视觉亮点\n\n**朋友圈**：\n- 更口语化的表达\n- 分享拍摄背后的故事或感悟\n- 可以加入一些互动性问题\n\n**专业摄影平台**：\n- 详细的技术参数和创作思路\n- 专业术语的准确使用\n- 深入的艺术表达分析\n\n您主要在哪些平台分享作品？我可以为您提供更具体的建议。`;
            } else {
              aiResponse = `作为文案专家，我可以为您提供以下方面的帮助：\n\n- 摄影作品标题创作\n- 图片描述文案优化\n- 社交媒体发布策略\n- 品牌故事撰写\n- 文案风格定位与调整\n\n您需要为哪类摄影作品创作文案呢？可以告诉我作品的主题或风格。`;
            }
            break;
            
          case 'photo-editor': // 后期编辑
            if (lowerMessage.includes('后期') || lowerMessage.includes('修图') || lowerMessage.includes('lightroom') || lowerMessage.includes('photoshop')) {
              aiResponse = `照片后期处理是提升作品质量的重要环节，以下是一些基础技巧：\n\n**Lightroom常用工作流**：\n1. **导入与整理**：添加关键字和标签\n2. **基础调整**：曝光、对比度、高光、阴影\n3. **色彩校正**：白平衡、色温、色调\n4. **细节增强**：清晰度、锐化、降噪\n5. **局部调整**：渐变滤镜、径向滤镜、调整画笔\n\n**Photoshop高级技巧**：\n- 图层与蒙版的灵活运用\n- 曲线调整与色彩分级\n- 频率分离磨皮\n- 景深合成与曝光合成\n\n您主要使用什么后期软件？或者您对哪方面的后期技巧特别感兴趣？`;
            } else if (lowerMessage.includes('调色') || lowerMessage.includes('预设')) {
              aiResponse = `色彩调整是照片后期的灵魂，以下是几种常见的调色风格和技巧：\n\n**电影色调**：\n- 降低整体饱和度\n- 调整色阶，增加暗部细节\n- 高光偏暖，阴影偏冷\n- 轻微增加对比度\n\n**胶片风格**：\n- 轻微降低对比度\n- 调整色彩平衡，高光偏青，阴影偏品红\n- 添加颗粒感\n- 高光区域轻微过曝\n\n**日系小清新**：\n- 提高曝光，降低对比度\n- 色温偏冷，色调偏绿\n- 增加阴影亮度\n- 降低饱和度，保持色彩清新\n\n您喜欢哪种风格？我可以为您提供更具体的调色参数。`;
            } else {
              aiResponse = `作为后期编辑专家，我可以为您提供以下方面的指导：\n\n- Lightroom和Photoshop使用技巧\n- 各类风格调色教程\n- 后期工作流优化\n- 批量处理方法\n- 图像质量优化与修复\n\n您在后期处理中遇到了什么具体问题？或者您想学习哪方面的后期技巧？`;
            }
            break;
            
          default:
            aiResponse = `感谢您的提问！我是您的智能摄影助手，我可以帮助您解决各种摄影相关的问题。请问您有什么具体的摄影问题需要帮助？`;
        }
      }
      
      // 模拟打字延迟后发送回复
      setTimeout(() => {
        addMessage(currentChatId, {
          content: aiResponse,
          sender: 'ai'
        });
        setIsTyping(false);
      }, 500);
    }, 1000);
  };
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理AI角色选择
  const handleRoleSelect = (role: AIRole) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
    toast.info(`已切换到 ${role.name}`);
  };
  
  // 处理清空对话
  const handleClearChat = () => {
    if (window.confirm('确定要清空当前对话吗？')) {
      useChatStore.getState().clearCurrentChat();
      toast.success('对话已清空');
    }
  };
  
  // 处理导出对话
  const handleExportChat = () => {
    toast.info('导出对话功能已触发');
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setIsRoleDropdownOpen(false);
        setIsOptionsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="space-y-4">
      {/* 文件上传进度条 */}
      {isFileUploading && (
        <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'}`}>
          <div 
            className={`h-1.5 ${theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-blue-500'}`} 
            style={{ width: `${uploadingProgress}%` }}
          />
          <div className="flex justify-between items-center p-2 text-xs">
            <span className={`${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'}`}>上传文件中...</span>
            <span className={`${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'}`}>{uploadingProgress}%</span>
          </div>
        </div>
      )}
      
      {/* 输入框区域 */}
      <div className={`rounded-xl p-3 flex items-end space-x-2 ${
        theme === 'dark' ? 'bg-[#1E2532] border border-[#4A5F8B]' : 'bg-gray-100'
      } shadow-sm`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.pdf,.jpg,.jpeg,.png,.gif"
          className="hidden"
        />
        
        {/* 工具栏 - 左侧图标 */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`p-2 rounded-lg transition-colors ${
              isUploading
                ? theme === 'dark' 
                  ? 'text-[#4A5F8B] cursor-not-allowed' 
                  : 'text-gray-400 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' 
                  : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="上传文件（TXT/PDF/图片）"
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>
          
          <button
            disabled={isUploading || !message.trim()}
            className={`p-2 rounded-lg transition-colors ${
              isUploading || !message.trim()
                ? theme === 'dark' 
                  ? 'text-[#4A5F8B] cursor-not-allowed' 
                  : 'text-gray-400 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' 
                  : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="格式化"
          >
            <i className="fa-solid fa-paint-brush"></i>
          </button>
        </div>
        
        {/* 文本输入框 */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题，按Enter发送，Shift+Enter换行..."
          className={`flex-1 p-2 bg-transparent resize-none focus:outline-none ${
            theme === 'dark' ? 'text-white placeholder:text-[#6B7C93]' : 'text-gray-800 placeholder:text-gray-500'
          }`}
          rows={1}
          disabled={isUploading}
        />
        
        {/* 更多选项 */}
        <div className="relative">
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            disabled={isUploading}
            className={`p-2 rounded-lg transition-colors ${
              isUploading
                ? theme === 'dark' 
                  ? 'text-[#4A5F8B] cursor-not-allowed' 
                  : 'text-gray-400 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' 
                  : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="更多选项"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          
          {isOptionsOpen && (
            <div className={`absolute right-0 bottom-full mb-2 w-48 rounded-lg shadow-xl z-20 ${
              theme === 'dark' ? 'bg-[#2D3748] border border-[#4A5F8B]' : 'bg-white border border-gray-200'
            }`}>
              <div className="py-1">
                <button
                  onClick={handleClearChat}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-trash-can mr-2"></i>清空对话
                </button>
                <button
                  onClick={handleExportChat}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-file-export mr-2"></i>导出对话
                </button>
                <div className="border-t border-dashed my-1 border-gray-300 dark:border-[#4A5F8B]"></div>
                <button
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-question-circle mr-2"></i>使用帮助
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* AI角色选择下拉菜单 */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            disabled={isUploading}
            className={`p-2 rounded-lg transition-colors flex items-center space-x-1 ${
              isUploading
                ? theme === 'dark' 
                  ? 'text-[#4A5F8B] cursor-not-allowed' 
                  : 'text-gray-400 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' 
                  : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="选择AI角色"
          >
            <span className="text-xs hidden sm:inline">
              {selectedRole?.name || '选择角色'}
            </span>
            <i className="fa-solid fa-chevron-down text-xs"></i>
          </button>
          
          {isRoleDropdownOpen && (
            <div className={`absolute right-0 bottom-full mb-2 w-64 rounded-lg shadow-xl z-20 ${
              theme === 'dark' ? 'bg-[#2D3748] border border-[#4A5F8B]' : 'bg-white border border-gray-200'
            }`}>
              <div className="p-3 border-b border-gray-200 dark:border-[#4A5F8B]">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>选择AI助手</h4>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'}`}>
                  不同角色提供不同专业领域的回答
                </p>
              </div>
              <div className="py-2 max-h-60 overflow-y-auto">
                {availableRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center ${
                      selectedRole?.id === role.id
                        ? theme === 'dark' 
                          ? 'bg-[#4A5F8B]/30 text-white' 
                          : 'bg-blue-50 text-blue-700'
                        : theme === 'dark' 
                          ? 'hover:bg-[#4A5F8B]/10 text-[#B8C6D8]' 
                          : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img 
                        src={role.avatar} 
                        alt={role.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{role.name}</p>
                      <p className={`text-xs truncate mt-0.5 ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>
                        {role.description}
                      </p>
                    </div>
                    {selectedRole?.id === role.id && (
                      <i className="fa-solid fa-check ml-2 text-sm"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 发送按钮 */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isUploading}
          className={`p-2.5 rounded-full transition-colors shadow-sm ${
            !message.trim() || isUploading
              ? theme === 'dark' 
                ? 'bg-[#4A5F8B] text-[#6B7C93] cursor-not-allowed' 
                : 'bg-blue-300 text-blue-100 cursor-not-allowed'
              : theme === 'dark'? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93] shadow-[0_2px_10px_rgba(74,95,139,0.3)]' 
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-[0_2px_10px_rgba(59,130,246,0.3)]'
          }`}
          title="发送消息"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      
      {/* 使用提示 */}
      <div className="text-xs text-center">
        <span className={theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}>
          提示：您可以咨询摄影技术、器材选择、后期处理等问题 | 支持拖拽文件上传
        </span>
      </div>
    </div>
  );
};