import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import { apiGet } from '../../lib/api';

const UserManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    apiGet('/admin/users').then(setUsers).catch(console.error);
  }, []);

  // 根据当前路径确定显示的用户类型
  const getCurrentUserType = () => {
    if (location.pathname.includes('/pending')) return 'pending';
    if (location.pathname.includes('/banned')) return 'banned';
    return 'all';
  };

  const currentUserType = getCurrentUserType();

  // 过滤和排序用户
  const getFilteredUsers = () => {
    let filtered = [...users];
    
    // 根据路径过滤用户状态
    if (currentUserType === 'pending') {
      filtered = filtered.filter(user => user.status === 'pending');
    } else if (currentUserType === 'banned') {
      filtered = filtered.filter(user => user.status === 'banned');
    }
    
    // 根据状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // 根据角色筛选
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // 根据搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.username.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'username':
          return a.username.localeCompare(b.username);
        case 'posts':
          return b.posts - a.posts;
        case 'followers':
          return b.followers - a.followers;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // 处理选择用户
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        const newSelection = prev.filter(id => id !== userId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, userId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
      setShowBulkActions(false);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
      setShowBulkActions(true);
    }
  };

  // 处理批量操作
  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    
    switch (action) {
      case 'active':
        setUsers(prev => 
          prev.map(user => 
            selectedUsers.includes(user.id) 
              ? { ...user, status: 'active' } 
              : user
          )
        );
        toast.success(`已将${selectedUsers.length}个用户设置为活跃状态`);
        break;
      case 'banned':
        setUsers(prev => 
          prev.map(user => 
            selectedUsers.includes(user.id) 
              ? { ...user, status: 'banned' } 
              : user
          )
        );
        toast.success(`已将${selectedUsers.length}个用户禁用`);
        break;
      case 'delete':
        if (window.confirm(`确定要删除选中的${selectedUsers.length}个用户吗？此操作不可撤销。`)) {
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          toast.success(`已删除${selectedUsers.length}个用户`);
        }
        break;
      default:
        break;
    }
    
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  // 处理单个用户操作
  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/users/${userId}`);
        break;
      case 'edit':
        navigate(`/admin/users/${userId}/edit`);
        break;
      case 'ban':
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, status: 'banned' } : user
          )
        );
        toast.success('用户已禁用');
        break;
      case 'unban':
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, status: 'active' } : user
          )
        );
        toast.success('用户已解除禁用');
        break;
      case 'delete':
        if (window.confirm('确定要删除这个用户吗？此操作不可撤销。')) {
          setUsers(prev => prev.filter(user => user.id !== userId));
          toast.success('用户已删除');
        }
        break;
      default:
        break;
    }
  };

  // 渲染状态标签
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-teal/20 text-teal text-xs rounded-full">活跃</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-orange/20 text-orange text-xs rounded-full">待审核</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full">已禁用</span>;
      default:
        return <span className="px-2 py-1 bg-accent-hover/20 text-accent-hover text-xs rounded-full">未知</span>;
    }
  };

  // 渲染角色标签
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'user':
        return <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">普通用户</span>;
      case 'photographer':
        return <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full">摄影师</span>;
      case 'admin':
        return <span className="px-2 py-1 bg-pink/20 text-pink text-xs rounded-full">管理员</span>;
      default:
        return <span className="px-2 py-1 bg-accent-hover/20 text-accent-hover text-xs rounded-full">未知</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {currentUserType === 'pending' ? '待审核用户' : currentUserType === 'banned' ? '已禁用用户' : '用户管理'}
          </h1>
          <p className="text-text-muted mt-1">
            {currentUserType === 'pending' 
              ? '管理等待审核的新用户' 
              : currentUserType === 'banned' 
                ? '管理已禁用的用户' 
                : '查看和管理所有用户'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Button>
            <i className="fa-solid fa-plus mr-2"></i>
            添加用户
          </Button>
          <Button variant="secondary">
            <i className="fa-solid fa-upload mr-2"></i>
            批量导入
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-card p-4 rounded-xl border border-accent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-hover"></i>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-deep border border-accent text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="pending">待审核</option>
            <option value="banned">已禁用</option>
          </select>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-deep border border-accent text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
          >
            <option value="all">全部角色</option>
            <option value="user">普通用户</option>
            <option value="photographer">摄影师</option>
            <option value="admin">管理员</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-deep border border-accent text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
          >
            <option value="joinDate">按加入日期排序</option>
            <option value="username">按用户名排序</option>
            <option value="posts">按作品数量排序</option>
            <option value="followers">按粉丝数量排序</option>
          </select>
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {showBulkActions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent p-3 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center text-text-primary">
            <i className="fa-solid fa-check-square mr-2"></i>
            <span>已选择 {selectedUsers.length} 项</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('active')}
              className="px-3 py-1 bg-card text-text-primary rounded-lg hover:bg-accent transition-colors text-sm"
            >
              启用
            </button>
            <button
              onClick={() => handleBulkAction('banned')}
              className="px-3 py-1 bg-card text-text-primary rounded-lg hover:bg-accent transition-colors text-sm"
            >
              禁用
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-danger text-white rounded-lg hover:bg-danger transition-colors text-sm"
            >
              删除
            </button>
            <button
              onClick={() => {
                setSelectedUsers([]);
                setShowBulkActions(false);
              }}
              className="p-1 text-text-primary hover:text-text-muted transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </motion.div>
      )}

      {/* 用户列表 */}
      <div className="bg-card rounded-xl border border-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-accent">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-accent focus:ring-accent border-accent rounded bg-deep"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">用户信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">加入日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">作品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">粉丝</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-deep divide-y divide-accent">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-card transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-accent focus:ring-accent border-accent rounded bg-deep"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.username}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{user.username}</div>
                        <div className="text-sm text-text-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {user.posts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {user.followers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="text-accent hover:text-accent-hover transition-colors p-1"
                        title="查看详情"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'edit')}
                        className="text-accent hover:text-accent-hover transition-colors p-1"
                        title="编辑用户"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-danger hover:text-danger transition-colors p-1"
                          title="禁用用户"
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      ) : user.status === 'banned' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'unban')}
                          className="text-teal hover:text-success-dark transition-colors p-1"
                          title="解除禁用"
                        >
                          <i className="fa-solid fa-check-circle"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-danger hover:text-danger transition-colors p-1"
                          title="拒绝审核"
                        >
                          <i className="fa-solid fa-times-circle"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-danger hover:text-danger transition-colors p-1"
                        title="删除用户"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 空状态 */}
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
              <i className="fa-solid fa-users text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">暂无用户</h3>
            <p className="text-text-muted">
              {currentUserType === 'pending' 
                ? '没有待审核的用户' 
                : currentUserType === 'banned'? '没有被禁用的用户' 
                  : '当前没有符合条件的用户'}
            </p>
          </div>
        )}
        
        {/* 分页 */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-deep border-t border-accent flex items-center justify-between">
            <div className="text-sm text-text-muted">
              显示 1 到 {filteredUsers.length} 条，共 {filteredUsers.length} 条
            </div>
            <nav className="flex items-center space-x-1">
              <button className="px-3 py-1 border border-accent rounded-lg text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button className="px-3 py-1 border border-accent rounded-lg bg-accent text-text-primary">1</button>
              <button className="px-3 py-1 border border-accent rounded-lg text-text-muted hover:bg-accent hover:text-text-primary transition-colors">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;