import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/authContext';

interface Answer {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  isLiked: boolean;
  answers: Answer[];
  isReported?: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface EquipmentQuestionsProps {
  equipmentId: string;
}

// 表情列表
const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩"
];

// 模拟用户列表
const mockUsers: User[] = [
  { id: '1', name: '摄影爱好者', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography+enthusiast+male+casual&sign=baaa24d00499bfa62c3331c6bf8fac63' },
  { id: '2', name: '器材纠结者', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera+lover+male+thinking&sign=b4c3b2a13ef3cc80ca680a6123c78331' },
  { id: '3', name: '摄影新手', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young+photographer+student+male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8' },
  { id: '4', name: '专业摄影师', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional+photographer+male+serious&sign=d191f4ad9c14b22a1a115bafed6ee0ed' },
  { id: '5', name: '器材专家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=equipment+expert+male+glasses&sign=8d8319579a6ab06ca40149f75a43e06b' },
  { id: '6', name: '摄影导师', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography+teacher+female+experienced&sign=a5b88cad9fb822a07468f9c7f743556f' }
];

// 举报原因
const REPORT_REASONS = [
  "垃圾信息", "广告内容", "不友善行为", "违规内容", "盗用他人作品", "其他原因"
];

// 格式化日期为相对时间
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "刚刚";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分钟前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}小时前`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
};

export const EquipmentQuestions: React.FC<EquipmentQuestionsProps> = ({ equipmentId }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      title: '这款器材的续航能力如何？适合长时间外出拍摄吗？',
      content: '最近打算入手这款器材用于户外拍摄，想了解一下实际使用中的续航表现如何？在寒冷天气下有什么需要注意的吗？',
      author: '摄影爱好者',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography+enthusiast+male+casual&sign=baaa24d00499bfa62c3331c6bf8fac63',
      date: '2023-10-20',
      likes: 24,
      isLiked: false,
      answers: [
        {
          id: 'a1-1',
          content: '这款器材的续航表现非常出色，满电状态下可以支持约800张照片的拍摄，完全适合一天的外出拍摄需求。建议长时间外出时携带一块备用电池以确保万无一失。在寒冷天气下，电池续航会有所下降，建议将备用电池放在贴身口袋保暖。',
          author: '专业摄影师',
          authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional+photographer+male+serious&sign=d191f4ad9c14b22a1a115bafed6ee0ed',
          date: '2023-10-20',
          likes: 18,
          isLiked: false
        },
        {
          id: 'a1-2',
          content: '补充一点，使用取景器比使用屏幕可以节省大约30%的电量，这在户外拍摄时非常实用。',
          author: '器材专家',
          authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=equipment+expert+male+glasses&sign=8d8319579a6ab06ca40149f75a43e06b',
          date: '2023-10-21',
          likes: 7,
          isLiked: false
        }
      ]
    },
    {
      id: 'q2',
      title: '与同价位竞品相比，这款器材的最大优势是什么？',
      content: '在预算有限的情况下，纠结于这款和另外几款同价位的器材，想听听大家的使用体验和建议。',
      author: '器材纠结者',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera+lover+male+thinking&sign=b4c3b2a13ef3cc80ca680a6123c78331',
      date: '2023-10-15',
      likes: 42,
      isLiked: false,
      answers: [
        {
          id: 'a2-1',
          content: '相比同价位竞品，这款器材在自动对焦速度、低光拍摄能力和视频性能方面表现更为出色，特别是其对焦系统在复杂环境下的追踪能力非常稳定可靠。如果您经常拍摄动态场景或在弱光环境下工作，这款会是更好的选择。',
          author: '专业摄影师',
          authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional+photographer+male+serious&sign=d191f4ad9c14b22a1a115bafed6ee0ed',
          date: '2023-10-15',
          likes: 35,
          isLiked: false
        }
      ]
    },
    {
      id: 'q3',
      title: '新手入门推荐购买这款器材吗？操作难度如何？',
      content: '刚接触摄影，想一步到位买个好点的器材，不知道这款是否适合新手使用。',
      author: '摄影新手',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young+photographer+student+male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8',
      date: '2023-10-08',
      likes: 36,
      isLiked: false,
      answers: [
        {
          id: 'a3-1',
          content: '对于新手来说，这款器材的操作相对友好，具有完善的自动模式和入门引导功能。不过考虑到其价格和专业性，更适合有一定预算且计划长期学习摄影的新手，纯入门用户可以考虑更基础的型号。',
          author: '摄影导师',
          authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography+teacher+female+experienced&sign=a5b88cad9fb822a07468f9c7f743556f',
          date: '2023-10-08',
          likes: 29,
          isLiked: false
        }
      ]
    },
    {
      id: 'q4',
      title: '这款器材的视频拍摄能力怎么样？',
      content: '主要用于视频创作，想了解一下这款器材的视频性能如何，比如对焦速度、防抖效果等。',
      author: '视频创作者',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=video+creator+male+creative&sign=09d8f710e0b9d12cb440bd6682ba86f4',
      date: '2023-10-10',
      likes: 15,
      isLiked: false,
      answers: []
    },
    {
      id: 'q5',
      title: '长时间使用后，器材的稳定性如何？',
      content: '担心长时间使用后会出现性能下降的问题，想了解一下耐用性。',
      author: '职业摄影师',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional+photographer+female+professional&sign=99e7157c8ef5fcd38b7174df209fe12f',
      date: '2023-10-05',
      likes: 18,
      isLiked: false,
      answers: []
    },
    {
      id: 'q6',
      title: '与其他品牌同级别产品相比，性价比如何？',
      content: '在几款产品之间犹豫，想听听客观的比较意见。',
      author: '理性消费者',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=smart+consumer+male+analytical&sign=acf27482099641676ade13677c24a73c',
      date: '2023-10-01',
      likes: 21,
      isLiked: false,
      answers: []
    },
    {
      id: 'q7',
      title: '这款器材的配件兼容性怎么样？',
      content: '想知道是否容易找到兼容的第三方配件，比如电池、存储卡等。',
      author: '配件控',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech+enthusiast+male+geek&sign=9edb5962d4309f865b1d31389fb0bdd2',
      date: '2023-09-28',
      likes: 12,
      isLiked: false,
      answers: []
    },
    {
      id: 'q8',
      title: '在恶劣环境下使用需要注意什么？',
      content: '经常需要在户外、雨天等环境下拍摄，想了解防护措施。',
      author: '户外摄影师',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=outdoor+photographer+male+adventurous&sign=ddabeb9b7009e2cb7a4dc17ecc54ed69',
      date: '2023-09-25',
      likes: 14,
      isLiked: false,
      answers: []
    },
    {
      id: 'q9',
      title: '这款器材的固件更新频繁吗？',
      content: '想知道厂商是否经常提供固件更新来改善性能。',
      author: '技术关注者',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech+follower+male+knowledgeable&sign=abd9c099c0ee17f2fbd8ce20dbab9ba9',
      date: '2023-09-20',
      likes: 9,
      isLiked: false,
      answers: []
    },
    {
      id: 'q10',
      title: '购买后有哪些增值服务？',
      content: '想了解保修政策、延长服务等信息。',
      author: '潜在买家',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=potential+buyer+male+curious&sign=d178e0686a62ab4b42065552a21a4e02',
      date: '2023-09-18',
      likes: 7,
      isLiked: false,
      answers: []
    }
  ]);
  
  // 状态管理
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isAnswering, setIsAnswering] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  
  // 工具栏状态
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  
  // 搜索排序状态
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'unanswered'>('latest');
  const [filterBy, setFilterBy] = useState<'all' | 'answered' | 'unanswered'>('all');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // 弹窗状态
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState<Question | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 引用
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const questionListRef = useRef<HTMLDivElement>(null);
  
  // 获取草稿
  useEffect(() => {
    const draftTitle = localStorage.getItem(`questionDraftTitle_${equipmentId}`);
    const draftContent = localStorage.getItem(`questionDraftContent_${equipmentId}`);
    const draftImages = localStorage.getItem(`questionDraftImages_${equipmentId}`);
    
    if (draftTitle && draftContent) {
      setNewQuestionTitle(draftTitle);
      setNewQuestionContent(draftContent);
      if (draftImages) {
        setImagePreviews(JSON.parse(draftImages));
      }
    }
  }, [equipmentId, showNewQuestion]);
  
  // 自动保存草稿
  useEffect(() => {
    if (showNewQuestion) {
      const timer = setTimeout(() => {
        localStorage.setItem(`questionDraftTitle_${equipmentId}`, newQuestionTitle);
        localStorage.setItem(`questionDraftContent_${equipmentId}`, newQuestionContent);
        localStorage.setItem(`questionDraftImages_${equipmentId}`, JSON.stringify(imagePreviews));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [newQuestionTitle, newQuestionContent, imagePreviews, equipmentId, showNewQuestion]);
  
  // 处理点赞问题
  const handleLikeQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id 
        ? { ...q, likes: q.isLiked ? q.likes - 1 : q.likes + 1, isLiked: !q.isLiked } 
        : q
    ));
  };
  
  // 处理点赞回答
  const handleLikeAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a => 
            a.id === answerId 
              ? { ...a, likes: a.isLiked ? a.likes - 1 : a.likes + 1, isLiked: !a.isLiked } 
              : a
          )
        };
      }
      return q;
    }));
  };
  
  // 处理提交问题
  const handleSubmitQuestion = () => {
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) {
      toast.warning('请输入问题标题和内容');
      return;
    }
    
    const question: Question = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle,
      content: newQuestionContent,
      author: '我',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default+user+avatar&sign=a323de447d924f02db241a15b12a9a1e',
      date: new Date().toLocaleDateString(),
      likes: 0,
      isLiked: false,
      answers: []
    };
    
    setQuestions([question, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setImagePreviews([]);
    setSelectedImages(null);
    setShowNewQuestion(false);
    
    // 清除草稿
    localStorage.removeItem(`questionDraftTitle_${equipmentId}`);
    localStorage.removeItem(`questionDraftContent_${equipmentId}`);
    localStorage.removeItem(`questionDraftImages_${equipmentId}`);
    
    toast.success('问题提交成功，等待专业人士回答');
  };
  
  // 处理提交回复
  const handleSubmitReply = (questionId: string) => {
    if (!replyContent.trim()) {
      toast.warning('请输入回复内容');
      return;
    }
    
    const newAnswer: Answer = {
      id: `a-${Date.now()}`,
      content: replyContent,
      author: '我',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default+user+avatar&sign=a323de447d924f02db241a15b12a9a1e',
      date: new Date().toLocaleDateString(),
      likes: 0,
      isLiked: false
    };
    
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    }));
    
    setReplyContent('');
    setReplyingTo(null);
    toast.success('回复提交成功');
  };
  
  // 处理回答问题
  const handleSubmitAnswer = (questionId: string) => {
    if (!answerContent.trim()) {
      toast.warning('请输入回答内容');
      return;
    }
    
    const newAnswer: Answer = {
      id: `a-${Date.now()}`,
      content: answerContent,
      author: '我',
      authorAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=default+user+avatar&sign=a323de447d924f02db241a15b12a9a1e',
      date: new Date().toLocaleDateString(),
      likes: 0,
      isLiked: false
    };
    
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    }));
    
    setAnswerContent('');
    setIsAnswering(null);
    toast.success('回答提交成功');
  };
  
  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = e.target.files;
    const newPreviews: string[] = [...imagePreviews];
    
    if (imagePreviews.length + files.length > 5) {
      toast.warning('最多上传5张图片');
      return;
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('图片大小不能超过5MB');
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = event => {
        if (event.target?.result) {
          setImagePreviews(prev => [...prev, event.target.result as string]);
        }
      };
      
      reader.readAsDataURL(file);
    }
    
    setSelectedImages(files);
  };
  
  // 移除图片预览
  const removeImagePreview = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // 插入表情
  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue = newQuestionContent.slice(0, start) + emoji + newQuestionContent.slice(end);
      setNewQuestionContent(newValue);
      
      // 设置光标位置
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setNewQuestionContent(prev => prev + emoji);
    }
    
    setShowEmojiPicker(false);
  };
  
  // 插入@提及
  const insertMention = (user: User) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const mentionText = `@${user.name} `;
      const newValue = newQuestionContent.slice(0, start) + mentionText + newQuestionContent.slice(end);
      setNewQuestionContent(newValue);
      
      // 设置光标位置
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start + mentionText.length, start + mentionText.length);
      }, 0);
    } else {
      setNewQuestionContent(prev => prev + `@${user.name} `);
    }
    
    setShowMentionPicker(false);
  };
  
  // 提交举报
  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.warning('请选择举报原因');
      return;
    }
    
    if (reportingQuestion) {
      setQuestions(questions.map(q => 
        q.id === reportingQuestion.id 
          ? { ...q, isReported: true } 
          : q
      ));
      
      setShowReportModal(false);
      setReportingQuestion(null);
      setReportReason('');
      setReportNote('');
      
      toast.success('举报已提交，我们会尽快处理');
    }
  };
  
  // 过滤和排序问题
  const getFilteredAndSortedQuestions = () => {
    let result = [...questions];
    
    // 搜索过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(q => 
        q.title.toLowerCase().includes(term) || 
        q.content.toLowerCase().includes(term) ||
        q.author.toLowerCase().includes(term)
      );
    }
    
    // 状态过滤
    if (filterBy === 'answered') {
      result = result.filter(q => q.answers.length > 0);
    } else if (filterBy === 'unanswered') {
      result = result.filter(q => q.answers.length === 0);
    }
    
    // 排序
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'unanswered') {
      // 先显示未回答的问题
      result.sort((a, b) => {
        if (a.answers.length === 0 && b.answers.length > 0) return -1;
        if (a.answers.length > 0 && b.answers.length === 0) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
    
    return result;
  };
  
  // 获取热门问题
  const getHotQuestions = () => {
    return [...questions]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  };
  
  // 分页处理
  const filteredAndSortedQuestions = getFilteredAndSortedQuestions();
  const totalPages = Math.ceil(filteredAndSortedQuestions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuestions = filteredAndSortedQuestions.slice(startIndex, startIndex + pageSize);
  const hotQuestions = getHotQuestions();
  
  // 切换页码
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // 平滑滚动到顶部
    if (questionListRef.current) {
      questionListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 计算动态主题样式类
  const getThemeClasses = () => {
    if (theme === 'dark') {
      return {
        container: 'bg-[#2D3748] border-[#4A5F8B]',
        text: 'text-[#B8C6D8]',
        primaryText: 'text-[#F5F7FA]',
        secondaryText: 'text-[#6B7C93]',
        accentColor: 'text-[#4A5F8B]',
        inputBg: 'bg-[#2D3748] border-[#4A5F8B] text-[#F5F7FA]',
        cardBg: 'bg-[#1E2532]',
        button: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]',
        buttonSecondary: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]',
        border: 'border-[#4A5F8B]',
        highlight: 'text-[#4A5F8B]',
        likedColor: 'text-[#F56565]',
        answeredTag: 'bg-[#48BB78] text-white',
        unansweredTag: 'bg-[#F56565] text-white'
      };
    } else {
      return {
        container: 'bg-white border-gray-200',
        text: 'text-gray-600',
        primaryText: 'text-gray-900',
        secondaryText: 'text-gray-400',
        accentColor: 'text-blue-600',
        inputBg: 'bg-white border-gray-300 text-gray-900',
        cardBg: 'bg-white',
        button: 'bg-blue-600 text-white hover:bg-blue-700',
        buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        border: 'border-gray-200',
        highlight: 'text-blue-600',
        likedColor: 'text-red-500',
        answeredTag: 'bg-green-500 text-white',
        unansweredTag: 'bg-red-500 text-white'
      };
    }
  };
  
  const themeClasses = getThemeClasses();
  
  return (
    <div className={`mt-6 p-4 ${themeClasses.container} rounded-lg ${themeClasses.border} transition-colors duration-300`}>
      {/* 顶部操作栏 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        {/* 左侧搜索框 */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="搜索问题或作者.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 pl-10 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all`}
          />
          <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        {/* 右侧排序和主题切换 */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 排序下拉框 */}
          <div className="flex items-center">
            <span className="text-sm mr-2 text-gray-500">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'unanswered')}
              className={`px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer`}
            >
              <option value="latest">最新发布</option>
              <option value="popular">最热问题</option>
              <option value="unanswered">未回答</option>
            </select>
          </div>
          
          {/* 筛选下拉框 */}
          <div className="flex items-center">
            <span className="text-sm mr-2 text-gray-500">筛选：</span>
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value as 'all' | 'answered' | 'unanswered');
                setCurrentPage(1);
              }}
              className={`px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer`}
            >
              <option value="all">全部问题</option>
              <option value="answered">已回答</option>
              <option value="unanswered">未回答</option>
            </select>
          </div>
          
          {/* 主题切换按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${themeClasses.buttonSecondary} transition-colors`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </motion.button>
        </div>
      </div>
      
      {/* 热门问题排行榜 */}
      {hotQuestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <i className="fa-solid fa-fire text-[#F56565] mr-2"></i>
            热门问题
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className={`p-4 rounded-lg ${themeClasses.cardBg} ${themeClasses.border} transition-all shadow-sm`}
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-500 text-white' : 
                    index === 1 ? 'bg-gray-400 text-white' : 
                    'bg-amber-700 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2 mb-2">{question.title}</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <i className="fa-solid fa-heart mr-1 text-gray-400"></i>
                        {question.likes}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        question.answers.length > 0 
                          ? themeClasses.answeredTag 
                          : themeClasses.unansweredTag
                      }`}>
                        {question.answers.length > 0 ? '已回答' : '未回答'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* 用户提问区标题和按钮 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#F5F7FA]">用户提问区</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewQuestion(!showNewQuestion)}
          className={`px-4 py-1.5 ${themeClasses.button} rounded-lg text-sm font-medium transition-colors`}
        >
          <i className="fa-solid fa-plus mr-1"></i>
          我要提问
        </motion.button>
      </div>
      
      {/* 提问表单 */}
      <AnimatePresence>
        {showNewQuestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className={`${themeClasses.cardBg} ${themeClasses.border} rounded-lg p-4`}>
              {/* 工具栏 */}
              <div className="flex space-x-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`}
                  title="添加表情"
                >
                  <i className="fa-solid fa-face-smile"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`}
                  title="上传图片"
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <i className="fa-solid fa-image"></i>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMentionPicker(!showMentionPicker)}
                  className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`}
                  title="@提及用户"
                >
                  <i className="fa-solid fa-at"></i>
                </motion.button>
              </div>
              
              {/* 表情选择器 */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute z-10 ${themeClasses.cardBg} ${themeClasses.border} rounded-lg p-3 shadow-lg mt-2`}
                  >
                    <div className="grid grid-cols-6 gap-2">
                      {EMOJI_LIST.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => insertEmoji(emoji)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-xl"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* @提及用户选择器 */}
              <AnimatePresence>
                {showMentionPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute z-10 ${themeClasses.cardBg} ${themeClasses.border} rounded-lg p-3 shadow-lg mt-2 max-h-60 overflow-y-auto`}
                  >
                    {mockUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => insertMention(user)}
                        className="w-full flex items-center p-2 text-left rounded hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{user.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mb-3">
                <label className="block text-sm text-[#B8C6D8] mb-1">问题标题</label>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="请输入问题标题..."
                  className={`w-full px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all`}
                />
              </div>
              <div className="mb-3 relative">
                <label className="block text-sm text-[#B8C6D8] mb-1">问题详情</label>
                <textarea
                  ref={textareaRef}
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  placeholder="请详细描述您的问题..."
                  className={`w-full px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none min-h-[100px] max-h-[200px]`}
                  style={{ overflow: 'hidden' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                  }}
                ></textarea>
                {/* 字数统计 */}
                <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {newQuestionContent.length}/300
                </div>
              </div>
              
              {/* 图片预览 */}
              {imagePreviews.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImagePreview(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                      >
                        <i className="fa-solid fa-times"></i>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNewQuestionTitle('');
                    setNewQuestionContent('');
                    setImagePreviews([]);
                    setSelectedImages(null);
                    setShowNewQuestion(false);
                  }}
                  className={`px-4 py-1.5 ${themeClasses.buttonSecondary} rounded-lg text-sm font-medium transition-colors border ${themeClasses.border}`}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitQuestion}
                  disabled={!newQuestionTitle.trim() || !newQuestionContent.trim()}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (!newQuestionTitle.trim() || !newQuestionContent.trim())
                      ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed'
                      : themeClasses.button
                  }`}
                >
                  提交
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 问答列表 */}
      <div ref={questionListRef} className="space-y-4">
        {isLoading ? (
          // 加载中状态
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-[#4A5F8B]"></i>
            </div>
            <p className="text-[#B8C6D8]">加载中..</p>
          </div>
        ) : paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((question) => (
            <motion.div
                         key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ 
                          rotateY: 1.5, 
                          scale: 1.02,
                          boxShadow: theme === 'dark' ? "0 8px 24px rgba(74,95,139,0.3)" : "0 8px 24px rgba(0,0,0,0.1)",
                          transition: { duration: 0.3 }
                        }}
                        style={{ 
                          transformStyle: 'preserve-3d',
                          backgroundColor: "transparent",
                          boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 30px 0px"
                        }}
                        className={`rounded-lg ${themeClasses.border} overflow-hidden shadow-sm`}
                      >
                        <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <img
                      src={question.authorAvatar}
                      alt={question.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-[#F5F7FA]">{question.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          question.answers.length > 0 
                            ? themeClasses.answeredTag 
                            : themeClasses.unansweredTag
                        }`}>
                          {question.answers.length > 0 ? '已回答' : '未回答'}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7C93] mt-1">
                        {question.author} · {formatRelativeTime(question.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}className="relative"
                      onClick={() => setShowMoreOptions(showMoreOptions === question.id ? null : question.id)}
                    >
                      <i className="fa-solid fa-ellipsis text-gray-400"></i>
                    </motion.button>
                    
                    {/* 更多操作菜单 */}
                    <AnimatePresence>
                      {showMoreOptions === question.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute right-0 mt-2 w-48 ${themeClasses.cardBg} rounded-lg shadow-lg ${themeClasses.border} py-2 z-10`}
                        >
                          {question.author === '我' && (
                            <>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-pen-to-square mr-2"></i>
                                编辑
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-trash mr-2"></i>
                                删除
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setReportingQuestion(question);
                              setShowReportModal(true);
                              setShowMoreOptions(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <i className="fa-solid fa-flag mr-2"></i>
                            举报
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikeQuestion(question.id)}
                      className={`flex items-center text-sm transition-colors ${
                        question.isLiked ? themeClasses.likedColor : 'text-[#B8C6D8] hover:text-[#F5F7FA]'
                      }`}
                    >
                      <motion.i
                        animate={question.isLiked ? { scale: [1, 1.2, 1], rotateY: 360 } : {}}
                        transition={{ duration: 0.5 }}
                        className={`fa-solid ${question.isLiked ? 'fa-heart' : 'fa-heart'}`}
                      ></motion.i>
                      <span className="ml-1">{question.likes}</span>
                    </motion.button>
                  </div>
                </div>
                
                <p className="mt-3 text-[#B8C6D8]">{question.content}</p>
                
                <div className="mt-3 flex justify-between items-center">
                  {question.answers.length > 0 ? (
                    <button
                      onClick={() => setReplyingTo(replyingTo === question.id ? null : question.id)}
                      className="text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
                    >
                      <i className="fa-solid fa-reply mr-1"></i>
                      {replyingTo === question.id ? '取消回复' : '回复'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAnswering(isAnswering === question.id ? null : question.id)}
                      className="text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
                    >
                      <i className="fa-solid fa-comment-dots mr-1"></i>
                      {isAnswering === question.id ? '取消回答' : '我来回答'}
                    </button>
                  )}
                </div>
                
                {/* 回复框 */}
                <AnimatePresence>
                  {replyingTo === question.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="请输入您的回复..."
                        className={`w-full px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-20`}
                      ></textarea>
                      <div className="flex justify-end space-x-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setReplyContent('');
                            setReplyingTo(null);
                          }}
                          className={`px-3 py-1 ${themeClasses.buttonSecondary} rounded-lg text-sm font-medium transition-colors border ${themeClasses.border}`}
                        >
                          取消
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubmitReply(question.id)}
                          disabled={!replyContent.trim()}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            !replyContent.trim()
                              ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed'
                              : themeClasses.button
                          }`}
                        >
                          提交回复
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* 回答框 */}
                <AnimatePresence>
                  {isAnswering === question.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="请输入您的回答..."
                        className={`w-full px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-32`}
                      ></textarea>
                      <div className="flex justify-end space-x-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setAnswerContent('');
                            setIsAnswering(null);
                          }}
                          className={`px-3 py-1 ${themeClasses.buttonSecondary} rounded-lg text-sm font-medium transition-colors border ${themeClasses.border}`}
                        >
                          取消
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubmitAnswer(question.id)}
                          disabled={!answerContent.trim()}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            !answerContent.trim()
                              ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed'
                              : themeClasses.button
                          }`}
                        >
                          提交回答
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* 回答列表 */}
              {question.answers.length > 0 && (
                <div className="border-t border-[#4A5F8B]">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="p-4 border-b border-[#4A5F8B]/30 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <img
                          src={answer.authorAvatar}
                          alt={answer.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[#F5F7FA]">{answer.author}</p>
                            <p className="text-xs text-[#6B7C93]">{formatRelativeTime(answer.date)}</p>
                          </div>
                          <p className="mt-2 text-sm text-[#B8C6D8]">{answer.content}</p>
                          <div className="mt-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleLikeAnswer(question.id, answer.id)}
                              className={`flex items-center text-xs transition-colors ${
                                answer.isLiked ? themeClasses.likedColor : 'text-[#6B7C93] hover:text-[#B8C6D8]'
                              }`}
                            >
                              <i className={`fa-solid ${answer.isLiked ? 'fa-heart' : 'fa-heart'}`}></i>
                              <span className="ml-1">{answer.likes}</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          // 空状态
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-question-circle text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无相关问题</h3>
            <p className="text-[#B8C6D8]">
              暂无相关问题，快来发起提问吧！
            </p>
          </div>
        )}
      </div>
      
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className={`inline-flex items-center rounded-md ${themeClasses.border} ${themeClasses.container} shadow-sm`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 text-sm font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : themeClasses.text}`}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </motion.button>
            
            <span className="px-3 py-2 text-sm font-medium mx-1">
              第{currentPage}页 / 共{totalPages}页
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 text-sm font-medium ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : themeClasses.text}`}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </motion.button>
          </nav>
        </div>
      )}
      
      {/* 举报弹窗 */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md ${themeClasses.cardBg} rounded-lg ${themeClasses.border} p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">举报问题</h3>
              <p className="mb-4 text-sm text-gray-600">请选择举报原因：</p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {REPORT_REASONS.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => setReportReason(reason)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      reportReason === reason 
                        ? themeClasses.button 
                        : `${themeClasses.buttonSecondary} border ${themeClasses.border}`
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              
              <div className="mb-4">
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="请输入补充说明（可选）"
                  className={`w-full px-3 py-2 ${themeClasses.inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-20`}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportModal(false)}
                  className={`px-4 py-2 ${themeClasses.buttonSecondary} rounded-lg font-medium transition-colors border ${themeClasses.border}`}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitReport}
                  className={`px-4 py-2 ${themeClasses.button} rounded-lg font-medium transition-colors`}
                >
                  提交举报
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};