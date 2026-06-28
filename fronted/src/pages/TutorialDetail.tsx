import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
  import { toast } from 'sonner';
  import { CommentSection } from '../components/CommentSection';

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

// 模拟文字教程数据
const mockTextTutorials: Tutorial[] = [
  {
    id: 't1',
    title: '入门指南：摄影基础知识详解',
    description: '本教程适合摄影初学者，详细讲解摄影的基本概念、曝光三要素、构图技巧等基础知识。',
    author: {
      id: 't1',
      name: '摄影导师A',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20instructor%20avatar%20male&sign=b23459644f685f38e900003dfc85a443',
    },
    category: '基础知识',
    level: '入门',
    duration: '30分钟',
    views: 12543,
    likes: 2543,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20basics%20tutorial%20camera%20settings&sign=5240d0109bb84f17e932bc9a6c120149',
    tags: ['曝光', '构图', '光圈', '快门', 'ISO'],
    content: [
      '# 摄影基础知识详解',
      '',
      '## 第一章：摄影入门概念',
      '摄影是一门用光和构图讲述故事的艺术。在开始学习摄影技巧之前，我们需要了解一些基础概念。',
      '',
      '### 什么是摄影？',
      '摄影是通过相机捕捉光线，记录瞬间的过程。一张好的照片不仅需要技术，还需要艺术感和情感表达。',
      '',
      '### 相机的基本结构',
      '1. 镜头：负责聚焦光线',
      '2. 传感器：将光信号转换为电信号',
      '3. 快门：控制曝光时间',
      '4. 光圈：控制进光量和景深',
      '5. 取景器：用于构图和对焦',
      '',
      '## 第二章：曝光三要素',
      '曝光是摄影的核心概念，它由三个要素决定：光圈、快门速度和ISO。这三个要素相互影响，共同决定了一张照片的亮度和清晰度。',
      '',
      '### 光圈（Aperture）',
      '光圈是镜头中控制进光量的装置，通常用f值表示，如f/2.8、f/5.6等。',
      '- 光圈越大（f值越小）：进光量越多，景深越浅',
      '- 光圈越小（f值越大）：进光量越少，景深越深',
      '',
      '### 快门速度（Shutter Speed）',
      '快门速度决定了相机传感器暴露在光线下的时间，通常以秒为单位，如1/1000、1/250、1等。',
      '- 高速快门：冻结运动，适合拍摄快速移动的物体',
      '- 低速快门：模糊运动，适合拍摄流水、星空等',
      '',
      '### ISO',
      'ISO表示传感器对光线的敏感度，数值越高，敏感度越强，但同时也会引入更多噪点。',
      '- 低ISO（100-400）：画质清晰，适合光线充足的场景',
      '- 高ISO（800以上）：适合弱光环境，但噪点增加',
      '',
      '## 第三章：构图基础',
      '好的构图可以引导观众的视线，突出主体，增强照片的视觉冲击力。以下是几种常见的构图方法：',
      '',
      '### 三分法构图',
      '将画面分为九个相等的部分，主体放置在交叉点上，可以使画面更加平衡和有趣。',
      '',
      '### 对角线构图',
      '利用线条形成对角线，可以增加画面的动感和深度。',
      '',
      '### 框架构图',
      '使用前景中的物体作为框架，可以突出主体，增加画面的深度感。',
      '',
      '### 黄金螺旋构图',
      '根据斐波那契数列形成的螺旋线进行构图，可以创造出自然和谐的画面。',
      '',
      '## 第四章：光线运用',
      '光线是摄影的灵魂，不同的光线条件会产生不同的效果。',
      '',
      '### 顺光、侧光和逆光',
      '- 顺光：光线从相机后方照射，适合清晰展现细节',
      '- 侧光：光线从侧面照射，适合表现立体感和纹理',
      '- 逆光：光线从主体后方照射，适合创造剪影和光晕效果',
      '',
      '### 不同时间段的光线',
      '- 清晨和黄昏：光线柔和，色彩温暖，是拍摄的黄金时段',
      '- 中午：光线强烈，对比度高，适合特定场景',
      '- 夜间：需要特殊的曝光技巧，适合创造独特氛围',
      '',
      '## 第五章：实际拍摄建议',
      '掌握了理论知识后，还需要通过大量实践来提高摄影技巧。',
      '',
      '### 练习方法',
      '1. 每天拍摄：培养观察能力和构图意识',
      '2. 主题拍摄：针对特定主题进行专题拍摄',
      '3. 学习模仿：分析优秀作品，学习其构图和用光',
      '4. 后期处理：适当的后期处理可以提升照片质量',
      '',
      '### 常见场景拍摄技巧',
      '- 人像摄影：使用大光圈虚化背景，突出人物',
      '- 风光摄影：使用小光圈保证景深，选择合适的光线',
      '- 夜景摄影：使用三脚架，长时间曝光',
      '- 运动摄影：使用高速快门，跟踪对焦',
      '',
      '## 结语',
      '摄影是一门需要不断学习和实践的艺术。希望本教程能够帮助你打下坚实的基础，在摄影的道路上不断进步。记住，最重要的是用镜头表达你的视角和情感。'
    ]
  },
  {
    id: 't2',
    title: '人像摄影：如何捕捉自然表情',
    description: '学习如何与模特沟通，引导自然表情，以及如何利用光线和环境拍出令人惊艳的人像作品。',
    author: {
      id: 't2',
      name: '人像大师B',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20avatar%20female&sign=f6c999d3d63c14af71aea3f5040e4c1e',
    },
    category: '人像摄影',
    level: '中级',
    duration: '45分钟',
    views: 8765,
    likes: 1892,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20photography%20tutorial%20model%20posing&sign=ed3198e582d93aa9bb684cfebc5a109e',
    tags: ['人像', '表情', '引导', '光线', '构图'],
    content: [
      '# 人像摄影：如何捕捉自然表情',
      '',
      '## 第一章：与模特建立连接',
      '拍摄自然表情的第一步是与模特建立良好的沟通和信任关系。',
      '',
      '### 沟通技巧',
      '1. 提前了解模特的性格和喜好',
      '2. 拍摄前进行轻松的交流，缓解紧张情绪',
      '3. 使用鼓励性的语言，增强模特的自信',
      '4. 保持幽默感，创造轻松愉快的拍摄氛围',
      '',
      '### 观察与互动',
      '1. 注意模特的习惯动作和表情',
      '2. 发现模特最自然、最美丽的角度',
      '3. 尊重模特的意见和感受',
      '4. 让拍摄过程充满乐趣',
      '',
      '## 第二章：表情引导技巧',
      '有效的引导可以帮助模特放松，展现最自然的表情。',
      '',
      '### 语言引导',
      '- 使用具体、生动的描述，而不是笼统的指令',
      '- 引导模特回忆特定的情感和经历',
      '- 提出开放性的问题，引发真实的情感反应',
      '- 避免使用负面词汇，用积极的语言鼓励模特',
      '',
      '### 动作引导',
      '- 设计自然的动作序列，让模特连贯地完成',
      '- 从简单的动作开始，逐渐增加复杂度',
      '- 关注细节，调整姿态使画面更加和谐',
      '- 捕捉动态过程中的瞬间表情',
      '',
      '### 情绪引导',
      '- 播放适合的音乐，营造氛围',
      '- 讲述故事或笑话，引发真实的情感反应',
      '- 利用道具和环境，帮助模特进入角色',
      '- 给予模特足够的时间，让情绪自然流露',
      '',
      '## 第三章：光线与表情',
      '光线对表情的表现有着至关重要的影响。',
      '',
      '### 光线方向',
      '- 顺光：清晰展现面部细节和表情，但可能缺乏立体感',
      '- 侧光：强调面部轮廓和表情的微妙变化',
      '- 逆光：创造戏剧性效果，适合表现情绪',
      '- 柔光：柔和自然，适合表现细腻的情感',
      '',
      '### 光线强度',
      '- 强光：创造鲜明对比，突出表情的张力',
      '- 弱光：营造柔和氛围，适合表现温柔的情感',
      '- 变化的光线：捕捉表情的动态变化',
      '',
      '## 第四章：构图与表情',
      '好的构图可以更好地突出表情，增强画面的感染力。',
      '',
      '### 取景范围',
      '- 特写：突出面部表情的细节',
      '- 半身：结合肢体语言，丰富表情的表达',
      '- 全身：展现整体姿态和环境的关系',
      '',
      '### 角度选择',
      '- 仰拍：表现自信、强势的表情',
      '- 俯拍：表现温柔、脆弱的情感',
      '- 平视：创造平等、亲切的交流感',
      '',
      '### 背景处理',
      '- 简洁的背景：突出主体表情',
      '- 有故事的背景：丰富画面信息，增强情感表达',
      '- 虚化背景：使用大光圈，突出主体',
      '',
      '## 第五章：常见问题与解决方案',
      '在拍摄过程中，我们经常会遇到一些问题，以下是一些常见问题的解决方法。',
      '',
      '### 模特紧张',
      '- 先进行一些轻松的拍摄，让模特逐渐适应',
      '- 避免长时间拍摄同一姿势',
      '- 给予更多的肯定和鼓励',
      '- 适当休息，保持拍摄的新鲜感',
      '',
      '### 表情不自然',
      '- 避免过度指导，让模特有自由发挥的空间',
      '- 捕捉瞬间的、未经修饰的表情',
      '- 关注模特的眼睛，眼神是表情的灵魂',
      '- 尝试连拍模式，捕捉自然流露的表情',
      '',
      '### 光线不理想',
      '- 调整拍摄时间，选择黄金时段',
      '- 使用反光板或柔光罩改善光线质量',
      '- 寻找阴影区域，利用柔和的散射光',
      '- 在必要时使用人工光源进行补光',
      '',
      '## 第六章：案例分析',
      '通过分析一些成功的人像作品，我们可以学习如何有效地捕捉和表现自然表情。',
      '',
      '### 案例一：自然微笑',
      '这张照片成功捕捉了模特自然、真诚的微笑。关键在于摄影师与模特建立了良好的关系，让模特在轻松的氛围中展现真实的情感。',
      '',
      '### 案例二：思考的表情',
      '通过引导模特回忆特定的经历，摄影师成功捕捉了模特专注思考的表情。侧光的使用增强了面部的立体感，突出了表情的微妙变化。',
      '',
      '### 案例三：动态表情',
      '在动态拍摄中捕捉表情需要更高的技巧。摄影师使用连拍模式，捕捉了模特跳跃时的惊喜表情，展现了青春活力。',
      '',
      '## 结语',
      '捕捉自然表情是人像摄影的核心挑战之一。通过良好的沟通、有效的引导、对光线和构图的掌控，以及不断的实践，你一定能够拍出令人惊艳的人像作品。记住，最真实、最自然的表情往往也是最动人的。'
    ]
  },
  {
    id: 't3',
    title: '后期修图：Lightroom基础工作流',
    description: '从导入到导出，完整讲解Lightroom的基础工作流程，包括组织照片、调整曝光、色彩校正等技巧。',
    author: {
      id: 't3',
      name: '后期专家C',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20avatar%20male&sign=7486bb00777acac959518af903d752a8',
    },
    category: '后期处理',
    level: '入门',
    duration: '60分钟',
    views: 15678,
    likes: 3245,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20editing%20tutorial%20lightroom%20workflow&sign=b916c7f932a3d1b98ebd046cd208086f',
    tags: ['Lightroom', '后期', '工作流', '修图', '调色'],
    content: [
      '# Lightroom基础工作流',
      '',
      '## 第一章：导入与组织照片',
      'Lightroom的工作流程从导入照片开始，良好的组织习惯可以提高后期处理的效率。',
      '',
      '### 导入照片',
      '1. 连接相机或存储卡，启动Lightroom',
      '2. 在Library模块中，点击"导入"按钮',
      '3. 在左侧面板选择照片来源',
      '4. 在右侧面板设置导入选项：',
      '   - 添加关键字，方便日后搜索',
      '   - 应用预设（如有需要）',
      '   - 选择导入位置和文件命名方式',
      '5. 点击"导入"按钮开始导入',
      '',
      '### 组织照片',
      '1. 使用文件夹和集合管理照片',
      '2. 创建智能集合，自动整理照片',
      '3. 使用星级和旗标标记照片',
      '4. 添加关键字和元数据，提高搜索效率',
      '5. 使用过滤器快速查找特定照片',
      '',
      '## 第二章：基础调整',
      '在Develop模块中，我们可以对照片进行各种调整，改善照片的曝光、色彩和细节。',
      '',
      '### 曝光调整',
      '1. 首先调整曝光滑块，使照片亮度合适',
      '2. 调整对比度，增强画面层次',
      '3. 使用高光和阴影滑块恢复细节',
      '4. 调整白色和黑色，设置画面的明暗边界',
      '5. 使用曲线工具进行更精细的亮度调整',
      '',
      '### 色彩调整',
      '1. 调整色温，校正或创造性地改变照片色调',
      '2. 调整色调，控制照片的冷暖',
      '3. 使用饱和度和自然饱和度增强色彩',
      '4. 利用HSL/颜色面板精确调整特定颜色',
      '5. 使用分离色调为高光和阴影添加色彩',
      '',
      '### 清晰度和细节',
      '1. 调整清晰度，增强画面细节和立体感',
      '2. 使用去朦胧工具，改善雾蒙蒙的照片',
      '3. 调整锐化，增强照片细节',
      '4. 使用减少杂色工具，去除照片噪点',
      '5. 调整细节面板中的各项参数，优化照片质量',
      '',
      '## 第三章：高级调整',
      '掌握了基础调整后，我们可以使用一些高级工具进一步优化照片。',
      '',
      '### 局部调整',
      '1. 使用调整画笔，对特定区域进行精确调整',
      '2. 使用渐变滤镜，对画面的一部分应用渐变效果',
      '3. 使用径向滤镜，对画面的圆形区域进行调整',
      '4. 利用范围遮罩功能，基于颜色或亮度选择调整区域',
      '',
      '### 镜头校正',
      '1. 启用配置文件校正，自动校正镜头畸变、暗角和色差',
      '2. 手动调整畸变、透视和边界',
      '3. 使用暗角和色差滑块进行精细调整',
      '',
      '### 预设和同步',
      '1. 创建和应用预设，快速应用常用调整',
      '2. 使用同步功能，将调整应用到多张照片',
      '3. 创建和管理预设集合，提高工作效率',
      '',
      '## 第四章：批量处理',
      'Lightroom的一个强大功能是可以批量处理多张照片，节省大量时间。',
      '',
      '### 同步调整',
      '1. 调整好一张照片后，选择需要应用相同调整的其他照片',
      '2. 点击"同步"按钮，选择要同步的调整项',
      '3. 点击"同步"，应用调整到所有选定照片',
      '',
      '### 批量导入预设',
      '1. 在导入面板中，选择"在导入时应用"预设',
      '2. 选择一个预设，所有导入的照片都会应用这个预设',
      '',
      '### 批量导出',
      '1. 选择需要导出的照片',
      '2. 点击"文件">"导出"或快捷键Ctrl+Shift+E',
      '3. 设置导出选项：',
      '   - 导出位置',
      '   - 文件命名',
      '   - 文件格式和质量',
      '   - 大小调整',
      '   - 元数据和水印',
      '4. 点击"导出"按钮开始批量导出',
      '',
      '## 第五章：细节优化',
      '细节决定成败，在完成基本调整后，我们可以对照片进行一些细节优化。',
      '',
      '### 污点去除',
      '1. 使用污点去除工具，去除照片中的杂质、尘埃和不需要的物体',
      '2. 选择克隆或修复模式',
      '3. 调整工具大小，精确去除污点',
      '',
      '### 红眼校正',
      '1. 使用红眼校正工具，点击照片中的红眼区域',
      '2. 调整瞳孔大小和变暗量，使眼睛看起来自然',
      '',
      '### 裁剪和构图',
      '1. 使用裁剪工具，调整照片构图',
      '2. 选择不同的裁剪比例或自由裁剪',
      '3. 使用拉直工具，校正照片水平线',
      '4. 使用变换工具，校正透视变形',
      '',
      '## 第六章：导出与分享',
      '完成后期处理后，我们需要将照片导出为合适的格式，以便分享或打印。',
      '',
      '### 导出设置',
      '1. 根据用途选择合适的文件格式：',
      '   - JPEG：适合网络分享和一般用途',
      '   - TIFF：适合高质量打印和进一步编辑',
      '   - PSD：需要在Photoshop中进一步编辑',
      '   - DNG：保留原始数据的开源格式',
      '2. 调整图像大小和分辨率',
      '3. 设置输出锐化，根据输出介质选择合适的锐化程度',
      '4. 选择元数据选项，控制导出照片中包含的信息',
      '5. 添加水印，保护版权',
      '',
      '### 直接分享',
      'Lightroom提供了直接分享到社交媒体的功能：',
      '1. 选择需要分享的照片',
      '2. 点击"照片">"通过Email发送"或"发布到Web"',
      '3. 选择分享平台，设置分享选项',
      '4. 点击"发送"或"发布"',
      '',
      '## 结语',
      '掌握Lightroom的工作流程可以极大地提高你的后期处理效率和质量。通过导入组织、基础调整、高级调整、批量处理、细节优化和导出分享这一系列步骤，你可以将原始照片转化为令人惊艳的作品。记住，后期处理是为了增强照片的表现力，而不是掩盖其本质。'
    ]
  }
];

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundTutorial = mockTextTutorials.find(t => t.id === id);
      setTutorial(foundTutorial || null);
      if (foundTutorial) {
        setLikesCount(foundTutorial.likes);
        // 模拟用户是否已点赞
        const hasLiked = localStorage.getItem(`liked_tutorial_${id}`) === 'true';
        setIsLiked(hasLiked);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
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
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-exclamation-circle text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">未找到该教程</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">抱歉，您访问的教程不存在或已被删除</p>
          <Link 
            to="/online-courses" 
            className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/online-courses"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回课程列表</span>
          </Link>
        </div>
        
        {/* 教程封面 */}
        <div className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] mb-8">
          <div className="relative">
            <img
              src={tutorial.image}
              alt={tutorial.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E2532] to-transparent p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full border border-[#4A5F8B]">
                  {tutorial.category}
                </span>
                <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full border border-[#4A5F8B]">
                  {tutorial.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">{tutorial.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-[#B8C6D8]">
                <div className="flex items-center">
                  <i className="fa-solid fa-clock mr-1"></i>
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-eye mr-1"></i>
                  <span>{tutorial.views.toLocaleString()} 阅读</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>
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
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">教程简介</h2>
              <p className="text-[#B8C6D8] leading-relaxed">
                {tutorial.description}
              </p>
            </div>
            
            {/* 教程内容 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-6">教程内容</h2>
              
              {/* Markdown 内容渲染 */}
              <div className="prose prose-invert max-w-none">
                {tutorial.content.map((paragraph, index) => {
                  // 处理标题
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-2xl font-bold text-[#F5F7FA] mb-4">
                        {paragraph.substring(2)}
                      </h1>
                    );
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-[#F5F7FA] mt-6 mb-3">
                        {paragraph.substring(3)}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-bold text-[#F5F7FA] mt-4 mb-2">
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
                        <li className="text-[#B8C6D8]">{paragraph.substring(2)}</li>
                      </ul>
                    );
                  } 
                  // 处理数字列表项
                  else if (/^\d+\.\s/.test(paragraph)) {
                    return (
                      <ol key={index} className="list-decimal pl-5 mb-3 space-y-1">
                        <li className="text-[#B8C6D8]">{paragraph.replace(/^\d+\.\s/, '')}</li>
                      </ol>
                    );
                  } 
                  // 处理普通段落
                  else {
                    return (
                      <p key={index} className="text-[#B8C6D8] mb-3 leading-relaxed">
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
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">作者信息</h2>
              <div className="flex items-center mb-4">
                <img
                  src={tutorial.author.avatar}
                  alt={tutorial.author.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]"
                />
                <div>
                  <h3 className="font-bold text-[#F5F7FA]">{tutorial.author.name}</h3>
                  <p className="text-sm text-[#B8C6D8]">摄影导师 / 专业摄影师</p>
                </div>
              </div>
              <button className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                关注作者
              </button>
            </div>
            
            {/* 操作按钮 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">操作</h2>
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  className={`w-full py-3 flex items-center justify-center rounded-lg font-medium transition-colors ${
                    isLiked
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]'
                      : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                  }`}
                >
                  <i className={`fa-solid ${isLiked ? 'fa-heart' : 'fa-heart'} mr-2`}></i>
                  {isLiked ? '已喜欢' : '喜欢'}
                </button>
                <button className="w-full py-3 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
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
                   className="w-full py-3 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] relative z-10"
                 >
                   <i className="fa-solid fa-share-alt mr-2"></i>
                   分享教程
                 </button>
                <button className="w-full py-3 flex items-center justify-center bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                  <i className="fa-solid fa-download mr-2"></i>
                  下载资料
                </button>
              </div>
            </div>
            
            {/* 标签 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">相关标签</h2>
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-sm border border-[#4A5F8B] hover:bg-[#6B7C93] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 推荐教程 */}
            <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">推荐教程</h2>
              <div className="space-y-4">
                {mockTextTutorials
                  .filter(t => t.id !== tutorial.id)
                  .slice(0, 2)
                  .map((recTutorial) => (
                    <Link
                      key={recTutorial.id}
                      to={`/tutorial/${recTutorial.id}`}
                      className="flex space-x-3 group"
                    >
                      <img
                        src={recTutorial.image}
                        alt={recTutorial.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors">
                          {recTutorial.title}
                        </h3>
                        <p className="text-xs text-[#B8C6D8] mt-1">
                          {recTutorial.duration} · {recTutorial.views.toLocaleString()} 阅读
                        </p>
                      </div>
                    </Link>
                  ))}
             </div>
             
             {/* 评论区 */}
             <div className="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
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