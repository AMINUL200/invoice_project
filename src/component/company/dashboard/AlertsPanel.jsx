// components/dashboard/company/AlertsPanel.jsx
import React from 'react';
import { Bell, AlertTriangle, CreditCard, Package, Settings, X } from 'lucide-react';

const AlertsPanel = ({ onDismiss }) => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: '3 Invoices Overdue',
      message: 'Total overdue amount: ₹75,000',
      icon: AlertTriangle,
      bgColor: 'bg-[#FEF3C7]',
      textColor: 'text-[#B45309]',
      borderColor: 'border-[#F59E0B]/20'
    },
    {
      id: 2,
      type: 'info',
      title: 'Subscription Renewal',
      message: 'Your plan renews in 7 days',
      icon: CreditCard,
      bgColor: 'bg-[#DBEAFE]',
      textColor: 'text-[#1D4ED8]',
      borderColor: 'border-[#2563EB]/20'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 products running low',
      icon: Package,
      bgColor: 'bg-[#FEF3C7]',
      textColor: 'text-[#B45309]',
      borderColor: 'border-[#F59E0B]/20'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-semibold text-[#0F172A]">Alerts</h3>
        </div>
        <button className="text-sm text-[#64748B] hover:text-[#334155]">Mark all read</button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`relative ${alert.bgColor} ${alert.borderColor} border rounded-lg p-3 group`}
            >
              <button
                onClick={() => onDismiss?.(alert.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-[#64748B]" />
              </button>
              
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${alert.textColor} flex-shrink-0`} />
                <div>
                  <h4 className={`text-sm font-medium ${alert.textColor}`}>{alert.title}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">{alert.message}</p>
                </div>
              </div>
              
              <button className="mt-2 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                Take action →
              </button>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <button className="w-full mt-3 text-center text-sm text-[#64748B] hover:text-[#334155] py-2">
        View all notifications
      </button>
    </div>
  );
};

export default AlertsPanel;