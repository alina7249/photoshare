import React from 'react';
import { Link } from 'react-router-dom';
import { useRouter } from '../../router/useRouter';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { adminMenuConfig } from '../../lib/adminMenuConfig';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const router = useRouter();
  const { userRole } = useAdminAuth();
  
  // 根据用户角色过滤菜单项
  const getFilteredMenuItems = () => {
    return adminMenuConfig.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  };
  
  const filteredMenuItems = getFilteredMenuItems();
  
  const isActive = (path: string) => {
    return router.currentPath.includes(path);
  };

  return (
    <div className={`bg-card border-r border-accent transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      {/* 品牌标识 */}
      <div className={`flex items-center justify-center p-4 border-b border-accent ${collapsed ? 'justify-center' : 'justify-start'} px-4`}>
        {!collapsed && (
          <div className="flex items-center">
            <i className="fa-solid fa-camera-retro text-2xl text-accent mr-2"></i>
            <span className="text-xl font-bold">影研社管理</span>
          </div>
        )}
        {collapsed && (
          <i className="fa-solid fa-camera-retro text-2xl text-accent"></i>
        )}
      </div>
      
      {/* 菜单项 */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map(item => (
            <li key={item.key}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-accent text-text-primary'
                    : 'text-text-muted hover:bg-accent/20'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-lg ${collapsed ? 'justify-center' : ''}`}></i>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
              
              {/* 子菜单 */}
              {item.children && !collapsed && isActive(item.path) && (
                <ul className="mt-2 pl-10 space-y-1">
                  {item.children.map(child => (
                    <li key={child.key}>
                      <Link
                        to={child.path}
                        className={`flex items-center p-2 rounded-lg transition-colors ${
                          isActive(child.path)
                            ? 'bg-accent/50 text-text-primary'
                            : 'text-text-muted hover:bg-accent/20'
                        }`}
                      >
                        <span>{child.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* 底部用户信息 */}
      {!collapsed && (
        <div className="p-4 border-t border-accent">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div>
              <div className="text-sm font-medium">管理员</div>
              <div className="text-xs text-accent-hover">{userRole === 'superAdmin' ? '超级管理员' : userRole === 'admin' ? '普通管理员' : '运营人员'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;