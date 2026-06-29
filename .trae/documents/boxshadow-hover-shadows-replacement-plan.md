# boxShadow 硬编码值替换为 HOVER_SHADOWS 常量 — 执行计划

## 摘要

将 `/workspace/fronted/src/` 下 12 个文件中 framer-motion `whileHover` 内的硬编码 `boxShadow` 值替换为从 `../constants/theme` 导入的 `HOVER_SHADOWS` 常量。Tier 1（7 个文件）已完成，本计划覆盖 Tier 2（5 个文件）和 Tier 3（7 个文件，`PhotoComments.tsx` 无匹配项，跳过）。

## 当前状态

- **常量文件**: `/workspace/fronted/src/constants/theme.ts` — 已存在，导出 `HOVER_SHADOWS` 常量，包含 6 个阴影值
- **Tier 1**: 7 个文件已完成修改（Card.tsx, Feature.tsx, EventCard.tsx, EquipmentRecommendations.tsx, CommentSection.tsx, EquipmentDatabase.tsx, Community.tsx）
- **Tier 2**: 5 个文件待修改
- **Tier 3**: 7 个文件待修改（PhotoComments.tsx 无 whileHover boxShadow，跳过）

## HOVER_SHADOWS 映射表

| 常量 | 值 |
|------|-----|
| `HOVER_SHADOWS.ACCENT_MD` | `'0 2px 12px rgba(74, 95, 139, 0.3)'` |
| `HOVER_SHADOWS.ACCENT_XL` | `'0 10px 25px -5px rgba(74, 95, 139, 0.2)'` |
| `HOVER_SHADOWS.ACCENT_LG` | `'0 8px 24px rgba(74, 95, 139, 0.3)'` |
| `HOVER_SHADOWS.SOFT` | `'0 2px 12px rgba(74, 95, 139, 0.2)'` |
| `HOVER_SHADOWS.DARK_SM` | `'0 2px 8px rgba(0, 0, 0, 0.1)'` |
| `HOVER_SHADOWS.DARK_LG` | `'0 8px 24px rgba(0, 0, 0, 0.15)'` |

## 详细修改计划

### Tier 2（5 个文件）

#### 1. `/workspace/fronted/src/pages/EquipmentLibrary.tsx`
- **当前第 1 行**: `import { buildCozeImageUrl } from '../constants/api';`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 407 行替换**: `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}`
- **替换为**: `whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}`

#### 2. `/workspace/fronted/src/pages/EquipmentReview.tsx`
- **当前第 7 行**: `import { CHART_COLORS } from '../constants/theme';`
- **导入操作**: 修改第 7 行为 `import { CHART_COLORS, HOVER_SHADOWS } from '../constants/theme';`
- **第 316 行替换**: `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}`
- **替换为**: `whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}`

#### 3. `/workspace/fronted/src/pages/EquipmentTrade.tsx`
- **当前第 1 行**: `import React, { useState, useEffect } from "react";`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 1962 行替换**: `"0 2px 12px rgba(74, 95, 139, 0.3)"` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)"`（在 whileHover 内）
- **替换为**: `boxShadow: HOVER_SHADOWS.ACCENT_MD`

#### 4. `/workspace/fronted/src/components/EquipmentQuestions.tsx`
- **当前第 1 行**: `import { buildCozeImageUrl } from '../constants/api';`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 969 行替换**: 条件性 boxShadow，只替换 dark 分支
- **匹配行原文**: `boxShadow: theme === 'dark' ? "0 8px 24px rgba(74,95,139,0.3)" : "0 8px 24px rgba(0,0,0,0.1)",`
- **替换为**: `boxShadow: theme === 'dark' ? HOVER_SHADOWS.ACCENT_LG : "0 8px 24px rgba(0,0,0,0.1)",`
- **注意**: 实际值 `0 8px 24px` 匹配 `ACCENT_LG`，非任务描述中的 `ACCENT_MD`

#### 5. `/workspace/fronted/src/pages/CourseDetail.tsx`
- **当前第 1 行**: `import React, { useState, useEffect } from 'react';`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 737 行替换**: `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}`
- **替换为**: `whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}`

### Tier 3（7 个文件）

#### 6. `/workspace/fronted/src/pages/PostDetail.tsx`
- **当前第 1 行**: `import React, { useState, useEffect } from 'react';`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 177 行替换**: `"0 8px 24px rgba(74,95,139,0.3)"` → `HOVER_SHADOWS.ACCENT_LG`
- **匹配行原文**: `boxShadow: "0 8px 24px rgba(74,95,139,0.3)",`（在 whileHover 内）
- **替换为**: `boxShadow: HOVER_SHADOWS.ACCENT_LG,`

#### 7. `/workspace/fronted/src/pages/PhotographyContests.tsx`
- **当前第 1 行**: 注释行，第 7 行 `import React, { useState, useEffect } from 'react';`
- **导入操作**: 在第 7 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 252 行替换**: `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}`
- **替换为**: `whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}`

#### 8. `/workspace/fronted/src/pages/OfflineEvents.tsx`
- **当前第 1 行**: `import React, { useState, useEffect } from 'react';`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 216 行替换**: `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}`
- **替换为**: `whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}`

#### 9. `/workspace/fronted/src/pages/OnlineCourses.tsx`
- **当前第 1 行**: 注释行，第 8 行 `import React, { useEffect, useState } from 'react';`
- **导入操作**: 在第 8 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 258、356 行替换**: 两处相同值 `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **使用 `replace_all` 批量替换**

#### 10. `/workspace/fronted/src/pages/TutorialResources.tsx`
- **当前第 1 行**: 注释行，第 7 行 `import React, { useEffect, useState } from 'react';`
- **导入操作**: 在第 7 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 249、316 行替换**: 两处相同值 `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **使用 `replace_all` 批量替换**

#### 11. `/workspace/fronted/src/pages/Resources.tsx`
- **当前第 1 行**: `import React, { useState } from "react";`
- **导入操作**: 在第 1 行后插入 `import { HOVER_SHADOWS } from '../constants/theme';`
- **第 528 行替换**: `"0 2px 12px rgba(74, 95, 139, 0.3)"` → `HOVER_SHADOWS.ACCENT_MD`
- **匹配行原文**: `boxShadow: "0 2px 12px rgba(74, 95, 139, 0.3)"`（在 whileHover 内）
- **替换为**: `boxShadow: HOVER_SHADOWS.ACCENT_MD`

#### 12. `/workspace/fronted/src/pages/ProfileBenefits.tsx`
- **当前第 9 行**: `import { CHART_COLORS } from '../constants/theme';`
- **导入操作**: 修改第 9 行为 `import { CHART_COLORS, HOVER_SHADOWS } from '../constants/theme';`
- **第 401、431、852 行替换**: 三处相同值 `'0 2px 12px rgba(74, 95, 139, 0.3)'` → `HOVER_SHADOWS.ACCENT_MD`
- **使用 `replace_all` 批量替换**

### 跳过的文件

- **`/workspace/fronted/src/pages/PhotoComments.tsx`**: 唯一的 `whileHover` 是 `{ scale: 1.05 }`，不包含 `boxShadow`，无需修改。

## 导入路径汇总

所有文件均在 `src/pages/` 或 `src/components/` 下，使用 `../constants/theme`：
- 无 `src/pages/admin/` 下的文件，不需要 `../../constants/theme`

## 类型汇总

| 文件 | 替换类型 | 替换次数 | 导入方式 |
|------|---------|---------|---------|
| EquipmentLibrary.tsx | ACCENT_MD | 1 | 新增导入行 |
| EquipmentReview.tsx | ACCENT_MD | 1 | 扩展已有导入 |
| EquipmentTrade.tsx | ACCENT_MD | 1 | 新增导入行 |
| EquipmentQuestions.tsx | ACCENT_LG | 1（条件性） | 新增导入行 |
| CourseDetail.tsx | ACCENT_MD | 1 | 新增导入行 |
| PostDetail.tsx | ACCENT_LG | 1 | 新增导入行 |
| PhotographyContests.tsx | ACCENT_MD | 1 | 新增导入行 |
| OfflineEvents.tsx | ACCENT_MD | 1 | 新增导入行 |
| OnlineCourses.tsx | ACCENT_MD | 2 | 新增导入行 |
| TutorialResources.tsx | ACCENT_MD | 2 | 新增导入行 |
| Resources.tsx | ACCENT_MD | 1 | 新增导入行 |
| ProfileBenefits.tsx | ACCENT_MD | 3 | 扩展已有导入 |

## 验证步骤

1. 对每个修改后的文件执行 `grep "boxShadow:.*rgba"` 确认不再有硬编码的 HOVER_SHADOWS 对应值
2. 对每个修改后的文件执行 `grep "HOVER_SHADOWS"` 确认引用了常量
3. 对每个修改后的文件执行 `grep "from.*constants/theme"` 确认导入正确
4. 运行 `npx tsc --noEmit` 检查 TypeScript 编译是否通过