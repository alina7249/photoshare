import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/common/LoginForm';
import { checkAuthStatus } from '../hooks/useAuth';

const Login: React.FC = () => {
  // 检查URL参数中是否有重定向信息
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect') || '/';
  
  // 检查是否已经登录
  const isLoggedIn = checkAuthStatus();
  
  // 如果已经登录，直接重定向到首页或指定页面
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl);
    }
  }, [isLoggedIn, redirectUrl]);
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1C2D]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-[#1E2A3A] p-8 rounded-xl shadow-xl border border-[#4A5F8B]"
      >
        <div className="text-center relative">
          <div className="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=galaxy%20background%20stars%20purple%20blue&sign=9a9229c82aef2e4f5ac40648383863bf')] bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12"></div>
          <motion.div
            whileHover={{ rotate: 10 }}
            className="relative inline-flex items-center justify-center mb-4 text-3xl text-[#B8C6D8]"
          >
            <i className="fa-solid fa-camera"></i>
          </motion.div>
          <h1 className="text-2xl font-bold text-[#FFFFFF]">登录 影研社</h1>
          <p className="mt-2 text-sm text-[#E2E8F0]">
            专业摄影创作与交流平台，连接全球摄影人
          </p>
        </div>
        
        {/* 使用LoginForm组件 */}
        <LoginForm />
        
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#4A5F8B]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1E2A3A] text-[#718096]">
              或通过以下方式登录
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
          >
            <i className="fa-brands fa-weixin text-green-500"></i>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
          >
            <i className="fa-brands fa-weibo text-red-500"></i>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
          >
            <i className="fa-brands fa-qq text-blue-400"></i>
          </motion.button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-[#718096]">
            还没有账号？{' '}
            <Link
              to="/register"
              className="font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
            >
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;