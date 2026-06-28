import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';

// 模拟内容数据
const mockContent = [
  {
    id: '1',
    title: '晨曦中的山峦',
    type: 'photo',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9',
    author: {
      id: '101',
      name: '光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc'
    },
    status: 'active',
    createdAt: '2023-10-25',
    views: 1256,
    likes: 324,
    comments: 45
  },
  {
    id: '2',
    title: '城市剪影',
    type: 'photo',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
    author: {
      id: '102',
      name: '城市摄影师陈默',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1'
    },
    status: 'active',
    createdAt: '2023-10-22',
    views: 987,
    likes: 289,
    comments: 37
  },
  {
    id: '3',
    title: '海浪与礁石',
    type: 'photo',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958',
    author: {
      id: '103',
      name: '风景摄影爱好者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91'
    },
    status: 'pending',
    createdAt: '2023-10-18',
    views: 1452,
    likes: 412,
    comments: 53
  },
  {
    id: '4',
    title: '森林晨雾',
    type: 'photo',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
    author: {
      id: '104',
      name: '自然摄影师小林',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nature%20photographer%20female%20smiling&sign=0fc618c5f06a07329a62e32cf23c8ca2'
    },
    status: 'active',
    createdAt: '2023-10-15',
    views: 1328,
    likes: 387,
    comments: 49
  },
  {
    id: '5',
    title: '【分享】我的春季风光摄影心得',
    type: 'post',
    thumbnail: '',
    author: {
      id: '101',
      name: '光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc'
    },
    status: 'active',
    createdAt: '2023-10-10',
    views: 876,
    likes: 145,
    comments: 23
  },
  {
    id: '6',
    title: '请教：关于长曝光拍摄水流的问题',
    type: 'post',
    thumbnail: '',
    author: {
      id: '103',
      name: '风景摄影爱好者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91'
    },
    status: 'active',
    createdAt: '2023-10-05',
    views: 542,
    likes: 89,
    comments: 34
  }
];

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [content, setContent] = useState(mockContent);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

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
        return <span className="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">活跃</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待审核</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已禁用</span>;
      default:
        return <span className="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>;
    }
  };

  // 渲染类型标签
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'photo':
        return <span className="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">摄影作品</span>;
      case 'post':
        return <span className="px-2 py-1 bg-[#9F7AEA]/20 text-[#9F7AEA] text-xs rounded-full">社区帖子</span>;
      default:
        return <span className="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知类型</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">内容管理</h1>
          <p className="text-[#B8C6D8] mt-1">查看和管理所有用户发布的内容</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <i className="fa-solid fa-filter mr-2"></i>
            筛选
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索标题或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
          </div>
          
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
          >
            <option value="all">全部类型</option>
            <option value="photo">摄影作品</option>
            <option value="post">社区帖子</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="pending">待审核</option>
            <option value="banned">已禁用</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
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
          className="bg-[#4A5F8B] p-3 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center text-[#F5F7FA]">
            <i className="fa-solid fa-check-square mr-2"></i>
            <span>已选择 {selectedContent.length} 项</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('active')}
              className="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
            >
              启用
            </button>
            <button
              onClick={() => handleBulkAction('banned')}
              className="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
            >
              禁用
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-[#F56565] text-white rounded-lg hover:bg-[#E53E3E] transition-colors text-sm"
            >
              删除
            </button>
            <button
              onClick={() => {
                setSelectedContent([]);
                setShowBulkActions(false);
              }}
              className="p-1 text-[#F5F7FA] hover:text-[#B8C6D8] transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </motion.div>
      )}

      {/* 内容列表 */}
      <div className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#4A5F8B]">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">预览</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">发布日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">浏览</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">点赞</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">评论</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-[#1E2532] divide-y divide-[#4A5F8B]">
              {filteredContent.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2D3748] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
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
                      <div className="w-16 h-16 rounded-lg bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B]">
                        <i className="fa-solid fa-file-lines text-xl"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
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
                      <div className="ml-2 text-sm text-[#B8C6D8]">
                        {item.author.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                    {item.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                    {item.likes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                    {item.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleContentAction(item.id, 'view')}
                        className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                        title="查看详情"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleContentAction(item.id, 'edit')}
                        className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                        title="编辑内容"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {item.status === 'active' ? (
                        <button
                          onClick={() => handleContentAction(item.id, 'ban')}
                          className="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                          title="禁用内容"
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      ) : item.status === 'banned' ? (
                        <button
                          onClick={() => handleContentAction(item.id, 'unban')}
                          className="text-[#38B2AC] hover:text-[#38A169] transition-colors p-1"
                          title="解除禁用"
                        >
                          <i className="fa-solid fa-check-circle"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleContentAction(item.id, 'ban')}
                          className="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                          title="拒绝审核"
                        >
                          <i className="fa-solid fa-times-circle"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleContentAction(item.id, 'delete')}
                        className="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
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
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-images text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无内容</h3>
            <p className="text-[#B8C6D8]">当前没有符合条件的内容</p>
          </div>
        )}
        
        {/* 分页 */}
        {filteredContent.length > 0 && (
          <div className="px-6 py-4 bg-[#1E2532] border-t border-[#4A5F8B] flex items-center justify-between">
            <div className="text-sm text-[#B8C6D8]">
              显示 1 到 {filteredContent.length} 条，共 {filteredContent.length} 条
            </div>
            <nav className="flex items-center space-x-1">
              <button className="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button className="px-3 py-1 border border-[#4A5F8B] rounded-lg bg-[#4A5F8B] text-[#F5F7FA]">1</button>
              <button className="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
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