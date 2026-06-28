import React from 'react';
import { motion } from 'framer-motion';

interface RentalInfoProps {
  rentalInfo?: {
    rentalChannels: string[];
    rentalPrice: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    availability: boolean;
  };
  secondHandLink?: string;
}

export const EquipmentRentalInfo: React.FC<RentalInfoProps> = ({ rentalInfo, secondHandLink }) => {
  if (!rentalInfo && !secondHandLink) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
      <h3 className="text-lg font-semibold text-[#F5F7FA] mb-3">租赁与二手信息</h3>
      
      {rentalInfo && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">租赁渠道</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {rentalInfo.rentalChannels.map((channel, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
              >
                {channel}
              </span>
            ))}
          </div>
          
          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">租赁价格</h4>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-[#1E2532] rounded-lg">
              <p className="text-xs text-[#B8C6D8]">日租</p>
              <p className="text-lg font-bold text-[#4A5F8B]">¥{rentalInfo.rentalPrice.daily}</p>
            </div>
            <div className="text-center p-2 bg-[#1E2532] rounded-lg">
              <p className="text-xs text-[#B8C6D8]">周租</p>
              <p className="text-lg font-bold text-[#4A5F8B]">¥{rentalInfo.rentalPrice.weekly}</p>
            </div>
            <div className="text-center p-2 bg-[#1E2532] rounded-lg">
              <p className="text-xs text-[#B8C6D8]">月租</p>
              <p className="text-lg font-bold text-[#4A5F8B]">¥{rentalInfo.rentalPrice.monthly}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${rentalInfo.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-[#B8C6D8]">
              {rentalInfo.availability ? '当前可租' : '暂时缺货'}
            </span>
          </div>
        </div>
      )}
      
      {secondHandLink && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={secondHandLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors border border-[#4A5F8B]"
        >
          <i className="fa-solid fa-recycle mr-1"></i>
          查看二手市场
        </motion.a>
      )}
    </div>
  );
};