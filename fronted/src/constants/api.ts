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