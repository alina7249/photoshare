import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Footer: React.FC = () => {
  const { theme } = useAuthStore();
  
  // 根据主题获取样式类
  const getBgClass = () => {
    return theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100';
  };
  
  const getTextClass = (isPrimary: boolean) => {
    return isPrimary 
      ? (theme === 'dark' ? 'text-[#E0E5EC]' : 'text-[#1E2532]')
      : (theme === 'dark' ? 'text-[#718096]' : 'text-[#4A5F8B]');
  };
  
  const getCardBgClass = () => {
    return theme === 'dark' ? 'bg-[#1E2A3A] border-[#4A5568]' : 'bg-white border-gray-200';
  };
  
  const getLinkClass = () => {
    return theme === 'dark' 
      ? 'text-[#E2E8F0] hover:text-[#63B3ED]' 
      : 'text-[#4A5F8B] hover:text-[#63B3ED]';
  };
  
  const getSubscribeInputClass = () => {
    return theme === 'dark' 
      ? 'bg-[#4A5568] text-[#FFFFFF] focus:ring-[#63B3ED]' 
      : 'bg-white text-[#1E2532] border-gray-300 focus:ring-[#63B3ED] focus:border-[#63B3ED]';
  };
  
  const getSubscribeButtonClass = () => {
    return theme === 'dark' 
      ? 'bg-[#63B3ED] text-[#0F1C2D] hover:bg-[#4299E1]' 
      : 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]';
  };
  
  const getSocialIconClass = () => {
    return theme === 'dark' 
      ? 'text-[#E2E8F0] hover:text-[#63B3ED]' 
      : 'text-[#4A5F8B] hover:text-[#63B3ED]';
  };
  
  return (
    <footer className={`w-full py-10 mt-12 ${getBgClass()}`}>
      <div className="container mx-auto px-4">
        {/* 上下区域过渡条 */}
        <div className="h-4 bg-[#1E2A3A] rounded-t-xl mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <i className={`fa-solid fa-camera text-2xl ${getTextClass(true)} mr-2`}></i>
              <span className={`text-xl font-bold ${getTextClass(true)}`}>
                影研社
              </span>
            </div>
            <p className={getTextClass(false)}>
              聚焦艺术摄影、商业创作及黑白影像领域，为追求质感的摄影师与爱好者，打造"深邃夜空"风格的专业交流空间。
            </p>
            <div className="flex space-x-4">
              <a href="#" className={getSocialIconClass()}>
                <i className="fa-brands fa-weibo"></i>
              </a>
              <a href="#" className={getSocialIconClass()}>
                <i className="fa-brands fa-weixin"></i>
              </a>
              <a href="#" className={getSocialIconClass()}>
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className={getSocialIconClass()}>
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div className={`${getCardBgClass()} rounded-lg p-5 border`}>
            <h4 className={`text-lg font-bold mb-4 ${getTextClass(true)}`}>快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`text-sm ${getLinkClass()} transition-colors`}>
                  首页
                </Link>
              </li>
              <li>
                <Link to="/community" className={`text-sm ${getLinkClass()} transition-colors`}>
                  社区
                </Link>
              </li>
              <li>
                <Link to="/resources" className={`text-sm ${getLinkClass()} transition-colors`}>
                  资源
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  赛事
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  器材交易
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div className={`${getCardBgClass()} rounded-lg p-5 border`}>
            <h4 className={`text-lg font-bold mb-4 ${getTextClass(true)}`}>支持</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  帮助中心
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  社区准则
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  隐私政策
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  服务条款
                </Link>
              </li>
              <li>
                <Link to="#" className={`text-sm ${getLinkClass()} transition-colors`}>
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 订阅 */}
          <div className={`${getCardBgClass()} rounded-lg p-5 border`}>
            <h4 className={`text-lg font-bold mb-4 ${getTextClass(true)}`}>订阅更新</h4>
            <p className={`text-sm mb-4 ${getTextClass(false)}`}>
              订阅我们的新闻通讯，获取最新的摄影技巧、赛事信息和社区动态。
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="您的邮箱地址"
                className={`flex-1 px-4 py-2 ${getSubscribeInputClass()} rounded-l-lg focus:outline-none`}
              />
              <button className={`px-4 py-2 ${getSubscribeButtonClass()} rounded-r-lg text-sm font-medium transition-colors`}>
                订阅
              </button>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className={getTextClass(false)}>
            © 2025 影研社. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
};

// 默认导出Footer组件，确保React.lazy可以正确解析
export default Footer;