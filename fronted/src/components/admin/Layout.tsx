import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-deep text-text-primary overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar collapsed={sidebarCollapsed} />
      
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <Header toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        
        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto p-6 bg-deep">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;