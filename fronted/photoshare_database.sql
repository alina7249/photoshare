-- PhotoShare 数据库创建脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS photoshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE photoshare;

-- 一、用户管理模块

-- 用户表 (users)
-- 用户表(users)用于存储平台用户的基本信息和账户数据。userId是表的主键，username和email用于用户唯一标识，passwordHash存储加密后的用户密码。
CREATE TABLE IF NOT EXISTS users (
  userId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  email VARCHAR(100) NOT NULL COMMENT '邮箱',
  passwordHash VARCHAR(255) NOT NULL COMMENT '密码哈希',
  avatar VARCHAR(255) NULL DEFAULT NULL COMMENT '头像URL',
  bio TEXT NULL COMMENT '个人简介',
  interestTags JSON NULL COMMENT '兴趣标签',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('active','banned','pending') NOT NULL DEFAULT 'active' COMMENT '状态',
  lastLoginAt TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  followersCount INT NOT NULL DEFAULT 0 COMMENT '粉丝数',
  followingCount INT NOT NULL DEFAULT 0 COMMENT '关注数',
  postsCount INT NOT NULL DEFAULT 0 COMMENT '作品数',
  level VARCHAR(50) NULL DEFAULT NULL COMMENT '等级名称',
  levelNum INT NULL DEFAULT NULL COMMENT '等级数字',
  progress INT NULL DEFAULT NULL COMMENT '当前进度',
  progressMax INT NULL DEFAULT NULL COMMENT '最大进度',
  -- 主键与索引
  PRIMARY KEY (userId),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户权限表 (userPermissions)
-- 用户权限表(userPermissions)用于管理用户的特殊权限授予记录。permissionId是表的主键，通过userId关联用户表，记录用户获得的特殊权限类型permissionType和授权时间grantedAt。
CREATE TABLE IF NOT EXISTS userPermissions (
  permissionId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  permissionType VARCHAR(50) NOT NULL COMMENT '权限类型',
  grantedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
  -- 主键与索引
  PRIMARY KEY (permissionId),
  KEY idx_userPermissions_userId (userId),
  CONSTRAINT fk_userPermissions_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户权限表';

-- 关注表 (follows)
-- 关注表(follows)用于存储用户之间的关注关系。followId是表的主键，通过followerId和followingId关联用户表，记录关注者与被关注者的关系及关注时间createdAt。
CREATE TABLE IF NOT EXISTS follows (
  followId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  followerId BIGINT(20) NOT NULL COMMENT '关注者ID',
  followingId BIGINT(20) NOT NULL COMMENT '被关注者ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
  -- 主键与索引
  PRIMARY KEY (followId),
  UNIQUE KEY uk_follows_follower_following (followerId, followingId),
  KEY idx_follows_followerId (followerId),
  KEY idx_follows_followingId (followingId),
  CONSTRAINT fk_follows_followerId FOREIGN KEY (followerId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_follows_followingId FOREIGN KEY (followingId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- 会员表 (memberships)
-- 会员表(memberships)用于管理用户的会员订阅信息。membershipId是表的主键，通过userId关联用户表，记录会员类型membershipType和开始日期startDate。
CREATE TABLE IF NOT EXISTS memberships (
  membershipId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  membershipType ENUM('free','basic','premium','vip') NOT NULL DEFAULT 'free' COMMENT '会员类型',
  startDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始日期',
  endDate TIMESTAMP NULL DEFAULT NULL COMMENT '结束日期',
  status ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (membershipId),
  KEY idx_memberships_userId (userId),
  KEY idx_memberships_status (status),
  CONSTRAINT fk_memberships_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员表';

-- 二、作品展示与交流模块

-- 拍摄地点表 (photoLocations)
-- 拍摄地点表(photoLocations)用于存储摄影拍摄地点的地理信息。locationId是表的主键，记录地点名称name和地址address。
CREATE TABLE IF NOT EXISTS photoLocations (
  locationId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '地点ID',
  name VARCHAR(100) NOT NULL COMMENT '地点名称',
  address VARCHAR(255) NOT NULL COMMENT '地址',
  latitude DECIMAL(10,8) NOT NULL COMMENT '纬度',
  longitude DECIMAL(11,8) NOT NULL COMMENT '经度',
  image VARCHAR(255) NULL DEFAULT NULL COMMENT '图片URL',
  categories JSON NULL COMMENT '分类',
  photosCount INT NOT NULL DEFAULT 0 COMMENT '照片数量',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (locationId),
  KEY idx_photoLocations_latitude (latitude),
  KEY idx_photoLocations_longitude (longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拍摄地点表';

-- 摄影作品表 (photographs)
-- 摄影作品表(photographs)用于存储用户发布的摄影作品信息。photoId是表的主键，通过userId关联用户表，记录作品标题title和图片地址imageUrl。
CREATE TABLE IF NOT EXISTS photographs (
  photoId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '作品ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  title VARCHAR(100) NOT NULL COMMENT '作品标题',
  description TEXT NULL COMMENT '作品描述',
  imageUrl VARCHAR(255) NOT NULL COMMENT '图片URL',
  thumbnailUrl VARCHAR(255) NOT NULL COMMENT '缩略图URL',
  tags JSON NULL COMMENT '标签',
  locationId BIGINT(20) NULL DEFAULT NULL COMMENT '拍摄地点ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  viewsCount INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  likesCount INT NOT NULL DEFAULT 0 COMMENT '点赞次数',
  commentsCount INT NOT NULL DEFAULT 0 COMMENT '评论次数',
  visibility ENUM('public','private') NOT NULL DEFAULT 'public' COMMENT '可见性',
  -- 主键与索引
  PRIMARY KEY (photoId),
  KEY idx_photographs_userId (userId),
  KEY idx_photographs_locationId (locationId),
  KEY idx_photographs_createdAt (createdAt),
  CONSTRAINT fk_photographs_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_photographs_locationId FOREIGN KEY (locationId) REFERENCES photoLocations (locationId) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影作品表';

-- 用户拍摄地点记录表 (userPhotoLocations)
-- 用户拍摄地点记录表(userPhotoLocations)用于存储用户对拍摄地点的访问记录和评价。recordId是表的主键，通过userId和locationId分别关联用户表和拍摄地点表，记录访问次数visitCount、首次访问firstVisit和最近访问lastVisit时间。
CREATE TABLE IF NOT EXISTS userPhotoLocations (
  recordId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  locationId BIGINT(20) NOT NULL COMMENT '地点ID',
  visitCount INT NOT NULL DEFAULT 0 COMMENT '访问次数',
  firstVisit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次访问',
  lastVisit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近访问',
  rating TINYINT(1) NULL DEFAULT NULL COMMENT '评分(1-5)',
  notes TEXT NULL COMMENT '笔记',
  isFavorite TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收藏',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (recordId),
  UNIQUE KEY uk_userPhotoLocations_userLocation (userId, locationId),
  KEY idx_userPhotoLocations_userId (userId),
  KEY idx_userPhotoLocations_locationId (locationId),
  KEY idx_userPhotoLocations_isFavorite (isFavorite),
  CONSTRAINT fk_userPhotoLocations_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_userPhotoLocations_locationId FOREIGN KEY (locationId) REFERENCES photoLocations (locationId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户拍摄地点记录表';

-- 点赞表 (likes)
-- 点赞表(likes)用于存储用户对摄影作品的点赞记录。likeId是表的主键，通过userId和photoId分别关联用户表和摄影作品表，记录点赞时间createdAt。
CREATE TABLE IF NOT EXISTS likes (
  likeId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  photoId BIGINT(20) NOT NULL COMMENT '作品ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  -- 主键与索引
  PRIMARY KEY (likeId),
  UNIQUE KEY uk_likes_user_photo (userId, photoId),
  KEY idx_likes_photoId (photoId),
  CONSTRAINT fk_likes_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_likes_photoId FOREIGN KEY (photoId) REFERENCES photographs (photoId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- 收藏表 (bookmarks)
-- 收藏表(bookmarks)用于存储用户对摄影作品的收藏记录。bookmarkId是表的主键，通过userId和photoId分别关联用户表和摄影作品表，记录收藏时间createdAt。
CREATE TABLE IF NOT EXISTS bookmarks (
  bookmarkId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  photoId BIGINT(20) NOT NULL COMMENT '作品ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  -- 主键与索引
  PRIMARY KEY (bookmarkId),
  UNIQUE KEY uk_bookmarks_user_photo (userId, photoId),
  KEY idx_bookmarks_photoId (photoId),
  CONSTRAINT fk_bookmarks_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_bookmarks_photoId FOREIGN KEY (photoId) REFERENCES photographs (photoId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 评论表 (comments)
-- 评论表(comments)用于存储用户对摄影作品的评论内容。commentId是表的主键，通过userId和photoId分别关联用户表和摄影作品表，记录评论内容content、评论时间createdAt和更新时间updatedAt。
CREATE TABLE IF NOT EXISTS comments (
  commentId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  photoId BIGINT(20) NOT NULL COMMENT '作品ID',
  content TEXT NOT NULL COMMENT '评论内容',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  parentCommentId BIGINT(20) NULL DEFAULT NULL COMMENT '父评论ID',
  -- 主键与索引
  PRIMARY KEY (commentId),
  KEY idx_comments_userId (userId),
  KEY idx_comments_photoId (photoId),
  KEY idx_comments_parentCommentId (parentCommentId),
  CONSTRAINT fk_comments_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_comments_photoId FOREIGN KEY (photoId) REFERENCES photographs (photoId) ON DELETE CASCADE,
  CONSTRAINT fk_comments_parentCommentId FOREIGN KEY (parentCommentId) REFERENCES comments (commentId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 三、智能摄影辅助模块

-- AI角色表 (aiRoles)
-- AI角色表(aiRoles)用于存储AI摄影助手的角色配置信息。roleId是表的主键，记录角色名称name和描述description。
CREATE TABLE IF NOT EXISTS aiRoles (
  roleId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  name VARCHAR(50) NOT NULL COMMENT '角色名称',
  description TEXT NOT NULL COMMENT '角色描述',
  avatar VARCHAR(255) NULL DEFAULT NULL COMMENT '头像URL',
  systemPrompt TEXT NOT NULL COMMENT '系统提示词',
  features JSON NULL COMMENT '功能特性',
  isActive TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  sortOrder INT NOT NULL DEFAULT 0 COMMENT '排序',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (roleId),
  KEY idx_aiRoles_isActive (isActive),
  KEY idx_aiRoles_sortOrder (sortOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI角色表';

-- AI会话表 (aiChatSessions)
-- AI会话表(aiChatSessions)用于存储用户与AI助手的对话会话信息。sessionId是表的主键，通过userId和roleId分别关联用户表和AI角色表，记录会话标题sessionTitle、上下文ID contextId和会话状态status。
CREATE TABLE IF NOT EXISTS aiChatSessions (
  sessionId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  roleId BIGINT(20) NULL DEFAULT NULL COMMENT 'AI角色ID',
  sessionTitle VARCHAR(100) NULL DEFAULT NULL COMMENT '会话标题',
  contextId VARCHAR(100) NULL DEFAULT NULL COMMENT '上下文ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  lastMessageAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后消息时间',
  status ENUM('active','closed') NOT NULL DEFAULT 'active' COMMENT '状态',
  isPinned TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否置顶',
  -- 主键与索引
  PRIMARY KEY (sessionId),
  KEY idx_aiChatSessions_userId (userId),
  KEY idx_aiChatSessions_roleId (roleId),
  KEY idx_aiChatSessions_status (status),
  CONSTRAINT fk_aiChatSessions_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_aiChatSessions_roleId FOREIGN KEY (roleId) REFERENCES aiRoles (roleId) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI会话表';

-- AI消息表 (aiMessages)
-- AI消息表(aiMessages)用于存储用户与AI助手的对话消息内容。messageId是表的主键，通过sessionId关联AI会话表，记录发送者类型senderType(user用户/ai助手)、消息内容content和创建时间createdAt。
CREATE TABLE IF NOT EXISTS aiMessages (
  messageId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  sessionId BIGINT(20) NOT NULL COMMENT '会话ID',
  senderType ENUM('user','ai') NOT NULL COMMENT '发送者类型',
  content TEXT NOT NULL COMMENT '消息内容',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  metadata JSON NULL COMMENT '元数据',
  isFavorite TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收藏',
  tags JSON NULL COMMENT '标签',
  status ENUM('sending','sent','failed') NOT NULL DEFAULT 'sent' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (messageId),
  KEY idx_aiMessages_sessionId (sessionId),
  KEY idx_aiMessages_createdAt (createdAt),
  KEY idx_aiMessages_isFavorite (isFavorite),
  CONSTRAINT fk_aiMessages_sessionId FOREIGN KEY (sessionId) REFERENCES aiChatSessions (sessionId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI消息表';

-- 四、器材与学习资源模块

-- 器材表 (equipment)
-- 器材表(equipment)用于存储摄影器材的详细信息。equipmentId是表的主键，记录器材名称name和类型type。
CREATE TABLE IF NOT EXISTS equipment (
  equipmentId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '器材ID',
  name VARCHAR(100) NOT NULL COMMENT '器材名称',
  type ENUM('camera','lens','accessory') NOT NULL COMMENT '器材类型',
  brand VARCHAR(50) NOT NULL COMMENT '品牌',
  model VARCHAR(100) NOT NULL COMMENT '型号',
  price DECIMAL(10,2) NULL DEFAULT NULL COMMENT '价格',
  specs JSON NULL COMMENT '规格参数',
  description TEXT NULL COMMENT '描述',
  imageUrls JSON NULL COMMENT '图片URLs',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  averageRating DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT '平均评分',
  -- 主键与索引
  PRIMARY KEY (equipmentId),
  KEY idx_equipment_type (type),
  KEY idx_equipment_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材表';

-- 器材评测表 (equipmentReviews)
-- 器材评测表(equipmentReviews)用于存储用户对摄影器材的评测内容。reviewId是表的主键，通过equipmentId和userId分别关联器材表和用户表，记录评分rating、评测标题title和评测内容content。
CREATE TABLE IF NOT EXISTS equipmentReviews (
  reviewId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评测ID',
  equipmentId BIGINT(20) NOT NULL COMMENT '器材ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  rating INT NOT NULL COMMENT '评分',
  title VARCHAR(100) NOT NULL COMMENT '评测标题',
  content TEXT NOT NULL COMMENT '评测内容',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (reviewId),
  UNIQUE KEY uk_equipmentReviews_user_equipment (userId, equipmentId),
  KEY idx_equipmentReviews_equipmentId (equipmentId),
  KEY idx_equipmentReviews_userId (userId),
  KEY idx_equipmentReviews_rating (rating),
  CONSTRAINT fk_equipmentReviews_equipmentId FOREIGN KEY (equipmentId) REFERENCES equipment (equipmentId) ON DELETE CASCADE,
  CONSTRAINT fk_equipmentReviews_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材评测表';

-- 课程表 (courses)
-- 课程表(courses)用于存储摄影课程的详细信息。courseId是表的主键，通过instructorId关联用户表(讲师)，记录课程标题title、描述description、时长duration和价格price。
CREATE TABLE IF NOT EXISTS courses (
  courseId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  title VARCHAR(100) NOT NULL COMMENT '课程标题',
  description TEXT NOT NULL COMMENT '课程描述',
  instructorId BIGINT(20) NOT NULL COMMENT '讲师ID',
  duration INT NOT NULL COMMENT '课程时长',
  level ENUM('beginner','intermediate','advanced') NOT NULL COMMENT '难度等级',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  coverImage VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  lessons INT NULL DEFAULT NULL COMMENT '课程数',
  studentsCount INT NOT NULL DEFAULT 0 COMMENT '学生数',
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT '评分',
  reviewsCount INT NOT NULL DEFAULT 0 COMMENT '评论数',
  type ENUM('free','paid') NOT NULL DEFAULT 'paid' COMMENT '类型',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (courseId),
  KEY idx_courses_instructorId (instructorId),
  KEY idx_courses_category (category),
  KEY idx_courses_level (level),
  CONSTRAINT fk_courses_instructorId FOREIGN KEY (instructorId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- 课程章节表 (courseLessons)
-- 课程章节表(courseLessons)用于存储课程的章节信息。lessonId是表的主键，通过courseId关联课程表，记录章节标题title、描述description、视频地址videoUrl和时长duration。
CREATE TABLE IF NOT EXISTS courseLessons (
  lessonId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '章节ID',
  courseId BIGINT(20) NOT NULL COMMENT '课程ID',
  title VARCHAR(100) NOT NULL COMMENT '章节标题',
  description TEXT NULL COMMENT '章节描述',
  videoUrl VARCHAR(255) NULL DEFAULT NULL COMMENT '视频地址',
  duration INT NULL DEFAULT NULL COMMENT '时长(秒)',
  sortOrder INT NOT NULL DEFAULT 0 COMMENT '排序',
  isFree TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否免费',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (lessonId),
  KEY idx_courseLessons_courseId (courseId),
  KEY idx_courseLessons_sortOrder (sortOrder),
  CONSTRAINT fk_courseLessons_courseId FOREIGN KEY (courseId) REFERENCES courses (courseId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程章节表';

-- 课程报名表 (courseEnrollments)
-- 课程报名表(courseEnrollments)用于存储用户报名课程的信息。enrollmentId是表的主键，通过userId和courseId分别关联用户表和课程表，记录报名时间enrolledAt和完成时间completedAt。
CREATE TABLE IF NOT EXISTS courseEnrollments (
  enrollmentId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  courseId BIGINT(20) NOT NULL COMMENT '课程ID',
  enrolledAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  completedAt TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
  progress INT NOT NULL DEFAULT 0 COMMENT '进度(0-100)',
  status ENUM('active','completed','dropped') NOT NULL DEFAULT 'active' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (enrollmentId),
  UNIQUE KEY uk_courseEnrollments_user_course (userId, courseId),
  KEY idx_courseEnrollments_courseId (courseId),
  KEY idx_courseEnrollments_status (status),
  CONSTRAINT fk_courseEnrollments_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_courseEnrollments_courseId FOREIGN KEY (courseId) REFERENCES courses (courseId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程报名表';

-- 课程学习进度表 (lessonProgress)
-- 课程学习进度表(lessonProgress)用于存储用户学习课程章节的进度记录。progressId是表的主键，通过enrollmentId和lessonId分别关联课程报名表和课程章节表，记录完成状态isCompleted和完成时间completedAt。
CREATE TABLE IF NOT EXISTS lessonProgress (
  progressId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '进度ID',
  enrollmentId BIGINT(20) NOT NULL COMMENT '报名ID',
  lessonId BIGINT(20) NOT NULL COMMENT '章节ID',
  isCompleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否完成',
  completedAt TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
  watchDuration INT NOT NULL DEFAULT 0 COMMENT '观看时长(秒)',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (progressId),
  UNIQUE KEY uk_lessonProgress_enrollment_lesson (enrollmentId, lessonId),
  KEY idx_lessonProgress_lessonId (lessonId),
  KEY idx_lessonProgress_isCompleted (isCompleted),
  CONSTRAINT fk_lessonProgress_enrollmentId FOREIGN KEY (enrollmentId) REFERENCES courseEnrollments (enrollmentId) ON DELETE CASCADE,
  CONSTRAINT fk_lessonProgress_lessonId FOREIGN KEY (lessonId) REFERENCES courseLessons (lessonId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程学习进度表';

-- 课程评论表 (courseReviews)
-- 课程评论表(courseReviews)用于存储用户对课程的评论内容。reviewId是表的主键，通过courseId和userId分别关联课程表和用户表，记录评分rating、评论标题title和评论内容content。
CREATE TABLE IF NOT EXISTS courseReviews (
  reviewId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  courseId BIGINT(20) NOT NULL COMMENT '课程ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  rating INT NOT NULL COMMENT '评分',
  title VARCHAR(100) NOT NULL COMMENT '评论标题',
  content TEXT NOT NULL COMMENT '评论内容',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (reviewId),
  UNIQUE KEY uk_courseReviews_user_course (userId, courseId),
  KEY idx_courseReviews_courseId (courseId),
  KEY idx_courseReviews_userId (userId),
  KEY idx_courseReviews_rating (rating),
  CONSTRAINT fk_courseReviews_courseId FOREIGN KEY (courseId) REFERENCES courses (courseId) ON DELETE CASCADE,
  CONSTRAINT fk_courseReviews_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程评论表';

-- 五、社区活动与挑战模块

-- 活动表 (events)
-- 活动表(events)用于存储平台活动信息。eventId是表的主键，记录活动标题title、描述description、开始时间startTime和结束时间endTime。
CREATE TABLE IF NOT EXISTS events (
  eventId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  title VARCHAR(100) NOT NULL COMMENT '活动标题',
  description TEXT NOT NULL COMMENT '活动描述',
  coverImage VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  startTime TIMESTAMP NOT NULL COMMENT '开始时间',
  endTime TIMESTAMP NOT NULL COMMENT '结束时间',
  location VARCHAR(255) NULL DEFAULT NULL COMMENT '地点',
  maxParticipants INT NULL DEFAULT NULL COMMENT '最大参与人数',
  status ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (eventId),
  KEY idx_events_status (status),
  KEY idx_events_startTime (startTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 活动报名表 (eventRegistrations)
-- 活动报名表(eventRegistrations)用于存储用户报名活动的信息。registrationId是表的主键，通过eventId和userId分别关联活动表和用户表，记录报名时间registeredAt和签到时间checkedInAt。
CREATE TABLE IF NOT EXISTS eventRegistrations (
  registrationId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  eventId BIGINT(20) NOT NULL COMMENT '活动ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  registeredAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  checkedInAt TIMESTAMP NULL DEFAULT NULL COMMENT '签到时间',
  status ENUM('registered','checked_in','cancelled') NOT NULL DEFAULT 'registered' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (registrationId),
  UNIQUE KEY uk_eventRegistrations_event_user (eventId, userId),
  KEY idx_eventRegistrations_userId (userId),
  KEY idx_eventRegistrations_status (status),
  CONSTRAINT fk_eventRegistrations_eventId FOREIGN KEY (eventId) REFERENCES events (eventId) ON DELETE CASCADE,
  CONSTRAINT fk_eventRegistrations_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动报名表';

-- 挑战表 (challenges)
-- 挑战表(challenges)用于存储摄影挑战信息。challengeId是表的主键，记录挑战标题title、描述description、开始时间startTime和结束时间endTime。
CREATE TABLE IF NOT EXISTS challenges (
  challengeId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '挑战ID',
  title VARCHAR(100) NOT NULL COMMENT '挑战标题',
  description TEXT NOT NULL COMMENT '挑战描述',
  coverImage VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  startTime TIMESTAMP NOT NULL COMMENT '开始时间',
  endTime TIMESTAMP NOT NULL COMMENT '结束时间',
  rules TEXT NULL COMMENT '规则',
  prizes JSON NULL COMMENT '奖品',
  status ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (challengeId),
  KEY idx_challenges_status (status),
  KEY idx_challenges_startTime (startTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='挑战表';

-- 挑战参与表 (challengeParticipants)
-- 挑战参与表(challengeParticipants)用于存储用户参与挑战的信息。participantId是表的主键，通过challengeId和userId分别关联挑战表和用户表，记录参与时间joinedAt和提交时间submittedAt。
CREATE TABLE IF NOT EXISTS challengeParticipants (
  participantId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '参与ID',
  challengeId BIGINT(20) NOT NULL COMMENT '挑战ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  joinedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '参与时间',
  submittedAt TIMESTAMP NULL DEFAULT NULL COMMENT '提交时间',
  status ENUM('joined','submitted','disqualified') NOT NULL DEFAULT 'joined' COMMENT '状态',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (participantId),
  UNIQUE KEY uk_challengeParticipants_challenge_user (challengeId, userId),
  KEY idx_challengeParticipants_userId (userId),
  KEY idx_challengeParticipants_status (status),
  CONSTRAINT fk_challengeParticipants_challengeId FOREIGN KEY (challengeId) REFERENCES challenges (challengeId) ON DELETE CASCADE,
  CONSTRAINT fk_challengeParticipants_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='挑战参与表';

-- 挑战作品表 (challengeSubmissions)
-- 挑战作品表(challengeSubmissions)用于存储用户提交的挑战作品。submissionId是表的主键，通过participantId关联挑战参与表，通过photoId关联摄影作品表，记录提交时间submittedAt。
CREATE TABLE IF NOT EXISTS challengeSubmissions (
  submissionId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '提交ID',
  participantId BIGINT(20) NOT NULL COMMENT '参与ID',
  photoId BIGINT(20) NOT NULL COMMENT '作品ID',
  submittedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  votesCount INT NOT NULL DEFAULT 0 COMMENT '投票数',
  ranking INT NULL DEFAULT NULL COMMENT '排名',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (submissionId),
  UNIQUE KEY uk_challengeSubmissions_participant (participantId),
  KEY idx_challengeSubmissions_photoId (photoId),
  KEY idx_challengeSubmissions_ranking (ranking),
  CONSTRAINT fk_challengeSubmissions_participantId FOREIGN KEY (participantId) REFERENCES challengeParticipants (participantId) ON DELETE CASCADE,
  CONSTRAINT fk_challengeSubmissions_photoId FOREIGN KEY (photoId) REFERENCES photographs (photoId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='挑战作品表';

-- 六、通知与消息模块

-- 通知表 (notifications)
-- 通知表(notifications)用于存储系统通知信息。notificationId是表的主键，通过userId关联用户表，记录通知类型type、标题title和内容content。
CREATE TABLE IF NOT EXISTS notifications (
  notificationId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  type ENUM('like','comment','follow','system','event','challenge') NOT NULL COMMENT '通知类型',
  title VARCHAR(100) NOT NULL COMMENT '标题',
  content TEXT NULL COMMENT '内容',
  linkUrl VARCHAR(255) NULL DEFAULT NULL COMMENT '链接地址',
  isRead TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (notificationId),
  KEY idx_notifications_userId (userId),
  KEY idx_notifications_type (type),
  KEY idx_notifications_isRead (isRead),
  KEY idx_notifications_createdAt (createdAt),
  CONSTRAINT fk_notifications_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 私信表 (messages)
-- 私信表(messages)用于存储用户之间的私信内容。messageId是表的主键，通过senderId和receiverId分别关联用户表，记录消息内容content和发送时间sentAt。
CREATE TABLE IF NOT EXISTS messages (
  messageId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  senderId BIGINT(20) NOT NULL COMMENT '发送者ID',
  receiverId BIGINT(20) NOT NULL COMMENT '接收者ID',
  content TEXT NOT NULL COMMENT '消息内容',
  isRead TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  sentAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (messageId),
  KEY idx_messages_senderId (senderId),
  KEY idx_messages_receiverId (receiverId),
  KEY idx_messages_sentAt (sentAt),
  CONSTRAINT fk_messages_senderId FOREIGN KEY (senderId) REFERENCES users (userId) ON DELETE CASCADE,
  CONSTRAINT fk_messages_receiverId FOREIGN KEY (receiverId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='私信表';

-- 七、系统管理模块

-- 管理员表 (admins)
-- 管理员表(admins)用于存储系统管理员信息。adminId是表的主键，通过userId关联用户表，记录管理员角色role和权限permissions。
CREATE TABLE IF NOT EXISTS admins (
  adminId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  role ENUM('super_admin','admin','moderator') NOT NULL COMMENT '角色',
  permissions JSON NULL COMMENT '权限',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (adminId),
  UNIQUE KEY uk_admins_userId (userId),
  KEY idx_admins_role (role),
  CONSTRAINT fk_admins_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 系统配置表 (systemSettings)
-- 系统配置表(systemSettings)用于存储系统配置信息。settingId是表的主键，记录配置键key、值value和描述description。
CREATE TABLE IF NOT EXISTS systemSettings (
  settingId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  settingKey VARCHAR(100) NOT NULL COMMENT '配置键',
  settingValue TEXT NOT NULL COMMENT '配置值',
  description TEXT NULL COMMENT '描述',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (settingId),
  UNIQUE KEY uk_systemSettings_key (settingKey),
  KEY idx_systemSettings_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 操作日志表 (auditLogs)
-- 操作日志表(auditLogs)用于存储系统操作日志。logId是表的主键，通过userId关联用户表，记录操作类型actionType、目标类型targetType和目标ID targetId。
CREATE TABLE IF NOT EXISTS auditLogs (
  logId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  userId BIGINT(20) NULL DEFAULT NULL COMMENT '用户ID',
  actionType VARCHAR(50) NOT NULL COMMENT '操作类型',
  targetType VARCHAR(50) NULL DEFAULT NULL COMMENT '目标类型',
  targetId BIGINT(20) NULL DEFAULT NULL COMMENT '目标ID',
  details JSON NULL COMMENT '详细信息',
  ipAddress VARCHAR(50) NULL DEFAULT NULL COMMENT 'IP地址',
  userAgent VARCHAR(255) NULL DEFAULT NULL COMMENT '用户代理',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (logId),
  KEY idx_auditLogs_userId (userId),
  KEY idx_auditLogs_actionType (actionType),
  KEY idx_auditLogs_createdAt (createdAt),
  CONSTRAINT fk_auditLogs_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 反馈表 (feedback)
-- 反馈表(feedback)用于存储用户反馈信息。feedbackId是表的主键，通过userId关联用户表，记录反馈类型type、标题title和内容content。
CREATE TABLE IF NOT EXISTS feedback (
  feedbackId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '反馈ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  type ENUM('bug','feature','complaint','suggestion') NOT NULL COMMENT '反馈类型',
  title VARCHAR(100) NOT NULL COMMENT '标题',
  content TEXT NOT NULL COMMENT '内容',
  status ENUM('pending','reviewed','resolved','closed') NOT NULL DEFAULT 'pending' COMMENT '状态',
  adminReply TEXT NULL COMMENT '管理员回复',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (feedbackId),
  KEY idx_feedback_userId (userId),
  KEY idx_feedback_type (type),
  KEY idx_feedback_status (status),
  CONSTRAINT fk_feedback_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='反馈表';

-- 八、数据分析模块

-- 用户行为日志表 (userActivityLogs)
-- 用户行为日志表(userActivityLogs)用于存储用户行为日志。logId是表的主键，通过userId关联用户表，记录行为类型actionType、目标类型targetType和目标ID targetId。
CREATE TABLE IF NOT EXISTS userActivityLogs (
  logId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  actionType VARCHAR(50) NOT NULL COMMENT '行为类型',
  targetType VARCHAR(50) NULL DEFAULT NULL COMMENT '目标类型',
  targetId BIGINT(20) NULL DEFAULT NULL COMMENT '目标ID',
  metadata JSON NULL COMMENT '元数据',
  ipAddress VARCHAR(50) NULL DEFAULT NULL COMMENT 'IP地址',
  userAgent VARCHAR(255) NULL DEFAULT NULL COMMENT '用户代理',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (logId),
  KEY idx_userActivityLogs_userId (userId),
  KEY idx_userActivityLogs_actionType (actionType),
  KEY idx_userActivityLogs_createdAt (createdAt),
  CONSTRAINT fk_userActivityLogs_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为日志表';

-- 统计数据表 (statistics)
-- 统计数据表(statistics)用于存储平台统计数据。statId是表的主键，记录统计类型type、日期date和数值value。
CREATE TABLE IF NOT EXISTS statistics (
  statId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  type VARCHAR(50) NOT NULL COMMENT '统计类型',
  date DATE NOT NULL COMMENT '日期',
  value BIGINT(20) NOT NULL COMMENT '数值',
  metadata JSON NULL COMMENT '元数据',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (statId),
  UNIQUE KEY uk_statistics_type_date (type, date),
  KEY idx_statistics_type (type),
  KEY idx_statistics_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统计数据表';

-- 九、支付与订单模块

-- 订单表 (orders)
-- 订单表(orders)用于存储用户订单信息。orderId是表的主键，通过userId关联用户表，记录订单类型type、金额amount和状态status。
CREATE TABLE IF NOT EXISTS orders (
  orderId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  orderNumber VARCHAR(50) NOT NULL COMMENT '订单号',
  type ENUM('membership','course','equipment') NOT NULL COMMENT '订单类型',
  amount DECIMAL(10,2) NOT NULL COMMENT '金额',
  status ENUM('pending','paid','cancelled','refunded') NOT NULL DEFAULT 'pending' COMMENT '状态',
  paymentMethod VARCHAR(50) NULL DEFAULT NULL COMMENT '支付方式',
  paidAt TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (orderId),
  UNIQUE KEY uk_orders_orderNumber (orderNumber),
  KEY idx_orders_userId (userId),
  KEY idx_orders_status (status),
  KEY idx_orders_createdAt (createdAt),
  CONSTRAINT fk_orders_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单明细表 (orderItems)
-- 订单明细表(orderItems)用于存储订单明细信息。itemId是表的主键，通过orderId关联订单表，记录商品类型itemType、商品ID itemId和数量quantity。
CREATE TABLE IF NOT EXISTS orderItems (
  itemId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  orderId BIGINT(20) NOT NULL COMMENT '订单ID',
  itemType ENUM('membership','course','equipment') NOT NULL COMMENT '商品类型',
  targetId BIGINT(20) NOT NULL COMMENT '目标ID',
  quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
  unitPrice DECIMAL(10,2) NOT NULL COMMENT '单价',
  totalPrice DECIMAL(10,2) NOT NULL COMMENT '总价',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (itemId),
  KEY idx_orderItems_orderId (orderId),
  KEY idx_orderItems_itemType (itemType),
  CONSTRAINT fk_orderItems_orderId FOREIGN KEY (orderId) REFERENCES orders (orderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- 支付记录表 (payments)
-- 支付记录表(payments)用于存储支付记录信息。paymentId是表的主键，通过orderId关联订单表，记录支付金额amount、支付方式paymentMethod和交易号transactionId。
CREATE TABLE IF NOT EXISTS payments (
  paymentId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '支付ID',
  orderId BIGINT(20) NOT NULL COMMENT '订单ID',
  amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  paymentMethod VARCHAR(50) NOT NULL COMMENT '支付方式',
  transactionId VARCHAR(100) NULL DEFAULT NULL COMMENT '交易号',
  status ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending' COMMENT '状态',
  paidAt TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (paymentId),
  KEY idx_payments_orderId (orderId),
  KEY idx_payments_status (status),
  KEY idx_payments_transactionId (transactionId),
  CONSTRAINT fk_payments_orderId FOREIGN KEY (orderId) REFERENCES orders (orderId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 十、标签与分类模块

-- 标签表 (tags)
-- 标签表(tags)用于存储标签信息。tagId是表的主键，记录标签名称name和使用次数usageCount。
CREATE TABLE IF NOT EXISTS tags (
  tagId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  name VARCHAR(50) NOT NULL COMMENT '标签名称',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  usageCount INT NOT NULL DEFAULT 0 COMMENT '使用次数',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (tagId),
  UNIQUE KEY uk_tags_name (name),
  KEY idx_tags_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 作品标签关联表 (photoTags)
-- 作品标签关联表(photoTags)用于存储作品与标签的关联关系。photoTagId是表的主键，通过photoId和tagId分别关联摄影作品表和标签表。
CREATE TABLE IF NOT EXISTS photoTags (
  photoTagId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  photoId BIGINT(20) NOT NULL COMMENT '作品ID',
  tagId BIGINT(20) NOT NULL COMMENT '标签ID',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (photoTagId),
  UNIQUE KEY uk_photoTags_photo_tag (photoId, tagId),
  KEY idx_photoTags_tagId (tagId),
  CONSTRAINT fk_photoTags_photoId FOREIGN KEY (photoId) REFERENCES photographs (photoId) ON DELETE CASCADE,
  CONSTRAINT fk_photoTags_tagId FOREIGN KEY (tagId) REFERENCES tags (tagId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品标签关联表';

-- 分类表 (categories)
-- 分类表(categories)用于存储分类信息。categoryId是表的主键，记录分类名称name、父分类ID parentId和排序sortOrder。
CREATE TABLE IF NOT EXISTS categories (
  categoryId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  parentId BIGINT(20) NULL DEFAULT NULL COMMENT '父分类ID',
  sortOrder INT NOT NULL DEFAULT 0 COMMENT '排序',
  icon VARCHAR(255) NULL DEFAULT NULL COMMENT '图标',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (categoryId),
  KEY idx_categories_parentId (parentId),
  KEY idx_categories_sortOrder (sortOrder),
  CONSTRAINT fk_categories_parentId FOREIGN KEY (parentId) REFERENCES categories (categoryId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 十一、搜索与推荐模块

-- 搜索历史表 (searchHistory)
-- 搜索历史表(searchHistory)用于存储用户搜索历史。historyId是表的主键，通过userId关联用户表，记录搜索关键词keyword和搜索时间searchedAt。
CREATE TABLE IF NOT EXISTS searchHistory (
  historyId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  keyword VARCHAR(100) NOT NULL COMMENT '搜索关键词',
  searchType VARCHAR(50) NULL DEFAULT NULL COMMENT '搜索类型',
  resultsCount INT NULL DEFAULT NULL COMMENT '结果数量',
  searchedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '搜索时间',
  -- 主键与索引
  PRIMARY KEY (historyId),
  KEY idx_searchHistory_userId (userId),
  KEY idx_searchHistory_keyword (keyword),
  KEY idx_searchHistory_searchedAt (searchedAt),
  CONSTRAINT fk_searchHistory_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- 热门搜索表 (trendingSearches)
-- 热门搜索表(trendingSearches)用于存储热门搜索关键词。trendingId是表的主键，记录关键词keyword和搜索次数searchCount。
CREATE TABLE IF NOT EXISTS trendingSearches (
  trendingId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '热门ID',
  keyword VARCHAR(100) NOT NULL COMMENT '关键词',
  searchCount INT NOT NULL DEFAULT 0 COMMENT '搜索次数',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (trendingId),
  UNIQUE KEY uk_trendingSearches_keyword (keyword),
  KEY idx_trendingSearches_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门搜索表';

-- 推荐记录表 (recommendations)
-- 推荐记录表(recommendations)用于存储推荐记录。recommendationId是表的主键，通过userId关联用户表，记录推荐类型type、目标类型targetType和目标ID targetId。
CREATE TABLE IF NOT EXISTS recommendations (
  recommendationId BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '推荐ID',
  userId BIGINT(20) NOT NULL COMMENT '用户ID',
  type ENUM('photo','user','course','location') NOT NULL COMMENT '推荐类型',
  targetType VARCHAR(50) NOT NULL COMMENT '目标类型',
  targetId BIGINT(20) NOT NULL COMMENT '目标ID',
  score DECIMAL(5,2) NOT NULL COMMENT '推荐分数',
  reason VARCHAR(255) NULL DEFAULT NULL COMMENT '推荐理由',
  isClicked TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否点击',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (recommendationId),
  KEY idx_recommendations_userId (userId),
  KEY idx_recommendations_type (type),
  KEY idx_recommendations_score (score),
  CONSTRAINT fk_recommendations_userId FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推荐记录表';
