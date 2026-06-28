import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ShareButtonProps {
  url: string;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  className = '',
  size = 'md'
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  // 复制链接到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('链接已复制到剪贴板');
      setShowMenu(false);
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };
  
  // 打开分享链接
  const shareToPlatform = (platform: 'weibo' | 'qq' | 'wechat') => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || '');
    
    switch (platform) {
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'wechat':
        // 微信不支持直接分享，显示二维码提示
        toast.info('请在微信中打开此链接进行分享');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };
  
  // 计算按钮大小样式
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };
  
  return (
    <div className={`relative inline-block ${className} z-50`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className={`${getSizeStyles()} bg-[#4A5F8B] text-[#F5F7FA] rounded-full flex items-center justify-center hover:bg-[#6B7C93] transition-colors`}
        aria-label="分享"
      >
        <i className="fa-solid fa-share-nodes"></i>
      </motion.button>
      
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] py-2 z-50"
          >
            <button 
              className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
              onClick={() => shareToPlatform('weibo')}
            >
              <i className="fa-brands fa-weibo mr-2 text-[#E6162D]"></i> 分享到微博
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
              onClick={() => shareToPlatform('qq')}
            >
              <i className="fa-brands fa-qq mr-2 text-[#12B7F5]"></i> 分享到QQ
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
              onClick={() => shareToPlatform('wechat')}
            >
              <i className="fa-brands fa-weixin mr-2 text-[#07C160]"></i> 分享到微信
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
              onClick={copyToClipboard}
            >
              <i className="fa-solid fa-link mr-2"></i> 复制链接
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

