// components/dashboard/company/PurchaseOverview.jsx
import React from 'react';
import { ShoppingCart, Clock, AlertCircle, ChevronRight } from 'lucide-react';

const PurchaseOverview = ({ data }) => {
  const purchaseData = data || {
    totalMonth: 185000,
    pendingPayments: 65000,
    recentBills: [
      { vendor: 'Tech Supplies Co', amount: 45000, date: '2024-01-15', status: 'pending' },
      { vendor: 'Office Mart', amount: 28000, date: '2024-01-14', status: 'paid' },
      { vendor: 'Digital Solutions', amount: 32000, date: '2024-01-12', status: 'pending' }
    ]
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Purchase Overview</h3>
        <button className="text-sm text-[#2563EB] hover:text-[#1D4ED8]">View All</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#F8FAFC] rounded-lg p-3">
          <p className="text-xs text-[#64748B] mb-1">This Month</p>
          <p className="text-lg font-bold text-[#0F172A]">₹{purchaseData.totalMonth.toLocaleString()}</p>
        </div>
        <div className="bg-[#FEF2F2] rounded-lg p-3">
          <p className="text-xs text-[#64748B] mb-1">Pending</p>
          <p className="text-lg font-bold text-[#EF4444]">₹{purchaseData.pendingPayments.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Purchase Bills */}
      <h4 className="text-sm font-medium text-[#0F172A] mb-3">Recent Bills</h4>
      <div className="space-y-3">
        {purchaseData.recentBills.map((bill, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-[#F1F5F9] rounded-lg">
                <ShoppingCart className="w-4 h-4 text-[#64748B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{bill.vendor}</p>
                <p className="text-xs text-[#64748B]">{bill.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#0F172A]">₹{bill.amount.toLocaleString()}</p>
              <span className={`text-xs ${
                bill.status === 'paid' ? 'text-[#22C55E]' : 'text-[#F59E0B]'
              }`}>
                {bill.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Link */}
      <button className="w-full mt-4 flex items-center justify-center space-x-1 text-sm text-[#64748B] hover:text-[#334155] transition-colors">
        <span>View all purchases</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PurchaseOverview;