// components/dashboard/company/StatsCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  changeType = 'increase',
  bgColor = 'bg-[#2563EB]/10',
  iconColor = 'text-[#2563EB]',
  subtitle,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            changeType === 'increase' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#B91C1C]'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-[#64748B] mb-1">{title}</p>
        <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
        {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;