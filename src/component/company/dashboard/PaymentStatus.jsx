// components/dashboard/company/PaymentStatus.jsx
import React from 'react';
import { Clock, AlertCircle, CheckCircle, Phone } from 'lucide-react';

const PaymentStatus = ({ data }) => {
  const payments = data || {
    overdue: [
      { customer: 'Rahul Traders', amount: 25000, days: 5 },
      { customer: 'Patel & Co', amount: 18000, days: 3 },
      { customer: 'Singh Brothers', amount: 32000, days: 8 }
    ],
    dueToday: [
      { customer: 'ABC Pvt Ltd', amount: 10000 },
      { customer: 'Gupta Industries', amount: 15000 }
    ],
    recentPaid: [
      { customer: 'Sharma Enterprises', amount: 45000, time: '2 hours ago' },
      { customer: 'Kumar Agencies', amount: 28000, time: '5 hours ago' }
    ]
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Payment Status</h3>

      {/* Overdue */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          <h4 className="text-sm font-medium text-[#0F172A]">Overdue Invoices</h4>
          <span className="text-xs bg-[#FEE2E2] text-[#B91C1C] px-2 py-0.5 rounded-full">
            {payments.overdue.length}
          </span>
        </div>
        <div className="space-y-2">
          {payments.overdue.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-[#FEF2F2] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{item.customer}</p>
                <p className="text-xs text-[#EF4444]">Overdue by {item.days} days</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-[#0F172A]">₹{item.amount.toLocaleString()}</span>
                <button className="p-1 hover:bg-white rounded">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Due Today */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-5 h-5 text-[#F59E0B]" />
          <h4 className="text-sm font-medium text-[#0F172A]">Due Today</h4>
          <span className="text-xs bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-full">
            {payments.dueToday.length}
          </span>
        </div>
        <div className="space-y-2">
          {payments.dueToday.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-[#FFFBEB] rounded-lg">
              <p className="text-sm font-medium text-[#0F172A]">{item.customer}</p>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-[#0F172A]">₹{item.amount.toLocaleString()}</span>
                <button className="px-2 py-1 text-xs bg-[#2563EB] text-white rounded hover:bg-[#1D4ED8]">
                  Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Paid */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-5 h-5 text-[#22C55E]" />
          <h4 className="text-sm font-medium text-[#0F172A]">Recently Paid</h4>
        </div>
        <div className="space-y-2">
          {payments.recentPaid.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-[#F0FDF4] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{item.customer}</p>
                <p className="text-xs text-[#64748B]">{item.time}</p>
              </div>
              <span className="text-sm font-medium text-[#22C55E]">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <button className="w-full mt-4 text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium text-center">
        View All Invoices →
      </button>
    </div>
  );
};

export default PaymentStatus;