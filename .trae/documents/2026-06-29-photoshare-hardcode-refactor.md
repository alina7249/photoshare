# 光影视界 — 硬编码全局规范化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将《光影视界》React+TS+Vite 项目中所有硬编码字符串、颜色、API 地址、图片 URL 抽离为统一常量与环境变量，确保后续迁移 Vue3 可完整复用配置，且所有图片链接和显示效果完全不变。

**Architecture:** 新建 `src/constants/` 目录（api.ts / text.ts / enums.ts / theme.ts），纯 TS 无 React 依赖。扩展 `:root` CSS 变量 + `tailwind.config.js` shadow token。创建 `.env.development` / `.env.production` 双环境文件 + `vite-env.d.ts` 类型声明。

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 3, framer-motion 12

---

## 探索发现摘要

| 当前状态 | 详情 |
|---------|------|
| 已有 `.env` | `VITE_API_BASE_URL=http://localhost:8121` |
| `src/lib/api.ts` | 使用 `VITE_API_URL`（与 `.env` 不一致） |
| `src/services/api.ts` | 使用 `VITE_API_BASE_URL`（与 `.env` 一致） |
| 无 `.env.development` / `.env.production` | 需要创建 |
| 无 `vite-env.d.ts` | 需要创建 |
| 无 `src/constants/` 目录 | 需要创建 |
| Coze 图床 URL | 102 处，分布在 15+ 文件中 |
| 器材类型枚举 | 中文硬编码在 EquipmentDatabase.tsx 等 |
| 用户角色 | `'admin'`/`'user'`/`'ban'` 硬编码在 12 个文件中 |
| `photographer.example.com` | 硬编码在 ProfileSettings.tsx |
| rgba 阴影 | 40+ 处，`rgba(74,95,139,0.3)` 重复 20+ 次 |

---

## 第一批：API 常量 + 环境文件

### Task 1: 创建环境文件

**Files:**
- Create: `/workspace/fronted/.env.development`
- Create: `/workspace/fronted/.env.production`
- Modify: `/workspace/fronted/.env`（统一变量名）

- [ ] **Step 1: 创建 `.env.development`**

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_BASE_URL=https://photographer.example.com
VITE_COZE_API_BASE=https://space.coze.cn/api/coze_space
```

- [ ] **Step 2: 创建 `.env.production`**

```bash
# 生产环境
VITE_API_BASE_URL=https://api.photoshare.com
VITE_APP_BASE_URL=https://photographer.example.com
VITE_COZE_API_BASE=https://space.coze.cn/api/coze_space
```

- [ ] **Step 3: 修正 `.env` 变量名**

将 `.env` 中 `VITE_API_BASE_URL=http://localhost:8121` 改为 `VITE_API_BASE_URL=http://localhost:8080`（与 api.ts 的 fallback 一致）。

- [ ] **Step 4: 验证环境变量生效**

```bash
cd /workspace/fronted && pnpm dev:client
```

检查 Vite 启动日志，确认无环境变量警告。

### Task 2: 创建 vite-env.d.ts 类型声明

**Files:**
- Create: `/workspace/fronted/vite-env.d.ts`

- [ ] **Step 1: 写入类型声明文件**

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_COZE_API_BASE: string;
  readonly VITE_PICSUM_BASE_URL: string;
  readonly VITE_DEFAULT_AVATAR: string;
  readonly VITE_DEFAULT_COVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Task 3: 创建 src/constants/api.ts

**Files:**
- Create: `/workspace/fronted/src/constants/api.ts`

- [ ] **Step 1: 写入 API 常量文件**

```ts
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
```

### Task 4: 修改 src/lib/api.ts 和 src/services/api.ts

**Files:**
- Modify: `/workspace/fronted/src/lib/api.ts`
- Modify: `/workspace/fronted/src/services/api.ts`

- [ ] **Step 1: 修改 `src/lib/api.ts` 第 4 行**

将：
```ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

改为：
```ts
import { API_BASE_URL } from '../constants/api';
const BASE_URL = `${API_BASE_URL}/api`;
```

- [ ] **Step 2: 修改 `src/services/api.ts` 第 5 行**

将：
```ts
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8121',
```

改为：
```ts
import { API_BASE_URL } from '../constants/api';
baseURL: API_BASE_URL,
```

---

## 第二批：图片资源常量

### Task 5: 批量替换 Coze 图床 URL

**Files:**
- Create: `/workspace/fronted/src/constants/api.ts`（已在 Task 3 创建）
- Modify: 15 个包含 coze URL 的组件文件

涉及文件列表：
- `src/components/Header.tsx`
- `src/components/Feature.tsx`
- `src/components/Banner.tsx`
- `src/components/CommentSection.tsx`
- `src/components/EquipmentQuestions.tsx`
- `src/components/ProfileSidebar.tsx`
- `src/pages/Home.tsx`
- `src/pages/Community.tsx`
- `src/pages/EventsAndContests.tsx`
- `src/pages/PhotoComments.tsx`
- `src/pages/GroupDetail.tsx`
- `src/pages/EquipmentLibrary.tsx`
- `src/pages/PhotoLocations.tsx`
- `src/pages/EquipmentReview.tsx`
- `src/pages/GroupsList.tsx`

- [ ] **Step 1: 在 api.ts 中导出 buildCozeImageUrl（已在 Task 3 完成）**

- [ ] **Step 2: 全局替换 Coze URL 为函数调用**

使用 sed 批量替换模式。Coze URL 格式为：
```
https://space.coze.cn/api/coze_space/gen_image?image_size=XXX&prompt=YYY&sign=ZZZ
```

替换规则：
- 原始 URL 字符串 → `buildCozeImageUrl('YYY', 'ZZZ', 'XXX')`
- 需要先提取 `prompt`、`sign`、`image_size` 三个参数

**由于 URL 中 prompt 值是 URL 编码的，sed 无法直接处理，需要逐文件手动替换。** 每个文件的替换步骤：

以 `src/pages/Home.tsx` 为例：

```tsx
// 之前
image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52",

// 之后
import { buildCozeImageUrl } from '../constants/api';
image: buildCozeImageUrl('black and white architecture geometric composition', '7f2b53dd226ab1ffb3f3eae704bada52', 'landscape_16_9'),
```

**关键原则：prompt 参数需要 URL 解码回原始文本（`%20` → 空格），因为 `buildCozeImageUrl` 内部会 `encodeURIComponent`。**

需要在每个文件顶部添加 `import { buildCozeImageUrl } from '../constants/api';`。

- [ ] **Step 3: 验证所有 Coze URL 已替换**

```bash
cd /workspace/fronted/src && grep -rn 'space\.coze\.cn' --include="*.tsx" | wc -l
```

期望输出：`0`

- [ ] **Step 4: 启动项目验证图片加载**

```bash
cd /workspace/fronted && pnpm dev:client
```

逐页面检查图片显示与改造前完全一致。

---

## 第三批：颜色/阴影常量（重点）

### Task 6: 扩展 index.css :root 变量

**Files:**
- Modify: `/workspace/fronted/src/index.css:23-35`

- [ ] **Step 1: 在 :root 中新增 RGB 拆分变量和阴影变量**

在 `--canvas-light: #f8fafc;` 之后添加：

```css
  /* RGB 拆分变量（用于 rgba() 动态透明度） */
  --light-blue-gray-rgb: 74, 95, 139;
  --light-accent-rgb: 99, 179, 237;
  --blue-500-rgb: 59, 130, 246;

  /* 阴影变量 */
  --shadow-accent-sm: 0 2px 8px rgba(74, 95, 139, 0.2);
  --shadow-accent-md: 0 2px 12px rgba(74, 95, 139, 0.3);
  --shadow-accent-lg: 0 8px 24px rgba(74, 95, 139, 0.3);
  --shadow-accent-xl: 0 10px 25px -5px rgba(74, 95, 139, 0.2);
  --shadow-light-sm: 0 2px 8px rgba(43, 52, 69, 0.1);
  --shadow-light-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-light-accent-sm: 0 2px 8px rgba(99, 179, 237, 0.3);
  --shadow-blue-md: 0 2px 10px rgba(59, 130, 246, 0.3);
  --shadow-soft: rgba(0, 0, 0, 0.15) 0px 0px 30px 0px;
```

- [ ] **Step 2: 替换 index.css 中的 rgba 硬编码**

将 body 背景和 star-texture 中的 `rgba(74, 95, 139, 0.1)` 替换为 `rgba(var(--light-blue-gray-rgb), 0.1)`：

```css
/* 第 97 行 — body 背景 */
background-image: radial-gradient(circle, rgba(var(--light-blue-gray-rgb), 0.1) 1px, transparent 1px);

/* 第 115 行 — star-texture */
background-image: radial-gradient(circle, rgba(var(--light-blue-gray-rgb), 0.1) 1px, transparent 1px);
```

### Task 7: 创建 src/constants/theme.ts

**Files:**
- Create: `/workspace/fronted/src/constants/theme.ts`

- [ ] **Step 1: 写入主题常量文件**

```ts
// ============================================================
// 颜色常量 — 纯 TS，无框架依赖，可直接复制到 Vue3 项目
// ============================================================

/** 基础颜色（hex 值，用于图表组件的 COLORS 数组） */
export const COLORS = {
  ACCENT: '#4A5F8B',
  ACCENT_RGB: '74, 95, 139',
  ACCENT_HOVER: '#6B7C93',
  ACCENT_HOVER_RGB: '107, 124, 147',
  MUTED: '#B8C6D8',
  MUTED_RGB: '184, 198, 216',
  PRIMARY: '#F5F7FA',
  DEEP: '#1E2532',
  DEEP_RGB: '30, 37, 50',
  CARD: '#2D3748',
  CARD_RGB: '45, 55, 72',
  DARK_SURFACE: '#2B3445',
  DARK_SURFACE_RGB: '43, 52, 69',
  LIGHT_ACCENT: '#63B3ED',
  LIGHT_ACCENT_RGB: '99, 179, 237',
  BLUE_500: '#3B82F6',
  BLUE_500_RGB: '59, 130, 246',
  DANGER: '#F56565',
  SUCCESS: '#48BB78',
  TEAL: '#38B2AC',
  ORANGE: '#F6AD55',
  PURPLE: '#9F7AEA',
  PINK: '#F687B3',
} as const;

/** 阴影常量（引用 CSS 变量） */
export const SHADOWS = {
  ACCENT_SM: 'var(--shadow-accent-sm)',
  ACCENT_MD: 'var(--shadow-accent-md)',
  ACCENT_LG: 'var(--shadow-accent-lg)',
  ACCENT_XL: 'var(--shadow-accent-xl)',
  LIGHT_SM: 'var(--shadow-light-sm)',
  LIGHT_LG: 'var(--shadow-light-lg)',
  LIGHT_ACCENT_SM: 'var(--shadow-light-accent-sm)',
  BLUE_MD: 'var(--shadow-blue-md)',
  SOFT: 'var(--shadow-soft)',
} as const;

/** 图表颜色预设（hex 值，用于 recharts 的 COLORS 数组） */
export const CHART_COLORS = {
  PRIMARY: ['#4A5F8B', '#8884d8', '#6B7C93'] as const,
  EXTENDED: ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391'] as const,
  FULL: ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391', '#B8C6D8'] as const,
  COMPARISON: ['#4A5F8B', '#8884d8', '#6B7C93', '#4CAF50'] as const,
  RADAR: ['#4A5F8B', '#8884d8', '#B8C6D8'] as const,
  DATABASE: ['#4A5F8B', '#8884d8', '#B8C6D8', '#E6EBF2'] as const,
  PROJECT: ['#4A5F8B', '#1E2532'] as const,
} as const;

/** framer-motion whileHover 阴影常量 */
export const HOVER_SHADOWS = {
  accent: '0 2px 12px rgba(74, 95, 139, 0.3)',
  accentXl: '0 10px 25px -5px rgba(74, 95, 139, 0.2)',
  accentLg: '0 8px 24px rgba(74, 95, 139, 0.3)',
  soft: '0 2px 12px rgba(74, 95, 139, 0.2)',
  dark: '0 2px 8px rgba(0, 0, 0, 0.1)',
  darkLg: '0 8px 24px rgba(0, 0, 0, 0.15)',
} as const;
```

### Task 8: 扩展 tailwind.config.js boxShadow

**Files:**
- Modify: `/workspace/fronted/tailwind.config.js:70-75`

- [ ] **Step 1: 在 extend 中添加 boxShadow**

在 `zIndex` 之后添加：

```js
boxShadow: {
  'accent-sm': '0 2px 8px rgba(74, 95, 139, 0.2)',
  'accent-md': '0 2px 12px rgba(74, 95, 139, 0.3)',
  'accent-lg': '0 8px 24px rgba(74, 95, 139, 0.3)',
  'accent-xl': '0 10px 25px -5px rgba(74, 95, 139, 0.2)',
  'light-sm': '0 2px 8px rgba(43, 52, 69, 0.1)',
  'light-lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
  'light-accent-sm': '0 2px 8px rgba(99, 179, 237, 0.3)',
  'blue-md': '0 2px 10px rgba(59, 130, 246, 0.3)',
},
```

### Task 9: 替换组件中的 rgba 阴影硬编码

**Files — 共 15 个文件，分 3 组处理：**

**A 组：Tailwind className 中的 shadow-[...]（改为 Tailwind 自定义类）**

| 文件 | 替换内容 |
|------|---------|
| [Header.tsx:157](file:///workspace/fronted/src/components/Header.tsx#L157) | `shadow-[0_2px_8px_rgba(74,95,139,0.3)]` → `shadow-accent-md`（暗色），`shadow-[0_2px_8px_rgba(99,179,237,0.3)]` → `shadow-light-accent-sm`（亮色） |
| [SearchResult.tsx:111,198,210,246,264,297](file:///workspace/fronted/src/pages/SearchResult.tsx#L111) | `shadow-[0_2px_8px_rgba(43,52,69,0.1)]` → `shadow-light-sm`（6 处） |
| [InputArea.tsx:439](file:///workspace/fronted/src/components/chat/InputArea.tsx#L439) | `shadow-[0_2px_10px_rgba(59,130,246,0.3)]` → `shadow-blue-md` |

**B 组：framer-motion whileHover boxShadow（改为 import 常量）**

| 文件 | 替换内容 |
|------|---------|
| [Card.tsx:40](file:///workspace/fronted/src/components/common/Card.tsx#L40) | `boxShadow: '0 2px 12px rgba(74, 95, 139, 0.2)'` → `import { HOVER_SHADOWS } from '../constants/theme'; boxShadow: HOVER_SHADOWS.soft` |
| [Feature.tsx:70](file:///workspace/fronted/src/components/Feature.tsx#L70) | 同上 |
| [EventCard.tsx:40](file:///workspace/fronted/src/components/EventCard.tsx#L40) | `boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)'` → `boxShadow: HOVER_SHADOWS.accent` |
| [EquipmentRecommendations.tsx:27](file:///workspace/fronted/src/components/EquipmentRecommendations.tsx#L27) | 同上 |
| [EquipmentQuestions.tsx:968,1087](file:///workspace/fronted/src/components/EquipmentQuestions.tsx#L968) | 同上 |
| [CommentSection.tsx:991,1087](file:///workspace/fronted/src/components/CommentSection.tsx#L991) | 同上 |
| [EquipmentDatabase.tsx:167,684](file:///workspace/fronted/src/pages/EquipmentDatabase.tsx#L167) | 同上 |
| [EquipmentLibrary.tsx:406](file:///workspace/fronted/src/pages/EquipmentLibrary.tsx#L406) | 同上 |
| [EquipmentReview.tsx:315](file:///workspace/fronted/src/pages/EquipmentReview.tsx#L315) | 同上 |
| [EquipmentTrade.tsx:1962](file:///workspace/fronted/src/pages/EquipmentTrade.tsx#L1962) | 同上 |
| [CourseDetail.tsx:737](file:///workspace/fronted/src/pages/CourseDetail.tsx#L737) | 同上 |
| [Community.tsx:695,1508](file:///workspace/fronted/src/pages/Community.tsx#L695) | 同上 |
| [PostDetail.tsx:177](file:///workspace/fronted/src/pages/PostDetail.tsx#L177) | `boxShadow: '0 8px 24px rgba(74,95,139,0.3)'` → `boxShadow: HOVER_SHADOWS.accentLg` |
| [PhotographyContests.tsx:252](file:///workspace/fronted/src/pages/PhotographyContests.tsx#L252) | 改为 `boxShadow: HOVER_SHADOWS.accent` |
| [OfflineEvents.tsx:216](file:///workspace/fronted/src/pages/OfflineEvents.tsx#L216) | 同上 |
| [OnlineCourses.tsx:258,356](file:///workspace/fronted/src/pages/OnlineCourses.tsx#L258) | 同上 |
| [TutorialResources.tsx:249,316](file:///workspace/fronted/src/pages/TutorialResources.tsx#L249) | 同上 |
| [Resources.tsx:528](file:///workspace/fronted/src/pages/Resources.tsx#L528) | 同上 |
| [PhotoComments.tsx:379](file:///workspace/fronted/src/pages/PhotoComments.tsx#L379) | `boxShadow: '0 2px 12px rgba(74,95,139,0.2)'` → `boxShadow: HOVER_SHADOWS.soft` |
| [ProfileBenefits.tsx:400,430,851](file:///workspace/fronted/src/pages/ProfileBenefits.tsx#L400) | 改为 `boxShadow: HOVER_SHADOWS.accent` |

**C 组：COLORS 数组（改为 import CHART_COLORS）**

| 文件 | 替换内容 |
|------|---------|
| [Analytics.tsx:24](file:///workspace/fronted/src/pages/admin/Analytics.tsx#L24) | `const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC']` → `import { CHART_COLORS } from '../../constants/theme'; const COLORS = [...CHART_COLORS.PRIMARY]` |
| [Dashboard.tsx:23](file:///workspace/fronted/src/pages/admin/Dashboard.tsx#L23) | 改为 `const COLORS = [...CHART_COLORS.EXTENDED]` |
| [ProfileBenefits.tsx:19](file:///workspace/fronted/src/pages/ProfileBenefits.tsx#L19) | 改为 `const COLORS = [...CHART_COLORS.FULL]` |
| [EquipmentDatabase.tsx:360](file:///workspace/fronted/src/pages/EquipmentDatabase.tsx#L360) | 改为 `const COLORS = [...CHART_COLORS.DATABASE]` |
| [EquipmentComparisonChart.tsx:165](file:///workspace/fronted/src/components/EquipmentComparisonChart.tsx#L165) | 改为 `const COLORS = [...CHART_COLORS.COMPARISON]` |
| [EquipmentReview.tsx:9](file:///workspace/fronted/src/pages/EquipmentReview.tsx#L9) | 改为 `const RADAR_COLORS = [...CHART_COLORS.RADAR]` |
| [ProjectDetail.tsx:158](file:///workspace/fronted/src/pages/ProjectDetail.tsx#L158) | 改为 `const COLORS = [...CHART_COLORS.PROJECT]` |

- [ ] **Step 1: 修复 CourseDetail.tsx:529 的无效语法**

```tsx
// 之前（无效：CSS 不支持 #xxx/30 语法）
style={{ color: i < userRating ? 'var(--light-blue-gray)' : '#4A5F8B/30' }}

// 之后
style={{ color: i < userRating ? 'var(--light-blue-gray)' : 'var(--light-blue-gray)', opacity: i < userRating ? 1 : 0.3 }}
```

---

## 第四批：文案、枚举常量

### Task 10: 创建 src/constants/enums.ts

**Files:**
- Create: `/workspace/fronted/src/constants/enums.ts`

- [ ] **Step 1: 写入枚举常量文件**

```ts
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
```

### Task 11: 创建 src/constants/text.ts

**Files:**
- Create: `/workspace/fronted/src/constants/text.ts`

- [ ] **Step 1: 写入文案常量文件**

```ts
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
```

### Task 12: 替换组件中的硬编码文案

**Files — 选择代表性文件替换，验证模式可行：**

- [ ] **Step 1: 替换 EquipmentDatabase.tsx 中的器材类型**

```tsx
// 之前
{ id: 'cameras', name: '相机', icon: 'fa-camera' },
{ id: 'lenses', name: '镜头', icon: 'fa-video' },

// 之后
import { EQUIPMENT_TYPE } from '../../constants/enums';
{ id: 'cameras', name: EQUIPMENT_TYPE.CAMERA, icon: 'fa-camera' },
{ id: 'lenses', name: EQUIPMENT_TYPE.LENS, icon: 'fa-video' },
```

- [ ] **Step 2: 替换 EquipmentDatabase.tsx 中的器材类型比较**

```tsx
// 之前
const cameras = useMemo(() => allEquipments.filter(e => e.type === '相机' || e.type === '无人机'), [allEquipments]);

// 之后
const cameras = useMemo(() => allEquipments.filter(e => e.type === EQUIPMENT_TYPE.CAMERA || e.type === EQUIPMENT_TYPE.DRONE), [allEquipments]);
```

- [ ] **Step 3: 替换 ProfileSettings.tsx 中的 example.com**

```tsx
// 之前
website: "https://photographer.example.com",

// 之后
import { APP_BASE_URL } from '../../constants/api';
website: APP_BASE_URL,
```

---

## 验证

### Task 13: 全面验证

- [ ] **Step 1: TypeScript 编译检查**

```bash
cd /workspace/fronted && npx tsc --noEmit 2>&1 | head -30
```

期望：无类型错误。

- [ ] **Step 2: 启动项目验证**

```bash
cd /workspace/fronted && pnpm dev:client
```

- [ ] **Step 3: 图片显示验证**

逐页面检查：
- 首页推荐作品图片
- 器材库封面图
- 社区帖子图片
- 用户头像
- 课程封面图
- 活动/比赛封面图

所有图片显示与改造前完全一致。

- [ ] **Step 4: 常量文件独立性验证**

```bash
cd /workspace/fronted/src/constants && grep -rn "react\|framer\|recharts\|zustand" *.ts | wc -l
```

期望输出：`0`（确认无 React 框架依赖）。

- [ ] **Step 5: 环境变量验证**

```bash
cd /workspace/fronted && grep -rn "VITE_API_URL\|VITE_API_BASE_URL" src/ --include="*.ts" --include="*.tsx"
```

确认所有 API 调用都统一使用 `src/constants/api.ts` 导出的 `API_BASE_URL`。

---

## 执行顺序总结

```
第一批（基础设施）：
  Task 1: 创建 .env.development + .env.production
  Task 2: 创建 vite-env.d.ts
  Task 3: 创建 src/constants/api.ts
  Task 4: 修改 src/lib/api.ts + src/services/api.ts

第二批（图片资源）：
  Task 5: 批量替换 Coze 图床 URL（15 个文件）

第三批（颜色/阴影 — 重点）：
  Task 6: 扩展 index.css :root 变量
  Task 7: 创建 src/constants/theme.ts
  Task 8: 扩展 tailwind.config.js boxShadow
  Task 9: 替换组件 rgba 阴影（15 个文件）

第四批（文案/枚举）：
  Task 10: 创建 src/constants/enums.ts
  Task 11: 创建 src/constants/text.ts
  Task 12: 替换组件硬编码文案

验证：
  Task 13: 全面验证
```

---

## 重要约束

1. **图片 URL 零修改**：Coze URL 替换仅改变生成方式，最终 URL 必须与原始完全一致
2. **排除 Captcha.tsx**：验证码的随机 rgba 颜色属于业务逻辑，不抽取
3. **纯 TS 无框架依赖**：constants 目录下所有文件禁止 import React/framer-motion/recharts/zustand
4. **不破坏现有功能**：每次修改后 `pnpm dev:client` 验证
5. **不涉及 Mock 数据**：本次仅做常量抽取，不修改任何数据获取逻辑