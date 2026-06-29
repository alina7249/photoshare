import React, { useState, useEffect } from 'react';
import { apiGet } from '../../lib/api';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatsCard from '../../components/common/StatsCard';
import Button from '../../components/common/Button';

const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391'];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [contentStatsData, setContentStatsData] = useState<any[]>([]);
  const [orderStatsData, setOrderStatsData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    apiGet('/dashboard/stats').then((res: any) => {
      setUserGrowthData(res.userGrowthData || []);
      setContentStatsData(res.contentStatsData || []);
      setOrderStatsData(res.orderStatsData || []);
      setRecentActivities(res.recentActivities || []);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // 模拟刷新数据
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">仪表盘</h1>
          <p className="text-text-muted mt-1">欢迎回来，查看系统运行情况</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-bg-card rounded-lg overflow-hidden">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'day' | 'week' | 'month')}
                className={`px-4 py-2 text-sm transition-colors ${
                  timeRange === range ? 'bg-accent text-text-primary' : 'text-text-muted hover:bg-accent/20'
                }`}
              >
                {range === 'day' ? '今日' : range === 'week' ? '本周' : '本月'}
              </button>
            ))}
          </div>
          <Button onClick={refreshData} loading={loading}>
            <i className="fa-solid fa-arrows-rotate mr-2"></i>
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总用户数"
          icon="fa-users"
          value="12,580"
          trend="up"
          trendValue="+5.2%"
          description="较上月增长"
        />
        <StatsCard
          title="新增用户"
          icon="fa-user-plus"
          value="1,245"
          trend="up"
          trendValue="+8.7%"
          description="本月新增"
        />
        <StatsCard
          title="内容总数"
          icon="fa-images"
          value="8,762"
          trend="up"
          trendValue="+3.1%"
          description="包括作品和帖子"
        />
        <StatsCard
          title="订单收入"
          icon="fa-coins"
          value="¥15,620"
          trend="up"
          trendValue="+12.3%"
          description="本月收入"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户增长趋势 */}
        <div className="lg:col-span-2 bg-bg-card rounded-xl p-6 border border-accent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">用户增长趋势</h2>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-accent rounded-full mr-1"></span>
                <span className="text-xs text-text-muted">总用户</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-accent-hover rounded-full mr-1"></span>
                <span className="text-xs text-text-muted">新增用户</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                <XAxis dataKey="date" stroke="#B8C6D8" />
                <YAxis stroke="#B8C6D8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                  labelStyle={{ color: "#F5F7FA" }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4A5F8B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: "#4A5F8B", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#6B7C93"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: "#6B7C93", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 内容分布 */}
        <div className="bg-bg-card rounded-xl p-6 border border-accent">
          <h2 className="text-lg font-bold text-text-primary mb-4">内容分布</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentStatsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                  labelStyle={{ color: "#F5F7FA" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {contentStatsData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-sm text-text-muted">{item.name}</span>
                <span className="ml-auto text-sm font-medium text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 订单统计和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 订单统计 */}
        <div className="bg-bg-card rounded-xl p-6 border border-accent">
          <h2 className="text-lg font-bold text-text-primary mb-4">订单收入</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                <XAxis dataKey="month" stroke="#B8C6D8" />
                <YAxis stroke="#B8C6D8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                  labelStyle={{ color: "#F5F7FA" }}
                  formatter={(value) => [`¥${value}`, '收入']}
                />
                <Bar dataKey="amount" fill="#4A5F8B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="lg:col-span-2 bg-bg-card rounded-xl p-6 border border-accent">
          <h2 className="text-lg font-bold text-text-primary mb-4">最近活动</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: activity.id * 0.1 }}
                className="flex items-start p-3 bg-bg-deep rounded-lg border border-accent hover:border-accent-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-3 flex-shrink-0">
                  <i className={`fa-solid ${
                    activity.type === '用户注册' ? 'fa-user-plus' :
                    activity.type === '作品发布' ? 'fa-image' :
                    activity.type === '评论' ? 'fa-comment' :
                    activity.type === '订单' ? 'fa-shopping-cart' :
                    activity.type === '小组创建' ? 'fa-users' : 'fa-heart'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium text-text-primary">{activity.user}</span>
                      <span className="mx-2 text-accent-hover">•</span>
                      <span className="text-sm text-accent-hover">{activity.time}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.type === '用户注册' ? 'bg-teal/20 text-teal' :
                      activity.type === '作品发布' ? 'bg-accent/20 text-accent' :
                      activity.type === '评论' ? 'bg-accent-hover/20 text-accent-hover' :
                      activity.type === '订单' ? 'bg-orange/20 text-orange' :
                      activity.type === '小组创建' ? 'bg-purple/20 text-purple' : 'bg-pink/20 text-pink'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-text-muted">{activity.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-accent hover:text-accent-hover transition-colors">
              查看全部活动
              <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;