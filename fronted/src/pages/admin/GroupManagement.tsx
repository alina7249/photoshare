import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';

// 模拟小组数据
const mockGroups = [
  {
    id: '1',
    name: '风光摄影爱好者',
    description: '专注于分享和交流风光摄影技巧、作品和器材使用经验。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9',
    memberCount: 256,
    postCount: 158,
    status: 'active',
    createdAt: '2023-01-15',
    owner: {
      id: '101',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c'
    }
  },
  {
    id: '2',
    name: '人像摄影交流群',
    description: '探讨人像摄影技巧，分享创作经验和心得。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20setup%20group&sign=c1df4cb85b4f6fab9f97f0f60c9056d7',
    memberCount: 320,
    postCount: 215,
    status: 'active',
    createdAt: '2023-02-10',
    owner: {
      id: '102',
      name: '人像摄影师小雨',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20smiling&sign=620b116509f1022014ac6d9864231ba5'
    }
  },
  {
    id: '3',
    name: '街头摄影联盟',
    description: '记录城市瞬间，分享街头摄影的魅力和技巧。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo%20urban&sign=ed44bded77c174a37b374cc92d3661f4',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20scene%20group&sign=6f3c69be5e9d78d6308b08cfb3df1421',
    memberCount: 180,
    postCount: 176,
    status: 'active',
    createdAt: '2023-03-05',
    owner: {
      id: '103',
      name: '城市摄影师陈默',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1'
    }
  },
  {
    id: '4',
    name: '黑白摄影艺术',
    description: '专注于黑白摄影的创作与欣赏，分享技巧和作品。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photography%20club%20logo&sign=20391fbad91d80cc2bfc64b085492e16',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20art%20monochrome%20group&sign=d0d50bf259aa980b08ef620b4df5094a',
    memberCount: 145,
    postCount: 98,
    status: 'pending',
    createdAt: '2023-03-20',
    owner: {
      id: '104',
      name: '黑白摄影师阿明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20vintage%20style&sign=59a54bc0fa95cdb00b476bf1065e679c'
    }
  },
  {
    id: '5',
    name: '商业摄影圈',
    description: '商业摄影从业者交流平台，分享经验和资源。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photography%20club%20logo&sign=3093fd57b573feda727d456e62bd8b08',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20photography%20studio%20product%20group&sign=c48254752661c0437c0cb036bfe03807',
    memberCount: 98,
    postCount: 64,
    status: 'banned',
    createdAt: '2023-02-28',
    owner: {
      id: '105',
      name: '商业摄影师老张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20commercial%20photographer%20male&sign=55bbeea9b2593639d31ca56d2fbc559c'
    }
  }
];

const GroupManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [groups, setGroups] = useState(mockGroups);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // 过滤和排序小组
  const getFilteredGroups = () => {
    let filtered = [...groups];
    
    // 根据状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(group => group.status === statusFilter);
    }
    
    // 根据搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        group => 
          group.name.toLowerCase().includes(query) || 
          group.description.toLowerCase().includes(query) ||
          group.owner.name.toLowerCase().includes(query)
      );
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'memberCount':
          return b.memberCount - a.memberCount;
        case 'postCount':
          return b.postCount - a.postCount;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  // 处理选择小组
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        const newSelection = prev.filter(id => id !== groupId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, groupId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([]);
      setShowBulkActions(false);
    } else {
      setSelectedGroups(filteredGroups.map(group => group.id));
      setShowBulkActions(true);
    }
  };

  // 处理批量操作
  const handleBulkAction = (action: string) => {
    if (selectedGroups.length === 0) return;
    
    switch (action) {
      case 'active':
        setGroups(prev => 
          prev.map(group => 
            selectedGroups.includes(group.id) 
              ? { ...group, status: 'active' } 
              : group
          )
        );
        toast.success(`已将${selectedGroups.length}个小组设置为活跃状态`);
        break;
      case 'banned':
        setGroups(prev => 
          prev.map(group => 
            selectedGroups.includes(group.id) 
              ? { ...group, status: 'banned' } 
              : group
          )
        );
        toast.success(`已将${selectedGroups.length}个小组禁用`);
        break;
      case 'delete':
        if (window.confirm(`确定要删除选中的${selectedGroups.length}个小组吗？此操作不可撤销。`)) {
          setGroups(prev => prev.filter(group => !selectedGroups.includes(group.id)));
          toast.success(`已删除${selectedGroups.length}个小组`);
        }
        break;
      default:
        break;
    }
    
    setSelectedGroups([]);
    setShowBulkActions(false);
  };

  // 处理单个小组操作
  const handleGroupAction = (groupId: string, action: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/groups/${groupId}`);
        break;
      case 'edit':
        navigate(`/admin/groups/${groupId}/edit`);
        break;
      case 'ban':
        setGroups(prev => 
          prev.map(group => 
            group.id === groupId ? { ...group, status: 'banned' } : group
          )
        );
        toast.success('小组已禁用');
        break;
      case 'unban':
        setGroups(prev => 
          prev.map(group => 
            group.id === groupId ? { ...group, status: 'active' } : group
          )
        );
        toast.success('小组已解除禁用');
        break;
      case 'delete':
        if (window.confirm('确定要删除这个小组吗？此操作不可撤销。')) {
          setGroups(prev => prev.filter(group => group.id !== groupId));
          toast.success('小组已删除');
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">小组管理</h1>
          <p className="text-[#B8C6D8] mt-1">查看和管理所有摄影小组</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <i className="fa-solid fa-plus mr-2"></i>
            创建小组
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索小组名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
          </div>
          
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
            <option value="createdAt">按创建日期排序</option>
            <option value="name">按名称排序</option>
            <option value="memberCount">按成员数量排序</option>
            <option value="postCount">按帖子数量排序</option>
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
            <span>已选择 {selectedGroups.length} 项</span>
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
                setSelectedGroups([]);
                setShowBulkActions(false);
              }}
              className="p-1 text-[#F5F7FA] hover:text-[#B8C6D8] transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </motion.div>
      )}

      {/* 小组列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden hover:shadow-lg transition-all"
          >
            {/* 小组封面 */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={group.coverImage}
                alt={`${group.name} cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {renderStatusBadge(group.status)}
              </div>
              <div className="absolute left-3 bottom-3">
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(group.id)}
                  onChange={() => handleSelectGroup(group.id)}
                  className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                />
              </div>
            </div>
            
            {/* 小组信息 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2D3748] overflow-hidden shadow-lg -mt-8 mr-3 bg-[#1E2532]">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#F5F7FA]">{group.name}</h3>
                    <p className="text-sm text-[#B8C6D8]">创建于 {group.createdAt}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-[#B8C6D8] text-sm mb-4 line-clamp-2">{group.description}</p>
              
              <div className="flex justify-between items-center text-sm text-[#B8C6D8] mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-users mr-1"></i>
                  <span>{group.memberCount} 成员</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-file-lines mr-1"></i>
                  <span>{group.postCount} 帖子</span>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src={group.owner.avatar}
                    alt={group.owner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-[#B8C6D8]">创建者: {group.owner.name}</span>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGroupAction(group.id, 'view')}
                  className="flex-1 py-2 bg-[#1E2532] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"
                >
                  查看详情
                </button>
                <button
                  onClick={() => handleGroupAction(group.id, 'edit')}
                  className="px-3 py-2 bg-[#1E2532] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                {group.status === 'active' ? (
                  <button
                    onClick={() => handleGroupAction(group.id, 'ban')}
                    className="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
                  >
                    <i className="fa-solid fa-ban"></i>
                  </button>
                ) : group.status === 'banned' ? (
                  <button
                    onClick={() => handleGroupAction(group.id, 'unban')}
                    className="px-3 py-2 bg-[#38B2AC] text-white rounded-lg text-sm font-medium hover:bg-[#38A169] transition-colors"
                  >
                    <i className="fa-solid fa-check-circle"></i>
                  </button>
                ) : (
                  <button
                    onClick={() => handleGroupAction(group.id, 'ban')}
                    className="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
                  >
                    <i className="fa-solid fa-times-circle"></i>
                  </button>
                )}
                <button
                  onClick={() => handleGroupAction(group.id, 'delete')}
                  className="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 空状态 */}
      {filteredGroups.length === 0 && (
        <div className="p-12 text-center bg-[#2D3748] rounded-xl border border-[#4A5F8B]">
          <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
            <i className="fa-solid fa-users-rectangle text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无小组</h3>
          <p className="text-[#B8C6D8]">当前没有符合条件的小组</p>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;