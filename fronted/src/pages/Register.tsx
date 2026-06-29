import { buildCozeImageUrl } from '../constants/api';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/common/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-text-dark-inverse">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-dark-alt p-8 rounded-xl shadow-xl border border-border-light-form"
      >
        <div className="text-center relative">
          <div className="absolute inset-0 bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12" style={{ backgroundImage: `url(${buildCozeImageUrl('galaxy background stars purple blue', '9a9229c82aef2e4f5ac40648383863bf', 'landscape_16_9')})` }}></div>
          <motion.div
            whileHover={{ rotate: 10 }}
            className="relative inline-flex items-center justify-center mb-4 text-3xl text-light-accent"
          >
            <i className="fa-solid fa-camera"></i>
          </motion.div>
          <h1 className="text-2xl font-bold text-surface-light-hover">创建 影研社 账号</h1>
          <p className="mt-2 text-sm text-text-light-label">
            加入专业摄影创作与交流平台，展示你的作品
          </p>
        </div>
        
        {/* 使用RegisterForm组件 */}
        <RegisterForm />
        
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-light-form"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-alt text-text-light-muted">
              或通过以下方式注册
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-border-light-form rounded-lg bg-dark-alt text-text-light-label hover:bg-border-light-form transition-colors"
          >
            <i className="fa-brands fa-weixin text-green-500"></i>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-border-light-form rounded-lg bg-dark-alt text-text-light-label hover:bg-border-light-form transition-colors"
          >
            <i className="fa-brands fa-weibo text-red-500"></i>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center items-center px-4 py-2 border border-border-light-form rounded-lg bg-dark-alt text-text-light-label hover:bg-border-light-form transition-colors"
          >
            <i className="fa-brands fa-qq text-blue-400"></i>
          </motion.button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-text-light-muted">
            已有账号？{' '}
            <Link
              to="/login"
              className="font-medium text-light-accent hover:text-light-accent transition-colors"
            >
              立即登录
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;