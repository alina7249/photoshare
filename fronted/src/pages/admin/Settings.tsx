import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Button from '../../components/common/Button';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'permissions' | 'notifications' | 'backup'>('system');
  
  // 系统设置表单状态
  const [siteName, setSiteName] = useState('影研社');
  const [siteDescription, setSiteDescription] = useState('专业摄影创作与交流平台，连接全球摄影人');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState('20');
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState('zh-CN');
  
  // 安全设置表单状态
  const [passwordComplexity, setPasswordComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [loginAttempts, setLoginAttempts] = useState('5');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // 处理保存设置
  const handleSaveSettings = () => {
    toast.success('设置已保存');
  };
  
  // 处理取消设置
  const handleCancel = () => {
    toast.info('已取消更改');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#F5F7FA]">系统设置</h1>
        <div className="ml-4 px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs font-medium">
          仅超级管理员可访问
        </div>
      </div>

      {/* 设置类型标签页 */}
      <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden">
        <div className="flex border-b border-[#4A5F8B] flex-wrap">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'system'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-cog mr-2"></i>
            系统设置
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-shield-alt mr-2"></i>
            安全设置
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-user-shield mr-2"></i>
            权限管理
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-bell mr-2"></i>
            通知设置
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
              activeTab === 'backup'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-database mr-2"></i>
            备份恢复
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {/* 系统设置 */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">基本设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">网站名称</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">网站描述</label>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[80px]"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">默认语言</label>
                    <select
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                      <option value="ja-JP">日本語</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">最大上传文件大小 (MB)</label>
                    <input
                      type="number"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-[#B8C6D8] mb-2">维护模式</label>
                        <p className="text-xs text-[#6B7C93]">启用后网站将进入维护状态，仅管理员可访问</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-[#B8C6D8] mb-2">允许用户注册</label>
                        <p className="text-xs text-[#6B7C93]">关闭后新用户将无法注册账号</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={enableRegistration}
                          onChange={(e) => setEnableRegistration(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    保存设置
                  </Button>
                </div>
              </div>
              
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">API设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">API接口状态</label>
                    <div className="flex items-center p-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg">
                      <span className="w-3 h-3 bg-[#38B2AC] rounded-full mr-2"></span>
                      <span>已启用</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">API访问密钥</label>
                    <div className="flex items-center justify-between p-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg">
                      <span className="text-mono">***********</span>
                      <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                        <i className="fa-solid fa-refresh"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary">
                    生成新密钥
                  </Button>
                  <Button>
                    保存设置
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 安全设置 */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">密码设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">密码复杂度要求</label>
                    <select
                      value={passwordComplexity}
                      onChange={(e) => setPasswordComplexity(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
                    >
                        <option value="low">低 (至少6位字符)</option>
                        <option value="medium">中 (8位，包含字母和数字)</option>
                        <option value="high" disabled selected>高 (8位，包含大小写字母、数字和特殊符号) - 当前系统强制使用此标准</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">最大登录尝试次数</label>
                    <input
                      type="number"
                      value={loginAttempts}
                      onChange={(e) => setLoginAttempts(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      min="1"
                      max="20"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-[#B8C6D8] mb-2">双因素认证</label>
                        <p className="text-xs text-[#6B7C93]">启用后用户登录需要验证额外的安全码</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={twoFactorAuth}
                          onChange={(e) => setTwoFactorAuth(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    保存设置
                  </Button>
                </div>
              </div>
              
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">会话设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">会话超时时间 (分钟)</label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      min="5"
                      max="120"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary">
                    强制登出所有用户
                  </Button>
                  <Button>
                    保存设置
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 权限管理 */}
          {activeTab === 'permissions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">角色与权限管理</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#4A5F8B]">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">权限项</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">超级管理员</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">管理员</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">运营人员</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4A5F8B]">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">用户管理</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">内容管理</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">小组管理</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">订单管理</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">系统设置</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked readOnly className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    保存设置
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">邮件通知设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-[#B8C6D8] mb-2">启用邮件通知</label>
                        <p className="text-xs text-[#6B7C93]">启用后系统将发送邮件通知给用户</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">SMTP服务器地址</label>
                    <input
                      type="text"
                      defaultValue="smtp.example.com"
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">SMTP服务器端口</label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">用户名</label>
                    <input
                      type="text"
                      defaultValue="admin@example.com"
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-2">密码</label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button variant="secondary">
                    测试连接
                  </Button>
                  <Button>
                    保存设置
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 备份恢复 */}
          {activeTab === 'backup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
                <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">数据备份与恢复</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <div className="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
                      <h3 className="font-medium text-[#F5F7FA] mb-3">创建新备份</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button>
                          <i className="fa-solid fa-database mr-2"></i>
                          备份数据库
                        </Button>
                        <Button>
                          <i className="fa-solid fa-images mr-2"></i>
                          备份媒体文件
                        </Button>
                        <Button>
                          <i className="fa-solid fa-server mr-2"></i>
                          完整备份
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-[#F5F7FA] mb-3">备份历史</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#4A5F8B]">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">备份名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">类型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">大小</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">创建时间</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4A5F8B]">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">完整备份_20231025</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">完整备份</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">1.2 GB</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">2023-10-25 02:00:00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                                  <i className="fa-solid fa-download"></i>
                                </button>
                                <button className="text-[#38B2AC] hover:text-[#38A169] transition-colors">
                                  <i className="fa-solid fa-rotate-left"></i>
                                </button>
                                <button className="text-[#F56565] hover:text-[#E53E3E] transition-colors">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">数据库备份_20231020</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">数据库备份</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">256 MB</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">2023-10-20 02:00:00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                                  <i className="fa-solid fa-download"></i>
                                </button>
                                <button className="text-[#38B2AC] hover:text-[#38A169] transition-colors">
                                  <i className="fa-solid fa-rotate-left"></i>
                                </button>
                                <button className="text-[#F56565] hover:text-[#E53E3E] transition-colors">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">媒体文件备份_20231015</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">媒体文件备份</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">980 MB</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">2023-10-15 02:00:00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                                  <i className="fa-solid fa-download"></i>
                                </button>
                                <button className="text-[#38B2AC] hover:text-[#38A169] transition-colors">
                                  <i className="fa-solid fa-rotate-left"></i>
                                </button>
                                <button className="text-[#F56565] hover:text-[#E53E3E] transition-colors">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
                      <h3 className="font-medium text-[#F5F7FA] mb-3">自动备份设置</h3>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <label className="block text-sm font-medium text-[#B8C6D8] mb-1">启用自动备份</label>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#B8C6D8] mb-2">备份频率</label>
                          <select
                            className="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
                          >
                            <option value="daily">每天</option>
                            <option value="weekly" selected>每周</option>
                            <option value="monthly">每月</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#B8C6D8] mb-2">保留备份数量</label>
                          <input
                            type="number"
                            defaultValue="7"
                            className="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                            min="1"
                            max="30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button>
                    保存设置
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;