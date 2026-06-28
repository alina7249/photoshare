import { UserRole } from '../contexts/adminAuthContext';

// 菜单项类型定义
interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
  children?: MenuItem[];
}

// 管理员菜单配置
export const adminMenuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/admin',
    icon: 'fa-gauge-high',
    roles: ['superAdmin', 'admin', 'operator']
  },
  {
    key: 'users',
    label: '用户管理',
    path: '/admin/users',
    icon: 'fa-users',
    roles: ['superAdmin', 'admin'],
    children: [
      {
        key: 'allUsers',
        label: '全部用户',
        path: '/admin/users'
      },
      {
        key: 'pendingUsers',
        label: '待审核用户',
        path: '/admin/users/pending'
      },
      {
        key: 'bannedUsers',
        label: '已禁用用户',
        path: '/admin/users/banned'
      }
    ]
  },
  {
    key: 'content',
    label: '内容管理',
    path: '/admin/content',
    icon: 'fa-images',
    roles: ['superAdmin', 'admin', 'operator'],
    children: [
      {
        key: 'photos',
        label: '摄影作品',
        path: '/admin/content/photos'
      },
      {
        key: 'posts',
        label: '社区帖子',
        path: '/admin/content/posts'
      },
      {
        key: 'comments',
        label: '评论管理',
        path: '/admin/content/comments'
      }
    ]
  },
  {
    key: 'groups',
    label: '小组管理',
    path: '/admin/groups',
    icon: 'fa-users-rectangle',
    roles: ['superAdmin', 'admin']
  },
  {
    key: 'orders',
    label: '订单管理',
    path: '/admin/orders',
    icon: 'fa-shopping-cart',
    roles: ['superAdmin', 'admin']
  },
  {
    key: 'analytics',
    label: '数据分析',
    path: '/admin/analytics',
    icon: 'fa-chart-line',
    roles: ['superAdmin', 'admin']
  },
  {
    key: 'settings',
    label: '系统设置',
    path: '/admin/settings',
    icon: 'fa-cog',
    roles: ['superAdmin']
  }
];