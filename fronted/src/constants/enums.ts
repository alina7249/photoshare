// ============================================================
// 业务枚举 — 纯 TS，无框架依赖，与 SQL 字段值完全对齐
// ============================================================

/** 用户角色（与 SQL userRole 字段值一致） */
export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  BAN: 'ban',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/** 器材类型（与 SQL equipment.type 字段值一致） */
export const EQUIPMENT_TYPE = {
  CAMERA: '相机',
  LENS: '镜头',
  TRIPOD: '三脚架',
  STABILIZER: '稳定器',
  MICROPHONE: '麦克风',
  MEMORY_CARD: '存储卡',
  CAMERA_BAG: '摄影包',
  FLASH: '闪光灯',
  DRONE: '无人机',
} as const;

export type EquipmentType = (typeof EQUIPMENT_TYPE)[keyof typeof EQUIPMENT_TYPE];

/** 交易类型（与 SQL 一致） */
export const TRADE_TYPE = {
  NEW: 'new',
  USED: 'used',
} as const;

export type TradeType = (typeof TRADE_TYPE)[keyof typeof TRADE_TYPE];

/** 通知类型（与 SQL 一致） */
export const NOTIFICATION_TYPE = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  SYSTEM: 'system',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/** 内容类型（与 SQL 一致） */
export const CONTENT_TYPE = {
  PHOTO: 'photo',
  POST: 'post',
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

/** 会员等级（与 SQL membershipLevel 字段值一致） */
export const MEMBERSHIP_LEVEL = {
  NORMAL: 0,
  SILVER: 1,
  GOLD: 2,
  DIAMOND: 3,
} as const;

export type MembershipLevel = (typeof MEMBERSHIP_LEVEL)[keyof typeof MEMBERSHIP_LEVEL];

/** 作品状态（与 SQL status 字段值一致） */
export const WORK_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
} as const;

export type WorkStatus = (typeof WORK_STATUS)[keyof typeof WORK_STATUS];