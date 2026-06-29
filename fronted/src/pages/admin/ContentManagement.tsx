import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import { apiGet } from '../../lib/api';

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [content, setContent] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    apiGet('/admin/content').then(data => setContent(data)).catch(() => {});
  }, []);

  // 过滤和排序内容
  const getFilteredContent = () => {
    let filtered = [...content];
    
    // 根据类型筛选
    if (contentType !== 'all') {
      filtered = filtered.filter(item => item.type === contentType);
    }
    
    // 根据状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // 根据搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.author.name.toLowerCase().includes(query)
      );
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredContent = getFilteredContent();

  // 处理选择内容
  const handleSelectContent = (contentId: string) => {
    setSelectedContent(prev => {
      if (prev.includes(contentId)) {
        const newSelection = prev.filter(id => id !== contentId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, contentId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedContent.length === filteredContent.length) {
      setSelectedContent([]);
      setShowBulkActions(false);
    } else {
      setSelectedContent(filteredContent.map(item => item.id));
      setShowBulkActions(true);
    }
  };

  // 处理批量操作
  const handleBulkAction = (action: string) => {
    if (selectedContent.length === 0) return;
    
    switch (action) {
      case 'active':
        setContent(prev => 
          prev.map(item => 
            selectedContent.includes(item.id) 
              ? { ...item, status: 'active' } 
              : item
          )
        );
        toast.success(`已将${selectedContent.length}个内容设置为活跃状态`);
        break;
      case 'banned':
        setContent(prev => 
          prev.map(item => 
            selectedContent.includes(item.id) 
              ? { ...item, status: 'banned' } 
              : item
          )
        );
        toast.success(`已将${selectedContent.length}个内容禁用`);
        break;
      case 'delete':
        if (window.confirm(`确定要删除选中的${selectedContent.length}个内容吗？此操作不可撤销。`)) {
          setContent(prev => prev.filter(item => !selectedContent.includes(item.id)));
          toast.success(`已删除${selectedContent.length}个内容`);
        }
        break;
      default:
        break;
    }
    
    setSelectedContent([]);
    setShowBulkActions(false);
  };

  // 处理单个内容操作
  const handleContentAction = (contentId: string, action: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/content/${contentId}`);
        break;
      case 'edit':
        navigate(`/admin/content/${contentId}/edit`);
        break;
      case 'ban':
        setContent(prev => 
          prev.map(item => 
            item.id === contentId ? { ...item, status: 'banned' } : item
          )
        );
        toast.success('内容已禁用');
        break;
      case 'unban':
        setContent(prev => 
          prev.map(item => 
            item.id === contentId ? { ...item, status: 'active' } : item
          )
        );
        toast.success('内容已解除禁用');
        break;
      case 'delete':
        if (window.confirm('确定要删除这个内容吗？此操作不可撤销。')) {
          setContent(prev => prev.filter(item => item.id !== contentId));
          toast.success('内容已删除');
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

  // 渲染类型标签
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'photo':
        return <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">摄影作品</span>;
      case 'post':
        return <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full">社区帖子</span>;
      default:
        return <span className="px-2 py-1 bg-accent-hover/20 text-accent-hover text-xs rounded-full">未知类型</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">内容管理</h1>
          <p className="text-text-muted mt-1">查看和管理所有用户发布的内容</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <i className="fa-solid fa-filter mr-2"></i>
            筛选
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-card p-4 rounded-xl border border-accent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索标题或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-hover"></i>
          </div>
          
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="bg-deep border border-accent text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
          >
            <option value="all">全部类型</option>
            <option value="photo">摄影作品</option>
            <option value="post">社区帖子</option>
          </select>
          
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-deep border border-accent text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
          >
            <option value="createdAt">按发布日期排序</option>
            <option value="title">按标题排序</option>
            <option value="views">按浏览量排序</option>
            <option value="likes">按点赞量排序</option>
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
            <span>已选择 {selectedContent.length} 项</span>
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
                setSelectedContent([]);
                setShowBulkActions(false);
              }}
              className="p-1 text-text-primary hover:text-text-muted transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </motion.div>
      )}

      {/* 内容列表 */}
      <div className="bg-card rounded-xl border border-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-accent">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-accent focus:ring-accent border-accent rounded bg-deep"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">预览</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">发布日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">浏览</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">点赞</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">评论</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-deep divide-y divide-accent">
              {filteredContent.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-card transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                      className="h-4 w-4 text-accent focus:ring-accent border-accent rounded bg-deep"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.type === 'photo' && item.thumbnail ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                        <i className="fa-solid fa-file-lines text-xl"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderTypeBadge(item.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={item.author.avatar}
                          alt={item.author.name}
                        />
                      </div>
                      <div className="ml-2 text-sm text-text-muted">
                        {item.author.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {item.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {item.likes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {item.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleContentAction(item.id, 'view')}
                        className="text-accent hover:text-accent-hover transition-colors p-1"
                        title="查看详情"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleContentAction(item.id, 'edit')}
                        className="text-accent hover:text-accent-hover transition-colors p-1"
                        title="编辑内容"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {item.status === 'active' ? (
                        <button
                          onClick={() => handleContentAction(item.id, 'ban')}
                          className="text-danger hover:text-danger transition-colors p-1"
                          title="禁用内容"
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      ) : item.status === 'banned' ? (
                        <button
                          onClick={() => handleContentAction(item.id, 'unban')}
                          className="text-teal hover:text-success-dark transition-colors p-1"
                          title="解除禁用"
                        >
                          <i className="fa-solid fa-check-circle"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleContentAction(item.id, 'ban')}
                          className="text-danger hover:text-danger transition-colors p-1"
                          title="拒绝审核"
                        >
                          <i className="fa-solid fa-times-circle"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleContentAction(item.id, 'delete')}
                        className="text-danger hover:text-danger transition-colors p-1"
                        title="删除内容"
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
        {filteredContent.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
              <i className="fa-solid fa-images text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">暂无内容</h3>
            <p className="text-text-muted">当前没有符合条件的内容</p>
          </div>
        )}
        
        {/* 分页 */}
        {filteredContent.length > 0 && (
          <div className="px-6 py-4 bg-deep border-t border-accent flex items-center justify-between">
            <div className="text-sm text-text-muted">
              显示 1 到 {filteredContent.length} 条，共 {filteredContent.length} 条
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

export default ContentManagement;