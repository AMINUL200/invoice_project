// components/dashboard/company/FinancialStats.jsx
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ShoppingCart } from 'lucide-react';
import StatsCard from './StatsCard';

const FinancialStats = ({ data }) => {
  const stats = [
    {
      title: 'Total Sales',
      value: `₹${data.totalSales?.toLocaleString() || '0'}`,
      change: '+12.5%',
      icon: TrendingUp,
      bgColor: 'bg-[#2563EB]/10',
      iconColor: 'text-[#2563EB]',
      changeType: 'increase'
    },
    {
      title: 'Amount Received',
      value: `₹${data.amountReceived?.toLocaleString() || '0'}`,
      change: '+8.2%',
      icon: DollarSign,
      bgColor: 'bg-[#22C55E]/10',
      iconColor: 'text-[#22C55E]',
      changeType: 'increase'
    },
    {
      title: 'Outstanding',
      value: `₹${data.outstanding?.toLocaleString() || '0'}`,
      change: '+5.3%',
      icon: CreditCard,
      bgColor: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]',
      changeType: 'increase'
    },
    {
      title: 'Purchase Expense',
      value: `₹${data.purchaseExpense?.toLocaleString() || '0'}`,
      change: '-2.1%',
      icon: ShoppingCart,
      bgColor: 'bg-[#EF4444]/10',
      iconColor: 'text-[#EF4444]',
      changeType: 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default FinancialStats;