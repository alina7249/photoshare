import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { mockCameras, mockLenses, mockAccessories } from "../lib/equipmentData";
import { toast } from "sonner";
import { useAuth } from "../contexts/authContext";
import { useTheme } from "../hooks/useTheme";

// 联系卖家模态框组件
const ContactSellerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  seller: any;
}> = ({
  isOpen,
  onClose,
  seller
}) => {
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  
  // 表单状态
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // 验证状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 消息历史和状态
  const [messageHistory, setMessageHistory] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'seller';
    timestamp: string;
    isRead: boolean;
    files?: {name: string; url: string; type: string}[];
  }>>([]);
  const [isMessageSent, setIsMessageSent] = useState(false);
  
  // 消息模板列表
  const messageTemplates = [
    "请问器材是否还在？",
    "最低能多少出？",
    "支持当面验货吗？",
    "请问什么时候可以交易？",
    "这个价格还能优惠吗？"
  ];

  // 初始化时自动填充当前用户的联系方式
  useEffect(() => {
    if (isAuthenticated && user) {
      // 自动填充用户的联系信息（这里假设用户对象中有联系方式）
      setContactInfo(user.email || '');
      
      // 初始化消息历史记录
      // 这里是模拟数据，实际应该从API获取
      if (seller?.id) {
        setMessageHistory([
          {
            id: '1',
            content: '您好，请问这个器材还在出售吗？',
            sender: 'user',
            timestamp: '2025-12-08 15:30:00',
            isRead: true
          },
          {
            id: '2',
            content: '您好，是的，器材还在出售中。',
            sender: 'seller',
            timestamp: '2025-12-08 16:45:00',
            isRead: true
          },
          {
            id: '3',
            content: '请问最低能多少钱出呢？',
            sender: 'user',
            timestamp: '2025-12-08 17:10:00',
            isRead: true
          },
          {
            id: '4',
            content: '价格可以商量，您能给个心理价位吗？',
            sender: 'seller',
            timestamp: '2025-12-08 18:20:00',
            isRead: false
          }
        ]);
      }
    }
  }, [isAuthenticated, user, seller]);

  if (!isOpen || !seller)
    return null;

  // 选择消息模板
  const selectTemplate = (template: string) => {
    setMessage(template);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!message.trim()) {
      newErrors.message = '请输入消息内容';
    }
    
    if (!contactInfo.trim()) {
      newErrors.contactInfo = '请输入联系方式';
    } else {
      // 简单的邮箱或手机号验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!emailRegex.test(contactInfo) && !phoneRegex.test(contactInfo)) {
        newErrors.contactInfo = '请输入有效的邮箱或手机号';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      // 模拟上传延迟
      setTimeout(() => {
        const newFiles = Array.from(e.target.files);
        // 限制最多上传3个文件
        const allowedFiles = [...uploadedFiles, ...newFiles].slice(0, 3);
        setUploadedFiles(allowedFiles);
        
        if (newFiles.length > 3 - uploadedFiles.length) {
          toast.warning(`最多只能上传3个文件，已自动截取前${3 - uploadedFiles.length}个`);
        }
        
        setIsUploading(false);
      }, 1500);
    }
  };

  // 移除上传的文件
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  // 提交表单
  const handleSubmit = () => {
    if (validateForm()) {
      // 模拟发送消息
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user' as const,
        timestamp: new Date().toLocaleString(),
        isRead: false,
        files: uploadedFiles.map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type
        }))
      };
      
      setMessageHistory(prev => [...prev, newMessage]);
      setIsMessageSent(true);
      
      // 清空表单
      setMessage('');
      setUploadedFiles([]);
      
      // 模拟卖家自动回复
      setTimeout(() => {
        const autoReply = {
          id: Date.now().toString() + 'reply',
          content: '您好！我已经收到您的消息，我会尽快回复您的问题。',
          sender: 'seller' as const,
          timestamp: new Date().toLocaleString(),
          isRead: true
        };
        
        setMessageHistory(prev => [...prev, autoReply]);
      }, 2000);
      
      toast.success("消息已发送给卖家，卖家将尽快回复");
      
      // 重置发送状态
      setTimeout(() => {
        setIsMessageSent(false);
      }, 3000);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        exit={{
          opacity: 0,
          scale: 0.9
        }}
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col ${theme === 'dark' ? 'bg-[#2D3748] border-[#4A5F8B]' : 'bg-white border-gray-200'} rounded-xl border shadow-lg`}>
        {/* 模态框头部 */}
        <div
          className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'}`}>
          <h3 className={`font-bold flex items-center ${theme === 'dark' ? 'text-[#F5F7FA]' : 'text-gray-800'}`}>
            <i className="fa-solid fa-comment-dots mr-2"></i>联系卖家
          </h3>
          <button
            className={`${theme === 'dark' ? 'text-[#B8C6D8] hover:text-[#F5F7FA]' : 'text-gray-500 hover:text-gray-800'} transition-colors p-1 rounded-full hover:bg-opacity-10`}
            onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* 卖家信息 */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-[#F5F7FA]' : 'text-gray-800'}`}>{seller.name}</p>
                  {seller.isOfficial && (
                    <span className="px-2 py-1 bg-[#4A5F8B] text-white text-xs rounded-full flex items-center">
                      <i className="fa-solid fa-check-circle mr-1"></i>官方认证
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i}
                        className={`fa-solid fa-star text-xs ${
                          i < Math.floor(seller.rating) 
                            ? 'text-[#4A5F8B]' 
                            : theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>{seller.rating}</span>
                  <span className={`text-xs mx-1 ${theme === 'dark' ? 'text-[#4A5F8B]' : 'text-gray-400'}`}>|</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>{seller.completedTransactions}单</span>
                  <span className={`text-xs mx-1 ${theme === 'dark' ? 'text-[#4A5F8B]' : 'text-gray-400'}`}>|</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>好评率 {seller.positiveRate || 95}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}><i className="fa-solid fa-location-dot mr-1"></i>{seller.location}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}><i className="fa-solid fa-clock mr-1"></i>平均回复 {seller.avgResponseTime || '30分钟'}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}><i className="fa-solid fa-calendar-days mr-1"></i>加入 {new Date(seller.joinDate || '2023-01-01').getFullYear()}年</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 消息历史 */}
          <div className={`flex-1 p-4 space-y-4 overflow-y-auto ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-50'}`}>
            {messageHistory.length > 0 ? (
              messageHistory.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'seller' && (
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover border border-[#4A5F8B] flex-shrink-0 mt-1" />
                  )}
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? `${theme === 'dark' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-blue-500 text-white'} rounded-br-none` 
                        : `${theme === 'dark' ? 'bg-[#2D3748] text-[#F5F7FA]' : 'bg-white text-gray-800 border border-gray-200'} rounded-bl-none`
                    }`}>
                      <p>{msg.content}</p>
                      
                      {/* 显示上传的文件 */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2 justify-start">
                          {msg.files.map((file, index) => (
                            <div key={index} className={`p-2 rounded ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'} flex items-center text-xs`}>
                              <i className={`fa-solid ${file.type.includes('image') ? 'fa-image' : 'fa-file'} mr-1`}></i>
                              <span className="truncate max-w-[120px]">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>
                      {msg.timestamp} {msg.sender === 'user' && msg.isRead && <><i className="fa-solid fa-check-double ml-1 text-green-500"></i> 已读</>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'}`}>
                <i className="fa-solid fa-comment-slash text-4xl mb-2"></i>
                <p>暂无消息记录，开始您的对话吧</p>
              </div>
            )}
            
            {isMessageSent && (
              <div className="text-center animate-pulse">
                <span className={`inline-block px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#2D3748]' : 'bg-gray-100'}`}>
                  消息发送中...
                </span>
              </div>
            )}
          </div>
          
          {/* 表单区域 */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#4A5F8B] bg-[#2D3748]' : 'border-gray-200 bg-white'}`}>
            {/* 消息模板 */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>快速模板</label>
              <div className="flex flex-wrap gap-2">
                {messageTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectTemplate(template)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      theme === 'dark' 
                        ? 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B]/30 border border-[#4A5F8B]' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}>
                    {template}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* 联系方式 */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>联系方式 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={contactInfo}
                onChange={e => {
                  setContactInfo(e.target.value);
                  if (errors.contactInfo) {
                    setErrors(prev => ({...prev, contactInfo: ''}));
                  }
                }}
                placeholder="请输入邮箱或手机号"
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  theme === 'dark' 
                    ? `bg-[#1E2532] border ${errors.contactInfo ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] focus:ring-[#4A5F8B]` 
                    : `bg-white border ${errors.contactInfo ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500`
                }`}
              />
              {errors.contactInfo && (
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#F56565]' : 'text-red-500'}`}>{errors.contactInfo}</p>
              )}
            </div>
            
            {/* 消息输入框 */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>发送消息 <span className="text-red-500">*</span></label>
              <textarea
                value={message}
                onChange={e => {
                  setMessage(e.target.value);
                  if (errors.message) {
                    setErrors(prev => ({...prev, message: ''}));
                  }
                }}
                placeholder="请输入您想咨询的内容..."
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none h-32 ${
                  theme === 'dark' 
                    ? `bg-[#1E2532] border ${errors.message ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] focus:ring-[#4A5F8B]` 
                    : `bg-white border ${errors.message ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500`
                }`}
              ></textarea>
              {errors.message && (
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#F56565]' : 'text-red-500'}`}>{errors.message}</p>
              )}
            </div>
            
            {/* 文件上传区域 */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>上传附件</label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                theme === 'dark' 
                  ? 'border-[#4A5F8B] hover:border-[#6B7C93] hover:bg-[#1E2532]' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <i className={`fa-solid fa-cloud-arrow-up text-2xl mb-2 ${theme === 'dark' ? 'text-[#4A5F8B]' : 'text-gray-500'}`}></i>
                  <p className={`text-sm ${theme === 'dark' ? 'text-[#F5F7FA]' : 'text-gray-800'}`}>点击上传附件或拖拽文件到此处</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>支持 JPG、PNG、PDF、Word 格式，单个文件不超过 10MB，最多上传3个文件</p>
                </label>
              </div>
              
              {/* 已上传文件列表 */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'}`}>
                      <div className="flex items-center">
                        <i className={`fa-solid ${file.type.includes('image') ? 'fa-image' : 'fa-file'} mr-2 ${theme === 'dark' ? 'text-[#4A5F8B]' : 'text-gray-500'}`}></i>
                        <span className={`text-sm truncate max-w-[200px] ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>{file.name}</span>
                        <span className={`text-xs ml-2 ${theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'}`}>
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#F5F7FA]' : 'hover:bg-gray-200 text-gray-700'}`}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {isUploading && (
                <div className="mt-3 flex items-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-700'}`}>上传中...</span>
                </div>
              )}
            </div>
            
            {/* 按钮区域 */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B]' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}>
                取消
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                {isUploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    发送中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    发送消息
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

  // 表单步骤类型
type FormStep = 'basicInfo' | 'details' | 'images' | 'review';

// 发布二手器材表单组件 - 改进版本
const PublishEquipmentForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
      // 表单状态
      const [formData, setFormData] = useState({
          name: "",
          type: "相机",
          brand: "",
          price: "",
          condition: "95新",
          usageTime: "",
          shutterCount: "",
          repairHistory: "",
          description: "",
          accessories: [""],
          images: [] as File[]
      });
      
      // 表单步骤
      const [currentStep, setCurrentStep] = useState<FormStep>('basicInfo');
      
      // 错误状态
      const [errors, setErrors] = useState<Record<string, string>>({});
      
      // 拖拽状态
      const [isDragOver, setIsDragOver] = useState(false);
      
      // 自动保存定时器
      const [autoSaveTimer, setAutoSaveTimer] = useState<number | null>(null);
      
       // 清理定时器
      useEffect(() => {
          return () => {
              if (autoSaveTimer) clearTimeout(autoSaveTimer);
          };
      }, [autoSaveTimer]);
      
      // 加载本地草稿
      useEffect(() => {
          const draft = localStorage.getItem('equipmentDraft');
          if (draft) {
              try {
                  const savedData = JSON.parse(draft);
                  // 只恢复非空的字段
                  setFormData(prev => ({ ...prev, ...savedData }));
              } catch (e) {
                  console.error('Failed to load draft:', e);
              }
          }
      }, []);
      
      // 如果模态框未打开，不渲染组件
      if (!isOpen) return null;
      
      // 表单字段更改处理函数
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // 清除对应字段的错误
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // 设置自动保存
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        const timer = setTimeout(() => {
            localStorage.setItem('equipmentDraft', JSON.stringify(formData));
        }, 1000);
        setAutoSaveTimer(timer);
    };
    
    // 配件更改处理函数
    const handleAccessoryChange = (index: number, value: string) => {
        const newAccessories = [...formData.accessories];
        newAccessories[index] = value;
        setFormData(prev => ({ ...prev, accessories: newAccessories }));
    };
    
    // 添加配件
    const addAccessory = () => {
        setFormData(prev => ({
            ...prev,
            accessories: [...prev.accessories, ""]
        }));
    };
    
    // 删除配件
    const removeAccessory = (index: number) => {
        if (formData.accessories.length > 1) {
            const newAccessories = formData.accessories.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, accessories: newAccessories }));
        }
    };
    
    // 图片更改处理函数
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // 限制最多上传8张图片
            const allowedFiles = newFiles.slice(0, 8 - formData.images.length);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...allowedFiles]
            }));
            
            if (newFiles.length > allowedFiles.length) {
                toast.warning(`最多只能上传8张图片，已自动截取前${allowedFiles.length}张`);
            }
        }
    };
    
    // 拖拽上传处理函数
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
        }
    };
    
    // 删除图片
    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };
    
    // 表单验证
    const validateForm = (step: FormStep): boolean => {
        const newErrors: Record<string, string> = {};
        
        // 基础信息验证
        if (step === 'basicInfo') {
            if (!formData.name.trim()) newErrors.name = '请输入器材名称';
            if (!formData.brand) newErrors.brand = '请选择品牌';
            if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = '请输入有效的价格';
            if (!formData.type) newErrors.type = '请选择器材类型';
            if (!formData.condition) newErrors.condition = '请选择成色';
        }
        
        // 详细信息验证
        if (step === 'details') {
            if (!formData.description.trim()) {
                newErrors.description = '请输入器材描述';
            } else if (formData.description.length < 10) {
                newErrors.description = '描述内容至少10个字符';
            }
        }
        
        // 图片验证
        if (step === 'images' && formData.images.length === 0) {
            newErrors.images = '请至少上传一张图片';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // 进入下一步
    const nextStep = () => {
        if (validateForm(currentStep)) {
            if (currentStep === 'basicInfo') setCurrentStep('details');
            else if (currentStep === 'details') setCurrentStep('images');
            else if (currentStep === 'images') setCurrentStep('review');
        }
    };
    
    // 返回上一步
    const prevStep = () => {
        if (currentStep === 'details') setCurrentStep('basicInfo');
        else if (currentStep === 'images') setCurrentStep('details');
        else if (currentStep === 'review') setCurrentStep('images');
    };
    
    // 表单提交
    const handleSubmit = () => {
        if (validateForm('review')) {
            onSubmit(formData);
            
            // 重置表单
            setFormData({
                name: "",
                type: "相机",
                brand: "",
                price: "",
                condition: "95新",
                usageTime: "",
                shutterCount: "",
                repairHistory: "",
                description: "",
                accessories: [""],
                images: []
            });
            
            // 清除本地草稿
            localStorage.removeItem('equipmentDraft');
            
            // 关闭模态框
            onClose();
        }
    };
    
      // 渲染步骤指示器
    
    // 渲染步骤指示器
    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                {[
                    { id: 'basicInfo', label: '基础信息', icon: 'fa-camera' },
                    { id: 'details', label: '详细描述', icon: 'fa-list-alt' },
                    { id: 'images', label: '上传图片', icon: 'fa-image' },
                    { id: 'review', label: '确认发布', icon: 'fa-check-circle' }
                ].map((step) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    currentStep === step.id || 
                                    (currentStep === 'details' && step.id === 'basicInfo') || 
                                    (currentStep === 'images' && (step.id === 'basicInfo' || step.id === 'details')) ||
                                    (currentStep === 'review' && (step.id === 'basicInfo' || step.id === 'details' || step.id === 'images'))
                                        ? 'bg-[#4A5F8B] text-white'
                                        : 'bg-[#2D3748] text-[#6B7C93] border border-[#4A5F8B]'
                                }`}
                            >
                                <i className={`fa-solid ${step.icon}`}></i>
                            </div>
                            <span 
                                className={`text-xs ${
                                    currentStep === step.id 
                                        ? 'text-[#F5F7FA] font-medium' 
                                        : 'text-[#6B7C93]'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {step.id !== 'review' && (
                            <div className="flex-1 h-1 mx-2 bg-[#2D3748]">
                                <div 
                                    className="h-full bg-[#4A5F8B] transition-all duration-500"
                                    style={{
                                        width: 
                                            currentStep === 'basicInfo' ? '0%' :
                                            currentStep === 'details' ? '33%' :
                                            currentStep === 'images' ? '66%' : '100%'
                                    }}
                                ></div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            {Object.keys(errors).length > 0 && (
                <div className="bg-[#4A1A1A]/30 border border-[#F56565]/50 rounded-lg p-3 text-[#F56565] text-sm mt-4">
                    <i className="fa-solid fa-exclamation-circle mr-1"></i>
                    {Object.values(errors)[0]}
                </div>
            )}
        </div>
    );
    
    // 渲染基础信息步骤
    const renderBasicInfo = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`space-y-1.5 ${errors.name ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                    <label className="block text-sm font-medium">器材名称 *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#1E2532] border ${errors.name ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all`}
                        placeholder="例如：索尼 A7R IV" 
                    />
                    {errors.name && <p className="text-xs mt-1">{errors.name}</p>}
                </div>
                <div className={`space-y-1.5 ${errors.type ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                    <label className="block text-sm font-medium">器材类型 *</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#1E2532] border ${errors.type ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer`}
                    >
                        {equipmentTypes.filter(t => t !== "全部").map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {errors.type && <p className="text-xs mt-1">{errors.type}</p>}
                </div>
                <div className={`space-y-1.5 ${errors.brand ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                    <label className="block text-sm font-medium">品牌 *</label>
                    <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#1E2532] border ${errors.brand ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer`}
                    >
                        <option value="">请选择品牌</option>
                        {brands.filter(b => b !== "全部").map(brand => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                    {errors.brand && <p className="text-xs mt-1">{errors.brand}</p>}
                </div>
                <div className={`space-y-1.5 ${errors.price ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                    <label className="block text-sm font-medium">价格 *</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-[#1E2532] border ${errors.price ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all`}
                            placeholder="请输入价格" 
                            min="0"
                            step="0.01"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]">¥</div>
                    </div>
                    {errors.price && <p className="text-xs mt-1">{errors.price}</p>}
                </div>
                <div className={`space-y-1.5 ${errors.condition ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                    <label className="block text-sm font-medium">成色 *</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#1E2532] border ${errors.condition ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer`}
                    >
                        {conditions.filter(c => c !== "全部").map(condition => <option key={condition} value={condition}>{condition}</option>)}
                    </select>
                    {errors.condition && <p className="text-xs mt-1">{errors.condition}</p>}
                </div>
                <div className="space-y-1.5 text-[#B8C6D8]">
                    <label className="block text-sm font-medium">使用时长</label>
                    <input
                        type="text"
                        name="usageTime"
                        value={formData.usageTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                        placeholder="例如：约1年" 
                    />
                </div>
                <div className="space-y-1.5 text-[#B8C6D8]">
                    <label className="block text-sm font-medium">快门次数（相机）</label>
                    <input
                        type="text"
                        name="shutterCount"
                        value={formData.shutterCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                        placeholder="例如：8500次" 
                    />
                </div>
                <div className="space-y-1.5 text-[#B8C6D8]">
                    <label className="block text-sm font-medium">维修记录</label>
                    <select
                        name="repairHistory"
                        value={formData.repairHistory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                    >
                        <option value="">请选择</option>
                        <option value="无维修记录">无维修记录</option>
                        <option value="官方维修">官方维修</option>
                        <option value="第三方维修">第三方维修</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
    
    // 渲染详细描述步骤
    const renderDetails = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className={`space-y-1.5 ${errors.description ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                <label className="block text-sm font-medium">器材描述 *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#1E2532] border ${errors.description ? 'border-[#F56565]' : 'border-[#4A5F8B]'} text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none min-h-[120px]`}
                    placeholder="请详细描述器材的使用情况、外观状态、购买时间等信息..."
                    rows={5}
                ></textarea>
                {errors.description && <p className="text-xs mt-1">{errors.description}</p>}
                <div className="flex justify-between text-xs text-[#6B7C93]">
                    <span>建议填写10-500字，越详细越容易出售</span>
                    <span>{formData.description.length}/500</span>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-[#B8C6D8]">配件清单</label>
                    <button
                        type="button"
                        onClick={addAccessory}
                        disabled={formData.accessories.length >= 10}
                        className={`text-sm px-3 py-1 rounded-lg ${formData.accessories.length >= 10 ? 'bg-[#2D3748] text-[#6B7C93] cursor-not-allowed' : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'} transition-colors flex items-center`}
                    >
                        <i className="fa-solid fa-plus mr-1"></i>添加配件
                    </button>
                </div>
                <div className="space-y-3">
                    {formData.accessories.map((accessory, index) => (
                        <motion.div 
                            key={index} 
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <input
                                type="text"
                                value={accessory}
                                onChange={e => handleAccessoryChange(index, e.target.value)}
                                className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                                placeholder={`配件 ${index + 1}（例如：原装电池、充电器、相机包等）`} 
                            />
                            <button
                                type="button"
                                onClick={() => removeAccessory(index)}
                                className="ml-2 w-10 h-10 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#F56565] transition-colors flex items-center justify-center"
                                disabled={formData.accessories.length <= 1}
                            >
                                <i className="fa-solid fa-minus"></i>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
    
    // 渲染图片上传步骤
    const renderImages = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className={`space-y-1.5 ${errors.images ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>
                <label className="block text-sm font-medium">上传图片（至少一张）</label>
                <div 
                    className={`border-2 ${errors.images ? 'border-[#F56565]' : 'border-[#4A5F8B]'} ${isDragOver ? 'border-dotted border-[#4A5F8B] bg-[#1E2532]' : 'border-dashed bg-transparent'} rounded-lg p-8 text-center hover:bg-[#1E2532] transition-all cursor-pointer relative overflow-hidden`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        id="image-upload"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*" 
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <motion.div
                            animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-[#4A5F8B] mb-3"></i>
                            <p className="text-sm font-medium text-[#F5F7FA] mb-1">点击或拖拽文件到此处上传</p>
                            <p className="text-xs text-[#6B7C93]">支持 JPG、PNG 格式，单张最大 10MB，最多上传8张</p>
                            <div className="mt-4 inline-block px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors">
                                选择图片
                            </div>
                        </motion.div>
                    </label>
                </div>
                {errors.images && <p className="text-xs mt-1">{errors.images}</p>}
            </div>
            
            {formData.images.length > 0 && (
                <div>
                    <p className="text-sm text-[#6B7C93] mb-3">已上传 {formData.images.length} 张图片</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {formData.images.map((image, index) => (
                            <motion.div 
                                key={index} 
                                className="relative aspect-square rounded-lg overflow-hidden group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`预览 ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="w-8 h-8 rounded-full bg-[#F56565] text-white flex items-center justify-center hover:bg-[#E53E3E] transition-colors"
                                    >
                                        <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                    {(image.size / 1024 / 1024).toFixed(1)}MB
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="bg-[#1E2532] border border-[#4A5F8B] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#F5F7FA] mb-2 flex items-center">
                    <i className="fa-solid fa-circle-info text-[#4A5F8B] mr-2"></i>
                    图片上传小贴士
                </h4>
                <ul className="text-xs text-[#B8C6D8] space-y-1">
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>拍摄多角度清晰图片，包括主体、细节和配件</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>突出显示成色、划痕等重要细节</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>在光线充足的环境下拍摄，避免模糊和反光</span>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
    
    // 渲染确认发布步骤
    const renderReview = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="bg-[#1E2532] rounded-lg p-6 border border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">确认发布信息</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">器材名称</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">器材类型</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.type}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">品牌</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.brand}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">价格</p>
                            <p className="font-medium text-[#F56565]">¥{formData.price}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">成色</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.condition}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">使用时长</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.usageTime || '未填写'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">快门次数</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.shutterCount || '未填写'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7C93] mb-1">维修记录</p>
                            <p className="font-medium text-[#F5F7FA]">{formData.repairHistory || '未填写'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-xs text-[#6B7C93] mb-1">器材描述</p>
                        <p className="font-medium text-[#F5F7FA] whitespace-pre-wrap">{formData.description}</p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-[#6B7C93] mb-1">配件清单</p>
                        <div className="flex flex-wrap gap-2">
                            {formData.accessories.filter(a => a.trim()).map((accessory, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full"
                                >
                                    {accessory}
                                </span>
                            ))}
                            {formData.accessories.filter(a => a.trim()).length === 0 && (
                                <span className="text-xs text-[#6B7C93]">未填写配件</span>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-xs text-[#6B7C93] mb-2">上传图片 ({formData.images.length}张)</p>
                        <div className="flex overflow-x-auto gap-2 pb-2">
                            {formData.images.map((image, index) => (
                                <div key={index} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`图片 ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#1E2532] border border-[#4A5F8B] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#F5F7FA] mb-2 flex items-center">
                    <i className="fa-solid fa-shield-alt text-[#4A5F8B] mr-2"></i>
                    交易保障提示
                </h4>
                <ul className="text-xs text-[#B8C6D8] space-y-1">
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>发布信息将经过平台审核，请确保信息真实准确</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>建议通过平台担保交易，保障资金安全</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-[#48BB78] mr-2 mt-0.5"></i>
                        <span>禁止发布违法违规内容，包括虚假宣传、盗窃物品等</span>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
    
    // 渲染步骤内容
    const renderStepContent = () => {
        switch (currentStep) {
            case 'basicInfo': return renderBasicInfo();
            case 'details': return renderDetails();
            case 'images': return renderImages();
            case 'review': return renderReview();
            default: return null;
        }
    };
    
    // 渲染底部操作按钮
    const renderActions = () => (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#4A5F8B] sticky bottom-0 bg-[#2D3748] z-10">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
            >
                取消
            </button>
            
            <div className="flex space-x-3">
                {currentStep !== 'basicInfo' && (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    >
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        上一步
                    </motion.button>
                )}
                
                {currentStep !== 'review' ? (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center"
                    >
                        下一步
                        <i className="fa-solid fa-arrow-right ml-2"></i>
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-[#48BB78] text-white rounded-lg font-medium hover:bg-[#38A169] transition-colors flex items-center"
                    >
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        发布器材
                    </motion.button>
                )}
            </div>
        </div>
    );
    
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-[#2D3748] z-10 border-b border-[#4A5F8B]">
                    <div className="flex justify-between items-center p-5">
                        <h3 className="font-bold text-[#F5F7FA] flex items-center text-lg">
                            <i className="fa-solid fa-plus-circle mr-2 text-[#4A5F8B]"></i>
                            发布二手器材
                        </h3>
                        <button
                            className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors p-1 rounded-full hover:bg-[#4A5F8B]/20"
                            onClick={onClose}
                            aria-label="关闭"
                        >
                            <i className="fa-solid fa-times text-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    {renderStepIndicator()}
                    {renderStepContent()}
                    {renderActions()}
                </div>
            </motion.div>
        </div>
    );
};



const safeGetEquipment = <T,>(array: T[] | undefined, index: number, defaultValue: T): T => {
    if (!array || array.length <= index || !array[index]) {
        return defaultValue;
    }

    return array[index];
};

const defaultCamera = {
    name: "索尼全画幅相机",
    brand: "Sony",
    price: "12999",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+mirrorless+camera+professional+photography+equipment&sign=5f9e2f27c40853405c8b28ab7e864c75"
};

const defaultLens = {
    name: "佳能标准变焦镜头",
    brand: "Canon",
    price: "14999",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+lens+professional+photography+equipment&sign=90b3d98d08881f8fead46c8ccac54661"
};

const defaultAccessory = {
    name: "捷信碳纤维三脚架",
    brand: "Gitzo",
    price: "8999",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Gitzo+carbon+fiber+tripod+photography+equipment&sign=bff0c0ba5fe556ca67ffb0739e6395c8"
};

const mockUsedEquipment = [{
    id: "ue1",
    name: safeGetEquipment(mockCameras, 6, defaultCamera).name,
    type: "相机",
    brand: safeGetEquipment(mockCameras, 6, defaultCamera).brand,
    price: "8500",
    originalPrice: safeGetEquipment(mockCameras, 6, defaultCamera).price,
    image: safeGetEquipment(mockCameras, 6, defaultCamera).image,
    condition: "95新",
    usageTime: "约1年",
    shutterCount: "8500次",
    repairHistory: "无维修记录",
    accessories: ["原装电池2块", "充电器", "相机包", "说明书"],

    seller: {
        id: "s1",
        name: "摄影爱好者小王",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20smiling%20casual&sign=db92da1c3005295607f7766d7f9263bb",
        location: "上海",
        rating: 4.9,
        completedTransactions: 128
    },

    description: "2022年10月购买，使用非常小心，成色极佳。快门次数仅8500次，无任何磕碰和维修记录。因升级设备故出售，附带全部原装配件。",
    images: Array(4).fill(safeGetEquipment(mockCameras, 6, defaultCamera).image),
    tags: ["索尼", "全画幅", "微单", "二手", "高性价比"]
}, {
    id: "ue2",
    name: safeGetEquipment(mockLenses, 4, defaultLens).name,
    type: "镜头",
    brand: safeGetEquipment(mockLenses, 4, defaultLens).brand,
    price: "7200",
    originalPrice: safeGetEquipment(mockLenses, 4, defaultLens).price,
    image: safeGetEquipment(mockLenses, 4, defaultLens).image,
    condition: "9成新",
    usageTime: "约2年",
    shutterCount: "",
    repairHistory: "无维修记录",
    accessories: ["原装遮光罩", "镜头盖", "镜头袋"],

    seller: {
        id: "s2",
        name: "专业摄影师老李",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20experienced&sign=fe817dce4d08957c62787348c72eb1b7",
        location: "北京",
        rating: 4.8,
        completedTransactions: 256
    },

    description: "经典佳能大三元标准变焦镜头，2021年购买，使用状况良好。镜片无霉无划痕，对焦快速准确。因更换RF卡口系统故出售。",
    images: Array(4).fill(safeGetEquipment(mockLenses, 4, defaultLens).image),
    tags: ["佳能", "大三元", "标准变焦", "二手", "专业"]
}, {
    id: "ue3",
    name: safeGetEquipment(mockCameras, 9, defaultCamera).name,
    type: "相机",
    brand: safeGetEquipment(mockCameras, 9, defaultCamera).brand,
    price: "5800",
    originalPrice: safeGetEquipment(mockCameras, 9, defaultCamera).price,
    image: safeGetEquipment(mockCameras, 9, defaultCamera).image,
    condition: "99新",
    usageTime: "约3个月",
    shutterCount: "2300次",
    repairHistory: "无维修记录",
    accessories: ["原装电池", "充电器", "相机包", "肩带", "说明书"],

    seller: {
        id: "s3",
        name: "新手摄影小张",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20male%20student&sign=a076fa14f7977e902fe333f899d2603c",
        location: "广州",
        rating: 4.7,
        completedTransactions: 32
    },

    description: "2023年7月购买，几乎全新，仅使用过几次。因工作繁忙无暇使用故出售。相机和镜头均无任何瑕疵，配件齐全。",
    images: Array(4).fill(safeGetEquipment(mockCameras, 9, defaultCamera).image),
    tags: ["富士", "APS-C", "复古", "二手", "套机"]
}, {
    id: "ue4",
    name: safeGetEquipment(mockAccessories, 0, defaultAccessory).name,
    type: "配件",
    brand: safeGetEquipment(mockAccessories, 0, defaultAccessory).brand,
    price: "4200",
    originalPrice: safeGetEquipment(mockAccessories, 0, defaultAccessory).price,
    image: safeGetEquipment(mockAccessories, 0, defaultAccessory).image,
    condition: "9成新",
    usageTime: "约1.5年",
    shutterCount: "",
    repairHistory: "无维修记录",
    accessories: ["原装收纳袋", "说明书"],

    seller: {
        id: "s4",
        name: "风光摄影师老王",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67",
        location: "成都",
        rating: 4.9,
        completedTransactions: 187
    },

    description: "2022年3月购买，碳纤维材质，轻巧耐用，承重能力强。使用状况良好，无任何损坏。因升级更大号三脚架故出售。",
    images: Array(4).fill(safeGetEquipment(mockAccessories, 0, defaultAccessory).image),
    tags: ["捷信", "碳纤维", "三脚架", "二手", "专业"]
}];

const mockNewEquipment = [{
    id: "ne1",
    name: safeGetEquipment(mockCameras, 1, defaultCamera).name,
    type: "相机",
    brand: safeGetEquipment(mockCameras, 1, defaultCamera).brand,
    price: safeGetEquipment(mockCameras, 1, defaultCamera).price,
    originalPrice: safeGetEquipment(mockCameras, 1, defaultCamera).price,
    image: safeGetEquipment(mockCameras, 1, defaultCamera).image,

    seller: {
        id: "b1",
        name: "佳能官方授权店",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20official%20store%20logo&sign=50cd433cb1c90a4b4dca5af8ff32317b",
        location: "上海",
        rating: 4.9,
        completedTransactions: 1254,
        isOfficial: true
    },

    description: "佳能EOS R5是一款专业级全画幅微单相机，具备4500万像素，支持8K视频录制和高速连拍。本商品为全新正品，享受官方保修服务。",
    images: Array(4).fill(safeGetEquipment(mockCameras, 1, defaultCamera).image),
    tags: ["佳能", "全画幅", "微单", "全新", "专业"],
    warranty: "官方保修2年"
}, {
    id: "ne2",
    name: safeGetEquipment(mockLenses, 8, defaultLens).name,
    type: "镜头",
    brand: safeGetEquipment(mockLenses, 8, defaultLens).brand,
    price: safeGetEquipment(mockLenses, 8, defaultLens).price,
    originalPrice: safeGetEquipment(mockLenses, 8, defaultLens).price,
    image: safeGetEquipment(mockLenses, 8, defaultLens).image,

    seller: {
        id: "b2",
        name: "尼康官方授权店",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20official%20store%20logo&sign=1cb76f80ef7e58ff4fd8842daa09e778",
        location: "北京",
        rating: 4.8,
        completedTransactions: 987,
        isOfficial: true
    },

    description: "尼康Z卡口70-200mm F2.8 VR S镜头，采用纳米结晶涂层和ED镜片，提供出色的光学性能和防抖效果。全新正品，支持官方保修。",
    images: Array(4).fill(safeGetEquipment(mockLenses, 8, defaultLens).image),
    tags: ["尼康", "大三元", "长焦", "全新", "专业"],
    warranty: "官方保修2年"
}];

const equipmentTypes = ["全部", "相机", "镜头", "配件", "无人机", "三脚架", "滤镜", "闪光灯"];
const priceRanges = ["全部", "0-5000元", "5000-10000元", "10000-20000元", "20000元以上"];
const conditions = ["全部", "99新", "95新", "9成新", "8成新", "7成新及以下"];

const brands = [
    "全部",
    "Sony",
    "Canon",
    "Nikon",
    "Fujifilm",
    "Panasonic",
    "Leica",
    "Sigma",
    "Tamron",
    "DJI"
];

// 器材详情组件
const EquipmentDetail: React.FC = () => {
    const {
        id
    } = useParams();

  const equipment = [...mockUsedEquipment, ...mockNewEquipment].find(item => item.id === id);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTradeProcess, setShowTradeProcess] = useState(false);

  const handleContactSeller = (seller: any) => {
    setSelectedSeller(seller);
    setShowContactModal(true);
  };

  // 图片预览相关函数
  const openImagePreview = (index: number) => {
    setCurrentImageIndex(index);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
  };

  const nextImage = () => {
    if (equipment) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === equipment.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (equipment) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? equipment.images.length - 1 : prevIndex - 1
      );
    }
  };

    if (!equipment) {
        return (
            <div
                className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
                        <i className="fa-solid fa-search text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到该器材</h3>
                    <p className="text-[#B8C6D8] mb-6">请检查器材ID是否正确或返回上一页
                                  </p>
                    <Link
                        to="/equipment-trade"
                        className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">返回交易平台
                                  </Link>
                </div>
            </div>
        );
    }

  // 交易流程步骤
  const tradeSteps = [
    { icon: 'fa-comment-dots', title: '沟通咨询', description: '与卖家沟通器材详情、价格等问题' },
    { icon: 'fa-check-circle', title: '确认细节', description: '确认器材成色、配件、交易方式等细节' },
    { icon: 'fa-credit-card', title: '付款担保', description: '通过平台担保支付，保障资金安全' },
    { icon: 'fa-box-open', title: '验货签收', description: '收到器材后仔细验货，确认无误再签收' },
    { icon: 'fa-handshake', title: '确认成交', description: '确认收货，交易完成，评价卖家' }
  ];

    return (
        <div
            className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
            <div className="mb-6">
                <Link
                    to="/equipment-trade"
                    className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>返回器材交易平台</span>
                </Link>
            </div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}>
                <h1 className="text-3xl font-bold text-[#F5F7FA] mb-6">{equipment.name}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2">
                        <div className="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B]">
                          {/* 主图片，点击可放大 */}
                          <motion.div 
                            className="cursor-pointer relative overflow-hidden rounded-lg"
                            whileHover={{ scale: 1.01 }}
                            onClick={() => openImagePreview(0)}
                          >
                            <img
                                src={equipment.image}
                                alt={equipment.name}
                                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-105" />
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                              <i className="fa-solid fa-expand mr-1"></i> 点击放大
                            </div>
                          </motion.div>
                          
                          {/* 缩略图 */}
                          <div className="mt-4 grid grid-cols-4 gap-2">
                            {equipment.images.map((img, index) => (
                              <motion.div
                                key={index}
                                className="aspect-square rounded overflow-hidden border-2 border-transparent hover:border-[#4A5F8B] transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => openImagePreview(index)}
                              >
                                <img
                                    src={img}
                                    alt={`${equipment.name} 缩略图 ${index + 1}`}
                                    className="w-full h-full object-cover" />
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* 器材详情 */}
                          <div className="mt-6">
                                <h2 className="text-xl font-bold text-[#F5F7FA] mb-3">器材详情</h2>
                                <div className="bg-[#1E2532] p-4 rounded-lg">
                                    <p className="text-[#B8C6D8] whitespace-pre-line">{equipment.description}</p>
                                </div>
                            </div>
                            
                            {/* 成色描述带示意图 */}
                            {equipment.condition && equipment.conditionDescription && (
                              <div className="mt-6">
                                <h2 className="text-xl font-bold text-[#F5F7FA] mb-3">成色描述</h2>
                                <div className="bg-[#1E2532] p-4 rounded-lg">
                                  <div className="flex items-center mb-3">
                                    <div className="w-16 h-16 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                                      <i className="fa-solid fa-camera text-xl"></i>
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-[#F5F7FA]">{equipment.condition}</h3>
                                      <p className="text-sm text-[#B8C6D8]">{equipment.conditionDescription}</p>
                                    </div>
                                  </div>
                                  {/* 成色示意图 */}
                                  <div className="grid grid-cols-5 gap-2 mt-4">
                                    {['全新', '99新', '95新', '9成新', '8成新'].map((level, index) => (
                                      <div 
                                        key={level} 
                                        className={`text-center p-2 rounded-lg transition-colors ${
                                          level === equipment.condition 
                                            ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                                            : 'bg-[#2D3748] text-[#6B7C93] hover:bg-[#4A5F8B]/30'
                                        }`}
                                      >
                                        <p className="text-sm">{level}</p>
                                        {level === equipment.condition && (
                                          <p className="text-xs mt-1">当前</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 技术参数 */}
                            {equipment.type === "相机" && <div className="mt-6">
                                <h2 className="text-xl font-bold text-[#F5F7FA] mb-3">技术参数</h2>
                                <div className="bg-[#1E2532] p-4 rounded-lg grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#B8C6D8] mb-1">传感器</p>
                                        <p className="text-[#F5F7FA]">全画幅 CMOS</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#B8C6D8] mb-1">有效像素</p>
                                        <p className="text-[#F5F7FA]">4500万</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#B8C6D8] mb-1">ISO范围</p>
                                        <p className="text-[#F5F7FA]">100-51200</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#B8C6D8] mb-1">对焦系统</p>
                                        <p className="text-[#F5F7FA]">425点相位检测</p>
                                    </div>
                                </div>
                            </div>}
                            
                            {/* 交易流程折叠面板 */}
                            <div className="mt-6">
                              <button 
                                onClick={() => setShowTradeProcess(!showTradeProcess)}
                                className="w-full flex items-center justify-between py-3 px-4 bg-[#1E2532] rounded-lg text-[#F5F7FA] hover:bg-[#2D3748] transition-colors"
                              >
                                <div className="flex items-center">
                                  <i className="fa-solid fa-shopping-cart mr-2 text-[#4A5F8B]"></i>
                                  <span>交易流程</span>
                                </div>
                                <i className={`fa-solid transition-transform duration-300 ${showTradeProcess ? 'fa-chevron-down rotate-180' : 'fa-chevron-down'}`}></i>
                              </button>
                              
                              {showTradeProcess && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2 bg-[#1E2532] rounded-lg p-4"
                                >
                                  <div className="relative">
                                    {/* 连接线 */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#4A5F8B]"></div>
                                    
                                    {/* 步骤列表 */}
                                    <div className="space-y-6">
                                      {tradeSteps.map((step, index) => (
                                        <div key={index} className="flex">
                                          <div className="w-12 h-12 rounded-full bg-[#4A5F8B] flex items-center justify-center text-white z-10 mr-4 flex-shrink-0">
                                            <i className={`fa-solid ${step.icon}`}></i>
                                          </div>
                                          <div>
                                            <h3 className="font-medium text-[#F5F7FA]">{step.title}</h3>
                                            <p className="text-sm text-[#B8C6D8] mt-1">{step.description}</p></div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="lg:col-span-1">
                        <div
                            className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm text-[#6B7C93] font-medium">{equipment.brand} {equipment.type}</h3>
                                <span
                                    className="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{equipment.type}</span>
                            </div>
                            <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">{equipment.name}</h2>
                            <div className="flex items-center mb-6">
                                <p className="text-2xl font-bold text-[#4A5F8B]">¥{parseInt(equipment.price).toLocaleString()}</p>
                                {equipment.originalPrice !== equipment.price && <p className="text-sm text-[#718096] line-through ml-2">¥{parseInt(equipment.originalPrice).toLocaleString()}</p>}
                            </div>
                            {}
                            {equipment.condition && <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">成色:</span>
                                    <span className="text-[#F5F7FA] font-medium">{equipment.condition}</span>
                                </div>
                                {equipment.usageTime && <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">使用时长:</span>
                                    <span className="text-[#F5F7FA]">{equipment.usageTime}</span>
                                </div>}
                                {equipment.shutterCount && <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">快门次数:</span>
                                    <span className="text-[#F5F7FA]">{equipment.shutterCount}</span>
                                </div>}
                                {equipment.repairHistory && <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">维修记录:</span>
                                    <span className="text-[#F5F7FA]">{equipment.repairHistory}</span>
                                </div>}
                            </div>}
                            {}
                            {equipment.warranty && <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">保修:</span>
                                    <span className="text-[#F5F7FA] font-medium">{equipment.warranty}</span>
                                </div>
                            </div>}
                            {}
                            {equipment.accessories && equipment.accessories.length > 0 && <div className="mb-6">
                                <h3 className="text-sm font-medium text-[#F5F7FA] mb-2">包含配件</h3>
                                <ul className="text-sm text-[#B8C6D8] space-y-1">
                                    {equipment.accessories.map((accessory, index) => <li key={index} className="flex items-center">
                                        <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>
                                        {accessory}
                                    </li>)}
                                </ul>
                            </div>}
                            {}
                            <div className="border-t border-b border-[#4A5F8B] py-4 mb-6">
                                <h3 className="text-sm font-medium text-[#F5F7FA] mb-3">卖家信息</h3>
                                <div className="flex items-center">
                                    <img
                                        src={equipment.seller.avatar}
                                        alt={equipment.seller.name}
                                        className="w-12 h-12 rounded-full mr-3 object-cover border border-[#B8C6D8]" />
                                    <div>
                                        <p className="text-base font-medium text-[#F5F7FA]">{equipment.seller.name}</p>
                                        <div className="flex items-center mt-1">
                                          <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                              <i 
                                                key={i}
                                                className={`fa-solid fa-star text-xs ${
                                                  i < Math.floor(equipment.seller.rating) 
                                                    ? 'text-[#4A5F8B]' 
                                                    : 'text-[#6B7C93]'
                                                }`}
                                              ></i>
                                            ))}
                                          </div>
                                            <span className="text-xs text-[#6B7C93] ml-1">{equipment.seller.rating}</span>
                                            <span className="text-xs text-[#4A5F8B] mx-1">|</span>
                                            <span className="text-xs text-[#6B7C93]">{equipment.seller.completedTransactions}单</span>
                                        </div>
                                        <p className="text-xs text-[#6B7C93] mt-1">{equipment.seller.location}</p>
                                        
                                        {/* 卖家信誉数据 */}
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                          <div className="text-center">
                                            <p className="text-xs text-[#6B7C93]">好评率</p>
                                            <p className="text-sm font-medium text-[#F5F7FA]">{equipment.seller.positiveRate || 95}%</p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-xs text-[#6B7C93]">成交</p>
                                            <p className="text-sm font-medium text-[#F5F7FA]">{equipment.seller.completedTransactions}</p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-xs text-[#6B7C93]">回复</p>
                                            <p className="text-sm font-medium text-[#F5F7FA]">{equipment.seller.avgResponseTime || '3小时'}</p>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                
                                {/* 卖家近期成交记录 */}
                                {equipment.seller.recentTransactions && (
                                  <div className="mt-4">
                                    <h4 className="text-xs font-medium text-[#B8C6D8] mb-2">近期成交</h4>
                                    <div className="space-y-2">
                                      {equipment.seller.recentTransactions.slice(0, 3).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center">
                                          <div className="w-1 h-1 rounded-full bg-[#4A5F8B] mr-2"></div>
                                          <p className="text-xs text-[#B8C6D8]">{transaction.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                            {}
                            <div className="space-y-3">
                                <button
                                    className="w-full py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                                    onClick={() => handleContactSeller(equipment.seller)}>
                                    {equipment.originalPrice !== equipment.price ? "联系卖家" : "立即购买"}
                                </button>
                                <button
                                    className="w-full py-3 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]">收藏
                                            </button>
                            </div>
                            {}
                            <div className="mt-6 pt-4 border-t border-[#4A5F8B]">
                                <h3 className="text-sm font-medium text-[#F5F7FA] mb-3">交易保障</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {equipment.tradeGuarantees && equipment.tradeGuarantees.map((guarantee, index) => (
                                    <div key={index} className="flex items-center text-sm text-[#B8C6D8]">
                                      <i className="fa-solid fa-shield-alt text-[#4A5F8B] mr-2"></i>
                                      {guarantee}
                                    </div>
                                  ))}
                                  {(!equipment.tradeGuarantees || equipment.tradeGuarantees.length === 0) && (
                                    <>
                                      <div className="flex items-center text-sm text-[#B8C6D8]">
                                        <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>专业验机
                                      </div>
                                      <div className="flex items-center text-sm text-[#B8C6D8]">
                                        <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>资金担保
                                      </div>
                                      <div className="flex items-center text-sm text-[#B8C6D8]">
                                        <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>7天无理由退
                                      </div>
                                      <div className="flex items-center text-sm text-[#B8C6D8]">
                                        <i className="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>专业鉴定
                                      </div>
                                    </>
                                  )}
                                </div>
                            </div>
                        </div>
                    </div>
      </div>
    </motion.div>
    
    {/* 联系卖家模态框 */}
    <ContactSellerModal
      isOpen={showContactModal}
      onClose={() => setShowContactModal(false)}
      seller={selectedSeller} />
      
    {/* 图片预览模态框 */}
    {showImagePreview && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        onClick={closeImagePreview}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl z-10 hover:text-[#4A5F8B]"
          onClick={closeImagePreview}
        >
          <i className="fa-solid fa-times"></i>
        </button>
        
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 hover:text-[#4A5F8B]"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div 
          className="relative max-w-5xl max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {equipment && (
            <img
              src={equipment.images[currentImageIndex]}
              alt={`${equipment.name} 预览`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {equipment?.images.length}
          </div>
        </div>
        
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10 hover:text-[#4A5F8B]"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </motion.div>
    )}
  </div>
);
};





const EquipmentTrade: React.FC = () => {
    const {
        id
    } = useParams();

    const [tradeType, setTradeType] = useState<"used" | "new">("used");
    const [selectedType, setSelectedType] = useState("全部");
    const [selectedBrand, setSelectedBrand] = useState("全部");
    const [selectedPriceRange, setSelectedPriceRange] = useState("全部");
    const [selectedCondition, setSelectedCondition] = useState("全部");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recommended");
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showPublishForm, setShowPublishForm] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    if (id) {
        return <EquipmentDetail />;
    }

    const getFilteredUsedEquipment = () => {
        let equipment = [...mockUsedEquipment];

        if (selectedType !== "全部") {
            equipment = equipment.filter(item => item.type === selectedType);
        }

        if (selectedBrand !== "全部") {
            equipment = equipment.filter(item => item.brand === selectedBrand);
        }

        if (selectedPriceRange !== "全部") {
            equipment = equipment.filter(item => {
                const price = parseInt(item.price);

                switch (selectedPriceRange) {
                case "0-5000元":
                    return price <= 5000;
                case "5000-10000元":
                    return price > 5000 && price <= 10000;
                case "10000-20000元":
                    return price > 10000 && price <= 20000;
                case "20000元以上":
                    return price > 20000;
                default:
                    return true;
                }
            });
        }

        if (selectedCondition !== "全部") {
            equipment = equipment.filter(item => item.condition === selectedCondition);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            equipment = equipment.filter(
                item => item.name.toLowerCase().includes(term) || item.brand.toLowerCase().includes(term) || item.type.toLowerCase().includes(term)
            );
        }

        if (sortBy === "price-asc") {
            equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        } else if (sortBy === "price-desc") {
            equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        } else if (sortBy === "newest") {
            equipment.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        }

        return equipment;
    };

    const getFilteredNewEquipment = () => {
        let equipment = [...mockNewEquipment];

        if (selectedType !== "全部") {
            equipment = equipment.filter(item => item.type === selectedType);
        }

        if (selectedBrand !== "全部") {
            equipment = equipment.filter(item => item.brand === selectedBrand);
        }

        if (selectedPriceRange !== "全部") {
            equipment = equipment.filter(item => {
                const price = parseInt(item.price);

                switch (selectedPriceRange) {
                case "0-5000元":
                    return price <= 5000;
                case "5000-10000元":
                    return price > 5000 && price <= 10000;
                case "10000-20000元":
                    return price > 10000 && price <= 20000;
                case "20000元以上":
                    return price > 20000;
                default:
                    return true;
                }
            });
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            equipment = equipment.filter(
                item => item.name.toLowerCase().includes(term) || item.brand.toLowerCase().includes(term) || item.type.toLowerCase().includes(term)
            );
        }

        if (sortBy === "price-asc") {
            equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        } else if (sortBy === "price-desc") {
            equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        } else if (sortBy === "newest") {
            equipment.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        }

        return equipment;
    };

    const filteredUsedEquipment = getFilteredUsedEquipment();
    const filteredNewEquipment = getFilteredNewEquipment();
    const currentEquipment = tradeType === "used" ? filteredUsedEquipment : filteredNewEquipment;

    const handleContactSeller = seller => {
        setSelectedSeller(seller);
        setShowContactModal(true);
    };

    const handlePublishEquipment = formData => {
        toast.success("器材发布成功，等待审核");
    };

    return (
        <div
            className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}>
                {}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">器材交易平台</h1>
                    <p className="text-[#B8C6D8] max-w-2xl mx-auto">安全可靠的摄影器材交易平台，提供专业验机、资金担保等服务，让您买卖无忧
                                  </p>
                </div>
                {}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <motion.button
                        whileHover={{
                            y: -5
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={() => setTradeType("used")}
                        className={`py-4 rounded-xl flex items-center justify-center transition-all ${tradeType === "used" ? "bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md" : "bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]"}`}>
                        <i className="fa-solid fa-recycle text-xl mr-2"></i>
                        <span className="font-medium">二手器材</span>
                    </motion.button>
                    <motion.button
                        whileHover={{
                            y: -5
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={() => setTradeType("new")}
                        className={`py-4 rounded-xl flex items-center justify-center transition-all ${tradeType === "new" ? "bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md" : "bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]"}`}>
                        <i className="fa-solid fa-box-open text-xl mr-2"></i>
                        <span className="font-medium">全新器材</span>
                    </motion.button>
                </div>
                {}
                <div
                    className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                    <div
                        className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={`搜索${tradeType === "used" ? "二手" : "全新"}器材...`}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                            <i
                                className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                        </div>
                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                            {equipmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select
                            value={selectedBrand}
                            onChange={e => setSelectedBrand(e.target.value)}
                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                        </select>
                        <select
                            value={selectedPriceRange}
                            onChange={e => setSelectedPriceRange(e.target.value)}
                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                            {priceRanges.map(range => <option key={range} value={range}>{range}</option>)}
                        </select>
                        {tradeType === "used" && <select
                            value={selectedCondition}
                            onChange={e => setSelectedCondition(e.target.value)}
                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                            {conditions.map(
                                condition => <option key={condition} value={condition}>{condition}</option>
                            )}
                        </select>}
                    </div>
                    {}
                    <div className="flex justify-end">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                            <option value="recommended">推荐排序</option>
                            <option value="price-asc">价格从低到高</option>
                            <option value="price-desc">价格从高到低</option>
                            <option value="newest">最新发布</option>
                        </select>
                    </div>
                </div>
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEquipment.map(item => <motion.div
                        key={item.id}
                        whileHover={{
                            y: -5,
                            boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)"
                        }}
                        className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm cursor-pointer">
                        {}
                        <div className="relative">
                            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                            {tradeType === "used" && <div
                                className="absolute top-3 left-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">
                                {item.condition}
                            </div>}
                            {item.seller.isOfficial && <div
                                className="absolute top-3 left-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">官方授权
                                                  </div>}
                        </div>
                        {}
                        <div className="p-5 bg-[#2D3748]">
                            {}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[#6B7C93] font-medium">{item.brand}</span>
                                <span
                                    className="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{item.type}</span>
                            </div>
                            {}
                            <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{item.name}</h3>
                            {}
                            <div className="flex items-center mb-4">
                                <p className="text-lg font-bold text-[#4A5F8B]">¥{parseInt(item.price).toLocaleString()}</p>
                                {item.originalPrice !== item.price && <p className="text-sm text-[#718096] line-through ml-2">¥{parseInt(item.originalPrice).toLocaleString()}</p>}
                            </div>
                            {}
                            {tradeType === "used" && <div className="space-y-1 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">使用时长:</span>
                                    <span className="text-[#F5F7FA]">{item.usageTime}</span>
                                </div>
                                {item.shutterCount && <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">快门次数:</span>
                                    <span className="text-[#F5F7FA]">{item.shutterCount}</span>
                                </div>}
                                <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">维修记录:</span>
                                    <span className="text-[#F5F7FA]">{item.repairHistory}</span>
                                </div>
                            </div>}
                            {}
                            {tradeType === "new" && <div className="mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#B8C6D8]">保修:</span>
                                    <span className="text-[#F5F7FA]">{item.warranty}</span>
                                </div>
                            </div>}
                            {}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={item.seller.avatar}
                                        alt={item.seller.name}
                                        className="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                                    <div>
                                        <p className="text-sm font-medium text-[#F5F7FA]">{item.seller.name}</p>
                                        <div className="flex items-center">
                                            <i className="fa-solid fa-star text-xs text-[#4A5F8B]"></i>
                                            <span className="text-xs text-[#6B7C93] ml-1">{item.seller.rating}</span>
                                            <span className="text-xs text-[#4A5F8B] mx-1">|</span>
                                            <span className="text-xs text-[#6B7C93]">{item.seller.completedTransactions}单</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-[#6B7C93]">{item.seller.location}</span>
                            </div>
                            {}
                            <div className="flex items-center space-x-3">
                                <Link
                                    to={`/equipment-detail/${item.id}`}
                                    className="flex-1 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]">查看详情
                                                      </Link>
                                <button
                                    className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                                    onClick={() => handleContactSeller(item.seller)}>
                                    {tradeType === "used" ? "联系卖家" : "立即购买"}
                                </button>
                            </div>
                        </div>
                    </motion.div>)}
                    {currentEquipment.length === 0 && <div
                        className="col-span-full p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                        <div
                            className="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]">
                            <i className="fa-solid fa-search text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关器材</h3>
                        <p className="text-[#B8C6D8]">请尝试调整筛选条件或搜索其他关键词
                                          </p>
                    </div>}
                </div>
                {}
                <div
                    className="mt-12 bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">交易保障</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div
                                className="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <div>
                                <h3 className="font-medium text-[#F5F7FA] mb-1">专业验机服务</h3>
                                <p className="text-sm text-[#B8C6D8]">提供第三方专业机构验机服务，确保器材真实状况与描述一致
                                                    </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div
                                className="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                                <i className="fa-solid fa-shield-alt"></i>
                            </div>
                            <div>
                                <h3 className="font-medium text-[#F5F7FA] mb-1">资金担保</h3>
                                <p className="text-sm text-[#B8C6D8]">平台提供资金担保服务，买家确认收货后卖家才能收到款项
                                                    </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div
                                className="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                                <i className="fa-solid fa-headset"></i>
                            </div>
                            <div>
                                <h3 className="font-medium text-[#F5F7FA] mb-1">7天无理由退换</h3>
                                <p className="text-sm text-[#B8C6D8]">支持7天无理由退换货，让您购物无忧
                                                    </p>
                            </div>
                        </div>
                    </div>
                </div>
                {}
        {/* 发布二手器材按钮 */}
       <div className="mt-8 flex justify-center">
          <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setShowPublishForm(true)}
             className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center">
             <i className="fa-solid fa-plus-circle mr-2"></i>
             发布二手器材
          </motion.button>
       </div>
            </motion.div>
            {}
            {/* 联系卖家模态框 */}
            <ContactSellerModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                seller={selectedSeller} />
            {/* 发布器材表单 */}
            <PublishEquipmentForm
                isOpen={showPublishForm}
                onClose={() => setShowPublishForm(false)}
                onSubmit={handlePublishEquipment} />
        </div>
    );
};

export default EquipmentTrade;