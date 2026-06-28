import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义消息类型
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isFavorite?: boolean;
  tags?: string[];
  status?: 'sending' | 'sent' | 'failed';
}

// 定义对话历史类型
export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastActive: Date;
  contextId?: string;
  isPinned?: boolean;
}

// 定义AI角色类型
export interface AIRole {
  id: string;
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  features?: string[];
}

// 定义状态类型
interface ChatState {
  // 当前对话
  currentChatId: string | null;
  currentContextId: string | null;
  
  // 对话历史记录
  chatHistories: ChatHistory[];
  
  // UI状态
  isHistoryPanelOpen: boolean;
  isFileUploading: boolean;
  uploadingProgress: number;
  isTyping: boolean;
  
  // AI角色
  availableRoles: AIRole[];
  selectedRole: AIRole | null;
  
  // 操作方法
  createNewChat: (title?: string) => ChatHistory;
  setCurrentChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  deleteChat: (chatId: string) => void;
  clearCurrentChat: () => void;
  toggleHistoryPanel: () => void;
  setFileUploadProgress: (progress: number) => void;
  setIsFileUploading: (isUploading: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
  setSelectedRole: (role: AIRole) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  toggleMessageFavorite: (chatId: string, messageId: string) => void;
  addMessageTag: (chatId: string, messageId: string, tag: string) => void;
  setContextId: (contextId: string | null) => void;
  toggleChatPin: (chatId: string) => void;
  exportChat: (chatId: string) => void;
}

// 默认AI角色
const defaultRoles: AIRole[] = [
  {
    id: 'photography-expert',
    name: '摄影专家',
    description: '回答摄影相关问题，提供技术指导和创作建议',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20expert%20avatar&sign=2addbb5e55df86ecf697bd2f3033610e',
    systemPrompt: '你是一位专业的摄影专家，擅长回答各类摄影技术问题和提供创作建议。',
    features: ['技术指导', '创作建议', '构图分析']
  },
  {
    id: 'equipment-advisor',
    name: '器材顾问',
    description: '提供相机、镜头等摄影器材的选购建议和使用技巧',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera%20equipment%20expert%20avatar&sign=3abbbf69544ac5f9e29cb01e70db188a',
    systemPrompt: '你是一位摄影器材专家，能够提供相机、镜头等设备的专业建议。',
    features: ['器材推荐', '参数解读', '使用技巧']
  },
  {
    id: 'copywriter',
    name: '文案专家',
    description: '为摄影作品创作吸引人的标题和描述文案',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=creative%20copywriter%20avatar&sign=c0f4d939b99d49b1f7cd1ffbb25aac1a',
    systemPrompt: '你是一位创意文案专家，擅长为摄影作品创作吸引人的标题和描述。',
    features: ['标题创作', '描述优化', '文案润色']
  },
  {
    id: 'photo-editor',
    name: '后期编辑',
    description: '提供照片后期处理的建议和技巧',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20expert%20avatar&sign=0ff6f3811e5710b9a00bca31003b8f35',
    systemPrompt: '你是一位专业的照片后期编辑，能够提供Photoshop、Lightroom等软件的使用技巧和后期处理建议。',
    features: ['修图技巧', '调色建议', '后期流程']
  }
];

// 创建store
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentChatId: null,
      currentContextId: null,
      chatHistories: [],
      isHistoryPanelOpen: false,
      isFileUploading: false,
      uploadingProgress: 0,
      isTyping: false,
      availableRoles: defaultRoles,
      selectedRole: defaultRoles[0],
      
      // 创建新对话
      createNewChat: (title = '新对话') => {
        const newChat: ChatHistory = {
          id: `chat-${Date.now()}`,
          title,
          messages: [],
          lastActive: new Date()
        };
        
        set((state) => ({
          chatHistories: [newChat, ...state.chatHistories],
          currentChatId: newChat.id
        }));
        
        return newChat;
      },
      
      // 设置当前对话
      setCurrentChat: (chatId) => {
        const chat = get().chatHistories.find(c => c.id === chatId);
        if (chat) {
          set({ 
            currentChatId: chatId,
            currentContextId: chat.contextId || null,
            isTyping: false  // 确保切换对话时清除输入状态
          });
        }
      },
      
      // 添加消息
      addMessage: (chatId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
          status: 'sent'
        };
        
        set((state) => ({
          chatHistories: state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastActive: new Date()
              };
            }
            return chat;
          })
        }));
        
        return newMessage;
      },
      
      // 更新消息
      updateMessage: (chatId, messageId, updates) => {
        set((state) => ({
          chatHistories: state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId ? { ...msg, ...updates } : msg
                )
              };
            }
            return chat;
          })
        }));
      },
      
      // 删除对话
      deleteChat: (chatId) => {
        set((state) => ({
          chatHistories: state.chatHistories.filter(chat => chat.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId
        }));
      },
      
      // 清空当前对话
      clearCurrentChat: () => {
        const { currentChatId } = get();
        if (currentChatId) {
          set((state) => ({
            chatHistories: state.chatHistories.map(chat => {
              if (chat.id === currentChatId) {
                return {
                  ...chat,
                  messages: [],
                  contextId: undefined
                };
              }
              return chat;
            })
          }));
        }
      },
      
      // 切换历史面板
      toggleHistoryPanel: () => {
        set((state) => ({
          isHistoryPanelOpen: !state.isHistoryPanelOpen
        }));
      },
      
      // 设置文件上传进度
      setFileUploadProgress: (progress) => {
        set({ uploadingProgress: progress });
      },
      
      // 设置文件上传状态
      setIsFileUploading: (isUploading) => {
        set({ isFileUploading: isUploading });
      },
      
      // 设置AI打字状态
      setIsTyping: (isTyping) => {
        set({ isTyping });
      },
      
      // 设置选中的AI角色
      setSelectedRole: (role) => {
        set({ selectedRole: role });
      },
      
      // 更新对话标题
      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chatHistories: state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return { ...chat, title };
            }
            return chat;
          })
        }));
      },
      
      // 切换消息收藏状态
      toggleMessageFavorite: (chatId, messageId) => {
        set((state) => ({
          chatHistories: state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId 
                    ? { ...msg, isFavorite: !msg.isFavorite } 
                    : msg
                )
              };
            }
            return chat;
          })
        }));
      },
      
      // 添加消息标签
      addMessageTag: (chatId, messageId, tag) => {
        set((state) => ({
          chatHistories: state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => {
                  if (msg.id === messageId) {
                    const existingTags = msg.tags || [];
                    if (!existingTags.includes(tag)) {
                      return { ...msg, tags: [...existingTags, tag] };
                    }
                  }
                  return msg;
                })
              };
            }
            return chat;
          })
        }));
      },
      
      // 设置上下文ID
      setContextId: (contextId) => {
        set({ currentContextId: contextId });
        const { currentChatId } = get();
        if (currentChatId) {
          set((state) => ({
            chatHistories: state.chatHistories.map(chat => {
              if (chat.id === currentChatId) {
                return { ...chat, contextId };
              }
              return chat;
            })
          }));
        }
      },
      
      // 切换对话置顶状态
      toggleChatPin: (chatId) => {
        set((state) => {
          const updatedChats = state.chatHistories.map(chat => {
            if (chat.id === chatId) {
              return { ...chat, isPinned: !chat.isPinned };
            }
            return chat;
          });
          
          // 将置顶的对话移到最前面
          const pinnedChats = updatedChats.filter(chat => chat.isPinned);
          const unpinnedChats = updatedChats.filter(chat => !chat.isPinned);
          
          return {
            chatHistories: [...pinnedChats, ...unpinnedChats]
          };
        });
      },
      
      // 导出对话
      exportChat: (chatId) => {
        const chat = get().chatHistories.find(c => c.id === chatId);
        if (chat) {
          // 在实际应用中，这里会实现导出逻辑
          console.log('Exporting chat:', chat);
        }
      }
    }),
    {
      name: 'chat-storage', // localStorage的键名
      partialize: (state) => ({
        chatHistories: state.chatHistories,
        availableRoles: state.availableRoles,
        selectedRole: state.selectedRole
      }) // 只持久化必要的状态
    }
  )
);