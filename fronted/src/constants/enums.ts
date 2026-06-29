/**
 * 枚举常量 — 严格对齐后端 Java 实体
 * 命名使用全大写下划线风格，与后端 Java 枚举保持一致
 *
 * 对应后端文件：
 * - UserRoleEnum: model/enums/UserRoleEnum.java
 * - EquipmentTypeEnum: constant/EquipmentTypeEnum.java
 * - TradeTypeEnum: constant/TradeTypeEnum.java
 * - NotificationTypeEnum: constant/NotificationTypeEnum.java
 */

// ===================== 用户角色 =====================
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  BAN = 'ban',
}

// ===================== 器材类型 =====================
export enum EquipmentTypeEnum {
  CAMERA_BODY = 'CAMERA_BODY',
  CAMERA_LENS = 'CAMERA_LENS',
  FLASH = 'FLASH',
  TRIPOD = 'TRIPOD',
  FILTER = 'FILTER',
  MEMORY_CARD = 'MEMORY_CARD',
  CAMERA_BAG = 'CAMERA_BAG',
  STUDIO_LIGHTING = 'STUDIO_LIGHTING',
  ACCESSORY = 'ACCESSORY',
}

/** 器材类型展示名（前端 UI 用） */
export const EQUIPMENT_TYPE = {
  CAMERA: '相机',
  LENS: '镜头',
  DRONE: '无人机',
  TRIPOD: '三脚架',
  FLASH: '闪光灯',
  FILTER: '滤镜',
  ACCESSORY: '配件',
} as const;

// ===================== 交易类型 =====================
export enum TradeTypeEnum {
  NEW = 'new',
  USED = 'used',
}

// ===================== 通知类型 =====================
export enum NotificationTypeEnum {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  SYSTEM = 'system',
}

// ===================== 作品状态 =====================
export enum PostStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REVIEWING = 'reviewing',
  REJECTED = 'rejected',
}

// ===================== 作品可见性 =====================
export enum VisibilityEnum {
  PUBLIC = 'public',
  FRIENDS_ONLY = 'friends_only',
  PRIVATE = 'private',
}

// ===================== 作品格式 =====================
export enum ImageFormatEnum {
  RAW = 'RAW',
  JPG = 'JPG',
  PNG = 'PNG',
  TIFF = 'TIFF',
}