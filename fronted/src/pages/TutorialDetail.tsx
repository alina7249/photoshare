import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
  import { toast } from 'sonner';
  import { CommentSection } from '../components/CommentSection';
  import { apiGet } from '../services/api';

// 教程类型定义
interface Tutorial {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  level: string;
  duration: string;
  views: number;
  likes: number;
  image: string;
  tags: string[];
  content: string[]; // 新增字段，用于存储教程正文内容
}

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 从API加载数据
  useEffect(() => {
    setLoading(true);
    apiGet<Tutorial>(`/tutorials/${id}`)
      .then((data) => {
        setTutorial(data);
        setLikesCount(data.likes);
        const hasLiked = localStorage.getItem(`liked_tutorial_${id}`) === 'true';
        setIsLiked(hasLiked);
        setLoading(false);
      })
      .catch(() => {
        setTutorial(null);
        setLoading(false);
      });
  }, [id]);

  // 处理点赞
  const handleLike = () => {
    if (!tutorial) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
    
    // 保存点赞状态到本地存储
    localStorage.setItem(`liked_tutorial_${id}`, newLikedState ? 'true' : 'false');
    
    toast.success(newLikedState ? '点赞成功！' : '已取消点赞');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">未找到该教程</h2>
          <p className="text-text-muted mb-6 max-w-md">抱歉，您访问的教程不存在或已被删除</p>
          <Link 
            to="/online-courses" 
            className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
          >
            返回课程列表
          </Link>
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
            to="/online-courses"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回课程列表</span>
          </Link>
        </div>
        
        {/* 教程封面 */}
        <div className="bg-card rounded-xl overflow-hidden border border-accent mb-8">
          <div className="relative">
            <img
              src={tutorial.image}
              alt={tutorial.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep to-transparent p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-accent text-text-primary text-sm rounded-full border border-accent">
                  {tutorial.category}
                </span>
                <span className="px-3 py-1 bg-accent text-text-primary text-sm rounded-full border border-accent">
                  {tutorial.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{tutorial.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-text-muted">
                <div className="flex items-center">
                  <i className="fa-solid fa-clock mr-1"></i>
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-eye mr-1"></i>
                  <span>{tutorial.views.toLocaleString()} 阅读</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-heart mr-1 text-accent"></i>
                  <span>{likesCount.toLocaleString()} 喜欢</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 教程正文 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 教程描述 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">教程简介</h2>
              <p className="text-text-muted leading-relaxed">
                {tutorial.description}
              </p>
            </div>
            
            {/* 教程内容 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-6">教程内容</h2>
              
              {/* Markdown 内容渲染 */}
              <div className="prose prose-invert max-w-none">
                {tutorial.content.map((paragraph, index) => {
                  // 处理标题
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-2xl font-bold text-text-primary mb-4">
                        {paragraph.substring(2)}
                      </h1>
                    );
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-text-primary mt-6 mb-3">
                        {paragraph.substring(3)}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-bold text-text-primary mt-4 mb-2">
                        {paragraph.substring(4)}
                      </h3>
                    );
                  } 
                  // 处理空行
                  else if (paragraph === '') {
                    return <p key={index} className="mb-3"></p>;
                  } 
                  // 处理列表项
                  else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc pl-5 mb-3 space-y-1">
                        <li className="text-text-muted">{paragraph.substring(2)}</li>
                      </ul>
                    );
                  } 
                  // 处理数字列表项
                  else if (/^\d+\.\s/.test(paragraph)) {
                    return (
                      <ol key={index} className="list-decimal pl-5 mb-3 space-y-1">
                        <li className="text-text-muted">{paragraph.replace(/^\d+\.\s/, '')}</li>
                      </ol>
                    );
                  } 
                  // 处理普通段落
                  else {
                    return (
                      <p key={index} className="text-text-muted mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 作者信息 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">作者信息</h2>
              <div className="flex items-center mb-4">
                <img
                  src={tutorial.author.avatar}
                  alt={tutorial.author.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-accent"
                />
                <div>
                  <h3 className="font-bold text-text-primary">{tutorial.author.name}</h3>
                  <p className="text-sm text-text-muted">摄影导师 / 专业摄影师</p>
                </div>
              </div>
              <button className="w-full py-2 bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent">
                关注作者
              </button>
            </div>
            
            {/* 操作按钮 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">操作</h2>
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  className={`w-full py-3 flex items-center justify-center rounded-lg font-medium transition-colors ${
                    isLiked
                      ? 'bg-accent text-text-primary border border-accent'
                      : 'bg-deep text-text-muted border border-accent hover:bg-accent hover:text-text-primary'
                  }`}
                >
                  <i className={`fa-solid ${isLiked ? 'fa-heart' : 'fa-heart'} mr-2`}></i>
                  {isLiked ? '已喜欢' : '喜欢'}
                </button>
                <button className="w-full py-3 flex items-center justify-center bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent">
                  <i className="fa-solid fa-bookmark mr-2"></i>
                  收藏教程
                </button>
                 <button 
                   onClick={async () => {
                     try {
                       await navigator.clipboard.writeText(`${window.location.origin}/tutorial/${id}`);
                       toast.success('链接已复制到剪贴板');
                     } catch (err) {
                       toast.error('复制失败，请手动复制');
                     }
                   }}
                   className="w-full py-3 flex items-center justify-center bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent relative z-10"
                 >
                   <i className="fa-solid fa-share-alt mr-2"></i>
                   分享教程
                 </button>
                <button className="w-full py-3 flex items-center justify-center bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent">
                  <i className="fa-solid fa-download mr-2"></i>
                  下载资料
                </button>
              </div>
            </div>
            
            {/* 标签 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">相关标签</h2>
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-text-primary rounded-full text-sm border border-accent hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 推荐教程 */}
            <div className="bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">推荐教程</h2>
              <div className="space-y-4">
                <p className="text-sm text-accent-hover text-center">暂无推荐教程</p>
             </div>
             
             {/* 评论区 */}
             <div className="bg-card rounded-xl p-6 border border-accent mt-8">
               <CommentSection postId={tutorial.id} />
             </div>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialDetail;