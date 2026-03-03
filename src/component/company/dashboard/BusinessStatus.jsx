// components/dashboard/company/BusinessStatus.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Settings, Mail, CreditCard, FileText } from 'lucide-react';

const BusinessStatus = ({ config }) => {
  const statusItems = [
    {
      key: 'email',
      label: 'Email Configuration',
      status: config?.email ? 'success' : 'warning',
      icon: Mail,
      successMessage: 'SMTP configured',
      warningMessage: 'Email not configured',
      action: 'Configure now'
    },
    {
      key: 'payment',
      label: 'Payment Gateway',
      status: config?.payment ? 'success' : 'error',
      icon: CreditCard,
      successMessage: 'Stripe connected',
      errorMessage: 'Not connected',
      action: 'Connect gateway'
    },
    {
      key: 'gst',
      label: 'GST Details',
      status: config?.gst ? 'success' : 'warning',
      icon: FileText,
      successMessage: 'GST verified',
      warningMessage: 'Details incomplete',
      action: 'Complete now'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#22C55E]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#F59E0B]" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-[#DCFCE7] border-[#22C55E]/20';
      case 'warning': return 'bg-[#FEF3C7] border-[#F59E0B]/20';
      case 'error': return 'bg-[#FEE2E2] border-[#EF4444]/20';
      default: return 'bg-[#F8FAFC] border-[#E2E8F0]';
    }
  };

  const completionPercentage = Object.values(config || {}).filter(Boolean).length * 33.33;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-semibold text-[#0F172A]">Business Status</h3>
        </div>
        <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded-full text-[#334155]">
          {Math.round(completionPercentage)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-2">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const statusConfig = getStatusColor(item.status);
          
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-2 rounded-lg border ${statusConfig}`}
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <Icon className="w-4 h-4 text-[#64748B]" />
                <span className="text-xs font-medium text-[#334155]">{item.label}</span>
              </div>
              
              <button className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium">
                {item.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* Upsell Feature */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <div className="bg-gradient-to-r from-[#2563EB]/5 to-[#1D4ED8]/5 rounded-lg p-2">
          <p className="text-xs text-[#334155]">
            <span className="font-medium">✨ Pro Tip:</span> Complete your setup to enable automated invoicing
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessStatus;