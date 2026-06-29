import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from '../router/useRouter';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { CommentSection } from '../components/CommentSection';
import { useToast } from '../composables/useToast';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GROUP_API } from '../constants/api';
import { apiGet } from '../services/api';
import { HOVER_SHADOWS } from '../constants/theme';
import { ROUTES } from '../router/routes';

// 课程类型定义
interface CourseType {
  id: string;
  title: string;
  type: string;
  category: string;
  level: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    students: number;
    courses: number;
    rating: number;
  };
  coverImage: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  price: number;
  sections: CourseSection[];
  isTrial?: boolean;
}

// 课程章节类型定义
interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
}

// 课程课时类型定义
interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  isTrial?: boolean;
  isCompleted?: boolean;
}

// 笔记类型定义
interface Note {
  id: string;
  lessonId: string;
  content: string;
  timestamp: string;
  lessonTitle: string;
}

// 学习小组类型定义
interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  createdAt: string;
}

// 讲师详情类型定义
interface InstructorDetail {
  id: string;
  name: string;
  avatar: string;
  title: string;
  students: number;
  courses: number;
  rating: number;
  specialty: string;
  bio: string;
}

const CourseDetail: React.FC = () => {
  const toast = useToast();
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [showGroups, setShowGroups] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorDetail | null>(null);
  
  // 课程数据从API加载
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet<CourseType>(`/courses/${id}`)
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => {
        setCourse(null);
        setLoading(false);
      });
  }, [id]);

  // 学习小组和推荐讲师从API加载
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  useEffect(() => {
    apiGet(GROUP_API.LIST).then((data) => {
      setStudyGroups(data);
    }).catch(() => {
      // ignore
    });
  }, []);

  useEffect(() => {
    apiGet("/instructors").then((data) => {
      setInstructors(data);
    }).catch(() => {
      // ignore
    });
  }, []);

  // 从本地存储加载用户数据
  useEffect(() => {
    if (isAuthenticated && user && course) {
      const savedProgress = localStorage.getItem(`progress_${user.id}_${course.id}`);
      const savedNotes = localStorage.getItem(`notes_${user.id}_${course.id}`);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      
      // 计算总体进度
      calculateProgress();
    }
  }, [isAuthenticated, user, course]);
  
  // 计算总体进度
  const calculateProgress = () => {
    if (!course) return;
    let totalLessons = 0;
    let completedLessons = 0;
    
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        totalLessons++;
        if (progress[lesson.id]) {
          completedLessons++;
        }
      });
    });
    
    setOverallProgress(Math.round((completedLessons / totalLessons) * 100));
  };
  
  // 处理课时选择
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowNotes(false);
    
    // 自动滚动到视频区域
    setTimeout(() => {
      const videoElement = document.getElementById('course-video-section');
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // 处理完成课时
  const handleMarkCompleted = () => {
    if (!isAuthenticated || !selectedLesson || !course) return;
    
    const updatedProgress = { ...progress, [selectedLesson.id]: !progress[selectedLesson.id] };
    setProgress(updatedProgress);
    
    // 保存到本地存储
    localStorage.setItem(`progress_${user?.id}_${course.id}`, JSON.stringify(updatedProgress));
    
    // 更新总体进度
    calculateProgress();
    
    toast.success(progress[selectedLesson.id] ? '已取消完成标记' : '已标记为完成');
  };
  
  // 处理添加笔记
  const handleAddNote = () => {
    if (!isAuthenticated || !selectedLesson || !newNote.trim() || !course) return;
    
    const newNoteObj: Note = {
      id: `note_${Date.now()}`,
      lessonId: selectedLesson.id,
      content: newNote.trim(),
      timestamp: new Date().toLocaleString('zh-CN'),
      lessonTitle: selectedLesson.title
    };
    
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    
    // 保存到本地存储
    localStorage.setItem(`notes_${user?.id}_${course.id}`, JSON.stringify(updatedNotes));
    
    setNewNote('');
    toast.success('笔记保存成功');
  };
  
  // 处理删除笔记
  const handleDeleteNote = (noteId: string) => {
    if (!course) return;
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    // 更新本地存储
    localStorage.setItem(`notes_${user?.id}_${course.id}`, JSON.stringify(updatedNotes));
    
    toast.success('笔记已删除');
  };
  
  // 处理评分提交
  const handleRatingSubmit = () => {
    if (!isAuthenticated || userRating === 0) return;
    
    toast.success(`评分 ${userRating} 分已提交，感谢您的评价！`);
    setUserRating(0);
  };
  
  // 处理创建学习小组
  const handleCreateGroup = () => {
    if (!isAuthenticated || !newGroupName.trim()) return;
    
    toast.success(`学习小组 "${newGroupName}" 创建成功！`);
    setNewGroupName('');
    setShowGroups(false);
  };
  
  // 处理加入学习小组
  const handleJoinGroup = (group: StudyGroup) => {
    if (!isAuthenticated) return;
    
    toast.success(`已成功加入 "${group.name}" 学习小组！`);
  };
  
  // 检查是否有权限访问课程
  const hasAccess = () => {
    return course?.type === '免费' || isAuthenticated;
  };
  
  // 生成证书数据
  const getCertificateData = () => {
    return {
      id: `cert_${user?.id}_${course?.id}`,
      userName: user?.username || '学员',
      courseName: course?.title,
      completionDate: new Date().toLocaleDateString('zh-CN'),
      instructor: course?.instructor.name
    };
  };
  
  // 处理下载证书
  const handleDownloadCertificate = () => {
    if (!isAuthenticated) return;
    
    const certificate = getCertificateData();
    // 在实际应用中，这里应该生成并下载真实的证书PDF
    toast.success(`课程证书 "${certificate.courseName}" 已生成！`);
    setShowCertificate(false);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 bg-deep min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-text-primary mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">未找到该课程</h2>
          <p className="text-text-muted mb-6 max-w-md">抱歉，您访问的课程不存在或已被删除</p>
          <Link to={ROUTES.ONLINE_COURSES} className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent">返回课程列表</Link>
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
            to={ROUTES.ONLINE_COURSES}
            className="inline-flex items-center space-x-1 text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回课程列表</span>
          </Link>
        </div>
        
        {/* 课程基本信息 */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 课程封面和视频区域 */}
            <div className="lg:w-2/3">
              <div className="relative bg-card rounded-xl overflow-hidden border border-accent mb-6" id="course-video-section">
                <div className="aspect-video bg-deep flex items-center justify-center">
                  {selectedLesson ? (
                    // 模拟视频播放器
                    <div className="text-center">
                      <div className="mb-4 text-6xl text-accent">
                        <i className="fa-solid fa-play-circle"></i>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">{selectedLesson.title}</h3>
                      <p className="text-text-muted">{selectedLesson.duration}</p>
                      {!hasAccess() && !selectedLesson.isTrial && (
                        <div className="mt-4 px-4 py-2 bg-accent text-text-primary rounded-lg inline-block">
                          此内容需要登录才能访问
                        </div>
                      )}
                    </div>
                  ) : (
                    // 课程封面
                    <div className="w-full h-full relative">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-4">{course.title}</h2>
                        <p className="text-text-muted mb-6 max-w-2xl">{course.description}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                          {course.sections[0]?.lessons[0] && (
                            <button
                              onClick={() => handleLessonSelect(course.sections[0].lessons[0])}
                              className="px-6 py-3 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
                            >
                              {course.type === '免费' ? '开始学习' : '免费试看'}
                            </button>
                          )}
                          {course.type !== '免费' && (
                            <button className="px-6 py-3 bg-card text-text-primary border border-accent rounded-lg font-medium hover:bg-accent transition-colors">
                              立即购买
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedLesson && (
                  <div className="p-4 bg-card border-t border-accent flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleMarkCompleted}
                        className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
                          progress[selectedLesson.id]
                            ? 'bg-accent text-text-primary'
                            : 'bg-deep text-text-muted'
                        }`}
                      >
                        <i className={`fa-solid ${progress[selectedLesson.id] ? 'fa-check' : 'fa-circle-check'}`}></i>
                        <span>{progress[selectedLesson.id] ? '已完成' : '标记为完成'}</span>
                      </button>
                      <button
                        onClick={() => setShowNotes(!showNotes)}
                        className="flex items-center space-x-1 text-sm px-3 py-1 bg-deep text-text-muted rounded-full"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>笔记</span>
                      </button>
                    </div>
                    <div className="text-sm text-text-muted">
                      {selectedLesson.duration}
                    </div>
                  </div>
                )}
                
                {/* 笔记面板 */}
                {showNotes && selectedLesson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-deep border-t border-accent"
                  >
                    <div className="mb-4">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="添加学习笔记..."
                        className="w-full px-4 py-3 bg-card border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none h-24"
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddNote}
                          className="px-4 py-2 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                        >
                          保存笔记
                        </button>
                      </div>
                    </div>
                    
                    {/* 笔记列表 */}
                    {notes.filter(note => note.lessonId === selectedLesson.id).length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-text-muted mb-2">我的笔记</h4>
                        <div className="space-y-2">
                          {notes
                            .filter(note => note.lessonId === selectedLesson.id)
                            .map(note => (
                              <div key={note.id} className="p-3 bg-card rounded-lg border border-accent">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm text-text-primary">{note.content}</p>
                                  <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-text-muted hover:text-text-primary"
                                  >
                                    <i className="fa-solid fa-times"></i>
                                  </button>
                                </div><p className="text-xs text-accent-hover">{note.timestamp}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* 课程描述 */}
              <div className="bg-card rounded-xl p-6 border border-accent mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">课程介绍</h3>
                <p className="text-text-muted mb-4">
                  {course.description}
                </p>
                <p className="text-text-muted">
                  通过本课程的学习，你将掌握摄影曝光的核心原理，能够在不同场景下灵活运用光圈、快门和ISO的组合，拍出曝光准确、视觉效果出色的照片。课程包含丰富的实际案例分析和练习指导，帮助你快速将理论知识转化为实际拍摄技能。
                </p>
              </div>
              
              {/* 课程评价 */}
              <div className="bg-card rounded-xl p-6 border border-accent mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-4">课程评价</h3>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent">{course.rating}</div>
                    <div className="flex items-center justify-center mt-1 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < Math.floor(course.rating)
                              ? 'text-accent'
                              : 'text-accent/30'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-sm text-text-muted mt-1">课程评分</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        // 模拟各星级评分比例
                        const percentage = star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : star === 2 ? 3 : 2;
                        return (
                          <div key={star} className="flex items-center space-x-2">
                            <div className="w-16 text-sm text-text-muted">{star}星</div>
                            <div className="flex-1 h-2 bg-deep rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-10 text-right text-sm text-text-muted">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* 用户评分 */}
                {isAuthenticated && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-text-muted mb-2">我的评分</h4>
                    <div className="flex items-center space-x-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setUserRating(i + 1)}
                          className="text-2xl"
                          style={{ color: 'var(--light-blue-gray)', opacity: i < userRating ? 1 : 0.3 }}
                        >
                          <i className="fa-solid fa-star"></i>
                        </button>
                      ))}
                      {userRating > 0 && (
                        <button
                          onClick={handleRatingSubmit}
                          className="ml-4 px-4 py-1 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                        >
                          提交评分
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 评价列表 */}
                <CommentSection postId={course.id} />
              </div>
            </div>
            
            {/* 课程大纲和侧边信息 */}
            <div className="lg:w-1/3">
              {/* 课程信息卡片 */}
              <div className="bg-card rounded-xl p-6 border border-accent mb-6">
                <div className="flex items-center mb-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-text-primary">{course.instructor.name}</h3>
                    <p className="text-sm text-text-muted">{course.instructor.title}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-deep rounded-lg">
                    <p className="text-xl font-bold text-accent">{course.instructor.students.toLocaleString()}</p>
                    <p className="text-xs text-text-muted">学员</p>
                  </div>
                  <div className="text-center p-3 bg-deep rounded-lg">
                    <p className="text-xl font-bold text-accent">{course.instructor.courses}</p>
                    <p className="text-xs text-text-muted">课程</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">课程分类</span>
                    <span className="text-sm text-text-primary">{course.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">难度级别</span>
                    <span className="text-sm text-text-primary">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">课程时长</span>
                    <span className="text-sm text-text-primary">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">课时数量</span>
                    <span className="text-sm text-text-primary">{course.lessons} 课时</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-accent">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-muted">学习进度</span>
                    <span className="text-sm text-text-primary">{overallProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-deep rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                  
                  {overallProgress === 100 && isAuthenticated && (
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="w-full py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
                    >
                      <i className="fa-solid fa-certificate mr-1"></i>
                      领取课程证书
                    </button>
                  )}
                </div>
              </div>
              
              {/* 课程大纲 */}
              <div className="bg-card rounded-xl border border-accent overflow-hidden mb-6">
                <div className="p-4 border-b border-accent bg-card">
                  <h3 className="font-bold text-text-primary">课程大纲</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {course.sections.map((section) => (
                    <div key={section.id} className="mb-3">
                      <div className="p-3 bg-card border-b border-accent flex justify-between items-center">
                        <h4 className="font-medium text-text-primary">{section.title}</h4>
                        <span className="text-xs text-text-muted">{section.duration}</span>
                      </div>
                      <div className="space-y-1">
                        {section.lessons.map((lesson) => (
                          <motion.button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full text-left p-3 ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-accent text-text-primary'
                                : 'bg-deep text-text-muted hover:bg-card'
                            } flex justify-between items-center transition-colors`}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center">
                              {progress[lesson.id] && (
                                <i className="fa-solid fa-check-circle text-accent mr-2"></i>
                              )}
                              <span>{lesson.title}</span>
                              {lesson.isTrial && (
                                <span className="ml-2 px-1.5 py-0.5 bg-accent text-text-primary text-xs rounded">
                                  试看
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-text-muted">{lesson.duration}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 学习小组 */}
              <div className="bg-card rounded-xl border border-accent overflow-hidden">
                <div className="p-4 border-b border-accent bg-card flex justify-between items-center">
                  <h3 className="font-bold text-text-primary">学习小组</h3>
                  <button
                    onClick={() => setShowGroups(!showGroups)}
                    className="text-sm text-accent hover:text-accent-hover"
                  >
                    <i className={`fa-solid ${showGroups ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  </button>
                </div>
                
                {showGroups && (
                  <div className="p-4">
                    {/* 创建小组 */}
                    {isAuthenticated && (
                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="创建学习小组"
                            className="flex-1 px-3 py-2 bg-deep border border-accent text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                          />
                          <button
                            onClick={handleCreateGroup}
                            className="px-3 py-2 bg-accent text-text-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                          >
                            创建
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* 小组列表 */}
                    <div className="space-y-3">
                      {studyGroups.map((group) => (
                        <div key={group.id} className="p-3 bg-deep rounded-lg border border-accent">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-text-primary">{group.name}</h4>
                            {isAuthenticated && (
                              <button
                                onClick={() => handleJoinGroup(group)}
                                className="px-2 py-1 bg-accent text-text-primary rounded-lg text-xs font-medium hover:bg-accent-hover transition-colors"
                              >
                                加入
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-text-muted mb-2 line-clamp-2">{group.description}</p>
                          <div className="flex justify-between items-center text-xs text-accent-hover">
                            <span><i className="fa-solid fa-users mr-1"></i>{group.members} 成员</span>
                            <span>{group.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 推荐讲师部分 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">推荐讲师</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <motion.div
                key={instructor.id}
                whileHover={{ y: -5, boxShadow: HOVER_SHADOWS.ACCENT_MD }}
                className="bg-card rounded-xl p-6 border border-accent transition-all"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-accent"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary">{instructor.name}</h3>
                    <p className="text-sm text-text-muted">{instructor.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <i className="fa-solid fa-star text-accent mr-1"></i>
                    <span className="text-sm text-text-muted">{instructor.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-users text-accent mr-1"></i>
                    <span className="text-sm text-text-muted">{instructor.students.toLocaleString()} 学员</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-muted mb-4">{instructor.bio}</p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setSelectedInstructor(instructor);
                    }}
                    className="flex-1 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors border border-accent"
                  >
                    查看详情
                  </button>
                  <button 
                    onClick={() => {
                      toast.success(`已关注讲师 ${instructor.name}`);
                    }}
                    className="px-4 py-2 bg-deep text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* 证书弹窗 */}
      {showCertificate && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCertificate(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl border border-accent max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 证书预览 */}
            <div className="bg-white p-8 m-4 rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-accent mb-2">摄影技能认证证书</h2>
                <p className="text-lg text-accent-hover">CERTIFICATE OF COMPLETION</p>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-xl text-accent mb-1">兹证明</p>
                <p className="text-3xl font-bold text-accent mb-4">{user?.username}</p>
                <p className="text-lg text-accent-hover">已成功完成</p>
                <p className="text-2xl font-bold text-accent my-4">{course.title}</p>
                <p className="text-lg text-accent-hover">课程学习</p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <p className="text-sm text-accent-hover">讲师</p>
                  <p className="font-medium text-accent">{course.instructor.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-accent-hover">完成日期</p>
                  <p className="font-medium text-accent">{new Date().toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <div className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium">
                  <i className="fa-solid fa-certificate mr-2"></i>
                  摄影技能认证
                </div>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="p-4 flex justify-end space-x-3 border-t border-accent">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
              >
                关闭
              </button>
              <button
                onClick={handleDownloadCertificate}
                className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                <i className="fa-solid fa-download mr-1"></i>
                下载证书
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* 讲师详情模态框 */}
      {selectedInstructor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInstructor(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-xl border border-accent max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 讲师详情头部 */}
            <div className="p-6 border-b border-accent">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-primary">讲师详情</h3>
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            
            {/* 讲师详情内容 */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent">
                  <img
                    src={selectedInstructor.avatar}
                    alt={selectedInstructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-text-primary mb-1">{selectedInstructor.name}</h4>
                  <p className="text-sm text-text-muted mb-3">{selectedInstructor.title}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <i className="fa-solid fa-star text-accent mr-1"></i>
                      <span className="text-sm text-text-muted">{selectedInstructor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-users text-accent mr-1"></i>
                      <span className="text-sm text-text-muted">{selectedInstructor.students.toLocaleString()} 学员</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-book text-accent mr-1"></i>
                      <span className="text-sm text-text-muted">{selectedInstructor.courses} 课程</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-text-primary mb-2">擅长领域</h4>
                <span className="px-3 py-1 bg-deep text-text-muted rounded-full text-sm border border-accent">
                  {selectedInstructor.specialty}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-text-primary mb-2">个人简介</h4>
                <p className="text-text-muted">{selectedInstructor.bio}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-text-primary mb-2">代表课程</h4>
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="p-3 bg-deep rounded-lg border border-accent flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-text-primary">
                          {selectedInstructor.specialty}进阶课程 {item}
                        </h5>
                        <p className="text-xs text-text-muted mt-1">
                          10课时 · 2小时 · 初级到中级
                        </p>
                      </div>
                      <span className="text-accent font-medium">
                        {item === 1 ? '免费' : '¥199'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 讲师详情底部 */}
            <div className="p-4 border-t border-accent flex justify-end space-x-3">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="px-4 py-2 bg-card text-text-muted rounded-lg font-medium hover:bg-accent hover:text-text-primary transition-colors border border-accent"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  toast.success(`已关注讲师 ${selectedInstructor.name}`);
                  setSelectedInstructor(null);
                }}
                className="px-4 py-2 bg-accent text-text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                <i className="fa-solid fa-plus mr-1"></i>
                关注讲师
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CourseDetail;