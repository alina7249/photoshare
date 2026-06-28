import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { GroupCard } from '../components/common/GroupCard';

// 定义类型
interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  joinDate: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  avatar: string;
  members: GroupMember[];
  posts: number;
  createdAt: string;
  isPublic: boolean;
  joined: boolean;
  tags: string[];
  ownerId: string; // 添加ownerId字段用于识别创建者
}

const GroupsList: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("public");
  const [groupTags, setGroupTags] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 模拟从API加载小组数据
  useEffect(() => {
    const loadGroups = () => {
      // 模拟网络请求延迟
      setTimeout(() => {
        // 从localStorage获取数据，如果没有则使用mock数据
        const savedGroups = localStorage.getItem('photographyGroups');
        if (savedGroups) {
          setGroups(JSON.parse(savedGroups));
        } else {
          // 模拟数据
          const mockGroups: Group[] = [
            {
              id: "g1",
              name: "风光摄影爱好者",
              description: "专注于分享和交流风光摄影技巧、作品和器材使用经验。无论你是专业摄影师还是业余爱好者，都能在这里找到志同道合的朋友。",
              coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104",
              members: [
                {
                  id: "1",
                  name: "极简摄影师林风",
                  avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
                  role: "owner",
                  joinDate: "2023-01-15"
                }
              ],
              posts: 345,
              createdAt: "2023-01-15",
              isPublic: true,
              joined: user?.id === "1", // 当前用户是否已加入
              tags: ["风光", "自然", "户外", "风景"],
              ownerId: "1" // 小组创建者ID
            },
            {
              id: "g2",
              name: "人像摄影技巧交流",
              description: "探讨人像摄影的光线运用、构图技巧、引导模特等专业内容。分享最新人像作品，互相学习进步。",
              coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20group%20creative&sign=ad812d2b6b21ee3f52025b0964288c97",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57",
              members: [],
              posts: 267,
              createdAt: "2023-03-20",
              isPublic: true,
              joined: false,
              tags: ["人像", "肖像", "模特", "自然光"],
              ownerId: "2"
            },
            {
              id: "g3",
              name: "城市街头摄影",
              description: "记录城市生活的瞬间，捕捉街头的故事和人文情怀。分享街头摄影的技巧和设备推荐。",
              coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20city%20street%20group&sign=e076386c6e6cb8682835ab9a15e145e7",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo&sign=d6bc81adc6768a530f17c2ee445c92ce",
              members: [],
              posts: 189,
              createdAt: "2023-02-10",
              isPublic: true,
              joined: false,
              tags: ["街头", "城市", "人文", "纪实"],
              ownerId: "3"
            }
          ];
          setGroups(mockGroups);
          localStorage.setItem('photographyGroups', JSON.stringify(mockGroups));
        }
        setIsLoading(false);
      }, 800);
    };

    loadGroups();
  }, [user?.id]);

  // 保存小组数据到localStorage
  useEffect(() => {
    if (!isLoading && groups.length > 0) {
      localStorage.setItem('photographyGroups', JSON.stringify(groups));
    }
  }, [groups, isLoading]);

  // 处理加入/退出小组
  const handleJoinLeaveGroup = (groupId: string) => {
    if (!isAuthenticated) {
      toast.info("请先登录后再操作");
      return;
    }

    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, joined: !group.joined } 
          : group
      )
    );
    
    toast.success(`已${groups.find(g => g.id === groupId)?.joined ? '退出' : '加入'}小组`);
  };

  // 处理创建小组
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info("请先登录后再创建小组");
      return;
    }
    
    if (!groupName.trim()) {
      toast.warning("请输入小组名称");
      return;
    }

    const newGroup: Group = {
      id: `g${Date.now()}`,
      name: groupName,
      description: groupDescription,
      coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=default%20group%20cover%20photography&sign=3bc880c564b24e50436a36ff7e049628",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default%20group%20logo%20photography&sign=dffce2dd824c325946b2f4c9d5864412",
      members: [{
        id: user?.id || "current-user",
        name: user?.username || "当前用户",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default%20user%20avatar&sign=a323de447d924f02db241a15b12a9a1e",
        role: "owner",
        joinDate: new Date().toISOString()
      }],
      posts: 0,
      createdAt: new Date().toISOString(),
      isPublic: groupType === "public",
      joined: true, // 创建者默认加入
      tags: groupTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      ownerId: user?.id || "current-user"
    };
    
    setGroups(prevGroups => [newGroup, ...prevGroups]);
    
    // 重置表单
    setGroupName("");
    setGroupDescription("");
    setGroupType("public");
    setGroupTags("");
    setShowCreateGroupForm(false);
    
    toast.success("小组创建成功！");
  };

  // 处理删除小组
  const handleDeleteGroup = (groupId: string) => {
    if (!isAuthenticated) {
      toast.info("请先登录");
      return;
    }

    const group = groups.find(g => g.id === groupId);
    
    // 检查是否是小组创建者
    if (group && group.ownerId !== user?.id) {
      toast.warning("只有小组创建者才能删除小组");
      return;
    }

    if (window.confirm(`确定要删除"${group?.name}"小组吗？此操作不可恢复。`)) {
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      toast.success("小组已删除");
    }
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8C6D8]">加载小组中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回社区</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">摄影小组</h1>
          <p className="text-[#B8C6D8]">找到志同道合的摄影伙伴，一起学习、交流、创作</p>
        </div>

        {/* 创建小组按钮 */}
        <div className="mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateGroupForm(!showCreateGroupForm)}
            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center"
          >
            <i className="fa-solid fa-plus-circle mr-2"></i>
            {showCreateGroupForm ? "取消创建" : "创建小组"}
          </motion.button>
        </div>

        {/* 创建小组表单 */}
        <AnimatePresence>
          {showCreateGroupForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">创建摄影小组</h2>
                
                <form onSubmit={handleCreateGroup}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组名称 <span className="text-[#F56565]">*</span></label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="请输入小组名称"
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-[#6B7C93] mt-1">2-50个字符，简洁明了地表达小组主题</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组描述</label>
                    <textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="介绍你的小组主题、目标和成员可以获得什么..."
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[120px]"
                      maxLength={500}
                    ></textarea>
                    <p className="text-xs text-[#6B7C93] mt-1">最多500个字符，详细的介绍能吸引更多成员</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">小组类型</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="groupType"
                          value="public"
                          checked={groupType === "public"}
                          onChange={(e) => setGroupType(e.target.value)}
                          className="w-4 h-4 text-[#4A5F8B] bg-[#1E2532] border-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                        />
                        <span className="ml-2 text-[#B8C6D8]">公开小组</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="groupType"
                          value="private"
                          checked={groupType === "private"}
                          onChange={(e) => setGroupType(e.target.value)}
                          className="w-4 h-4 text-[#4A5F8B] bg-[#1E2532] border-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                        />
                        <span className="ml-2 text-[#B8C6D8]">私密小组</span>
                      </label>
                    </div>
                    <p className="text-xs text-[#6B7C93] mt-1">公开小组：任何人都可以发现并加入；私密小组：只有通过邀请才能加入</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">标签</label>
                    <input
                      type="text"
                      value={groupTags}
                      onChange={(e) => setGroupTags(e.target.value)}
                      placeholder="输入标签，用逗号分隔，最多5个标签"
                      className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                    <p className="text-xs text-[#6B7C93] mt-1">添加相关标签，让更多志同道合的人找到你的小组</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateGroupForm(false)}
                      className="flex-1 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center justify-center"
                    >
                      <i className="fa-solid fa-plus-circle mr-2"></i>
                      创建小组
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 小组列表统计 */}
        <div className="mb-6 bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#F5F7FA]">全部小组</h2>
              <p className="text-sm text-[#B8C6D8]">共 {groups.length} 个小组</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#1E2532] p-3 rounded-lg">
                <div className="text-xs text-[#6B7C93]">已加入</div>
                <div className="text-lg font-bold text-[#F5F7FA]">
                  {groups.filter(group => group.joined).length}
                </div>
              </div>
              <div className="bg-[#1E2532] p-3 rounded-lg">
                <div className="text-xs text-[#6B7C93]">公开小组</div>
                <div className="text-lg font-bold text-[#F5F7FA]">
                  {groups.filter(group => group.isPublic).length}
                </div>
              </div>
              <div className="bg-[#1E2532] p-3 rounded-lg">
                <div className="text-xs text-[#6B7C93]">总成员数</div>
                <div className="text-lg font-bold text-[#F5F7FA]">
                  {groups.reduce((sum, group) => sum + group.members.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 小组列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 ? (
            <div className="col-span-full p-12 bg-[#2D3748] border border-[#4A5F8B] rounded-lg text-center">
              <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i className="fa-solid fa-users text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无小组</h3>
              <p className="text-[#B8C6D8] mb-6">
                成为第一个创建小组的人，或者浏览发现更多摄影爱好者
              </p>
              <button
                onClick={() => setShowCreateGroupForm(true)}
                className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
              >
                <i className="fa-solid fa-plus-circle mr-2"></i>
                创建第一个小组
              </button>
            </div>
          ) : (
            groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={() => handleJoinLeaveGroup(group.id)}
                onLeave={() => handleJoinLeaveGroup(group.id)}
                onDelete={() => handleDeleteGroup(group.id)}
                canDelete={user?.id === group.ownerId}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GroupsList;