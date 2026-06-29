// ============================================================
// API 常量 — 纯 TS，无框架依赖，可直接复制到 Vue3 项目
// ============================================================

// 后端 API 基础地址
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 应用基础域名
export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'https://photographer.example.com';

// Coze 图床基础地址
export const COZE_API_BASE = import.meta.env.VITE_COZE_API_BASE || 'https://space.coze.cn/api/coze_space';

// Picsum 图片前缀
export const PICSUM_BASE_URL = import.meta.env.VITE_PICSUM_BASE_URL || 'https://picsum.photos';

// 默认头像
export const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR || '';

// 默认封面图
export const DEFAULT_COVER = import.meta.env.VITE_DEFAULT_COVER || '';

/**
 * 构建 Coze 图床图片 URL
 * @param prompt - 图片生成提示词
 * @param sign - 图片签名
 * @param imageSize - 图片尺寸，默认 'landscape_16_9'
 * @returns 完整 Coze 图片 URL
 */
export const buildCozeImageUrl = (
  prompt: string,
  sign: string,
  imageSize: string = 'landscape_16_9'
): string => {
  const encodedPrompt = encodeURIComponent(prompt);
  return `${COZE_API_BASE}/gen_image?image_size=${imageSize}&prompt=${encodedPrompt}&sign=${sign}`;
};

// ============================================================
// API 路径常量 — 与后端 Controller @RequestMapping 保持一致
// ============================================================

// 用户模块
export const USER_API = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  GET_CURRENT: '/user/getLoginUser',
  UPDATE: '/user/update/my',
  LOGOUT: '/user/logout',
};

// 帖子模块
export const POST_API = {
  LIST: '/post/list/page/vo',
  DETAIL: '/post/get/vo',
  ADD: '/post/add',
  UPDATE: '/post/update',
  DELETE: '/post/delete',
  MY_LIST: '/post/my/list/page/vo',
  SEARCH: '/post/search/page/vo',
};

// 器材模块
export const EQUIPMENT_API = {
  LIST: '/equipment/list',
  DETAIL: '/equipment/detail',
  ADD: '/equipment/add',
  EDIT: '/equipment/edit',
};

// 活动模块
export const EVENT_API = {
  LIST: '/event/list',
  DETAIL: '/event/detail',
  ADD: '/event/add',
  EDIT: '/event/edit',
};

// 课程模块
export const COURSE_API = {
  LIST: '/course/list',
  DETAIL: '/course/detail',
  ADD: '/course/add',
  EDIT: '/course/edit',
};

// 小组模块
export const GROUP_API = {
  LIST: '/group/list',
  DETAIL: '/group/detail',
  ADD: '/group/add',
  EDIT: '/group/edit',
};

// 赛事模块
export const CONTEST_API = {
  LIST: '/contest/list',
  DETAIL: '/contest/detail',
  ADD: '/contest/add',
  EDIT: '/contest/edit',
};

// 交易模块
export const TRADE_API = {
  LIST: '/trade/list',
  DETAIL: '/trade/detail',
  ADD: '/trade/add',
  EDIT: '/trade/edit',
};