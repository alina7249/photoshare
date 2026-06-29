import { apiGet } from '../services/api';

/**
 * 用户资料 API 调用 — 纯 TS，可直接迁移到 Vue3
 */
export const useProfileApi = () => {
  const fetchProfile = async () => {
    try {
      return await apiGet<any>('/profile');
    } catch {
      return null;
    }
  };

  const fetchProfilePosts = async () => {
    try {
      return await apiGet<any[]>('/profile/posts');
    } catch {
      return [];
    }
  };

  return { fetchProfile, fetchProfilePosts };
};