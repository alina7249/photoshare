import { buildCozeImageUrl } from '../constants/api';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { apiGet } from '../services/api';

// 评论接口定义
interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

// 摄影作品接口定义
interface PhotographyPost {
  id: string;
  title: string;
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
}

const PhotoComments: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [photo, setPhoto] = useState<PhotographyPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet<PhotographyPost>(`/photos/${id}`)
      .then((data) => {
        setPhoto(data);
        setLoading(false);
      })
      .catch(() => {
        setPhoto(null);
        setLoading(false);
      });
  }, [id]);

  // 模拟评论数据
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '2',
      username: '极简摄影师林静',
      avatar: buildCozeImageUrl('minimalist photographer female glasses', 'bcb6273a0e310c266e722c0131d6e146', 'square'),
      content: '这张作品的几何构图非常出色，线条的运用和光影对比恰到好处。特别喜欢你对空间的处理，留白部分增强了整体的极简美感。请问是使用什么方式调整黑白对比的？',
      date: '2023-10-25 10:23',
      likes: 125,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: buildCozeImageUrl('minimalist photographer male serious', 'fded36172bb86afa4dc326776156459c', 'square'),
          content: '谢谢喜欢！我使用了Lightroom的色调曲线工具进行精细调整，重点强化了明暗交界线的对比，同时保留了阴影和高光的细节，避免过度调整导致的细节丢失。',
          date: '2023-10-25 11:45',
          likes: 89,
          isLiked: false,
        },
      ],
    },
    {
      id: '2',
      userId: '3',
      username: '建筑摄影师王强',
      avatar: buildCozeImageUrl('architecture photographer male smiling', '3c23397344efe1e22c27fde5dd0bd934', 'square'),
      content: '作为一名建筑摄影师，我非常欣赏这种捕捉几何美感的视角。这让我想起了埃姆斯住宅的一些经典摄影作品。请问拍摄时是否有特别等待光线的角度？',
      date: '2023-10-25 09:15',
      likes: 87,
      isLiked: false,
      replies: [
        {
          id: '2-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: buildCozeImageUrl('minimalist photographer male serious', 'fded36172bb86afa4dc326776156459c', 'square'),
          content: '是的，我等待了大约30分钟，直到阳光到达这个特定角度，形成了我想要的光影效果。建筑摄影中，光线的方向和质量对最终效果的影响非常大，值得花时间等待最佳时机。',
          date: '2023-10-25 09:30',
          likes: 56,
          isLiked: false,
        },
      ],
    },
    {
      id: '3',
      userId: '4',
      username: '摄影学习者小张',
      avatar: buildCozeImageUrl('young photographer student male', 'c8c88269cfd5ed96c4081bb7a4ed50b8', 'square'),
      content: '我正在学习极简摄影，想请教一下如何在城市环境中发现这种简洁的构图？有什么寻找拍摄对象的技巧吗？',
      date: '2023-10-25 08:30',
      likes: 56,
      isLiked: false,
      replies: [
        {
          id: '3-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: buildCozeImageUrl('minimalist photographer male serious', 'fded36172bb86afa4dc326776156459c', 'square'),
          content: '我的建议是：1. 放慢脚步，用"框架思维"观察周围环境；2. 寻找重复的图案和线条；3. 尝试从不同角度观察同一物体；4. 使用三分法或对称构图；5. 关注负空间的重要性；6. 练习用单色模式（黑白）观察场景，有助于聚焦于形状和线条。最重要的是多拍多练，培养自己的极简视觉。',
          date: '2023-10-25 09:00',
          likes: 120,
          isLiked: false,
        },
        {
          id: '3-2',
          userId: '5',
          username: '艺术摄影师陈默',
          avatar: buildCozeImageUrl('art photographer male creative', 'bceaa07bd21b90efedda5c86e7059959', 'square'),
          content: '补充一点，我建议随身携带一个小取景器或者用双手框成矩形来辅助构图，这有助于训练你的眼睛直接识别场景中的几何元素和简洁构图。另外，可以尝试使用定焦镜头，限制自己的视角，从而更专注于构图本身。',
          date: '2023-10-25 09:30',
          likes: 67,
          isLiked: false,
        },
      ],
    },
  ]);

  // 处理评论提交
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('请先登录后再评论');
      return;
    }
    
    if (!commentText.trim()) {
      toast.warning('评论内容不能为空');
      return;
    }
    
    // 创建新评论
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user?.id || '',
      username: user?.username || '',
      avatar: user?.avatar || '',
      content: commentText.trim(),
      date: new Date().toLocaleString('zh-CN'),
      likes: 0,
      isLiked: false,
    };
    
    // 添加到评论列表
    setComments([newComment, ...comments]);
    setCommentText('');
    
    toast.success('评论发表成功');
  };

  // 处理回复提交
  const handleSubmitReply = (commentId: string) => {
    if (!isAuthenticated) {
      toast.info('请先登录后再回复');
      return;
    }
    
    if (!replyText.trim()) {
      toast.warning('回复内容不能为空');
      return;
    }
    
    // 创建新回复
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      userId: user?.id || '',
      username: user?.username || '',
      avatar: user?.avatar || '',
      content: replyText.trim(),
      date: new Date().toLocaleString('zh-CN'),
      likes: 0,
      isLiked: false,
    };
    
    // 更新评论列表，添加回复
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyText('');
    setReplyingTo(null);
    
    toast.success('回复发表成功');
  };

  // 处理点赞
  const handleLike = (commentId: string, isReply: boolean = false, replyId?: string) => {
    if (!isAuthenticated) {
      toast.info('请先登录后再点赞');
      return;
    }
    
    // 更新评论列表中的点赞状态
    const updatedComments = comments.map(comment => {
      // 如果是主评论
      if (comment.id === commentId && !isReply) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      
      // 如果是回复
      if (isReply && comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked
            };
          }
          return reply;
        });
        
        return {
          ...comment,
          replies: updatedReplies
        };
      }
      
      return comment;
    });
    
    setComments(updatedComments);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">未找到该作品</h2>
          <p className="text-text-muted mb-6 max-w-md">抱歉，您访问的作品不存在或已被删除</p>
          <Link to="/profile-center" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent">返回作品集</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to={`/photo/${id}`}
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回作品详情</span>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">作品评论</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            参与讨论，分享您的想法和摄影技巧
          </p>
        </div>

        {/* 作品预览 */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-accent mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/3">
              <div className="bg-deep rounded-lg overflow-hidden">
                <img
                  src={photo?.image}
                  alt={photo?.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold text-text-primary mb-3">{photo?.title}</h2>
              <div className="flex items-center mb-4">
                <img
                  src={photo?.author.avatar}
                  alt={photo?.author.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <span className="text-text-primary font-medium">{photo?.author.name}</span>
                  <span className="text-text-muted text-sm ml-2">{photo?.date}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {photo?.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-deep text-text-muted text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-heart text-accent mr-1"></i>
                  <span className="text-text-muted">{photo?.likes} 点赞</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-comment text-accent mr-1"></i>
                  <span className="text-text-muted">{comments.length} 评论</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 评论输入框 */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 text-sm text-text-light/70">
                  <i className="fa-solid fa-circle-info mr-1 text-accent"></i>
                  从艺术或技术角度分享您的见解，探讨构图、光影或创作理念
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="分享您的艺术感悟或技术分析..."
                  className="w-full px-4 py-3 rounded-lg bg-text-primary border border-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none h-32 text-text-light"
                ></textarea>
                <div className="flex justify-end mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 border-2 border-text-muted hover:border-accent bg-surface-light-card text-text-light rounded-lg font-medium transition-colors shadow-[0_2px_8px_rgba(74,95,139,0.2)]"
                  >
                    发表评论
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-surface-light-card rounded-lg border border-text-muted text-center">
            <p className="text-text-light/70 mb-3">
              登录后可以参与艺术摄影交流
            </p>
            <div className="flex justify-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-text-primary bg-accent hover:bg-text-light rounded-lg transition-colors"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent/20 transition-colors"
              >
                注册
              </Link>
            </div>
          </div>
        )}

        {/* 评论列表 */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-text-primary rounded-lg p-4 border border-text-muted">
              <div className="flex space-x-3">
                <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
                  <img
                    src={comment.avatar}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link
                      to={`/profile/${comment.userId}`}
                      className="font-medium text-text-light hover:text-accent transition-colors"
                    >
                      {comment.username}
                    </Link>
                    <span className="text-xs text-text-light/70">{comment.date}</span>
                  </div>
                  <p className="text-text-light mb-3">{comment.content}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        comment.isLiked
                          ? 'text-accent'
                          : 'text-text-light/50 hover:text-text-light'
                      }`}
                    >
                      <motion.i
                        animate={comment.isLiked ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className={`fa-solid ${comment.isLiked ? 'fa-heart' : 'fa-heart'}`}
                      ></motion.i>
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-sm text-text-light/50 hover:text-text-light transition-colors"
                    >
                      <i className="fa-solid fa-reply"></i>
                      <span>回复</span>
                    </button>
                  </div>

                  {/* 回复表单 */}
                  {replyingTo === comment.id && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={user?.avatar}
                          alt={user?.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`回复 @${comment.username}...`}
                          className="flex-1 px-3 py-2 rounded-lg bg-surface-light-card border border-text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm text-text-light"
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className="px-3 py-2 bg-accent hover:bg-text-light text-text-primary rounded-lg text-sm font-medium transition-colors"
                        >
                          回复
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-text-muted space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Link to={`/profile/${reply.userId}`} className="flex-shrink-0">
                            <img
                              src={reply.avatar}
                              alt={reply.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </Link>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Link
                                to={`/profile/${reply.userId}`}
                                className="font-medium text-text-light hover:text-accent transition-colors"
                              >
                                {reply.username}
                              </Link>
                              <span className="text-xs text-text-light/70">{reply.date}</span>
                            </div>
                            <p className="text-text-light mb-2 text-sm">{reply.content}</p>
                            <button
                              onClick={() => handleLike(comment.id, true, reply.id)}
                              className={`flex items-center space-x-1 text-xs transition-colors ${
                                reply.isLiked
                                  ? 'text-accent'
                                  : 'text-text-light/50 hover:text-text-light'
                              }`}
                            >
                              <i className={`fa-solid ${reply.isLiked ? 'fa-heart' : 'fa-heart'}`}></i>
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoComments;