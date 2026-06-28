import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import Captcha from './Captcha';

interface RegisterFormData {
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  captcha: string;
}

const RegisterForm: React.FC = () => {
  const { register: authRegister, theme } = useAuthStore();
  const navigate = useNavigate();
  
  const [captchaValue, setCaptchaValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
      captcha: ''
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (captchaValue.length !== 6) {
        toast.warning('请输入6位验证码');
        return;
      }
      
      const success = await authRegister(data.username, data.password, data.confirmPassword, data.username);
      
      if (success) {
        toast.success('注册成功，请登录！');
        navigate('/login');
      } else {
        toast.error('注册失败，请稍后重试');
      }
    } catch (error) {
      toast.error('注册失败，请稍后重试');
      console.error('Registration error:', error);
    }
  };
  
  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    if (!value) return '请输入用户名';
    if (!usernameRegex.test(value)) 
      return '用户名必须是4-16位字母数字组合';
    return true;
  };
  
  const validatePhone = (value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!value) return '请输入手机号码';
    if (!phoneRegex.test(value)) 
      return '请输入有效的手机号码';
    return true;
  };
  
  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
    if (!value) return '请输入密码';
    if (value.length !== 8) return '密码必须是8个字符';
    if (!passwordRegex.test(value)) 
      return '密码必须包含大小写字母和特殊符号';
    return true;
  };
  
  const validateConfirmPassword = (value: string) => {
    if (!value) return '请确认密码';
    if (value !== password) return '两次输入的密码不一致';
    return true;
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            用户名
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { 
              required: '请输入用户名',
              validate: validateUsername
            })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.username 
                ? 'border-red-500' 
                : 'border-[#4A5568]'
            } ${
              theme === 'dark' 
                ? 'bg-[#4A5568] text-[#FFFFFF]' 
                : 'bg-white text-[#1E2532]'
            } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
            placeholder="请输入用户名"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            手机号码
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', { 
              required: '请输入手机号码',
              validate: validatePhone
            })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone 
                ? 'border-red-500' 
                : 'border-[#4A5568]'
            } ${
              theme === 'dark' 
                ? 'bg-[#4A5568] text-[#FFFFFF]' 
                : 'bg-white text-[#1E2532]'
            } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
            placeholder="请输入手机号码"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
        
        <Captcha
          value={captchaValue}
          onChange={setCaptchaValue}
        />
        {captchaValue.length > 0 && captchaValue.length !== 6 && (
          <p className="mt-1 text-sm text-red-500">验证码必须是6位</p>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            密码
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { 
                required: '请输入密码',
                validate: validatePassword
              })}
              className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                errors.password 
                  ? 'border-red-500' 
                  : 'border-[#4A5568]'
              } ${
                theme === 'dark' 
                  ? 'bg-[#4A5568] text-[#FFFFFF]' 
                  : 'bg-white text-[#1E2532]'
              } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
              placeholder="至少8个字符"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] hover:text-[#B8C6D8]"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            确认密码
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', { 
                required: '请确认密码',
                validate: validateConfirmPassword
              })}
              className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                errors.confirmPassword 
                  ? 'border-red-500' 
                  : 'border-[#4A5568]'
              } ${
                theme === 'dark' 
                  ? 'bg-[#4A5568] text-[#FFFFFF]' 
                  : 'bg-white text-[#1E2532]'
              } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
              placeholder="再次输入密码"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] hover:text-[#B8C6D8]"
              aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
            >
              <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              {...register('terms', { required: '请阅读并同意服务条款和隐私政策' })}
              className="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-[#718096]">
              我已阅读并同意
              <a href="#" className="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
                服务条款
              </a>
              和
              <a href="#" className="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
                隐私政策
              </a>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#4299E1] text-[#0F1C2D] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
              注册中...
            </span>
          ) : (
            '注册'
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;