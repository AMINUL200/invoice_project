// components/dashboard/company/RecentActivity.jsx
import React from 'react';
import { FileText, DollarSign, ShoppingCart, Plus, MoreHorizontal } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'invoice',
      action: 'created',
      item: 'Invoice #INV102',
      amount: '₹15,000',
      user: 'John',
      time: '5 min ago',
      icon: FileText,
      bgColor: 'bg-[#2563EB]/10',
      iconColor: 'text-[#2563EB]'
    },
    {
      id: 2,
      type: 'payment',
      action: 'received',
      item: 'Payment from Rahul Traders',
      amount: '₹25,000',
      user: 'System',
      time: '25 min ago',
      icon: DollarSign,
      bgColor: 'bg-[#22C55E]/10',
      iconColor: 'text-[#22C55E]'
    },
    {
      id: 3,
      type: 'purchase',
      action: 'added',
      item: 'Purchase Bill #PB2024-01',
      amount: '₹45,000',
      user: 'Priya',
      time: '1 hour ago',
      icon: ShoppingCart,
      bgColor: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]'
    },
    {
      id: 4,
      type: 'credit',
      action: 'issued',
      item: 'Credit Note #CN103',
      amount: '₹5,000',
      user: 'Rahul',
      time: '2 hours ago',
      icon: Plus,
      bgColor: 'bg-[#8B5CF6]/10',
      iconColor: 'text-[#8B5CF6]'
    }
  ];

  const activityList = activities || defaultActivities;

  const getActionText = (activity) => {
    switch(activity.type) {
      case 'invoice': return 'created new invoice';
      case 'payment': return 'received payment';
      case 'purchase': return 'added purchase bill';
      case 'credit': return 'issued credit note';
      default: return activity.action;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Recent Activity</h3>
        <button className="text-sm text-[#64748B] hover:text-[#334155]">View All</button>
      </div>

      <div className="space-y-4">
        {activityList.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 group">
              <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0F172A]">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {getActionText(activity)}{' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-[#64748B]">{activity.time}</span>
                  {activity.amount && (
                    <>
                      <span className="text-xs text-[#CBD5E1]">•</span>
                      <span className="text-xs font-medium text-[#0F172A]">{activity.amount}</span>
                    </>
                  )}
                </div>
              </div>

              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#F1F5F9] rounded">
                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Filter */}
      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-[#F1F5F9] text-[#334155] rounded-full hover:bg-[#E2E8F0]">
            All
          </button>
          <button className="px-3 py-1 text-xs text-[#64748B] hover:bg-[#F1F5F9] rounded-full">
            Invoices
          </button>
          <button className="px-3 py-1 text-xs text-[#64748B] hover:bg-[#F1F5F9] rounded-full">
            Payments
          </button>
          <button className="px-3 py-1 text-xs text-[#64748B] hover:bg-[#F1F5F9] rounded-full">
            Purchases
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;