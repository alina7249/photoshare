import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';
import { apiGet } from '../lib/api';

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContestDetail = async () => {
      try {
        const data = await apiGet(`/contests/${id}`);
        setContest(data);
      } catch (err) {
        console.error('Failed to fetch contest detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetail();
  }, [id]);

  // 处理参赛
  const handleJoinContest = () => {
    if (!isAuthenticated) {
      // 未登录时跳转到登录页
      window.location.href = '/login';
      return;
    }

    // 模拟参赛成功
    toast.success(`已成功参加 ${contest.title}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-bg-deep min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="container mx-auto px-4 py-8 bg-bg-deep min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">未找到该赛事</h2>
          <p className="text-text-muted mb-6 max-w-md">抱歉，您访问的赛事不存在或已被删除</p>
          <Link to="/photography-contests" className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
            返回赛事列表
          </Link>
        </div>
      </div>
    );
  }

  // 计算剩余天数
  const calculateDaysLeft = () => {
    if (contest.status !== '进行中') return 0;
    
    const now = new Date();
    const deadline = new Date(contest.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/photography-contests"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回赛事列表</span>
          </Link>
        </div>

        {/* 赛事主图 */}
        <div className="relative rounded-xl overflow-hidden mb-8 bg-bg-card border border-accent">
          <img
            src={contest.image}
            alt={contest.title}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-accent text-text-primary text-sm rounded-full">
                {contest.type}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${
                contest.status === '进行中'
                  ? 'bg-[#38B2AC] text-text-primary'
                  : contest.status === '已截止'
                    ? 'bg-accent-hover text-text-primary'
                    : 'bg-bg-card text-text-primary'
              }`}>
                {contest.status}
              </span>
              {contest.status === '进行中' && (
                <span className="px-3 py-1 bg-[#ED8936] text-text-primary text-sm rounded-full">
                  还剩 {daysLeft} 天截止
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
              {contest.title}
            </h1>
            {contest.organizer && (
              <div className="flex items-center text-sm text-text-muted">
                <i className="fa-solid fa-building mr-2"></i>
                <span>主办方：{contest.organizer}</span>
              </div>
            )}
          </div>
        </div>

        {/* 统计数据和参赛按钮 */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-bg-card rounded-xl p-6 mb-8 border border-accent">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-text-muted mb-1">参与人数</h3>
              <p className="text-3xl font-bold text-text-primary">{contest.participants}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-text-muted mb-1">作品数量</h3>
              <p className="text-3xl font-bold text-text-primary">{contest.worksCount}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-text-muted mb-1">截止日期</h3>
              <p className="text-xl font-bold text-text-primary">{contest.deadline}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinContest}
              className={`px-8 py-3 rounded-lg font-medium transition-colors border ${
                contest.status === '进行中'
                  ? 'bg-accent text-text-primary hover:bg-accent-hover border-accent'
                  : 'bg-accent-hover text-text-muted cursor-not-allowed border-accent-hover'
              }`}
              disabled={contest.status !== '进行中'}
            >
              {contest.status === '进行中' ? '立即参赛' : '已截止'}
            </motion.button>
          </div>
        </div>

        {/* 内容主体 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 赛事详情 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">赛事详情</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-text-muted leading-relaxed">
                  {contest.description}
                </p>
              </div>
              
              {/* 赛事分类 */}
              <div className="flex flex-wrap gap-2 mt-6">
                {contest.categories.map((category: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-bg-deep text-text-muted rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* 奖项设置 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">奖项设置</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contest.prizes.map((prize: any, index: number) => (
                  <div key={index} className="p-4 bg-bg-deep rounded-lg border border-accent">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-text-primary">{prize.rank}</h3>
                      <span className="text-sm text-accent">{prize.count}名</span>
                    </div>
                    <p className="text-xl font-medium text-text-muted">{prize.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 参赛规则 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">参赛规则</h2>
              <ul className="space-y-3">
                {contest.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-text-muted">{rule}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 赛事日历 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">赛事日历</h2>
              <div className="p-4 bg-bg-deep rounded-lg text-center">
                <div className="text-sm text-text-muted mb-1">
                  截止日期
                </div>
                <div className="text-4xl font-bold text-accent">
                  {new Date(contest.deadline).getDate()}
                </div>
                <div className="text-sm text-text-muted">
                  {['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(contest.deadline).getMonth()]}
                </div>
              </div>
              {contest.status === '进行中' && (
                <div className="mt-4 p-3 bg-[#ED8936]/20 border border-[#ED8936] rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-text-muted">剩余时间</span>
                    <span className="text-sm font-medium text-text-primary">{daysLeft} 天</span>
                  </div>
                  <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ED8936]" 
                      style={{ width: `${Math.max(0, (daysLeft / 60) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* 赛事标签 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">赛事标签</h2>
              <div className="flex flex-wrap gap-2">
                {contest.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-bg-deep text-text-muted rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

             {/* 分享 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">分享赛事</h2>
              <div className="grid grid-cols-4 gap-3">
                <button 
                  onClick={() => {
                    toast.info('请在微信中打开此链接进行分享');
                  }}
                  className="w-full h-12 bg-bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                >
                  <i className="fa-brands fa-weixin text-xl"></i>
                </button>
                <button 
                  onClick={() => {
                    const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(`${window.location.origin}/contest/${id}`)}&title=${encodeURIComponent(contest.title)}`;
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                  }}
                  className="w-full h-12 bg-bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                >
                  <i className="fa-brands fa-weibo text-xl"></i>
                </button>
                <button 
                  onClick={() => {
                    const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(`${window.location.origin}/contest/${id}`)}&title=${encodeURIComponent(contest.title)}`;
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                  }}
                  className="w-full h-12 bg-bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                >
                  <i className="fa-brands fa-qq text-xl"></i>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${window.location.origin}/contest/${id}`);
                      toast.success('链接已复制到剪贴板');
                    } catch (err) {
                      toast.error('复制失败，请手动复制');
                    }
                  }}
                  className="w-full h-12 bg-bg-deep rounded-lg flex items-center justify-center text-text-muted hover:bg-accent hover:text-text-primary transition-colors"
                >
                  <i className="fa-solid fa-link text-xl"></i>
                </button>
              </div>
            </div>

            {/* 常见问题 */}
            <div className="bg-bg-card rounded-xl p-6 border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">参赛须知</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-text-primary mb-1">如何提交作品？</h3>
                  <p className="text-sm text-text-muted">点击"立即参赛"按钮，按照指引上传作品并填写相关信息即可完成报名。</p>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">作品有什么格式要求？</h3>
                  <p className="text-sm text-text-muted">支持JPG、PNG格式，文件大小不超过20MB，请确保保留作品的EXIF信息。</p>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">如何查询比赛结果？</h3>
                  <p className="text-sm text-text-muted">比赛结果将在截止日后15个工作日内公布，您可以在赛事页面或个人中心查看结果。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 评论区 */}
        <div className="bg-bg-card rounded-xl p-6 border border-accent mt-8">
          <CommentSection postId={contest.id} />
        </div>
      </motion.div>
    </div>
  );
};

export default ContestDetail;