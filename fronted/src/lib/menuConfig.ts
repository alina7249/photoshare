// 菜单配置数据 - 供多个组件复用
// 个人中心页面已整合为2个页面：Profile（用户主页）和 ProfileSettings（个人设置）
export const profileMenuItems = [
  { id: 'profile', icon: 'fa-user', text: '个人主页', link: '/profile' },
  { id: 'settings', icon: 'fa-cog', text: '设置', link: '/profile/settings' },
];