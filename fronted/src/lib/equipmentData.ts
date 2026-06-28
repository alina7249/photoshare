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

// 相机数据（已迁移至数据库，请通过 API 获取）
export const mockCameras: Equipment[] = []

// 镜头数据（已迁移至数据库，请通过 API 获取）
export const mockLenses: Equipment[] = []

// 配件数据（已迁移至数据库，请通过 API 获取）
export const mockAccessories: Equipment[] = []

// 所有设备数据（已迁移至数据库，请通过 API 获取）
export const allEquipments: Equipment[] = []