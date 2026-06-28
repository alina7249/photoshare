import React, { useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';

// 定义 Empty 组件的状态类型
export type EmptyType = 'empty' | 'permission' | 'network' | 'function' | 'disabled';

// 定义 Empty 组件的尺寸类型
export type EmptySize = 'sm' | 'md' | 'lg';

// 定义 Empty 组件的操作按钮类型
export type ActionType = 'primary' | 'secondary' | 'ghost';

// 定义 Empty 组件的全局配置类型
interface EmptyConfig {
  type?: EmptyType;
  effect3d?: boolean;
  showToast?: boolean;
  toastText?: string;
}

// 创建 Empty 全局配置上下文
interface EmptyContextType {
  config: EmptyConfig;
  updateConfig: (config: Partial<EmptyConfig>) => void;
}

export const EmptyContext = React.createContext<EmptyContextType | undefined>(undefined);

// Empty 组件的 Provider 组件
export const EmptyProvider: React.FC<{
  children: React.ReactNode;
  config?: EmptyConfig;
}> = ({ children, config = {} }) => {
  const [globalConfig, setGlobalConfig] = useState<EmptyConfig>({
    type: 'empty',
    effect3d: false,
    showToast: true,
    toastText: 'Coming soon',
    ...config,
  });

  const updateConfig = (newConfig: Partial<EmptyConfig>) => {
    setGlobalConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <EmptyContext.Provider value={{ config: globalConfig, updateConfig }}>
      {children}
    </EmptyContext.Provider>
  );
};

// Empty 组件的 Props 类型定义
export interface EmptyProps {
  type?: EmptyType;
  size?: EmptySize;
  text?: string;
  helperText?: string;
  icon?: string;
  actionText?: string;
  actionType?: ActionType;
  loading?: boolean;
  showToast?: boolean;
  toastText?: string;
  effect3d?: boolean;
  onClick?: () => void;
  onActionClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  cursor?: string;
  children?: React.ReactNode;
}

// 默认配置
const defaultConfig = {
  // 每种状态类型的默认配置
  typeConfig: {
    empty: {
      icon: 'fa-box-open',
      text: '暂无数据',
      helperText: '暂无相关数据，请稍后再试',
      defaultAction: () => toast('暂无数据'),
    },
    permission: {
      icon: 'fa-lock',
      text: '无访问权限',
      helperText: '您没有权限访问此内容',
      defaultAction: () => toast.warning('您没有权限访问此内容'),
    },
    network: {
      icon: 'fa-wifi-slash',
      text: '网络连接失败',
      helperText: '请检查您的网络连接',
      defaultAction: () => window.location.reload(),
    },
    function: {
      icon: 'fa-toolbox',
      text: '功能正在开发中',
      helperText: '此功能即将上线，敬请期待',
      defaultAction: () => toast('功能正在开发中，敬请期待'),
    },
    disabled: {
      icon: 'fa-ban',
      text: '功能已禁用',
      helperText: '该功能目前已被禁用',
      defaultAction: () => {},
    },
  },
  
  // 尺寸配置
  sizeConfig: {
    sm: {
      iconSize: 'text-4xl',
      textSize: 'text-lg',
      helperTextSize: 'text-sm',
      padding: 'p-4',
    },
    md: {
      iconSize: 'text-5xl',
      textSize: 'text-xl',
      helperTextSize: 'text-sm',
      padding: 'p-6',
    },
    lg: {
      iconSize: 'text-6xl',
      textSize: 'text-2xl',
      helperTextSize: 'text-base',
      padding: 'p-8',
    },
  },
  
  // 操作按钮类型配置
  actionTypeConfig: {
    primary: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]',
    secondary: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] border border-[#4A5F8B]',
    ghost: 'bg-transparent text-[#4A5F8B] hover:bg-[#4A5F8B]/10 border border-[#4A5F8B]',
  },
};

// 合并类名的辅助函数
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Empty 组件
export function Empty(props: EmptyProps) {
  const context = useContext(EmptyContext);
  const globalConfig = context?.config || {};
  
  // 合并 props 和全局配置
  const {
    type = globalConfig.type || 'empty',
    size = 'md',
    text,
    helperText,
    icon,
    actionText,
    actionType = 'primary',
    loading = false,
    showToast = globalConfig.showToast !== undefined ? globalConfig.showToast : true,
    toastText = globalConfig.toastText || 'Coming soon',
    effect3d = globalConfig.effect3d || false,
    onClick,
    onActionClick,
    backgroundColor = 'bg-[#2D3748]',
    textColor = 'text-[#F5F7FA]',
    padding,
    cursor = 'cursor-pointer',
    children,
  } = props;
  
  // 获取当前类型的默认配置
  const typeConfig = defaultConfig.typeConfig[type];
  
  // 获取当前尺寸的样式配置
  const sizeConfig = defaultConfig.sizeConfig[size];
  
  // 获取当前操作按钮类型的样式配置
  const actionTypeStyle = defaultConfig.actionTypeConfig[actionType];
  
  // 计算动态样式类
  const containerClasses = useMemo(() => {
    return cn(
      'flex flex-col items-center justify-center',
      padding || sizeConfig.padding,
      backgroundColor,
      'border border-[#4A5F8B] rounded-xl',
      'transition-all duration-300',
      effect3d ? 'transform-style-3d hover:rotate-y-5' : '',
      type === 'disabled' ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
      !loading && !onClick && type !== 'disabled' ? 'cursor-default' : cursor,
      !loading && onClick && type !== 'disabled' ? 'hover:shadow-lg' : ''
    );
  }, [
    padding,
    sizeConfig.padding,
    backgroundColor,
    effect3d,
    type,
    loading,
    onClick,
    cursor
  ]);
  
  const iconClasses = useMemo(() => {
    return cn(
      'fa-solid',
      icon || typeConfig.icon,
      sizeConfig.iconSize,
      'text-[#4A5F8B] mb-4',
      type === 'network' && !loading ? 'animate-pulse-icon' : '',
      loading ? 'fa-spin' : ''
    );
  }, [icon, typeConfig.icon, sizeConfig.iconSize, type, loading]);
  
  const textClasses = useMemo(() => {
    return cn(sizeConfig.textSize, textColor, 'font-medium mb-2');
  }, [sizeConfig.textSize, textColor]);
  
  const helperTextClasses = useMemo(() => {
    return cn(sizeConfig.helperTextSize, 'text-[#B8C6D8] text-center mb-4');
  }, [sizeConfig.helperTextSize]);
  
  const buttonClasses = useMemo(() => {
    return cn(
      'px-4 py-2 rounded-lg transition-colors duration-200',
      actionTypeStyle,
      loading ? 'opacity-50 cursor-not-allowed' : ''
    );
  }, [actionTypeStyle, loading]);
  
  // 处理容器点击
  const handleClick = () => {
    if (!loading && !onClick && showToast && type !== 'disabled') {
      toast(toastText);
    } else if (!loading && onClick && type !== 'disabled') {
      onClick();
    }
  };
  
  // 处理操作按钮点击
  const handleActionClick = () => {
    if (!loading) {
      if (onActionClick) {
        onActionClick();
      } else {
        typeConfig.defaultAction();
      }
    }
  };
  
  // 渲染内容
  if (children) {
    return (
      <div 
        className={containerClasses}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  }
  
  return (
    <div 
      className={containerClasses}
      onClick={handleClick}
      style={{ position: loading ? 'relative' : 'static' }}
    >
      <i className={iconClasses}></i>
      <div className={textClasses}>
        {text || typeConfig.text}
      </div>
      {(helperText || typeConfig.helperText) && (
        <div className={helperTextClasses}>
          {helperText || typeConfig.helperText}
        </div>
      )}
      {actionText && (
        <button 
          className={buttonClasses}
          onClick={(e) => {
            e.stopPropagation();
            handleActionClick();
          }}
          disabled={loading}
        >
          {actionText}
        </button>
      )}
      
      {/* 加载覆盖层 */}
      {loading && (
        <div className="absolute inset-0 bg-[#1E2532]/80 flex items-center justify-center rounded-xl">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-[#4A5F8B]"></i>
        </div>
      )}
    </div>
  );
}

// 默认导出 Empty 组件，确保React.lazy可以正确解析
export default Empty;