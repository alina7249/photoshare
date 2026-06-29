import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';
import { ShareButton } from '../components/common/ShareButton';
import { useLikeAndBookmark } from '../hooks/useLikeAndBookmark';
import { useAuth } from '../contexts/authContext';
import { apiGet } from '../lib/api';

// 摄影作品类型定义
interface PhotoPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    posts: number;
    level: string;
    has专栏: boolean;
    专栏价格: number;
  };
  likes: number;
  comments: number;
  collections: number;
  tags: string[];
  date: string;
  location: string;
  views: number;
  format: string;
  copyrightType: string;
  exif: {
    camera: string;
    lens: string;
    aperture: string;
    shutter: string;
    iso: string;
    focalLength: string;
    whiteBalance: string;
    date: string;
  };
  licensingOptions: Array<{ id: string; name: string; price: number; description: string }>;
  donationOptions: Array<{ id: string; name: string; amount: number }>;
}

const PhotoDetail: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [photo, setPhoto] = useState<PhotoPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 使用自定义 hook 管理点赞和收藏状态
  const { 
    isLiked, 
    isBookmarked, 
    likeCount: likes, 
    collectionCount: collections, 
    handleLike, 
    handleBookmark 
  } = useLikeAndBookmark(photo?.id || '', photo?.likes || 0, photo?.collections || 0);
  
  // 打赏相关状态
  const [selectedDonation, setSelectedDonation] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [customDonationAmount, setCustomDonationAmount] = useState(0);
  const [showDonationModal, setShowDonationModal] = useState(false);
  // 订阅状态
  const [isSubscribed, setIsSubscribed] = useState(false);
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiGet<PhotoPost>(`/photos/${id}`)
      .then((data) => {
        setPhoto(data);
        if (data.donationOptions && data.donationOptions.length > 0) {
          setSelectedDonation(data.donationOptions[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPhoto(null);
        setLoading(false);
      });
  }, [id]);

  // handleLike 和 handleBookmark 已在 useLikeAndBookmark hook 中定义

  // 处理评论提交功能已在CommentSection组件中实现

  // 处理打赏
  const handleDonation = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再打赏');
      return;
    }
    
    setShowDonationModal(true);
  };

  // 处理订阅专栏
  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再订阅专栏');
      return;
    }
    
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? '已取消订阅专栏' : `已订阅 ${photo!.author.name} 的专栏`);
  };

  // 处理支付打赏
  const handlePayDonation = () => {
    if (!selectedDonation) return;
    const amount = selectedDonation?.id === 'custom' ? customDonationAmount : selectedDonation.amount;
    
    if (amount <= 0) {
      toast.warning('请选择或输入有效的打赏金额');
      return;
    }
    
    // 模拟支付成功
    setShowDonationModal(false);
    setSelectedDonation(photo!.donationOptions[0]);
    setCustomDonationAmount(0);
    toast.success(`感谢您的打赏，已成功打赏 ${amount} 元给 ${photo!.author.name}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
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
    <div className="container mx-auto px-4 py-8 bg-bg-deep star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回作品集</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
          {photo?.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧作品信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 作品图片 - 增加版权标签 */}
            <div className="bg-bg-card p-4 rounded-xl shadow-sm border border-accent relative">
              {/* 版权标签 */}
              <div className={`absolute top-6 left-6 px-3 py-1 rounded text-xs ${
                photo?.copyrightType === '独家授权' 
                  ? 'bg-accent text-text-primary' 
                  : 'bg-accent-hover text-text-primary'
              }`}>
                {photo?.copyrightType}
              </div>
              <img
                src={photo?.image}
                alt={photo?.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* 作品描述 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <h2 className="text-xl font-bold text-text-primary mb-4">作品描述</h2>
              <p className="text-text-muted whitespace-pre-line">{photo?.description}</p>
              
              {/* 作品标签 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {photo?.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* EXIF信息 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <h2 className="text-xl font-bold text-text-muted mb-4">EXIF 信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">相机</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.camera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">镜头</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.lens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">光圈</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.aperture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">快门速度</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.shutter}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">ISO</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.iso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">焦距</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.focalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">白平衡</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.whiteBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">拍摄时间</span>
                    <span className="text-sm text-accent-hover font-medium">{photo?.exif.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <CommentSection postId={photo?.id} />
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
                  <img
                    src={photo?.author.avatar}
                    alt={photo?.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">{photo?.author.name}</h3>
                  <p className="text-sm text-accent">{photo?.author.level}</p>
                </div>
              </div>
              
              <p className="text-sm text-text-muted mb-4">{photo?.author.bio}</p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="font-bold text-text-primary">{photo?.author.posts}</p>
                  <p className="text-xs text-text-muted">作品</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-primary">{photo?.author.followers}</p>
                  <p className="text-xs text-text-muted">粉丝</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-primary">{photo?.author.following}</p>
                  <p className="text-xs text-text-muted">关注</p>
                </div>
              </div>
              
               <button 
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-accent-hover text-text-primary hover:bg-text-light-muted' 
                      : 'bg-accent text-text-primary hover:bg-accent-hover'
                  }`}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('请先登录后再关注作者');
                      return;
                    }
                    
                    setIsFollowing(!isFollowing);
                    toast.success(isFollowing ? '已取消关注作者' : `已关注 ${photo?.author.name}`);
                  }}
                >
                  {isFollowing ? '已关注' : '关注作者'}
                </button>
            </div>

            {/* 互动区域 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <div className="flex justify-between mb-6">
                <button className={`flex flex-col items-center justify-center ${isLiked ? 'text-danger' : 'text-accent'}`}
                  onClick={handleLike}
                  aria-label={isLiked ? "取消点赞" : "点赞"}
                >
                  <div className={`w-12 h-12 rounded-full ${isLiked ? 'bg-danger/20' : 'bg-accent/20'} flex items-center justify-center mb-2`}>
                    <i className={`fa-solid fa-heart text-xl ${isLiked ? 'text-danger' : 'text-accent'}`}></i>
                  </div>
                  <span className={`text-sm ${isLiked ? 'text-danger' : 'text-text-muted'}`}>{likes}</span>
                </button>
                <button 
                  className={`flex flex-col items-center justify-center ${isBookmarked ? 'text-orange' : 'text-accent'}`}
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "取消收藏" : "收藏"}
                >
                  <div className={`w-12 h-12 rounded-full ${isBookmarked ? 'bg-orange/20' : 'bg-accent/20'} flex items-center justify-center mb-2`}>
                    <i className={`fa-solid fa-bookmark text-xl ${isBookmarked ? 'text-orange' : 'text-accent'}`}></i>
                    </div>
                   <span className="text-sm text-text-muted">{collections}</span>
                </button>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <ShareButton
                      url={`${window.location.origin}/photo/${id}`}
                      title={photo?.title}
                    />
                    <span className="text-sm text-text-muted mt-2">分享</span>
                  </div>
              </div>
              
               <div className="space-y-4">
                 <button className="w-full py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center justify-center">
                   <i className="fa-solid fa-download mr-2"></i>
                   下载原图
                 </button>
                 <button 
                   onClick={handleDonation}
                   className="w-full py-2 bg-gradient-to-r from-danger to-orange-dark text-text-primary rounded-lg font-medium hover:from-danger hover:to-orange-darker transition-colors flex items-center justify-center border border-danger"
                 >
                   <i className="fa-solid fa-coins mr-2"></i>
                   打赏作者
                 </button>
                 {photo?.author.has专栏 && (
                   <button 
                     onClick={handleSubscribe}
                     className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                       isSubscribed 
                         ? 'bg-accent-hover text-text-primary border border-accent-hover' 
                         : 'bg-bg-card text-text-muted border border-accent'
                     }`}
                   >
                     {isSubscribed ? (
                       <>
                         <i className="fa-solid fa-check mr-2"></i>
                         已订阅专栏
                       </>
                     ) : (
                       <>
                         <i className="fa-solid fa-book mr-2"></i>
                         订阅专栏 ¥{photo?.author.专栏价格}/年
                       </>
                     )}
                   </button>
                 )}
                 <button className="w-full py-2 bg-bg-card text-text-muted border border-accent rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors flex items-center justify-center">
                   <i className="fa-solid fa-ellipsis-h mr-2"></i>
                   更多选项
                 </button>
               </div>
            </div>

            {/* 版权交易 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <h3 className="font-bold text-text-primary mb-4">版权交易</h3>
              
              <div className="space-y-4">
                {photo?.licensingOptions.map(option => (
                  <div key={option.id} className="p-4 bg-bg-deep rounded-lg border border-accent">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-text-primary">{option.name}</h4>
                      <span className="font-bold text-accent">¥{option.price}</span>
                    </div>
                    <p className="text-xs text-text-muted mb-3">{option.description}</p>
                    <button className="w-full py-2 bg-gradient-to-r from-accent to-bg-card text-text-primary rounded-lg font-medium hover:from-accent-hover hover:to-accent transition-colors text-sm border border-accent">
                      购买授权
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-accent hover:underline transition-colors">
                  查看完整授权协议
                </button>
              </div>
            </div>

            {/* 作品信息 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <h3 className="font-bold text-text-primary mb-4">作品信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">发布时间</span>
                  <span className="text-sm text-text-muted">{photo?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">拍摄地点</span>
                  <span className="text-sm text-text-muted">{photo?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">浏览量</span>
                  <span className="text-sm text-text-muted">{photo?.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">点赞数</span>
                  <span className="text-sm text-text-muted">{likes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">评论数</span>
                  <span className="text-sm text-text-muted">{photo?.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">文件格式</span>
                  <span className="text-sm text-text-muted">{photo?.format}</span>
                </div>
              </div>
            </div>

            {/* 相关推荐 */}
            <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-accent">
              <h3 className="font-bold text-text-primary mb-4">相关推荐</h3>
              <div className="space-y-4">
                 {[
                  {
                    id: 1,
                    title: "极简建筑 1",
                    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=minimalist%20architecture%20photography%20black%20and%20white%201&sign=d0546c60c1bbd9a7507d312c4d6d4b5f"
                  },
                  {
                    id: 2,
                    title: "极简建筑 2",
                    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=minimalist%20architecture%20photography%20black%20and%20white%202&sign=16a505f957970330b69ed04cdc252cc8"
                  },
                  {
                    id: 3,
                    title: "极简建筑 3",
                    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=minimalist%20architecture%20photography%20black%20and%20white%203&sign=0f5af92197c024eba069c42c1da74ad2"
                  }
                ].map((related) => (
                  <motion.div
                    key={related.id}
                    whileHover={{ scale: 1.03 }}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden border border-accent group-hover:border-accent transition-colors">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-text-primary group-hover:text-accent transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-text-muted mt-1">@极简摄影师林风</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 打赏弹窗 */}
      {showDonationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-card rounded-xl border border-accent w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-primary">打赏作者</h3>
              <button 
                onClick={() => setShowDonationModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={photo?.author.avatar} 
                  alt={photo?.author.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <h4 className="font-medium text-text-primary">{photo?.author.name}</h4>
                  <p className="text-sm text-text-muted">{photo?.author.level}</p>
                </div>
              </div>
              <p className="text-sm text-text-muted">
                您的打赏将直接支持作者创作更多优质内容
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-text-primary mb-3">选择打赏金额</h4>
              <div className="grid grid-cols-4 gap-3">
                {photo?.donationOptions.filter(option => option.id !== 'custom').map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDonation(option)}
                    className={`py-2 rounded-lg transition-colors ${
                      selectedDonation?.id === option.id 
                        ? 'bg-accent text-text-primary border-2 border-accent' 
                        : 'bg-bg-deep text-text-muted border border-accent hover:border-accent'
                    }`}
                  >
                    ¥{option.amount}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDonation(photo!.donationOptions[3])}
                  className={`py-2 rounded-lg transition-colors ${
                    selectedDonation?.id === 'custom' 
                      ? 'bg-accent text-text-primary border-2 border-accent' 
                      : 'bg-bg-deep text-text-muted border border-accent hover:border-accent'
                  }`}
                >
                  自定义
                </button>
              </div>
              
              {selectedDonation?.id === 'custom' && (
                <div className="mt-4">
                  <input
                    type="number"
                    value={customDonationAmount}
                    onChange={(e) => setCustomDonationAmount(Number(e.target.value))}
                    min="1"
                    placeholder="输入自定义金额"
                    className="w-full px-4 py-3 bg-bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-text-muted"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDonationModal(false)}
                className="flex-1 py-3 bg-bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
              >
                取消
              </button>
              <button 
                onClick={handlePayDonation}
                className="flex-1 py-3 bg-gradient-to-r from-danger to-orange-dark text-text-primary rounded-lg font-medium hover:from-danger hover:to-orange-darker transition-colors border border-danger"
              >
                确认支付 ¥{selectedDonation?.id === 'custom' ? customDonationAmount : selectedDonation?.amount || 0}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoDetail;