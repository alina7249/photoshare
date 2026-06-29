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
      ? 'bg-card rounded-xl p-1 border border-accent' 
      : 'border-b border-accent'
    } ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center py-3 px-4 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? variant === 'primary' 
                  ? 'bg-accent text-text-primary rounded-lg' 
                  : 'text-text-primary border-b-2 border-accent'
                : variant === 'primary'
                  ? 'bg-card text-text-muted hover:text-text-primary'
                  : 'text-text-muted/70 hover:text-text-primary'
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