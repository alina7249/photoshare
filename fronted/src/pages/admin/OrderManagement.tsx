import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';

// 模拟订单数据
const mockOrders = [
  {
    id: 'O-20231025-001',
    userId: '101',
    userName: '张三',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
    items: [
      { name: '银河会员·年卡', price: 299, quantity: 1 }
    ],
    totalAmount: 299,
    status: 'paid',
    paymentMethod: 'alipay',
    createdAt: '2023-10-25T10:30:00',
    paidAt: '2023-10-25T10:32:15'
  },
  {
    id: 'O-20231024-002',
    userId: '102',
    userName: '李四',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female&sign=f09d83378aa1e845abd3d8360ae43318',
    items: [
      { name: '器材租赁套餐A', price: 199, quantity: 2 }
    ],
    totalAmount: 398,
    status: 'paid',
    paymentMethod: 'wechat',
    createdAt: '2023-10-24T14:20:00',
    paidAt: '2023-10-24T14:23:45'
  },
  {
    id: 'O-20231023-003',
    userId: '103',
    userName: '王五',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20creative&sign=05eaa6a6889c9fd565f612592ebff64a',
    items: [
      { name: '线上课程《风光摄影大师班》', price: 399, quantity: 1 }
    ],
    totalAmount: 399,
    status: 'pending',
    paymentMethod: 'alipay',
    createdAt: '2023-10-23T09:15:00',
    paidAt: null
  },
  {
    id: 'O-20231022-004',
    userId: '104',
    userName: '赵六',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20professional&sign=de0253bc58d40781a8618749ea5612ee',
    items: [
      { name: 'RAW素材包', price: 59, quantity: 1 },{ name: '后期预设包', price: 39, quantity: 1 }
    ],
    totalAmount: 98,
    status: 'paid',
    paymentMethod: 'creditcard',
    createdAt: '2023-10-22T16:45:00',
    paidAt: '2023-10-22T16:47:30'
  },
  {
    id: 'O-20231021-005',
    userId: '105',
    userName: '孙七',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20nature%20lover&sign=5bde84c0a947f0a379af97355ca16564',
    items: [
      { name: '银河会员·月卡', price: 39, quantity: 1 }
    ],
    totalAmount: 39,
    status: 'cancelled',
    paymentMethod: 'wechat',
    createdAt: '2023-10-21T11:30:00',
    paidAt: null
  }
];

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // 过滤和排序订单
  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // 根据状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // 根据支付方式筛选
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter);
    }
    
    // 根据搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(query) || 
          order.userName.toLowerCase().includes(query)
      );
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'totalAmount':
          return b.totalAmount - a.totalAmount;
        case 'userName':
          return a.userName.localeCompare(b.userName);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // 处理选择订单
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        const newSelection = prev.filter(id => id !== orderId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, orderId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
      setShowBulkActions(false);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
      setShowBulkActions(true);
    }
  };

  // 处理批量操作
  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) return;
    
    switch (action) {
      case 'export':
        toast.success(`已导出${selectedOrders.length}个订单数据`);
        break;
      case 'delete':
        if (window.confirm(`确定要删除选中的${selectedOrders.length}个订单吗？此操作不可撤销。`)) {
          setOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
          toast.success(`已删除${selectedOrders.length}个订单`);
        }
        break;
      default:
        break;
    }
    
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  // 处理单个订单操作
  const handleOrderAction = (orderId: string, action: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/orders/${orderId}`);
        break;
      case 'edit':
        navigate(`/admin/orders/${orderId}/edit`);
        break;
      case 'cancel':
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        toast.success('订单已取消');
        break;
      case 'delete':
        if (window.confirm('确定要删除这个订单吗？此操作不可撤销。')) {
          setOrders(prev => prev.filter(order => order.id !== orderId));
          toast.success('订单已删除');
        }
        break;
      default:
        break;
    }
  };

  // 渲染状态标签
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待支付</span>;
      case 'paid':
        return <span className="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">已支付</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已取消</span>;
      default:
        return <span className="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>;
    }
  };

  // 渲染支付方式图标
  const renderPaymentMethod = (method: string) => {
    switch (method) {
      case 'alipay':
        return <i className="fa-brands fa-alipay text-blue-500"></i>;
      case 'wechat':
        return <i className="fa-brands fa-weixin text-green-500"></i>;
      case 'creditcard':
        return <i className="fa-credit-card text-purple-500"></i>;
      default:
        return <i className="fa-question text-gray-500"></i>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FA]">订单管理</h1>
          <p className="text-[#B8C6D8] mt-1">查看和管理所有用户订单</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Button variant="secondary">
            <i className="fa-solid fa-filter mr-2"></i>
            筛选
          </Button>
          <Button>
            <i className="fa-solid fa-download mr-2"></i>
            导出订单
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索订单号或用户名..."
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
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="cancelled">已取消</option>
          </select>
          
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
          >
            <option value="all">全部支付方式</option>
            <option value="alipay">支付宝</option>
            <option value="wechat">微信支付</option>
            <option value="creditcard">信用卡</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
          >
            <option value="createdAt">按创建时间排序</option>
            <option value="totalAmount">按金额排序</option>
            <option value="userName">按用户名排序</option>
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
            <span>已选择 {selectedOrders.length} 项</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
            >
              导出
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-[#F56565] text-white rounded-lg hover:bg-[#E53E3E] transition-colors text-sm"
            >
              删除
            </button>
            <button
              onClick={() => {
                setSelectedOrders([]);
                setShowBulkActions(false);
              }}
              className="p-1 text-[#F5F7FA] hover:text-[#B8C6D8] transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </motion.div>
      )}

      {/* 订单列表 */}
      <div className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#4A5F8B]">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">支付方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-[#1E2532] divide-y divide-[#4A5F8B]">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2D3748] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={order.userAvatar}
                          alt={order.userName}
                        />
                      </div>
                      <div className="ml-2 text-sm text-[#B8C6D8]">
                        {order.userName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#B8C6D8]">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1 flex justify-between">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
                    ¥{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderPaymentMethod(order.paymentMethod)}
                      <span className="ml-2 text-sm text-[#B8C6D8]">
                        {order.paymentMethod === 'alipay' ? '支付宝' : order.paymentMethod === 'wechat' ? '微信支付' : '信用卡'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                    {new Date(order.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOrderAction(order.id, 'view')}
                        className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                        title="查看详情"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleOrderAction(order.id, 'edit')}
                        className="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                        title="编辑订单"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'cancel')}
                          className="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                          title="取消订单"
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleOrderAction(order.id, 'delete')}
                        className="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                        title="删除订单"
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
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-shopping-cart text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无订单</h3>
            <p className="text-[#B8C6D8]">当前没有符合条件的订单</p>
          </div>
        )}
        
        {/* 分页 */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-[#1E2532] border-t border-[#4A5F8B] flex items-center justify-between">
            <div className="text-sm text-[#B8C6D8]">
              显示 1 到 {filteredOrders.length} 条，共 {filteredOrders.length} 条
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

export default OrderManagement;