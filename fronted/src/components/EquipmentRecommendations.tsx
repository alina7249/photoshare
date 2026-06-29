import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Equipment } from '../lib/equipmentData';

interface EquipmentRecommendationsProps {
  currentEquipment: Equipment;
  recommendedEquipment: Equipment[];
}

export const EquipmentRecommendations: React.FC<EquipmentRecommendationsProps> = ({ 
  currentEquipment, 
  recommendedEquipment 
}) => {
  return (
    <div className="mt-6 p-4 bg-bg-card rounded-lg border border-accent">
      <h3 className="text-lg font-semibold text-text-primary mb-4">搭配推荐</h3>
      
      <p className="text-sm text-text-muted mb-3">
        根据{currentEquipment.name}，我们为您推荐以下搭配器材：
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedEquipment.map((equipment) => (
          <motion.div
            key={equipment.id}
            whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
            className="bg-bg-deep rounded-lg overflow-hidden border border-accent transition-all"
          >
            <div className="flex">
              <div className="w-24 h-24">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex-1">
                <h4 className="font-medium text-text-primary mb-1 line-clamp-1">{equipment.name}</h4>
                <p className="text-xs text-accent-hover mb-2">{equipment.brand} | {equipment.type}</p>
                <p className="text-sm font-bold text-accent">¥{parseInt(equipment.price).toLocaleString()}</p>
                <Link
                  to={`/equipment/${equipment.id}`}
                  className="inline-block mt-2 px-3 py-1 text-xs bg-accent text-text-primary rounded-lg hover:bg-accent-hover transition-colors"
                >
                  查看详情
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 bg-bg-deep p-3 rounded-lg border border-accent">
        <h4 className="text-sm font-medium text-text-primary mb-2">搭配理由</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
          <li>与{currentEquipment.name}在性能和风格上高度匹配</li>
          <li>能够扩展您的创作可能性，适应更多拍摄场景</li>
          <li>在用户评价和专业测试中表现优异</li>
          <li>具有良好的性价比和可靠性</li>
        </ul>
      </div>
    </div>
  );
};