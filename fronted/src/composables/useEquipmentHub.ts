/**
 * 器材中心 Tab 管理逻辑 — 纯 TS，可直接迁移到 Vue3
 */

export const EQUIPMENT_TABS = [
  { id: 'database', name: '器材库', icon: 'fa-database' },
  { id: 'review', name: '专业测评', icon: 'fa-star' },
  { id: 'trade', name: '二手交易', icon: 'fa-shopping-cart' },
  { id: 'library', name: '资料库', icon: 'fa-book-open' },
] as const;

export type EquipmentTabId = (typeof EQUIPMENT_TABS)[number]['id'];

export const initEquipmentHubState = {
  activeTab: 'database' as EquipmentTabId,
};

/** 从 URL 路径中提取 tab ID */
export const getTabFromPath = (pathname: string): EquipmentTabId => {
  const pathParts = pathname.split('/');
  const tabId = pathParts[2] || 'database';

  if (EQUIPMENT_TABS.some((tab) => tab.id === tabId)) {
    return tabId as EquipmentTabId;
  }
  return 'database';
};

/** 计算导航路径 */
export const getTabNavigationPath = (tabId: EquipmentTabId): string => {
  return tabId === 'database' ? '/equipment' : `/equipment/${tabId}`;
};

export const useEquipmentHub = () => {
  return {
    initState: initEquipmentHubState,
    actions: {
      getTabFromPath,
      getTabNavigationPath,
    },
  };
};