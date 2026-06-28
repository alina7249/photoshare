import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";

interface Comment {
    id: string;
    userId: string;
    username: string;
// 摄影作品类型定义
    content: string;
    date: string;
    likes: number;
    isLiked: boolean;
    isUnread: boolean;
    isAuthor?: boolean;
    images?: string[];
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string | undefined;
    darkMode?: boolean;
    authorId?: string;
}

interface User {
    id: string;
    username: string;
// 摄影作品类型定义
}

const EMOJI_LIST = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏"
];

const REPORT_REASONS = ["垃圾广告", "不友善行为", "色情内容", "政治敏感", "盗用他人作品", "其他原因"];

const mockUsers: User[] = [{
    id: "1",
    username: "极简摄影师林风",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c"
}, {
    id: "2",
    username: "极简摄影师林静",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20female%20glasses&sign=bcb6273a0e310c266e722c0131d6e146"
}, {
    id: "3",
    username: "建筑摄影师王强",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20smiling&sign=3c23397344efe1e22c27fde5dd0bd934"
}, {
    id: "4",
    username: "摄影学习者小张",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20student%20male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8"
}, {
    id: "5",
    username: "艺术摄影师陈默",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20male%20creative&sign=bceaa07bd21b90efedda5c86e7059959"
}];

export const CommentSection: React.FC<CommentSectionProps> = (
    {
        postId = "default-post",
        darkMode = true,
        authorId = "1"
    }
) => {
    const {
        isAuthenticated,
        user
    } = useAuth();

    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyingToUser, setReplyingToUser] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterType, setFilterType] = useState<"all" | "my" | "author">("all");
    const [sortType, setSortType] = useState<"latest" | "popular">("latest");
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
    const [reportingComment, setReportingComment] = useState<Comment | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [reportNote, setReportNote] = useState("");
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const commentSectionRef = useRef<HTMLDivElement>(null);
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [showReplyMentionDropdown, setShowReplyMentionDropdown] = useState(false);
    const [replyMentionQuery, setReplyMentionQuery] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const replyInputRef = useRef<HTMLInputElement>(null);

    const [comments, setComments] = useState<Comment[]>(() => {
        const savedComments = localStorage.getItem(`comments_${postId}`);

        if (savedComments) {
            try {
                return JSON.parse(savedComments);
            } catch (e) {
                console.error("Failed to parse comments from localStorage", e);
            }
        }

        return [{
            id: "1",
            userId: "2",
            username: "极简摄影师林静",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20female%20glasses&sign=bcb6273a0e310c266e722c0131d6e146",
            content: "这张作品的几何构图非常出色，线条的运用和光影对比恰到好处。特别喜欢你对空间的处理，留白部分增强了整体的极简美感。请问是使用什么方式调整黑白对比的？",
            date: "2023-10-25 10:23",
            likes: 125,
            isLiked: false,
            isUnread: false,

            replies: [{
                id: "1-1",
                userId: "1",
                username: "极简摄影师林风",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
                content: "谢谢喜欢！我使用了Lightroom的色调曲线工具进行精细调整，重点强化了明暗交界线的对比，同时保留了阴影和高光的细节，避免过度调整导致的细节丢失。",
                date: "2023-10-25 11:45",
                likes: 89,
                isLiked: false,
                isUnread: false,
                isAuthor: true
            }]
        }, {
            id: "2",
            userId: "3",
            username: "建筑摄影师王强",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20smiling&sign=3c23397344efe1e22c27fde5dd0bd934",
            content: "作为一名建筑摄影师，我非常欣赏这种捕捉几何美感的视角。这让我想起了埃姆斯住宅的一些经典摄影作品。请问拍摄时是否有特别等待光线的角度？",
            date: "2023-10-25 09:15",
            likes: 87,
            isLiked: false,
            isUnread: false,

            replies: [{
                id: "2-1",
                userId: "1",
                username: "极简摄影师林风",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
                content: "是的，我等待了大约30分钟，直到阳光到达这个特定角度，形成了我想要的光影效果。建筑摄影中，光线的方向和质量对最终效果的影响非常大，值得花时间等待最佳时机。",
                date: "2023-10-25 09:30",
                likes: 56,
                isLiked: false,
                isUnread: false,
                isAuthor: true
            }]
        }, {
            id: "3",
            userId: "4",
            username: "摄影学习者小张",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20student%20male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8",
            content: "我正在学习极简摄影，想请教一下如何在城市环境中发现这种简洁的构图？有什么寻找拍摄对象的技巧吗？",
            date: "2023-10-25 08:30",
            likes: 56,
            isLiked: false,
            isUnread: false,

            replies: [{
                id: "3-1",
                userId: "1",
                username: "极简摄影师林风",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
                content: "我的建议是：1. 放慢脚步，用\"框架思维\"观察周围环境；2. 寻找重复的图案和线条；3. 尝试从不同角度观察同一物体；4. 使用三分法或对称构图；5. 关注负空间的重要性；6. 练习用单色模式（黑白）观察场景，有助于聚焦于形状和线条。最重要的是多拍多练，培养自己的极简视觉。",
                date: "2023-10-25 09:00",
                likes: 120,
                isLiked: false,
                isUnread: false,
                isAuthor: true
            }, {
                id: "3-2",
                userId: "5",
                username: "艺术摄影师陈默",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20male%20creative&sign=bceaa07bd21b90efedda5c86e7059959",
                content: "补充一点，我建议随身携带一个小取景器或者用双手框成矩形来辅助构图，这有助于训练你的眼睛直接识别场景中的几何元素和简洁构图。另外，可以尝试使用定焦镜头，限制自己的视角，从而更专注于构图本身。",
                date: "2023-10-25 09:30",
                likes: 67,
                isLiked: false,
                isUnread: false
            }]
        }, {
            id: "4",
            userId: "6",
            username: "风光摄影爱好者",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91",
            content: "太美了！构图和光影都处理得非常到位，很有层次感。",
            date: "2023-10-24 18:30",
            likes: 45,
            isLiked: false,
            isUnread: false
        }, {
            id: "5",
            userId: "7",
            username: "黑白摄影迷",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photography%20enthusiast%20female&sign=4fa04d0aaebb4ea5a6a229b04f9aa724",
            content: "作为黑白摄影爱好者，我非常欣赏这种风格。对比度把握得恰到好处，细节保留得也很好。",
            date: "2023-10-24 16:45",
            likes: 32,
            isLiked: false,
            isUnread: false
        }, {
            id: "6",
            userId: "8",
            username: "新手摄影师",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=beginner%20photographer%20male%20smiling&sign=e1c13e886354d52a32477c541ea6bfd7",
            content: "请问这张照片用的是什么相机和镜头拍摄的？",
            date: "2023-10-24 14:20",
            likes: 18,
            isLiked: false,
            isUnread: false,

            replies: [{
                id: "6-1",
                userId: "1",
                username: "极简摄影师林风",
                avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c",
                content: "用的是索尼A7R IV和24-70mm F2.8 GM镜头。",
                date: "2023-10-24 15:00",
                likes: 12,
                isLiked: false,
                isUnread: false,
                isAuthor: true
            }]
        }, {
            id: "7",
            userId: "9",
            username: "城市摄影师",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20female%20city%20explorer&sign=75862c84fa36ba4e41a4de50cd81b0a7",
            content: "城市中的极简之美，捕捉得非常棒！我也经常在城市中寻找这样的构图机会。",
            date: "2023-10-23 19:10",
            likes: 29,
            isLiked: false,
            isUnread: true
        }, {
            id: "8",
            userId: "10",
            username: "构图研究僧",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=composition%20enthusiast%20male%20glasses&sign=6a17e125a003f2b747f8ad976f0caf6e",
            content: "从构图学的角度来看，这张照片的三分法运用得非常到位，视觉引导线也很清晰。给个赞！",
            date: "2023-10-23 17:30",
            likes: 36,
            isLiked: false,
            isUnread: true
        }];
    });

    useEffect(() => {
        const commentDraft = localStorage.getItem(`commentDraft_${postId}`);

        if (commentDraft) {
            setCommentText(commentDraft);
        }

        const savedTheme = localStorage.getItem("theme") as "light" | "dark";

        if (savedTheme) {
            setTheme(savedTheme);
        } else if (darkMode) {
            setTheme("dark");
        }
    }, [postId, darkMode]);

    useEffect(() => {
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    }, [comments, postId]);

    useEffect(() => {
        const draftTimer = setTimeout(() => {
            if (commentText.trim()) {
                localStorage.setItem(`commentDraft_${postId}`, commentText);
            } else {
                localStorage.removeItem(`commentDraft_${postId}`);
            }
        }, 500);

        return () => clearTimeout(draftTimer);
    }, [commentText, postId]);

    useEffect(() => {
        if (replyingTo && replyText.trim()) {
            localStorage.setItem(`replyDraft_${postId}_${replyingTo}`, replyText);
        } else if (replyingTo) {
            localStorage.removeItem(`replyDraft_${postId}_${replyingTo}`);
        }
    }, [replyText, postId, replyingTo]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCommentText(value);
        const lastAtIndex = value.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            const afterAtIndex = value.substring(lastAtIndex + 1);

            if (afterAtIndex.indexOf(" ") === -1) {
                setMentionQuery(afterAtIndex);
                setShowMentionDropdown(true);
            } else {
                setShowMentionDropdown(false);
            }
        } else {
            setShowMentionDropdown(false);
        }
    };

    const handleReplyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setReplyText(value);
        const lastAtIndex = value.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            const afterAtIndex = value.substring(lastAtIndex + 1);

            if (afterAtIndex.indexOf(" ") === -1) {
                setReplyMentionQuery(afterAtIndex);
                setShowReplyMentionDropdown(true);
            } else {
                setShowReplyMentionDropdown(false);
            }
        } else {
            setShowReplyMentionDropdown(false);
        }
    };

    const handleMentionSelect = useCallback((selectedUser: User) => {
        const lastAtIndex = commentText.lastIndexOf("@");
        const newValue = commentText.substring(0, lastAtIndex) + `@${selectedUser.username} `;
        setCommentText(newValue);
        setShowMentionDropdown(false);
        setMentionQuery("");

        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [commentText]);

    const handleReplyMentionSelect = useCallback((selectedUser: User) => {
        const lastAtIndex = replyText.lastIndexOf("@");
        const newValue = replyText.substring(0, lastAtIndex) + `@${selectedUser.username} `;
        setReplyText(newValue);
        setShowReplyMentionDropdown(false);
        setReplyMentionQuery("");

        if (replyInputRef.current) {
            replyInputRef.current.focus();
        }
    }, [replyText]);

    const formatCommentText = (text: string) => {
        const mentionRegex = /@(\S+)/g;
        const mentionFormatted = text.replace(mentionRegex, "<span class=\"text-[#4A5F8B] font-medium\">$&</span>");
        const tagRegex = /#(\S+)/g;
        const tagFormatted = mentionFormatted.replace(tagRegex, "<span class=\"text-[#4A5F8B] font-medium\">$&</span>");
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const boldFormatted = tagFormatted.replace(boldRegex, "<strong>$1</strong>");
        const italicRegex = /\*([^*]+)\*/g;
        const italicFormatted = boldFormatted.replace(italicRegex, "<em>$1</em>");
        const lineBreakFormatted = italicFormatted.replace(/\n/g, "<br>");
        return lineBreakFormatted;
    };

    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0)
            return;

        const files = e.target.files;
        const newPreviews: string[] = [];

        if (files.length > 9) {
            toast.warning("最多上传9张图片");
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.size > 5 * 1024 * 1024) {
                toast.warning("图片大小不能超过5MB");
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

    const removeImagePreview = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const sendNotification = (userId: string, type: string, content: string) => {
        if (userId !== user?.id) {
            toast.info(`已通知用户新的评论互动`);
        }
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.info("请先登录后再评论");
            return;
        }

        if (!commentText.trim() && imagePreviews.length === 0) {
            toast.warning("评论内容不能为空");
            return;
        }

        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            userId: user?.id || "",
            username: user?.username || "",
            avatar: user?.avatar || "",
            content: commentText.trim(),
            date: new Date().toLocaleString("zh-CN"),
            likes: 0,
            isLiked: false,
            isUnread: true,
            images: imagePreviews.length > 0 ? imagePreviews : undefined
        };

        setComments([newComment, ...comments]);
        setCommentText("");
        setImagePreviews([]);
        setSelectedImages(null);
        localStorage.removeItem(`commentDraft_${postId}`);
        toast.success("评论发表成功");
        const mentionedUsers = extractMentionedUsers(commentText);

        mentionedUsers.forEach(userId => {
            sendNotification(userId, "comment_mention", `${user?.username} 在评论中@了你`);
        });

        if (authorId !== user?.id) {
            sendNotification(authorId, "comment", `${user?.username} 评论了你的内容`);
        }
    };

    const handleSubmitReply = (commentId: string) => {
        if (!isAuthenticated) {
            toast.info("请先登录后再回复");
            return;
        }

        if (!replyText.trim()) {
            toast.warning("回复内容不能为空");
            return;
        }

        const newReply: Comment = {
            id: `reply-${Date.now()}`,
            userId: user?.id || "",
            username: user?.username || "",
            avatar: user?.avatar || "",
            content: replyText.trim(),
            date: new Date().toLocaleString("zh-CN"),
            likes: 0,
            isLiked: false,
            isUnread: true
        };

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
        setReplyText("");
        setReplyingTo(null);
        setReplyingToUser(null);
        localStorage.removeItem(`replyDraft_${postId}_${commentId}`);
        toast.success("回复发表成功");
        const mentionedUsers = extractMentionedUsers(replyText);

        mentionedUsers.forEach(userId => {
            sendNotification(userId, "reply_mention", `${user?.username} 在回复中@了你`);
        });

        const parentComment = comments.find(c => c.id === commentId);

        if (parentComment && parentComment.userId !== user?.id) {
            sendNotification(parentComment.userId, "reply", `${user?.username} 回复了你的评论`);
        }

        updatedComments.forEach(comment => {
            if (comment.replies) {
                comment.replies.forEach(reply => {
                    if (reply.id === newReply.id && reply.isAuthor && reply.userId !== user?.id) {
                        sendNotification(reply.userId, "author_reply", `${user?.username} 回复了你的评论`);
                    }
                });
            }
        });
    };

    const extractMentionedUsers = (content: string): string[] => {
        const mentionRegex = /@(\S+)/g;
        const mentions = [];
        let match;

        while ((match = mentionRegex.exec(content)) !== null) {
            const username = match[1];
            const user = mockUsers.find(u => u.username === username);

            if (user) {
                mentions.push(user.id);
            }
        }

        return [...new Set(mentions)];
    };

    const handleLike = (commentId: string, isReply: boolean = false, replyId?: string) => {
        if (!isAuthenticated) {
            toast.info("请先登录后再点赞");
            return;
        }

        const updatedComments = comments.map(comment => {
            if (comment.id === commentId && !isReply) {
                if (!comment.isLiked) {
                    sendNotification(comment.userId, "like", `${user?.username} 赞了你的评论`);
                    toast.success("点赞成功");
                } else {
                    toast.success("取消点赞");
                }

                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                };
            }

            if (isReply && comment.replies) {
                const updatedReplies = comment.replies.map(reply => {
                    if (reply.id === replyId) {
                        if (!reply.isLiked) {
                            sendNotification(reply.userId, "like", `${user?.username} 赞了你的回复`);
                            toast.success("点赞成功");
                        } else {
                            toast.success("取消点赞");
                        }

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

    const handleEditComment = () => {
        if (!editingComment)
            return;

        const updatedComments = comments.map(comment => {
            if (comment.id === editingComment.id) {
                return {
                    ...comment,
                    content: editingComment.content,
                    date: new Date().toLocaleString("zh-CN")
                };
            }

            if (comment.replies) {
                const updatedReplies = comment.replies.map(reply => {
                    if (reply.id === editingComment.id) {
                        return {
                            ...reply,
                            content: editingComment.content,
                            date: new Date().toLocaleString("zh-CN")
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
        setShowEditModal(false);
        setEditingComment(null);
        toast.success("评论已更新");
    };

    const handleDeleteComment = () => {
        if (!deletingComment)
            return;

        const updatedComments = comments.filter(comment => {
            if (comment.id === deletingComment.id) {
                return false;
            }

            if (comment.replies) {
                comment.replies = comment.replies.filter(reply => reply.id !== deletingComment.id);
            }

            return true;
        });

        setComments(updatedComments);
        setShowDeleteModal(false);
        setDeletingComment(null);
        toast.success("评论已删除");
    };

    const handleReportComment = () => {
        if (!reportingComment || !reportReason) {
            toast.warning("请选择举报原因");
            return;
        }

        setShowReportModal(false);
        setReportingComment(null);
        setReportReason("");
        setReportNote("");
        toast.success("举报已提交，我们会尽快处理");
    };

    const openEditModal = (comment: Comment) => {
        setEditingComment({
            ...comment
        });

        setShowEditModal(true);
    };

    const openDeleteModal = (comment: Comment) => {
        setDeletingComment(comment);
        setShowDeleteModal(true);
    };

    const openReportModal = (comment: Comment) => {
        setReportingComment(comment);
        setShowReportModal(true);
    };

    const openImagePreview = (image: string) => {
        setCurrentImage(image);
        setShowImagePreview(true);
    };

    const replyToComment = (comment: Comment) => {
        setReplyingTo(comment.id);
        setReplyingToUser(comment.username);
        const replyDraft = localStorage.getItem(`replyDraft_${postId}_${comment.id}`);

        if (replyDraft) {
            setReplyText(replyDraft);
        } else {
            setReplyText(`@${comment.username} `);
        }

        setTimeout(() => {
            const replyInput = document.getElementById(`reply-input-${comment.id}`);

            if (replyInput) {
                replyInput.focus();
            }
        }, 100);
    };

    const markAllAsRead = () => {
        const updatedComments = comments.map(comment => {
            const updatedComment = {
                ...comment,
                isUnread: false
            };

            if (comment.replies) {
                updatedComment.replies = comment.replies.map(reply => ({
                    ...reply,
                    isUnread: false
                }));
            }

            return updatedComment;
        });

        setComments(updatedComments);
        toast.success("已将所有评论标记为已读");
    };

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
            return dateString.split(" ")[0];
        }
    };

    const isAuthor = (comment: Comment) => {
        return comment.userId === authorId || comment.isAuthor;
    };

    const filteredComments = comments.filter(comment => {
        if (filterType === "my" && isAuthenticated) {
            return comment.userId === user?.id;
        } else if (filterType === "author") {
            return isAuthor(comment);
        }

        return true;
    });

    const sortedComments = [...filteredComments].sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
            return b.likes - a.likes;
        }
    });

    const totalPages = Math.ceil(sortedComments.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedComments = sortedComments.slice(startIndex, endIndex);

    const getPageRange = () => {
        const range = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);

        if (end - start < 4 && start > 1) {
            start = Math.max(1, end - 4);
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages)
            return;

        setCurrentPage(page);

        if (commentSectionRef.current) {
            commentSectionRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    const unreadCount = comments.reduce((count, comment) => {
        let unread = comment.isUnread ? 1 : 0;

        if (comment.replies) {
            unread += comment.replies.filter(reply => reply.isUnread).length;
        }

        return count + unread;
    }, 0);

    const getColorClasses = () => {
        return {
            container: "bg-[#2D3748] border-[#4A5F8B]",
            formBg: "bg-[#1E2532]",
            text: "text-[#B8C6D8]",
            primaryText: "text-[#F5F7FA]",
            secondaryText: "text-[#6B7C93]",
            button: "bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]",
            buttonHover: "hover:bg-[#6B7C93]",
            linkHover: "hover:text-[#4A5F8B]",
            inputBg: "bg-[#1E2532] border-[#4A5F8B] text-[#F5F7FA]",
            placeholder: "placeholder:text-[#6B7C93]",
            likeButton: "text-[#6B7C93] hover:text-[#F5F7FA]",
            liked: "text-[#4A5F8B]",
            notificationBg: "bg-[#1E2532] border-[#4A5F8B]",
            loginPromptBg: "bg-[#1E2532] border-[#4A5F8B]",
            loginPromptText: "text-[#B8C6D8]",
            loginButton: "bg-[#4A5F8B] text-[#F5F7FA]",
            loginButtonHover: "hover:bg-[#6B7C93]",
            registerButton: "text-[#4A5F8B] border-[#4A5F8B] hover:bg-[#4A5F8B]/20"
        };
    };

    const colors = getColorClasses();

    const filteredUsers = mockUsers.filter(
        user => user.username.toLowerCase().includes(mentionQuery.toLowerCase()) && user.id !== user?.id
    );

    const filteredReplyUsers = mockUsers.filter(
        user => user.username.toLowerCase().includes(replyMentionQuery.toLowerCase()) && user.id !== user?.id
    );

    return (
        <div ref={commentSectionRef} className={`${colors.container} rounded-lg p-6`}>
            {}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-[#4A5F8B]">评论 ({comments.length})</h3>
                    {unreadCount > 0 && <button
                        onClick={markAllAsRead}
                        className="text-sm px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full hover:bg-[#4A5F8B]/30 transition-colors">未读({unreadCount})
                                                                                    </button>}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-[#4A5F8B] mr-2">排序:</span>
                        <select
                            value={sortType}
                            onChange={e => {
                                setSortType(e.target.value as "latest" | "popular");
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 text-sm rounded border ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]`}>
                            <option value="latest">最新</option>
                            <option value="popular">最热</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-[#4A5F8B] mr-2">筛选:</span>
                        <select
                            value={filterType}
                            onChange={e => {
                                setFilterType(e.target.value as "all" | "my" | "author");
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 text-sm rounded border ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]`}>
                            <option value="all">全部</option>
                            <option value="my">我的评论</option>
                            <option value="author">作者回复</option>
                        </select>
                    </div>
                    {}
                </div>
            </div>
            {}
            {isAuthenticated ? <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-shrink-0">
                        <img
                            src={user?.avatar}
                            alt={user?.username}
                            className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <></>
                        <textarea
                            ref={textareaRef}
                            value={commentText}
                            onChange={handleCommentInputChange}
                            placeholder="分享您的艺术感悟或技术分析..."
                            className={`w-full px-4 py-3 rounded-lg ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-32 ${colors.placeholder}`}></textarea>
                        {}
                        {imagePreviews.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                            {imagePreviews.map((preview, index) => <div
                                key={index}
                                className="relative w-20 h-20 rounded-md overflow-hidden border border-[#4A5F8B]">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImagePreview(index)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>)}
                        </div>}
                        <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-2 rounded-lg ${colors.button} ${colors.buttonHover}`}
                                    title="添加表情">
                                    <i className="fa-solid fa-face-smile"></i>
                                </button>
                                <label
                                    className={`p-2 rounded-lg ${colors.button} ${colors.buttonHover} cursor-pointer`}
                                    title="上传图片">
                                    <i className="fa-solid fa-image"></i>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImagePreview}
                                        className="hidden" />
                                </label>
                                {}
                                <div className="flex space-x-1">
                                    <></>
                                    <></>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                type="submit"
                                className={`px-6 py-2 border-2 ${colors.button} ${colors.buttonHover} rounded-lg font-medium transition-colors shadow-[0_2px_8px_rgba(74,95,139,0.2)]`}>发表评论
                                                                                          </motion.button>
                        </div>
                    </div>
                </div>
                {}
                <AnimatePresence>
                    {showEmojiPicker && <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            y: 10
                        }}
                        className={`mt-2 p-3 rounded-lg ${colors.formBg} border border-[#4A5F8B] w-fit`}>
                        <div className="grid grid-cols-8 gap-1">
                            {EMOJI_LIST.map((emoji, index) => <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    setCommentText(prev => prev + emoji);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#4A5F8B]/20 transition-colors"
                                title={emoji}>
                                {emoji}
                            </button>)}
                        </div>
                    </motion.div>}
                </AnimatePresence>
                {}
                <AnimatePresence>
                    {showMentionDropdown && filteredUsers.length > 0 && <motion.div
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            y: 10
                        }}
                        className={`mt-2 p-2 rounded-lg ${colors.formBg} border border-[#4A5F8B] w-full max-w-xs absolute z-10`}>
                        {filteredUsers.map(user => <div
                            key={user.id}
                            className="flex items-center p-2 hover:bg-[#4A5F8B]/20 rounded cursor-pointer"
                            onClick={() => handleMentionSelect(user)}>
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-8 h-8 rounded-full mr-2" />
                            <span>{user.username}</span>
                        </div>)}
                    </motion.div>}
                </AnimatePresence>
            </form> : <div className={`mb-8 p-4 ${colors.loginPromptBg} rounded-lg text-center`}>
                <p className={`${colors.loginPromptText} mb-3`}>登录后可以参与艺术摄影交流
                                                                  </p>
                <div className="flex justify-center space-x-3">
                    <Link
                        to="/login"
                        className={`px-4 py-2 text-sm font-medium ${colors.loginButton} ${colors.loginButtonHover} rounded-lg transition-colors`}>登录
                                                                      </Link>
                    <Link
                        to="/register"
                        className={`px-4 py-2 text-sm font-medium ${colors.registerButton} rounded-lg transition-colors`}>注册
                                                                      </Link>
                </div>
            </div>}
            {}
            <div className="space-y-6">
                {paginatedComments.length > 0 ? paginatedComments.map((comment, idx) => <motion.div
                    key={comment.id}
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.3,
                        delay: idx * 0.05
                    }}
                    whileHover={{
                        rotateY: 1.5,
                        scale: 1.02,
                        boxShadow: theme === "dark" ? "0 8px 24px rgba(74,95,139,0.3)" : "0 8px 24px rgba(0,0,0,0.1)"
                    }}
                    style={{
                        transformStyle: "preserve-3d",
                        backgroundColor: "transparent",
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 30px 0px"
                    }}
                    className={`bg-[#232D3F] border-[#4A5F8B] rounded-lg p-4 relative`}>
                    {comment.isUnread && <span className="absolute top-4 right-4 w-2 h-2 bg-[#4A5F8B] rounded-full"></span>}
                    <div className="flex space-x-3">
                        <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
                            <img
                                src={comment.avatar}
                                alt={comment.username}
                                className={`w-10 h-10 rounded-full object-cover ${isAuthor(comment) ? "border-2 border-[#4A5F8B]" : ""}`} />
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className="flex items-center">
                                    <Link
                                        to={`/profile/${comment.userId}`}
                                        className={`font-medium ${colors.primaryText} ${colors.linkHover} transition-colors`}>
                                        {comment.username}
                                    </Link>
                                    {isAuthor(comment) && <span
                                        className="px-1.5 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded ml-1">作者</span>}
                                </div>
                                <span className={`text-xs ${colors.secondaryText}`}>
                                    {formatRelativeTime(comment.date)}
                                </span>
                            </div>
                            {}
                            <p
                                className={`${colors.text} mb-3`}
                                dangerouslySetInnerHTML={{
                                    __html: formatCommentText(comment.content)
                                }}></p>
                            {}
                            {comment.images && comment.images.length > 0 && <div className="grid grid-cols-3 gap-2 mb-3">
                                {comment.images.map((image, index) => <div
                                    key={index}
                                    className="aspect-square rounded-md overflow-hidden border border-[#4A5F8B] cursor-pointer"
                                    onClick={() => openImagePreview(image)}>
                                    <img
                                        src={image}
                                        alt={`Comment image ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                </div>)}
                            </div>}<div className="flex items-center space-x-4">
                                <motion.button
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                    whileTap={{
                                        scale: 0.9
                                    }}
                                    onClick={() => handleLike(comment.id)}
                                    className={`flex items-center space-x-1 text-sm transition-colors ${comment.isLiked ? colors.liked : colors.likeButton}`}>
                                    <motion.i
                                        animate={comment.isLiked ? {
                                            scale: [1, 1.2, 1]
                                        } : {}}
                                        transition={{
                                            duration: 0.3
                                        }}
                                        className={`fa-solid ${comment.isLiked ? "fa-heart" : "fa-heart"}`}></motion.i>
                                    <span>{comment.likes}</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                    whileTap={{
                                        scale: 0.9
                                    }}
                                    onClick={() => replyToComment(comment)}
                                    className={`flex items-center space-x-1 text-sm ${colors.likeButton} transition-colors`}>
                                    <i className="fa-solid fa-reply"></i>
                                    <span>回复 {comment.replies?.length || 0}</span>
                                </motion.button>
                                <div className="flex items-center space-x-2 ml-auto">
                                    {isAuthenticated && <>
                                        {(isAuthor(comment) || user?.id === "admin") && <>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                onClick={() => openEditModal(comment)}
                                                className={`text-sm ${colors.likeButton} transition-colors`}
                                                title="编辑">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                onClick={() => openDeleteModal(comment)}
                                                className={`text-sm ${colors.likeButton} transition-colors`}
                                                title="删除">
                                                <i className="fa-solid fa-trash"></i>
                                            </motion.button>
                                        </>}
                                        {user?.id !== comment.userId && !isAuthor(comment) && <motion.button
                                            whileHover={{
                                                scale: 1.1
                                            }}
                                            whileTap={{
                                                scale: 0.9
                                            }}
                                            onClick={() => openReportModal(comment)}
                                            className={`text-sm ${colors.likeButton} transition-colors`}
                                            title="举报">
                                            <i className="fa-solid fa-flag"></i>
                                        </motion.button>}
                                    </>}
                                </div>
                            </div>
                            {}
                            {replyingTo === comment.id && isAuthenticated && <AnimatePresence>
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        height: 0
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto"
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0
                                    }}
                                    className="mt-3 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={user?.avatar}
                                            alt={user?.username}
                                            className="w-8 h-8 rounded-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col space-y-2">
                                        <div className="relative">
                                            <input
                                                ref={replyInputRef}
                                                id={`reply-input-${comment.id}`}
                                                type="text"
                                                value={replyText}
                                                onChange={handleReplyInputChange}
                                                placeholder={`回复 @${replyingToUser}...`}
                                                className={`flex-1 px-3 py-2 rounded-lg ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] text-sm ${colors.placeholder}`} />
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                type="button"
                                                onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#4A5F8B]"
                                                title="添加表情">
                                                <i className="fa-solid fa-face-smile"></i>
                                            </motion.button>
                                        </div>
                                        {}
                                        <AnimatePresence>
                                            {showReplyEmojiPicker && <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 10
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 10
                                                }}
                                                className={`p-2 rounded-lg ${colors.formBg} border border-[#4A5F8B] w-full max-w-xs self-end`}>
                                                <div className="grid grid-cols-10 gap-1">
                                                    {EMOJI_LIST.slice(0, 30).map((emoji, index) => <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => {
                                                            setReplyText(prev => prev + emoji);
                                                        }}
                                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#4A5F8B]/20 transition-colors text-sm"
                                                        title={emoji}>
                                                        {emoji}
                                                    </button>)}
                                                </div>
                                            </motion.div>}
                                        </AnimatePresence>
                                        {}
                                        <AnimatePresence>
                                            {showReplyMentionDropdown && filteredReplyUsers.length > 0 && <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 10
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 10
                                                }}
                                                className={`p-2 rounded-lg ${colors.formBg} border border-[#4A5F8B] w-full max-w-xs self-end z-10`}>
                                                {filteredReplyUsers.map(user => <div
                                                    key={user.id}
                                                    className="flex items-center p-2 hover:bg-[#4A5F8B]/20 rounded cursor-pointer"
                                                    onClick={() => handleReplyMentionSelect(user)}>
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-8 h-8 rounded-full mr-2" />
                                                    <span>{user.username}</span>
                                                </div>)}
                                            </motion.div>}
                                        </AnimatePresence>
                                        <div className="flex justify-end space-x-2">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyingToUser(null);
                                                    setReplyText("");
                                                    setShowReplyEmojiPicker(false);
                                                }}
                                                className={`px-3 py-1.5 ${colors.button} ${colors.buttonHover} rounded-lg text-sm font-medium transition-colors`}>取消
                                                                                                                                            </motion.button>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}
                                                onClick={() => handleSubmitReply(comment.id)}
                                                className={`px-3 py-1.5 ${colors.loginButton} ${colors.loginButtonHover} rounded-lg text-sm font-medium transition-colors`}>回复
                                                                                                                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>}
                            {}
                            {comment.replies && comment.replies.length > 0 && <div className="mt-4 pl-4 border-l-2 border-[#B8C6D8] space-y-4">
                                {comment.replies.map((reply, replyIdx) => <motion.div
                                    key={reply.id}
                                    initial={{
                                        opacity: 0,
                                        x: 20
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: replyIdx * 0.05
                                    }}
                                    className="flex space-x-3">
                                    <Link to={`/profile/${reply.userId}`} className="flex-shrink-0">
                                        <img
                                            src={reply.avatar}
                                            alt={reply.username}
                                            className={`w-8 h-8 rounded-full object-cover ${reply.isAuthor ? "border-2 border-[#4A5F8B]" : ""}`} />
                                    </Link>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <div className="flex items-center">
                                                <Link
                                                    to={`/profile/${reply.userId}`}
                                                    className={`font-medium ${colors.primaryText} ${colors.linkHover} transition-colors`}>
                                                    {reply.username}
                                                </Link>
                                                {reply.isAuthor && <span
                                                    className="px-1.5 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded ml-1">作者</span>}
                                            </div>
                                            <span className={`text-xs ${colors.secondaryText}`}>
                                                {formatRelativeTime(reply.date)}
                                            </span>
                                        </div>
                                        {}
                                        <p
                                            className={`${colors.text} mb-2 text-sm`}
                                            dangerouslySetInnerHTML={{
                                                __html: formatCommentText(reply.content)
                                            }}></p>
                                        <div className="flex items-center space-x-4">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                onClick={() => handleLike(comment.id, true, reply.id)}
                                                className={`flex items-center space-x-1 text-xs transition-colors ${reply.isLiked ? colors.liked : colors.likeButton}`}>
                                                <motion.i
                                                    animate={reply.isLiked ? {
                                                        scale: [1, 1.2, 1]
                                                    } : {}}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                    className={`fa-solid ${reply.isLiked ? "fa-heart" : "fa-heart"}`}></motion.i>
                                                <span>{reply.likes}</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                whileTap={{
                                                    scale: 0.9
                                                }}
                                                onClick={() => {
                                                    setReplyingTo(comment.id);
                                                    setReplyingToUser(reply.username);
                                                    setReplyText(`@${reply.username} `);

                                                    setTimeout(() => {
                                                        const replyInput = document.getElementById(`reply-input-${comment.id}`);

                                                        if (replyInput) {
                                                            replyInput.focus();
                                                        }
                                                    }, 100);
                                                }}
                                                className={`flex items-center space-x-1 text-xs ${colors.likeButton} transition-colors`}>
                                                <i className="fa-solid fa-reply"></i>
                                                <span>回复</span>
                                            </motion.button>
                                            <div className="flex items-center space-x-2 ml-auto">
                                                {isAuthenticated && <>
                                                    {(isAuthor(reply) || user?.id === "admin") && <>
                                                        <motion.button
                                                            whileHover={{
                                                                scale: 1.1
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9
                                                            }}
                                                            onClick={() => openEditModal(reply)}
                                                            className={`text-xs ${colors.likeButton} transition-colors`}
                                                            title="编辑">
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{
                                                                scale: 1.1
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9
                                                            }}
                                                            onClick={() => openDeleteModal(reply)}
                                                            className={`text-xs ${colors.likeButton} transition-colors`}
                                                            title="删除">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </motion.button>
                                                    </>}
                                                    {user?.id !== reply.userId && !isAuthor(reply) && <motion.button
                                                        whileHover={{
                                                            scale: 1.1
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9
                                                        }}
                                                        onClick={() => openReportModal(reply)}
                                                        className={`text-xs ${colors.likeButton} transition-colors`}
                                                        title="举报">
                                                        <i className="fa-solid fa-flag"></i>
                                                    </motion.button>}
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>)}
                            </div>}
                        </div>
                    </div>
                </motion.div>) : <div className="text-center py-12">
                    <div
                        className="w-16 h-16 bg-[#4A5F8B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-comment-slash text-2xl text-[#4A5F8B]"></i>
                    </div>
                    <h3 className="text-lg font-medium text-[#4A5F8B] mb-2">暂无评论，快来分享见解吧～</h3>
                    <p className="text-sm text-[#6B7C93]">成为第一个评论的人</p>
                </div>}
                {}
                {totalPages > 1 && <div className="flex justify-center mt-8">
                    <div
                        className="inline-flex items-center rounded-md border border-[#4A5F8B] bg-[#1E2532] shadow-sm">
                        <motion.button
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 text-sm font-medium ${currentPage === 1 ? "text-[#6B7C93] cursor-not-allowed" : "text-[#B8C6D8] hover:bg-[#4A5F8B]/20"}`}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </motion.button>
                        {getPageRange().map(page => <motion.button
                            key={page}
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={() => changePage(page)}
                            className={`px-3 py-2 text-sm font-medium ${currentPage === page ? "bg-[#4A5F8B] text-white" : "text-[#B8C6D8] hover:bg-[#4A5F8B]/20"}`}>
                            {page}
                        </motion.button>)}
                        <motion.button
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 text-sm font-medium ${currentPage === totalPages ? "text-[#6B7C93] cursor-not-allowed" : "text-[#B8C6D8] hover:bg-[#4A5F8B]/20"}`}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </motion.button>
                    </div>
                </div>}
            </div>
            {}
            <AnimatePresence>
                {showEditModal && editingComment && <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowEditModal(false)}>
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1.01
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        className={`w-full max-w-lg ${colors.container} rounded-lg p-6`}
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-[#4A5F8B] mb-4">编辑评论</h3>
                        <textarea
                            value={editingComment.content}
                            onChange={e => setEditingComment({
                                ...editingComment,
                                content: e.target.value
                            })}
                            className={`w-full px-4 py-3 rounded-lg ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-32 ${colors.placeholder}`}></textarea>
                        <div className="flex justify-end space-x-3 mt-4">
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() => setShowEditModal(false)}
                                className={`px-4 py-2 ${colors.button} ${colors.buttonHover} rounded-lg font-medium transition-colors`}>取消
                                                                                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={handleEditComment}
                                className={`px-4 py-2 ${colors.loginButton} ${colors.loginButtonHover} rounded-lg font-medium transition-colors`}>保存
                                                                                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {showDeleteModal && deletingComment && <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowDeleteModal(false)}>
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1.01
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        className={`w-full max-w-md ${colors.container} rounded-lg p-6`}
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-[#4A5F8B] mb-4">确认删除</h3>
                        <p className={`${colors.text} mb-6`}>确定要删除这条{deletingComment.id.includes("reply") ? "回复" : "评论"}吗？此操作无法撤销。</p>
                        <div className="flex justify-end space-x-3">
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() => setShowDeleteModal(false)}
                                className={`px-4 py-2 ${colors.button} ${colors.buttonHover} rounded-lg font-medium transition-colors`}>取消
                                                                                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={handleDeleteComment}
                                className={`px-4 py-2 bg-[#F56565] text-white rounded-lg font-medium hover:bg-[#E53E3E] transition-colors`}>删除
                                                                                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {showReportModal && reportingComment && <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowReportModal(false)}>
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1.01
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9
                        }}
                        className={`w-full max-w-md ${colors.container} rounded-lg p-6`}
                        onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-[#4A5F8B] mb-4">举报评论</h3>
                        <p className={`${colors.text} mb-4`}>请选择举报原因：</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {REPORT_REASONS.map((reason, index) => <button
                                key={index}
                                type="button"
                                onClick={() => setReportReason(reason)}
                                className={`px-3 py-2 rounded-lg text-sm ${reportReason === reason ? "bg-[#4A5F8B] text-white" : `${colors.button} ${colors.buttonHover}`} transition-colors`}>
                                {reason}
                            </button>)}
                        </div>
                        <textarea
                            value={reportNote}
                            onChange={e => setReportNote(e.target.value)}
                            placeholder="请输入补充说明（可选）"
                            className={`w-full px-4 py-3 rounded-lg ${colors.inputBg} focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-20 ${colors.placeholder}`}></textarea>
                        <div className="flex justify-end space-x-3 mt-4">
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() => setShowReportModal(false)}
                                className={`px-4 py-2 ${colors.button} ${colors.buttonHover} rounded-lg font-medium transition-colors`}>取消
                                                                                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={handleReportComment}
                                className={`px-4 py-2 ${colors.loginButton} ${colors.loginButtonHover} rounded-lg font-medium transition-colors`}>提交举报
                                                                                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {showImagePreview && currentImage && <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowImagePreview(false)}>
                    <motion.div
                        initial={{
                            scale: 0.9
                        }}
                        animate={{
                            scale: 1
                        }}
                        exit={{
                            scale: 0.9
                        }}
                        className="max-w-4xl max-h-[90vh] relative"
                        onClick={e => e.stopPropagation()}>
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain mx-auto" />
                        <motion.button
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={() => setShowImagePreview(false)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                            <i className="fa-solid fa-times"></i>
                        </motion.button>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
};