// components/dashboard/company/OperationalStats.jsx
import React from 'react';
import { Users, Truck, FileText, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const OperationalStats = ({ data }) => {
  const stats = [
    {
      title: 'Total Customers',
      value: data.totalCustomers || 0,
      change: '+5',
      icon: Users,
      bgColor: 'bg-[#2563EB]/10',
      iconColor: 'text-[#2563EB]',
      changeType: 'increase'
    },
    {
      title: 'Total Vendors',
      value: data.totalVendors || 0,
      change: '+2',
      icon: Truck,
      bgColor: 'bg-[#8B5CF6]/10',
      iconColor: 'text-[#8B5CF6]',
      changeType: 'increase'
    },
    {
      title: 'Active Invoices',
      value: data.activeInvoices || 0,
      change: '+8',
      icon: FileText,
      bgColor: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]',
      changeType: 'increase'
    },
    {
      title: 'Overdue Invoices',
      value: data.overdueInvoices || 0,
      change: '+3',
      icon: AlertCircle,
      bgColor: 'bg-[#EF4444]/10',
      iconColor: 'text-[#EF4444]',
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default OperationalStats;