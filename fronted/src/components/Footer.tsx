import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { EMPTY_TEXT } from '../constants/text';

const Footer: React.FC = () => {
  const { theme } = useAuthStore();
  
  // 根据主题获取样式类
  const getBgClass = () => {
    return theme === 'dark' ? 'bg-deep' : 'bg-gray-100';
  };
  
  const getTextClass = (isPrimary: boolean) => {
    return isPrimary 
      ? (theme === 'dark' ? 'text-text-light-footer' : 'text-deep')
      : (theme === 'dark' ? 'text-text-light-muted' : 'text-accent');
  };
  
  const getCardBgClass = () => {
    return theme === 'dark' ? 'bg-dark-alt border-border-light-form' : 'bg-white border-gray-200';
  };
  
  const getLinkClass = () => {
    return theme === 'dark' 
      ? 'text-text-light-label hover:text-light-accent' 
      : 'text-accent hover:text-light-accent';
  };
  
  const getSubscribeInputClass = () => {
    return theme === 'dark' 
      ? 'bg-border-light-form text-surface-light-hover focus:ring-light-accent' 
      : 'bg-white text-deep border-gray-300 focus:ring-light-accent focus:border-light-accent';
  };
  
  const getSubscribeButtonClass = () => {
    return theme === 'dark' 
      ? 'bg-light-accent text-text-dark-inverse hover:bg-light-accent-hover' 
      : 'bg-accent text-white hover:bg-accent-hover';
  };
  
  const getSocialIconClass = () => {
    return theme === 'dark' 
      ? 'text-text-light-label hover:text-light-accent' 
      : 'text-accent hover:text-light-accent';
  };
  
  return (
    <footer className={`w-full py-10 mt-12 ${getBgClass()}`}>
      <div className="container mx-auto px-4">
        {/* 上下区域过渡条 */}
        <div className="h-4 bg-dark-alt rounded-t-xl mb-8"></div>
        
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
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  赛事
                </button>
              </li>
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  器材交易
                </button>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div className={`${getCardBgClass()} rounded-lg p-5 border`}>
            <h4 className={`text-lg font-bold mb-4 ${getTextClass(true)}`}>支持</h4>
            <ul className="space-y-2">
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  帮助中心
                </button>
              </li>
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  社区准则
                </button>
              </li>
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  隐私政策
                </button>
              </li>
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  服务条款
                </button>
              </li>
              <li>
                <button disabled title={EMPTY_TEXT.COMING_SOON} className={`text-sm ${getLinkClass()} transition-colors cursor-not-allowed opacity-50`}>
                  联系我们
                </button>
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