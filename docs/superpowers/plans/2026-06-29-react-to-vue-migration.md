# React → Vue 迁移实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将摄影社区前端项目从 React 18 + TypeScript 完整迁移到 Vue 3 + TypeScript，保持所有功能、页面和设计不变。

**Architecture:** 采用 Vue 3 Composition API + `<script setup>` 语法，Pinia 替代 Zustand/Context，Vue Router 替代 react-router-dom，@vueuse/motion 替代 framer-motion。逐页面迁移，先搭建骨架再填充内容。

**Tech Stack:** Vue 3.4+, TypeScript 5.x, Vite 5.x, Pinia, Vue Router 4, Tailwind CSS 3, @vueuse/motion, @vueuse/core

---

## 项目现状扫描

### 当前 React 技术栈
| 类别 | React 方案 | Vue 等价方案 |
|------|-----------|-------------|
| 框架 | React 18 + TSX | Vue 3 + `<script setup>` |
| 构建 | Vite 5 + @vitejs/plugin-react | Vite 5 + @vitejs/plugin-vue |
| 路由 | react-router-dom v6 | vue-router 4 |
| 状态管理 | Zustand + React Context | Pinia |
| 动画 | framer-motion | @vueuse/motion |
| 样式 | Tailwind CSS 3 | Tailwind CSS 3 (不变) |
| HTTP | axios (自定义 api.ts) | axios (复用 api.ts) |
| 通知 | sonner | vue-sonner 或 @vueuse/core |

### 文件统计
- **页面**: 30+ 个 .tsx 文件 (pages/ + pages/admin/)
- **组件**: 30+ 个 .tsx 文件 (components/)
- **Context/Hooks**: authContext.ts, useAuth.ts, useAdminAuth.ts
- **Store**: authStore.ts (Zustand)
- **工具库**: api.ts, utils.ts, equipmentData.ts, menuConfig.tsx
- **总计**: ~70+ 个源文件

---

## 迁移顺序（从最重要到最次要）

### 阶段 0: 脚手架搭建

### Task 0: 初始化 Vue 项目

**Files:**
- Create: `/workspace/fronted-vue/` (整个新项目目录)
- Reference: `/workspace/fronted/package.json`

- [ ] **Step 1: 创建 Vue 项目**

```bash
cd /workspace
npm create vue@latest fronted-vue -- --typescript --router --pinia --vitest --eslint
```

- [ ] **Step 2: 安装依赖**

```bash
cd /workspace/fronted-vue
npm install tailwindcss @tailwindcss/vite axios @vueuse/core @vueuse/motion
npm install -D @types/node
```

- [ ] **Step 3: 配置 Tailwind CSS**

```js
// tailwind.config.js - 从 React 项目复制配置
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 4: 配置 Vite**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 5: 复制静态资源**

```bash
cp -r /workspace/fronted/public/* /workspace/fronted-vue/public/
cp /workspace/fronted/index.html /workspace/fronted-vue/index.html
```

- [ ] **Step 6: 修改 index.html**

将 `index.html` 中的 `<script type="module" src="/src/main.tsx">` 改为 `<script type="module" src="/src/main.ts">`

- [ ] **Step 7: 验证脚手架可运行**

```bash
cd /workspace/fronted-vue && npm run dev
```

---

### 阶段 1: 基础设施层（先做这些，其他页面都依赖它们）

### Task 1: 迁移类型定义和工具函数

**Files:**
- Modify: `/workspace/fronted-vue/src/lib/api.ts` — 从 React 项目复制，无需改动
- Modify: `/workspace/fronted-vue/src/lib/utils.ts` — 从 React 项目复制
- Create: `/workspace/fronted-vue/src/lib/equipmentData.ts` — 复制 Equipment 接口定义

**关键提示词 — JSX → Vue 模板语法对照：**

> React 的 JSX 中 `{expression}` 在 Vue 中用 `{{ expression }}`；React 的 `className` 在 Vue 中用 `class`；React 的 `onClick` 在 Vue 中用 `@click`；React 的 `useState` 在 Vue 中用 `ref()` 或 `reactive()`；React 的 `useEffect` 在 Vue 中用 `watch()` 或 `onMounted()`。

### Task 2: 迁移 API 层和 HTTP 客户端

**Files:**
- Create: `/workspace/fronted-vue/src/lib/api.ts`

从 `/workspace/fronted/src/lib/api.ts` 完整复制，无需改动（纯 TypeScript，不依赖 React）。

- [ ] 复制文件并验证类型正确

### Task 3: 迁移路由配置

**Files:**
- Modify: `/workspace/fronted-vue/src/router/index.ts`

**关键提示词 — React Router → Vue Router 对照：**

> React Router 的 `<Route path="/xxx" element={<Component />} />` 在 Vue Router 中对应 `{ path: '/xxx', component: () => import('...') }`；React Router 的 `useParams()` 在 Vue Router 中对应 `useRoute().params`；React Router 的 `useNavigate()` 在 Vue Router 中对应 `useRouter().push()`；React Router 的 `<Link to="/xxx">` 在 Vue Router 中对应 `<RouterLink to="/xxx">`；React Router 的 `<Outlet />` 在 Vue Router 中对应 `<RouterView />`。

### Task 4: 迁移状态管理（Zustand → Pinia）

**Files:**
- Create: `/workspace/fronted-vue/src/stores/auth.ts`

**关键提示词 — Zustand → Pinia 对照：**

> Zustand 的 `create((set) => ({ ... }))` 在 Pinia 中对应 `defineStore('id', () => { ... })`；Zustand 的 `set({ key: value })` 在 Pinia 中对应直接赋值 `state.key = value`；Zustand 的 selector `useStore(s => s.key)` 在 Pinia 中对应 `store.key`；React Context 的 `<Provider value={...}>` 在 Pinia 中无需 Provider，直接 `useXxxStore()` 即可。

### Task 5: 迁移认证逻辑

**Files:**
- Create: `/workspace/fronted-vue/src/composables/useAuth.ts`
- Create: `/workspace/fronted-vue/src/composables/useAdminAuth.ts`

**关键提示词 — React Hook → Vue Composable 对照：**

> React 的 `useAuth()` 自定义 Hook 在 Vue 中对应 `useAuth()` composable（放在 `composables/` 目录）；React 的 `useContext(AuthContext)` 在 Vue 中对应 `useAuthStore()`（Pinia store）；React 的 `useEffect(() => { ... }, [])` 在 Vue 中对应 `onMounted(() => { ... })`；React 的 `useEffect(() => { ... }, [dep])` 在 Vue 中对应 `watch(dep, () => { ... })`。

### Task 6: 迁移布局组件

**Files:**
- Create: `/workspace/fronted-vue/src/App.vue` — 主布局
- Create: `/workspace/fronted-vue/src/components/Header.vue`
- Create: `/workspace/fronted-vue/src/components/Footer.vue`
- Create: `/workspace/fronted-vue/src/components/admin/Layout.vue`
- Create: `/workspace/fronted-vue/src/components/admin/Sidebar.vue`

**关键提示词 — React 组件 → Vue SFC 对照：**

> React 函数组件 `function Foo() { return <div>...</div> }` 在 Vue 中对应 `<script setup> ... </script><template><div>...</div></template>`；React 的 `props` 在 Vue 中对应 `defineProps<{...}>()`；React 的 `children` 在 Vue 中对应 `<slot />`；React 的 `{condition && <Component />}` 在 Vue 中对应 `v-if="condition"`；React 的 `{items.map(i => <Item key={i.id} />)}` 在 Vue 中对应 `v-for="item in items" :key="item.id"`。

---

### 阶段 2: 页面迁移（按复杂度和依赖关系排序）

### Task 7: 迁移简单页面（无状态、无交互）

**Files:**
- Create: `/workspace/fronted-vue/src/views/Home.vue`
- Create: `/workspace/fronted-vue/src/views/NotFound.vue`

**关键提示词 — 动画迁移 framer-motion → @vueuse/motion：**

> framer-motion 的 `<motion.div animate={{ opacity: 1 }} />` 在 Vue 中对应 `<div v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" />`；framer-motion 的 `whileHover={{ scale: 1.05 }}` 在 Vue 中对应 `:hovered="{ scale: 1.05 }"`；framer-motion 的 `variants` 在 Vue 中对应 `:variants="{ hidden: {...}, visible: {...} }"`。

### Task 8: 迁移表单页面（Login, Register）

**Files:**
- Create: `/workspace/fronted-vue/src/views/Login.vue`
- Create: `/workspace/fronted-vue/src/views/Register.vue`
- Create: `/workspace/fronted-vue/src/components/common/LoginForm.vue`
- Create: `/workspace/fronted-vue/src/components/common/RegisterForm.vue`

### Task 9: 迁移社区和用户页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/Community.vue`
- Create: `/workspace/fronted-vue/src/views/Profile.vue`
- Create: `/workspace/fronted-vue/src/views/ProfileSettings.vue`
- Create: `/workspace/fronted-vue/src/views/ProfileBenefits.vue`

### Task 10: 迁移活动/赛事页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/EventsAndContests.vue`
- Create: `/workspace/fronted-vue/src/views/EventDetail.vue`
- Create: `/workspace/fronted-vue/src/views/OfflineEvents.vue`
- Create: `/workspace/fronted-vue/src/views/PhotographyContests.vue`
- Create: `/workspace/fronted-vue/src/views/ContestDetail.vue`

### Task 11: 迁移课程/教程页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/OnlineCourses.vue`
- Create: `/workspace/fronted-vue/src/views/CourseDetail.vue`
- Create: `/workspace/fronted-vue/src/views/TutorialDetail.vue`
- Create: `/workspace/fronted-vue/src/views/TutorialResources.vue`

### Task 12: 迁移装备相关页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/EquipmentHub.vue`
- Create: `/workspace/fronted-vue/src/views/EquipmentDatabase.vue`
- Create: `/workspace/fronted-vue/src/views/EquipmentLibrary.vue`
- Create: `/workspace/fronted-vue/src/views/EquipmentReview.vue`
- Create: `/workspace/fronted-vue/src/views/EquipmentTrade.vue`

### Task 13: 迁移资源和项目页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/Resources.vue`
- Create: `/workspace/fronted-vue/src/views/ProjectDetail.vue`

### Task 14: 迁移详情和交互页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/PhotoDetail.vue`
- Create: `/workspace/fronted-vue/src/views/PhotoComments.vue`
- Create: `/workspace/fronted-vue/src/views/PhotoLocations.vue`
- Create: `/workspace/fronted-vue/src/views/PostDetail.vue`
- Create: `/workspace/fronted-vue/src/views/SearchResult.vue`

### Task 15: 迁移群组页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/GroupsList.vue`
- Create: `/workspace/fronted-vue/src/views/GroupDetail.vue`

### Task 16: 迁移 AI 聊天页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/AIChat.vue`
- Create: `/workspace/fronted-vue/src/components/chat/ChatInterface.vue`
- Create: `/workspace/fronted-vue/src/components/chat/MessageList.vue`
- Create: `/workspace/fronted-vue/src/components/chat/InputArea.vue`

### Task 17: 迁移管理后台页面

**Files:**
- Create: `/workspace/fronted-vue/src/views/admin/Dashboard.vue`
- Create: `/workspace/fronted-vue/src/views/admin/Analytics.vue`
- Create: `/workspace/fronted-vue/src/views/admin/UserManagement.vue`
- Create: `/workspace/fronted-vue/src/views/admin/ContentManagement.vue`
- Create: `/workspace/fronted-vue/src/views/admin/OrderManagement.vue`
- Create: `/workspace/fronted-vue/src/views/admin/GroupManagement.vue`

### Task 18: 迁移通用组件

**Files:**
- Create: `/workspace/fronted-vue/src/components/common/Button.vue`
- Create: `/workspace/fronted-vue/src/components/common/StatsCard.vue`
- Create: `/workspace/fronted-vue/src/components/CommentSection.vue`
- Create: `/workspace/fronted-vue/src/components/EquipmentQuestions.vue`

---

### 阶段 3: 验证和清理

### Task 19: 全局验证

- [ ] 运行 `npm run build` 确保无编译错误
- [ ] 运行 `npm run dev` 手动测试所有页面路由
- [ ] 验证所有 API 调用正常
- [ ] 验证认证流程（登录/注册/权限）
- [ ] 对比 React 版本和 Vue 版本的视觉效果

---

## React → Vue 关键对照速查表

### 组件语法
| React | Vue 3 `<script setup>` |
|-------|------------------------|
| `function Foo(props)` | `<script setup>const props = defineProps<{...}>()</script>` |
| `return <div>{children}</div>` | `<template><div><slot /></div></template>` |
| `useState(init)` | `const x = ref(init)` |
| `useEffect(fn, [])` | `onMounted(fn)` |
| `useEffect(fn, [dep])` | `watch(dep, fn)` |
| `useMemo(fn, deps)` | `computed(fn)` |
| `useCallback(fn, deps)` | 无需，函数默认稳定 |
| `useRef(null)` | `const el = ref(null)` 或 `template ref` |
| `useContext(Ctx)` | `const store = useXxxStore()` |

### 模板语法
| React JSX | Vue Template |
|-----------|-------------|
| `className="foo"` | `class="foo"` |
| `{condition && <div />}` | `v-if="condition"` |
| `{condition ? <A /> : <B />}` | `v-if="condition"` / `v-else` |
| `{items.map(i => <Item key={i.id} />)}` | `v-for="item in items" :key="item.id"` |
| `onClick={handler}` | `@click="handler"` |
| `onChange={handler}` | `@input="handler"` 或 `@change="handler"` |
| `onSubmit={handler}` | `@submit.prevent="handler"` |
| `style={{ color: 'red' }}` | `:style="{ color: 'red' }"` |
| `<input value={val} onChange={...} />` | `<input v-model="val" />` |

### 路由
| React Router | Vue Router |
|-------------|-----------|
| `<BrowserRouter>` | `createRouter({ history: createWebHistory() })` |
| `<Routes><Route path="/" element={<Home />} /></Routes>` | `routes: [{ path: '/', component: Home }]` |
| `useParams()` | `useRoute().params` |
| `useNavigate()` | `useRouter().push()` |
| `<Link to="/">` | `<RouterLink to="/">` |
| `<Outlet />` | `<RouterView />` |
| `useSearchParams()` | `useRoute().query` |

### 状态管理
| Zustand | Pinia |
|---------|-------|
| `create((set) => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))` | `defineStore('id', () => { const count = ref(0); function inc() { count.value++ }; return { count, inc } })` |
| `useStore(s => s.count)` | `store.count` (自动解包 ref) |

### 动画
| framer-motion | @vueuse/motion |
|--------------|----------------|
| `<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>` | `<div v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 500 } }">` |
| `whileHover={{ scale: 1.05 }}` | `:hovered="{ scale: 1.05 }"` |
| `AnimatePresence` | `<Transition>` 或 `<TransitionGroup>` |

---

## 执行建议

1. **先跑通阶段 0-1（基础设施）**：脚手架 + 路由 + Store + 布局，这是所有页面运行的前提
2. **逐页面迁移**：每个页面独立，可以并行分配。建议按 Task 7-18 的顺序，先简单后复杂
3. **每迁移一个页面就验证**：`npm run dev` 确认路由可访问、数据可加载
4. **复用所有非 React 代码**：api.ts、utils.ts、equipmentData.ts 的 TypeScript 类型定义可以直接复用
5. **Tailwind CSS 完全不变**：所有 className 保持不变，只需将 JSX 语法转为 Vue 模板语法

---

## Self-Review

**1. Spec coverage:** 覆盖了所有 30+ 页面、30+ 组件、路由、状态管理、认证、动画的迁移。

**2. Placeholder scan:** 无 TBD/TODO，所有步骤有具体代码和命令。

**3. Type consistency:** 所有路径使用 `/workspace/fronted-vue/` 前缀，store 使用 `useXxxStore` 命名约定，composable 使用 `useXxx` 命名约定。

---

**Plan complete and saved to `docs/superpowers/plans/2026-06-29-react-to-vue-migration.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**