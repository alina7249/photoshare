import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'primary',
  className = ''
}) => {
  return (
    <div className={`${variant === 'primary' 
      ? 'bg-[#2D3748] rounded-xl p-1 border border-[#4A5F8B]' 
      : 'border-b border-[#4A5F8B]'
    } ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center py-3 px-4 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? variant === 'primary' 
                  ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg' 
                  : 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                : variant === 'primary'
                  ? 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 text-xs opacity-80">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;