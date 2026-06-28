import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CommentSection } from '../components/CommentSection';
import { ShareButton } from '../components/common/ShareButton';
import { useLikeAndBookmark } from '../hooks/useLikeAndBookmark';
import { useAuth } from '../contexts/authContext';

// 模拟摄影作品数据 - 银河氛围摄影平台，增加EXIF信息和版权信息
const mockPhotoPost = {
  id: '1',
  title: '黑白光影',
  description: '极简主义黑白摄影，通过光影对比展现建筑的几何美感。\n\n创作灵感：\n在城市中漫步时，被这座建筑的几何线条所吸引，阳光透过窗户形成的光影效果完美呈现了极简美学。\n\n拍摄参数：\n- 相机：Leica Q2 Monochrom\n- 镜头：Summilux 28mm f/1.7 ASPH\n- 光圈：f/2.8\n- 快门速度：1/125s\n- ISO：800\n- 构图：三分法，利用线条引导视线\n\n后期处理：\n1. 轻微调整对比度，增强黑白对比\n2. 调整高光和阴影，保留细节\n3. 使用渐变滤镜调整天空和地面的曝光平衡\n4. 轻微锐化，增强建筑线条感',
  image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52',
  author: {
    id: '1',
    name: '极简摄影师林风',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    bio: '专注极简主义和黑白摄影，通过简洁的构图和光影表达深刻的视觉语言，作品曾在多个国际摄影展中展出。',
    followers: 12543,
    following: 324,
    posts: 187,
    level: '新锐艺术家',
    has专栏: true,
    专栏价格: 399
  },
  likes: 2435,
  comments: 132,
  collections: 567, // 初始收藏数量
  tags: ['极简主义', '黑白', '建筑', '徕卡', '几何', '光影'],
  date: '2023-10-25',
  location: '上海当代艺术博物馆',
  views: 12876,
  format: 'RAW',
  copyrightType: '独家授权',
  exif: {
    camera: 'Leica Q2 Monochrom',
    lens: 'Summilux 28mm f/1.7 ASPH',
    aperture: 'f/2.8',
    shutter: '1/125s',
    iso: '800',
    focalLength: '28mm',
    whiteBalance: '日光',
    date: '2023-10-25 14:30:45'
  },
  licensingOptions: [
    { id: 'standard', name: '标准授权', price: 300, description: '适用于非商业用途' },
    { id: 'commercial', name: '商业授权', price: 1200, description: '适用于商业用途' },
    { id: 'exclusive', name: '独家授权', price: 3500, description: '获得作品独家使用权' }
  ],
  // 打赏选项
  donationOptions: [
    { id: 'small', name: '小额打赏', amount: 10 },
    { id: 'medium', name: '标准打赏', amount: 30 },
    { id: 'large', name: '大额打赏', amount: 50 },
    { id: 'custom', name: '自定义', amount: 0 }
  ]
};

const PhotoDetail: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  // 使用自定义 hook 管理点赞和收藏状态
  const { 
    isLiked, 
    isBookmarked, 
    likeCount: likes, 
    collectionCount: collections, 
    handleLike, 
    handleBookmark 
  } = useLikeAndBookmark(mockPhotoPost.id, mockPhotoPost.likes, mockPhotoPost.collections);
  
  // 打赏相关状态
  const [selectedDonation, setSelectedDonation] = useState(mockPhotoPost.donationOptions[0]);
  const [customDonationAmount, setCustomDonationAmount] = useState(0);
  const [showDonationModal, setShowDonationModal] = useState(false);
  // 订阅状态
  const [isSubscribed, setIsSubscribed] = useState(false);
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(false);

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
    toast.success(isSubscribed ? '已取消订阅专栏' : `已订阅 ${mockPhotoPost.author.name} 的专栏`);
  };

  // 处理支付打赏
  const handlePayDonation = () => {
    const amount = selectedDonation.id === 'custom' ? customDonationAmount : selectedDonation.amount;
    
    if (amount <= 0) {
      toast.warning('请选择或输入有效的打赏金额');
      return;
    }
    
    // 模拟支付成功
    setShowDonationModal(false);
    setSelectedDonation(mockPhotoPost.donationOptions[0]);
    setCustomDonationAmount(0);
    toast.success(`感谢您的打赏，已成功打赏 ${amount} 元给 ${mockPhotoPost.author.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回作品集</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-[#F5F7FA] mb-8 text-center">
          {mockPhotoPost.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧作品信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 作品图片 - 增加版权标签 */}
            <div className="bg-[#2D3748] p-4 rounded-xl shadow-sm border border-[#4A5F8B] relative">
              {/* 版权标签 */}
              <div className={`absolute top-6 left-6 px-3 py-1 rounded text-xs ${
                mockPhotoPost.copyrightType === '独家授权' 
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                  : 'bg-[#6B7C93] text-[#F5F7FA]'
              }`}>
                {mockPhotoPost.copyrightType}
              </div>
              <img
                src={mockPhotoPost.image}
                alt={mockPhotoPost.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* 作品描述 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">作品描述</h2>
              <p className="text-[#B8C6D8] whitespace-pre-line">{mockPhotoPost.description}</p>
              
              {/* 作品标签 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {mockPhotoPost.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* EXIF信息 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#B8C6D8] mb-4">EXIF 信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">相机</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.camera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">镜头</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.lens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">光圈</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.aperture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">快门速度</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.shutter}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">ISO</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.iso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">焦距</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.focalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">白平衡</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.whiteBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#B8C6D8]">拍摄时间</span>
                    <span className="text-sm text-[#6B7C93] font-medium">{mockPhotoPost.exif.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <CommentSection postId={mockPhotoPost.id} />
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
                  <img
                    src={mockPhotoPost.author.avatar}
                    alt={mockPhotoPost.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#F5F7FA]">{mockPhotoPost.author.name}</h3>
                  <p className="text-sm text-[#4A5F8B]">{mockPhotoPost.author.level}</p>
                </div>
              </div>
              
              <p className="text-sm text-[#B8C6D8] mb-4">{mockPhotoPost.author.bio}</p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{mockPhotoPost.author.posts}</p>
                  <p className="text-xs text-[#B8C6D8]">作品</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{mockPhotoPost.author.followers}</p>
                  <p className="text-xs text-[#B8C6D8]">粉丝</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#F5F7FA]">{mockPhotoPost.author.following}</p>
                  <p className="text-xs text-[#B8C6D8]">关注</p>
                </div>
              </div>
              
               <button 
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#718096]' 
                      : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'
                  }`}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('请先登录后再关注作者');
                      return;
                    }
                    
                    setIsFollowing(!isFollowing);
                    toast.success(isFollowing ? '已取消关注作者' : `已关注 ${mockPhotoPost.author.name}`);
                  }}
                >
                  {isFollowing ? '已关注' : '关注作者'}
                </button>
            </div>

            {/* 互动区域 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <div className="flex justify-between mb-6">
                <button className={`flex flex-col items-center justify-center ${isLiked ? 'text-[#F56565]' : 'text-[#4A5F8B]'}`}
                  onClick={handleLike}
                  aria-label={isLiked ? "取消点赞" : "点赞"}
                >
                  <div className={`w-12 h-12 rounded-full ${isLiked ? 'bg-[#F56565]/20' : 'bg-[#4A5F8B]/20'} flex items-center justify-center mb-2`}>
                    <i className={`fa-solid fa-heart text-xl ${isLiked ? 'text-[#F56565]' : 'text-[#4A5F8B]'}`}></i>
                  </div>
                  <span className={`text-sm ${isLiked ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`}>{likes}</span>
                </button>
                <button 
                  className={`flex flex-col items-center justify-center ${isBookmarked ? 'text-[#F6AD55]' : 'text-[#4A5F8B]'}`}
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "取消收藏" : "收藏"}
                >
                  <div className={`w-12 h-12 rounded-full ${isBookmarked ? 'bg-[#F6AD55]/20' : 'bg-[#4A5F8B]/20'} flex items-center justify-center mb-2`}>
                    <i className={`fa-solid fa-bookmark text-xl ${isBookmarked ? 'text-[#F6AD55]' : 'text-[#4A5F8B]'}`}></i>
                    </div>
                   <span className="text-sm text-[#B8C6D8]">{collections}</span>
                </button>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <ShareButton
                      url={`${window.location.origin}/photo/${id}`}
                      title={mockPhotoPost.title}
                    />
                    <span className="text-sm text-[#B8C6D8] mt-2">分享</span>
                  </div>
              </div>
              
               <div className="space-y-4">
                 <button className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center justify-center">
                   <i className="fa-solid fa-download mr-2"></i>
                   下载原图
                 </button>
                 <button 
                   onClick={handleDonation}
                   className="w-full py-2 bg-gradient-to-r from-[#F56565] to-[#ED8936] text-[#F5F7FA] rounded-lg font-medium hover:from-[#E53E3E] hover:to-[#DD6B20] transition-colors flex items-center justify-center border border-[#F56565]"
                 >
                   <i className="fa-solid fa-coins mr-2"></i>
                   打赏作者
                 </button>
                 {mockPhotoPost.author.has专栏 && (
                   <button 
                     onClick={handleSubscribe}
                     className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                       isSubscribed 
                         ? 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]' 
                         : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
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
                         订阅专栏 ¥{mockPhotoPost.author.专栏价格}/年
                       </>
                     )}
                   </button>
                 )}
                 <button className="w-full py-2 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors flex items-center justify-center">
                   <i className="fa-solid fa-ellipsis-h mr-2"></i>
                   更多选项
                 </button>
               </div>
            </div>

            {/* 版权交易 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <h3 className="font-bold text-[#F5F7FA] mb-4">版权交易</h3>
              
              <div className="space-y-4">
                {mockPhotoPost.licensingOptions.map(option => (
                  <div key={option.id} className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-[#F5F7FA]">{option.name}</h4>
                      <span className="font-bold text-[#4A5F8B]">¥{option.price}</span>
                    </div>
                    <p className="text-xs text-[#B8C6D8] mb-3">{option.description}</p>
                    <button className="w-full py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                      购买授权
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-[#4A5F8B] hover:underline transition-colors">
                  查看完整授权协议
                </button>
              </div>
            </div>

            {/* 作品信息 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <h3 className="font-bold text-[#F5F7FA] mb-4">作品信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">发布时间</span>
                  <span className="text-sm text-[#B8C6D8]">{mockPhotoPost.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">拍摄地点</span>
                  <span className="text-sm text-[#B8C6D8]">{mockPhotoPost.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">浏览量</span>
                  <span className="text-sm text-[#B8C6D8]">{mockPhotoPost.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">点赞数</span>
                  <span className="text-sm text-[#B8C6D8]">{likes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">评论数</span>
                  <span className="text-sm text-[#B8C6D8]">{mockPhotoPost.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#B8C6D8]">文件格式</span>
                  <span className="text-sm text-[#B8C6D8]">{mockPhotoPost.format}</span>
                </div>
              </div>
            </div>

            {/* 相关推荐 */}
            <div className="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
              <h3 className="font-bold text-[#F5F7FA] mb-4">相关推荐</h3>
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
                    <div className="rounded-lg overflow-hidden border border-[#4A5F8B] group-hover:border-[#4A5F8B] transition-colors">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-[#B8C6D8] mt-1">@极简摄影师林风</p>
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
            className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#F5F7FA]">打赏作者</h3>
              <button 
                onClick={() => setShowDonationModal(false)}
                className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={mockPhotoPost.author.avatar} 
                  alt={mockPhotoPost.author.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#4A5F8B]"
                />
                <div>
                  <h4 className="font-medium text-[#F5F7FA]">{mockPhotoPost.author.name}</h4>
                  <p className="text-sm text-[#B8C6D8]">{mockPhotoPost.author.level}</p>
                </div>
              </div>
              <p className="text-sm text-[#B8C6D8]">
                您的打赏将直接支持作者创作更多优质内容
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-[#F5F7FA] mb-3">选择打赏金额</h4>
              <div className="grid grid-cols-4 gap-3">
                {mockPhotoPost.donationOptions.filter(option => option.id !== 'custom').map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDonation(option)}
                    className={`py-2 rounded-lg transition-colors ${
                      selectedDonation.id === option.id 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B]' 
                        : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
                    }`}
                  >
                    ¥{option.amount}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDonation(mockPhotoPost.donationOptions[3])}
                  className={`py-2 rounded-lg transition-colors ${
                    selectedDonation.id === 'custom' 
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B]' 
                      : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
                  }`}
                >
                  自定义
                </button>
              </div>
              
              {selectedDonation.id === 'custom' && (
                <div className="mt-4">
                  <input
                    type="number"
                    value={customDonationAmount}
                    onChange={(e) => setCustomDonationAmount(Number(e.target.value))}
                    min="1"
                    placeholder="输入自定义金额"
                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDonationModal(false)}
                className="flex-1 py-3 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
              >
                取消
              </button>
              <button 
                onClick={handlePayDonation}
                className="flex-1 py-3 bg-gradient-to-r from-[#F56565] to-[#ED8936] text-[#F5F7FA] rounded-lg font-medium hover:from-[#E53E3E] hover:to-[#DD6B20] transition-colors border border-[#F56565]"
              >
                确认支付 ¥{selectedDonation.id === 'custom' ? customDonationAmount : selectedDonation.amount}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoDetail;