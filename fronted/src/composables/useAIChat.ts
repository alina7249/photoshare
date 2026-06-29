/**
 * AI 聊天初始化逻辑 — 纯 TS，可直接迁移到 Vue3
 */
import { useChatStore } from '../store/chatStore';

export const useAIChat = () => {
  const initState = {
    initialized: false,
  };

  const actions = {
    /** 初始化聊天：创建默认对话并添加欢迎消息 */
    initChat: () => {
      const { chatHistories, createNewChat, addMessage } = useChatStore.getState();

      if (chatHistories.length === 0) {
        createNewChat();
      }

      const currentHistories = useChatStore.getState().chatHistories;
      if (currentHistories.length === 1 && currentHistories[0].messages.length === 0) {
        const welcomeChatId = currentHistories[0].id;
        addMessage(welcomeChatId, {
          content: '嗨！我是您的摄影助手，有什么摄影相关的问题都可以问我。我可以帮您选择相机、提供拍摄技巧、解答后期问题等。您想了解哪方面的内容呢？',
          sender: 'ai',
        });
      }
    },
  };

  return { initState, actions };
};