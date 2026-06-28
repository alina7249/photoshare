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
  isHot?: boolean
}

// 生成SVG占位图像
export const generatePlaceholderImage = (name: string) => {
  return `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3e%3crect width='400' height='300' fill='%234a5f8b'%3e%3c%2Frect%3e%3ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23ffffff' text-anchor='middle' dy='.3em'%3e${encodeURIComponent(name)}%3c%2Ftext%3e%3c%2fsvg%3e`;
};

// ============================================================
// 注意：以下假数据已迁移至 MySQL 数据库 (backend/sql/mock_data.sql)
// 前端请通过后端 API 获取数据
// ============================================================

// TODO: 相机数据 - 迁移至后端 API 获取
export const mockCameras: Equipment[] = [];

// TODO: 镜头数据 - 迁移至后端 API 获取
export const mockLenses: Equipment[] = [];

// TODO: 配件数据 - 迁移至后端 API 获取
export const mockAccessories: Equipment[] = [];

// TODO: 所有设备数据 - 迁移至后端 API 获取
export const allEquipments: Equipment[] = [];
