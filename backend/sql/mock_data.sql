-- ============================================================
-- PhotoShare 前端假数据 → MySQL INSERT 语句
-- 数据库: photoshare
-- 生成日期: 2026-06-29
-- ============================================================

USE `photoshare`;

-- ============================================================
-- 1. 器材表 (equipment) —— 相机、镜头、配件
-- ============================================================
DROP TABLE IF EXISTS `equipment`;
CREATE TABLE `equipment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `equip_id` varchar(32) NOT NULL COMMENT '前端ID',
  `name` varchar(256) NOT NULL COMMENT '名称',
  `type` varchar(64) NOT NULL COMMENT '类型: 相机/镜头/三脚架/稳定器/麦克风/存储卡/摄影包/闪光灯/无人机',
  `brand` varchar(64) NOT NULL COMMENT '品牌',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `image` varchar(1024) DEFAULT NULL COMMENT '图片URL',
  `specs` json DEFAULT NULL COMMENT '规格参数(JSON)',
  `performance` json DEFAULT NULL COMMENT '性能评分(JSON)',
  `pros` json DEFAULT NULL COMMENT '优点(JSON数组)',
  `cons` json DEFAULT NULL COMMENT '缺点(JSON数组)',
  `suitable_for` json DEFAULT NULL COMMENT '适用场景(JSON数组)',
  `rating` decimal(3,1) DEFAULT NULL COMMENT '评分',
  `review_count` int DEFAULT 0 COMMENT '评价数',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `rental_daily` decimal(10,2) DEFAULT NULL COMMENT '日租价格',
  `rental_weekly` decimal(10,2) DEFAULT NULL COMMENT '周租价格',
  `rental_monthly` decimal(10,2) DEFAULT NULL COMMENT '月租价格',
  `rental_available` tinyint DEFAULT 1 COMMENT '是否可租',
  `second_hand_link` varchar(1024) DEFAULT NULL COMMENT '二手链接',
  `is_hot` tinyint DEFAULT 0 COMMENT '是否热门',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_brand` (`brand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材';

-- ============================================================
-- 2. 活动表 (event) —— 线下摄影活动
-- ============================================================
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `event_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '活动标题',
  `type` varchar(64) DEFAULT NULL COMMENT '活动类型',
  `category` varchar(64) DEFAULT NULL COMMENT '分类',
  `image` varchar(1024) DEFAULT NULL COMMENT '封面图',
  `location` varchar(256) DEFAULT NULL COMMENT '地点',
  `date` varchar(256) DEFAULT NULL COMMENT '活动日期',
  `duration` varchar(64) DEFAULT NULL COMMENT '时长',
  `instructor_name` varchar(128) DEFAULT NULL COMMENT '导师名称',
  `instructor_avatar` varchar(1024) DEFAULT NULL COMMENT '导师头像',
  `instructor_title` varchar(128) DEFAULT NULL COMMENT '导师头衔',
  `instructor_experience` varchar(32) DEFAULT NULL COMMENT '导师经验',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `participants` int DEFAULT 0 COMMENT '已报名人数',
  `max_participants` int DEFAULT 0 COMMENT '最大人数',
  `description` text COMMENT '描述',
  `itinerary` json DEFAULT NULL COMMENT '行程安排(JSON数组)',
  `inclusion` json DEFAULT NULL COMMENT '包含项(JSON数组)',
  `exclusion` json DEFAULT NULL COMMENT '不包含项(JSON数组)',
  `notes` json DEFAULT NULL COMMENT '注意事项(JSON数组)',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='线下活动';

-- ============================================================
-- 3. 赛事表 (contest) —— 摄影赛事
-- ============================================================
DROP TABLE IF EXISTS `contest`;
CREATE TABLE `contest` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `contest_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '赛事标题',
  `type` varchar(64) DEFAULT NULL COMMENT '赛事类型',
  `organizer` varchar(128) DEFAULT NULL COMMENT '主办方',
  `image` varchar(1024) DEFAULT NULL COMMENT '封面图',
  `deadline` varchar(64) DEFAULT NULL COMMENT '截止日期',
  `status` varchar(32) DEFAULT NULL COMMENT '状态',
  `entries` int DEFAULT 0 COMMENT '参赛作品数',
  `works_count` int DEFAULT 0 COMMENT '作品总数',
  `participants` int DEFAULT 0 COMMENT '参与人数',
  `prizes` json DEFAULT NULL COMMENT '奖项(JSON数组)',
  `description` text COMMENT '描述',
  `categories` json DEFAULT NULL COMMENT '参赛类别(JSON数组)',
  `rules` json DEFAULT NULL COMMENT '规则(JSON数组)',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影赛事';

-- ============================================================
-- 4. 课程表 (course) —— 线上课程
-- ============================================================
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `course_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '课程标题',
  `type` varchar(32) DEFAULT NULL COMMENT '类型: 免费/付费',
  `category` varchar(64) DEFAULT NULL COMMENT '分类',
  `level` varchar(32) DEFAULT NULL COMMENT '难度级别',
  `instructor_name` varchar(128) DEFAULT NULL COMMENT '讲师名称',
  `instructor_avatar` varchar(1024) DEFAULT NULL COMMENT '讲师头像',
  `instructor_title` varchar(128) DEFAULT NULL COMMENT '讲师头衔',
  `instructor_students` int DEFAULT 0 COMMENT '讲师学员数',
  `instructor_courses` int DEFAULT 0 COMMENT '讲师课程数',
  `instructor_rating` decimal(3,1) DEFAULT NULL COMMENT '讲师评分',
  `cover_image` varchar(1024) DEFAULT NULL COMMENT '封面图',
  `duration` varchar(64) DEFAULT NULL COMMENT '时长',
  `lessons` int DEFAULT 0 COMMENT '课时数',
  `students` int DEFAULT 0 COMMENT '学员数',
  `rating` decimal(3,1) DEFAULT NULL COMMENT '评分',
  `reviews` int DEFAULT 0 COMMENT '评价数',
  `description` text COMMENT '描述',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_level` (`level`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='线上课程';

-- ============================================================
-- 5. 文字教程表 (tutorial) —— 文字教程
-- ============================================================
DROP TABLE IF EXISTS `tutorial`;
CREATE TABLE `tutorial` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `tutorial_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '标题',
  `description` text COMMENT '描述',
  `author_name` varchar(128) DEFAULT NULL COMMENT '作者名称',
  `author_avatar` varchar(1024) DEFAULT NULL COMMENT '作者头像',
  `category` varchar(64) DEFAULT NULL COMMENT '分类',
  `level` varchar(32) DEFAULT NULL COMMENT '难度级别',
  `duration` varchar(64) DEFAULT NULL COMMENT '时长',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `likes` int DEFAULT 0 COMMENT '点赞数',
  `image` varchar(1024) DEFAULT NULL COMMENT '封面图',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文字教程';

-- ============================================================
-- 6. 工具表 (tool) —— 教程工具
-- ============================================================
DROP TABLE IF EXISTS `tool`;
CREATE TABLE `tool` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `tool_id` varchar(32) NOT NULL COMMENT '前端ID',
  `name` varchar(256) NOT NULL COMMENT '工具名称',
  `description` text COMMENT '描述',
  `thumbnail` varchar(1024) DEFAULT NULL COMMENT '缩略图',
  `category` varchar(64) DEFAULT NULL COMMENT '分类',
  `usage_count` int DEFAULT 0 COMMENT '使用次数',
  `rating` decimal(3,1) DEFAULT NULL COMMENT '评分',
  `users` int DEFAULT 0 COMMENT '用户数',
  `is_recommended` tinyint DEFAULT 0 COMMENT '是否推荐',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教程工具';

-- ============================================================
-- 7. 测评表 (review) —— 器材测评
-- ============================================================
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `review_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '测评标题',
  `type` varchar(64) DEFAULT NULL COMMENT '测评类型',
  `author_name` varchar(128) DEFAULT NULL COMMENT '作者名称',
  `author_avatar` varchar(1024) DEFAULT NULL COMMENT '作者头像',
  `author_role` varchar(128) DEFAULT NULL COMMENT '作者角色',
  `author_experience` varchar(128) DEFAULT NULL COMMENT '作者经验',
  `equipment_name` varchar(256) DEFAULT NULL COMMENT '测评器材名称',
  `equipment_type` varchar(64) DEFAULT NULL COMMENT '测评器材类型',
  `equipment_image` varchar(1024) DEFAULT NULL COMMENT '测评器材图片',
  `date` varchar(64) DEFAULT NULL COMMENT '测评日期',
  `read_time` varchar(32) DEFAULT NULL COMMENT '阅读时长',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `likes` int DEFAULT 0 COMMENT '点赞数',
  `comments` int DEFAULT 0 COMMENT '评论数',
  `rating` decimal(3,1) DEFAULT NULL COMMENT '评分',
  `credibility_rating` decimal(3,1) DEFAULT NULL COMMENT '可信度评分',
  `featured_image` varchar(1024) DEFAULT NULL COMMENT '特色图片',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `excerpt` text COMMENT '摘要',
  `pros` json DEFAULT NULL COMMENT '优点(JSON数组)',
  `cons` json DEFAULT NULL COMMENT '缺点(JSON数组)',
  `performance` json DEFAULT NULL COMMENT '性能评分(JSON)',
  `tips` json DEFAULT NULL COMMENT '使用技巧(JSON数组)',
  `faq` json DEFAULT NULL COMMENT '常见问题(JSON数组)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材测评';

-- ============================================================
-- 8. 器材交易表 (equipment_trade) —— 二手/全新器材交易
-- ============================================================
DROP TABLE IF EXISTS `equipment_trade`;
CREATE TABLE `equipment_trade` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `trade_id` varchar(32) NOT NULL COMMENT '前端ID',
  `name` varchar(256) NOT NULL COMMENT '器材名称',
  `type` varchar(64) DEFAULT NULL COMMENT '类型',
  `brand` varchar(64) DEFAULT NULL COMMENT '品牌',
  `price` decimal(10,2) DEFAULT NULL COMMENT '售价',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `image` varchar(1024) DEFAULT NULL COMMENT '图片',
  `trade_type` varchar(32) NOT NULL COMMENT '交易类型: used/new',
  `condition` varchar(32) DEFAULT NULL COMMENT '成色',
  `usage_time` varchar(64) DEFAULT NULL COMMENT '使用时间',
  `shutter_count` varchar(64) DEFAULT NULL COMMENT '快门次数',
  `repair_history` varchar(256) DEFAULT NULL COMMENT '维修记录',
  `accessories` json DEFAULT NULL COMMENT '配件(JSON数组)',
  `seller_name` varchar(128) DEFAULT NULL COMMENT '卖家名称',
  `seller_avatar` varchar(1024) DEFAULT NULL COMMENT '卖家头像',
  `seller_location` varchar(128) DEFAULT NULL COMMENT '卖家所在地',
  `seller_rating` decimal(3,1) DEFAULT NULL COMMENT '卖家评分',
  `seller_transactions` int DEFAULT 0 COMMENT '卖家成交数',
  `seller_is_official` tinyint DEFAULT 0 COMMENT '是否官方',
  `description` text COMMENT '描述',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `warranty` varchar(128) DEFAULT NULL COMMENT '保修',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_trade_type` (`trade_type`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材交易';

-- ============================================================
-- 9. 项目表 (project) —— 摄影项目/资源
-- ============================================================
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `project_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '项目标题',
  `type` varchar(64) DEFAULT NULL COMMENT '项目类型',
  `location` varchar(128) DEFAULT NULL COMMENT '地点',
  `price` varchar(64) DEFAULT NULL COMMENT '价格区间',
  `deadline` varchar(64) DEFAULT NULL COMMENT '截止日期',
  `description` text COMMENT '描述',
  `requirements` json DEFAULT NULL COMMENT '要求(JSON数组)',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `company_name` varchar(256) DEFAULT NULL COMMENT '公司名称',
  `company_avatar` varchar(1024) DEFAULT NULL COMMENT '公司头像',
  `company_verified` tinyint DEFAULT 0 COMMENT '公司是否认证',
  `company_projects` int DEFAULT 0 COMMENT '公司完成项目数',
  `company_rating` decimal(3,1) DEFAULT NULL COMMENT '公司评分',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `applications` int DEFAULT 0 COMMENT '申请数',
  `status` varchar(32) DEFAULT 'pending' COMMENT '状态',
  `progress` int DEFAULT 0 COMMENT '进度',
  `contract_signed` tinyint DEFAULT 0 COMMENT '合同是否签署',
  `payment_status` varchar(32) DEFAULT NULL COMMENT '付款状态',
  `delivery_status` varchar(32) DEFAULT NULL COMMENT '交付状态',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影项目';

-- ============================================================
-- 10. 话题表 (topic) —— 社区话题
-- ============================================================
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `topic_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `author_name` varchar(128) DEFAULT NULL COMMENT '作者名称',
  `author_avatar` varchar(1024) DEFAULT NULL COMMENT '作者头像',
  `author_level` int DEFAULT 0 COMMENT '作者等级',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `created_at` varchar(64) DEFAULT NULL COMMENT '创建日期',
  `likes` int DEFAULT 0 COMMENT '点赞数',
  `comments` int DEFAULT 0 COMMENT '评论数',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `is_essential` tinyint DEFAULT 0 COMMENT '是否精华',
  `is_sticky` tinyint DEFAULT 0 COMMENT '是否置顶',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区话题';

-- ============================================================
-- 11. 通知表 (notification) —— 系统通知
-- ============================================================
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `notify_id` varchar(32) NOT NULL COMMENT '前端ID',
  `type` varchar(32) NOT NULL COMMENT '通知类型: like/comment/follow/system',
  `content` varchar(512) NOT NULL COMMENT '通知内容',
  `related_id` varchar(64) DEFAULT NULL COMMENT '关联ID',
  `created_at` varchar(64) DEFAULT NULL COMMENT '通知时间',
  `is_read` tinyint DEFAULT 0 COMMENT '是否已读',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统通知';

-- ============================================================
-- 12. 小组表 (group_info) —— 摄影小组
-- ============================================================
DROP TABLE IF EXISTS `group_info`;
CREATE TABLE `group_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `group_id` varchar(32) NOT NULL COMMENT '前端ID',
  `name` varchar(256) NOT NULL COMMENT '小组名称',
  `description` text COMMENT '描述',
  `avatar` varchar(1024) DEFAULT NULL COMMENT '头像',
  `cover_image` varchar(1024) DEFAULT NULL COMMENT '封面图',
  `member_count` int DEFAULT 0 COMMENT '成员数',
  `post_count` int DEFAULT 0 COMMENT '帖子数',
  `status` varchar(32) DEFAULT 'active' COMMENT '状态',
  `created_at` varchar(64) DEFAULT NULL COMMENT '创建日期',
  `owner_name` varchar(128) DEFAULT NULL COMMENT '群主名称',
  `owner_avatar` varchar(1024) DEFAULT NULL COMMENT '群主头像',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影小组';

-- ============================================================
-- 13. 订单表 (order_info) —— 订单
-- ============================================================
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `order_id` varchar(64) NOT NULL COMMENT '订单编号',
  `user_name` varchar(128) DEFAULT NULL COMMENT '用户名',
  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',
  `items` json DEFAULT NULL COMMENT '订单项(JSON数组)',
  `total_amount` decimal(10,2) DEFAULT NULL COMMENT '总金额',
  `status` varchar(32) DEFAULT NULL COMMENT '状态',
  `payment_method` varchar(32) DEFAULT NULL COMMENT '支付方式',
  `created_at` varchar(64) DEFAULT NULL COMMENT '创建时间',
  `paid_at` varchar(64) DEFAULT NULL COMMENT '支付时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单';

-- ============================================================
-- 14. 内容管理表 (content) —— 管理后台内容
-- ============================================================
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `content_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '标题',
  `type` varchar(32) NOT NULL COMMENT '类型: photo/post',
  `thumbnail` varchar(1024) DEFAULT NULL COMMENT '缩略图',
  `author_name` varchar(128) DEFAULT NULL COMMENT '作者名称',
  `author_avatar` varchar(1024) DEFAULT NULL COMMENT '作者头像',
  `status` varchar(32) DEFAULT 'active' COMMENT '状态',
  `created_at` varchar(64) DEFAULT NULL COMMENT '创建日期',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `likes` int DEFAULT 0 COMMENT '点赞数',
  `comments` int DEFAULT 0 COMMENT '评论数',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理内容';

-- ============================================================
-- 15. 摄影作品表 (photo_post) —— 用户摄影作品
-- ============================================================
DROP TABLE IF EXISTS `photo_post`;
CREATE TABLE `photo_post` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `photo_id` varchar(32) NOT NULL COMMENT '前端ID',
  `title` varchar(256) NOT NULL COMMENT '作品标题',
  `description` text COMMENT '描述',
  `image` varchar(1024) DEFAULT NULL COMMENT '图片URL',
  `author_name` varchar(128) DEFAULT NULL COMMENT '作者名称',
  `author_avatar` varchar(1024) DEFAULT NULL COMMENT '作者头像',
  `likes` int DEFAULT 0 COMMENT '点赞数',
  `comments` int DEFAULT 0 COMMENT '评论数',
  `collections` int DEFAULT 0 COMMENT '收藏数',
  `tags` json DEFAULT NULL COMMENT '标签(JSON数组)',
  `date` varchar(64) DEFAULT NULL COMMENT '发布日期',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `format` varchar(32) DEFAULT NULL COMMENT '格式',
  `visibility` varchar(32) DEFAULT '公开' COMMENT '可见性',
  `copyright_type` varchar(32) DEFAULT NULL COMMENT '版权类型',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影作品';
-- ============================================================
-- INSERT DATA
-- ============================================================

-- ============================================================
-- 1. 器材数据 —— 相机 (9条)
-- ============================================================
INSERT INTO `equipment` (`equip_id`, `name`, `type`, `brand`, `price`, `image`, `specs`, `performance`, `pros`, `cons`, `suitable_for`, `rating`, `review_count`, `tags`, `rental_daily`, `rental_weekly`, `rental_monthly`, `rental_available`, `second_hand_link`, `is_hot`) VALUES
('c1', 'Sony A7R V', '相机', 'Sony', 25999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7R+V+camera+professional+photography+equipment&sign=d8166fdacaf36f86cc84d0b7f826ac2c', '{"sensor":"61.0MP 全画幅 Exmor R CMOS","processor":"BIONZ XR 影像处理器","fps":"最高30张/秒 (APS-C裁切)","video":"8K 30p / 4K 60p","iso":"100-32000 (可扩展至50-102400)","weight":"658g"}', '{"resolution":9.8,"lowLight":9.5,"autofocus":9.9,"battery":8.5,"speed":9.2}', '["高像素","快速对焦","优秀的视频能力","轻量化设计"]', '["昂贵的价格","电池续航一般","菜单系统复杂"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.5, 89, '["全画幅","高像素","专业","视频"]', 299.00, 1499.00, 3999.00, 1, 'https://www.taobao.com/search?q=Sony+A7R+V+二手', 0),
('c2', 'Canon R5', '相机', 'Canon', 22999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+R5+mirrorless+camera+professional+photography+equipment&sign=5f21f2939354877028bba0a3babc29b6', '{"sensor":"45.0MP 全画幅 CMOS","processor":"DIGIC X 影像处理器","fps":"最高20张/秒","video":"8K 30p / 4K 120p","iso":"100-51200 (可扩展至100-102400)","weight":"738g"}', '{"resolution":9.7,"lowLight":9.3,"autofocus":9.8,"battery":8.8,"speed":9.4}', '["高像素","优秀的视频能力","快速对焦","良好的人体工程学"]', '["价格较高","视频拍摄过热","菜单系统复杂"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.4, 92, '["全画幅","高像素","专业","视频"]', 279.00, 1399.00, 3799.00, 1, 'https://www.taobao.com/search?q=Canon+R5+二手', 0),
('c3', 'Nikon Z 7II', '相机', 'Nikon', 19999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Z+7II+mirrorless+camera+professional+photography+equipment&sign=aaf9700ac67aecad579170b76b438a0e', '{"sensor":"45.7MP 全画幅 CMOS","processor":"EXPEED 6 影像处理器","fps":"最高10张/秒","video":"4K 60p","iso":"64-25600 (可扩展至64-102400)","weight":"695g"}', '{"resolution":9.6,"lowLight":9.4,"autofocus":9.5,"battery":9.0,"speed":9.0}', '["高像素","优秀的画质","良好的人体工程学","坚固耐用"]', '["视频能力一般","菜单系统复杂","价格较高"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.3, 85, '["全画幅","高像素","专业","耐用"]', 249.00, 1299.00, 3599.00, 1, 'https://www.taobao.com/search?q=Nikon+Z+7II+二手', 0),
('c4', 'Fujifilm X-T5', '相机', 'Fujifilm', 13999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+X-T5+mirrorless+camera+vintage+design+photography+equipment&sign=bd46cb9bbc77e2131a47cb3cde28e6c8', '{"sensor":"40.2MP APS-C X-Trans CMOS 5 HR","processor":"X-Processor 5","fps":"最高15张/秒 (机械快门)","video":"6.2K 30p / 4K 60p","iso":"160-12800 (可扩展至80-51200)","weight":"658g"}', '{"resolution":9.5,"lowLight":9.0,"autofocus":9.3,"battery":8.5,"speed":9.1}', '["高像素","复古外观","胶片模拟","轻量化设计"]', '["APS-C裁切","电池续航一般","视频能力一般"]', '["风光摄影","人像摄影","街拍","文艺摄影"]', 9.2, 78, '["APS-C","高像素","复古","胶片模拟"]', 199.00, 999.00, 2699.00, 1, 'https://www.taobao.com/search?q=Fujifilm+X-T5+二手', 0),
('c5', 'Panasonic S5', '相机', 'Panasonic', 11999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Panasonic+S5+mirrorless+camera+professional+photography+equipment&sign=6ad1814ed77d50da74761ab52bd8c243', '{"sensor":"24.2MP 全画幅 CMOS","processor":"Venus Engine","fps":"最高7张/秒 (机械快门)","video":"6K 30p / 4K 60p","iso":"100-25600 (可扩展至100-51200)","weight":"714g"}', '{"resolution":9.0,"lowLight":9.2,"autofocus":9.1,"battery":8.8,"speed":8.5}', '["全画幅","优秀的视频能力","良好的人体工程学","性价比高"]', '["像素较低","连拍速度慢","菜单系统复杂"]', '["风光摄影","人像摄影","视频创作","专业摄影"]', 9.0, 67, '["全画幅","视频","专业","性价比"]', 179.00, 899.00, 2399.00, 1, 'https://www.taobao.com/search?q=Panasonic+S5+二手', 0),
('c6', 'Sony A7 IV', '相机', 'Sony', 16999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7+IV+camera+professional+photography+equipment&sign=aab0489581c34e43e354eef226da730f', '{"sensor":"33.0MP 全画幅 Exmor R CMOS","processor":"BIONZ XR 影像处理器","fps":"最高10张/秒 (机械快门)","video":"4K 60p","iso":"100-32000 (可扩展至50-102400)","weight":"658g"}', '{"resolution":9.3,"lowLight":9.5,"autofocus":9.7,"battery":8.7,"speed":9.0}', '["高像素","快速对焦","优秀的视频能力","轻量化设计"]', '["昂贵的价格","电池续航一般","菜单系统复杂"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.4, 95, '["全画幅","高像素","专业","视频"]', 249.00, 1299.00, 3599.00, 1, 'https://www.taobao.com/search?q=Sony+A7+IV+二手', 0),
('c7', 'Canon EOS R6', '相机', 'Canon', 12999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EOS+R6+mirrorless+camera+professional+photography+equipment&sign=d10c5d18a25bb4bbf0e7fd9692906986', '{"sensor":"20.1MP 全画幅 CMOS","processor":"DIGIC X 影像处理器","fps":"最高12张/秒 (机械快门)","video":"4K 60p","iso":"100-102400 (可扩展至50-204800)","weight":"680g"}', '{"resolution":8.8,"lowLight":9.7,"autofocus":9.9,"battery":9.0,"speed":9.3}', '["优秀的低光性能","快速对焦","良好的人体工程学","性价比高"]', '["像素较低","视频拍摄过热","菜单系统复杂"]', '["人像摄影","风光摄影","商业摄影","专业摄影"]', 9.2, 82, '["全画幅","低光","专业","视频"]', 199.00, 999.00, 2699.00, 1, 'https://www.taobao.com/search?q=Canon+EOS+R6+二手', 0),
('c8', 'Nikon Z 6II', '相机', 'Nikon', 11999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Z+6II+mirrorless+camera+professional+photography+equipment&sign=47fef498606b6d4adbaa4bf09655135d', '{"sensor":"24.5MP 全画幅 CMOS","processor":"EXPEED 6 影像处理器","fps":"最高14张/秒","video":"4K 60p","iso":"100-51200 (可扩展至50-204800)","weight":"675g"}', '{"resolution":9.0,"lowLight":9.5,"autofocus":9.4,"battery":8.8,"speed":9.2}', '["优秀的低光性能","快速对焦","良好的人体工程学","坚固耐用"]', '["像素较低","菜单系统复杂","价格较高"]', '["人像摄影","风光摄影","商业摄影","专业摄影"]', 9.1, 76, '["全画幅","低光","专业","耐用"]', 179.00, 899.00, 2399.00, 1, 'https://www.taobao.com/search?q=Nikon+Z+6II+二手', 0),
('c9', 'Sony A7S III', '相机', 'Sony', 18999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7S+III+camera+video+production+photography+equipment&sign=5c85e66afa1cecf3930b000a4655e8f5', '{"sensor":"12.1MP 全画幅 CMOS","processor":"BIONZ XR 影像处理器","fps":"最高120张/秒","video":"4K 120p / 1080p 240p","iso":"80-102400 (可扩展至80-409600)","weight":"614g"}', '{"resolution":7.5,"lowLight":9.8,"autofocus":9.6,"battery":9.2,"speed":9.4}', '["出色的低光性能","强大的视频能力","快速对焦","良好的电池续航"]', '["像素较低","价格较高","菜单系统复杂"]', '["视频创作","低光摄影","电影制作","专业摄影"]', 9.4, 92, '["全画幅","视频","低光","专业"]', 239.00, 1199.00, 3199.00, 1, 'https://www.taobao.com/search?q=Sony+A7S+III+二手', 0);

-- 器材数据 —— 镜头 (9条)
INSERT INTO `equipment` (`equip_id`, `name`, `type`, `brand`, `price`, `image`, `specs`, `performance`, `pros`, `cons`, `suitable_for`, `rating`, `review_count`, `tags`, `rental_daily`, `rental_weekly`, `rental_monthly`, `rental_available`, `second_hand_link`, `is_hot`) VALUES
('l1', 'Sony FE 24-70mm f/2.8 GM II', '镜头', 'Sony', 17999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+24-70mm+f%2F2.8+GM+II+lens+professional+photography+equipment&sign=c2f4d84340f9a0a3ae14cebec2804b14', '{"focalLength":"24-70mm","aperture":"f/2.8","mount":"Sony E","weight":"779g","filterSize":"82mm","autofocus":"纳米AR镀膜 II"}', '{"sharpness":9.8,"bokeh":9.5,"autofocus":9.9,"buildQuality":9.7,"versatility":9.4}', '["高画质","快速对焦","优秀的防抖效果","轻量化设计"]', '["昂贵的价格","大尺寸滤镜","变焦环较紧"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.6, 76, '["全画幅","变焦","专业","大光圈"]', 199.00, 999.00, 2699.00, 1, 'https://www.taobao.com/search?q=Sony+FE+24-70mm+f%2F2.8+GM+II+二手', 0),
('l2', 'Canon RF 24-70mm f/2.8L IS USM', '镜头', 'Canon', 16999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+RF+24-70mm+f%2F2.8L+IS+USM+lens+professional+photography+equipment&sign=721825c7f5d1174ee798de316367dc44', '{"focalLength":"24-70mm","aperture":"f/2.8","mount":"Canon RF","weight":"800g","filterSize":"82mm","autofocus":"USM超声波马达"}', '{"sharpness":9.7,"bokeh":9.3,"autofocus":9.8,"buildQuality":9.6,"versatility":9.5}', '["高画质","快速对焦","优秀的防抖效果","坚固耐用"]', '["昂贵的价格","重量较大","大尺寸滤镜"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.5, 69, '["全画幅","变焦","专业","大光圈"]', 179.00, 899.00, 2399.00, 1, 'https://www.taobao.com/search?q=Canon+RF+24-70mm+f%2F2.8L+IS+USM+二手', 0),
('l3', 'Nikon NIKKOR Z 24-70mm f/2.8 S', '镜头', 'Nikon', 15999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Nikkor+Z+24-70mm+f%2F2.8+S+lens+professional+photography+equipment&sign=0c7e230399e6aad8b86937858a1e455b', '{"focalLength":"24-70mm","aperture":"f/2.8","mount":"Nikon Z","weight":"805g","filterSize":"82mm","autofocus":"STM步进马达"}', '{"sharpness":9.6,"bokeh":9.4,"autofocus":9.7,"buildQuality":9.5,"versatility":9.3}', '["高画质","快速对焦","优秀的防抖效果","坚固耐用"]', '["昂贵的价格","重量较大","大尺寸滤镜"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.4, 58, '["全画幅","变焦","专业","大光圈"]', 169.00, 849.00, 2299.00, 1, 'https://www.taobao.com/search?q=Nikon+NIKKOR+Z+24-70mm+f%2F2.8+S+二手', 0),
('l4', 'Fujifilm XF 16-80mm f/4 R OIS WR', '镜头', 'Fujifilm', 6999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+XF+16-80mm+f%2F4+R+OIS+WR+lens+professional+photography+equipment&sign=f6e2301e3920a9787697f764a2b566db', '{"focalLength":"16-80mm (等效24-120mm)","aperture":"f/4","mount":"Fujifilm X","weight":"507g","filterSize":"72mm","autofocus":"线性马达"}', '{"sharpness":9.3,"bokeh":8.8,"autofocus":9.2,"buildQuality":9.4,"versatility":9.6}', '["高画质","快速对焦","优秀的防抖效果","轻量化设计"]', '["光圈较小","价格较高","变焦范围有限"]', '["风光摄影","人像摄影","旅行摄影","文艺摄影"]', 9.2, 83, '["APS-C","变焦","专业","防抖"]', 99.00, 499.00, 1399.00, 1, 'https://www.taobao.com/search?q=Fujifilm+XF+16-80mm+f%2F4+R+OIS+WR+二手', 0),
('l5', 'Canon EF 70-200mm f/2.8L IS III USM', '镜头', 'Canon', 14999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+lens+professional+photography+equipment&sign=90b3d98d08881f8fead46c8ccac54661', '{"focalLength":"70-200mm","aperture":"f/2.8","mount":"Canon EF","weight":"1480g","filterSize":"77mm","autofocus":"环形USM马达"}', '{"sharpness":9.7,"bokeh":9.8,"autofocus":9.6,"buildQuality":9.9,"versatility":9.2}', '["高画质","快速对焦","优秀的防抖效果","坚固耐用"]', '["重量较大","价格较高","携带不便"]', '["人像摄影","体育摄影","野生动物摄影","专业摄影"]', 9.5, 72, '["全画幅","变焦","专业","大光圈"]', 199.00, 999.00, 2699.00, 1, 'https://www.taobao.com/search?q=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+二手', 0),
('l6', 'Sigma 24-70mm f/2.8 DG DN | Art for Sony E', '镜头', 'Sigma', 9999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sigma+24-70mm+f%2F2.8+DG+DN+Art+lens+for+Sony+E+professional+photography+equipment&sign=fcbfe0a39023b7141c4b56b58d348034', '{"focalLength":"24-70mm","aperture":"f/2.8","mount":"Sony E","weight":"830g","filterSize":"82mm","autofocus":"HSM超声波马达"}', '{"sharpness":9.8,"bokeh":9.4,"autofocus":9.7,"buildQuality":9.5,"versatility":9.3}', '["高画质","快速对焦","优秀的防抖效果","性价比高"]', '["重量较大","大尺寸滤镜","变焦环较紧"]', '["风光摄影","人像摄影","商业摄影","专业摄影"]', 9.4, 65, '["全画幅","变焦","专业","大光圈"]', 149.00, 749.00, 1999.00, 1, 'https://www.taobao.com/search?q=Sigma+24-70mm+f%2F2.8+DG+DN+Art+for+Sony+E+二手', 0),
('l7', 'Tamron 28-75mm f/2.8 Di III RXD for Sony E', '镜头', 'Tamron', 7999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Tamron+28-75mm+f%2F2.8+Di+III+RXD+lens+for+Sony+E+professional+photography+equipment&sign=b4d58d4b22056790c17a512bb2407f57', '{"focalLength":"28-75mm","aperture":"f/2.8","mount":"Sony E","weight":"550g","filterSize":"67mm","autofocus":"RXD静音马达"}', '{"sharpness":9.5,"bokeh":9.2,"autofocus":9.4,"buildQuality":9.3,"versatility":9.5}', '["高画质","快速对焦","优秀的防抖效果","轻量化设计"]', '["光圈较小","价格较高","变焦范围有限"]', '["风光摄影","人像摄影","旅行摄影","专业摄影"]', 9.2, 78, '["全画幅","变焦","专业","大光圈"]', 129.00, 649.00, 1799.00, 1, 'https://www.taobao.com/search?q=Tamron+28-75mm+f%2F2.8+Di+III+RXD+for+Sony+E+二手', 0),
('l8', 'Canon EF 50mm f/1.2L USM', '镜头', 'Canon', 10999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+50mm+f%2F1.2L+USM+lens+portrait+photography+equipment&sign=d1ed5e417e0eb482a07b0b8707564f2b', '{"focalLength":"50mm (标准定焦)","aperture":"f/1.2","mount":"Canon EF","weight":"820g","filterSize":"72mm","autofocus":"环形USM马达"}', '{"sharpness":9.7,"bokeh":9.9,"autofocus":9.4,"buildQuality":9.6,"versatility":9.1}', '["高画质","快速对焦","优秀的防抖效果","大光圈"]', '["重量较大","价格较高","携带不便"]', '["人像摄影","肖像摄影","艺术摄影","专业摄影"]', 9.5, 68, '["全画幅","定焦","专业","大光圈"]', 149.00, 749.00, 1999.00, 1, 'https://www.taobao.com/search?q=Canon+EF+50mm+f%2F1.2L+USM+二手', 0),
('l9', 'Sony FE 85mm f/1.4 GM', '镜头', 'Sony', 11999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+85mm+f%2F1.4+GM+lens+portrait+photography+equipment&sign=0fd793c3c320c5412df583f1ea12b818', '{"focalLength":"85mm (人像定焦)","aperture":"f/1.4","mount":"Sony E","weight":"820g","filterSize":"77mm","autofocus":"纳米AR镀膜"}', '{"sharpness":9.8,"bokeh":9.9,"autofocus":9.7,"buildQuality":9.6,"versatility":9.2}', '["高画质","快速对焦","优秀的防抖效果","大光圈"]', '["重量较大","价格较高","携带不便"]', '["人像摄影","肖像摄影","艺术摄影","专业摄影"]', 9.6, 79, '["全画幅","定焦","专业","大光圈"]', 169.00, 849.00, 2299.00, 1, 'https://www.taobao.com/search?q=Sony+FE+85mm+f%2F1.4+GM+二手', 0);

-- 器材数据 —— 配件 (9条)
INSERT INTO `equipment` (`equip_id`, `name`, `type`, `brand`, `price`, `image`, `specs`, `performance`, `pros`, `cons`, `suitable_for`, `rating`, `review_count`, `tags`, `rental_daily`, `rental_weekly`, `rental_monthly`, `rental_available`, `second_hand_link`, `is_hot`) VALUES
('a1', 'Gitzo GT3543LS Systematic碳纤维三脚架', '三脚架', 'Gitzo', 8999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Gitzo+GT3543LS+Systematic+carbon+fiber+tripod+photography+equipment&sign=8536298fc147e22eaf4d9ee88d2399c8', '{"material":"碳纤维","maximumHeight":"170cm","minimumHeight":"11cm","weight":"1.95kg","loadCapacity":"30kg","sections":"4节"}', '{"stability":9.8,"buildQuality":9.9,"portability":8.5,"versatility":9.0,"valueForMoney":8.0}', '["超高稳定性","轻巧便携","坚固耐用","精准的调节"]', '["价格昂贵","调节稍复杂","收纳长度较长"]', '["风景摄影","长时间曝光","微距摄影","视频拍摄"]', 9.5, 43, '["专业","碳纤维","稳定","高端"]', 99.00, 499.00, 1299.00, 1, 'https://www.taobao.com/search?q=Gitzo+GT3543LS+Systematic+二手', 0),
('a2', 'Manfrotto 190XPRO4 铝合金三脚架', '三脚架', 'Manfrotto', 2999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Manfrotto+190XPRO4+aluminum+tripod+photography+equipment&sign=dbaeaad86de60e11cf207410c7d0e0cf', '{"material":"铝合金","maximumHeight":"165cm","minimumHeight":"14cm","weight":"2.3kg","loadCapacity":"8kg","sections":"4节"}', '{"stability":9.3,"buildQuality":9.5,"portability":8.8,"versatility":9.2,"valueForMoney":9.0}', '["稳定可靠","易于调节","坚固耐用","性价比高"]', '["相对较重","收纳长度较长","操作稍复杂"]', '["人像摄影","风光摄影","视频拍摄","商业摄影"]', 9.2, 67, '["专业","铝合金","稳定","性价比"]', 59.00, 299.00, 899.00, 1, 'https://www.taobao.com/search?q=Manfrotto+190XPRO4+二手', 0),
('a3', 'DJI Ronin-SC 稳定器', '稳定器', 'DJI', 4999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=DJI+Ronin-SC+camera+stabilizer+photography+equipment&sign=f404c382f6b1f4f91a6716b0c5b7e858', '{"weight":"1.1kg","loadCapacity":"2kg","batteryLife":"11小时","dimensions":"折叠: 220x160x85mm, 展开: 490x160x85mm"}', '{"stability":9.7,"buildQuality":9.4,"portability":9.2,"versatility":9.5,"valueForMoney":9.1}', '["稳定可靠","轻便易携","易于操作","多种拍摄模式"]', '["承重有限","电池续航一般","价格较高"]', '["视频创作","Vlog拍摄","旅行摄影","纪录片拍摄"]', 9.3, 92, '["稳定器","视频","轻便","智能"]', 89.00, 449.00, 1199.00, 1, 'https://www.taobao.com/search?q=DJI+Ronin-SC+二手', 0),
('a4', 'Rode VideoMic Pro+ 麦克风', '麦克风', 'Rode', 1999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rode+VideoMic+Pro+microphone+photography+equipment&sign=e224558ef6106fb64a529f471bbb4a72', '{"polarPattern":"心形指向","frequencyResponse":"20Hz - 20kHz","sensitivity":"-32dB re 1V/Pa","powerSupply":"AA电池 (10小时)"}', '{"soundQuality":9.5,"buildQuality":9.3,"portability":9.6,"versatility":9.1,"valueForMoney":9.2}', '["音质出色","轻便易携","易于安装","性价比高"]', '["电池续航一般","缺少防风毛","价格较高"]', '["视频创作","Vlog拍摄","采访","纪录片拍摄"]', 9.1, 85, '["麦克风","视频","音质","专业"]', 49.00, 249.00, 699.00, 1, 'https://www.taobao.com/search?q=Rode+VideoMic+Pro%2B+二手', 0),
('a5', 'Sandisk Extreme PRO 1TB CFexpress Type B 存储卡', '存储卡', 'Sandisk', 1299.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=SanDisk+Extreme+Pro+CFexpress+memory+card+photography+equipment&sign=e4aada61e517a97edb2cbe288eccc913', '{"capacity":"1TB","readSpeed":"1700MB/s","writeSpeed":"1200MB/s","compatibility":"Sony A7R V, Canon R5, Nikon Z 7II"}', '{"speed":9.8,"reliability":9.7,"versatility":9.4,"valueForMoney":8.8}', '["读写速度快","容量大","可靠耐用","兼容多种相机"]', '["价格较高","容易发热","体积小易丢失"]', '["高分辨率摄影","8K视频录制","高速连拍","专业摄影"]', 9.4, 112, '["存储卡","高速","大容量","专业"]', 29.00, 149.00, 399.00, 1, 'https://www.taobao.com/search?q=Sandisk+Extreme+PRO+1TB+CFexpress+二手', 0),
('a6', 'Lowepro ProTactic BP 450 AW II 摄影包', '摄影包', 'Lowepro', 1599.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Lowepro+ProTactic+BP+450+AW+II+camera+bag+photography+equipment&sign=cc0d642b6ac007244be6620895729012', '{"material":"防水尼龙","dimensions":"32x18x48cm","weight":"1.6kg","capacity":"可容纳1台全画幅相机+3-4个镜头+闪光灯+配件"}', '{"buildQuality":9.5,"portability":9.1,"versatility":9.4,"comfort":9.3,"valueForMoney":9.0}', '["容量大","舒适耐用","防水防尘","设计合理"]', '["相对较重","价格较高","外观普通"]', '["旅行摄影","商业摄影","户外摄影","专业摄影"]', 9.2, 78, '["摄影包","专业","防水","大容量"]', 49.00, 249.00, 699.00, 1, 'https://www.taobao.com/search?q=Lowepro+ProTactic+BP+450+AW+II+二手', 0),
('a7', 'Godox V1 Flash 闪光灯', '闪光灯', 'Godox', 1999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Godox+V1+Flash+speedlight+photography+equipment&sign=1a4f490a0a1387b50585e5c05d2b15dd', '{"guideNumber":"58 (ISO 100, 105mm)","recyclingTime":"0.1-2.1秒","batteryLife":"650次闪光","compatibility":"Canon, Sony, Nikon, Fujifilm"}', '{"power":9.6,"buildQuality":9.3,"versatility":9.5,"valueForMoney":9.4}', '["功率大","回电速度快","多品牌兼容","高性价比"]', '["重量较大","电池续航一般","操作稍复杂"]', '["人像摄影","婚礼摄影","商业摄影","舞台摄影"]', 9.4, 89, '["闪光灯","专业","多兼容","高速"]', 79.00, 399.00, 999.00, 1, 'https://www.taobao.com/search?q=Godox+V1+Flash+二手', 0),
('a8', 'DJI Mini 3 Pro 无人机', '无人机', 'DJI', 5999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=DJI+Mini+3+Pro+drone+photography+equipment&sign=7b45cde6820f4a1dc13996b84d4c8b7d', '{"weight":"249g","batteryLife":"34分钟","camera":"1/1.3英寸CMOS, 48MP, 4K 60fps","maxRange":"10公里"}', '{"imageQuality":9.5,"flightStability":9.7,"portability":9.8,"versatility":9.4,"valueForMoney":9.2}', '["轻便易携","4K高清视频","智能飞行模式","长续航"]', '["禁飞区域多","风阻较大","价格较高"]', '["风光摄影","旅行摄影","视频创作","无人机航拍"]', 9.5, 124, '["无人机","航拍","视频","智能"]', 199.00, 999.00, 2699.00, 1, 'https://www.taobao.com/search?q=DJI+Mini+3+Pro+二手', 0),
('a9', 'Peak Design Everyday Sling 5L V2 摄影包', '摄影包', 'Peak Design', 1399.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Peak+Design+Everyday+Sling+5L+V2+camera+bag+photography+equipment&sign=89e1b5a7f3abbb2e70df754a43fa9ac3', '{"material":"防水尼龙","dimensions":"25x12x42cm","weight":"550g","capacity":"可容纳1台微单相机+2个镜头+配件"}', '{"buildQuality":9.6,"portability":9.9,"versatility":9.2,"comfort":9.4,"valueForMoney":9.1}', '["超轻便携","快速取物","防水防尘","设计时尚"]', '["容量较小","价格较高","肩带较窄"]', '["街头摄影","旅行摄影","日常摄影","Vlog拍摄"]', 9.3, 67, '["摄影包","便携","时尚","专业"]', 39.00, 199.00, 549.00, 1, 'https://www.taobao.com/search?q=Peak+Design+Everyday+Sling+5L+V2+二手', 0);


-- ============================================================
-- 2. 活动数据 (4条)
-- ============================================================
INSERT INTO `event` (`event_id`, `title`, `type`, `category`, `image`, `location`, `date`, `duration`, `instructor_name`, `instructor_avatar`, `instructor_title`, `instructor_experience`, `price`, `participants`, `max_participants`, `description`, `itinerary`, `inclusion`, `exclusion`, `notes`, `tags`) VALUES
('e1', '新疆喀纳斯秋季风光摄影团', '采风团', '风光', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20kanas%20autumn%20landscape%20photography%20tour&sign=80fdfc7396a896f951715b6544406409', '新疆·喀纳斯', '2023-10-15 至 2023-10-22', '8天7晚', '风光摄影师张明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor%20professional&sign=871dd04c358f08c5214aaf9a36e6bf27', '国家地理摄影师', '15年', 6999.00, 12, 20, '跟随国家地理摄影师张明，深入新疆喀纳斯，拍摄秋季绝美风光。行程涵盖喀纳斯湖、禾木村、白哈巴等著名景点。', '["第1天：全国各地 - 乌鲁木齐集合","第2天：乌鲁木齐 - 布尔津 - 五彩滩","第3天：布尔津 - 喀纳斯湖 - 观鱼台","第4天：喀纳斯 - 白哈巴村","第5天：白哈巴 - 禾木村","第6天：禾木村全天拍摄","第7天：禾木 - 可可托海","第8天：可可托海 - 乌鲁木齐解散"]', '["交通","住宿","餐食","门票","指导","保险"]', '["往返机票","个人消费","单房差","额外景点门票"]', '["需自带摄影器材","有一定摄影基础","适应高原气候","尊重当地风俗"]', '["风光","新疆","秋季","长线","深度"]'),
('e2', '上海城市纪实摄影沙龙', '摄影沙龙', '纪实', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20urban%20documentary%20photography%20salon&sign=c10d47ff72e693e4aae932edd3732d15', '上海·静安区', '2023-10-28 14:00-17:00', '3小时', '纪实摄影师李华', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street%20experienced&sign=c2d89b9f47e07118aab5b3aef7c5cdf3', '国际纪实摄影奖得主', '10年', 199.00, 18, 30, '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。', '["14:00-14:30：签到与破冰","14:30-15:30：纪实摄影理论分享","15:30-16:30：户外实战拍摄指导","16:30-17:00：作品点评与交流"]', '["场地","指导","资料","茶点"]', '["交通","器材","个人消费"]', '["自带摄影器材","提前报名确认","尊重拍摄对象"]', '["纪实","城市","上海","沙龙","短期"]'),
('e3', '索尼Alpha新品体验会', '器材体验会', '器材', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20new%20camera%20experience%20event%20demo&sign=7801e7949f7d2a5e0e7c3a308a3fba3a', '北京·朝阳区', '2023-11-05 10:00-16:00', '6小时', '索尼技术专家王强', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20camera%20technical%20expert%20male%20professional&sign=78333651a183c3049ee0b820a0642879', '索尼官方讲师', '8年', 0.00, 25, 50, '索尼Alpha系列新品体验会，现场体验最新的索尼相机和镜头，包括A7R V、A7S III等热门机型。', '["10:00-10:30：签到与自由体验","10:30-11:30：新品技术解析","11:30-12:30：午餐交流","12:30-15:00：分组体验与指导","15:00-16:00：问答与抽奖"]', '["场地","器材","指导","午餐"]', '["交通","个人消费"]', '["提前报名","凭确认短信入场","注意保管个人物品"]', '["器材","索尼","新品","体验","免费"]'),
('e4', '云南元阳梯田春季摄影创作', '采风团', '风光', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=yunnan%20yuanyang%20rice%20terraces%20spring%20photography%20tour&sign=09c3d6131214921bb3af386fac7bdba4', '云南·元阳', '2024-02-20 至 2024-02-25', '6天5晚', '风光摄影师刘芳', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20female%20nature%20professional&sign=c3336bf3ce1c7229154ec96830fedbfc', '国际风光摄影奖得主', '12年', 5699.00, 8, 15, '春季元阳梯田灌水期，是拍摄梯田云海、日出日落的最佳时节。跟随国际风光摄影奖得主刘芳，深入元阳梯田核心景区，在最佳拍摄点和时间，捕捉梯田如镜面般倒映天空和云霞的壮观景象。', '["第1天：昆明集合","第2天：昆明 - 元阳 - 老虎嘴梯田","第3天：多依树梯田日出 - 爱春蓝梯田","第4天：箐口梯田 - 坝达梯田日落","第5天：龙树坝梯田 - 阿者科古村","第6天：元阳 - 昆明解散"]', '["交通","住宿","餐食","门票","指导","保险"]', '["往返机票","个人消费","单房差"]', '["需自带摄影器材","有一定摄影基础","早起拍摄"]', '["风光","云南","春季","梯田","经典"]');

-- ============================================================
-- 3. 赛事数据 (4条)
-- ============================================================
INSERT INTO `contest` (`contest_id`, `title`, `type`, `organizer`, `image`, `deadline`, `status`, `entries`, `works_count`, `participants`, `prizes`, `description`, `categories`, `rules`, `tags`) VALUES
('c1', '2025年度黑白摄影大赛', '官方主办', NULL, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20contest%20banner%20minimalist&sign=5958a9112dbd48d52283b3d3b68c22df', '2025-12-31', '进行中', 1254, 3458, 1254, '[{"rank":"一等奖","value":"20000元","count":1},{"rank":"二等奖","value":"10000元","count":2},{"rank":"三等奖","value":"5000元","count":3},{"rank":"优秀奖","value":"1000元","count":10}]', '展现黑白摄影的独特魅力，通过光影、构图和情感表达，呈现经典而永恒的视觉艺术作品。', '["风光","人像","纪实","创意"]', '["参赛作品必须为黑白照片","每位参赛者最多提交5幅作品","作品必须为原创，不得抄袭","保留EXIF信息，便于评审","投稿即视为同意主办方拥有作品使用权"]', '["黑白","年度","官方","奖金","全球"]'),
('c2', '索尼Alpha创意摄影挑战赛', '合作赛事', '索尼中国', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20creative%20photography%20challenge%20banner&sign=38f14ccad69f3dbb399991f5317127ce', '2025-12-25', '进行中', 876, 2156, 876, '[{"rank":"金奖","value":"索尼A7R V相机一台","count":1},{"rank":"银奖","value":"索尼FE 24-70mm F2.8 GM镜头","count":2},{"rank":"铜奖","value":"索尼ZV-1相机一台","count":3},{"rank":"入围奖","value":"索尼相机包一个","count":20}]', '使用索尼Alpha系列相机创作，展示你的创意视角和摄影才华。', '["不限"]', '["参赛作品必须使用索尼Alpha系列相机拍摄","每位参赛者最多提交8幅作品","作品可进行后期处理","保留原始文件，获奖后需提供验证","投稿即视为同意活动规则和版权条款"]', '["索尼","创意","器材","相机","合作"]'),
('c3', '城市人文纪实摄影大赛', '官方主办', NULL, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20documentary%20photography%20contest%20banner%20street%20life&sign=818fdf65887ba3b9c9d321794542006b', '2025-12-30', '进行中', 654, 1890, 654, '[{"rank":"金奖","value":"15000元","count":1},{"rank":"银奖","value":"8000元","count":2},{"rank":"铜奖","value":"3000元","count":3},{"rank":"人气奖","value":"2000元","count":1}]', '记录城市生活的瞬间，展现都市人文风情和社会变迁。', '["人文","纪实","街拍"]', '["参赛作品必须为纪实摄影风格","每位参赛者最多提交6幅作品","可以是单幅或组照（组照不超过8张）","作品需附带简短文字说明","保留真实性，不得过度修改"]', '["城市","人文","纪实","街拍","官方"]'),
('c4', '自然生态摄影展', '官方主办', NULL, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=natural%20ecology%20photography%20exhibition%20banner%20wildlife&sign=c47d5cf3d76049534c98c3f640cbd2f0', '2025-12-10', '进行中', 432, 1256, 432, '[{"rank":"金奖","value":"12000元","count":1},{"rank":"银奖","value":"6000元","count":2},{"rank":"铜奖","value":"3000元","count":3},{"rank":"优秀奖","value":"1000元","count":8}]', '展现大自然的美丽与神奇，记录生态环境和野生动植物的精彩瞬间，提高公众的环保意识和对自然的敬畏之心。', '["风光","野生动物","植物","生态环境"]', '["参赛作品必须为自然生态主题","每位参赛者最多提交5幅作品","作品需注明拍摄地点和物种信息","不得伤害或干扰拍摄对象","严禁摆拍和人为干预自然行为"]', '["自然","生态","风光","野生动物","环保"]');

-- ============================================================
-- 4. 课程数据 (6条)
-- ============================================================
INSERT INTO `course` (`course_id`, `title`, `type`, `category`, `level`, `instructor_name`, `instructor_avatar`, `instructor_title`, `instructor_students`, `instructor_courses`, `instructor_rating`, `cover_image`, `duration`, `lessons`, `students`, `rating`, `reviews`, `description`, `tags`, `price`) VALUES
('c1', '摄影入门：曝光三要素详解', '免费', '基础知识', '入门', '摄影导师李明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20male%20professional&sign=3463768fb946a95d70afa8eb5967ad9c', '资深摄影师', 12543, 28, 4.9, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20basics%20exposure%20triangle%20tutorial&sign=e033925b5e39db550134d845baeaa825', '1小时30分钟', 8, 12543, 4.9, 2345, '本课程适合摄影初学者，详细讲解摄影的核心概念——曝光三要素（光圈、快门、ISO），让你掌握正确曝光的技巧。', '["曝光","基础","入门","光圈","快门","ISO"]', 0.00),
('c2', '风光摄影进阶：光影与构图', '付费', '风光摄影', '进阶', '风光摄影师王强', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67', '国家地理摄影师', 9876, 16, 4.8, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20photography%20composition%20light%20shadow%20advanced&sign=d8a2f766bd981adac3262311d398d1ef', '2小时15分钟', 12, 9876, 4.8, 1876, '深入学习风光摄影的高级技巧，掌握光影运用、构图法则、时机选择等关键技能。', '["风光","进阶","构图","光影","自然"]', 199.00),
('c3', '人像摄影：自然光与室内布光', '付费', '人像摄影', '中级', '人像摄影师张婷', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20creative&sign=cd5ab328d0f9f41949035a23e571e1bd', '商业人像摄影师', 8765, 22, 4.9, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20photography%20natural%20light%20studio%20lighting&sign=18209112c8302f932e757d4e8c31b44d', '2小时45分钟', 14, 8765, 4.9, 1654, '学习如何在不同光线条件下拍摄出色的人像作品，掌握自然光运用和室内布光技巧。', '["人像","中级","布光","自然光","室内"]', 249.00),
('c4', 'Lightroom后期修图完全指南', '付费', '后期处理', '中级', '后期修图师刘芳', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20female%20professional&sign=5ac7b833738b4d4851440943047a2269', 'Adobe认证讲师', 15678, 32, 4.9, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=lightroom%20photo%20editing%20workflow%20complete%20guide&sign=2489a81ae43b953f53d61d782fe1d37e', '3小时30分钟', 18, 15678, 4.9, 3245, '从基础操作到高级技巧，全面掌握Lightroom的修图工作流。', '["后期","Lightroom","修图","调色","中级"]', 299.00),
('c5', '街头摄影：捕捉城市瞬间', '付费', '街头摄影', '中级', '街头摄影师陈明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban&sign=c49a759749c39b9f82ea2702f7f9adc6', '国际街头摄影奖得主', 7654, 14, 4.8, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=street%20photography%20capture%20urban%20moments%20tutorial&sign=a7b739310d7bda180284a12ef286f54f', '2小时', 10, 7654, 4.8, 1234, '学习街头摄影的构图技巧、时机把握、器材选择，以及如何克服拍摄陌生人的心理障碍。', '["街头","中级","瞬间","人文","城市"]', 189.00),
('c6', '摄影创作思维提升', '付费', '创作思维', '高级', '艺术摄影师赵琳', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20female%20creative&sign=6ab0fc66e2f8846484c0cd7cb1f2f95b', '摄影艺术教授', 6543, 18, 4.9, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20creative%20thinking%20composition%20artistic&sign=88bdb7c23e78f66f50db5eef22c487ae', '3小时', 15, 6543, 4.9, 987, '突破创作瓶颈，提升摄影思维能力，学习如何发现独特视角，表达个人风格。', '["创作思维","高级","艺术","风格","表达"]', 349.00);

-- ============================================================
-- 5. 文字教程数据 (3条)
-- ============================================================
INSERT INTO `tutorial` (`tutorial_id`, `title`, `description`, `author_name`, `author_avatar`, `category`, `level`, `duration`, `views`, `likes`, `image`, `tags`) VALUES
('t1', '入门指南：摄影基础知识详解', '本教程适合摄影初学者，详细讲解摄影的基本概念、曝光三要素、构图技巧等基础知识。', '摄影导师A', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20avatar%20male&sign=b23459644f685f38e900003dfc85a443', '基础知识', '入门', '30分钟', 12543, 2543, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20basics%20tutorial%20camera%20settings&sign=5240d0109bb84f17e932bc9a6c120149', '["曝光","构图","光圈","快门","ISO"]'),
('t2', '人像摄影：如何捕捉自然表情', '学习如何与模特沟通，引导自然表情，以及如何利用光线和环境拍出令人惊艳的人像作品。', '人像大师B', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20avatar%20female&sign=f6c999d3d63c14af71aea3f5040e4c1e', '人像摄影', '中级', '45分钟', 8765, 1892, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20photography%20tutorial%20model%20posing&sign=ed3198e582d93aa9bb684cfebc5a109e', '["人像","表情","引导","光线","构图"]'),
('t3', '后期修图：Lightroom基础工作流', '从导入到导出，完整讲解Lightroom的基础工作流程，包括组织照片、调整曝光、色彩校正等技巧。', '后期专家C', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20avatar%20male&sign=7486bb00777acac959518af903d752a8', '后期处理', '入门', '60分钟', 15678, 3245, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20editing%20tutorial%20lightroom%20workflow&sign=b916c7f932a3d1b98ebd046cd208086f', '["Lightroom","后期","工作流","修图","调色"]');

-- ============================================================
-- 6. 工具数据 (8条: 4已添加 + 4推荐)
-- ============================================================
INSERT INTO `tool` (`tool_id`, `name`, `description`, `thumbnail`, `category`, `usage_count`, `rating`, `users`, `is_recommended`) VALUES
('t1', 'Lightroom 预设编辑器', '自定义和应用Lightroom预设，调整照片色调、对比度等参数', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=lightroom%20preset%20editor%20interface%20tool&sign=42661b7d2c987e965f113dcc6f3dac60', '预设工具', 35, 4.8, 0, 0),
('t2', 'Photoshop 在线编辑器', '基础的在线Photoshop功能，适合快速编辑和调整照片', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photoshop%20online%20editor%20interface%20tool&sign=ba958b5aae10d256ff78fd63cdd9317e', '图像编辑', 28, 4.7, 0, 0),
('t3', 'RAW 格式转换器', '将RAW格式照片转换为各种常用图像格式，支持批量处理', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=raw%20format%20converter%20interface%20tool&sign=4b092bc64a2cfa96e4b3e8a40f290cf7', '格式转换', 19, 4.5, 0, 0),
('t4', '批量水印工具', '为多张照片添加自定义水印，支持调整位置、透明度和大小', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=batch%20watermark%20tool%20interface%20utility&sign=a1f93a0268496bbb87f0338ad8bf46f9', '批量处理', 14, 4.6, 0, 0),
('r1', 'AI 图像增强器', '利用AI技术增强照片细节，提升图像质量和清晰度', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=ai%20image%20enhancer%20interface%20technology&sign=768e0f379d08771771ae078ef49eea14', 'AI工具', 0, 4.9, 1254, 1),
('r2', '智能修图助手', '自动识别照片问题并提供智能修复建议，简化后期流程', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=smart%20photo%20editing%20assistant%20interface&sign=b84f99b6914c313fa707037053558c76', 'AI工具', 0, 4.8, 987, 1),
('r3', '照片拼接工具', '将多张照片拼接成全景图或接片，支持自动对齐和色调匹配', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20stitching%20tool%20interface%20panorama&sign=f7e67a8de86c9cb816820d67f4fd53a0', '图像合成', 0, 4.7, 876, 1),
('r4', 'HDR 合成工具', '将多张不同曝光的照片合成为HDR图像，保留更多细节', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=hdr%20image%20merge%20tool%20interface%20photography&sign=941b75b668557d29e52aefb0289a6d9a', '图像合成', 0, 4.6, 765, 1);


-- ============================================================
-- 7. 测评数据 (4条)
-- ============================================================
INSERT INTO `review` (`review_id`, `title`, `type`, `author_name`, `author_avatar`, `author_role`, `author_experience`, `equipment_name`, `equipment_type`, `equipment_image`, `date`, `read_time`, `views`, `likes`, `comments`, `rating`, `credibility_rating`, `featured_image`, `tags`, `excerpt`, `pros`, `cons`, `performance`, `tips`, `faq`) VALUES
('r1', 'Sony A7R V深度测评：高像素摄影的新标杆', '专业编辑测评', '器材专家张明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20expert%20male%20professional&sign=56fa5f34db1fbce04f76c7576c6ad020', '资深器材编辑', '10年摄影器材评测经验', 'Sony A7R V', '微单相机', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7R+V+camera+professional+photography+equipment&sign=d8166fdacaf36f86cc84d0b7f826ac2c', '2023-10-25', '15分钟', 12543, 2890, 345, 9.4, 9.6, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7R+V+camera+professional+photography+equipment&sign=d8166fdacaf36f86cc84d0b7f826ac2c', '["索尼","全画幅","高像素","专业","微单"]', 'Sony A7R V作为一款高像素全画幅微单相机，带来了诸多技术革新。', '["高像素","快速对焦","优秀的视频能力","轻量化设计"]', '["昂贵的价格","电池续航一般","菜单系统复杂"]', '{"imageQuality":9.8,"autofocus":9.9,"video":9.5,"handling":9.0,"battery":9.2,"value":8.7}', '["使用A模式配合曝光补偿可以获得更精准的曝光","高像素模式下建议使用三脚架以获得最佳画质","自定义按钮可以提高操作效率","使用原厂电池以获得最佳续航表现"]', '[{"question":"这款相机适合入门用户吗？","answer":"这款相机功能强大但操作相对复杂，适合有一定摄影基础的用户。"},{"question":"电池续航能力如何？","answer":"满电状态下可拍摄约500张照片，建议长时间拍摄时携带备用电池。"},{"question":"是否支持无线传输？","answer":"支持Wi-Fi和蓝牙传输，可以方便地将照片传输到手机或电脑。"}]'),
('r2', 'Canon R5用户实测：婚礼摄影的可靠选择', '用户实测分享', '婚礼摄影师李华', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20photographer%20male%20creative&sign=82c2687369cb5518e618423326b5a47c', '职业婚礼摄影师', '8年婚礼拍摄经验', 'Canon R5', '微单相机', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+R5+mirrorless+camera+professional+photography+equipment&sign=5f21f2939354877028bba0a3babc29b6', '2023-10-20', '10分钟', 8765, 1987, 234, 9.2, 9.4, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+R5+mirrorless+camera+professional+photography+equipment&sign=5f21f2939354877028bba0a3babc29b6', '["佳能","婚礼摄影","高速连拍","微单","弱光性能"]', '作为一名职业婚礼摄影师，我在过去的三个月里使用Canon R5拍摄了20多场婚礼。', '["高像素","优秀的视频能力","快速对焦","良好的人体工程学"]', '["价格较高","视频拍摄过热","菜单系统复杂"]', '{"imageQuality":9.3,"autofocus":9.8,"video":9.2,"handling":9.5,"battery":9.0,"value":9.0}', '["在弱光环境下使用高ISO拍摄时，推荐开启降噪功能","婚礼拍摄时建议使用双存储卡模式以防数据丢失","自定义快捷键可以快速切换不同的拍摄模式","使用原厂电池充电器可以延长电池寿命"]', '[{"question":"这款相机的弱光表现如何？","answer":"在ISO 6400以下表现优异，噪点控制良好，适合婚礼等弱光环境。"},{"question":"连续拍摄时的缓冲深度如何？","answer":"使用高速SD卡时可以连续拍摄约30张RAW格式照片。"}]'),
('r3', 'Fujifilm X-T5开箱体验：复古外观与现代性能的完美结合', '用户实测分享', '街头摄影师王强', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban&sign=c49a759749c39b9f82ea2702f7f9adc6', '街拍摄影师', '5年街头摄影经验', 'Fujifilm X-T5', '微单相机', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+X-T5+mirrorless+camera+vintage+design+photography+equipment&sign=bd46cb9bbc77e2131a47cb3cde28e6c8', '2023-10-15', '8分钟', 7654, 1765, 189, 9.0, 9.3, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+X-T5+mirrorless+camera+vintage+design+photography+equipment&sign=bd46cb9bbc77e2131a47cb3cde28e6c8', '["富士","复古","街拍","APS-C","高像素"]', 'Fujifilm X-T5以其复古的外观设计和强大的性能吸引了众多摄影爱好者。本文将从开箱体验开始，详细介绍这款相机的外观、功能和实际拍摄表现。', '["高像素","复古外观","胶片模拟","轻量化设计"]', '["APS-C裁切","电池续航一般","视频能力一般"]', '{"imageQuality":9.5,"autofocus":9.0,"video":8.5,"handling":9.6,"battery":8.8,"value":8.9}', '["使用胶片模拟模式可以获得独特的色彩风格","街拍时建议使用静音拍摄模式","自定义ISO转盘可以快速调整感光度","配合XF系列定焦镜头可以获得最佳成像质量"]', '[{"question":"这款相机的操作复杂度如何？","answer":"虽然有复古外观，但操作直观，适合喜欢传统操作方式的用户。"},{"question":"电池续航能力如何？","answer":"满电状态下可拍摄约300张照片，外出拍摄建议携带备用电池。"},{"question":"是否支持镜头防抖？","answer":"支持机身防抖，配合防抖镜头可以获得更稳定的画面。"}]'),
('r4', 'Sony FE 24-70mm f/2.8 GM II镜头深度测评', '专业编辑测评', '镜头专家刘芳', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20lens%20expert%20female%20professional&sign=c9dd2373388218683b3e980d22233258', '资深镜头评测师', '12年摄影镜头评测经验', 'Sony FE 24-70mm f/2.8 GM II', '变焦镜头', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+24-70mm+f%2F2.8+GM+II+lens+professional+photography+equipment&sign=c2f4d84340f9a0a3ae14cebec2804b14', '2023-10-10', '12分钟', 9876, 2345, 278, 9.6, 9.7, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+24-70mm+f%2F2.8+GM+II+lens+professional+photography+equipment&sign=c2f4d84340f9a0a3ae14cebec2804b14', '["索尼","大三元","标准变焦","专业","镜头"]', '作为索尼新一代大三元标准变焦镜头，Sony FE 24-70mm f/2.8 GM II带来了哪些提升？本文通过实验室测试和实际拍摄，全面解析这款镜头的光学性能。', '["高画质","快速对焦","优秀的防抖效果","轻量化设计"]', '["昂贵的价格","大尺寸滤镜","变焦环较紧"]', '{"sharpness":9.8,"bokeh":9.2,"autofocus":9.7,"buildQuality":9.5,"handling":9.0,"value":8.5}', '["使用遮光罩可以有效减少眩光和鬼影","拍摄人像时推荐使用f/2.8光圈以获得最佳虚化效果","定期清洁镜头前组镜片以保持最佳成像质量","存储时建议使用镜头盖保护镜片"]', '[{"question":"这款镜头的锐度表现如何？","answer":"在全焦段和全光圈下都有优异的锐度表现，特别是中心区域。"},{"question":"对焦速度和安静度如何？","answer":"采用最新的线性马达，对焦迅速且安静，适合拍摄动态场景。"},{"question":"重量和体积如何？适合旅行携带吗？","answer":"相比上一代有所减重，但作为专业镜头体积仍然较大，旅行携带需要考虑。"}]');

-- ============================================================
-- 8. 器材交易数据 (6条: 4二手 + 2全新)
-- ============================================================
INSERT INTO `equipment_trade` (`trade_id`, `name`, `type`, `brand`, `price`, `original_price`, `image`, `trade_type`, `condition`, `usage_time`, `shutter_count`, `repair_history`, `accessories`, `seller_name`, `seller_avatar`, `seller_location`, `seller_rating`, `seller_transactions`, `seller_is_official`, `description`, `tags`, `warranty`) VALUES
('ue1', 'Canon EOS R6', '相机', 'Canon', 8500.00, 12999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EOS+R6+mirrorless+camera+professional+photography+equipment&sign=d10c5d18a25bb4bbf0e7fd9692906986', 'used', '95新', '约1年', '8500次', '无维修记录', '["原装电池2块","充电器","相机包","说明书"]', '摄影爱好者小王', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20smiling%20casual&sign=db92da1c3005295607f7766d7f9263bb', '上海', 4.9, 128, 0, '2022年10月购买，使用非常小心，成色极佳。快门次数仅8500次，无任何磕碰和维修记录。', '["索尼","全画幅","微单","二手","高性价比"]', NULL),
('ue2', 'Canon EF 70-200mm f/2.8L IS III USM', '镜头', 'Canon', 7200.00, 14999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+lens+professional+photography+equipment&sign=90b3d98d08881f8fead46c8ccac54661', 'used', '9成新', '约2年', '', '无维修记录', '["原装遮光罩","镜头盖","镜头袋"]', '专业摄影师老李', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20experienced&sign=fe817dce4d08957c62787348c72eb1b7', '北京', 4.8, 256, 0, '经典佳能大三元标准变焦镜头，2021年购买，使用状况良好。', '["佳能","大三元","标准变焦","二手","专业"]', NULL),
('ue3', 'Sony A7S III', '相机', 'Sony', 5800.00, 18999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7S+III+camera+video+production+photography+equipment&sign=5c85e66afa1cecf3930b000a4655e8f5', 'used', '99新', '约3个月', '2300次', '无维修记录', '["原装电池","充电器","相机包","肩带","说明书"]', '新手摄影小张', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20male%20student&sign=a076fa14f7977e902fe333f899d2603c', '广州', 4.7, 32, 0, '2023年7月购买，几乎全新，仅使用过几次。因工作繁忙无暇使用故出售。', '["富士","APS-C","复古","二手","套机"]', NULL),
('ue4', 'Gitzo GT3543LS Systematic碳纤维三脚架', '配件', 'Gitzo', 4200.00, 8999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Gitzo+carbon+fiber+tripod+photography+equipment&sign=bff0c0ba5fe556ca67ffb0739e6395c8', 'used', '9成新', '约1.5年', '', '无维修记录', '["原装收纳袋","说明书"]', '风光摄影师老王', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67', '成都', 4.9, 187, 0, '2022年3月购买，碳纤维材质，轻巧耐用，承重能力强。', '["捷信","碳纤维","三脚架","二手","专业"]', NULL),
('ne1', 'Canon R5', '相机', 'Canon', 22999.00, 22999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+R5+mirrorless+camera+professional+photography+equipment&sign=5f21f2939354877028bba0a3babc29b6', 'new', NULL, NULL, NULL, NULL, NULL, '佳能官方授权店', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20official%20store%20logo&sign=50cd433cb1c90a4b4dca5af8ff32317b', '上海', 4.9, 1254, 1, '佳能EOS R5是一款专业级全画幅微单相机，具备4500万像素，支持8K视频录制和高速连拍。', '["佳能","全画幅","微单","全新","专业"]', '官方保修2年'),
('ne2', 'Sony FE 85mm f/1.4 GM', '镜头', 'Sony', 11999.00, 11999.00, 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+85mm+f%2F1.4+GM+lens+portrait+photography+equipment&sign=0fd793c3c320c5412df583f1ea12b818', 'new', NULL, NULL, NULL, NULL, NULL, '尼康官方授权店', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20official%20store%20logo&sign=1cb76f80ef7e58ff4fd8842daa09e778', '北京', 4.8, 987, 1, '尼康Z卡口70-200mm F2.8 VR S镜头，采用纳米结晶涂层和ED镜片，提供出色的光学性能和防抖效果。', '["尼康","大三元","长焦","全新","专业"]', '官方保修2年');


-- ============================================================
-- 9. 项目数据 (6条)
-- ============================================================
INSERT INTO `project` (`project_id`, `title`, `type`, `location`, `price`, `deadline`, `description`, `requirements`, `tags`, `company_name`, `company_avatar`, `company_verified`, `company_projects`, `company_rating`, `views`, `applications`, `status`, `progress`, `contract_signed`, `payment_status`, `delivery_status`) VALUES
('p1', '商业人像拍摄', '人像摄影', '上海市', '5000-8000', '2025-12-10', '为服装品牌拍摄秋冬季新品宣传照，需要拍摄模特人像照片，包含室内和室外场景，提供完整的后期修图服务。', '["具有商业人像拍摄经验","能够指导模特摆姿","提供专业摄影设备","熟悉后期修图流程"]', '["商业","人像","服装","后期"]', '时尚前沿服饰有限公司', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20company%20logo%20professional&sign=cdf45d87bd032e57c2a0dcbfc02251e9', 1, 125, 4.8, 324, 18, 'pending', 0, 0, NULL, NULL),
('p2', '产品摄影服务', '产品摄影', '北京市', '3000-5000', '2025-12-15', '为电子产品新品拍摄高清产品照片，主要用于电商平台展示和宣传资料。', '["有产品摄影经验","拥有专业摄影棚和灯光设备","能够处理产品反光问题","提供快速出图服务"]', '["产品","电商","静物","电子"]', '科技创新有限公司', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20company%20logo%20modern&sign=445a51379e165c0a7195033431714e16', 1, 89, 4.7, 256, 12, 'inProgress', 65, 1, 'escrowed', 'pending'),
('p3', '婚礼跟拍服务', '婚礼摄影', '广州市', '8000-12000', '2026-01-05', '为新人提供全程婚礼跟拍服务，包括接亲、仪式、晚宴等环节，要求捕捉温馨感人的瞬间。', '["有婚礼摄影经验","熟悉婚礼流程","能够捕捉瞬间情感","提供快速精修服务"]', '["婚礼","跟拍","纪实","人像"]', '幸福时刻婚礼策划', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20planner%20logo%20elegant&sign=9b3474ad243bb441517ed4ad3fc149f4', 1, 156, 4.9, 412, 23, 'pending', 0, 0, NULL, NULL),
('p4', '活动现场摄影', '活动摄影', '深圳市', '4000-6000', '2025-12-20', '为科技峰会活动提供现场摄影服务，需要拍摄演讲嘉宾、互动环节、产品展示等内容。', '["有活动摄影经验","能够在弱光环境下拍摄","熟悉大型活动流程","提供快速出图服务"]', '["活动","会议","科技","纪实"]', '未来科技峰会组委会', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20conference%20logo%20futuristic&sign=c8f9692a8042dfb02e2775e75fbca398', 1, 67, 4.6, 189, 9, 'completed', 100, 1, 'released', 'approved'),
('p5', '建筑空间摄影', '建筑摄影', '成都市', '6000-10000', '2026-01-10', '为新建成的商业中心拍摄建筑空间照片，需要展示建筑外观、内部空间设计和细节。', '["有建筑摄影经验","拥有广角和移轴镜头","能够处理大光比场景","熟悉建筑空间构图"]', '["建筑","空间","商业","广角"]', '城市建设发展有限公司', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=construction%20company%20logo%20professional&sign=5c942136e148b13f0761427e7784f634', 1, 54, 4.8, 225, 14, 'pending', 0, 0, NULL, NULL),
('p6', '美食摄影服务', '美食摄影', '杭州市', '3000-5000', '2025-12-25', '为新开业的高级餐厅拍摄菜品照片，需要拍摄20道菜品，风格偏向清新自然。', '["有美食摄影经验","拥有专业灯光设备","熟悉食物造型和摆盘","能够突出菜品质感"]', '["美食","餐厅","静物","商业"]', '品味人生餐饮管理', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=restaurant%20logo%20elegant%20food&sign=60810ff0ccd916355892a13144957b65', 1, 78, 4.7, 267, 15, 'pending', 0, 0, NULL, NULL);

-- ============================================================
-- 10. 话题数据 (4条)
-- ============================================================
INSERT INTO `topic` (`topic_id`, `title`, `content`, `author_name`, `author_avatar`, `author_level`, `tags`, `created_at`, `likes`, `comments`, `views`, `is_essential`, `is_sticky`) VALUES
('1', '分享我的极简主义摄影心得', '在过去的一年里，我专注于极简主义摄影，通过简化构图和色彩，突出主题的本质。今天想和大家分享一些心得...', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c', 8, '["极简主义","构图","心得"]', '2023-10-25', 125, 34, 890, 1, 0),
('2', '【器材评测】索尼A7R V深度使用体验', '入手索尼A7R V已经三个月了，作为一名专业摄影师，我想从实际使用的角度分享一下这款相机的优缺点...', '城市摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1', 6, '["器材评测","索尼","全画幅"]', '2023-10-24', 230, 56, 1250, 1, 1),
('3', '寻找城市中的几何美感', '城市环境中蕴含着丰富的几何元素，这些线条和形状构成了独特的视觉语言。分享几个我常用的寻找和拍摄方法...', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c', 8, '["城市摄影","几何构图","技巧"]', '2023-10-23', 98, 23, 650, 0, 0),
('4', '风光摄影中的光线把握', '光线是摄影的灵魂，尤其是在风光摄影中。本文将探讨如何观察和利用不同时段的光线来创作精彩作品...', '风景摄影爱好者', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91', 4, '["风光摄影","光线","技巧"]', '2023-10-22', 156, 42, 980, 0, 0);

-- ============================================================
-- 11. 通知数据 (7条: 4来自ProfileSettings + 3来自Community)
-- ============================================================
INSERT INTO `notification` (`notify_id`, `type`, `content`, `related_id`, `created_at`, `is_read`) VALUES
('1', 'like', '用户 @摄影爱好者 点赞了您的作品《晨曦中的山峦》', NULL, '5分钟前', 0),
('2', 'comment', '用户 @光影达人 评论了您的作品《城市剪影》', NULL, '1小时前', 0),
('3', 'follow', '用户 @新摄影师 关注了您', NULL, '3小时前', 1),
('4', 'system', '您的作品《星空下的古堡》被推荐到首页', NULL, '1天前', 1),
('c1', 'like', '极简摄影师林风 点赞了你的作品', 'post123', '2023-10-25 10:23', 0),
('c2', 'comment', '城市摄影师陈默 评论了你的话题', 'topic456', '2023-10-25 09:15', 0),
('c3', 'system', '系统维护通知：平台将于今晚23:00-次日凌晨2:00进行维护', '', '2023-10-24 18:30', 1);

-- ============================================================
-- 12. 小组数据 (11条: 5条原有 + 6条来自Community)
-- ============================================================
INSERT INTO `group_info` (`group_id`, `name`, `description`, `avatar`, `cover_image`, `member_count`, `post_count`, `status`, `created_at`, `owner_name`, `owner_avatar`) VALUES
('1', '风光摄影爱好者', '专注于分享和交流风光摄影技巧、作品和器材使用经验。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9', 256, 158, 'active', '2023-01-15', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c'),
('2', '人像摄影交流群', '探讨人像摄影技巧，分享创作经验和心得。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20setup%20group&sign=c1df4cb85b4f6fab9f97f0f60c9056d7', 320, 215, 'active', '2023-02-10', '人像摄影师小雨', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20smiling&sign=620b116509f1022014ac6d9864231ba5'),
('3', '街头摄影联盟', '记录城市瞬间，分享街头摄影的魅力和技巧。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo%20urban&sign=ed44bded77c174a37b374cc92d3661f4', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20scene%20group&sign=6f3c69be5e9d78d6308b08cfb3df1421', 180, 176, 'active', '2023-03-05', '城市摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1'),
('4', '黑白摄影艺术', '专注于黑白摄影的创作与欣赏，分享技巧和作品。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photography%20club%20logo&sign=20391fbad91d80cc2bfc64b085492e16', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20art%20monochrome%20group&sign=d0d50bf259aa980b08ef620b4df5094a', 145, 98, 'pending', '2023-03-20', '黑白摄影师阿明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20vintage%20style&sign=59a54bc0fa95cdb00b476bf1065e679c'),
('5', '商业摄影圈', '商业摄影从业者交流平台，分享经验和资源。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photography%20club%20logo&sign=3093fd57b573feda727d456e62bd8b08', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20photography%20studio%20product%20group&sign=c48254752661c0437c0cb036bfe03807', 98, 64, 'active', '2023-04-01', '商业摄影师老张', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photographer%20male%20professional&sign=3a1c5b7e8f9d2a4b6c8e0f1a3b5d7f9c'),
('g1', '风光摄影爱好者', '专注于分享和交流风光摄影技巧、作品和器材使用经验。无论你是专业摄影师还是业余爱好者，都能在这里找到志同道合的朋友。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9', 3, 345, 'active', '2023-01-15', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c'),
('g2', '人像摄影技巧交流', '探讨人像摄影的光线运用、构图技巧、引导模特等专业内容。分享最新人像作品，互相学习进步。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20group%20creative&sign=ad812d2b6b21ee3f52025b0964288c97', 2, 267, 'active', '2023-03-20', '城市摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1'),
('g3', '城市街头摄影', '记录城市生活的瞬间，捕捉街头的故事和人文情怀。分享街头摄影的技巧和设备推荐。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo&sign=d6bc81adc6768a530f17c2ee445c92ce', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20city%20street%20group&sign=e076386c6e6cb8682835ab9a15e145e7', 2, 189, 'active', '2023-02-10', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c'),
('g4', '器材玩家俱乐部', '摄影器材的深度评测、使用心得和购买建议。从相机、镜头到各种配件，我们聊的都是硬货。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20club%20logo&sign=11b90cf1c2e6893f916de925d4e82f15', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20equipment%20camera%20lenses%20group&sign=de7808fe088e719e100bdd4ab79d5448', 3, 412, 'active', '2023-04-05', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c'),
('g5', '后期修图大师班', '分享PS、Lightroom等后期修图技巧，从基础调整到高级合成，提升你的作品质感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editing%20club%20logo&sign=0561d34d4200e2caa00089faf67fcaef', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photo%20editing%20workspace%20post%20processing%20group&sign=bf46adb74ee31c030f652bf8ac9e19e7', 2, 234, 'active', '2023-05-15', '城市摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1'),
('g6', '手机摄影达人', '用手机也能拍出大片！分享手机摄影技巧、配件使用和后期修图APP推荐。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mobile%20photography%20club%20logo&sign=07f813a1329616c29de7a5dccf800f5f', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=mobile%20photography%20smartphone%20camera%20group&sign=7ad2126eb7f0147b6c8fbb8e6ba94dca', 2, 176, 'active', '2023-06-10', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c');

-- ============================================================
-- 13. 订单数据 (8条: 5来自Admin + 3来自ProfileSettings)
-- ============================================================
INSERT INTO `order_info` (`order_id`, `user_name`, `user_avatar`, `items`, `total_amount`, `status`, `payment_method`, `created_at`, `paid_at`) VALUES
('O-20231025-001', '张三', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763', '[{"name":"银河会员·年卡","price":299,"quantity":1}]', 299.00, 'paid', 'alipay', '2023-10-25T10:30:00', '2023-10-25T10:32:15'),
('O-20231024-002', '李四', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female&sign=f09d83378aa1e845abd3d8360ae43318', '[{"name":"器材租赁套餐A","price":199,"quantity":2}]', 398.00, 'paid', 'wechat', '2023-10-24T14:20:00', '2023-10-24T14:23:45'),
('O-20231023-003', '王五', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20creative&sign=05eaa6a6889c9fd565f612592ebff64a', '[{"name":"线上课程《风光摄影大师班》","price":399,"quantity":1}]', 399.00, 'pending', 'alipay', '2023-10-23T09:15:00', NULL),
('O-20231022-004', '赵六', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20professional&sign=de0253bc58d40781a8618749ea5612ee', '[{"name":"RAW素材包","price":59,"quantity":1},{"name":"后期预设包","price":39,"quantity":1}]', 98.00, 'paid', 'creditcard', '2023-10-22T16:45:00', '2023-10-22T16:47:30'),
('O-20231021-005', '孙七', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20nature%20lover&sign=5bde84c0a947f0a379af97355ca16564', '[{"name":"银河会员·月卡","price":39,"quantity":1}]', 39.00, 'cancelled', 'wechat', '2023-10-21T11:30:00', NULL),
('ORD20231025001', '光影捕手', NULL, '[{"type":"会员订阅","details":"银河会员年卡"}]', 199.00, '已完成', NULL, '2023-10-25', NULL),
('ORD20231020002', '光影捕手', NULL, '[{"type":"课程购买","details":"风光摄影进阶课程"}]', 299.00, '已完成', NULL, '2023-10-20', NULL),
('ORD20231015003', '光影捕手', NULL, '[{"type":"器材租赁","details":"索尼 A7R IV (3天)"}]', 150.00, '进行中', NULL, '2023-10-15', NULL);

-- ============================================================
-- 14. 内容管理数据 (6条: 4照片 + 2帖子)
-- ============================================================
INSERT INTO `content` (`content_id`, `title`, `type`, `thumbnail`, `author_name`, `author_avatar`, `status`, `created_at`, `views`, `likes`, `comments`) VALUES
('1', '晨曦中的山峦', 'photo', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9', '光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 'active', '2023-10-25', 1256, 324, 45),
('2', '城市剪影', 'photo', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186', '城市摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1', 'active', '2023-10-22', 987, 289, 37),
('3', '海浪与礁石', 'photo', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958', '风景摄影爱好者', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91', 'pending', '2023-10-18', 1452, 412, 53),
('4', '森林晨雾', 'photo', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68', '自然摄影师小林', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nature%20photographer%20female%20smiling&sign=0fc618c5f06a07329a62e32cf23c8ca2', 'active', '2023-10-15', 1328, 387, 49),
('5', '【分享】我的春季风光摄影心得', 'post', '', '光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 'active', '2023-10-10', 876, 145, 23),
('6', '请教：关于长曝光拍摄水流的问题', 'post', '', '风景摄影爱好者', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91', 'active', '2023-10-05', 542, 89, 34);

-- ============================================================
-- 15. 摄影作品数据 (12条: 6来自Home + 6来自Profile)
-- ============================================================
INSERT INTO `photo_post` (`photo_id`, `title`, `description`, `image`, `author_name`, `author_avatar`, `likes`, `comments`, `collections`, `tags`, `date`, `views`, `format`, `visibility`, `copyright_type`) VALUES
('h1', '黑白光影', 'Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52', '极简摄影师林风', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c', 342, 42, 28, '["极简主义","黑白","建筑","徕卡"]', '2023-10-25', 0, NULL, '公开', NULL),
('h2', '胶片质感人像', 'Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20photography%20portrait%20natural%20light%20soft%20colors&sign=c33fc387d9611cfbf5948eab73b3426b', '胶片摄影师安娜', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2', 412, 56, 35, '["人像","胶片","复古","自然光"]', '2023-10-24', 0, NULL, '公开', NULL),
('h3', '暗调氛围', 'Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=moody%20portrait%20low%20key%20dramatic%20lighting&sign=667d5b0612922acbe1a4e0355faeb800', '情绪摄影师李明', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47', 389, 49, 31, '["暗调","氛围","情绪","人像"]', '2023-10-23', 0, NULL, '公开', NULL),
('h4', '极简静物', 'Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=minimalist%20still%20life%20composition%20natural%20light&sign=d50543b56e3575f63623ea5055f2f854', '静物摄影师王静', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=still%20life%20photographer%20female%20detail-oriented&sign=3bfd67c585c96ccf90c0560aadfc6c75', 276, 32, 22, '["静物","极简","中画幅","富士"]', '2023-10-22', 0, NULL, '公开', NULL),
('h5', '城市几何', 'iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20geometry%20city%20architecture%20minimalist%20composition&sign=b5c56f91ceaddbb80362822c8664e0ae', '手机摄影师张强', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mobile%20photographer%20male%20urban%20explorer&sign=1eff3d26acd6475fd9c84ba0ee8e5d74', 321, 41, 25, '["城市","几何","手机摄影","极简"]', '2023-10-21', 0, NULL, '公开', NULL),
('h6', '黑白纪实', 'Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20street%20photography%20documentary%20moment&sign=d29476f80a3d538bddc7d6b20fcd017d', '纪实摄影师陈默', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street&sign=788a26eea5ce0ca5b0473146963afcf0', 398, 52, 33, '["黑白","纪实","人文","街头"]', '2023-10-20', 0, NULL, '公开', NULL),
('p1', '晨曦中的山峦', '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 324, 45, 0, '["风光","日出","云海","自然"]', '2023-10-25', 1256, 'RAW', '公开', '独家授权'),
('p2', '城市剪影', '从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 289, 37, 0, '["城市","建筑","剪影","夕阳"]', '2023-10-22', 987, 'JPG', '公开', '非独家'),
('p3', '海浪与礁石', '长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 412, 53, 0, '["海景","慢门","自然","礁石"]', '2023-10-18', 1452, 'RAW', '仅好友可见', '独家授权'),
('p4', '森林晨雾', '在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 387, 49, 0, '["森林","晨雾","自然","光线"]', '2023-10-15', 1328, 'RAW', '公开', '非独家'),
('p5', '湖畔日落', '平静的湖面倒映着绚丽的晚霞，形成对称的美感。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf074634422a50690ffb6c', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 456, 61, 0, '["湖泊","日落","倒影","晚霞"]', '2023-10-12', 1689, 'RAW', '公开', '独家授权'),
('p6', '星空下的古堡', '在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。', 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2', '@光影捕手', 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', 523, 78, 0, '["星空","夜景","古堡","银河"]', '2023-10-08', 1976, 'RAW', '私密', '独家授权');

