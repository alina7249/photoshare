import React from 'react';

interface StatsCardProps {
  title: string;
  icon: string;
  value: number | string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  icon,
  value,
  description,
  trend,
  trendValue,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`bg-card rounded-xl p-5 border border-accent ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-text-primary flex items-center">
          <i className={`fa-solid ${icon} text-accent mr-2`}></i>
          {title}
        </h3>
        {actionText && (
          <button 
            onClick={onAction}
            className="text-xs text-accent hover:text-text-muted"
          >
            {actionText}
          </button>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-text-muted/70 mb-4">{description}</p>
      )}
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          {trend && trendValue && (
            <div className={`flex items-center mt-1 text-xs ${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}>
              <i className={`fa-solid ${trend === 'up' ? 'fa-arrow-up' : trend === 'down' ? 'fa-arrow-down' : 'fa-minus'}`}></i>
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        
        {onAction && (
          <button className="px-3 py-1 bg-accent text-text-primary rounded-lg text-xs hover:bg-accent-hover transition-colors">
            {actionText || '查看'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StatsCard;