// 设备数据类型定义
export interface Equipment {
  id: string
  name: string
  type: string
  brand: string
  price: string
  image: string
  specs: any
  performance: any
  pros: string[]
  cons: string[]
  suitableFor: string[]
  rating: number
  reviewCount: number
  tags: string[]
  rentalInfo?: {
    rentalChannels: string[]
    rentalPrice: {
      daily: number
      weekly: number
      monthly: number
    }
    availability: boolean
  }
  secondHandLink?: string
  isHot?: boolean // 是否为热门器材（用于3D模型展示）
}

// 生成SVG占位图像
export const generatePlaceholderImage = (name: string) => {
  return `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3e%3crect width='400' height='300' fill='%234a5f8b'%3e%3c%2frect%3e%3ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23ffffff' text-anchor='middle' dy='.3em'%3e${encodeURIComponent(name)}%3c%2ftext%3e%3c%2fsvg%3e`;
};

// 相机数据
export const mockCameras: Equipment[] = [
  {
    id: 'c1',
    name: 'Sony A7R V',
    type: '相机',
    brand: 'Sony',
    price: '25999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7R+V+camera+professional+photography+equipment&sign=d8166fdacaf36f86cc84d0b7f826ac2c',
    specs: {
      sensor: '61.0MP 全画幅 Exmor R CMOS',
      processor: 'BIONZ XR 影像处理器',
      fps: '最高30张/秒 (APS-C裁切)',
      video: '8K 30p / 4K 60p',
      iso: '100-32000 (可扩展至50-102400)',
      weight: '658g'
    },
    performance: {
      resolution: 9.8,
      lowLight: 9.5,
      autofocus: 9.9,
      battery: 8.5,
      speed: 9.2
    },
    pros: ['高像素', '快速对焦', '优秀的视频能力', '轻量化设计'],
    cons: ['昂贵的价格', '电池续航一般', '菜单系统复杂'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.5,
    reviewCount: 89,
    tags: ['全画幅', '高像素', '专业', '视频'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 299,
        weekly: 1499,
        monthly: 3999
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sony+A7R+V+二手'
  },
  {
    id: 'c2',
    name: 'Canon R5',
    type: '相机',
    brand: 'Canon',
    price: '22999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+R5+mirrorless+camera+professional+photography+equipment&sign=5f21f2939354877028bba0a3babc29b6',
    specs: {
      sensor: '45.0MP 全画幅 CMOS',
      processor: 'DIGIC X 影像处理器',
      fps: '最高20张/秒',
      video: '8K 30p / 4K 120p',
      iso: '100-51200 (可扩展至100-102400)',
      weight: '738g'
    },
    performance: {
      resolution: 9.7,
      lowLight: 9.3,
      autofocus: 9.8,
      battery: 8.8,
      speed: 9.4
    },
    pros: ['高像素', '优秀的视频能力', '快速对焦', '良好的人体工程学'],
    cons: ['价格较高', '视频拍摄过热', '菜单系统复杂'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.4,
    reviewCount: 92,
    tags: ['全画幅', '高像素', '专业', '视频'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 279,
        weekly: 1399,
        monthly: 3799
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Canon+R5+二手'
  },
  {
    id: 'c3',
    name: 'Nikon Z 7II',
    type: '相机',
    brand: 'Nikon',
    price: '19999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Z+7II+mirrorless+camera+professional+photography+equipment&sign=aaf9700ac67aecad579170b76b438a0e',
    specs: {
      sensor: '45.7MP 全画幅 CMOS',
      processor: 'EXPEED 6 影像处理器',
      fps: '最高10张/秒',
      video: '4K 60p',
      iso: '64-25600 (可扩展至64-102400)',
      weight: '695g'
    },
    performance: {
      resolution: 9.6,
      lowLight: 9.4,
      autofocus: 9.5,
      battery: 9.0,
      speed: 9.0
    },
    pros: ['高像素', '优秀的画质', '良好的人体工程学', '坚固耐用'],
    cons: ['视频能力一般', '菜单系统复杂', '价格较高'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.3,
    reviewCount: 85,
    tags: ['全画幅', '高像素', '专业', '耐用'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 249,
        weekly: 1299,
        monthly: 3599
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Nikon+Z+7II+二手'
  },
  {
    id: 'c4',
    name: 'Fujifilm X-T5',
    type: '相机',
    brand: 'Fujifilm',
    price: '13999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+X-T5+mirrorless+camera+vintage+design+photography+equipment&sign=bd46cb9bbc77e2131a47cb3cde28e6c8',
    specs: {
      sensor: '40.2MP APS-C X-Trans CMOS 5 HR',
      processor: 'X-Processor 5',
      fps: '最高15张/秒 (机械快门)',
      video: '6.2K 30p / 4K 60p',
      iso: '160-12800 (可扩展至80-51200)',
      weight: '658g'
    },
    performance: {
      resolution: 9.5,
      lowLight: 9.0,
      autofocus: 9.3,
      battery: 8.5,
      speed: 9.1
    },
    pros: ['高像素', '复古外观', '胶片模拟', '轻量化设计'],
    cons: ['APS-C裁切', '电池续航一般', '视频能力一般'],
    suitableFor: ['风光摄影', '人像摄影', '街拍', '文艺摄影'],
    rating: 9.2,
    reviewCount: 78,
    tags: ['APS-C', '高像素', '复古', '胶片模拟'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 199,
        weekly: 999,
        monthly: 2699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Fujifilm+X-T5+二手'
  },
  {
    id: 'c5',
    name: 'Panasonic S5',
    type: '相机',
    brand: 'Panasonic',
    price: '11999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Panasonic+S5+mirrorless+camera+professional+photography+equipment&sign=6ad1814ed77d50da74761ab52bd8c243',
    specs: {
      sensor: '24.2MP 全画幅 CMOS',
      processor: 'Venus Engine',
      fps: '最高7张/秒 (机械快门)',
      video: '6K 30p / 4K 60p',
      iso: '100-25600 (可扩展至100-51200)',
      weight: '714g'
    },
    performance: {
      resolution: 9.0,
      lowLight: 9.2,
      autofocus: 9.1,
      battery: 8.8,
      speed: 8.5
    },
    pros: ['全画幅', '优秀的视频能力', '良好的人体工程学', '性价比高'],
    cons: ['像素较低', '连拍速度慢', '菜单系统复杂'],
    suitableFor: ['风光摄影', '人像摄影', '视频创作', '专业摄影'],
    rating: 9.0,
    reviewCount: 67,
    tags: ['全画幅', '视频', '专业', '性价比'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 179,
        weekly: 899,
        monthly: 2399
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Panasonic+S5+二手'
  },
  {
    id: 'c6',
    name: 'Sony A7 IV',
    type: '相机',
    brand: 'Sony',
    price: '16999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7+IV+camera+professional+photography+equipment&sign=aab0489581c34e43e354eef226da730f',
    specs: {
      sensor: '33.0MP 全画幅 Exmor R CMOS',
      processor: 'BIONZ XR 影像处理器',
      fps: '最高10张/秒 (机械快门)',
      video: '4K 60p',
      iso: '100-32000 (可扩展至50-102400)',
      weight: '658g'
    },
    performance: {
      resolution: 9.3,
      lowLight: 9.5,
      autofocus: 9.7,
      battery: 8.7,
      speed: 9.0
    },
    pros: ['高像素', '快速对焦', '优秀的视频能力', '轻量化设计'],
    cons: ['昂贵的价格', '电池续航一般', '菜单系统复杂'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.4,
    reviewCount: 95,
    tags: ['全画幅', '高像素', '专业', '视频'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 249,
        weekly: 1299,
        monthly: 3599
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sony+A7+IV+二手'
  },
  {
    id: 'c7',
    name: 'Canon EOS R6',
    type: '相机',
    brand: 'Canon',
    price: '12999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EOS+R6+mirrorless+camera+professional+photography+equipment&sign=d10c5d18a25bb4bbf0e7fd9692906986',
    specs: {
      sensor: '20.1MP 全画幅 CMOS',
      processor: 'DIGIC X 影像处理器',
      fps: '最高12张/秒 (机械快门)',
      video: '4K 60p',
      iso: '100-102400 (可扩展至50-204800)',
      weight: '680g'
    },
    performance: {
      resolution: 8.8,
      lowLight: 9.7,
      autofocus: 9.9,
      battery: 9.0,
      speed: 9.3
    },
    pros: ['优秀的低光性能', '快速对焦', '良好的人体工程学', '性价比高'],
    cons: ['像素较低', '视频拍摄过热', '菜单系统复杂'],
    suitableFor: ['人像摄影', '风光摄影', '商业摄影', '专业摄影'],
    rating: 9.2,
    reviewCount: 82,
    tags: ['全画幅', '低光', '专业', '视频'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 199,
        weekly: 999,
        monthly: 2699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Canon+EOS+R6+二手'
  },
  {
    id: 'c8',
    name: 'Nikon Z 6II',
    type: '相机',
    brand: 'Nikon',
    price: '11999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Z+6II+mirrorless+camera+professional+photography+equipment&sign=47fef498606b6d4adbaa4bf09655135d',
    specs: {
      sensor: '24.5MP 全画幅 CMOS',
      processor: 'EXPEED 6 影像处理器',
      fps: '最高14张/秒',
      video: '4K 60p',
      iso: '100-51200 (可扩展至50-204800)',
      weight: '675g'
    },
    performance: {
      resolution: 9.0,
      lowLight: 9.5,
      autofocus: 9.4,
      battery: 8.8,
      speed: 9.2
    },
    pros: ['优秀的低光性能', '快速对焦', '良好的人体工程学', '坚固耐用'],
    cons: ['像素较低', '菜单系统复杂', '价格较高'],
    suitableFor: ['人像摄影', '风光摄影', '商业摄影', '专业摄影'],
    rating: 9.1,
    reviewCount: 76,
    tags: ['全画幅', '低光', '专业', '耐用'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 179,
        weekly: 899,
        monthly: 2399
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Nikon+Z+6II+二手'
  },
  {
    id: 'c9',
    name: 'Sony A7S III',
    type: '相机',
    brand: 'Sony',
    price: '18999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+A7S+III+camera+video+production+photography+equipment&sign=5c85e66afa1cecf3930b000a4655e8f5',
    specs: {
      sensor: '12.1MP 全画幅 CMOS',
      processor: 'BIONZ XR 影像处理器',
      fps: '最高120张/秒',
      video: '4K 120p / 1080p 240p',
      iso: '80-102400 (可扩展至80-409600)',
      weight: '614g'
    },
    performance: {
      resolution: 7.5,
      lowLight: 9.8,
      autofocus: 9.6,
      battery: 9.2,
      speed: 9.4
    },
    pros: ['出色的低光性能', '强大的视频能力', '快速对焦', '良好的电池续航'],
    cons: ['像素较低', '价格较高', '菜单系统复杂'],
    suitableFor: ['视频创作', '低光摄影', '电影制作', '专业摄影'],
    rating: 9.4,
    reviewCount: 92,
    tags: ['全画幅', '视频', '低光', '专业'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', 'Sony官方租赁', '相机租赁APP'],
      rentalPrice: {
        daily: 239,
        weekly: 1199,
        monthly: 3199
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sony+A7S+III+二手'
  }
]

// 镜头数据
export const mockLenses: Equipment[] = [
  {
    id: 'l1',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    type: '镜头',
    brand: 'Sony',
    price: '17999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+24-70mm+f%2F2.8+GM+II+lens+professional+photography+equipment&sign=c2f4d84340f9a0a3ae14cebec2804b14',
    specs: {
      focalLength: '24-70mm',
      aperture: 'f/2.8',
      mount: 'Sony E',
      weight: '779g',
      filterSize: '82mm',
      autofocus: '纳米AR镀膜 II'
    },
    performance: {
      sharpness: 9.8,
      bokeh: 9.5,
      autofocus: 9.9,
      buildQuality: 9.7,
      versatility: 9.4
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '轻量化设计'],
    cons: ['昂贵的价格', '大尺寸滤镜', '变焦环较紧'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.6,
    reviewCount: 76,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 199,
        weekly: 999,
        monthly: 2699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sony+FE+24-70mm+f%2F2.8+GM+II+二手'
  },
  {
    id: 'l2',
    name: 'Canon RF 24-70mm f/2.8L IS USM',
    type: '镜头',
    brand: 'Canon',
    price: '16999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+RF+24-70mm+f%2F2.8L+IS+USM+lens+professional+photography+equipment&sign=721825c7f5d1174ee798de316367dc44',
    specs: {
      focalLength: '24-70mm',
      aperture: 'f/2.8',
      mount: 'Canon RF',
      weight: '800g',
      filterSize: '82mm',
      autofocus: 'USM超声波马达'
    },
    performance: {
      sharpness: 9.7,
      bokeh: 9.3,
      autofocus: 9.8,
      buildQuality: 9.6,
      versatility: 9.5
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '坚固耐用'],
    cons: ['昂贵的价格', '重量较大', '大尺寸滤镜'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.5,
    reviewCount: 69,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 179,
        weekly: 899,
        monthly: 2399
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Canon+RF+24-70mm+f%2F2.8L+IS+USM+二手'
  },
  {
    id: 'l3',
    name: 'Nikon NIKKOR Z 24-70mm f/2.8 S',
    type: '镜头',
    brand: 'Nikon',
    price: '15999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Nikon+Nikkor+Z+24-70mm+f%2F2.8+S+lens+professional+photography+equipment&sign=0c7e230399e6aad8b86937858a1e455b',
    specs: {
      focalLength: '24-70mm',
      aperture: 'f/2.8',
      mount: 'Nikon Z',
      weight: '805g',
      filterSize: '82mm',
      autofocus: 'STM步进马达'
    },
    performance: {
      sharpness: 9.6,
      bokeh: 9.4,
      autofocus: 9.7,
      buildQuality: 9.5,
      versatility: 9.3
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '坚固耐用'],
    cons: ['昂贵的价格', '重量较大', '大尺寸滤镜'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.4,
    reviewCount: 58,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 169,
        weekly: 849,
        monthly: 2299
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Nikon+NIKKOR+Z+24-70mm+f%2F2.8+S+二手'
  },
  {
    id: 'l4',
    name: 'Fujifilm XF 16-80mm f/4 R OIS WR',
    type: '镜头',
    brand: 'Fujifilm',
    price: '6999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Fujifilm+XF+16-80mm+f%2F4+R+OIS+WR+lens+professional+photography+equipment&sign=f6e2301e3920a9787697f764a2b566db',
    specs: {
      focalLength: '16-80mm (等效24-120mm)',
      aperture: 'f/4',
      mount: 'Fujifilm X',
      weight: '507g',
      filterSize: '72mm',
      autofocus: '线性马达'
    },
    performance: {
      sharpness: 9.3,
      bokeh: 8.8,
      autofocus: 9.2,
      buildQuality: 9.4,
      versatility: 9.6
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '轻量化设计'],
    cons: ['光圈较小', '价格较高', '变焦范围有限'],
    suitableFor: ['风光摄影', '人像摄影', '旅行摄影', '文艺摄影'],
    rating: 9.2,
    reviewCount: 83,
    tags: ['APS-C', '变焦', '专业', '防抖'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 99,
        weekly: 499,
        monthly: 1399
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Fujifilm+XF+16-80mm+f%2F4+R+OIS+WR+二手'
  },
  {
    id: 'l5',
    name: 'Canon EF 70-200mm f/2.8L IS III USM',
    type: '镜头',
    brand: 'Canon',
    price: '14999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+lens+professional+photography+equipment&sign=90b3d98d08881f8fead46c8ccac54661',
    specs: {
      focalLength: '70-200mm',
      aperture: 'f/2.8',
      mount: 'Canon EF',
      weight: '1480g',
      filterSize: '77mm',
      autofocus: '环形USM马达'
    },
    performance: {
      sharpness: 9.7,
      bokeh: 9.8,
      autofocus: 9.6,
      buildQuality: 9.9,
      versatility: 9.2
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '坚固耐用'],
    cons: ['重量较大', '价格较高', '携带不便'],
    suitableFor: ['人像摄影', '体育摄影', '野生动物摄影', '专业摄影'],
    rating: 9.5,
    reviewCount: 72,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 199,
        weekly: 999,
        monthly: 2699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+二手'
  },
  {
    id: 'l6',
    name: 'Sigma 24-70mm f/2.8 DG DN | Art for Sony E',
    type: '镜头',
    brand: 'Sigma',
    price: '9999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sigma+24-70mm+f%2F2.8+DG+DN+Art+lens+for+Sony+E+professional+photography+equipment&sign=fcbfe0a39023b7141c4b56b58d348034',
    specs: {
      focalLength: '24-70mm',
      aperture: 'f/2.8',
      mount: 'Sony E',
      weight: '830g',
      filterSize: '82mm',
      autofocus: 'HSM超声波马达'
    },
    performance: {
      sharpness: 9.8,
      bokeh: 9.4,
      autofocus: 9.7,
      buildQuality: 9.5,
      versatility: 9.3
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '性价比高'],
    cons: ['重量较大', '大尺寸滤镜', '变焦环较紧'],
    suitableFor: ['风光摄影', '人像摄影', '商业摄影', '专业摄影'],
    rating: 9.4,
    reviewCount: 65,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 149,
        weekly: 749,
        monthly: 1999
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sigma+24-70mm+f%2F2.8+DG+DN+Art+for+Sony+E+二手'
  },
  {
    id: 'l7',
    name: 'Tamron 28-75mm f/2.8 Di III RXD for Sony E',
    type: '镜头',
    brand: 'Tamron',
    price: '7999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Tamron+28-75mm+f%2F2.8+Di+III+RXD+lens+for+Sony+E+professional+photography+equipment&sign=b4d58d4b22056790c17a512bb2407f57',
    specs: {
      focalLength: '28-75mm',
      aperture: 'f/2.8',
      mount: 'Sony E',
      weight: '550g',
      filterSize: '67mm',
      autofocus: 'RXD静音马达'
    },
    performance: {
      sharpness: 9.5,
      bokeh: 9.2,
      autofocus: 9.4,
      buildQuality: 9.3,
      versatility: 9.5
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '轻量化设计'],
    cons: ['光圈较小', '价格较高', '变焦范围有限'],
    suitableFor: ['风光摄影', '人像摄影', '旅行摄影', '专业摄影'],
    rating: 9.2,
    reviewCount: 78,
    tags: ['全画幅', '变焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 129,
        weekly: 649,
        monthly: 1799
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Tamron+28-75mm+f%2F2.8+Di+III+RXD+for+Sony+E+二手'
  },
  {
    id: 'l8',
    name: 'Canon EF 50mm f/1.2L USM',
    type: '镜头',
    brand: 'Canon',
    price: '10999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+50mm+f%2F1.2L+USM+lens+portrait+photography+equipment&sign=d1ed5e417e0eb482a07b0b8707564f2b',
    specs: {
      focalLength: '50mm (标准定焦)',
      aperture: 'f/1.2',
      mount: 'Canon EF',
      weight: '820g',
      filterSize: '72mm',
      autofocus: '环形USM马达'
    },
    performance: {
      sharpness: 9.7,
      bokeh: 9.9,
      autofocus: 9.4,
      buildQuality: 9.6,
      versatility: 9.1
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '大光圈'],
    cons: ['重量较大', '价格较高', '携带不便'],
    suitableFor: ['人像摄影', '肖像摄影', '艺术摄影', '专业摄影'],
    rating: 9.5,
    reviewCount: 68,
    tags: ['全画幅', '定焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 149,
        weekly: 749,
        monthly: 1999
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Canon+EF+50mm+f%2F1.2L+USM+二手'
  },
  {
    id: 'l9',
    name: 'Sony FE 85mm f/1.4 GM',
    type: '镜头',
    brand: 'Sony',
    price: '11999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+FE+85mm+f%2F1.4+GM+lens+portrait+photography+equipment&sign=0fd793c3c320c5412df583f1ea12b818',
    specs: {
      focalLength: '85mm (人像定焦)',
      aperture: 'f/1.4',
      mount: 'Sony E',
      weight: '820g',
      filterSize: '77mm',
      autofocus: '纳米AR镀膜'
    },
    performance: {
      sharpness: 9.8,
      bokeh: 9.9,
      autofocus: 9.7,
      buildQuality: 9.6,
      versatility: 9.2
    },
    pros: ['高画质', '快速对焦', '优秀的防抖效果', '大光圈'],
    cons: ['重量较大', '价格较高', '携带不便'],
    suitableFor: ['人像摄影', '肖像摄影', '艺术摄影', '专业摄影'],
    rating: 9.6,
    reviewCount: 79,
    tags: ['全画幅', '定焦', '专业', '大光圈'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 169,
        weekly: 849,
        monthly: 2299
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sony+FE+85mm+f%2F1.4+GM+二手'
  }
]

// 配件数据
export const mockAccessories: Equipment[] = [
  {
    id: 'a1',
    name: 'Gitzo GT3543LS Systematic碳纤维三脚架',
    type: '三脚架',
    brand: 'Gitzo',
    price: '8999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Gitzo+GT3543LS+Systematic+carbon+fiber+tripod+photography+equipment&sign=8536298fc147e22eaf4d9ee88d2399c8',
    specs: {
      material: '碳纤维',
      maximumHeight: '170cm',
      minimumHeight: '11cm',
      weight: '1.95kg',
      loadCapacity: '30kg',
      sections: '4节'
    },
    performance: {
      stability: 9.8,
      buildQuality: 9.9,
      portability: 8.5,
      versatility: 9.0,
      valueForMoney: 8.0
    },
    pros: ['超高稳定性', '轻巧便携', '坚固耐用', '精准的调节'],
    cons: ['价格昂贵', '调节稍复杂', '收纳长度较长'],
    suitableFor: ['风景摄影', '长时间曝光', '微距摄影', '视频拍摄'],
    rating: 9.5,
    reviewCount: 43,
    tags: ['专业', '碳纤维', '稳定', '高端'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 99,
        weekly: 499,
        monthly: 1299
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Gitzo+GT3543LS+Systematic+二手'
  },
  {
    id: 'a2',
    name: 'Manfrotto 190XPRO4 铝合金三脚架',
    type: '三脚架',
    brand: 'Manfrotto',
    price: '2999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Manfrotto+190XPRO4+aluminum+tripod+photography+equipment&sign=dbaeaad86de60e11cf207410c7d0e0cf',
    specs: {
      material: '铝合金',
      maximumHeight: '165cm',
      minimumHeight: '14cm',
      weight: '2.3kg',
      loadCapacity: '8kg',
      sections: '4节'
    },
    performance: {
      stability: 9.3,
      buildQuality: 9.5,
      portability: 8.8,
      versatility: 9.2,
      valueForMoney: 9.0
    },
    pros: ['稳定可靠', '易于调节', '坚固耐用', '性价比高'],
    cons: ['相对较重', '收纳长度较长', '操作稍复杂'],
    suitableFor: ['人像摄影', '风光摄影', '视频拍摄', '商业摄影'],
    rating: 9.2,
    reviewCount: 67,
    tags: ['专业', '铝合金', '稳定', '性价比'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 59,
        weekly: 299,
        monthly: 899
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Manfrotto+190XPRO4+二手'
  },
  {
    id: 'a3',
    name: 'DJI Ronin-SC 稳定器',
    type: '稳定器',
    brand: 'DJI',
    price: '4999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=DJI+Ronin-SC+camera+stabilizer+photography+equipment&sign=f404c382f6b1f4f91a6716b0c5b7e858',
    specs: {
      weight: '1.1kg',
      loadCapacity: '2kg',
      batteryLife: '11小时',
      dimensions: '折叠: 220x160x85mm, 展开: 490x160x85mm'
    },
    performance: {
      stability: 9.7,
      buildQuality: 9.4,
      portability: 9.2,
      versatility: 9.5,
      valueForMoney: 9.1
    },
    pros: ['稳定可靠', '轻便易携', '易于操作', '多种拍摄模式'],
    cons: ['承重有限', '电池续航一般', '价格较高'],
    suitableFor: ['视频创作', 'Vlog拍摄', '旅行摄影', '纪录片拍摄'],
    rating: 9.3,
    reviewCount: 92,
    tags: ['稳定器', '视频', '轻便', '智能'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', 'DJI官方租赁', '本地摄影工作室'],
      rentalPrice: {
        daily: 89,
        weekly: 449,
        monthly: 1199
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=DJI+Ronin-SC+二手'
  },
  {
    id: 'a4',
    name: 'Rode VideoMic Pro+ 麦克风',
    type: '麦克风',
    brand: 'Rode',
    price: '1999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Rode+VideoMic+Pro+microphone+photography+equipment&sign=e224558ef6106fb64a529f471bbb4a72',
    specs: {
      polarPattern: '心形指向',
      frequencyResponse: '20Hz - 20kHz',
      sensitivity: '-32dB re 1V/Pa',
      powerSupply: 'AA电池 (10小时)'
    },
    performance: {
      soundQuality: 9.5,
      buildQuality: 9.3,
      portability: 9.6,
      versatility: 9.1,
      valueForMoney: 9.2
    },
    pros: ['音质出色', '轻便易携', '易于安装', '性价比高'],
    cons: ['电池续航一般', '缺少防风毛', '价格较高'],
    suitableFor: ['视频创作', 'Vlog拍摄', '采访', '纪录片拍摄'],
    rating: 9.1,
    reviewCount: 85,
    tags: ['麦克风', '视频', '音质', '专业'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 49,
        weekly: 249,
        monthly: 699
      },
      availability: true
    },secondHandLink: 'https://www.taobao.com/search?q=Rode+VideoMic+Pro%2B+二手'
  },
  {
    id: 'a5',
    name: 'Sandisk Extreme PRO 1TB CFexpress Type B 存储卡',
    type: '存储卡',
    brand: 'Sandisk',
    price: '1299',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=SanDisk+Extreme+Pro+CFexpress+memory+card+photography+equipment&sign=e4aada61e517a97edb2cbe288eccc913',
    specs: {
      capacity: '1TB',
      readSpeed: '1700MB/s',
      writeSpeed: '1200MB/s',
      compatibility: 'Sony A7R V, Canon R5, Nikon Z 7II'
    },
    performance: {
      speed: 9.8,
      reliability: 9.7,
      versatility: 9.4,
      valueForMoney: 8.8
    },
    pros: ['读写速度快', '容量大', '可靠耐用', '兼容多种相机'],
    cons: ['价格较高', '容易发热', '体积小易丢失'],
    suitableFor: ['高分辨率摄影', '8K视频录制', '高速连拍', '专业摄影'],
    rating: 9.4,
    reviewCount: 112,
    tags: ['存储卡', '高速', '大容量', '专业'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 29,
        weekly: 149,
        monthly: 399
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Sandisk+Extreme+PRO+1TB+CFexpress+二手'
  },
  {
    id: 'a6',
    name: 'Lowepro ProTactic BP 450 AW II 摄影包',
    type: '摄影包',
    brand: 'Lowepro',
    price: '1599',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Lowepro+ProTactic+BP+450+AW+II+camera+bag+photography+equipment&sign=cc0d642b6ac007244be6620895729012',
    specs: {
      material: '防水尼龙',
      dimensions: '32x18x48cm',
      weight: '1.6kg',
      capacity: '可容纳1台全画幅相机+3-4个镜头+闪光灯+配件'
    },
    performance: {
      buildQuality: 9.5,
      portability: 9.1,
      versatility: 9.4,
      comfort: 9.3,
      valueForMoney: 9.0
    },
    pros: ['容量大', '舒适耐用', '防水防尘', '设计合理'],
    cons: ['相对较重', '价格较高', '外观普通'],
    suitableFor: ['旅行摄影', '商业摄影', '户外摄影', '专业摄影'],
    rating: 9.2,
    reviewCount: 78,
    tags: ['摄影包', '专业', '防水', '大容量'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 49,
        weekly: 249,
        monthly: 699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Lowepro+ProTactic+BP+450+AW+II+二手'
  },
  {
    id: 'a7',
    name: 'Godox V1 Flash 闪光灯',
    type: '闪光灯',
    brand: 'Godox',
    price: '1999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Godox+V1+Flash+speedlight+photography+equipment&sign=1a4f490a0a1387b50585e5c05d2b15dd',
    specs: {
      guideNumber: '58 (ISO 100, 105mm)',
      recyclingTime: '0.1-2.1秒',
      batteryLife: '650次闪光',
      compatibility: 'Canon, Sony, Nikon, Fujifilm'
    },
    performance: {
      power: 9.6,
      buildQuality: 9.3,
      versatility: 9.5,
      valueForMoney: 9.4
    },
    pros: ['功率大', '回电速度快', '多品牌兼容', '高性价比'],
    cons: ['重量较大', '电池续航一般', '操作稍复杂'],
    suitableFor: ['人像摄影', '婚礼摄影', '商业摄影', '舞台摄影'],
    rating: 9.4,
    reviewCount: 89,
    tags: ['闪光灯', '专业', '多兼容', '高速'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 79,
        weekly: 399,
        monthly: 999
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Godox+V1+Flash+二手'
  },
  {
    id: 'a8',
    name: 'DJI Mini 3 Pro 无人机',
    type: '无人机',
    brand: 'DJI',
    price: '5999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=DJI+Mini+3+Pro+drone+photography+equipment&sign=7b45cde6820f4a1dc13996b84d4c8b7d',
    specs: {
      weight: '249g',
      batteryLife: '34分钟',
      camera: '1/1.3英寸CMOS, 48MP, 4K 60fps',
      maxRange: '10公里'
    },
    performance: {
      imageQuality: 9.5,
      flightStability: 9.7,
      portability: 9.8,
      versatility: 9.4,
      valueForMoney: 9.2
    },
    pros: ['轻便易携', '4K高清视频', '智能飞行模式', '长续航'],
    cons: ['禁飞区域多', '风阻较大', '价格较高'],
    suitableFor: ['风光摄影', '旅行摄影', '视频创作', '无人机航拍'],
    rating: 9.5,
    reviewCount: 124,
    tags: ['无人机', '航拍', '视频', '智能'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', 'DJI官方租赁', '本地摄影工作室'],
      rentalPrice: {daily: 199,
        weekly: 999,
        monthly: 2699
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=DJI+Mini+3+Pro+二手'
  },
  {
    id: 'a9',
    name: 'Peak Design Everyday Sling 5L V2 摄影包',
    type: '摄影包',
    brand: 'Peak Design',
    price: '1399',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Peak+Design+Everyday+Sling+5L+V2+camera+bag+photography+equipment&sign=89e1b5a7f3abbb2e70df754a43fa9ac3',
    specs: {
      material: '防水尼龙',
      dimensions: '25x12x42cm',
      weight: '550g',
      capacity: '可容纳1台微单相机+2个镜头+配件'
    },
    performance: {
      buildQuality: 9.6,
      portability: 9.9,
      versatility: 9.2,
      comfort: 9.4,
      valueForMoney: 9.1
    },
    pros: ['超轻便携', '快速取物', '防水防尘', '设计时尚'],
    cons: ['容量较小', '价格较高', '肩带较窄'],
    suitableFor: ['街头摄影', '旅行摄影', '日常摄影', 'Vlog拍摄'],
    rating: 9.3,
    reviewCount: 67,
    tags: ['摄影包', '便携', '时尚', '专业'],
    rentalInfo: {
      rentalChannels: ['摄影器材租赁网', '本地摄影工作室', '相机租赁APP'],
      rentalPrice: {
        daily: 39,
        weekly: 199,
        monthly: 549
      },
      availability: true
    },
    secondHandLink: 'https://www.taobao.com/search?q=Peak+Design+Everyday+Sling+5L+V2+二手'
  }
]

// 所有设备数据
export const allEquipments: Equipment[] = [...mockCameras, ...mockLenses, ...mockAccessories]