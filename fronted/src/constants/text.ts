// ============================================================
// 文案常量 — 纯 TS，无框架依赖
// ============================================================

/** 页面标题 */
export const PAGE_TITLE = {
  HOME: '光影视界',
  EXPLORE: '发现',
  COMMUNITY: '社区',
  PROFILE: '个人中心',
  SETTINGS: '账号设置',
  ADMIN: '管理后台',
  LOGIN: '登录',
  REGISTER: '注册',
  EQUIPMENT: '器材库',
  COURSES: '在线课程',
  CONTESTS: '摄影比赛',
  EVENTS: '线下活动',
} as const;

/** 按钮文案 */
export const BUTTON_TEXT = {
  SUBMIT: '提交',
  CANCEL: '取消',
  SAVE: '保存',
  DELETE: '删除',
  EDIT: '编辑',
  CREATE: '创建',
  UPLOAD: '上传',
  DOWNLOAD: '下载',
  SEARCH: '搜索',
  LOGIN: '登录',
  REGISTER: '注册',
  LOGOUT: '退出登录',
  LOAD_MORE: '加载更多',
  VIEW_ALL: '查看全部',
  BACK: '返回',
  NEXT: '下一步',
  PREV: '上一步',
  CONFIRM: '确认',
  REFRESH: '刷新',
  SHARE: '分享',
  FOLLOW: '关注',
  UNFOLLOW: '取消关注',
  LIKE: '点赞',
  COMMENT: '评论',
  COLLECT: '收藏',
  REPORT: '举报',
  REPLY: '回复',
  SEND: '发送',
  PUBLISH: '发布',
  PREVIEW: '预览',
  RESET: '重置',
  FILTER: '筛选',
  SORT: '排序',
  IMPORT: '导入',
  EXPORT: '导出',
  COPY: '复制',
  PASTE: '粘贴',
  CLOSE: '关闭',
  OPEN: '打开',
  MORE: '更多',
  APPLY: '申请',
  JOIN: '加入',
  LEAVE: '退出',
  INVITE: '邀请',
  APPROVE: '通过',
  REJECT: '拒绝',
  BAN: '封禁',
  UNBAN: '解封',
} as const;

/** 空数据提示 */
export const EMPTY_TEXT = {
  NO_DATA: '暂无数据',
  NO_RESULTS: '未找到相关内容',
  NO_COMMENTS: '暂无评论，快来发表第一条评论吧',
  NO_PHOTOS: '暂无作品',
  NO_EQUIPMENT: '暂无器材',
  NO_COURSES: '暂无课程',
  NO_EVENTS: '暂无活动',
  NO_NOTIFICATIONS: '暂无通知',
  NO_FOLLOWERS: '暂无粉丝',
  NO_FOLLOWING: '暂未关注任何人',
  NO_GROUPS: '暂无小组',
  NO_MEMBERS: '暂无成员',
  LOADING: '加载中...',
  ERROR: '加载失败，请稍后重试',
  NETWORK_ERROR: '网络连接失败，请检查网络',
  PAGE_NOT_FOUND: '页面不存在',
  COMING_SOON: '即将上线，敬请期待',
} as const;

/** 社交分享文案 */
export const SHARE_TEXT = {
  WEIBO_TITLE: '我在光影视界发现了一组精彩作品，快来看看吧！',
  QQ_TITLE: '光影视界 - 摄影爱好者交流平台',
  DEFAULT_DESCRIPTION: '探索光影艺术，记录美好瞬间',
} as const;

/** 表单文案 */
export const FORM_TEXT = {
  USERNAME_PLACEHOLDER: '请输入用户名',
  PASSWORD_PLACEHOLDER: '请输入密码',
  EMAIL_PLACEHOLDER: '请输入邮箱',
  PHONE_PLACEHOLDER: '请输入手机号',
  SEARCH_PLACEHOLDER: '搜索作品、摄影师或标签...',
  COMMENT_PLACEHOLDER: '写下你的评论...',
  TITLE_PLACEHOLDER: '请输入标题',
  DESCRIPTION_PLACEHOLDER: '请输入描述',
  REQUIRED: '此项为必填',
  PASSWORD_MISMATCH: '两次密码输入不一致',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_PHONE: '请输入有效的手机号',
  MIN_LENGTH: (min: number) => `至少输入${min}个字符`,
  MAX_LENGTH: (max: number) => `最多输入${max}个字符`,
} as const;