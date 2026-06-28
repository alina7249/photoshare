import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8121', // 后端 API 基础地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理 token 过期
    if (error.response?.status === 401) {
      // 清除本地存储的 token 和用户信息
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // 跳转到登录页面
      window.location.href = '/login';
      return Promise.reject({ message: '登录已过期，请重新登录' });
    }
    
    // 处理其他错误
    let errorMessage = '网络错误，请稍后重试';
    
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误';
          break;
        case 403:
          errorMessage = data?.message || '没有权限访问该资源';
          break;
        case 404:
          errorMessage = data?.message || '请求的资源不存在';
          break;
        case 500:
          errorMessage = data?.message || '服务器内部错误';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络连接失败，请检查网络';
    } else {
      // 请求配置出错
      errorMessage = error.message || '请求失败';
    }
    
    return Promise.reject({ message: errorMessage, ...error.response?.data });
  }
);

// 登录接口
export const login = async (userAccount: string, userPassword: string) => {
  return api.post('/api/user/login', { userAccount, userPassword });
};

// 注册接口
export const register = async (userAccount: string, userPassword: string, checkPassword: string, userName: string) => {
  return api.post('/api/user/register', { userAccount, userPassword, checkPassword, userName });
};

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  return api.get('/api/user/getLoginUser');
};

export default api;