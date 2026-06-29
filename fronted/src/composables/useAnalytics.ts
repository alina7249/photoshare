/**
 * 数据分析面板业务逻辑 — 纯 TS，可直接迁移到 Vue3
 */
import { apiGet } from '../services/api';

export type AnalyticsTimeRange = 'day' | 'week' | 'month' | 'year';
export type AnalyticsTab = 'overview' | 'users' | 'content' | 'revenue' | 'engagement';

export const initAnalyticsState = {
  timeRange: 'month' as AnalyticsTimeRange,
  activeTab: 'overview' as AnalyticsTab,
  userGrowthData: [] as any[],
  contentStatsData: [] as any[],
  revenueData: [] as any[],
  userActivityData: [] as any[],
  popularCategoriesData: [] as any[],
};

export const fetchDashboardData = async () => {
  try {
    const res: any = await apiGet('/analytics/dashboard');
    return {
      userGrowthData: res.userGrowthData || [],
      contentStatsData: res.contentStatsData || [],
      revenueData: res.revenueData || [],
      userActivityData: res.userActivityData || [],
      popularCategoriesData: res.popularCategoriesData || [],
    };
  } catch {
    return {
      userGrowthData: [],
      contentStatsData: [],
      revenueData: [],
      userActivityData: [],
      popularCategoriesData: [],
    };
  }
};

export const useAnalytics = () => {
  return {
    initState: initAnalyticsState,
    actions: {
      fetchDashboardData,
    },
  };
};