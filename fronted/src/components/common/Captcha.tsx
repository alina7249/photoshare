import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';

interface CaptchaProps {
  onChange: (value: string) => void;
  value?: string;
  className?: string;
}

const Captcha: React.FC<CaptchaProps> = ({ onChange, value = '', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const { theme } = useAuthStore();
  
  // 生成随机验证码
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    drawCaptcha(result);
  };
  
  // 绘制验证码到canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置canvas尺寸
    canvas.width = 120;
    canvas.height = 40;
    
    // 背景色
    ctx.fillStyle = theme === 'dark' ? '#2D3748' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = theme === 'dark' 
        ? `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)` 
        : `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // 绘制干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = theme === 'dark' 
        ? `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)` 
        : `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.7)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // 绘制文本
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 为每个字符设置不同的颜色和旋转角度
    for (let i = 0; i < text.length; i++) {
      ctx.fillStyle = theme === 'dark' 
        ? `rgb(${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55})` 
        : `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
      
      ctx.save();
      ctx.translate(20 + i * 16, 20);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text.charAt(i), 0, 0);
      ctx.restore();
    }
  };
  
  // 校验用户输入的验证码
  const validateCaptcha = (input: string): boolean => {
    return input.toLowerCase() === captchaText.toLowerCase();
  };
  
  // 处理用户输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  // 刷新验证码
  const refreshCaptcha = () => {
    generateCaptcha();
    onChange(''); // 清空用户输入
  };
  
  // 初始化生成验证码
  useEffect(() => {
    generateCaptcha();
  }, [theme]);
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative flex-1">
        <label htmlFor="captcha" className="block text-sm font-medium text-[#E2E8F0] mb-1">
          验证码
        </label>
        <input
          id="captcha"
          type="text"
          value={value}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 rounded-lg border border-[#4A5F8B] ${
            theme === 'dark' 
              ? 'bg-[#4A5568] text-[#FFFFFF]' 
              : 'bg-white text-[#1E2532]'
          } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
          placeholder="请输入验证码"
          maxLength={6}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="cursor-pointer rounded-lg border border-[#4A5F8B]"
        onClick={refreshCaptcha}
        title="点击刷新验证码"
      />
    </div>
  );
};

export default Captcha;