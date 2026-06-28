/*
SQLyog Community v13.3.1 (64 bit)
MySQL - 8.0.44 : Database - citywalk
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`photoshare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `photoshare`;

/*Table structure for table `post` */

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '内容',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签列表（json 数组）',
  `thumbNum` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `favourNum` int NOT NULL DEFAULT '0' COMMENT '收藏数',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='帖子';

/*Data for the table `post` */

/*Table structure for table `post_favour` */

DROP TABLE IF EXISTS `post_favour`;

CREATE TABLE `post_favour` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_postId` (`postId`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='帖子收藏';

/*Data for the table `post_favour` */

/*Table structure for table `post_thumb` */

DROP TABLE IF EXISTS `post_thumb`;

CREATE TABLE `post_thumb` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_postId` (`postId`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='帖子点赞';

/*Data for the table `post_thumb` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userAccount` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `userPassword` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `unionId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信开放平台id',
  `mpOpenId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公众号openId',
  `userName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `userProfile` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户简介',
  `userRole` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '用户角色：user/admin/ban',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_unionId` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2015629289921245186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户';

/*Data for the table `user` */

insert  into `user`(`id`,`userAccount`,`userPassword`,`unionId`,`mpOpenId`,`userName`,`userAvatar`,`userProfile`,`userRole`,`createTime`,`updateTime`,`isDelete`) values 
(1935152147047858177,'zhangsan','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'张三',NULL,NULL,'admin','2025-06-18 09:46:39','2025-06-27 14:03:30',0),
(1938481258256347138,'zhangsan1','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'222222222222','',NULL,'user','2025-06-27 14:15:21','2025-06-27 14:16:22',0),
(1938481322349506561,'zhangsan1','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'111','',NULL,'user','2025-06-27 14:15:37','2025-06-27 14:17:12',1),
(1938512849213009922,'lisi','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,NULL,NULL,NULL,'user','2025-06-27 16:20:53','2025-06-27 16:20:53',0),
(1938513000694493186,'wangwu','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,NULL,NULL,NULL,'user','2025-06-27 16:21:29','2025-06-27 16:21:29',0),
(1938516975548272642,'zhangziyi','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'章子怡',NULL,NULL,'user','2025-06-27 16:37:17','2025-06-27 16:37:17',0),
(1939569854321205250,'wangwang','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'王王',NULL,NULL,'user','2025-06-30 14:21:03','2025-06-30 14:21:03',0),
(2015629289921245185,'13070849125','14c8f4f580cb3653f62466011e59feaa',NULL,NULL,'13070849125',NULL,NULL,'user','2026-01-26 11:34:05','2026-01-26 11:34:05',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
