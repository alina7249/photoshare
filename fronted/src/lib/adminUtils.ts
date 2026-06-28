import { UserRole } from '../contexts/adminAuthContext';

// 检查用户是否有权限访问指定路径
export const checkPermission = (userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean => {
  // 如果用户是超级管理员，拥有所有权限
  if (userRole === 'superAdmin') {
    return true;
  }
  
  // 如果requiredRole是数组，检查用户角色是否在数组中
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  // 单个角色检查
  return userRole === requiredRole;
};

// 格式化日期时间
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// 格式化数字（添加千位分隔符）
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 获取文件大小的可读性表示
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};