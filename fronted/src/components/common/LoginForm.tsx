import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import Captcha from './Captcha';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
}

const LoginForm: React.FC = () => {
  const { login, adminLogin, theme } = useAuthStore();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
      setShowCaptcha(parseInt(attempts) >= 5);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('loginAttempts', loginAttempts.toString());
  }, [loginAttempts]);
  
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setShowCaptcha(false);
    localStorage.setItem('loginAttempts', '0');
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
      captcha: ''
    }
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      if (showCaptcha && captchaValue.length !== 6) {
        toast.warning('请输入6位验证码');
        return;
      }
      
      const isAdminUsername = ['admin', 'editor', 'operator'].includes(data.username.toLowerCase());
      
      if (isAdminUsername) {
        if (['admin', 'editor', 'operator'].includes(data.username.toLowerCase())) {
          const adminSuccess = await adminLogin(data.username, data.password);
          
          if (adminSuccess) {
            resetLoginAttempts();
            toast.success('管理员登录成功！');
            navigate('/admin');
            return;
          } else {
            setLoginAttempts(prev => {
              const newAttempts = prev + 1;
              setShowCaptcha(newAttempts >= 5);
              return newAttempts;
            });
            toast.error('管理员用户名或密码错误');
            return;
          }
        } else {
          toast.error('管理员用户名错误');
          return;
        }
      } else {
        try {
          const success = await login(data.username, data.password);
          
          if (!success) {
            setLoginAttempts(prev => {
              const newAttempts = prev + 1;
              setShowCaptcha(newAttempts >= 5);
              return newAttempts;
            });
            
            toast.error('用户名或密码错误，请重试');
            
            if (loginAttempts + 1 >= 5) {
              toast.info('连续登录失败5次，请输入验证码');
            }
            
            return;
          }
          
          if (data.rememberMe) {
            localStorage.setItem('rememberedUsername', data.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          }
          
          resetLoginAttempts();
          toast.success('登录成功！');
          navigate('/');
          return;
        } catch (error) {
          console.error('User login error:', error);
          toast.error('登录失败，请稍后重试');
          return;
        }
      }
      
      toast.error('登录失败，请稍后重试');
    } catch (error) {
      toast.error('登录失败，请稍后重试');
      console.error('Login form error:', error);
    }
  };
  
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      reset({
        username: rememberedUsername,
        rememberMe: true
      });
    }
  }, []);
   
  const validateRegularPassword = (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
    if (!value) return '请输入密码';
    if (value.length !== 8) return '密码必须是8个字符';
    if (!passwordRegex.test(value)) 
      return '密码必须包含大小写字母和特殊符号';
    return true;
  };
  
  const validateAdminPassword = (value: string) => {
    if (!value) return '请输入密码';
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
    if (value.length !== 8) return '密码必须是8个字符';
    if (!passwordRegex.test(value)) 
      return '密码必须包含大小写字母和特殊符号';
    
    return true;
  };
  
  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    if (!value) return '请输入用户名';
    if (!usernameRegex.test(value)) 
      return '用户名必须是4-16位字母数字组合';
    return true;
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <label htmlFor="password" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            密码
          </label>
          <div className="relative">
            <input
              id="password"
               type={showPassword ? 'text' : 'password'}
               {...register('password', { 
                required: '请输入密码',
                validate: (value) => {
                  const usernameInput = document.getElementById('username') as HTMLInputElement;
                  const username = usernameInput?.value.toLowerCase() || '';
                  
                  const isAdminUsername = ['admin', 'editor', 'operator'].includes(username);
                  
                  if (isAdminUsername) {
                    return validateAdminPassword(value);
                  } else {
                    return validateRegularPassword(value);
                  }
                }
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
              placeholder="••••••••"
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
        
        {showCaptcha && (
          <div>
            <Captcha
              value={captchaValue}
              onChange={setCaptchaValue}
            />
            {captchaValue.length > 0 && captchaValue.length !== 6 && (
              <p className="mt-1 text-sm text-red-500">验证码必须是6位</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#E2E8F0]">
              记住我
            </label>
          </div>
          
          <div>
            <a
              href="#"
              className="text-sm font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
            >
              忘记密码？
            </a>
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
              登录中...
            </span>
          ) : (
            '登录'
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;