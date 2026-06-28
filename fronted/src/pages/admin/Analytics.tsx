import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatsCard from '../../components/common/StatsCard';

// 模拟数据
const userGrowthData = [
  { date: '1月', users: 4000, newUsers: 2400 },
  { date: '2月', users: 3000, newUsers: 1398 },
  { date: '3月', users: 2000, newUsers: 9800 },
  { date: '4月', users: 2780, newUsers: 3908 },
  { date: '5月', users: 1890, newUsers: 4800 },
  { date: '6月', users: 2390, newUsers: 3800 },
  { date: '7月', users: 3490, newUsers: 4300 }
];

const contentStatsData = [
  { date: '1月', photos: 400, posts: 240, comments: 1800 },
  { date: '2月', photos: 300, posts: 139, comments: 1200 },
  { date: '3月', photos: 200, posts: 98, comments: 900 },
  { date: '4月', photos: 278, posts: 190, comments: 1500 },
  { date: '5月', photos: 189, posts: 148, comments: 1300 },
  { date: '6月', photos: 239, posts: 138, comments: 1100 },
  { date: '7月', photos: 349, posts: 200, comments: 1700 }
];

const revenueData = [
  { month: '1月', amount: 2400 },
  { month: '2月', amount: 1398 },
  { month: '3月', amount: 9800 },
  { month: '4月', amount: 3908 },
  { month: '5月', amount: 4800 },
  { month: '6月', amount: 3800 },
  { month: '7月', amount: 4300 }
];

const userActivityData = [
  { name: '活跃用户', value: 6500 },
  { name: '较活跃用户', value: 2500 },
  { name: '不活跃用户', value: 1000 }
];

const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC'];

const popularCategoriesData = [
  { name: '风光摄影', value: 35 },
  { name: '人像摄影', value: 25 },
  { name: '城市摄影', value: 15 },
  { name: '黑白摄影', value: 10 },
  { name: '生态摄影', value: 8 },
  { name: '其他', value: 7 }
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'revenue' | 'engagement'>('overview');

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">数据分析</h1>
          <p className="text-[#B8C6D8] mt-1">查看系统各项数据分析报表</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="flex bg-[#2D3748] rounded-lg overflow-hidden">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'day' | 'week' | 'month' | 'year')}
                className={`px-3 py-2 text-sm transition-colors ${
                  timeRange === range ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
                }`}
              >
                {range === 'day' ? '日' : range === 'week' ? '周' : range === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors text-sm flex items-center">
            <i className="fa-solid fa-download mr-2"></i>
            导出报表
          </button>
        </div>
      </div>

      {/* 数据概览卡片 */}
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

      {/* 分析类型标签页 */}
      <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden">
        <div className="flex border-b border-[#4A5F8B] flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-chart-pie mr-2"></i>
            概览
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-users mr-2"></i>
            用户分析
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-images mr-2"></i>
            内容分析
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'revenue'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-chart-line mr-2"></i>
            收入分析
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'engagement'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-heart mr-2"></i>
            互动分析
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 用户增长趋势 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">用户增长趋势</h2>
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                        <span className="text-xs text-[#B8C6D8]">总用户</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                        <span className="text-xs text-[#B8C6D8]">新增用户</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userGrowthData}><defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4A5F8B" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4A5F8B" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6B7C93" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6B7C93" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                        <XAxis dataKey="date" stroke="#B8C6D8" />
                        <YAxis stroke="#B8C6D8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#4A5F8B"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                        />
                        <Area
                          type="monotone"
                          dataKey="newUsers"
                          stroke="#6B7C93"
                          fillOpacity={1}
                          fill="url(#colorNewUsers)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* 用户活跃度分布 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">用户活跃度分布</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userActivityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {userActivityData.map((entry, index) => (
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
                    <div className="flex flex-col justify-center">
                      <div className="space-y-4">
                        {userActivityData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></span>
                              <span className="text-sm text-[#B8C6D8]">{item.name}</span>
                            </div>
                            <span className="font-medium text-[#F5F7FA]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 内容类型统计 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">内容类型统计</h2>
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                        <span className="text-xs text-[#B8C6D8]">摄影作品</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                        <span className="text-xs text-[#B8C6D8]">社区帖子</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-[#38B2AC] rounded-full mr-1"></span>
                        <span className="text-xs text-[#B8C6D8]">评论</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentStatsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                        <XAxis dataKey="date" stroke="#B8C6D8" />
                        <YAxis stroke="#B8C6D8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                        />
                        <Bar dataKey="photos" name="摄影作品" fill="#4A5F8B" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="posts" name="社区帖子" fill="#6B7C93" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="comments" name="评论" fill="#38B2AC" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* 热门分类占比 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={popularCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {popularCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                          formatter={(value) => [`${value}%`, '占比']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* 用户分析标签页 */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              {/* 用户增长趋势图 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FA]">用户增长趋势</h2>
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
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* 用户行为分析 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">用户活跃度分布</h2>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userActivityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userActivityData.map((entry, index) => (
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
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={popularCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {popularCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                          formatter={(value) => [`${value}%`, '占比']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* 内容分析标签页 */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* 内容类型统计 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FA]">内容类型统计</h2>
                  <div className="flex space-x-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                      <span className="text-xs text-[#B8C6D8]">摄影作品</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                      <span className="text-xs text-[#B8C6D8]">社区帖子</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-[#38B2AC] rounded-full mr-1"></span>
                      <span className="text-xs text-[#B8C6D8]">评论</span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentStatsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                      <XAxis dataKey="date" stroke="#B8C6D8" />
                      <YAxis stroke="#B8C6D8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                        labelStyle={{ color: "#F5F7FA" }}
                      />
                      <Bar dataKey="photos" name="摄影作品" fill="#4A5F8B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="posts" name="社区帖子" fill="#6B7C93" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" name="评论" fill="#38B2AC" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {/* 收入分析标签页 */}
          {activeTab === 'revenue' && (
            <div className="space-y-8">
              {/* 收入趋势 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#F5F7FA]">收入趋势</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
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
              </motion.div>
            </div>
          )}

          {/* 互动分析标签页 */}
          {activeTab === 'engagement' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 互动趋势 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#F5F7FA]">互动趋势</h2>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={contentStatsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                        <XAxis dataKey="date" stroke="#B8C6D8" />
                        <YAxis stroke="#B8C6D8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="comments"
                          stroke="#4A5F8B"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6, stroke: "#4A5F8B", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* 热门分类占比 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]"
                >
                  <h2 className="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={popularCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {popularCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#2D3748", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                          formatter={(value) => [`${value}%`, '占比']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;