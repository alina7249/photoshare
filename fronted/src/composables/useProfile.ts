/**
 * 个人中心业务逻辑 — 纯 TS，可直接迁移到 Vue3
 */

export type ProfileTab = 'posts' | 'collections' | 'likes' | 'stats';

export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
}

export const initProfileState = {
  activeTab: 'posts' as ProfileTab,
  sortBy: 'latest',
  selectedTag: '全部',
  searchTerm: '',
  visibilityFilter: 'all',
  formatFilter: 'all',
  showUploadModal: false,
  uploading: false,
  selectedFile: null as File | null,
  uploadProgress: 0,
  newPostTitle: '',
  newPostDescription: '',
  newPostTags: '',
  newPostVisibility: '公开',
  isFollowing: false,
  profileUser: {
    id: '',
    username: '',
    email: '',
    avatar: '',
    bio: '',
    joinDate: '',
    followers: 0,
    following: 0,
    posts: 0,
    likes: 0,
  } as ProfileUser,
  profilePosts: [] as any[],
  loading: true,
};

/** 重置上传表单 */
export const resetUploadForm = () => {
  return {
    selectedFile: null as File | null,
    newPostTitle: '',
    newPostDescription: '',
    newPostTags: '',
    newPostVisibility: '公开',
    uploadProgress: 0,
  };
};

export const useProfile = () => {
  return {
    initState: initProfileState,
    actions: {
      resetUploadForm,
    },
  };
};