# PhotoShare React 前端重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对现有 React 项目进行视觉重设计，提升设计品质，消除 AI 生成的廉价感，同时不破坏现有功能。

**Architecture:** 基于现有 React 18 + TypeScript + Tailwind CSS 3 + framer-motion 技术栈，按优先级分 7 个阶段逐层升级：字体 → 色彩 → 交互 → 布局 → 组件 → 状态 → 排版打磨。每个阶段独立可交付。

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3, framer-motion 12, Zustand 4, Font Awesome 6

---

## 设计审计结果

### 当前问题清单

| 类别 | 问题 | 严重程度 |
|------|------|----------|
| 色彩 | 所有组件中硬编码 hex 颜色（`bg-[#1E2532]` 等），未使用 Tailwind theme token | **严重** |
| 色彩 | Tailwind config 的 `theme.extend` 为空，未定义项目色板 | **严重** |
| 色彩 | `:root` CSS 变量定义了 6 个颜色但组件中从未引用 | **严重** |
| 色彩 | 两个强调色并存：`#4A5F8B`（深色主题）和 `#63B3ED`（浅色主题） | 中 |
| 字体 | 使用 Noto Sans（系统字体），缺乏品牌个性 | 高 |
| 字体 | 无 `@font-face` 或 Google Fonts 引入 | 高 |
| 字体 | 缺少 `letter-spacing` 微调，标题无负追踪 | 中 |
| 字体 | 标题无 `text-wrap: balance` | 低 |
| 交互 | 移动端菜单有 `to="#"` 死链接（收藏、设置） | 中 |
| 交互 | 部分按钮缺少 `focus-visible` 焦点环 | 中 |
| HTML | `index.html` 缺少 `description`、`og:image` meta 标签 | 中 |
| HTML | 无 favicon | 中 |
| 组件 | Card 组件使用 border + shadow + background 三件套（通用 AI 风格） | 中 |
| 组件 | 推荐艺术家 3 列等宽卡片（最通用的 AI 布局） | 低 |
| 组件 | 使用 `from-[#4A5F8B] to-[#2D3748]` 线性渐变按钮 | 低 |
| 布局 | 使用 `height: 100vh` / `min-height: 100vh`（应改为 `100dvh`） | 低 |
| 策略 | 缺少隐私政策/服务条款链接 | 低 |
| 策略 | 无自定义 404 页面 | 低 |
| 策略 | 无 skip-to-content 链接 | 低 |

### 当前做得好（保留）

- 使用 `<header>`, `<nav>`, `<main>` 语义化 HTML
- 按钮有 hover/active 状态（framer-motion whileHover/whileTap）
- 有暗色/亮色双主题支持
- 使用 Font Awesome 而非 Lucide/Feather（差异化）
- 有 CSS 自定义动画（fadeIn, slideUp, shake）
- 有 dot-grid 背景纹理（`star-texture`）
- 有 `scroll-behavior: smooth` 和平滑过渡

---

## 回答你的问题：先把硬编码改成变量，还是做其他的？

**答案：先做字体替换（第 1 步），再做颜色 Token 化（第 2 步）。**

理由：
- 字体替换是**视觉冲击力最大、风险最低**的改动。换一个字体的效果立竿见影，用户一眼就能感知。
- 硬编码颜色 → Tailwind token 映射是**颜色系统清理的前置工程**，但它本身不改变视觉。它让后续颜色调整变得安全高效。
- 按照 `redesign-existing-projects` 技能的优先级：字体 > 色板 > 交互 > 布局 > 组件 > 状态 > 排版打磨。

**核心提示词（给 AI agent 的指令）：**

> 第一阶段：字体替换。把全局字体从 Noto Sans 换成 Geist（Sans）或 Outfit，用 Google Fonts CDN 引入。标题加 `letter-spacing: -0.02em` 和 `text-wrap: balance`。
>
> 第二阶段：Tailwind 主题 Token 化。把 `tailwind.config.js` 的 `theme.extend.colors` 填满，把 `:root` CSS 变量映射进去。然后全局搜索替换所有 `bg-[#1E2532]`、`text-[#4A5F8B]` 等硬编码为 `bg-background`、`text-accent` 等 token。
>
> 第三阶段开始才是真正的视觉升级：调整色板饱和度、统一强调色、优化卡片阴影、加 hover 微交互。

---

## 阶段一：字体升级

### Task 1: 引入品牌字体

**Files:**
- Modify: `index.html`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: 在 index.html 中引入 Geist 字体**

在 `<head>` 中添加 Google Fonts 链接：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: 在 Tailwind config 中注册字体**

```js
// tailwind.config.js
theme: {
  container: {
    center: true,
  },
  extend: {
    fontFamily: {
      sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['"Geist Mono"', 'monospace'],
    },
  },
},
```

- [ ] **Step 3: 更新 index.css 全局字体**

将 `:root` 中的 `font-family` 改为：

```css
:root {
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  /* ... 其他不变 */
}
```

- [ ] **Step 4: 添加标题排版微调**

在 `index.css` 末尾追加：

```css
/* 标题排版优化 */
h1, h2, h3 {
  letter-spacing: -0.02em;
  text-wrap: balance;
}

/* 数字等宽 */
.font-tabular {
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 5: 验证**

```bash
cd /workspace/fronted && pnpm dev:client
```

打开浏览器确认字体已更换为 Geist，标题有轻微负字间距。

---

## 阶段二：Tailwind 主题 Token 化

### Task 2: 将 CSS 变量映射到 Tailwind theme

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: 扩展 Tailwind 颜色系统**

```js
// tailwind.config.js
theme: {
  container: {
    center: true,
  },
  extend: {
    fontFamily: {
      sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['"Geist Mono"', 'monospace'],
    },
    colors: {
      // 深色主题色板
      'bg-deep': '#1E2532',        // 底层背景
      'bg-card': '#2D3748',        // 卡片/导航背景
      'accent': '#4A5F8B',         // 主强调色
      'accent-hover': '#6B7C93',   // 强调色悬停
      'text-muted': '#B8C6D8',     // 次要文字
      'text-primary': '#F5F7FA',   // 主要文字
      // 亮色主题色板
      'light-accent': '#63B3ED',
      'light-accent-hover': '#4299E1',
      // 语义色
      'danger': '#F56565',
      'success': '#48BB78',
    },
    zIndex: {
      'dropdown': 100,
      'header': 50,
      'modal': 200,
      'toast': 300,
    },
  },
},
```

- [ ] **Step 2: 同步 index.css 中的 CSS 变量**

保持 `:root` 中的 CSS 变量不变（它们作为 fallback），但确保值与 Tailwind token 一致。

- [ ] **Step 3: 全局替换硬编码颜色**

这是一个大规模搜索替换任务。需要替换的模式：

| 搜索模式 | 替换为 | 说明 |
|----------|--------|------|
| `bg-[#1E2532]` | `bg-bg-deep` | 底层背景 |
| `bg-[#2D3748]` | `bg-bg-card` | 卡片背景 |
| `text-[#4A5F8B]` | `text-accent` | 强调文字 |
| `bg-[#4A5F8B]` | `bg-accent` | 强调背景 |
| `border-[#4A5F8B]` | `border-accent` | 强调边框 |
| `text-[#F5F7FA]` | `text-text-primary` | 主要文字 |
| `text-[#B8C6D8]` | `text-text-muted` | 次要文字 |
| `bg-[#6B7C93]` | `bg-accent-hover` | 悬停背景 |
| `text-[#6B7C93]` | `text-accent-hover` | 悬停文字 |
| `bg-[#63B3ED]` | `bg-light-accent` | 亮色强调 |
| `text-[#63B3ED]` | `text-light-accent` | 亮色强调文字 |
| `bg-[#4299E1]` | `bg-light-accent-hover` | 亮色悬停 |
| `text-[#4299E1]` | `text-light-accent-hover` | 亮色悬停文字 |
| `bg-[#F56565]` | `bg-danger` | 危险色 |
| `bg-[#48BB78]` | `bg-success` | 成功色 |
| `text-[#E53E3E]` | `text-danger` | 危险文字 |
| `text-[#48BB78]` | `text-success` | 成功文字 |

涉及的文件（至少）：
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/Banner.tsx`
- `src/components/Feature.tsx`
- `src/components/PhotographyCard.tsx`
- `src/components/Empty.tsx`
- `src/components/common/Button.tsx`
- `src/components/common/Card.tsx`
- `src/components/common/StatsCard.tsx`
- `src/pages/Home.tsx`
- `src/pages/Profile.tsx`
- `src/index.css`

- [ ] **Step 4: 替换 index.css 中的硬编码颜色**

```css
/* 之前 */
::-webkit-scrollbar-track { background: #1E2532; }
::-webkit-scrollbar-thumb { background: #4A5F8B; }
::-webkit-scrollbar-thumb:hover { background: #6B7C93; }

/* 之后 */
::-webkit-scrollbar-track { background: var(--deep-cool-gray); }
::-webkit-scrollbar-thumb { background: var(--light-blue-gray); }
::-webkit-scrollbar-thumb:hover { background: var(--medium-blue-gray); }
```

- [ ] **Step 5: 验证**

```bash
cd /workspace/fronted && pnpm dev:client
```

检查所有页面，确认颜色与之前完全一致（token 映射是 1:1 的，不应有任何视觉变化）。

---

## 阶段三：交互状态补全

### Task 3: 添加焦点环和修复死链接

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: 添加全局焦点环样式**

在 `index.css` 末尾追加：

```css
/* 键盘焦点环 */
*:focus-visible {
  outline: 2px solid var(--light-blue-gray);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: 修复 Header 中的死链接**

将 `to="#"` 替换为实际路由或禁用：

```tsx
// 之前：Header.tsx 第 234-243 行
<Link to="#" ...>收藏</Link>
<Link to="#" ...>设置</Link>

// 之后：改为 button 并添加 disabled 样式
<button
  className="flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#2D3748] text-[#B8C6D8] opacity-50 cursor-not-allowed transition-colors"
  disabled
  title="即将上线"
  onClick={() => setIsMobileMenuOpen(false)}>
  <i className="fa-solid fa-heart mb-1"></i>收藏
</button>
```

---

## 阶段四：布局与间距

### Task 4: 修复 viewport 单位和布局微调

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 替换 vh 为 dvh**

```css
/* 之前 */
body { min-height: 100vh; }

/* 之后 */
body { min-height: 100dvh; }
```

- [ ] **Step 2: 添加容器最大宽度**

在 Tailwind config 中已有 `container: { center: true }`，确认所有页面使用了 `container` 类。

---

## 阶段五：组件模式升级

### Task 5: 优化 Card 组件（去边框化）

**Files:**
- Modify: `src/components/common/Card.tsx`

- [ ] **Step 1: 减少 Card 的视觉重量**

将"边框 + 阴影 + 背景"三件套简化为"背景 + 微阴影"：

```tsx
// 之前
const baseStyles = "rounded-xl overflow-hidden shadow-sm";
const themeStyles = theme === 'dark' 
  ? "bg-[#2D3748] border border-[#4A5F8B]" 
  : "bg-white border border-gray-200";

// 之后
const baseStyles = "rounded-xl overflow-hidden";
const themeStyles = theme === 'dark' 
  ? "bg-[#2D3748] shadow-[0_2px_8px_rgba(0,0,0,0.15)]" 
  : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
```

- [ ] **Step 2: 给阴影加上颜色倾向**

```tsx
// hoverVariants 中的 boxShadow
boxShadow: theme === 'dark' 
  ? "0 10px 25px -5px rgba(74, 95, 139, 0.25)"  // 带蓝色倾向的阴影
  : "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
```

### Task 6: 优化推荐艺术家布局（打破 3 列对称）

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 改为左右交替布局**

将 3 列等宽卡片改为 2 列 zig-zag 布局：

```tsx
{/* 推荐艺术家 - 改为 zig-zag */}
<div className="space-y-3">
  {featuredPhotographers.map((photographer, index) => (
    <div key={photographer.id} className={`flex items-center justify-between p-3 rounded-lg ${
      index % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#1E2532]'
    }`}>
      {/* ... 内容不变 ... */}
    </div>
  ))}
</div>
```

---

## 阶段六：状态补全

### Task 7: 添加 HTML meta 标签和 favicon

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 添加 SEO meta 标签**

```html
<meta name="description" content="影研社 - 摄影爱好者交流平台，探索黑白光影、胶片质感、极简主义摄影艺术" />
<meta property="og:title" content="影研社 - 摄影爱好者交流平台" />
<meta property="og:description" content="探索黑白光影、胶片质感、极简主义摄影艺术" />
<meta property="og:type" content="website" />
```

- [ ] **Step 2: 添加 favicon**

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📷</text></svg>" />
```

### Task 8: 添加 Footer 法律链接

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 在 Footer 中添加隐私政策/服务条款链接**

```tsx
<div className="text-xs text-[#B8C6D8] mt-2 space-x-4">
  <Link to="/privacy" className="hover:text-[#F5F7FA] transition-colors">隐私政策</Link>
  <Link to="/terms" className="hover:text-[#F5F7FA] transition-colors">服务条款</Link>
</div>
```

---

## 阶段七：排版打磨

### Task 9: 优化标题层级和间距

**Files:**
- Modify: `src/index.css`
- Modify: 所有页面组件

- [ ] **Step 1: 建立排版比例**

在 `index.css` 中添加：

```css
/* 排版层级 */
.text-display {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.text-headline {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
```

- [ ] **Step 2: 验证**

检查所有页面的标题层级是否一致。

---

## 快速参考：提示词模板

### 给 AI agent 执行时的提示词

**Phase 1 提示词：**
> 把 PhotoShare React 项目的字体从 Noto Sans 换成 Geist。在 index.html 添加 Google Fonts CDN 链接，在 tailwind.config.js 的 theme.extend.fontFamily 中注册 sans 和 mono，在 index.css 的 :root 中更新 font-family。最后给 h1-h3 加 letter-spacing: -0.02em 和 text-wrap: balance。

**Phase 2 提示词：**
> 把 PhotoShare 项目中所有 Tailwind 任意值颜色（bg-[#xxx] 格式）替换为 Tailwind theme token。先在 tailwind.config.js 的 theme.extend.colors 中定义完整色板（bg-deep, bg-card, accent, accent-hover, text-muted, text-primary, light-accent, light-accent-hover, danger, success），然后全局搜索替换所有 .tsx 和 .css 文件中的硬编码颜色。替换后颜色必须与原来完全一致。

**Phase 3 提示词：**
> 给 PhotoShare 项目添加全局 focus-visible 焦点环样式，修复 Header 移动端菜单中收藏和设置的死链接（to="#"），改为 disabled button 并加"即将上线"提示。

**Phase 4 提示词：**
> 把 index.css 中的 min-height: 100vh 改为 min-height: 100dvh，修复 iOS Safari 视口 bug。

**Phase 5 提示词：**
> 优化 Card 组件：去掉边框，改用带颜色倾向的阴影。把 Home 页推荐艺术家从 3 列等宽卡片改为 zig-zag 交替行布局。

**Phase 6 提示词：**
> 给 index.html 添加 description、og:title、og:description meta 标签和 favicon。在 Footer 中添加隐私政策和服务条款链接。

**Phase 7 提示词：**
> 在 index.css 中定义 .text-display 和 .text-headline 排版工具类，使用 clamp() 做响应式字号。把页面中的大标题替换为这些类。

---

## 执行顺序总结

```
阶段一：字体替换          ← 最先做，视觉冲击最大
阶段二：颜色 Token 化      ← 基础设施，让后续改动安全
阶段三：交互状态补全       ← 让界面"活起来"
阶段四：布局修复          ← 修复移动端 bug
阶段五：组件模式升级       ← 去 AI 感
阶段六：状态/SEO 补全      ← 让项目"完整"
阶段七：排版打磨          ← 最后的精致感
```

**不要同时做多个阶段**，每个阶段完成后验证再进入下一阶段。每个阶段都是独立可交付的。

---

## 重要约束

- 不迁移框架，不换 CSS 方案
- 不破坏现有功能
- 不改动 API 调用逻辑
- 不改动状态管理（Zustand）
- 不引入新的 npm 依赖（除非必要）
- 每次改动后运行 `pnpm dev:client` 验证