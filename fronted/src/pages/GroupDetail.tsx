import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';

// 定义类型
interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  joinDate: string;
}

interface GroupPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  images?: string[];
  tags: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  avatar: string;
  members: GroupMember[];
  posts: GroupPost[];
  createdAt: string;
  isPublic: boolean;
  joined: boolean;
  tags: string[];
  ownerId: string;
  activity: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

const GroupDetail: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");

  // 模拟从API加载小组详情
  useEffect(() => {
    const loadGroupDetail = () => {
      // 模拟网络请求延迟
      setTimeout(() => {
        // 模拟小组数据
        const mockGroup: Group = {
          id: id || "g1",
          name: "风光摄影爱好者",
          description: "专注于分享和交流风光摄影技巧、作品和器材使用经验。无论你是专业摄影师还是业余爱好者，都能在这里找到志同道合的朋友。我们定期组织线上分享会和线下外拍活动，欢迎加入！",
          coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9",
          avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104",
          members: [
            {
              id: "1",
              name: "极简摄影师林风",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
              role: "owner",
              joinDate: "2023-01-15"
            },
            {
              id: "2",
              name: "城市摄影师陈默",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1",
              role: "admin",
              joinDate: "2023-01-20"
            },
            {
              id: "3",
              name: "风景摄影爱好者",
              avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91",
              role: "member",
              joinDate: "2023-02-01"
            }
          ],
          posts: [
            {
              id: "p1",
              title: "【分享】我的春季风光摄影心得",
              content: "春天是一年中拍摄风光的最佳季节之一，万物复苏，色彩丰富。分享一些我的春季拍摄技巧和心得...\n\n1. 时间选择：春季的光线变化很快，清晨和黄昏是黄金时段\n2. 构图技巧：利用新绿的树枝作为前景，增加画面层次感\n3. 器材选择：广角镜头适合拍摄壮阔的风景，微距镜头可以捕捉细节\n\n希望这些技巧对大家有帮助！",
              author: {
                id: "1",
                name: "极简摄影师林风",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c"
              },
              createdAt: "2023-04-15T10:30:00",
              likes: 45,
              comments: 12,
              images: [
                "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=spring%20landscape%20mountains%20flowers%20river&sign=dd478f18134eb179ab7f10fc4621849d"
              ],
              tags: ["春季", "风光", "技巧"]
            },
            {
              id: "p2",
              title: "请教：关于长曝光拍摄水流的问题",
              content: "最近尝试拍摄溪流的长曝光效果，但总是拍不出丝滑的感觉，想请教各位老师几个问题：\n\n1. 一般需要多少秒的曝光时间？\n2. 除了三脚架，还需要哪些配件？\n3. 后期处理有什么技巧吗？\n\n附上我最近拍的一张照片，请各位指点！",
              author: {
                id: "3",
                name: "风景摄影爱好者",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91"
              },
              createdAt: "2023-04-14T15:45:00",
              likes: 23,
              comments: 18,
              images: [
                "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=stream%20waterfall%20long%20exposure%20forest&sign=deb44d926ed6eba487647f556bc78282"
              ],
              tags: ["长曝光", "水流", "提问"]
            }
          ],
          createdAt: "2023-01-15",
          isPublic: true,
          joined: user?.id === "1" || user?.id === "2" || user?.id === "3", // 模拟用户是否已加入
          tags: ["风光", "自然", "户外", "风景"],
          ownerId: "1",
          activity: {
            today: 8,
            thisWeek: 45,
            thisMonth: 120
          }
        };
        
        setGroup(mockGroup);
        setIsLoading(false);
      }, 1000);
    };

    if (id) {
      loadGroupDetail();
    }
  }, [id, user?.id]);

  // 处理加入小组
  const handleJoinGroup = () => {
    if (!isAuthenticated) {
      toast.info("请先登录后再加入小组");
      return;
    }

    setGroup(prevGroup => 
      prevGroup ? { ...prevGroup, joined: true } : null
    );
    setShowJoinModal(false);
    toast.success(`已成功加入"${group?.name}"小组`);
  };

  // 处理退出小组
  const handleLeaveGroup = () => {
    if (window.confirm(`确定要退出"${group?.name}"小组吗？`)) {
      setGroup(prevGroup => 
        prevGroup ? { ...prevGroup, joined: false } : null
      );
      toast.success(`已退出"${group?.name}"小组`);
    }
  };

  // 处理发布帖子
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info("请先登录后再发帖");
      return;
    }
    
    if (!group?.joined) {
      toast.info("请先加入小组后再发帖");
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.warning("请填写标题和内容");
      return;
    }

    const newPost: GroupPost = {
      id: `p${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      author: {
        id: user?.id || "current-user",
        name: user?.username || "当前用户",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default%20user%20avatar&sign=a323de447d924f02db241a15b12a9a1e"
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      tags: [],
      images: []
    };

    setGroup(prevGroup => 
      prevGroup ? { 
        ...prevGroup, 
        posts: [newPost, ...prevGroup.posts] 
      } : null
    );

    // 重置表单
    setNewPostTitle("");
    setNewPostContent("");
    
    toast.success("帖子发布成功");
  };

  // 渲染加载状态
  if (isLoading || !group) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8C6D8]">加载小组信息中...</p>
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
            to="/groups"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回小组列表</span>
          </Link>
        </div>

        {/* 小组封面和基本信息 */}
        <div className="relative mb-8">
          {/* 封面图片 */}
          <div className="h-64 md:h-80 relative overflow-hidden rounded-xl">
            <img
              src={group.coverImage}
              alt={`${group.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
          </div>

          {/* 小组信息卡片 */}
          <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl p-6 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* 小组头像和名称 */}
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-[#2D3748] overflow-hidden shadow-lg">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#F5F7FA]">{group.name}</h1>
                    {!group.isPublic && (
                      <span className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">
                        <i className="fa-solid fa-lock mr-1"></i>私密
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                {group.joined ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLeaveGroup}
                    className="px-4 py-2 bg-[#F56565] text-white rounded-lg font-medium hover:bg-[#E53E3E] transition-colors"
                  >
                    退出小组
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowJoinModal(true)}
                    className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                  >
                    加入小组
                  </motion.button>
                )}
                {group.joined && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"
                  >
                    <i className="fa-solid fa-bell mr-2"></i>
                    订阅通知
                  </motion.button>
                )}
              </div>
            </div>

            {/* 小组描述 */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-[#F5F7FA] mb-2">小组介绍</h2>
              <p className="text-[#B8C6D8] whitespace-pre-line">{group.description}</p>
            </div>

            {/* 小组数据统计 */}
            <div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-4">
              <div className="bg-[#1E2532] p-3 rounded-lg text-center">
                <p className="text-xs text-[#6B7C93] mb-1">成员数</p>
                <p className="text-lg font-bold text-[#F5F7FA]">{group.members.length}</p>
              </div>
              <div className="bg-[#1E2532] p-3 rounded-lg text-center">
                <p className="text-xs text-[#6B7C93] mb-1">今日活跃度</p>
                <p className="text-lg font-bold text-[#F5F7FA]">{group.activity.today}</p>
              </div>
              <div className="bg-[#1E2532] p-3 rounded-lg text-center">
                <p className="text-xs text-[#6B7C93] mb-1">本周活跃度</p>
                <p className="text-lg font-bold text-[#F5F7FA]">{group.activity.thisWeek}</p>
              </div>
              <div className="bg-[#1E2532] p-3 rounded-lg text-center">
                <p className="text-xs text-[#6B7C93] mb-1">本月活跃度</p>
                <p className="text-lg font-bold text-[#F5F7FA]">{group.activity.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 内容标签页 */}
        <div className="bg-[#2D3748] border border-[#4A5F8B] rounded-xl mb-8">
          <div className="flex border-b border-[#4A5F8B]">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
              }`}
            >
              <i className="fa-solid fa-file-lines mr-2"></i>
              小组动态 ({group.posts.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                activeTab === 'members'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
              }`}
            >
              <i className="fa-solid fa-users mr-2"></i>
              成员列表 ({group.members.length})
            </button>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {/* 小组动态 */}
            {activeTab === 'posts' && (
              <>
                {/* 发布帖子框 */}
                {group.joined && (
                  <div className="bg-[#1E2532] border border-[#4A5F8B] rounded-lg p-4 mb-6">
                    <form onSubmit={handlePostSubmit}>
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default%20user%20avatar&sign=a323de447d924f02db241a15b12a9a1e"
                          alt="Your avatar"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            placeholder="输入帖子标题..."
                            className="w-full px-4 py-2 mb-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                          />
                          <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="分享你的摄影心得、作品或提问..."
                            className="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[100px]"
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            className="px-3 py-1.5 text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                          >
                            <i className="fa-solid fa-image mr-1"></i>
                            添加图片
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                          >
                            <i className="fa-solid fa-tag mr-1"></i>
                            添加标签
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                        >
                          发布帖子
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 帖子列表 */}
                {group.posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                      <i className="fa-solid fa-file-lines text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无帖子</h3>
                    <p className="text-[#B8C6D8]">
                      {group.joined ? "成为第一个发布帖子的人吧！" : "加入小组后可以查看和发布帖子"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {group.posts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#1E2532] border border-[#4A5F8B] rounded-lg p-4 hover:border-[#6B7C93] transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-[#F5F7FA]">{post.author.name}</h3>
                              <span className="text-xs text-[#6B7C93]">{new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                            <h4 className="text-lg font-bold text-[#F5F7FA] mb-2">{post.title}</h4>
                            <p className="text-[#B8C6D8] whitespace-pre-line mb-3">{post.content}</p>
                            
                            {/* 帖子图片 */}
                            {post.images && post.images.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {post.images.map((img, index) => (
                                  <div key={index} className="rounded-lg overflow-hidden">
                                    <img
                                      src={img}
                                      alt={`Post image ${index + 1}`}
                                      className="w-full h-auto object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* 帖子标签 */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}</span>
                                ))}
                              </div>
                            )}
                            
                            {/* 帖子操作 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                                  <i className="fa-solid fa-thumbs-up mr-1"></i>
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                                  <i className="fa-solid fa-comment mr-1"></i>
                                  <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                                  <i className="fa-solid fa-share-nodes mr-1"></i>
                                  <span>分享</span>
                                </button>
                              </div>
                              <button className="text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* 评论区 */}
                        <CommentSection postId={post.id} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 成员列表 */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map(member => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#1E2532] border border-[#4A5F8B] rounded-lg p-4 hover:border-[#6B7C93] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-[#F5F7FA]">{member.name}</h3>
                            <span className={`px-1.5 py-0.5 text-xs rounded ${
                              member.role === 'owner' ? 'bg-[#F56565]/20 text-[#F56565]' : 
                              member.role === 'admin' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]' : 
                              'bg-[#48BB78]/20 text-[#48BB78]'
                            }`}>
                              {member.role === 'owner' ? '组长' : member.role === 'admin' ? '管理员' : '成员'}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7C93]">加入于 {new Date(member.joinDate).toLocaleDateString()}</p>
                        </div>
                        {member.id !== user?.id && (
                          <button className="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#6B7C93] rounded-full transition-colors">
                            关注
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 加入小组模态框 */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-[#4A5F8B] overflow-hidden mx-auto mb-4">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[#F5F7FA] mb-2">加入"{group.name}"小组</h2>
                  <p className="text-[#B8C6D8]">
                    加入后你将可以：参与小组讨论、发布帖子、查看成员动态
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleJoinGroup}
                    className="flex-1 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                  >
                    确认加入
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupDetail;