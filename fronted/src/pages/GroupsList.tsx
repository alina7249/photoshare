import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { apiGet } from '../lib/api';
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

  // 从API加载小组数据
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await apiGet<Group[]>('/groups');
        setGroups(data);
      } catch (error) {
        console.error('Failed to load groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

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
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">加载小组中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回社区</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">摄影小组</h1>
          <p className="text-text-muted">找到志同道合的摄影伙伴，一起学习、交流、创作</p>
        </div>

        {/* 创建小组按钮 */}
        <div className="mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateGroupForm(!showCreateGroupForm)}
            className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center"
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
              <div className="bg-card border border-accent rounded-lg p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">创建摄影小组</h2>
                
                <form onSubmit={handleCreateGroup}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-muted mb-1">小组名称 <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="请输入小组名称"
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-accent-hover mt-1">2-50个字符，简洁明了地表达小组主题</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-muted mb-1">小组描述</label>
                    <textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="介绍你的小组主题、目标和成员可以获得什么..."
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[120px]"
                      maxLength={500}
                    ></textarea>
                    <p className="text-xs text-accent-hover mt-1">最多500个字符，详细的介绍能吸引更多成员</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-muted mb-1">小组类型</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="groupType"
                          value="public"
                          checked={groupType === "public"}
                          onChange={(e) => setGroupType(e.target.value)}
                          className="w-4 h-4 text-accent bg-deep border-accent rounded focus:ring-accent"
                        />
                        <span className="ml-2 text-text-muted">公开小组</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="groupType"
                          value="private"
                          checked={groupType === "private"}
                          onChange={(e) => setGroupType(e.target.value)}
                          className="w-4 h-4 text-accent bg-deep border-accent rounded focus:ring-accent"
                        />
                        <span className="ml-2 text-text-muted">私密小组</span>
                      </label>
                    </div>
                    <p className="text-xs text-accent-hover mt-1">公开小组：任何人都可以发现并加入；私密小组：只有通过邀请才能加入</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-muted mb-1">标签</label>
                    <input
                      type="text"
                      value={groupTags}
                      onChange={(e) => setGroupTags(e.target.value)}
                      placeholder="输入标签，用逗号分隔，最多5个标签"
                      className="w-full px-4 py-3 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    <p className="text-xs text-accent-hover mt-1">添加相关标签，让更多志同道合的人找到你的小组</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateGroupForm(false)}
                      className="flex-1 py-3 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center justify-center"
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
        <div className="mb-6 bg-card border border-accent rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary">全部小组</h2>
              <p className="text-sm text-text-muted">共 {groups.length} 个小组</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-deep p-3 rounded-lg">
                <div className="text-xs text-accent-hover">已加入</div>
                <div className="text-lg font-bold text-text-primary">
                  {groups.filter(group => group.joined).length}
                </div>
              </div>
              <div className="bg-deep p-3 rounded-lg">
                <div className="text-xs text-accent-hover">公开小组</div>
                <div className="text-lg font-bold text-text-primary">
                  {groups.filter(group => group.isPublic).length}
                </div>
              </div>
              <div className="bg-deep p-3 rounded-lg">
                <div className="text-xs text-accent-hover">总成员数</div>
                <div className="text-lg font-bold text-text-primary">
                  {groups.reduce((sum, group) => sum + group.members.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 小组列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 ? (
            <div className="col-span-full p-12 bg-card border border-accent rounded-lg text-center">
              <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                <i className="fa-solid fa-users text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">暂无小组</h3>
              <p className="text-text-muted mb-6">
                成为第一个创建小组的人，或者浏览发现更多摄影爱好者
              </p>
              <button
                onClick={() => setShowCreateGroupForm(true)}
                className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
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