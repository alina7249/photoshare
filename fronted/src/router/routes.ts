/**
 * 路由抽象层 — 完全隔离 react-router 依赖
 * 迁移到 Vue Router 时只需修改此文件和 useRouter.ts
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // 管理后台
  ADMIN: '/admin',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_GROUPS: '/admin/groups',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SETTINGS: '/admin/settings',

  // 用户
  PROFILE: '/profile',
  PROFILE_SETTINGS: '/profile/settings',
  PROFILE_CENTER: '/profile-center',
  PROFILE_CENTER_WORKS: '/profile-center/works',
  PROFILE_CENTER_UPLOAD: '/profile-center/works?action=upload',

  // 社区
  COMMUNITY: '/community',
  GROUPS: '/groups',
  GROUP_DETAIL: (id: string) => `/groups/${id}`,

  // 资源
  RESOURCES: '/resources',
  EVENTS_AND_CONTESTS: '/events-and-contests',
  OFFLINE_EVENTS: '/offline-events',
  OFFLINE_EVENT_DETAIL: (id: string) => `/offline-events/${id}`,
  PHOTOGRAPHY_CONTESTS: '/photography-contests',
  PHOTOGRAPHY_CONTEST_DETAIL: (id: string) => `/photography-contests/${id}`,
  ONLINE_COURSES: '/online-courses',
  ONLINE_COURSE_DETAIL: (id: string) => `/online-courses/${id}`,
  TUTORIAL_DETAIL: (id: string) => `/online-courses/tutorial/${id}`,

  // 器材
  EQUIPMENT_TRADE: '/equipment-trade',
  EQUIPMENT_TRADE_DETAIL: (id: string) => `/equipment-trade/${id}`,
  EQUIPMENT_DATABASE: '/equipment-database',

  // 作品
  PHOTO_DETAIL: (id: string) => `/photo/${id}`,
  PHOTO_COMMENTS: (id: string) => `/photo/${id}/comments`,
  POST_DETAIL: (id: string) => `/post/${id}`,
  PROJECT_DETAIL: (id: string) => `/project/${id}`,

  // 工具
  MEMBERSHIP: '/membership',
  LOCATIONS: '/locations',
  TOOLS: '/tools',
  SEARCH: '/search',
  AI_CHAT: '/ai-chat',
  EQUIPMENT_HUB: '/equipment-hub',
  EQUIPMENT_LIBRARY: '/equipment-library',
  EQUIPMENT_REVIEW: '/equipment-review',
  BATCH_MANAGE: '/batch-manage-photos',
  SETTINGS: '/settings',
  PROFILE_BENEFITS: '/profile-benefits',
} as const;