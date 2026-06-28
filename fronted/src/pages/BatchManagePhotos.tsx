import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { Empty } from '../components/Empty';

// 摄影作品接口定义
interface PhotographyPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  date: string;
  views: number;
  format: 'RAW' | 'JPG';
  visibility: '公开' | '仅好友可见' | '私密';
  copyrightType: '独家授权' | '非独家';
  category: string; // 新增分类字段
}

// 操作历史记录接口
interface OperationHistory {
  id: string;
  action: string;
  count: number;
  timestamp: string;
}

const BatchManagePhotos: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // 基本状态管理
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedPhotos');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, views
  const [selectedTag, setSelectedTag] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // all, public, friends, private
  const [formatFilter, setFormatFilter] = useState('all'); // all, raw, jpg
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, 风景, 人像, etc.
  const [tagToAdd, setTagToAdd] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // 用于批量移动分类
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // 弹窗状态管理
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMoveCategoryModal, setShowMoveCategoryModal] = useState(false);
  const [showRemoveTagModal, setShowRemoveTagModal] = useState(false);
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>(() => {
    const saved = localStorage.getItem('operationHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 模拟用户作品数据
  const mockUserPosts: PhotographyPost[] = [
    {
      id: '1',
      title: '晨曦中的山峦',
      description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 324,
      comments: 45,
      tags: ['风光', '日出', '云海', '自然'],
      date: '2023-10-25',
      views: 1256,
      format: 'RAW',
      visibility: '公开',
      copyrightType: '独家授权',
      category: '风景',
    },
    {
      id: '2',
      title: '城市剪影',
      description: '从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 289,
      comments: 37,
      tags: ['城市', '建筑', '剪影', '夕阳'],
      date: '2023-10-22',
      views: 987,
      format: 'JPG',
      visibility: '公开',
      copyrightType: '非独家',
      category: '城市',
    },
    {
      id: '3',
      title: '海浪与礁石',
      description: '长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 412,
      comments: 53,
      tags: ['海景', '慢门', '自然', '礁石'],
      date: '2023-10-18',
      views: 1452,
      format: 'RAW',
      visibility: '仅好友可见',
      copyrightType: '独家授权',
      category: '风景',
    },
    {
      id: '4',
      title: '森林晨雾',
      description: '在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 387,
      comments: 49,
      tags: ['森林', '晨雾', '丁达尔效应', '自然'],
      date: '2023-10-15',
      views: 1328,
      format: 'JPG',
      visibility: '公开',
      copyrightType: '非独家',
      category: '风景',
    },
    {
      id: '5',
      title: '湖畔日落',
      description: '平静的湖面倒映着绚丽的晚霞，形成对称的美感。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf0746344422a50690ffb6c',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 456,
      comments: 61,
      tags: ['湖泊', '日落', '倒影', '晚霞'],
      date: '2023-10-12',
      views: 1689,
      format: 'RAW',
      visibility: '公开',
      copyrightType: '独家授权',
      category: '风景',
    },
    {
      id: '6',
      title: '星空下的古堡',
      description: '在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 523,
      comments: 78,
      tags: ['星空', '夜景', '古堡', '银河'],
      date: '2023-10-08',
      views: 1976,
      format: 'RAW',
      visibility: '私密',
      copyrightType: '独家授权',
      category: '夜景',
    },
  ];

  // 保存选中状态到本地存储
  useEffect(() => {
    localStorage.setItem('selectedPhotos', JSON.stringify(selectedPhotos));
  }, [selectedPhotos]);

  // 保存操作历史到本地存储
  useEffect(() => {
    localStorage.setItem('operationHistory', JSON.stringify(operationHistory));
  }, [operationHistory]);

  // 添加操作历史记录
  const addHistoryRecord = (action: string, count: number) => {
    const newRecord: OperationHistory = {
      id: `history-${Date.now()}`,
      action,
      count,
      timestamp: new Date().toLocaleString('zh-CN'),
    };
    setOperationHistory(prev => [newRecord, ...prev]);
  };

  // 获取所有标签
  const getAllTags = useMemo(() => {
    const tags = ['全部'];
    mockUserPosts.forEach(post => {
      post.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    return tags;
  }, []);

  // 获取所有分类
  const getAllCategories = useMemo(() => {
    const categories = ['全部'];
    mockUserPosts.forEach(post => {
      if (!categories.includes(post.category)) {
        categories.push(post.category);
      }
    });
    return categories;
  }, []);

  // 过滤和排序作品
  const filteredPosts = useMemo(() => {
    let posts = [...mockUserPosts];
    
    // 按标签过滤
    if (selectedTag !== '全部') {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.description.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // 按可见性过滤
    if (visibilityFilter !== 'all') {
      posts = posts.filter(post => {
        if (visibilityFilter === 'public') return post.visibility === '公开';
        if (visibilityFilter === 'friends') return post.visibility === '仅好友可见';
        if (visibilityFilter === 'private') return post.visibility === '私密';
        return true;
      });
    }
    
    // 按格式过滤
    if (formatFilter !== 'all') {
      posts = posts.filter(post => {
        if (formatFilter === 'raw') return post.format === 'RAW';
        if (formatFilter === 'jpg') return post.format === 'JPG';
        return true;
      });
    }
    
    // 按分类过滤
    if (categoryFilter !== 'all') {
      posts = posts.filter(post => post.category === categoryFilter);
    }
    
    // 排序
    if (sortBy === 'latest') {
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      posts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'views') {
      posts.sort((a, b) => b.views - a.views);
    }
    
    return posts;
  }, [selectedTag, searchTerm, visibilityFilter, formatFilter, categoryFilter, sortBy]);

  // 分页计算
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 生成页码范围
  const getPageRange = () => {
    const range = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4 && start > 1) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  // 切换选中状态
  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(id)) {
        return prev.filter(photoId => photoId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedPhotos.length === filteredPosts.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPosts.map(post => post.id));
    }
  };
  
  // 批量删除
  const handleBatchDelete = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要删除的作品');
      return;
    }
    
    if (window.confirm(`确定要删除选中的 ${selectedPhotos.length} 个作品吗？此操作不可恢复。`)) {
      // 模拟删除操作
      addHistoryRecord('批量删除作品', selectedPhotos.length);
      toast.success(`成功删除 ${selectedPhotos.length} 个作品`);
      setSelectedPhotos([]);
    }
  };
  
  // 批量设置可见性
  const handleBatchVisibility = (visibility: '公开' | '仅好友可见' | '私密') => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要修改的作品');
      return;
    }
    
    // 模拟更新操作
    addHistoryRecord(`批量修改可见性为${visibility}`, selectedPhotos.length);
    toast.success(`成功将 ${selectedPhotos.length} 个作品设置为 ${visibility}`);
  };
  
  // 批量添加标签
  const handleBatchAddTag = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要添加标签的作品');
      return;
    }
    
    if (!tagToAdd.trim()) {
      toast.warning('请输入标签内容');
      return;
    }
    
    // 模拟添加标签操作
    addHistoryRecord(`批量添加标签: ${tagToAdd}`, selectedPhotos.length);
    toast.success(`成功为 ${selectedPhotos.length} 个作品添加标签：${tagToAdd}`);
    setTagToAdd('');
  };

  // 批量移除标签
  const handleBatchRemoveTag = (tagToRemove: string) => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要移除标签的作品');
      return;
    }
    
    // 模拟移除标签操作
    addHistoryRecord(`批量移除标签: ${tagToRemove}`, selectedPhotos.length);
    toast.success(`成功从 ${selectedPhotos.length} 个作品中移除标签：${tagToRemove}`);
    setShowRemoveTagModal(false);
  };

  // 批量移动分类
  const handleBatchMoveCategory = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要移动分类的作品');
      return;
    }
    
    if (!selectedCategory) {
      toast.warning('请选择目标分类');
      return;
    }
    
    // 模拟移动分类操作
    addHistoryRecord(`批量移动到分类: ${selectedCategory}`, selectedPhotos.length);
    toast.success(`成功将 ${selectedPhotos.length} 个作品移动到分类：${selectedCategory}`);
    setShowMoveCategoryModal(false);
    setSelectedCategory('');
  };

  // 批量修改版权类型
  const handleBatchCopyrightType = (copyrightType: '独家授权' | '非独家') => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要修改的作品');
      return;
    }
    
    // 模拟修改版权类型操作
    addHistoryRecord(`批量修改版权类型为${copyrightType}`, selectedPhotos.length);
    toast.success(`成功将 ${selectedPhotos.length} 个作品设置为 ${copyrightType}`);
  };

  // 批量下载
  const handleBatchDownload = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要下载的作品');
      return;
    }
    
    // 模拟下载操作
    addHistoryRecord('批量下载作品', selectedPhotos.length);
    toast.success(`开始下载 ${selectedPhotos.length} 个作品，正在准备文件...`);
    
    // 模拟下载进度
    setTimeout(() => {
      toast.success('下载完成');
    }, 1500);
  };

  // 清空操作历史
  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有操作历史吗？此操作不可恢复。')) {
      setOperationHistory([]);
      localStorage.removeItem('operationHistory');
      toast.success('操作历史已清空');
    }
  };

  // 页码变更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到表格顶部
    document.querySelector('.overflow-x-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-[60vh] text-center"
        >
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的作品，支持批量操作</p>
          <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
            立即登录
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/profile-center/works"
              className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>返回我的作品集</span>
            </Link>
          </motion.div>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">批量管理作品</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            批量删除、修改可见性、添加标签等操作，提高作品管理效率
          </p>
        </div>
        
        {/* 批量操作栏 - 浅蓝灰 #4A5F8B + 浅白 #F5F7FA */}
        <div className="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedPhotos.length > 0 && selectedPhotos.length === filteredPosts.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
              />
              <label htmlFor="select-all" className="ml-2 text-[#B8C6D8]">
                全选 ({selectedPhotos.length}/{filteredPosts.length})
              </label>
            </div>
            
            <div className="flex flex-wrap gap-2 flex-1 md:flex-initial">
              {/* 基本批量操作 */}
              <motion.button 
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBatchDelete}
                disabled={selectedPhotos.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative group ${
                  selectedPhotos.length > 0 
                    ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#F56565]': 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                }`}
              >
                <i className="fa-solid fa-trash mr-2"></i>
                批量删除
                {selectedPhotos.length === 0 && (
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E2532] text-xs text-[#B8C6D8] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    请先选择作品
                  </span>
                )}
              </motion.button>
              
              {/* 批量修改可见性 */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <button 
                  disabled={selectedPhotos.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhotos.length > 0 
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                      : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                  }`}
                >
                  <i className="fa-solid fa-eye mr-2"></i>
                  批量修改可见性
                </button>
                {selectedPhotos.length > 0 && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button 
                      onClick={() => handleBatchVisibility('公开')}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      设为公开
                    </button>
                    <button 
                      onClick={() => handleBatchVisibility('仅好友可见')}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      设为仅好友可见
                    </button>
                    <button 
                      onClick={() => handleBatchVisibility('私密')}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      设为私密
                    </button>
                  </div>
                )}
              </motion.div>
              
              {/* 批量添加标签 */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="输入标签..."
                  value={tagToAdd}
                  onChange={(e) => setTagToAdd(e.target.value)}
                  className="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] text-sm"
                />
                <motion.button 
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBatchAddTag}
                  disabled={selectedPhotos.length === 0 || !tagToAdd.trim()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors relative group ${
                    selectedPhotos.length > 0 && tagToAdd.trim()
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                      : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                  }`}
                >
                  <i className="fa-solid fa-tags mr-2"></i>
                  添加标签
                  {selectedPhotos.length === 0 && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E2532] text-xs text-[#B8C6D8] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      请先选择作品
                    </span>
                  )}
                </motion.button>
              </div>
              
              {/* 高级批量操作 */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <button 
                  disabled={selectedPhotos.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhotos.length > 0 
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                      : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                  }`}
                >
                  <i className="fa-solid fa-cogs mr-2"></i>
                  更多操作
                </button>
                {selectedPhotos.length > 0 && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button 
                      onClick={() => setShowRemoveTagModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      批量移除标签
                    </button>
                    <button 
                      onClick={() => setShowMoveCategoryModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      批量移动分类
                    </button>
                    <button 
                      onClick={() => handleBatchCopyrightType('独家授权')}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      设为独家授权
                    </button>
                    <button 
                      onClick={() => handleBatchCopyrightType('非独家')}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      设为非独家
                    </button>
                    <button 
                      onClick={handleBatchDownload}
                      className="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                    >
                      批量下载
                    </button>
                  </div>
                )}
              </motion.div>
              
              {/* 操作历史 */}
              <motion.button 
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
              ><i className="fa-solid fa-history mr-2"></i>
                操作历史
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* 搜索和筛选 */}
        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索作品标题或描述..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 重置到第一页
                }}
                className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={visibilityFilter}
                onChange={(e) => {
                  setVisibilityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部可见性</option>
                <option value="public">公开</option>
                <option value="friends">仅好友可见</option>
                <option value="private">私密</option>
              </select>
              
              <select
                value={formatFilter}
                onChange={(e) => {
                  setFormatFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部格式</option>
                <option value="raw">RAW</option>
                <option value="jpg">JPG</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                {getAllCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="views">最多浏览</option>
              </select>
            </div>
          </div>
          
          {/* 标签筛选 */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
            <div className="flex flex-wrap gap-2">
              {getAllTags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setCurrentPage(1);
                  }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                  } transition-colors`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 作品列表 */}
        <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#2D3748] border-b border-[#4A5F8B]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-12">选择</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-40">预览</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">标题</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden sm:table-cell">日期</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden sm:table-cell">格式</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">可见性</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden lg:table-cell">分类</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden xl:table-cell">标签</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">互动</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A5F8B]">
                <AnimatePresence>
                  {paginatedPosts.map((post) => (
                    <motion.tr 
                      key={post.id} 
                      className={`hover:bg-[#1E2532] transition-colors ${selectedPhotos.includes(post.id) ? 'ring-2 ring-[#4A5F8B]' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPhotos.includes(post.id)}
                          onChange={() => togglePhotoSelection(post.id)}
                          className="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <motion.div 
                          className="w-20 h-20 rounded overflow-hidden"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="font-medium text-[#F5F7FA]">{post.title}</div>
                        <div className="text-xs text-[#B8C6D8] truncate max-w-xs mt-1">{post.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#B8C6D8] hidden sm:table-cell">{post.date}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.format === 'RAW' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#6B7C93] text-[#F5F7FA]'
                        }`}>
                          {post.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.visibility === '公开' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 
                          post.visibility === '仅好友可见' ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#B8C6D8] text-[#2D3748]'
                        }`}>
                          {post.visibility}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#B8C6D8] hidden lg:table-cell">{post.category}</td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#B8C6D8] hidden md:table-cell">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <i className="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-comment mr-1 text-[#4A5F8B]"></i>
                            {post.comments}
                          </span>
                          <span className="flex items-center">
                            <i className="fa-solid fa-eye mr-1 text-[#4A5F8B]"></i>
                            {post.views}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <Link 
                            to={`/photo/${post.id}`}
                            className="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
                            title="查看详情"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                          <button 
                            className="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
                            title="编辑"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button 
                            className="p-1.5 text-[#B8C6D8] hover:text-[#F56565] transition-colors"
                            title="删除"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
           {filteredPosts.length === 0 && (
            <Empty 
              type="empty"
              size="md"
              text="暂无作品"
              helperText="您当前没有符合筛选条件的作品"
              icon="fa-image"
              backgroundColor="bg-[#2D3748]"
              textColor="text-[#F5F7FA]"
            />
          )}
          
          {/* 分页 */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-8 pb-6">
              <nav className="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded border border-[#4A5F8B] transition-colors ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                  }`}
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </motion.button>
                
                {/* 首页 */}
                {currentPage > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    1
                  </motion.button>
                )}
                
                {/* 省略号 */}
                {currentPage > 4 && (
                  <span className="px-3 py-2 text-[#B8C6D8]">...</span>
                )}
                
                {/* 页码 */}
                {getPageRange().map(page => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded border border-[#4A5F8B] transition-colors ${
                      currentPage === page ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
                
                {/* 省略号 */}
                {currentPage < totalPages - 3 && (
                  <span className="px-3 py-2 text-[#B8C6D8]">...</span>
                )}
                
                {/* 末页 */}
                {currentPage < totalPages - 2 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    {totalPages}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded border border-[#4A5F8B] transition-colors ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                  }`}
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </motion.button>
                
                {/* 页码信息 */}
                <span className="ml-2 px-3 py-2 text-sm text-[#B8C6D8]">
                  {currentPage}/{totalPages} 页 ({filteredPosts.length} 条)
                </span>
              </nav>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* 操作历史模态框 */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA]">操作历史</h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearHistory}
                    className="px-3 py-1 text-sm bg-[#6B7C93] text-[#F5F7FA] rounded hover:bg-[#F56565] transition-colors"
                  >
                    清空历史
                  </motion.button>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="text-[#B8C6D8] hover:text-[#F5F7FA]"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-6rem)] p-4">
                {operationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3">
                      <i className="fa-solid fa-history"></i>
                    </div>
                    <p className="text-[#B8C6D8]">暂无操作历史</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operationHistory.map(record => (
                      <div key={record.id} className="p-3 bg-[#1E2532] rounded-lg">
                        <div className="flex justify-between items-center">
                          <p className="text-[#F5F7FA]">{record.action}</p>
                          <span className="text-xs text-[#6B7C93]">{record.timestamp}</span>
                        </div>
                        <p className="text-sm text-[#B8C6D8] mt-1">共 {record.count} 项</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 批量移动分类模态框 */}
      <AnimatePresence>
        {showMoveCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMoveCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA]">批量移动分类</h3>
                <button
                  onClick={() => setShowMoveCategoryModal(false)}
                  className="text-[#B8C6D8] hover:text-[#F5F7FA]"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="p-4">
                <p className="text-[#B8C6D8] mb-4">请选择目标分类：</p>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer mb-4"
                >
                  <option value="">请选择分类</option>
                  {getAllCategories.filter(cat => cat !== '全部').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="flex space-x-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMoveCategoryModal(false)}
                    className="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBatchMoveCategory}
                    disabled={!selectedCategory}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                    }`}
                  >
                    确认移动
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 批量移除标签模态框 */}
      <AnimatePresence>
        {showRemoveTagModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRemoveTagModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
                <h3 className="text-lg font-bold text-[#F5F7FA]">批量移除标签</h3>
                <button
                  onClick={() => setShowRemoveTagModal(false)}
                  className="text-[#B8C6D8] hover:text-[#F5F7FA]"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="p-4">
                <p className="text-[#B8C6D8] mb-4">请选择要移除的标签：</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getAllTags.filter(tag => tag !== '全部').map(tag => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBatchRemoveTag(tag)}
                      className="px-3 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRemoveTagModal(false)}
                    className="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                  >
                    取消
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchManagePhotos;