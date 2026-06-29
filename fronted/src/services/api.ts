import axios from 'axios';
import { API_BASE_URL, USER_API } from '../constants/api';

// 统一错误类型定义
export interface ApiError {
  code: number;
  message: string;
  data?: any;
}

// 创建 axios 实例
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    const { data } = response;
    // 后端返回格式: { code: 0, data: ..., message: ... }
    if (data.code === 0) {
      return data.data;
    }
    // 业务错误
    return Promise.reject({
      code: data.code,
      message: data.message || '业务处理失败',
    } as ApiError);
  },
  (error) => {
    // 处理 token 过期
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject({ message: '登录已过期，请重新登录' });
    }

    let errorMessage = '网络错误，请稍后重试';

    if (error.response) {
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
      errorMessage = '网络连接失败，请检查网络';
    } else {
      errorMessage = error.message || '请求失败';
    }

    return Promise.reject({ message: errorMessage, ...error.response?.data });
  }
);

// ---- 通用请求方法 ----

export const apiGet = async <T = any>(url: string): Promise<T> => {
  return api.get(url);
};

export const apiPost = async <T = any>(url: string, data?: any): Promise<T> => {
  return api.post(url, data);
};

export const apiPut = async <T = any>(url: string, data?: any): Promise<T> => {
  return api.put(url, data);
};

export const apiDelete = async <T = any>(url: string): Promise<T> => {
  return api.delete(url);
};

// ---- 业务 API ----

// 登录接口
export const login = async (userAccount: string, userPassword: string) => {
  return api.post(USER_API.LOGIN, { userAccount, userPassword });
};

// 注册接口
export const register = async (userAccount: string, userPassword: string, checkPassword: string, userName: string) => {
  return api.post(USER_API.REGISTER, { userAccount, userPassword, checkPassword, userName });
};

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  return api.get(USER_API.GET_CURRENT);
};

export default api;