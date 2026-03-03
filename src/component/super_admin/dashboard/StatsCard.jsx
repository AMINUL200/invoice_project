// components/dashboard/StatsCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, changeType = 'increase', bgColor = 'bg-[#2563EB]/10' }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="w-6 h-6 text-[#2563EB]" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'increase' ? 'text-[#22C55E]' : 'text-[#EF4444]'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-[#64748B] text-sm font-medium mb-1">{title}</h3>
      <p className="text-[#0F172A] text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;