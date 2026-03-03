// components/companies/CompanyStats.jsx
import React from 'react';
import { Building2, Users, DollarSign, Activity, CheckCircle, AlertCircle, PauseCircle } from 'lucide-react';

const CompanyStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Companies',
      value: stats.total,
      icon: Building2,
      color: 'bg-[#2563EB]/10',
      textColor: 'text-[#2563EB]'
    },
    {
      title: 'Active Companies',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-[#22C55E]/10',
      textColor: 'text-[#22C55E]'
    },
    {
      title: 'Suspended',
      value: stats.suspended,
      icon: AlertCircle,
      color: 'bg-[#F59E0B]/10',
      textColor: 'text-[#F59E0B]'
    },
    {
      title: 'Inactive',
      value: stats.inactive,
      icon: PauseCircle,
      color: 'bg-[#64748B]/10',
      textColor: 'text-[#64748B]'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-[#EF4444]/10',
      textColor: 'text-[#EF4444]'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-[#F59E0B]/10',
      textColor: 'text-[#F59E0B]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
            <p className="text-sm text-[#64748B]">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyStats;